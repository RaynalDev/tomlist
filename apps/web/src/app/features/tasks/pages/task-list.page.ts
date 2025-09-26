import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskStore } from '../state/task.store';
import { TaskItemComponent } from '../components/task-item.component';
import { PlanifyDrawerComponent } from '../drawers/planify-drawer.component';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TaskItemComponent, PlanifyDrawerComponent],
  templateUrl: './task-list.page.html',
  styleUrl: './task-list.page.scss',
})
export class TaskListPage {
  private readonly store = inject(TaskStore);

  readonly tasks = this.store.tasks;
  readonly completed = this.store.completed;
  readonly planDrawer = this.store.planDrawer;
  readonly isLoading = this.store.isLoading;
  readonly todo = computed(() => this.tasks().filter((task) => !task.done));

  private readonly newTaskSignal = signal('');

  get newTask(): string {
    return this.newTaskSignal();
  }

  set newTask(value: string) {
    this.newTaskSignal.set(value);
  }


  async onSubmit(): Promise<void> {
    const title = this.newTask.trim();
    if (!title) {
      return;
    }
    await this.store.add(title);
    this.newTask = '';
  }

  async onDrop(event: CdkDragDrop<unknown>): Promise<void> {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const current = [...this.todo()];
    moveItemInArray(current, event.previousIndex, event.currentIndex);
    await this.store.reorder(current.map((task) => task.id));
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  toggleDone(id: string): void {
    void this.store.toggleDone(id);
  }

  togglePin(id: string): void {
    void this.store.togglePinned(id);
  }

  remove(id: string): void {
    void this.store.remove(id);
  }

  decompose(id: string): void {
    void this.store.decompose(id);
  }

  openPlanify(id: string): void {
    void this.store.openPlanify(id);
  }

  exportIcs(option: { start: string; end: string; score: number }): void {
    void this.store.exportIcs(option);
  }

  closePlanify(): void {
    this.store.closePlanify();
  }
}
