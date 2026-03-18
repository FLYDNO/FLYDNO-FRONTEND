'use client';
import { useState } from 'react';
import Link from 'next/link';

const Sidebar = ({ active }: { active: string }) => (
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
      <Link href="/varsler" className="nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl">
        <span className="ms ms-fill" style={{fontSize:'18px'}}>notifications</span>
        <span className="text-sm font-semibold">Dine Varsler</span>
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
);

export default function VarslerPage() {
  const [row1, setRow1] = useState(true);
  const [row2, setRow2] = useState(true);
  const [row3, setRow3] = useState(false);

  const activeCount = [row1, row2, row3].filter(Boolean).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; display: inline-block; white-space: nowrap; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-active { background: rgba(255,107,0,0.1); border-left: 3px solid #ff6b00; color: #ff6b00; }
        .nav-link { border-left: 3px solid transparent; }
        input[type="checkbox"].peer:checked ~ .toggle-track { background-color: #ff6b00 !important; }
      `}</style>

      <Sidebar active="varsler" />

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

        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="text-white text-4xl font-black tracking-tight">Dine varsler</h2>
              <p className="text-slate-400 text-base">Administrer dine aktive prisvarsler for flyreiser over hele verden.</p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg">
              <span className="ms" style={{fontSize:'20px'}}>add</span>
              <span>Legg til nytt varsel</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#111] border border-[#1e1e1e] p-4 rounded-xl">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Aktive varsler</p>
              <p className="text-2xl font-bold mt-1">{activeCount}</p>
            </div>
            <div className="bg-[#111] border border-[#1e1e1e] p-4 rounded-xl">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Treff siste 24t</p>
              <p className="text-2xl font-bold mt-1 text-green-500">12</p>
            </div>
          </div>

          {/* Alert Table */}
          <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-[#1e1e1e]">
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold">Rute</th>
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold">Makspris</th>
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold text-center">Reisemåned</th>
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold text-center">Rabattgrense</th>
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold text-center">Status</th>
                    <th className="px-6 py-4 text-slate-300 text-sm font-semibold text-right">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e1e]">
                  {/* Row 1 */}
                  <tr className={`hover:bg-white/5 transition-all duration-300 group ${!row1 ? 'opacity-40' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ff6b00]/10 rounded-lg text-[#ff6b00]"><span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span></div>
                        <div>
                          <p className="text-white font-bold">New York 🇺🇸 <span className="text-slate-500 font-normal text-xs">(JFK)</span></p>
                          <p className="text-xs text-slate-500">fra Oslo (OSL)</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><p className="text-slate-200 font-medium">5 500 kr</p></td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                          <span className="ms" style={{fontSize:'13px'}}>calendar_month</span>Jul · Aug
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20">20% rabatt</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={row1} onChange={e => setRow1(e.target.checked)} className="sr-only peer" type="checkbox"/>
                          <div className="toggle-track w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>edit</span></button>
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>delete</span></button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className={`hover:bg-white/5 transition-all duration-300 group ${!row2 ? 'opacity-40' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ff6b00]/10 rounded-lg text-[#ff6b00]"><span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span></div>
                        <div>
                          <p className="text-white font-bold">London 🇬🇧 <span className="text-slate-500 font-normal text-xs">(LHR)</span></p>
                          <p className="text-xs text-slate-500">fra Bergen (BGO)</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><p className="text-slate-200 font-medium">1 200 kr</p></td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                          <span className="ms" style={{fontSize:'13px'}}>calendar_month</span>Sep
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20">15% rabatt</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={row2} onChange={e => setRow2(e.target.checked)} className="sr-only peer" type="checkbox"/>
                          <div className="toggle-track w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>edit</span></button>
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>delete</span></button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className={`transition-all duration-300 group ${!row3 ? 'opacity-40' : 'hover:bg-white/5'}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${row3 ? 'bg-[#ff6b00]/10 text-[#ff6b00]' : 'bg-white/5 text-slate-500'} rounded-lg`}><span className="ms" style={{fontSize:'20px'}}>flight_takeoff</span></div>
                        <div>
                          <p className={`font-bold ${row3 ? 'text-white' : 'text-slate-400'}`}>Dubai 🇦🇪 <span className="text-slate-600 font-normal text-xs">(DXB)</span></p>
                          <p className="text-xs text-slate-600">fra Stavanger (SVG)</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><p className="text-slate-500 font-medium">4 800 kr</p></td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-600 border border-white/5">
                          <span className="ms" style={{fontSize:'13px'}}>calendar_month</span>Des
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-500 border border-white/5">25% rabatt</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={row3} onChange={e => setRow3(e.target.checked)} className="sr-only peer" type="checkbox"/>
                          <div className="toggle-track w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-600 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>edit</span></button>
                      <button className="text-slate-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"><span className="ms" style={{fontSize:'20px'}}>delete</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Hits */}
          <div className="mt-12">
            <h3 className="text-white text-2xl font-bold mb-6">Nylige treff</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Hit Card 1 */}
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#ff6b00]/50 transition-all cursor-pointer">
                <div className="h-32 w-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="New York City skyline" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Tilgjengelig nå</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-white">New York 🇺🇸</h4>
                      <p className="text-xs text-slate-500">fra Oslo (OSL → JFK)</p>
                    </div>
                    <p className="text-[#ff6b00] font-black">4 290 kr</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 mt-2">
                    <span className="ms" style={{fontSize:'16px'}}>calendar_month</span>
                    <span>12. Okt - 19. Okt</span>
                  </div>
                  <button className="w-full py-2 bg-[#2a2a2a] hover:bg-[#ff6b00] text-white text-sm font-bold rounded-lg transition-colors">Se tilbud</button>
                </div>
              </div>
              {/* Hit Card 2 */}
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#ff6b00]/50 transition-all cursor-pointer">
                <div className="h-32 w-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="London Big Ben" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Utgått</div>
                </div>
                <div className="p-4 opacity-75">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-white">London 🇬🇧</h4>
                      <p className="text-xs text-slate-500">fra Bergen (BGO → LHR)</p>
                    </div>
                    <p className="text-slate-400 font-black">980 kr</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 mt-2">
                    <span className="ms" style={{fontSize:'16px'}}>calendar_month</span>
                    <span>05. Nov - 08. Nov</span>
                  </div>
                  <button className="w-full py-2 bg-[#2a2a2a] text-slate-500 text-sm font-bold rounded-lg cursor-not-allowed">Ikke tilgjengelig</button>
                </div>
              </div>
              {/* Add New */}
              <div className="border-2 border-dashed border-[#1e1e1e] rounded-xl flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1e1e1e] flex items-center justify-center text-slate-500 group-hover:border-[#ff6b00] group-hover:text-[#ff6b00] mb-3">
                  <span className="ms" style={{fontSize:'20px'}}>add</span>
                </div>
                <p className="text-slate-400 font-medium group-hover:text-slate-200">Opprett nytt søk</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
