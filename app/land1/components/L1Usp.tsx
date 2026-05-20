type UspT = {
  badge: string;
  title: string;
  subtitle: string;
  items: { title: string; desc: string }[];
};

const icons = [
  <svg key={0} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key={1} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>,
  <svg key={2} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>,
  <svg key={3} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
    <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
    <path d="M15 9l-6 6M9 9l6 6" />
    <path d="M3 3l18 18" />
  </svg>,
];

export default function L1Usp({ t }: { t: UspT }) {
  return (
    <section className="bg-[#FEF2F2] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#DC2626] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#111827] mt-3 mb-4">{t.title}</h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto">{t.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.items.map((item, i) => (
            <div
              key={i}
              className="bg-white border-l-4 border-[#DC2626] p-6 flex gap-5 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#FEF2F2] flex items-center justify-center">
                {icons[i]}
              </div>
              <div>
                <h3 className="text-base font-medium text-[#111827] mb-1">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
