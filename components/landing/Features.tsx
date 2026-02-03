const features = [
  {
    icon: '📱',
    title: 'Click & Collect',
    description: 'Vos clients commandent depuis leur smartphone et récupèrent leur commande au comptoir.',
    items: [
      'Catalogue produits personnalisable',
      'Gestion des créneaux de retrait',
      'Paiement sécurisé intégré',
      'Notifications de préparation',
    ],
  },
  {
    icon: '⭐',
    title: 'Carte de fidélité',
    description: 'Récompensez vos clients réguliers et augmentez leur fréquence de visite.',
    items: [
      'Points cumulés automatiquement',
      'Récompenses personnalisables',
      'Historique des achats',
      'Offres spéciales anniversaire',
    ],
  },
  {
    icon: '🔔',
    title: 'Notifications Push',
    description: 'Restez en contact avec vos clients et informez-les de vos offres.',
    items: [
      'Alertes commande prête',
      'Promotions ciblées',
      'Rappels automatiques',
      'Communication directe',
    ],
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-clickresto-primary/10 text-clickresto-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Fonctionnalités
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-clickresto-secondary mb-4">
            Tout ce dont votre restaurant a besoin
          </h2>
          <p className="text-lg text-[#457B9D] max-w-xl mx-auto">
            Une solution complète pour digitaliser votre établissement et fidéliser vos clients
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-clickresto-background rounded-3xl p-8 border-2 border-transparent hover:border-clickresto-primary hover:shadow-xl hover:shadow-clickresto-primary/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-clickresto-primary to-clickresto-accent rounded-2xl flex items-center justify-center text-3xl mb-6">
                <span role="img" aria-label={feature.title}>{feature.icon}</span>
              </div>

              <h3 className="font-serif text-2xl text-clickresto-secondary mb-3">
                {feature.title}
              </h3>

              <p className="text-[#457B9D] mb-4">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-clickresto-secondary text-sm">
                    <span className="text-clickresto-primary font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
