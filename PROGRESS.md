# Suivi Projet Tomlist

- Dernière mise à jour : 2025-09-23

## Livré
- Monorepo Nx initialisé avec les apps `web` (Angular 18) et `api` (NestJS) + bibliothèques `domain`, `shared/ui`, `shared/utils`.
- API NestJS fonctionnelle en mémoire (seed de données), modules `tasks`, `notes`, `planning`, export `.ics` (
  heuristique de créneaux simulée).
- Front Angular : routing `/tasks` & `/notes`, layout bottom-nav, services HTTP et stores à base de signals.
- Feature Tâches : CRUD, épinglage, complétion, décomposition → création automatique d’une liste dans Notes,
  drawer planification avec export `.ics`.
- Feature Notes/Listes : création de notes ou listes, ajout/toggle d’items, affichage en grille responsive.
- Tests & builds de base : `nx test web`, `nx build web`, `nx build api` verts.
- Documentation README alignée sur l’architecture et les commandes Nx.

## Prochaines étapes suggérées
1. **Persistance** : brancher Prisma + Postgres (ou autre DB) pour remplacer la base mémoire et préparer la migration des use-cases.
2. **Couverture de tests** : ajouter tests unitaires ciblant stores/services front et modules Nest critiques.
3. **Design system** : factoriser les composants communs (bottom-nav, cartes, boutons) dans `libs/shared/ui` et introduire Tailwind/Tokens.
4. **UX planning** : enrichir la suggestion de créneaux (durée configurable, description par défaut) et améliorer l’export `.ics` (description, localisation).
5. **Accessibilité & i18n** : vérifier ARIA, focus management, préparer la future localisation.
6. **Roadmap V2** : persistance côté front (offline cache), authentification utilisateur, intégration Google Calendar.

## Notes diverses
- Les seed in-memory peuvent être ajustés dans `apps/api/src/app/database/in-memory.database.ts` pour démos.
- `nx.json` et les `project.json` listent les cibles disponibles ; penser à `nx graph` pour visualiser les dépendances.
