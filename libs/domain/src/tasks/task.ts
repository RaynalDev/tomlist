import { Id, ISODateTime, UserId } from '../common/types';

export type TaskId = Id;

export interface Task {
  id: TaskId;
  userId: UserId;
  title: string;
  done: boolean;
  pinned: boolean;
  note?: string;
  createdAt: ISODateTime;
}

export interface CreateTaskPayload {
  userId: UserId;
  title: string;
}

export interface UpdateTaskPayload {
  title?: string;
  done?: boolean;
  pinned?: boolean;
  note?: string | null;
}
