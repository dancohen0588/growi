'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ImportResult {
  totalRows: number;
  successful: number;
  updated: number;
  errors: number;
  warnings: number;
  processingTime: number;
  previewMode: boolean;
  details: Array<{
    line: number;
    field: string;
    message: string;
    value?: any;
  }>;
  speciesIds: string[];
}

interface PreviewResult {
  sampleRows: any[];
  detectedColumns: string[];
  missingRequiredColumns: string[];
  unknownColumns: string[];
  estimatedRows: number;
  validationErrors: Array<{
    line: number;
    field: string;
    message: string;
    value?: any;
  }>;
}

export default function ImportCsvPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [options, setOptions] = useState({
    updateExisting: false,
    strictMode: false,
  });

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setPreview(null);
      setResult(null);
    } else {
      alert('Veuillez sélectionner un fichier CSV valide');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/plant-bible/admin/species/preview-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('growi_access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'aperçu');
      }

      const data = await response.json();
      setPreview(data.data);
    } catch (error) {
      console.error('Erreur preview:', error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('previewOnly', 'false');
      formData.append('updateExisting', String(options.updateExisting));
      formData.append('strictMode', String(options.strictMode));

      const response = await fetch('/api/v1/plant-bible/admin/species/import-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('growi_access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'import');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Erreur import:', error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/plant-bible/csv-template');

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const result = await response.json();
      const csvContent = result.data;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'template-especes-plantes.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin/plant-bible"
            className="text-growi-forest hover:text-growi-lime font-medium"
          >
            ← Retour
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-growi-forest font-poppins mb-2">
              Import Excel/CSV - Bible des plantes
            </h1>
            <p className="text-gray-600">
              Importez des centaines d'espèces en une seule fois
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Zone d'upload */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-growi-forest mb-4">1. Choisir le fichier CSV</h2>
              
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-growi-lime bg-growi-lime bg-opacity-5' 
                    : 'border-gray-300 hover:border-growi-lime'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Glissez votre fichier CSV ici
                </h3>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner un fichier
                </p>
                <button className="bg-growi-lime text-white px-4 py-2 rounded-lg hover:bg-growi-forest transition-colors">
                  📂 Parcourir les fichiers
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileSelect(selectedFile);
                }}
              />

              {file && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-gray-600">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                </div>
              )}

              {/* Options d'import */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Options d'import</h3>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.updateExisting}
                    onChange={(e) => setOptions({...options, updateExisting: e.target.checked})}
                    className="rounded border-gray-300 focus:ring-growi-lime focus:border-growi-lime"
                  />
                  <span>Mettre à jour les espèces existantes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.strictMode}
                    onChange={(e) => setOptions({...options, strictMode: e.target.checked})}
                    className="rounded border-gray-300 focus:ring-growi-lime focus:border-growi-lime"
                  />
                  <span>Mode strict (arrêt à la première erreur)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePreview}
                  disabled={!file || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  {loading ? '⏳' : '👁️'} Aperçu
                </button>
                
                <button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="bg-growi-lime hover:bg-growi-forest text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  {loading ? '⏳' : '📥'} Importer
                </button>
              </div>
            </div>
          </div>

          {/* Aide et template */}
          <div className="space-y-6">
            {/* Télécharger template */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-growi-forest mb-2">📋 Template CSV</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Téléchargez le modèle avec les bonnes colonnes et un exemple
              </p>
              <button
                onClick={downloadTemplate}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                📥 Télécharger le template
              </button>
            </div>

            {/* Conseils */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Conseils</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Format CSV avec séparateur virgule (,)</li>
                <li>• Encodage UTF-8 recommandé</li>
                <li>• Taille maximum : 5 MB</li>
                <li>• Utilisez le template pour le bon format</li>
                <li>• Testez avec l'aperçu avant l'import final</li>
              </ul>
            </div>

            {/* Colonnes obligatoires */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">⚠️ Colonnes obligatoires</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• nom_commun_fr</li>
                <li>• nom_latin</li>
                <li>• type_environnement</li>
                <li>• categorie</li>
                <li>• difficulte</li>
                <li>• vitesse_croissance</li>
                <li>• climats_fr</li>
                <li>• besoins_lumiere</li>
                <li>• frequence_arrosage</li>
                <li>• types_sol</li>
                <li>• humidite</li>
                <li>• duree_vie</li>
                <li>• type_feuillage</li>
                <li>• type_taille</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Aperçu du CSV */}
        {preview && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">👁️ Aperçu du fichier</h2>
            
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{preview.estimatedRows}</div>
                <div className="text-sm text-blue-800">Lignes détectées</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{preview.detectedColumns.length}</div>
                <div className="text-sm text-green-800">Colonnes trouvées</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{preview.validationErrors.length}</div>
                <div className="text-sm text-red-800">Erreurs validaton</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{preview.missingRequiredColumns.length}</div>
                <div className="text-sm text-orange-800">Colonnes manquantes</div>
              </div>
            </div>

            {preview.missingRequiredColumns.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">❌ Colonnes obligatoires manquantes :</h3>
                <div className="text-sm text-red-700">
                  {preview.missingRequiredColumns.join(', ')}
                </div>
              </div>
            )}

            {preview.unknownColumns.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-orange-800 mb-2">⚠️ Colonnes non reconnues :</h3>
                <div className="text-sm text-orange-700">
                  {preview.unknownColumns.join(', ')}
                </div>
              </div>
            )}

            {/* Échantillon */}
            <div className="overflow-x-auto">
              <h3 className="font-semibold mb-2">Échantillon (5 premières lignes) :</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Nom commun</th>
                    <th className="px-3 py-2 text-left">Nom latin</th>
                    <th className="px-3 py-2 text-left">Catégorie</th>
                    <th className="px-3 py-2 text-left">Difficulté</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sampleRows.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{row.nom_commun_fr}</td>
                      <td className="px-3 py-2 italic">{row.nom_latin}</td>
                      <td className="px-3 py-2">{row.categorie}</td>
                      <td className="px-3 py-2">{row.difficulte}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Erreurs de validation */}
            {preview.validationErrors.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-red-800 mb-3">🐛 Erreurs de validation :</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {preview.validationErrors.map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      <span className="font-medium">Ligne {error.line}</span> - 
                      <span className="text-red-700"> {error.field}</span>: {error.message}
                      {error.value && <span className="text-gray-600"> (valeur: "{error.value}")</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Résultat d'import */}
        {result && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-growi-forest mb-4">
              📊 Rapport d'import
            </h2>
            
            {/* Stats du résultat */}
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.totalRows}</div>
                <div className="text-sm text-blue-800">Total lignes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                <div className="text-sm text-green-800">Importées</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{result.updated}</div>
                <div className="text-sm text-yellow-800">Mises à jour</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.errors}</div>
                <div className="text-sm text-red-800">Erreurs</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.processingTime}ms</div>
                <div className="text-sm text-purple-800">Durée</div>
              </div>
            </div>

            {result.successful > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ {result.successful} espèce{result.successful > 1 ? 's' : ''} importée{result.successful > 1 ? 's' : ''} avec succès !
                </h3>
                <Link 
                  href="/admin/plant-bible"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  → Voir la liste mise à jour
                </Link>
              </div>
            )}

            {/* Détails des erreurs */}
            {result.details.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-red-800 mb-3">
                  🐛 Détail des erreurs :
                </h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {result.details.map((detail, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                      <div className="font-medium">Ligne {detail.line} - {detail.field}</div>
                      <div className="text-red-700 mt-1">{detail.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}