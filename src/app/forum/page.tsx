'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = ['All', 'Education', 'Housing', 'Environment', 'Politics', 'Transit', 'Safety', 'Other']

export default function ForumPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', school: '', city: '', title: '', body: '', category: 'Other' })
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

  const handleUpvote = async (e: React.MouseEvent, post: any) => {
    e.stopPropagation()
    const newVotes = (post.upvotes || 0) + 1
    await supabase.from('forum_posts').update({ upvotes: newVotes }).eq('id', post.id)
    setPosts(posts.map(p => p.id === post.id ? { ...p, upvotes: newVotes } : p))
    if (selected?.id === post.id) setSelected({ ...selected, upvotes: newVotes })
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('forum_posts').insert([{ ...form, upvotes: 0 }])
    setLoading(false)
    if (!error) { setSubmitted(true); fetchPosts() }
    else alert('Error: ' + error.message)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !commentName.trim()) return
    const { error } = await supabase.from('forum_comments').insert([{ post_id: selected.id, name: commentName, body: comment }])
    if (!error) { setComment(''); setCommentName(''); fetchComments(selected.id) }
    else alert('Error posting comment: ' + error.message)
  }

  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category)
  const timeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  }

  if (showForm && !submitted) return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setShowForm(false)} style={{ fontSize: '13px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}>← Back to Forum</button>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.25rem' }}>Start a Discussion</h1>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '14px' }}>Share what's happening in your community.</p>
      <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Your Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>School</label>
            <input required value={form.school} onChange={e => setForm({...form, school: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>City / County</label>
            <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Title</label>
          <input required value={form.title} placeholder="e.g. Should Columbus expand public transit?" onChange={e => setForm({...form, title: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Your Thoughts</label>
          <textarea required rows={7} value={form.body} onChange={e => setForm({...form, body: e.target.value})} style={{ padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px', background: '#ff4500', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Posting...' : 'Post Discussion'}
        </button>
      </form>
    </main>
  )

  if (selected) return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '740px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => setSelected(null)} style={{ fontSize: '13px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}>← Back to Forum</button>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          <div style={{ background: '#f8f8f8', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minWidth: '50px' }}>
            <button onClick={e => handleUpvote(e, selected)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ff4500' }}>▲</button>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{selected.upvotes || 0}</span>
          </div>
          <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '11px', background: '#ff4500', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{selected.category || 'Other'}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>{selected.city} · {selected.school}</span>
              <span style={{ fontSize: '12px', color: '#bbb' }}>{timeAgo(selected.created_at)}</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '0.5rem' }}>{selected.title}</h1>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1rem' }}>posted by {selected.name}</p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#333' }}>{selected.body}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1rem', color: '#555' }}>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
        <form onSubmit={handleSubmitComment} style={{ background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input required placeholder="Your name" value={commentName} onChange={e => setCommentName(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', background: '#fff' }} />
          <textarea required rows={3} placeholder="What do you think?" value={comment} onChange={e => setComment(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'system-ui, sans-serif', background: '#fff' }} />
          <button type="submit" style={{ alignSelf: 'flex-end', padding: '8px 20px', background: '#ff4500', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Comment</button>
        </form>
        {comments.map(c => (
          <div key={c.id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.4rem', color: '#ff4500' }}>{c.name}</p>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#333' }}>{c.body}</p>
            <p style={{ fontSize: '11px', color: '#bbb', marginTop: '0.5rem' }}>{timeAgo(c.created_at)}</p>
          </div>
        ))}
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '740px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>← The Local Circuit</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Forum</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0', fontSize: '14px' }}>Student discussions on local issues across Ohio</p>
        </div>
        <button onClick={() => { setShowForm(true); setSubmitted(false) }} style={{ padding: '10px 20px', background: '#ff4500', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ New Post</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: category === c ? '#ff4500' : '#e0e0e0', background: category === c ? '#ff4500' : '#fff', color: category === c ? '#fff' : '#555', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa' }}>
          <p style={{ fontSize: '18px' }}>No posts yet in this category.</p>
          <button onClick={() => { setShowForm(true); setSubmitted(false) }} style={{ marginTop: '1rem', padding: '10px 24px', background: '#ff4500', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Be the first to post</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => handleSelectPost(p)} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.15s' }}>
              <div style={{ background: '#f8f8f8', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', minWidth: '50px' }}>
                <button onClick={e => handleUpvote(e, p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ccc', lineHeight: 1 }}>▲</button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>{p.upvotes || 0}</span>
              </div>
              <div style={{ padding: '0.75rem 1rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', background: '#ff4500', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{p.category || 'Other'}</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>{p.city}</span>
                  <span style={{ fontSize: '12px', color: '#bbb' }}>{timeAgo(p.created_at)}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 0.25rem', color: '#222' }}>{p.title}</h3>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>by {p.name} · {p.school}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
