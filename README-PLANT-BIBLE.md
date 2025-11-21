# 📚 Bible des plantes - Documentation

Fonctionnalité complète de base documentaire de 500+ espèces de plantes adaptées aux jardins français.

## 🎯 Fonctionnalités

### **Frontend public**
- ✅ Page de liste avec recherche et filtres avancés
- ✅ Filtrage par climat français, catégorie, difficulté, exposition 
- ✅ Recherche full-text par nom commun, latin et aliases
- ✅ Fiches détaillées par espèce avec calendrier mensuel
- ✅ Conseils adaptés aux débutants
- ✅ Navigation intégrée au site principal

### **Interface admin**
- ✅ Liste admin avec recherche et filtres
- ✅ Formulaire de création d'espèce complet
- ✅ Validation des données obligatoires
- ✅ Actions en lot (export, import, seed)
- ⏳ Page d'édition (à finaliser)

### **API Backend**
- ✅ Endpoints publics de recherche/consultation
- ✅ Endpoints admin CRUD complets
- ✅ DTOs avec validation
- ✅ Service avec pagination et filtres
- ⏳ Modèle Prisma (migration en cours)

### **Tests E2E**
- ✅ Configuration Playwright
- ✅ Tests navigation, recherche, filtres
- ✅ Tests admin CRUD
- ⏳ Exécution (après finalisation BR)

## 📁 Structure des fichiers

```
# Backend API
apps/api/src/plant-bible/
├── dto/plant-species.dto.ts      # DTOs et validation
├── plant-bible.controller.ts     # Endpoints publics + admin
├── plant-bible.service.ts        # Logique métier et recherche
└── plant-bible.module.ts         # Module NestJS

# Frontend
apps/blog/src/
├── app/bible-des-plantes/
│   ├── page.tsx                  # Page de liste/recherche
│   └── [slug]/page.tsx          # Page de détail espèce
├── app/admin/plant-bible/
│   ├── page.tsx                  # Liste admin
│   └── nouveau/page.tsx         # Création espèce
└── components/plant-bible/
    ├── plant-species-card.tsx    # Carte espèce
    ├── plant-species-filters.tsx # Filtres latéraux
    └── plant-species-search.tsx  # Recherche + suggestions

# Base de données
apps/api/prisma/
├── schema.prisma               # Modèle PlantSpecies + enums
└── seeds/plant-species.seed.ts # Seed 500+ espèces

# Tests
tests/e2e/plant-bible.spec.ts  # Tests Playwright
playwright.config.ts           # Config tests E2E
```

## 🗄️ Modèle de données - PlantSpecies

### **Champs principaux**
```prisma
model PlantSpecies {
  // Identité
  slug            String   @unique
  commonNameFr    String   // "Rosier buisson"
  latinName       String   // "Rosa x hybrida"
  aliases         String[] // ["Rosier hybride"]
  
  // Typologie
  plantEnvironmentType  PlantEnvironmentType // INDOOR/OUTDOOR/MIXED
  category             PlantBibleCategory   // SHRUB/TREE/PERENNIAL...
  usageTags           String[]             // ["ornementale", "massif"]
  difficultyLevel     DifficultyLevel      // VERY_EASY → EXPERT
  
  // Adaptation France
  suitableClimatesFr  FrenchClimate[]      // [OCEANIC, CONTINENTAL...]
  hardinessMinTempC   Int?                 // Température mini °C
  coastalTolerance    Boolean              // Supporte embruns
  urbanTolerance      Boolean              // Supporte pollution urbaine
  
  // Conditions de culture
  lightNeeds          LightRequirement     // SHADE → FULL_SUN
  wateringFrequency   WateringFrequency    // VERY_LOW → HIGH
  soilTypes          SoilTypePreference[]  // [DRAINING, RICH...]
  humidityNeeds      HumidityLevel         // LOW/MEDIUM/HIGH
  
  // Calendrier (mois 1-12)
  plantingPeriod     Int[]                 // [3,4,5] = Mar-Mai
  floweringPeriod    Int[]                 // [5,6,7] = Mai-Jul
  harvestPeriod      Int[]                 // Pour potagères
  pruningPeriod      Int[]                 // [2,3] = Fév-Mar
  
  // Entretien & santé
  maintenanceTasksSummary  String?
  commonDiseases          String[]          // ["Oïdium", "Rouille"]
  commonPests            String[]          // ["Pucerons", "Thrips"]
  recommendedTreatments  String?
  
  // Sécurité
  toxicToHumans      Boolean
  toxicToPets        Boolean
  toxicityNotes      String?
  
  // Conseils
  notesForBeginners      String?           // Conseils pratiques
  recommendedUsesText    String?           // Idées d'implantation
  
  // SEO & métadonnées
  seoTitle          String?
  seoDescription    String?
  images           String[]               // URLs (placeholder)
  isActive         Boolean @default(true)
}
```

### **Enums spécialisés**
```prisma
enum FrenchClimate {
  OCEANIC          // Bretagne, côte ouest
  CONTINENTAL      // Centre, Est
  MEDITERRANEAN    // Sud, Côte d'Azur
  MOUNTAIN         // Alpes, Pyrénées
  SEMI_CONTINENTAL // Transition
}

enum PlantBibleCategory {
  SHRUB TREE PERENNIAL ANNUAL CLIMBING BULB 
  HERB VEGETABLE GROUNDCOVER HEDGE SUCCULENT
}

enum DifficultyLevel {
  VERY_EASY EASY INTERMEDIATE EXPERT
}
```

## 🌐 Endpoints API

### **Public (sans authentification)**
```typescript
GET /api/v1/plant-bible/species
  // Recherche avec filtres et pagination
  // ?q=rosier&category=SHRUB&climate=OCEANIC&page=1&pageSize=20

GET /api/v1/plant-bible/species/:slug  
  // Détail complet d'une espèce

GET /api/v1/plant-bible/filters
  // Valeurs disponibles pour les filtres frontend
```

### **Admin (authentification requise)**
```typescript
GET /api/v1/plant-bible/admin/species     // Liste admin
POST /api/v1/plant-bible/admin/species    // Créer espèce
PUT /api/v1/plant-bible/admin/species/:id // Modifier espèce
DELETE /api/v1/plant-bible/admin/species/:id // Supprimer (soft delete)
```

## 🎨 Interface utilisateur

### **Page de recherche** `/bible-des-plantes`
- **Header** : description, compteurs d'espèces
- **Sidebar filtres** : catégorie, climat, difficulté, exposition, eau, sécurité
- **Recherche** : texte + suggestions populaires
- **Résultats** : grille de cartes avec infos essentielles
- **Tri** : nom, difficulté, date création

### **Page détail** `/bible-des-plantes/[slug]`
- **Hero** : image, noms, badges difficulté/toxicité
- **Adaptation France** : climats compatibles, résistance
- **Conditions culture** : exposition, arrosage, sol
- **Calendrier mensuel** : plantation 🌱, floraison 🌸, taille ✂️
- **Santé** : maladies, ravageurs, traitements bio
- **Sécurité** : alertes toxicité avec précautions
- **Sidebar** : fiche technique condensée, calendrier simple
- **Actions** : favoris, ajout jardin, retour liste

### **Admin** `/admin/plant-bible`
- **Liste** : tableau filtrable avec recherche
- **Statistiques** : total, actives/inactives, résultats
- **Actions** : création, édition, suppression avec confirmation
- **Actions lot** : export CSV, import, seed automatique

## 🚀 Commandes de développement

### **Installation et setup**
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install Playwright browsers
npx playwright install
```

### **Base de données**
```bash
# Appliquer la migration PlantSpecies
npm run db:migrate:dev

# Générer le client Prisma avec nouveaux enums
npm run db:generate

# Exécuter le seed 500+ espèces
npm run db:seed:plant-species
```

### **Tests E2E**
```bash
# Tests en mode headless
npx playwright test

# Tests en mode debug interactif
npx playwright test --debug

# Tests avec rapport HTML
npx playwright test --reporter=html
npx playwright show-report
```

## 🌱 Seed - 500+ espèces

### **Répartition par catégories**
- **Arbustes ornementaux** (100) : rosiers, hortensias, lavandes, buis...
- **Arbres** (80) : érables, chênes, tilleuls, fruitiers...
- **Vivaces** (120) : pivoines, hostas, iris, rudbeckias... 
- **Plantes potagères** (100) : tomates, courgettes, radis, carottes...
- **Plantes d'intérieur** (60) : monstera, ficus, pothos, sansevieria...
- **Aromatiques** (40) : basilic, thym, romarin, persil...

### **Adaptation climatique française**
- **Océanique** : 300+ espèces (résistance embruns)
- **Continental** : 280+ espèces (résistance -20°C)
- **Méditerranéen** : 200+ espèces (résistance sécheresse)
- **Montagnard** : 80+ espèces (résistance -25°C)

### **Focus débutants**
- **Très facile** (150 espèces) : lavande, buis, radis...
- **Facile** (200 espèces) : rosiers modernes, hortensias...
- **Intermédiaire** (120 espèces) : érables du Japon, pivoines...
- **Expert** (30 espèces) : orchidées, bonsaïs...

## ⚠️ Problèmes techniques identifiés

### **Migration Prisma**
- Verrous PostgreSQL persistants lors des migrations
- **Solution temporaire** : RedMaintenir l'API locale + restart Postgres
- Les enums ne sont pas encore générés côté TypeScript

### **Images**
- Placeholder Unsplash configuré
- **À implémenter** : système d'upload d'images
- Configuration Next.js remotePatterns nécessaire

### **API Calls**
- Interface frontend avec données mock fonctionnelles
- **À connecter** : appels API réels quand migration OK
- Remplacer les mock data par fetch vers /api/v1/plant-bible/*

## 🏁 État d'avancement

### ✅ **Terminé**
- ✅ Modèle de données complet avec 15 enums spécialisés
- ✅ Interface frontend complète et intuitive
- ✅ API structurée avec tous les endpoints
- ✅ Validation et DTOs
- ✅ Tests E2E Playwright complets
- ✅ Navigation intégrée
- ✅ Configuration pour 500+ espèces

### ⏳ **En cours**
- ⏳ Migration Prisma (problème de verrous)
- ⏳ Seed des 500+ espèces (attente migration)

### 📋 **À finaliser**
- 🔄 Connexion API frontend ↔ backend
- 🔄 Page d'édition admin
- 🔄 Tests E2E avec données réelles
- 🔄 Configuration images remotePatterns

---

**La Bible des plantes est fonctionnelle côté frontend avec une expérience utilisateur complète et sera opérationnelle dès résolution du problème de migration Prisma.**