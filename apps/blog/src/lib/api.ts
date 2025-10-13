const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_TIMEOUT = 10000 // 10 secondes

// Types API
export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  publishedAt: Date
  readingTime: number
  author: {
    id: number
    name: string
    slug: string
    avatar?: string
  }
  category: {
    id: number
    name: string
    slug: string
    color: string
  }
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  featured: boolean
  views: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color: string
  articlesCount: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  articlesCount: number
}

export interface Author {
  id: number
  name: string
  slug: string
  bio?: string
  avatar?: string
  articlesCount: number
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Interface pour le formulaire de contact
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  consent: boolean
}

export interface ContactResponse {
  success: boolean
  message: string
}

// Configuration des fetch avec timeout
class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await this.fetchWithTimeout(url, options)
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Articles
  async getArticles(params?: {
    page?: number
    limit?: number
    category?: string
    tag?: string
    author?: string
    search?: string
    featured?: boolean
  }): Promise<ApiResponse<Article[]>> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    const endpoint = `/api/v1/v1/blog/articles${query ? `?${query}` : ''}`
    
    return this.request<ApiResponse<Article[]>>(endpoint)
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/api/v1/v1/blog/articles/${slug}`)
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const response = await this.request<ApiResponse<Article[]>>('/api/v1/v1/blog/featured')
    return response.data
  }

  async getPopularArticles(): Promise<Article[]> {
    const response = await this.request<ApiResponse<Article[]>>('/api/v1/v1/blog/popular')
    return response.data
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/api/v1/v1/blog/categories')
    return response.data
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/api/v1/v1/blog/categories/${slug}`)
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await this.request<ApiResponse<Tag[]>>('/api/v1/v1/blog/tags')
    return response.data
  }

  // Authors
  async getAuthorBySlug(slug: string): Promise<Author> {
    return this.request<Author>(`/api/v1/v1/blog/authors/${slug}`)
  }

  async getArticlesByAuthor(authorSlug: string, params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<Article[]>> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    const endpoint = `/api/v1/v1/blog/authors/${authorSlug}/articles${query ? `?${query}` : ''}`
    
    return this.request<ApiResponse<Article[]>>(endpoint)
  }

  // Contact form
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    return this.request<ContactResponse>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// Instance singleton de l'API client
export const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT)

// Export des méthodes pour une utilisation facile
export const getArticles = (params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  author?: string
  search?: string
  featured?: boolean
}) => apiClient.getArticles(params)

export const getArticleBySlug = (slug: string) => apiClient.getArticleBySlug(slug)
export const getFeaturedArticles = () => apiClient.getFeaturedArticles()
export const getPopularArticles = () => apiClient.getPopularArticles()
export const getCategories = () => apiClient.getCategories()
export const getCategoryBySlug = (slug: string) => apiClient.getCategoryBySlug(slug)
export const getTags = () => apiClient.getTags()
export const getAuthorBySlug = (slug: string) => apiClient.getAuthorBySlug(slug)
export const getArticlesByAuthor = (authorSlug: string, params?: {
  page?: number
  limit?: number
}) => apiClient.getArticlesByAuthor(authorSlug, params)

// Contact form
export const submitContactForm = (data: ContactFormData) => apiClient.submitContactForm(data)

// Helpers pour la gestion des erreurs
export function isApiError(error: unknown): error is Error {
  return error instanceof Error
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  return 'Une erreur inconnue est survenue'
}