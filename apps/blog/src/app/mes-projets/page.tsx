'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthRedirect } from '@/lib/auth';
import { gardenApi, OverviewDto } from '@/lib/api-garden';
import Container, { Section } from '@/components/ui/container';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';

// Types pour les faux-données
interface Project {
  id: string;
  name: string;
  surface: string;
  plantCount: number;
  status: 'active' | 'winter' | 'planning';
  lastUpdate: string;
  image?: string;
}

interface UserPlant {
  id: string;
  species: string;
  name?: string;
  location: string;
  lastAction: {
    type: 'watering' | 'pruning' | 'fertilizing';
    date: string;
  };
  nextReminder: {
    type: 'watering' | 'pruning' | 'fertilizing';
    date: string;
  };
  health: 'excellent' | 'good' | 'attention';
}

interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  forecast: string;
}

// Faux-données
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Potager principal',
    surface: '25 m²',
    plantCount: 12,
    status: 'active',
    lastUpdate: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Jardin aromatique',
    surface: '8 m²',
    plantCount: 6,
    status: 'active',
    lastUpdate: '2024-01-08',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Serre d\'hiver',
    surface: '12 m²',
    plantCount: 8,
    status: 'winter',
    lastUpdate: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop',
  }
]

const mockPlants: UserPlant[] = [
  {
    id: '1',
    species: 'Tomates cerises',
    name: 'Mes tomates du balcon',
    location: 'Potager principal',
    lastAction: { type: 'watering', date: '2024-01-10' },
    nextReminder: { type: 'pruning', date: '2024-01-15' },
    health: 'excellent',
  },
  {
    id: '2',
    species: 'Basilic',
    location: 'Jardin aromatique',
    lastAction: { type: 'fertilizing', date: '2024-01-08' },
    nextReminder: { type: 'watering', date: '2024-01-12' },
    health: 'good',
  },
  {
    id: '3',
    species: 'Monstera deliciosa',
    name: 'Mon monstera géant',
    location: 'Serre d\'hiver',
    lastAction: { type: 'watering', date: '2024-01-05' },
    nextReminder: { type: 'watering', date: '2024-01-12' },
    health: 'attention',
  }
]

const mockWeather: WeatherInfo = {
  location: 'Paris, France',
  temperature: 8,
  condition: 'Nuageux',
  humidity: 75,
  forecast: "Temps favorable pour l'arrosage en intérieur",
};

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'winter':
      return 'bg-blue-100 text-blue-800';
    case 'planning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: Project['status']) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'winter':
      return 'Hivernage';
    case 'planning':
      return 'Planification';
    default:
      return 'Inconnu';
  }
};

const getHealthColor = (health: UserPlant['health']) => {
  switch (health) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-yellow-600';
    case 'attention':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getActionIcon = (type: string) => {
  switch (type) {
    case 'watering':
      return '💧';
    case 'pruning':
      return '✂️';
    case 'fertilizing':
      return '🌱';
    default:
      return '📝';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
};

export default function MesProjetsPAge() {
  const { redirectIfNotAuthenticated } = useAuthRedirect();
  const [overviewData, setOverviewData] = useState<OverviewDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    redirectIfNotAuthenticated('/login?redirect=/mes-projets');
  }, [redirectIfNotAuthenticated]);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsLoading(true);
        const data = await gardenApi.getOverview();
        setOverviewData(data);
      } catch (err) {
        console.error('Error loading overview:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    // Load data only if user is likely authenticated
    const token = localStorage.getItem('growi_access_token');
    if (token) {
      loadOverviewData();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos projets...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <Card padding="lg" className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  // Use real data if available, fallback to mock data
  const projects = overviewData?.projects || mockProjects;
  const plants = overviewData?.plants || mockPlants;
  const weather = overviewData?.weather || mockWeather;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins mb-2">
            Mes projets
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez vos espaces verts et suivez vos plantes en un coup d'œil
          </p>
        </div>

        {/* Section Mes Projets */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-growi-forest font-poppins">
              Mes projets ({projects.length})
            </h2>
            <Link href="/mes-projets/nouveau">
              <Button variant="lime" size="sm">
                + Nouveau projet
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} variant="elevated" padding="none" className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-growi-sand/20 overflow-hidden">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-growi-forest/40">
                        <span className="text-4xl">🌿</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <CardHeader className="p-0 mb-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-growi-forest text-lg">
                          {project.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Actif
                        </span>
                      </div>
                    </CardHeader>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Jardins :</span>
                        <span className="font-medium">{project.gardenCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plantes :</span>
                        <span className="font-medium">{overviewData?.totalPlants || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernière MAJ :</span>
                        <span className="font-medium">{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/mes-projets/${project.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Voir le détail →
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <div className="text-6xl mb-4">🏡</div>
              <h3 className="text-xl font-semibold text-growi-forest mb-2">
                Aucun projet pour le moment
              </h3>
              <p className="text-gray-600 mb-4">
                Créez votre premier projet de jardinage pour commencer à suivre vos plantes
              </p>
              <Link href="/mes-projets/nouveau">
                <Button variant="primary">
                  Créer mon premier projet
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Section Mes Plantes */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-growi-forest font-poppins">
              Mes plantes ({plants.length})
            </h2>
            <Button variant="outline" size="sm">
              + Ajouter une plante
            </Button>
          </div>

          {plants.length > 0 ? (
            <div className="grid gap-4">
              {plants.map((plant) => (
                <Card key={plant.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-growi-forest">
                          {plant.commonName}
                        </h3>
                        <span className={`text-sm font-medium ${getHealthColor(plant.healthStatus)}`}>
                          ●
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {plant.scientificName || plant.commonName} • {plant.gardenName}
                        {plant.zoneName && ` • ${plant.zoneName}`}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        {plant.lastActivity && plant.lastActivityDate && (
                          <span>
                            Dernière action: {plant.lastActivity} {formatDate(plant.lastActivityDate)}
                          </span>
                        )}
                        {plant.nextReminder && plant.nextReminderDate && (
                          <span>
                            Prochaine: {plant.nextReminder} {formatDate(plant.nextReminderDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-growi-forest mb-2">
                Aucune plante enregistrée
              </h3>
              <p className="text-gray-600 mb-4">
                Ajoutez vos premières plantes pour recevoir des conseils personnalisés
              </p>
              <Button variant="primary">
                Ajouter ma première plante
              </Button>
            </Card>
          )}
        </section>

        {/* Section Plan du Jardin */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-growi-forest font-poppins mb-6">
            Plan du jardin
          </h2>
          <Card padding="lg" className="text-center bg-gradient-to-br from-growi-sand/20 to-white">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-growi-forest mb-2">
              Plan interactif bientôt disponible
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Visualisez et organisez vos espaces verts avec notre outil de planification interactif
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" disabled>
                📸 Importer un plan
              </Button>
              <Button variant="outline" disabled>
                ✏️ Créer un plan
              </Button>
            </div>
          </Card>
        </section>

        {/* Section Informations générales */}
        <section>
          <h2 className="text-2xl font-semibold text-growi-forest font-poppins mb-6">
            Informations générales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Météo */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-growi-forest flex items-center gap-2">
                  🌤️ Météo locale
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Température</span>
                    <span className="font-semibold text-xl">
                      {weather?.tempAvgC ? `${Math.round(weather.tempAvgC)}°C` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conditions</span>
                    <span className="font-medium">
                      {weather?.frostRisk ? 'Risque de gel' : 'Normal'}
                    </span>
                  </div>
                  {weather?.rainfallMm !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Précipitations</span>
                      <span className="font-medium">{weather.rainfallMm} mm</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      💡 {weather?.sunshineHours ? `${weather.sunshineHours}h de soleil aujourd'hui` : 'Données météo limitées'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils saisonniers */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-growi-forest flex items-center gap-2">
                  📅 Conseils de saison
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-xl">🌿</span>
                    <div>
                      <p className="font-medium text-sm">Janvier - Planification</p>
                      <p className="text-xs text-gray-600">
                        Préparez vos semis d'intérieur et planifiez vos cultures de printemps
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">💧</span>
                    <div>
                      <p className="font-medium text-sm">Arrosage modéré</p>
                      <p className="text-xs text-gray-600">
                        Réduisez la fréquence d'arrosage en hiver pour éviter la pourriture
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">🏠</span>
                    <div>
                      <p className="font-medium text-sm">Protection du froid</p>
                      <p className="text-xs text-gray-600">
                        Protégez vos plantes fragiles avec un voile d'hivernage
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>
    </div>
  )
}