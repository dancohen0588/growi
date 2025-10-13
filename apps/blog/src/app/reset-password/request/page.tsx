'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import * as api from '@/lib/api'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import Container from '@/components/ui/container'

export default function RequestResetPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await api.requestPasswordReset({ email })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email')
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
                <h1 className="text-2xl font-bold text-growi-forest mb-2">Email envoyé</h1>
                <p className="text-gray-600 mb-6">
                  Si l'email existe dans notre base de données, vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Retour à la connexion
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
              <h1 className="text-3xl font-bold text-growi-forest mb-2">Mot de passe oublié</h1>
              <p className="text-gray-600">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre-email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/login"
                className="text-growi-forest hover:text-growi-lime transition-colors text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  )
}