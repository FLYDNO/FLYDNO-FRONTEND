'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqItems = [
  { q: 'Hva er FlyDeals og hva får jeg?', a: 'FlyDeals overvåker flypriser fra 6 norske flyplasser til 237+ destinasjoner verden over. Når prisene faller betydelig under det normale varsler vi deg på e-post, slik at du kan booke billige flybilletter direkte hos flyselskapet.' },
  { q: 'Hva koster det, og er det bindingstid?', a: '149 kr per måned. De første 7 dagene er helt gratis — ingen kredittkort trengs for prøveperioden. Ingen bindingstid, du kan si opp når som helst.' },
  { q: 'Booker FlyDeals flyet for meg?', a: 'Nei — vi finner dealene, du booker direkte hos flyselskapet. Slik unngår du mellomledd og ekstra gebyrer, og du har full kontroll over bestillingen din.' },
  { q: 'Hvilke flyplasser dekker dere?', a: 'Oslo (OSL), Bergen (BGO), Trondheim (TRD), Stavanger (SVG), Tromsø (TOS) og Torp/Sandefjord (TRF) — til 237+ destinasjoner verden over.' },
  { q: 'Hva er en «deal»?', a: 'En deal er en flypris som er vesentlig lavere enn det vi normalt ser for den ruten. Vi viser deg nøyaktig hvor mye du sparer sammenlignet med vanlig pris.' },
];

const quickLinks = [
  { icon: 'notifications', title: 'Administrer varsler', desc: 'Legg til, endre eller deaktiver varsler', href: '/varsler' },
  { icon: 'mail', title: 'Endre e-postadresse', desc: 'Oppdater kontaktinformasjonen din', href: '/innstillinger' },
  { icon: 'payments', title: 'Abonnement & betaling', desc: 'Se fakturering og si opp abonnement', href: '/innstillinger' },
  { icon: 'history', title: 'Se mottatte deals', desc: 'Oversikt over alle deals sendt til deg', href: '/historikk' },
];

const navItems = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals', key: 'deals' },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler', key: 'varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter', key: 'oppdag' },
  { href: '/historikk', icon: 'history', label: 'Historikk', key: 'historikk' },
];

const bottomItems = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger', key: 'innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte', key: 'brukerstotte' },
];

export default function BrukerstottePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const active = 'brukerstotte';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link { border-left: 3px solid transparent; transition: all 0.2s; }
        .nav-link:hover { background: rgba(255,107,0,0.05); color: #ff6b00; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00 !important; color: #ff6b00; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
        input, textarea, select { font-family: 'DM Sans', sans-serif; background: #050505; border: 1px solid #1e1e1e; color: #f1f5f9; border-radius: 12px; padding: 10px 16px; font-size: 13px; width: 100%; outline: none; box-sizing: border-box; resize: none; }
        input:focus, textarea:focus, select:focus { border-color: #ff6b00; box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .faq-ans { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-ans.open { max-height: 200px; }
        .quick-link:hover { border-color: rgba(255,107,0,0.3) !important; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Sidebar */}
        <aside style={{ width: '256px', flexShrink: 0, borderRight: '1px solid #1e1e1e', background: '#050505', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#ff6b00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,0,0.2)' }}>
              <span className="ms" style={{ fontSize: '18px' }}>flight_takeoff</span>
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>FlyDeals</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Varsler deg om flydeals</p>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={`nav-link${active === item.key ? ' nav-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
                <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
              </Link>
            ))}
            <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '12px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {bottomItems.map((item) => (
                <Link key={item.key} href={item.href} className={`nav-link${active === item.key ? ' nav-active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
                  <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
          <div style={{ padding: '12px', borderTop: '1px solid #1e1e1e' }}>
            <div style={{ background: '#111', borderRadius: '12px', padding: '12px', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)' }}>person</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Marius Jensen</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>marius@flydeals.no</p>
              </div>
              <Link href="/innstillinger" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', flexShrink: 0 }}>
                <span className="ms" style={{ fontSize: '16px' }}>settings</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          <div style={{ height: '56px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700 }}>Brukerstøtte</h2>
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

            {/* Hero */}
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '4px' }}>Hvordan kan vi hjelpe?</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Finn svar i FAQ-en vår, eller send oss en melding.</p>
            </div>

            {/* Quick links */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Ofte stilte spørsmål</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {quickLinks.map((l, i) => (
                  <Link key={i} href={l.href} className="quick-link" style={{ padding: '16px', borderRadius: '16px', background: '#111', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="ms" style={{ padding: '10px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', borderRadius: '12px', fontSize: '20px' }}>{l.icon}</span>
                      <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 700 }}>{l.title}</h3>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{l.desc}</p>
                      </div>
                    </div>
                    <span className="ms" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.3)' }}>arrow_forward</span>
                  </Link>
                ))}
              </div>

              {/* FAQ accordion */}
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>
                {faqItems.map((item, i) => (
                  <div key={i} style={{ borderBottom: i < faqItems.length - 1 ? '1px solid #1e1e1e' : 'none', padding: '0 20px' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', background: 'none', border: 'none', color: '#f1f5f9', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", gap: '16px' }}>
                      {item.q}
                      <span className="ms" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>add</span>
                    </button>
                    <div className={`faq-ans${openFaq === i ? ' open' : ''}`}>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, paddingBottom: '16px' }}>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact form */}
            <section style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '24px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Fant du ikke svaret?</h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Send oss en melding — vi svarer som regel innen 24 timer.</p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <span className="ms" style={{ fontSize: '48px', color: '#ff6b00' }}>check_circle</span>
                  <p style={{ fontWeight: 700, marginTop: '12px' }}>Melding sendt!</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Vi svarer innen 24 timer.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Fullt navn</label>
                    <input type="text" placeholder="Ola Nordmann" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>E-postadresse</label>
                    <input type="email" placeholder="ola@eksempel.no" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Emne</label>
                    <select>
                      <option>Velg kategori</option>
                      <option>Spørsmål om abonnement</option>
                      <option>Problem med deals</option>
                      <option>Teknisk problem</option>
                      <option>Annet</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Melding</label>
                    <textarea rows={4} placeholder="Beskriv spørsmålet ditt..." />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <button onClick={() => setSubmitted(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 15px rgba(255,107,0,0.2)' }}>
                      Send melding<span className="ms" style={{ fontSize: '18px' }}>send</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Contact info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', paddingTop: '32px', borderTop: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="ms" style={{ fontSize: '24px', color: '#ff6b00' }}>mail</span>
                <div>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>E-post</p>
                  <p style={{ fontWeight: 600, fontSize: '13px' }}>hei@flydeals.no</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="ms" style={{ fontSize: '24px', color: '#ff6b00' }}>schedule</span>
                <div>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Svartid</p>
                  <p style={{ fontWeight: 600, fontSize: '13px' }}>Innen 24 timer</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
