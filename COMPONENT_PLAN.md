# COMPONENT_PLAN.md — Plan des composants Angular

## Pages
- `TaskListPage` (`/tasks`)
  - **Rôle** : afficher la liste des tâches, input rapide, gérer popover & drawer.
  - **UI** : list items, bottom nav.
  - **Dépendances** : `TaskStore`, `PlanifyDrawer`, `TaskMenuPopover`.

- `NoteGridPage` (`/notes`)
  - **Rôle** : afficher notes & listes en cartes, input rapide + toggle « note/liste ».
  - **Dépendances** : `NoteStore`.

## Composants
- `TaskItem`
  - `@Input() task: Task`
  - `@Output() menu` (ouvre popover) / `@Output() toggle`
- `TaskMenuPopover`
  - `@Input() task: Task` ; `@Output()` events : `planify`, `decompose`, `remove`
- `PlanifyDrawer`
  - `@Input() task: Task | null`
  - `@Input() options: SlotOption[]` (MVP mockés)
  - `@Output() addToCalendar(ics: Blob | string)`
- `NoteCard` (type note)
  - `@Input() note: Note`
- `ListCard` (type list)
  - `@Input() note: Note`
  - `toggleItem(noteId, itemId)` via `NoteStore`
- `BottomNav`
  - boutons `/tasks` et `/notes`

## Services
- `ApiClient`
  - `getTasks() / createTask() / patchTask() / deleteTask()`
  - `decomposeTask(id)`
  - `getNotes() / createNote()/ addListItem() / toggleItem()`
- `CalendarClient` (MVP mock)
  - `suggestSlots({ taskId, durationMin? })`
- `IcsService`
  - `makeEvent({ title, start, end }): Blob|string`

## Stores (Signals)
- `TaskStore`
  - state : `tasks: Signal<Task[]>`, `drawerTaskId: Signal<string|null>`
  - actions : `add`, `toggleDone`, `remove`, `decompose`, `openPlanify`, `closePlanify`
- `NoteStore`
  - state : `notes: Signal<Note[]>`
  - actions : `addNote`, `addList`, `toggleItem`

## Types
```ts
export type SlotOption = { start: string; end: string; score: number };
```

## Flux clés
- **Planifier** : `TaskMenuPopover.planify` → `TaskStore.openPlanify(id)` → charge options via `CalendarClient` → `PlanifyDrawer` → `IcsService.makeEvent()` → download.
- **Décomposer** : `TaskMenuPopover.decompose` → `TaskStore.decompose(id)` → crée une `Note(type=list)` via `NoteStore` → route `/notes`.

