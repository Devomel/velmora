'use client';

import { useRouter } from 'next/navigation';
import type { CommonT } from '@/lib/i18n';
import { IS_RO } from '@/lib/i18n';
import { useCart } from './CartProvider';

type Props = { t: CommonT['cart'] };

const FREE_DELIVERY_THRESHOLD = 50;

export default function CartPanel({ t }: Props) {
  const { items, isOpen, closeCart, removeItem, updateQty, addItem, total, count } = useCart();
  const router = useRouter();
  const progress = Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = FREE_DELIVERY_THRESHOLD - total;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD4]">
          <h2 className="text-lg font-medium text-[#1A1410]">
            {t.title} {count > 0 && <span className="text-[#9C8A7E] text-sm">({count})</span>}
          </h2>
          <button onClick={closeCart} className="text-[#9C8A7E] hover:text-[#1A1410] transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free delivery progress */}
        {total > 0 && (
          <div className="px-6 py-3 bg-[#FDFAF7] border-b border-[#E8DDD4]">
            {remaining > 0 ? (
              <p className="text-xs text-[#6B5B4E] mb-2">
                {t.freeDeliveryRemaining.replace('{amount}', String(remaining))}
              </p>
            ) : (
              <p className="text-xs font-semibold text-[#6B8F71] mb-2">{t.freeDeliveryAchieved}</p>
            )}
            <div className="h-1.5 bg-[#E8DDD4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C4704F] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E8DDD4" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-[#9C8A7E]">{t.empty}</p>
              <button onClick={closeCart} className="text-sm text-[#C4704F] underline underline-offset-2">
                {t.backToCatalog}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-[#F5F0EB] rounded-sm flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1410] truncate">{item.name}</p>
                    <p className="text-sm text-[#C4704F] font-semibold mt-0.5">{IS_RO ? `${item.price} lei` : `€${item.price}`}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 border border-[#E8DDD4] flex items-center justify-center text-[#6B5B4E] hover:border-[#C4704F] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 border border-[#E8DDD4] flex items-center justify-center text-[#6B5B4E] hover:border-[#C4704F] transition-colors text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[#9C8A7E] hover:text-[#B85450] transition-colors"
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
          <div className="px-6 py-5 border-t border-[#E8DDD4] bg-white">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={t.promoPlaceholder}
                className="flex-1 border border-[#E8DDD4] px-3 py-2 text-sm focus:border-[#C4704F] outline-none"
              />
              <button className="px-4 py-2 text-sm border border-[#C4704F] text-[#C4704F] hover:bg-[#C4704F] hover:text-white transition-colors">
                {t.promoApply}
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-[#6B5B4E]">{t.total}:</span>
              <span className="text-xl font-semibold text-[#1A1410]">{IS_RO ? `${total} lei` : `€${total}`}</span>
            </div>

            <button
              onClick={() => { closeCart(); router.push('/checkout'); }}
              className="w-full bg-[#C4704F] hover:bg-[#A85A3A] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {t.checkout}
            </button>

            <p className="text-center text-xs text-[#9C8A7E] mt-3">{t.paymentNote}</p>
          </div>
        )}
      </div>
    </>
  );
}
