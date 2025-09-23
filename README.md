# Tomlist

Tomlist est un monorepo Nx qui regroupe le front Angular, l'API NestJS et les bibliothèques partagées pour le MVP "todo + notes" décrit dans `specifications.md`.

## Applications & bibliothèques
- **apps/web** : application Angular 18 standalone (routing `/tasks`, `/notes`), state géré par des services à base de signals.
- **apps/api** : API NestJS (in-memory pour le MVP) exposant `tasks`, `notes` et `planning`.
- **libs/domain** : entités et ports métier partagés.
- **libs/shared/ui** & **libs/shared/utils** : briques réutilisables (actuellement minimalistes).

## Démarrage rapide
Installe les dépendances (déjà fait lors de la génération) puis :

```bash
npx nx serve api    # lance l'API NestJS sur http://localhost:3000/api
```

Dans un autre terminal :

```bash
npx nx serve web    # lance le front Angular sur http://localhost:4200 (proxy /api → backend)
```

> Les commandes Nx sont orchestrées, tu peux aussi utiliser `npx nx serve web --open` pour démarrer les deux services.

## Fonctionnalités MVP livrées
- **Tâches** : création rapide, tri épinglé/à faire/terminé, toggle done/pin, suppression, décomposition → crée une liste côté notes, planification avec suggestions simulées et export `.ics`.
- **Notes & listes** : création de notes ou listes, ajout d’items, toggle des items.
- **Planning** : suggestions heuristiques mockées + export `.ics` généré côté API.

Toutes les données sont stockées en mémoire (seedé via `InMemoryDatabase`). Cela permet d’intégrer rapidement un vrai repository Prisma lors d’une itération suivante.

## Scripts utiles
- `npx nx test web` : tests unitaires Angular (ex. rendu navigation).
- `npx nx build web` : build prod Angular.
- `npx nx build api` : bundle API Nest (webpack).

Consulte `nx.json` et les `project.json` pour les cibles disponibles.
