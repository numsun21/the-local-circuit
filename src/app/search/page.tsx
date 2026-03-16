'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ articles: any[], forum: any[] } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    const [{ data: articles }, { data: forum }] = await Promise.all([
      supabase.from('articles').select('*').or(`titles.ilike.%${query}%,content.ilike.%${query}%,city.ilike.%${query}%,author.ilike.%${query}%`).order('published_at', { ascending: false }),
      supabase.from('forum_posts').select('*').or(`title.ilike.%${query}%,body.ilike.%${query}%,city.ilike.%${query}%,name.ilike.%${query}%`).order('created_at', { ascending: false })
    ])
    setResults({ articles: articles || [], forum: forum || [] })
    setLoading(false)
  }

  const total = results ? results.articles.length + results.forum.length : 0

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a', letterSpacing: '-0.02em' }}>The Local Circuit</a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/forum" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Forum</a>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Submit</a>
        </nav>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '0.75rem' }}>Search</p>
        <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Find a Story</h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', marginBottom: '3rem', border: '1px solid #e0e0e0' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by topic, city, author..."
            style={{ flex: 1, padding: '14px 18px', border: 'none', fontSize: '16px', fontFamily: 'Georgia, serif', outline: 'none', background: '#fff' }}
          />
          <button type="submit" style={{ padding: '14px 28px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {results === null && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#ccc' }}>
            <p style={{ fontStyle: 'italic', fontSize: '18px' }}>Search articles, forum discussions, cities, and authors.</p>
          </div>
        )}

        {results !== null && total === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontStyle: 'italic', fontSize: '20px', color: '#999', marginBottom: '1rem' }}>No results for "{query}"</p>
            <p style={{ fontSize: '14px', color: '#ccc' }}>Try a different city, topic, or author name.</p>
          </div>
        )}

        {results !== null && total > 0 && (
          <div>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
              {total} result{total !== 1 ? 's' : ''} for <strong>"{query}"</strong>
            </p>

            {results.articles.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '0.5px solid #e0e0e0' }}>
                  Articles ({results.articles.length})
                </p>
                {results.articles.map((a: any) => (
                  <a key={a.id} href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.25rem 0', borderBottom: '0.5px solid #f0f0f0' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.35rem' }}>{a.city} · {a.state}</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.35rem', color: '#1a1a1a' }}>{a.titles}</h3>
                    <p style={{ fontSize: '13px', color: '#999' }}>By {a.author} · {new Date(a.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </a>
                ))}
              </div>
            )}

            {results.forum.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '0.5px solid #e0e0e0' }}>
                  Forum Discussions ({results.forum.length})
                </p>
                {results.forum.map((p: any) => (
                  <a key={p.id} href="/forum" style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.25rem 0', borderBottom: '0.5px solid #f0f0f0' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.35rem' }}>{p.city} · {p.category}</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.35rem', color: '#1a1a1a' }}>{p.title}</h3>
                    <p style={{ fontSize: '13px', color: '#999' }}>By {p.name} · {p.school}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
