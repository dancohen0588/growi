'use client'

import { usePermissions } from '@/lib/auth'

export default function AdminUsersPage() {
  const { isAdmin } = usePermissions()
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-growi-sand">
        <div className="bg-white p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-growi-forest font-poppins mb-4">
            Accès refusé
          </h1>
          <p className="text-gray-600">
            Seuls les administrateurs peuvent accéder à cette page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-growi-sand py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-growi-forest font-poppins">
          Administration des Utilisateurs
        </h1>
        <p className="text-gray-600 mt-4">
          Interface d'administration en cours de finalisation.
        </p>
      </div>
    </div>
  )
}