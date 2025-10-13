'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { submitContactForm, type ContactFormData } from '@/lib/api'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  consent?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [formState, setFormState] = useState<FormState>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Validation côté client
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères'
    }
    
    if (!formData.consent) {
      newErrors.consent = 'Vous devez accepter le traitement de vos données'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setFormState('loading')
    setSubmitMessage('')
    
    try {
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        consent: formData.consent
      })
      
      if (response.success) {
        setFormState('success')
        setSubmitMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          consent: false
        })
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      setFormState('error')
      setSubmitMessage('Erreur lors de l\'envoi. Veuillez réessayer plus tard.')
      console.error('Contact form error:', error)
    }
  }

  // Gestion des changements d'input
  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Supprimer l'erreur lors de la saisie
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Même style que la Home */}
      <section className="bg-gradient-to-br from-growi-sand to-white relative overflow-hidden py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-growi-forest font-poppins mb-6 leading-tight">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner dans votre aventure jardinage.
          </p>
          <div className="flex justify-center items-center gap-6 text-growi-forest">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📧</span>
              <span className="font-medium">contact@growi.io</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span className="font-medium">+33 1 23 45 67 89</span>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de Contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card variant="elevated" className="bg-white/80 backdrop-blur-sm shadow-xl border border-growi-sand/50">
            <CardHeader className="text-center pb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-growi-forest font-poppins mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600">
                Nous nous engageons à vous répondre dans les 24 heures.
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Notification de statut */}
              {formState === 'success' && (
                <div className="mb-6 p-4 bg-growi-lime/20 border border-growi-lime rounded-xl text-growi-forest">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span className="font-medium">{submitMessage}</span>
                  </div>
                </div>
              )}
              
              {formState === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">❌</span>
                    <span className="font-medium">{submitMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-growi-forest mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-transparent transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom et prénom"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-growi-forest mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-growi-forest mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-transparent transition-all ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Question générale">Question générale</option>
                    <option value="Support technique">Support technique</option>
                    <option value="Suggestion d'amélioration">Suggestion d'amélioration</option>
                    <option value="Problème de connexion">Problème de connexion</option>
                    <option value="Question sur l'abonnement">Question sur l'abonnement</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-growi-forest mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-growi-lime focus:border-transparent transition-all resize-vertical ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez votre demande de manière détaillée..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.message.length} caractères (minimum 10)
                    </p>
                  </div>
                </div>

                {/* Consentement RGPD */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="mt-1 w-4 h-4 text-growi-lime border-gray-300 rounded focus:ring-growi-lime"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      J'accepte que mes données personnelles soient traitées par Growi pour répondre à ma demande. 
                      Conformément au RGPD, vous pouvez exercer vos droits d'accès, de rectification et de suppression 
                      en nous contactant. *
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-2 text-sm text-red-600">{errors.consent}</p>
                  )}
                </div>

                {/* Bouton d'envoi */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-growi-lime to-growi-forest text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    isLoading={formState === 'loading'}
                    disabled={formState === 'loading'}
                  >
                    {formState === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section informations complémentaires */}
      <section className="py-16 bg-growi-sand">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-growi-forest font-poppins mb-4">
              Autres moyens de nous contacter
            </h2>
            <p className="text-gray-600">
              Choisissez le canal qui vous convient le mieux
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-2">
                  Email
                </h3>
                <p className="text-gray-600 mb-4">
                  Pour toute question générale ou demande de support
                </p>
                <a 
                  href="mailto:contact@growi.io" 
                  className="text-growi-lime hover:text-growi-forest font-medium transition-colors"
                >
                  contact@growi.io
                </a>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-2">
                  Chat en direct
                </h3>
                <p className="text-gray-600 mb-4">
                  Support instantané du lundi au vendredi, 9h-18h
                </p>
                <button className="text-growi-lime hover:text-growi-forest font-medium transition-colors">
                  Ouvrir le chat
                </button>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-2">
                  Centre d'aide
                </h3>
                <p className="text-gray-600 mb-4">
                  Consultez notre FAQ et nos guides d'utilisation
                </p>
                <a 
                  href="/aide" 
                  className="text-growi-lime hover:text-growi-forest font-medium transition-colors"
                >
                  Voir l'aide
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}