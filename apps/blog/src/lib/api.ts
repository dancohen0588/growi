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

// Types d'authentification
export interface User {
  id: string
  email: string
  role: 'USER' | 'EDITOR' | 'ADMIN'
  firstName?: string
  lastName?: string
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  emailVerifiedAt?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RefreshData {
  refreshToken: string
}

export interface RequestPasswordResetData {
  email: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
}

export interface UserProfile {
  user: User
}

// Types pour l'admin des utilisateurs
export interface CreateUserData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: User['role']
  status?: User['status']
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  role?: User['role']
  status?: User['status']
}

export interface UserFilters {
  role?: User['role']
  status?: User['status']
  search?: string
  page?: number
  limit?: number
  sort?: string
}

export interface PaginatedUsers {
  users: User[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UserStats {
  total: number
  byStatus: {
    active: number
    suspended: number
    pending: number
  }
  byRole: {
    [key: string]: number
  }
}

export interface PasswordResetResult {
  temporaryPassword: string
  message: string
}

// Configuration des fetch avec timeout
class ApiClient {
  private baseUrl: string
  private timeout: number
  private accessToken: string | null = null

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      // Ajouter le token d'authentification si disponible
      if (this.accessToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${this.accessToken}`
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
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
    const endpoint = `/api/v1/blog/articles${query ? `?${query}` : ''}`
    
    return this.request<ApiResponse<Article[]>>(endpoint)
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/api/v1/blog/articles/${slug}`)
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const response = await this.request<ApiResponse<Article[]>>('/api/v1/blog/featured')
    return response.data
  }

  async getPopularArticles(): Promise<Article[]> {
    const response = await this.request<ApiResponse<Article[]>>('/api/v1/blog/popular')
    return response.data
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/api/v1/blog/categories')
    return response.data
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/api/v1/blog/categories/${slug}`)
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await this.request<ApiResponse<Tag[]>>('/api/v1/blog/tags')
    return response.data
  }

  // Authors
  async getAuthorBySlug(slug: string): Promise<Author> {
    return this.request<Author>(`/api/v1/blog/authors/${slug}`)
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
    const endpoint = `/api/v1/blog/authors/${authorSlug}/articles${query ? `?${query}` : ''}`
    
    return this.request<ApiResponse<Article[]>>(endpoint)
  }

  // Contact form
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    return this.request<ContactResponse>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // ===== AUTHENTIFICATION =====

  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Refresh des tokens
  async refreshTokens(data: RefreshData): Promise<{ tokens: AuthTokens }> {
    return this.request<{ tokens: AuthTokens }>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Déconnexion
  async logout(refreshToken: string): Promise<void> {
    await this.request<void>('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
  }

  // Profil utilisateur
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/v1/auth/me')
  }

  // Demande de reset mot de passe
  async requestPasswordReset(data: RequestPasswordResetData): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Reset mot de passe
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.request<void>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // ===== ADMIN - GESTION UTILISATEURS =====

  // Liste des utilisateurs
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    const searchParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    })

    const query = searchParams.toString()
    const endpoint = `/api/v1/admin/users${query ? `?${query}` : ''}`
    
    return this.request<PaginatedUsers>(endpoint)
  }

  // Statistiques utilisateurs
  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/api/v1/admin/users/stats')
  }

  // Détail utilisateur
  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${id}`)
  }

  // Créer utilisateur
  async createUser(data: CreateUserData, sendInvitation = false): Promise<User> {
    const searchParams = new URLSearchParams()
    if (sendInvitation) {
      searchParams.set('sendInvitation', 'true')
    }

    const query = searchParams.toString()
    const endpoint = `/api/v1/admin/users${query ? `?${query}` : ''}`

    return this.request<User>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Mettre à jour utilisateur
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // Activer/Désactiver utilisateur
  async toggleUserStatus(id: string): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${id}/toggle-status`, {
      method: 'PATCH'
    })
  }

  // Reset mot de passe utilisateur
  async resetUserPassword(id: string): Promise<PasswordResetResult> {
    return this.request<PasswordResetResult>(`/api/v1/admin/users/${id}/reset-password`, {
      method: 'POST'
    })
  }

  // Supprimer utilisateur
  async deleteUser(id: string): Promise<void> {
    await this.request<void>(`/api/v1/admin/users/${id}`, {
      method: 'DELETE'
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

// ===== EXPORTS AUTHENTIFICATION =====
export const register = (data: RegisterData) => apiClient.register(data)
export const login = (data: LoginData) => apiClient.login(data)
export const refreshTokens = (data: RefreshData) => apiClient.refreshTokens(data)
export const logout = (refreshToken: string) => apiClient.logout(refreshToken)
export const getProfile = () => apiClient.getProfile()
export const requestPasswordReset = (data: RequestPasswordResetData) => apiClient.requestPasswordReset(data)
export const resetPassword = (data: ResetPasswordData) => apiClient.resetPassword(data)

// ===== EXPORTS ADMIN =====
export const getUsers = (filters?: UserFilters) => apiClient.getUsers(filters)
export const getUserStats = () => apiClient.getUserStats()
export const getUserById = (id: string) => apiClient.getUserById(id)
export const createUser = (data: CreateUserData, sendInvitation?: boolean) => apiClient.createUser(data, sendInvitation)
export const updateUser = (id: string, data: UpdateUserData) => apiClient.updateUser(id, data)
export const toggleUserStatus = (id: string) => apiClient.toggleUserStatus(id)
export const resetUserPassword = (id: string) => apiClient.resetUserPassword(id)
export const deleteUser = (id: string) => apiClient.deleteUser(id)

// Méthode pour définir le token d'accès
export const setAccessToken = (token: string | null) => apiClient.setAccessToken(token)
export const getAccessToken = () => apiClient.getAccessToken()

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