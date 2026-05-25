import Image from 'next/image';
import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['hero'] };

const ADVANTAGE_ICONS = [
   <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
   </svg>,
   <svg key="truck" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
   </svg>,
   <svg key="home" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
   </svg>,
   <svg key="heart" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
   </svg>,
];

export default function HeroSection({ t }: Props) {
   return (
      <section className="relative bg-[#eadcd4] overflow-hidden landscape:lg:flex-1 landscape:lg:flex landscape:lg:flex-col">
         <div className="absolute inset-0 opacity-[0.035]" aria-hidden>
            <svg width="100%" height="100%">
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="#7A5540" />
               </pattern>
               <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
         </div>

         {/* Portrait/mobile: flex-col (image top, text bottom); Landscape desktop: 2-col grid */}
         <div className="relative flex flex-col landscape:lg:grid landscape:lg:grid-cols-2 landscape:lg:flex-1">
            {/* TEXT — bottom on portrait, left column on landscape desktop */}
            <div className="landscape:lg:col-start-1 landscape:lg:row-start-1 flex items-center justify-center landscape:lg:justify-start px-5 landscape:lg:pl-36 landscape:lg:pr-8 py-8 landscape:lg:py-0">
               <div className="w-full text-center landscape:lg:text-left">
                  <h1 className="text-4xl md:text-5xl landscape:lg:text-[5.5rem] font-light text-[#1A1410] tracking-tight mb-4 landscape:lg:mb-7 leading-[1.06]">
                     {t.title}<br />
                     <span className="text-[#C4704F]">{t.titleHighlight}</span>
                  </h1>

                  <p className="text-base landscape:lg:text-xl text-[#6B5B4E] mb-6 landscape:lg:mb-11 max-w-md mx-auto landscape:lg:mx-0 leading-relaxed">{t.subtitle}</p>

                  <div className="flex flex-col sm:flex-row gap-3 landscape:lg:gap-4 justify-center landscape:lg:justify-start">
                     <a
                        href="#catalog"
                        className="inline-flex items-center justify-center bg-[#C4704F] hover:bg-[#A85A3A] text-white px-10 py-3.5 landscape:lg:py-4 text-sm landscape:lg:text-base font-semibold tracking-wide rounded-full transition-all duration-200 shadow-[0_4px_16px_rgba(196,112,79,0.4)] hover:shadow-[0_6px_22px_rgba(196,112,79,0.5)]"
                     >
                        {t.cta}
                     </a>
                     <a
                        href="#guarantees"
                        className="hidden landscape:lg:inline-flex items-center justify-center border border-[#C4704F]/50 text-[#C4704F] hover:bg-[#C4704F] hover:text-white px-10 py-4 text-base font-semibold tracking-wide rounded-full transition-all duration-200"
                     >
                        {t.ctaSecondary}
                     </a>
                  </div>
               </div>
            </div>
            {/* BANNER — top on portrait, right column on landscape desktop */}
            <div className="relative aspect-square landscape:lg:aspect-auto landscape:lg:col-start-2 landscape:lg:row-start-1">
               <div className="absolute inset-0">
                  <Image
                     src="/hero-banner.png"
                     alt={t.bannerTitle}
                     fill
                     className="object-cover"
                     priority
                  />
                  <div className="landscape:lg:hidden absolute top-0 left-0 w-[70%] h-[40%] flex flex-col justify-end px-5 pb-3 pointer-events-none">
                     <span
                        className="text-[20vw] font-bold leading-none tracking-tight whitespace-nowrap"
                        style={{ color: 'transparent', WebkitTextStroke: '2px #5f402f' }}
                     >-50%</span>
                     <span className="text-[5.8vw] text-[#4A3020] mt-[1.5vw] font-medium leading-snug whitespace-nowrap">{t.bannerDiscountLabel}</span>
                  </div>
               </div>
            </div>



         </div>

      </section>
   );
}

export function HeroAdvantages({ t }: Props) {
   return (
      <div className="relative bg-white/75 backdrop-blur-md border-t border-[#D9CCBF]">
         <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {t.advantages.map(({ title, desc }, i) => (
               <div key={title} className="flex flex-col items-center text-center gap-2">
                  <span className="text-[#C4704F]">{ADVANTAGE_ICONS[i]}</span>
                  <h3 className="text-sm font-semibold text-[#1A1410] tracking-tight">{title}</h3>
                  <p className="text-xs text-[#9C8A7E] leading-relaxed">{desc}</p>
               </div>
            ))}
         </div>
      </div>
   );
}
