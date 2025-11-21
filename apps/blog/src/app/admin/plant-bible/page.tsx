'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// TODO: Remplacer par les vrais types API
interface PlantSpecies {
  id: string;
  slug: string;
  commonNameFr: string;
  latinName: string;
  category: string;
  difficultyLevel: string;
  suitableClimatesFr: string[];
  plantEnvironmentType: string;
  isActive: boolean;
  updatedAt: string;
}

const mockSpecies: PlantSpecies[] = [
  {
    id: '1',
    slug: 'rosier-buisson',
    commonNameFr: 'Rosier buisson',
    latinName: 'Rosa x hybrida',
    category: 'SHRUB', 
    difficultyLevel: 'EASY',
    suitableClimatesFr: ['OCEANIC', 'CONTINENTAL', 'MEDITERRANEAN'],
    plantEnvironmentType: 'OUTDOOR',
    isActive: true,
    updatedAt: '2024-11-19T10:00:00Z',
  },
  // Autres espèces...
];

const categoryLabels: Record<string, string> = {
  SHRUB: 'Arbuste',
  TREE: 'Arbre',
  PERENNIAL: 'Vivace',
  ANNUAL: 'Annuelle',
  HERB: 'Aromatique',
  VEGETABLE: 'Potagère',
};

const difficultyLabels: Record<string, string> = {
  VERY_EASY: 'Très facile',
  EASY: 'Facile',
  INTERMEDIATE: 'Intermédiaire',
  EXPERT: 'Expert',
};

export default function AdminPlantBiblePage() {
  const [species, setSpecies] = useState<PlantSpecies[]>(mockSpecies);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Filtrage local (sera remplacé par API)
  const filteredSpecies = species.filter((plant) => {
    const matchesSearch = plant.commonNameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.latinName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || plant.category === categoryFilter;
    const matchesType = !typeFilter || plant.plantEnvironmentType === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      // TODO: Appel API DELETE
      setSpecies(prev => prev.filter(p => p.id !== id));
      alert('Espèce supprimée avec succès');
    }
  };

  const handleExportCsv = async () => {
    try {
      // Récupérer toutes les espèces avec pagination
      let allSpecies = [];
      let page = 1;
      const pageSize = 100;
      let totalPages = 1;

      do {
        const response = await fetch(`http://localhost:3000/api/v1/plant-bible/species?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        const pageData = data.data.data || [];
        allSpecies = [...allSpecies, ...pageData];
        
        totalPages = data.data.meta.totalPages;
        page++;
      } while (page <= totalPages);

      // Convertir en format CSV
      const csvHeaders = [
        'nom_commun_fr', 'nom_commun_en', 'nom_latin', 'aliases',
        'type_environnement', 'categorie', 'tags_usage', 'difficulte', 'vitesse_croissance',
        'hauteur_cm', 'largeur_cm', 'climats_fr', 'temp_min_c',
        'tolerance_cotiere', 'tolerance_urbaine', 'besoins_lumiere', 'frequence_arrosage', 'notes_arrosage',
        'types_sol', 'ph_sol', 'humidite', 'duree_vie', 'type_feuillage', 'type_taille',
        'notes_debutants', 'toxique_humains', 'toxique_animaux'
      ];

      const csvRows = allSpecies.map((species: any) => [
        species.commonNameFr || '',
        species.commonNameEn || '',
        species.latinName || '',
        (species.aliases || []).join(';'),
        species.plantEnvironmentType || '',
        species.category || '',
        (species.usageTags || []).join(';'),
        species.difficultyLevel || '',
        species.growthSpeed || '',
        species.matureHeightCm || '',
        species.matureWidthCm || '',
        (species.suitableClimatesFr || []).join(';'),
        species.hardinessMinTempC || '',
        species.coastalTolerance || '',
        species.urbanTolerance || '',
        species.lightNeeds || '',
        species.wateringFrequency || '',
        species.wateringNotes || '',
        (species.soilTypes || []).join(';'),
        species.soilPh || '',
        species.humidityNeeds || '',
        species.lifespanType || '',
        species.foliageType || '',
        species.pruningType || '',
        species.notesForBeginners || '',
        species.toxicToHumans || '',
        species.toxicToPets || ''
      ]);

      // Créer le contenu CSV
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bible-plantes-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Export réussi : ${allSpecies.length} espèces exportées`);
    } catch (error) {
      console.error('Erreur export CSV:', error);
      alert(`Erreur lors de l'export : ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-growi-forest font-poppins mb-2">
              Bible des plantes - Administration
            </h1>
            <p className="text-gray-600">
              Gestion de la base de données des espèces de plantes
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/admin/plant-bible/import"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              📥 Import CSV
            </Link>
            <Link
              href="/admin/plant-bible/nouveau"
              className="bg-growi-lime hover:bg-growi-forest text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              ➕ Nouvelle espèce
            </Link>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom commun ou latin..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-growi-lime"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-growi-lime"
              >
                <option value="">Toutes les catégories</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-growi-lime"
              >
                <option value="">Tous les types</option>
                <option value="INDOOR">Intérieur</option>
                <option value="OUTDOOR">Extérieur</option>
                <option value="MIXED">Mixte</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setTypeFilter('');
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-growi-forest">{species.length}</div>
            <div className="text-sm text-gray-600">Total espèces</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{species.filter(p => p.isActive).length}</div>
            <div className="text-sm text-gray-600">Actives</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{species.filter(p => !p.isActive).length}</div>
            <div className="text-sm text-gray-600">Inactives</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-growi-lime">{filteredSpecies.length}</div>
            <div className="text-sm text-gray-600">Résultats</div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-growi-sand">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Espèce</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Nom latin</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Catégorie</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Difficulté</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Climats</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-growi-forest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSpecies.map((plant) => (
                  <tr key={plant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-growi-forest">{plant.commonNameFr}</div>
                        <div className="text-sm text-gray-500">/{plant.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 italic">
                      {plant.latinName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-growi-sand text-growi-forest rounded-full">
                        {categoryLabels[plant.category] || plant.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {plant.plantEnvironmentType === 'INDOOR' ? 'Intérieur' :
                       plant.plantEnvironmentType === 'OUTDOOR' ? 'Extérieur' : 'Mixte'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        plant.difficultyLevel === 'VERY_EASY' || plant.difficultyLevel === 'EASY'
                          ? 'bg-green-100 text-green-800'
                          : plant.difficultyLevel === 'INTERMEDIATE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {difficultyLabels[plant.difficultyLevel] || plant.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {plant.suitableClimatesFr.length} climat{plant.suitableClimatesFr.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        plant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/bible-des-plantes/${plant.slug}`}
                          className="text-growi-forest hover:text-growi-lime text-sm font-medium"
                          target="_blank"
                        >
                          👁️ Voir
                        </Link>
                        <Link
                          href={`/admin/plant-bible/${plant.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          ✏️ Éditer
                        </Link>
                        <button
                          onClick={() => handleDelete(plant.id, plant.commonNameFr)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSpecies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune espèce trouvée</h3>
              <p className="text-gray-600 mb-4">
                Aucune espèce ne correspond à vos critères de recherche.
              </p>
              <Link
                href="/admin/plant-bible/nouveau"
                className="inline-flex items-center gap-2 bg-growi-lime text-white px-4 py-2 rounded-lg hover:bg-growi-forest transition-colors"
              >
                ➕ Ajouter la première espèce
              </Link>
            </div>
          )}
        </div>

        {/* Actions en lot */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-growi-forest mb-4">Actions en lot</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCsv}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📤 Exporter CSV
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              📥 Importer CSV
            </button>
            <button className="bg-growi-lime hover:bg-growi-forest text-white px-4 py-2 rounded-lg transition-colors">
              🌱 Lancer le seed (500+ espèces)
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              🔄 Régénérer les slugs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}