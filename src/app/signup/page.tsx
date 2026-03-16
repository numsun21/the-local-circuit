'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', school: '', city: '', email: '', password: '', email_notifications: true })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    const userId = data.user?.id
    if (userId) {
      await supabase.from('profiles').insert([{
        user_id: userId,
        name: form.name,
        school: form.school,
        city: form.city,
        email: form.email,
        email_notifications: form.email_notifications,
      }])
    }

    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
      </div>
      <div style={{ maxWidth: '480px', margin: '6rem auto', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '1rem' }}>Check your email!</h1>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7, marginBottom: '2rem' }}>We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.</p>
        <a href="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 24px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Back to Home</a>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '0.5px solid #e0e0e0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 900, textDecoration: 'none', color: '#1a1a1a' }}>The Local Circuit</a>
        <a href="/login" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Already have an account? Log in</a>
      </div>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: '0.75rem' }}>Join</p>
        <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Create an account</h1>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '2rem' }}>Join the student journalism network across Ohio.</p>

        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '1rem', padding: '10px', background: '#fff5f5', border: '0.5px solid #ffcccc', borderRadius: '4px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
            { label: 'School', key: 'school', type: 'text', placeholder: 'e.g. Ohio State University' },
            { label: 'City', key: 'city', type: 'text', placeholder: 'e.g. Columbus' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontFamily: 'Georgia, serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
              <input
                required
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '0.5px solid #ddd', fontSize: '15px', fontFamily: 'Georgia, serif', outline: 'none', borderRadius: '2px', background: '#fafaf8' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f9f9f7', border: '0.5px solid #e8e8e4', borderRadius: '4px' }}>
            <input
              type="checkbox"
              id="notifs"
              checked={form.email_notifications}
              onChange={e => setForm({ ...form, email_notifications: e.target.checked })}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="notifs" style={{ fontSize: '14px', color: '#444', cursor: 'pointer', lineHeight: 1.5 }}>
              Email me when new stories drop in my city
            </label>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px', fontFamily: 'Georgia, serif', marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
