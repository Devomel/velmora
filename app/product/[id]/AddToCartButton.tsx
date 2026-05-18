'use client';

import { useCart } from '@/components/CartProvider';
import type { CartItem } from '@/components/CartProvider';

type Props = {
  item: Omit<CartItem, 'qty'>;
  label: string;
};

export default function AddToCartButton({ item, label }: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(item)}
      className="w-full flex items-center justify-center gap-3 bg-[#C4704F] hover:bg-[#A85A3A] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
      {label}
    </button>
  );
}
