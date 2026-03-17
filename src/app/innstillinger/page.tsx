'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function InnstillingerPage() {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [toast, setToast] = useState<{msg:string,type:'success'|'error'}|null>(null)
  const [emailVarsler, setEmailVarsler] = useState(true)
  const [markedsforing, setMarkedsforing] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)

  const showToastMsg = (msg: string, type: 'success'|'error') => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3500)
  }

  const saveProfile = () => {
    setSavingProfile(true)
    setTimeout(()=>{ setSavingProfile(false); showToastMsg('Profilinformasjon lagret.','success') },600)
  }

  const confirmCancel = () => {
    setShowCancelModal(false)
    showToastMsg('Abonnementet er sagt opp. Du beholder tilgangen til 24. mai 2026.','success')
  }

  const confirmDelete = () => {
    setShowDeleteModal(false)
    showToastMsg('Konto slettet. Du blir nå logget ut...','success')
    setTimeout(()=>window.location.href='/login',2000)
  }

  return (
    <>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#050505;}
        .ms{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:20px;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
        input,select{font-family:'DM Sans',sans-serif;}
        .toggle-track{width:44px;height:24px;border-radius:100px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;}
        .toggle-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform 0.2s;}
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

          <div style={{maxWidth:'800px',margin:'0 auto',padding:'32px'}}>
            <div style={{marginBottom:'32px'}}>
              <h2 style={{fontSize:'28px',fontWeight:900,letterSpacing:'-0.5px',color:'#f1f5f9'}}>Kontoinnstillinger</h2>
              <p style={{color:'#94a3b8',marginTop:'4px'}}>Administrer din personlige informasjon, varslinger og medlemskap.</p>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>

              {/* Profile */}
              <section style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',overflow:'hidden'}}>
                <div style={{padding:'24px',borderBottom:'1px solid #1e1e1e'}}>
                  <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Profilinformasjon</h3>
                  <p style={{fontSize:'14px',color:'#94a3b8',marginTop:'2px'}}>Oppdater dine detaljer for en personlig opplevelse.</p>
                </div>
                <div style={{padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                    {[
                      {label:'Fullt navn',type:'text',value:'Morten Hansen'},
                      {label:'E-postadresse',type:'email',value:'morten@flydeals.no'},
                      {label:'Telefonnummer',type:'tel',value:'+47 900 00 000'},
                    ].map(f => (
                      <div key={f.label} style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                        <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>{f.label}</label>
                        <input type={f.type} defaultValue={f.value} style={{background:'#0e0e0e',border:'1px solid #1e1e1e',borderRadius:'8px',padding:'10px 16px',fontSize:'14px',color:'#f1f5f9',outline:'none',fontFamily:"'DM Sans',sans-serif",width:'100%',boxSizing:'border-box'}}
                          onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#1e1e1e';e.target.style.boxShadow='none'}} />
                      </div>
                    ))}
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>Land</label>
                      <select style={{background:'#0e0e0e',border:'1px solid #1e1e1e',borderRadius:'8px',padding:'10px 16px',fontSize:'14px',color:'#f1f5f9',outline:'none',fontFamily:"'DM Sans',sans-serif"}}>
                        <option value="NO">🇳🇴 Norge</option>
                        <option value="SE">🇸🇪 Sverige</option>
                        <option value="DK">🇩🇰 Danmark</option>
                      </select>
                    </div>
                  </div>
                  <div style={{paddingTop:'16px',display:'flex',justifyContent:'flex-end'}}>
                    <button onClick={saveProfile} disabled={savingProfile}
                      style={{background:savingProfile?'#22c55e':'#ff6b00',color:'#fff',fontWeight:700,padding:'10px 24px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:savingProfile?'0 4px 14px rgba(34,197,94,0.3)':'0 4px 14px rgba(255,107,0,0.2)',transition:'all 0.2s'}}>
                      {savingProfile ? '✓ Lagret!' : 'Lagre endringer'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',overflow:'hidden'}}>
                <div style={{padding:'24px',borderBottom:'1px solid #1e1e1e'}}>
                  <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Varslingsinnstillinger</h3>
                  <p style={{fontSize:'14px',color:'#94a3b8',marginTop:'2px'}}>Velg hvordan du vil bli varslet om nye tilbud.</p>
                </div>
                <div style={{padding:'24px',display:'flex',flexDirection:'column',gap:'24px'}}>
                  {[
                    {label:'E-postvarsler',desc:'Få ukentlige oppsummeringer av de beste flyprisene.',val:emailVarsler,set:setEmailVarsler},
                    {label:'Markedsføring',desc:'Motta informasjon om nye funksjoner og kampanjer.',val:markedsforing,set:setMarkedsforing},
                  ].map(item => (
                    <div key={item.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                      <div>
                        <p style={{fontWeight:500,color:'#f1f5f9'}}>{item.label}</p>
                        <p style={{fontSize:'12px',color:'#94a3b8',marginTop:'2px'}}>{item.desc}</p>
                      </div>
                      <div className="toggle-track" onClick={()=>item.set(!item.val)} style={{background:item.val?'#ff6b00':'#2a2a2a'}}>
                        <div className="toggle-knob" style={{transform:item.val?'translateX(20px)':'none'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Subscription */}
              <section style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',overflow:'hidden'}}>
                <div style={{padding:'24px',borderBottom:'1px solid #1e1e1e',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Abonnementsstatus</h3>
                    <p style={{fontSize:'14px',color:'#94a3b8',marginTop:'2px'}}>Du har aktivt FlyDeals-abonnement.</p>
                  </div>
                  <span style={{padding:'4px 12px',background:'rgba(34,197,94,0.15)',color:'#4ade80',fontSize:'12px',fontWeight:700,borderRadius:'100px',border:'1px solid rgba(34,197,94,0.25)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Aktiv</span>
                </div>
                <div style={{padding:'24px'}}>
                  <div style={{background:'#0e0e0e',padding:'24px',borderRadius:'12px',border:'1px solid #1e1e1e',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'24px'}}>
                    <div>
                      <p style={{fontSize:'14px',fontWeight:700,color:'#f1f5f9'}}>Neste fakturering</p>
                      <p style={{fontSize:'24px',fontWeight:900,color:'#ff6b00',letterSpacing:'-0.5px',marginTop:'4px'}}>149 kr <span style={{fontSize:'14px',fontWeight:400,color:'#64748b'}}>/ måned</span></p>
                      <p style={{fontSize:'12px',color:'#64748b',marginTop:'4px'}}>Neste fornyelse: 24. mai 2026 · Ingen binding</p>
                    </div>
                    <button onClick={()=>setShowCancelModal(true)} style={{padding:'8px 16px',borderRadius:'8px',background:'rgba(239,68,68,0.1)',color:'#ef4444',fontSize:'14px',fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all 0.2s'}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#ef4444';(e.currentTarget as HTMLButtonElement).style.color='#fff'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(239,68,68,0.1)';(e.currentTarget as HTMLButtonElement).style.color='#ef4444'}}>
                      Si opp abonnement
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section style={{border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.05)',borderRadius:'12px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
                  <div>
                    <h3 style={{fontSize:'18px',fontWeight:700,color:'#ef4444'}}>Slett konto</h3>
                    <p style={{fontSize:'14px',color:'#94a3b8',marginTop:'2px'}}>Dette vil slette alle dine data permanent. Dette kan ikke angres.</p>
                  </div>
                  <button onClick={()=>setShowDeleteModal(true)} style={{padding:'10px 24px',background:'#ef4444',color:'#fff',borderRadius:'8px',fontWeight:700,border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 14px rgba(239,68,68,0.2)',whiteSpace:'nowrap'}}>
                    Slett min konto
                  </button>
                </div>
              </section>

            </div>

            <footer style={{marginTop:'48px',textAlign:'center',color:'#475569',fontSize:'12px',paddingBottom:'48px'}}>
              © 2026 FlyDeals. Alle rettigheter reservert.<br />
              <a href="#" style={{color:'inherit',textDecoration:'underline'}}>Vilkår og betingelser</a> • <a href="#" style={{color:'inherit',textDecoration:'underline'}}>Personvern</a>
            </footer>
          </div>
        </main>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowCancelModal(false)} style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'32px',maxWidth:'420px',width:'90%',textAlign:'center'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(239,68,68,0.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <span className="ms" style={{fontSize:'24px',color:'#ef4444'}}>warning</span>
            </div>
            <h3 style={{fontSize:'18px',fontWeight:800,marginBottom:'8px',color:'#fff'}}>Si opp abonnement?</h3>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',lineHeight:1.6,marginBottom:'24px'}}>Du vil miste tilgangen til FlyDeals ved slutten av nåværende periode (<strong style={{color:'#fff'}}>24. mai 2026</strong>). Du kan reaktivere abonnementet når som helst.</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button onClick={()=>setShowCancelModal(false)} style={{padding:'10px 20px',borderRadius:'8px',background:'#1e1e1e',color:'rgba(255,255,255,0.7)',fontWeight:600,fontSize:'14px',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Avbryt</button>
              <button onClick={confirmCancel} style={{padding:'10px 20px',borderRadius:'8px',background:'#ef4444',color:'#fff',fontWeight:700,fontSize:'14px',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Si opp abonnement</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)} style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'32px',maxWidth:'420px',width:'90%'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(239,68,68,0.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
              <span className="ms" style={{fontSize:'24px',color:'#ef4444'}}>delete_forever</span>
            </div>
            <h3 style={{fontSize:'18px',fontWeight:800,marginBottom:'8px',color:'#ef4444'}}>Slett konto permanent</h3>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',lineHeight:1.6,marginBottom:'16px'}}>Dette vil slette alle dine data, varsler og historikk for alltid. Denne handlingen kan ikke angres.</p>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'8px'}}>Skriv inn <strong style={{color:'#fff'}}>SLETT</strong> for å bekrefte:</p>
            <input placeholder="SLETT" value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)}
              style={{width:'100%',background:'#050505',border:'1px solid #1e1e1e',borderRadius:'8px',padding:'10px 14px',color:'#fff',fontSize:'14px',marginBottom:'20px',outline:'none',boxSizing:'border-box',fontFamily:"'DM Sans',sans-serif"}} />
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button onClick={()=>{setShowDeleteModal(false);setDeleteConfirm('')}} style={{padding:'10px 20px',borderRadius:'8px',background:'#1e1e1e',color:'rgba(255,255,255,0.7)',fontWeight:600,fontSize:'14px',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Avbryt</button>
              <button onClick={confirmDelete} disabled={deleteConfirm!=='SLETT'}
                style={{padding:'10px 20px',borderRadius:'8px',background:'#ef4444',color:'#fff',fontWeight:700,fontSize:'14px',border:'none',cursor:deleteConfirm==='SLETT'?'pointer':'not-allowed',opacity:deleteConfirm==='SLETT'?1:0.4,transition:'opacity 0.2s',fontFamily:"'DM Sans',sans-serif"}}>
                Slett konto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{position:'fixed',bottom:'24px',right:'24px',zIndex:200,display:'flex',alignItems:'center',gap:'10px',padding:'14px 20px',borderRadius:'12px',fontSize:'14px',fontWeight:600,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',background:'#111',border:`1px solid ${toast.type==='error'?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}`,color:toast.type==='error'?'#ef4444':'#22c55e',fontFamily:"'DM Sans',sans-serif"}}>
          <span className="ms" style={{fontSize:'18px'}}>{toast.type==='error'?'error':'check_circle'}</span>{toast.msg}
        </div>
      )}
    </>
  )
}
