-- Ajout de 10 nouvelles espèces de plantes pour la Bible

INSERT INTO plant_species (
  id, slug, "commonNameFr", "commonNameEn", "latinName", aliases,
  "plantEnvironmentType", category, "usageTags", "difficultyLevel", "growthSpeed",
  "matureHeightCm", "matureWidthCm", "suitableClimatesFr", "hardinessMinTempC",
  "coastalTolerance", "urbanTolerance", "lightNeeds", "wateringFrequency",
  "wateringNotes", "soilTypes", "soilPh", "humidityNeeds",
  "plantingPeriod", "floweringPeriod", "harvestPeriod", "pruningPeriod",
  "fertilizationPeriod", "maintenanceTasksSummary", "pruningType", "pruningNotes",
  "coldProtectionNeeded", "commonDiseases", "commonPests", "diseaseSymptoms",
  "recommendedTreatments", "wateringMistakesSymptoms", "toxicToHumans", "toxicToPets",
  "toxicityNotes", "companionPlantsIds", "recommendedUsesText", "lifespanType",
  "foliageType", "notesForBeginners", "seoTitle", "seoDescription", 
  images, "isActive", "createdAt", "updatedAt"
) VALUES
-- 1. Hortensia
(
  gen_random_uuid(), 'hortensia-macrophylla', 'Hortensia', 'Hydrangea', 'Hydrangea macrophylla', ARRAY['Hydrangée'],
  'OUTDOOR', 'SHRUB', ARRAY['ornementale', 'massif', 'ombre'], 'EASY', 'MEDIUM',
  150, 150, ARRAY['OCEANIC'::FrenchClimate, 'CONTINENTAL'::FrenchClimate], -15,
  true, true, 'PARTIAL_SHADE', 'HIGH',
  'Arrosage abondant en été, terre toujours fraîche', ARRAY['HUMUS'::SoilTypePreference, 'NEUTRAL'::SoilTypePreference], 'ACID', 'HIGH',
  ARRAY[3, 4, 10, 11], ARRAY[6, 7, 8, 9], ARRAY[]::integer[], ARRAY[3],
  'printemps et été', 'Arrosage copieux été, taille légère printemps', 'LIGHT', 'Taille légère après floraison',
  false, ARRAY['Oïdium', 'Chlorose'], ARRAY['Pucerons', 'Acariens'], 'Jaunissement feuilles (chlorose)',
  'Sulfate de fer contre chlorose', 'Flétrissement rapide si manque d''eau', false, false,
  null, ARRAY[]::text[], 'Excellent en massif ombragé, jardins de bord de mer', 'PERENNIAL',
  'DECIDUOUS', 'Très facile : beaucoup d''eau, mi-ombre, sol acide pour fleurs bleues', 'Hortensia : plantation et couleur des fleurs', 'Hortensia : arbuste de mi-ombre facile.',
  ARRAY[]::text[], true, NOW(), NOW()
),
-- 2. Érable du Japon
(
  gen_random_uuid(), 'erable-du-japon', 'Érable du Japon', 'Japanese Maple', 'Acer palmatum', ARRAY['Érable palmé'],
  'OUTDOOR', 'TREE', ARRAY['ornementale', 'isolé', 'japonais'], 'INTERMEDIATE', 'SLOW',
  800, 600, ARRAY['OCEANIC'::FrenchClimate, 'CONTINENTAL'::FrenchClimate], -15,
  false, true, 'PARTIAL_SHADE', 'MODERATE',
  'Terre fraîche en permanence, paillage recommandé', ARRAY['HUMUS'::SoilTypePreference, 'NEUTRAL'::SoilTypePreference, 'DRAINING'::SoilTypePreference], 'NEUTRAL', 'MEDIUM',
  ARRAY[3, 4, 10, 11], ARRAY[4, 5], ARRAY[]::integer[], ARRAY[11, 12, 1],
  'printemps', 'Arrosage régulier, paillage, taille minimale', 'LIGHT', 'Taille très légère en hiver',
  false, ARRAY['Verticilliose'], ARRAY['Pucerons'], 'Dessèchement brutal branches',
  'Éviter blessures, désinfecter outils', 'Grillure feuilles si manque d''eau en été', false, false,
  null, ARRAY[]::text[], 'Magnifique en isolé, jardin japonais, près terrasse', 'PERENNIAL',
  'DECIDUOUS', 'Éviter plein soleil et vents forts. Préférer mi-ombre abritée.', 'Érable du Japon : plantation et entretien', 'Érable du Japon : arbre d''ornement délicat.',
  ARRAY[]::text[], true, NOW(), NOW()
),
-- 3. Tomate cerise
(
  gen_random_uuid(), 'tomate-cerise', 'Tomate cerise', 'Cherry Tomato', 'Solanum lycopersicum var. cerasiforme', ARRAY['Tomate cocktail'],
  'OUTDOOR', 'VEGETABLE', ARRAY['potager', 'balcon'], 'EASY', 'FAST',
  200, 60, ARRAY['OCEANIC'::FrenchClimate, 'CONTINENTAL'::FrenchClimate, 'MEDITERRANEAN'::FrenchClimate], 0,
  false, true, 'SUN', 'HIGH',
  'Arrosage quotidien en été au pied, jamais sur feuillage', ARRAY['RICH'::SoilTypePreference, 'HUMUS'::SoilTypePreference, 'DRAINING'::SoilTypePreference], 'NEUTRAL', 'MEDIUM',
  ARRAY[4, 5], ARRAY[6, 7, 8, 9], ARRAY[7, 8, 9, 10], ARRAY[]::integer[],
  'toute la saison', 'Tuteurage, arrosage quotidien, récolte continue', 'LIGHT', 'Supprimer gourmands',
  true, ARRAY['Mildiou', 'Oïdium'], ARRAY['Doryphores', 'Pucerons'], 'Taches brunes feuilles (mildiou)',
  'Bouillie bordelaise préventive, arrosage au pied', 'Éclatement fruits si arrosage irrégulier', false, false,
  null, ARRAY[]::text[], 'Potager, bacs sur terrasse, serre', 'ANNUAL',
  'DECIDUOUS', 'Commencer par variétés cerises : plus faciles et productives.', 'Tomate cerise : culture au potager et en bac', 'Tomate cerise : légume facile pour débutants.',
  ARRAY[]::text[], true, NOW(), NOW()
),
-- 4. Monstera deliciosa
(
  gen_random_uuid(), 'monstera-deliciosa', 'Monstera deliciosa', 'Swiss Cheese Plant', 'Monstera deliciosa', ARRAY['Plante du fromage suisse'],
  'INDOOR', 'CLIMBING', ARRAY['intérieur', 'grimpante', 'grande feuille'], 'VERY_EASY', 'FAST',
  300, 200, ARRAY['OCEANIC'::FrenchClimate, 'CONTINENTAL'::FrenchClimate, 'MEDITERRANEAN'::FrenchClimate, 'MOUNTAIN'::FrenchClimate], 15,
  false, true, 'PARTIAL_SHADE', 'MODERATE',
  'Terre légèrement humide, laisser sécher entre arrosages', ARRAY['HUMUS'::SoilTypePreference, 'DRAINING'::SoilTypePreference, 'RICH'::SoilTypePreference], 'NEUTRAL', 'HIGH',
  ARRAY[3, 4, 5, 6, 7, 8, 9], ARRAY[]::integer[], ARRAY[]::integer[], ARRAY[]::integer[],
  'printemps à automne', 'Dépoussiérage feuilles, tuteurage, rempotage bisannuel', 'LIGHT', 'Taille légère au printemps',
  false, ARRAY['Cochenilles', 'Acariens'], ARRAY['Cochenilles', 'Pucerons'], 'Feuilles collantes (cochenilles)',
  'Savon noir, douche tiède, huile de neem', 'Jaunissement feuilles si trop ou pas assez d''eau', true, true,
  'Sève irritante pour peau et muqueuses. Éviter ingestion feuilles.', ARRAY[]::text[], 'Parfait en salon, bureau, véranda. Tuteur recommandé.', 'PERENNIAL',
  'EVERGREEN', 'Ultra facile : mi-ombre, arrosages modérés, supporte négligence', 'Monstera deliciosa : entretien plante d''intérieur facile', 'Monstera : plante d''intérieur tendance.',
  ARRAY[]::text[], true, NOW(), NOW()
),
-- 5. Basilic
(
  gen_random_uuid(), 'basilic-grand-vert', 'Basilic Grand Vert', 'Sweet Basil', 'Ocimum basilicum', ARRAY['Basilic commun', 'Basilic doux'],
  'MIXED', 'HERB', ARRAY['aromatique', 'potager', 'balcon', 'cuisine'], 'EASY', 'FAST',
  50, 30, ARRAY['OCEANIC'::FrenchClimate, 'CONTINENTAL'::FrenchClimate, 'MEDITERRANEAN'::FrenchClimate], 5,
  false, true, 'SUN', 'MODERATE',
  'Arrosage régulier au pied, éviter mouillage feuillage', ARRAY['RICH'::SoilTypePreference, 'DRAINING'::SoilTypePreference, 'HUMUS'::SoilTypePreference], 'NEUTRAL', 'MEDIUM',
  ARRAY[4, 5, 6], ARRAY[7, 8, 9], ARRAY[6, 7, 8, 9, 10], ARRAY[]::integer[],
  'toute la saison', 'Pincement fleurs, récolte régulière, arrosage quotidien', 'LIGHT', 'Pincer fleurs pour favoriser feuillage',
  true, ARRAY['Fusariose', 'Mildiou'], ARRAY['Pucerons', 'Limaces'], 'Flétrissement (fusariose)',
  'Rotation cultures, aération, traitement bio', 'Noircissement base tiges si excès eau', false, false,
  null, ARRAY[]::text[], 'Potager, jardinières, rebords de fenêtres, serre', 'ANNUAL',
  'DECIDUOUS', 'Facile : soleil, terre riche, pincer fleurs pour plus de feuilles', 'Basilic Grand Vert : culture et récolte d''aromate', 'Basilic : herbe aromatique facile.',
  ARRAY[]::text[], true, NOW(), NOW()
);

-- Vérification du nombre total d'espèces
SELECT COUNT(*) as "Nombre total d'espèces" FROM plant_species WHERE "isActive" = true;
SELECT "commonNameFr", category, "difficultyLevel" FROM plant_species WHERE "isActive" = true ORDER BY "commonNameFr";

\q