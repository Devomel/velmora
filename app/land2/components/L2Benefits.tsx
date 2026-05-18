type BenefitsT = {
  badge: string;
  title: string;
  items: { title: string; desc: string }[];
};

const icons = [
  <svg key={0} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 6v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key={1} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>,
  <svg key={2} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>,
  <svg key={3} width="30" height="30" viewBox="0 0 24 24" fill="#D97706">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>,
];

export default function L2Benefits({ t }: { t: BenefitsT }) {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#DC2626] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#111827] mt-3">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.items.map((item, i) => (
            <div key={i} className="border border-[#FECACA] p-6 text-center hover:border-[#DC2626] hover:shadow-md transition-all duration-200">
              <div className="w-14 h-14 bg-[#DC2626] flex items-center justify-center mx-auto mb-4">
                {icons[i]}
              </div>
              <h3 className="text-sm font-semibold text-[#111827] mb-2">{item.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
