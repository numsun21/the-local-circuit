import { createClient } from '@supabase/supabase-js'
import AuthNav from './components/AuthNav'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: articles } = await supabase.from('articles').select('*').order('published_at', { ascending: false }).limit(9)
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0 0.75rem', borderBottom: '0.5px solid #ccc', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <span style={{ fontStyle: 'italic', textTransform: 'none' }}>{date}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <nav style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="/ohio" style={{ color: 'inherit', textDecoration: 'none' }}>Ohio</a>
            <a href="/search" style={{ color: 'inherit', textDecoration: 'none' }}>Search</a>
            <a href="/forum" style={{ color: 'inherit', textDecoration: 'none' }}>Forum</a>
            <a href="/submit" style={{ color: 'inherit', textDecoration: 'none' }}>Submit</a>
          </nav>
          <AuthNav />
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 0 1.5rem', borderBottom: '3px double #333' }}>
        <h1 style={{ fontSize: '88px', fontWeight: 900, lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>The Local Circuit</h1>
        <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#666', marginTop: '0.5rem' }}>Student voices. Local issues. Statewide reach.</p>
      </div>

      {!articles || articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 0', color: '#ccc' }}>
          <p style={{ fontStyle: 'italic', fontSize: '22px', marginBottom: '1.5rem' }}>No stories yet — be the first.</p>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 28px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Submit a Story</a>
        </div>
      ) : articles.length === 1 ? (
        <div style={{ padding: '2.5rem 0', borderBottom: '0.5px solid #ddd' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>{articles[0].city} · {articles[0].state}</p>
          <a href={`/article/${articles[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, margin: '0.5rem 0', letterSpacing: '-0.02em' }}>{articles[0].titles}</h2>
          </a>
          <p style={{ fontSize: '14px', color: '#666' }}>By {articles[0].author} · {new Date(articles[0].published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', paddingBottom: '2rem', borderBottom: '0.5px solid #ddd' }}>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>{articles[0].city} · {articles[0].state}</p>
              <a href={`/article/${articles[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.15, margin: '0.5rem 0', letterSpacing: '-0.01em' }}>{articles[0].titles}</h2>
              </a>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, margin: '0.5rem 0 0.75rem' }}>{articles[0].content?.slice(0, 180)}...</p>
              <p style={{ fontSize: '13px', color: '#999' }}>By {articles[0].author} · {new Date(articles[0].published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '0.5px solid #e8e8e4', paddingLeft: '2rem' }}>
              {articles.slice(1, 4).map((a: any) => (
                <div key={a.id} style={{ paddingBottom: '1.25rem', borderBottom: '0.5px solid #eee' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', margin: '0 0 0.3rem' }}>{a.city} · {a.state}</p>
                  <a href={`/article/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 0.3rem' }}>{a.titles}</h3>
                  </a>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>By {a.author}</p>
                </div>
              ))}
            </div>
          </div>

          {articles.length > 4 && (
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '0.5px solid #ddd' }}>
              {articles.slice(4, 7).map((a: any) => (
                <div key={a.id}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', margin: '0 0 0.4rem' }}>{a.city}</p>
                  <a href={`/article/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 0.4rem' }}>{a.titles}</h4>
                  </a>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>By {a.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2.5rem', padding: '2rem 2.5rem', border: '0.5px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f7' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 0.25rem' }}>Your city has a story. Tell it.</h3>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>The Local Circuit is looking for student writers across Ohio.</p>
        </div>
        <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px', whiteSpace: 'nowrap' }}>Submit a Story</a>
      </div>
    </main>
  )
}
