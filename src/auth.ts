const MSG = 'crm-session-v1';

async function hmac(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(MSG));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function makeToken(password: string): Promise<string> {
  return hmac(password);
}

export async function verifyToken(token: string, password: string): Promise<boolean> {
  const expected = await hmac(password);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get('Cookie') ?? '';
  const m = cookie.match(/(?:^|;\s*)crm_session=([^;]+)/);
  return m ? m[1] : null;
}

export function setCookieHeader(token: string): string {
  return `crm_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;
}

export function clearCookieHeader(): string {
  return `crm_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
