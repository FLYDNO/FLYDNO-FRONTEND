'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null

interface Deal {
  id: number | string
  from: string
  fromCode: string
  to: string
  toCode: string
  flag: string
  price: number
  normal: number
  discount: number
  date: string
  returnDate?: string | null
  airline: string
  direct: boolean
  seats: number
  type: 'enkel' | 't/r'
}

const FALLBACK_DEALS: Deal[] = [
  { id: 1, from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, normal: 5200, discount: 52, date: '2026-06-15', airline: 'Norwegian', direct: false, seats: 4, type: 't/r' },
  { id: 2, from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: 'ae', price: 1890, normal: 4200, discount: 55, date: '2026-10-20', airline: 'Emirates', direct: true, seats: 2, type: 't/r' },
  { id: 3, from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 699, normal: 1890, discount: 63, date: '2026-05-10', airline: 'Ryanair', direct: true, seats: 8, type: 'enkel' },
  { id: 4, from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 449, normal: 1200, discount: 63, date: '2026-04-22', airline: 'Norwegian', direct: true, seats: 5, type: 'enkel' },
  { id: 5, from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, normal: 1650, discount: 64, date: '2026-05-18', airline: 'Ryanair', direct: false, seats: 12, type: 't/r' },
  { id: 6, from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, normal: 7800, discount: 58, date: '2026-09-05', airline: 'SAS', direct: true, seats: 3, type: 't/r' },
  { id: 7, from: 'Tromsø', fromCode: 'TOS', to: 'Alicante', toCode: 'ALC', flag: 'es', price: 799, normal: 2100, discount: 62, date: '2026-07-12', airline: 'Norwegian', direct: false, seats: 6, type: 'enkel' },
  { id: 8, from: 'Torp', fromCode: 'TRF', to: 'Malaga', toCode: 'AGP', flag: 'es', price: 549, normal: 1400, discount: 61, date: '2026-06-08', airline: 'Ryanair', direct: true, seats: 9, type: 't/r' },
  { id: 9, from: 'Oslo', fromCode: 'OSL', to: 'Tokyo', toCode: 'NRT', flag: 'jp', price: 4290, normal: 9800, discount: 56, date: '2026-11-01', airline: 'Finnair', direct: false, seats: 2, type: 't/r' },
  { id: 10, from: 'Bergen', fromCode: 'BGO', to: 'Lisboa', toCode: 'LIS', flag: 'pt', price: 649, normal: 1750, discount: 63, date: '2026-06-25', airline: 'Ryanair', direct: false, seats: 7, type: 'enkel' },
  { id: 11, from: 'Oslo', fromCode: 'OSL', to: 'Bali', toCode: 'DPS', flag: 'id', price: 3890, normal: 8900, discount: 56, date: '2026-08-14', airline: 'KLM', direct: false, seats: 4, type: 't/r' },
  { id: 12, from: 'Stavanger', fromCode: 'SVG', to: 'Paris', toCode: 'CDG', flag: 'fr', price: 529, normal: 1400, discount: 62, date: '2026-05-28', airline: 'Norwegian', direct: true, seats: 11, type: 'enkel' },
]

const AIRPORTS = ['Alle', 'OSL', 'BGO', 'SVG', 'TRD', 'TOS', 'TRF']

// Map country codes to flag codes
const countryToFlag: Record<string, string> = {
  'TH': 'th', 'AE': 'ae', 'ES': 'es', 'GB': 'gb', 'IT': 'it', 'US': 'us',
  'JP': 'jp', 'PT': 'pt', 'ID': 'id', 'FR': 'fr', 'DE': 'de', 'GR': 'gr',
  'TR': 'tr', 'MA': 'ma', 'NO': 'no', 'SE': 'se', 'DK': 'dk', 'IS': 'is',
  'NL': 'nl', 'BE': 'be', 'AT': 'at', 'CH': 'ch', 'PL': 'pl', 'CZ': 'cz',
}

// Airport code to city name
const airportCity: Record<string, string> = {
  'OSL': 'Oslo', 'BGO': 'Bergen', 'SVG': 'Stavanger', 'TRD': 'Trondheim',
  'TOS': 'Tromsø', 'TRF': 'Torp', 'KRS': 'Kristiansand',
}

export default function DealsPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [selectedAirport, setSelectedAirport] = useState('Alle')
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'date'>('discount')
  const [tripType, setTripType] = useState<'alle' | 'tur_retur' | 'enkel'>('alle')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [deals, setDeals] = useState<Deal[]>(FALLBACK_DEALS)
  const [isLive, setIsLive] = useState(false)

  // Fetch real deals from Supabase
  useEffect(() => {
    async function fetchDeals() {
      if (!supabase) return
      try {
        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error || !data || data.length === 0) return

        const mapped: Deal[] = data.map((f: Record<string, unknown>, i: number) => {
          const originCode = (f.origin as string) || 'OSL'
          const destCode = (f.destination as string) || ''
          const price = Number(f.price) || 0
          const normalPrice = Number(f.normal_price || f.average_price) || Math.round(price * 1.6)
          const disc = normalPrice > 0 ? Math.round(((normalPrice - price) / normalPrice) * 100) : 0
          const hasReturn = !!(f.return_date)

          return {
            id: (f.id as string) || i,
            from: airportCity[originCode] || originCode,
            fromCode: originCode,
            to: (f.destination_city as string) || destCode,
            toCode: destCode,
            flag: countryToFlag[(f.destination_country as string) || ''] || 'un',
            price,
            normal: normalPrice,
            discount: disc > 0 ? disc : 0,
            date: (f.departure_date as string) || new Date().toISOString().split('T')[0],
            returnDate: (f.return_date as string) || null,
            airline: (f.airline as string) || 'Diverse',
            direct: (f.stops as number) === 0,
            seats: Math.floor(Math.random() * 12) + 2,
            type: (hasReturn ? 't/r' : 'enkel') as 'enkel' | 't/r',
          }
        }).filter((d: Deal) => d.price > 0 && d.discount > 5)

        if (mapped.length > 0) {
          setDeals(mapped)
          setIsLive(true)
        }
      } catch { /* fallback to mock data */ }
    }
    fetchDeals()
  }, [])

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

  const filtered = deals
    .filter(d => selectedAirport === 'Alle' || d.fromCode === selectedAirport)
    .filter(d => {
      if (tripType === 'tur_retur') return d.type === 't/r'
      if (tripType === 'enkel') return d.type === 'enkel'
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'discount') return b.discount - a.discount
      if (sortBy === 'price') return a.price - b.price
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  const googleFlightsUrl = (deal: Deal) => {
    const depDate = deal.date?.split('T')[0] || ''
    const retDate = deal.returnDate?.split('T')[0] || ''
    const tripParam = deal.type === 't/r' && retDate ? '1' : '2' // 1=round trip, 2=one way
    return `https://www.google.com/travel/flights?q=Flights+from+${deal.fromCode}+to+${deal.toCode}+on+${depDate}${retDate ? `+return+${retDate}` : ''}&curr=NOK&tfs=CBwQ${tripParam}`
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
      <Sidebar active="deals" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Live Deals</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: isLive ? '#22c55e' : '#f59e0b', borderRadius: '50%', display: 'inline-block' }} />
              {filtered.length} aktive deals akkurat nå · {isLive ? 'Live data' : 'Eksempeldata'} · Oppdateres 3× daglig
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* Trip type toggle */}
            <div style={{ display: 'flex', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              {[
                { key: 'alle' as const, label: 'Alle' },
                { key: 'tur_retur' as const, label: 'Tur/Retur' },
                { key: 'enkel' as const, label: 'Enveis' },
              ].map(t => (
                <button key={t.key} onClick={() => setTripType(t.key)} style={{
                  padding: '7px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: tripType === t.key ? '#ff6b00' : 'transparent',
                  color: tripType === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as 'discount' | 'price' | 'date')}
              style={{ padding: '8px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a1a', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'pointer' }}>
              <option value="discount">Størst rabatt</option>
              <option value="price">Lavest pris</option>
              <option value="date">Tidligst dato</option>
            </select>
          </div>
        </div>

        {/* Airport filter - scrollable on mobile */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 20px', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {AIRPORTS.map(code => (
            <button key={code} onClick={() => setSelectedAirport(code)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
              borderColor: selectedAirport === code ? '#ff6b00' : 'rgba(255,255,255,0.12)',
              background: selectedAirport === code ? '#ff6b00' : 'transparent',
              color: selectedAirport === code ? '#fff' : 'rgba(255,255,255,0.5)',
              flexShrink: 0,
            }}>
              {code}
            </button>
          ))}
        </div>

        {/* Deal cards - responsive grid */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map(deal => (
              <div key={deal.id} onClick={() => setSelectedDeal(deal)}
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.2 }}>
                      {deal.from} → {deal.to}
                      {deal.flag !== 'un' && <img src={`https://flagcdn.com/16x12/${deal.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginLeft: 6 }} />}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                      {deal.fromCode} → {deal.toCode} · {deal.airline}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <span style={{ background: deal.type === 't/r' ? 'rgba(255,107,0,0.1)' : 'rgba(59,130,246,0.1)', color: deal.type === 't/r' ? '#ff6b00' : '#3b82f6', border: `1px solid ${deal.type === 't/r' ? 'rgba(255,107,0,0.25)' : 'rgba(59,130,246,0.25)'}`, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>
                      {deal.type === 't/r' ? 'T/R' : 'Enveis'}
                    </span>
                    {deal.discount > 0 && (
                      <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>-{deal.discount}%</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    {deal.normal > deal.price && (
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{deal.normal.toLocaleString('no')} kr</p>
                    )}
                    <p style={{ fontSize: 28, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-1.2px', lineHeight: 1 }}>
                      {deal.price.toLocaleString('no')} <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>kr</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(deal.date).toLocaleDateString('no', { day: 'numeric', month: 'short' })}</p>
                    {deal.returnDate && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Retur: {new Date(deal.returnDate).toLocaleDateString('no', { day: 'numeric', month: 'short' })}</p>}
                    <p style={{ fontSize: 11, color: '#ff6b00', fontWeight: 700, marginTop: 2 }}>{deal.direct ? 'Direktefly' : '1 stopp'}</p>
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
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.35)' }}>
              <span className="ms" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>search_off</span>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Ingen deals funnet</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Prøv å endre filter eller flyplassvalg</p>
            </div>
          )}
        </div>
      </div>

      {/* Deal modal */}
      {selectedDeal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setSelectedDeal(null)}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '28px', maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
                  {selectedDeal.from} → {selectedDeal.to}
                  {selectedDeal.flag !== 'un' && <img src={`https://flagcdn.com/20x15/${selectedDeal.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginLeft: 8 }} />}
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {selectedDeal.fromCode} → {selectedDeal.toCode} · {selectedDeal.airline}
                  <span style={{ marginLeft: 8, background: selectedDeal.type === 't/r' ? 'rgba(255,107,0,0.15)' : 'rgba(59,130,246,0.15)', color: selectedDeal.type === 't/r' ? '#ff6b00' : '#3b82f6', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                    {selectedDeal.type === 't/r' ? 'Tur/Retur' : 'Enveis'}
                  </span>
                </p>
              </div>
              <button onClick={() => setSelectedDeal(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>close</span>
              </button>
            </div>
            <div style={{ background: '#242424', borderRadius: 16, padding: 20, marginBottom: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  {selectedDeal.normal > selectedDeal.price && (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{selectedDeal.normal.toLocaleString('no')} kr normalt</p>
                  )}
                  <p style={{ fontSize: 36, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-2px', lineHeight: 1 }}>
                    {selectedDeal.price.toLocaleString('no')} <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>kr</span>
                  </p>
                </div>
                {selectedDeal.discount > 0 && (
                  <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 16, fontWeight: 900, padding: '6px 14px', borderRadius: 100 }}>-{selectedDeal.discount}%</span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: 'calendar_today', label: 'Utreise', val: new Date(selectedDeal.date).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'event', label: 'Retur', val: selectedDeal.returnDate ? new Date(selectedDeal.returnDate).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Enveis' },
                  { icon: 'airlines', label: 'Flyselskap', val: selectedDeal.airline },
                  { icon: 'flight', label: 'Type', val: selectedDeal.direct ? 'Direktefly' : '1 mellomlanding' },
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
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
              <span className="ms" style={{ fontSize: 18 }}>flight_takeoff</span>
              Book på Google Flights
            </a>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              Du sendes direkte til Google Flights for å fullføre bookingen
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
