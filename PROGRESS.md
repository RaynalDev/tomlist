# Suivi Projet Tomlist

- Dernière mise à jour : 2026-03-27

## Livré
- Monorepo Nx initialisé avec les apps `web` (Angular 18) et `api` (NestJS) + bibliothèques `domain`, `shared/ui`, `shared/utils`.
- API NestJS fonctionnelle en mémoire (seed de données), modules `tasks`, `notes`, `planning`, export `.ics` (heuristique de créneaux simulée).
- Front Angular : routing `/tasks` & `/notes`, layout bottom-nav, services HTTP et stores à base de signals.
- Feature Tâches : CRUD, épinglage, complétion, décomposition → création automatique d’une liste dans Notes, drawer planification avec export `.ics`.
- Feature Notes/Listes : création de notes ou listes, ajout/toggle d’items, affichage en grille responsive.
- Tests & builds de base : `nx test web`, `nx build web`, `nx build api` verts.
- Documentation README alignée sur l’architecture et les commandes Nx.

## Roadmap V1 — publication Google Play

### Statuts
- `[ ]` À faire
- `[~]` En cours
- `[x]` Fait

### P0 — Bloquants avant publication
1. `[ ]` **Persistance données** : remplacer la base in-memory par Postgres/SQLite (Prisma recommandé), avec migrations.
2. `[ ]` **Authentification & isolation** : gestion de comptes + séparation stricte des données par utilisateur.
3. `[ ]` **CRUD complet Notes/Listes** : vérifier et compléter édition/suppression sur toute la chaîne front + API.
4. `[ ]` **Tests E2E métier** : scénarios réels (`tasks`, `notes`, `planning`) au-delà du test exemple.
5. `[ ]` **Tests unitaires critiques** : stores/services front + modules API sensibles.

### P1 — Qualité produit (fortement recommandé)
6. `[ ]` **Planning fiable V1** : suggestions de créneaux plus robustes (durée, conflits, messages d’erreur).
7. `[ ]` **Export ICS interopérable** : valider Google/Outlook/Apple + tests de format/encodage.
8. `[ ]` **Accessibilité + i18n readiness** : ARIA, navigation clavier, focus management, préparation localisation.
9. `[ ]` **Observabilité prod** : logs structurés, suivi d’erreurs, healthchecks, alerting.

### P2 — Spécifique Google Play
10. `[ ]` **Choix packaging Android** : TWA (web-first) ou Capacitor (wrapper natif), avec décision documentée.
11. `[ ]` **Play Console assets** : icônes, screenshots, feature graphic, descriptions, catégorie, policy links.
12. `[ ]` **Config environnements** : dev/staging/prod séparés, CORS, variables d’environnement, versioning.

### Plan de sprints proposé
- **Sprint 1 (stabilité data + sécurité)** : persistance + auth + hardening API.
- **Sprint 2 (qualité)** : tests E2E métier + tests unitaires ciblés + monitoring.
- **Sprint 3 (release Android)** : packaging + QA device + publication Play Console.

## Notes diverses
- Les seed in-memory peuvent être ajustés dans `apps/api/src/app/database/in-memory.database.ts` pour démos.
- `nx.json` et les `project.json` listent les cibles disponibles ; penser à `nx graph` pour visualiser les dépendances.
