declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
  }
}

type GaParams = Record<string, unknown>;

const GA_TO_PIXEL: Record<string, (p: GaParams) => [string, Record<string, unknown>?]> = {
  view_item: (p) => ['ViewContent', { content_type: 'product', value: p.value, currency: p.currency }],
  add_to_cart: (p) => ['AddToCart', { value: p.value, currency: p.currency }],
  begin_checkout: (p) => ['InitiateCheckout', { value: p.value, currency: p.currency }],
  purchase: (p) => ['Purchase', { value: p.value, currency: p.currency }],
  generate_lead: (p) => ['Lead', { value: p.value, currency: p.currency }],
};

function pushPixel(gaEvent: string, params?: GaParams): void {
  try {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    const mapper = GA_TO_PIXEL[gaEvent];
    if (!mapper) return;
    const [pixelEvent, pixelParams] = mapper(params ?? {});
    window.fbq('track', pixelEvent, pixelParams);
  } catch {}
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
