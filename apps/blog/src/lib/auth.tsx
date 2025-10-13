'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthTokens, LoginData, RegisterData, setAccessToken } from './api'
import * as api from './api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  updateUser: (user: User) => void
}

const ACCESS_TOKEN_KEY = 'growi_access_token'
const REFRESH_TOKEN_KEY = 'growi_refresh_token'
const USER_KEY = 'growi_user'

const storage = {
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  },
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = storage.getItem(ACCESS_TOKEN_KEY)
      const savedUser = storage.getItem(USER_KEY)
      
      if (savedToken && savedUser) {
        try {
          setAccessToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error loading auth:', error)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginData) => {
    const response = await api.login(credentials)
    storage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken)
    storage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken)
    storage.setItem(USER_KEY, JSON.stringify(response.user))
    setAccessToken(response.tokens.accessToken)
    setUser(response.user)
  }

  const register = async (data: RegisterData) => {
    const response = await api.register(data)
    storage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken)
    storage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken)
    storage.setItem(USER_KEY, JSON.stringify(response.user))
    setAccessToken(response.tokens.accessToken)
    setUser(response.user)
  }

  const logout = async () => {
    try {
      const refreshToken = storage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) {
        await api.logout(refreshToken)
      }
    } finally {
      storage.removeItem(ACCESS_TOKEN_KEY)
      storage.removeItem(REFRESH_TOKEN_KEY)
      storage.removeItem(USER_KEY)
      setAccessToken(null)
      setUser(null)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = storage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshTokenValue) return false

      const response = await api.refreshTokens({ refreshToken: refreshTokenValue })
      storage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken)
      storage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken)
      setAccessToken(response.tokens.accessToken)
      return true
    } catch {
      return false
    }
  }

  const updateUser = (updatedUser: User) => {
    storage.setItem(USER_KEY, JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function usePermissions() {
  const { user } = useAuth()
  
  return {
    isAdmin: user?.role === 'ADMIN',
    isEditor: user?.role === 'EDITOR' || user?.role === 'ADMIN',
    isUser: !!user,
  }
}

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth()
  
  return {
    redirectIfNotAuthenticated: (redirectTo: string = '/login') => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo
      }
    },
    redirectIfAuthenticated: (redirectTo: string = '/') => {
      if (!isLoading && isAuthenticated) {
        window.location.href = redirectTo
      }
    },
  }
}