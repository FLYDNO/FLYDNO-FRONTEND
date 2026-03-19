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
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: '#ff6b00', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span className="ms" style={{ fontSize: 22, color: '#fff' }}>flight_takeoff</span>
          </div>
          <p style={{ color: '#aaa', fontSize: 14 }}>Laster...</p>
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

  const googleFlightsUrl = (deal: typeof MOCK_DEALS[0]) => {
    return `https://www.google.com/travel/flights?q=Flights+from+${deal.fromCode}+to+${deal.toCode}`
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fafafa', overflow: 'hidden' }}>
      <Sidebar active="deals" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.5px' }}>Live Deals</h1>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
              {filtered.length} aktive deals akkurat nå · Oppdateres 3× daglig
            </p>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'discount' | 'price' | 'date')}
            style={{ padding: '8px 14px', borderRadius: 100, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#555', outline: 'none', cursor: 'pointer' }}>
            <option value="discount">Størst rabatt</option>
            <option value="price">Lavest pris</option>
            <option value="date">Tidligst dato</option>
          </select>
        </div>

        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '10px 28px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {AIRPORTS.map(code => (
            <button key={code} onClick={() => setSelectedAirport(code)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: '1.5px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
              borderColor: selectedAirport === code ? '#ff6b00' : '#e0e0e0',
              background: selectedAirport === code ? '#ff6b00' : '#fff',
              color: selectedAirport === code ? '#fff' : '#555',
            }}>
              {code}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {filtered.map(deal => (
              <div key={deal.id} onClick={() => setSelectedDeal(deal)}
                style={{ background: '#fff', border: '1.5px solid #efefef', borderRadius: 16, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,107,0,0.4)'; el.style.boxShadow = '0 8px 32px rgba(255,107,0,0.08)'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#efefef'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#0a0a0a', lineHeight: 1.2 }}>{deal.from} → {deal.to}</p>
                    <p style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{deal.fromCode} → {deal.toCode} · {deal.airline}</p>
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, flexShrink: 0 }}>-{deal.discount}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#ccc', textDecoration: 'line-through' }}>{deal.normal.toLocaleString('no')} kr</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-1.2px', lineHeight: 1 }}>
                      {deal.price.toLocaleString('no')} <span style={{ fontSize: 13, fontWeight: 400, color: '#bbb' }}>kr</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: '#aaa' }}>{new Date(deal.date).toLocaleDateString('no', { day: 'numeric', month: 'short' })}</p>
                    <p style={{ fontSize: 11, color: '#ff6b00', fontWeight: 700, marginTop: 2 }}>{deal.direct ? '✈ Direktefly' : '↔ 1 stopp'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 11, color: '#bbb' }}>
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

      {selectedDeal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelectedDeal(null)}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '32px', maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.5px' }}>{selectedDeal.from} → {selectedDeal.to}</h2>
                <p style={{ fontSize: 12, color: '#aaa' }}>{selectedDeal.fromCode} → {selectedDeal.toCode} · {selectedDeal.airline}</p>
              </div>
              <button onClick={() => setSelectedDeal(null)} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="ms" style={{ fontSize: 18, color: '#555' }}>close</span>
              </button>
            </div>
            <div style={{ background: '#fafafa', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>{selectedDeal.normal.toLocaleString('no')} kr normalt</p>
                  <p style={{ fontSize: 40, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-2px', lineHeight: 1 }}>
                    {selectedDeal.price.toLocaleString('no')} <span style={{ fontSize: 16, fontWeight: 400, color: '#aaa' }}>kr</span>
                  </p>
                </div>
                <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: 16, fontWeight: 900, padding: '6px 14px', borderRadius: 100 }}>-{selectedDeal.discount}%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: 'calendar_today', label: 'Dato', val: new Date(selectedDeal.date).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'flight', label: 'Type', val: selectedDeal.direct ? 'Direktefly' : '1 mellomlanding' },
                  { icon: 'airlines', label: 'Flyselskap', val: selectedDeal.airline },
                  { icon: 'event_seat', label: 'Seter igjen', val: `${selectedDeal.seats} seter` },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: 11, color: '#bbb', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="ms" style={{ fontSize: 13 }}>{icon}</span>{label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={googleFlightsUrl(selectedDeal)} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, padding: '13px', background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="ms" style={{ fontSize: 18 }}>flight_takeoff</span>
                Book på Google Flights
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
