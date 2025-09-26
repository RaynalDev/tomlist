import { Injectable, Signal, inject, signal } from '@angular/core';
import { Note } from '@tomlist/domain';
import { ApiClientService } from '../../../core/services/api-client.service';

@Injectable({ providedIn: 'root' })
export class NoteStore {
  private readonly api = inject(ApiClientService);
  private readonly notesSignal = signal<Note[]>([]);
  private readonly loading = signal(false);

  readonly notes: Signal<Note[]> = this.notesSignal.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const notes = await this.api.getNotes();
      this.notesSignal.set(notes);
    } finally {
      this.loading.set(false);
    }
  }

  async addNote(title: string): Promise<void> {
    const created = await this.api.createNote({ type: 'note', title });
    this.notesSignal.update((notes) => [created, ...notes]);
  }

  async addList(title: string): Promise<void> {
    const created = await this.api.createNote({ type: 'list', title });
    this.notesSignal.update((notes) => [created, ...notes]);
  }

  async addListItem(noteId: string, label: string): Promise<void> {
    if (!label.trim()) {
      return;
    }
    const item = await this.api.createListItem(noteId, label.trim());
    this.notesSignal.update((notes) =>
      notes.map((note) =>
        note.id === noteId && note.type === 'list'
          ? { ...note, items: [item, ...note.items] }
          : note
      )
    );
  }

  async toggleItem(noteId: string, itemId: string, nextChecked: boolean): Promise<void> {
    const updated = await this.api.toggleListItem(noteId, itemId, nextChecked);
    this.notesSignal.update((notes) =>
      notes.map((note) => {
        if (note.id !== noteId || note.type !== 'list') {
          return note;
        }
        return {
          ...note,
          items: note.items.map((item) =>
            item.id === updated.id ? { ...item, checked: updated.checked } : item
          ),
        };
      })
    );
  }

  async reorder(order: string[]): Promise<void> {
    if (order.length <= 1) {
      return;
    }
    const notes = this.notes();
    const orderSet = new Set(order);
    const lookup = new Map(notes.map((note) => [note.id, note]));

    const ordered: Note[] = [];
    for (const id of order) {
      const note = lookup.get(id);
      if (note) {
        ordered.push(note);
        lookup.delete(id);
      }
    }

    for (const note of notes) {
      if (!orderSet.has(note.id)) {
        ordered.push(note);
      }
    }

    this.notesSignal.set(ordered);
    await this.api.reorderNotes(ordered.map((note) => note.id));
  }

}
