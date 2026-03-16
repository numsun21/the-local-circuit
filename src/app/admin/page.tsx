'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Submission = {
  id: string
  first_name: string
  last_name: string
  email: string
  school: string
  city: string
  title: string
  article: string
  created_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selected, setSelected] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'localcircuit2026'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      fetchSubmissions()
    } else {
      alert('Wrong password')
    }
  }

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }

  if (!authed) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '2rem' }}>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        <button type="submit" style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Login</button>
      </form>
    </main>
  )

  if (selected) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setSelected(null)} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem' }}>← Back to submissions</button>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>{selected.city} · {selected.school}</p>
      <h1 style={{ fontSize: '40px', fontWeight: 900, margin: '0.5rem 0' }}>{selected.title}</h1>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '2rem' }}>By {selected.first_name} {selected.last_name} · {selected.email}</p>
      <p style={{ fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.article}</p>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 900 }}>Submissions</h1>
        <span style={{ fontSize: '13px', color: '#666' }}>{submissions.length} total</span>
      </div>
      {loading ? <p style={{ color: '#666' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {submissions.map(s => (
            <div key={s.id} onClick={() => setSelected(s)} style={{ padding: '1.25rem 0', borderBottom: '0.5px solid #ddd', cursor: 'pointer' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '0.25rem' }}>{s.city} · {s.school}</p>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#666' }}>By {s.first_name} {s.last_name} · {s.email}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
