export default function SubmitPage() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← The Local Circuit</a>
      <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '1rem 0 0.25rem' }}>Submit a Story</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Tell us what's happening in your community.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>First Name</label>
            <input type="text" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Last Name</label>
            <input type="text" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Email</label>
          <input type="email" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>School</label>
          <input type="text" placeholder="e.g. Ohio State University" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>City / County</label>
          <input type="text" placeholder="e.g. Columbus, Franklin County" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Article Title</label>
          <input type="text" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Your Article</label>
          <textarea rows={12} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif', resize: 'vertical' }} />
        </div>

        <button type="submit" style={{ padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Submit Story
        </button>
      </form>
    </main>
  )
}
