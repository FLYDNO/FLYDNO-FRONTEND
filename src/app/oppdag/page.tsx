'use client';
import { useState } from 'react';
import Link from 'next/link';

const destinations = [
  { name: 'Barcelona 🇪🇸', region: 'europa', search: 'barcelona spania', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', badge: 'Toppvalg', discount: '-38%', price: '699 kr', from: 'Fra Trondheim • Direktefly', duration: '3t 10m', month: 'Apr 2026' },
  { name: 'London 🇬🇧', region: 'europa', search: 'london storbritannia', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', badge: null, discount: '-35%', price: '489 kr', from: 'Fra Bergen • Direktefly', duration: '2t 5m', month: 'Mars 2026' },
  { name: 'Bangkok 🇹🇭', region: 'asia', search: 'bangkok thailand', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', badge: null, discount: '-47%', price: '2 489 kr', from: 'Fra Oslo • Thai Airways', duration: '11t 20m', month: 'Mar–Apr 2026' },
  { name: 'Dubai 🇦🇪', region: 'asia', search: 'dubai emiratene', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', badge: null, discount: '-33%', price: '1 990 kr', from: 'Fra Oslo • Emirates', duration: '6t 55m', month: 'April 2026' },
  { name: 'New York 🇺🇸', region: 'amerika', search: 'new york usa', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', badge: null, discount: '-41%', price: '2 890 kr', from: 'Fra Oslo • SAS', duration: '9t 15m', month: 'Apr–Mai 2026' },
  { name: 'Tokyo 🇯🇵', region: 'asia', search: 'tokyo japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', badge: null, discount: '-44%', price: '3 490 kr', from: 'Fra Oslo • ANA', duration: '14t 30m', month: 'Mai–Jun 2026' },
];

const quickRoutes = [
  { flag: '🇪🇸', route: 'Oslo → Alicante', airline: 'Ryanair · Mars 2026', price: '549 kr' },
  { flag: '🇮🇸', route: 'Tromsø → Reykjavik', airline: 'Icelandair · April 2026', price: '890 kr' },
  { flag: '🇳🇱', route: 'Stavanger → Amsterdam', airline: 'KLM · Mars 2026', price: '549 kr' },
  { flag: '🇮🇹', route: 'Bergen → Roma', airline: 'SAS · Mars 2026', price: '599 kr' },
  { flag: '🇫🇷', route: 'Trondheim → Paris', airline: 'Air France · April 2026', price: '649 kr' },
];

const regions = [
  { key: 'alle', label: 'Alle' },
  { key: 'europa', label: '🌍 Europa' },
  { key: 'asia', label: '🌏 Asia' },
  { key: 'amerika', label: '🌎 Amerika' },
  { key: 'afrika', label: '🌍 Afrika' },
  { key: 'norden', label: '🏔 Norden' },
];

export default function OppdagPage() {
  const [region, setRegion] = useState('alle');
  const [search, setSearch] = useState('');

  const visible = destinations.filter(d => {
    const matchRegion = region === 'alle' || d.region === region;
    const q = search.toLowerCase().trim();
    const matchSearch = q === '' || d.search.includes(q) || d.region.includes(q);
    return matchRegion && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00; color: #ff6b00; }
        .nav-link { border-left: 3px solid transparent; }
        .dest-card:hover .dest-img { transform: scale(1.05); }
        .dest-card:hover { border-color: rgba(255,107,0,0.3); }
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
          <Link href="/oppdag" className="nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl">
            <span className="ms ms-fill" style={{fontSize:'18px'}}>explore</span>
            <span className="text-sm font-semibold">Oppdag Ruter</span>
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
            <Link href="/brukerstotte" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
              <span className="ms" style={{fontSize:'18px'}}>help</span>
              <span className="text-sm font-medium">Brukerstøtte</span>
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

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
          {/* Header + search */}
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Oppdag Ruter</h1>
            <p className="text-slate-500 mb-6">Finn de beste destinasjonene fra norske flyplasser.</p>
            <div className="relative group">
              <span className="ms absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff6b00] transition-colors" style={{fontSize:'20px'}}>search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#1e1e1e] rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-200 placeholder:text-slate-600 text-sm"
                placeholder="Søk etter by, land eller flyplass..."
                type="text"
              />
            </div>
          </div>

          {/* Region filters */}
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <button
                key={r.key}
                onClick={() => setRegion(r.key)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${region === r.key ? 'font-semibold bg-[#ff6b00] text-white' : 'font-medium bg-[#111] border border-[#1e1e1e] text-slate-400 hover:border-[#ff6b00]/40'}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Destinations */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold">Populære destinasjoner</h3>
              <Link href="/deals" className="text-[#ff6b00] text-sm font-semibold hover:underline">Se alle deals →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((d, i) => (
                <div key={i} className="dest-card bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer">
                  <div className="h-44 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="dest-img w-full h-full object-cover transition-transform duration-500" src={d.img} alt={d.name}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {d.badge && <span className="bg-[#ff6b00] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">{d.badge}</span>}
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">{d.discount}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                      <p className="text-[10px] text-slate-400">Fra</p>
                      <p className="text-[#ff6b00] font-black text-base leading-none">{d.price}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base">{d.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <span className="ms" style={{fontSize:'13px'}}>flight</span> {d.from}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><span className="ms" style={{fontSize:'13px'}}>schedule</span>{d.duration}</span>
                      <span className="w-1 h-1 bg-[#1e1e1e] rounded-full"></span>
                      <span className="flex items-center gap-1"><span className="ms" style={{fontSize:'13px'}}>calendar_month</span>{d.month}</span>
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#ff6b00]/30 text-[#ff6b00] text-xs font-bold hover:bg-[#ff6b00]/10 transition-all">
                      <span className="ms" style={{fontSize:'14px'}}>notifications</span>Opprett varsel
                    </button>
                  </div>
                </div>
              ))}
              {visible.length === 0 && (
                <div className="col-span-3 py-16 text-center">
                  <span className="ms" style={{fontSize:'40px', color:'#2e2e2e'}}>flight_off</span>
                  <p className="text-slate-500 mt-3 text-sm">Ingen destinasjoner funnet</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick routes */}
          <section>
            <h3 className="text-xl font-bold mb-5">Billige ruter akkurat nå</h3>
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1e1e1e] overflow-hidden">
              {quickRoutes.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#ff6b00]/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{r.flag}</span>
                    <div>
                      <p className="text-sm font-semibold">{r.route}</p>
                      <p className="text-xs text-slate-500">{r.airline}</p>
                    </div>
                  </div>
                  <p className="text-[#ff6b00] font-black text-base">{r.price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
