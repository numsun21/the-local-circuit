import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
      </div>
      <div style={{ maxWidth: '600px', margin: '8rem auto', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ccc', marginBottom: '1rem' }}>404</p>
        <h1 style={{ fontSize: '52px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Page not found.</h1>
        <p style={{ fontSize: '16px', color: '#888', fontStyle: 'italic', marginBottom: '2.5rem', lineHeight: 1.7 }}>The story you're looking for doesn't exist — or may have moved.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Back to Home</a>
          <a href="/forum" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#fff', color: '#1a1a1a', textDecoration: 'none', borderRadius: '2px', border: '0.5px solid #ddd' }}>Visit Forum</a>
          <a href="/submit" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#fff', color: '#1a1a1a', textDecoration: 'none', borderRadius: '2px', border: '0.5px solid #ddd' }}>Submit a Story</a>
        </div>
      </div>
    </div>
  )
}
