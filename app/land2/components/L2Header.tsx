'use client';

import { useL2Cart } from './L2CartProvider';

type NavT = { catalog: string; reviews: string; guarantees: string; faq: string };
type Props = { logoText: string; cartLabel: string; nav: NavT };

const NAV_LINKS = [
  { href: '#catalog', key: 'catalog' },
  { href: '#reviews', key: 'reviews' },
  { href: '#guarantees', key: 'guarantees' },
  { href: '#faq', key: 'faq' },
] as const;

export default function L2Header({ logoText, cartLabel, nav }: Props) {
  const { openCart, count } = useL2Cart();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#FECACA] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#DC2626] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="14" height="14">
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
            </svg>
          </div>
          <span className="text-[#111827] font-medium text-lg tracking-tight">{logoText}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, key }) => (
            <a key={key} href={href} className="text-sm text-[#374151] hover:text-[#DC2626] transition-colors">
              {nav[key]}
            </a>
          ))}
        </nav>

        <button
          onClick={openCart}
          className="flex items-center gap-2 text-[#374151] hover:text-[#DC2626] transition-colors group"
          aria-label={cartLabel}
        >
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#DC2626] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </div>
          <span className="text-sm hidden sm:inline">{cartLabel}</span>
        </button>
      </div>
    </header>
  );
}
