import AppShell from '@/components/AppShell'

export default function HistorikkPage() {
  const items = [
    {dest:'New York 🇺🇸',code:'JFK',fra:'🇳🇴 Oslo (OSL)',dato:'15. Jan 2026',pris:'2 490 kr',disc:'-41%'},
    {dest:'London 🇬🇧',code:'LHR',fra:'🇳🇴 Bergen (BGO)',dato:'10. Jan 2026',pris:'890 kr',disc:'-35%'},
    {dest:'Tokyo 🇯🇵',code:'HND',fra:'🇳🇴 Oslo (OSL)',dato:'07. Jan 2026',pris:'5 920 kr',disc:'-47%'},
    {dest:'Alicante 🇪🇸',code:'ALC',fra:'Trondheim (TRD)',dato:'03. Jan 2026',pris:'1 150 kr',disc:'-31%'},
    {dest:'Bangkok 🇹🇭',code:'BKK',fra:'🇳🇴 Oslo (OSL)',dato:'28. Des 2025',pris:'6 340 kr',disc:'-44%'},
  ]
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-1 text-slate-100">Historikk</h2>
              <p className="text-slate-500">Alle deals vi har sendt deg – synkronisert i sanntid.</p>
            </div>
            <button className="bg-[#111] border border-[#1e1e1e] text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-all flex items-center gap-2 self-start">
              <span className="ms" style={{fontSize:'16px'}}>filter_list</span>Filtrer
            </button>
          </div>
        </header>
        <div className="relative mb-6 group">
          <span className="ms absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff6b00] transition-colors" style={{fontSize:'20px'}}>search</span>
          <input className="w-full bg-[#111] border border-[#1e1e1e] rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-200 placeholder:text-slate-600" placeholder="Søk i ruter, flyplasser eller byer..." type="text"/>
        </div>
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-[#111] border border-[#1e1e1e] rounded-xl text-xs text-slate-400">
          <span className="ms text-[#ff6b00]" style={{fontSize:'16px'}}>verified</span>
          Kun de beste tilbudene når deg – vi filtrerer ut støyen.
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-2">Mottatte varsler</h3>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1e1e1e] overflow-hidden">
            {items.map((item,i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                    <span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black tracking-tight text-slate-100">{item.dest}</span>
                      <span className="text-xs font-medium text-slate-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">{item.code}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-500">fra {item.fra}</span>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><span className="ms" style={{fontSize:'13px'}}>calendar_month</span>{item.dato}</span>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><span className="ms" style={{fontSize:'13px'}}>mail</span>Sendt på e-post</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xl font-black text-[#ff6b00]">{item.pris}</p>
                  <span className="inline-block mt-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{item.disc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center py-6">
            <button className="flex items-center gap-2 text-slate-500 hover:text-[#ff6b00] font-semibold transition-colors text-sm">
              Vis flere<span className="ms" style={{fontSize:'20px'}}>expand_more</span>
            </button>
          </div>
        </div>
        <section className="mt-2 bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-[#1e1e1e]">
            <div className="px-6 py-5"><p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Varsler mottatt</p><p className="text-2xl font-black text-slate-100 leading-none">5 deals</p></div>
            <div className="px-6 py-5"><p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Varslingsmetode</p><span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#ff6b00]/10 text-[#ff6b00] px-2.5 py-1 rounded-full border border-[#ff6b00]/20 mt-1"><span className="ms" style={{fontSize:'13px'}}>mail</span>E-post</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
