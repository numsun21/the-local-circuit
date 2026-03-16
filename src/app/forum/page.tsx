'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ForumPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', school: '', city: '', title: '', body: '' })
  const [submitted, setSubmitted] = useState(false)
  const [comment, setComment] = useState('')
  const [commentName, setCommentName] = useState('')
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from('forum_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data || [])
  }

  const handleSelectPost = (post: any) => {
    setSelected(post)
    fetchComments(post.id)
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('forum_posts').insert([form])
    setLoading(false)
    if (!error) { setSubmitted(true); fetchPosts() }
    else alert('Error: ' + error.message)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !commentName.trim()) return
    await supabase.from('forum_comments').insert([{ post_id: selected.id, name: commentName, body: comment }])
    setComment('')
    setCommentName('')
    fetchComments(selected.id)
  }

  if (showForm && !submitted) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setShowForm(false)} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem' }}>← Back to Forum</button>
      <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '0.25rem' }}>Start a Discussion</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Share an issue or question with students across Ohio.</p>
      <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {[
          { label: 'Your Name', key: 'name', placeholder: '' },
          { label: 'School', key: 'school', placeholder: 'e.g. Ohio State University' },
          { label: 'City / County', key: 'city', placeholder: 'e.g. Columbus, Franklin County' },
          { label: 'Discussion Title', key: 'title', placeholder: 'e.g. Should Columbus expand its public transit?' },
        ].map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>{f.label}</label>
            <input required value={(form as any)[f.key]} placeholder={f.placeholder} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Your Thoughts</label>
          <textarea required rows={8} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
          {loading ? 'Posting...' : 'Post Discussion'}
        </button>
      </form>
    </main>
  )

  if (showForm && submitted) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '1rem' }}>Posted!</h1>
      <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '2rem' }}>Your discussion is now live on the forum.</p>
      <button onClick={() => { setShowForm(false); setSubmitted(false) }} style={{ padding: '12px 24px', background: '#111', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Back to Forum</button>
    </main>
  )

  if (selected) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setSelected(null)} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem' }}>← Back to Forum</button>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>{selected.city} · {selected.school}</p>
      <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0.5rem 0' }}>{selected.title}</h1>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '1.5rem' }}>By {selected.name}</p>
      <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '0.5px solid #ddd' }}>{selected.body}</p>

      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1.25rem' }}>Responses ({comments.length})</h3>
      {comments.map(c => (
        <div key={c.id} style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '0.5px solid #eee' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.25rem' }}>{c.name}</p>
          <p style={{ fontSize: '15px', lineHeight: 1.7 }}>{c.body}</p>
        </div>
      ))}

      <form onSubmit={handleSubmitComment} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input required placeholder="Your name" value={commentName} onChange={e => setCommentName(e.target.value)} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        <textarea required rows={4} placeholder="Add your response..." value={comment} onChange={e => setComment(e.target.value)} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif', resize: 'vertical' }} />
        <button type="submit" style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Post Response</button>
      </form>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← The Local Circuit</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '1rem 0 2rem' }}>
        <div>
          <h1 style={{ fontSize: '56px', fontWeight: 900, margin: 0 }}>Forum</h1>
          <p style={{ fontStyle: 'italic', color: '#666', margin: '0.25rem 0 0' }}>Student discussions on local issues across Ohio.</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Start a Discussion</button>
      </div>
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
          <p style={{ fontStyle: 'italic', fontSize: '18px' }}>No discussions yet. Be the first.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map(p => (
            <div key={p.id} onClick={() => handleSelectPost(p)} style={{ padding: '1.25rem 0', borderBottom: '0.5px solid #ddd', cursor: 'pointer' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', margin: '0 0 0.3rem' }}>{p.city} · {p.school}</p>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 0.3rem' }}>{p.title}</h3>
              <p style={{ fontSize: '13px', color: '#666' }}>By {p.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
