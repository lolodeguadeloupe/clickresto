import Link from "next/link";

const productLinks = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#contact', label: 'Démo' },
];

const partnerLinks = [
  { href: '#affiliation', label: "Programme d'affiliation" },
  { href: '#contact', label: 'Devenir partenaire' },
];

const legalLinks = [
  { href: '#', label: 'Mentions légales' },
  { href: '#', label: 'CGV' },
  { href: '#', label: 'Politique de confidentialité' },
];

const socialLinks = [
  { href: '#', label: 'LinkedIn', icon: 'in' },
  { href: '#', label: 'Twitter', icon: '𝕏' },
  { href: '#', label: 'Instagram', icon: '📷' },
];

export default function Footer() {
  return (
    <footer className="bg-clickresto-secondary text-white pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-serif text-2xl no-underline mb-4">
              <div className="w-10 h-10 bg-clickresto-primary rounded-lg flex items-center justify-center text-white text-xl">
                <span role="img" aria-label="restaurant">🍽️</span>
              </div>
              Clickresto
            </Link>
            <p className="text-white/70 text-sm max-w-xs">
              La solution simple et abordable pour digitaliser votre restaurant avec une application mobile personnalisée.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-6">Produit</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-clickresto-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold mb-6">Partenaires</h4>
            <ul className="space-y-3">
              {partnerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-clickresto-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-6">Légal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-clickresto-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © 2025 Clickresto. Tous droits réservés.
          </p>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                title={social.label}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-clickresto-primary transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
