'use client';

import { useState } from 'react';
import { useL1Cart } from '../../components/L1CartProvider';
import type { L1CartItem } from '../../components/L1CartProvider';

type Props = {
  item: Omit<L1CartItem, 'qty'>;
  label: string;
};

export default function L1AddToCartButton({ item, label }: Props) {
  const { addItem } = useL1Cart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
        added
          ? 'bg-[#2D6A4F] text-white'
          : 'bg-[#52B788] hover:bg-[#2D6A4F] text-white'
      }`}
    >
      {added ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>✓</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
