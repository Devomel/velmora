'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type L1CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type L1CartContextType = {
  items: L1CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<L1CartItem, 'qty'>) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  total: number;
  count: number;
};

const L1CartContext = createContext<L1CartContextType | null>(null);

export function L1CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<L1CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<L1CartItem, 'qty'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <L1CartContext.Provider value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, total, count }}>
      {children}
    </L1CartContext.Provider>
  );
}

export function useL1Cart() {
  const ctx = useContext(L1CartContext);
  if (!ctx) throw new Error('useL1Cart must be used inside L1CartProvider');
  return ctx;
}
