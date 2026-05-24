import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['footer'] };

export default function SiteFooter({ t }: Props) {
  return (
    <footer className="bg-[#1A1410] text-[#9C8A7E] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#2D2420]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#C4704F" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="8" stroke="#C4704F" strokeWidth="1" />
                <circle cx="16" cy="16" r="3" fill="#C4704F" />
              </svg>
              <span className="text-white font-semibold text-lg">cookware market</span>
            </div>
            <p className="text-sm leading-relaxed">{t.tagline}</p>
          </div>

          {/* Customers */}
          <div>
            <h4 className="text-white text-sm font-medium uppercase tracking-widest mb-4">{t.customersTitle}</h4>
            <ul className="space-y-2 text-sm">
              {t.customerLinks.map(item => (
                <li key={item}><a href="#" className="hover:text-[#C4704F] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-medium uppercase tracking-widest mb-4">{t.companyTitle}</h4>
            <ul className="space-y-2 text-sm">
              {t.companyLinks.map(item => (
                <li key={item}><a href="#" className="hover:text-[#C4704F] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white text-sm font-medium uppercase tracking-widest mb-4">{t.contactTitle}</h4>
            <div className="space-y-3 text-sm">
              <p>
                <span className="block text-[#6B5B4E] text-xs mb-0.5">{t.emailLabel}</span>
                <a href="mailto:hello@cookware-market.eu" className="hover:text-[#C4704F] transition-colors">hello@cookware-market.eu</a>
              </p>
              <p>
                <span className="block text-[#6B5B4E] text-xs mb-0.5">{t.hoursLabel}</span>
                {t.hours}
              </p>
              <p className="text-xs pt-2 border-t border-[#2D2420]">
                {t.legalName}<br />
                {t.legalId}<br />
                {t.legalVat}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} cookware market. {t.rights}</p>
          <div className="flex items-center gap-3">
            {['Visa', 'MC', 'NP'].map(p => (
              <span key={p} className="border border-[#2D2420] px-2 py-1 text-[10px] tracking-wider">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
