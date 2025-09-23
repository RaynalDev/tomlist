# Tomlist – Spécifications MVP


## 🎯 Objectif
Créer une application simple et fonctionnelle qui combine :
- Une **vue Tâches** (usage type Todoist, mais simplifié).
- Une **vue Listes & Notes** (usage type Google Keep, avec listes à cocher et notes rapides).
- La possibilité d’**agir sur une tâche** via un mini-menu :
- **Planifier** → suggérer 2–3 créneaux à partir du calendrier (drawer).
- **Décomposer** → transformer une tâche en sous-tâches (liste).
- **Supprimer** → retirer la tâche.


---


## 📱 UX/Navigation
- **2 écrans principaux** :
1. **Tâches**
2. **Listes/Notes**
- Navigation via **bottom nav** (2 onglets) + swipe possible.
- **Input rapide** en haut de chaque vue :
- Écran Tâches → crée une tâche.
- Écran Listes/Notes → crée une note ou une liste (toggle).


### Mini-menu (type Pinterest)
- Accessible par clic long ou bouton `⋮`.
- Affiche : Planifier, Décomposer, Supprimer.


### Drawer Planifier
- S’ouvre depuis le bas (bottom sheet).
- Montre la tâche + 2–3 créneaux proposés.
- Action en un clic : **Ajouter au calendrier (.ics)**.


---


## 🧱 Modèles de données (MVP)


### Task
```ts
Task {
id: string
title: string
done: boolean
pinned: boolean
note?: string
}
```


### Note / List
```ts
Note {
id: string
type: "note" | "list"
title: string
content?: string // si note
items?: ListItem[] // si list
}


ListItem {
id: string
label: string
checked: boolean
}
```


---


## ⚡ Fonctionnalités MVP
- **Créer/éditer/supprimer** :
- Tâches
- Notes
- Listes et leurs items
- **Cocher/décocher** une tâche ou un item de liste.
- **Menu contextuel** pour chaque tâche : Planifier, Décomposer, Supprimer.
- **Planifier** : affiche un drawer avec des créneaux mockés (MVP).
- **Décomposer** : transforme la tâche en liste dans l’onglet Listes.
- **Supprimer** : supprime la tâche.


---
- **Actions rapides** accessibles en 1–2 clics max.
