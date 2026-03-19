'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const MOCK_DEALS = [
  { id: 1, from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, normal: 5200, discount: 52, date: '2026-06-15', airline: 'Norwegian', direct: false, seats: 4 },
  { id: 2, from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: 'ae', price: 1890, normal: 4200, discount: 55, date: '2026-10-20', airline: 'Emirates', direct: true, seats: 2 },
  { id: 3, from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 699, normal: 1890, discount: 63, date: '2026-05-10', airline: 'Ryanair', direct: true, seats: 8 },
  { id: 4, from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 449, normal: 1200, discount: 63, date: '2026-04-22', airline: 'Norwegian', direct: true, seats: 5 },
  { id: 5, from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, normal: 1650, discount: 64, date: '2026-05-18', airline: 'Ryanair', direct: false, seats: 12 },
  { id: 6, from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, normal: 7800, discount: 58, date: '2026-09-05', airline: 'SAS', direct: true, seats: 3 },
  { id: 7, from: 'Tromsø', fromCode: 'TOS', to: 'Alicante', toCode: 'ALC', flag: 'es', price: 799, normal: 2100, discount: 62, date: '2026-07-12', airline: 'Norwegian', direct: false, seats: 6 },
  { id: 8, from: 'Torp', fromCode: 'TRF', to: 'Malaga', toCode: 'AGP', flag: 'es', price: 549, normal: 1400, discount: 61, date: '2026-06-08', airline: 'Ryanair', direct: true, seats: 9 },
  { id: 9, from: 'Oslo', fromCode: 'OSL', to: 'Tokyo', toCode: 'NRT', flag: 'jp', price: 4290, normal: 9800, discount: 56, date: '2026-11-01', airline: 'Finnair', direct: false, seats: 2 },
  { id: 10, from: 'Bergen', fromCode: 'BGO', to: 'Lisboa', toCode: 'LIS', flag: 'pt', price: 649, normal: 1750, discount: 63, date: '2026-06-25', airline: 'Ryanair', direct: false, seats: 7 },
  { id: 11, from: 'Oslo', fromCode: 'OSL', to: 'Bali', toCode: 'DPS', flag: 'id', price: 3890, normal: 8900, discount: 56, date: '2026-08-14', airline: 'KLM', direct: false, seats: 4 },
  { id: 12, from: 'Stavanger', fromCode: 'SVG', to: 'Paris', toCode: 'CDG', flag: 'fr', price: 529, normal: 1400, discount: 62, date: '2026-05-28', airline: 'Norwegian', direct: true, seats: 11 },
]

const AIRPORTS = ['Alle', 'OSL', 'BGO', 'SVG', 'TRD', 'TOS', 'TRF', 'KRS']

export default function DealsPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [selectedAirport, setSelectedAirport] = useState('Alle')
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'date'>('discount')
  const [selectedDeal, setSelectedDeal] = useState<typeof MOCK_DEALS[0] | null>(null)

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

  const filtered = MOCK_DEALS
    .filter(d => selectedAirport === 'Alle' || d.fromCode === selectedAirport)
    .sort((a, b) => {
      if (sortBy === 'discount') return b.discount - a.discount
      if (sortBy === 'price') return a.price - b.price
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  const googleFlightsUrl = (deal: typeof MOCK_DEALS[0]) =>
    `https://www.google.com/travel/flights?q=Flights+from+${deal.fromCode}+to+${deal.toCode}`

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      <Sidebar active="deals" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Live Deals</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
              {filtered.length} aktive deals akkurat nå · Oppdateres 3× daglig
            </p>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'discount' | 'price' | 'date')}
            style={{ padding: '8px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a1a', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'pointer' }}>
            <option value="discount">Størst rabatt</option>
            <option value="price">Lavest pris</option>
            <option value="date">Tidligst dato</option>
          </select>
        </div>

        {/* Airport filter */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 28px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {AIRPORTS.map(code => (
            <button key={code} onClick={() => setSelectedAirport(code)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
              borderColor: selectedAirport === code ? '#ff6b00' : 'rgba(255,255,255,0.12)',
              background: selectedAirport === code ? '#ff6b00' : 'transparent',
              color: selectedAirport === code ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>
              {code}
            </button>
          ))}
        </div>

        {/* Deal cards */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {filtered.map(deal => (
              <div key={deal.id} onClick={() => setSelectedDeal(deal)}
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,107,0,0.35)'; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; el.style.transform = 'translateY(-2px)'; el.style.background = '#222'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; el.style.background = '#1a1a1a'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.2 }}>{deal.from} → {deal.to}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{deal.fromCode} → {deal.toCode} · {deal.airline}</p>
                  </div>
                  <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, flexShrink: 0 }}>-{deal.discount}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{deal.normal.toLocaleString('no')} kr</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-1.2px', lineHeight: 1 }}>
                      {deal.price.toLocaleString('no')} <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>kr</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(deal.date).toLocaleDateString('no', { day: 'numeric', month: 'short' })}</p>
                    <p style={{ fontSize: 11, color: '#ff6b00', fontWeight: 700, marginTop: 2 }}>{deal.direct ? '✈ Direktefly' : '↔ 1 stopp'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                    <span className="ms" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 3 }}>event_seat</span>
                    {deal.seats} seter igjen
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ff6b00', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Se deal <span className="ms" style={{ fontSize: 14 }}>arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deal modal */}
      {selectedDeal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelectedDeal(null)}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>{selectedDeal.from} → {selectedDeal.to}</h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedDeal.fromCode} → {selectedDeal.toCode} · {selectedDeal.airline}</p>
              </div>
              <button onClick={() => setSelectedDeal(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="ms" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>close</span>
              </button>
            </div>
            <div style={{ background: '#242424', borderRadius: 16, padding: 20, marginBottom: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{selectedDeal.normal.toLocaleString('no')} kr normalt</p>
                  <p style={{ fontSize: 40, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-2px', lineHeight: 1 }}>
                    {selectedDeal.price.toLocaleString('no')} <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>kr</span>
                  </p>
                </div>
                <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 16, fontWeight: 900, padding: '6px 14px', borderRadius: 100 }}>-{selectedDeal.discount}%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: 'calendar_today', label: 'Dato', val: new Date(selectedDeal.date).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'flight', label: 'Type', val: selectedDeal.direct ? 'Direktefly' : '1 mellomlanding' },
                  { icon: 'airlines', label: 'Flyselskap', val: selectedDeal.airline },
                  { icon: 'event_seat', label: 'Seter igjen', val: `${selectedDeal.seats} seter` },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: '#1a1a1a', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="ms" style={{ fontSize: 13 }}>{icon}</span>{label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
            <a href={googleFlightsUrl(selectedDeal)} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 13, background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
              <span className="ms" style={{ fontSize: 18 }}>flight_takeoff</span>
              Book på Google Flights
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
