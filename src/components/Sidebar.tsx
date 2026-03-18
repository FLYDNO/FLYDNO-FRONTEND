'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/deals', icon: 'local_offer', label: 'Live Deals' },
    { href: '/varsler', icon: 'notifications', label: 'Dine Varsler', fillOnActive: true },
    { href: '/oppdag', icon: 'explore', label: 'Oppdag Ruter' },
    { href: '/historikk', icon: 'history', label: 'Historikk' },
  ]
  const bottomLinks = [
    { href: '/innstillinger', icon: 'settings', label: 'Innstillinger' },
    { href: '/brukerstotte', icon: 'help', label: 'Brukerstøtte' },
  ]

  return (
    <aside style={{width:'256px',flexShrink:0,borderRight:'1px solid #1e1e1e',background:'#050505',display:'flex',flexDirection:'column',height:'100vh'}}>
        {/* Logo */}
        <div style={{padding:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'36px',height:'36px',background:'#ff6b00',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',boxShadow:'0 4px 12px rgba(255,107,0,0.2)',flexShrink:0}}>
            <span className="ms" style={{fontSize:'18px'}}>flight_takeoff</span>
          </div>
          <div>
            <h1 style={{fontSize:'15px',fontWeight:700,lineHeight:1.2,color:'#fff'}}>FlyDeals</h1>
            <p style={{fontSize:'11px',color:'#64748b',fontWeight:500}}>Varsler deg om flydeals</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:'0 12px',marginTop:'4px'}}>
          {navLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href}
                className={active ? 'nav-active' : 'nav-link'}
                style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'0 12px 12px 0',textDecoration:'none',color: active ? '#ff6b00' : '#94a3b8',marginBottom:'2px',transition:'all 0.15s',fontFamily:"'DM Sans',sans-serif"}}>
                <span className={`ms${active && link.fillOnActive ? ' ms-fill' : ''}`} style={{fontSize:'18px'}}>{link.icon}</span>
                <span style={{fontSize:'14px',fontWeight: active ? 600 : 500}}>{link.label}</span>
              </Link>
            )
          })}

          <div style={{paddingTop:'12px',marginTop:'8px',borderTop:'1px solid #1e1e1e'}}>
            {bottomLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}
                  className={active ? 'nav-active' : 'nav-link'}
                  style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'0 12px 12px 0',textDecoration:'none',color: active ? '#ff6b00' : '#94a3b8',marginBottom:'2px',transition:'all 0.15s',fontFamily:"'DM Sans',sans-serif"}}>
                  <span className="ms" style={{fontSize:'18px'}}>{link.icon}</span>
                  <span style={{fontSize:'14px',fontWeight: active ? 600 : 500}}>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User */}
        <div style={{padding:'12px',borderTop:'1px solid #1e1e1e'}}>
          <div style={{background:'#242424',borderRadius:'12px',padding:'12px',border:'1px solid #1e1e1e',display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{overflow:'hidden',flex:1,minWidth:0}}>
              <p style={{fontSize:'14px',fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Marius Jensen</p>
              <p style={{fontSize:'11px',color:'#64748b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>marius@flydeals.no</p>
            </div>
            <Link href="/innstillinger" style={{color:'#64748b',textDecoration:'none',transition:'color 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='#ff6b00')} onMouseLeave={e=>(e.currentTarget.style.color='#64748b')}>
              <span className="ms" style={{fontSize:'16px'}}>settings</span>
            </Link>
          </div>
        </div>
      </aside>
  )
}
