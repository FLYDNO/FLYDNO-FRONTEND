'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [loginPwdVisible, setLoginPwdVisible] = useState(false)
  const [regPwdVisible, setRegPwdVisible] = useState(false)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'DM Sans',sans-serif;}
        .ms{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
        input{font-family:'DM Sans',sans-serif;}
      `}</style>

      <div style={{background:'#050505',color:'#f1f5f9',minHeight:'100vh',display:'flex',flexDirection:'column',fontFamily:"'DM Sans',sans-serif"}}>

        {/* Orange top bar */}
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'2px',background:'linear-gradient(to right,rgba(255,107,0,0.2),#ff6b00,rgba(255,107,0,0.2))',zIndex:50}}></div>

        <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'64px 16px'}}>

          {/* Logo */}
          <div style={{marginBottom:'32px',display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
            <div style={{width:'56px',height:'56px',background:'#ff6b00',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',boxShadow:'0 8px 25px rgba(255,107,0,0.25)'}}>
              <span className="ms" style={{fontSize:'30px'}}>flight_takeoff</span>
            </div>
            <h1 style={{fontSize:'24px',fontWeight:700,letterSpacing:'-0.5px',color:'#fff'}}>FlyDeals</h1>
          </div>

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div style={{width:'100%',maxWidth:'448px'}}>
              <div style={{background:'#242424',padding:'32px',borderRadius:'16px',border:'1px solid #383838',boxShadow:'0 25px 50px rgba(0,0,0,0.5)'}}>
                <div style={{marginBottom:'28px'}}>
                  <h2 style={{fontSize:'24px',fontWeight:700,marginBottom:'6px',color:'#fff'}}>Velkommen tilbake</h2>
                  <p style={{color:'#94a3b8',fontSize:'14px'}}>Finn de beste reisetilbudene ved å logge inn</p>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>E-post</label>
                    <div style={{position:'relative'}}>
                      <span className="ms" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>mail</span>
                      <input type="email" placeholder="din@epost.no" style={{width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'14px 16px 14px 44px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#444444';e.target.style.boxShadow='none'}} />
                    </div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>Passord</label>
                      <a href="#" style={{fontSize:'12px',fontWeight:600,color:'#ff6b00',textDecoration:'none'}}>Glemt passord?</a>
                    </div>
                    <div style={{position:'relative'}}>
                      <span className="ms" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>lock</span>
                      <input type={loginPwdVisible ? 'text' : 'password'} placeholder="••••••••" style={{width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'14px 48px 14px 44px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#444444';e.target.style.boxShadow='none'}} />
                      <button type="button" onClick={()=>setLoginPwdVisible(!loginPwdVisible)} style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#64748b'}}>
                        <span className="ms" style={{fontSize:'20px'}}>{loginPwdVisible ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={()=>window.location.href='/deals'} style={{width:'100%',background:'#ff6b00',color:'#fff',fontWeight:700,padding:'14px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(255,107,0,0.2)'}}>
                    Logg inn
                  </button>
                </div>

                {/* Divider */}
                <div style={{position:'relative',margin:'28px 0'}}>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center'}}><div style={{width:'100%',borderTop:'1px solid #383838'}}></div></div>
                  <div style={{position:'relative',display:'flex',justifyContent:'center'}}>
                    <span style={{background:'#242424',padding:'0 12px',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#64748b'}}>Eller logg inn med</span>
                  </div>
                </div>

                {/* Google */}
                <button style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'12px',cursor:'pointer',fontSize:'14px',fontWeight:500,color:'#e2e8f0',fontFamily:"'DM Sans',sans-serif",transition:'background 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.background='#383838')} onMouseLeave={e=>(e.currentTarget.style.background='#2e2e2e')}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <p style={{marginTop:'28px',textAlign:'center',fontSize:'14px',color:'#64748b'}}>
                  Ny hos FlyDeals?{' '}
                  <button onClick={()=>setView('register')} style={{color:'#ff6b00',fontWeight:600,background:'none',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",marginLeft:'4px'}}>Prøv gratis</button>
                </p>
              </div>

              <p style={{marginTop:'24px',textAlign:'center',fontSize:'12px',color:'#475569',lineHeight:1.6}}>
                Ved å logge inn godtar du våre <a href="#" style={{textDecoration:'underline',color:'inherit'}}>vilkår</a> og <a href="#" style={{textDecoration:'underline',color:'inherit'}}>personvernregler</a>.
              </p>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <div style={{width:'100%',maxWidth:'448px'}}>
              <div style={{background:'#242424',padding:'32px',borderRadius:'16px',border:'1px solid #383838',boxShadow:'0 25px 50px rgba(0,0,0,0.5)'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',color:'#4ade80',fontSize:'12px',fontWeight:700,padding:'6px 12px',borderRadius:'100px',marginBottom:'24px'}}>
                  <span style={{width:'6px',height:'6px',background:'#4ade80',borderRadius:'50%'}}></span>
                  7 dager gratis — ingen binding
                </div>

                <div style={{marginBottom:'28px'}}>
                  <h2 style={{fontSize:'24px',fontWeight:700,marginBottom:'6px',color:'#fff'}}>Opprett konto</h2>
                  <p style={{color:'#94a3b8',fontSize:'14px'}}>Kom i gang på under ett minutt</p>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>Navn</label>
                    <div style={{position:'relative'}}>
                      <span className="ms" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>person</span>
                      <input type="text" placeholder="Ditt navn" style={{width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'14px 16px 14px 44px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#444444';e.target.style.boxShadow='none'}} />
                    </div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>E-post</label>
                    <div style={{position:'relative'}}>
                      <span className="ms" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>mail</span>
                      <input type="email" placeholder="din@epost.no" style={{width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'14px 16px 14px 44px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#444444';e.target.style.boxShadow='none'}} />
                    </div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'14px',fontWeight:500,color:'#cbd5e1'}}>Passord</label>
                    <div style={{position:'relative'}}>
                      <span className="ms" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'20px',color:'#64748b'}}>lock</span>
                      <input type={regPwdVisible ? 'text' : 'password'} placeholder="Minst 8 tegn" style={{width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'14px 48px 14px 44px',fontSize:'14px',color:'#e2e8f0',outline:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>{e.target.style.borderColor='rgba(255,107,0,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(255,107,0,0.15)'}} onBlur={e=>{e.target.style.borderColor='#444444';e.target.style.boxShadow='none'}} />
                      <button type="button" onClick={()=>setRegPwdVisible(!regPwdVisible)} style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#64748b'}}>
                        <span className="ms" style={{fontSize:'20px'}}>{regPwdVisible ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={()=>window.location.href='/deals'} style={{width:'100%',background:'#ff6b00',color:'#fff',fontWeight:700,padding:'14px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(255,107,0,0.2)'}}>
                    Start gratis prøveperiode
                  </button>

                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',fontSize:'12px',color:'#64748b'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Sikker betaling via Stripe — vi lagrer ikke kortinfo
                  </div>

                  <p style={{fontSize:'12px',textAlign:'center',color:'#475569'}}>Etter 7 dager: 149 kr/mnd. Avbryt når som helst.</p>
                </div>

                {/* Divider */}
                <div style={{position:'relative',margin:'28px 0'}}>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center'}}><div style={{width:'100%',borderTop:'1px solid #383838'}}></div></div>
                  <div style={{position:'relative',display:'flex',justifyContent:'center'}}>
                    <span style={{background:'#242424',padding:'0 12px',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#64748b'}}>Eller registrer med</span>
                  </div>
                </div>

                {/* Google */}
                <button style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',width:'100%',background:'#2e2e2e',border:'1px solid #444444',borderRadius:'12px',padding:'12px',cursor:'pointer',fontSize:'14px',fontWeight:500,color:'#e2e8f0',fontFamily:"'DM Sans',sans-serif",transition:'background 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.background='#383838')} onMouseLeave={e=>(e.currentTarget.style.background='#2e2e2e')}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <p style={{marginTop:'28px',textAlign:'center',fontSize:'14px',color:'#64748b'}}>
                  Har du allerede konto?{' '}
                  <button onClick={()=>setView('login')} style={{color:'#ff6b00',fontWeight:600,background:'none',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",marginLeft:'4px'}}>Logg inn</button>
                </p>
              </div>

              <p style={{marginTop:'24px',textAlign:'center',fontSize:'12px',color:'#475569',lineHeight:1.6}}>
                Ved å registrere deg godtar du våre <a href="#" style={{textDecoration:'underline',color:'inherit'}}>vilkår</a> og <a href="#" style={{textDecoration:'underline',color:'inherit'}}>personvernregler</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
