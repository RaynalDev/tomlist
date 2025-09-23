import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteStore } from '../state/note.store';
import { NoteCardComponent } from '../components/note-card.component';

@Component({
  selector: 'app-note-grid-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteCardComponent],
  templateUrl: './note-grid.page.html',
  styleUrl: './note-grid.page.scss',
})
export class NoteGridPage {
  private readonly store = inject(NoteStore);

  readonly notes = this.store.notes;
  readonly isLoading = this.store.isLoading;

  readonly mode = signal<'note' | 'list'>('note');
  private readonly newTitleSignal = signal('');

  readonly hasNotes = computed(() => this.notes().length > 0);

  async add(): Promise<void> {
    const title = this.newTitle.trim();
    if (!title) {
      return;
    }

    if (this.mode() === 'note') {
      await this.store.addNote(title);
    } else {
      await this.store.addList(title);
    }

    this.newTitle = '';
  }

  switchMode(mode: 'note' | 'list'): void {
    this.mode.set(mode);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  addItem(noteId: string, label: string): void {
    void this.store.addListItem(noteId, label);
  }

  toggleItem(noteId: string, itemId: string, checked: boolean): void {
    void this.store.toggleItem(noteId, itemId, checked);
  }

  get newTitle(): string {
    return this.newTitleSignal();
  }

  set newTitle(value: string) {
    this.newTitleSignal.set(value);
  }
}
