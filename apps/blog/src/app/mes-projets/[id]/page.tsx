'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthRedirect } from '@/lib/auth';
import Container, { Section } from '@/components/ui/container';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';

// Types
interface Project {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Garden {
  id: string;
  name: string;
  city: string;
  postalCode: string;
  totalAreaM2?: number;
  plantCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Plant {
  id: string;
  commonName: string;
  scientificName?: string;
  gardenName: string;
  zoneName?: string;
  isAlive: boolean;
  lastActivity?: string;
  lastActivityDate?: string;
  nextReminder?: string;
  nextReminderDate?: string;
  healthStatus: 'good' | 'warning' | 'danger';
  photosUrls: string[];
}

// Mock data for development
const mockProject: Project = {
  id: '1',
  name: 'Mon jardin principal',
  description: 'Jardin familial avec potager et espace détente pour cultiver légumes et aromates',
  coverImageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
  createdAt: '2024-03-15T10:00:00Z',
  updatedAt: '2024-10-14T08:30:00Z'
};

const mockGardens: Garden[] = [
  {
    id: '1',
    name: 'Jardin arrière',
    city: 'Lyon',
    postalCode: '69000',
    totalAreaM2: 150,
    plantCount: 3,
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-10-14T08:30:00Z'
  }
];

const mockPlants: Plant[] = [
  {
    id: '1',
    commonName: 'Tomates cerises',
    scientificName: 'Solanum lycopersicum',
    gardenName: 'Jardin arrière',
    zoneName: 'Potager',
    isAlive: true,
    lastActivity: 'Arrosage',
    lastActivityDate: '2024-10-13T08:30:00Z',
    nextReminder: 'Arroser les tomates',
    nextReminderDate: '2024-10-15T08:00:00Z',
    healthStatus: 'good',
    photosUrls: ['/images/tomates-cerises-1.jpg']
  },
  {
    id: '2',
    commonName: 'Laitues batavia',
    scientificName: 'Lactuca sativa',
    gardenName: 'Jardin arrière',
    zoneName: 'Potager',
    isAlive: true,
    lastActivity: 'Récolte',
    lastActivityDate: '2024-10-12T18:00:00Z',
    nextReminder: 'Planter nouvelles graines',
    nextReminderDate: '2024-10-16T10:00:00Z',
    healthStatus: 'good',
    photosUrls: []
  },
  {
    id: '3',
    commonName: 'Lavande vraie',
    scientificName: 'Lavandula angustifolia',
    gardenName: 'Jardin arrière',
    zoneName: 'Massif floral',
    isAlive: true,
    lastActivity: 'Taille',
    lastActivityDate: '2024-08-20T09:00:00Z',
    healthStatus: 'good',
    photosUrls: ['/images/lavande-1.jpg', '/images/lavande-2.jpg']
  }
];

const getHealthStatusColor = (status: Plant['healthStatus']) => {
  switch (status) {
    case 'good':
      return 'text-green-600 bg-green-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'danger':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ProjetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { redirectIfNotAuthenticated } = useAuthRedirect();
  const [activeTab, setActiveTab] = useState<'overview' | 'gardens' | 'plants' | 'plan'>('overview');
  
  const projectId = params.id as string;

  useEffect(() => {
    redirectIfNotAuthenticated('/login?redirect=/mes-projets');
  }, [redirectIfNotAuthenticated]);

  const handleBack = () => {
    router.push('/mes-projets');
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            ← Retour aux projets
          </Button>
        </div>

        {/* Project Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-green-800 mb-2">{mockProject.name}</h1>
            {mockProject.description && (
              <p className="text-gray-600 mb-4">{mockProject.description}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Créé le {formatDate(mockProject.createdAt)}</span>
              <span>•</span>
              <span>Modifié le {formatDate(mockProject.updatedAt)}</span>
            </div>
          </div>
          
          {mockProject.coverImageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={mockProject.coverImageUrl}
                alt={mockProject.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', count: null },
              { id: 'gardens', label: 'Jardins', count: mockGardens.length },
              { id: 'plants', label: 'Plantes', count: mockPlants.length },
              { id: 'plan', label: 'Plan', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card padding="md" className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{mockGardens.length}</div>
                <div className="text-gray-600">Jardin{mockGardens.length > 1 ? 's' : ''}</div>
              </Card>
              <Card padding="md" className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{mockPlants.length}</div>
                <div className="text-gray-600">Plante{mockPlants.length > 1 ? 's' : ''}</div>
              </Card>
              <Card padding="md" className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {mockGardens.reduce((sum, garden) => sum + (garden.totalAreaM2 || 0), 0)} m²
                </div>
                <div className="text-gray-600">Surface totale</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
              <Card padding="md">
                <div className="space-y-4">
                  {mockPlants
                    .filter(plant => plant.lastActivityDate)
                    .sort((a, b) => new Date(b.lastActivityDate!).getTime() - new Date(a.lastActivityDate!).getTime())
                    .slice(0, 5)
                    .map((plant) => (
                      <div key={plant.id} className="flex items-center gap-4 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <span className="font-medium">{plant.lastActivity}</span>
                          <span className="text-gray-600"> sur {plant.commonName}</span>
                          <div className="text-sm text-gray-500">
                            {plant.lastActivityDate && formatDateTime(plant.lastActivityDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'gardens' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Jardins</h2>
              <Button variant="lime" size="sm" disabled>
                + Ajouter un jardin
              </Button>
            </div>

            {mockGardens.length > 0 ? (
              <div className="grid gap-6">
                {mockGardens.map((garden) => (
                  <Card key={garden.id} padding="md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {garden.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>📍 {garden.city}, {garden.postalCode}</div>
                          {garden.totalAreaM2 && (
                            <div>📐 Surface: {garden.totalAreaM2} m²</div>
                          )}
                          <div>🌱 {garden.plantCount} plante{garden.plantCount > 1 ? 's' : ''}</div>
                          <div>📅 Créé le {formatDate(garden.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Gérer
                        </Button>
                        <Button variant="ghost" size="sm" disabled>
                          ⋮
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-6xl mb-4">🏡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun jardin configuré
                </h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez votre premier jardin pour commencer à organiser vos espaces verts
                </p>
                <Button variant="primary" disabled>
                  Ajouter mon premier jardin
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'plants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Plantes</h2>
              <Link href={`/mes-projets/${projectId}/plantes/nouveau`}>
                <Button variant="lime" size="sm">
                  + Ajouter une plante
                </Button>
              </Link>
            </div>

            {mockPlants.length > 0 ? (
              <div className="grid gap-4">
                {mockPlants.map((plant) => (
                  <Card key={plant.id} padding="md" className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {plant.commonName}
                          </h3>
                          <span className={`w-2 h-2 rounded-full ${getHealthStatusColor(plant.healthStatus)}`}></span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {plant.scientificName && (
                            <div className="italic">{plant.scientificName}</div>
                          )}
                          <div>
                            📍 {plant.gardenName}
                            {plant.zoneName && ` • ${plant.zoneName}`}
                          </div>
                          {plant.lastActivity && plant.lastActivityDate && (
                            <div>
                              📝 Dernière action: {plant.lastActivity} ({formatDateTime(plant.lastActivityDate)})
                            </div>
                          )}
                          {plant.nextReminder && plant.nextReminderDate && (
                            <div className="text-orange-600">
                              ⏰ Prochaine: {plant.nextReminder} ({formatDateTime(plant.nextReminderDate)})
                            </div>
                          )}
                        </div>

                        {plant.photosUrls.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {plant.photosUrls.slice(0, 3).map((url, index) => (
                              <div key={index} className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs">
                                📸
                              </div>
                            ))}
                            {plant.photosUrls.length > 3 && (
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                +{plant.photosUrls.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/mes-projets/${projectId}/plantes/${plant.id}`}>
                          <Button variant="outline" size="sm">
                            Voir détail
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" disabled>
                          ⋮
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune plante enregistrée
                </h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez vos premières plantes pour commencer le suivi
                </p>
                <Link href={`/mes-projets/${projectId}/plantes/nouveau`}>
                  <Button variant="primary">
                    Ajouter ma première plante
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Plan du jardin</h2>
            <Card padding="lg" className="text-center bg-gradient-to-br from-green-50 to-white">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
          </div>
        )}
      </div>
    </Container>
  );
}