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
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })
    if (error) setError(error.message)
    else window.location.href = '/deals'
    setLoading(false)
  }

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } },
    })
    if (error) setError(error.message)
    else window.location.href = '/deals'
    setLoading(false)
  }

  return (
    <>
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        input { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-[#050505] text-slate-100 min-h-screen flex flex-col">
        {/* Orange top bar */}
        <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-50"></div>

        <div className="flex-1 flex flex-col justify-center items-center px-4 py-16">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <span className="ms" style={{fontSize:'30px'}}>flight_takeoff</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FlyDeals</h1>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full max-w-md mb-4 p-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="w-full max-w-md">
              <div className="w-full bg-[#242424] p-8 rounded-2xl border border-[#383838] shadow-2xl">
                <div className="mb-7">
                  <h2 className="text-2xl font-bold mb-1.5 text-white">Velkommen tilbake</h2>
                  <p className="text-slate-400 text-sm">Finn de beste reisetilbudene ved å logge inn</p>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">E-post</label>
                    <div className="relative">
                      <span className="ms absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{fontSize:'20px'}}>mail</span>
                      <input type="email" placeholder="din@epost.no" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                        className="w-full bg-[#2e2e2e] border border-[#444444] rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"/>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-300">Passord</label>
                      <a href="#" className="text-xs font-semibold text-primary hover:opacity-80">Glemt passord?</a>
                    </div>
                    <div className="relative">
                      <span className="ms absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{fontSize:'20px'}}>lock</span>
                      <input type={showLoginPwd ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                        className="w-full bg-[#2e2e2e] border border-[#444444] rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"/>
                      <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        <span className="ms" style={{fontSize:'20px'}}>{showLoginPwd ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <button onClick={handleLogin} disabled={loading}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20 text-sm mt-1 disabled:opacity-70">
                    {loading ? 'Logger inn...' : 'Logg inn'}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#383838]"></div></div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                    <span className="bg-[#242424] px-3 text-slate-500">Eller logg inn med</span>
                  </div>
                </div>

                {/* Google */}
                <button onClick={handleGoogleLogin} disabled={loading}
                  className="flex items-center justify-center gap-3 w-full bg-[#2e2e2e] border border-[#444444] hover:bg-[#383838] py-3 rounded-xl transition-all font-medium text-sm text-slate-200">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <p className="mt-7 text-center text-sm text-slate-500">
                  Ny hos FlyDeals?
                  <button onClick={() => setView('register')} className="text-primary font-semibold hover:opacity-80 ml-1">Prøv gratis</button>
                </p>
              </div>
              <p className="mt-6 text-center text-xs text-slate-600 leading-relaxed">
                Ved å logge inn godtar du våre <a href="#" className="underline hover:text-slate-400">vilkår</a> og <a href="#" className="underline hover:text-slate-400">personvernregler</a>.
              </p>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <div className="w-full max-w-md">
              <div className="w-full bg-[#242424] p-8 rounded-2xl border border-[#383838] shadow-2xl">
                {/* Trial badge */}
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  7 dager gratis — ingen binding
                </div>

                <div className="mb-7">
                  <h2 className="text-2xl font-bold mb-1.5 text-white">Opprett konto</h2>
                  <p className="text-slate-400 text-sm">Kom i gang på under ett minutt</p>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Navn</label>
                    <div className="relative">
                      <span className="ms absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{fontSize:'20px'}}>person</span>
                      <input type="text" placeholder="Ditt navn" value={regName} onChange={e => setRegName(e.target.value)}
                        className="w-full bg-[#2e2e2e] border border-[#444444] rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"/>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">E-post</label>
                    <div className="relative">
                      <span className="ms absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{fontSize:'20px'}}>mail</span>
                      <input type="email" placeholder="din@epost.no" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        className="w-full bg-[#2e2e2e] border border-[#444444] rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"/>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Passord</label>
                    <div className="relative">
                      <span className="ms absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{fontSize:'20px'}}>lock</span>
                      <input type={showRegPwd ? 'text' : 'password'} placeholder="Minst 8 tegn" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                        className="w-full bg-[#2e2e2e] border border-[#444444] rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"/>
                      <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        <span className="ms" style={{fontSize:'20px'}}>{showRegPwd ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Register button */}
                  <button onClick={handleRegister} disabled={loading}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20 text-sm mt-1 disabled:opacity-70">
                    {loading ? 'Oppretter konto...' : 'Start gratis prøveperiode'}
                  </button>

                  {/* Stripe notice */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Sikker betaling via Stripe — vi lagrer ikke kortinfo
                  </div>

                  <p className="text-xs text-center text-slate-600">
                    Etter 7 dager: 149 kr/mnd. Avbryt når som helst.
                  </p>
                </div>

                {/* Divider */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#383838]"></div></div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                    <span className="bg-[#242424] px-3 text-slate-500">Eller registrer med</span>
                  </div>
                </div>

                {/* Google */}
                <button onClick={handleGoogleLogin} disabled={loading}
                  className="flex items-center justify-center gap-3 w-full bg-[#2e2e2e] border border-[#444444] hover:bg-[#383838] py-3 rounded-xl transition-all font-medium text-sm text-slate-200">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <p className="mt-7 text-center text-sm text-slate-500">
                  Har du allerede konto?
                  <button onClick={() => setView('login')} className="text-primary font-semibold hover:opacity-80 ml-1">Logg inn</button>
                </p>
              </div>
              <p className="mt-6 text-center text-xs text-slate-600 leading-relaxed">
                Ved å registrere deg godtar du våre <a href="#" className="underline hover:text-slate-400">vilkår</a> og <a href="#" className="underline hover:text-slate-400">personvernregler</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
