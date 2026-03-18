'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function InnstillingerPage() {
  const [saveState, setSaveState] = useState<'idle'|'saving'|'saved'>('idle');

  const saveSettings = () => {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    }, 900);
  };

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
          <Link href="/historikk" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors">
            <span className="ms" style={{fontSize:'18px'}}>history</span>
            <span className="text-sm font-medium">Historikk</span>
          </Link>
          <div className="pt-3 mt-2 border-t border-[#1e1e1e] space-y-0.5">
            <Link href="/innstillinger" className="nav-active flex items-center gap-3 px-3 py-2.5 rounded-r-xl">
              <span className="ms ms-fill" style={{fontSize:'18px'}}>settings</span>
              <span className="text-sm font-semibold">Innstillinger</span>
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

        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-100">Kontoinnstillinger</h2>
            <p className="text-slate-400 mt-1">Administrer din personlige informasjon, varslinger og medlemskap.</p>
          </div>

          <div className="space-y-6">
            {/* Profile */}
            <section className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#1e1e1e]">
                <h3 className="text-lg font-bold">Profilinformasjon</h3>
                <p className="text-sm text-slate-400">Oppdater dine detaljer for en personlig opplevelse.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Fullt navn</label>
                    <input className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-100" type="text" defaultValue="Marius Jensen"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">E-postadresse</label>
                    <input className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-100" type="email" defaultValue="marius@flydeals.no"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Telefonnummer</label>
                    <input className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-100" type="tel" defaultValue="+47 900 00 000"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Land</label>
                    <select className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] outline-none transition-all text-slate-100">
                      <option value="NO">🇳🇴 Norge</option>
                      <option value="SE">🇸🇪 Sverige</option>
                      <option value="DK">🇩🇰 Danmark</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={saveState === 'saving'}
                    className={`font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg flex items-center gap-2 text-white ${saveState === 'saved' ? 'bg-green-600' : 'bg-[#ff6b00] hover:bg-[#ff6b00]/90 shadow-[#ff6b00]/20'} ${saveState === 'saving' ? 'opacity-80' : ''}`}
                  >
                    <span className="ms" style={{fontSize:'16px'}}>{saveState === 'saving' ? 'hourglass_empty' : saveState === 'saved' ? 'check_circle' : 'save'}</span>
                    <span>{saveState === 'saving' ? 'Lagrer...' : saveState === 'saved' ? 'Lagret!' : 'Lagre endringer'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#1e1e1e]">
                <h3 className="text-lg font-bold">Varslingsinnstillinger</h3>
                <p className="text-sm text-slate-400">Velg hvordan du vil bli varslet om nye tilbud.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium">E-postvarsler</p>
                    <p className="text-xs text-slate-400">Få ukentlige oppsummeringer av de beste flyprisene.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox"/>
                    <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium">Markedsføring</p>
                    <p className="text-xs text-slate-400">Motta informasjon om nye funksjoner og kampanjer.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox"/>
                    <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Subscription */}
            <section className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#1e1e1e] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Abonnementsstatus</h3>
                  <p className="text-sm text-slate-400">Du har aktivt FlyDeals-abonnement.</p>
                </div>
                <span className="px-3 py-1 bg-green-500/15 text-green-400 text-xs font-bold rounded-full border border-green-500/25 uppercase tracking-widest">Aktiv</span>
              </div>
              <div className="p-6">
                <div className="bg-[#0e0e0e] p-6 rounded-xl border border-[#1e1e1e] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-100">Neste fakturering</p>
                    <p className="text-2xl font-black text-[#ff6b00] tracking-tight">149 kr <span className="text-sm font-normal text-slate-500">/ måned</span></p>
                    <p className="text-xs text-slate-500">Neste fornyelse: 24. mai 2026 · Ingen binding</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">Si opp abonnement</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="border border-red-500/30 bg-red-500/5 rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-red-500">Slett konto</h3>
                  <p className="text-sm text-slate-400">Dette vil slette alle dine data permanent. Dette kan ikke angres.</p>
                </div>
                <button className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 whitespace-nowrap">
                  Slett min konto
                </button>
              </div>
            </section>
          </div>

          <footer className="mt-12 text-center text-slate-600 text-xs pb-12">
            © 2026 FlyDeals. Alle rettigheter reservert.<br/>
            <a className="hover:text-[#ff6b00] transition-colors" href="#">Vilkår og betingelser</a> •{' '}
            <a className="hover:text-[#ff6b00] transition-colors" href="#">Personvern</a>
          </footer>
        </div>
      </main>
    </div>
  );
}
