'use client'
import { useState, useEffect, useRef } from 'react'
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
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'hot'|'new'>('hot')
  const commentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from('forum_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data || [])
  }

  const handleSelectPost = (post: any) => { setSelected(post); fetchComments(String(post.id)) }

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

  const filtered = (category === 'All' ? posts : posts.filter(p => p.category === category))
    .slice().sort((a, b) => sortBy === 'hot' ? (b.upvotes||0) - (a.upvotes||0) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const topCities = Object.entries(
    posts.reduce((acc: Record<string,number>, p) => { if(p.city) acc[p.city] = (acc[p.city]||0)+1; return acc }, {})
  ).sort((a,b) => b[1]-a[1]).slice(0,5)

  const trending = [...posts].sort((a,b) => (b.upvotes||0)-(a.upvotes||0)).slice(0,4)

  const s = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    .fr{font-family:'DM Sans',sans-serif;background:#fafaf8;min-height:100vh;color:#1a1a1a;}
    .topbar{background:#fff;border-bottom:1px solid #e8e8e4;padding:0 2rem;display:flex;justify-content:space-between;align-items:center;height:56px;position:sticky;top:0;z-index:100;}
    .back-link{font-family:'DM Mono',monospace;font-size:11px;color:#999;text-decoration:none;letter-spacing:0.08em;transition:color 0.15s;}
    .back-link:hover{color:#1a1a1a;}
    .post-btn{background:#1a1a1a;color:#fff;border:none;padding:9px 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border-radius:2px;transition:background 0.15s;}
    .post-btn:hover{background:#333;}
    .hero{background:#fff;border-bottom:3px double #e8e8e4;padding:2.5rem 2rem 2rem;text-align:center;}
    .hero-eyebrow{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;color:#999;text-transform:uppercase;margin-bottom:0.75rem;}
    .hero-title{font-family:'Playfair Display',serif;font-size:52px;font-weight:900;letter-spacing:-0.02em;line-height:1;}
    .hero-sub{font-style:italic;color:#888;font-size:15px;margin-top:0.5rem;font-family:'Playfair Display',serif;}
    .hero-stats{display:flex;justify-content:center;gap:3rem;margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid #e8e8e4;}
    .stat{text-align:center;}
    .stat-n{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;}
    .stat-l{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#999;margin-top:0.2rem;}
    .layout{display:grid;grid-template-columns:1fr 300px;gap:0;max-width:1200px;margin:0 auto;}
    .main{padding:2rem;border-right:1px solid #e8e8e4;}
    .sidebar{padding:1.75rem 1.5rem;background:#fafaf8;}
    .controls{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid #e8e8e4;}
    .cat-pills{display:flex;gap:0.4rem;flex-wrap:wrap;}
    .cat-pill{padding:5px 13px;border:1px solid #e0e0da;background:#fff;color:#888;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;cursor:pointer;border-radius:20px;transition:all 0.15s;}
    .cat-pill.on{background:#1a1a1a;color:#fff;border-color:#1a1a1a;}
    .sort-btns{display:flex;gap:0;border:1px solid #e0e0da;border-radius:4px;overflow:hidden;}
    .sort-btn{padding:6px 14px;background:#fff;border:none;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;color:#999;cursor:pointer;transition:all 0.15s;}
    .sort-btn.on{background:#1a1a1a;color:#fff;}
    .post-card{border:1px solid #e8e8e4;background:#fff;padding:1.25rem 1.5rem;margin-bottom:0.75rem;cursor:pointer;transition:all 0.18s;position:relative;display:flex;gap:1rem;}
    .post-card:hover{border-color:#bbb;box-shadow:0 2px 12px rgba(0,0,0,0.06);transform:translateY(-1px);}
    .vote-col{display:flex;flex-direction:column;align-items:center;gap:0.2rem;padding-top:2px;}
    .vote-btn{background:none;border:1px solid #e0e0da;width:32px;height:32px;cursor:pointer;font-size:14px;color:#ccc;transition:all 0.15s;border-radius:2px;display:flex;align-items:center;justify-content:center;}
    .vote-btn:hover{border-color:#1a1a1a;color:#1a1a1a;}
    .vote-btn.voted{background:#1a1a1a;color:#fff;border-color:#1a1a1a;}
    .vote-count{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:#1a1a1a;}
    .post-content{flex:1;min-width:0;}
    .post-top{display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;}
    .cat-badge{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;color:#666;background:#f0f0ec;padding:2px 8px;border-radius:2px;}
    .post-city{font-family:'DM Mono',monospace;font-size:10px;color:#bbb;letter-spacing:0.05em;}
    .post-time{font-family:'DM Mono',monospace;font-size:10px;color:#ccc;margin-left:auto;}
    .post-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;line-height:1.35;margin-bottom:0.4rem;color:#1a1a1a;}
    .post-author{font-family:'DM Mono',monospace;font-size:11px;color:#bbb;}
    .post-preview{font-size:13px;color:#777;line-height:1.55;margin-top:0.5rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .post-footer{display:flex;align-items:center;gap:1rem;margin-top:0.75rem;}
    .reply-count{font-family:'DM Mono',monospace;font-size:10px;color:#bbb;letter-spacing:0.08em;}
    .hot-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;padding:2px 6px;border-radius:2px;}
    .sb-section{margin-bottom:2rem;}
    .sb-title{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#999;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid #e8e8e4;}
    .trending-item{padding:0.75rem 0;border-bottom:1px solid #f0f0ec;cursor:pointer;transition:all 0.15s;}
    .trending-item:last-child{border-bottom:none;}
    .trending-item:hover .trending-title{color:#666;}
    .trending-num{font-family:'DM Mono',monospace;font-size:11px;color:#ddd;margin-bottom:0.25rem;}
    .trending-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#1a1a1a;line-height:1.3;transition:color 0.15s;}
    .trending-meta{font-family:'DM Mono',monospace;font-size:10px;color:#bbb;margin-top:0.2rem;}
    .city-row{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f0f0ec;}
    .city-row:last-child{border-bottom:none;}
    .city-n{font-size:13px;color:#444;}
    .city-c{font-family:'DM Mono',monospace;font-size:11px;color:#bbb;}
    .modal{position:fixed;inset:0;background:#fafaf8;z-index:200;overflow-y:auto;}
    .modal-inner{max-width:720px;margin:0 auto;padding:2rem 1.5rem;}
    .modal-back{background:none;border:none;font-family:'DM Mono',monospace;font-size:11px;color:#999;cursor:pointer;letter-spacing:0.1em;margin-bottom:2rem;padding:0;transition:color 0.15s;}
    .modal-back:hover{color:#1a1a1a;}
    .modal-meta{display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;margin-bottom:0.75rem;}
    .modal-title{font-family:'Playfair Display',serif;font-size:36px;font-weight:900;line-height:1.2;margin-bottom:0.75rem;}
    .modal-byline{font-family:'DM Mono',monospace;font-size:12px;color:#999;margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid #e8e8e4;display:flex;align-items:center;gap:1.5rem;}
    .modal-body{font-size:16px;line-height:1.85;color:#333;}
    .divider{border:none;border-top:1px solid #e8e8e4;margin:2rem 0;}
    .comment-section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:1.5rem;}
    .comment-form{background:#fff;border:1px solid #e8e8e4;padding:1.25rem;margin-bottom:1.5rem;}
    .comment-form-title{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.15em;color:#999;margin-bottom:1rem;}
    .inp{width:100%;padding:9px 12px;border:1px solid #e0e0da;background:#fafaf8;font-family:'DM Sans',sans-serif;font-size:14px;color:#1a1a1a;outline:none;transition:border-color 0.15s;border-radius:2px;}
    .inp:focus{border-color:#1a1a1a;background:#fff;}
    .inp-group{margin-bottom:0.75rem;}
    .inp-label{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#999;display:block;margin-bottom:0.35rem;}
    .submit-comment-btn{background:#1a1a1a;color:#fff;border:none;padding:10px 24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border-radius:2px;transition:background 0.15s;float:right;}
    .submit-comment-btn:hover{background:#333;}
    .comment-card{border-left:2px solid #e8e8e4;padding:0.75rem 1rem;margin-bottom:1rem;}
    .comment-name{font-family:'DM Mono',monospace;font-size:11px;font-weight:500;color:#1a1a1a;margin-bottom:0.35rem;}
    .comment-body{font-size:14px;line-height:1.65;color:#555;}
    .comment-time{font-family:'DM Mono',monospace;font-size:10px;color:#ccc;margin-top:0.4rem;}
    .form-page{max-width:640px;margin:0 auto;padding:2.5rem 1.5rem;}
    .form-eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#999;margin-bottom:0.75rem;}
    .form-title{font-family:'Playfair Display',serif;font-size:40px;font-weight:900;margin-bottom:0.25rem;}
    .form-sub{color:#999;font-size:14px;margin-bottom:2rem;}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
    .big-submit{width:100%;padding:14px;background:#1a1a1a;color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.05em;cursor:pointer;border-radius:2px;transition:background 0.15s;margin-top:0.5rem;}
    .big-submit:hover{background:#333;}
    .empty{text-align:center;padding:5rem 0;color:#ccc;font-family:'Playfair Display',serif;font-style:italic;font-size:20px;}
  `

  if (showForm && !submitted) return (
    <div className="fr">
      <style>{s}</style>
      <div className="topbar">
        <a href="/" className="back-link">← THE LOCAL CIRCUIT</a>
        <button className="post-btn" onClick={() => setShowForm(false)}>Back to Forum</button>
      </div>
      <div className="form-page">
        <div className="form-eyebrow">FORUM · NEW DISCUSSION</div>
        <h1 className="form-title">Start a Discussion</h1>
        <p className="form-sub">Share what's happening in your community.</p>
        <form onSubmit={handleSubmitPost}>
          <div className="grid2" style={{marginBottom:'1rem'}}>
            <div className="inp-group"><label className="inp-label">YOUR NAME</label><input required className="inp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="inp-group"><label className="inp-label">SCHOOL</label><input required className="inp" value={form.school} onChange={e=>setForm({...form,school:e.target.value})} /></div>
          </div>
          <div className="grid2" style={{marginBottom:'1rem'}}>
            <div className="inp-group"><label className="inp-label">CITY / COUNTY</label><input required className="inp" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
            <div className="inp-group"><label className="inp-label">CATEGORY</label>
              <select required className="inp" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="inp-group"><label className="inp-label">DISCUSSION TITLE</label><input required className="inp" placeholder="What's on your mind?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div className="inp-group"><label className="inp-label">YOUR THOUGHTS</label><textarea required className="inp" rows={8} value={form.body} onChange={e=>setForm({...form,body:e.target.value})} style={{resize:'vertical',fontFamily:'DM Sans,sans-serif'}} /></div>
          <button type="submit" className="big-submit" disabled={loading}>{loading?'Posting...':'Post Discussion'}</button>
        </form>
      </div>
    </div>
  )

  if (selected) return (
    <div className="fr">
      <style>{s}</style>
      <div className="modal">
        <div className="modal-inner">
          <button className="modal-back" onClick={()=>setSelected(null)}>← BACK TO FORUM</button>
          <div className="modal-meta">
            <span className="cat-badge">{(selected.category||'OTHER').toUpperCase()}</span>
            <span className="post-city">{selected.city}</span>
            <span className="post-time">{timeAgo(selected.created_at)}</span>
          </div>
          <h1 className="modal-title">{selected.title}</h1>
          <div className="modal-byline">
            <span>By {selected.name} · {selected.school}</span>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginLeft:'auto'}}>
              <button className={`vote-btn${votedIds.has(selected.id)?' voted':''}`} onClick={e=>handleUpvote(e,selected)}>▲</button>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'14px',fontWeight:500}}>{selected.upvotes||0} votes</span>
            </div>
          </div>
          <p className="modal-body">{selected.body}</p>
          <hr className="divider" />
          <h2 className="comment-section-title">{comments.length} {comments.length===1?'Response':'Responses'}</h2>
          <div className="comment-form">
            <div className="comment-form-title">LEAVE A RESPONSE</div>
            <form onSubmit={handleSubmitComment}>
              <div className="inp-group"><label className="inp-label">YOUR NAME</label><input required className="inp" value={commentName} onChange={e=>setCommentName(e.target.value)} /></div>
              <div className="inp-group"><label className="inp-label">YOUR RESPONSE</label><textarea ref={commentRef} required className="inp" rows={4} value={comment} onChange={e=>setComment(e.target.value)} style={{resize:'vertical',fontFamily:'DM Sans,sans-serif'}} /></div>
              <div style={{overflow:'hidden'}}><button type="submit" className="submit-comment-btn">Post Response</button></div>
            </form>
          </div>
          {comments.map(c=>(
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
    <div className="fr">
      <style>{s}</style>
      <div className="topbar">
        <a href="/" className="back-link">← THE LOCAL CIRCUIT</a>
        <button className="post-btn" onClick={()=>{setShowForm(true);setSubmitted(false)}}>+ Start a Discussion</button>
      </div>
      <div className="hero">
        <div className="hero-eyebrow">THE LOCAL CIRCUIT · FORUM</div>
        <h1 className="hero-title">The Forum</h1>
        <p className="hero-sub">Student voices on issues that matter.</p>
        <div className="hero-stats">
          <div className="stat"><div className="stat-n">{posts.length}</div><div className="stat-l">DISCUSSIONS</div></div>
          <div className="stat"><div className="stat-n">{new Set(posts.map(p=>p.city).filter(Boolean)).size}</div><div className="stat-l">CITIES</div></div>
          <div className="stat"><div className="stat-n">{new Set(posts.map(p=>p.school).filter(Boolean)).size}</div><div className="stat-l">SCHOOLS</div></div>
          <div className="stat"><div className="stat-n">{posts.reduce((a,p)=>(a+(p.upvotes||0)),0)}</div><div className="stat-l">TOTAL VOTES</div></div>
        </div>
      </div>
      <div className="layout">
        <div className="main">
          <div className="controls">
            <div className="cat-pills">
              {CATEGORIES.map(c=><button key={c} className={`cat-pill${category===c?' on':''}`} onClick={()=>setCategory(c)}>{c}</button>)}
            </div>
            <div className="sort-btns">
              <button className={`sort-btn${sortBy==='hot'?' on':''}`} onClick={()=>setSortBy('hot')}>TOP</button>
              <button className={`sort-btn${sortBy==='new'?' on':''}`} onClick={()=>setSortBy('new')}>NEW</button>
            </div>
          </div>
          {filtered.length===0 ? (
            <div className="empty">No discussions yet in this category.<br/><br/>
              <button className="post-btn" style={{fontFamily:'DM Sans,sans-serif'}} onClick={()=>{setShowForm(true);setSubmitted(false)}}>Be the first to post</button>
            </div>
          ) : filtered.map(p=>(
            <div key={p.id} className="post-card" onClick={()=>handleSelectPost(p)}>
              <div className="vote-col">
                <button className={`vote-btn${votedIds.has(p.id)?' voted':''}`} onClick={e=>handleUpvote(e,p)}>▲</button>
                <span className="vote-count">{p.upvotes||0}</span>
              </div>
              <div className="post-content">
                <div className="post-top">
                  <span className="cat-badge">{(p.category||'OTHER').toUpperCase()}</span>
                  <span className="post-city">{p.city}</span>
                  <span className="post-time">{timeAgo(p.created_at)}</span>
                  {(p.upvotes||0)>=10 && <span className="hot-tag" style={{background:'#fff8f0',color:'#e8630a',border:'1px solid #f5d9c0'}}>🔥 HOT</span>}
                  {(p.upvotes||0)>=20 && <span className="hot-tag" style={{background:'#fff0f5',color:'#d6226a',border:'1px solid #f5c0d5'}}>VIRAL</span>}
                </div>
                <div className="post-title">{p.title}</div>
                <div className="post-author">by {p.name} · {p.school}</div>
                {p.body && <div className="post-preview">{p.body}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar">
          {trending.length > 0 && (
            <div className="sb-section">
              <div className="sb-title">TRENDING NOW</div>
              {trending.map((p,i)=>(
                <div key={p.id} className="trending-item" onClick={()=>handleSelectPost(p)}>
                  <div className="trending-num">0{i+1}</div>
                  <div className="trending-title">{p.title}</div>
                  <div className="trending-meta">{p.upvotes||0} votes · {p.city}</div>
                </div>
              ))}
            </div>
          )}
          {topCities.length > 0 && (
            <div className="sb-section">
              <div className="sb-title">MOST ACTIVE CITIES</div>
              {topCities.map(([city,count])=>(
                <div key={city} className="city-row">
                  <span className="city-n">{city}</span>
                  <span className="city-c">{count} post{count!==1?'s':''}</span>
                </div>
              ))}
            </div>
          )}
          <div className="sb-section">
            <div className="sb-title">CATEGORIES</div>
            {CATEGORIES.filter(c=>c!=='All').map(c=>{
              const count = posts.filter(p=>p.category===c).length
              return count > 0 ? (
                <div key={c} className="city-row" style={{cursor:'pointer'}} onClick={()=>setCategory(c)}>
                  <span className="city-n">{c}</span>
                  <span className="city-c">{count}</span>
                </div>
              ) : null
            })}
          </div>
          <div style={{background:'#fff',border:'1px solid #e8e8e4',padding:'1.25rem',textAlign:'center'}}>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:700,marginBottom:'0.4rem'}}>Have something to say?</p>
            <p style={{fontSize:'12px',color:'#999',marginBottom:'1rem'}}>Start a discussion and reach students across Ohio.</p>
            <button className="post-btn" style={{width:'100%'}} onClick={()=>{setShowForm(true);setSubmitted(false)}}>+ Post Discussion</button>
          </div>
        </div>
      </div>
    </div>
  )
}
