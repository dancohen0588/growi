# 🌱 Growi Blog - Monorepo

Blog complet pour la marque **Growi** avec backend NestJS et frontend Next.js 14.

## 🏗️ Architecture

```
growi-blog-monorepo/
├── apps/
│   ├── api/                    # Backend NestJS + TypeScript
│   │   ├── src/
│   │   │   ├── blog/          # Module blog (articles, categories, tags)
│   │   │   ├── auth/          # Guards d'authentification admin
│   │   │   ├── database/      # Service Prisma
│   │   │   └── main.ts        # Point d'entrée API
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Modèles de données blog
│   │   │   └── seed.ts        # Données de seed (4 articles)
│   │   └── Dockerfile         # Image Docker API
│   └── blog/                  # Frontend Next.js 14
│       ├── src/
│       │   ├── app/          # App Router Next.js 14
│       │   ├── components/   # Composants UI (shadcn/ui)
│       │   ├── lib/          # Utilitaires et helpers
│       │   └── types/        # Types TypeScript
│       ├── tailwind.config.js # Configuration Tailwind + palette Growi
│       └── Dockerfile        # Image Docker Frontend
├── docker-compose.yml         # Infrastructure (postgres, api, blog)
├── package.json              # Workspace monorepo
└── README.md                 # Ce fichier
```

## 🎨 Palette de couleurs Growi

- **Vert lime**: `#B4DD7F` - Couleur principale, CTAs
- **Vert sapin**: `#1E5631` - Titres, textes importants  
- **Beige sable**: `#F9F7E8` - Arrière-plans, cartes
- **Jaune soleil**: `#F6C445` - Accents, badges

## 📊 Modèles de données

### Tables principales

- **Author**: Auteurs du blog (Julie Botanique...)
- **Category**: Catégories principales (4 créées)
- **Subcategory**: Sous-catégories par catégorie
- **Tag**: Tags libres pour les articles
- **Article**: Articles du blog avec contenu Markdown
- **Media**: Gestion des images et fichiers
- **ArticleView**: Analytics des vues

### Relations

- Article → Author (many-to-one)
- Article → Category (many-to-one)  
- Article → Subcategory (many-to-one, optionnel)
- Article ↔ Tag (many-to-many)

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 20+**
- **Docker & Docker Compose**
- **npm 10+**

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd growi-blog-monorepo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Modifier DATABASE_URL, ADMIN_TOKEN si nécessaire
   ```

4. **Démarrer l'infrastructure**
   ```bash
   npm run docker:up
   ```
   
   Services lancés:
   - **PostgreSQL**: `localhost:5432`
   - **API**: `localhost:3000`
   - **Blog**: `localhost:3001`

5. **Configurer la base de données**
   ```bash
   # Générer le client Prisma
   npm run db:generate
   
   # Appliquer les migrations
   npm run db:migrate:dev
   
   # Peupler avec les données de seed
   npm run db:seed
   ```

6. **Accéder au blog**
   - **Blog**: http://localhost:3001/blog
   - **API Swagger**: http://localhost:3000/docs

## 📖 API Documentation

### Endpoints publics (GET)

- `GET /v1/blog/articles` - Liste des articles avec filtres
- `GET /v1/blog/articles/:slug` - Article par slug + articles liés
- `GET /v1/blog/categories` - Catégories avec compteurs
- `GET /v1/blog/categories/:slug` - Catégorie par slug
- `GET /v1/blog/tags` - Tags avec compteurs
- `GET /v1/blog/authors/:slug` - Auteur + ses articles
- `GET /v1/blog/featured` - Articles en vedette
- `GET /v1/blog/popular` - Articles populaires

### Paramètres de requête pour `/articles`

- `q` - Recherche textuelle full-text
- `category` - Filtrer par slug de catégorie
- `subcategory` - Filtrer par slug de sous-catégorie
- `tags[]` - Filtrer par tags (array)
- `page` - Numéro de page (défaut: 1)
- `pageSize` - Articles par page (défaut: 10)
- `sort` - Tri: `publishedAt|viewCount|title`
- `order` - Ordre: `asc|desc`

### Endpoints admin (Protection ADMIN_TOKEN)

- `POST /v1/blog/articles` - Créer un article
- `PUT /v1/blog/articles/:id` - Modifier un article
- `DELETE /v1/blog/articles/:id` - Supprimer un article
- CRUD pour categories, tags, authors

**Authentification Admin**: 
```bash
Authorization: Bearer dev_admin_token
```

## 🎯 Pages du blog

### `/blog`
- Liste des articles PUBLISHED
- Filtres par catégorie, sous-catégorie, tags
- Recherche full-text côté API
- Pagination
- Cartes article avec image 16:9, titre, extrait, badges, temps de lecture

### `/blog/[slug]`
- Page article complète
- Hero image, titre, meta, auteur
- Contenu HTML généré depuis Markdown
- Table des matières (TOC) des H2
- Encadré "À retenir" (bullet points)
- CTA "Ajouter cette tâche à mon jardin Growi"
- Articles liés (même catégorie)
- Analytics (compteur de vues)

### `/blog/categorie/[slug]`
- Articles d'une catégorie
- Filtre par sous-catégorie
- Pagination
- Breadcrumbs

## 🧪 Données de seed

### 4 articles créés

1. **"Arroser juste: éviter les 3 erreurs les plus courantes"**
   - Catégorie: Conseils jardinage / Arrosage
   - Tags: arrosage, balcon

2. **"Monstera: tailler sans stresser la plante"**
   - Catégorie: Plantes d'intérieur / Taille & soins
   - Tags: taille

3. **"Semer les tomates en 6 étapes faciles"**
   - Catégorie: Potager & fruits / Semis
   - Tags: semis, printemps

4. **"Zéro phyto au jardin: par où commencer ?"**
   - Catégorie: Écologie & biodiversité
   - Tags: zéro phyto

### Autres données

- **1 auteur**: Julie Botanique
- **4 catégories** avec descriptions et couleurs
- **3 sous-catégories**
- **6 tags** avec couleurs
- **Calcul automatique** du temps de lecture
- **Extraction TOC** des headers H2
- **Génération HTML** depuis Markdown

## 🔧 Scripts NPM

### Développement
```bash
npm run dev              # API + Blog en parallèle
npm run dev:api         # API seulement (port 3000)
npm run dev:blog        # Blog seulement (port 3001)
```

### Build
```bash
npm run build           # Build tout
npm run build:api       # Build API
npm run build:blog      # Build Blog
```

### Base de données
```bash
npm run db:generate     # Générer client Prisma
npm run db:migrate:dev  # Migration développement
npm run db:migrate      # Migration production
npm run db:seed         # Peupler données
npm run db:reset        # Reset complet (dev)
npm run db:studio       # Interface Prisma Studio
```

### Docker
```bash
npm run docker:up       # Démarrer infrastructure
npm run docker:down     # Arrêter
npm run docker:clean    # Nettoyer volumes
npm run docker:logs     # Voir les logs
```

### Tests
```bash
npm run test            # Tests toutes les apps
npm run test:blog       # Tests React (Vitest)
npm run lint            # ESLint
npm run format          # Prettier
npm run typecheck       # Vérification TypeScript
```

## 🌐 SEO & Performance

### SEO implémenté

- `generateMetadata` par page
- Meta title/description dynamiques
- Open Graph (og:image via heroImage)
- Sitemap.xml automatique
- RSS feed
- Schema.org pour les articles

### Performance

- **ISR/SSG** pour `/blog` et pages article
- **Image optimization** Next.js
- **Lazy loading** components
- **Fonts optimization** (Poppins/Raleway)

## 🧪 Tests

### Tests React (Vitest + Testing Library)

```bash
# Lancer les tests
npm run test:blog

# Tests en mode UI
npm run test:blog -- --ui

# Coverage
npm run test:blog -- --coverage
```

Tests implémentés sur:
- Composants Card Article
- Composants Tag/Badge
- Utils de formatage
- Pages principales

## 🔒 Sécurité

### API
- Guard d'authentification admin (ADMIN_TOKEN)
- Validation des entrées avec class-validator
- Rate limiting (à configurer)
- CORS configuré pour le frontend

### Frontend
- Variables d'environnement sécurisées
- Sanitization du contenu HTML
- Protection XSS

## 🚀 Déploiement

### Variables d'environnement

**Backend (.env)**:
```bash
DATABASE_URL="postgresql://..."
ADMIN_TOKEN="your-secret-admin-token"
PORT=3000
```

**Frontend (.env)**:
```bash
NEXT_PUBLIC_API_URL="https://api.votre-domaine.com"
```

### Production

1. **Build des images**
   ```bash
   docker compose -f docker-compose.prod.yml build
   ```

2. **Déploiement**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

## 📁 Structure des fichiers Next.js

```
apps/blog/src/
├── app/                        # App Router Next.js 14
│   ├── blog/
│   │   ├── page.tsx           # Liste articles /blog
│   │   ├── [slug]/
│   │   │   └── page.tsx       # Article /blog/[slug]
│   │   └── categorie/
│   │       └── [slug]/
│   │           └── page.tsx   # /blog/categorie/[slug]
│   ├── sitemap.ts             # Sitemap.xml
│   ├── robots.ts              # Robots.txt
│   └── layout.tsx             # Layout principal
├── components/                 # Composants UI
│   ├── ui/                    # shadcn/ui base
│   ├── blog/
│   │   ├── article-card.tsx   # Carte article
│   │   ├── article-content.tsx # Contenu article
│   │   ├── category-badge.tsx # Badge catégorie
│   │   ├── tag.tsx           # Tag component
│   │   ├── breadcrumbs.tsx   # Fil d'ariane
│   │   └── pagination.tsx    # Pagination
│   └── layout/
│       ├── header.tsx        # Header du site
│       └── footer.tsx        # Footer
├── lib/                       # Utilitaires
│   ├── api.ts                # Client API
│   ├── utils.ts              # Utilitaires généraux
│   └── constants.ts          # Constantes
└── types/                     # Types TypeScript
    ├── api.ts                # Types API
    └── blog.ts               # Types blog
```

## 🤝 Contribution

1. Fork le repository
2. Créer une branche feature
3. Développer avec tests
4. Ouvrir une Pull Request

### Standards

- **ESLint + Prettier** configuré
- **TypeScript strict**
- **Tests obligatoires** pour nouveaux composants
- **Documentation** des composants complexes

---

**Fait avec 💚 pour Growi**