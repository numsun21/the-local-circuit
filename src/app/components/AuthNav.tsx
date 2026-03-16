'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthNav() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      if (data.session?.user) {
        supabase.from('profiles').select('*').eq('user_id', data.session.user.id).single().then(({ data: p }) => setProfile(p))
      }
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('user_id', session.user.id).single().then(({ data: p }) => setProfile(p))
      } else {
        setProfile(null)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (user) return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
      <a href={`/writer/${profile?.name?.toLowerCase().replace(/\s+/g, '-') || user.id}`} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>
        {profile?.name || 'Profile'}
      </a>
      <button onClick={handleLogout} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Log out</button>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
      <a href="/login" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', textDecoration: 'none' }}>Log in</a>
      <a href="/signup" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '7px 16px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '2px' }}>Sign up</a>
    </div>
  )
}
