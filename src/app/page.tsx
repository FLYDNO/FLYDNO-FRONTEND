'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DEALS = [
  { from: 'Oslo', fromCode: 'OSL', to: 'Firenze', toCode: 'FCO', flag: 'it', price: 849, discount: 38, type: 't/r' },
  { from: 'Bergen', fromCode: 'BGO', to: 'Barcelona', toCode: 'BCN', flag: 'es', price: 520, discount: 44, type: 't/r' },
  { from: 'Stavanger', fromCode: 'SVG', to: 'London', toCode: 'LHR', flag: 'gb', price: 3190, discount: 31, type: 't/r' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: 'th', price: 2489, discount: 47, type: 't/r' },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Roma', toCode: 'FCO', flag: 'it', price: 589, discount: 64, type: 't/r' },
  { from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: 'us', price: 3290, discount: 58, type: 't/r' },
];

const DESTS = [
  { flag: 'es', name: 'Barcelona' }, { flag: 'gb', name: 'London' }, { flag: 'th', name: 'Bangkok' },
  { flag: 'us', name: 'New York' }, { flag: 'jp', name: 'Tokyo' }, { flag: 'it', name: 'Roma' },
  { flag: 'ae', name: 'Dubai' }, { flag: 'fr', name: 'Paris' }, { flag: 'de', name: 'Berlin' },
  { flag: 'gr', name: 'Aten' }, { flag: 'pt', name: 'Lisboa' }, { flag: 'id', name: 'Bali' },
  { flag: 'sg', name: 'Singapore' }, { flag: 'ma', name: 'Marrakech' }, { flag: 'tr', name: 'Istanbul' },
  { flag: 'mx', name: 'Mexico City' }, { flag: 'br', name: 'São Paulo' }, { flag: 'au', name: 'Sydney' },
  { flag: 'in', name: 'Mumbai' }, { flag: 'za', name: 'Cape Town' }, { flag: 'ca', name: 'Toronto' },
  { flag: 'nz', name: 'Auckland' }, { flag: 'ar', name: 'Buenos Aires' }, { flag: 'cn', name: 'Shanghai' },
];

const FAQS = [
  { q: 'Hvilke flyplasser overvåker dere?', a: 'Vi overvåker per dags dato Oslo (OSL), Bergen (BGO), Stavanger (SVG), Trondheim (TRD), Tromsø (TOS) og Sandefjord/Torp (TRF).' },
  { q: 'Hvor mye kan jeg forvente å spare?', a: 'Det varierer per rute og sesong. Vi varsler kun når prisen er vesentlig lavere enn det vi normalt ser for den ruten. Mange brukere sparer tusenvis av kroner per reise.' },
  { q: 'Må jeg bestille gjennom dere?', a: 'Nei – du booker direkte hos flyselskapet via Google Flights. Vi er kun et varslingsverktøy, ikke en bestillingstjeneste.' },
  { q: 'Kan jeg si opp når som helst?', a: 'Ja, du kan si opp abonnementet til enhver tid via dine innstillinger. Ingen spørsmål stilt, ingen skjulte gebyrer.' },
  { q: 'Hva skjer etter prøveperioden?', a: 'Etter 7 dager gratis starter abonnementet på 149 kr/mnd. Du kan enkelt si opp før prøveperioden er over uten å bli belastet.' },
  { q: 'Hvordan viser dere tur/retur vs. enkel?', a: 'Alle deals er tydelig merket med "t/r" for tur/retur eller "enkel" for enveisbilletter. Vi viser begge typer når vi finner gode tilbud.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 0', background: 'none', border: 'none', color: open ? '#ff6b00' : '#f0f0f0',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'left', gap: 16,
          transition: 'color 0.2s',
        }}
      >
        {q}
        <span className="ms" style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>add</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease', paddingBottom: open ? 20 : 0 }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [dealCount] = useState(847);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const tickerItems = [...DESTS, ...DESTS];

  return (
    <div style={{ background: '#050505', color: '#f0f0f0', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(5,5,5,0.95)' : 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#ff6b00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="ms" style={{ fontSize: 16, color: '#fff' }}>flight_takeoff</span>
            </div>
            FlyDeals
          </Link>
          {/* Desktop nav */}
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13 }}>
            <Link href="/deals" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Deals</Link>
            <a href="#how" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Hvordan det fungerer</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Pris</a>
            <a href="#om" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>FAQ</a>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Logg inn</Link>
            <Link href="/login" style={{ padding: '8px 18px', background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
              Prøv gratis
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button className="nav-mobile-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 4 }}>
            <span className="ms" style={{ fontSize: 24 }}>{mobileMenu ? 'close' : 'menu'}</span>
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/deals" onClick={() => setMobileMenu(false)} style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '8px 0' }}>Deals</Link>
            <a href="#how" onClick={() => setMobileMenu(false)} style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '8px 0' }}>Hvordan det fungerer</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '8px 0' }}>Pris</a>
            <a href="#om" onClick={() => setMobileMenu(false)} style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '8px 0' }}>FAQ</a>
            <Link href="/login" onClick={() => setMobileMenu(false)} style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '8px 0' }}>Logg inn</Link>
            <Link href="/login" onClick={() => setMobileMenu(false)} style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#ff6b00', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              Start gratis prøveperiode
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,107,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 24,
              }}>
                <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                {dealCount}+ deals funnet
              </div>
              <h1 className="hero-title" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.03, letterSpacing: '-2.5px', marginBottom: 20 }}>
                Billige flyreiser.<br />
                <span style={{ color: '#ff6b00' }}>Funnet for deg.</span>
              </h1>
              <p className="hero-subtitle" style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
                Vi overvåker kontinuerlig billettsystemene ved de største nordiske flyplassene for å finne de største prisavslagene for deg. Spar tusenvis på din neste drømmereise.
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/login" className="btn-primary" style={{ padding: '13px 26px', fontSize: 14 }}>
                  Prøv gratis i dag
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
                </Link>
                <a href="#how" className="btn-outline-dark" style={{ padding: '13px 22px', fontSize: 14 }}>
                  Se hvordan det fungerer
                </a>
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap' }}>
                {['7 dager gratis', 'Ingen binding', 'Fri til å stoppe'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    <svg width="13" height="13" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round"><path d="M2 6.5l3.5 3.5 5.5-6" /></svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right – Deal preview card */}
            <div className="hero-right">
              <div style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                  Siste deals
                </div>
                {[
                  { from: 'fra Oslo (OSL)', dest: 'New York', flag: 'us', price: '2 890 kr', unit: 't/r', disc: '-41%' },
                  { from: 'fra Bergen (BGO)', dest: 'London', flag: 'gb', price: '489 kr', unit: 'enkel', disc: '-52%' },
                  { from: 'fra Oslo (OSL)', dest: 'Bangkok', flag: 'th', price: '2 489 kr', unit: 't/r', disc: '-47%' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{d.from}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px' }}>
                        {d.dest} <img src={`https://flagcdn.com/16x12/${d.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2, marginBottom: 1 }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#ff6b00', letterSpacing: '-0.5px' }}>{d.price}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{d.unit}</div>
                      <div style={{ display: 'inline-block', padding: '2px 7px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 4, fontSize: 10, fontWeight: 700, color: '#22c55e', marginTop: 3 }}>{d.disc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(255,107,0,0.07)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ms" style={{ fontSize: 16, color: '#ff6b00' }}>public</span>
                Overvåker 237+ destinasjoner fra 6 norske flyplasser
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATION TICKER */}
      <div style={{ overflow: 'hidden', padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0a0a0a', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 60, background: 'linear-gradient(to right, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 60, background: 'linear-gradient(to left, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', gap: 10, width: 'max-content', animation: 'ticker 42s linear infinite' }}>
          {tickerItems.map((d, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
              <img src={`https://flagcdn.com/16x12/${d.flag}.png`} alt="" style={{ borderRadius: 2 }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
            <div>
              <div className="stats-number" style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px' }}>6<span style={{ color: '#ff6b00' }}>+</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4, fontWeight: 600 }}>Norske flyplasser</div>
            </div>
            <div>
              <div className="stats-number" style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px' }}>237<span style={{ color: '#ff6b00' }}>+</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4, fontWeight: 600 }}>Destinasjoner</div>
            </div>
            <div>
              <div className="stats-number" style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px', color: '#ff6b00' }}>389 kr</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4, fontWeight: 600 }}>Laveste pris nå</div>
            </div>
          </div>
        </div>
      </section>

      {/* EARTH SECTION */}
      <section className="earth-section" style={{ position: 'relative', height: 620, overflow: 'hidden', margin: 0 }}>
        <Image src="/earth.jpg" alt="Jordklode" fill style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #050505 0%, transparent 18%, transparent 82%, #050505 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.6) 0%, transparent 18%, transparent 82%, rgba(5,5,5,0.6) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 620, padding: '0 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.35)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#ff6b00', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, background: '#ff6b00', borderRadius: '50%', display: 'inline-block' }} />
              Global dekning
            </div>
            <h2 className="earth-title" style={{ fontSize: 44, fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px' }}>
              Vi finner deals over<br />hele verden
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', margin: '0 0 32px' }}>
              Fra Skandinavia til 237+ destinasjoner
            </p>
            <div className="earth-badges" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {[
                { text: 'Overvåker kontinuerlig', dot: true },
                { text: '6 norske flyplasser' },
                { text: '237+ destinasjoner' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(5,5,5,0.82)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '10px 18px', fontSize: 13, color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
                  {item.dot && <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }} />}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEALS */}
      <section style={{ padding: '70px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#ff6b00', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                <span style={{ width: 5, height: 5, background: '#ff6b00', borderRadius: '50%' }} />
                Siste funn
              </div>
              <h2 className="section-title" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px' }}>Aktuelle reisedeals akkurat nå</h2>
            </div>
            <Link href="/deals" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
              Se alle deals <span className="ms" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {DEALS.slice(0, 6).map((deal, i) => (
              <div key={i} className="fade-up" style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: 20, transition: 'border-color 0.25s, transform 0.25s', cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>fra</span>
                  <span style={{ background: 'rgba(255,255,255,0.10)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{deal.fromCode}</span>
                  <span>{deal.from}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 12 }}>
                  {deal.to} <img src={`https://flagcdn.com/16x12/${deal.flag}.png`} alt="" style={{ display: 'inline', verticalAlign: 'middle', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#ff6b00', letterSpacing: '-1px' }}>
                      {deal.price.toLocaleString('no')} kr <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>{deal.type}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '4px 10px' }}>
                    -{deal.discount}%
                  </div>
                </div>
                <Link href="/deals" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
                  Se reisemuligheter
                  <span className="ms" style={{ fontSize: 14 }}>arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/login" className="btn-primary" style={{ padding: '13px 26px' }}>
              Start 7 dager gratis
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#ff6b00', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, background: '#ff6b00', borderRadius: '50%' }} />
              Slik fungerer det
            </div>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>Tre steg til billigere reiser</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>Vi gjør jobben. Du får feriene.</p>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 44 }}>
            {[
              { step: 'Steg 01', icon: 'schedule', title: 'Vi overvåker prisene', desc: 'Algoritmene våre sjekker flypriser kontinuerlig og bygger opp et bilde av hva som er normalt – og hva som er tilbud.' },
              { step: 'Steg 02', icon: 'mail', title: 'Du får et varsel', desc: 'Når vi finner en pris som er vesentlig lavere enn normalt, sender vi deg et varsel direkte på e-post.' },
              { step: 'Steg 03', icon: 'check_circle', title: 'Du booker og sparer', desc: 'Book direkte hos flyselskapet til den lave prisen. Ingen mellomledd, ingen ekstra kostnader.' },
            ].map((card, i) => (
              <div key={i} className="fade-up" style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b00', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{card.step}</div>
                <div style={{ width: 40, height: 40, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00', marginBottom: 16 }}>
                  <span className="ms" style={{ fontSize: 18 }}>{card.icon}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 44 }}>Alt du trenger for<br />billigere flyreiser</h2>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: 'price_check', title: 'Transparent prising', desc: 'Vi viser alltid prisen mot det historiske snittet, slik at du kan se nøyaktig hvor mye du sparer.' },
              { icon: 'autorenew', title: 'Automatisk overvåking', desc: 'Prisene sjekkes automatisk slik at du aldri trenger å gjøre det manuelt.' },
              { icon: 'open_in_new', title: 'Direkte booking', desc: 'Vi sender deg direkte til flyselskapet. Ingen mellomledd eller ekstra kostnader.' },
              { icon: 'public', title: 'Nordisk dekning', desc: 'Vi overvåker de største flyplassene i Norden for å finne de beste prisene.' },
              { icon: 'dashboard', title: 'Enkel oversikt', desc: 'På ditt dashboard er det enkelt å finne den neste flyvningen til en nesten umulig pris.' },
              { icon: 'savings', title: 'Spar tid og penger', desc: 'Vi gjør prisovervåkingen, du nyter reisen til en brøkdel av ordinærprisen.' },
            ].map((feat, i) => (
              <div key={i} className="fade-up" style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: 24 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00', marginBottom: 14 }}>
                  <span className="ms" style={{ fontSize: 17 }}>{feat.icon}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 7, letterSpacing: '-0.3px' }}>{feat.title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>Invester i billigere reiser</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>Spar inn hele årsmedlemskapet på din første bestilling.</p>
          </div>
          <div style={{ maxWidth: 460, margin: '44px auto 0' }}>
            <div className="pricing-card" style={{ background: '#242424', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 20, padding: 44 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 22 }}>
                <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} />
                7 dager gratis prøveperiode
              </div>
              <div className="pricing-price" style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 4 }}>
                149 kr <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: 0 }}>/ mnd</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 28 }}>Full tilgang til alt – ingen skjulte kostnader</p>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {['Alle deals – ingen begrensninger', 'Sanntids e-postvarsler', '6+ norske flyplasser overvåket', 'Tur/retur og enveisbilletter', 'Ingen bindingstid'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', fontSize: 14, color: 'rgba(255,255,255,0.75)', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    <svg width="14" height="14" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round"><path d="M2 7l4 4 6-6" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-primary" style={{ display: 'block', width: '100%', padding: 15, textAlign: 'center', fontSize: 15 }}>
                Start gratis prøveperiode
              </Link>
              <p style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Avbrytes enkelt via innstillinger – ingen spørsmål stilt</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="om" style={{ padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#ff6b00', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, background: '#ff6b00', borderRadius: '50%' }} />
              Spørsmål &amp; svar
            </div>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 40 }}>Ofte stilte spørsmål</h2>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 0 36px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="grid-footer" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, background: '#ff6b00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="ms" style={{ fontSize: 14, color: '#fff' }}>flight_takeoff</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800 }}>FlyDeals</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 240 }}>
                Automatisk prisovervåking av flyreiser fra de største nordiske flyplassene for å finne drømmereisen for billigere pris.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Produkt</h4>
              {[['Live deals', '/deals'], ['Oppdag ruter', '/oppdag'], ['Dine varsler', '/varsler'], ['FAQ', '#om']].map(([label, href]) => (
                <Link key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 9 }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Selskap</h4>
              {[['Personvern', '/personvern'], ['Vilkår', '/vilkar'], ['Hjelp', '/brukerstotte']].map(([label, href]) => (
                <Link key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 9 }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Følg oss</h4>
              {[['Twitter / X', '#'], ['Instagram', '#']].map(([label, href]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 9 }}>{label}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            <span>&copy; 2026 FlyDeals. Alle rettigheter reservert.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
