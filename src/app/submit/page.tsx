'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', school: '', city: '', title: '', article: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
        if (profile) {
          const nameParts = (profile.name || '').split(' ')
          setForm(f => ({
            ...f,
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: profile.email || user.email || '',
            school: profile.school || '',
            city: profile.city || '',
          }))
        }
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.from('submissions').insert([{
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      school: form.school,
      city: form.city,
      title: form.title,
      article: form.article,
      status: 'pending',
      published: false,
    }])
    if (!error) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setSubmitted(true)
    } else {
      setError('Error: ' + error.message)
    }
    setLoading(false)
  }

  if (submitted) return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '1rem' }}>Submitted</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Thank you!</h1>
      <p style={{ color: '#666', fontStyle: 'italic', fontSize: '16px', marginBottom: '2rem', lineHeight: 1.7 }}>Your story has been submitted. Our editorial team will review it and be in touch soon.</p>
      <a href="/" style={{ padding: '12px 24px', background: '#1a1a1a', color: '#fff', borderRadius: '2px', textDecoration: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Back to Home</a>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', textDecoration: 'none' }}>← The Local Circuit</a>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Contribute</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Submit a Story</h1>
      <p style={{ fontStyle: 'italic', color: '#888', marginBottom: '2rem', fontSize: '15px' }}>Tell us what's happening in your community.</p>

      {error && <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '1rem', padding: '10px 14px', background: '#fdf5f5', border: '0.5px solid #f5c6c6', borderRadius: '2px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[{ label: 'First Name', key: 'first_name' }, { label: 'Last Name', key: 'last_name' }].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>{f.label}</label>
              <input required value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: '2px', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', background: '#fafaf8' }} />
            </div>
          ))}
        </div>
        {[
          { label: 'Email', key: 'email', type: 'email', placeholder: '' },
          { label: 'School', key: 'school', type: 'text', placeholder: 'e.g. Ohio State University' },
          { label: 'City / County', key: 'city', type: 'text', placeholder: 'e.g. Columbus, Franklin County' },
          { label: 'Article Title', key: 'title', type: 'text', placeholder: '' },
        ].map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>{f.label}</label>
            <input required type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: '2px', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', background: '#fafaf8' }} />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>Your Article</label>
          <textarea required rows={12} value={form.article} onChange={e => setForm({ ...form, article: e.target.value })} style={{ padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: '2px', fontSize: '15px', fontFamily: 'Georgia, serif', resize: 'vertical', outline: 'none', background: '#fafaf8' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          {loading ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </main>
  )
}
