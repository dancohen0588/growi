import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin', '/dashboard']

// Routes qui nécessitent des rôles spécifiques
const roleBasedRoutes = {
  '/admin': ['ADMIN']
}

// Routes réservées aux utilisateurs non connectés
const guestOnlyRoutes = ['/login', '/register', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Récupérer les tokens depuis les cookies ou headers
  const accessToken = request.cookies.get('growi_access_token')?.value
  const userStr = request.cookies.get('growi_user')?.value
  
  let user = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch {
      // User data invalide, traiter comme non connecté
    }
  }

  const isAuthenticated = !!(accessToken && user)
  
  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => pathname.startsWith(route))
  
  // Rediriger les utilisateurs non connectés vers /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Rediriger les utilisateurs connectés depuis les pages invités
  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Vérifier les permissions basées sur les rôles
  if (isAuthenticated && isProtectedRoute) {
    const requiredRoles = Object.entries(roleBasedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1]
    
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      // Accès refusé - redirection vers la page d'accueil
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configuration des routes où le middleware s'applique
export const config = {
  matcher: [
    // Inclure toutes les routes sauf les fichiers statiques et API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}