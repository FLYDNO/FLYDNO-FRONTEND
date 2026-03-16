'use client'
import Sidebar from '@/components/Sidebar'

const history = [
  { dest: 'New York 🇺🇸', iata: 'JFK', from: 'fra Oslo (OSL)', date: '15. Jan 2026', price: '4 290 kr', discount: '-41%' },
  { dest: 'London 🇬🇧', iata: 'LHR', from: 'fra Bergen (BGO)', date: '10. Jan 2026', price: '890 kr', discount: '-35%' },
  { dest: 'Tokyo 🇯🇵', iata: 'HND', from: 'fra Oslo (OSL)', date: '07. Jan 2026', price: '5 920 kr', discount: '-47%' },
  { dest: 'Alicante 🇪🇸', iata: 'ALC', from: 'fra Trondheim (TRD)', date: '03. Jan 2026', price: '1 150 kr', discount: '-31%' },
  { dest: 'Bangkok 🇹🇭', iata: 'BKK', from: 'fra Oslo (OSL)', date: '28. Des 2025', price: '6 340 kr', discount: '-44%' },
]

export default function HistorikkPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>
      <div className="flex min-h-screen" style={{ background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar active="historikk" />
        <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px' }}>Historikk</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Alle deals vi har sendt deg — synkronisert i sanntid.</p>
            </div>
            <button style={{ background: '#111', border: '1px solid #222', color: 'rgba(255,255,255,0.7)', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif" }}>
              <span className="ms" style={{ fontSize: '16px' }}>filter_list</span>Filtrer
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <span className="ms" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>search</span>
            <input style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px 16px 16px 48px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} placeholder="Søk i ruter, flyplasser eller byer..." type="text" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#111', border: '1px solid #222', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
            <span className="ms" style={{ color: '#ff6b00', fontSize: '16px' }}>verified</span>
            Kun de beste tilbudene når deg — vi filtrerer ut støyen.
          </div>

          {/* History list */}
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', padding: '0 8px', marginBottom: '16px' }}>Mottatte varsler</h3>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', overflow: 'hidden' }}>
              {history.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < history.length - 1 ? '1px solid #222' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,107,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00', flexShrink: 0 }}>
                      <span className="ms" style={{ fontSize: '20px' }}>flight_takeoff</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px' }}>{item.dest}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: '#222', padding: '2px 8px', borderRadius: '100px' }}>{item.iata}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.from}</span>
                        <span style={{ color: '#333' }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}><span className="ms" style={{ fontSize: '13px' }}>calendar_month</span>{item.date}</span>
                        <span style={{ color: '#333' }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}><span className="ms" style={{ fontSize: '13px' }}>mail</span>Sendt på e-post</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 900, color: '#ff6b00' }}>{item.price}</p>
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '11px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', padding: '2px 8px', borderRadius: '100px' }}>{item.discount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                Vis flere<span className="ms">expand_more</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #222' }}>
              <div style={{ padding: '20px 24px', borderRight: '1px solid #222' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Varsler mottatt</p>
                <p style={{ fontSize: '22px', fontWeight: 900 }}>5 deals</p>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Varslingsmetode</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,107,0,0.1)', color: '#ff6b00', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(255,107,0,0.2)' }}>
                  <span className="ms" style={{ fontSize: '13px' }}>mail</span>E-post
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
