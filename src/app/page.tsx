export default function Home() {
  return (
    <main style={{
      fontFamily: 'Georgia, serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 1.5rem 3rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0 0.75rem',
        borderBottom: '0.5px solid #ccc',
        fontSize: '12px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        <span style={{ fontStyle: 'italic' }}>Sunday, March 15, 2026</span>
        <nav style={{ display: 'flex', gap: '1.25rem' }}>
         <a href="/ohio" style={{ color: 'inherit', textDecoration: 'none' }}>Ohio</a>
         <a href="/ohio/counties" style={{ color: 'inherit', textDecoration: 'none' }}>Counties</a>
         <a href="/ohio/cities" style={{ color: 'inherit', textDecoration: 'none' }}>Cities</a>
         <a href="/forum" style={{ color: 'inherit', textDecoration: 'none' }}>Forum</a>
         <a href="/submit" style={{ color: 'inherit', textDecoration: 'none' }}>Submit</a>
</nav>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 0 1.25rem', borderBottom: '3px double #333' }}>
        <h1 style={{ fontSize: '80px', fontWeight: 900, lineHeight: 1, margin: 0 }}>
          The Local Circuit
        </h1>
        <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#666', marginTop: '0.5rem' }}>
          Student voices. Local issues. Statewide reach.
        </p>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666' }}>Education · Franklin County</p>
          <h2 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.15, margin: '0.5rem 0' }}>
            School funding gaps widen across rural Ohio as state budget negotiations stall
          </h2>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.65 }}>
            Students in 14 southeastern counties report outdated textbooks, understaffed classrooms, and crumbling infrastructure as Columbus lawmakers remain deadlocked.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { tag: 'Housing · Cuyahoga County', title: "Cleveland's east side faces wave of evictions as rental assistance funds dry up" },
            { tag: 'Environment · Hamilton County', title: 'Cincinnati students push back on proposed highway expansion through Avondale' },
            { tag: 'Politics · Statewide', title: 'Youth voter turnout in Ohio up 18% — but registration barriers remain' },
          ].map((story) => (
            <div key={story.title} style={{ paddingBottom: '1rem', borderBottom: '0.5px solid #ddd' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', margin: 0 }}>{story.tag}</p>
              <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.25, margin: '0.3rem 0 0' }}>{story.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.75rem 2rem',
        border: '0.5px solid #ccc',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f9f9f9',
      }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 0.25rem' }}>Your city has a story. Tell it.</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>The Local Circuit is looking for student writers across Ohio.</p>
        </div>
        <button style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          border: 'none',
          background: '#111',
          color: '#fff',
        }}>
          Submit a story
        </button>
      </div>
    </main>
  );
}