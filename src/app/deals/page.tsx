'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { useSubscription } from '@/lib/useSubscription'
import Sidebar from '@/components/Sidebar'
import Paywall from '@/components/Paywall'
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
  price: number       // best deal price (oneway or roundtrip)
  normal: number      // avg price for best deal type
  discount: number    // discount % for best deal type
  date: string
  returnDate?: string | null
  airline: string
  direct: boolean
  seats: number
  bestType: 'oneway' | 'roundtrip'  // which type has the best deal
  onewayPrice?: number | null        // one-way best price
  roundtripPrice?: number | null     // round-trip best price
}

const FALLBACK_DEALS: Deal[] = [
  { id: 1, from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, normal: 5200, discount: 52, date: '2026-06-15', airline: 'Norwegian', direct: false, seats: 4, bestType: 'roundtrip', onewayPrice: 3100, roundtripPrice: 2489 },
  { id: 2, from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: 'ae', price: 1890, normal: 4200, discount: 55, date: '2026-10-20', airline: 'Emirates', direct: true, seats: 2, bestType: 'roundtrip', onewayPrice: 1200, roundtripPrice: 1890 },
  { id: 3, from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 699, normal: 1890, discount: 63, date: '2026-05-10', airline: 'Ryanair', direct: true, seats: 8, bestType: 'oneway', onewayPrice: 699, roundtripPrice: 1350 },
  { id: 4, from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 449, normal: 1200, discount: 63, date: '2026-04-22', airline: 'Norwegian', direct: true, seats: 5, bestType: 'oneway', onewayPrice: 449, roundtripPrice: 980 },
  { id: 5, from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, normal: 1650, discount: 64, date: '2026-05-18', airline: 'Ryanair', direct: false, seats: 12, bestType: 'roundtrip', onewayPrice: 750, roundtripPrice: 589 },
  { id: 6, from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, normal: 7800, discount: 58, date: '2026-09-05', airline: 'SAS', direct: true, seats: 3, bestType: 'roundtrip', onewayPrice: 2100, roundtripPrice: 3290 },
  { id: 7, from: 'Tromsø', fromCode: 'TOS', to: 'Alicante', toCode: 'ALC', flag: 'es', price: 799, normal: 2100, discount: 62, date: '2026-07-12', airline: 'Norwegian', direct: false, seats: 6, bestType: 'oneway', onewayPrice: 799, roundtripPrice: 1590 },
  { id: 8, from: 'Torp', fromCode: 'TRF', to: 'Malaga', toCode: 'AGP', flag: 'es', price: 269, normal: 1636, discount: 84, date: '2026-06-08', airline: 'Ryanair', direct: true, seats: 9, bestType: 'oneway', onewayPrice: 269, roundtripPrice: 890 },
]

const AIRPORTS = [
  { code: 'Alle', label: 'Alle' },
  { code: 'OSL', label: 'Oslo' },
  { code: 'BGO', label: 'Bergen' },
  { code: 'SVG', label: 'Stavanger' },
  { code: 'TRD', label: 'Trondheim' },
  { code: 'TOS', label: 'Tromsø' },
  { code: 'TRF', label: 'Torp' },
]

const MONTHS = [
  { key: 'alle', label: 'Alle mnd' },
  { key: '04', label: 'Apr' },
  { key: '05', label: 'Mai' },
  { key: '06', label: 'Jun' },
  { key: '07', label: 'Jul' },
  { key: '08', label: 'Aug' },
  { key: '09', label: 'Sep' },
  { key: '10', label: 'Okt' },
  { key: '11', label: 'Nov' },
  { key: '12', label: 'Des' },
]

const airportCity: Record<string, string> = {
  'OSL': 'Oslo', 'BGO': 'Bergen', 'SVG': 'Stavanger', 'TRD': 'Trondheim',
  'TOS': 'Tromsø', 'TRF': 'Torp', 'KRS': 'Kristiansand',
}

export default function DealsPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const { hasAccess, loading: subLoading, startCheckout } = useSubscription(userEmail || undefined)
  const router = useRouter()
  const [selectedAirport, setSelectedAirport] = useState('Alle')
  const [selectedMonth, setSelectedMonth] = useState('alle')
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'date'>('discount')
  const [tripType, setTripType] = useState<'alle' | 'roundtrip' | 'oneway'>('alle')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [deals, setDeals] = useState<Deal[]>(FALLBACK_DEALS)
  const [isLive, setIsLive] = useState(false)
  const [selectedPriceType, setSelectedPriceType] = useState<'oneway' | 'roundtrip'>('roundtrip')

  useEffect(() => {
    async function fetchDeals() {
      if (!supabase) return
      try {
        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .order('discount_pct', { ascending: false })
          .gt('discount_pct', 20)
          .limit(200)

        if (error || !data || data.length === 0) return

        const mapped: Deal[] = data.map((f: Record<string, unknown>, i: number) => {
          const originCode = (f.departure_airport as string) || 'OSL'
          const destCode = (f.arrival_airport as string) || ''
          const price = Number(f.price_nok) || 0
          const normalPrice = Number(f.normal_price || f.avg_price) || Math.round(price * 1.6)
          const disc = Number(f.discount_pct) || 0
          // country field stores 'oneway' or 'roundtrip'
          const bestType = ((f.country as string) === 'oneway' ? 'oneway' : 'roundtrip') as 'oneway' | 'roundtrip'
          // typical_price_low = oneway best price, typical_price_high = roundtrip best price
          const onewayPrice = f.typical_price_low ? Number(f.typical_price_low) : (bestType === 'oneway' ? price : null)
          const roundtripPrice = f.typical_price_high ? Number(f.typical_price_high) : (bestType === 'roundtrip' ? price : null)

          return {
            id: (f.id as string) || i,
            from: (f.departure_city as string) || airportCity[originCode] || originCode,
            fromCode: originCode,
            to: (f.arrival_city as string) || destCode,
            toCode: destCode,
            flag: (f.country_code as string) || 'un',
            price,
            normal: normalPrice,
            discount: disc > 0 ? disc : 0,
            date: (f.travel_date as string) || new Date().toISOString().split('T')[0],
            returnDate: (f.return_date as string) || null,
            airline: (f.airline as string) || 'Diverse',
            direct: !!(f.direct),
            seats: Math.floor(Math.random() * 12) + 2,
            bestType,
            onewayPrice,
            roundtripPrice,
          }
        }).filter((d: Deal) => d.price > 0 && d.discount > 10)

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

  if (!subLoading && !hasAccess) {
    return <Paywall onStartTrial={startCheckout} />
  }

  const filtered = deals
    .filter(d => selectedAirport === 'Alle' || d.fromCode === selectedAirport)
    .filter(d => {
      if (selectedMonth === 'alle') return true
      const month = d.date?.split('-')[1] || d.date?.split('T')[0]?.split('-')[1]
      return month === selectedMonth
    })
    .filter(d => {
      if (tripType === 'roundtrip') return d.bestType === 'roundtrip' || d.roundtripPrice != null
      if (tripType === 'oneway') return d.bestType === 'oneway' || d.onewayPrice != null
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'discount') return b.discount - a.discount
      if (sortBy === 'price') return a.price - b.price
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  const googleFlightsUrl = (deal: Deal, priceType: 'oneway' | 'roundtrip') => {
    const depDate = deal.date?.split('T')[0] || ''
    const retDate = deal.returnDate?.split('T')[0] || ''
    if (priceType === 'oneway') {
      return `https://www.google.com/travel/flights?q=Flights+from+${deal.fromCode}+to+${deal.toCode}+on+${depDate}&curr=NOK&tfs=CBwQ2`
    }
    return `https://www.google.com/travel/flights?q=Flights+from+${deal.fromCode}+to+${deal.toCode}+on+${depDate}${retDate ? `+return+${retDate}` : ''}&curr=NOK&tfs=CBwQ1`
  }

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100dvh', background: '#050505' }}>
        <Sidebar active="deals" userName={userName} userEmail={userEmail} onLogout={logout} />

        <main style={{ flex: 1, minWidth: 0, paddingBottom: 90, overflow: 'auto', height: '100vh' }}>

          {/* Header */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 24px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Live Deals</h1>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, background: isLive ? '#22c55e' : '#f59e0b', borderRadius: '50%', display: 'inline-block' }} />
                  {filtered.length} deals · {isLive ? 'Live' : 'Eksempel'} · 3× daglig
                </p>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as 'discount' | 'price' | 'date')}
                style={{ padding: '7px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a1a', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'pointer' }}>
                <option value="discount">Størst rabatt</option>
                <option value="price">Lavest pris</option>
                <option value="date">Tidligst dato</option>
              </select>
            </div>

            {/* Trip type toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { key: 'alle' as const, label: 'Alle' },
                { key: 'roundtrip' as const, label: 'Tur/Retur' },
                { key: 'oneway' as const, label: 'Enveis' },
              ].map(t => (
                <button key={t.key} onClick={() => setTripType(t.key)} style={{
                  padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 100, cursor: 'pointer',
                  border: tripType === t.key ? '1px solid #ff6b00' : '1px solid rgba(255,255,255,0.12)',
                  background: tripType === t.key ? '#ff6b00' : 'transparent',
                  color: tripType === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s',
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Airport filter */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {AIRPORTS.map(({ code, label }) => (
                <button key={code} onClick={() => setSelectedAirport(code)} style={{
                  padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: selectedAirport === code ? '#ff6b00' : 'rgba(255,255,255,0.12)',
                  background: selectedAirport === code ? 'rgba(255,107,0,0.15)' : 'transparent',
                  color: selectedAirport === code ? '#ff6b00' : 'rgba(255,255,255,0.45)',
                  flexShrink: 0,
                }}>
                  {label}
                  {code !== 'Alle' && <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 3 }}>({code})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Month filter */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 24px', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {MONTHS.map(m => (
              <button key={m.key} onClick={() => setSelectedMonth(m.key)} style={{
                padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                border: selectedMonth === m.key ? '1px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: selectedMonth === m.key ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.04)',
                color: selectedMonth === m.key ? '#ff6b00' : 'rgba(255,255,255,0.4)',
              }}>
                <span className="ms" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 3 }}>calendar_month</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Deal cards */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {filtered.map(deal => (
                <div key={deal.id} onClick={() => { setSelectedDeal(deal); setSelectedPriceType(deal.bestType) }}
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,0,0.3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}>

                  {/* Route + badges */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.2 }}>
                        {deal.from} → {deal.to}
                        {deal.flag !== 'un' && <img src={`https://flagcdn.com/16x12/${deal.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginLeft: 6 }} />}
                      </p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        {deal.fromCode} → {deal.toCode} · {deal.airline}
                      </p>
                    </div>
                    {deal.discount > 0 && (
                      <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, flexShrink: 0, marginLeft: 8 }}>
                        -{deal.discount}%
                      </span>
                    )}
                  </div>

                  {/* Price comparison: Enveis vs T/R */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                    {/* One-way price */}
                    <div style={{
                      background: deal.bestType === 'oneway' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${deal.bestType === 'oneway' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 10, padding: '8px 10px',
                    }}>
                      <p style={{ fontSize: 9, fontWeight: 600, color: deal.bestType === 'oneway' ? '#3b82f6' : 'rgba(255,255,255,0.35)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Enveis
                        {deal.bestType === 'oneway' && <span style={{ marginLeft: 4, fontSize: 8, background: '#3b82f6', color: '#fff', padding: '1px 4px', borderRadius: 3 }}>BEST</span>}
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: deal.bestType === 'oneway' ? '#f0f0f0' : 'rgba(255,255,255,0.5)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        {deal.onewayPrice ? `${deal.onewayPrice.toLocaleString('no')} kr` : '—'}
                      </p>
                    </div>
                    {/* Round-trip price */}
                    <div style={{
                      background: deal.bestType === 'roundtrip' ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${deal.bestType === 'roundtrip' ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 10, padding: '8px 10px',
                    }}>
                      <p style={{ fontSize: 9, fontWeight: 600, color: deal.bestType === 'roundtrip' ? '#ff6b00' : 'rgba(255,255,255,0.35)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tur/Retur
                        {deal.bestType === 'roundtrip' && <span style={{ marginLeft: 4, fontSize: 8, background: '#ff6b00', color: '#fff', padding: '1px 4px', borderRadius: 3 }}>BEST</span>}
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: deal.bestType === 'roundtrip' ? '#f0f0f0' : 'rgba(255,255,255,0.5)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        {deal.roundtripPrice ? `${deal.roundtripPrice.toLocaleString('no')} kr` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Date + stops */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        <span className="ms" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 3 }}>calendar_today</span>
                        {new Date(deal.date).toLocaleDateString('no', { day: 'numeric', month: 'short' })}
                        {deal.returnDate && <span style={{ color: 'rgba(255,255,255,0.3)' }}> → {new Date(deal.returnDate).toLocaleDateString('no', { day: 'numeric', month: 'short' })}</span>}
                      </p>
                    </div>
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
                <p style={{ fontSize: 13, marginTop: 4 }}>Prøv å endre filter, måned eller flyplassvalg</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Deal modal */}
      {selectedDeal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setSelectedDeal(null)}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '24px', maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
                  {selectedDeal.from} → {selectedDeal.to}
                  {selectedDeal.flag !== 'un' && <img src={`https://flagcdn.com/20x15/${selectedDeal.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginLeft: 8 }} />}
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {selectedDeal.fromCode} → {selectedDeal.toCode} · {selectedDeal.airline}
                </p>
              </div>
              <button onClick={() => setSelectedDeal(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>close</span>
              </button>
            </div>

            {/* Price type selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { key: 'oneway' as const, label: 'Enveis', price: selectedDeal.onewayPrice, color: '#3b82f6' },
                { key: 'roundtrip' as const, label: 'Tur/Retur', price: selectedDeal.roundtripPrice, color: '#ff6b00' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setSelectedPriceType(opt.key)}
                  disabled={!opt.price}
                  style={{
                    padding: '12px', borderRadius: 12, cursor: opt.price ? 'pointer' : 'not-allowed',
                    border: `2px solid ${selectedPriceType === opt.key ? opt.color : 'rgba(255,255,255,0.1)'}`,
                    background: selectedPriceType === opt.key ? `${opt.color}15` : 'rgba(255,255,255,0.03)',
                    opacity: opt.price ? 1 : 0.4,
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: selectedPriceType === opt.key ? opt.color : 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {opt.label}
                    {selectedDeal.bestType === opt.key && <span style={{ marginLeft: 6, fontSize: 8, background: opt.color, color: '#fff', padding: '1px 5px', borderRadius: 3 }}>BEST DEAL</span>}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: selectedPriceType === opt.key ? '#f0f0f0' : 'rgba(255,255,255,0.4)', letterSpacing: '-1px', lineHeight: 1 }}>
                    {opt.price ? `${opt.price.toLocaleString('no')} kr` : 'Ikke tilgjengelig'}
                  </p>
                </button>
              ))}
            </div>

            {/* Deal details */}
            <div style={{ background: '#242424', borderRadius: 16, padding: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { icon: 'calendar_today', label: 'Utreise', val: new Date(selectedDeal.date).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'event', label: selectedPriceType === 'roundtrip' ? 'Retur' : 'Type', val: selectedPriceType === 'roundtrip' && selectedDeal.returnDate ? new Date(selectedDeal.returnDate).toLocaleDateString('no', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Enveis' },
                  { icon: 'airlines', label: 'Flyselskap', val: selectedDeal.airline },
                  { icon: 'flight', label: 'Stopp', val: selectedDeal.direct ? 'Direktefly' : '1 mellomlanding' },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: '#1a1a1a', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="ms" style={{ fontSize: 12 }}>{icon}</span>{label}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Book button */}
            <a href={googleFlightsUrl(selectedDeal, selectedPriceType)} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
              <span className="ms" style={{ fontSize: 18 }}>flight_takeoff</span>
              Book {selectedPriceType === 'oneway' ? 'enveis' : 'tur/retur'} på Google Flights
            </a>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              Du sendes direkte til Google Flights for å fullføre bookingen
            </p>
          </div>
        </div>
      )}
    </>
  )
}
