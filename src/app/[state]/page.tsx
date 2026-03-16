import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const stateName = state.charAt(0).toUpperCase() + state.slice(1)
  const { data: articles } = await supabase.from('articles').select('*').ilike('state', state).order('published_at', { ascending: false })

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a', letterSpacing: '-0.02em' }}>The Local Circuit</a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/forum" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Forum</a>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Submit</a>
        </nav>
      </div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '0.5rem' }}>Coverage</p>
          <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{stateName}</h1>
          <p style={{ fontStyle: 'italic', color: '#888', fontSize: '16px', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '3px double #e0e0e0' }}>Student journalism from across {stateName}</p>
          {(!articles || articles.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>
              <p style={{ fontStyle: 'italic', fontSize: '20px', marginBottom: '1.5rem' }}>No stories from {stateName} yet.</p>
              <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Be the first to submit</a>
            </div>
          ) : articles.map((a: any, i: number) => (
            <a key={a.id} href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem 0', borderBottom: '0.5px solid #e8e8e4' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '0.4rem' }}>{a.city} · {a.state}</p>
              <h2 style={{ fontSize: i === 0 ? '28px' : '20px', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.4rem', color: '#1a1a1a' }}>{a.titles}</h2>
              <p style={{ fontSize: '13px', color: '#999' }}>By {a.author} · {new Date(a.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </a>
          ))}
        </div>
        <aside>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '0.5px solid #e0e0e0' }}>Browse by City</p>
            {['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Youngstown', 'Canton'].map(city => (
              <a key={city} href={`/${state}/${city.toLowerCase()}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '0.5px solid #f0f0f0', textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontSize: '14px', color: '#333' }}>{city}</span>
                <span style={{ fontSize: '12px', color: '#ccc' }}>→</span>
              </a>
            ))}
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f9f9f7', border: '0.5px solid #e8e8e4' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '0.4rem' }}>Cover {stateName}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '1rem', lineHeight: 1.6 }}>We are looking for student writers in every city.</p>
              <a href="/submit" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '1px' }}>Submit a story</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
