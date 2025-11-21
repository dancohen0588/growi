'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/lib/auth';
import { gardenApi } from '@/lib/api-garden';
import Container, { Section } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';

interface CreateProjectData {
  name: string;
  description: string;
  coverImageUrl: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export default function NouveauProjetPage() {
  const router = useRouter();
  const { redirectIfNotAuthenticated } = useAuthRedirect();
  
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    coverImageUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);

  useEffect(() => {
    redirectIfNotAuthenticated('/login?redirect=/mes-projets/nouveau');
  }, [redirectIfNotAuthenticated]);

  const handleInputChange = (field: keyof CreateProjectData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (file: File) => {
    // Reset upload state
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null
    });

    // Clear any previous URL input
    setFormData(prev => ({ ...prev, coverImageUrl: '' }));

    try {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        throw new Error('Seuls les fichiers JPEG, PNG et WebP sont autorisés');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5 MB');
      }

      // Upload file
      const uploadResult = await gardenApi.uploadFile(file);
      
      // Update form data with uploaded file URL
      setFormData(prev => ({
        ...prev,
        coverImageUrl: `http://localhost:3000${uploadResult.url}`
      }));

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload'
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const project = await gardenApi.createProject({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        coverImageUrl: formData.coverImageUrl.trim() || undefined
      });
      
      // Redirect to project detail page
      router.push(`/mes-projets/${project.id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/mes-projets');
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
            ← Retour
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-green-800">Nouveau projet</h1>
        <p className="text-gray-600 mt-2">
          Créez un nouveau projet de jardinage pour organiser vos jardins et plantes
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom du projet *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Mon jardin potager"
                className="mt-1"
                maxLength={100}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre projet de jardinage..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                rows={4}
                maxLength={500}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-600 text-sm">{errors.description}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Cover Image Upload/URL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700">
                  Image de couverture
                </Label>
                <button
                  type="button"
                  onClick={() => setUseUrlInput(!useUrlInput)}
                  className="text-sm text-green-600 hover:text-green-700"
                  disabled={isLoading || uploadState.isUploading}
                >
                  {useUrlInput ? '📸 Upload fichier' : '🔗 Saisir URL'}
                </button>
              </div>

              {!useUrlInput ? (
                /* File Upload Area */
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                      ? 'border-green-500 bg-green-50'
                      : uploadState.error
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadState.isUploading ? (
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Upload en cours...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadState.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                          <span className="text-2xl">📸</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Glissez votre image ici ou
                          <label className="text-green-600 hover:text-green-700 cursor-pointer ml-1">
                            parcourez vos fichiers
                            <input
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleFileSelect}
                              disabled={isLoading || uploadState.isUploading}
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG, WebP • Max 5 MB
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {uploadState.error && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      {uploadState.error}
                    </div>
                  )}
                </div>
              ) : (
                /* URL Input */
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    🔗
                  </span>
                  <Input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="rounded-l-none"
                    disabled={isLoading || uploadState.isUploading}
                  />
                </div>
              )}

              <p className="text-gray-500 text-sm mt-1">
                {useUrlInput
                  ? 'Ajoutez l\'URL d\'une image pour illustrer votre projet (optionnel)'
                  : 'Téléchargez une image depuis votre ordinateur (optionnel)'
                }
              </p>
            </div>

            {/* Image Preview */}
            {formData.coverImageUrl && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Aperçu de l'image
                </Label>
                <div className="mt-1 relative">
                  <div className="w-full h-32 rounded-md border border-gray-300 overflow-hidden bg-gray-50">
                    <img
                      src={formData.coverImageUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    disabled={isLoading || uploadState.isUploading}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

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
                disabled={isLoading || uploadState.isUploading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création...
                  </span>
                ) : uploadState.isUploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Upload...
                  </span>
                ) : (
                  'Créer le projet'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}