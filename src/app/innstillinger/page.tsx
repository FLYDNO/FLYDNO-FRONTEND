'use client'

import Sidebar from '@/components/Sidebar'

export default function InnstillingerPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'DM Sans', sans-serif; background: #050505; margin: 0; }
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        input, select { background: #050505; border: 1px solid #262626; color: #e2e8f0; border-radius: 8px; padding: 10px 16px; width: 100%; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; box-sizing: border-box; }
        input:focus, select:focus { border-color: #ff6b00; box-shadow: 0 0 0 2px rgba(255,107,0,0.2); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />

        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          {/* Topbar */}
          <div style={{ height: '64px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
            <h1 style={{ fontSize: '17px', fontWeight: 600, margin: 0 }}>Innstillinger</h1>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e1e1e', background: 'transparent', color: '#e2e8f0', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              <span className="ms" style={{ fontSize: '18px' }}>logout</span>
              Logg ut
            </button>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Kontoinnstillinger</h2>
              <p style={{ color: '#94a3b8', marginTop: '4px' }}>Administrer din personlige informasjon, varslinger og medlemskap.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Profile */}
              <section style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1e1e1e' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>Profilinformasjon</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Oppdater dine detaljer for en personlig opplevelse.</p>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Fullt navn</label>
                      <input type="text" defaultValue="Morten Hansen" />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>E-postadresse</label>
                      <input type="email" defaultValue="morten@flydeals.no" />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Telefonnummer</label>
                      <input type="tel" defaultValue="+47 900 00 000" />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Land</label>
                      <select>
                        <option value="NO">🇳🇴 Norge</option>
                        <option value="SE">🇸🇪 Sverige</option>
                        <option value="DK">🇩🇰 Danmark</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{ background: '#ff6b00', color: 'white', fontWeight: 700, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,107,0,0.2)' }}>
                      Lagre endringer
                    </button>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1e1e1e' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>Varslingsinnstillinger</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Velg hvordan du vil bli varslet om nye tilbud.</p>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { label: 'E-postvarsler', desc: 'Få ukentlige oppsummeringer av de beste flyprisene.' },
                    { label: 'Markedsføring', desc: 'Motta informasjon om nye funksjoner og kampanjer.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 500, margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>{item.desc}</p>
                      </div>
                      <div style={{ width: '44px', height: '24px', borderRadius: '9999px', background: '#ff6b00', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', top: '2px', left: '22px', width: '20px', height: '20px', borderRadius: '50%', background: 'white' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Subscription */}
              <section style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>Abonnementsstatus</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Du har aktivt FlyDeals-abonnement.</p>
                  </div>
                  <span style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '12px', fontWeight: 700, borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktiv</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ background: '#050505', padding: '24px', borderRadius: '12px', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Neste fakturering</p>
                      <p style={{ fontSize: '28px', fontWeight: 900, color: '#ff6b00', margin: '4px 0', letterSpacing: '-0.02em' }}>149 kr <span style={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>/ måned</span></p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Neste fornyelse: 24. mai 2026 · Ingen binding</p>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Si opp abonnement
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger zone */}
              <section style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ef4444', margin: 0 }}>Slett konto</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Dette vil slette alle dine data permanent. Dette kan ikke angres.</p>
                </div>
                <button style={{ padding: '10px 24px', background: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.2)', whiteSpace: 'nowrap' }}>
                  Slett min konto
                </button>
              </section>

            </div>

            <footer style={{ marginTop: '48px', textAlign: 'center', color: '#475569', fontSize: '12px', paddingBottom: '48px' }}>
              © 2026 FlyDeals. Alle rettigheter reservert.<br />
              <a href="#" style={{ color: '#475569' }}>Vilkår og betingelser</a> • <a href="#" style={{ color: '#475569' }}>Personvern</a>
            </footer>
          </div>
        </main>
      </div>
    </>
  )
}
