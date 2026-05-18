import { getMessages } from '@/lib/i18n';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/app/sections/SiteFooter';

export default async function AboutPage() {
  const { about, common, home } = await getMessages();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
      <NavBar t={common.nav} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{about.badge}</span>
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-6">{about.title}</h1>
            <p className="text-lg text-[#6B5B4E] max-w-2xl mx-auto leading-relaxed">{about.subtitle}</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-[#FDFAF7]">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-[#6B5B4E] leading-relaxed text-lg">{about.story}</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-t border-b border-[#E8DDD4]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {about.stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-3xl font-light text-[#C4704F] mb-1">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-[#9C8A7E]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#FDFAF7]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {about.values.map(v => (
                <div key={v.title} className="bg-white border border-[#E8DDD4] p-6 hover:border-[#C4704F] transition-colors">
                  <h3 className="font-semibold text-[#1A1410] mb-2">{v.title}</h3>
                  <p className="text-sm text-[#6B5B4E] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#1A1410] text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl font-light text-white mb-6">{about.ctaTitle}</h2>
            <a
              href="/contacts"
              className="inline-block bg-[#C4704F] hover:bg-[#A85A3A] text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {about.cta}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter t={home.footer} />
    </div>
  );
}
