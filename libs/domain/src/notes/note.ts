import { Id, ISODateTime, UserId } from '../common/types';

export type NoteId = Id;
export type ListItemId = Id;

export type NoteType = 'note' | 'list';

export interface NoteBase {
  id: NoteId;
  userId: UserId;
  title: string;
  type: NoteType;
  createdAt: ISODateTime;
}

export interface TextNote extends NoteBase {
  type: 'note';
  content: string;
}

export interface ListItem {
  id: ListItemId;
  label: string;
  checked: boolean;
}

export interface ListNote extends NoteBase {
  type: 'list';
  items: ListItem[];
}

export type Note = TextNote | ListNote;

export interface CreateNotePayload {
  userId: UserId;
  type: NoteType;
  title: string;
}

export interface CreateListItemPayload {
  label: string;
}
