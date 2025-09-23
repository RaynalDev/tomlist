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
web/ # Angular 18 + Tailwind
api/ # NestJS + Prisma + OpenAPI
libs/
domain/ # Entités & ports partagés (TS pur)
src/
tasks/
notes/
planning/
common/
shared/
ui/ # Composants UI transverses (si besoin)
utils/ # Helpers purs
tools/ # (optionnel) scripts devops
```


## 4) Front (Angular) – structure & state
**Routing** : `/tasks` et `/notes` (bottom nav).


**Arborescence feature-first** :
```
apps/web/src/app/
core/
services/
api-client.ts
calendar-client.ts # mock MVP
ics.service.ts # génération .ics côté front (MVP)
features/
tasks/
pages/task-list.page.ts
components/task-item.component.ts
components/task-menu-popover.component.ts
drawers/planify-drawer.component.ts
```
