'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

interface Alert {
  id: string
  to: string
  toCode: string
  toFlag: string
  fromCode: string
  months: string[]
  minDiscount: number
  active: boolean
}

const DESTINATIONS = [
  {name:'Alicante',code:'ALC',flag:'🇪🇸'},{name:'Amsterdam',code:'AMS',flag:'🇳🇱'},{name:'Aten',code:'ATH',flag:'🇬🇷'},
  {name:'Bali',code:'DPS',flag:'🇮🇩'},{name:'Bangkok',code:'BKK',flag:'🇹🇭'},{name:'Barcelona',code:'BCN',flag:'🇪🇸'},
  {name:'Berlin',code:'BER',flag:'🇩🇪'},{name:'Bogotá',code:'BOG',flag:'🇨🇴'},{name:'Cape Town',code:'CPT',flag:'🇿🇦'},
  {name:'Dubai',code:'DXB',flag:'🇦🇪'},{name:'Dubrovnik',code:'DBV',flag:'🇭🇷'},{name:'Istanbul',code:'IST',flag:'🇹🇷'},
  {name:'Kairo',code:'CAI',flag:'🇪🇬'},{name:'Lisboa',code:'LIS',flag:'🇵🇹'},{name:'London',code:'LHR',flag:'🇬🇧'},
  {name:'Los Angeles',code:'LAX',flag:'🇺🇸'},{name:'Madrid',code:'MAD',flag:'🇪🇸'},{name:'Marrakech',code:'RAK',flag:'🇲🇦'},
  {name:'Miami',code:'MIA',flag:'🇺🇸'},{name:'Milano',code:'MXP',flag:'🇮🇹'},{name:'Mexico City',code:'MEX',flag:'🇲🇽'},
  {name:'Mumbai',code:'BOM',flag:'🇮🇳'},{name:'New York',code:'JFK',flag:'🇺🇸'},{name:'Paris',code:'CDG',flag:'🇫🇷'},
  {name:'Praha',code:'PRG',flag:'🇨🇿'},{name:'Reykjavik',code:'KEF',flag:'🇮🇸'},{name:'Rio de Janeiro',code:'GIG',flag:'🇧🇷'},
  {name:'Roma',code:'FCO',flag:'🇮🇹'},{name:'Seoul',code:'ICN',flag:'🇰🇷'},{name:'Singapore',code:'SIN',flag:'🇸🇬'},
  {name:'Sydney',code:'SYD',flag:'🇦🇺'},{name:'Tokyo',code:'NRT',flag:'🇯🇵'},{name:'Toronto',code:'YYZ',flag:'🇨🇦'},
  {name:'Wien',code:'VIE',flag:'🇦🇹'},{name:'Zürich',code:'ZRH',flag:'🇨🇭'},
]

const AIRPORT_NAMES: Record<string,string> = {OSL:'Oslo',BGO:'Bergen',TRD:'Trondheim',SVG:'Stavanger',TOS:'Tromsø',TRF:'Torp',KRS:'Kristiansand'}
const MONTHS = ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Des']

export default function VarslerPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string|null>(null)
  const [destInput, setDestInput] = useState('')
  const [destCode, setDestCode] = useState('')
  const [destFlag, setDestFlag] = useState('')
  const [fromAirport, setFromAirport] = useState('OSL')
  const [discount, setDiscount] = useState(50)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<typeof DESTINATIONS>([])
  const [toast, setToast] = useState<{msg:string,type:string}|null>(null)

  useEffect(() => {
    try { setAlerts(JSON.parse(localStorage.getItem('flydeals_alerts') || '[]')) } catch {}
  }, [])

  const saveAlerts = (updated: Alert[]) => {
    setAlerts(updated)
    localStorage.setItem('flydeals_alerts', JSON.stringify(updated))
  }

  const showToast = (msg: string, type: string) => {
    setToast({msg, type})
    setTimeout(() => setToast(null), 3500)
  }

  const openModal = () => {
    setDestInput(''); setDestCode(''); setDestFlag(''); setFromAirport('OSL')
    setDiscount(50); setSelectedMonths([]); setSuggestions([])
    setShowModal(true)
  }

  const submitAlert = () => {
    if (!destInput.trim()) return
    let code = destCode, flag = destFlag
    if (!code) {
      const match = DESTINATIONS.find(d => d.name.toLowerCase() === destInput.toLowerCase())
      if (!match) return
      code = match.code; flag = match.flag
    }
    const updated = [...alerts, {id: Date.now().toString(), to: destInput, toCode: code, toFlag: flag||'✈️', fromCode: fromAirport, months: [...selectedMonths], minDiscount: discount, active: true}]
    saveAlerts(updated)
    setShowModal(false)
    showToast('Varsel opprettet!', 'success')
  }

  const toggleMonth = (m: string) => {
    setSelectedMonths(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m])
  }

  const filterDest = (q: string) => {
    setDestInput(q)
    setDestCode(''); setDestFlag('')
    if (!q.trim()) { setSuggestions([]); return }
    setSuggestions(DESTINATIONS.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.code.toLowerCase().includes(q.toLowerCase())).slice(0,8))
  }

  const selectDest = (d: typeof DESTINATIONS[0]) => {
    setDestInput(d.name); setDestCode(d.code); setDestFlag(d.flag); setSuggestions([])
  }

  const toggleAlert = (id: string, active: boolean) => {
    saveAlerts(alerts.map(a => a.id === id ? {...a, active} : a))
  }

  const askDelete = (id: string) => { setPendingDeleteId(id); setShowDeleteModal(true) }
  const confirmDelete = () => {
    if (pendingDeleteId) saveAlerts(alerts.filter(a => a.id !== pendingDeleteId))
    setShowDeleteModal(false); setPendingDeleteId(null)
    showToast('Varselet er slettet.', 'success')
  }

  const activeCount = alerts.filter(a => a.active).length

  const toastColors: Record<string,{border:string,color:string,icon:string}> = {
    success: {border:'rgba(34,197,94,0.3)',color:'#22c55e',icon:'check_circle'},
    error: {border:'rgba(239,68,68,0.3)',color:'#ef4444',icon:'error'},
    info: {border:'rgba(255,107,0,0.3)',color:'#ff6b00',icon:'info'},
  }

  return (
    <>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#050505;}
        .ms{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:20px;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
        .ms-fill{font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;}
        input[type=range]{accent-color:#ff6b00;}
        .month-chip.selected{background:rgba(255,107,0,0.15);border-color:rgba(255,107,0,0.5);color:#ff6b00;}
        .toggle-track{width:44px;height:24px;background:#2a2a2a;border-radius:100px;position:relative;cursor:pointer;transition:background 0.2s;}
        .toggle-track.on{background:#ff6b00;}
        .toggle-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform 0.2s;}
        .toggle-track.on .toggle-knob{transform:translateX(20px);}
      `}</style>

      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#050505',color:'#f1f5f9',fontFamily:"'DM Sans',sans-serif"}}>
        <Sidebar />

        <main style={{flex:1,overflowY:'auto',background:'#050505'}}>
          {/* Topbar */}
          <div style={{height:'56px',borderBottom:'1px solid #1e1e1e',position:'sticky',top:0,zIndex:10,background:'rgba(5,5,5,0.9)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'8px',height:'8px',background:'#22c55e',borderRadius:'50%',display:'inline-block',animation:'pulse 2s infinite'}}></span>
              <span style={{fontSize:'14px',color:'#94a3b8',fontWeight:500}}>847 deals funnet hittil</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
              <div style={{width:'1px',height:'24px',background:'#2e2e2e',margin:'0 4px'}}></div>
              <button onClick={()=>window.location.href='/login'} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:'1px solid #1e1e1e',fontSize:'14px',fontWeight:500,color:'#94a3b8',background:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                <span className="ms" style={{fontSize:'16px'}}>logout</span>Logg ut
              </button>
            </div>
          </div>

          <div style={{maxWidth:'900px',margin:'0 auto',padding:'40px 32px'}}>
            {/* Header */}
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'space-between',gap:'24px',marginBottom:'40px'}}>
              <div>
                <h2 style={{fontSize:'36px',fontWeight:900,letterSpacing:'-1px',color:'#fff'}}>Dine varsler</h2>
                <p style={{color:'#94a3b8',marginTop:'4px'}}>Administrer dine aktive prisvarsler for flyreiser over hele verden.</p>
              </div>
              <button onClick={openModal} style={{display:'flex',alignItems:'center',gap:'8px',background:'#ff6b00',color:'#fff',padding:'12px 24px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(255,107,0,0.2)',whiteSpace:'nowrap'}}>
                <span className="ms" style={{fontSize:'20px'}}>add</span>Legg til nytt varsel
              </button>
            </div>

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'32px'}}>
              <div style={{background:'#111',border:'1px solid #1e1e1e',padding:'16px',borderRadius:'12px'}}>
                <p style={{color:'#64748b',fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Aktive varsler</p>
                <p style={{fontSize:'24px',fontWeight:700,marginTop:'4px',color:'#fff'}}>{activeCount}</p>
              </div>
              <div style={{background:'#111',border:'1px solid #1e1e1e',padding:'16px',borderRadius:'12px'}}>
                <p style={{color:'#64748b',fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Treff siste 24t</p>
                <p style={{fontSize:'24px',fontWeight:700,marginTop:'4px',color:'#22c55e'}}>0</p>
              </div>
            </div>

            {/* Alerts table / empty */}
            {alerts.length === 0 ? (
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'56px',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',textAlign:'center'}}>
                <span className="ms" style={{fontSize:'52px',color:'#334155'}}>notifications_none</span>
                <p style={{color:'#e2e8f0',fontWeight:700,fontSize:'18px',marginTop:'4px'}}>Ingen aktive varsler</p>
                <p style={{color:'#64748b',fontSize:'14px'}}>Opprett ditt første varsel for å bli varslet om flydeals.</p>
                <button onClick={openModal} style={{marginTop:'12px',display:'flex',alignItems:'center',gap:'8px',background:'#ff6b00',color:'#fff',padding:'10px 20px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(255,107,0,0.2)'}}>
                  <span className="ms" style={{fontSize:'18px'}}>add</span>Opprett varsel
                </button>
              </div>
            ) : (
              <div style={{background:'#111',borderRadius:'16px',border:'1px solid #1e1e1e',overflow:'hidden',boxShadow:'0 25px 50px rgba(0,0,0,0.5)'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead>
                      <tr style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid #1e1e1e'}}>
                        {['Rute','Reisemåned','Rabattgrense','Status','Slett'].map((h,i) => (
                          <th key={h} style={{padding:'16px 24px',fontSize:'14px',fontWeight:600,color:'#cbd5e1',textAlign:i>=1?'center':'left'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((a,i) => (
                        <tr key={a.id} style={{borderBottom:i<alerts.length-1?'1px solid #1e1e1e':'none',opacity:a.active?1:0.4,transition:'all 0.3s'}}>
                          <td style={{padding:'20px 24px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                              <div style={{padding:'8px',background:a.active?'rgba(255,107,0,0.1)':'rgba(255,255,255,0.05)',borderRadius:'8px',color:a.active?'#ff6b00':'#64748b'}}>
                                <span className="ms">flight_takeoff</span>
                              </div>
                              <div>
                                <p style={{fontWeight:700,color:a.active?'#fff':'#94a3b8'}}>{a.toFlag} {a.to} <span style={{color:'#64748b',fontWeight:400,fontSize:'12px'}}>({a.toCode})</span></p>
                                <p style={{fontSize:'12px',color:'#64748b'}}>fra 🇳🇴 {AIRPORT_NAMES[a.fromCode]||a.fromCode} ({a.fromCode})</p>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:'20px 24px',textAlign:'center'}}>
                            <span style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'4px 12px',borderRadius:'100px',fontSize:'12px',fontWeight:700,background:'rgba(255,255,255,0.05)',color:'#cbd5e1',border:'1px solid rgba(255,255,255,0.1)'}}>
                              <span className="ms" style={{fontSize:'13px'}}>calendar_month</span>
                              {a.months.length ? a.months.join(' · ') : 'Alle'}
                            </span>
                          </td>
                          <td style={{padding:'20px 24px',textAlign:'center'}}>
                            <span style={{display:'inline-flex',alignItems:'center',padding:'4px 12px',borderRadius:'100px',fontSize:'12px',fontWeight:700,background:a.active?'rgba(255,107,0,0.1)':'rgba(255,255,255,0.05)',color:a.active?'#ff6b00':'#64748b',border:`1px solid ${a.active?'rgba(255,107,0,0.2)':'rgba(255,255,255,0.05)'}`}}>
                              ≥{a.minDiscount}%
                            </span>
                          </td>
                          <td style={{padding:'20px 24px',textAlign:'center'}}>
                            <div className={`toggle-track${a.active?' on':''}`} onClick={()=>toggleAlert(a.id,!a.active)}>
                              <div className="toggle-knob"></div>
                            </div>
                          </td>
                          <td style={{padding:'20px 24px',textAlign:'right'}}>
                            <button onClick={()=>askDelete(a.id)} style={{color:'#64748b',background:'none',border:'none',cursor:'pointer',padding:'8px',borderRadius:'8px',transition:'all 0.15s'}}
                              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.color='#ef4444';(e.currentTarget as HTMLButtonElement).style.background='#2a2a2a'}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.color='#64748b';(e.currentTarget as HTMLButtonElement).style.background='none'}}>
                              <span className="ms">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent hits */}
            <div style={{marginTop:'48px'}}>
              <h3 style={{fontSize:'24px',fontWeight:700,marginBottom:'24px',color:'#fff'}}>Nylige treff</h3>
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'48px',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',textAlign:'center'}}>
                <span className="ms" style={{fontSize:'48px',color:'#334155'}}>notifications_off</span>
                <p style={{color:'#e2e8f0',fontWeight:700}}>Ingen treff ennå</p>
                <p style={{color:'#475569',fontSize:'14px',maxWidth:'300px'}}>Når varsler dine matcher nye deals dukker de opp her – synkronisert i sanntid fra databasen.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)} style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',width:'100%',maxWidth:'440px',boxShadow:'0 25px 50px rgba(0,0,0,0.6)'}}>
            <div style={{padding:'24px',borderBottom:'1px solid #1e1e1e',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Nytt varsel</h3>
              <button onClick={()=>setShowModal(false)} style={{color:'#64748b',background:'none',border:'none',cursor:'pointer',padding:'4px'}}><span className="ms">close</span></button>
            </div>
            <div style={{padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
              {/* Destination */}
              <div style={{position:'relative'}}>
                <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1',display:'block',marginBottom:'6px'}}>Destinasjon</label>
                <input type="text" autoComplete="off" placeholder="Søk etter by eller flyplass..." value={destInput} onChange={e=>filterDest(e.target.value)}
                  style={{width:'100%',background:'#0e0e0e',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'10px 16px',fontSize:'14px',color:'#f1f5f9',outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box'}} />
                {suggestions.length > 0 && (
                  <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:'4px',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',overflow:'hidden',zIndex:20,maxHeight:'192px',overflowY:'auto',boxShadow:'0 25px 50px rgba(0,0,0,0.5)'}}>
                    {suggestions.map(d => (
                      <button key={d.code} onMouseDown={()=>selectDest(d)} style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',fontSize:'14px',background:'none',border:'none',cursor:'pointer',color:'#f1f5f9',textAlign:'left',fontFamily:"'DM Sans',sans-serif"}}
                        onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='none')}>
                        <span style={{fontSize:'20px'}}>{d.flag}</span>
                        <span style={{fontWeight:500}}>{d.name}</span>
                        <span style={{color:'#64748b',marginLeft:'auto',fontSize:'12px'}}>{d.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* From */}
              <div>
                <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1',display:'block',marginBottom:'6px'}}>Fra flyplass</label>
                <select value={fromAirport} onChange={e=>setFromAirport(e.target.value)} style={{width:'100%',background:'#0e0e0e',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'10px 16px',fontSize:'14px',color:'#f1f5f9',outline:'none',fontFamily:"'DM Sans',sans-serif"}}>
                  <option value="OSL">Oslo (OSL)</option>
                  <option value="BGO">Bergen (BGO)</option>
                  <option value="TRD">Trondheim (TRD)</option>
                  <option value="SVG">Stavanger (SVG)</option>
                  <option value="TOS">Tromsø (TOS)</option>
                  <option value="TRF">Torp / Sandefjord (TRF)</option>
                  <option value="KRS">Kristiansand (KRS)</option>
                </select>
              </div>
              {/* Months */}
              <div>
                <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1',display:'block',marginBottom:'8px'}}>Reisemåned(er) <span style={{color:'#475569',fontWeight:400}}>(valgfritt)</span></label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {MONTHS.map(m => (
                    <button key={m} onClick={()=>toggleMonth(m)} className={`month-chip${selectedMonths.includes(m)?' selected':''}`}
                      style={{padding:'4px 12px',borderRadius:'100px',fontSize:'12px',fontWeight:600,border:'1px solid #2a2a2a',color:selectedMonths.includes(m)?'#ff6b00':'#94a3b8',background:selectedMonths.includes(m)?'rgba(255,107,0,0.15)':'transparent',cursor:'pointer',transition:'all 0.15s',fontFamily:"'DM Sans',sans-serif"}}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Discount */}
              <div>
                <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1',display:'block',marginBottom:'8px'}}>
                  Minimum rabatt: <span style={{color:'#ff6b00',fontWeight:700}}>{discount}%</span>
                </label>
                <input type="range" min={30} max={80} step={5} value={discount} onChange={e=>setDiscount(Number(e.target.value))} style={{width:'100%',height:'8px'}} />
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'#475569',marginTop:'6px'}}>
                  <span>30%</span><span>55%</span><span>80%</span>
                </div>
              </div>
            </div>
            <div style={{padding:'0 24px 24px',display:'flex',gap:'12px'}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:'10px',borderRadius:'12px',border:'1px solid #1e1e1e',color:'#94a3b8',background:'none',fontWeight:600,fontSize:'14px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Avbryt</button>
              <button onClick={submitAlert} style={{flex:1,padding:'10px',borderRadius:'12px',background:'#ff6b00',color:'#fff',fontWeight:700,fontSize:'14px',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(255,107,0,0.2)'}}>Opprett varsel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)} style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',width:'100%',maxWidth:'360px',padding:'24px',textAlign:'center',boxShadow:'0 25px 50px rgba(0,0,0,0.6)'}}>
            <span className="ms" style={{fontSize:'40px',color:'#94a3b8',display:'block',marginBottom:'12px'}}>delete</span>
            <h3 style={{fontSize:'18px',fontWeight:700,marginBottom:'4px',color:'#fff'}}>Slett varsel?</h3>
            <p style={{color:'#94a3b8',fontSize:'14px',marginBottom:'24px'}}>Dette kan ikke angres.</p>
            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>setShowDeleteModal(false)} style={{flex:1,padding:'10px',borderRadius:'12px',border:'1px solid #1e1e1e',color:'#94a3b8',background:'none',fontWeight:600,fontSize:'14px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Avbryt</button>
              <button onClick={confirmDelete} style={{flex:1,padding:'10px',borderRadius:'12px',background:'#ef4444',color:'#fff',fontWeight:700,fontSize:'14px',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Slett</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (() => { const c = toastColors[toast.type]||toastColors.success; return (
        <div style={{position:'fixed',bottom:'24px',right:'24px',zIndex:200,display:'flex',alignItems:'center',gap:'10px',padding:'14px 20px',borderRadius:'12px',fontSize:'14px',fontWeight:600,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',background:'#111',border:`1px solid ${c.border}`,color:c.color,fontFamily:"'DM Sans',sans-serif"}}>
          <span className="ms" style={{fontSize:'18px'}}>{c.icon}</span>{toast.msg}
        </div>
      )})()}
    </>
  )
}
