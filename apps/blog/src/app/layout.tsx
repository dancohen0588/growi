import type { Metadata } from 'next'
import { Poppins, Raleway } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

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
      <body className="min-h-screen bg-growi-sand font-raleway text-growi-forest antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}