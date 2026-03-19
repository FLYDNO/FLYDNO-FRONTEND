'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const historyItems = [
  { to: 'New York', fc: 'us', code: 'JFK', from: 'Oslo', fromCode: 'OSL', date: '15. jan 2026', price: '2 490', discount: 41, search: 'new york jfk oslo' },
  { to: 'London', fc: 'gb', code: 'LHR', from: 'Bergen', fromCode: 'BGO', date: '10. jan 2026', price: '890', discount: 35, search: 'london lhr bergen' },
  { to: 'Tokyo', fc: 'jp', code: 'HND', from: 'Oslo', fromCode: 'OSL', date: '07. jan 2026', price: '5 920', discount: 47, search: 'tokyo hnd oslo' },
  { to: 'Alicante', fc: 'es', code: 'ALC', from: 'Trondheim', fromCode: 'TRD', date: '03. jan 2026', price: '1 150', discount: 31, search: 'alicante alc trondheim' },
  { to: 'Bangkok', fc: 'th', code: 'BKK', from: 'Oslo', fromCode: 'OSL', date: '28. des 2025', price: '6 340', discount: 44, search: 'bangkok bkk oslo' },
  { to: 'Barcelona', fc: 'es', code: 'BCN', from: 'Bergen', fromCode: 'BGO', date: '22. des 2025', price: '699', discount: 38, search: 'barcelona bcn bergen' },
  { to: 'Dubai', fc: 'ae', code: 'DXB', from: 'Oslo', fromCode: 'OSL', date: '18. des 2025', price: '1 990', discount: 43, search: 'dubai dxb oslo' },
  { to: 'Roma', fc: 'it', code: 'FCO', from: 'Trondheim', fromCode: 'TRD', date: '15. des 2025', price: '589', discount: 64, search: 'roma fco trondheim' },
]

export default function HistorikkPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('alle')
  const [filterLabel, setFilterLabel] = useState('Alle deals')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: '#ff6b00', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span className="ms" style={{ fontSize: 22, color: '#fff' }}>flight_takeoff</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Laster...</p>
        </div>
      </div>
    )
  }

  const applyFilter = (type: string, label: string) => {
    setActiveFilter(type)
    setFilterLabel(label)
    setFilterOpen(false)
  }

  const visible = historyItems.filter(item => {
    const q = search.toLowerCase().trim()
    const matchSearch = q === '' || item.search.includes(q) || item.to.toLowerCase().includes(q)
    const matchFilter = activeFilter === 'alle' || item.search.includes(activeFilter)
    return matchSearch && matchFilter
  })

  const avgDiscount = historyItems.length > 0
    ? Math.round(historyItems.reduce((sum, d) => sum + d.discount, 0) / historyItems.length)
    : 0

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100dvh', background: '#050505' }}>
        <Sidebar active="historikk" userName={userName} userEmail={userEmail} onLogout={logout} />

        <main style={{ flex: 1, minWidth: 0, paddingBottom: 90 }}>
          {/* Header */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Historikk</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Alle deals vi har sendt deg — synkronisert i sanntid</p>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setFilterOpen(!filterOpen)} style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a1a', color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
                <span className="ms" style={{ fontSize: 16 }}>filter_list</span>
                {filterLabel}
              </button>
              {filterOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 6, width: 200,
                  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden',
                }}>
                  {[
                    { type: 'alle', label: 'Alle deals' },
                    { type: 'oslo', label: 'Fra Oslo (OSL)' },
                    { type: 'bergen', label: 'Fra Bergen (BGO)' },
                    { type: 'trondheim', label: 'Fra Trondheim (TRD)' },
                  ].map(f => (
                    <button key={f.type} onClick={() => applyFilter(f.type, f.label)} style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 500,
                      color: activeFilter === f.type ? '#ff6b00' : 'rgba(255,255,255,0.6)',
                      background: activeFilter === f.type ? 'rgba(255,107,0,0.08)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 28px' }}>
            <div style={{ position: 'relative', maxWidth: 400 }}>
              <span className="ms" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>search</span>
              <input
                type="text"
                placeholder="Søk i ruter, flyplasser eller byer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '8px 14px 8px 36px', borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.12)', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box', background: '#1a1a1a', color: '#f0f0f0', fontFamily: 'inherit',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#ff6b00')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px', maxWidth: 800 }}>

            {/* Info banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)',
              borderRadius: 12, marginBottom: 20,
            }}>
              <span className="ms" style={{ fontSize: 18, color: '#ff6b00', flexShrink: 0 }}>verified</span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Kun de beste tilbudene når deg — vi filtrerer ut støyen.</p>
            </div>

            {/* Stats summary */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24,
            }}>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ms" style={{ fontSize: 13 }}>mail</span>Varsler mottatt
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>{historyItems.length} deals</p>
              </div>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ms" style={{ fontSize: 13 }}>trending_down</span>Gj.snitt rabatt
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#22c55e', letterSpacing: '-0.5px' }}>-{avgDiscount}%</p>
              </div>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ms" style={{ fontSize: 13 }}>notifications</span>Varslingsmetode
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
                  background: 'rgba(255,107,0,0.1)', color: '#ff6b00', padding: '4px 10px', borderRadius: 100,
                  border: '1px solid rgba(255,107,0,0.2)', marginTop: 2,
                }}>
                  <span className="ms" style={{ fontSize: 13 }}>mail</span>E-post
                </span>
              </div>
            </div>

            {/* History list */}
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, paddingLeft: 4 }}>
                Mottatte varsler
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visible.map((item, i) => (
                <div key={i} style={{
                  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16, padding: '18px 20px', transition: 'all 0.15s', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 42, height: 42, background: 'rgba(255,107,0,0.1)', borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span className="ms" style={{ fontSize: 20, color: '#ff6b00' }}>flight_takeoff</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f0f0' }}>
                            {item.from} → {item.to}
                            {item.fc && <img src={`https://flagcdn.com/16x12/${item.fc}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginLeft: 6 }} />}
                          </p>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 100 }}>
                            {item.fromCode} → {item.code}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span className="ms" style={{ fontSize: 13 }}>calendar_month</span>{item.date}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span className="ms" style={{ fontSize: 13 }}>mail</span>Sendt på e-post
                          </span>
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 20, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.8px', lineHeight: 1 }}>
                        {item.price} <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>kr</span>
                      </p>
                      <span style={{
                        display: 'inline-block', marginTop: 6,
                        background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.25)',
                        fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100,
                      }}>-{item.discount}%</span>
                    </div>
                  </div>
                </div>
              ))}

              {visible.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.4)' }}>
                  <span className="ms" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>search_off</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Ingen deals funnet</p>
                  <p style={{ fontSize: 13 }}>Prøv å endre søk eller filter</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
