'use client'

import Sidebar from '@/components/Sidebar'

const history = [
  { to: 'New York 🇺🇸', toCode: 'JFK', from: 'Oslo', fromCode: 'OSL', price: 4290, discount: 41, date: '15. Jan 2026' },
  { to: 'London 🇬🇧', toCode: 'LHR', from: 'Bergen', fromCode: 'BGO', price: 890, discount: 35, date: '10. Jan 2026' },
  { to: 'Tokyo 🇯🇵', toCode: 'HND', from: 'Oslo', fromCode: 'OSL', price: 5920, discount: 47, date: '07. Jan 2026' },
  { to: 'Alicante 🇪🇸', toCode: 'ALC', from: 'Trondheim', fromCode: 'TRD', price: 1150, discount: 31, date: '03. Jan 2026' },
  { to: 'Bangkok 🇹🇭', toCode: 'BKK', from: 'Oslo', fromCode: 'OSL', price: 6340, discount: 44, date: '28. Des 2025' },
]

export default function HistorikkPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; background: #050505; margin: 0; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />

        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

            {/* Header */}
            <header style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Historikk</h2>
                  <p style={{ color: '#64748b', marginTop: '4px' }}>Alle deals vi har sendt deg — synkronisert i sanntid.</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111', border: '1px solid #1e1e1e', color: '#cbd5e1', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  <span className="ms" style={{ fontSize: '16px' }}>filter_list</span>Filtrer
                </button>
              </div>
            </header>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <span className="ms" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }}>search</span>
              <input type="text" placeholder="Søk i ruter, flyplasser eller byer..."
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '16px 16px 16px 48px', color: '#e2e8f0', outline: 'none', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '12px 16px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', fontSize: '13px', color: '#94a3b8' }}>
              <span className="ms" style={{ fontSize: '16px', color: '#ff6b00' }}>verified</span>
              Kun de beste tilbudene når deg — vi filtrerer ut støyen.
            </div>

            {/* List */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '16px', paddingLeft: '8px' }}>Mottatte varsler</h3>

              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>
                {history.map((item, i) => (
                  <div key={i} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < history.length - 1 ? '1px solid #1e1e1e' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,107,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00', flexShrink: 0 }}>
                        <span className="ms" style={{ fontSize: '20px' }}>flight_takeoff</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.01em' }}>{item.to}</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', background: '#1e1e1e', padding: '2px 8px', borderRadius: '9999px' }}>{item.toCode}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>fra {item.from} ({item.fromCode})</span>
                          <span style={{ color: '#374151' }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                            <span className="ms" style={{ fontSize: '13px' }}>calendar_month</span>{item.date}
                          </span>
                          <span style={{ color: '#374151' }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                            <span className="ms" style={{ fontSize: '13px' }}>mail</span>Sendt på e-post
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#ff6b00', margin: 0 }}>{item.price.toLocaleString('no')} kr</p>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', padding: '2px 8px', borderRadius: '9999px', display: 'inline-block', marginTop: '4px' }}>-{item.discount}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                  Vis flere<span className="ms" style={{ fontSize: '20px' }}>expand_more</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <section style={{ background: '#111', borderRadius: '16px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: 'none' }}>
                <div style={{ padding: '20px 24px', borderRight: '1px solid #1e1e1e' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', margin: 0 }}>Varsler mottatt</p>
                  <p style={{ fontSize: '24px', fontWeight: 900, margin: '6px 0 0' }}>5 deals</p>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', margin: 0 }}>Varslingsmetode</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, background: 'rgba(255,107,0,0.1)', color: '#ff6b00', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(255,107,0,0.2)', marginTop: '6px' }}>
                    <span className="ms" style={{ fontSize: '13px' }}>mail</span>E-post
                  </span>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </>
  )
}
