'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const Flag = ({c}: {c: string}) => <span className={`fi fi-${c} fis`} style={{width:'1.1em',height:'0.85em',display:'inline-block',verticalAlign:'middle',marginBottom:'1px',borderRadius:'2px'}}></span>;

const historyItems = [
  { to: 'New York', fc: 'us', code: 'JFK', from: 'fra Oslo (OSL)', date: '15. Jan 2026', price: '2 490 kr', discount: '-41%', search: 'new york jfk oslo' },
  { to: 'London', fc: 'gb', code: 'LHR', from: 'fra Bergen (BGO)', date: '10. Jan 2026', price: '890 kr', discount: '-35%', search: 'london lhr bergen' },
  { to: 'Tokyo', fc: 'jp', code: 'HND', from: 'fra Oslo (OSL)', date: '07. Jan 2026', price: '5 920 kr', discount: '-47%', search: 'tokyo hnd oslo' },
  { to: 'Alicante', fc: 'es', code: 'ALC', from: 'fra Trondheim (TRD)', date: '03. Jan 2026', price: '1 150 kr', discount: '-31%', search: 'alicante alc trondheim' },
  { to: 'Bangkok', fc: 'th', code: 'BKK', from: 'fra Oslo (OSL)', date: '28. Des 2025', price: '6 340 kr', discount: '-44%', search: 'bangkok bkk oslo' },
];

export default function HistorikkPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [authLoading, user, router]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('alle');
  const [filterLabel, setFilterLabel] = useState('Filtrer');
  const [search, setSearch] = useState('');

  const applyFilter = (type: string, label: string) => {
    setActiveFilter(type);
    setFilterLabel(type === 'alle' ? 'Filtrer' : label);
    setFilterOpen(false);
  };

  const visible = historyItems.filter(item => {
    const q = search.toLowerCase().trim();
    const matchSearch = q === '' || item.search.includes(q) || item.to.toLowerCase().includes(q);
    const matchFilter = activeFilter === 'alle' || item.search.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  if (authLoading || !user) return <div className="flex h-screen items-center justify-center bg-[#050505]"><p className="text-slate-500 animate-pulse">Laster...</p></div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00; color: #ff6b00; }
        .nav-link { border-left: 3px solid transparent; }
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
          <Link href="/historikk" className="nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl">
            <span className="ms ms-fill" style={{fontSize:'18px'}}>history</span>
            <span className="text-sm font-semibold">Historikk</span>
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
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
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
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e1e] text-sm font-medium text-slate-400 hover:bg-[#111] hover:text-slate-200 transition-colors">
              <span className="ms" style={{fontSize:'16px'}}>logout</span>
              Logg ut
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-1">Historikk</h2>
                <p className="text-slate-500">Alle deals vi har sendt deg — synkronisert i sanntid.</p>
              </div>
              <div className="relative self-start">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="bg-[#111] border border-[#1e1e1e] text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-all flex items-center gap-2"
                >
                  <span className="ms" style={{fontSize:'16px'}}>filter_list</span>{filterLabel}
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl shadow-xl z-20 overflow-hidden">
                    {[
                      { type: 'alle', label: 'Alle deals' },
                      { type: 'epost', label: 'Sendt på e-post' },
                      { type: 'oslo', label: 'Fra Oslo (OSL)' },
                      { type: 'bergen', label: 'Fra Bergen (BGO)' },
                      { type: 'trondheim', label: 'Fra Trondheim (TRD)' },
                    ].map(f => (
                      <button key={f.type} onClick={() => applyFilter(f.type, f.label)} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-[#ff6b00]/10 hover:text-[#ff6b00] transition-colors font-medium">
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Search */}
          <div className="relative mb-6 group">
            <span className="ms absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff6b00] transition-colors" style={{fontSize:'20px'}}>search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-[#1e1e1e] rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-200 placeholder:text-slate-600"
              placeholder="Søk i ruter, flyplasser eller byer..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-[#111] border border-[#1e1e1e] rounded-xl text-xs text-slate-400">
            <span className="ms text-[#ff6b00]" style={{fontSize:'16px'}}>verified</span>
            Kun de beste tilbudene når deg — vi filtrerer ut støyen.
          </div>

          {/* History List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-2">Mottatte varsler</h3>
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1e1e1e] overflow-hidden">
              {visible.map((item, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                      <span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-tight">{item.to} <Flag c={item.fc} /></span>
                        <span className="text-xs font-medium text-slate-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">{item.code}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-slate-500">{item.from}</span>
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><span className="ms" style={{fontSize:'13px'}}>calendar_month</span>{item.date}</span>
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><span className="ms" style={{fontSize:'13px'}}>mail</span>Sendt på e-post</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xl font-black text-[#ff6b00]">{item.price}</p>
                    <span className="inline-block mt-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{item.discount}</span>
                  </div>
                </div>
              ))}
              {visible.length === 0 && (
                <div className="py-16 text-center">
                  <span className="ms" style={{fontSize:'40px', color:'#2e2e2e'}}>search_off</span>
                  <p className="text-slate-500 mt-3 text-sm">Ingen deals funnet</p>
                </div>
              )}
            </div>
            <div className="flex justify-center py-6">
              <button className="flex items-center gap-2 text-slate-500 hover:text-[#ff6b00] font-semibold transition-colors text-sm">
                Vis flere<span className="ms" style={{fontSize:'20px'}}>expand_more</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          <section className="mt-2 bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-[#1e1e1e]">
              <div className="px-6 py-5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Varsler mottatt</p>
                <p className="text-2xl font-black text-slate-100 leading-none">5 deals</p>
              </div>
              <div className="px-6 py-5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Varslingsmetode</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#ff6b00]/10 text-[#ff6b00] px-2.5 py-1 rounded-full border border-[#ff6b00]/20 mt-1">
                  <span className="ms" style={{fontSize:'13px'}}>mail</span>E-post
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
