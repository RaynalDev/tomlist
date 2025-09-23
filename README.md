# README.md — Architecture & Démarrage

> Ce README est prêt à être committé à la racine du repo. Il décrit l’architecture cible (Nx monorepo), les commandes de démarrage, l’organisation des dossiers et les contrats d’API du MVP.

## Sommaire
1. Vision & portée (MVP)
2. Architecture globale (Clean/Hexa légère)
3. Organisation du repo (Nx)
4. Front (Angular) – structure & state
5. API (NestJS + Prisma) – structure & schéma
6. Contrats d’API (OpenAPI minimal)
7. Planification (.ics) – MVP
8. Roadmap technique
9. Scripts / Commandes

---

## 1) Vision & portée (MVP)
- 2 écrans : **Tâches** et **Listes/Notes** (Keep-like).
- Menu contextuel d’une tâche : **Planifier**, **Décomposer**, **Supprimer**.
- **Planifier** ouvre un **drawer** avec 2–3 créneaux proposés (mock MVP) + export **.ics**.
- **Décomposer** transforme une tâche en **liste** (sous-tâches) et bascule vers l’onglet *Listes/Notes*.

## 2) Architecture globale
Style **Clean/Hexagonal léger** :
- **domain** : entités & ports (types partagés)
- **application** : use-cases (logique pure)
- **infrastructure** : adaptateurs (Prisma, Google Calendar plus tard, Ics exporter)
- **presentation** : Angular (UI + state stores)

## 3) Organisation du repo (Nx)
```
tomlist/
  apps/
    web/           # Angular 18 + Tailwind
    api/           # NestJS + Prisma + OpenAPI
  libs/
    domain/        # Entités & ports partagés (TS pur)
      src/
        tasks/
        notes/
        planning/
        common/
    shared/
      ui/          # Composants UI transverses (si besoin)
      utils/       # Helpers purs
  tools/           # (optionnel) scripts devops
```

## 4) Front (Angular) – structure & state
**Routing** : `/tasks` et `/notes` (bottom nav).

**Arborescence feature-first** :
```
apps/web/src/app/
  core/
    services/
      api-client.ts
      calendar-client.ts   # mock MVP
      ics.service.ts       # génération .ics côté front (MVP)
  features/
    tasks/
      pages/task-list.page.ts
      components/task-item.component.ts
      components/task-menu-popover.component.ts
      drawers/planify-drawer.component.ts
      state/task.store.ts  # Signals
    notes/
      pages/note-grid.page.ts
      components/note-card.component.ts
      components/list-card.component.ts
      state/note.store.ts  # Signals
  shared/
    ui/ (boutons, inputs, bottom-nav, etc.)
  app.routes.ts
  app.component.ts
```

**Stores (Signals) – contrats** :
```ts
// task.store.ts
export interface Task { id: string; title: string; done: boolean; pinned: boolean; note?: string }
export class TaskStore {
  readonly tasks = signal<Task[]>([]);
  add(title: string): void {}
  toggleDone(id: string): void {}
  remove(id: string): void {}
  decompose(id: string): void {}        // crée une List dans NoteStore
  openPlanify(id: string): void {}       // UI side-effect: ouvre drawer
}

// note.store.ts
export type Note = { id: string; type: 'note'|'list'; title: string; content?: string; items?: ListItem[] };
export type ListItem = { id: string; label: string; checked: boolean };
export class NoteStore {
  readonly notes = signal<Note[]>([]);
  addNote(title: string): void {}
  addList(title: string): void {}
  toggleItem(noteId: string, itemId: string): void {}
}
```

**Principes UX** : input rapide en haut, menu popover/long-press, drawer planifier.

## 5) API (NestJS + Prisma) – structure & schéma
**Modules** : `tasks`, `notes`, `planning`.

```
apps/api/src/
  main.ts
  app.module.ts
  modules/
    tasks/
      tasks.controller.ts
      tasks.service.ts        # orchestre use-cases
      prisma-task.repo.ts     # adapter infra
    notes/
      notes.controller.ts
      notes.service.ts
      prisma-note.repo.ts
    planning/
      planning.controller.ts
      suggest-slots.usecase.ts
      ics-exporter.node.ts
      calendar-reader.mock.ts # MVP
  prisma/
    schema.prisma
```

**Prisma (MVP)** :
```prisma
model User { id String @id @default(cuid()) email String @unique prefsJson Json? tasks Task[] notes Note[] }
model Task { id String @id @default(cuid()) userId String title String done Boolean @default(false) pinned Boolean @default(false) note String? createdAt DateTime @default(now()) user User @relation(fields: [userId], references: [id]) }
model Note { id String @id @default(cuid()) userId String type NoteType title String content String? createdAt DateTime @default(now()) items ListItem[] user User @relation(fields: [userId], references: [id]) }
model ListItem { id String @id @default(cuid()) noteId String label String checked Boolean @default(false) note Note @relation(fields: [noteId], references: [id], onDelete: Cascade) }
enum NoteType { note list }
```

## 6) Contrats d’API (OpenAPI minimal — MVP)
### Tasks
- `GET /tasks` → `Task[]`
- `POST /tasks` → body `{ title: string }` → `Task`
- `PATCH /tasks/:id` → body partiel `{ title?, done?, pinned?, note? }` → `Task`
- `DELETE /tasks/:id` → `{ ok: true }`
- `POST /tasks/:id/decompose` → crée une `Note(type=list)` et supprime la tâche → `{ noteId }`

### Notes
- `GET /notes` → `Note[]`
- `POST /notes` → body `{ type: 'note'|'list', title: string }` → `Note`
- `POST /notes/:id/items` → body `{ label: string }` → `ListItem`
- `PATCH /notes/:id/items/:itemId` → `{ checked: boolean }` → `ListItem`

### Planning (MVP)
- `POST /planning/suggest` → body `{ taskId: string, durationMin?: number }` → `{ options: { start: string, end: string, score: number }[] }`
- `POST /planning/ics` → body `{ title: string, start: string, end: string }` → `text/calendar` (fichier `.ics`)

> V2 : `GET /calendar/busy` (lecture seule Google Calendar via OAuth2) pour construire les gaps.

## 7) Planification (.ics) – MVP
- Heuristique mocked côté API (retourne 2–3 créneaux prochainement).
- Génération `.ics` côté API (ou côté front) via lib (ex. `ics` ou custom simple).
- Front : bouton « Ajouter au calendrier (.ics) » → télécharge le fichier, l’OS propose d’ouvrir dans GCal.

## 8) Roadmap technique
- **Sprint 1** : UI + stores (fake data), API mock (in-memory), .ics généré côté front.
- **Sprint 2** : Prisma + Postgres, endpoints CRUD, persist stores via API.
- **Sprint 3** : Planning suggéré dynamiquement, préférences utilisateur (heures autorisées, durée par défaut).
- **Sprint 4** : OAuth Google & lecture Calendar, scoring des gaps.

## 9) Scripts / Commandes (exemples)
```bash
# Créer le workspace Nx
npx create-nx-workspace@latest tomlist --preset=empty
cd tomlist

# Apps
npx nx g @nx/angular:application web --routing --style=scss
npx nx g @nx/nest:application api

# Libs partagées
npx nx g @nx/js:library domain
npx nx g @nx/js:library shared-ui
npx nx g @nx/js:library shared-utils

# Prisma dans apps/api
npm i -D prisma && npm i @prisma/client
npx prisma init --datasource-provider postgresql
# Éditer schema.prisma puis
npx prisma migrate dev -n init

# Lancer
npx nx serve api
npx nx serve web
```
