'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const alerts = [
  { id: 1, to: 'New York 🇺🇸', toCode: 'JFK', from: 'Oslo', fromCode: 'OSL', maxPrice: 5000, month: 'Okt', discount: 30, active: true },
  { id: 2, to: 'London 🇬🇧', toCode: 'LHR', from: 'Bergen', fromCode: 'BGO', maxPrice: 1500, month: 'Nov', discount: 20, active: true },
  { id: 3, to: 'Dubai 🇦🇪', toCode: 'DXB', from: 'Stavanger', fromCode: 'SVG', maxPrice: 4800, month: 'Des', discount: 25, active: false },
]

const recentHits = [
  { to: 'New York 🇺🇸', from: 'Oslo (OSL → JFK)', price: 4290, dates: '12. Okt - 19. Okt', available: true },
  { to: 'London 🇬🇧', from: 'Bergen (BGO → LHR)', price: 980, dates: '05. Nov - 08. Nov', available: false },
]

export default function VarslerPage() {
  const [activeAlerts, setActiveAlerts] = useState(alerts.map(a => ({ ...a })))

  const toggleAlert = (id: number) => {
    setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const activeCount = activeAlerts.filter(a => a.active).length

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
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Dine varsler</h2>
                <p style={{ color: '#94a3b8', marginTop: '4px' }}>Administrer dine aktive prisvarsler for flyreiser over hele verden.</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ff6b00', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,107,0,0.2)' }}>
                <span className="ms" style={{ fontSize: '20px' }}>add</span>
                Legg til nytt varsel
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '16px', borderRadius: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', margin: 0 }}>Aktive varsler</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', margin: '4px 0 0' }}>{activeCount}</p>
              </div>
              <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '16px', borderRadius: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', margin: 0 }}>Treff siste 24t</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: '#22c55e', margin: '4px 0 0' }}>12</p>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #1e1e1e', overflow: 'hidden', marginBottom: '48px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid #1e1e1e' }}>
                      {['Rute', 'Makspris', 'Reisemåned', 'Rabattgrense', 'Status', 'Handlinger'].map((h, i) => (
                        <th key={h} style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', textAlign: i >= 2 ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeAlerts.map(alert => (
                      <tr key={alert.id} style={{ borderBottom: '1px solid #1e1e1e', opacity: alert.active ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: alert.active ? '#ff6b00' : '#64748b' }}>
                              <span className="ms" style={{ fontSize: '20px' }}>flight_takeoff</span>
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, margin: 0 }}>{alert.to} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>({alert.toCode})</span></p>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>fra {alert.from} ({alert.fromCode})</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', fontWeight: 500 }}>{alert.maxPrice.toLocaleString('no')} kr</td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="ms" style={{ fontSize: '13px' }}>calendar_month</span>{alert.month}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>{alert.discount}% rabatt</span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" checked={alert.active} onChange={() => toggleAlert(alert.id)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                            <div style={{
                              width: '44px', height: '24px', borderRadius: '9999px', background: alert.active ? '#ff6b00' : '#1e1e1e',
                              position: 'relative', transition: 'background 0.2s', cursor: 'pointer'
                            }} onClick={() => toggleAlert(alert.id)}>
                              <div style={{
                                position: 'absolute', top: '2px', left: alert.active ? '22px' : '2px',
                                width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s'
                              }} />
                            </div>
                          </label>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button style={{ color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                            <span className="ms" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <button style={{ color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                            <span className="ms" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent hits */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Nylige treff</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {recentHits.map((hit, i) => (
                  <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ height: '80px', background: '#1e1e1e', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="ms" style={{ fontSize: '32px', color: '#ff6b00' }}>flight_takeoff</span>
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: hit.available ? '#22c55e' : '#374151', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {hit.available ? 'Tilgjengelig nå' : 'Utgått'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', opacity: hit.available ? 1 : 0.75 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div>
                          <h4 style={{ fontWeight: 700, margin: 0 }}>{hit.to}</h4>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{hit.from}</p>
                        </div>
                        <p style={{ fontWeight: 900, color: hit.available ? '#ff6b00' : '#94a3b8', margin: 0 }}>{hit.price.toLocaleString('no')} kr</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8', margin: '8px 0 16px' }}>
                        <span className="ms" style={{ fontSize: '14px' }}>calendar_month</span>
                        {hit.dates}
                      </div>
                      <button style={{ width: '100%', padding: '8px', background: hit.available ? '#ff6b00' : '#1e1e1e', color: hit.available ? 'white' : '#64748b', fontWeight: 700, fontSize: '14px', borderRadius: '8px', border: 'none', cursor: hit.available ? 'pointer' : 'not-allowed' }}>
                        {hit.available ? 'Se tilbud' : 'Ikke tilgjengelig'}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ border: '2px dashed #1e1e1e', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'pointer', minHeight: '200px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px dashed #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', marginBottom: '12px' }}>
                    <span className="ms" style={{ fontSize: '24px' }}>add</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontWeight: 500, margin: 0 }}>Opprett nytt søk</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
