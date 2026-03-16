'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    window.location.href = '/'
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
        <a href="/signup" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>No account? Sign up</a>
      </div>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '0.75rem' }}>Welcome back</p>
        <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Log in</h1>

        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '1rem', padding: '10px', background: '#fff5f5', border: '0.5px solid #ffcccc', borderRadius: '4px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '0.5px solid #ddd', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', borderRadius: '2px', background: '#fafaf8' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '0.5px solid #ddd', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', borderRadius: '2px', background: '#fafaf8' }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px', fontFamily: 'Georgia, serif', marginTop: '0.5rem' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
