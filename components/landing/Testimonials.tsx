const testimonials = [
  {
    content: "Depuis que nous avons installé Clickresto, nos commandes à emporter ont augmenté de 40%. L'application est intuitive et nos clients adorent la simplicité du click & collect.",
    author: 'Marie Chevalier',
    initials: 'MC',
    role: 'Le Petit Bistrot, Lyon',
  },
  {
    content: "Le programme de fidélité a transformé notre relation client. Nos habitués reviennent plus souvent et recommandent notre restaurant à leurs proches. Un investissement rentabilisé en 2 mois !",
    author: 'Philippe Dubois',
    initials: 'PD',
    role: 'Chez Philippe, Bordeaux',
  },
  {
    content: "Les notifications push nous permettent de remplir les créneaux creux. Une promo envoyée à 11h30 et c'est le rush au déjeuner ! L'équipe Clickresto est aussi très réactive.",
    author: 'Sophie Laurent',
    initials: 'SL',
    role: 'La Table de Sophie, Paris',
  },
];

const stats = [
  { value: '150+', label: 'Restaurants partenaires' },
  { value: '50k+', label: 'Commandes traitées' },
  { value: '4.8/5', label: 'Note moyenne' },
];

export default function Testimonials() {
  return (
    <section id="temoignages" className="py-24 px-4 md:px-8 bg-clickresto-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-clickresto-primary/10 text-clickresto-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Témoignages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-clickresto-secondary mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-[#457B9D] max-w-xl mx-auto">
            Découvrez ce que les restaurateurs pensent de Clickresto
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-clickresto-secondary/5 relative hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-6 font-serif text-8xl text-clickresto-primary/10 leading-none">
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Content */}
              <p className="text-clickresto-secondary italic leading-relaxed mb-6">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-clickresto-primary to-clickresto-accent flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-clickresto-secondary">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-[#457B9D]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-clickresto-secondary/5 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-4xl md:text-5xl text-clickresto-primary mb-2">
                {stat.value}
              </div>
              <div className="text-[#457B9D]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
