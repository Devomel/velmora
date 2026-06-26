'use client';

import { useEffect, useState, Fragment } from 'react';

type Order = {
  id: number;
  created_at: string;
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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async (f: string) => {
    setLoading(true);
    const res = await fetch(f ? `/api/admin/orders?status=${f}` : '/api/admin/orders');
    if (res.status === 401) { window.location.href = '/admin/login/'; return; }
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const open = (o: Order) => {
    setExpanded(o.id);
    setEditStatus(o.status);
    setEditNotes(o.notes ?? '');
  };

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
    load(filter);
  };

  const allNew = orders.filter(o => o.status === 'new').length;
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
          <p className="text-xs text-gray-400 mt-0.5">{allNew} нових · {todayNew} сьогодні</p>
        </div>
        <a href="/api/admin/logout" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          Вийти →
        </a>
      </header>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-0.5 overflow-x-auto">
        {FILTERS.map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFilter(val); close(); }}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              filter === val
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
                        <td colSpan={8} className="px-4 py-4 bg-orange-50 border-t border-orange-100">
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
