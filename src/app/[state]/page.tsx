export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const stateName = state.charAt(0).toUpperCase() + state.slice(1)
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← The Local Circuit</a>
      <h1 style={{ fontSize: '60px', fontWeight: 900, margin: '1rem 0 0.5rem' }}>{stateName}</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Statewide student coverage</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href={`/${state}/cities`} style={{ padding: '10px 20px', border: '0.5px solid #ccc', borderRadius: '8px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Cities</a>
        <a href={`/${state}/counties`} style={{ padding: '10px 20px', border: '0.5px solid #ccc', borderRadius: '8px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Counties</a>
      </div>
    </main>
  )
}
