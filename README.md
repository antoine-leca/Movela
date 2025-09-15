# 🎬 Movela - Application de Découverte de Films et Séries

Refonte complète de mon projet Movela développé en B1, transformé d'un site statique en JavaScript natif vers une application React moderne avec backend Node.js/Express.

## 🔗 Liens du Projet Original

- **Version originale** : [GitHub - Movela B1](https://github.com/marvin-delansorne/Movela)
- **Demo en ligne** : [antoine-leca.students-laplateforme.io/Movela](https://antoine-leca.students-laplateforme.io/Movela/)

## 📋 Description

Movela est une application web permettant de découvrir des films et séries TV. Elle offre une interface moderne pour parcourir le contenu par genre, consulter les détails des œuvres, explorer les profils d'acteurs et effectuer des recherches en temps réel.

## ✨ Fonctionnalités

- 🏠 **Page d'accueil** avec carousel automatique des films populaires
- 🎭 **Navigation par genre** pour films et séries
- 🔍 **Recherche en temps réel** avec autocomplétion
- 📱 **Design responsive** adapté mobile/desktop
- 🎯 **Pages de détails** complètes (films, séries, acteurs)
- 📖 **Pagination** pour parcourir l'ensemble du catalogue
- ⭐ **Système de notes** et commentaires

## 🛠️ Technologies Utilisées

### Frontend
- **React 19** - Composants fonctionnels avec hooks
- **React Router DOM** - Navigation SPA
- **Axios** - Client HTTP pour les appels API
- **Vite** - Build tool moderne et rapide
- **Tailwind** - Framework CSS utility-first
- **DaisyUI** - Composants UI pré-construits
- **Axios** - Client HTTP pour les appels API

### Backend
- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web minimaliste
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement, notamment pour le token API

### API Externe
- **The Movie Database (TMDB)** - Source des données films/séries

## 📁 Structure du Projet

```
movela/
├── backend/
│   ├── controllers/          # Logique métier
│   │   ├── moviesControllers.js
│   │   ├── seriesControllers.js
│   │   ├── searchControllers.js
│   │   └── personControllers.js
│   ├── routes/              # Définition des routes API
│   │   ├── moviesRoutes.js
│   │   ├── seriesRoutes.js
│   │   ├── searchRoutes.js
│   │   └── personRoutes.js
│   ├── server.js            # Point d'entrée du serveur
│   └── .env                 # Variables d'environnement
│
└── frontend/
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── CarouselCards.jsx
    │   │   └── CustomDivider.jsx
    │   ├── pages/           # Pages principales
    │   │   ├── Home.jsx
    │   │   ├── ContentDetails.jsx
    │   │   ├── ActorDetails.jsx
    │   │   ├── ListMoviesByGenre.jsx
    │   │   ├── ListSeriesByGenre.jsx
    │   │   └── ListContentAll.jsx
    │   ├── hooks/           # Hooks personnalisés
    │   │   └── useScrollToTop.jsx
    │   ├── assets/          # Ressources statiques
    │   ├── AppRouter.jsx    # Configuration des routes
    │   ├── getAPI.jsx       # Service API centralisé
    │   └── main.jsx         # Point d'entrée React
    └── index.html
```

## 🎯 Compétences Acquises et Développées

### Développement Frontend Moderne
- **Architecture React** - Composants fonctionnels, hooks (useState, useEffect, useCallback...)
- **Gestion d'état** - State management avec hooks React
- **Routing SPA** - Navigation côté client avec React Router
- **CSS Framework** - Maîtrise de Tailwind CSS et DaisyUI
- **Responsive Design** - Interface adaptative, approche mobile-first

### Développement Backend
- **API REST** - Conception et implémentation d'endpoints RESTful
- **Architecture MVC** - Séparation controllers/routes pour la maintenance
- **Gestion d'erreurs** - Middleware et handling des erreurs HTTP
- **Variables d'environnement** - Sécurisation des clés API

### Intégration et Communication
- **Consommation d'API** - Intégration TMDB API avec axios
- **Requêtes asynchrones** - Promises, async/await, gestion des erreurs
- **CORS** - Configuration cross-origin pour communication frontend/backend

### UX/UI et Fonctionnalités Avancées
- **Recherche temps réel** - Debouncing et autocomplétion
- **Pagination** - Gestion de grandes listes de données
- **Carrousels** - Composants interactifs avec timer automatique
- **Loading states** - Gestion des états de chargement
- **Error handling** - Affichage user-friendly des erreurs

## 🎨 Choix Techniques

- **React vs Vanilla JS** : Choisi pour la réutilisabilité des composants et la gestion d'état
- **Tailwind CSS** : Approche utility-first pour un développement rapide et cohérent
- **Architecture API** : Séparation claire frontend/backend pour la scalabilité
- **Hooks personnalisés** : Réutilisation de logique (useScrollToTop)

## 📱 Features Responsive

- Menu burger mobile avec sidebar
- Grille adaptative pour les listes de contenus
- Carousel touch-friendly sur mobile
- Barre de recherche repositionnée selon l'écran

## 🚀 Évolutions Possibles

- [ ] Authentification utilisateur
- [ ] Système de favoris/watchlist
- [ ] Recommandations personnalisées
- [ ] Mode sombre/clair
- [ ] Revoir la navigation dans les carousel sur Desktop
- [ ] Ajout d'une roulette de sélection aléatoire de film pour les indécis
- [ ] Filtres par genre sur la page list/all ?
- [ ] Affichage au fur et à mesure des catégories sur la page list/by-genre pour réduire le temps de chargement de la page
- [ ] Optimisations
- [ ] Hébergement

---

**Auteur** : [Antoine LECA](https://antoine-leca.students-laplateforme.io/)  
**Formation** : La Plateforme - B1 | CDPI