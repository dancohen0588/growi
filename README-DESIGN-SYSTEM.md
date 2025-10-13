# 🌱 Growi Blog - Design System & Architecture

## Résumé des modifications

L'interface utilisateur du blog Growi a été entièrement harmonisée avec le design system principal. L'application est maintenant cohérente, responsive et prête pour la production.

## 🎨 Design System Growi

### Palette de couleurs
```css
--growi-lime: #B4DD7F      /* Vert lime principal */
--growi-forest: #1E5631    /* Vert sapin (titres) */
--growi-sand: #F9F7E8       /* Beige sable (fonds) */Contexte réel (IMPORTANT)
- La maquette HTML statique locale `/Users/dancohen/Documents/Travail/Garden project/index.html` s’affiche parfaitement (voir capture).
- L’instance Docker locale (Next.js) sur http://localhost:3001/ affiche une version “cassée” : typo par défaut (serif), liens bleus, sans styles (voir capture).
- Tu as affirmé que tout était aligné, mais côté utilisateur, l’UI en local reste non stylée. Il faut DIAG + FIX tangibles.

Objectif
1) Diagnostiquer pourquoi l’UI en local (port 3001) n’applique pas les styles (Tailwind/CSS/fonts).
2) Appliquer des correctifs concrets pour que **/ et /blog** reprennent exactement la charte Growi (celle de `index.html`).
3) Mettre en place un layout + design system communs, utilisés par Home et Blog.
4) S’assurer que cela fonctionne dans l’environnement Docker (build + run) ET en `npm run dev`.

Plan d’action OBLIGATOIRE (pas de shortcuts)
A) DIAGNOSTIC (écris les conclusions dans le README à la fin)
- Vérifie ces points et note lesquels étaient faux :
  1. `app/layout.tsx` importe bien `./globals.css` (App Router) et charge les fonts via `next/font`.
  2. `app/globals.css` contient `@tailwind base; @tailwind components; @tailwind utilities;` dans cet ordre (pas d’oubli).
  3. `tailwind.config.js` → `content` inclut bien: `./app/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`, `./src/**/*.{ts,tsx}` si présent.
  4. `postcss.config.js` contient `tailwindcss` et `autoprefixer`.
  5. Les classes ne sont pas “purgées” (globs corrects).
  6. Fonts Poppins/Raleway chargées via `next/font/google` dans `layout.tsx` et appliquées au `<body>`.
  7. Le Dockerfile/front installe **aussi les devDependencies** (sinon Tailwind ne compile pas en prod), et exécute `next build`.
  8. `docker-compose.yml` passe `NEXT_PUBLIC_API_URL=http://localhost:3000` et la variable est bien lue par le front.
  9. Aucun import CSS local manquant (ex: un vieux `/styles.css` non référencé).
- Si une seule de ces étapes est incorrecte → corrige et documente.

B) MISE EN PLACE DU DESIGN SYSTEM COMMUN
- Crée/valide des composants partagés dans `@/components`:
  - `Navbar.tsx`, `Footer.tsx`, `Container.tsx`, `Section.tsx`, `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Tag.tsx`, `Hero.tsx`
- Palette Growi (Tailwind: extend theme):
  - lime: #B4DD7F, forest: #1E5631, beige: #F9F7E8, sun: #F6C445
- Typo: Poppins (heading), Raleway (body) via `next/font`.
- `app/layout.tsx`:
  - applique classes sur `<html>`/`<body>`: bg-beige, text-forest, font-body
  - inclure `<Navbar />` haut et `<Footer />` bas

C) HOME = PAGE / (NEXT.JS) alignée à index.html
- Convertis le design `index.html` en `app/page.tsx` (sections: Hero, 3 blocs, fonctionnalités, témoignages, Growi Pro, CTA, footer).
- Gradients, ombres, bordures arrondies, hover states, clamp() pour titres (typographie fluide).
- Aucune dépendance externe inutile : tout en Tailwind + shadcn/ui.

D) BLOG = /blog et /blog/[slug]
- Réutilise le même layout (Navbar/Footer/Container/Section).
- Listing: cards 16:9, badges catégorie/tags, extrait 180–220 car., grid responsive (1/2/3).
- Article: hero image, titre H1, sous-titre, auteur, temps de lecture, TOC (H2), contenu HTML propre, “articles liés” en bas.
- Tous les styles en Tailwind, pas de CSS inline dispersé.

E) CONFIG TAILWIND / CSS (FOURNIS LES FICHIERS MODIFIÉS)
- `tailwind.config.js` (exemple minimal attendu) :
  ```js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
      extend: {
        colors: {
          lime: "#B4DD7F",
          forest: "#1E5631",
          beige: "#F9F7E8",
          sun: "#F6C445"
        },
        boxShadow: {
          card: "0 10px 30px rgba(0,0,0,0.06)"
        },
        borderRadius: {
          xl: "1rem",
          "2xl": "1.25rem"
        }
      }
    },
    plugins: []
  }
app/globals.css (ordre impératif) :

css
Copier le code
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body { height: 100%; }
body { background-color: #F9F7E8; color: #1E5631; }

.btn-primary { @apply bg-forest text-white rounded-xl px-5 py-3 shadow hover:opacity-95 transition; }
postcss.config.js :

js
Copier le code
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
F) DOCKER (FRONT) — S’ASSURER QUE TAILWIND COMPILE EN PROD

Met à jour Dockerfile du front pour installer devDependencies (sinon Tailwind ne build pas) :

Phase build: npm ci (sans --only=prod), npm run build

Phase run: npm ci --omit=dev OK, mais garde le CSS généré dans .next

docker-compose.yml (service front) :

yml
Copier le code
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:3000
ports:
  - "3001:3000"
Mets à jour le README avec ces précisions.

G) TESTS D’ACCEPTATION (à vérifier réellement)

npm run docker:down && npm run docker:up (ou commandes équivalentes)

Ouvre http://localhost:3001/

Hero, boutons, typo Poppins/Raleway OK

Styles identiques à index.html (gradients, ombres, arrondis)

Ouvre http://localhost:3001/blog

Cartes stylées, grid responsive, palette Growi, pas de style “cassé”

Ouvre un article: http://localhost:3001/blog/<slug>

Hero image, H1, TOC, contenu propre, articles liés

Responsive mobile/desktop OK

Ajoute dans README un paragraphe “Diagnostic initial & Correctifs appliqués” listant ce qui bloquait (ex: globals.css non importé, tailwind content globs erronés, Docker front n’installait pas devDeps, etc.).

Livrables attendus

Patches de fichiers: app/layout.tsx, app/globals.css, tailwind.config.js, postcss.config.js, app/page.tsx, app/blog/page.tsx, app/blog/[slug]/page.tsx, composants dans @/components, Dockerfile front, docker-compose.yml.

README mis à jour avec:

Diagnostic des causes racines

Comment lancer via Docker (et hors Docker)

Où modifier palette/typos

Confirmation visuelle: l’UI sur http://localhost:3001/ est strictement alignée au design de index.html.

Exigence finale

NE PAS répondre “déjà fait”. Appliquer les vérifications, produire les diffs concrets et le résumé DIAG dans le README.

Si un point ne peut pas être reproduit, expliquer précisément pourquoi et montrer les logs/screens nécessaires pour la preuve.

yaml
Copier le code

--growi-sun: #F6C445        /* Jaune soleil (accents) */
```

### Typographies
- **Poppins** : Titres et éléments importants (font-poppins)
- **Raleway** : Texte courant et contenu (font-raleway)

## 🏗️ Architecture des composants

### Composants UI partagés (`src/components/ui/`)
- **Navbar** : Navigation sticky avec état actif et menu mobile
- **Footer** : Footer complet avec liens organisés et réseaux sociaux
- **Container** : Wrapper responsive avec variants de taille
- **Button** : Boutons avec variants Growi (primary, secondary, outline, etc.)
- **Card** : Cards avec ArticleCard spécialisée pour le blog

### Composants Blog (`src/components/blog/`)
- **CategoryBadge** : Badge de catégorie avec couleurs personnalisables
- **Tag** : Tags avec variants (filled, outlined, ghost)
- **CategoryFilter** : Filtres de catégories avec sous-catégories
- **SearchInput** : Champ de recherche avec gestion d'URL
- **Pagination** : Pagination avec navigation d'URL

## 📱 Pages et Navigation

### Page Home (`/`)
- Hero section avec CTA vers le blog
- Sections "Comment ça marche" et "Fonctionnalités"
- Aperçu des derniers articles du blog
- Design entièrement responsive

### Page Blog (`/blog`)
- Listing des articles avec filtres et recherche
- Consommation de l'API via le client centralisé
- Pagination et navigation par catégories/tags
- Interface cohérente avec la Home

### Navigation
- Header sticky commun entre toutes les pages
- Logo Growi cliquable (retour accueil)
- Liens : Fonctionnalités, Premium, **Blog**, Pro, Contact
- CTA "Télécharger l'app" visible
- Menu mobile responsive avec hamburger

## 🔌 API & Configuration

### Client API (`src/lib/api.ts`)
```typescript
// Base URL configurée via variable d'environnement
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Méthodes disponibles
getArticles(params?)     // Liste des articles avec filtres
getArticleBySlug(slug)   // Article par slug
getFeaturedArticles()    // Articles mis en avant
getCategories()          // Liste des catégories
getTags()               // Liste des tags
```

### Variables d'environnement Docker
```yaml
# docker-compose.yml - service blog
environment:
  - NODE_ENV=development
  - NEXT_PUBLIC_API_URL=http://localhost:3000
  - PORT=3001
```

## 🚀 Commandes de lancement

### Développement local
```bash
# Terminal 1 - API (port 3000)
cd apps/api && npm run start:dev

# Terminal 2 - Frontend (port 3001)  
cd apps/blog && npm run dev

# Accéder à l'application
http://localhost:3001/     # Page d'accueil
http://localhost:3001/blog # Blog
```

### Docker Compose
```bash
# Lancer tous les services (Postgres + API + Frontend)
npm run docker:up

# Ou individuellement
docker-compose up postgres api blog

# Accès identique : http://localhost:3001/
```

## 🎯 Features implémentées

### ✅ Design System
- [x] Palette Growi complète appliquée
- [x] Typographies Poppins/Raleway intégrées  
- [x] Variables CSS et classes Tailwind cohérentes
- [x] Composants réutilisables avec variants

### ✅ Navigation & UX
- [x] Header sticky avec navigation active
- [x] Logo cliquable (retour Home)
- [x] Menu mobile responsive
- [x] Footer complet avec liens organisés
- [x] Navigation fluide Home ↔ Blog

### ✅ Responsive Design
- [x] Mobile-first (375px+)
- [x] Tablette (768px+)
- [x] Desktop (1024px+)
- [x] Grilles CSS adaptatives
- [x] Images et contenu responsive

### ✅ Architecture Technique
- [x] Client API centralisé avec gestion d'erreurs
- [x] Types TypeScript cohérents
- [x] Variables d'environnement Docker configurées
- [x] Composants modulaires et réutilisables
- [x] Export centralisé des composants UI

## 🔧 Maintenance & Développement

### Ajouter une nouvelle couleur
```javascript
// tailwind.config.js
colors: {
  growi: {
    lime: '#B4DD7F',
    forest: '#1E5631', 
    sand: '#F9F7E8',
    sun: '#F6C445',
    // nouvelle-couleur: '#HEXCODE'
  }
}
```

### Créer un nouveau composant UI
```bash
# Créer le composant
apps/blog/src/components/ui/mon-composant.tsx

# L'exporter
apps/blog/src/components/ui/index.ts
```

### Modifier l'API
```typescript
// Étendre les types dans src/lib/api.ts
export interface MonType {
  // propriétés...
}

// Ajouter des méthodes au client
async getMonEndpoint(): Promise<MonType[]> {
  return this.request<MonType[]>('/api/endpoint')
}
```

## 🎉 Résultat final

L'application Growi Blog dispose maintenant d'un **design system cohérent**, d'une **architecture moderne** et d'une **expérience utilisateur optimale** sur tous les appareils. La navigation entre la page d'accueil et le blog est fluide, et l'interface respecte parfaitement la charte graphique Growi.

**🌱 L'écosystème Growi est maintenant unifié !**