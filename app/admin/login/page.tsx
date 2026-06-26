'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = '/admin/';
    } else {
      setError('Невірний пароль');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">Вхід у CRM</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            className="border border-gray-300 rounded px-3 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}
