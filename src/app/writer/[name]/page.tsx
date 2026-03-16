'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function WriterPage() {
  const params = useParams()
  const nameSlug = params.name as string
  const [profile, setProfile] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [tab, setTab] = useState<'articles'|'bookmarks'>('articles')

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession()
      const user = session.session?.user
      setCurrentUser(user)

      const { data: profiles } = await supabase.from('profiles').select('*')
      const found = profiles?.find(p => p.name?.toLowerCase().replace(/\s+/g, '-') === nameSlug)
      setProfile(found)

      if (found) {
        const { data: arts } = await supabase.from('articles').select('*').ilike('author', found.name).order('published_at', { ascending: false })
        setArticles(arts || [])

        if (user && user.id === found.user_id) {
          const { data: bms } = await supabase.from('bookmarks').select('*').eq('user_id', user.id)
          if (bms && bms.length > 0) {
            const slugs = bms.map((b: any) => b.article_slug)
            const { data: bmArticles } = await supabase.from('articles').select('*').in('slug', slugs)
            setBookmarks(bmArticles || [])
          }
        }
      }
    }
    load()
  }, [nameSlug])

  const isOwner = currentUser && profile && currentUser.id === profile.user_id
  const displayName = profile?.name || nameSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/forum" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Forum</a>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Submit</a>
        </nav>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '3px double #e0e0e0' }}>
          <div style={{ width: '72px', height: '72px', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{displayName}</h1>
            {profile && <p style={{ fontSize: '13px', color: '#999', fontFamily: 'Georgia, serif' }}>{profile.school} · {profile.city}</p>}
            {!profile && <p style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>Student contributor</p>}
          </div>
          {isOwner && (
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'none', border: '0.5px solid #ddd', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', borderRadius: '2px', color: '#999', fontFamily: 'Georgia, serif' }}>
              Log out
            </button>
          )}
        </div>

        {isOwner && (
          <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '0.5px solid #e0e0e0' }}>
            {(['articles', 'bookmarks'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #1a1a1a' : '2px solid transparent', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', color: tab === t ? '#1a1a1a' : '#999', fontFamily: 'Georgia, serif', marginBottom: '-1px' }}>
                {t} {t === 'articles' ? `(${articles.length})` : `(${bookmarks.length})`}
              </button>
            ))}
          </div>
        )}

        {(tab === 'articles' || !isOwner) && (
          <div>
            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>
                <p style={{ fontStyle: 'italic', fontSize: '18px', marginBottom: '1rem' }}>No stories published yet.</p>
                {isOwner && <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 24px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Submit your first story</a>}
              </div>
            ) : articles.map((a: any, i: number) => (
              <a key={a.id} href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem 0', borderBottom: '0.5px solid #e8e8e4' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.4rem' }}>{a.city} · {a.state}</p>
                <h2 style={{ fontSize: i === 0 ? '26px' : '18px', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.4rem', color: '#1a1a1a' }}>{a.titles}</h2>
                <p style={{ fontSize: '13px', color: '#999' }}>{new Date(a.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </a>
            ))}
          </div>
        )}

        {tab === 'bookmarks' && isOwner && (
          <div>
            {bookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>
                <p style={{ fontStyle: 'italic', fontSize: '18px' }}>No saved articles yet.</p>
                <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>Hit ☆ Save on any article to bookmark it.</p>
              </div>
            ) : bookmarks.map((a: any) => (
              <a key={a.id} href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem 0', borderBottom: '0.5px solid #e8e8e4' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.4rem' }}>{a.city} · {a.state}</p>
                <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.4rem', color: '#1a1a1a' }}>{a.titles}</h2>
                <p style={{ fontSize: '13px', color: '#999' }}>By {a.author}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
