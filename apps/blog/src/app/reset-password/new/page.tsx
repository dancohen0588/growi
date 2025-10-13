'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import * as api from '@/lib/api'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import Container from '@/components/ui/container'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!token) {
      setError('Token manquant')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setIsLoading(false)
      return
    }

    try {
      await api.resetPassword({ token, newPassword: password })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growi-lime/20 via-white to-growi-forest/10 py-16">
        <Container>
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="bg-white/90 backdrop-blur-sm shadow-xl shadow-growi-forest/10">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-growi-forest mb-2">Mot de passe mis à jour</h1>
                <p className="text-gray-600 mb-6">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growi-lime/20 via-white to-growi-forest/10 py-16">
        <Container>
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="bg-white/90 backdrop-blur-sm shadow-xl shadow-growi-forest/10">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-growi-forest mb-2">Lien invalide</h1>
                <p className="text-gray-600 mb-6">
                  Ce lien de réinitialisation n'est pas valide ou a expiré.
                </p>
                <Link href="/reset-password/request">
                  <Button variant="primary" className="w-full">
                    Demander un nouveau lien
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growi-lime/20 via-white to-growi-forest/10 py-16">
      <Container>
        <div className="max-w-md mx-auto">
          <Card padding="lg" className="bg-white/90 backdrop-blur-sm shadow-xl shadow-growi-forest/10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-growi-forest mb-2">Nouveau mot de passe</h1>
              <p className="text-gray-600">Choisissez un nouveau mot de passe sécurisé</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Au moins 8 caractères avec une lettre et un chiffre</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full"
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  )
}