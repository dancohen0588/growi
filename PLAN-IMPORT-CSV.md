# Plan détaillé - Import CSV en masse pour la Bible des Plantes

## 🎯 Objectif
Permettre l'import de centaines d'espèces de plantes via un fichier CSV avec validation robuste et rapport détaillé.

## 🏗️ Architecture

### 1. DTOs à créer
- **CsvImportDto** : pour le fichier uploadé et les options
- **CsvRowDto** : représente une ligne CSV validée
- **ImportResultDto** : rapport d'import avec succès/erreurs
- **ImportPreviewDto** : preview des données avant import final

### 2. Endpoint API
```typescript
POST /api/v1/plant-bible/admin/species/import-csv
```

### 3. Service methods
- `parseAndValidateCsv()` : parse CSV + validation
- `previewImport()` : aperçu des données
- `executeImport()` : import en base avec transaction
- `generateReport()` : rapport détaillé

### 4. Format CSV attendu

| Colonne CSV | Champ DB | Type | Obligatoire | Exemple |
|-------------|----------|------|-------------|---------|
| nom_commun_fr | commonNameFr | string | ✅ | "Lavande vraie" |
| nom_commun_en | commonNameEn | string | ⚪ | "True Lavender" |
| nom_latin | latinName | string | ✅ | "Lavandula angustifolia" |
| aliases | aliases | string[] | ⚪ | "Lavande officinale;Lavande fine" |
| type_environnement | plantEnvironmentType | enum | ✅ | "OUTDOOR" |
| categorie | category | enum | ✅ | "SHRUB" |
| tags_usage | usageTags | string[] | ⚪ | "aromathique;decorative" |
| difficulte | difficultyLevel | enum | ✅ | "EASY" |
| vitesse_croissance | growthSpeed | enum | ✅ | "MEDIUM" |
| hauteur_cm | matureHeightCm | number | ⚪ | "60" |
| largeur_cm | matureWidthCm | number | ⚪ | "80" |
| climats_fr | suitableClimatesFr | enum[] | ✅ | "OCEANIC;MEDITERRANEAN" |
| temp_min_c | hardinessMinTempC | number | ⚪ | "-15" |
| tolerance_cotiere | coastalTolerance | boolean | ⚪ | "true" |
| tolerance_urbaine | urbanTolerance | boolean | ⚪ | "false" |
| besoins_lumiere | lightNeeds | enum | ✅ | "FULL_SUN" |
| frequence_arrosage | wateringFrequency | enum | ✅ | "MODERATE" |
| notes_arrosage | wateringNotes | string | ⚪ | "Éviter l'eau stagnante" |
| types_sol | soilTypes | enum[] | ✅ | "SANDY;WELL_DRAINED" |
| ph_sol | soilPh | enum | ⚪ | "NEUTRAL" |
| humidite | humidityNeeds | enum | ✅ | "LOW" |
| periode_plantation | plantingPeriod | number[] | ⚪ | "3;4;5" |
| periode_floraison | floweringPeriod | number[] | ⚪ | "6;7;8" |
| duree_vie | lifespanType | enum | ✅ | "PERENNIAL" |
| type_feuillage | foliageType | enum | ✅ | "EVERGREEN" |
| type_taille | pruningType | enum | ✅ | "LIGHT" |
| notes_debutants | notesForBeginners | string | ⚪ | "Très facile à cultiver" |
| toxique_humains | toxicToHumans | boolean | ⚪ | "false" |
| toxique_animaux | toxicToPets | boolean | ⚪ | "false" |

### 5. Fonctionnalités avancées

#### Gestion des erreurs
- **Validation par ligne** : erreurs de format, valeurs invalides
- **Détection des doublons** : par nom commun français ou nom latin
- **Gestion des conflits** : mise à jour vs création
- **Rollback automatique** : si erreur critique

#### Rapport d'import
```typescript
{
  totalRows: 150,
  successful: 143,
  errors: 7,
  warnings: 12,
  details: [
    {
      line: 8,
      status: 'error',
      field: 'difficulte',
      message: "Valeur 'SUPER_EASY' invalide. Valeurs acceptées: VERY_EASY, EASY, INTERMEDIATE, EXPERT"
    }
  ]
}
```

#### Options d'import
- **Mode preview** : validation uniquement, pas d'insertion
- **Mode strict** : arrêt à la première erreur
- **Mode permissif** : ignore les erreurs non-critiques
- **Update mode** : mise à jour des espèces existantes

### 6. Sécurité
- ✅ **Authentification** : JWT + AdminGuard
- ✅ **Validation robuste** : même validation que création manuelle
- ✅ **Limitation de taille** : max 1000 lignes par import
- ✅ **Transaction** : rollback automatique en cas d'erreur

### 7. Performance
- **Batch insert** : insertion par lots de 50 espèces
- **Validation asynchrone** : traitement non-bloquant
- **Cache des enums** : éviter les requêtes répétées
- **Index optimisés** : recherche rapide des doublons

## 🔧 Implémentation

### Étapes
1. ✅ Créer les DTOs spécifiques
2. ✅ Installer les dépendances (csv-parse, multer)
3. ✅ Ajouter l'endpoint avec upload de fichier
4. ✅ Implémenter la logique de parsing dans le service
5. ✅ Ajouter la validation et transformation
6. ✅ Créer la gestion des transactions
7. ✅ Implémenter le rapport d'erreur détaillé
8. ✅ Interface frontend avec drag & drop
9. ✅ Tests avec données réelles

### Dépendances à ajouter
```bash
npm install csv-parse @types/multer
```

## 📊 Exemple de CSV

```csv
nom_commun_fr,nom_latin,categorie,type_environnement,difficulte,vitesse_croissance,climats_fr,besoins_lumiere,frequence_arrosage,types_sol,humidite,duree_vie,type_feuillage,type_taille
Lavande vraie,Lavandula angustifolia,SHRUB,OUTDOOR,EASY,MEDIUM,OCEANIC;MEDITERRANEAN,FULL_SUN,LOW,SANDY;WELL_DRAINED,LOW,PERENNIAL,EVERGREEN,LIGHT
Rosier buisson,Rosa x hybrida,SHRUB,OUTDOOR,INTERMEDIATE,MEDIUM,OCEANIC;CONTINENTAL,FULL_SUN,MODERATE,HUMUS;WELL_DRAINED,MODERATE,PERENNIAL,DECIDUOUS,REGULAR
```

## ✅ Bénéfices

1. **Import rapide** : 500+ espèces en quelques minutes
2. **Validation rigoureuse** : même qualité que la saisie manuelle
3. **Rapport transparent** : visibilité complète des erreurs
4. **Flexibilité** : preview, mise à jour, rollback
5. **Sécurité** : transactions, validations, permissions
