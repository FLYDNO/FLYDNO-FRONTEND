'use client'

import Sidebar from '@/components/Sidebar'

const items = [
  {dest:'New York 🇺🇸',code:'JFK',from:'fra 🇳🇴 Oslo (OSL)',date:'15. Jan 2026',price:'2 490 kr',disc:'-41%'},
  {dest:'London 🇬🇧',code:'LHR',from:'fra 🇳🇴 Bergen (BGO)',date:'10. Jan 2026',price:'890 kr',disc:'-35%'},
  {dest:'Tokyo 🇯🇵',code:'HND',from:'fra 🇳🇴 Oslo (OSL)',date:'07. Jan 2026',price:'5 920 kr',disc:'-47%'},
  {dest:'Bangkok 🇹🇭',code:'BKK',from:'fra 🇳🇴 Oslo (OSL)',date:'02. Jan 2026',price:'2 890 kr',disc:'-39%'},
  {dest:'Barcelona 🇪🇸',code:'BCN',from:'fra 🇳🇴 Oslo (OSL)',date:'28. Des 2025',price:'620 kr',disc:'-52%'},
]

export default function HistorikkPage() {
  return (
    <>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#050505;}
        .ms{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:20px;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
        input{font-family:'DM Sans',sans-serif;}
      `}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#050505',color:'#f1f5f9',fontFamily:"'DM Sans',sans-serif"}}>
        <Sidebar />
        <main style={{flex:1,overflowY:'auto',background:'#050505'}}>
          {/* Topbar */}
          <div style={{height:'56px',borderBottom:'1px solid #1e1e1e',position:'sticky',top:0,zIndex:10,background:'rgba(5,5,5,0.9)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'8px',height:'8px',background:'#22c55e',borderRadius:'50%',display:'inline-block'}}></span>
              <span style={{fontSize:'14px',color:'#94a3b8',fontWeight:500}}>847 deals funnet hittil</span>
            </div>
            <button onClick={()=>window.location.href='/login'} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:'1px solid #1e1e1e',fontSize:'14px',fontWeight:500,color:'#94a3b8',background:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
              <span className="ms" style={{fontSize:'16px'}}>logout</span>Logg ut
            </button>
          </div>

          <div style={{maxWidth:'900px',margin:'0 auto',padding:'40px 32px'}}>
            {/* Header */}
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'space-between',gap:'16px',marginBottom:'32px'}}>
              <div>
                <h2 style={{fontSize:'36px',fontWeight:900,letterSpacing:'-1px',color:'#fff',marginBottom:'4px'}}>Historikk</h2>
                <p style={{color:'#64748b'}}>Alle deals vi har sendt deg – synkronisert i sanntid.</p>
              </div>
              <button style={{background:'#111',border:'1px solid #1e1e1e',color:'#cbd5e1',padding:'10px 20px',borderRadius:'12px',fontWeight:700,fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',fontFamily:"'DM Sans',sans-serif",transition:'all 0.15s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,107,0,0.4)';(e.currentTarget as HTMLButtonElement).style.color='#ff6b00'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#1e1e1e';(e.currentTarget as HTMLButtonElement).style.color='#cbd5e1'}}>
                <span className="ms" style={{fontSize:'16px'}}>filter_list</span>Filtrer
              </button>
            </div>

            {/* Search */}
            <div style={{position:'relative',marginBottom:'24px'}}>
              <span className="ms" style={{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>search</span>
              <input type="text" placeholder="Søk i ruter, flyplasser eller byer..."
                style={{width:'100%',background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'16px 16px 16px 48px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box'}}
                onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.1)'}} onBlur={e=>{e.target.style.borderColor='#1e1e1e';e.target.style.boxShadow='none'}} />
            </div>

            {/* Info bar */}
            <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',fontSize:'12px',color:'#94a3b8',marginBottom:'24px'}}>
              <span className="ms" style={{fontSize:'16px',color:'#ff6b00'}}>verified</span>
              Kun de beste tilbudene når deg – vi filtrerer ut støyen.
            </div>

            {/* History list */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h3 style={{fontSize:'12px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#64748b',padding:'0 8px'}}>Mottatte varsler</h3>
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',overflow:'hidden'}}>
                {items.map((item, i) => (
                  <div key={i} style={{padding:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:i<items.length-1?'1px solid #1e1e1e':'none',transition:'background 0.15s',cursor:'default'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                    <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                      <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,107,0,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff6b00',flexShrink:0}}>
                        <span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span>
                      </div>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                          <span style={{fontSize:'20px',fontWeight:900,letterSpacing:'-0.5px',color:'#fff'}}>{item.dest}</span>
                          <span style={{fontSize:'12px',fontWeight:500,color:'#64748b',background:'#2a2a2a',padding:'2px 8px',borderRadius:'100px'}}>{item.code}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'12px',color:'#64748b'}}>{item.from}</span>
                          <span style={{color:'#334155'}}>·</span>
                          <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#64748b'}}>
                            <span className="ms" style={{fontSize:'13px'}}>calendar_month</span>{item.date}
                          </span>
                          <span style={{color:'#334155'}}>·</span>
                          <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#64748b'}}>
                            <span className="ms" style={{fontSize:'13px'}}>mail</span>Sendt på e-post
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0,marginLeft:'16px'}}>
                      <p style={{fontSize:'20px',fontWeight:900,color:'#ff6b00'}}>{item.price}</p>
                      <span style={{display:'inline-block',marginTop:'4px',fontSize:'12px',fontWeight:700,background:'rgba(34,197,94,0.1)',color:'#4ade80',border:'1px solid rgba(34,197,94,0.2)',padding:'2px 8px',borderRadius:'100px'}}>{item.disc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
