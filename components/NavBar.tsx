'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import type { CommonT } from '@/lib/i18n';

type Props = { t: CommonT['nav'] };

export default function NavBar({ t }: Props) {
  const pathname = usePathname();
  const { openCart, count } = useCart();

  const links = [
    { href: '/', label: t.home },
    { href: '/about', label: t.about },
    { href: '/delivery', label: t.delivery },
    { href: '/contacts', label: t.contacts },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8DDD4]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#C4704F" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="8" stroke="#C4704F" strokeWidth="1" />
            <circle cx="16" cy="16" r="3" fill="#C4704F" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-[#1A1410]">cookware market</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 flex-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? 'text-[#C4704F] font-medium'
                  : 'text-[#6B5B4E] hover:text-[#C4704F]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={openCart}
          className="relative ml-auto flex items-center gap-2 bg-[#C4704F] hover:bg-[#A85A3A] text-white px-4 py-2 transition-colors flex-shrink-0"
          aria-label={t.cart}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="text-sm hidden sm:inline">{t.cart}</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#C8A86B] text-[#1A1410] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
