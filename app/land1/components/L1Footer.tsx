type FooterT = {
  tagline: string;
  rights: string;
  links: string[];
  contact: string;
};

export default function L1Footer({ t, logoText }: { t: FooterT; logoText: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0E2318] border-t border-[#2D5040] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5" width="20" height="20">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              <span className="text-[#E8F5EE] font-light text-lg">{logoText}</span>
            </div>
            <p className="text-[#8FB89F] text-sm max-w-xs">{t.tagline}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-2 text-sm">
            <p className="text-[#8FB89F] text-xs">{t.contact}</p>
            <div className="flex gap-4">
              {t.links.map((link, i) => (
                <a key={i} href="#" className="text-[#8FB89F] hover:text-[#52B788] transition-colors text-xs">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#2D5040] pt-6 text-center">
          <p className="text-[#8FB89F] text-xs">© {year} {logoText} · {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
