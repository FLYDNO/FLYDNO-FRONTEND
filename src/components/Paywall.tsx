'use client'

interface PaywallProps {
  onStartTrial: () => void
  loading?: boolean
}

export default function Paywall({ onStartTrial, loading }: PaywallProps) {
  return (
    <div style={{
      minHeight: '100dvh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ width: 56, height: 56, background: '#ff6b00', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span className="ms" style={{ fontSize: 28, color: '#fff' }}>flight_takeoff</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-1px', marginBottom: 8 }}>
          Prøv FlyDeals gratis i 7 dager
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.6 }}>
          Få tilgang til alle flydeals, varsler og prishistorikk.<br />
          Ingen kredittkort kreves for prøveperioden.
        </p>

        {/* Pricing card */}
        <div style={{
          background: '#1a1a1a', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 20, padding: '28px 24px', marginBottom: 24,
          boxShadow: '0 0 40px rgba(255,107,0,0.06)',
        }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,107,0,0.12)', color: '#ff6b00', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, marginBottom: 16 }}>
            7 dager gratis prøveperiode
          </div>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 48, fontWeight: 900, color: '#f0f0f0', letterSpacing: '-2px' }}>149</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>kr/mnd</span>
          </div>

          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            {[
              'Overvåker 187+ ruter fra 7 flyplasser',
              '7 destinasjoner på tvers av 3+ regioner',
              'Oppdateres 3× daglig med Google Flights',
              'Direkte booking via Google Flights',
              'Tilgang til alle aktive deals',
              'Prishistorikk og trendanalyse',
            ].map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                <span className="ms" style={{ fontSize: 18, color: '#22c55e' }}>check_circle</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{feature}</span>
              </div>
            ))}
          </div>

          <button onClick={onStartTrial} disabled={loading} style={{
            width: '100%', padding: 14, borderRadius: 100, background: '#ff6b00', color: '#fff',
            fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            opacity: loading ? 0.65 : 1, transition: 'all 0.2s',
          }}>
            {loading ? 'Laster...' : 'Start gratis prøveperiode'}
          </button>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Avbryt når som helst · Ingen binding · Ingen kredittkort nå
          </p>
        </div>

        <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span className="ms" style={{ fontSize: 16 }}>arrow_back</span>
          Tilbake til forsiden
        </a>
      </div>
    </div>
  )
}
