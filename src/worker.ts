import { makeToken, verifyToken, getSessionToken, setCookieHeader, clearCookieHeader } from './auth';

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  run(): Promise<void>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

const VALID_STATUSES = new Set(['new', 'called', 'done', 'declined']);

const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });

async function authed(req: Request, env: Env): Promise<boolean> {
  const token = getSessionToken(req);
  return !!token && await verifyToken(token, env.ADMIN_PASSWORD);
}

// POST /api/order — public, called from store pages
async function createOrder(req: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }

  const { source, name, phone, email, product, qty, total, currency } = body as {
    source?: string; name?: string; phone?: string; email?: string;
    product?: string; qty?: number; total?: number; currency?: string;
  };

  await env.DB.prepare(
    `INSERT INTO orders (source, name, phone, email, product, qty, total, currency)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    String(source ?? 'unknown'),
    name ?? null, phone ?? null, email ?? null, product ?? null,
    Number(qty ?? 1), total != null ? Number(total) : null, currency ?? null,
  ).run();

  return json({ ok: true });
}

// POST /api/admin/login
async function login(req: Request, env: Env): Promise<Response> {
  let body: { password?: string };
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  if (!env.ADMIN_PASSWORD || body.password !== env.ADMIN_PASSWORD) {
    return json({ error: 'wrong password' }, 401);
  }
  const token = await makeToken(env.ADMIN_PASSWORD);
  return json({ ok: true }, 200, { 'Set-Cookie': setCookieHeader(token) });
}

// GET /api/admin/logout
function logout(): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: '/admin/login/', 'Set-Cookie': clearCookieHeader() },
  });
}

// GET /api/admin/orders[?status=...]
async function listOrders(req: Request, env: Env): Promise<Response> {
  const status = new URL(req.url).searchParams.get('status') ?? '';
  const filtered = VALID_STATUSES.has(status);
  const stmt = filtered
    ? env.DB.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT 500').bind(status)
    : env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500');
  const { results } = await stmt.all();
  return json(results);
}

// PATCH /api/admin/orders/:id
async function updateOrder(req: Request, env: Env, id: string): Promise<Response> {
  let body: { status?: string; notes?: string };
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }

  const sets: string[] = [];
  const vals: unknown[] = [];
  if (body.status && VALID_STATUSES.has(body.status)) { sets.push('status = ?'); vals.push(body.status); }
  if (typeof body.notes === 'string') { sets.push('notes = ?'); vals.push(body.notes); }
  if (!sets.length) return json({ error: 'nothing to update' }, 400);

  vals.push(id);
  await env.DB.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  return json({ ok: true });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const p = url.pathname;
    const m = req.method;

    // Public order submission
    if (p === '/api/order' && m === 'POST') return createOrder(req, env);

    // Auth
    if (p === '/api/admin/login' && m === 'POST') return login(req, env);
    if (p === '/api/admin/logout') return logout();

    // Protected API
    if (p === '/api/admin/orders' && m === 'GET') {
      if (!await authed(req, env)) return json({ error: 'unauthorized' }, 401);
      return listOrders(req, env);
    }
    const orderMatch = p.match(/^\/api\/admin\/orders\/(\d+)$/);
    if (orderMatch && m === 'PATCH') {
      if (!await authed(req, env)) return json({ error: 'unauthorized' }, 401);
      return updateOrder(req, env, orderMatch[1]);
    }

    // Guard admin pages — redirect to login if no valid session
    if (p.startsWith('/admin') && !p.startsWith('/admin/login')) {
      if (!await authed(req, env)) {
        return Response.redirect(new URL('/admin/login/', url).toString(), 302);
      }
    }

    // Everything else — serve static assets
    return env.ASSETS.fetch(req);
  },
};
