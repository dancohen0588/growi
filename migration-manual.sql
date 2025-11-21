-- Migration manuelle pour la Bible des plantes
-- Contournement du problème de verrous Prisma

-- Créer les enums Plant Bible
CREATE TYPE "PlantEnvironmentType" AS ENUM ('INDOOR', 'OUTDOOR', 'MIXED');
CREATE TYPE "PlantBibleCategory" AS ENUM ('SHRUB', 'TREE', 'PERENNIAL', 'ANNUAL', 'CLIMBING', 'BULB', 'HERB', 'VEGETABLE', 'GROUNDCOVER', 'HEDGE', 'SUCCULENT', 'AQUATIC', 'FERN', 'GRASS');
CREATE TYPE "FrenchClimate" AS ENUM ('OCEANIC', 'CONTINENTAL', 'MEDITERRANEAN', 'MOUNTAIN', 'SEMI_CONTINENTAL');
CREATE TYPE "DifficultyLevel" AS ENUM ('VERY_EASY', 'EASY', 'INTERMEDIATE', 'EXPERT');
CREATE TYPE "GrowthSpeed" AS ENUM ('SLOW', 'MEDIUM', 'FAST');
CREATE TYPE "LightRequirement" AS ENUM ('SHADE', 'PARTIAL_SHADE', 'SUN', 'FULL_SUN');
CREATE TYPE "WateringFrequency" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH');
CREATE TYPE "SoilTypePreference" AS ENUM ('DRAINING', 'CLAY', 'LIMESTONE', 'NEUTRAL', 'RICH', 'POOR', 'SANDY', 'HUMUS');
CREATE TYPE "SoilPHPreference" AS ENUM ('ACID', 'NEUTRAL', 'BASIC');
CREATE TYPE "HumidityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "LifespanType" AS ENUM ('ANNUAL', 'BIENNIAL', 'PERENNIAL', 'PERSISTENT');
CREATE TYPE "FoliageType" AS ENUM ('EVERGREEN', 'DECIDUOUS', 'SEMI_EVERGREEN');
CREATE TYPE "PruningType" AS ENUM ('LIGHT', 'FORMATION', 'REJUVENATION', 'FRUITING', 'NONE');

-- Créer la table plant_species
CREATE TABLE "plant_species" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "commonNameFr" TEXT NOT NULL,
    "commonNameEn" TEXT,
    "latinName" TEXT NOT NULL,
    "aliases" TEXT[],
    "plantEnvironmentType" "PlantEnvironmentType" NOT NULL,
    "category" "PlantBibleCategory" NOT NULL,
    "usageTags" TEXT[],
    "difficultyLevel" "DifficultyLevel" NOT NULL,
    "growthSpeed" "GrowthSpeed" NOT NULL,
    "matureHeightCm" INTEGER,
    "matureWidthCm" INTEGER,
    "suitableClimatesFr" "FrenchClimate"[],
    "hardinessMinTempC" INTEGER,
    "coastalTolerance" BOOLEAN NOT NULL DEFAULT false,
    "urbanTolerance" BOOLEAN NOT NULL DEFAULT false,
    "lightNeeds" "LightRequirement" NOT NULL,
    "wateringFrequency" "WateringFrequency" NOT NULL,
    "wateringNotes" TEXT,
    "soilTypes" "SoilTypePreference"[],
    "soilPh" "SoilPHPreference",
    "humidityNeeds" "HumidityLevel" NOT NULL,
    "hardinessZoneNote" TEXT,
    "plantingPeriod" INTEGER[],
    "floweringPeriod" INTEGER[],
    "harvestPeriod" INTEGER[],
    "pruningPeriod" INTEGER[],
    "repottingFrequencyYears" INTEGER,
    "fertilizationPeriod" TEXT,
    "maintenanceTasksSummary" TEXT,
    "pruningType" "PruningType" NOT NULL,
    "pruningNotes" TEXT,
    "coldProtectionNeeded" BOOLEAN NOT NULL DEFAULT false,
    "coldProtectionNotes" TEXT,
    "commonDiseases" TEXT[],
    "commonPests" TEXT[],
    "diseaseSymptoms" TEXT,
    "recommendedTreatments" TEXT,
    "wateringMistakesSymptoms" TEXT,
    "toxicToHumans" BOOLEAN NOT NULL DEFAULT false,
    "toxicToPets" BOOLEAN NOT NULL DEFAULT false,
    "toxicityNotes" TEXT,
    "companionPlantsIds" TEXT[],
    "incompatiblePlantsIds" TEXT[],
    "recommendedUsesText" TEXT,
    "lifespanType" "LifespanType" NOT NULL,
    "foliageType" "FoliageType" NOT NULL,
    "notesForBeginners" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plant_species_pkey" PRIMARY KEY ("id")
);

-- Créer les index pour les performances
CREATE UNIQUE INDEX "plant_species_slug_key" ON "plant_species"("slug");
CREATE INDEX "plant_species_commonNameFr_idx" ON "plant_species"("commonNameFr");
CREATE INDEX "plant_species_latinName_idx" ON "plant_species"("latinName");
CREATE INDEX "plant_species_category_idx" ON "plant_species"("category");
CREATE INDEX "plant_species_plantEnvironmentType_idx" ON "plant_species"("plantEnvironmentType");
CREATE INDEX "plant_species_difficultyLevel_idx" ON "plant_species"("difficultyLevel");
CREATE INDEX "plant_species_suitableClimatesFr_idx" ON "plant_species"("suitableClimatesFr");
CREATE INDEX "plant_species_lightNeeds_idx" ON "plant_species"("lightNeeds");
CREATE INDEX "plant_species_wateringFrequency_idx" ON "plant_species"("wateringFrequency");
CREATE INDEX "plant_species_isActive_idx" ON "plant_species"("isActive");
CREATE INDEX "plant_species_createdAt_idx" ON "plant_species"("createdAt");
CREATE INDEX "plant_species_category_difficultyLevel_idx" ON "plant_species"("category", "difficultyLevel");
CREATE INDEX "plant_species_plantEnvironmentType_category_idx" ON "plant_species"("plantEnvironmentType", "category");
CREATE INDEX "plant_species_difficultyLevel_lightNeeds_idx" ON "plant_species"("difficultyLevel", "lightNeeds");

-- Message de confirmation
SELECT 'Table plant_species créée avec succès!' as status;