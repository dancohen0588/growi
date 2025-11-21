import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPlantSpeciesBySlug } from '@/lib/api-plant-bible';

// TODO: Remplacer par les types API réels
interface PlantSpecies {
  id: string;
  slug: string;
  commonNameFr: string;
  commonNameEn?: string;
  latinName: string;
  aliases?: string[];
  plantEnvironmentType: string;
  category: string;
  difficultyLevel: string;
  suitableClimatesFr: string[];
  lightNeeds: string;
  wateringFrequency: string;
  wateringNotes?: string;
  soilTypes: string[];
  soilPh?: string;
  humidityNeeds: string;
  matureHeightCm?: number;
  matureWidthCm?: number;
  hardinessMinTempC?: number;
  plantingPeriod?: number[];
  floweringPeriod?: number[];
  harvestPeriod?: number[];
  pruningPeriod?: number[];
  maintenanceTasksSummary?: string;
  pruningType: string;
  pruningNotes?: string;
  commonDiseases?: string[];
  commonPests?: string[];
  diseaseSymptoms?: string;
  recommendedTreatments?: string;
  wateringMistakesSymptoms?: string;
  toxicToHumans: boolean;
  toxicToPets: boolean;
  toxicityNotes?: string;
  recommendedUsesText?: string;
  notesForBeginners?: string;
  images?: string[];
}

interface PlantSpeciesDetailPageProps {
  params: {
    slug: string;
  };
}

// Labels pour l'affichage
const monthLabels = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
];

const difficultyLabels: Record<string, { label: string; color: string; emoji: string }> = {
  VERY_EASY: { label: 'Très facile', color: 'bg-green-100 text-green-800', emoji: '😊' },
  EASY: { label: 'Facile', color: 'bg-green-100 text-green-800', emoji: '🙂' },
  INTERMEDIATE: { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800', emoji: '🤔' },
  EXPERT: { label: 'Expert', color: 'bg-red-100 text-red-800', emoji: '🧠' },
};

const climateLabels: Record<string, string> = {
  OCEANIC: 'Océanique',
  CONTINENTAL: 'Continental', 
  MEDITERRANEAN: 'Méditerranéen',
  MOUNTAIN: 'Montagnard',
  SEMI_CONTINENTAL: 'Semi-continental',
};


export async function generateMetadata({ params }: PlantSpeciesDetailPageProps): Promise<Metadata> {
  const species = await getPlantSpeciesBySlug(params.slug);
  
  if (!species) {
    return {
      title: 'Espèce non trouvée - Bible des plantes',
      description: 'Cette espèce n\'existe pas dans notre base de données.',
    };
  }

  return {
    title: `${species.commonNameFr} (${species.latinName}) - Guide de culture`,
    description: `Fiche complète du ${species.commonNameFr} : plantation, entretien, maladies. Conseils d'experts pour jardins français.`,
    openGraph: {
      title: `${species.commonNameFr} - Bible des plantes Growi`,
      description: species.notesForBeginners || `Guide complet pour cultiver ${species.commonNameFr}`,
      images: species.images || [],
    },
  };
}

export default async function PlantSpeciesDetailPage({ params }: PlantSpeciesDetailPageProps) {
  const species = await getPlantSpeciesBySlug(params.slug);

  if (!species) {
    notFound();
  }

  const difficulty = difficultyLabels[species.difficultyLevel] || difficultyLabels.EASY;
  const mainImage = species.images && species.images.length > 0 
    ? species.images[0] 
    : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  // Fonction helper pour afficher les mois
  const formatMonths = (months?: number[]): string => {
    if (!months || months.length === 0) return 'Non spécifié';
    return months.map(m => monthLabels[m - 1]).join(', ');
  };

  return (
    <div className="min-h-screen bg-growi-sand">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-growi-forest">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/bible-des-plantes" className="hover:text-growi-forest">Bible des plantes</Link>
          <span className="mx-2">›</span>
          <span className="text-growi-forest font-semibold">{species.commonNameFr}</span>
        </nav>

        {/* Header avec image */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-80 lg:h-96">
              <Image
                src={mainImage}
                alt={species.commonNameFr}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* En-tête infos */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins mb-2">
                  {species.commonNameFr}
                </h1>
                <p className="text-lg text-gray-600 italic mb-2">
                  {species.latinName}
                </p>
                {species.commonNameEn && (
                  <p className="text-gray-500">
                    Nom anglais : {species.commonNameEn}
                  </p>
                )}
                {species.aliases && species.aliases.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Aussi appelé : {species.aliases.join(', ')}
                  </p>
                )}
              </div>

              {/* Badges principaux */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
                  {difficulty.emoji} {difficulty.label}
                </span>
                
                {species.toxicToHumans && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    ⚠️ Toxique humains
                  </span>
                )}
                
                {species.toxicToPets && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    🐕 Toxique animaux
                  </span>
                )}
              </div>

              {/* Résumé débutant */}
              {species.notesForBeginners && (
                <div className="bg-growi-sand rounded-lg p-4">
                  <h3 className="font-semibold text-growi-forest mb-2 flex items-center gap-2">
                    💡 Conseil débutant
                  </h3>
                  <p className="text-gray-700">
                    {species.notesForBeginners}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu détaillé */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Adaptation climat français */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-growi-forest font-poppins mb-4 flex items-center gap-2">
                🇫🇷 Adaptée à votre jardin en France
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-growi-forest mb-3">Climats compatibles</h3>
                  <div className="space-y-2">
                    {species.suitableClimatesFr.map((climate) => (
                      <div key={climate} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{climateLabels[climate] || climate}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-growi-forest mb-3">Résistance</h3>
                  <div className="space-y-2">
                    {species.hardinessMinTempC && (
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">❄️</span>
                        <span>Résiste jusqu'à {species.hardinessMinTempC}°C</span>
                      </div>
                    )}
                    {species.matureHeightCm && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">📏</span>
                        <span>Taille adulte : {Math.round(species.matureHeightCm / 100)}m</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Conditions de culture */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-growi-forest font-poppins mb-4 flex items-center gap-2">
                🌱 Conditions de culture
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-growi-forest mb-2">☀️ Exposition</h3>
                  <p className="text-gray-700">{species.lightNeeds}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-growi-forest mb-2">💧 Arrosage</h3>
                  <p className="text-gray-700">{species.wateringFrequency}</p>
                  {species.wateringNotes && (
                    <p className="text-sm text-gray-500 mt-1">{species.wateringNotes}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-growi-forest mb-2">🌍 Sol</h3>
                  <p className="text-gray-700">{species.soilTypes.join(', ')}</p>
                  {species.soilPh && (
                    <p className="text-sm text-gray-500 mt-1">pH : {species.soilPh}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Calendrier */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-growi-forest font-poppins mb-4 flex items-center gap-2">
                📅 Calendrier d'entretien
              </h2>
              <div className="space-y-6">
                {/* Grille des mois */}
                <div className="grid grid-cols-12 gap-2">
                  {monthLabels.map((month, index) => (
                    <div key={month} className="text-center">
                      <div className="text-xs font-semibold text-gray-600 mb-2">
                        {month}
                      </div>
                      <div className="space-y-1">
                        {/* Plantation */}
                        {species.plantingPeriod?.includes(index + 1) && (
                          <div className="bg-green-100 text-green-800 text-xs px-1 py-1 rounded">
                            🌱
                          </div>
                        )}
                        {/* Floraison */}
                        {species.floweringPeriod?.includes(index + 1) && (
                          <div className="bg-pink-100 text-pink-800 text-xs px-1 py-1 rounded">
                            🌸
                          </div>
                        )}
                        {/* Récolte */}
                        {species.harvestPeriod?.includes(index + 1) && (
                          <div className="bg-orange-100 text-orange-800 text-xs px-1 py-1 rounded">
                            🍅
                          </div>
                        )}
                        {/* Taille */}
                        {species.pruningPeriod?.includes(index + 1) && (
                          <div className="bg-blue-100 text-blue-800 text-xs px-1 py-1 rounded">
                            ✂️
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Légende */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🌱</span>
                    <span>Plantation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">🌸</span>
                    <span>Floraison</span>
                  </div>
                  {species.harvestPeriod && species.harvestPeriod.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🍅</span>
                      <span>Récolte</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">✂️</span>
                    <span>Taille</span>
                  </div>
                </div>

                {/* Résumé entretien */}
                {species.maintenanceTasksSummary && (
                  <div className="bg-growi-sand rounded-lg p-4">
                    <h3 className="font-semibold text-growi-forest mb-2">📝 Résumé des tâches annuelles</h3>
                    <p className="text-gray-700">{species.maintenanceTasksSummary}</p>
                    {species.pruningNotes && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Taille :</strong> {species.pruningNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Santé et problèmes */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-growi-forest font-poppins mb-4 flex items-center gap-2">
                🏥 Santé de la plante
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-growi-forest mb-3">🦠 Maladies fréquentes</h3>
                  {species.commonDiseases && species.commonDiseases.length > 0 ? (
                    <ul className="space-y-1">
                      {species.commonDiseases.map((disease) => (
                        <li key={disease} className="text-gray-700 flex items-center gap-2">
                          <span className="text-red-400">•</span>
                          {disease}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Aucune maladie majeure</p>
                  )}

                  <h3 className="font-semibold text-growi-forest mb-3 mt-4">🐛 Ravageurs</h3>
                  {species.commonPests && species.commonPests.length > 0 ? (
                    <ul className="space-y-1">
                      {species.commonPests.map((pest) => (
                        <li key={pest} className="text-gray-700 flex items-center gap-2">
                          <span className="text-orange-400">•</span>
                          {pest}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Peu de ravageurs</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-growi-forest mb-3">🔍 Symptômes à surveiller</h3>
                  {species.diseaseSymptoms ? (
                    <p className="text-gray-700 mb-4">{species.diseaseSymptoms}</p>
                  ) : (
                    <p className="text-gray-500 mb-4">Surveillez l'état général</p>
                  )}

                  <h3 className="font-semibold text-growi-forest mb-3">🌿 Traitements recommandés</h3>
                  {species.recommendedTreatments ? (
                    <p className="text-gray-700">{species.recommendedTreatments}</p>
                  ) : (
                    <p className="text-gray-500">Préventif : bonnes conditions de culture</p>
                  )}

                  {species.wateringMistakesSymptoms && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <h4 className="text-sm font-semibold text-yellow-800 mb-1">💧 Erreurs d'arrosage</h4>
                      <p className="text-sm text-yellow-700">{species.wateringMistakesSymptoms}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Sécurité */}
            {(species.toxicToHumans || species.toxicToPets || species.toxicityNotes) && (
              <section className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-red-800 font-poppins mb-4 flex items-center gap-2">
                  ⚠️ Attention - Toxicité
                </h2>
                <div className="space-y-4">
                  {species.toxicToHumans && (
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-lg">👶</span>
                      <div>
                        <h3 className="font-semibold text-red-800">Toxique pour les humains</h3>
                        <p className="text-red-700">Éviter l'ingestion, porter des gants lors de la manipulation.</p>
                      </div>
                    </div>
                  )}
                  
                  {species.toxicToPets && (
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-lg">🐕</span>
                      <div>
                        <h3 className="font-semibold text-red-800">Toxique pour les animaux</h3>
                        <p className="text-red-700">Tenir éloigné des animaux de compagnie.</p>
                      </div>
                    </div>
                  )}

                  {species.toxicityNotes && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-red-800 mb-2">Précautions détaillées</h3>
                      <p className="text-red-700">{species.toxicityNotes}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Fiche technique */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-growi-forest font-poppins mb-4">
                📋 Fiche technique
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégorie :</span>
                  <span className="text-growi-forest font-medium">{species.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type :</span>
                  <span className="text-growi-forest font-medium">{species.plantEnvironmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulté :</span>
                  <span className="text-growi-forest font-medium">{difficulty.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exposition :</span>
                  <span className="text-growi-forest font-medium">{species.lightNeeds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrosage :</span>
                  <span className="text-growi-forest font-medium">{species.wateringFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidité :</span>
                  <span className="text-growi-forest font-medium">{species.humidityNeeds}</span>
                </div>
              </div>
            </div>

            {/* Calendrier simplifié */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-growi-forest font-poppins mb-4">
                📅 Calendrier
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 block">🌱 Plantation :</span>
                  <span className="text-growi-forest font-medium">{formatMonths(species.plantingPeriod)}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">🌸 Floraison :</span>
                  <span className="text-growi-forest font-medium">{formatMonths(species.floweringPeriod)}</span>
                </div>
                {species.harvestPeriod && species.harvestPeriod.length > 0 && (
                  <div>
                    <span className="text-gray-600 block">🍅 Récolte :</span>
                    <span className="text-growi-forest font-medium">{formatMonths(species.harvestPeriod)}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 block">✂️ Taille :</span>
                  <span className="text-growi-forest font-medium">{formatMonths(species.pruningPeriod)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-growi-sand rounded-xl p-6">
              <h2 className="text-xl font-bold text-growi-forest font-poppins mb-4">
                🚀 Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-growi-lime hover:bg-growi-forest text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  ⭐ Ajouter à mes favoris
                </button>
                <button className="w-full bg-white hover:bg-growi-lime hover:text-white text-growi-forest border border-growi-forest font-medium py-3 px-4 rounded-lg transition-colors">
                  📱 Ajouter à mon jardin Growi
                </button>
                <Link 
                  href="/bible-des-plantes"
                  className="block w-full text-center bg-transparent text-growi-forest hover:text-growi-lime font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  ← Retour à la Bible
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 86400; // Revalidation toutes les 24h