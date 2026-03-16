'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function ArticleClient({ article, related, comments: initialComments }: { article: any, related: any[], comments: any[] }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [comments, setComments] = useState(initialComments)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [views, setViews] = useState(article.views || 0)
  const counted = useRef(false)

  const formatted = new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user
      setUser(u || null)
      if (u) {
        const { data: p } = await supabase.from('profiles').select('*').eq('user_id', u.id).single()
        setProfile(p)
        const { data: bm } = await supabase.from('bookmarks').select('*').eq('user_id', u.id).eq('article_slug', article.slug).single()
        setBookmarked(!!bm)
      }
    })
    if (!counted.current) {
      counted.current = true
      fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug })
      }).then(r => r.json()).then(d => setViews(d.views))
    }
  }, [article.slug])

  const handleBookmark = async () => {
    if (!user) { window.location.href = '/login'; return }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('article_slug', article.slug)
      setBookmarked(false)
    } else {
      await supabase.from('bookmarks').insert([{ user_id: user.id, article_slug: article.slug }])
      setBookmarked(true)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return
    setLoading(true)
    const { error } = await supabase.from('article_comments').insert([{
      user_id: user.id,
      user_name: profile?.name || user.email,
      article_slug: article.slug,
      body: comment
    }])
    if (!error) {
      const { data } = await supabase.from('article_comments').select('*').eq('article_slug', article.slug).order('created_at', { ascending: true })
      setComments(data || [])
      setComment('')
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a', letterSpacing: '-0.02em' }}>The Local Circuit</a>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/forum" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Forum</a>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Submit</a>
          {user ? (
            <a href={`/writer/${profile?.name?.toLowerCase().replace(/\s+/g, '-') || user.id}`} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>{profile?.name || 'Profile'}</a>
          ) : (
            <a href="/login" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '7px 16px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Log in</a>
          )}
        </nav>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem' }}>
        <article>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '0.5px solid #e0e0e0' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.75rem' }}>{article.city} · {article.state}</p>
            <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#1a1a1a' }}>{article.titles || article.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#444' }}>By <strong>{article.author}</strong></span>
              <span style={{ fontSize: '13px', color: '#999' }}>{formatted}</span>
              <span style={{ fontSize: '12px', color: '#bbb', fontFamily: 'Georgia, serif' }}>{views.toLocaleString()} {views === 1 ? 'view' : 'views'}</span>
              <button onClick={handleBookmark} style={{ marginLeft: 'auto', background: 'none', border: '0.5px solid #ddd', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', borderRadius: '2px', color: bookmarked ? '#1a1a1a' : '#999', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {bookmarked ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </div>
          <div style={{ fontSize: '18px', lineHeight: 2.0, color: '#222', whiteSpace: 'pre-wrap' }}>{article.content}</div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '0.5px solid #e0e0e0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '1.5rem' }}>Responses ({comments.length})</h2>
            {user ? (
              <form onSubmit={handleComment} style={{ marginBottom: '2rem', background: '#f9f9f7', border: '0.5px solid #e8e8e4', padding: '1.25rem' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '0.75rem' }}>Responding as <strong>{profile?.name || user.email}</strong></p>
                <textarea required rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts..." style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', resize: 'vertical', background: '#fff', marginBottom: '0.75rem' }} />
                <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', borderRadius: '2px', fontFamily: 'Georgia, serif' }}>
                  {loading ? 'Posting...' : 'Post Response'}
                </button>
              </form>
            ) : (
              <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#f9f9f7', border: '0.5px solid #e8e8e4', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '0.75rem' }}>Log in to leave a response</p>
                <a href="/login" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 20px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Log in</a>
              </div>
            )}
            {comments.map(c => (
              <div key={c.id} style={{ borderLeft: '2px solid #e8e8e4', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.3rem' }}>{c.user_name}</p>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#444' }}>{c.body}</p>
                <p style={{ fontSize: '11px', color: '#ccc', marginTop: '0.4rem' }}>{timeAgo(c.created_at)}</p>
              </div>
            ))}
          </div>
        </article>
        <aside>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '0.5px solid #e0e0e0' }}>More Stories</p>
            {related.map((r: any) => (
              <a key={r.id} href={`/article/${r.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '0.5px solid #f0f0f0' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.3rem' }}>{r.city} · {r.state}</p>
                <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3, color: '#1a1a1a' }}>{r.titles || r.title}</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '0.3rem' }}>By {r.author}</p>
              </a>
            ))}
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f9f9f7', border: '0.5px solid #e8e8e4' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '0.4rem' }}>Write for us</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '1rem', lineHeight: 1.6 }}>Cover issues in your city. Build your portfolio.</p>
              <a href="/submit" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '1px' }}>Submit a story →</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
