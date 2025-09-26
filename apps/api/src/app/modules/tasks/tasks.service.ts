import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskPayload,
  Task,
  TaskId,
  UpdateTaskPayload,
} from '@tomlist/domain';
import { InMemoryDatabase } from '../../database/in-memory.database';

@Injectable()
export class TasksService {
  constructor(private readonly db: InMemoryDatabase) {}

  list(): Task[] {
    return this.db.listTasks();
  }

  create(payload: CreateTaskPayload): Task {
    return this.db.createTask(payload);
  }

  update(id: TaskId, patch: UpdateTaskPayload): Task {
    try {
      return this.db.updateTask(id, patch);
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  remove(id: TaskId): void {
    this.db.deleteTask(id);
  }

  decompose(id: TaskId): { noteId: string } {
    const task = this.db.getTask(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const note = this.db.createNote({
      title: task.title,
      type: 'list',
      userId: task.userId,
    });

    const itemsSource = task.note
      ? task.note
          .split('\n')
          .map((chunk) => chunk.trim())
          .filter(Boolean)
      : [`${task.title}`];

    itemsSource.forEach((label) => this.db.createListItem(note.id, label));
    this.db.deleteTask(id);
    return { noteId: note.id };
  }

  reorder(order: TaskId[]): Task[] {
    return this.db.reorderTasks(order);
  }
}
