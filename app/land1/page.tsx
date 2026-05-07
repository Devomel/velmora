import { getMessages } from "@/lib/i18n";

export default async function Land1Page() {
  const { land1 } = await getMessages();
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-stone-900 text-white py-32 px-4 text-center">
        <span className="text-sm uppercase tracking-widest text-stone-400 mb-4 block">
          {land1.offer.badge}
        </span>
        <h1 className="text-5xl font-light mb-4">{land1.hero.title}</h1>
        <p className="text-stone-300 text-lg mb-10">{land1.hero.subtitle}</p>
        <button className="bg-white text-stone-900 px-10 py-4 text-sm font-medium hover:bg-stone-100 transition-colors">
          {land1.hero.cta}
        </button>
      </section>
      <section className="py-20 px-4 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-4">{land1.offer.title}</h2>
        <p className="text-gray-500">{land1.offer.desc}</p>
      </section>
      <section className="border-t border-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-gray-600">
          <div>{land1.trust.reviews}</div>
          <div>{land1.trust.shipping}</div>
          <div>{land1.trust.handmade}</div>
        </div>
      </section>
    </div>
  );
}
