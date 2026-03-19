'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'

const DESTINATIONS = [
  { to: 'Bangkok', toCode: 'BKK', flag: 'th', region: 'Asia', avgPrice: 3200, bestPrice: 2489, discount: 52, popular: true },
  { to: 'Barcelona', toCode: 'BCN', flag: 'es', region: 'Europa', avgPrice: 1400, bestPrice: 699, discount: 63, popular: true },
  { to: 'Dubai', toCode: 'DXB', flag: 'ae', region: 'Midtøsten', avgPrice: 3800, bestPrice: 1890, discount: 55, popular: true },
  { to: 'London', toCode: 'LHR', flag: 'gb', region: 'Europa', avgPrice: 900, bestPrice: 449, discount: 63, popular: true },
  { to: 'New York', toCode: 'JFK', flag: 'us', region: 'Amerika', avgPrice: 6500, bestPrice: 3290, discount: 58, popular: true },
  { to: 'Roma', toCode: 'FCO', flag: 'it', region: 'Europa', avgPrice: 1200, bestPrice: 589, discount: 64, popular: false },
  { to: 'Tokyo', toCode: 'NRT', flag: 'jp', region: 'Asia', avgPrice: 8000, bestPrice: 4290, discount: 56, popular: true },
  { to: 'Alicante', toCode: 'ALC', flag: 'es', region: 'Europa', avgPrice: 1600, bestPrice: 799, discount: 62, popular: false },
  { to: 'Malaga', toCode: 'AGP', flag: 'es', region: 'Europa', avgPrice: 1100, bestPrice: 549, discount: 61, popular: false },
  { to: 'Lisboa', toCode: 'LIS', flag: 'pt', region: 'Europa', avgPrice: 1400, bestPrice: 649, discount: 63, popular: false },
  { to: 'Bali', toCode: 'DPS', flag: 'id', region: 'Asia', avgPrice: 7500, bestPrice: 3890, discount: 56, popular: true },
  { to: 'Paris', toCode: 'CDG', flag: 'fr', region: 'Europa', avgPrice: 1100, bestPrice: 529, discount: 62, popular: true },
]

const REGIONS = ['Alle', 'Europa', 'Asia', 'Amerika', 'Midtøsten']

export default function OppdagPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth()
  const router = useRouter()
  const [region, setRegion] = useState('Alle')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050505' }}><p style={{ color: 'rgba(255,255,255,0.5)' }}>Laster...</p></div>
  }

  const filtered = DESTINATIONS
    .filter(d => region === 'Alle' || d.region === region)
    .filter(d => !search || d.to.toLowerCase().includes(search.toLowerCase()) || d.toCode.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      <Sidebar active="oppdag" userName={userName} userEmail={userEmail} onLogout={logout} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Oppdag Ruter</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Utforsk destinasjoner og se historiske priser</p>
        </div>

        <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 28px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
            <span className="ms" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>search</span>
            <input type="text" placeholder="Søk destinasjon..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 14px 8px 38px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#1a1a1a', color: '#f0f0f0', fontFamily: 'inherit' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#ff6b00')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)} style={{
                padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                border: '1px solid', borderColor: region === r ? '#ff6b00' : 'rgba(255,255,255,0.12)',
                background: region === r ? '#ff6b00' : 'transparent', color: region === r ? '#fff' : 'rgba(255,255,255,0.5)',
              }}>{r}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {filtered.map(dest => (
              <div key={dest.toCode} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,107,0,0.35)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}>
                <div style={{ height: 80, background: 'linear-gradient(135deg, #ff6b00 0%, #ff9500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span className={`fi fi-${dest.flag}`} style={{ width: '3em', height: '2.25em', display: 'inline-block', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                  {dest.popular && (
                    <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#ff6b00', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>Populær</span>
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f0f0' }}>{dest.to}</h3>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 100 }}>{dest.region}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Beste pris fra OSL</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{dest.avgPrice.toLocaleString('no')} kr</p>
                      <p style={{ fontSize: 20, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.8px', lineHeight: 1 }}>{dest.bestPrice.toLocaleString('no')} kr</p>
                    </div>
                    <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100 }}>-{dest.discount}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
