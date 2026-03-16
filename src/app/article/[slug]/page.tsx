import { createClient } from '@supabase/supabase-js'
import ArticleClient from './ArticleClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single()
  const { data: related } = await supabase.from('articles').select('*').neq('slug', slug).limit(3).order('published_at', { ascending: false })
  const { data: comments } = await supabase.from('article_comments').select('*').eq('article_slug', slug).order('created_at', { ascending: true })

  if (!article) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900 }}>Article not found</h1>
      <a href="/" style={{ color: '#666', fontSize: '14px' }}>← Back to home</a>
    </main>
  )

  return <ArticleClient article={article} related={related || []} comments={comments || []} />
}
