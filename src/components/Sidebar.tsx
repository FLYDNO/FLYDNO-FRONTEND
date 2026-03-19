'use client'
import Link from 'next/link'

interface SidebarProps {
  active: string
  userName: string
  userEmail: string
  onLogout: () => void
}

const NAV = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals', key: 'deals' },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler', key: 'varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter', key: 'oppdag' },
  { href: '/historikk', icon: 'history', label: 'Historikk', key: 'historikk' },
]
const NAV_BOTTOM = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger', key: 'innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstotte', key: 'brukerstotte' },
]

export default function Sidebar({ active, userName, userEmail, onLogout }: SidebarProps) {
  return (
    <aside style={{
      width: 240, flexShrink: 0, background: '#0a0a0a',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0, borderRight: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: '#ff6b00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="ms" style={{ fontSize: 18, color: '#fff' }}>flight_takeoff</span>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>FlyDeals</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>Varsler deg om flydeals</p>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ href, icon, label, key }) => {
          const isActive = active === key
          return (
            <Link key={key} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              borderLeft: isActive ? '3px solid #ff6b00' : '3px solid transparent',
              background: isActive ? 'rgba(255,107,0,0.1)' : 'transparent',
              color: isActive ? '#ff6b00' : 'rgba(255,255,255,0.5)',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 700 : 500,
            }}>
              <span className={`ms${isActive ? ' ms-fill' : ''}`} style={{ fontSize: 18 }}>{icon}</span>
              {label}
            </Link>
          )
        })}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 0' }} />

        {NAV_BOTTOM.map(({ href, icon, label, key }) => {
          const isActive = active === key
          return (
            <Link key={key} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              borderLeft: isActive ? '3px solid #ff6b00' : '3px solid transparent',
              background: isActive ? 'rgba(255,107,0,0.1)' : 'transparent',
              color: isActive ? '#ff6b00' : 'rgba(255,255,255,0.5)',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 700 : 500,
            }}>
              <span className={`ms${isActive ? ' ms-fill' : ''}`} style={{ fontSize: 18 }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#ff6b00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{(userName || 'U')[0].toUpperCase()}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
          </div>
          <button onClick={onLogout} title="Logg ut" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}>
            <span className="ms" style={{ fontSize: 17 }}>logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
