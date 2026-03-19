'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LIVE_DEALS = [
  { from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, normal: 5200, discount: 52, date: 'Jun 2026', airline: 'Norwegian', direct: false },
  { from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 699, normal: 1890, discount: 63, date: 'Mai 2026', airline: 'Ryanair', direct: true },
  { from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: 'ae', price: 1890, normal: 4200, discount: 55, date: 'Okt 2026', airline: 'Emirates', direct: true },
  { from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 449, normal: 1200, discount: 63, date: 'Apr 2026', airline: 'Norwegian', direct: true },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, normal: 1650, discount: 64, date: 'Mai 2026', airline: 'Ryanair', direct: false },
  { from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, normal: 7800, discount: 58, date: 'Sep 2026', airline: 'SAS', direct: true },
  { from: 'Tromsø', fromCode: 'TOS', to: 'Alicante', toCode: 'ALC', flag: 'es', price: 799, normal: 2100, discount: 62, date: 'Jul 2026', airline: 'Norwegian', direct: false },
  { from: 'Torp', fromCode: 'TRF', to: 'Malaga', toCode: 'AGP', flag: 'es', price: 549, normal: 1400, discount: 61, date: 'Jun 2026', airline: 'Ryanair', direct: true },
  { from: 'Oslo', fromCode: 'OSL', to: 'Tokyo', toCode: 'NRT', flag: 'jp', price: 4290, normal: 9800, discount: 56, date: 'Nov 2026', airline: 'Finnair', direct: false },
  { from: 'Bergen', fromCode: 'BGO', to: 'Lisboa', toCode: 'LIS', flag: 'pt', price: 649, normal: 1750, discount: 63, date: 'Jun 2026', airline: 'Ryanair', direct: false },
  { from: 'Oslo', fromCode: 'OSL', to: 'Bali', toCode: 'DPS', flag: 'id', price: 3890, normal: 8900, discount: 56, date: 'Aug 2026', airline: 'KLM', direct: false },
  { from: 'Stavanger', fromCode: 'SVG', to: 'Paris', toCode: 'CDG', flag: 'fr', price: 529, normal: 1400, discount: 62, date: 'Mai 2026', airline: 'Norwegian', direct: true },
];

const AIRPORTS = [
  { code: 'OSL', name: 'Oslo' },
  { code: 'BGO', name: 'Bergen' },
  { code: 'SVG', name: 'Stavanger' },
  { code: 'TRD', name: 'Trondheim' },
  { code: 'TOS', name: 'Tromsø' },
  { code: 'TRF', name: 'Torp' },
  { code: 'KRS', name: 'Kristiansand' },
];

const FAQS = [
  { q: 'Hvilke flyplasser overvåker dere?', a: 'Vi overvåker Oslo (OSL), Bergen (BGO), Stavanger (SVG), Trondheim (TRD), Tromsø (TOS), Torp (TRF) og Kristiansand (KRS) — 7 norske flyplasser totalt. Dette er 5 flyplasser mer enn konkurrentene våre.' },
  { q: 'Hva er en "deal"?', a: 'En deal er en pris som er 30% eller mer under det historiske gjennomsnittet for den ruten, og som sparer deg minst 500 kr. Vi viser alltid normalpris og rabatt slik at du kan se nøyaktig hva du sparer.' },
  { q: 'Må jeg bestille gjennom dere?', a: 'Nei — du booker direkte hos flyselskapet via Google Flights. Vi tar ingen provisjon og har ingen skjulte kostnader. Vi er kun et varslingsverktøy.' },
  { q: 'Kan jeg si opp når som helst?', a: 'Ja, du kan si opp abonnementet til enhver tid via innstillinger. Ingen bindingstid, ingen spørsmål stilt.' },
  { q: 'Hva skjer etter prøveperioden?', a: 'Etter 7 dager gratis trekkes 149 kr/mnd automatisk. Du kan si opp når som helst før det uten kostnad.' },
  { q: 'Hvor ofte sjekker dere prisene?', a: 'Vi sjekker prisene 3 ganger daglig — morgen, middag og kveld — slik at du alltid har de ferskeste dealene.' },
];

function DealCard({ deal }: { deal: typeof LIVE_DEALS[0] }) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #efefef',
      borderRadius: 16,
      padding: '16px 18px',
      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,107,0,0.35)';
        el.style.boxShadow = '0 8px 32px rgba(255,107,0,0.08)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = '#efefef';
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`fi fi-${deal.flag}`} style={{ width: '1.4em', height: '1.05em', display: 'inline-block', borderRadius: 3, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0a0a0a', lineHeight: 1.2 }}>{deal.from} → {deal.to}</p>
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{deal.fromCode} → {deal.toCode}</p>
          </div>
        </div>
        <span style={{
          background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
          fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100,
        }}>
          -{deal.discount}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>{deal.normal.toLocaleString('no')} kr</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-1px', lineHeight: 1.1 }}>
            {deal.price.toLocaleString('no')} <span style={{ fontSize: 13, fontWeight: 400, color: '#aaa' }}>kr</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: '#aaa' }}>{deal.date}</p>
          <p style={{ fontSize: 11, color: '#ff6b00', fontWeight: 700, marginTop: 2 }}>
            {deal.direct ? '✈ Direktefly' : '↔ 1 stopp'}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0', textAlign: 'left', gap: 16, background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>{q}</span>
        <span className="ms" style={{
          fontSize: 22, color: '#aaa', flexShrink: 0,
          transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none',
        }}>expand_more</span>
      </button>
      {open && (
        <p style={{ paddingBottom: 18, fontSize: 14, color: '#555', lineHeight: 1.7 }}>{a}</p>
      )}
    </div>
  );
}

export default function HomePage() {
  const [selectedAirports, setSelectedAirports] = useState(['OSL', 'BGO', 'SVG', 'TRD', 'TOS', 'TRF']);
  const [dealCount, setDealCount] = useState(0);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const target = 187;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + 5, target);
      setDealCount(current);
      if (current >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const toggleAirport = (code: string) => {
    setSelectedAirports(prev =>
      prev.includes(code) ? prev.filter(a => a !== code) : [...prev, code]
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const filteredDeals = LIVE_DEALS.filter(d => selectedAirports.includes(d.fromCode));

  return (
    <>
      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(22,163,74,0.5); }
          50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(22,163,74,0); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .live-dot { animation: pulse-live 2s infinite; }
        .ticker-track { display: flex; width: max-content; animation: ticker 35s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.2s; }
        .fade-up-4 { animation-delay: 0.28s; }
        .airport-chip {
          padding: 7px 15px; border-radius: 100px; font-size: 13px; font-weight: 600;
          border: 1.5px solid #e0e0e0; background: #fff; color: #555; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .airport-chip:hover { border-color: #ff6b00; color: #ff6b00; }
        .airport-chip.active { background: #ff6b00; border-color: #ff6b00; color: #fff; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 14px 28px; background: #ff6b00; color: #fff;
          border-radius: 100px; font-size: 15px; font-weight: 700;
          border: none; cursor: pointer; transition: background 0.15s, transform 0.1s;
          text-decoration: none;
        }
        .cta-btn:hover { background: #e55f00; transform: translateY(-1px); }
        .cta-btn:active { transform: translateY(0); }
        .cta-btn-sm {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 22px; background: #ff6b00; color: #fff;
          border-radius: 100px; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer; transition: background 0.15s;
          text-decoration: none;
        }
        .cta-btn-sm:hover { background: #e55f00; }
        .ghost-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 20px; background: transparent; color: #555;
          border-radius: 100px; font-size: 14px; font-weight: 600;
          border: 1.5px solid #e0e0e0; cursor: pointer; transition: all 0.15s;
          text-decoration: none;
        }
        .ghost-btn:hover { border-color: #ff6b00; color: #ff6b00; }
        .step-icon {
          width: 52px; height: 52px; background: #fff3eb; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #ff6b00; margin: 0 auto 16px; flex-shrink: 0;
        }
        .section-tag {
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #ff6b00;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .deals-grid { grid-template-columns: repeat(2,1fr) !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 38px !important; letter-spacing: -1.5px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .deals-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .hide-sm { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, background: '#ff6b00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="ms" style={{ fontSize: 19, color: '#fff' }}>flight_takeoff</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.4px' }}>FlyDeals</span>
          </Link>

          <div className="hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['#hvordan', 'Slik fungerer det'], ['#deals', 'Live deals'], ['#pris', 'Pris'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 14, fontWeight: 500, color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff6b00')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" className="ghost-btn hide-sm">Logg inn</Link>
            <Link href="/login" className="cta-btn-sm">Prøv gratis</Link>
          </div>
        </div>
      </nav>

      {/* ── LIVE TICKER ── */}
      <div style={{ background: '#fff8f3', borderBottom: '1px solid #ffe5cc', padding: '8px 0', overflow: 'hidden' }}>
        <div className="ticker-track">
          {[...LIVE_DEALS, ...LIVE_DEALS].map((d, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 24px', fontSize: 13, fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>
              <span className={`fi fi-${d.flag}`} style={{ width: '1.1em', height: '0.85em', borderRadius: 2, display: 'inline-block' }} />
              {d.from} → {d.to}
              <span style={{ color: '#ff6b00', fontWeight: 800 }}>{d.price.toLocaleString('no')} kr</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 100 }}>-{d.discount}%</span>
              <span style={{ color: '#e0e0e0', margin: '0 2px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      <main>
        {/* ── HERO ── */}
        <section style={{ padding: '72px 24px 80px', background: 'linear-gradient(160deg, #fff 0%, #fff8f3 100%)' }}>
          <div className="hero-grid" style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 22 }}>
                <span className="live-dot" style={{ width: 7, height: 7, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
                {dealCount} aktive deals akkurat nå
              </div>

              <h1 className="fade-up fade-up-1 hero-title" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-2.5px', marginBottom: 20, color: '#0a0a0a' }}>
                Spar opptil 90%<br />
                på <span style={{ color: '#ff6b00' }}>flybilletter</span>
              </h1>

              <p className="fade-up fade-up-2" style={{ fontSize: 17, color: '#555', lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
                Vi overvåker flypriser fra 7 norske flyplasser og varsler deg direkte på e-post når vi finner en ekte deal. Du slipper å lete selv.
              </p>

              <div className="fade-up fade-up-2" style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Velg dine flyplasser:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AIRPORTS.map(({ code, name }) => (
                    <button key={code} onClick={() => toggleAirport(code)} className={`airport-chip ${selectedAirports.includes(code) ? 'active' : ''}`}>
                      {name} ({code})
                    </button>
                  ))}
                </div>
              </div>

              <div className="fade-up fade-up-3" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
                <Link href="/login" className="cta-btn">
                  Start 7 dager gratis
                  <span className="ms" style={{ fontSize: 20 }}>arrow_forward</span>
                </Link>
                <span style={{ fontSize: 13, color: '#aaa' }}>Deretter 149 kr/mnd</span>
              </div>

              <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: 'verified', label: 'Ingen provisjon' },
                  { icon: 'lock', label: 'Sikker betaling' },
                  { icon: 'cancel', label: 'Si opp når som helst' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#aaa' }}>
                    <span className="ms" style={{ fontSize: 15, color: '#16a34a' }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right – live deal cards */}
            <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="live-dot" style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Aktive deals akkurat nå</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa' }}>Oppdateres 3× daglig</span>
              </div>
              {(filteredDeals.length > 0 ? filteredDeals : LIVE_DEALS).slice(0, 5).map((deal, i) => (
                <DealCard key={i} deal={deal} />
              ))}
              <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', background: '#fafafa', border: '1.5px dashed #e0e0e0', borderRadius: 14, fontSize: 13, fontWeight: 600, color: '#aaa', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b00'; e.currentTarget.style.color = '#ff6b00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#aaa'; }}>
                <span className="ms" style={{ fontSize: 18 }}>add</span>
                Se alle {LIVE_DEALS.length}+ deals
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '44px 24px' }}>
          <div className="stats-grid" style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { num: '7', label: 'Norske flyplasser', sub: 'OSL, BGO, SVG, TRD, TOS, TRF, KRS' },
              { num: '187+', label: 'Ruter overvåket', sub: 'Til hele verden' },
              { num: '3×', label: 'Daglig oppdatering', sub: 'Morgen, middag og kveld' },
              { num: '149 kr', label: 'Per måned', sub: '7 dager gratis prøveperiode' },
            ].map(({ num, label, sub }) => (
              <div key={label} style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 34, fontWeight: 900, color: '#ff6b00', letterSpacing: '-1.5px', lineHeight: 1 }}>{num}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', marginTop: 8 }}>{label}</p>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="hvordan" style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p className="section-tag" style={{ marginBottom: 12 }}>Slik fungerer det</p>
              <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', color: '#0a0a0a', marginBottom: 12 }}>Fra prisovervåking til drømmereise</h2>
              <p style={{ fontSize: 16, color: '#555', maxWidth: 480, margin: '0 auto' }}>Enkelt, automatisk og uten at du trenger å gjøre noe</p>
            </div>
            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
              {[
                { icon: 'manage_search', step: '01', title: 'Vi overvåker', desc: 'Algoritmene sjekker flypriser 3× daglig fra 7 norske flyplasser til 187+ destinasjoner.' },
                { icon: 'trending_down', step: '02', title: 'Vi finner en deal', desc: 'En pris som er 30%+ under normalt og sparer deg minst 500 kr er en ekte deal.' },
                { icon: 'mark_email_read', step: '03', title: 'Du får varsel', desc: 'Vi sender deg en e-post med dealen og en direktelenke til Google Flights.' },
                { icon: 'flight_takeoff', step: '04', title: 'Du booker', desc: 'Klikk lenken og book direkte hos flyselskapet. Ingen mellomledd.' },
              ].map(({ icon, step, title, desc }) => (
                <div key={step} style={{ textAlign: 'center' }}>
                  <div className="step-icon">
                    <span className="ms" style={{ fontSize: 26 }}>{icon}</span>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#ff6b00', letterSpacing: '0.1em', marginBottom: 8 }}>STEG {step}</p>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL DEALS ── */}
        <section id="deals" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p className="section-tag" style={{ marginBottom: 8 }}>Live deals</p>
                <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1.2px', color: '#0a0a0a' }}>Aktuelle flydeals akkurat nå</h2>
              </div>
              <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: '#ff6b00', textDecoration: 'none' }}>
                Se alle deals <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>
            <div className="deals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {LIVE_DEALS.map((deal, i) => (
                <DealCard key={i} deal={deal} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 44 }}>
              <p style={{ fontSize: 14, color: '#aaa', marginBottom: 18 }}>Disse er kun et utvalg. Abonnenter ser alle deals fra sine valgte flyplasser.</p>
              <Link href="/login" className="cta-btn">
                Start 7 dager gratis
                <span className="ms" style={{ fontSize: 20 }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── COMPETITOR COMPARE ── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p className="section-tag" style={{ marginBottom: 12 }}>Hvorfor FlyDeals?</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.2px', color: '#0a0a0a' }}>Mer enn konkurrentene</h2>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                <div style={{ padding: '14px 24px', fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Funksjon</div>
                <div style={{ padding: '14px 24px', borderLeft: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, background: '#ff6b00', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="ms" style={{ fontSize: 13, color: '#fff' }}>flight_takeoff</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#ff6b00' }}>FlyDeals</span>
                </div>
                <div style={{ padding: '14px 24px', borderLeft: '1px solid #e8e8e8', fontSize: 14, fontWeight: 700, color: '#555' }}>Flajts.se</div>
              </div>
              {[
                ['Norske flyplasser', '7 flyplasser', '2 flyplasser (OSL+TRF)'],
                ['Språk', 'Norsk', 'Kun svensk'],
                ['Pris', '149 kr/mnd', '499 SEK/år (~55 kr/mnd)'],
                ['Prøveperiode', '7 dager gratis', 'Ingen'],
                ['Deal-deteksjon', '30%+ under snitt', 'Ukjent algoritme'],
                ['Direktefly-filter', 'Ja', 'Ja'],
              ].map(([feat, us, them], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ padding: '13px 24px', fontSize: 14, color: '#555' }}>{feat}</div>
                  <div style={{ padding: '13px 24px', borderLeft: '1px solid #f5f5f5', fontSize: 14, fontWeight: 600, color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="ms" style={{ fontSize: 17, color: '#16a34a' }}>check_circle</span>
                    {us}
                  </div>
                  <div style={{ padding: '13px 24px', borderLeft: '1px solid #f5f5f5', fontSize: 14, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="ms" style={{ fontSize: 17, color: '#aaa' }}>remove</span>
                    {them}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pris" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '80px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p className="section-tag" style={{ marginBottom: 12 }}>Prising</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.2px', color: '#0a0a0a', marginBottom: 8 }}>Én enkel plan</h2>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 40 }}>Én enkelt booking kan spare mer enn hele årsavgiften.</p>

            <div style={{ background: '#fff', border: '2px solid #ff6b00', borderRadius: 24, padding: '40px 36px', boxShadow: '0 12px 48px rgba(255,107,0,0.12)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 22 }}>
                <span className="live-dot" style={{ width: 6, height: 6, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
                7 dager gratis prøveperiode
              </div>

              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 60, fontWeight: 900, color: '#ff6b00', letterSpacing: '-2.5px', lineHeight: 1 }}>149</span>
                <span style={{ fontSize: 20, color: '#aaa', fontWeight: 500 }}> kr/mnd</span>
              </div>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>Si opp når som helst · Ingen binding</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, textAlign: 'left' }}>
                {[
                  'Overvåking av 187+ ruter fra 7 flyplasser',
                  'E-postvarsler ved nye deals',
                  'Direktelenke til Google Flights',
                  'Velg dine foretrukne flyplasser',
                  'Tilgang til alle aktive deals',
                  'Prishistorikk og rabattberegning',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#0a0a0a' }}>
                    <span className="ms" style={{ fontSize: 18, color: '#16a34a', flexShrink: 0 }}>check_circle</span>
                    {f}
                  </div>
                ))}
              </div>

              <Link href="/login" className="cta-btn" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 28px', fontSize: 15 }}>
                Start gratis prøveperiode
              </Link>
              <p style={{ fontSize: 12, color: '#bbb', marginTop: 12 }}>Ingen kredittkort kreves for å starte</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p className="section-tag" style={{ marginBottom: 12 }}>Ofte stilte spørsmål</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.2px', color: '#0a0a0a' }}>Har du spørsmål?</h2>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, padding: '4px 28px' }}>
              {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ background: '#0a0a0a', padding: '88px 24px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, background: '#ff6b00', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <span className="ms" style={{ fontSize: 30, color: '#fff' }}>flight_takeoff</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.8px', color: '#fff', marginBottom: 16, lineHeight: 1.05 }}>
              Klar til å finne din<br />neste drømmereise?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.7 }}>
              Start 7 dager gratis. Ingen kredittkort nødvendig.
            </p>

            {!submitted ? (
              <form onSubmit={handleSignup} style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  required
                  style={{
                    flex: 1, minWidth: 200, padding: '13px 20px', borderRadius: 100,
                    border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                    color: '#fff', fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#ff6b00')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button type="submit" className="cta-btn" style={{ padding: '13px 24px', fontSize: 14 }}>
                  Kom i gang
                </button>
              </form>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 100, padding: '12px 24px', color: '#4ade80', fontWeight: 600, fontSize: 14 }}>
                <span className="ms" style={{ fontSize: 20 }}>check_circle</span>
                Sjekk e-posten din for å fortsette!
              </div>
            )}
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>Deretter 149 kr/mnd · Si opp når som helst</p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, background: '#ff6b00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="ms" style={{ fontSize: 16, color: '#fff' }}>flight_takeoff</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>FlyDeals</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 240 }}>
                Automatisk prisovervåking av flyreiser fra norske flyplasser. Vi finner dealene, du nyter reisen.
              </p>
            </div>
            {[
              { title: 'Produkt', links: [['Live deals', '/deals'], ['Oppdag ruter', '/oppdag'], ['Dine varsler', '/varsler'], ['FAQ', '/brukerstotte']] },
              { title: 'Konto', links: [['Logg inn', '/login'], ['Registrer deg', '/login'], ['Innstillinger', '/innstillinger']] },
              { title: 'Selskap', links: [['Personvern', '/personvern'], ['Vilkår', '/vilkar'], ['Brukerstøtte', '/brukerstotte']] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {links.map(([label, href]) => (
                    <Link key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 FlyDeals. Alle rettigheter reservert.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Sikker betaling via Stripe</p>
          </div>
        </div>
      </footer>
    </>
  );
}
