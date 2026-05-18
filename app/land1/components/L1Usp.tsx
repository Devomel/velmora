type UspT = {
  badge: string;
  title: string;
  subtitle: string;
  items: { title: string; desc: string }[];
};

const icons = [
  // factory/direct
  <svg key={0} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5">
    <path d="M3 9l4-4 4 4M7 5v14M13 9l4-4 4 4M17 5v14" />
    <path d="M3 19h18" />
  </svg>,
  // handcraft
  <svg key={1} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5">
    <path d="M18 11V6l-3-3H5a2 2 0 00-2 2v14a2 2 0 002 2h6" />
    <path d="M15 3v4h4M21 15l-5 5-2-2" />
  </svg>,
  // certified/shield
  <svg key={2} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // return/refresh
  <svg key={3} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5">
    <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
    <path d="M3 12V6l4 4M21 12v6l-4-4" />
  </svg>,
];

export default function L1Usp({ t }: { t: UspT }) {
  return (
    <section className="bg-[#FDFCF8] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#52B788] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A2520] mt-3 mb-4">{t.title}</h2>
          <p className="text-[#6B8070] text-base max-w-xl mx-auto">{t.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {t.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 border border-[#D8E8DC] bg-white hover:border-[#52B788] hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#F3EFE5] rounded-sm flex items-center justify-center">
                {icons[i]}
              </div>
              <div>
                <h3 className="text-base font-medium text-[#1A2520] mb-1">{item.title}</h3>
                <p className="text-sm text-[#6B8070] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
