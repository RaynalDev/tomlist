import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ListItem,
  Note,
  PlanningSuggestionResponse,
  Task,
  TaskId,
  UpdateTaskPayload,
} from '@tomlist/domain';
import { Observable, firstValueFrom } from 'rxjs';

interface DecomposeResponse {
  noteId: string;
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getTasks(): Promise<Task[]> {
    return firstValueFrom(this.http.get<Task[]>(`${this.baseUrl}/tasks`));
  }

  createTask(payload: { title: string }): Promise<Task> {
    return firstValueFrom(this.http.post<Task>(`${this.baseUrl}/tasks`, payload));
  }

  updateTask(id: TaskId, patch: UpdateTaskPayload): Promise<Task> {
    return firstValueFrom(
      this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, patch)
    );
  }

  deleteTask(id: TaskId): Promise<void> {
    return firstValueFrom(
      this.http.delete(`${this.baseUrl}/tasks/${id}`)
    ).then(() => undefined);
  }

  decomposeTask(id: TaskId): Promise<DecomposeResponse> {
    return firstValueFrom(
      this.http.post<DecomposeResponse>(`${this.baseUrl}/tasks/${id}/decompose`, {})
    );
  }

  getNotes(): Promise<Note[]> {
    return firstValueFrom(this.http.get<Note[]>(`${this.baseUrl}/notes`));
  }

  createNote(payload: { type: 'note' | 'list'; title: string }): Promise<Note> {
    return firstValueFrom(this.http.post<Note>(`${this.baseUrl}/notes`, payload));
  }

  createListItem(noteId: string, label: string): Promise<ListItem> {
    return firstValueFrom(
      this.http.post<ListItem>(`${this.baseUrl}/notes/${noteId}/items`, {
        label,
      })
    );
  }

  toggleListItem(
    noteId: string,
    itemId: string,
    checked: boolean
  ): Promise<ListItem> {
    return firstValueFrom(
      this.http.patch<ListItem>(
        `${this.baseUrl}/notes/${noteId}/items/${itemId}`,
        {
          checked,
        }
      )
    );
  }

  suggestPlanning(taskId: string, durationMin?: number) {
    return firstValueFrom(
      this.http.post<PlanningSuggestionResponse>(
        `${this.baseUrl}/planning/suggest`,
        { taskId, durationMin }
      )
    );
  }

  createIcs(body: { title: string; start: string; end: string }): Promise<string> {
    const request = this.http.post(`${this.baseUrl}/planning/ics`, body, {
      responseType: 'text',
    }) as unknown as Observable<string>;

    return firstValueFrom(request);
  }
}
