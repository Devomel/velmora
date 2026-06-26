'use client';

import { useEffect, useState, Fragment } from 'react';

type Order = {
  id: number;
  created_at: string;
  subdomain: string;
  source: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  product: string | null;
  qty: number;
  total: number | null;
  currency: string | null;
  status: 'new' | 'called' | 'done' | 'declined';
  notes: string | null;
};

type SubdomainStat = {
  subdomain: string;
  total: number;
  new_count: number;
  called_count: number;
  done_count: number;
  declined_count: number;
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Нове',
  called: 'Передзвонено',
  done: 'Виконано',
  declined: 'Відмова',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-orange-100 text-orange-700',
  called: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-600',
};

const FILTERS = [
  ['', 'Всі'],
  ['new', 'Нові'],
  ['called', 'Передзвонено'],
  ['done', 'Виконано'],
  ['declined', 'Відмова'],
] as const;

function fmtDate(dt: string): string {
  const d = new Date(dt.endsWith('Z') ? dt : dt + 'Z');
  return d.toLocaleString('uk-UA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function shortHost(host: string): string {
  // velmora-no.pages.dev → NO, no.velmora.com → NO, etc.
  const m = host.match(/[^a-z](no|ro|de|ru|en)[^a-z]/i) ?? host.match(/^(no|ro|de|ru|en)\./i);
  if (m) return m[1].toUpperCase();
  return host.split('.')[0].toUpperCase();
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SubdomainStat[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [subdomainFilter, setSubdomainFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadStats = async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) setStats(await res.json());
  };

  const load = async (status: string, subdomain: string) => {
    setLoading(true);
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (subdomain) p.set('subdomain', subdomain);
    const res = await fetch(`/api/admin/orders${p.size ? '?' + p : ''}`);
    if (res.status === 401) { window.location.href = '/admin/login/'; return; }
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { load(statusFilter, subdomainFilter); }, [statusFilter, subdomainFilter]);

  const open = (o: Order) => { setExpanded(o.id); setEditStatus(o.status); setEditNotes(o.notes ?? ''); };
  const close = () => setExpanded(null);

  const save = async (id: number) => {
    setSaving(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editStatus, notes: editNotes }),
    });
    setSaving(false);
    close();
    load(statusFilter, subdomainFilter);
    loadStats();
  };

  const totalNew = stats.reduce((s, r) => s + r.new_count, 0);
  const todayNew = orders.filter(o => {
    const today = new Date().toISOString().slice(0, 10);
    return o.status === 'new' && o.created_at.startsWith(today);
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">CRM · Замовлення</h1>
          <p className="text-xs text-gray-400 mt-0.5">{totalNew} нових · {todayNew} сьогодні</p>
        </div>
        <a href="/api/admin/logout" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          Вийти →
        </a>
      </header>

      {/* Subdomain stats */}
      {stats.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => { setSubdomainFilter(''); close(); }}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-lg border text-xs transition-colors ${
              subdomainFilter === ''
                ? 'border-orange-400 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <span className="font-semibold text-sm">{stats.reduce((s, r) => s + r.total, 0)}</span>
            <span>Всі</span>
            {stats.reduce((s, r) => s + r.new_count, 0) > 0 && (
              <span className="mt-0.5 text-orange-500 font-medium">+{stats.reduce((s, r) => s + r.new_count, 0)} нових</span>
            )}
          </button>
          {stats.map(s => (
            <button
              key={s.subdomain}
              onClick={() => { setSubdomainFilter(s.subdomain); close(); }}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-lg border text-xs transition-colors ${
                subdomainFilter === s.subdomain
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="font-semibold text-sm">{s.total}</span>
              <span className="font-mono">{shortHost(s.subdomain)}</span>
              {s.new_count > 0 && (
                <span className="mt-0.5 text-orange-500 font-medium">+{s.new_count} нових</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-0.5 overflow-x-auto">
        {FILTERS.map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setStatusFilter(val); close(); }}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === val
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="p-4 lg:p-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Завантаження...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Замовлень немає</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">Ринок</th>
                  <th className="text-left px-4 py-3 font-medium">Звідки</th>
                  <th className="text-left px-4 py-3 font-medium">Ім&apos;я</th>
                  <th className="text-left px-4 py-3 font-medium">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium">Продукт</th>
                  <th className="text-left px-4 py-3 font-medium">Сума</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <Fragment key={o.id}>
                    <tr
                      onClick={() => expanded === o.id ? close() : open(o)}
                      className={`cursor-pointer transition-colors ${expanded === o.id ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{o.id}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded">
                          {shortHost(o.subdomain)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{o.source}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{o.name ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3">
                        {o.phone
                          ? <a href={`tel:${o.phone}`} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{o.phone}</a>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{o.product ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {o.total != null ? `${o.total} ${o.currency ?? ''}` : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                    </tr>

                    {/* Inline edit panel */}
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={9} className="px-4 py-4 bg-orange-50 border-t border-orange-100">
                          <div className="flex flex-wrap items-start gap-4">
                            {o.email && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Email</div>
                                <a href={`mailto:${o.email}`} className="text-sm text-blue-600 hover:underline">{o.email}</a>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Статус</div>
                              <select
                                value={editStatus}
                                onChange={e => setEditStatus(e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:border-orange-500 outline-none"
                              >
                                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                                  <option key={v} value={v}>{l}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <div className="text-xs text-gray-400 mb-1">Нотатки</div>
                              <textarea
                                value={editNotes}
                                onChange={e => setEditNotes(e.target.value)}
                                rows={2}
                                placeholder="Додайте нотатку..."
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 resize-none focus:border-orange-500 outline-none"
                              />
                            </div>
                            <div className="flex items-end gap-2 pb-0.5">
                              <button
                                onClick={() => save(o.id)}
                                disabled={saving}
                                className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded transition-colors disabled:opacity-60"
                              >
                                {saving ? 'Збереження...' : 'Зберегти'}
                              </button>
                              <button
                                onClick={close}
                                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors"
                              >
                                Скасувати
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
