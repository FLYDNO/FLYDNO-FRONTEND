'use client'
import Link from 'next/link'

const navItems = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals', key: 'deals' },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler', key: 'varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter', key: 'oppdag' },
  { href: '/historikk', icon: 'history', label: 'Historikk', key: 'historikk' },
]

const bottomItems = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger', key: 'innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte', key: 'brukerstotte' },
]

export default function Sidebar({ active }: { active: string }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; display: inline-block; white-space: nowrap; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link { border-left: 3px solid transparent; transition: all 0.2s; }
        .nav-link:hover { background: rgba(255,107,0,0.05); color: #ff6b00; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00 !important; color: #ff6b00; }
      `}</style>
      <aside style={{ width: '256px', flexShrink: 0, borderRight: '1px solid #1e1e1e', background: '#050505', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#ff6b00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,0,0.2)' }}>
            <span className="ms" style={{ fontSize: '18px' }}>flight_takeoff</span>
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>FlyDeals</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Varsler deg om flydeals</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className={`nav-link ${active === item.key ? 'nav-active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
              <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
            </Link>
          ))}

          <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '12px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {bottomItems.map((item) => (
              <Link key={item.key} href={item.href} className={`nav-link ${active === item.key ? 'nav-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '0 12px 12px 0', textDecoration: 'none', color: active === item.key ? '#ff6b00' : 'rgba(255,255,255,0.4)' }}>
                <span className={`ms${active === item.key ? ' ms-fill' : ''}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User */}
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
    </>
  )
}
