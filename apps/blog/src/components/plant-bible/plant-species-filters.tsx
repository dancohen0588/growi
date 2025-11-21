'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOptions {
  categories: string[];
  plantTypes: string[];
  climates: string[];
  difficultyLevels: string[];
  lightRequirements: string[];
  wateringFrequencies: string[];
}

interface ActiveFilters {
  category?: string;
  plantType?: string;
  climate?: string;
  difficulty?: string;
  lightNeeds?: string;
  wateringFrequency?: string;
  safeForHumans?: boolean;
  safeForPets?: boolean;
}

interface PlantSpeciesFiltersProps {
  filters: FilterOptions;
  activeFilters: ActiveFilters;
}

// Labels français pour les filtres
const filterLabels = {
  categories: {
    SHRUB: 'Arbuste',
    TREE: 'Arbre', 
    PERENNIAL: 'Vivace',
    ANNUAL: 'Annuelle',
    CLIMBING: 'Grimpante',
    BULB: 'Bulbe',
    HERB: 'Aromatique',
    VEGETABLE: 'Potagère',
    GROUNDCOVER: 'Couvre-sol',
    HEDGE: 'Haie',
  },
  plantTypes: {
    INDOOR: 'Intérieur',
    OUTDOOR: 'Extérieur', 
    MIXED: 'Mixte',
  },
  climates: {
    OCEANIC: 'Océanique',
    CONTINENTAL: 'Continental',
    MEDITERRANEAN: 'Méditerranéen',
    MOUNTAIN: 'Montagnard',
    SEMI_CONTINENTAL: 'Semi-continental',
  },
  difficulties: {
    VERY_EASY: 'Très facile',
    EASY: 'Facile',
    INTERMEDIATE: 'Intermédiaire', 
    EXPERT: 'Expert',
  },
  lightRequirements: {
    SHADE: 'Ombre',
    PARTIAL_SHADE: 'Mi-ombre',
    SUN: 'Soleil',
    FULL_SUN: 'Plein soleil',
  },
  wateringFrequencies: {
    VERY_LOW: 'Très peu',
    LOW: 'Peu',
    MODERATE: 'Modéré',
    HIGH: 'Beaucoup',
  },
};

export function PlantSpeciesFilters({ filters, activeFilters }: PlantSpeciesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | boolean | undefined) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === undefined || value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    
    // Revenir à la page 1 quand on change les filtres
    params.delete('page');
    
    router.push(`/bible-des-plantes?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/bible-des-plantes');
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => 
    v !== undefined && v !== '' && v !== false
  );

  return (
    <div className="space-y-6">
      {/* Bouton reset */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-sm text-growi-forest hover:text-growi-lime transition-colors border border-gray-200 rounded-lg px-3 py-2"
        >
          ✨ Effacer tous les filtres
        </button>
      )}

      {/* Catégorie */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">🌿 Catégorie</h4>
        <div className="space-y-2">
          {filters.categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={activeFilters.category === cat}
                onChange={(e) => updateFilter('category', e.target.checked ? cat : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.categories[cat as keyof typeof filterLabels.categories] || cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Type de plante */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">🏠 Emplacement</h4>
        <div className="space-y-2">
          {filters.plantTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="plantType"
                value={type}
                checked={activeFilters.plantType === type}
                onChange={(e) => updateFilter('plantType', e.target.checked ? type : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.plantTypes[type as keyof typeof filterLabels.plantTypes] || type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Climat français */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">🇫🇷 Climat français</h4>
        <div className="space-y-2">
          {filters.climates.map((climate) => (
            <label key={climate} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="climate"
                value={climate}
                checked={activeFilters.climate === climate}
                onChange={(e) => updateFilter('climate', e.target.checked ? climate : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.climates[climate as keyof typeof filterLabels.climates] || climate}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Niveau de difficulté */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">⭐ Difficulté</h4>
        <div className="space-y-2">
          {filters.difficultyLevels.map((difficulty) => (
            <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={difficulty}
                checked={activeFilters.difficulty === difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.checked ? difficulty : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.difficulties[difficulty as keyof typeof filterLabels.difficulties] || difficulty}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Exposition */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">☀️ Exposition</h4>
        <div className="space-y-2">
          {filters.lightRequirements.map((light) => (
            <label key={light} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="lightNeeds"
                value={light}
                checked={activeFilters.lightNeeds === light}
                onChange={(e) => updateFilter('lightNeeds', e.target.checked ? light : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.lightRequirements[light as keyof typeof filterLabels.lightRequirements] || light}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Besoin en eau */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">💧 Besoin en eau</h4>
        <div className="space-y-2">
          {filters.wateringFrequencies.map((watering) => (
            <label key={watering} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="wateringFrequency"
                value={watering}
                checked={activeFilters.wateringFrequency === watering}
                onChange={(e) => updateFilter('wateringFrequency', e.target.checked ? watering : undefined)}
                className="text-growi-lime focus:ring-growi-lime"
              />
              <span className="text-sm text-gray-700 hover:text-growi-forest">
                {filterLabels.wateringFrequencies[watering as keyof typeof filterLabels.wateringFrequencies] || watering}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sécurité */}
      <div>
        <h4 className="font-medium text-growi-forest mb-3">⚠️ Sécurité</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.safeForHumans || false}
              onChange={(e) => updateFilter('safeForHumans', e.target.checked)}
              className="text-growi-lime focus:ring-growi-lime"
            />
            <span className="text-sm text-gray-700 hover:text-growi-forest">
              👶 Non toxique (humains)
            </span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.safeForPets || false}
              onChange={(e) => updateFilter('safeForPets', e.target.checked)}
              className="text-growi-lime focus:ring-growi-lime"
            />
            <span className="text-sm text-gray-700 hover:text-growi-forest">
              🐕 Non toxique (animaux)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}