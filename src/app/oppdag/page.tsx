'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const destCards = [
  { city: 'Barcelona 🇪🇸', from: 'Fra Trondheim • Direktefly', price: '699 kr', discount: '-38%', top: true, duration: '3t 10m', dates: 'Apr 2026', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  { city: 'London 🇬🇧', from: 'Fra Bergen • Direktefly', price: '489 kr', discount: '-35%', top: false, duration: '2t 5m', dates: 'Mars 2026', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { city: 'Bangkok 🇹🇭', from: 'Fra Oslo • Thai Airways', price: '2 489 kr', discount: '-47%', top: false, duration: '11t 20m', dates: 'Mar–Apr 2026', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { city: 'Dubai 🇦🇪', from: 'Fra Oslo • Emirates', price: '1 990 kr', discount: '-33%', top: false, duration: '6t 55m', dates: 'April 2026', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { city: 'New York 🇺🇸', from: 'Fra Oslo • SAS', price: '2 890 kr', discount: '-41%', top: false, duration: '9t 15m', dates: 'Apr–Mai 2026', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { city: 'Tokyo 🇯🇵', from: 'Fra Oslo • ANA', price: '3 490 kr', discount: '-44%', top: false, duration: '14t 30m', dates: 'Mai–Jun 2026', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
]

const quickRoutes = [
  { flag: '🇪🇸', route: 'Oslo → Alicante', airline: 'Ryanair · Mars 2026', price: '549 kr' },
  { flag: '🇮🇸', route: 'Tromsø → Reykjavik', airline: 'Icelandair · April 2026', price: '890 kr' },
  { flag: '🇳🇱', route: 'Stavanger → Amsterdam', airline: 'KLM · Mars 2026', price: '549 kr' },
  { flag: '🇮🇹', route: 'Bergen → Roma', airline: 'SAS · Mars 2026', price: '599 kr' },
  { flag: '🇫🇷', route: 'Trondheim → Paris', airline: 'Air France · April 2026', price: '649 kr' },
]

const regions = ['Alle', '🌍 Europa', '🌏 Asia', '🌎 Amerika', '🌍 Afrika', '🏔 Norden']

export default function OppdagPage() {
  const [activeRegion, setActiveRegion] = useState('Alle')

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
        .dest-card:hover { border-color: rgba(255,107,0,0.3) !important; }
        .dest-card:hover .dest-img { transform: scale(1.05); }
      `}</style>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar active="oppdag" />
        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          {/* Topbar */}
          <div style={{ height: '56px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700 }}>Oppdag Ruter</h2>
            <button style={{ position: 'relative', padding: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span className="ms" style={{ fontSize: '20px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#ff6b00', borderRadius: '50%' }} />
            </button>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Header + search */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '4px' }}>Oppdag Ruter</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>Finn de beste destinasjonene fra norske flyplasser.</p>
              <div style={{ position: 'relative' }}>
                <span className="ms" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'rgba(255,255,255,0.3)' }}>search</span>
                <input style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '16px 16px 16px 48px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} placeholder="Søk etter by, land eller flyplass..." type="text" />
              </div>
            </div>

            {/* Region filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
              {regions.map((r) => (
                <button key={r} onClick={() => setActiveRegion(r)} style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: activeRegion === r ? 700 : 500, background: activeRegion === r ? '#ff6b00' : '#111', border: activeRegion === r ? 'none' : '1px solid #1e1e1e', color: activeRegion === r ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{r}</button>
              ))}
            </div>

            {/* Featured destinations */}
            <section style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Populære destinasjoner</h3>
                <a href="/deals" style={{ color: '#ff6b00', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Se alle deals →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {destCards.map((c, i) => (
                  <div key={i} className="dest-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                    <div style={{ height: '176px', overflow: 'hidden', position: 'relative' }}>
                      <img className="dest-img" src={c.img} alt={c.city} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111, transparent)' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        {c.top && <span style={{ background: '#ff6b00', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toppvalg</span>}
                        <span style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>{c.discount}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Fra</p>
                        <p style={{ fontSize: '15px', fontWeight: 900, color: '#ff6b00', lineHeight: 1 }}>{c.price}</p>
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{c.city}</h4>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="ms" style={{ fontSize: '13px' }}>flight</span>{c.from}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="ms" style={{ fontSize: '13px' }}>schedule</span>{c.duration}</span>
                        <span style={{ width: '4px', height: '4px', background: '#1e1e1e', borderRadius: '50%' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="ms" style={{ fontSize: '13px' }}>calendar_month</span>{c.dates}</span>
                      </div>
                      <button style={{ marginTop: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,107,0,0.3)', color: '#ff6b00', fontSize: '11px', fontWeight: 700, background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' }}>
                        <span className="ms" style={{ fontSize: '14px' }}>notifications</span>Opprett varsel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick routes */}
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Billige ruter akkurat nå</h3>
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>
                {quickRoutes.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < quickRoutes.length - 1 ? '1px solid #1e1e1e' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px' }}>{r.flag}</span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600 }}>{r.route}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{r.airline}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 900, color: '#ff6b00' }}>{r.price}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
