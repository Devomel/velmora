'use client';

import { useL1Cart } from './L1CartProvider';

type CartT = {
  title: string;
  empty: string;
  backToCatalog: string;
  total: string;
  checkout: string;
  freeDeliveryRemaining: string;
  freeDeliveryAchieved: string;
  remove: string;
};

const FREE_DELIVERY = 50;

export default function L1CartPanel({ t }: { t: CartT }) {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useL1Cart();
  const progress = Math.min((total / FREE_DELIVERY) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY - total, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFCF8] z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D8E8DC]">
          <h2 className="text-lg font-medium text-[#1A2520]">
            {t.title}
            {count > 0 && <span className="ml-2 text-sm text-[#6B8070]">({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-[#6B8070] hover:text-[#1A2520] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free delivery progress */}
        {total > 0 && (
          <div className="px-6 py-3 bg-[#F3EFE5] border-b border-[#D8E8DC]">
            <p className="text-xs text-[#3D5448] mb-2">
              {remaining > 0
                ? t.freeDeliveryRemaining.replace('{amount}', remaining.toFixed(0))
                : t.freeDeliveryAchieved}
            </p>
            <div className="h-1.5 bg-[#D8E8DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#52B788] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F3EFE5] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-[#6B8070] text-sm">{t.empty}</p>
              <button
                onClick={closeCart}
                className="text-sm text-[#52B788] underline underline-offset-2 hover:text-[#2D6A4F] transition-colors"
              >
                {t.backToCatalog}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 py-3 border-b border-[#D8E8DC] last:border-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1A3D2B] to-[#2D6A4F] rounded flex-shrink-0 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M3 21c0-4 4-7 9-7s9 3 9 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A2520] leading-tight">{item.name}</p>
                    <p className="text-sm text-[#52B788] font-semibold mt-0.5">€{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 border border-[#D8E8DC] flex items-center justify-center text-[#3D5448] hover:border-[#52B788] hover:text-[#52B788] transition-colors text-base leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center font-medium text-[#1A2520]">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 border border-[#D8E8DC] flex items-center justify-center text-[#3D5448] hover:border-[#52B788] hover:text-[#52B788] transition-colors text-base leading-none"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[#6B8070] hover:text-red-500 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#D8E8DC]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#6B8070]">{t.total}:</span>
              <span className="text-xl font-semibold text-[#1A2520]">€{total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#52B788] hover:bg-[#2D6A4F] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors">
              {t.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
