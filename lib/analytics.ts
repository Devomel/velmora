declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
  }
}

type GaParams = Record<string, unknown>;

type GaItem = { item_id?: string; item_name?: string; price?: number; quantity?: number };

function toPixelContents(items: GaItem[]) {
  return items.map(i => ({ id: i.item_id ?? i.item_name ?? '', quantity: i.quantity ?? 1, item_price: i.price ?? 0 }));
}

function toContentIds(items: GaItem[]) {
  return items.map(i => i.item_id ?? i.item_name ?? '');
}

const GA_TO_PIXEL: Record<string, (p: GaParams) => [string, Record<string, unknown>?]> = {
  view_item: (p) => {
    const items = (p.items as GaItem[] | undefined) ?? [];
    return ['ViewContent', { content_type: 'product', content_ids: toContentIds(items), contents: toPixelContents(items), value: p.value, currency: p.currency }];
  },
  add_to_cart: (p) => {
    const items = (p.items as GaItem[] | undefined) ?? [];
    return ['AddToCart', { content_type: 'product', content_ids: toContentIds(items), contents: toPixelContents(items), value: p.value, currency: p.currency }];
  },
  begin_checkout: (p) => {
    const items = (p.items as GaItem[] | undefined) ?? [];
    return ['InitiateCheckout', { content_type: 'product', content_ids: toContentIds(items), contents: toPixelContents(items), value: p.value, currency: p.currency }];
  },
  purchase: (p) => {
    const items = (p.items as GaItem[] | undefined) ?? [];
    return ['Purchase', { content_type: 'product', content_ids: toContentIds(items), contents: toPixelContents(items), value: p.value, currency: p.currency }];
  },
  generate_lead: (p) => ['Lead', { value: p.value, currency: p.currency }],
};

function pushPixel(gaEvent: string, params?: GaParams): void {
  const mapper = GA_TO_PIXEL[gaEvent];
  if (!mapper) return;
  const [pixelEvent, pixelParams] = mapper(params ?? {});
  !(function(f: typeof window, t: string, e: string, p: Record<string, unknown> | undefined) {
    try {
      if (typeof f.fbq !== 'function') return;
      f.fbq(t, e, p);
    } catch {}
  }(window, 'track', pixelEvent, pixelParams));
}

const KEY = 'ga_conv';

function load(): { done?: boolean; sigs?: string[] } {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function sig(d: Record<string, string>): string {
  return Object.values(d)
    .map(v => v.toLowerCase().trim())
    .join('|');
}

export function isBlocked(formData?: Record<string, string>): boolean {
  const s = load();
  if (s.done) return true;
  if (formData && s.sigs?.includes(sig(formData))) return true;
  return false;
}

export function markConverted(formData?: Record<string, string>): void {
  const fp = formData ? sig(formData) : undefined;
  try {
    localStorage.setItem(KEY, JSON.stringify({ done: true, sigs: fp ? [fp] : [] }));
  } catch {}
}

const _firedOnce = new Set<string>();

export function pushEventOnce(name: string, params?: Record<string, unknown>): void {
  if (_firedOnce.has(name)) return;
  _firedOnce.add(name);
  pushEvent(name, params);
}

export function pushEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || isBlocked()) return;
  try {
    window.gtag('event', name, params);
  } catch {}
  pushPixel(name, params);
}

export function pushConversionEvent(
  name: string,
  params?: Record<string, unknown>,
  formData?: Record<string, string>,
): void {
  if (typeof window === 'undefined' || isBlocked(formData)) return;
  try {
    window.gtag('event', name, params);
  } catch {}
  pushPixel(name, params);
  markConverted(formData);
}
