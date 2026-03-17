'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const allDeals = [
  {from:'Oslo',fromCode:'OSL',to:'Bangkok',toCode:'BKK',flag:'🇹🇭',price:2489,orig:4700,discount:47,dates:'Mar–Apr 2026',airline:'Thai Airways',direct:true},
  {from:'Bergen',fromCode:'BGO',to:'London',toCode:'LHR',flag:'🇬🇧',price:489,orig:1020,discount:52,dates:'Mars 2026',airline:'Norwegian',direct:true},
  {from:'Oslo',fromCode:'OSL',to:'New York',toCode:'JFK',flag:'🇺🇸',price:2890,orig:4900,discount:41,dates:'Apr–Mai 2026',airline:'SAS',direct:true},
  {from:'Trondheim',fromCode:'TRD',to:'Barcelona',toCode:'BCN',flag:'🇪🇸',price:699,orig:1130,discount:38,dates:'April 2026',airline:'Norwegian',direct:false},
  {from:'Stavanger',fromCode:'SVG',to:'Amsterdam',toCode:'AMS',flag:'🇳🇱',price:549,orig:980,discount:44,dates:'Mars 2026',airline:'KLM',direct:false},
  {from:'Oslo',fromCode:'OSL',to:'Tokyo',toCode:'HND',flag:'🇯🇵',price:3490,orig:5720,discount:39,dates:'Mai–Jun 2026',airline:'ANA',direct:false},
  {from:'Tromsø',fromCode:'TOS',to:'Reykjavik',toCode:'KEF',flag:'🇮🇸',price:890,orig:1370,discount:35,dates:'April 2026',airline:'Icelandair',direct:true},
  {from:'Torp',fromCode:'TRF',to:'Alicante',toCode:'ALC',flag:'🇪🇸',price:399,orig:814,discount:51,dates:'Mar–Apr 2026',airline:'Ryanair',direct:true},
  {from:'Oslo',fromCode:'OSL',to:'Dubai',toCode:'DXB',flag:'🇦🇪',price:1990,orig:3490,discount:43,dates:'April 2026',airline:'Emirates',direct:true},
  {from:'Bergen',fromCode:'BGO',to:'Roma',toCode:'FCO',flag:'🇮🇹',price:599,orig:1110,discount:46,dates:'Mars 2026',airline:'SAS',direct:false},
  {from:'Trondheim',fromCode:'TRD',to:'Paris',toCode:'CDG',flag:'🇫🇷',price:649,orig:1082,discount:40,dates:'April 2026',airline:'Air France',direct:false},
  {from:'Oslo',fromCode:'OSL',to:'Bali',toCode:'DPS',flag:'🇮🇩',price:4290,orig:6703,discount:36,dates:'Mai 2026',airline:'Qatar Airways',direct:false},
]

const airports = [
  {code:'alle',label:'Alle flyplasser'},
  {code:'OSL',label:'🇳🇴 Oslo (OSL)'},
  {code:'BGO',label:'🇳🇴 Bergen (BGO)'},
  {code:'TRD',label:'🇳🇴 Trondheim (TRD)'},
  {code:'SVG',label:'🇳🇴 Stavanger (SVG)'},
  {code:'TOS',label:'🇳🇴 Tromsø (TOS)'},
  {code:'TRF',label:'🇳🇴 Torp (TRF)'},
]

export default function DealsPage() {
  const [filter, setFilter] = useState('alle')
  const [selectedDeal, setSelectedDeal] = useState<typeof allDeals[0]|null>(null)

  const filtered = filter === 'alle' ? allDeals : allDeals.filter(d => d.fromCode === filter)

  return (
    <>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#050505;}
        .ms{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:20px;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
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
            <button onClick={()=>window.location.href='/login'} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:'1px solid #1e1e1e',fontSize:'14px',fontWeight:500,color:'#94a3b8',background:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
              <span className="ms" style={{fontSize:'16px'}}>logout</span>Logg ut
            </button>
          </div>

          <div style={{maxWidth:'900px',margin:'0 auto',padding:'32px 24px'}}>
            <div style={{marginBottom:'32px'}}>
              <h2 style={{fontSize:'28px',fontWeight:900,letterSpacing:'-0.5px',color:'#fff'}}>Live Deals</h2>
              <p style={{color:'#64748b',marginTop:'4px'}}>Oppdateres automatisk. Prisene kan endre seg raskt — book når du ser en god deal.</p>
            </div>

            {/* Airport filters */}
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'32px'}}>
              {airports.map(a => (
                <button key={a.code} onClick={()=>setFilter(a.code)}
                  style={{padding:'8px 16px',borderRadius:'100px',fontSize:'14px',fontWeight:filter===a.code?700:500,background:filter===a.code?'#ff6b00':'#111',color:filter===a.code?'#fff':'#94a3b8',border:filter===a.code?'none':'1px solid #1e1e1e',cursor:'pointer',transition:'all 0.15s',fontFamily:"'DM Sans',sans-serif"}}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* Deals grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
              {filtered.map((d,i) => (
                <div key={i} onClick={()=>setSelectedDeal(d)}
                  style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'14px',cursor:'pointer',transition:'all 0.2s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,107,0,0.3)';(e.currentTarget as HTMLDivElement).style.transform='translateY(-1px)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='#1e1e1e';(e.currentTarget as HTMLDivElement).style.transform='none'}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'8px'}}>
                    <div>
                      <span style={{fontSize:'14px',fontWeight:900,color:'#fff'}}>{d.to} {d.flag}</span>
                      <p style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>{d.from} → {d.toCode}</p>
                    </div>
                    <span style={{display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:'100px',fontSize:'10px',fontWeight:700,background:'rgba(34,197,94,0.1)',color:'#4ade80',border:'1px solid rgba(34,197,94,0.2)',whiteSpace:'nowrap'}}>-{d.discount}%</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'6px',padding:'6px 8px',marginBottom:'8px'}}>
                    <span className="ms" style={{fontSize:'13px',color:'#ff6b00'}}>calendar_month</span>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#fff'}}>{d.dates}</span>
                  </div>
                  <p style={{fontSize:'20px',fontWeight:900,color:'#ff6b00',lineHeight:1}}>{d.price.toLocaleString('no')} kr</p>
                  <p style={{fontSize:'11px',color:'#475569',marginTop:'2px',textDecoration:'line-through'}}>{d.orig.toLocaleString('no')} kr</p>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'8px',paddingTop:'8px',borderTop:'1px solid #1e1e1e',fontSize:'11px',color:'#64748b'}}>
                    <span className="ms" style={{fontSize:'13px'}}>airlines</span>
                    <span>{d.airline} · {d.direct?'Direktefly':'1 stopp'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Deal modal */}
      {selectedDeal && (
        <div onClick={e=>e.target===e.currentTarget&&setSelectedDeal(null)} style={{position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'20px',padding:'32px',maxWidth:'440px',width:'90%',position:'relative'}}>
            <button onClick={()=>setSelectedDeal(null)} style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'22px',lineHeight:1,fontFamily:'sans-serif'}}>✕</button>
            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'24px'}}>
              <div style={{fontSize:'48px',lineHeight:1}}>{selectedDeal.flag}</div>
              <div>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',fontWeight:600,marginBottom:'4px'}}>FLYRUTE</p>
                <p style={{fontSize:'16px',fontWeight:800,color:'#fff'}}>{selectedDeal.from} ({selectedDeal.fromCode}) → {selectedDeal.to} ({selectedDeal.toCode})</p>
              </div>
            </div>
            <div style={{background:'#050505',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:'12px',marginBottom:'4px'}}>
                <span style={{fontSize:'32px',fontWeight:900,color:'#ff6b00'}}>{selectedDeal.price.toLocaleString('no')} kr</span>
                <span style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',textDecoration:'line-through'}}>{selectedDeal.orig.toLocaleString('no')} kr</span>
                <span style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',color:'#22c55e',borderRadius:'4px',padding:'2px 8px',fontSize:'11px',fontWeight:700}}>-{selectedDeal.discount}%</span>
              </div>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>per person, tur-retur</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px'}}>
              {[
                {label:'PERIODE',value:selectedDeal.dates},
                {label:'FLYSELSKAP',value:selectedDeal.airline},
                {label:'STOPP',value:selectedDeal.direct?'Direktefly':'1 stopp'},
                {label:'BOOKING',value:'Tilgjengelig nå',green:true},
              ].map(item => (
                <div key={item.label} style={{background:'#050505',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'12px'}}>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',fontWeight:600,marginBottom:'4px'}}>{item.label}</p>
                  <p style={{fontSize:'13px',fontWeight:700,color:item.green?'#22c55e':'#fff'}}>{item.value}</p>
                </div>
              ))}
            </div>
            <button onClick={()=>{setSelectedDeal(null);window.location.href='/varsler'}}
              style={{width:'100%',padding:'14px',borderRadius:'12px',background:'#ff6b00',color:'#fff',fontWeight:800,fontSize:'15px',border:'none',cursor:'pointer',marginBottom:'10px',fontFamily:"'DM Sans',sans-serif",transition:'background 0.2s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#e55f00'} onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#ff6b00'}>
              Legg til varsel for denne ruten
            </button>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',textAlign:'center'}}>Book direkte hos flyselskapet — FlyDeals tar ingen provisjon</p>
          </div>
        </div>
      )}
    </>
  )
}
