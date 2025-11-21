'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface PlantSpeciesSearchProps {
  initialValue?: string;
  placeholder?: string;
}

export function PlantSpeciesSearch({ 
  initialValue = '', 
  placeholder = 'Rechercher une plante...' 
}: PlantSpeciesSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounce pour éviter trop de requêtes
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    
    // Revenir à la page 1 lors d'une nouvelle recherche
    params.delete('page');
    
    router.push(`/bible-des-plantes?${params.toString()}`);
  };

  // Déclencher la recherche quand le terme débounced change
  useEffect(() => {
    if (debouncedSearchTerm !== initialValue) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    handleSearch('');
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-sm">🔍</span>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-growi-lime transition-colors"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Suggestions de recherche populaires */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Recherches populaires :</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Rosier',
            'Lavande', 
            'Hortensia',
            'Tomate',
            'Monstera',
            'Basilic'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setSearchTerm(suggestion);
                handleSearch(suggestion);
              }}
              className="text-xs bg-growi-sand hover:bg-growi-lime hover:text-white text-growi-forest px-3 py-1 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}