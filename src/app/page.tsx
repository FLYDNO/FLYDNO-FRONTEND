'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const DESTS = [
  {f:'🇪🇸',n:'Barcelona'},{f:'🇬🇧',n:'London'},{f:'🇹🇭',n:'Bangkok'},
  {f:'🇺🇸',n:'New York'},{f:'🇯🇵',n:'Tokyo'},{f:'🇮🇹',n:'Roma'},
  {f:'🇦🇪',n:'Dubai'},{f:'🇫🇷',n:'Paris'},{f:'🇩🇪',n:'Berlin'},
  {f:'🇬🇷',n:'Aten'},{f:'🇵🇹',n:'Lisboa'},{f:'🇮🇩',n:'Bali'},
  {f:'🇸🇬',n:'Singapore'},{f:'🇲🇦',n:'Marrakech'},{f:'🇹🇷',n:'Istanbul'},
  {f:'🇨🇦',n:'Toronto'},{f:'🇦🇺',n:'Sydney'},{f:'🇮🇸',n:'Reykjavik'},
]

const deals = [
  { from: 'Oslo', iata: 'OSL', to: 'Bangkok 🇹🇭', price: 2489, discount: 47 },
  { from: 'Bergen', iata: 'BGO', to: 'London 🇬🇧', price: 489, discount: 52 },
  { from: 'Oslo', iata: 'OSL', to: 'New York 🇺🇸', price: 2890, discount: 41 },
  { from: 'Trondheim', iata: 'TRD', to: 'Barcelona 🇪🇸', price: 699, discount: 38 },
  { from: 'Stavanger', iata: 'SVG', to: 'Amsterdam 🇳🇱', price: 549, discount: 44 },
  { from: 'Tromsø', iata: 'TOS', to: 'Reykjavik 🇮🇸', price: 890, discount: 35 },
]

const faqs = [
  { q: 'Hvilke flyplasser overvåker dere?', a: 'Vi overvåker per dags dato Oslo (OSL), Bergen (BGO), Stavanger (SVG), Trondheim (TRD), Tromsø (TOS) og Sandefjord/Torp (TRF).' },
  { q: 'Hvor mye kan jeg forvente å spare?', a: 'Det varierer per rute og sesong. Vi varsler kun når prisen er vesentlig lavere enn normalt. Mange brukere sparer tusenvis av kroner per reise.' },
  { q: 'Må jeg bestille gjennom dere?', a: 'Nei — du booker direkte hos flyselskapet via Google Flights. Vi er kun et varslingsverktøy, ikke en bestillingstjeneste.' },
  { q: 'Kan jeg si opp når som helst?', a: 'Ja, du kan si opp abonnementet til enhver tid via dine innstillinger. Ingen spørsmål stilt, ingen skjulte gebyrer.' },
]

export default function HomePage() {
  const [count, setCount] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    let n = 0
    const target = 847
    const step = target / 50
    const t = setInterval(() => {
      n = Math.min(n + step, target)
      setCount(Math.floor(n))
      if (n >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #050505; color: #fff; -webkit-font-smoothing: antialiased; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        a { color: inherit; text-decoration: none; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { display: flex; animation: ticker 30s linear infinite; width: max-content; }
        .ticker-track:hover { animation-play-state: paused; }
        .deal-card:hover { border-color: rgba(255,107,0,0.3) !important; transform: translateY(-5px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.45) !important; }
        .how-card:hover { border-color: rgba(255,255,255,0.14) !important; transform: translateY(-4px) !important; }
        .faq-ans { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-ans.open { max-height: 200px; }
      `}</style>

      <div style={{ background: '#050505', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>

        {/* Navbar */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800 }}>
              <div style={{ width: '28px', height: '28px', background: '#ff6b00', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="ms" style={{ fontSize: '14px', color: '#fff' }}>flight_takeoff</span>
              </div>
              FlyDeals
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px' }}>
              <a href="#hvordan" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Hvordan det fungerer</a>
              <a href="#priser" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Priser</a>
              <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Logg inn</Link>
              <Link href="/login" style={{ padding: '8px 18px', background: '#ff6b00', color: '#fff', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}>
                Prøv gratis
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '120px 0 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,107,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '100px', fontSize: '12px', fontWeight: 600, color: '#22c55e', marginBottom: '24px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  Overvåker flypriser 24/7
                </div>
                <h1 style={{ fontSize: '58px', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-2.5px', marginBottom: '20px' }}>
                  Fly billigere.<br /><span style={{ color: '#ff6b00' }}>Reis smartere.</span>
                </h1>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' }}>
                  FlyDeals overvåker flypriser fra norske flyplasser kontinuerlig og varsler deg øyeblikkelig når en god deal dukker opp.
                </p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '13px 26px', background: '#ff6b00', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: 700 }}>
                    <span className="ms" style={{ fontSize: '18px' }}>rocket_launch</span>
                    Start gratis i 7 dager
                  </Link>
                  <a href="#hvordan" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '13px 22px', background: 'transparent', color: 'rgba(255,255,255,0.8)', borderRadius: '100px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)' }}>
                    Se hvordan det fungerer
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '18px', marginTop: '22px', flexWrap: 'wrap' }}>
                  {['Ingen binding', 'Avbryt når som helst', '149 kr/mnd etter trial'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                      <span className="ms" style={{ fontSize: '14px', color: '#ff6b00' }}>check_circle</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero deal card */}
              <div>
                <div style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '5px', height: '5px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                    Live deals akkurat nå
                  </div>
                  {[
                    { from: 'Oslo', to: 'Bangkok 🇹🇭', price: '2 489 kr', discount: '-47%' },
                    { from: 'Bergen', to: 'London 🇬🇧', price: '489 kr', discount: '-52%' },
                    { from: 'Oslo', to: 'New York 🇺🇸', price: '2 890 kr', discount: '-41%' },
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>fra {d.from}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.3px' }}>{d.to}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: 900, color: '#ff6b00', letterSpacing: '-0.5px' }}>{d.price}</div>
                        <div style={{ display: 'inline-block', padding: '2px 7px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#22c55e', marginTop: '3px' }}>{d.discount}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ms" style={{ fontSize: '16px', color: '#ff6b00' }}>notifications_active</span>
                    Du ville fått varsel i det prisen falt
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', overflow: 'hidden' }}>
          <div className="ticker-track">
            {[...DESTS, ...DESTS].map((d, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 20px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '15px' }}>{d.f}</span>{d.n}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <section style={{ padding: '60px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
              {[
                { num: `${count.toLocaleString('no')}+`, label: 'Deals funnet' },
                { num: '6', label: 'Norske flyplasser' },
                { num: '237+', label: 'Destinasjoner' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '44px', fontWeight: 900, letterSpacing: '-2px' }}>
                    <span style={{ color: i === 0 ? '#ff6b00' : '#fff' }}>{s.num}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live deals strip */}
        <section style={{ padding: '70px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 700, color: '#ff6b00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <span style={{ width: '5px', height: '5px', background: '#ff6b00', borderRadius: '50%' }} />
                  Live deals
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px' }}>Aktuelle tilbud akkurat nå</h2>
              </div>
              <Link href="/deals" style={{ padding: '10px 20px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', color: '#ff6b00', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}>
                Se alle deals →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '40px' }}>
              {deals.map((d, i) => (
                <div key={i} className="deal-card" style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', transition: 'all 0.25s', cursor: 'pointer' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {d.from} <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{d.iata}</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '12px' }}>{d.to}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#ff6b00', letterSpacing: '-1px' }}>
                      {d.price.toLocaleString('no')} <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>kr</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '4px 10px' }}>-{d.discount}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="hvordan" style={{ padding: '90px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 700, color: '#ff6b00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                <span style={{ width: '5px', height: '5px', background: '#ff6b00', borderRadius: '50%' }} />
                Hvordan det fungerer
              </div>
              <h2 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px' }}>Enkelt som 1-2-3</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { step: 'Steg 01', icon: 'tune', title: 'Sett opp ditt varsel', desc: 'Velg avreiseby, ønsket destinasjon og makspris du vil betale. Ta det tar bare ett minutt.' },
                { step: 'Steg 02', icon: 'search', title: 'Vi overvåker', desc: 'FlyDeals scanner priser fra alle store flyselskaper kontinuerlig — 24 timer i døgnet, 7 dager i uken.' },
                { step: 'Steg 03', icon: 'notifications_active', title: 'Få varsel øyeblikkelig', desc: 'Når prisen faller under din grense sender vi deg et øyeblikkelig varsel på e-post. Book direkte hos flyselskapet.' },
              ].map((h, i) => (
                <div key={i} className="how-card" style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px', transition: 'all 0.25s' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#ff6b00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>{h.step}</div>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00', marginBottom: '16px' }}>
                    <span className="ms" style={{ fontSize: '20px' }}>{h.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.4px', marginBottom: '10px' }}>{h.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="priser" style={{ padding: '90px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 700, color: '#ff6b00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              <span style={{ width: '5px', height: '5px', background: '#ff6b00', borderRadius: '50%' }} />
              Priser
            </div>
            <h2 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '12px' }}>Én enkel plan</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '48px' }}>Alt inkludert. Ingen skjulte kostnader.</p>
            <div style={{ maxWidth: '420px', margin: '0 auto', background: '#0e0e0e', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #ff6b00, transparent)' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '24px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }} />
                7 dager gratis
              </div>
              <div style={{ fontSize: '52px', fontWeight: 900, letterSpacing: '-2px', color: '#ff6b00', lineHeight: 1 }}>149 kr</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', marginBottom: '32px' }}>per måned etter prøveperiode</div>
              {['Varsler fra 6 norske flyplasser', '237+ destinasjoner overvåket', 'Øyeblikkelige e-postvarsler', 'Ubegrenset antall varsler', 'Avbryt når som helst'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: '14px', textAlign: 'left' }}>
                  <span className="ms" style={{ fontSize: '18px', color: '#ff6b00' }}>check_circle</span>
                  {f}
                </div>
              ))}
              <Link href="/login" style={{ display: 'block', marginTop: '32px', padding: '14px', background: '#ff6b00', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textAlign: 'center' }}>
                Start gratis prøveperiode
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="om" style={{ padding: '90px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 700, color: '#ff6b00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                <span style={{ width: '5px', height: '5px', background: '#ff6b00', borderRadius: '50%' }} />
                Spørsmål & svar
              </div>
              <h2 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px' }}>Ofte stilte spørsmål</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif" }}>
                    {faq.q}
                    <span className="ms" style={{ fontSize: '20px', color: '#ff6b00', flexShrink: 0, marginLeft: '16px' }}>{openFaq === i ? 'remove' : 'add'}</span>
                  </button>
                  <div className={`faq-ans${openFaq === i ? ' open' : ''}`}>
                    <p style={{ padding: '0 24px 20px', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '60px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>
                  <div style={{ width: '28px', height: '28px', background: '#ff6b00', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="ms" style={{ fontSize: '14px', color: '#fff' }}>flight_takeoff</span>
                  </div>
                  FlyDeals
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '260px' }}>
                  Automatisk prisovervåking av flyreiser fra de største nordiske flyplassene for å finne drømmereisen billigere.
                </p>
              </div>
              {[
                { title: 'Produkt', links: [{ label: 'Live deals', href: '/deals' }, { label: 'Dine varsler', href: '/varsler' }, { label: 'FAQ', href: '#om' }] },
                { title: 'Selskap', links: [{ label: 'Personvern', href: '#' }, { label: 'Vilkår', href: '#' }, { label: 'Hjelp', href: '/brukerstotte' }] },
                { title: 'Følg oss', links: [{ label: 'Twitter / X', href: '#' }, { label: 'Instagram', href: '#' }] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>{col.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {col.links.map((l, j) => (
                      <Link key={j} href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{l.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              © 2026 FlyDeals. Alle rettigheter reservert.
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
