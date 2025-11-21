import Link from 'next/link';
import Image from 'next/image';

interface PlantSpecies {
  id: string;
  slug: string;
  commonNameFr: string;
  commonNameEn?: string;
  latinName: string;
  plantEnvironmentType: string;
  category: string;
  difficultyLevel: string;
  suitableClimatesFr: string[];
  lightNeeds: string;
  wateringFrequency: string;
  matureHeightCm?: number;
  toxicToHumans: boolean;
  toxicToPets: boolean;
  images?: string[];
}

interface PlantSpeciesCardProps {
  species: PlantSpecies;
}

// Mapping des valeurs enum vers affichage français
const difficultyLabels: Record<string, { label: string; color: string }> = {
  VERY_EASY: { label: 'Très facile', color: 'bg-green-100 text-green-800' },
  EASY: { label: 'Facile', color: 'bg-green-100 text-green-800' },
  INTERMEDIATE: { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  EXPERT: { label: 'Expert', color: 'bg-red-100 text-red-800' },
};

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  SHRUB: { label: 'Arbuste', emoji: '🌿' },
  TREE: { label: 'Arbre', emoji: '🌳' },
  PERENNIAL: { label: 'Vivace', emoji: '🌺' },
  ANNUAL: { label: 'Annuelle', emoji: '🌸' },
  CLIMBING: { label: 'Grimpante', emoji: '🍃' },
  BULB: { label: 'Bulbe', emoji: '🌷' },
  HERB: { label: 'Aromatique', emoji: '🌿' },
  VEGETABLE: { label: 'Potagère', emoji: '🥬' },
  GROUNDCOVER: { label: 'Couvre-sol', emoji: '🍀' },
  HEDGE: { label: 'Haie', emoji: '🌲' },
};

const lightLabels: Record<string, { label: string; emoji: string }> = {
  SHADE: { label: 'Ombre', emoji: '🌙' },
  PARTIAL_SHADE: { label: 'Mi-ombre', emoji: '⛅' },
  SUN: { label: 'Soleil', emoji: '☀️' },
  FULL_SUN: { label: 'Plein soleil', emoji: '🌞' },
};

const climateLabels: Record<string, string> = {
  OCEANIC: 'Océanique',
  CONTINENTAL: 'Continental',
  MEDITERRANEAN: 'Méditerranéen',
  MOUNTAIN: 'Montagnard',
  SEMI_CONTINENTAL: 'Semi-continental',
};

export function PlantSpeciesCard({ species }: PlantSpeciesCardProps) {
  const difficulty = difficultyLabels[species.difficultyLevel] || difficultyLabels.EASY;
  const category = categoryLabels[species.category] || categoryLabels.SHRUB;
  const light = lightLabels[species.lightNeeds] || lightLabels.SUN;
  
  const mainImage = species.images && species.images.length > 0 
    ? species.images[0] 
    : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60';

  return (
    <Link href={`/bible-des-plantes/${species.slug}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={species.commonNameFr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges d'alerte toxicité */}
          <div className="absolute top-3 right-3 flex gap-2">
            {species.toxicToHumans && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                ⚠️ Toxique
              </span>
            )}
            {species.toxicToPets && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                🐕 Animaux
              </span>
            )}
          </div>
          
          {/* Badge catégorie */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-growi-forest text-xs font-medium px-3 py-1 rounded-full">
              {category.emoji} {category.label}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          {/* Noms */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-growi-forest font-poppins mb-1 group-hover:text-growi-lime transition-colors">
              {species.commonNameFr}
            </h3>
            <p className="text-sm text-gray-500 italic">
              {species.latinName}
            </p>
            {species.commonNameEn && (
              <p className="text-sm text-gray-400">
                {species.commonNameEn}
              </p>
            )}
          </div>

          {/* Infos principales */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Difficulté</span>
              <span className={`text-xs px-2 py-1 rounded-full ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exposition</span>
              <span className="text-sm text-growi-forest font-medium">
                {light.emoji} {light.label}
              </span>
            </div>

            {species.matureHeightCm && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taille adulte</span>
                <span className="text-sm text-growi-forest">
                  {species.matureHeightCm > 100 
                    ? Math.round(species.matureHeightCm / 100) + 'm'
                    : species.matureHeightCm + 'cm'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Climats adaptés */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Climats français adaptés :</p>
            <div className="flex flex-wrap gap-1">
              {species.suitableClimatesFr.slice(0, 2).map((climate) => (
                <span
                  key={climate}
                  className="text-xs bg-growi-sand text-growi-forest px-2 py-1 rounded-full"
                >
                  📍 {climateLabels[climate] || climate}
                </span>
              ))}
              {species.suitableClimatesFr.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{species.suitableClimatesFr.length - 2} autres
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-sm text-growi-forest font-medium group-hover:text-growi-lime transition-colors">
              Voir la fiche complète
            </span>
            <span className="text-growi-lime group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}