import Link from "next/link";

const features = [
  'Application mobile iOS & Android',
  'Design personnalisé à vos couleurs',
  'Click & Collect complet',
  'Programme de fidélité',
  'Notifications push illimitées',
  'Back-office de gestion',
  'Support technique inclus',
  'Mises à jour régulières',
];

export default function Pricing() {
  return (
    <section id="tarifs" className="py-24 px-4 md:px-8 bg-clickresto-secondary relative overflow-hidden">
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-clickresto-accent/20 text-clickresto-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Tarifs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Un prix simple, sans surprise
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Pas de commission sur vos ventes, pas de frais cachés
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg mx-auto text-center shadow-2xl relative">
          {/* Badge */}
          <div className="absolute -top-4 right-8 bg-clickresto-accent text-clickresto-secondary px-5 py-2 rounded-full font-bold text-sm">
            <span role="img" aria-label="target">🎯</span> Offre unique
          </div>

          <h3 className="font-serif text-2xl text-clickresto-secondary mb-2">
            Application personnalisée
          </h3>
          <p className="text-[#457B9D] mb-8">
            Votre app aux couleurs de votre restaurant
          </p>

          {/* Prices */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mb-8">
            <div className="text-center">
              <div className="font-serif text-5xl text-clickresto-primary">500€</div>
              <div className="text-sm text-[#457B9D] mt-1">Mise en place</div>
            </div>
            <div className="hidden md:block w-0.5 h-16 bg-gray-200" />
            <div className="block md:hidden w-24 h-0.5 bg-gray-200" />
            <div className="text-center">
              <div className="font-serif text-5xl text-clickresto-primary">
                60€<span className="text-xl">/mois</span>
              </div>
              <div className="text-sm text-[#457B9D] mt-1">Abonnement</div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-clickresto-background rounded-2xl p-6 text-left mb-8">
            <h4 className="font-semibold text-clickresto-secondary mb-4">Tout inclus :</h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-clickresto-secondary">
                  <span className="text-clickresto-primary font-bold text-xl">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="#contact"
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-clickresto-primary text-white rounded-full font-semibold text-lg hover:bg-[#c41e2d] transition-all hover:-translate-y-0.5 shadow-lg shadow-clickresto-primary/30"
          >
            Démarrer maintenant →
          </Link>

          <p className="mt-6 text-sm text-[#457B9D]">
            Sans engagement • 0% de commission sur vos ventes
          </p>
        </div>
      </div>
    </section>
  );
}
