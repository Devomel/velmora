import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['footer'] };

export default function SiteFooter({ t }: Props) {
  return (
    <footer className="bg-[#1A1410] text-[#9C8A7E] pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
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
            <p className="text-sm leading-relaxed mb-4">{t.tagline}</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 border border-[#2D2420] flex items-center justify-center hover:border-[#C4704F] hover:text-[#C4704F] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 border border-[#2D2420] flex items-center justify-center hover:border-[#C4704F] hover:text-[#C4704F] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 border border-[#2D2420] flex items-center justify-center hover:border-[#C4704F] hover:text-[#C4704F] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </a>
            </div>
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
                <span className="block text-[#6B5B4E] text-xs mb-0.5">{t.phoneLabel}</span>
                <a href="tel:+380991234567" className="text-white hover:text-[#C4704F] transition-colors">+38 (099) 123-45-67</a>
              </p>
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
