'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types temporaires (seront remplacés par les vrais types API)
interface CreatePlantFormData {
  commonNameFr: string;
  commonNameEn: string;
  latinName: string;
  aliases: string;
  plantEnvironmentType: string;
  category: string;
  usageTags: string;
  difficultyLevel: string;
  growthSpeed: string;
  matureHeightCm: string;
  matureWidthCm: string;
  suitableClimatesFr: string[];
  hardinessMinTempC: string;
  coastalTolerance: boolean;
  urbanTolerance: boolean;
  lightNeeds: string;
  wateringFrequency: string;
  wateringNotes: string;
  soilTypes: string[];
  soilPh: string;
  humidityNeeds: string;
  plantingPeriod: boolean[];
  floweringPeriod: boolean[];
  harvestPeriod: boolean[];
  pruningPeriod: boolean[];
  lifespanType: string;
  foliageType: string;
  notesForBeginners: string;
  toxicToHumans: boolean;
  toxicToPets: boolean;
  toxicityNotes: string;
  recommendedUsesText: string;
  seoTitle: string;
  seoDescription: string;
}

const initialFormData: CreatePlantFormData = {
  commonNameFr: '',
  commonNameEn: '',
  latinName: '',
  aliases: '',
  plantEnvironmentType: 'OUTDOOR',
  category: 'SHRUB',
  usageTags: '',
  difficultyLevel: 'EASY',
  growthSpeed: 'MEDIUM',
  matureHeightCm: '',
  matureWidthCm: '',
  suitableClimatesFr: [],
  hardinessMinTempC: '',
  coastalTolerance: false,
  urbanTolerance: false,
  lightNeeds: 'SUN',
  wateringFrequency: 'MODERATE',
  wateringNotes: '',
  soilTypes: [],
  soilPh: 'NEUTRAL',
  humidityNeeds: 'MEDIUM',
  plantingPeriod: new Array(12).fill(false),
  floweringPeriod: new Array(12).fill(false),
  harvestPeriod: new Array(12).fill(false),
  pruningPeriod: new Array(12).fill(false),
  lifespanType: 'PERENNIAL',
  foliageType: 'DECIDUOUS',
  notesForBeginners: '',
  toxicToHumans: false,
  toxicToPets: false,
  toxicityNotes: '',
  recommendedUsesText: '',
  seoTitle: '',
  seoDescription: '',
};

const monthNames = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
];

export default function NewPlantSpeciesPage() {
  const [formData, setFormData] = useState<CreatePlantFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation basique
      const newErrors: Record<string, string> = {};
      
      if (!formData.commonNameFr.trim()) {
        newErrors.commonNameFr = 'Le nom commun français est obligatoire';
      }
      if (!formData.latinName.trim()) {
        newErrors.latinName = 'Le nom latin est obligatoire';
      }
      if (formData.suitableClimatesFr.length === 0) {
        newErrors.suitableClimatesFr = 'Au moins un climat français doit être sélectionné';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // TODO: Appel API création
      console.log('Création espèce:', formData);
      alert('Espèce créée avec succès !');
      
      // Redirection vers la liste admin
      window.location.href = '/admin/plant-bible';
      
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création de l\'espèce');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreatePlantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur si corrigée
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMonthToggle = (field: 'plantingPeriod' | 'floweringPeriod' | 'harvestPeriod' | 'pruningPeriod', monthIndex: number) => {
    const newPeriod = [...formData[field]];
    newPeriod[monthIndex] = !newPeriod[monthIndex];
    handleInputChange(field, newPeriod);
  };

  const handleMultiSelect = (field: 'suitableClimatesFr' | 'soilTypes', value: string, checked: boolean) => {
    const currentValues = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentValues, value]);
    } else {
      handleInputChange(field, currentValues.filter(v => v !== value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-growi-forest font-poppins mb-2">
              Nouvelle espèce de plante
            </h1>
            <p className="text-gray-600">
              Ajouter une nouvelle espèce à la Bible des plantes
            </p>
          </div>
          
          <Link
            href="/admin/plant-bible"
            className="text-growi-forest hover:text-growi-lime font-medium"
          >
            ← Retour à la liste
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identité */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">🆔 Identité</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom commun français *
                </label>
                <input
                  type="text"
                  value={formData.commonNameFr}
                  onChange={(e) => handleInputChange('commonNameFr', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-growi-lime ${
                    errors.commonNameFr ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ex: Rosier buisson"
                />
                {errors.commonNameFr && <p className="mt-1 text-sm text-red-600">{errors.commonNameFr}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom commun anglais
                </label>
                <input
                  type="text"
                  value={formData.commonNameEn}
                  onChange={(e) => handleInputChange('commonNameEn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                  placeholder="ex: Bush Rose"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom latin *
                </label>
                <input
                  type="text"
                  value={formData.latinName}
                  onChange={(e) => handleInputChange('latinName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-growi-lime ${
                    errors.latinName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ex: Rosa x hybrida"
                />
                {errors.latinName && <p className="mt-1 text-sm text-red-600">{errors.latinName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autres noms (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.aliases}
                  onChange={(e) => handleInputChange('aliases', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                  placeholder="ex: Rosier hybride, Rose de jardin"
                />
              </div>
            </div>
          </div>

          {/* Catégories & usages */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">🏷️ Catégories & usages</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de plante</label>
                <select
                  value={formData.plantEnvironmentType}
                  onChange={(e) => handleInputChange('plantEnvironmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                >
                  <option value="OUTDOOR">Extérieur</option>
                  <option value="INDOOR">Intérieur</option>
                  <option value="MIXED">Mixte</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                >
                  <option value="SHRUB">Arbuste</option>
                  <option value="TREE">Arbre</option>
                  <option value="PERENNIAL">Vivace</option>
                  <option value="ANNUAL">Annuelle</option>
                  <option value="CLIMBING">Grimpante</option>
                  <option value="BULB">Bulbe</option>
                  <option value="HERB">Aromatique</option>
                  <option value="VEGETABLE">Potagère</option>
                  <option value="GROUNDCOVER">Couvre-sol</option>
                  <option value="HEDGE">Haie</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de difficulté</label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                >
                  <option value="VERY_EASY">Très facile</option>
                  <option value="EASY">Facile</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags d'usage (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.usageTags}
                onChange={(e) => handleInputChange('usageTags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                placeholder="ex: ornementale, massif, bordure"
              />
            </div>
          </div>

          {/* Climat & conditions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">🇫🇷 Climat & conditions de culture</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Climats français adaptés *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['OCEANIC', 'CONTINENTAL', 'MEDITERRANEAN', 'MOUNTAIN', 'SEMI_CONTINENTAL'].map((climate) => (
                  <label key={climate} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.suitableClimatesFr.includes(climate)}
                      onChange={(e) => handleMultiSelect('suitableClimatesFr', climate, e.target.checked)}
                      className="text-growi-lime"
                    />
                    <span className="text-sm">
                      {climate === 'OCEANIC' ? 'Océanique' :
                       climate === 'CONTINENTAL' ? 'Continental' :
                       climate === 'MEDITERRANEAN' ? 'Méditerranéen' :
                       climate === 'MOUNTAIN' ? 'Montagnard' : 'Semi-continental'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.suitableClimatesFr && <p className="mt-1 text-sm text-red-600">{errors.suitableClimatesFr}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exposition</label>
                <select
                  value={formData.lightNeeds}
                  onChange={(e) => handleInputChange('lightNeeds', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                >
                  <option value="SHADE">Ombre</option>
                  <option value="PARTIAL_SHADE">Mi-ombre</option>
                  <option value="SUN">Soleil</option>
                  <option value="FULL_SUN">Plein soleil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Besoin en eau</label>
                <select
                  value={formData.wateringFrequency}
                  onChange={(e) => handleInputChange('wateringFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                >
                  <option value="VERY_LOW">Très peu</option>
                  <option value="LOW">Peu</option>
                  <option value="MODERATE">Modéré</option>
                  <option value="HIGH">Beaucoup</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Température mini (°C)</label>
                <input
                  type="number"
                  value={formData.hardinessMinTempC}
                  onChange={(e) => handleInputChange('hardinessMinTempC', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                  placeholder="ex: -15"
                  min="-40"
                  max="50"
                />
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">📅 Calendrier</h2>
            
            {(['plantingPeriod', 'floweringPeriod', 'harvestPeriod', 'pruningPeriod'] as const).map((period) => (
              <div key={period} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {period === 'plantingPeriod' ? '🌱 Plantation' :
                   period === 'floweringPeriod' ? '🌸 Floraison' :
                   period === 'harvestPeriod' ? '🍅 Récolte' : '✂️ Taille'}
                </label>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {monthNames.map((month, index) => (
                    <label key={month} className="flex flex-col items-center gap-1 cursor-pointer">
                      <span className="text-xs text-gray-600">{month}</span>
                      <input
                        type="checkbox"
                        checked={formData[period][index]}
                        onChange={() => handleMonthToggle(period, index)}
                        className="text-growi-lime"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes & SEO */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">📝 Conseils & SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conseils pour débutants
                </label>
                <textarea
                  value={formData.notesForBeginners}
                  onChange={(e) => handleInputChange('notesForBeginners', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                  placeholder="Conseils clairs et concrets pour jardiniers débutants..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommandations d'utilisation
                </label>
                <textarea
                  value={formData.recommendedUsesText}
                  onChange={(e) => handleInputChange('recommendedUsesText', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                  placeholder="Idées d'implantation dans un jardin français..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre SEO</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description SEO</label>
                  <input
                    type="text"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                    placeholder="Description pour les moteurs de recherche"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">⚠️ Sécurité & toxicité</h2>
            <div className="space-y-4">
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.toxicToHumans}
                    onChange={(e) => handleInputChange('toxicToHumans', e.target.checked)}
                    className="text-red-500"
                  />
                  <span className="text-sm">Toxique pour les humains</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.toxicToPets}
                    onChange={(e) => handleInputChange('toxicToPets', e.target.checked)}
                    className="text-orange-500"
                  />
                  <span className="text-sm">Toxique pour les animaux</span>
                </label>
              </div>
              
              {(formData.toxicToHumans || formData.toxicToPets) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes de toxicité
                  </label>
                  <textarea
                    value={formData.toxicityNotes}
                    onChange={(e) => handleInputChange('toxicityNotes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime"
                    placeholder="Parties toxiques, symptômes, précautions..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-end bg-white rounded-xl p-6 shadow-sm">
            <Link
              href="/admin/plant-bible"
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-growi-lime hover:bg-growi-forest text-white font-medium rounded-lg transition-colors disabled:bg-gray-300"
            >
              {isSubmitting ? 'Création en cours...' : '✅ Créer l\'espèce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}