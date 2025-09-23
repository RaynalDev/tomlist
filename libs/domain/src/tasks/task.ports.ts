import { Task, TaskId, CreateTaskPayload, UpdateTaskPayload } from './task';
import { UserId } from '../common/types';

export interface TaskRepository {
  list(userId: UserId): Promise<Task[]>;
  create(payload: CreateTaskPayload): Promise<Task>;
  update(id: TaskId, patch: UpdateTaskPayload): Promise<Task>;
  delete(id: TaskId): Promise<void>;
  deleteMany(ids: TaskId[]): Promise<void>;
}

export interface TaskDecomposer {
  decompose(task: Task): Promise<{ noteId: string }>;
}

export interface TaskScheduler {
  openPlan(taskId: TaskId): Promise<void>;
}
