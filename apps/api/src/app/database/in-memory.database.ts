import { Injectable } from '@nestjs/common';
import {
  CreateNotePayload,
  CreateTaskPayload,
  ListItem,
  ListItemId,
  ListNote,
  Note,
  NoteId,
  Task,
  TaskId,
  UpdateTaskPayload,
} from '@tomlist/domain';
import { randomUUID } from 'crypto';

interface SeedData {
  tasks: Task[];
  notes: Note[];
}

@Injectable()
export class InMemoryDatabase {
  private readonly userId = 'demo-user';
  private readonly data: SeedData;

  constructor() {
    this.data = this.buildSeed();
  }

  getUserId(): string {
    return this.userId;
  }

  listTasks(): Task[] {
    return [...this.data.tasks];
  }

  getTask(id: TaskId): Task | undefined {
    return this.data.tasks.find((task) => task.id === id);
  }

  createTask(payload: CreateTaskPayload): Task {
    const task: Task = {
      id: this.nextId(),
      userId: payload.userId,
      title: payload.title,
      done: false,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(task);
    return task;
  }

  updateTask(id: TaskId, patch: UpdateTaskPayload): Task {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    const current = this.data.tasks[index];
    const next: Task = {
      ...current,
      ...patch,
      note: patch.note === undefined ? current.note : patch.note ?? undefined,
    };
    this.data.tasks[index] = next;
    return next;
  }

  deleteTask(id: TaskId): void {
    this.data.tasks = this.data.tasks.filter((task) => task.id !== id);
  }

  deleteTasks(ids: TaskId[]): void {
    const set = new Set(ids);
    this.data.tasks = this.data.tasks.filter((task) => !set.has(task.id));
  }

  reorderTasks(order: TaskId[]): Task[] {
    const current = new Map(this.data.tasks.map((task) => [task.id, task]));
    const seen = new Set<TaskId>();
    const next: Task[] = [];

    for (const id of order) {
      const task = current.get(id);
      if (!task || seen.has(id)) {
        continue;
      }
      next.push(task);
      seen.add(id);
    }

    for (const task of this.data.tasks) {
      if (seen.has(task.id)) {
        continue;
      }
      next.push(task);
    }

    this.data.tasks = next;
    return this.listTasks();
  }

  listNotes(): Note[] {
    return [...this.data.notes];
  }

  createNote(payload: CreateNotePayload): Note {
    const base = {
      id: this.nextId(),
      userId: payload.userId,
      title: payload.title,
      type: payload.type,
      createdAt: new Date().toISOString(),
    } as const;

    const note: Note =
      payload.type === 'note'
        ? { ...base, type: 'note', content: '' }
        : { ...base, type: 'list', items: [] };

    this.data.notes.unshift(note);
    return note;
  }

  getNote(id: NoteId): Note | undefined {
    return this.data.notes.find((note) => note.id === id);
  }

  updateNote(note: Note): Note {
    const index = this.data.notes.findIndex((n) => n.id === note.id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    this.data.notes[index] = note;
    return note;
  }

  createListItem(noteId: NoteId, label: string): ListItem {
    const note = this.getListNote(noteId);
    const item: ListItem = { id: this.nextId(), label, checked: false };
    note.items = [item, ...note.items];
    this.updateNote(note);
    return item;
  }

  toggleListItem(noteId: NoteId, itemId: ListItemId): ListItem {
    const note = this.getListNote(noteId);
    const index = note.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error('List item not found');
    }
    const current = note.items[index];
    const next = { ...current, checked: !current.checked };
    note.items[index] = next;
    this.updateNote(note);
    return next;
  }

  setListItemChecked(
    noteId: NoteId,
    itemId: ListItemId,
    checked: boolean
  ): ListItem {
    const note = this.getListNote(noteId);
    const index = note.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error('List item not found');
    }
    const current = note.items[index];
    const next = { ...current, checked };
    note.items[index] = next;
    this.updateNote(note);
    return next;
  }

  reorderNotes(order: NoteId[]): Note[] {
    const current = new Map(this.data.notes.map((note) => [note.id, note]));
    const seen = new Set<NoteId>();
    const next: Note[] = [];

    for (const id of order) {
      const note = current.get(id);
      if (!note || seen.has(id)) {
        continue;
      }
      next.push(note);
      seen.add(id);
    }

    for (const note of this.data.notes) {
      if (seen.has(note.id)) {
        continue;
      }
      next.push(note);
    }

    this.data.notes = next;
    return this.listNotes();
  }

  private getListNote(noteId: NoteId): ListNote {
    const note = this.getNote(noteId);
    if (!note || note.type !== 'list') {
      throw new Error('List note not found');
    }
    return { ...note, items: [...note.items] };
  }

  private nextId(): string {
    return randomUUID();
  }

  private buildSeed(): SeedData {
    const now = new Date();
    const timestamp = () => new Date(now.getTime() - Math.random() * 86400000).toISOString();

    const tasks: Task[] = [
      {
        id: this.nextId(),
        userId: this.userId,
        title: 'Lire le brief du projet',
        done: false,
        pinned: true,
        createdAt: timestamp(),
      },
      {
        id: this.nextId(),
        userId: this.userId,
        title: 'Préparer la réunion client',
        done: false,
        pinned: false,
        createdAt: timestamp(),
      },
      {
        id: this.nextId(),
        userId: this.userId,
        title: 'Réviser les specs Tomlist',
        done: true,
        pinned: false,
        createdAt: timestamp(),
      },
    ];

    const notes: Note[] = [
      {
        id: this.nextId(),
        userId: this.userId,
        type: 'note',
        title: 'Idées de positionnement',
        content: 'MVP = focus product design + rapidité. Mentionner .ics.',
        createdAt: timestamp(),
      },
      {
        id: this.nextId(),
        userId: this.userId,
        type: 'list',
        title: 'Courses',
        items: [
          { id: this.nextId(), label: 'Café en grain', checked: true },
          { id: this.nextId(), label: 'Lait d\'avoine', checked: false },
          { id: this.nextId(), label: 'Tomates cerises', checked: false },
        ],
        createdAt: timestamp(),
      },
    ];

    return { tasks, notes };
  }
}
