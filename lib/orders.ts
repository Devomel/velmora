const WEBHOOK_URL = process.env.NEXT_PUBLIC_ORDERS_URL ?? '';

type OrderPayload = {
  source: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  product?: string | null;
  qty?: number;
  total?: number | null;
  currency?: string;
};

export function sendOrder(data: OrderPayload): void {
  if (!WEBHOOK_URL) return;
  const subdomain = typeof window !== 'undefined' ? window.location.hostname : '';
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ ...data, subdomain }),
  }).catch(() => {});
}
