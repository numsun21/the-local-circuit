export default async function CityPage({ params }: { params: Promise<{ state: string, city: string }> }) {
  const { state, city } = await params
  const stateName = state.charAt(0).toUpperCase() + state.slice(1)
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href={`/${state}`} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← {stateName}</a>
      <h1 style={{ fontSize: '60px', fontWeight: 900, margin: '1rem 0 0.5rem' }}>{cityName}</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Local student coverage from {cityName}, {stateName}</p>
    </main>
  )
}
