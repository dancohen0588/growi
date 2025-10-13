import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/v1/blog`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Author {
  id: string;
  slug: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  subcategories?: Subcategory[];
  articleCount?: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  color?: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  contentMarkdown: string;
  contentHtml?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMin?: number;
  tableOfContents?: { id: string; title: string; level: number }[];
  keyTakeaways?: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  viewCount: number;
  author: Author;
  category: Category;
  subcategory?: Subcategory | null;
  tags: Tag[];
  relatedArticles?: Article[];
}

export interface BlogQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: 'publishedAt' | 'viewCount' | 'title';
  order?: 'asc' | 'desc';
}

export interface BlogResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API Functions
export async function getArticles(query: BlogQuery = {}): Promise<BlogResponse<Article[]>> {
  const { data } = await api.get('/articles', { params: query });
  return data;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await api.get(`/categories/${slug}`);
  return data;
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get('/tags');
  return data;
}

export async function getAuthorBySlug(slug: string): Promise<Author & { articleCount: number }> {
  const { data } = await api.get(`/authors/${slug}`);
  return data;
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const { data } = await api.get('/featured', { params: { limit } });
  return data;
}

export async function getPopularArticles(limit = 5): Promise<Article[]> {
  const { data } = await api.get('/popular', { params: { limit } });
  return data;
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      throw new Error('Contenu non trouvé');
    }
    if (error.response?.status >= 500) {
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
    throw error;
  }
);

export default api;