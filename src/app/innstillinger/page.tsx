'use client';

import { useState } from 'react';
import Link from 'next/link';

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

export default function InnstillingerPage() {
  const [emailVarsler, setEmailVarsler] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const active = 'innstillinger';

  function handleSave() {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  }

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
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
        input, select { background: #050505; border: 1px solid #262626; border-radius: 8px; padding: 10px 16px; color: #f1f5f9; font-family: 'DM Sans', sans-serif; font-size: 14px; width: 100%; outline: none; box-sizing: border-box; }
        input:focus, select:focus { border-color: #ff6b00; box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
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

          {/* Topbar */}
          <div style={{ height: '64px', borderBottom: '1px solid #262626', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 600 }}>Innstillinger</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ padding: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', borderRadius: '50%' }}>
                <span className="ms" style={{ fontSize: '20px' }}>notifications</span>
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ff6b00', borderRadius: '50%', border: '2px solid #050505' }} />
              </button>
              <div style={{ width: '1px', height: '32px', background: '#262626' }} />
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', border: '1px solid #262626', borderRadius: '8px', background: 'none', color: '#f1f5f9', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <span className="ms" style={{ fontSize: '18px' }}>logout</span>Logg ut
              </button>
            </div>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>Kontoinnstillinger</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Administrer din personlige informasjon, varslinger og medlemskap.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Profile */}
              <section style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #262626' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Profilinformasjon</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Oppdater dine detaljer for en personlig opplevelse.</p>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>Fullt navn</label>
                      <input type="text" defaultValue="Morten Hansen" />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>E-postadresse</label>
                      <input type="email" defaultValue="morten@flydeals.no" />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>Telefonnummer</label>
                      <input type="tel" defaultValue="+47 900 00 000" />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>Land</label>
                      <select>
                        <option value="NO">🇳🇴 Norge</option>
                        <option value="SE">🇸🇪 Sverige</option>
                        <option value="DK">🇩🇰 Danmark</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSave}
                      style={{ background: saved ? '#22c55e' : '#ff6b00', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' }}>
                      {saving ? 'Lagrer...' : saved ? 'Lagret!' : 'Lagre endringer'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #262626' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Varslingsinnstillinger</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Velg hvordan du vil bli varslet om nye tilbud.</p>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { label: 'E-postvarsler', desc: 'Få ukentlige oppsummeringer av de beste flyprisene.', val: emailVarsler, set: setEmailVarsler },
                    { label: 'Markedsføring', desc: 'Motta informasjon om nye funksjoner og kampanjer.', val: marketing, set: setMarketing },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>{item.label}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{item.desc}</p>
                      </div>
                      <div onClick={() => item.set(!item.val)} style={{ width: '44px', height: '24px', background: item.val ? '#ff6b00' : '#262626', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', top: '2px', left: item.val ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Subscription */}
              <section style={{ background: '#121212', border: '1px solid #262626', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Abonnementsstatus</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Du har aktivt FlyDeals-abonnement.</p>
                  </div>
                  <span style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '11px', fontWeight: 700, borderRadius: '100px', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase', letterSpacing: '1px' }}>Aktiv</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ background: '#050505', padding: '24px', borderRadius: '12px', border: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Neste fakturering</p>
                      <p style={{ fontSize: '26px', fontWeight: 900, color: '#ff6b00', letterSpacing: '-1px' }}>149 kr <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/ måned</span></p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Neste fornyelse: 24. mai 2026 · Ingen binding</p>
                    </div>
                    <button style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Si opp abonnement</button>
                  </div>
                </div>
              </section>

              {/* Danger zone */}
              <section style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>Slett konto</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Dette vil slette alle dine data permanent. Dette kan ikke angres.</p>
                </div>
                <button style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>Slett min konto</button>
              </section>

            </div>

            <footer style={{ marginTop: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '12px', paddingBottom: '48px' }}>
              © 2026 FlyDeals. Alle rettigheter reservert.<br />
              <a href="#" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Vilkår og betingelser</a> • <a href="#" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Personvern</a>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
