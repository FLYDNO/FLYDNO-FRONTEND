'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const FAQS = [
  { q: 'Hvilke flyplasser overvåker dere?', a: 'Vi overvåker Oslo (OSL), Bergen (BGO), Stavanger (SVG), Trondheim (TRD), Tromsø (TOS), Torp (TRF) og Kristiansand (KRS) — 7 norske flyplasser totalt.' },
  { q: 'Hva er en "deal"?', a: 'En deal er en pris som er 30% eller mer under det historiske gjennomsnittet for den ruten, og som sparer deg minst 500 kr.' },
  { q: 'Hvor ofte oppdateres prisene?', a: 'Vi sjekker prisene 3 ganger daglig — morgen, middag og kveld. Du får e-post så snart vi finner en deal.' },
  { q: 'Kan jeg si opp når som helst?', a: 'Ja, du kan si opp abonnementet når som helst via Innstillinger. Ingen bindingstid.' },
  { q: 'Hva skjer etter prøveperioden?', a: 'Etter 7 dager gratis trekkes 149 kr/mnd automatisk. Du kan si opp når som helst før det.' },
  { q: 'Booker dere for meg?', a: 'Nei — vi sender deg en direktelenke til Google Flights der du booker direkte hos flyselskapet. Vi tar ingen provisjon.' },
  { q: 'Kan jeg velge hvilke flyplasser jeg vil ha varsler fra?', a: 'Ja! Gå til Innstillinger og velg de flyplassene du ønsker varsler fra.' },
]

export default function BrukerstottePage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050505' }}><p style={{ color: 'rgba(255,255,255,0.5)' }}>Laster...</p></div>
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) { setSent(true); setMessage('') }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      <Sidebar active="brukerstotte" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Brukerstøtte</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Vi hjelper deg gjerne!</p>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* FAQ */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Ofte stilte spørsmål</h2>
            </div>
            <div style={{ padding: '4px 24px' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', textAlign: 'left', gap: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{faq.q}</span>
                    <span className="ms" style={{ fontSize: 20, color: 'rgba(255,255,255,0.35)', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                  </button>
                  {openFaq === i && (
                    <p style={{ paddingBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginBottom: 2 }}>Send oss en melding</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Vi svarer innen 24 timer</p>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {sent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                  <span className="ms" style={{ fontSize: 22, color: '#22c55e' }}>check_circle</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>Melding sendt!</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Vi svarer på {userEmail} innen 24 timer.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Din e-post</label>
                    <input value={userEmail} disabled style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', fontSize: 14, color: 'rgba(255,255,255,0.35)', background: '#1a1a1a', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Melding</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                      placeholder="Beskriv problemet ditt eller still et spørsmål..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', fontSize: 14, color: '#f0f0f0', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', background: '#242424' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#ff6b00')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
                  </div>
                  <button type="submit" style={{ padding: '12px 24px', background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <span className="ms" style={{ fontSize: 18 }}>send</span>
                    Send melding
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Hurtiglenker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: 'settings', label: 'Innstillinger', desc: 'Flyplasser og varsler', href: '/innstillinger' },
              { icon: 'credit_card', label: 'Abonnement', desc: 'Administrer betaling', href: '/innstillinger' },
            ].map(({ icon, label, desc, href }) => (
              <a key={label} href={href} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                <div style={{ width: 40, height: 40, background: 'rgba(255,107,0,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="ms" style={{ fontSize: 20, color: '#ff6b00' }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
