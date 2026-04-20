'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KamiLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/kami/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/kami');
      } else {
        setError('Wrong password.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-geist-mono, monospace)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 340,
        padding: '40px 32px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>KAMI</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Watchtower Access
          </div>
        </div>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          required
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            color: '#fff',
            fontSize: 14,
            padding: '10px 14px',
            outline: 'none',
            width: '100%',
          }}
        />

        {error && (
          <div style={{ color: '#ff5f5f', fontSize: 12 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? 'rgba(255,255,255,0.1)' : '#fff',
            color: '#080c14',
            border: 'none',
            borderRadius: 6,
            padding: '10px 0',
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '1px',
          }}
        >
          {loading ? '...' : 'ENTER'}
        </button>
      </form>
    </div>
  );
}
