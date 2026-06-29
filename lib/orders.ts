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
  const subdomain = typeof window !== 'undefined' ? window.location.hostname : '';
  fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, subdomain }),
  }).catch(() => {});
}
