'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

const deals = [
  { from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: '🇹🇭', price: 2489, orig: 4700, discount: 47, dates: 'Mar–Apr 2026', airline: 'Thai Airways', direct: true, origin: 'OSL' },
  { from: 'Bergen', fromCode: 'BGO', to: 'London', toCode: 'LHR', flag: '🇬🇧', price: 489, orig: 1020, discount: 52, dates: 'Mars 2026', airline: 'Norwegian', direct: true, origin: 'BGO' },
  { from: 'Oslo', fromCode: 'OSL', to: 'New York', toCode: 'JFK', flag: '🇺🇸', price: 2890, orig: 4900, discount: 41, dates: 'Apr–Mai 2026', airline: 'SAS', direct: true, origin: 'OSL' },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Barcelona', toCode: 'BCN', flag: '🇪🇸', price: 699, orig: 1130, discount: 38, dates: 'April 2026', airline: 'Norwegian', direct: false, origin: 'TRD' },
  { from: 'Stavanger', fromCode: 'SVG', to: 'Amsterdam', toCode: 'AMS', flag: '🇳🇱', price: 549, orig: 980, discount: 44, dates: 'Mars 2026', airline: 'Norwegian', direct: false, origin: 'SVG' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Tokyo', toCode: 'HND', flag: '🇯🇵', price: 3490, orig: 5720, discount: 39, dates: 'Mai–Jun 2026', airline: 'ANA', direct: false, origin: 'OSL' },
  { from: 'Tromsø', fromCode: 'TOS', to: 'Reykjavik', toCode: 'KEF', flag: '🇮🇸', price: 890, orig: 1370, discount: 35, dates: 'April 2026', airline: 'Icelandair', direct: true, origin: 'TOS' },
  { from: 'Torp', fromCode: 'TRF', to: 'Alicante', toCode: 'ALC', flag: '🇪🇸', price: 399, orig: 814, discount: 51, dates: 'Mar–Apr 2026', airline: 'Ryanair', direct: true, origin: 'TRF' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Dubai', toCode: 'DXB', flag: '🇦🇪', price: 1990, orig: 3490, discount: 43, dates: 'April 2026', airline: 'Emirates', direct: true, origin: 'OSL' },
  { from: 'Bergen', fromCode: 'BGO', to: 'Roma', toCode: 'FCO', flag: '🇮🇹', price: 599, orig: 1110, discount: 46, dates: 'Mars 2026', airline: 'SAS', direct: false, origin: 'BGO' },
  { from: 'Trondheim', fromCode: 'TRD', to: 'Paris', toCode: 'CDG', flag: '🇫🇷', price: 649, orig: 1082, discount: 40, dates: 'April 2026', airline: 'Air France', direct: false, origin: 'TRD' },
  { from: 'Oslo', fromCode: 'OSL', to: 'Bali', toCode: 'DPS', flag: '🇮🇩', price: 4290, orig: 6703, discount: 36, dates: 'Mai 2026', airline: 'Qatar Airways', direct: false, origin: 'OSL' },
];

const airports = [
  { code: 'alle', label: 'Alle flyplasser' },
  { code: 'OSL', label: '🇳🇴 Oslo (OSL)' },
  { code: 'BGO', label: '🇳🇴 Bergen (BGO)' },
  { code: 'TRD', label: '🇳🇴 Trondheim (TRD)' },
  { code: 'SVG', label: '🇳🇴 Stavanger (SVG)' },
  { code: 'TOS', label: '🇳🇴 Tromsø (TOS)' },
  { code: 'TRF', label: '🇳🇴 Torp (TRF)' },
];

const Sidebar = ({ active, userName, userEmail }: { active: string; userName: string; userEmail: string }) => (
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
      <Link href="/deals" className={active==='deals'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
        <span className={`ms${active==='deals'?' ms-fill':''}`} style={{fontSize:'18px'}}>local_offer</span>
        <span className={`text-sm ${active==='deals'?'font-semibold':'font-medium'}`}>Live Deals</span>
      </Link>
      <Link href="/varsler" className={active==='varsler'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
        <span className={`ms${active==='varsler'?' ms-fill':''}`} style={{fontSize:'18px'}}>notifications</span>
        <span className={`text-sm ${active==='varsler'?'font-semibold':'font-medium'}`}>Dine Varsler</span>
      </Link>
      <Link href="/oppdag" className={active==='oppdag'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
        <span className={`ms${active==='oppdag'?' ms-fill':''}`} style={{fontSize:'18px'}}>explore</span>
        <span className={`text-sm ${active==='oppdag'?'font-semibold':'font-medium'}`}>Oppdag Ruter</span>
      </Link>
      <Link href="/historikk" className={active==='historikk'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
        <span className={`ms${active==='historikk'?' ms-fill':''}`} style={{fontSize:'18px'}}>history</span>
        <span className={`text-sm ${active==='historikk'?'font-semibold':'font-medium'}`}>Historikk</span>
      </Link>
      <div className="pt-3 mt-2 border-t border-[#1e1e1e] space-y-0.5">
        <Link href="/innstillinger" className={active==='innstillinger'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
          <span className={`ms${active==='innstillinger'?' ms-fill':''}`} style={{fontSize:'18px'}}>settings</span>
          <span className={`text-sm ${active==='innstillinger'?'font-semibold':'font-medium'}`}>Innstillinger</span>
        </Link>
        <Link href="/brukerstotte" className={active==='brukerstotte'?"nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl":"nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"}>
          <span className={`ms${active==='brukerstotte'?' ms-fill':''}`} style={{fontSize:'18px'}}>help</span>
          <span className={`text-sm ${active==='brukerstotte'?'font-semibold':'font-medium'}`}>Brukerstøtte</span>
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
);

const Topbar = ({ logout }: { logout: () => void }) => (
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
);

export default function DealsPage() {
  const { user, loading: authLoading, logout, userName, userEmail } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState('alle');
  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [authLoading, user, router]);

  const filtered = filter === 'alle' ? deals : deals.filter(d => d.origin === filter);

  if (authLoading || !user) return <div className="flex h-screen items-center justify-center bg-[#050505]"><p className="text-slate-500 animate-pulse">Laster...</p></div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00; color: #ff6b00; }
        .nav-link { border-left: 3px solid transparent; }
        .deal-card:hover { border-color: rgba(255,107,0,0.3); transform: translateY(-1px); }
      `}</style>

      <Sidebar active="deals" userName={userName} userEmail={userEmail} />

      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <Topbar logout={logout} />

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">Live Deals</h2>
            <p className="text-slate-500 mt-1">Oppdateres automatisk. Prisene kan endre seg raskt — book når du ser en god deal.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {airports.map(a => (
              <button
                key={a.code}
                onClick={() => setFilter(a.code)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${filter === a.code ? 'font-semibold bg-[#ff6b00] text-white' : 'font-medium bg-[#111] border border-[#1e1e1e] text-slate-400 hover:border-[#ff6b00]/40'}`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filtered.map((d, i) => (
              <div key={i} className="deal-card bg-[#111] border border-[#1e1e1e] rounded-xl p-3.5 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-black">{d.to} {d.flag}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{d.from} → {d.toCode}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">-{d.discount}%</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 mb-2">
                  <span className="ms text-[#ff6b00]" style={{fontSize:'13px'}}>calendar_month</span>
                  <span className="text-xs font-bold text-white">{d.dates}</span>
                </div>
                <p className="text-xl font-black text-[#ff6b00] leading-none">{d.price.toLocaleString('no')} kr</p>
                <p className="text-[11px] text-slate-600 mt-0.5 line-through">{d.orig.toLocaleString('no')} kr</p>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#1e1e1e] text-[11px] text-slate-500">
                  <span className="ms" style={{fontSize:'13px'}}>airlines</span>
                  <span>{d.airline} · {d.direct ? 'Direktefly' : '1 stopp'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
