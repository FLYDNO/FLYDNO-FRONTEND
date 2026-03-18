'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleLogin() {
    if (!loginEmail || !loginPassword) { setError('Vennligst fyll inn e-post og passord.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) setError(error.message)
    else window.location.href = '/deals'
    setLoading(false)
  }

  async function handleRegister() {
    if (!regEmail || !regPassword) { setError('Vennligst fyll inn e-post og passord.'); return }
    if (regPassword.length < 8) { setError('Passordet må være minst 8 tegn.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { full_name: regName } } })
    if (error) setError(error.message)
    else window.location.href = '/deals'
    setLoading(false)
  }

  const card = { background: '#242424', border: '1px solid #383838', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }
  const inp = { background: '#2e2e2e', border: '1px solid #444444', borderRadius: '12px', padding: '14px 16px 14px 44px', fontSize: '14px', color: '#e2e8f0', width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  const inpR = { ...inp, paddingRight: '48px' }
  const iconPos = { position: 'absolute' as const, left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#64748b' }
  const eyePos = { position: 'absolute' as const, right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }
  const btnPrimary = { background: '#ff6b00', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 700, width: '100%', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 10px 25px rgba(255,107,0,0.2)', marginTop: '4px' }
  const btnGoogle = { background: '#2e2e2e', border: '1px solid #444444', borderRadius: '12px', padding: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
  const dividerLine = { position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center' }

  return (
    <div style={{ background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>
      {/* Orange top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right, rgba(255,107,0,0.2), #ff6b00, rgba(255,107,0,0.2))', zIndex: 50 }}></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'center', padding: '64px 16px' }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '56px', height: '56px', background: '#ff6b00', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 25px rgba(255,107,0,0.25)' }}>
            <span className="ms" style={{ fontSize: '30px' }}>flight_takeoff</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>FlyDeals</h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ width: '100%', maxWidth: '448px', marginBottom: '16px', padding: '12px', borderRadius: '12px', fontSize: '14px', color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <div style={{ width: '100%', maxWidth: '448px' }}>
            <div style={card}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>Velkommen tilbake</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>Finn de beste reisetilbudene ved å logge inn</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}>E-post</label>
                  <div style={{ position: 'relative' }}>
                    <span className="ms" style={iconPos}>mail</span>
                    <input type="email" placeholder="din@epost.no" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={inp} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}>Passord</label>
                    <a href="#" style={{ fontSize: '12px', fontWeight: 600, color: '#ff6b00', textDecoration: 'none' }}>Glemt passord?</a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span className="ms" style={iconPos}>lock</span>
                    <input type={showLoginPwd ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={inpR} />
                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} style={eyePos}>
                      <span className="ms" style={{ fontSize: '20px' }}>{showLoginPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <button onClick={handleLogin} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Logger inn...' : 'Logg inn'}
                </button>
              </div>

              {/* Divider */}
              <div style={{ position: 'relative', margin: '28px 0' }}>
                <div style={dividerLine}><div style={{ width: '100%', borderTop: '1px solid #383838' }}></div></div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ background: '#242424', padding: '0 12px', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b' }}>Eller logg inn med</span>
                </div>
              </div>

              {/* Google */}
              <button onClick={handleGoogleLogin} disabled={loading} style={btnGoogle}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                Ny hos FlyDeals?{' '}
                <button onClick={() => { setView('register'); setError('') }} style={{ color: '#ff6b00', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Prøv gratis</button>
              </p>
            </div>
            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              Ved å logge inn godtar du våre <a href="#" style={{ textDecoration: 'underline', color: 'inherit' }}>vilkår</a> og <a href="#" style={{ textDecoration: 'underline', color: 'inherit' }}>personvernregler</a>.
            </p>
          </div>
        )}

        {/* REGISTER VIEW */}
        {view === 'register' && (
          <div style={{ width: '100%', maxWidth: '448px' }}>
            <div style={card}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '100px', marginBottom: '24px' }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                7 dager gratis — ingen binding
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>Opprett konto</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>Kom i gang på under ett minutt</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}>Navn</label>
                  <div style={{ position: 'relative' }}>
                    <span className="ms" style={iconPos}>person</span>
                    <input type="text" placeholder="Ditt navn" value={regName} onChange={e => setRegName(e.target.value)} style={inp} />
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}>E-post</label>
                  <div style={{ position: 'relative' }}>
                    <span className="ms" style={iconPos}>mail</span>
                    <input type="email" placeholder="din@epost.no" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inp} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}>Passord</label>
                  <div style={{ position: 'relative' }}>
                    <span className="ms" style={iconPos}>lock</span>
                    <input type={showRegPwd ? 'text' : 'password'} placeholder="Minst 8 tegn" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={inpR} />
                    <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} style={eyePos}>
                      <span className="ms" style={{ fontSize: '20px' }}>{showRegPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <button onClick={handleRegister} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Oppretter konto...' : 'Start gratis prøveperiode'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Sikker betaling via Stripe — vi lagrer ikke kortinfo
                </div>

                <p style={{ fontSize: '12px', textAlign: 'center', color: '#475569' }}>Etter 7 dager: 149 kr/mnd. Avbryt når som helst.</p>
              </div>

              {/* Divider */}
              <div style={{ position: 'relative', margin: '28px 0' }}>
                <div style={dividerLine}><div style={{ width: '100%', borderTop: '1px solid #383838' }}></div></div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ background: '#242424', padding: '0 12px', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b' }}>Eller registrer med</span>
                </div>
              </div>

              {/* Google */}
              <button onClick={handleGoogleLogin} disabled={loading} style={btnGoogle}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                Har du allerede konto?{' '}
                <button onClick={() => { setView('login'); setError('') }} style={{ color: '#ff6b00', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Logg inn</button>
              </p>
            </div>
            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              Ved å registrere deg godtar du våre <a href="#" style={{ textDecoration: 'underline', color: 'inherit' }}>vilkår</a> og <a href="#" style={{ textDecoration: 'underline', color: 'inherit' }}>personvernregler</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
