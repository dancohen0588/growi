import { Metadata } from 'next';
import { PlantSpeciesCard } from '@/components/plant-bible/plant-species-card';
import { PlantSpeciesFilters } from '@/components/plant-bible/plant-species-filters';
import { PlantSpeciesSearch } from '@/components/plant-bible/plant-species-search';
import { getPlantSpecies, getPlantBibleFilters } from '@/lib/api-plant-bible';

export const metadata: Metadata = {
  title: 'Bible des plantes - Guide complet des espèces de jardin',
  description: 'Découvrez plus de 500 espèces de plantes adaptées aux jardins français. Recherchez par climat, exposition, difficulté.',
  openGraph: {
    title: 'Bible des plantes Growi - Guide complet',
    description: 'Plus de 500 espèces de plantes pour jardins français avec conseils de culture détaillés.',
    type: 'website',
  },
};

interface PlantBiblePageProps {
  searchParams: {
    q?: string;
    category?: string;
    plantType?: string;
    climate?: string;
    difficulty?: string;
    lightNeeds?: string;
    wateringFrequency?: string;
    safeForHumans?: string;
    safeForPets?: string;
    page?: string;
  };
}

export default async function PlantBiblePage({ searchParams }: PlantBiblePageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 24;

  // Appels API réels
  const [speciesResponse, filtersResponse] = await Promise.all([
    getPlantSpecies({
      q: searchParams.q,
      category: searchParams.category,
      plantType: searchParams.plantType,
      climate: searchParams.climate,
      difficulty: searchParams.difficulty,
      lightNeeds: searchParams.lightNeeds,
      wateringFrequency: searchParams.wateringFrequency,
      safeForHumans: searchParams.safeForHumans === 'true',
      safeForPets: searchParams.safeForPets === 'true',
      page,
      pageSize,
    }),
    getPlantBibleFilters()
  ]);

  const species = speciesResponse.data;
  const total = speciesResponse.meta.total;
  const totalPages = speciesResponse.meta.totalPages;
  const filters = filtersResponse;

  return (
    <div className="min-h-screen bg-growi-sand">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-growi-forest font-poppins mb-4">
            Bible des plantes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez plus de 500 espèces adaptées aux jardins français avec tous les conseils de culture, entretien et association
          </p>
          <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              🌿 <strong>{total}</strong> espèces
            </span>
            <span className="flex items-center gap-2">
              🇫🇷 Adaptées aux <strong>5 climats français</strong>
            </span>
            <span className="flex items-center gap-2">
              👥 Guide pour <strong>débutants</strong>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtres latéraux */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="font-semibold text-growi-forest font-poppins mb-6 flex items-center gap-2">
                🔍 Recherche & filtres
              </h3>
              
              <PlantSpeciesSearch 
                initialValue={searchParams.q}
                placeholder="Rechercher une plante..."
              />
              
              <PlantSpeciesFilters
                filters={filters}
                activeFilters={{
                  category: searchParams.category,
                  plantType: searchParams.plantType,
                  climate: searchParams.climate,
                  difficulty: searchParams.difficulty,
                  lightNeeds: searchParams.lightNeeds,
                  wateringFrequency: searchParams.wateringFrequency,
                  safeForHumans: searchParams.safeForHumans === 'true',
                  safeForPets: searchParams.safeForPets === 'true',
                }}
              />
            </div>
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-600">
              <span>Accueil</span>
              <span className="mx-2">›</span>
              <span className="text-growi-forest font-semibold">Bible des plantes</span>
              {searchParams.category && (
                <>
                  <span className="mx-2">›</span>
                  <span className="capitalize">{searchParams.category.toLowerCase().replace('_', ' ')}</span>
                </>
              )}
            </nav>

            {/* Statistiques et tri */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  <strong>{total}</strong> espèce{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
                  {searchParams.q && (
                    <span> pour "<strong>{searchParams.q}</strong>"</span>
                  )}
                </p>
                {searchParams.climate && (
                  <p className="text-sm text-growi-forest mt-1">
                    📍 Adaptées au climat {searchParams.climate.toLowerCase()}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="name-asc">Nom A → Z</option>
                  <option value="name-desc">Nom Z → A</option>
                  <option value="difficulty-asc">Difficulté croissante</option>
                  <option value="difficulty-desc">Difficulté décroissante</option>
                </select>
              </div>
            </div>

            {/* Grille des espèces */}
            {species.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
                {species.map((plant) => (
                  <PlantSpeciesCard
                    key={plant.id}
                    species={plant}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🌱</div>
                <h3 className="text-2xl font-semibold text-growi-forest font-poppins mb-4">
                  Aucune espèce trouvée
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Aucune plante ne correspond à vos critères de recherche. 
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <a
                  href="/bible-des-plantes"
                  className="inline-flex items-center gap-2 bg-growi-lime hover:bg-growi-forest text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  🌿 Voir toutes les espèces
                </a>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <a
                      key={pageNum}
                      href={`/bible-des-plantes?page=${pageNum}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === page
                          ? 'bg-growi-forest text-white'
                          : 'bg-white text-gray-700 hover:bg-growi-lime hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </a>
                  ))}
                </div>
              </nav>
            )}
          </div>
        </div>

        {/* Section informative */}
        <div className="mt-16 bg-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-growi-forest font-poppins mb-6">
            Pourquoi une Bible des plantes ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🇫🇷</div>
              <h3 className="text-xl font-semibold text-growi-forest mb-3">Adaptées à la France</h3>
              <p className="text-gray-600">Espèces sélectionnées pour les 5 grands climats français avec conseils de rusticité.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-growi-forest mb-3">Guide débutant</h3>
              <p className="text-gray-600">Informations claires sur difficulté, entretien et erreurs à éviter pour chaque espèce.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-growi-forest mb-3">Calendrier détaillé</h3>
              <p className="text-gray-600">Plantation, floraison, taille et soins mois par mois selon votre région.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidation toutes les heures