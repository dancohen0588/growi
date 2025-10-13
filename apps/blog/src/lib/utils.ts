import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Moins d\'1 min';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Aujourd\'hui';
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
  return `Il y a ${Math.floor(diffInDays / 365)} ans`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-'); // Évite les tirets multiples
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getContrastColor(hexColor: string): 'black' | 'white' {
  // Supprime le # si présent
  const hex = hexColor.replace('#', '');
  
  // Convertit en RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcule la luminance relative
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}

export function generateExcerpt(content: string, maxLength = 160): string {
  // Supprime le markdown basique
  const cleanContent = content
    .replace(/#+\s/g, '') // Titres
    .replace(/\*\*(.*?)\*\*/g, '$1') // Gras
    .replace(/\*(.*?)\*/g, '$1') // Italique
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Liens
    .replace(/```[\s\S]*?```/g, '') // Blocs de code
    .replace(/`(.*?)`/g, '$1') // Code inline
    .trim();
  
  return truncateText(cleanContent, maxLength);
}