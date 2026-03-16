'use client'
import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const initialRows = [
  { id: 'row-1', dest: 'Bangkok 🇹🇭', iata: 'BKK', from: 'Oslo (OSL)', maxPrice: '4 200 kr', month: 'Mars', discount: '30% rabatt', active: true },
  { id: 'row-2', dest: 'London 🇬🇧', iata: 'LHR', from: 'Bergen (BGO)', maxPrice: '1 500 kr', month: 'Apr', discount: '20% rabatt', active: true },
  { id: 'row-3', dest: 'Dubai 🇦🇪', iata: 'DXB', from: 'Stavanger (SVG)', maxPrice: '4 800 kr', month: 'Des', discount: '25% rabatt', active: false },
]

const hitCards = [
  { dest: 'New York 🇺🇸', from: 'fra Oslo (OSL → JFK)', price: '4 290 kr', dates: '12. Okt - 19. Okt', available: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMyQ7Ej_HvzjUGYDimJD_eeZgup8ctf5DG9qJl9dAShyN0auUjybhzlxz3-Sg3-LC-Vp-baSRT4egzQ0yFSoUwmQOf1HXbb_VQwbAnrAJQU6gbCHQR2rXljso05jywLtYhYWnMYbaLbNb-fgYQiDj4j1osnBCRB5aFiAPnQGVHax-qWgVR_QgvKfGE6CKPFbwR3W-WuFl1feLOIZ2ZcPPzdPiXophgnKjQnO2fAmmRufjW2I3a4Q9aNdA8nCrqzbumaKxaOrFYqHOC' },
  { dest: 'London 🇬🇧', from: 'fra Bergen (BGO → LHR)', price: '980 kr', dates: '05. Nov - 08. Nov', available: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAumTOdngZO2sKCQWqh5hWkF_O5cqp17fSZ6JtS2zcc9wVotKAMgPn0flGE4gcCBgAXFjRIMiIJctoNM0DDJK6GsQMmyGvvHcrc92_747biMzkJn13JNfQ8p4egYZjiRqS9W7RhiPJ-G3npza1LX4eCs3JgnAyyXo3q_VReXGeH09o-HQBUsTZTA4dRId_vxjCfTBVL_ELPcGtY_DXjWRQyyaTmGzF_1kMZV4Cvalofz8UcPBxrT1MP842wvbsnGAWfmw7GKt4-liYX' },
]

export default function VarslerPage() {
  const [rows, setRows] = useState(initialRows)
  const activeCount = rows.filter(r => r.active).length

  function toggleRow(id: string, checked: boolean) {
    setRows(rows.map(r => r.id === id ? { ...r, active: checked } : r))
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Public Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
      `}</style>
      <div className="flex h-screen overflow-hidden" style={{ background: '#050505', color: '#f1f5f9', fontFamily: "'Public Sans', sans-serif" }}>
        <Sidebar active="varsler" />
        <main className="flex-1 overflow-y-auto" style={{ background: '#050505' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>Dine varsler</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Administrer dine aktive prisvarsler for flyreiser over hele verden.</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ec5b13', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                <span className="ms">add</span>Legg til nytt varsel
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Aktive varsler</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>{activeCount}</p>
              </div>
              <div style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Treff siste 24t</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: '#22c55e' }}>12</p>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: '#121212', border: '1px solid #262626', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid #262626' }}>
                      {['Rute', 'Makspris', 'Reisemåned', 'Rabattgrense', 'Status', 'Handlinger'].map((h, i) => (
                        <th key={i} style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, textAlign: i >= 2 ? 'center' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #262626', opacity: row.active ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: row.active ? '#ec5b13' : 'rgba(255,255,255,0.3)' }}>
                              <span className="ms" style={{ fontSize: '20px' }}>flight_takeoff</span>
                            </div>
                            <div>
                              <p style={{ fontWeight: 700 }}>{row.dest} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400, fontSize: '11px' }}>({row.iata})</span></p>
                              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>fra {row.from}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}><p style={{ fontWeight: 600 }}>{row.maxPrice}</p></td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                            <span className="ms" style={{ fontSize: '13px' }}>calendar_month</span>{row.month}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>{row.discount}</span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                          <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" checked={row.active} onChange={e => toggleRow(row.id, e.target.checked)} style={{ display: 'none' }} />
                            <div onClick={() => toggleRow(row.id, !row.active)} style={{ width: '44px', height: '24px', background: row.active ? '#ec5b13' : '#262626', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                              <div style={{ position: 'absolute', top: '2px', left: row.active ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
                            </div>
                          </label>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><span className="ms">edit</span></button>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><span className="ms">delete</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent hits */}
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Nylige treff</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {hitCards.map((c, i) => (
                  <div key={i} style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', overflow: 'hidden', opacity: c.available ? 1 : 0.75 }}>
                    <div style={{ height: '128px', position: 'relative' }}>
                      <img src={c.img} alt={c.dest} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121212, transparent)' }} />
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: c.available ? '#22c55e' : '#374151', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {c.available ? 'Tilgjengelig nå' : 'Utgått'}
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div>
                          <h4 style={{ fontWeight: 700 }}>{c.dest}</h4>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{c.from}</p>
                        </div>
                        <p style={{ fontWeight: 900, color: c.available ? '#ec5b13' : 'rgba(255,255,255,0.4)' }}>{c.price}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '8px 0 16px' }}>
                        <span className="ms" style={{ fontSize: '14px' }}>calendar_month</span>{c.dates}
                      </div>
                      <button style={{ width: '100%', padding: '8px', background: c.available ? '#262626' : '#1a1a1a', color: c.available ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: c.available ? 'pointer' : 'not-allowed', fontFamily: "'Public Sans', sans-serif" }}>
                        {c.available ? 'Se tilbud' : 'Ikke tilgjengelig'}
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add new */}
                <div style={{ border: '2px dashed #262626', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'pointer', minHeight: '200px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px dashed #262626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                    <span className="ms">add</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Opprett nytt søk</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
