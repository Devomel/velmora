'use client';

import { useEffect } from 'react';
import { pushEventOnce } from '@/lib/analytics';

type Props = {
  articleKey: string;
  name: string;
  price: number;
};

export default function ViewItemTracker({ articleKey, name, price }: Props) {
  useEffect(() => {
    pushEventOnce('view_item', {
      currency: 'EUR',
      value: price,
      items: [{ item_id: articleKey, item_name: name, price, quantity: 1 }],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
