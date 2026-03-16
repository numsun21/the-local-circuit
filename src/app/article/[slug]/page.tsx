import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single()
  const { data: related } = await supabase.from('articles').select('*').neq('slug', slug).limit(3).order('published_at', { ascending: false })

  if (!article) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900 }}>Article not found</h1>
      <a href="/" style={{ color: '#666', fontSize: '14px' }}>← Back to home</a>
    </main>
  )

  const formatted = new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      {/* Top nav */}
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a', letterSpacing: '-0.02em' }}>The Local Circuit</a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {['Ohio', 'Forum', 'Submit'].map(item => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>{item}</a>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem' }}>
        {/* Main article */}
        <article>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '0.5px solid #e0e0e0' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.75rem', fontFamily: 'Georgia, serif' }}>
              {article.city} · {article.state}
            </p>
            <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#1a1a1a' }}>
              {article.titles || article.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#444' }}>By <strong>{article.author}</strong></span>
              <span style={{ fontSize: '13px', color: '#999' }}>{formatted}</span>
              <a href={`/${(article.state||'ohio').toLowerCase()}`} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', textDecoration: 'none', border: '0.5px solid #ddd', padding: '3px 10px', borderRadius: '2px' }}>{article.state}</a>
            </div>
          </div>

          <div style={{ fontSize: '18px', lineHeight: 2.0, color: '#222', whiteSpace: 'pre-wrap', letterSpacing: '0.01em' }}>
            {article.content}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{article.author}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Student contributor · {article.city}</p>
            </div>
            <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 20px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Submit a Story</a>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '0.5px solid #e0e0e0' }}>More Stories</p>
            {(related || []).map((r: any) => (
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
