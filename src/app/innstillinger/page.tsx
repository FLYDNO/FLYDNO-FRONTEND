'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const AIRPORTS = [
  { code: 'OSL', name: 'Oslo Gardermoen' },
  { code: 'BGO', name: 'Bergen Flesland' },
  { code: 'SVG', name: 'Stavanger Sola' },
  { code: 'TRD', name: 'Trondheim Vaernes' },
  { code: 'TOS', name: 'Tromso Langnes' },
  { code: 'TRF', name: 'Sandefjord Torp' },
  { code: 'KRS', name: 'Kristiansand Kjevik' },
]

const STRIPE_PRICE_ID = 'price_1TCCV4BH30TF6uRO4Dshmthq'

export default function InnstillingerPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [selectedAirports, setSelectedAirports] = useState(['OSL', 'BGO', 'SVG', 'TRD', 'TOS', 'TRF'])
  const [emailNotif, setEmailNotif] = useState(true)
  const [minDiscount, setMinDiscount] = useState(30)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [stripeLoading, setStripeLoading] = useState(false)
  const [subscriptionStatus] = useState<'trial' | 'active' | 'cancelled' | 'none'>('trial')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Laster...</p>
      </div>
    )
  }

  const toggleAirport = (code: string) => {
    setSelectedAirports(prev =>
      prev.includes(code) ? prev.filter(a => a !== code) : [...prev, code]
    )
  }

  const saveSettings = () => {
    setSaveState('saving')
    setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    }, 800)
  }

  const handleStripeCheckout = async () => {
    setStripeLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: STRIPE_PRICE_ID, email: userEmail }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Noe gikk galt. Prøv igjen.')
    }
    setStripeLoading(false)
  }

  const statusBadge = {
    trial: { label: '7 dager gratis', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    active: { label: 'Aktiv', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    cancelled: { label: 'Kansellert', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
    none: { label: 'Inaktiv', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
  }[subscriptionStatus]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      <Sidebar active="innstillinger" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Innstillinger</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Administrer konto, varsler og abonnement</p>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Abonnement */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Abonnement</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>FlyDeals · 149 kr/mnd</p>
              </div>
              <span style={{ background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}`, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>
                {statusBadge.label}
              </span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {subscriptionStatus === 'trial' && (
                <div style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span className="ms" style={{ fontSize: 20, color: '#ff6b00', flexShrink: 0 }}>info</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0', marginBottom: 2 }}>Du er i prøveperioden</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Prøveperioden din utløper om 5 dager. Legg til betalingsinformasjon for å fortsette etter det.</p>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { icon: 'calendar_today', label: 'Neste faktura', val: subscriptionStatus === 'trial' ? '26. mars 2026' : '19. april 2026' },
                  { icon: 'payments', label: 'Beløp', val: '149 kr/mnd' },
                  { icon: 'event_available', label: 'Abonnement siden', val: '12. mars 2026' },
                  { icon: 'local_offer', label: 'Deals funnet', val: '187 deals' },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: '#242424', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="ms" style={{ fontSize: 13 }}>{icon}</span>{label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{val}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleStripeCheckout} disabled={stripeLoading}
                  style={{ flex: 1, padding: 12, background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: stripeLoading ? 0.7 : 1 }}>
                  <span className="ms" style={{ fontSize: 18 }}>credit_card</span>
                  {stripeLoading ? 'Laster...' : subscriptionStatus === 'trial' ? 'Legg til betaling' : 'Administrer abonnement'}
                </button>
                {subscriptionStatus === 'active' && (
                  <button style={{ padding: '12px 20px', background: 'transparent', color: '#ef4444', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>
                    Si opp
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Flyplasser */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Dine flyplasser</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Velg hvilke flyplasser du vil ha varsler fra</p>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {AIRPORTS.map(({ code, name }) => {
                  const active = selectedAirports.includes(code)
                  return (
                    <div key={code} onClick={() => toggleAirport(code)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, border: `1px solid ${active ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.07)'}`, background: active ? 'rgba(255,107,0,0.06)' : '#242424', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: active ? '#ff6b00' : 'rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
                          <span className="ms" style={{ fontSize: 18, color: active ? '#fff' : 'rgba(255,255,255,0.4)' }}>flight_takeoff</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{name}</p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{code}</p>
                        </div>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${active ? '#ff6b00' : 'rgba(255,255,255,0.15)'}`, background: active ? '#ff6b00' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                        {active && <span className="ms" style={{ fontSize: 14, color: '#fff' }}>check</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Varslingsinnstillinger */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Varslingsinnstillinger</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Tilpass når og hvordan du får varsler</p>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0', marginBottom: 2 }}>E-postvarsler</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Få e-post når vi finner en deal</p>
                </div>
                <button onClick={() => setEmailNotif(!emailNotif)} style={{
                  width: 48, height: 26, borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background 0.2s', position: 'relative',
                  background: emailNotif ? '#ff6b00' : 'rgba(255,255,255,0.15)',
                }}>
                  <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, transition: 'left 0.2s', left: emailNotif ? 25 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </button>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0', marginBottom: 2 }}>Minimum rabatt</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Varsle meg kun om deals med minst {minDiscount}% rabatt</p>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#ff6b00' }}>{minDiscount}%</span>
                </div>
                <input type="range" min={20} max={60} step={5} value={minDiscount} onChange={e => setMinDiscount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff6b00' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                  <span>20% (flere deals)</span>
                  <span>60% (bare de beste)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Konto */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Konto</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Din kontoinformasjon</p>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Navn</label>
                <input defaultValue={userName} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, color: '#f0f0f0', outline: 'none', background: '#242424', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>E-post</label>
                <input defaultValue={userEmail} disabled style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', fontSize: 14, color: 'rgba(255,255,255,0.35)', outline: 'none', background: '#1a1a1a', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 100, background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <span className="ms" style={{ fontSize: 16 }}>logout</span>
                Logg ut
              </button>
              <button onClick={saveSettings} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: saveState === 'saved' ? '#22c55e' : '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }}>
                <span className="ms" style={{ fontSize: 16 }}>{saveState === 'saved' ? 'check' : saveState === 'saving' ? 'sync' : 'save'}</span>
                {saveState === 'saved' ? 'Lagret!' : saveState === 'saving' ? 'Lagrer...' : 'Lagre innstillinger'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
