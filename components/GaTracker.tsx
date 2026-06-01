'use client';

import { useEffect } from 'react';
import { pushEvent } from '@/lib/analytics';

type Props = {
  event: string;
  params?: Record<string, unknown>;
};

export default function GaTracker({ event, params }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { pushEvent(event, params); }, []);
  return null;
}
