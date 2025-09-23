import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabase } from '../../database/in-memory.database';
import { CreateNotePayload, Note, NoteId } from '@tomlist/domain';

@Injectable()
export class NotesService {
  constructor(private readonly db: InMemoryDatabase) {}

  list(): Note[] {
    return this.db.listNotes();
  }

  create(payload: CreateNotePayload): Note {
    return this.db.createNote(payload);
  }

  createItem(noteId: NoteId, label: string) {
    try {
      return this.db.createListItem(noteId, label);
    } catch (error) {
      throw new NotFoundException('List note not found');
    }
  }

  toggleItem(noteId: NoteId, itemId: string, checked: boolean) {
    try {
      return this.db.setListItemChecked(noteId, itemId, checked);
    } catch (error) {
      throw new NotFoundException('List item not found');
    }
  }
}
