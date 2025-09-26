import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { PlanningSlot, Task, TaskId } from '@tomlist/domain';
import { ApiClientService } from '../../../core/services/api-client.service';
import { NoteStore } from '../../notes/state/note.store';

export interface PlanDrawerState {
  taskId: TaskId;
  options: PlanningSlot[];
  isLoading: boolean;
}

export type PlanDrawerView = PlanDrawerState | null;

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly api = inject(ApiClientService);
  private readonly noteStore = inject(NoteStore);

  private readonly tasksSignal = signal<Task[]>([]);
  private readonly loading = signal(false);
  private readonly planSignal = signal<PlanDrawerView>(null);

  readonly tasks: Signal<Task[]> = this.tasksSignal.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly planDrawer = this.planSignal.asReadonly();
  readonly completed = computed(() =>
    this.tasks().filter((task) => task.done)
  );

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const tasks = await this.api.getTasks();
      this.tasksSignal.set(tasks);
    } finally {
      this.loading.set(false);
    }
  }

  async add(title: string): Promise<void> {
    if (!title.trim()) {
      return;
    }
    const created = await this.api.createTask({ title: title.trim() });
    this.tasksSignal.update((tasks) => [created, ...tasks]);
  }

  async toggleDone(id: TaskId): Promise<void> {
    const task = this.tasks().find((item) => item.id === id);
    if (!task) {
      return;
    }
    const updated = await this.api.updateTask(id, { done: !task.done });
    this.tasksSignal.update((tasks) =>
      tasks.map((item) => (item.id === id ? updated : item))
    );
  }

  async togglePinned(id: TaskId): Promise<void> {
    const task = this.tasks().find((item) => item.id === id);
    if (!task) {
      return;
    }
    const updated = await this.api.updateTask(id, { pinned: !task.pinned });
    this.tasksSignal.update((tasks) =>
      tasks.map((item) => (item.id === id ? updated : item))
    );
  }

  async remove(id: TaskId): Promise<void> {
    await this.api.deleteTask(id);
    this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  async reorder(order: TaskId[]): Promise<void> {
    if (order.length <= 1) {
      return;
    }
    const tasks = this.tasks();
    const active = tasks.filter((task) => !task.done);
    const done = tasks.filter((task) => task.done);

    const orderSet = new Set(order);
    const activeMap = new Map(active.map((task) => [task.id, task]));

    const orderedActive: Task[] = [];
    for (const id of order) {
      const task = activeMap.get(id);
      if (task) {
        orderedActive.push(task);
        activeMap.delete(id);
      }
    }

    for (const task of active) {
      if (!orderSet.has(task.id)) {
        orderedActive.push(task);
      }
    }

    const next = [...orderedActive, ...done];
    this.tasksSignal.set(next);
    await this.api.reorderTasks(next.map((task) => task.id));
  }

  async decompose(id: TaskId): Promise<void> {
    await this.api.decomposeTask(id);
    this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
    await this.noteStore.refresh();
  }

  async openPlanify(id: TaskId): Promise<void> {
    this.planSignal.set({ taskId: id, options: [], isLoading: true });
    try {
      const response = await this.api.suggestPlanning(id);
      this.planSignal.set({
        taskId: id,
        options: response.options,
        isLoading: false,
      });
    } catch (error) {
      this.planSignal.set({ taskId: id, options: [], isLoading: false });
    }
  }

  closePlanify(): void {
    this.planSignal.set(null);
  }

  async exportIcs(option: PlanningSlot): Promise<void> {
    const plan = this.planSignal();
    if (!plan) {
      return;
    }
    const task = this.tasks().find((item) => item.id === plan.taskId);
    if (!task) {
      return;
    }
    const payload = {
      title: task.title,
      start: option.start,
      end: option.end,
    };
    const ics = await this.api.createIcs(payload);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.slugify(task.title)}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private slugify(value: string): string {
    const base = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return base || 'tache';
  }
}
