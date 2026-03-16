'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const deals = [
  { from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: '🇹🇭', price: 2489, orig: 4700, discount: 47, dates: 'Mar–Apr 2026', airline: 'Thai Airways', direct: true, origin: 'OSL' },
  { from: 'Bergen', fromCode: 'BGO', to: 'London', toCode: 'LHR', flag: '🇬🇧', price: 489, orig: 1020, discount: 52, dates: 'Mars 2026', airline: 'Norwegian', direct: true, origin: 'BGO' },
  { from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: '🇺🇸', price: 2890, orig: 4900, discount: 41, dates: 'Apr–Mai 2026', airline: 'SAS', direct: true, origin: 'OSL' },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Barcelona', toCode: 'BCN', flag: '🇪🇸', price: 699, orig: 1130, discount: 38, dates: 'April 2026', airline: 'Norwegian', direct: false, origin: 'TRD' },
  { from: 'Stavanger', fromCode: 'SVG', to: 'Amsterdam', toCode: 'AMS', flag: '🇳🇱', price: 549, orig: 980, discount: 44, dates: 'Mars 2026', airline: 'KLM', direct: false, origin: 'SVG' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Tokyo', toCode: 'HND', flag: '🇯🇵', price: 3490, orig: 5720, discount: 39, dates: 'Mai–Jun 2026', airline: 'ANA', direct: false, origin: 'OSL' },
  { from: 'Tromsø', fromCode: 'TOS', to: 'Reykjavik', toCode: 'KEF', flag: '🇮🇸', price: 890, orig: 1370, discount: 35, dates: 'April 2026', airline: 'Icelandair', direct: true, origin: 'TOS' },
  { from: 'Torp', fromCode: 'TRF', to: 'Alicante', toCode: 'ALC', flag: '🇪🇸', price: 399, orig: 814, discount: 51, dates: 'Mar–Apr 2026', airline: 'Ryanair', direct: true, origin: 'TRF' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: '🇦🇪', price: 1990, orig: 3490, discount: 43, dates: 'April 2026', airline: 'Emirates', direct: true, origin: 'OSL' },
  { from: 'Bergen', fromCode: 'BGO', to: 'Roma', toCode: 'FCO', flag: '🇮🇹', price: 599, orig: 1110, discount: 46, dates: 'Mars 2026', airline: 'SAS', direct: false, origin: 'BGO' },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Paris', toCode: 'CDG', flag: '🇫🇷', price: 649, orig: 1082, discount: 40, dates: 'April 2026', airline: 'Air France', direct: false, origin: 'TRD' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Bali', toCode: 'DPS', flag: '🇮🇩', price: 4290, orig: 6703, discount: 36, dates: 'Mai 2026', airline: 'Qatar Airways', direct: false, origin: 'OSL' },
]

const airports = [
  { code: 'alle', label: 'Alle flyplasser' },
  { code: 'OSL', label: '🇳🇴 Oslo (OSL)' },
  { code: 'BGO', label: '🇳🇴 Bergen (BGO)' },
  { code: 'TRD', label: '🇳🇴 Trondheim (TRD)' },
  { code: 'SVG', label: '🇳🇴 Stavanger (SVG)' },
  { code: 'TOS', label: '🇳🇴 Tromsø (TOS)' },
  { code: 'TRF', label: '🇳🇴 Torp (TRF)' },
]

const navItems = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals', fill: true },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter' },
  { href: '/historikk', icon: 'history', label: 'Historikk' },
]

const navBottom = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte' },
]

export default function DealsPage() {
  const [filter, setFilter] = useState('alle')
  const pathname = usePathname()

  const filtered = filter === 'alle' ? deals : deals.filter(d => d.origin === filter)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; background: #050505; margin: 0; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
        .deal-card:hover { border-color: rgba(255,107,0,0.3) !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Sidebar */}
        <aside style={{ width: '256px', flexShrink: 0, borderRight: '1px solid #1e1e1e', background: '#050505', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#ff6b00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 4px 15px rgba(255,107,0,0.2)' }}>
              <span className="ms" style={{ fontSize: '18px' }}>flight_takeoff</span>
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.2 }}>FlyDeals</h1>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 500 }}>Varsler deg om flydeals</p>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '0 12px', marginTop: '4px' }}>
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0',
                  borderLeft: active ? '3px solid #ff6b00' : '3px solid transparent',
                  background: active ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: active ? '#ff6b00' : '#94a3b8',
                  textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
                }}>
                  <span className={`ms${item.fill && active ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: active ? 600 : 500 }}>{item.label}</span>
                </Link>
              )
            })}

            <div style={{ paddingTop: '12px', marginTop: '8px', borderTop: '1px solid #1e1e1e' }}>
              {navBottom.map(item => (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0',
                  borderLeft: '3px solid transparent', color: '#94a3b8', textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
                }}>
                  <span className="ms" style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div style={{ padding: '12px', marginTop: 'auto', borderTop: '1px solid #1e1e1e' }}>
            <div style={{ background: '#111', borderRadius: '12px', padding: '12px', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: '18px', color: '#94a3b8' }}>person</span>
              </div>
              <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Bruker</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>innlogget</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          <div style={{ height: '56px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>847 deals funnet hittil</span>
            </div>
            <button style={{ position: 'relative', padding: '8px', color: '#64748b', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <span className="ms" style={{ fontSize: '20px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#ff6b00', borderRadius: '50%' }}></span>
            </button>
          </div>

          <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Live Deals</h2>
              <p style={{ color: '#64748b', marginTop: '4px' }}>Oppdateres automatisk. Prisene kan endre seg raskt — book når du ser en god deal.</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {airports.map(a => (
                <button key={a.code} onClick={() => setFilter(a.code)}
                  style={{
                    padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: filter === a.code ? 600 : 500,
                    background: filter === a.code ? '#ff6b00' : '#111',
                    color: filter === a.code ? 'white' : '#94a3b8',
                    border: filter === a.code ? 'none' : '1px solid #1e1e1e',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* Deals grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {filtered.map((d, i) => (
                <div key={i} className="deal-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '14px', transition: 'all 0.2s', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 900 }}>{d.to} {d.flag}</span>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{d.from} → {d.toCode}</p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>-{d.discount}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 8px', marginBottom: '8px' }}>
                    <span className="ms" style={{ fontSize: '13px', color: '#ff6b00' }}>calendar_month</span>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{d.dates}</span>
                  </div>
                  <p style={{ fontSize: '21px', fontWeight: 900, color: '#ff6b00', lineHeight: 1, margin: 0 }}>{d.price.toLocaleString('no')} kr</p>
                  <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px', textDecoration: 'line-through' }}>{d.orig.toLocaleString('no')} kr</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1e1e1e', fontSize: '11px', color: '#64748b' }}>
                    <span className="ms" style={{ fontSize: '13px' }}>airlines</span>
                    <span>{d.airline} · {d.direct ? 'Direktefly' : '1 stopp'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
