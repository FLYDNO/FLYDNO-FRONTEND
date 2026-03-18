'use client';

import { useState } from 'react';
import Link from 'next/link';

const allDeals = [
  { from: 'Oslo', iata: 'OSL', to: 'Bangkok 🇹🇭', toCode: 'BKK', price: 2489, orig: 4700, discount: 47, dates: 'Mar–Apr 2026', airline: 'Thai Airways', direct: true },
  { from: 'Bergen', iata: 'BGO', to: 'London 🇬🇧', toCode: 'LHR', price: 489, orig: 1020, discount: 52, dates: 'Mars 2026', airline: 'Norwegian', direct: true },
  { from: 'Oslo', iata: 'OSL', to: 'New York 🇺🇸', toCode: 'JFK', price: 2890, orig: 4900, discount: 41, dates: 'Apr–Mai 2026', airline: 'SAS', direct: true },
  { from: 'Trondheim', iata: 'TRD', to: 'Barcelona 🇪🇸', toCode: 'BCN', price: 699, orig: 1130, discount: 38, dates: 'April 2026', airline: 'Norwegian', direct: false },
  { from: 'Stavanger', iata: 'SVG', to: 'Amsterdam 🇳🇱', toCode: 'AMS', price: 549, orig: 980, discount: 44, dates: 'Mars 2026', airline: 'KLM', direct: false },
  { from: 'Oslo', iata: 'OSL', to: 'Tokyo 🇯🇵', toCode: 'HND', price: 3490, orig: 5720, discount: 39, dates: 'Mai–Jun 2026', airline: 'ANA', direct: false },
  { from: 'Tromsø', iata: 'TOS', to: 'Reykjavik 🇮🇸', toCode: 'KEF', price: 890, orig: 1370, discount: 35, dates: 'April 2026', airline: 'Icelandair', direct: true },
  { from: 'Torp', iata: 'TRF', to: 'Alicante 🇪🇸', toCode: 'ALC', price: 399, orig: 814, discount: 51, dates: 'Mar–Apr 2026', airline: 'Ryanair', direct: true },
  { from: 'Oslo', iata: 'OSL', to: 'Dubai 🇦🇪', toCode: 'DXB', price: 1990, orig: 3490, discount: 43, dates: 'April 2026', airline: 'Emirates', direct: true },
  { from: 'Bergen', iata: 'BGO', to: 'Roma 🇮🇹', toCode: 'FCO', price: 599, orig: 1110, discount: 46, dates: 'Mars 2026', airline: 'SAS', direct: false },
  { from: 'Trondheim', iata: 'TRD', to: 'Paris 🇫🇷', toCode: 'CDG', price: 649, orig: 1082, discount: 40, dates: 'April 2026', airline: 'Air France', direct: false },
  { from: 'Oslo', iata: 'OSL', to: 'Bali 🇮🇩', toCode: 'DPS', price: 4290, orig: 6703, discount: 36, dates: 'Mai 2026', airline: 'Qatar Airways', direct: false },
];

const airports = ['Alle flyplasser', 'Oslo (OSL)', 'Bergen (BGO)', 'Trondheim (TRD)', 'Stavanger (SVG)', 'Tromsø (TOS)', 'Torp (TRF)'];

const navItems = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals', key: 'deals' },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler', key: 'varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter', key: 'oppdag' },
  { href: '/historikk', icon: 'history', label: 'Historikk', key: 'historikk' },
];

const bottomItems = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger', key: 'innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte', key: 'brukerstotte' },
];

export default function DealsPage() {
  const [filter, setFilter] = useState('Alle flyplasser');

  const filtered = filter === 'Alle flyplasser'
    ? allDeals
    : allDeals.filter(d => filter.includes(d.iata));

  const active = 'deals';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link { border-left: 3px solid transparent; transition: all 0.2s; }
        .nav-link:hover { background: rgba(255,107,0,0.05); color: #ff6b00; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00 !important; color: #ff6b00; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
        .deal-card:hover { border-color: rgba(255,107,0,0.3) !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Sidebar */}
        <aside style={{ width: '256px', flexShrink: 0, borderRight: '1px solid #1e1e1e', background: '#050505', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
          {/* Logo */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#ff6b00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,0,0.2)' }}>
              <span className="ms" style={{ fontSize: '18px' }}>flight_takeoff</span>
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>FlyDeals</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Varsler deg om flydeals</p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={`nav-link${active === item.key ? ' nav-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
                <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
              </Link>
            ))}
            <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '12px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {bottomItems.map((item) => (
                <Link key={item.key} href={item.href} className={`nav-link${active === item.key ? ' nav-active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
                  <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User */}
          <div style={{ padding: '12px', borderTop: '1px solid #1e1e1e' }}>
            <div style={{ background: '#111', borderRadius: '12px', padding: '12px', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)' }}>person</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Marius Jensen</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>marius@flydeals.no</p>
              </div>
              <Link href="/innstillinger" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: '16px' }}>settings</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          {/* Topbar */}
          <div style={{ height: '56px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>847 deals funnet hittil</span>
            </div>
            <button style={{ position: 'relative', padding: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span className="ms" style={{ fontSize: '20px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#ff6b00', borderRadius: '50%' }} />
            </button>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>Live Deals</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '13px' }}>Oppdateres automatisk. Prisene kan endre seg raskt — book når du ser en god deal.</p>
            </div>

            {/* Airport filter buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {airports.map((a) => (
                <button key={a} onClick={() => setFilter(a)}
                  style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: filter === a ? 700 : 500, background: filter === a ? '#ff6b00' : '#111', border: filter === a ? 'none' : '1px solid #1e1e1e', color: filter === a ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
                  {a}
                </button>
              ))}
            </div>

            {/* Deals grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {filtered.map((d, i) => (
                <div key={i} className="deal-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '14px', transition: 'all 0.2s', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 900 }}>{d.to}</span>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{d.from} → {d.toCode}</p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', flexShrink: 0 }}>-{d.discount}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '6px 8px', marginBottom: '8px' }}>
                    <span className="ms" style={{ fontSize: '13px', color: '#ff6b00' }}>calendar_month</span>
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>{d.dates}</span>
                  </div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#ff6b00', lineHeight: 1 }}>{d.price.toLocaleString('no')} kr</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px', textDecoration: 'line-through' }}>{d.orig.toLocaleString('no')} kr</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1e1e1e', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                    <span className="ms" style={{ fontSize: '13px' }}>airlines</span>
                    {d.airline} · {d.direct ? 'Direktefly' : '1 stopp'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
