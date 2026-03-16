'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/deals', icon: 'local_offer', label: 'Live Deals' },
  { href: '/varsler', icon: 'notifications', label: 'Dine Varsler' },
  { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter' },
  { href: '/historikk', icon: 'history', label: 'Historikk' },
]

const navBottom = [
  { href: '/innstillinger', icon: 'settings', label: 'Innstillinger' },
  { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ width: '256px', flexShrink: 0, borderRight: '1px solid #1e1e1e', background: '#050505', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', background: '#ff6b00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 4px 15px rgba(255,107,0,0.2)' }}>
          <span className="ms" style={{ fontSize: '18px' }}>flight_takeoff</span>
        </div>
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.2 }}>FlyDeals</h1>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 500 }}>Varsler deg om flydeals</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 12px', marginTop: '4px' }}>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
              borderRadius: '0 12px 12px 0',
              borderLeft: active ? '3px solid #ff6b00' : '3px solid transparent',
              background: active ? 'rgba(255,107,0,0.1)' : 'transparent',
              color: active ? '#ff6b00' : '#94a3b8',
              textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
            }}>
              <span className="ms" style={{ fontSize: '18px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: active ? 600 : 500 }}>{item.label}</span>
            </Link>
          )
        })}

        <div style={{ paddingTop: '12px', marginTop: '8px', borderTop: '1px solid #1e1e1e' }}>
          {navBottom.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                borderRadius: '0 12px 12px 0',
                borderLeft: active ? '3px solid #ff6b00' : '3px solid transparent',
                background: active ? 'rgba(255,107,0,0.1)' : 'transparent',
                color: active ? '#ff6b00' : '#94a3b8',
                textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
              }}>
                <span className="ms" style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: active ? 600 : 500 }}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div style={{ padding: '12px', marginTop: 'auto', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ background: '#111', borderRadius: '12px', padding: '12px', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="ms" style={{ fontSize: '18px', color: '#94a3b8' }}>person</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Bruker</p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>innlogget</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
