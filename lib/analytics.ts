declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
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
  markConverted(formData);
}
