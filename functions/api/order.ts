interface Env {
  GOOGLE_SA: string;       // service account JSON (Pages secret)
  GOOGLE_SHEET_ID: string; // sheet ID from URL (Pages secret)
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function b64url(s: string): string {
  return btoa(s).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const msg = `${header}.${payload}`;

  const pemBody = sa.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  const key = await crypto.subtle.importKey(
    'pkcs8',
    Uint8Array.from(atob(pemBody), c => c.charCodeAt(0)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(msg));
  const jwt = `${msg}.${b64url(String.fromCharCode(...new Uint8Array(sig)))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const { access_token } = await res.json() as { access_token: string };
  return access_token;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response('bad json', { status: 400 }); }

  // Fire-and-forget: always return ok so checkout isn't blocked
  if (env.GOOGLE_SA && env.GOOGLE_SHEET_ID) {
    (async () => {
      try {
        const sa: ServiceAccount = JSON.parse(env.GOOGLE_SA);
        const token = await getAccessToken(sa);
        const date = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/A:A:append?valueInputOption=USER_ENTERED`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [[
              date,
              body.subdomain ?? '',
              body.source ?? '',
              body.name ?? '',
              body.phone ?? '',
              body.email ?? '',
              body.product ?? '',
              body.qty ?? 1,
              body.total ?? '',
              body.currency ?? '',
            ]] }),
          },
        );
      } catch (_) { /* silent */ }
    })();
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
