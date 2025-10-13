# 🌱 Growi - Système d'Authentification Complet

Ce document présente le système d'authentification complet implémenté pour Growi, incluant le backoffice d'administration des utilisateurs.

## 📋 Résumé des Livrables

### ✅ Backend (NestJS + Prisma + PostgreSQL)

#### Schéma Base de Données
- **User** : id, email, passwordHash, firstName?, lastName?, role, status, emailVerifiedAt?, dates
- **RefreshToken** : id, userId, tokenHash, expiresAt, revoked, createdAt
- **PasswordReset** : id, userId, tokenHash, expiresAt, used, createdAt

#### Endpoints d'Authentification (`/api/v1/auth`)
- `POST /register` - Inscription avec auto-login
- `POST /login` - Connexion (rate limit 5/10min)
- `POST /refresh` - Refresh tokens avec rotation
- `POST /logout` - Déconnexion et révocation
- `GET /me` - Profil utilisateur authentifié
- `POST /request-password-reset` - Demande reset par email
- `POST /reset-password` - Reset avec token

#### Endpoints Administration (`/api/v1/admin/users`)
- `GET /` - Liste paginée + filtres (rôle, statut, recherche)
- `GET /stats` - Statistiques utilisateurs
- `GET /:id` - Détails utilisateur
- `POST /` - Création + option invitation email
- `PATCH /:id` - Modification utilisateur
- `PATCH /:id/toggle-status` - Activer/Suspendre
- `POST /:id/reset-password` - Reset MDP admin
- `DELETE /:id` - Suppression utilisateur

#### Services Implémentés
- **PasswordService** : bcrypt + validation (8 chars, lettre+chiffre)
- **JwtService** : tokens access (15min) + refresh (7j) avec rotation
- **MailService** : emails HTML avec templates Growi
- **RateLimitService** : Redis pour rate limiting et tâches async

### ✅ Frontend (Next.js App Router)

#### Authentification
- **AuthProvider** : Context React avec persistance localStorage
- **useAuth** : Hook pour login/logout/register/refresh
- **usePermissions** : Hook pour vérifications rôles
- **RequireAuth** : Composant de protection

#### Pages Créées
- `/login` - Formulaire de connexion
- `/register` - Inscription avec confirmation MDP
- `/reset-password/request` - Demande reset par email
- `/reset-password/new` - Nouveau mot de passe
- `/admin/users` - Interface admin complète

#### Header Modifié
- **Non connecté** : "Se connecter" + "Créer un compte"
- **Connecté** : Avatar + menu (Dashboard, Admin si ADMIN, Déconnexion)

#### Design System
- **Réutilisation parfaite** des tokens Growi existants
- **Gradients** : `from-growi-lime to-growi-forest`
- **Couleurs** : growi-forest, growi-lime, growi-sand
- **Effets** : hover shadows, translations, transitions
- **Fonts** : Poppins (titres), Raleway (textes)

## 🔧 Variables d'Environnement

Ajoutez à votre `.env` :

```env
# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Password Reset
PASSWORD_RESET_TOKEN_TTL="3600"

# Rate Limiting
LOGIN_RATE_LIMIT_MAX="5"
LOGIN_RATE_LIMIT_WINDOW_MS="600000"

# SMTP Configuration (MailHog pour dev)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="noreply@growi.io"

# URLs Frontend
FRONTEND_URL="http://localhost:3001"
```

## 🧪 Exemples cURL

### Inscription
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "Password123",
    "firstName": "Ada", 
    "lastName": "Lovelace"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "Password123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "votre-refresh-token"
  }'
```

### Profil Utilisateur
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer votre-access-token"
```

### Reset Mot de Passe (Demande)
```bash
curl -X POST http://localhost:3000/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com"
  }'
```

### Reset Mot de Passe (Nouveau)
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-recu-par-email",
    "newPassword": "NewPassword123"
  }'
```

### Admin - Liste des Utilisateurs
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=1&limit=20&role=USER&search=ada" \
  -H "Authorization: Bearer admin-access-token"
```

### Admin - Statistiques
```bash
curl -X GET http://localhost:3000/api/v1/admin/users/stats \
  -H "Authorization: Bearer admin-access-token"
```

### Admin - Créer Utilisateur
```bash
curl -X POST "http://localhost:3000/api/v1/admin/users?sendInvitation=true" \
  -H "Authorization: Bearer admin-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new@example.com",
    "password": "TempPass123",
    "firstName": "New",
    "lastName": "User",
    "role": "USER",
    "status": "ACTIVE"
  }'
```

### Admin - Toggle Statut
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/users/user-id/toggle-status \
  -H "Authorization: Bearer admin-access-token"
```

### Admin - Reset Mot de Passe
```bash
curl -X POST http://localhost:3000/api/v1/admin/users/user-id/reset-password \
  -H "Authorization: Bearer admin-access-token"
```

## 🚀 Instructions de Démarrage

### 1. Backend (API)
```bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### 2. Frontend (Blog)
```bash
cd apps/blog  
npm install
npm run dev
```

### 3. Services Externes
```bash
# PostgreSQL + Redis + MailHog
docker-compose up -d
```

## 🎯 Fonctionnalités Clés

### Sécurité
- **Hashing** : bcrypt avec saltRounds=12
- **JWT** : Access tokens courts (15min) + Refresh longs (7j)
- **Rate Limiting** : 5 tentatives login / 10min / IP
- **Validation** : Mots de passe ≥ 8 chars, 1 lettre + 1 chiffre
- **CORS** : Configuration restrictive
- **Sanitization** : Entrées nettoyées et validées

### Expérience Utilisateur
- **Design Cohérent** : Réutilisation parfaite du design system Growi
- **Responsive** : Mobile et desktop
- **Accessibilité** : Labels, aria-live, focus management  
- **Loading States** : Spinners et états de chargement
- **Error Handling** : Messages d'erreur contextuels
- **Auto-refresh** : Tokens rafraîchis automatiquement

### Administration
- **Dashboard Complet** : Stats + liste paginée + filtres
- **Actions Bulk** : Activation/suspension/suppression
- **Reset MDP Admin** : Génération et envoi automatique
- **Audit Trail** : Logs des actions administratives
- **Permissions RBAC** : Vérifications côté client et serveur

## 📁 Arborescence Ajoutée/Modifiée

### Backend
```
apps/api/
├── prisma/
│   ├── schema.prisma (tables User, RefreshToken, PasswordReset)
│   └── migrations/20251013132007_add_auth_tables/
├── src/
│   ├── auth/ (nouveau)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/auth.dto.ts
│   │   └── strategies/jwt.strategy.ts
│   ├── users/ (nouveau)
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/user.dto.ts
│   ├── admin/ (nouveau)
│   │   └── users/admin-users.controller.ts
│   ├── common/
│   │   ├── services/ (nouveau)
│   │   │   ├── jwt.service.ts
│   │   │   ├── password.service.ts
│   │   │   ├── mail.service.ts
│   │   │   └── rate-limit.service.ts
│   │   └── guards/roles.guard.ts (nouveau)
│   └── app.module.ts (modifié)
└── .env.example (variables auth ajoutées)
```

### Frontend
```
apps/blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx (AuthProvider ajouté)
│   │   ├── login/page.tsx (nouveau)
│   │   ├── register/page.tsx (nouveau)
│   │   ├── reset-password/
│   │   │   ├── request/page.tsx (nouveau)
│   │   │   └── new/page.tsx (nouveau)
│   │   └── admin/
│   │       └── users/page.tsx (nouveau)
│   ├── components/ui/
│   │   ├── navbar.tsx (modifié avec auth)
│   │   ├── input.tsx (nouveau)
│   │   └── label.tsx (nouveau)
│   ├── lib/
│   │   ├── api.ts (étendu avec auth endpoints)
│   │   └── auth.ts (nouveau - Context + hooks)
│   └── middleware.ts (nouveau - protection routes)
```

## 📊 Critères d'Acceptation

- [x] Boutons Se connecter/Créer compte en haut à droite
- [x] Design system Growi respecté (gradients, couleurs, ombres)
- [x] Register/Login/Logout/Refresh/Reset fonctionnels
- [x] Rate limiting au login (5/10min)
- [x] GET /auth/me retourne l'utilisateur authentifié
- [x] Page /admin/users accessible aux ADMIN uniquement
- [x] CRUD utilisateurs complet (liste, filtres, édition, toggle, reset, suppression)
- [x] Tokens gérés proprement (refresh auto sur 401)
- [x] Migrations Prisma OK
- [x] Emails HTML avec branding Growi
- [x] Aucune régression visuelle
- [x] Variables .env.example mises à jour

## 🎉 Prêt pour la Production !

Le système d'authentification complet est maintenant implémenté avec :
- **Backend robuste** avec sécurité renforcée
- **Frontend élégant** respectant le design Growi
- **Interface admin complète** pour la gestion des utilisateurs
- **Expérience utilisateur fluide** sur mobile et desktop

Tous les éléments sont en place pour commencer à utiliser l'authentification et l'administration des utilisateurs immédiatement ! 🚀