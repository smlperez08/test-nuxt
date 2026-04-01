# Test technique - Nuxt + GraphQL + UX + Docker

## Prérequis

- Node.js >= 20
- npm

## Installation en local
```bash
cd app/
npm install
npm run dev
```

L'app est accessible sur http://localhost:3000

## Lancement via Docker
```bash
docker-compose up --build
```

L'app est accessible sur http://localhost:3000

## Choix techniques

**graphql-request** — client GraphQL minimal et suffisant pour ce besoin. Pas de cache intégré,
pas de state management supplémentaire, juste des requêtes simples vers l'API. Apollo aurait
été surdimensionné ici (~120kb de plus pour des features inutilisées).

**useGraphql composable** — toutes les requêtes sont centralisées dans un seul composable.
Ça évite de dupliquer la config du client et facilite un éventuel changement de client à l'avenir.

**Filtrage client-side** — les ~250 pays sont chargés une seule fois au montage, les filtres
opèrent ensuite en mémoire via un `computed`. Suffisant à cette échelle, ça évite des
allers-retours réseau inutiles à chaque frappe.

**Query string** — les filtres actifs sont synchronisés dans l'URL (`?q=fra&continent=Europe`)
via un `watch`. Cela permet de partager une recherche ou de revenir sur la liste filtrée
depuis une fiche pays.

## Structure du projet
```
├── app/
│   ├── assets/css/        → styles globaux
│   ├── components/        → composants réutilisables (card, inputs)
│   ├── composables/       → logique de fetch GraphQL
│   ├── layouts/           → layout commun (header)
│   ├── pages/
│   │   ├── index.vue      → redirection vers /countries
│   │   └── countries/
│   │       ├── index.vue  → listing des pays
│   │       └── [code].vue → fiche détail d'un pays
│   └── nuxt.config.ts
├── docker/
│   └── Dockerfile
└── docker-compose.yml
```

**Docker** — le script `dev` expose le serveur sur `0.0.0.0` via `nuxt dev --host 0.0.0.0`,
ce qui permet à Docker de forwarder le port 3000 sans configuration supplémentaire.

## Pistes d'amélioration

**Pagination ou virtualisation du DOM** — 250 pays affichés d'un coup restent gérables,
mais sur une liste plus grande il faudrait paginer ou virtualiser le rendu pour ne traiter
que les éléments visibles.

**Cache des requêtes GraphQL** — chaque navigation vers une fiche pays déclenche un appel
réseau. Un cache simple via `useState` ou une lib comme `pinia` éviterait les requêtes
redondantes sur les pays déjà consultés.

**Tests unitaires** — la logique de filtrage et le composable `useGraphql` mériteraient
des tests avec Vitest, notamment les cas limites (pays sans capitale, sans devise, etc.).

**Mode sombre** — Tailwind supporte nativement le dark mode via la classe `dark:`,
ce serait une amélioration rapide à mettre en place.

**UI plus travaillé** — la page détail pourrait afficher une carte géographique,
des statistiques supplémentaires ou un meilleur traitement des données manquantes
(pays sans capitale, devise multiple, etc.).

**Navigation** — un bouton scroll-to-top ou un header sticky améliorerait l'expérience
sur la page listing avec 250 pays, évitant à l'utilisateur de remonter manuellement.

**Animations CSS** — quelques transitions sur l'apparition des cards ou les changements
de page rendraient l'expérience plus fluide.

**CSS / Design system** — les classes Tailwind sont écrites directement dans les templates.
Avec plus de temps, on extrairait des classes réutilisables via `@apply` ou des composants
de base (`BaseCard`, `BaseButton`) pour éviter la duplication et faciliter la maintenance.

**Variables d'environnement** — l'endpoint GraphQL est actuellement en dur dans le composable.
Il devrait être déplacé dans un `runtimeConfig` dans `nuxt.config.ts` pour pouvoir varier
selon l'environnement (dev, staging, prod).

**Internationalisation** — les données de l'API sont en anglais, l'interface en français.
Avec `@nuxtjs/i18n` on pourrait proposer plusieurs langues et traduire les noms de pays
et continents.