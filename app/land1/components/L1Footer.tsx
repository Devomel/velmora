type FooterT = { tagline: string; rights: string; links: string[]; contact: string };

export default function L1Footer({ t, logoText }: { t: FooterT; logoText: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#7F1D1D] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-5 h-5 bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" width="13" height="13">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-lg">{logoText}</span>
            </div>
            <p className="text-[#FECACA] text-sm max-w-xs">{t.tagline}</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[#FCA5A5] text-xs">{t.contact}</p>
            <div className="flex gap-4">
              {t.links.map((link, i) => (
                <a key={i} href="#" className="text-[#FECACA] hover:text-white transition-colors text-xs">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#991B1B] pt-6 text-center">
          <p className="text-[#FECACA] text-xs">© {year} {logoText} · {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
