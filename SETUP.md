# 🚀 Guide de Configuration - korli

Ce guide vous aidera à configurer korli avec Better Auth, Prisma et MySQL.

## Prérequis

- Node.js 18+ installé
- MySQL installé et en cours d'exécution
- npm ou yarn

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/korli"

# Better Auth
BETTER_AUTH_SECRET="votre-secret-aleatoire-ici"
BETTER_AUTH_URL="http://localhost:3000"

# Public URL for Better Auth client
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

**Important :**
- Remplacez `user`, `password` et `korli` par vos identifiants MySQL
- Générez un secret aléatoire pour `BETTER_AUTH_SECRET` (vous pouvez utiliser `openssl rand -base64 32`)

### 3. Créer la base de données MySQL

Connectez-vous à MySQL et créez la base de données :

```sql
CREATE DATABASE korli;
```

### 4. Générer le client Prisma

```bash
npm run db:generate
```

### 5. Appliquer le schéma à la base de données

```bash
npm run db:push
```

Ou pour créer une migration :

```bash
npm run db:migrate
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
korli/
├── app/
│   ├── (auth)/          # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── [username]/      # Page publique utilisateur
│   ├── api/
│   │   ├── auth/        # Routes Better Auth
│   │   └── user-page/   # API pour les pages utilisateur
│   ├── dashboard/       # Dashboard utilisateur
│   └── page.tsx         # Page d'accueil
├── lib/
│   ├── auth.ts          # Configuration Better Auth
│   ├── auth-client.ts   # Client Better Auth (côté client)
│   ├── prisma.ts        # Client Prisma
│   ├── utils.ts         # Utilitaires
│   └── hooks/
│       └── use-auth.ts  # Hook React pour l'auth
├── prisma/
│   └── schema.prisma    # Schéma de base de données
└── middleware.ts        # Middleware Next.js pour l'auth
```

## Fonctionnalités implémentées

✅ **Authentification complète**
- Inscription avec email/mot de passe
- Connexion
- Gestion de session
- Protection des routes

✅ **Création automatique de page utilisateur**
- Lors de l'inscription, une page est automatiquement créée
- Génération automatique du username si non fourni
- URL personnalisée : `korli.fr/username`

✅ **Page publique utilisateur**
- Affichage de la page avec avatar, bio et blocs
- Design responsive
- SEO optimisé

✅ **Dashboard**
- Vue d'ensemble de la page
- Liens rapides vers les fonctionnalités

## Prochaines étapes

1. **Page Builder** : Interface pour ajouter/modifier des blocs
2. **Analytics** : Statistiques de vues et clics
3. **Smart Rules** : Règles conditionnelles pour les blocs
4. **Design Builder** : Personnalisation avancée du design

## Commandes utiles

- `npm run dev` : Lancer le serveur de développement
- `npm run db:studio` : Ouvrir Prisma Studio (interface graphique pour la DB)
- `npm run db:push` : Appliquer les changements du schéma à la DB
- `npm run db:migrate` : Créer une migration
- `npm run build` : Build de production

## Dépannage

### Erreur de connexion à la base de données

Vérifiez que :
- MySQL est en cours d'exécution
- Les identifiants dans `.env` sont corrects
- La base de données `korli` existe

### Erreur "BETTER_AUTH_SECRET is required"

Assurez-vous d'avoir défini `BETTER_AUTH_SECRET` dans votre fichier `.env`

### Erreur Prisma

Si vous modifiez le schéma Prisma, n'oubliez pas de :
1. Exécuter `npm run db:generate`
2. Exécuter `npm run db:push` ou `npm run db:migrate`

