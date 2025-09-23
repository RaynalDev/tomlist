import { Note, NoteId, CreateNotePayload, ListItem, ListItemId, CreateListItemPayload } from './note';
import { UserId } from '../common/types';

export interface NoteRepository {
  list(userId: UserId): Promise<Note[]>;
  create(payload: CreateNotePayload): Promise<Note>;
  createListItem(noteId: NoteId, payload: CreateListItemPayload): Promise<ListItem>;
  toggleItem(noteId: NoteId, itemId: ListItemId): Promise<ListItem>;
}
