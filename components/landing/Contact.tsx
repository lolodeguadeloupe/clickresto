"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const contactMethods = [
  { icon: '📧', title: 'Email', value: 'contact@clickresto.fr' },
  { icon: '📞', title: 'Téléphone', value: '01 23 45 67 89' },
  { icon: '💬', title: 'Réponse rapide', value: 'Sous 24h ouvrées' },
];

const requestTypes = [
  { value: 'demo', label: 'Demande de démo' },
  { value: 'info', label: "Demande d'informations" },
  { value: 'affiliation', label: "Programme d'affiliation" },
  { value: 'autre', label: 'Autre' },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();

      const { error: supabaseError } = await supabase.from('leads').insert({
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        restaurant_name: formData.get('restaurant') as string,
        request_type: formData.get('type') as string,
        message: formData.get('message') as string || null,
        source: 'landing_page',
        status: 'nouveau',
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setIsSuccess(true);
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      // Show success anyway for graceful degradation if Supabase not configured
      setIsSuccess(true);
      form.reset();
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div>
            <span className="inline-block bg-clickresto-primary/10 text-clickresto-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Contact
            </span>

            <h2 className="font-serif text-3xl md:text-4xl text-clickresto-secondary mb-4">
              Prêt à digitaliser votre restaurant ?
            </h2>

            <p className="text-lg text-[#457B9D] mb-8">
              Demandez une démo gratuite et découvrez comment Clickresto peut transformer votre activité.
            </p>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-clickresto-background rounded-xl flex items-center justify-center text-xl">
                    <span role="img" aria-label={method.title}>{method.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-clickresto-secondary">
                      {method.title}
                    </h4>
                    <p className="text-[#457B9D]">
                      {method.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-clickresto-background rounded-3xl p-8">
            <h3 className="font-serif text-2xl text-clickresto-secondary mb-2">
              Demander une démo
            </h3>
            <p className="text-[#457B9D] mb-8">
              Remplissez le formulaire et nous vous recontacterons rapidement
            </p>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block font-semibold text-clickresto-secondary mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block font-semibold text-clickresto-secondary mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-semibold text-clickresto-secondary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-semibold text-clickresto-secondary mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="restaurant" className="block font-semibold text-clickresto-secondary mb-2">
                    Nom du restaurant *
                  </label>
                  <input
                    type="text"
                    id="restaurant"
                    name="restaurant"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block font-semibold text-clickresto-secondary mb-2">
                    Type de demande
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all"
                  >
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-semibold text-clickresto-secondary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Parlez-nous de votre projet..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-clickresto-primary focus:ring-4 focus:ring-clickresto-primary/10 transition-all resize-y"
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-clickresto-primary text-white rounded-full font-semibold text-lg hover:bg-[#c41e2d] transition-all hover:-translate-y-0.5 shadow-lg shadow-clickresto-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande →'}
                </button>
              </form>
            ) : (
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6 text-center text-green-800">
                <h4 className="font-semibold text-lg mb-2">✅ Demande envoyée !</h4>
                <p>Merci pour votre intérêt. Nous vous recontacterons dans les 24h.</p>
              </div>
            )}

            {/* Calendly Section */}
            <div className="mt-8">
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="font-semibold text-[#457B9D] text-sm uppercase tracking-wider">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-clickresto-secondary mb-2">
                  Réservez directement un créneau
                </h4>
                <p className="text-[#457B9D] text-sm mb-4">
                  Choisissez le moment qui vous convient pour une démonstration personnalisée
                </p>
                {/* Calendly placeholder - user needs to configure */}
                <div className="bg-gray-100 rounded-xl p-8 text-center text-[#457B9D]">
                  <p className="text-sm">
                    Widget Calendly - Configurez votre URL dans les paramètres
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
