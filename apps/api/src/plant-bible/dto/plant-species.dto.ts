import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional, IsBoolean, IsInt, Min, Max, ArrayMinSize, ArrayMaxSize, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PlantEnvironmentType,
  PlantBibleCategory,
  FrenchClimate,
  DifficultyLevel,
  GrowthSpeed,
  LightRequirement,
  WateringFrequency,
  SoilTypePreference,
  SoilPHPreference,
  HumidityLevel,
  LifespanType,
  FoliageType,
  PruningType,
} from '@prisma/client';

export class CreatePlantSpeciesDto {
  @ApiProperty({ description: 'Nom commun en français', example: 'Rosier' })
  @IsString()
  commonNameFr: string;

  @ApiPropertyOptional({ description: 'Nom commun en anglais', example: 'Rose' })
  @IsOptional()
  @IsString()
  commonNameEn?: string;

  @ApiProperty({ description: 'Nom latin scientifique', example: 'Rosa gallica' })
  @IsString()
  latinName: string;

  @ApiPropertyOptional({ description: 'Autres noms communs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];

  @ApiProperty({ enum: PlantEnvironmentType })
  @IsEnum(PlantEnvironmentType)
  plantEnvironmentType: PlantEnvironmentType;

  @ApiProperty({ enum: PlantBibleCategory })
  @IsEnum(PlantBibleCategory)
  category: PlantBibleCategory;

  @ApiPropertyOptional({ description: 'Tags d\'usage', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  usageTags?: string[];

  @ApiProperty({ enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ enum: GrowthSpeed })
  @IsEnum(GrowthSpeed)
  growthSpeed: GrowthSpeed;

  @ApiPropertyOptional({ description: 'Hauteur à maturité en cm' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  matureHeightCm?: number;

  @ApiPropertyOptional({ description: 'Largeur à maturité en cm' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  matureWidthCm?: number;

  @ApiProperty({ enum: FrenchClimate, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(FrenchClimate, { each: true })
  suitableClimatesFr: FrenchClimate[];

  @ApiPropertyOptional({ description: 'Température minimale supportée en °C' })
  @IsOptional()
  @IsInt()
  @Min(-40)
  @Max(50)
  hardinessMinTempC?: number;

  @ApiPropertyOptional({ description: 'Supporte les embruns et le vent côtier' })
  @IsOptional()
  @IsBoolean()
  coastalTolerance?: boolean;

  @ApiPropertyOptional({ description: 'Supporte la pollution et la chaleur urbaine' })
  @IsOptional()
  @IsBoolean()
  urbanTolerance?: boolean;

  @ApiProperty({ enum: LightRequirement })
  @IsEnum(LightRequirement)
  lightNeeds: LightRequirement;

  @ApiProperty({ enum: WateringFrequency })
  @IsEnum(WateringFrequency)
  wateringFrequency: WateringFrequency;

  @ApiPropertyOptional({ description: 'Notes sur l\'arrosage' })
  @IsOptional()
  @IsString()
  wateringNotes?: string;

  @ApiProperty({ enum: SoilTypePreference, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SoilTypePreference, { each: true })
  soilTypes: SoilTypePreference[];

  @ApiPropertyOptional({ enum: SoilPHPreference })
  @IsOptional()
  @IsEnum(SoilPHPreference)
  soilPh?: SoilPHPreference;

  @ApiProperty({ enum: HumidityLevel })
  @IsEnum(HumidityLevel)
  humidityNeeds: HumidityLevel;

  @ApiPropertyOptional({ description: 'Période de plantation (mois 1-12)', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(12, { each: true })
  plantingPeriod?: number[];

  @ApiPropertyOptional({ description: 'Période de floraison (mois 1-12)', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(12, { each: true })
  floweringPeriod?: number[];

  @ApiProperty({ enum: LifespanType })
  @IsEnum(LifespanType)
  lifespanType: LifespanType;

  @ApiProperty({ enum: FoliageType })
  @IsEnum(FoliageType)
  foliageType: FoliageType;

  @ApiProperty({ enum: PruningType })
  @IsEnum(PruningType)
  pruningType: PruningType;

  @ApiPropertyOptional({ description: 'Conseils pour débutants' })
  @IsOptional()
  @IsString()
  notesForBeginners?: string;

  @ApiPropertyOptional({ description: 'Titre SEO' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Description SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;
}

export class UpdatePlantSpeciesDto extends CreatePlantSpeciesDto {}

export class PlantSpeciesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  commonNameFr: string;

  @ApiPropertyOptional()
  commonNameEn?: string;

  @ApiProperty()
  latinName: string;

  @ApiPropertyOptional({ type: [String] })
  aliases?: string[];

  @ApiProperty({ enum: PlantEnvironmentType })
  plantEnvironmentType: PlantEnvironmentType;

  @ApiProperty({ enum: PlantBibleCategory })
  category: PlantBibleCategory;

  @ApiPropertyOptional({ type: [String] })
  usageTags?: string[];

  @ApiProperty({ enum: DifficultyLevel })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ enum: GrowthSpeed })
  growthSpeed: GrowthSpeed;

  @ApiPropertyOptional()
  matureHeightCm?: number;

  @ApiPropertyOptional()
  matureWidthCm?: number;

  @ApiProperty({ enum: FrenchClimate, isArray: true })
  suitableClimatesFr: FrenchClimate[];

  @ApiPropertyOptional()
  hardinessMinTempC?: number;

  @ApiProperty()
  coastalTolerance: boolean;

  @ApiProperty()
  urbanTolerance: boolean;

  @ApiProperty({ enum: LightRequirement })
  lightNeeds: LightRequirement;

  @ApiProperty({ enum: WateringFrequency })
  wateringFrequency: WateringFrequency;

  @ApiPropertyOptional()
  wateringNotes?: string;

  @ApiProperty({ enum: SoilTypePreference, isArray: true })
  soilTypes: SoilTypePreference[];

  @ApiPropertyOptional({ enum: SoilPHPreference })
  soilPh?: SoilPHPreference;

  @ApiProperty({ enum: HumidityLevel })
  humidityNeeds: HumidityLevel;

  @ApiProperty({ enum: LifespanType })
  lifespanType: LifespanType;

  @ApiProperty({ enum: FoliageType })
  foliageType: FoliageType;

  @ApiPropertyOptional()
  notesForBeginners?: string;

  @ApiPropertyOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  seoDescription?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PlantSpeciesDetailDto extends PlantSpeciesDto {
  @ApiPropertyOptional()
  hardinessZoneNote?: string;

  @ApiPropertyOptional({ type: [Number] })
  plantingPeriod?: number[];

  @ApiPropertyOptional({ type: [Number] })
  floweringPeriod?: number[];

  @ApiPropertyOptional({ type: [Number] })
  harvestPeriod?: number[];

  @ApiPropertyOptional({ type: [Number] })
  pruningPeriod?: number[];

  @ApiPropertyOptional()
  repottingFrequencyYears?: number;

  @ApiPropertyOptional()
  fertilizationPeriod?: string;

  @ApiPropertyOptional()
  maintenanceTasksSummary?: string;

  @ApiProperty({ enum: PruningType })
  pruningType: PruningType;

  @ApiPropertyOptional()
  pruningNotes?: string;

  @ApiProperty()
  coldProtectionNeeded: boolean;

  @ApiPropertyOptional()
  coldProtectionNotes?: string;

  @ApiPropertyOptional({ type: [String] })
  commonDiseases?: string[];

  @ApiPropertyOptional({ type: [String] })
  commonPests?: string[];

  @ApiPropertyOptional()
  diseaseSymptoms?: string;

  @ApiPropertyOptional()
  recommendedTreatments?: string;

  @ApiPropertyOptional()
  wateringMistakesSymptoms?: string;

  @ApiProperty()
  toxicToHumans: boolean;

  @ApiProperty()
  toxicToPets: boolean;

  @ApiPropertyOptional()
  toxicityNotes?: string;

  @ApiPropertyOptional({ type: [String] })
  companionPlantsIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  incompatiblePlantsIds?: string[];

  @ApiPropertyOptional()
  recommendedUsesText?: string;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];
}

export class PlantSpeciesSearchDto {
  @ApiPropertyOptional({ description: 'Recherche texte (nom commun, latin, alias)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: PlantBibleCategory })
  @IsOptional()
  @IsEnum(PlantBibleCategory)
  category?: PlantBibleCategory;

  @ApiPropertyOptional({ enum: PlantEnvironmentType })
  @IsOptional()
  @IsEnum(PlantEnvironmentType)
  plantType?: PlantEnvironmentType;

  @ApiPropertyOptional({ enum: FrenchClimate })
  @IsOptional()
  @IsEnum(FrenchClimate)
  climate?: FrenchClimate;

  @ApiPropertyOptional({ enum: DifficultyLevel })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({ enum: LightRequirement })
  @IsOptional()
  @IsEnum(LightRequirement)
  lightNeeds?: LightRequirement;

  @ApiPropertyOptional({ enum: WateringFrequency })
  @IsOptional()
  @IsEnum(WateringFrequency)
  wateringFrequency?: WateringFrequency;

  @ApiPropertyOptional({ description: 'Filtrer les non-toxiques pour humains' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  safeForHumans?: boolean;

  @ApiPropertyOptional({ description: 'Filtrer les non-toxiques pour animaux' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  safeForPets?: boolean;

  @ApiPropertyOptional({ description: 'Page', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Taille de page', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number = 20;

  @ApiPropertyOptional({ description: 'Tri', enum: ['name', 'difficulty', 'created'] })
  @IsOptional()
  @IsString()
  sort?: 'name' | 'difficulty' | 'created' = 'name';

  @ApiPropertyOptional({ description: 'Ordre', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';
}

export class PaginatedPlantSpeciesDto {
  @ApiProperty({ type: [PlantSpeciesDto] })
  data: PlantSpeciesDto[];

  @ApiProperty()
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export class PlantBibleFiltersDto {
  @ApiProperty({ enum: PlantBibleCategory, isArray: true })
  categories: PlantBibleCategory[];

  @ApiProperty({ enum: PlantEnvironmentType, isArray: true })
  plantTypes: PlantEnvironmentType[];

  @ApiProperty({ enum: FrenchClimate, isArray: true })
  climates: FrenchClimate[];

  @ApiProperty({ enum: DifficultyLevel, isArray: true })
  difficultyLevels: DifficultyLevel[];

  @ApiProperty({ enum: LightRequirement, isArray: true })
  lightRequirements: LightRequirement[];

  @ApiProperty({ enum: WateringFrequency, isArray: true })
  wateringFrequencies: WateringFrequency[];
}

// ===== DTOs pour l'import CSV =====

export class CsvRowValidationError {
  @ApiProperty({ description: 'Numéro de ligne dans le CSV' })
  line: number;

  @ApiProperty({ description: 'Champ concerné' })
  field: string;

  @ApiProperty({ description: 'Message d\'erreur' })
  message: string;

  @ApiProperty({ description: 'Valeur fournie' })
  value?: any;
}

export class CsvImportOptionsDto {
  @ApiPropertyOptional({ description: 'Mode preview uniquement (pas d\'insertion)', default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  previewOnly?: boolean = false;

  @ApiPropertyOptional({ description: 'Mettre à jour les espèces existantes', default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  updateExisting?: boolean = false;

  @ApiPropertyOptional({ description: 'Mode strict (arrêt à la première erreur)', default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  strictMode?: boolean = false;
}

export class CsvRowDto {
  @ApiProperty({ description: 'Nom commun en français' })
  @IsString()
  nom_commun_fr: string;

  @ApiPropertyOptional({ description: 'Nom commun en anglais' })
  @IsOptional()
  @IsString()
  nom_commun_en?: string;

  @ApiProperty({ description: 'Nom latin scientifique' })
  @IsString()
  nom_latin: string;

  @ApiPropertyOptional({ description: 'Autres noms séparés par des points-virgules' })
  @IsOptional()
  @IsString()
  aliases?: string;

  @ApiProperty({ description: 'Type d\'environnement', enum: PlantEnvironmentType })
  @IsEnum(PlantEnvironmentType)
  type_environnement: PlantEnvironmentType;

  @ApiProperty({ description: 'Catégorie', enum: PlantBibleCategory })
  @IsEnum(PlantBibleCategory)
  categorie: PlantBibleCategory;

  @ApiPropertyOptional({ description: 'Tags d\'usage séparés par des points-virgules' })
  @IsOptional()
  @IsString()
  tags_usage?: string;

  @ApiProperty({ description: 'Niveau de difficulté', enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  difficulte: DifficultyLevel;

  @ApiProperty({ description: 'Vitesse de croissance', enum: GrowthSpeed })
  @IsEnum(GrowthSpeed)
  vitesse_croissance: GrowthSpeed;

  @ApiPropertyOptional({ description: 'Hauteur à maturité en cm' })
  @IsOptional()
  @IsString()
  hauteur_cm?: string;

  @ApiPropertyOptional({ description: 'Largeur à maturité en cm' })
  @IsOptional()
  @IsString()
  largeur_cm?: string;

  @ApiProperty({ description: 'Climats français adaptés séparés par des points-virgules' })
  @IsString()
  climats_fr: string;

  @ApiPropertyOptional({ description: 'Température minimale supportée en °C' })
  @IsOptional()
  @IsString()
  temp_min_c?: string;

  @ApiPropertyOptional({ description: 'Supporte les embruns côtiers' })
  @IsOptional()
  @IsString()
  tolerance_cotiere?: string;

  @ApiPropertyOptional({ description: 'Supporte la pollution urbaine' })
  @IsOptional()
  @IsString()
  tolerance_urbaine?: string;

  @ApiProperty({ description: 'Besoins en lumière', enum: LightRequirement })
  @IsEnum(LightRequirement)
  besoins_lumiere: LightRequirement;

  @ApiProperty({ description: 'Fréquence d\'arrosage', enum: WateringFrequency })
  @IsEnum(WateringFrequency)
  frequence_arrosage: WateringFrequency;

  @ApiPropertyOptional({ description: 'Notes sur l\'arrosage' })
  @IsOptional()
  @IsString()
  notes_arrosage?: string;

  @ApiProperty({ description: 'Types de sol préférés séparés par des points-virgules' })
  @IsString()
  types_sol: string;

  @ApiPropertyOptional({ description: 'pH du sol préféré', enum: SoilPHPreference })
  @IsOptional()
  @IsEnum(SoilPHPreference)
  ph_sol?: SoilPHPreference;

  @ApiProperty({ description: 'Besoins en humidité', enum: HumidityLevel })
  @IsEnum(HumidityLevel)
  humidite: HumidityLevel;

  @ApiProperty({ description: 'Durée de vie', enum: LifespanType })
  @IsEnum(LifespanType)
  duree_vie: LifespanType;

  @ApiProperty({ description: 'Type de feuillage', enum: FoliageType })
  @IsEnum(FoliageType)
  type_feuillage: FoliageType;

  @ApiProperty({ description: 'Type de taille', enum: PruningType })
  @IsEnum(PruningType)
  type_taille: PruningType;

  @ApiPropertyOptional({ description: 'Notes pour débutants' })
  @IsOptional()
  @IsString()
  notes_debutants?: string;

  @ApiPropertyOptional({ description: 'Toxique pour humains' })
  @IsOptional()
  @IsString()
  toxique_humains?: string;

  @ApiPropertyOptional({ description: 'Toxique pour animaux' })
  @IsOptional()
  @IsString()
  toxique_animaux?: string;
}

export class CsvImportResultDto {
  @ApiProperty({ description: 'Nombre total de lignes dans le CSV' })
  totalRows: number;

  @ApiProperty({ description: 'Nombre d\'espèces créées avec succès' })
  successful: number;

  @ApiProperty({ description: 'Nombre d\'espèces mises à jour' })
  updated: number;

  @ApiProperty({ description: 'Nombre d\'erreurs' })
  errors: number;

  @ApiProperty({ description: 'Nombre d\'avertissements' })
  warnings: number;

  @ApiProperty({ description: 'Durée du traitement en ms' })
  processingTime: number;

  @ApiProperty({ description: 'Mode preview utilisé' })
  previewMode: boolean;

  @ApiProperty({
    description: 'Détails par ligne',
    type: [CsvRowValidationError]
  })
  details: CsvRowValidationError[];

  @ApiProperty({ description: 'IDs des espèces créées/mises à jour' })
  speciesIds: string[];
}

export class CsvImportPreviewDto {
  @ApiProperty({ description: 'Échantillon des premières lignes validées' })
  sampleRows: any[];

  @ApiProperty({ description: 'Colonnes détectées' })
  detectedColumns: string[];

  @ApiProperty({ description: 'Colonnes manquantes obligatoires' })
  missingRequiredColumns: string[];

  @ApiProperty({ description: 'Colonnes inconnues' })
  unknownColumns: string[];

  @ApiProperty({ description: 'Estimation du nombre total de lignes' })
  estimatedRows: number;

  @ApiProperty({ description: 'Erreurs de validation sur l\'échantillon' })
  validationErrors: CsvRowValidationError[];
}