const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PlantSpecies {
  id: string;
  slug: string;
  commonNameFr: string;
  commonNameEn?: string;
  latinName: string;
  aliases?: string[];
  plantEnvironmentType: string;
  category: string;
  usageTags?: string[];
  difficultyLevel: string;
  growthSpeed: string;
  matureHeightCm?: number;
  matureWidthCm?: number;
  suitableClimatesFr: string[];
  hardinessMinTempC?: number;
  coastalTolerance: boolean;
  urbanTolerance: boolean;
  lightNeeds: string;
  wateringFrequency: string;
  wateringNotes?: string;
  soilTypes: string[];
  soilPh?: string;
  humidityNeeds: string;
  hardinessZoneNote?: string;
  plantingPeriod?: number[];
  floweringPeriod?: number[];
  harvestPeriod?: number[];
  pruningPeriod?: number[];
  repottingFrequencyYears?: number;
  fertilizationPeriod?: string;
  maintenanceTasksSummary?: string;
  pruningType: string;
  pruningNotes?: string;
  coldProtectionNeeded: boolean;
  coldProtectionNotes?: string;
  commonDiseases?: string[];
  commonPests?: string[];
  diseaseSymptoms?: string;
  recommendedTreatments?: string;
  wateringMistakesSymptoms?: string;
  toxicToHumans: boolean;
  toxicToPets: boolean;
  toxicityNotes?: string;
  companionPlantsIds?: string[];
  incompatiblePlantsIds?: string[];
  recommendedUsesText?: string;
  lifespanType: string;
  foliageType: string;
  notesForBeginners?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlantSpeciesSearchParams {
  q?: string;
  category?: string;
  plantType?: string;
  climate?: string;
  difficulty?: string;
  lightNeeds?: string;
  wateringFrequency?: string;
  safeForHumans?: boolean;
  safeForPets?: boolean;
  page?: number;
  pageSize?: number;
  sort?: 'name' | 'difficulty' | 'created';
  order?: 'asc' | 'desc';
}

export interface PaginatedPlantSpecies {
  data: PlantSpecies[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PlantBibleFilters {
  categories: string[];
  plantTypes: string[];
  climates: string[];
  difficultyLevels: string[];
  lightRequirements: string[];
  wateringFrequencies: string[];
}

/**
 * Rechercher des espèces de plantes avec filtres et pagination
 */
export async function getPlantSpecies(params: PlantSpeciesSearchParams = {}): Promise<PaginatedPlantSpecies> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/api/v1/plant-bible/species?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache 1 heure
    });

    if (!response.ok) {
      throw new Error(`Plant Bible API error: ${response.status}`);
    }

    const result = await response.json();
    return result.data || { data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } };
  } catch (error) {
    console.error('Erreur API Plant Bible:', error);
    return { data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } };
  }
}

/**
 * Récupérer une espèce par son slug
 */
export async function getPlantSpeciesBySlug(slug: string): Promise<PlantSpecies | null> {
  const url = `${API_BASE_URL}/api/v1/plant-bible/species/${slug}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 }, // Cache 24 heures
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Plant Bible API error: ${response.status}`);
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Erreur API Plant Bible:', error);
    return null;
  }
}

/**
 * Récupérer les valeurs disponibles pour les filtres
 */
export async function getPlantBibleFilters(): Promise<PlantBibleFilters> {
  const url = `${API_BASE_URL}/api/v1/plant-bible/filters`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache 1 heure
    });

    if (!response.ok) {
      throw new Error(`Plant Bible API error: ${response.status}`);
    }

    const result = await response.json();
    return result.data || {
      categories: [],
      plantTypes: [],
      climates: [],
      difficultyLevels: [],
      lightRequirements: [],
      wateringFrequencies: [],
    };
  } catch (error) {
    console.error('Erreur API Plant Bible filters:', error);
    return {
      categories: ['SHRUB', 'TREE', 'PERENNIAL', 'ANNUAL', 'HERB', 'VEGETABLE'],
      plantTypes: ['INDOOR', 'OUTDOOR', 'MIXED'],
      climates: ['OCEANIC', 'CONTINENTAL', 'MEDITERRANEAN', 'MOUNTAIN'],
      difficultyLevels: ['VERY_EASY', 'EASY', 'INTERMEDIATE', 'EXPERT'],
      lightRequirements: ['SHADE', 'PARTIAL_SHADE', 'SUN', 'FULL_SUN'],
      wateringFrequencies: ['VERY_LOW', 'LOW', 'MODERATE', 'HIGH'],
    };
  }
}