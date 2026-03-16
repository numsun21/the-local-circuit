import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(6)

  const main = articles?.[0]
  const side = articles?.slice(1, 4) || []
  const bottom = articles?.slice(4, 7) || []

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <><style>{`@import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');`}</style><main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0 0.75rem', borderBottom: '0.5px solid #ccc', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <span style={{ fontStyle: 'italic' }}>Sunday, March 15, 2026</span>
        <nav style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="/ohio" style={{ color: 'inherit', textDecoration: 'none' }}>Ohio</a>
          <a href="/ohio/counties" style={{ color: 'inherit', textDecoration: 'none' }}>Counties</a>
          <a href="/ohio/cities" style={{ color: 'inherit', textDecoration: 'none' }}>Cities</a>
          <a href="/search" style={{ color: 'inherit', textDecoration: 'none' }}>Search</a><a href="/forum" style={{ color: 'inherit', textDecoration: 'none' }}>Forum</a>
          <a href="/submit" style={{ color: 'inherit', textDecoration: 'none' }}>Submit</a>
        </nav>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 0 1.25rem', borderBottom: '3px double #333' }}>
        <h1 style={{ fontSize: '80px', fontWeight: 900, lineHeight: 1, margin: 0 }}>The Local Circuit</h1>
        <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#666', marginTop: '0.5rem' }}>Student voices. Local issues. Statewide reach.</p>
      </div>

      {main && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '0.5px solid #ddd' }}>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', margin: 0 }}>{main.city} · {main.state}</p>
            <a href={`/article/${main.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.15, margin: '0.5rem 0' }}>{main.titles}</h2>
            </a>
            <p style={{ fontSize: '13px', color: '#666' }}>By {main.author} · {formatDate(main.published_at)}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {side.map(a => (
              <div key={a.id} style={{ paddingBottom: '1rem', borderBottom: '0.5px solid #ddd' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', margin: 0 }}>{a.city} · {a.state}</p>
                <a href={`/article/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.25, margin: '0.3rem 0 0' }}>{a.titles}</h3>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {bottom.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {bottom.map(a => (
            <div key={a.id}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#666', margin: 0 }}>{a.city}</p>
              <a href={`/article/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.25, margin: '0.4rem 0' }}>{a.titles}</h4>
              </a>
              <p style={{ fontSize: '12px', color: '#666' }}>By {a.author}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1.75rem 2rem', border: '0.5px solid #ccc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 0.25rem' }}>Your city has a story. Tell it.</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>The Local Circuit is looking for student writers across Ohio.</p>
        </div>
        <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 20px', borderRadius: '8px', background: '#111', color: '#fff', textDecoration: 'none' }}>Submit a story</a>
      </div>
    </main></>
  )
}
