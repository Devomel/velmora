'use client';

import { useState } from 'react';

import type { HomeT } from '@/lib/i18n';

import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

type Props = { t: HomeT['header'] };

export default function SiteHeader({ t }: Props) {
   const { openCart, count } = useCart();
   const [search, setSearch] = useState('');

   return (
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8DDD4]">
         <div className="bg-[#1A1410] text-white text-xs py-2 px-4 text-center">
            <span className="inline-flex items-center gap-4 flex-wrap justify-center">
               <span>🚚 {t.benefit1}</span>
               <span className="hidden sm:inline">·</span>
               <span>✅ {t.benefit2}</span>
               <span className="hidden sm:inline">·</span>
               <span>💳 {t.benefit3}</span>
            </span>
         </div>

         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
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
               <Link href="/about" className="hover:text-[#C4704F] transition-colors">
                  About
               </Link>

               <Link href="/delivery" className="hover:text-[#C4704F] transition-colors">
                  Delivery
               </Link>

               <Link href="/contacts" className="hover:text-[#C4704F] transition-colors">
                  Contacts
               </Link>
            </nav>

            <div className="flex-1 max-w-md mx-auto relative">
               {/* <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full border border-[#E8DDD4] px-4 py-2 pr-10 text-sm focus:border-[#C4704F] outline-none bg-[#FDFAF7] placeholder:text-[#9C8A7E]"
               />

               <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8A7E]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
               >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
               </svg> */}
            </div>

            <button
               onClick={openCart}
               className="relative flex items-center gap-2 bg-[#C4704F] hover:bg-[#A85A3A] text-white px-4 py-2 transition-colors flex-shrink-0"
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
      </header>
   );
}