import { getMessages } from '@/lib/i18n';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/app/sections/SiteFooter';

export default async function DeliveryPage() {
  const { delivery, common, home } = await getMessages();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
      <NavBar t={common.nav} />

      <main className="flex-1 pt-[var(--header-h)]">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E8DDD4]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{delivery.badge}</span>
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-4">{delivery.title}</h1>
            <p className="text-[#6B5B4E]">{delivery.subtitle}</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          {/* Delivery methods */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <h2 className="text-xl font-medium text-[#1A1410]">{delivery.delivery.title}</h2>
            </div>
            <div className="bg-[#C4704F]/10 border border-[#C4704F]/30 text-[#A85A3A] text-sm px-4 py-3 mb-6 font-medium">
              {delivery.delivery.freeFrom}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {delivery.delivery.methods.map(m => (
                <div key={m.title} className="bg-white border border-[#E8DDD4] p-5">
                  <h3 className="font-semibold text-[#1A1410] mb-1">{m.title}</h3>
                  <p className="text-xs text-[#9C8A7E] mb-3">{m.desc}</p>
                  <p className="text-lg font-medium text-[#C4704F]">{m.price}</p>
                  <p className="text-xs text-[#9C8A7E] mt-1">{m.time}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment methods */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h2 className="text-xl font-medium text-[#1A1410]">{delivery.payment.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {delivery.payment.methods.map(m => (
                <div key={m.title} className="bg-white border border-[#E8DDD4] p-5 flex gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[#1A1410] mb-1">{m.title}</h3>
                    <p className="text-sm text-[#6B5B4E]">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Returns */}
          <section className="bg-white border border-[#E8DDD4] p-8">
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              <h2 className="text-xl font-medium text-[#1A1410]">{delivery.returns.title}</h2>
            </div>
            <p className="text-[#6B5B4E] leading-relaxed">{delivery.returns.desc}</p>
          </section>

          {/* FAQ */}
          <section>
            <div className="space-y-3">
              {delivery.faq.map(item => (
                <details key={item.q} className="bg-white border border-[#E8DDD4] group">
                  <summary className="px-5 py-4 text-sm font-medium text-[#1A1410] cursor-pointer flex items-center justify-between list-none">
                    {item.q}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 group-open:rotate-180 transition-transform">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#6B5B4E] leading-relaxed border-t border-[#E8DDD4] pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter t={home.footer} />
    </div>
  );
}
