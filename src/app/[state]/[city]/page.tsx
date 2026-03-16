export default function CityPage({ params }: { params: { state: string, city: string } }) {
  const state = params.state.charAt(0).toUpperCase() + params.state.slice(1)
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href={`/${params.state}`} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← {state}</a>
      <h1 style={{ fontSize: '60px', fontWeight: 900, margin: '1rem 0 0.5rem' }}>{city}</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Local student coverage from {city}, {state}</p>
    </main>
  )
}
