# Gestion de l'Argent

Une application React multi-utilisateur pour gérer vos revenus et dépenses mensuels et annuels avec backend Node.js et MongoDB.

## Fonctionnalités

- **Authentification complète** : Inscription, connexion, déconnexion avec JWT
- **Données personnelles** : Chaque utilisateur a ses propres données financières
- **Migration automatique** : Les données existantes sont automatiquement migrées vers votre compte
- Ajouter des revenus et dépenses avec possibilité de les marquer comme récurrents (mensuels ou annuels)
- Pour les dépenses fixes, choisir une catégorie : Crédit, Facture, Assurance, Autre
- **Gestion des crédits** : Ajout automatique des mensualités comme dépenses fixes
- **Épargnes** : Création et gestion d'objectifs d'épargne avec dépôts et retraits
- Barre de récapitulatif élégante en haut avec totaux, épargne et reste à vivre, affichés avec des icônes et couleurs
- Tableaux séparés pour revenus, dépenses fixes par catégorie et variables, avec totaux automatiques, boutons de modification et suppression
- Diagramme pour visualiser le solde restant
- Rapport mensuel avec historique des 12 derniers mois et prévision des 6 prochains, incluant les récurrents
- **Persistance des données** via MongoDB avec filtrage par utilisateur
- Design moderne avec dégradés, ombres et responsive

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
npm install
npm run dev
```

## Utilisation

1. **Inscription** : Créez votre compte sur la page d'accueil
2. **Connexion** : Connectez-vous avec vos identifiants
3. **Migration** : Vos données existantes sont automatiquement récupérées
4. **Gestion** : Utilisez toutes les fonctionnalités comme avant, mais maintenant sauvegardées dans le cloud

## Technologies

- **Frontend** : React, React Router, CSS
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Authentification** : JWT, bcrypt
- **Déploiement** : Prêt pour production

## Technologies

- React
- Vite
- Recharts pour les diagrammes
