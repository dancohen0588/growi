import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Reproduit exactement le design original */}
      <section className="bg-gradient-to-br from-growi-sand to-white relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Contenu Hero */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-growi-forest font-poppins mb-6 leading-tight">
                Ton jardin, ta croissance.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                L'assistant intelligent qui t'aide à entretenir ton jardin jour après jour, selon la météo et tes plantes.
              </p>
              <div className="flex gap-5 flex-wrap">
                <button className="bg-gradient-to-r from-growi-lime to-growi-forest text-white font-medium px-8 py-4 rounded-xl text-lg font-poppins shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  ✅ Essayer gratuitement
                </button>
                <Link
                  href="/blog"
                  className="bg-transparent border-2 border-growi-forest text-growi-forest hover:bg-growi-forest hover:text-white font-medium px-8 py-4 rounded-xl text-lg font-poppins transition-all duration-300 inline-flex items-center gap-2"
                >
                  🌿 Voir les fonctionnalités
                </Link>
              </div>
            </div>
            
            {/* Mockup Phone */}
            <div className="relative flex justify-center items-center">
              <div className="relative z-10 bg-white p-5 w-full max-w-4xl h-[500px] rounded-3xl shadow-2xl">
                <img
                  src="/homepage.jpg"
                  alt="Growi app mockup"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              {/* Background Image */}
              <div className="absolute -top-12 -right-20 w-96 h-96 opacity-10 z-0">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Fond végétal"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins text-center mb-16">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-growi-sand text-center p-10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-6xl mb-5">🌿</div>
              <h3 className="text-2xl font-semibold text-growi-forest font-poppins mb-4">
                Identifie tes plantes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Prends une photo ou choisis dans la base de données pour reconnaître tes végétaux.
              </p>
            </div>
            <div className="bg-growi-sand text-center p-10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-6xl mb-5">⏰</div>
              <h3 className="text-2xl font-semibold text-growi-forest font-poppins mb-4">
                Reçois les bons rappels
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Arrosage, taille, rempotage selon la météo et les besoins de chaque plante.
              </p>
            </div>
            <div className="bg-growi-sand text-center p-10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-6xl mb-5">☀️</div>
              <h3 className="text-2xl font-semibold text-growi-forest font-poppins mb-4">
                Fais-les prospérer
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Des conseils adaptés à ton climat et à la saison pour un jardin en pleine santé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu de l'application */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="pr-5">
              <h2 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins text-left mb-6">
                Aperçu de l'application
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Suivez la santé de vos plantes et recevez des alertes personnalisées directement sur votre smartphone.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-growi-lime rounded-full text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-gray-700">Interface intuitive et naturelle</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-growi-lime rounded-full text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-gray-700">Notifications intelligentes</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-growi-lime rounded-full text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-gray-700">Suivi en temps réel</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white p-5 w-80 h-96 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Écran principal de Growi"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités phares */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins text-center mb-16">
            Fonctionnalités phares
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">🧠</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Assistant intelligent
              </h3>
              <p className="text-gray-600 leading-relaxed">
                IA personnalisée qui apprend de vos habitudes et s'adapte à votre style de jardinage.
              </p>
            </div>
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">📷</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Diagnostic photo IA
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Identifiez maladies, carences et parasites en un clic grâce à l'intelligence artificielle.
              </p>
            </div>
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">📆</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Calendrier du jardin
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Planification automatique des tâches selon les saisons et votre zone climatique.
              </p>
            </div>
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">🛍️</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Store contextuel
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Recommandations d'achats personnalisées selon vos besoins et votre région.
              </p>
            </div>
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">🌍</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Communauté locale
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Échangez avec des jardiniers de votre région et partagez vos expériences.
              </p>
            </div>
            <div className="text-center p-8 bg-white border-2 border-growi-sand rounded-2xl hover:border-growi-lime hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-5">💎</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-4">
                Version Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fonctionnalités avancées, analyses détaillées et support prioritaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-growi-sand">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins text-center mb-16">
            Ce que disent nos utilisateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 text-center rounded-2xl shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-5 overflow-hidden rounded-full border-4 border-growi-lime">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b1e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Marie"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 italic mb-5 text-lg leading-relaxed">
                "Grâce à Growi, mes plantes n'ont jamais été aussi belles ! Les rappels sont parfaits."
              </p>
              <div>
                <strong className="text-growi-forest font-poppins font-semibold">Marie</strong>
                <span className="block text-gray-500 text-sm mt-1">Lyon</span>
              </div>
            </div>
            
            <div className="bg-white p-8 text-center rounded-2xl shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-5 overflow-hidden rounded-full border-4 border-growi-lime">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Thomas"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 italic mb-5 text-lg leading-relaxed">
                "L'IA de diagnostic m'a sauvé mes tomates cette saison. Application indispensable !"
              </p>
              <div>
                <strong className="text-growi-forest font-poppins font-semibold">Thomas</strong>
                <span className="block text-gray-500 text-sm mt-1">Bordeaux</span>
              </div>
            </div>
            
            <div className="bg-white p-8 text-center rounded-2xl shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-5 overflow-hidden rounded-full border-4 border-growi-lime">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Sophie"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 italic mb-5 text-lg leading-relaxed">
                "Parfait pour les débutants comme moi. Interface claire et conseils précieux."
              </p>
              <div>
                <strong className="text-growi-forest font-poppins font-semibold">Sophie</strong>
                <span className="block text-gray-500 text-sm mt-1">Paris</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growi Pro */}
      <section className="bg-growi-forest py-20 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="pr-5">
              <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins text-left mb-5">
                Growi Pro
              </h2>
              <h3 className="text-2xl text-growi-lime font-poppins mb-10 leading-snug">
                Professionnels, collectivités, syndics : pilotez vos espaces verts simplement.
              </h3>
              <div className="flex flex-col gap-8 mb-10">
                <div className="flex gap-5 items-start">
                  <span className="text-3xl mt-1">📊</span>
                  <div>
                    <h4 className="text-xl font-semibold text-growi-lime font-poppins mb-2">
                      Planning d'entretien intelligent
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      Optimisation automatique des tournées et planification des interventions
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <span className="text-3xl mt-1">📸</span>
                  <div>
                    <h4 className="text-xl font-semibold text-growi-lime font-poppins mb-2">
                      Rapports photo automatiques
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      Documentation instantanée des interventions pour vos clients
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <span className="text-3xl mt-1">🌿</span>
                  <div>
                    <h4 className="text-xl font-semibold text-growi-lime font-poppins mb-2">
                      Suivi biodiversité et consommation
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      Analyses détaillées pour un entretien éco-responsable
                    </p>
                  </div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-growi-lime to-growi-forest text-growi-forest font-medium px-8 py-4 rounded-xl text-lg font-poppins shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Découvrir Growi Pro
              </button>
            </div>
            
            <div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Dashboard Growi Pro"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="bg-gradient-to-br from-growi-sand to-white py-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-growi-forest font-poppins mb-5">
            Rejoignez la communauté des jardiniers connectés
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Plus de 50 000 utilisateurs font déjà confiance à Growi pour entretenir leur jardin.
          </p>
          <button className="bg-gradient-to-r from-growi-lime to-growi-forest text-white font-medium px-8 py-4 rounded-xl text-lg font-poppins mb-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Télécharger l'application
          </button>
          <div className="flex justify-center gap-5 flex-wrap">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-16 hover:scale-105 transition-transform duration-300"
            />
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Google Play"
              className="h-16 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  )
}