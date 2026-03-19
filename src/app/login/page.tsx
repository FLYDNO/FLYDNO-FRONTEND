'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [showPwd, setShowPwd] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail || !loginPassword) { setError('Fyll inn e-post og passord.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) setError('Feil e-post eller passord. Prøv igjen.')
    else window.location.href = '/deals'
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regEmail || !regPassword) { setError('Fyll inn e-post og passord.'); return }
    if (regPassword.length < 8) { setError('Passordet må være minst 8 tegn.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } }
    })
    if (error) setError(error.message)
    else setSuccess('Sjekk e-posten din for å bekrefte kontoen!')
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)', background: '#242424',
    fontFamily: 'inherit', fontSize: 14, color: '#f0f0f0',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#ff6b00', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="ms" style={{ fontSize: 18, color: '#fff' }}>flight_takeoff</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.3px' }}>FlyDeals</span>
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="ms" style={{ fontSize: 16 }}>arrow_back</span>
          Tilbake til forsiden
        </Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Card */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>

            {/* Logo + title */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 52, height: 52, background: '#ff6b00', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span className="ms" style={{ fontSize: 26, color: '#fff' }}>flight_takeoff</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px', marginBottom: 6 }}>
                {view === 'login' ? 'Logg inn på FlyDeals' : 'Opprett konto'}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                {view === 'login' ? '7 dager gratis prøveperiode · 149 kr/mnd' : 'Start 7 dager gratis — ingen kredittkort'}
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#242424', borderRadius: 12, padding: 4, marginBottom: 24 }}>
              <button onClick={() => { setView('login'); setError(''); }} style={{
                flex: 1, padding: 10, borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: view === 'login' ? '#333' : 'transparent', color: view === 'login' ? '#f0f0f0' : 'rgba(255,255,255,0.4)',
                boxShadow: view === 'login' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              }}>Logg inn</button>
              <button onClick={() => { setView('register'); setError(''); }} style={{
                flex: 1, padding: 10, borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: view === 'register' ? '#333' : 'transparent', color: view === 'register' ? '#f0f0f0' : 'rgba(255,255,255,0.4)',
                boxShadow: view === 'register' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              }}>Registrer deg</button>
            </div>

            {/* Google */}
            <button onClick={handleGoogleLogin} disabled={loading} style={{
              width: '100%', padding: 12, borderRadius: 100, background: '#242424', color: '#f0f0f0', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, transition: 'border-color 0.15s',
            }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Fortsett med Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>eller</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="ms" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="ms" style={{ fontSize: 16 }}>check_circle</span>
                {success}
              </div>
            )}

            {/* Login form */}
            {view === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>E-postadresse</label>
                  <input type="email" placeholder="din@epost.no" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#ff6b00'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Passord</label>
                    <a href="#" style={{ fontSize: 12, color: '#ff6b00', textDecoration: 'none' }}>Glemt passord?</a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
                      style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.currentTarget.style.borderColor = '#ff6b00'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}>
                      <span className="ms" style={{ fontSize: 20 }}>{showPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: 13, borderRadius: 100, background: '#ff6b00', color: '#fff', fontFamily: 'inherit',
                  fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 4, opacity: loading ? 0.65 : 1,
                }}>
                  {loading ? 'Logger inn...' : 'Logg inn'}
                </button>
              </form>
            )}

            {/* Register form */}
            {view === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Fullt navn (valgfritt)</label>
                  <input type="text" placeholder="Ola Nordmann" value={regName} onChange={e => setRegName(e.target.value)}
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#ff6b00'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>E-postadresse</label>
                  <input type="email" placeholder="din@epost.no" value={regEmail} onChange={e => setRegEmail(e.target.value)} required
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#ff6b00'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Passord</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPwd ? 'text' : 'password'} placeholder="Minst 8 tegn" value={regPassword} onChange={e => setRegPassword(e.target.value)} required
                      style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.currentTarget.style.borderColor = '#ff6b00'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}>
                      <span className="ms" style={{ fontSize: 20 }}>{showPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: 13, borderRadius: 100, background: '#ff6b00', color: '#fff', fontFamily: 'inherit',
                  fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 4, opacity: loading ? 0.65 : 1,
                }}>
                  {loading ? 'Oppretter konto...' : 'Opprett konto — 7 dager gratis'}
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5 }}>
                  Ved å registrere deg godtar du våre{' '}
                  <Link href="/vilkar" style={{ color: '#ff6b00' }}>vilkår</Link>
                  {' '}og{' '}
                  <Link href="/personvern" style={{ color: '#ff6b00' }}>personvernpolicy</Link>.
                </p>
              </form>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { icon: 'lock', label: 'Sikker betaling' },
              { icon: 'cancel', label: 'Si opp når som helst' },
              { icon: 'verified', label: 'Ingen binding' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <span className="ms" style={{ fontSize: 14, color: '#22c55e' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
