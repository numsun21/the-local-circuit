import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single()

  if (!article) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900 }}>Article not found</h1>
      <a href="/" style={{ color: '#666', fontSize: '14px' }}>← Back to home</a>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← The Local Circuit</a>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', margin: '1rem 0 0.5rem' }}>{article.city} · {article.state}</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>{article.titles}</h1>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '0.5px solid #ddd' }}>
        By {article.author} · {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <div style={{ fontSize: '17px', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{article.content}</div>
    </main>
  )
}
