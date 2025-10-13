import type { Metadata } from 'next'
import { Poppins, Raleway } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'Blog Growi - Conseils jardinage et plantes',
  description: 'Découvrez nos guides pratiques, conseils d\'experts et astuces pour réussir votre jardin. Blog officiel de l\'application Growi.',
  keywords: 'jardinage, plantes, conseils, potager, plantes d\'intérieur, écologie',
  authors: [{ name: 'Équipe Growi' }],
  openGraph: {
    title: 'Blog Growi - Conseils jardinage et plantes',
    description: 'Découvrez nos guides pratiques et conseils d\'experts pour réussir votre jardin.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Growi - Conseils jardinage et plantes',
    description: 'Découvrez nos guides pratiques et conseils d\'experts pour réussir votre jardin.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${raleway.variable}`}>
      <body className="min-h-screen bg-white font-raleway text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-growi-sand bg-white">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <span className="text-2xl font-bold text-growi-forest font-poppins">
                    Growi
                  </span>
                  <span className="text-lg text-growi-forest font-medium">
                    Blog
                  </span>
                </div>
                <nav className="hidden md:flex gap-6">
                  <a 
                    href="/blog" 
                    className="text-growi-forest hover:text-growi-lime transition-colors font-medium"
                  >
                    Articles
                  </a>
                  <a 
                    href="/blog/categorie/conseils-jardinage" 
                    className="text-growi-forest hover:text-growi-lime transition-colors"
                  >
                    Conseils
                  </a>
                  <a 
                    href="/blog/categorie/plantes-interieur" 
                    className="text-growi-forest hover:text-growi-lime transition-colors"
                  >
                    Plantes
                  </a>
                  <a 
                    href="/blog/categorie/potager-et-fruits" 
                    className="text-growi-forest hover:text-growi-lime transition-colors"
                  >
                    Potager
                  </a>
                </nav>
                <a 
                  href="https://growi.io" 
                  className="bg-growi-lime hover:bg-growi-forest text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Découvrir Growi
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-growi-forest text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🌱</span>
                    <span className="text-xl font-bold font-poppins">Growi</span>
                  </div>
                  <p className="text-white/80">
                    L'assistant intelligent pour ton jardin.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-growi-lime font-poppins">Blog</h4>
                  <ul className="space-y-2 text-white/80">
                    <li><a href="/blog" className="hover:text-growi-lime transition-colors">Tous les articles</a></li>
                    <li><a href="/blog/categorie/conseils-jardinage" className="hover:text-growi-lime transition-colors">Conseils jardinage</a></li>
                    <li><a href="/blog/categorie/plantes-interieur" className="hover:text-growi-lime transition-colors">Plantes d'intérieur</a></li>
                    <li><a href="/blog/categorie/potager-et-fruits" className="hover:text-growi-lime transition-colors">Potager & fruits</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-growi-lime font-poppins">Application</h4>
                  <ul className="space-y-2 text-white/80">
                    <li><a href="https://growi.io" className="hover:text-growi-lime transition-colors">Découvrir Growi</a></li>
                    <li><a href="https://growi.io/fonctionnalites" className="hover:text-growi-lime transition-colors">Fonctionnalités</a></li>
                    <li><a href="https://growi.io/premium" className="hover:text-growi-lime transition-colors">Premium</a></li>
                    <li><a href="https://growi.io/pro" className="hover:text-growi-lime transition-colors">Growi Pro</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-growi-lime font-poppins">Support</h4>
                  <ul className="space-y-2 text-white/80">
                    <li><a href="https://growi.io/contact" className="hover:text-growi-lime transition-colors">Contact</a></li>
                    <li><a href="https://growi.io/aide" className="hover:text-growi-lime transition-colors">Aide</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
                <p>&copy; 2024 Growi. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}