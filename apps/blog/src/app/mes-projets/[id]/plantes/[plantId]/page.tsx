'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/lib/auth';
import Container from '@/components/ui/container';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';

// Types
interface Plant {
  id: string;
  commonName: string;
  scientificName?: string;
  plantType: string;
  cycle?: string;
  plantedAt?: string;
  estimatedAgeMonths?: number;
  exposure?: string;
  waterNeed?: string;
  wateringFrequencyDays?: number;
  wateringType?: string;
  substrate?: string;
  photosUrls: string[];
  isAlive: boolean;
  notes?: string;
  garden: {
    id: string;
    name: string;
  };
  zone?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  type: string;
  occurredAt: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  photoUrls: string[];
}

interface Reminder {
  id: string;
  title: string;
  description?: string;
  status: string;
  nextAt: string;
}

// Mock data
const mockPlant: Plant = {
  id: '1',
  commonName: 'Tomates cerises',
  scientificName: 'Solanum lycopersicum',
  plantType: 'VEGETABLE',
  cycle: 'ANNUAL',
  plantedAt: '2024-04-15T00:00:00Z',
  estimatedAgeMonths: 6,
  exposure: 'FULL_SUN',
  waterNeed: 'HIGH',
  wateringFrequencyDays: 2,
  wateringType: 'DRIP',
  substrate: 'Terre de jardin enrichie compost',
  photosUrls: ['/images/tomates-cerises-1.jpg', '/images/tomates-cerises-2.jpg'],
  isAlive: true,
  notes: 'Variété très productive, récolte depuis juillet',
  garden: {
    id: '1',
    name: 'Jardin arrière'
  },
  zone: {
    id: '1',
    name: 'Potager'
  },
  createdAt: '2024-04-15T10:00:00Z',
  updatedAt: '2024-10-13T08:30:00Z'
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'WATERING',
    occurredAt: '2024-10-13T08:30:00Z',
    quantity: 2.0,
    unit: 'litres',
    notes: 'Arrosage matinal avant la chaleur',
    photoUrls: []
  },
  {
    id: '2',
    type: 'HARVEST',
    occurredAt: '2024-10-12T18:00:00Z',
    quantity: 0.8,
    unit: 'kg',
    notes: 'Belle récolte de tomates bien mûres',
    photoUrls: ['/images/harvest-tomatoes.jpg']
  },
  {
    id: '3',
    type: 'FERTILIZING',
    occurredAt: '2024-09-20T09:00:00Z',
    notes: 'Apport d\'engrais liquide pour tomates',
    photoUrls: []
  },
  {
    id: '4',
    type: 'PRUNING',
    occurredAt: '2024-08-15T16:30:00Z',
    notes: 'Suppression des gourmands et feuilles du bas',
    photoUrls: []
  }
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Arroser les tomates',
    description: 'Vérifier l\'humidité du sol et arroser si nécessaire',
    status: 'PENDING',
    nextAt: '2024-10-15T08:00:00Z'
  },
  {
    id: '2',
    title: 'Récolte des derniers fruits',
    description: 'Récolter les tomates vertes avant les gelées',
    status: 'PENDING',
    nextAt: '2024-10-25T10:00:00Z'
  }
];

// Helper functions
const getPlantTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'TREE': 'Arbre',
    'SHRUB': 'Arbuste',
    'FLOWER': 'Fleur',
    'VEGETABLE': 'Légume',
    'HERB': 'Herbe aromatique',
    'LAWN': 'Gazon',
    'VINE': 'Plante grimpante',
    'SUCCULENT': 'Plante grasse',
    'OTHER': 'Autre'
  };
  return labels[type] || type;
};

const getCycleLabel = (cycle: string): string => {
  const labels: Record<string, string> = {
    'ANNUAL': 'Annuelle',
    'PERENNIAL': 'Vivace',
    'BIENNIAL': 'Bisannuelle',
    'EVERGREEN': 'Persistant',
    'DECIDUOUS': 'Caduc'
  };
  return labels[cycle] || cycle;
};

const getExposureLabel = (exposure: string): string => {
  const labels: Record<string, string> = {
    'FULL_SUN': 'Plein soleil',
    'PART_SHADE': 'Mi-ombre',
    'SHADE': 'Ombre'
  };
  return labels[exposure] || exposure;
};

const getWaterNeedLabel = (waterNeed: string): string => {
  const labels: Record<string, string> = {
    'LOW': 'Faible',
    'MEDIUM': 'Modéré',
    'HIGH': 'Élevé'
  };
  return labels[waterNeed] || waterNeed;
};

const getActivityTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'WATERING': 'Arrosage',
    'PRUNING': 'Taille',
    'FERTILIZING': 'Fertilisation',
    'TREATMENT': 'Traitement',
    'HARVEST': 'Récolte',
    'REPOTTING': 'Rempotage',
    'SOWING': 'Semis',
    'TRANSPLANTING': 'Transplantation',
    'OBSERVATION': 'Observation',
    'DISEASE': 'Maladie',
    'PEST': 'Nuisible'
  };
  return labels[type] || type;
};

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'WATERING': '💧',
    'PRUNING': '✂️',
    'FERTILIZING': '🌱',
    'TREATMENT': '💊',
    'HARVEST': '🥕',
    'REPOTTING': '🪴',
    'SOWING': '🌰',
    'TRANSPLANTING': '🌿',
    'OBSERVATION': '👁️',
    'DISEASE': '🦠',
    'PEST': '🐛'
  };
  return icons[type] || '📝';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
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

const calculateAge = (plantedAt: string): string => {
  const plantDate = new Date(plantedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - plantDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mois`;
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} an${years > 1 ? 's' : ''} ${months > 0 ? `et ${months} mois` : ''}`;
  }
};

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { redirectIfNotAuthenticated } = useAuthRedirect();
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'reminders' | 'care'>('overview');
  
  const projectId = params.id as string;
  const plantId = params.plantId as string;

  useEffect(() => {
    redirectIfNotAuthenticated('/login?redirect=/mes-projets');
  }, [redirectIfNotAuthenticated]);

  const handleBack = () => {
    router.push(`/mes-projets/${projectId}`);
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
            ← Retour au projet
          </Button>
        </div>

        {/* Plant Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-green-800">{mockPlant.commonName}</h1>
              <div className={`w-3 h-3 rounded-full ${mockPlant.isAlive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            {mockPlant.scientificName && (
              <p className="text-gray-600 italic mb-2">{mockPlant.scientificName}</p>
            )}
            
            <div className="flex gap-4 text-sm text-gray-500 mb-4">
              <span>{getPlantTypeLabel(mockPlant.plantType)}</span>
              {mockPlant.cycle && (
                <>
                  <span>•</span>
                  <span>{getCycleLabel(mockPlant.cycle)}</span>
                </>
              )}
              {mockPlant.plantedAt && (
                <>
                  <span>•</span>
                  <span>Planté il y a {calculateAge(mockPlant.plantedAt)}</span>
                </>
              )}
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>📍 {mockPlant.garden.name}</span>
              {mockPlant.zone && (
                <>
                  <span>•</span>
                  <span>{mockPlant.zone.name}</span>
                </>
              )}
            </div>

            {mockPlant.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{mockPlant.notes}</p>
              </div>
            )}
          </div>
          
          {mockPlant.photosUrls.length > 0 && (
            <div className="space-y-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={mockPlant.photosUrls[0]}
                  alt={mockPlant.commonName}
                  className="w-full h-full object-cover"
                />
              </div>
              {mockPlant.photosUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-1">
                  {mockPlant.photosUrls.slice(1, 4).map((url, index) => (
                    <div key={index} className="aspect-square rounded bg-gray-100 overflow-hidden">
                      <img
                        src={url}
                        alt={`Photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'activities', label: 'Activités', count: mockActivities.length },
              { id: 'reminders', label: 'Rappels', count: mockReminders.length },
              { id: 'care', label: 'Soins' }
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
                {tab.count !== undefined && (
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
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plant Details */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type :</span>
                    <span className="font-medium">{getPlantTypeLabel(mockPlant.plantType)}</span>
                  </div>
                  {mockPlant.cycle && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cycle :</span>
                      <span className="font-medium">{getCycleLabel(mockPlant.cycle)}</span>
                    </div>
                  )}
                  {mockPlant.plantedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de plantation :</span>
                      <span className="font-medium">{formatDate(mockPlant.plantedAt)}</span>
                    </div>
                  )}
                  {mockPlant.estimatedAgeMonths && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Âge estimé :</span>
                      <span className="font-medium">{mockPlant.estimatedAgeMonths} mois</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">État :</span>
                    <span className={`font-medium ${mockPlant.isAlive ? 'text-green-600' : 'text-red-600'}`}>
                      {mockPlant.isAlive ? 'En vie' : 'Décédé'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Care Requirements */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Besoins et soins</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPlant.exposure && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exposition :</span>
                      <span className="font-medium">{getExposureLabel(mockPlant.exposure)}</span>
                    </div>
                  )}
                  {mockPlant.waterNeed && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Besoin en eau :</span>
                      <span className="font-medium">{getWaterNeedLabel(mockPlant.waterNeed)}</span>
                    </div>
                  )}
                  {mockPlant.wateringFrequencyDays && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fréquence d'arrosage :</span>
                      <span className="font-medium">Tous les {mockPlant.wateringFrequencyDays} jours</span>
                    </div>
                  )}
                  {mockPlant.substrate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Substrat :</span>
                      <span className="font-medium">{mockPlant.substrate}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Historique des activités</h2>
              <Button variant="lime" size="sm" disabled>
                + Nouvelle activité
              </Button>
            </div>

            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <Card key={activity.id} padding="md">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {getActivityTypeLabel(activity.type)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(activity.occurredAt)}
                        </span>
                      </div>
                      
                      {(activity.quantity || activity.unit) && (
                        <p className="text-sm text-gray-600 mb-1">
                          Quantité : {activity.quantity} {activity.unit}
                        </p>
                      )}
                      
                      {activity.notes && (
                        <p className="text-sm text-gray-700 mb-2">{activity.notes}</p>
                      )}
                      
                      {activity.photoUrls.length > 0 && (
                        <div className="flex gap-2">
                          {activity.photoUrls.map((url, index) => (
                            <div key={index} className="w-16 h-16 rounded bg-gray-200 overflow-hidden">
                              <img
                                src={url}
                                alt={`Photo activité ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {mockActivities.length === 0 && (
                <Card padding="lg" className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucune activité enregistrée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez à suivre les soins apportés à cette plante
                  </p>
                  <Button variant="primary" disabled>
                    Ajouter une activité
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Rappels</h2>
              <Button variant="lime" size="sm" disabled>
                + Nouveau rappel
              </Button>
            </div>

            <div className="space-y-4">
              {mockReminders.map((reminder) => (
                <Card key={reminder.id} padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {reminder.title}
                      </h3>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-orange-600">
                          📅 Prévu pour le {formatDateTime(reminder.nextAt)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.status === 'PENDING' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {reminder.status === 'PENDING' ? 'En attente' : 'Terminé'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Marquer fait
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        ⋮
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {mockReminders.length === 0 && (
                <Card padding="lg" className="text-center">
                  <div className="text-6xl mb-4">⏰</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun rappel configuré
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Configurez des rappels pour ne jamais oublier de prendre soin de cette plante
                  </p>
                  <Button variant="primary" disabled>
                    Créer un rappel
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Care Guidelines */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Conseils d'entretien</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-xl">💧</span>
                    <div>
                      <p className="font-medium text-sm">Arrosage</p>
                      <p className="text-xs text-gray-600">
                        {mockPlant.wateringFrequencyDays 
                          ? `Arroser tous les ${mockPlant.wateringFrequencyDays} jours en été`
                          : 'Arrosage selon les besoins de la plante'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">☀️</span>
                    <div>
                      <p className="font-medium text-sm">Exposition</p>
                      <p className="text-xs text-gray-600">
                        {mockPlant.exposure 
                          ? `Placer en ${getExposureLabel(mockPlant.exposure).toLowerCase()}`
                          : 'Adapter selon les besoins de la variété'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">🌱</span>
                    <div>
                      <p className="font-medium text-sm">Fertilisation</p>
                      <p className="text-xs text-gray-600">
                        Fertiliser régulièrement pendant la période de croissance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card padding="md">
              <CardHeader className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    💧 Enregistrer un arrosage
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    ✂️ Noter une taille
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    🌱 Ajouter un engrais
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    📸 Ajouter une photo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    📝 Ajouter une note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
}