'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type L2CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type L2CartContextType = {
  items: L2CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<L2CartItem, 'qty'>) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  total: number;
  count: number;
};

const L2CartContext = createContext<L2CartContextType | null>(null);

export function L2CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<L2CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<L2CartItem, 'qty'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) setItems(prev => prev.filter(i => i.id !== id));
    else setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <L2CartContext.Provider value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, total, count }}>
      {children}
    </L2CartContext.Provider>
  );
}

export function useL2Cart() {
  const ctx = useContext(L2CartContext);
  if (!ctx) throw new Error('useL2Cart must be used inside L2CartProvider');
  return ctx;
}
