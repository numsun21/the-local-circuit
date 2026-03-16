'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'localcircuit2026'

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
  published: boolean
  status: string
  feedback: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selected, setSelected] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [filter, setFilter] = useState<'all'|'pending'|'published'|'rejected'>('all')
  const [error, setError] = useState('')
  const [articles, setArticles] = useState<any[]>([])
  const [tab, setTab] = useState<'submissions'|'articles'>('submissions')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true) }
    else alert('Wrong password')
  }

  useEffect(() => {
    if (authed) { fetchSubmissions(); fetchArticles() }
  }, [authed])

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setSubmissions(data || [])
    setLoading(false)
  }

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('published_at', { ascending: false })
    setArticles(data || [])
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

  const handlePublish = async (s: Submission) => {
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
      views: 0,
    }])
    if (!error) {
      await supabase.from('submissions').update({ published: true, status: 'published' }).eq('id', s.id)
      alert('Published! Live at /article/' + slug)
      fetchSubmissions()
      setSelected(null)
    } else {
      alert('Error: ' + error.message)
    }
    setPublishing(false)
  }

  const handleReject = async (s: Submission) => {
    if (!feedback.trim()) { alert('Please add feedback before rejecting.'); return }
    await supabase.from('submissions').update({ status: 'rejected', feedback }).eq('id', s.id)
    alert('Submission rejected with feedback saved.')
    fetchSubmissions()
    setSelected(null)
    setFeedback('')
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  const filtered = submissions.filter(s => filter === 'all' ? true : s.status === filter)

  const statusColor = (s: string) => {
    if (s === 'published') return { color: '#2d7d46', background: '#f0faf4', border: '0.5px solid #b7e0c4' }
    if (s === 'rejected') return { color: '#c0392b', background: '#fdf5f5', border: '0.5px solid #f5c6c6' }
    return { color: '#888', background: '#f9f9f7', border: '0.5px solid #e8e8e4' }
  }

  if (!authed) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a', display: 'block', marginBottom: '2rem' }}>The Local Circuit</a>
      <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '2rem' }}>Admin</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: '2px', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none' }} />
        <button type="submit" style={{ padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Login</button>
      </form>
    </main>
  )

  if (selected) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => { setSelected(null); setFeedback('') }} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999' }}>{selected.city} · {selected.school}</p>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0.5rem 0', letterSpacing: '-0.01em' }}>{selected.title}</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>By {selected.first_name} {selected.last_name} · {selected.email}</p>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: '2px', display: 'inline-block', marginTop: '0.5rem', ...statusColor(selected.status || 'pending') }}>{selected.status || 'pending'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={() => handlePublish(selected)} disabled={publishing || selected.published} style={{ padding: '10px 20px', background: selected.published ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: selected.published ? 'default' : 'pointer', fontFamily: 'Georgia, serif' }}>
            {selected.published ? 'Published' : publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <p style={{ fontSize: '16px', lineHeight: 1.9, whiteSpace: 'pre-wrap', borderTop: '0.5px solid #e0e0e0', paddingTop: '1.5rem', color: '#333', marginBottom: '2rem' }}>{selected.article}</p>

      <div style={{ background: '#fdf5f5', border: '0.5px solid #f5c6c6', padding: '1.25rem', borderRadius: '2px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c0392b', marginBottom: '0.75rem' }}>Reject with Feedback</p>
        <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Explain why you're rejecting this and what the writer can improve..." style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #f5c6c6', borderRadius: '2px', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none', resize: 'vertical', marginBottom: '0.75rem', background: '#fff' }} />
        <button onClick={() => handleReject(selected)} style={{ padding: '10px 20px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Reject Submission
        </button>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
        <div style={{ display: 'flex', gap: '0', border: '0.5px solid #e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
          {(['submissions', 'articles'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', background: tab === t ? '#1a1a1a' : '#fff', color: tab === t ? '#fff' : '#666', border: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>{t}</button>
          ))}
        </div>
      </div>

      {tab === 'submissions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 900 }}>Submissions</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['all', 'pending', 'published', 'rejected'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', background: filter === f ? '#1a1a1a' : '#fff', color: filter === f ? '#fff' : '#888', border: '0.5px solid #e0e0e0', borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>{f} ({f === 'all' ? submissions.length : submissions.filter(s => s.status === f).length})</button>
              ))}
            </div>
          </div>
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</p>}
          {loading ? <p style={{ color: '#999' }}>Loading...</p> : (
            <div>
              {filtered.map(s => (
                <div key={s.id} onClick={() => setSelected(s)} style={{ padding: '1.25rem 0', borderBottom: '0.5px solid #e8e8e4', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '0.25rem' }}>{s.city} · {s.school}</p>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '13px', color: '#999' }}>By {s.first_name} {s.last_name} · {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '2px', flexShrink: 0, ...statusColor(s.status || 'pending') }}>{s.status || 'pending'}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'articles' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 900 }}>Published Articles</h1>
            <span style={{ fontSize: '13px', color: '#999' }}>{articles.length} total</span>
          </div>
          {articles.map(a => (
            <div key={a.id} style={{ padding: '1.25rem 0', borderBottom: '0.5px solid #e8e8e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '0.25rem' }}>{a.city} · {a.state}</p>
                <a href={`/article/${a.slug}`} style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>{a.titles}</a>
                <p style={{ fontSize: '13px', color: '#999' }}>By {a.author} · {(a.views || 0).toLocaleString()} views</p>
              </div>
              <button onClick={() => handleDeleteArticle(a.id)} style={{ padding: '6px 14px', background: 'none', border: '0.5px solid #f5c6c6', color: '#c0392b', borderRadius: '2px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif', flexShrink: 0 }}>Delete</button>
            </div>
          ))}
        </>
      )}
    </main>
  )
}
