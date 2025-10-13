'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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

          {/* CTA Button */}
          <Link
            href="#download"
            className="hidden md:inline-flex bg-growi-lime hover:bg-growi-forest text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Télécharger l'app
          </Link>

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
              <Link
                href="#download"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-growi-lime text-white font-medium px-6 py-2 rounded-lg text-center mt-2"
              >
                Télécharger l'app
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}