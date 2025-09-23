import { Route } from '@angular/router';
import { NoteGridPage } from './features/notes/pages/note-grid.page';
import { TaskListPage } from './features/tasks/pages/task-list.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    component: TaskListPage,
  },
  {
    path: 'notes',
    component: NoteGridPage,
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
