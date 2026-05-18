'use client';

import { useL1Cart } from './L1CartProvider';

type Props = {
  logoText: string;
  cartLabel: string;
};

export default function L1Header({ logoText, cartLabel }: Props) {
  const { openCart, count } = useL1Cart();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#0E2318]/95 backdrop-blur-sm border-b border-[#2D5040]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5" width="22" height="22">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </div>
          <span className="text-[#E8F5EE] font-light text-lg tracking-wide">{logoText}</span>
        </div>

        <button
          onClick={openCart}
          className="flex items-center gap-2 text-[#E8F5EE] hover:text-[#52B788] transition-colors group"
          aria-label={cartLabel}
        >
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#52B788] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </div>
          <span className="text-sm hidden sm:inline">{cartLabel}</span>
        </button>
      </div>
    </header>
  );
}
