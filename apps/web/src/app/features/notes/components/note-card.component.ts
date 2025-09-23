import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListItem, Note } from '@tomlist/domain';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
})
export class NoteCardComponent {
  @Input({ required: true }) note!: Note;

  @Output() addItem = new EventEmitter<string>();
  @Output() toggleItem = new EventEmitter<{ item: ListItem; checked: boolean }>();

  private readonly newItemSignal = signal('');

  addListItem(): void {
    const label = this.newItem.trim();
    if (!label) {
      return;
    }
    this.addItem.emit(label);
    this.newItem = '';
  }

  onToggle(item: ListItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.toggleItem.emit({ item, checked: target.checked });
  }

  get newItem(): string {
    return this.newItemSignal();
  }

  set newItem(value: string) {
    this.newItemSignal.set(value);
  }
}
