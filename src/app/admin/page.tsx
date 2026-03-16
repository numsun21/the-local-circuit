'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [publishing, setPublishing] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'localcircuit2026') { setAuthed(true) }
    else alert('Wrong password')
  }

  useEffect(() => {
    if (authed) fetchSubmissions()
  }, [authed])

  const fetchSubmissions = async () => {
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setSubmissions(data || [])
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

  const handlePublish = async (s: any) => {
    setPublishing(true)
    const slug = slugify(s.title) + '-' + s.id.slice(0, 6)
    const { error } = await supabase.from('articles').insert([{
      titles: s.title,
      content: s.article,
      author: `${s.first_name} ${s.last_name}`,
      city: s.city,
      state: 'Ohio',
      published_at: new Date().toISOString(),
      slug,
    }])
    if (!error) {
      await supabase.from('submissions').update({ published: true }).eq('id', s.id)
      alert('Published!')
      fetchSubmissions()
      setSelected(null)
    } else {
      alert('Error: ' + error.message)
    }
    setPublishing(false)
  }

  if (!authed) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '2rem' }}>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        <button type="submit" style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Login</button>
      </form>
    </main>
  )

  if (selected) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setSelected(null)} style={{ fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem' }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666' }}>{selected.city} · {selected.school}</p>
          <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0.5rem 0' }}>{selected.title}</h1>
          <p style={{ fontSize: '13px', color: '#666' }}>By {selected.first_name} {selected.last_name} · {selected.email}</p>
        </div>
        <button onClick={() => handlePublish(selected)} disabled={publishing || selected.published}
          style={{ padding: '12px 24px', background: selected.published ? '#ccc' : '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: selected.published ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
          {selected.published ? 'Published' : publishing ? 'Publishing...' : 'Publish Story'}
        </button>
      </div>
      <p style={{ fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-wrap', borderTop: '0.5px solid #ddd', paddingTop: '1.5rem' }}>{selected.article}</p>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 900 }}>Submissions</h1>
        <span style={{ fontSize: '13px', color: '#666' }}>{submissions.length} total</span>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {submissions.map(s => (
          <div key={s.id} onClick={() => setSelected(s)} style={{ padding: '1.25rem 0', borderBottom: '0.5px solid #ddd', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>{s.city} · {s.school}</p>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#666' }}>By {s.first_name} {s.last_name}</p>
            </div>
            {s.published && <span style={{ fontSize: '11px', color: '#999', border: '0.5px solid #ccc', padding: '4px 10px', borderRadius: '20px' }}>Published</span>}
          </div>
        ))}
      </div>
    </main>
  )
}
