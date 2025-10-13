import Link from 'next/link'

interface FooterSection {
  title: string
  links: { label: string; href: string; isExternal?: boolean }[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Fonctionnalités', href: '/#fonctionnalites' },
      { label: 'Premium', href: '/#premium' },
      { label: 'Blog', href: '/blog' },
      { label: 'Pro', href: '/#pro' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Blog',
    links: [
      { label: 'Tous les articles', href: '/blog' },
      { label: 'Conseils jardinage', href: '/blog?category=conseils-jardinage' },
      { label: 'Plantes d\'intérieur', href: '/blog?category=plantes-interieur' },
      { label: 'Potager & fruits', href: '/blog?category=potager-et-fruits' },
    ],
  },
  {
    title: 'Application',
    links: [
      { label: 'Découvrir Growi', href: 'https://growi.io', isExternal: true },
      { label: 'Fonctionnalités', href: 'https://growi.io/fonctionnalites', isExternal: true },
      { label: 'Premium', href: 'https://growi.io/premium', isExternal: true },
      { label: 'Growi Pro', href: 'https://growi.io/pro', isExternal: true },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Aide', href: 'https://growi.io/aide', isExternal: true },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-growi-forest text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold font-poppins">Growi</span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              L'assistant intelligent pour ton jardin. Plus de 50 000 utilisateurs 
              font déjà confiance à Growi pour entretenir leur jardin.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="text-white/60 hover:text-growi-lime transition-colors text-2xl"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="text-white/60 hover:text-growi-lime transition-colors text-2xl"
                aria-label="LinkedIn"
              >
                💼
              </a>
              <a 
                href="#" 
                className="text-white/60 hover:text-growi-lime transition-colors text-2xl"
                aria-label="YouTube"
              >
                📹
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-growi-lime font-poppins">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-growi-lime transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/80 hover:text-growi-lime transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Download Section */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-growi-lime font-poppins">
              Téléchargez l'application Growi
            </h4>
            <div className="flex justify-center gap-4 mb-4">
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Télécharger sur l'App Store" 
                className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
              />
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Télécharger sur Google Play" 
                className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/60 text-sm">
            &copy; 2024 Growi. Tous droits réservés. 
            <span className="mx-2">•</span>
            Fait avec 🌱 pour les jardiniers passionnés
          </p>
        </div>
      </div>
    </footer>
  )
}