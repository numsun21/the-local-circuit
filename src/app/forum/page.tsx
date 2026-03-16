'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = ['All', 'Education', 'Housing', 'Environment', 'Politics', 'Transit', 'Safety', 'Other']
const CAT_COLORS: Record<string, string> = {
  Education: '#00f5d4', Housing: '#f72585', Environment: '#70e000',
  Politics: '#f8961e', Transit: '#4cc9f0', Safety: '#ffd60a', Other: '#b5b5b5', All: '#fff'
}

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
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('forum_posts').select('*').order('upvotes', { ascending: false })
    setPosts(data || [])
  }

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from('forum_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data || [])
  }

  const handleSelectPost = (post: any) => {
    setSelected(post)
    fetchComments(String(post.id))
  }

  const handleUpvote = async (e: React.MouseEvent, post: any) => {
    e.stopPropagation()
    if (votedIds.has(post.id)) return
    const newVotes = (post.upvotes || 0) + 1
    const { error } = await supabase.from('forum_posts').update({ upvotes: newVotes }).eq('id', post.id)
    if (!error) {
      setVotedIds(prev => new Set([...prev, post.id]))
      setPosts(posts.map(p => p.id === post.id ? { ...p, upvotes: newVotes } : p))
      if (selected?.id === post.id) setSelected({ ...selected, upvotes: newVotes })
    }
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
    const { error } = await supabase.from('forum_comments').insert([{ post_id: String(selected.id), name: commentName, body: comment }])
    if (!error) { setComment(''); setCommentName(''); fetchComments(String(selected.id)) }
    else alert('Error: ' + error.message)
  }

  const timeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  }

  const heatLevel = (votes: number) => {
    if (votes >= 20) return { label: 'VIRAL', color: '#f72585', glow: '0 0 24px #f72585aa' }
    if (votes >= 10) return { label: 'HOT', color: '#f8961e', glow: '0 0 18px #f8961eaa' }
    if (votes >= 5) return { label: 'RISING', color: '#00f5d4', glow: '0 0 14px #00f5d4aa' }
    return { label: 'NEW', color: '#555', glow: 'none' }
  }

  const topCities = [...new Set(posts.map(p => p.city).filter(Boolean))].slice(0, 6)
  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category)

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080b10; }
    .forum-root { min-height: 100vh; background: #080b10; color: #e0e0e0; font-family: 'Syne', sans-serif; }
    .scanline { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); pointer-events: none; z-index: 0; }
    .topbar { border-bottom: 1px solid #1a2030; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; background: rgba(8,11,16,0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; }
    .logo { font-family: 'Space Mono', monospace; font-size: 13px; color: #00f5d4; letter-spacing: 0.2em; text-decoration: none; }
    .logo span { color: #555; }
    .new-post-btn { background: transparent; border: 1px solid #00f5d4; color: #00f5d4; padding: 8px 18px; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
    .new-post-btn:hover { background: #00f5d4; color: #080b10; }
    .layout { display: grid; grid-template-columns: 1fr 260px; gap: 1.5rem; max-width: 1100px; margin: 0 auto; padding: 1.5rem; position: relative; z-index: 1; }
    .cat-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .cat-btn { padding: 5px 14px; background: transparent; border: 1px solid #1e2535; color: #666; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
    .cat-btn.active { border-color: var(--cat-color); color: var(--cat-color); box-shadow: 0 0 10px var(--cat-color-alpha); }
    .post-card { background: #0d1117; border: 1px solid #1a2030; padding: 1rem 1.25rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; margin-bottom: 0.75rem; }
    .post-card:hover { border-color: #2a3550; transform: translateX(3px); }
    .post-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--cat-color); box-shadow: 0 0 8px var(--cat-color); }
    .post-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .post-meta { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .cat-tag { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.12em; padding: 2px 8px; border: 1px solid; border-radius: 2px; }
    .city-tag { font-size: 11px; color: #555; font-family: 'Space Mono', monospace; }
    .time-tag { font-size: 11px; color: #333; font-family: 'Space Mono', monospace; margin-left: auto; }
    .post-title { font-size: 16px; font-weight: 700; color: #dde; margin-bottom: 0.3rem; line-height: 1.4; }
    .post-author { font-size: 12px; color: #445; font-family: 'Space Mono', monospace; }
    .heat-col { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; min-width: 48px; }
    .heat-btn { background: none; border: 1px solid #1e2535; color: #333; width: 36px; height: 36px; cursor: pointer; font-size: 16px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
    .heat-btn:hover { border-color: #00f5d4; color: #00f5d4; }
    .heat-btn.voted { border-color: #00f5d4; color: #00f5d4; background: rgba(0,245,212,0.1); }
    .heat-count { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; }
    .heat-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.15em; }
    .sidebar { position: sticky; top: 80px; height: fit-content; }
    .sidebar-card { background: #0d1117; border: 1px solid #1a2030; padding: 1.25rem; margin-bottom: 1rem; }
    .sidebar-title { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: #00f5d4; margin-bottom: 1rem; }
    .city-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #1a2030; cursor: pointer; }
    .city-item:last-child { border-bottom: none; }
    .city-name { font-size: 13px; color: #aaa; }
    .city-count { font-family: 'Space Mono', monospace; font-size: 11px; color: #444; }
    .stat-row { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #0f1520; }
    .stat-label { font-size: 12px; color: #555; }
    .stat-val { font-family: 'Space Mono', monospace; font-size: 12px; color: #00f5d4; }
    .pulse { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #00f5d4; animation: pulse 2s infinite; margin-right: 6px; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
    .modal-bg { position: fixed; inset: 0; background: rgba(8,11,16,0.97); z-index: 200; overflow-y: auto; }
    .modal-inner { max-width: 760px; margin: 0 auto; padding: 2rem 1.5rem; }
    .back-btn { background: none; border: none; color: #555; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em; cursor: pointer; margin-bottom: 2rem; }
    .back-btn:hover { color: #00f5d4; }
    .modal-title { font-size: 28px; font-weight: 800; color: #eef; margin-bottom: 0.5rem; line-height: 1.3; }
    .modal-body { font-size: 15px; line-height: 1.8; color: #99a; margin-top: 1.25rem; }
    .divider { border: none; border-top: 1px solid #1a2030; margin: 2rem 0; }
    .comment-card { background: #0d1117; border: 1px solid #1a2030; border-left: 3px solid #00f5d4; padding: 1rem; margin-bottom: 0.75rem; }
    .comment-name { font-family: 'Space Mono', monospace; font-size: 11px; color: #00f5d4; margin-bottom: 0.4rem; }
    .comment-body { font-size: 14px; line-height: 1.6; color: #99a; }
    .comment-time { font-family: 'Space Mono', monospace; font-size: 10px; color: #333; margin-top: 0.5rem; }
    .form-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: #555; display: block; margin-bottom: 0.4rem; }
    .form-input { width: 100%; padding: 10px 12px; background: #0d1117; border: 1px solid #1e2535; color: #dde; font-family: 'Syne', sans-serif; font-size: 14px; border-radius: 2px; outline: none; transition: border-color 0.2s; }
    .form-input:focus { border-color: #00f5d4; }
    .form-group { margin-bottom: 1rem; }
    .submit-btn { width: 100%; padding: 13px; background: transparent; border: 1px solid #00f5d4; color: #00f5d4; font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 0.2em; cursor: pointer; transition: all 0.2s; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%); }
    .submit-btn:hover { background: #00f5d4; color: #080b10; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .section-header { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
    .empty-state { text-align: center; padding: 4rem 0; color: #333; font-family: 'Space Mono', monospace; font-size: 13px; letter-spacing: 0.1em; }
  `

  if (showForm && !submitted) return (
    <div className="forum-root">
      <style>{styles}</style>
      <div className="scanline" />
      <div className="topbar">
        <a href="/" className="logo">THE LOCAL <span>//</span> CIRCUIT</a>
      </div>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <button className="back-btn" onClick={() => setShowForm(false)}>← BACK TO SIGNAL BOARD</button>
        <div className="section-header"><span className="pulse" />NEW TRANSMISSION</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#eef', marginBottom: '0.5rem' }}>Start a Discussion</h1>
        <p style={{ color: '#445', fontSize: '14px', marginBottom: '2rem', fontFamily: 'Space Mono, monospace' }}>Broadcast your signal to students across Ohio.</p>
        <form onSubmit={handleSubmitPost}>
          <div className="grid2">
            <div className="form-group"><label className="form-label">YOUR NAME</label><input required className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">SCHOOL</label><input required className="form-input" value={form.school} onChange={e => setForm({...form, school: e.target.value})} /></div>
          </div>
          <div className="grid2">
            <div className="form-group"><label className="form-label">CITY / COUNTY</label><input required className="form-input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">CATEGORY</label>
              <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">TRANSMISSION TITLE</label><input required className="form-input" placeholder="What's the signal?" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">YOUR MESSAGE</label><textarea required className="form-input" rows={7} value={form.body} onChange={e => setForm({...form, body: e.target.value})} style={{ resize: 'vertical', fontFamily: 'Syne, sans-serif' }} /></div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'TRANSMITTING...' : 'BROADCAST SIGNAL'}</button>
        </form>
      </div>
    </div>
  )

  if (selected) return (
    <div className="forum-root">
      <style>{styles}</style>
      <div className="scanline" />
      <div className="modal-bg">
        <div className="modal-inner">
          <button className="back-btn" onClick={() => setSelected(null)}>← BACK TO SIGNAL BOARD</button>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="cat-tag" style={{ color: CAT_COLORS[selected.category] || '#fff', borderColor: CAT_COLORS[selected.category] || '#fff' }}>{selected.category || 'OTHER'}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#445' }}>{selected.city}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#333' }}>{timeAgo(selected.created_at)}</span>
            {(() => { const h = heatLevel(selected.upvotes || 0); return <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: h.color, border: `1px solid ${h.color}`, padding: '2px 8px', borderRadius: '2px', letterSpacing: '0.15em' }}>{h.label}</span> })()}
          </div>
          <h1 className="modal-title">{selected.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#445' }}>transmitted by {selected.name} · {selected.school}</span>
            <button onClick={e => handleUpvote(e, selected)} className={`heat-btn ${votedIds.has(selected.id) ? 'voted' : ''}`} style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', width: '32px', height: '32px' }}>▲</button>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: heatLevel(selected.upvotes||0).color }}>{selected.upvotes || 0}</span>
          </div>
          <p className="modal-body">{selected.body}</p>
          <hr className="divider" />
          <div className="section-header"><span className="pulse" />{comments.length} RESPONSES</div>
          <form onSubmit={handleSubmitComment} style={{ marginBottom: '1.5rem' }}>
            <div className="grid2" style={{ marginBottom: '0.75rem' }}>
              <div><label className="form-label">YOUR NAME</label><input required className="form-input" value={commentName} onChange={e => setCommentName(e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">YOUR RESPONSE</label><textarea required className="form-input" rows={3} value={comment} onChange={e => setComment(e.target.value)} style={{ resize: 'vertical', fontFamily: 'Syne, sans-serif' }} /></div>
            <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '10px 28px' }}>TRANSMIT RESPONSE</button>
          </form>
          {comments.map(c => (
            <div key={c.id} className="comment-card">
              <div className="comment-name">{c.name}</div>
              <div className="comment-body">{c.body}</div>
              <div className="comment-time">{timeAgo(c.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="forum-root">
      <style>{styles}</style>
      <div className="scanline" />
      <div className="topbar">
        <a href="/" className="logo">THE LOCAL <span>//</span> CIRCUIT</a>
        <button className="new-post-btn" onClick={() => { setShowForm(true); setSubmitted(false) }}>+ NEW TRANSMISSION</button>
      </div>
      <div className="layout">
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#eef', marginBottom: '0.25rem' }}>Signal Board</h1>
            <p style={{ color: '#445', fontSize: '13px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em' }}>Student transmissions from across Ohio</p>
          </div>
          <div className="cat-bar">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`}
                style={{ '--cat-color': CAT_COLORS[c], '--cat-color-alpha': CAT_COLORS[c] + '33' } as any}
                onClick={() => setCategory(c)}>{c.toUpperCase()}</button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">NO SIGNALS IN THIS CHANNEL YET.<br /><br />
              <button className="new-post-btn" onClick={() => { setShowForm(true); setSubmitted(false) }}>BE THE FIRST</button>
            </div>
          ) : filtered.map(p => {
            const heat = heatLevel(p.upvotes || 0)
            const catColor = CAT_COLORS[p.category] || '#fff'
            return (
              <div key={p.id} className="post-card" style={{ '--cat-color': catColor, boxShadow: heat.glow } as any} onClick={() => handleSelectPost(p)}>
                <div className="post-header">
                  <div style={{ flex: 1 }}>
                    <div className="post-meta">
                      <span className="cat-tag" style={{ color: catColor, borderColor: catColor + '88' }}>{(p.category || 'OTHER').toUpperCase()}</span>
                      <span className="city-tag">{p.city}</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: heat.color, border: `1px solid ${heat.color}55`, padding: '1px 6px', borderRadius: '2px', letterSpacing: '0.12em' }}>{heat.label}</span>
                      <span className="time-tag">{timeAgo(p.created_at)}</span>
                    </div>
                    <div className="post-title">{p.title}</div>
                    <div className="post-author">by {p.name} · {p.school}</div>
                  </div>
                  <div className="heat-col">
                    <button className={`heat-btn ${votedIds.has(p.id) ? 'voted' : ''}`} onClick={e => handleUpvote(e, p)}>▲</button>
                    <span className="heat-count" style={{ color: heat.color }}>{p.upvotes || 0}</span>
                    <span className="heat-label" style={{ color: heat.color }}>{heat.label}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title"><span className="pulse" />LIVE STATS</div>
            <div className="stat-row"><span className="stat-label">Total signals</span><span className="stat-val">{posts.length}</span></div>
            <div className="stat-row"><span className="stat-label">Active cities</span><span className="stat-val">{new Set(posts.map(p => p.city).filter(Boolean)).size}</span></div>
            <div className="stat-row"><span className="stat-label">Top category</span><span className="stat-val" style={{ fontSize: '10px' }}>{
              (() => { const counts: Record<string,number> = {}; posts.forEach(p => { if(p.category) counts[p.category] = (counts[p.category]||0)+1 }); return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—' })()
            }</span></div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">ACTIVE CITIES</div>
            {topCities.length === 0 ? <p style={{ fontSize: '12px', color: '#333', fontFamily: 'Space Mono, monospace' }}>No data yet</p> :
              topCities.map(city => (
                <div key={city} className="city-item" onClick={() => { setCategory('All') }}>
                  <span className="city-name">{city}</span>
                  <span className="city-count">{posts.filter(p => p.city === city).length} signals</span>
                </div>
              ))
            }
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">HEAT LEGEND</div>
            {[{label:'VIRAL',color:'#f72585',desc:'20+ signals'},{label:'HOT',color:'#f8961e',desc:'10+ signals'},{label:'RISING',color:'#00f5d4',desc:'5+ signals'},{label:'NEW',color:'#555',desc:'Just posted'}].map(h => (
              <div key={h.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0', borderBottom: '1px solid #0f1520' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: h.color, border: `1px solid ${h.color}`, padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.1em', minWidth: '52px', textAlign: 'center' }}>{h.label}</span>
                <span style={{ fontSize: '12px', color: '#444' }}>{h.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
