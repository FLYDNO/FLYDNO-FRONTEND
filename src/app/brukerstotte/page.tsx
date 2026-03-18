'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  { q: 'Hva er FlyDeals og hva får jeg?', a: 'FlyDeals overvåker flypriser fra 6 norske flyplasser til 237+ destinasjoner verden over. Når prisene faller betydelig under det normale varsler vi deg på e-post, slik at du kan booke billige flybilletter direkte hos flyselskapet.' },
  { q: 'Hva koster det, og er det bindingstid?', a: '149 kr per måned. De første 7 dagene er helt gratis — ingen kredittkort trengs for prøveperioden. Ingen bindingstid, du kan si opp når som helst.' },
  { q: 'Booker FlyDeals flyet for meg?', a: 'Nei — vi finner dealene, du booker direkte hos flyselskapet. Slik unngår du mellomledd og ekstra gebyrer, og du har full kontroll over bestillingen din.' },
  { q: 'Hvilke flyplasser dekker dere?', a: 'Oslo (OSL), Bergen (BGO), Trondheim (TRD), Stavanger (SVG), Tromsø (TOS) og Torp/Sandefjord (TRF) — til 237+ destinasjoner verden over.' },
  { q: 'Hva er en «deal»?', a: 'En deal er en flypris som er vesentlig lavere enn det vi normalt ser for den ruten. Vi viser deg nøyaktig hvor mye du sparer sammenlignet med vanlig pris.' },
];

export default function BrukerstottePage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [sendState, setSendState] = useState<'idle'|'sending'|'sent'>('idle');
  const [sendError, setSendError] = useState('');
  const [form, setForm] = useState({ navn: '', epost: '', emne: 'Velg kategori', melding: '' });

  const sendMelding = () => {
    setSendError('');
    if (!form.navn) return setSendError('Vennligst skriv inn ditt navn.');
    if (!form.epost || !/^[^@]+@[^@]+\.[^@]+$/.test(form.epost)) return setSendError('Ugyldig e-postadresse.');
    if (form.emne === 'Velg kategori') return setSendError('Vennligst velg en kategori.');
    if (!form.melding) return setSendError('Vennligst skriv en melding.');

    setSendState('sending');
    setTimeout(() => {
      setSendState('sent');
      setForm({ navn: '', epost: '', emne: 'Velg kategori', melding: '' });
      setTimeout(() => setSendState('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00; color: #ff6b00; }
        .nav-link { border-left: 3px solid transparent; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
        .faq-open .faq-answer { max-height: 200px; padding-bottom: 16px; }
        .faq-icon { transition: transform 0.3s; }
        .faq-open .faq-icon { transform: rotate(45deg); }
      `}</style>

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1e1e1e] bg-[#050505] flex flex-col">
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ff6b00] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <span className="ms" style={{fontSize:'18px'}}>flight_takeoff</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-white">FlyDeals</h1>
            <p className="text-[11px] text-slate-500 font-medium">Varsler deg om flydeals</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 mt-1">
          <Link href="/deals" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
            <span className="ms" style={{fontSize:'18px'}}>local_offer</span>
            <span className="text-sm font-medium">Live Deals</span>
          </Link>
          <Link href="/varsler" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
            <span className="ms" style={{fontSize:'18px'}}>notifications</span>
            <span className="text-sm font-medium">Dine Varsler</span>
          </Link>
          <Link href="/oppdag" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
            <span className="ms" style={{fontSize:'18px'}}>explore</span>
            <span className="text-sm font-medium">Oppdag Ruter</span>
          </Link>
          <Link href="/historikk" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
            <span className="ms" style={{fontSize:'18px'}}>history</span>
            <span className="text-sm font-medium">Historikk</span>
          </Link>
          <div className="pt-3 mt-2 border-t border-[#1e1e1e] space-y-0.5">
            <Link href="/innstillinger" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
              <span className="ms" style={{fontSize:'18px'}}>settings</span>
              <span className="text-sm font-medium">Innstillinger</span>
            </Link>
            <Link href="/brukerstotte" className="nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl">
              <span className="ms ms-fill" style={{fontSize:'18px'}}>help</span>
              <span className="text-sm font-semibold">Brukerstøtte</span>
            </Link>
          </div>
        </nav>
        <div className="p-3 mt-auto border-t border-[#1e1e1e]">
          <div className="bg-[#242424] rounded-xl p-3 border border-[#1e1e1e] flex items-center gap-3">
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Marius Jensen</p>
              <p className="text-[11px] text-slate-500 truncate">marius@flydeals.no</p>
            </div>
            <Link href="/innstillinger" className="text-slate-500 hover:text-[#ff6b00] transition-colors">
              <span className="ms" style={{fontSize:'16px'}}>settings</span>
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="h-14 border-b border-[#1e1e1e] sticky top-0 z-10 bg-[#050505]/90 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-400 font-medium">847 deals funnet hittil</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="relative p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-[#111] transition-colors">
              <span className="ms" style={{fontSize:'20px'}}>notifications</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff6b00] rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-[#2e2e2e] mx-1"></div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e1e] text-sm font-medium text-slate-400 hover:bg-[#111] hover:text-slate-200 transition-colors">
              <span className="ms" style={{fontSize:'16px'}}>logout</span>
              Logg ut
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
          {/* Hero */}
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Hvordan kan vi hjelpe?</h1>
            <p className="text-slate-500">Finn svar i FAQ-en vår, eller send oss en melding.</p>
          </div>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold mb-5">Ofte stilte spørsmål</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <Link href="/varsler" className="p-4 rounded-2xl bg-[#111] border border-[#1e1e1e] hover:border-[#ff6b00]/30 transition-all group flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <span className="ms p-2.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-xl" style={{fontSize:'20px'}}>notifications</span>
                  <div>
                    <h3 className="font-bold text-sm">Administrer varsler</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Legg til, endre eller deaktiver varsler</p>
                  </div>
                </div>
                <span className="ms text-slate-500 group-hover:text-[#ff6b00] transition-colors" style={{fontSize:'18px'}}>arrow_forward</span>
              </Link>
              <Link href="/innstillinger" className="p-4 rounded-2xl bg-[#111] border border-[#1e1e1e] hover:border-[#ff6b00]/30 transition-all group flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <span className="ms p-2.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-xl" style={{fontSize:'20px'}}>mail</span>
                  <div>
                    <h3 className="font-bold text-sm">Endre e-postadresse</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Oppdater kontaktinformasjonen din</p>
                  </div>
                </div>
                <span className="ms text-slate-500 group-hover:text-[#ff6b00] transition-colors" style={{fontSize:'18px'}}>arrow_forward</span>
              </Link>
              <Link href="/innstillinger" className="p-4 rounded-2xl bg-[#111] border border-[#1e1e1e] hover:border-[#ff6b00]/30 transition-all group flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <span className="ms p-2.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-xl" style={{fontSize:'20px'}}>payments</span>
                  <div>
                    <h3 className="font-bold text-sm">Abonnement og betaling</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Se eller si opp abonnementet ditt</p>
                  </div>
                </div>
                <span className="ms text-slate-500 group-hover:text-[#ff6b00] transition-colors" style={{fontSize:'18px'}}>arrow_forward</span>
              </Link>
              <Link href="/historikk" className="p-4 rounded-2xl bg-[#111] border border-[#1e1e1e] hover:border-[#ff6b00]/30 transition-all group flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <span className="ms p-2.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-xl" style={{fontSize:'20px'}}>history</span>
                  <div>
                    <h3 className="font-bold text-sm">Se mottatte deals</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Oversikt over alle deals sendt til deg</p>
                  </div>
                </div>
                <span className="ms text-slate-500 group-hover:text-[#ff6b00] transition-colors" style={{fontSize:'18px'}}>arrow_forward</span>
              </Link>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-0 bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden divide-y divide-[#1e1e1e]">
              {faqs.map((faq, i) => (
                <div key={i} className={`px-5 ${openFaq === i ? 'faq-open' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-sm font-semibold">{faq.q}</span>
                    <span className="ms faq-icon text-slate-500 flex-shrink-0 ml-4" style={{fontSize:'18px'}}>add</span>
                  </button>
                  <div className="faq-answer">
                    <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact form */}
          <section className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1">Fant du ikke svaret?</h2>
            <p className="text-slate-500 text-sm mb-6">Send oss en melding — vi svarer som regel innen 24 timer.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Fullt navn</label>
                <input value={form.navn} onChange={e => setForm({...form, navn: e.target.value})} className="w-full bg-[#050505] border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none text-slate-100 placeholder:text-slate-600" placeholder="Ola Nordmann" type="text"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">E-postadresse</label>
                <input value={form.epost} onChange={e => setForm({...form, epost: e.target.value})} className="w-full bg-[#050505] border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none text-slate-100 placeholder:text-slate-600" placeholder="ola@eksempel.no" type="email"/>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Emne</label>
                <select value={form.emne} onChange={e => setForm({...form, emne: e.target.value})} className="w-full bg-[#050505] border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none text-slate-400">
                  <option>Velg kategori</option>
                  <option>Spørsmål om abonnement</option>
                  <option>Problem med deals</option>
                  <option>Teknisk problem</option>
                  <option>Annet</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Melding</label>
                <textarea value={form.melding} onChange={e => setForm({...form, melding: e.target.value})} className="w-full bg-[#050505] border border-[#1e1e1e] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none text-slate-100 placeholder:text-slate-600 resize-none" rows={4} placeholder="Beskriv spørsmålet ditt..."></textarea>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={sendMelding}
                  disabled={sendState === 'sending'}
                  className={`flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg text-sm ${sendState === 'sent' ? 'bg-green-600' : 'bg-[#ff6b00] hover:bg-[#e55f00] shadow-[#ff6b00]/20'} ${sendState === 'sending' ? 'opacity-80' : ''}`}
                >
                  <span>{sendState === 'sending' ? 'Sender...' : sendState === 'sent' ? 'Melding sendt!' : 'Send melding'}</span>
                  <span className="ms" style={{fontSize:'18px'}}>{sendState === 'sending' ? 'hourglass_empty' : sendState === 'sent' ? 'check_circle' : 'send'}</span>
                </button>
                {sendError && <p className="text-xs text-red-400 mt-2">{sendError}</p>}
              </div>
            </div>
          </section>

          {/* Contact info */}
          <div className="flex flex-wrap gap-8 pb-8 border-t border-[#1e1e1e] pt-8">
            <div className="flex items-center gap-3">
              <span className="ms text-[#ff6b00]" style={{fontSize:'24px'}}>mail</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">E-post</p>
                <p className="font-semibold text-sm">hei@flydeals.no</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="ms text-[#ff6b00]" style={{fontSize:'24px'}}>schedule</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Svartid</p>
                <p className="font-semibold text-sm">Innen 24 timer</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
