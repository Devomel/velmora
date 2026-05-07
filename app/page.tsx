import { getMessages } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  const { common, home } = await getMessages();

  return (
    <div className="min-h-screen flex flex-col">
      <Header t={common} />
      <main className="flex-1">
        <section className="bg-stone-50 py-24 px-4 text-center">
          <h1 className="text-4xl font-light tracking-tight mb-4">{home.hero.title}</h1>
          <p className="text-gray-500 mb-8">{home.hero.subtitle}</p>
          <button className="bg-stone-900 text-white px-8 py-3 text-sm hover:bg-stone-700 transition-colors">
            {home.hero.cta}
          </button>
        </section>
        <section className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {(["quality", "delivery", "returns"] as const).map((key) => (
            <div key={key} className="text-center">
              <h3 className="font-medium mb-2">{home.features[key].title}</h3>
              <p className="text-sm text-gray-500">{home.features[key].desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer rights={common.footer.rights} />
    </div>
  );
}
