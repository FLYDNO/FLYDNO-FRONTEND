'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const DESTS = [
  {c:'es',n:'Barcelona'},{c:'gb',n:'London'},{c:'th',n:'Bangkok'},
  {c:'us',n:'New York'},{c:'jp',n:'Tokyo'},{c:'it',n:'Roma'},
  {c:'ae',n:'Dubai'},{c:'fr',n:'Paris'},{c:'de',n:'Berlin'},
  {c:'gr',n:'Aten'},{c:'pt',n:'Lisboa'},{c:'id',n:'Bali'},
  {c:'sg',n:'Singapore'},{c:'ma',n:'Marrakech'},{c:'tr',n:'Istanbul'},
  {c:'ca',n:'Toronto'},{c:'au',n:'Sydney'},{c:'is',n:'Reykjavik'},
  {c:'za',n:'Cape Town'},{c:'nl',n:'Amsterdam'},{c:'cz',n:'Praha'},
  {c:'hr',n:'Dubrovnik'},{c:'mx',n:'Mexico City'},{c:'in',n:'Mumbai'},
  {c:'eg',n:'Kairo'},{c:'kr',n:'Seoul'},{c:'mv',n:'Maldivene'},
  {c:'ee',n:'Tallinn'},{c:'co',n:'Bogotá'},{c:'br',n:'Rio de Janeiro'},
];

const Flag = ({code}: {code: string}) => (
  <span className={`fi fi-${code} fis`} style={{width:'1.1em',height:'0.85em',display:'inline-block',verticalAlign:'middle',marginBottom:'1px',borderRadius:'2px'}}></span>
);

const faqs = [
  { q: 'Hvilke flyplasser overvåker dere?', a: 'Vi overvåker per dags dato Oslo (OSL), Bergen (BGO), Stavanger (SVG), Trondheim (TRD), Tromsø (TOS) og Sandefjord/Torp (TRF).' },
  { q: 'Hvor mye kan jeg forvente å spare?', a: 'Det varierer per rute og sesong. Vi varsler kun når prisen er vesentlig lavere enn det vi normalt ser for den ruten. Mange brukere sparer tusenvis av kroner per reise.' },
  { q: 'Må jeg bestille gjennom dere?', a: 'Nei — du booker direkte hos flyselskapet via Google Flights. Vi er kun et varslingsverktøy, ikke en bestillingstjeneste.' },
  { q: 'Kan jeg si opp når som helst?', a: 'Ja, du kan si opp abonnementet til enhver tid via dine innstillinger. Ingen spørsmål stilt, ingen skjulte gebyrer.' },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dealCount, setDealCount] = useState(0);

  useEffect(() => {
    let n = 0;
    const target = 847;
    const step = target / 50;
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      setDealCount(Math.floor(n));
      if (n >= target) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #050505; color: #f0f0f0; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 3px; }

        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(5,5,5,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; }
        .nav-logo-icon { width: 28px; height: 28px; background: #ff6b00; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
        .nav-links { display: flex; align-items: center; gap: 24px; font-size: 13px; }
        .nav-links a { color: rgba(255,255,255,0.6); transition: color 0.2s; font-weight: 500; }
        .nav-links a:hover { color: #fff; }
        .nav-btn { padding: 8px 18px; background: #ff6b00; color: #fff; border-radius: 100px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; transition: background 0.2s; }
        .nav-btn:hover { background: #e55f00; }
        .nav-login { color: rgba(255,255,255,0.6) !important; font-size: 13px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.7); border-radius: 2px; transition: all 0.3s; }
        .mobile-menu { position: fixed; top: 56px; left: 0; right: 0; background: rgba(5,5,5,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 24px 24px; z-index: 99; flex-direction: column; gap: 4px; }
        .mobile-menu a { display: block; padding: 12px 0; color: rgba(255,255,255,0.7); font-size: 15px; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.06); transition: color 0.2s; }
        .mobile-menu a:last-child { border-bottom: none; }
        .mob-btn { display: inline-block; margin-top: 12px; padding: 12px 24px; background: #ff6b00; color: #fff !important; border-radius: 100px; font-weight: 700; font-size: 14px; text-align: center; border-bottom: none !important; }

        @media (max-width: 640px) {
          .hamburger { display: flex; }
          .nav-links { display: none; }
          .section-title { font-size: 30px !important; }
          .stat-num { font-size: 32px !important; }
          .hero { padding: 100px 0 60px !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .how-grid, .features-grid, .deals-cards { grid-template-columns: 1fr !important; }
          .stats-grid { gap: 20px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .hero h1 { font-size: 40px !important; }
        }

        .hero { padding: 120px 0 80px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse 60% 50% at 80% 30%, rgba(255,107,0,0.05) 0%, transparent 70%); pointer-events: none; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 100px; font-size: 12px; font-weight: 600; color: #22c55e; margin-bottom: 24px; }
        .hero-badge .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { opacity:0.8; box-shadow: 0 0 0 5px rgba(34,197,94,0); } }
        .hero h1 { font-size: 58px; font-weight: 900; line-height: 1.03; letter-spacing: -2.5px; margin-bottom: 20px; }
        .hero h1 .orange { color: #ff6b00; }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 32px; max-width: 440px; }
        .hero-btns { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 13px 26px; background: #ff6b00; color: #fff; border-radius: 100px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #e55f00; transform: translateY(-1px); }
        .btn-outline { display: inline-flex; align-items: center; gap: 6px; padding: 13px 22px; background: transparent; color: rgba(255,255,255,0.8); border-radius: 100px; font-size: 14px; font-weight: 500; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
        .hero-trust { display: flex; gap: 18px; margin-top: 22px; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.55); }
        .trust-item .ms { color: #ff6b00; }

        .deal-preview-card { background: #242424; border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 20px; }
        .deal-preview-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        .deal-preview-label .live-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        .deal-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .deal-row:last-child { border: none; }
        .deal-from { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
        .deal-dest { font-size: 14px; font-weight: 800; letter-spacing: -0.3px; }
        .deal-price-col { text-align: right; }
        .deal-price-val { font-size: 17px; font-weight: 900; color: #ff6b00; letter-spacing: -0.5px; }
        .deal-price-unit { font-size: 10px; color: rgba(255,255,255,0.4); }
        .deal-badge { display: inline-block; padding: 2px 7px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); border-radius: 4px; font-size: 10px; font-weight: 700; color: #22c55e; margin-top: 3px; }
        .hero-map-hint { margin-top: 12px; padding: 12px 16px; background: rgba(255,107,0,0.07); border: 1px solid rgba(255,107,0,0.15); border-radius: 10px; font-size: 11px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 8px; }

        .stats { padding: 60px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; text-align: center; }
        .stat-num { font-size: 44px; font-weight: 900; letter-spacing: -2px; }
        .stat-num .orange { color: #ff6b00; }
        .stat-lbl { font-size: 12px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; font-weight: 600; }

        .section { padding: 90px 0; }
        .section-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; color: #ff6b00; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
        .section-tag .dot { width: 5px; height: 5px; background: #ff6b00; border-radius: 50%; }
        .section-title { font-size: 40px; font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 12px; }
        .section-sub { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; }

        .deals-strip { padding: 70px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .deals-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 40px; }
        .deal-card { background: #242424; border: 1px solid rgba(255,255,255,0.10); border-radius: 14px; padding: 20px; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.25s; }
        .deal-card:hover { border-color: rgba(255,107,0,0.35); transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); background: #2c2c2c; }
        .deal-card-from { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 8px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .deal-card-from .iata { background: rgba(255,255,255,0.10); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
        .deal-card-dest { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 12px; }
        .deal-card-footer { display: flex; align-items: flex-end; justify-content: space-between; }
        .deal-card-price { font-size: 28px; font-weight: 900; color: #ff6b00; letter-spacing: -1px; }
        .deal-card-price span { font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.35); }
        .deal-card-discount { font-size: 12px; font-weight: 700; color: #22c55e; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 6px; padding: 4px 10px; }
        .deal-card-book { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4); margin-top: 12px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.08); width: 100%; transition: color 0.2s; }
        .deal-card:hover .deal-card-book { color: #ff6b00; }

        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
        .how-card { background: #242424; border: 1px solid rgba(255,255,255,0.10); border-radius: 14px; padding: 28px; transition: border-color 0.25s, transform 0.25s, background 0.25s; }
        .how-card:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-4px); background: #2c2c2c; }
        .how-step { font-size: 10px; font-weight: 700; color: #ff6b00; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
        .how-icon { width: 40px; height: 40px; background: rgba(255,107,0,0.1); border: 1px solid rgba(255,107,0,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ff6b00; margin-bottom: 16px; }
        .how-card h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.4px; margin-bottom: 10px; }
        .how-card p { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.7; }
        .how-mini { margin-top: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; padding: 12px; }
        .how-mini-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; font-size: 12px; }
        .how-mini-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.07); }
        .how-mini-price { font-weight: 800; color: #ff6b00; }
        .how-mini-badge { padding: 2px 6px; background: rgba(34,197,94,0.1); border-radius: 3px; font-size: 10px; font-weight: 700; color: #22c55e; }

        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
        .feat-card { background: #242424; border: 1px solid rgba(255,255,255,0.10); border-radius: 14px; padding: 24px; transition: border-color 0.25s, transform 0.25s, background 0.25s; }
        .feat-card:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-4px); background: #2c2c2c; }
        .feat-icon { width: 36px; height: 36px; background: rgba(255,107,0,0.1); border: 1px solid rgba(255,107,0,0.12); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #ff6b00; margin-bottom: 14px; }
        .feat-card h3 { font-size: 14px; font-weight: 800; margin-bottom: 7px; letter-spacing: -0.3px; }
        .feat-card p { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.7; }

        .pricing { padding: 90px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .pricing-inner { max-width: 460px; margin: 44px auto 0; }
        .pricing-card { background: #242424; border: 1px solid rgba(255,107,0,0.25); border-radius: 20px; padding: 44px; }
        .trial-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #22c55e; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 100px; margin-bottom: 22px; }
        .trial-badge .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .price-big { font-size: 52px; font-weight: 900; letter-spacing: -2.5px; margin-bottom: 4px; }
        .price-big span { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.4); letter-spacing: 0; }
        .price-desc { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 28px; }
        .price-features { list-style: none; margin-bottom: 28px; }
        .price-features li { display: flex; align-items: center; gap: 10px; padding: 10px 0; font-size: 14px; color: rgba(255,255,255,0.75); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .price-features li:last-child { border: none; }
        .price-features li .ms { color: #ff6b00; flex-shrink: 0; }
        .price-btn { display: block; width: 100%; padding: 15px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; text-align: center; cursor: pointer; border: none; background: #ff6b00; color: #fff; transition: all 0.2s; text-decoration: none; }
        .price-btn:hover { background: #e55f00; transform: translateY(-1px); }
        .price-note { margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.35); text-align: center; }

        .faq { padding: 90px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .faq-list { max-width: 700px; margin: 40px auto 0; }
        .faq-item { border-bottom: 1px solid rgba(255,255,255,0.09); }
        .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 22px 0; background: none; border: none; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; text-align: left; gap: 16px; transition: color 0.2s; }
        .faq-btn:hover { color: #ff6b00; }
        .faq-icon { font-size: 18px; color: rgba(255,255,255,0.4); transition: transform 0.3s; flex-shrink: 0; }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-ans { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
        .faq-item.open .faq-ans { max-height: 200px; padding-bottom: 20px; }
        .faq-ans p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.8; }

        .footer { padding: 60px 0 36px; border-top: 1px solid rgba(255,255,255,0.08); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
        .footer-brand p { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; margin-top: 12px; max-width: 240px; }
        .footer-col h4 { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px; }
        .footer-col a { display: block; font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 9px; transition: color 0.2s; }
        .footer-col a:hover { color: rgba(255,255,255,0.9); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.35); }

        .ticker-wrap { overflow: hidden; padding: 15px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); background: #0a0a0a; position: relative; }
        .ticker-wrap::before, .ticker-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .ticker-wrap::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .ticker-wrap::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .ticker-track { display: flex; gap: 10px; width: max-content; animation: ticker 42s linear infinite; }
        .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .t-dest { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); border: 1px solid transparent; white-space: nowrap; transition: color 0.18s, border-color 0.18s, background 0.18s; cursor: default; }
        .t-dest:hover { color: #fff; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
      `}</style>

      <div style={{ background: '#050505', color: '#f0f0f0' }}>

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              <div className="nav-logo-icon">
                <span className="ms" style={{ fontSize: '16px', color: '#fff' }}>flight_takeoff</span>
              </div>
              FlyDeals
            </Link>
            <div className="nav-links">
              <Link href="/deals">Deals</Link>
              <a href="#how">Hvordan det fungerer</a>
              <Link href="/login" className="nav-login">Logg inn</Link>
              <Link href="/login" className="nav-btn">Prøv gratis</Link>
            </div>
            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Meny">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mobile-menu" style={{ display: 'flex' }}>
            <a href="#how" onClick={() => setMobileOpen(false)}>Hvordan det fungerer</a>
            <Link href="/login">Logg inn</Link>
            <Link href="/login" className="mob-btn">Prøv gratis</Link>
          </div>
        )}

        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-badge">
                  <span className="dot"></span>
                  <span>{dealCount}+ deals funnet</span>
                </div>
                <h1>Billige flyreiser.<br /><span className="orange">Funnet for deg.</span></h1>
                <p className="hero-sub">Vi overvåker kontinuerlig billettsystemene ved de største nordiske flyplassene for å finne de største prisavslagene for deg. Spar tusenvis på din neste drømmereise.</p>
                <div className="hero-btns">
                  <Link href="/login" className="btn-primary">
                    Prøv gratis i dag
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7h8M8 4l3 3-3 3"/></svg>
                  </Link>
                  <a href="#how" className="btn-outline">Se hvordan det fungerer</a>
                </div>
                <div className="hero-trust">
                  {['7 dager gratis', 'Ingen binding', 'Fri til å stoppe'].map(t => (
                    <span key={t} className="trust-item">
                      <svg width="13" height="13" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round"><path d="M2 6.5l3.5 3.5 5.5-6"/></svg>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero right */}
              <div className="hero-right">
                <div className="deal-preview-card">
                  <div className="deal-preview-label">
                    <span className="live-dot"></span> Siste deals
                  </div>
                  {[
                    { from: 'Oslo (OSL)', dest: 'New York', flag: 'us', price: '2 890 kr', unit: 't/r', pct: '-41%' },
                    { from: 'Bergen (BGO)', dest: 'London', flag: 'gb', price: '489 kr', unit: 'enkel', pct: '-52%' },
                    { from: 'Oslo (OSL)', dest: 'Bangkok', flag: 'th', price: '2 489 kr', unit: 't/r', pct: '-47%' },
                  ].map((d, i) => (
                    <div key={i} className="deal-row">
                      <div>
                        <div className="deal-from">fra {d.from}</div>
                        <div className="deal-dest">{d.dest} <Flag code={d.flag} /></div>
                      </div>
                      <div className="deal-price-col">
                        <div className="deal-price-val">{d.price}</div>
                        <div className="deal-price-unit">{d.unit}</div>
                        <div className="deal-badge">{d.pct}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hero-map-hint">
                  <span className="ms" style={{ fontSize: '16px', color: '#ff6b00' }}>public</span>
                  Overvåker 237+ destinasjoner fra 6 norske flyplasser
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESTINATION TICKER */}
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...DESTS, ...DESTS].map((d, i) => (
              <div key={i} className="t-dest">
                <Flag code={d.c} />{d.n}
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              <div>
                <div className="stat-num">6<span className="orange">+</span></div>
                <div className="stat-lbl">Norske flyplasser</div>
              </div>
              <div>
                <div className="stat-num">237<span className="orange">+</span></div>
                <div className="stat-lbl">Destinasjoner</div>
              </div>
              <div>
                <div className="stat-num" style={{ color: '#ff6b00' }}>389 kr</div>
                <div className="stat-lbl">Laveste pris nå</div>
              </div>
            </div>
          </div>
        </section>

        {/* EARTH SECTION */}
        <section style={{ position: 'relative', height: '620px', overflow: 'hidden', margin: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/earth.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #050505 0%, transparent 12%, transparent 88%, #050505 100%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.35) 0%, transparent 15%, transparent 85%, rgba(5,5,5,0.35) 100%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: '620px', padding: '0 24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.35)', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 600, color: '#ff6b00', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
                <span style={{ width: '6px', height: '6px', background: '#ff6b00', borderRadius: '50%', display: 'inline-block' }}></span>
                Global dekning
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '44px', fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px' }}>
                Vi finner deals over<br />hele verden
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '17px', color: 'rgba(255,255,255,0.65)', margin: '0 0 32px' }}>
                Fra Skandinavia til 237+ destinasjoner
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,5,5,0.82)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '10px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
                  <span style={{ width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></span>
                  6 flyplasser overvåket
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,5,5,0.82)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '10px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
                  <span className="ms" style={{ fontSize: '16px', color: '#ff6b00' }}>explore</span>
                  237+ destinasjoner
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE DEALS STRIP */}
        <section className="deals-strip">
          <div className="container">
            <div className="section-tag"><span className="dot"></span> Siste funn</div>
            <h2 className="section-title" style={{ fontSize: '32px', letterSpacing: '-1px' }}>Aktuelle reisedeals akkurat nå</h2>
            <div className="deals-cards">
              {[
                { iata: 'OSL', airport: 'Oslo Gardermoen', dest: 'Firenze', flag: 'it', price: '849 kr', unit: 't/r', pct: '-38%' },
                { iata: 'BGO', airport: 'Bergen Flesland', dest: 'Barcelona', flag: 'es', price: '520 kr', unit: 't/r', pct: '-44%' },
                { iata: 'SVG', airport: 'Stavanger Sola', dest: 'London', flag: 'gb', price: '3 190 kr', unit: 't/r', pct: '-31%' },
              ].map((d, i) => (
                <div key={i} className="deal-card">
                  <div className="deal-card-from">
                    <span>fra</span>
                    <span className="iata">{d.iata}</span>
                    <span>{d.airport}</span>
                  </div>
                  <div className="deal-card-dest">{d.dest} <Flag code={d.flag} /></div>
                  <div className="deal-card-footer">
                    <div>
                      <div className="deal-card-price">{d.price} <span>{d.unit}</span></div>
                    </div>
                    <div className="deal-card-discount">{d.pct}</div>
                  </div>
                  <Link href="/login" className="deal-card-book">
                    Registrer deg for å se dealen
                    <span className="ms" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div className="section-tag" style={{ justifyContent: 'center' }}><span className="dot"></span> Slik fungerer det</div>
              <h2 className="section-title">Tre steg til billigere reiser</h2>
              <p className="section-sub">Vi gjør jobben. Du får feriene.</p>
            </div>
            <div className="how-grid">
              <div className="how-card">
                <div className="how-step">Steg 01</div>
                <div className="how-icon"><span className="ms" style={{ fontSize: '18px' }}>schedule</span></div>
                <h3>Vi overvåker prisene</h3>
                <p>Algoritmene våre sjekker flypriser kontinuerlig og bygger opp et bilde av hva som er normalt — og hva som er tilbud.</p>
              </div>
              <div className="how-card">
                <div className="how-step">Steg 02</div>
                <div className="how-icon"><span className="ms" style={{ fontSize: '18px' }}>mail</span></div>
                <h3>Du får et varsel</h3>
                <p>Når vi finner en pris som er vesentlig lavere enn normalt, sender vi deg et varsel direkte på e-post.</p>
                <div className="how-mini">
                  <div className="how-mini-row">
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>OSL → Bangkok</span>
                    <span className="how-mini-price">2 489 kr</span>
                  </div>
                  <div className="how-mini-row">
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>BGO → London</span>
                    <span className="how-mini-price">489 kr</span>
                  </div>
                  <div className="how-mini-row" style={{ border: 'none', paddingTop: '8px' }}>
                    <span className="how-mini-badge">-47% under snitt</span>
                  </div>
                </div>
              </div>
              <div className="how-card">
                <div className="how-step">Steg 03</div>
                <div className="how-icon"><span className="ms" style={{ fontSize: '18px' }}>check_circle</span></div>
                <h3>Du booker og sparer</h3>
                <p>Book direkte hos flyselskapet til den lave prisen. Ingen mellomledd, ingen ekstra kostnader.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="section-title">Alt du trenger for<br />billigere flyreiser</h2>
            </div>
            <div className="features-grid">
              {[
                { icon: 'price_check', title: 'Transparent prising', desc: 'Vi viser alltid prisen mot det historiske snittet, slik at du kan se nøyaktig hvor mye du sparer.' },
                { icon: 'autorenew', title: 'Automatisk overvåking', desc: 'Prisene sjekkes automatisk slik at du aldri trenger å gjøre det manuelt.' },
                { icon: 'open_in_new', title: 'Direkte booking', desc: 'Vi sender deg direkte til flyselskapet. Ingen mellomledd eller ekstra kostnader.' },
                { icon: 'public', title: 'Nordisk dekning', desc: 'Vi overvåker de største flyplassene i Norden for å finne de beste prisene.' },
                { icon: 'dashboard', title: 'Enkel oversikt', desc: 'På ditt dashboard er det enkelt å finne den neste flyvningen til en nesten umulig pris.' },
                { icon: 'savings', title: 'Spar tid og penger', desc: 'Vi gjør prisovervåkingen, du nyter reisen til en brøkdel av ordinærprisen.' },
              ].map((f, i) => (
                <div key={i} className="feat-card">
                  <div className="feat-icon"><span className="ms" style={{ fontSize: '17px' }}>{f.icon}</span></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing" id="pricing">
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <h2 className="section-title">Invester i billigere reiser</h2>
              <p className="section-sub">Spar inn hele årsmedlemskapet på din første bestilling.</p>
            </div>
            <div className="pricing-inner">
              <div className="pricing-card">
                <div className="trial-badge"><span className="dot"></span> 7 dager gratis prøveperiode</div>
                <div className="price-big">149 kr <span>/ mnd</span></div>
                <p className="price-desc">Full tilgang til alt — ingen skjulte kostnader</p>
                <ul className="price-features">
                  {[
                    'Alle deals — ingen begrensninger',
                    'Sanntids e-postvarsler',
                    '6+ norske flyplasser overvåket',
                    'Ingen bindingstid',
                  ].map((f, i) => (
                    <li key={i}>
                      <svg width="14" height="14" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round"><path d="M2 7l4 4 6-6"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="price-btn">Start gratis prøveperiode</Link>
                <p className="price-note">Avbrytes enkelt via innstillinger — ingen spørsmål stilt</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="om">
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <div className="section-tag" style={{ justifyContent: 'center' }}><span className="dot"></span> Spørsmål & svar</div>
              <h2 className="section-title">Ofte stilte spørsmål</h2>
            </div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <span className="ms faq-icon">add</span>
                  </button>
                  <div className="faq-ans"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="nav-logo" style={{ display: 'inline-flex', marginBottom: '8px' }}>
                  <div className="nav-logo-icon"><span className="ms" style={{ fontSize: '14px', color: '#fff' }}>flight_takeoff</span></div>
                  <span style={{ fontSize: '15px', fontWeight: 800 }}>FlyDeals</span>
                </div>
                <p>Automatisk prisovervåking av flyreiser fra de største nordiske flyplassene for å finne drømmereisen for billigere pris.</p>
              </div>
              <div className="footer-col">
                <h4>Produkt</h4>
                <Link href="/deals">Live deals</Link>
                <Link href="/oppdag">Oppdag ruter</Link>
                <Link href="/varsler">Dine varsler</Link>
                <Link href="/brukerstotte">FAQ</Link>
              </div>
              <div className="footer-col">
                <h4>Selskap</h4>
                <a href="#">Personvern</a>
                <a href="#">Vilkår</a>
                <Link href="/brukerstotte">Hjelp</Link>
              </div>
              <div className="footer-col">
                <h4>Følg oss</h4>
                <a href="https://x.com" target="_blank" rel="noopener">Twitter / X</a>
                <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 FlyDeals. Alle rettigheter reservert.</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
