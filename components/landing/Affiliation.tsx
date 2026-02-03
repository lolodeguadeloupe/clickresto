import Link from "next/link";

const steps = [
  {
    number: 1,
    title: 'Inscrivez-vous',
    description: "Rejoignez gratuitement notre programme d'affiliation",
  },
  {
    number: 2,
    title: 'Recommandez',
    description: 'Parlez de Clickresto aux restaurateurs de votre réseau',
  },
  {
    number: 3,
    title: 'Gagnez',
    description: 'Recevez 100€ pour chaque restaurant qui signe',
  },
];

export default function Affiliation() {
  return (
    <section id="affiliation" className="py-24 px-4 md:px-8 bg-clickresto-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block bg-clickresto-primary/10 text-clickresto-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Programme partenaire
            </span>

            <h2 className="font-serif text-3xl md:text-4xl text-clickresto-secondary mb-4">
              Devenez <span className="text-clickresto-primary">apporteur d&apos;affaires</span>
            </h2>

            <p className="text-lg text-[#457B9D] mb-8">
              Recommandez Clickresto à des restaurateurs et gagnez de l&apos;argent pour chaque client signé.
            </p>

            {/* Steps */}
            <div className="space-y-6 mb-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-clickresto-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-semibold text-clickresto-secondary text-lg mb-1">
                      {step.title}
                    </h4>
                    <p className="text-[#457B9D]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-clickresto-secondary text-white rounded-full font-semibold hover:bg-[#152840] transition-all hover:-translate-y-0.5"
            >
              Devenir partenaire →
            </Link>
          </div>

          {/* Reward Card */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl shadow-clickresto-secondary/10 relative overflow-hidden">
              {/* Top border gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-clickresto-primary to-clickresto-accent" />

              <div className="w-20 h-20 bg-gradient-to-br from-clickresto-primary to-clickresto-accent rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                <span role="img" aria-label="money">💰</span>
              </div>

              <h3 className="font-serif text-2xl text-clickresto-secondary mb-2">
                Prime de parrainage
              </h3>

              <div className="font-serif text-6xl text-clickresto-primary my-4">
                100€
              </div>

              <p className="text-[#457B9D]">
                par restaurant signé grâce à vous
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
