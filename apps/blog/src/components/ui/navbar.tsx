'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth, usePermissions } from '@/lib/auth'

interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

const navItems: NavItem[] = [
  { label: 'Fonctionnalités', href: '/#fonctionnalites' },
  { label: 'Premium', href: '/#premium' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pro', href: '/#pro' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname.startsWith('/blog')
    }
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-growi-sand shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🌱</span>
            <span className="text-2xl font-bold text-growi-forest font-poppins">
              Growi
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors relative ${
                  isActive(item.href)
                    ? 'text-growi-forest' 
                    : 'text-gray-600 hover:text-growi-forest'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-growi-lime rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            <AuthSection />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Menu mobile"
          >
            <span className={`h-0.5 w-6 bg-growi-forest transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 w-6 bg-growi-forest transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-growi-forest transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-growi-sand">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-growi-forest' 
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* Auth Section Mobile */}
              <div className="mt-4 pt-4 border-t border-growi-sand">
                <AuthSectionMobile onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Composant d'authentification pour desktop
function AuthSection() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { isAdmin } = usePermissions()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="w-6 h-6 animate-pulse bg-growi-sand rounded-full"></div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-growi-forest hover:text-growi-lime font-medium transition-colors"
        >
          Se connecter
        </Link>
        <Link
          href="/register"
          className="bg-gradient-to-r from-growi-lime to-growi-forest text-white font-medium px-6 py-2 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Créer un compte
        </Link>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const getInitials = (user: any) => {
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 hover:bg-growi-sand px-3 py-2 rounded-xl transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-growi-lime to-growi-forest text-white rounded-full flex items-center justify-center text-sm font-bold">
          {getInitials(user)}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium text-growi-forest">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email
            }
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {user.role.toLowerCase()}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu dropdown */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-growi-sand rounded-xl shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-growi-sand">
              <div className="text-sm font-medium text-growi-forest">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email
                }
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-growi-sand transition-colors"
            >
              🏠 Tableau de bord
            </Link>
            
            {isAdmin && (
              <Link
                href="/admin/users"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-growi-sand transition-colors"
              >
                ⚙️ Administration
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant d'authentification pour mobile
function AuthSectionMobile({ onClose }: { onClose: () => void }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { isAdmin } = usePermissions()

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 animate-pulse bg-growi-sand rounded-full"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          onClick={onClose}
          className="text-center py-3 text-growi-forest hover:text-growi-lime font-medium transition-colors"
        >
          Se connecter
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="bg-gradient-to-r from-growi-lime to-growi-forest text-white font-medium px-6 py-3 rounded-xl text-center hover:shadow-lg transition-all duration-300"
        >
          Créer un compte
        </Link>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 py-2 bg-growi-sand rounded-xl">
        <div className="text-sm font-medium text-growi-forest">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email
          }
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {user.role.toLowerCase()}
        </div>
      </div>
      
      <Link
        href="/dashboard"
        onClick={onClose}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-growi-sand rounded-xl transition-colors"
      >
        🏠 Tableau de bord
      </Link>
      
      {isAdmin && (
        <Link
          href="/admin/users"
          onClick={onClose}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-growi-sand rounded-xl transition-colors"
        >
          ⚙️ Administration
        </Link>
      )}
      
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
      >
        🚪 Se déconnecter
      </button>
    </div>
  )
}