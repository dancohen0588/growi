'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/lib/auth';
import { gardenApi } from '@/lib/api-garden';
import Container from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';

// Plant form data interface
interface CreatePlantData {
  gardenId: string;
  zoneId: string;
  scientificName: string;
  commonName: string;
  plantType: string;
  cycle: string;
  plantedAt: string;
  estimatedAgeMonths: string;
  exposure: string;
  waterNeed: string;
  wateringFrequencyDays: string;
  wateringType: string;
  substrate: string;
  notes: string;
}

// Enum options for dropdowns
const plantTypeOptions = [
  { value: 'TREE', label: 'Arbre' },
  { value: 'SHRUB', label: 'Arbuste' },
  { value: 'FLOWER', label: 'Fleur' },
  { value: 'VEGETABLE', label: 'Légume' },
  { value: 'HERB', label: 'Herbe aromatique' },
  { value: 'LAWN', label: 'Gazon' },
  { value: 'VINE', label: 'Plante grimpante' },
  { value: 'SUCCULENT', label: 'Plante grasse' },
  { value: 'OTHER', label: 'Autre' }
];

const cycleOptions = [
  { value: 'ANNUAL', label: 'Annuelle' },
  { value: 'PERENNIAL', label: 'Vivace' },
  { value: 'BIENNIAL', label: 'Bisannuelle' },
  { value: 'EVERGREEN', label: 'Persistant' },
  { value: 'DECIDUOUS', label: 'Caduc' }
];

const exposureOptions = [
  { value: 'FULL_SUN', label: 'Plein soleil' },
  { value: 'PART_SHADE', label: 'Mi-ombre' },
  { value: 'SHADE', label: 'Ombre' }
];

const waterNeedOptions = [
  { value: 'LOW', label: 'Faible' },
  { value: 'MEDIUM', label: 'Modéré' },
  { value: 'HIGH', label: 'Élevé' }
];

const wateringTypeOptions = [
  { value: 'MANUAL', label: 'Manuel' },
  { value: 'DRIP', label: 'Goutte à goutte' },
  { value: 'AUTOMATIC', label: 'Automatique' },
  { value: 'NONE', label: 'Aucun' }
];

// Mock gardens for selection
const mockGardens = [
  { id: '1', name: 'Jardin arrière' },
  { id: '2', name: 'Serre d\'hiver' }
];

const mockZones = [
  { id: '1', name: 'Potager', gardenId: '1' },
  { id: '2', name: 'Massif floral', gardenId: '1' },
  { id: '3', name: 'Zone tropicale', gardenId: '2' }
];

export default function NouvelleePlantePage() {
  const params = useParams();
  const router = useRouter();
  const { redirectIfNotAuthenticated } = useAuthRedirect();
  
  const projectId = params.id as string;

  const [formData, setFormData] = useState<CreatePlantData>({
    gardenId: '',
    zoneId: '',
    scientificName: '',
    commonName: '',
    plantType: '',
    cycle: '',
    plantedAt: '',
    estimatedAgeMonths: '',
    exposure: '',
    waterNeed: '',
    wateringFrequencyDays: '',
    wateringType: '',
    substrate: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableZones, setAvailableZones] = useState(mockZones);

  useEffect(() => {
    redirectIfNotAuthenticated('/login?redirect=/mes-projets');
  }, [redirectIfNotAuthenticated]);

  // Filter zones based on selected garden
  useEffect(() => {
    if (formData.gardenId) {
      setAvailableZones(mockZones.filter(zone => zone.gardenId === formData.gardenId));
      setFormData(prev => ({ ...prev, zoneId: '' }));
    } else {
      setAvailableZones([]);
    }
  }, [formData.gardenId]);

  const handleInputChange = (field: keyof CreatePlantData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.commonName.trim()) {
      newErrors.commonName = 'Le nom de la plante est requis';
    }

    if (!formData.plantType) {
      newErrors.plantType = 'Le type de plante est requis';
    }

    if (!formData.gardenId) {
      newErrors.gardenId = 'Le jardin est requis';
    }

    if (formData.wateringFrequencyDays && isNaN(Number(formData.wateringFrequencyDays))) {
      newErrors.wateringFrequencyDays = 'La fréquence doit être un nombre';
    }

    if (formData.estimatedAgeMonths && isNaN(Number(formData.estimatedAgeMonths))) {
      newErrors.estimatedAgeMonths = 'L\'âge doit être un nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const payload: any = {
        gardenId: formData.gardenId,
        commonName: formData.commonName.trim(),
        plantType: formData.plantType,
      };

      // Add optional fields only if they have values
      if (formData.zoneId) payload.zoneId = formData.zoneId;
      if (formData.scientificName.trim()) payload.scientificName = formData.scientificName.trim();
      if (formData.cycle) payload.cycle = formData.cycle;
      if (formData.plantedAt) payload.plantedAt = formData.plantedAt;
      if (formData.estimatedAgeMonths) payload.estimatedAgeMonths = Number(formData.estimatedAgeMonths);
      if (formData.exposure) payload.exposure = formData.exposure;
      if (formData.waterNeed) payload.waterNeed = formData.waterNeed;
      if (formData.wateringFrequencyDays) payload.wateringFrequencyDays = Number(formData.wateringFrequencyDays);
      if (formData.wateringType) payload.wateringType = formData.wateringType;
      if (formData.substrate.trim()) payload.substrate = formData.substrate.trim();
      if (formData.notes.trim()) payload.notes = formData.notes.trim();

      // Default location as center point
      payload.location = {
        type: 'point',
        coordinates: [0.5, 0.5] // Center of the plan
      };

      const plant = await gardenApi.createPlant(payload);
      
      // Redirect to plant detail page
      router.push(`/mes-projets/${projectId}/plantes/${plant.id}`);
      
    } catch (error) {
      console.error('Error creating plant:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/mes-projets/${projectId}`);
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            ← Retour au projet
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-green-800">Ajouter une plante</h1>
        <p className="text-gray-600 mt-2">
          Ajoutez une nouvelle plante à votre jardin pour commencer le suivi
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Garden Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gardenId" className="text-sm font-medium text-gray-700">
                  Jardin *
                </Label>
                <select
                  id="gardenId"
                  value={formData.gardenId}
                  onChange={(e) => handleInputChange('gardenId', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un jardin</option>
                  {mockGardens.map(garden => (
                    <option key={garden.id} value={garden.id}>
                      {garden.name}
                    </option>
                  ))}
                </select>
                {errors.gardenId && (
                  <p className="text-red-600 text-sm mt-1">{errors.gardenId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zoneId" className="text-sm font-medium text-gray-700">
                  Zone (optionnel)
                </Label>
                <select
                  id="zoneId"
                  value={formData.zoneId}
                  onChange={(e) => handleInputChange('zoneId', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading || !formData.gardenId}
                >
                  <option value="">Aucune zone spécifique</option>
                  {availableZones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Plant Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commonName" className="text-sm font-medium text-gray-700">
                  Nom commun *
                </Label>
                <Input
                  id="commonName"
                  type="text"
                  value={formData.commonName}
                  onChange={(e) => handleInputChange('commonName', e.target.value)}
                  placeholder="Tomates cerises"
                  className="mt-1"
                  disabled={isLoading}
                />
                {errors.commonName && (
                  <p className="text-red-600 text-sm mt-1">{errors.commonName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="scientificName" className="text-sm font-medium text-gray-700">
                  Nom scientifique
                </Label>
                <Input
                  id="scientificName"
                  type="text"
                  value={formData.scientificName}
                  onChange={(e) => handleInputChange('scientificName', e.target.value)}
                  placeholder="Solanum lycopersicum"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Plant Type and Cycle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantType" className="text-sm font-medium text-gray-700">
                  Type de plante *
                </Label>
                <select
                  id="plantType"
                  value={formData.plantType}
                  onChange={(e) => handleInputChange('plantType', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un type</option>
                  {plantTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.plantType && (
                  <p className="text-red-600 text-sm mt-1">{errors.plantType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cycle" className="text-sm font-medium text-gray-700">
                  Cycle
                </Label>
                <select
                  id="cycle"
                  value={formData.cycle}
                  onChange={(e) => handleInputChange('cycle', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un cycle</option>
                  {cycleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Planting Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantedAt" className="text-sm font-medium text-gray-700">
                  Date de plantation
                </Label>
                <Input
                  id="plantedAt"
                  type="date"
                  value={formData.plantedAt}
                  onChange={(e) => handleInputChange('plantedAt', e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="estimatedAgeMonths" className="text-sm font-medium text-gray-700">
                  Âge estimé (mois)
                </Label>
                <Input
                  id="estimatedAgeMonths"
                  type="number"
                  min="0"
                  value={formData.estimatedAgeMonths}
                  onChange={(e) => handleInputChange('estimatedAgeMonths', e.target.value)}
                  placeholder="6"
                  className="mt-1"
                  disabled={isLoading}
                />
                {errors.estimatedAgeMonths && (
                  <p className="text-red-600 text-sm mt-1">{errors.estimatedAgeMonths}</p>
                )}
              </div>
            </div>

            {/* Care Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="exposure" className="text-sm font-medium text-gray-700">
                  Exposition
                </Label>
                <select
                  id="exposure"
                  value={formData.exposure}
                  onChange={(e) => handleInputChange('exposure', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Choisir exposition</option>
                  {exposureOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="waterNeed" className="text-sm font-medium text-gray-700">
                  Besoin en eau
                </Label>
                <select
                  id="waterNeed"
                  value={formData.waterNeed}
                  onChange={(e) => handleInputChange('waterNeed', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Choisir besoin</option>
                  {waterNeedOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="wateringFrequencyDays" className="text-sm font-medium text-gray-700">
                  Fréquence arrosage (jours)
                </Label>
                <Input
                  id="wateringFrequencyDays"
                  type="number"
                  min="1"
                  value={formData.wateringFrequencyDays}
                  onChange={(e) => handleInputChange('wateringFrequencyDays', e.target.value)}
                  placeholder="3"
                  className="mt-1"
                  disabled={isLoading}
                />
                {errors.wateringFrequencyDays && (
                  <p className="text-red-600 text-sm mt-1">{errors.wateringFrequencyDays}</p>
                )}
              </div>
            </div>

            {/* Watering Type and Substrate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wateringType" className="text-sm font-medium text-gray-700">
                  Type d'arrosage
                </Label>
                <select
                  id="wateringType"
                  value={formData.wateringType}
                  onChange={(e) => handleInputChange('wateringType', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Choisir type d'arrosage</option>
                  {wateringTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="substrate" className="text-sm font-medium text-gray-700">
                  Substrat/Terre
                </Label>
                <Input
                  id="substrate"
                  type="text"
                  value={formData.substrate}
                  onChange={(e) => handleInputChange('substrate', e.target.value)}
                  placeholder="Terre de jardin enrichie"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes et observations sur cette plante..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                rows={3}
                maxLength={1000}
                disabled={isLoading}
              />
              <p className="text-gray-500 text-sm mt-1">
                {formData.notes.length}/1000
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="lime"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ajout...
                  </span>
                ) : (
                  'Ajouter la plante'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}