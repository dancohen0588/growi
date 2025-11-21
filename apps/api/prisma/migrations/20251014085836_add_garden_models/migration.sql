/*
  Warnings:

  - The primary key for the `_ArticleToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ArticleToTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KnowledgeLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "MainObjective" AS ENUM ('AESTHETIC', 'PRODUCTIVE_GARDEN', 'BIODIVERSITY', 'LOW_MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('URBAN', 'RURAL', 'BALCONY', 'TERRACE', 'HOUSE', 'SECOND_HOME');

-- CreateEnum
CREATE TYPE "SoilType" AS ENUM ('CLAY', 'CALCAREOUS', 'SANDY', 'SILTY', 'LOAMY');

-- CreateEnum
CREATE TYPE "SoilPh" AS ENUM ('ACID', 'NEUTRAL', 'ALKALINE');

-- CreateEnum
CREATE TYPE "Exposure" AS ENUM ('FULL_SUN', 'PART_SHADE', 'SHADE');

-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST');

-- CreateEnum
CREATE TYPE "Slope" AS ENUM ('FLAT', 'SLIGHT', 'STEEP');

-- CreateEnum
CREATE TYPE "Drainage" AS ENUM ('POOR', 'NORMAL', 'EXCELLENT');

-- CreateEnum
CREATE TYPE "IrrigationType" AS ENUM ('MANUAL', 'DRIP', 'AUTOMATIC', 'NONE');

-- CreateEnum
CREATE TYPE "PlantType" AS ENUM ('TREE', 'SHRUB', 'FLOWER', 'VEGETABLE', 'HERB', 'LAWN', 'VINE', 'SUCCULENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PlantCycle" AS ENUM ('ANNUAL', 'PERENNIAL', 'BIENNIAL', 'EVERGREEN', 'DECIDUOUS');

-- CreateEnum
CREATE TYPE "WaterNeed" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WATERING', 'PRUNING', 'FERTILIZING', 'TREATMENT', 'HARVEST', 'REPOTTING', 'SOWING', 'TRANSPLANTING', 'OBSERVATION', 'DISEASE', 'PEST');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'DONE', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('API', 'SENSOR', 'MANUAL');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ProductionUse" AS ENUM ('SELF_CONSUMPTION', 'AESTHETIC', 'SALE');

-- AlterTable
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_AB_pkey";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "knowledgeLevel" "KnowledgeLevel" NOT NULL DEFAULT 'BEGINNER',
    "mainObjective" "MainObjective" NOT NULL DEFAULT 'AESTHETIC',
    "timePerWeekMinutes" INTEGER,
    "budgetRange" "BudgetRange",
    "budgetMonthlyEstimate" DOUBLE PRECISION,
    "tools" TEXT[],
    "hasIrrigation" BOOLEAN NOT NULL DEFAULT false,
    "hasMower" BOOLEAN NOT NULL DEFAULT false,
    "hasCompost" BOOLEAN NOT NULL DEFAULT false,
    "hasProfessionalGardener" BOOLEAN NOT NULL DEFAULT false,
    "constraints" TEXT[],
    "productionUse" "ProductionUse" NOT NULL DEFAULT 'AESTHETIC',
    "environmentType" "EnvironmentType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garden_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garden_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gardens" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT DEFAULT 'FR',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "totalAreaM2" DOUBLE PRECISION,
    "soilType" "SoilType",
    "soilPh" "SoilPh",
    "exposureMain" "Orientation",
    "slope" "Slope",
    "drainage" "Drainage",
    "hasWaterPoint" BOOLEAN NOT NULL DEFAULT false,
    "irrigationType" "IrrigationType",
    "hasPets" BOOLEAN NOT NULL DEFAULT false,
    "hasVegetableGarden" BOOLEAN NOT NULL DEFAULT false,
    "hasOrchard" BOOLEAN NOT NULL DEFAULT false,
    "hasGreenhouse" BOOLEAN NOT NULL DEFAULT false,
    "environmentType" "EnvironmentType",
    "planWidthPx" INTEGER,
    "planHeightPx" INTEGER,
    "planBackgroundImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gardens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garden_zones" (
    "id" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exposure" "Exposure",
    "shadePercent" INTEGER,
    "shape" JSONB NOT NULL,
    "overrideSoilType" "SoilType",
    "overrideSoilPh" "SoilPh",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garden_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plants" (
    "id" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "zoneId" TEXT,
    "scientificName" TEXT,
    "commonName" TEXT NOT NULL,
    "plantType" "PlantType" NOT NULL,
    "cycle" "PlantCycle",
    "plantedAt" TIMESTAMP(3),
    "estimatedAgeMonths" INTEGER,
    "location" JSONB NOT NULL,
    "exposure" "Exposure",
    "waterNeed" "WaterNeed",
    "wateringFrequencyDays" INTEGER,
    "wateringType" "IrrigationType",
    "substrate" TEXT,
    "photosUrls" TEXT[],
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "history" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "plantId" TEXT,
    "type" "ActivityType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "notes" TEXT,
    "photoUrls" TEXT[],
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gardenId" TEXT,
    "plantId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "nextAt" TIMESTAMP(3) NOT NULL,
    "rrule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environmental_snapshots" (
    "id" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "tempMinC" DOUBLE PRECISION,
    "tempMaxC" DOUBLE PRECISION,
    "tempAvgC" DOUBLE PRECISION,
    "soilHumidityPct" DOUBLE PRECISION,
    "uvIndex" DOUBLE PRECISION,
    "rainfallMm" DOUBLE PRECISION,
    "frostRisk" BOOLEAN,
    "windSpeedKph" DOUBLE PRECISION,
    "sunshineHours" DOUBLE PRECISION,
    "source" "DataSource" NOT NULL DEFAULT 'API',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "environmental_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gardenId" TEXT,
    "plantId" TEXT,
    "code" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "user_profiles_userId_idx" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "garden_projects_userId_idx" ON "garden_projects"("userId");

-- CreateIndex
CREATE INDEX "gardens_projectId_idx" ON "gardens"("projectId");

-- CreateIndex
CREATE INDEX "gardens_userId_idx" ON "gardens"("userId");

-- CreateIndex
CREATE INDEX "gardens_city_idx" ON "gardens"("city");

-- CreateIndex
CREATE INDEX "gardens_postalCode_idx" ON "gardens"("postalCode");

-- CreateIndex
CREATE INDEX "garden_zones_gardenId_idx" ON "garden_zones"("gardenId");

-- CreateIndex
CREATE UNIQUE INDEX "garden_zones_gardenId_name_key" ON "garden_zones"("gardenId", "name");

-- CreateIndex
CREATE INDEX "plants_gardenId_idx" ON "plants"("gardenId");

-- CreateIndex
CREATE INDEX "plants_zoneId_idx" ON "plants"("zoneId");

-- CreateIndex
CREATE INDEX "plants_isAlive_idx" ON "plants"("isAlive");

-- CreateIndex
CREATE UNIQUE INDEX "plants_gardenId_commonName_key" ON "plants"("gardenId", "commonName");

-- CreateIndex
CREATE INDEX "activities_userId_idx" ON "activities"("userId");

-- CreateIndex
CREATE INDEX "activities_gardenId_idx" ON "activities"("gardenId");

-- CreateIndex
CREATE INDEX "activities_plantId_idx" ON "activities"("plantId");

-- CreateIndex
CREATE INDEX "activities_occurredAt_idx" ON "activities"("occurredAt");

-- CreateIndex
CREATE INDEX "activities_type_idx" ON "activities"("type");

-- CreateIndex
CREATE INDEX "reminders_userId_idx" ON "reminders"("userId");

-- CreateIndex
CREATE INDEX "reminders_gardenId_idx" ON "reminders"("gardenId");

-- CreateIndex
CREATE INDEX "reminders_plantId_idx" ON "reminders"("plantId");

-- CreateIndex
CREATE INDEX "reminders_nextAt_idx" ON "reminders"("nextAt");

-- CreateIndex
CREATE INDEX "reminders_status_idx" ON "reminders"("status");

-- CreateIndex
CREATE INDEX "environmental_snapshots_gardenId_idx" ON "environmental_snapshots"("gardenId");

-- CreateIndex
CREATE INDEX "environmental_snapshots_recordedAt_idx" ON "environmental_snapshots"("recordedAt");

-- CreateIndex
CREATE INDEX "environmental_snapshots_source_idx" ON "environmental_snapshots"("source");

-- CreateIndex
CREATE INDEX "alerts_userId_idx" ON "alerts"("userId");

-- CreateIndex
CREATE INDEX "alerts_gardenId_idx" ON "alerts"("gardenId");

-- CreateIndex
CREATE INDEX "alerts_plantId_idx" ON "alerts"("plantId");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_acknowledgedAt_idx" ON "alerts"("acknowledgedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garden_projects" ADD CONSTRAINT "garden_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gardens" ADD CONSTRAINT "gardens_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "garden_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gardens" ADD CONSTRAINT "gardens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garden_zones" ADD CONSTRAINT "garden_zones_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "garden_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environmental_snapshots" ADD CONSTRAINT "environmental_snapshots_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
