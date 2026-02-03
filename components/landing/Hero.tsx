import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -top-1/2 -right-1/5 w-4/5 h-[150%] bg-[radial-gradient(ellipse,rgba(230,57,70,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="animate-fade-in-up text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-clickresto-primary/10 text-clickresto-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span role="img" aria-label="rocket">🚀</span> Solution tout-en-un pour restaurateurs
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-clickresto-secondary mb-6 leading-tight">
            Votre app <span className="text-clickresto-primary">Click & Collect</span> personnalisée
          </h1>

          <p className="text-lg md:text-xl text-[#457B9D] mb-8 max-w-lg mx-auto lg:mx-0">
            Offrez à vos clients une expérience de commande mobile fluide avec fidélité intégrée et notifications push. Simple, rapide, efficace.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-clickresto-primary text-white rounded-full font-semibold hover:bg-[#c41e2d] transition-all hover:-translate-y-0.5 shadow-lg shadow-clickresto-primary/30"
            >
              Demander une démo →
            </Link>
            <Link
              href="#fonctionnalites"
              className="inline-flex items-center gap-2 px-7 py-4 bg-transparent text-clickresto-secondary border-2 border-clickresto-secondary rounded-full font-semibold hover:bg-clickresto-secondary hover:text-white transition-all"
            >
              Découvrir
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-clickresto-secondary/10 justify-center lg:justify-start">
            <div className="text-left">
              <div className="font-serif text-3xl text-clickresto-primary">500€</div>
              <div className="text-sm text-[#457B9D]">Mise en place</div>
            </div>
            <div className="text-left">
              <div className="font-serif text-3xl text-clickresto-primary">60€</div>
              <div className="text-sm text-[#457B9D]">par mois</div>
            </div>
            <div className="text-left">
              <div className="font-serif text-3xl text-clickresto-primary">0%</div>
              <div className="text-sm text-[#457B9D]">de commission</div>
            </div>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="relative animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
          {/* Floating Card 1 */}
          <div className="hidden lg:block absolute top-[10%] -left-[20%] bg-white rounded-2xl p-4 shadow-xl animate-float z-10">
            <div className="w-10 h-10 rounded-lg bg-clickresto-primary/10 flex items-center justify-center text-xl mb-2">
              <span role="img" aria-label="notification">🔔</span>
            </div>
            <h5 className="text-sm font-semibold text-clickresto-secondary">Notification Push</h5>
            <p className="text-xs text-[#457B9D]">Votre commande est prête !</p>
          </div>

          {/* Phone */}
          <div className="relative w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-clickresto-secondary rounded-[40px] p-3 shadow-2xl mx-auto">
            <div className="w-full h-full bg-white rounded-[30px] overflow-hidden">
              {/* Phone Header */}
              <div className="bg-clickresto-primary px-4 pt-8 pb-4 text-white">
                <h4 className="font-serif text-xl">Le Bistrot Parisien</h4>
                <p className="text-xs opacity-90">Commander & Retirer</p>
              </div>

              {/* Phone Content */}
              <div className="p-4 space-y-3">
                {[
                  { name: 'Burger Signature', desc: 'Bœuf, cheddar, bacon', price: '14€' },
                  { name: 'Salade César', desc: 'Poulet, parmesan, croûtons', price: '12€' },
                  { name: 'Tiramisu Maison', desc: 'Mascarpone, café', price: '7€' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-100 rounded-xl items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-clickresto-accent to-clickresto-primary rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-clickresto-secondary truncate">{item.name}</h5>
                      <p className="text-xs text-[#457B9D] truncate">{item.desc}</p>
                    </div>
                    <span className="text-clickresto-primary font-bold text-sm">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="hidden lg:block absolute bottom-[20%] -right-[15%] bg-white rounded-2xl p-4 shadow-xl animate-float z-10" style={{ animationDelay: '1.5s' }}>
            <div className="w-10 h-10 rounded-lg bg-clickresto-accent/20 flex items-center justify-center text-xl mb-2">
              <span role="img" aria-label="star">⭐</span>
            </div>
            <h5 className="text-sm font-semibold text-clickresto-secondary">+50 points fidélité</h5>
            <p className="text-xs text-[#457B9D]">Encore 3 cafés offerts !</p>
          </div>
        </div>
      </div>
    </section>
  );
}
