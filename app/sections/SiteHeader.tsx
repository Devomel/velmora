'use client';

import { useEffect, useState } from 'react';
import type { HomeT } from '@/lib/i18n';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

type Props = { t: HomeT['header']; nav: { about: string; delivery: string; contacts: string } };

export default function SiteHeader({ t, nav }: Props) {
   const { openCart, count } = useCart();
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
   }, []);

   return (
      <header className={`fixed left-0 right-0 z-30 transition-all duration-500 pointer-events-none border-b ${
         scrolled
            ? 'top-2 px-4 bg-white/0 border-transparent'
            : 'top-0 px-0 bg-white border-[#E8DDD4]'
      }`}>
         <div className={`max-w-7xl mx-auto overflow-hidden border transition-all duration-500 pointer-events-auto ${
            scrolled
               ? 'bg-white/80 backdrop-blur-md rounded-2xl border-[#E8DDD4]/60 shadow-sm'
               : 'border-transparent'
         }`}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
               <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                     <circle cx="16" cy="16" r="14" stroke="#C4704F" strokeWidth="1.5" />
                     <circle cx="16" cy="16" r="8" stroke="#C4704F" strokeWidth="1" />
                     <circle cx="16" cy="16" r="3" fill="#C4704F" />
                  </svg>
                  <span className="text-xl font-semibold tracking-tight text-[#1A1410]">
                     cookware market
                  </span>
               </Link>

               <nav className="hidden md:flex items-center gap-5 text-sm text-[#5C4A3D]">
                  <Link href="/about" className="hover:text-[#C4704F] transition-colors">{nav.about}</Link>
                  <Link href="/delivery" className="hover:text-[#C4704F] transition-colors">{nav.delivery}</Link>
                  <Link href="/contacts" className="hover:text-[#C4704F] transition-colors">{nav.contacts}</Link>
               </nav>

               <div className="flex-1 max-w-md mx-auto relative" />

               <button
                  onClick={openCart}
                  className={`relative flex items-center gap-2 bg-[#C4704F] hover:bg-[#A85A3A] text-white px-4 py-2 transition-all duration-500 flex-shrink-0 cursor-pointer ${scrolled ? 'rounded-xl' : 'rounded-none'}`}
                  aria-label={t.cartLabel}
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  <span className="text-sm hidden sm:inline">{t.cartLabel}</span>
                  {count > 0 && (
                     <span className="absolute -top-1.5 -right-1.5 bg-[#C8A86B] text-[#1A1410] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {count}
                     </span>
                  )}
               </button>
            </div>
         </div>
      </header>
   );
}
