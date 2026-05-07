import { getMessages } from "@/lib/i18n";

export default async function Land2Page() {
  const { land2 } = await getMessages();
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-32 px-4 text-center">
        <span className="inline-block bg-stone-900 text-white text-xs px-4 py-1 mb-6">
          {land2.offer.badge}
        </span>
        <h1 className="text-5xl font-light text-stone-900 mb-4">{land2.hero.title}</h1>
        <p className="text-stone-500 text-lg mb-10">{land2.hero.subtitle}</p>
        <button className="border border-stone-900 text-stone-900 px-10 py-4 text-sm hover:bg-stone-900 hover:text-white transition-colors">
          {land2.hero.cta}
        </button>
      </section>
      <section className="bg-white py-20 px-4 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-4">{land2.offer.title}</h2>
        <p className="text-gray-500">{land2.offer.desc}</p>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-stone-600">
          <div>{land2.trust.reviews}</div>
          <div>{land2.trust.shipping}</div>
          <div>{land2.trust.handmade}</div>
        </div>
      </section>
    </div>
  );
}
