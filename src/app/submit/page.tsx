'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', school: '', city: '', title: '', article: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('submissions').insert([form])
    setLoading(false)
    if (!error) setSubmitted(true)
    else alert('Something went wrong. Please try again.')
  }

  if (submitted) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '1rem' }}>Thank you!</h1>
      <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '2rem' }}>Your story has been submitted. We'll be in touch soon.</p>
      <a href="/" style={{ padding: '12px 24px', background: '#111', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Back to Home</a>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>← The Local Circuit</a>
      <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '1rem 0 0.25rem' }}>Submit a Story</h1>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '2rem' }}>Tell us what's happening in your community.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>First Name</label>
            <input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Last Name</label>
            <input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Email</label>
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>School</label>
          <input required value={form.school} onChange={e => setForm({...form, school: e.target.value})} placeholder="e.g. Ohio State University" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>City / County</label>
          <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Columbus, Franklin County" style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Article Title</label>
          <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>Your Article</label>
          <textarea required rows={12} value={form.article} onChange={e => setForm({...form, article: e.target.value})} style={{ padding: '10px 12px', border: '0.5px solid #ccc', borderRadius: '8px', fontSize: '15px', fontFamily: 'Georgia, serif', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          {loading ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </main>
  )
}
