'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function InnstillingerPage() {
  const [emailVarsler, setEmailVarsler] = useState(true)
  const [marketing, setMarketing] = useState(true)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Public Sans', sans-serif; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
        input, select { background: #050505; border: 1px solid #262626; border-radius: 8px; padding: 10px 16px; color: #f1f5f9; font-family: 'Public Sans', sans-serif; font-size: 14px; width: 100%; outline: none; box-sizing: border-box; }
        input:focus, select:focus { border-color: #ff6b00; box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
      `}</style>
      <div className="flex h-screen overflow-hidden" style={{ background: '#050505', color: '#f1f5f9', fontFamily: "'Public Sans', sans-serif" }}>
        <Sidebar active="innstillinger" />
        <main className="flex-1 overflow-y-auto" style={{ background: '#050505' }}>

          {/* Topbar */}
          <div style={{ height: '64px', borderBottom: '1px solid #262626', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 600 }}>Innstillinger</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ padding: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', borderRadius: '50%' }}>
                <span className="ms" style={{ fontSize: '20px' }}>notifications</span>
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ff6b00', borderRadius: '50%', border: '2px solid #050505' }} />
              </button>
              <div style={{ width: '1px', height: '32px', background: '#262626' }} />
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', border: '1px solid #262626', borderRadius: '8px', background: 'none', color: '#f1f5f9', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Public Sans', sans-serif" }}>
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
                    {[
                      { label: 'Fullt navn', type: 'text', val: 'Morten Hansen' },
                      { label: 'E-postadresse', type: 'email', val: 'morten@flydeals.no' },
                      { label: 'Telefonnummer', type: 'tel', val: '+47 900 00 000' },
                    ].map((f, i) => (
                      <div key={i}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                        <input type={f.type} defaultValue={f.val} />
                      </div>
                    ))}
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
                    <button style={{ background: '#ff6b00', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Public Sans', sans-serif" }}>Lagre endringer</button>
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
                    <button style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Public Sans', sans-serif" }}>Si opp abonnement</button>
                  </div>
                </div>
              </section>

              {/* Danger zone */}
              <section style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>Slett konto</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Dette vil slette alle dine data permanent. Dette kan ikke angres.</p>
                </div>
                <button style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Public Sans', sans-serif" }}>Slett min konto</button>
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
  )
}
