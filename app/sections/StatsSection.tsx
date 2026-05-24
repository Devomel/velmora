import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['stats'] };

export default function StatsSection({ t }: Props) {
   return (
      <section className="py-16 bg-[#1A1410]">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
               {t.map(({ value, label, sub }) => (
                  <div key={label} className="relative">
                     <div className="text-5xl md:text-6xl font-light text-[#C4704F] mb-2">{value}</div>
                     <div className="text-white font-medium">{label}</div>
                     <div className="text-[#9C8A7E] text-sm mt-1">{sub}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
