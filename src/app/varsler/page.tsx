'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const MOCK_VARSLER = [
  { id: 1, from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, normal: 5200, discount: 52, date: '2026-06-15', airline: 'Norwegian', sentAt: '2026-03-19T07:30:00', read: false },
  { id: 2, from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 699, normal: 1890, discount: 63, date: '2026-05-10', airline: 'Ryanair', sentAt: '2026-03-19T06:15:00', read: false },
  { id: 3, from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 449, normal: 1200, discount: 63, date: '2026-04-22', airline: 'Norwegian', sentAt: '2026-03-18T18:45:00', read: true },
  { id: 4, from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, normal: 7800, discount: 58, date: '2026-09-05', airline: 'SAS', sentAt: '2026-03-18T12:00:00', read: true },
  { id: 5, from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, normal: 1650, discount: 64, date: '2026-05-18', airline: 'Ryanair', sentAt: '2026-03-17T08:30:00', read: true },
]

function timeAgo(dateStr: string) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)} min siden`
  if (diff < 86400) return `${Math.floor(diff / 3600)} timer siden`
  return `${Math.floor(diff / 86400)} dager siden`
}

export default function VarslerPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [varsler, setVarsler] = useState(MOCK_VARSLER)
  const [filter, setFilter] = useState<'alle' | 'ulest'>('alle')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#aaa', fontSize: 14 }}>Laster...</p>
      </div>
    )
  }

  const filtered = filter === 'ulest' ? varsler.filter(v => !v.read) : varsler
  const unreadCount = varsler.filter(v => !v.read).length

  const markAllRead = () => setVarsler(prev => prev.map(v => ({ ...v, read: true })))
  const markRead = (id: number) => setVarsler(prev => prev.map(v => v.id === id ? { ...v, read: true } : v))

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fafafa', overflow: 'hidden' }}>
      <Sidebar active="varsler" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
              Dine Varsler
              {unreadCount > 0 && (
                <span style={{ background: '#ff6b00', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100 }}>{unreadCount} nye</span>
              )}
            </h1>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>E-postvarsler sendes til {userEmail}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['alle', 'ulest'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                border: '1.5px solid', borderColor: filter === f ? '#ff6b00' : '#e0e0e0',
                background: filter === f ? '#ff6b00' : '#fff',
                color: filter === f ? '#fff' : '#555',
              }}>
                {f === 'alle' ? 'Alle' : 'Uleste'}
              </button>
            ))}
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #e0e0e0', background: '#fff', color: '#555' }}>
                Merk alle lest
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: 720 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#aaa' }}>
              <span className="ms" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>notifications_none</span>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 6 }}>Ingen {filter === 'ulest' ? 'uleste ' : ''}varsler</p>
              <p style={{ fontSize: 14 }}>Vi varsler deg når vi finner en deal fra dine flyplasser.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(varsel => (
                <div key={varsel.id} onClick={() => markRead(varsel.id)}
                  style={{
                    background: '#fff', border: `1.5px solid ${varsel.read ? '#f0f0f0' : 'rgba(255,107,0,0.25)'}`,
                    borderRadius: 16, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s',
                    boxShadow: varsel.read ? 'none' : '0 4px 16px rgba(255,107,0,0.06)',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,107,0,0.4)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = varsel.read ? '#f0f0f0' : 'rgba(255,107,0,0.25)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                      {!varsel.read && (
                        <div style={{ width: 8, height: 8, background: '#ff6b00', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />
                      )}
                      {varsel.read && <div style={{ width: 8, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: '#0a0a0a' }}>{varsel.from} → {varsel.to}</p>
                          <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>-{varsel.discount}%</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>{varsel.fromCode} → {varsel.toCode} · {varsel.airline} · {new Date(varsel.date).toLocaleDateString('no', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div>
                            <span style={{ fontSize: 22, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.8px' }}>{varsel.price.toLocaleString('no')} kr</span>
                            <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', marginLeft: 8 }}>{varsel.normal.toLocaleString('no')} kr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 11, color: '#bbb', marginBottom: 8 }}>{timeAgo(varsel.sentAt)}</p>
                      <a href={`https://www.google.com/travel/flights?q=Flights+from+${varsel.fromCode}+to+${varsel.toCode}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        <span className="ms" style={{ fontSize: 14 }}>flight_takeoff</span>
                        Book nå
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 32, background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: 16, padding: '20px 24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0a0a0a', marginBottom: 4 }}>Varslingsinnstillinger</h3>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 16 }}>Administrer hvilke flyplasser du vil ha varsler fra</p>
            <a href="/innstillinger" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1.5px solid #e0e0e0', borderRadius: 100, fontSize: 13, fontWeight: 600, color: '#555', textDecoration: 'none' }}>
              <span className="ms" style={{ fontSize: 16 }}>settings</span>
              Gå til innstillinger
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
