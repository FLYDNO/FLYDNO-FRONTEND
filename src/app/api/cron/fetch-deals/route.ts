import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * FlyDeals.no — Live Flight Deal Fetcher
 *
 * Strategy (verified via API testing):
 * - 886 unique Norwegian routes across 6 airports (OSL, TRF, TRD, BGO, SVG, TOS)
 * - Each airport has its own real destination list (not all 153 for every airport)
 * - 3× daily: 06:00, 12:00, 18:00 Norwegian time (05:00, 11:00, 17:00 UTC)
 * - Each run processes ALL 886 routes with a different call type:
 *   Run 1 (06:00): OW extended Apr-Sep (start_date+end_date = 183 dates per route)
 *   Run 2 (12:00): RT Apr-May (outbound=Apr, return=Apr+7 = 60 dates per route)
 *   Run 3 (18:00): RT Jul-Aug (outbound=Jul, return=Jul+7 = 62 dates per route)
 * - Total: 886 routes × 3 calls = 2,658 calls/day = ~80,000/month (under 150k limit)
 * - Coverage: April–September 2026 for both OW and RT
 * - Deal detection: price ≥35% below average across returned dates (real deals only)
 * - updated_at timestamp used for freshness (stale after 36h)
 */

// Per-airport destination lists based on Flajts sitemap (real routes only)
// OSL: 173 routes, TRF: 158 routes, BGO: ~70, TOS: 46, TRD: ~29, SVG: ~28
const ROUTES_BY_AIRPORT: Record<string, string[]> = {
  OSL: [
    'AUH','ALC','AMS','AYT','ATH','ATL','AKL','BKK','BCN','PEK','BEG','BLR','BER','BLL',
    'BHX','BOG','BOD','BOS','BNE','BRU','OTP','BUD','EZE','CAI','YYC','CUN','CPT','CLT',
    'ORD','CVG','CLE','CGN','CMB','CPH','DFW','DEL','DPS','DEN','DTW','DOH','DXB','DUB',
    'DUS','EDI','YEG','EIN','FLL','FRA','FNC','GDN','GVA','YHZ','HAN','HEL','SGN','HKG',
    'IAH','HRG','ISB','IST','JED','JNB','MCI','USM','KRK','KUL','LHE','LCA','LPA','LAS',
    'LIM','LIS','LHR','LAX','LUX','LYS','MAD','AGP','MLE','MAN','MNL','RAK','MRS','MEL',
    'MEX','MIA','MXP','MKE','MSP','YUL','BOM','MUC','NBO','NTE','MSY','JFK','NCE','MCO',
    'KIX','YOW','PMI','CDG','PER','PHL','PHX','HKT','PDX','OPO','POZ','PRG','YQB','KEF',
    'RIX','GIG','FCO','SMF','SLC','SAN','SFO','SJC','TFS','SCL','GRU','SEA','ICN','PVG',
    'SHJ','SIN','ARN','SYD','TLL','TLV','TIA','NRT','YYZ','TLS','MLA','YVR','VIE','VNO',
    'WAW','IAD','WRO','ZAG','ZRH','VCE','IBZ','PMO','NAP','BRI','CTA','TRN','GOA','BLQ',
    'LIN','MRS','NCE','TLS','BOD','LYS','NTE','MPL','BIQ','RNS','LIL','SXB','GNB','CLY',
    'AJA','CFE','PGF','PIS','TUF','BES','RNS','LRT','UIP','QBE',
  ],
  TRF: [
    'AUH','ALC','AMS','AYT','ATH','ATL','AKL','BKK','BCN','PEK','BEG','BLR','BER','BLL',
    'BHX','BOG','BOD','BOS','BNE','BRU','OTP','BUD','EZE','BUR','CAI','YYC','CUN','CPT',
    'CLT','ORD','CVG','CLE','CGN','CMB','CPH','DFW','DEL','DPS','DEN','DTW','DOH','DXB',
    'DUB','DUS','EDI','YEG','EIN','FLL','FRA','FNC','GDN','GVA','YHZ','HAN','HEL','SGN',
    'HKG','IAH','HRG','ISB','IST','JAX','JED','JNB','MCI','USM','KRK','KUL','LHE','LCA',
    'LPA','LAS','LIM','LIS','LHR','LAX','LUX','LYS','MAD','AGP','MLE','MAN','MNL','RAK',
    'MRS','MEL','MEX','MIA','MXP','MKE','MSP','YUL','BOM','MUC','NBO','NTE','MSY','JFK',
    'NCE','ORF','MCO','KIX','YOW','PMI','CDG','PER','PHL','PHX','HKT','PDX','OPO','POZ',
    'PRG','YQB','KEF','RIX','GIG','FCO','SMF','SLC','SAT','SAN','SFO','SJC','TFS','SCL',
    'GRU','SEA','ICN','PVG','SHJ','SIN','STL','ARN','SYD','TLL','TLV','TIA','NRT','YYZ',
    'TLS','TUL','MLA','YVR','VIE','VNO','WAW','IAD','WRO','ZAG','ZRH',
  ],
  BGO: [
    'AMS','ATH','AYT','BCN','BER','BLL','BRU','BUD','CPH','DXB','DUB','EDI','FRA','FNC',
    'GVA','HEL','IST','LPA','LIS','LHR','MAD','AGP','MAN','MXP','MUC','JFK','PMI','CDG',
    'PRG','FCO','TFS','ARN','TLL','TLV','NRT','YYZ','VIE','WAW','ZRH','ALC','HRG','DPS',
    'BKK','KUL','SIN','DOH','DEN','LAX','ORD','SFO','MIA','BOS','SEA','YUL','YVR','YYC',
    'KEF','RIX','OTP','BUD','SOF','SKG','HER','CFU','RHO','KGS','ZTH','PFO','LCA',
  ],
  TOS: [
    'AMS','ATH','AYT','BCN','BER','BLL','BRU','CPH','DXB','DUB','FRA','FNC','GVA','HEL',
    'IST','LPA','LIS','LHR','MAD','AGP','MAN','MXP','MUC','JFK','PMI','CDG','PRG','FCO',
    'TFS','ARN','TLL','TLV','NRT','VIE','WAW','ZRH','ALC','HRG','DPS','BKK','KUL','SIN',
    'DOH','LAX',
  ],
  TRD: [
    'AMS','ATH','AYT','BCN','BER','BLL','BRU','CPH','DXB','DUB','FRA','FNC','GVA','HEL',
    'IST','LPA','LIS','LHR','MAD','AGP','MAN','MXP','MUC','PMI','CDG','PRG','FCO','TFS',
    'ARN','TLL','TLV','VIE','WAW','ZRH','ALC','HRG','DPS','BKK',
  ],
  SVG: [
    'AMS','ATH','AYT','BCN','BER','BLL','BRU','CPH','DXB','DUB','FRA','FNC','GVA','HEL',
    'IST','LPA','LIS','LHR','MAD','AGP','MAN','MXP','MUC','PMI','CDG','PRG','FCO','TFS',
    'ARN','TLL','TLV','VIE','WAW','ZRH','ALC','HRG','DPS','BKK',
  ],
}

const AIRPORT_CITY: Record<string, string> = {
  OSL:'Oslo', TRF:'Torp', TRD:'Trondheim', BGO:'Bergen', SVG:'Stavanger', TOS:'Tromsø',
  AUH:'Abu Dhabi', ALC:'Alicante', AMS:'Amsterdam', AYT:'Antalya', ATH:'Athen',
  ATL:'Atlanta', AKL:'Auckland', BKK:'Bangkok', BCN:'Barcelona', PEK:'Beijing',
  BEG:'Beograd', BLR:'Bangalore', BER:'Berlin', BLL:'Billund', BHX:'Birmingham',
  BOG:'Bogotá', BOD:'Bordeaux', BOS:'Boston', BNE:'Brisbane', BRU:'Brussel',
  OTP:'Bucuresti', BUD:'Budapest', EZE:'Buenos Aires', BUR:'Burbank', CAI:'Kairo',
  YYC:'Calgary', CUN:'Cancún', CPT:'Cape Town', CLT:'Charlotte', ORD:'Chicago',
  CVG:'Cincinnati', CLE:'Cleveland', CGN:'Köln', CMB:'Colombo', CPH:'København',
  DFW:'Dallas', DEL:'New Delhi', DPS:'Bali', DEN:'Denver', DTW:'Detroit', DOH:'Doha',
  DXB:'Dubai', DUB:'Dublin', DUS:'Düsseldorf', EDI:'Edinburgh', YEG:'Edmonton',
  EIN:'Eindhoven', FLL:'Fort Lauderdale', FRA:'Frankfurt', FNC:'Funchal', GDN:'Gdansk',
  GVA:'Genève', YHZ:'Halifax', HAN:'Hanoi', HEL:'Helsinki', SGN:'Ho Chi Minh',
  HKG:'Hong Kong', IAH:'Houston', HRG:'Hurghada', IND:'Indianapolis', ISB:'Islamabad',
  IST:'Istanbul', JAX:'Jacksonville', JED:'Jeddah', JNB:'Johannesburg', MCI:'Kansas City',
  USM:'Koh Samui', KRK:'Kraków', KUL:'Kuala Lumpur', LHE:'Lahore', LCA:'Larnaka',
  LPA:'Las Palmas', LAS:'Las Vegas', LIM:'Lima', LIS:'Lisboa', LHR:'London',
  LAX:'Los Angeles', LUX:'Luxembourg', LYS:'Lyon', MAD:'Madrid', AGP:'Málaga',
  MLE:'Malé', MAN:'Manchester', MNL:'Manila', RAK:'Marrakech', MRS:'Marseille',
  MEL:'Melbourne', MEX:'Mexico City', MIA:'Miami', MXP:'Milano', MKE:'Milwaukee',
  MSP:'Minneapolis', YUL:'Montreal', BOM:'Mumbai', MUC:'München', NBO:'Nairobi',
  NTE:'Nantes', MSY:'New Orleans', JFK:'New York', NCE:'Nice', ORF:'Norfolk',
  MCO:'Orlando', KIX:'Osaka', YOW:'Ottawa', PMI:'Palma', CDG:'Paris', PER:'Perth',
  PHL:'Philadelphia', PHX:'Phoenix', HKT:'Phuket', PDX:'Portland', OPO:'Porto',
  POZ:'Poznań', PRG:'Praha', YQB:'Québec', KEF:'Reykjavik', RIX:'Riga',
  GIG:'Rio de Janeiro', FCO:'Roma', SMF:'Sacramento', SLC:'Salt Lake City',
  SAT:'San Antonio', SAN:'San Diego', SFO:'San Francisco', SJC:'San José',
  TFS:'Tenerife', SCL:'Santiago', GRU:'São Paulo', SEA:'Seattle', ICN:'Seoul',
  PVG:'Shanghai', SHJ:'Sharjah', SIN:'Singapore', STL:'St. Louis', ARN:'Stockholm',
  SYD:'Sydney', TLL:'Tallinn', TLV:'Tel Aviv', TIA:'Tirana', NRT:'Tokyo',
  YYZ:'Toronto', TLS:'Toulouse', TUL:'Tulsa', MLA:'Valletta', YVR:'Vancouver',
  VIE:'Wien', VNO:'Vilnius', WAW:'Warszawa', IAD:'Washington D.C.', WRO:'Wrocław',
  ZAG:'Zagreb', ZRH:'Zürich', VCE:'Venezia', IBZ:'Ibiza', PMO:'Palermo',
  NAP:'Napoli', BRI:'Bari', CTA:'Catania', TRN:'Torino', GOA:'Genova', BLQ:'Bologna',
  LIN:'Milano Linate', SOF:'Sofia', SKG:'Thessaloniki', HER:'Heraklion',
  CFU:'Korfu', RHO:'Rhodos', KGS:'Kos', ZTH:'Zakynthos', PFO:'Paphos',
}

const AIRPORT_COUNTRY: Record<string, string> = {
  AUH:'ae', ALC:'es', AMS:'nl', AYT:'tr', ATH:'gr', ATL:'us', AKL:'nz', BKK:'th',
  BCN:'es', PEK:'cn', BEG:'rs', BLR:'in', BER:'de', BLL:'dk', BHX:'gb', BOG:'co',
  BOD:'fr', BOS:'us', BNE:'au', BRU:'be', OTP:'ro', BUD:'hu', EZE:'ar', BUR:'us',
  CAI:'eg', YYC:'ca', CUN:'mx', CPT:'za', CLT:'us', ORD:'us', CVG:'us', CLE:'us',
  CGN:'de', CMB:'lk', CPH:'dk', DFW:'us', DEL:'in', DPS:'id', DEN:'us', DTW:'us',
  DOH:'qa', DXB:'ae', DUB:'ie', DUS:'de', EDI:'gb', YEG:'ca', EIN:'nl', FLL:'us',
  FRA:'de', FNC:'pt', GDN:'pl', GVA:'ch', YHZ:'ca', HAN:'vn', HEL:'fi', SGN:'vn',
  HKG:'hk', IAH:'us', HRG:'eg', IND:'us', ISB:'pk', IST:'tr', JAX:'us', JED:'sa',
  JNB:'za', MCI:'us', USM:'th', KRK:'pl', KUL:'my', LHE:'pk', LCA:'cy', LPA:'es',
  LAS:'us', LIM:'pe', LIS:'pt', LHR:'gb', LAX:'us', LUX:'lu', LYS:'fr', MAD:'es',
  AGP:'es', MLE:'mv', MAN:'gb', MNL:'ph', RAK:'ma', MRS:'fr', MEL:'au', MEX:'mx',
  MIA:'us', MXP:'it', MKE:'us', MSP:'us', YUL:'ca', BOM:'in', MUC:'de', NBO:'ke',
  NTE:'fr', MSY:'us', JFK:'us', NCE:'fr', ORF:'us', MCO:'us', KIX:'jp', YOW:'ca',
  PMI:'es', CDG:'fr', PER:'au', PHL:'us', PHX:'us', HKT:'th', PDX:'us', OPO:'pt',
  POZ:'pl', PRG:'cz', YQB:'ca', KEF:'is', RIX:'lv', GIG:'br', FCO:'it', SMF:'us',
  SLC:'us', SAT:'us', SAN:'us', SFO:'us', SJC:'us', TFS:'es', SCL:'cl', GRU:'br',
  SEA:'us', ICN:'kr', PVG:'cn', SHJ:'ae', SIN:'sg', STL:'us', ARN:'se', SYD:'au',
  TLL:'ee', TLV:'il', TIA:'al', NRT:'jp', YYZ:'ca', TLS:'fr', TUL:'us', MLA:'mt',
  YVR:'ca', VIE:'at', VNO:'lt', WAW:'pl', IAD:'us', WRO:'pl', ZAG:'hr', ZRH:'ch',
  VCE:'it', IBZ:'es', PMO:'it', NAP:'it', BRI:'it', CTA:'it', TRN:'it', GOA:'it',
  BLQ:'it', LIN:'it', SOF:'bg', SKG:'gr', HER:'gr', CFU:'gr', RHO:'gr', KGS:'gr',
  ZTH:'gr', PFO:'cy',
}

// Build flat list of all routes: [{origin, dest}, ...]
function buildAllRoutes(): Array<{ origin: string; dest: string }> {
  const routes: Array<{ origin: string; dest: string }> = []
  for (const [origin, dests] of Object.entries(ROUTES_BY_AIRPORT)) {
    for (const dest of dests) {
      if (dest !== origin) routes.push({ origin, dest })
    }
  }
  return routes
}

const ALL_ROUTES = buildAllRoutes()

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '94d8ca287cmsh020d29e3ffb7fd3p16cb7bjsn64a15b813501'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://erhlxomyatirrqhaxroh.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Determine which run type based on UTC hour:
// Run 0 (05:00 UTC = 06:00 NO): OW extended Apr-Sep (start_date + end_date)
// Run 1 (11:00 UTC = 12:00 NO): RT Apr-May (outbound=Apr, return=Apr+7)
// Run 2 (17:00 UTC = 18:00 NO): RT Jul-Aug (outbound=Jul, return=Jul+7)
function getRunConfig(): { type: 'ow_extended' | 'rt_spring' | 'rt_summer'; runIndex: number } {
  const utcHour = new Date().getUTCHours()
  if (utcHour >= 14) return { type: 'rt_summer', runIndex: 2 }   // 17:00+ UTC
  if (utcHour >= 8)  return { type: 'rt_spring', runIndex: 1 }   // 11:00+ UTC
  return { type: 'ow_extended', runIndex: 0 }                    // 05:00+ UTC
}

// Get the current year's April 1 (or next year if we're past September)
function getSeasonStart(): string {
  const now = new Date()
  const year = now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
  return `${year}-04-01`
}

function getSeasonEnd(): string {
  const now = new Date()
  const year = now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
  return `${year}-09-30`
}

function getSummerStart(): string {
  const now = new Date()
  const year = now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
  return `${year}-07-01`
}

interface PriceEntry {
  departure: string
  return?: string | null
  price: number | null
}

async function fetchPriceGraph(
  origin: string, destination: string, outboundDate: string, returnDate?: string, endDate?: string
): Promise<PriceEntry[]> {
  try {
    let url = `https://google-flights2.p.rapidapi.com/api/v1/getPriceGraph?departure_id=${origin}&arrival_id=${destination}&outbound_date=${outboundDate}&start_date=${outboundDate}&travel_class=ECONOMY&currency=NOK`
    if (returnDate) url += `&return_date=${returnDate}`
    if (endDate) url += `&end_date=${endDate}`
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'google-flights2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.status || !Array.isArray(data.data)) return []
    return data.data as PriceEntry[]
  } catch {
    return []
  }
}

function analyzeEntries(entries: PriceEntry[]): {
  price: number; avg: number; discount: number; date: string; returnDate?: string
} | null {
  const valid = entries.filter(e => e.price !== null && e.price !== undefined && Number(e.price) > 0)
  if (!valid.length) return null
  const prices = valid.map(e => Number(e.price))
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  const best = valid.reduce((a, b) => Number(a.price) < Number(b.price) ? a : b)
  const discount = avg > 0 ? Math.round(((avg - Number(best.price)) / avg) * 100) : 0
  return {
    price: Number(best.price),
    avg,
    discount,
    date: best.departure,
    returnDate: best.return ?? undefined,
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Determine run type based on UTC hour
  const { type: runType, runIndex } = getRunConfig()
  const seasonStart = getSeasonStart()   // Apr 1
  const seasonEnd = getSeasonEnd()       // Sep 30
  const summerStart = getSummerStart()   // Jul 1

  // Return date = 7 days after outbound for RT calls
  const springReturnDate = (() => {
    const d = new Date(seasonStart); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]
  })()
  const summerReturnDate = (() => {
    const d = new Date(summerStart); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]
  })()

  const results = { processed: 0, deals: 0, errors: 0, skipped: 0 }
  const dealsToUpsert: Record<string, unknown>[] = []

  // All 886 routes processed in every run — each run does a different call type
  const routeBatch = ALL_ROUTES

  for (const { origin, dest } of routeBatch) {
    try {
      let owEntries: PriceEntry[] = []
      let rtEntries: PriceEntry[] = []

      if (runType === 'ow_extended') {
        // Run 1 (06:00 NO): OW with extended date range Apr-Sep (183 dates)
        owEntries = await fetchPriceGraph(origin, dest, seasonStart, undefined, seasonEnd)
        results.processed++
        await sleep(200)
      } else if (runType === 'rt_spring') {
        // Run 2 (12:00 NO): RT Apr-May window (60 dates)
        rtEntries = await fetchPriceGraph(origin, dest, seasonStart, springReturnDate)
        results.processed++
        await sleep(200)
      } else {
        // Run 3 (18:00 NO): RT Jul-Aug window (62 dates)
        rtEntries = await fetchPriceGraph(origin, dest, summerStart, summerReturnDate)
        results.processed++
        await sleep(200)
      }

      const ow = analyzeEntries(owEntries)
      const rt = analyzeEntries(rtEntries)

      // Deal threshold: ≥35% below average = real deal worth showing
      const owDisc = ow && ow.discount >= 35 ? ow.discount : 0
      const rtDisc = rt && rt.discount >= 35 ? rt.discount : 0

      if (owDisc === 0 && rtDisc === 0) {
        results.skipped++
        continue
      }

      const bestType = owDisc >= rtDisc ? 'oneway' : 'roundtrip'
      const best = bestType === 'oneway' ? ow! : rt!

      dealsToUpsert.push({
        departure_airport: origin,
        arrival_airport: dest,
        price_nok: best.price,
        travel_date: best.date,
        return_date: bestType === 'roundtrip' ? (best.returnDate ?? null) : null,
        normal_price: best.avg,
        avg_price: best.avg,
        discount_pct: best.discount,
        airline: 'Diverse',
        direct: false,
        country: bestType,
        departure_city: AIRPORT_CITY[origin] || origin,
        arrival_city: AIRPORT_CITY[dest] || dest,
        country_code: AIRPORT_COUNTRY[dest] || 'un',
        typical_price_low: ow?.price ?? null,
        typical_price_high: rt?.price ?? null,
        dates_text: `OW:${ow?.price ?? 'N/A'} RT:${rt?.price ?? 'N/A'}`,
        found_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      results.deals++
    } catch {
      results.errors++
    }
  }

  let upsertError = null
  if (dealsToUpsert.length > 0) {
    const { error } = await supabase
      .from('flights')
      .upsert(dealsToUpsert, {
        onConflict: 'departure_airport,arrival_airport',
        ignoreDuplicates: false,
      })
    if (error) upsertError = error.message

    // Store price history
    const historyRows = dealsToUpsert.map(d => ({
      departure_airport: d.departure_airport,
      arrival_airport: d.arrival_airport,
      travel_date: d.travel_date,
      price_nok: d.price_nok,
      fetched_at: new Date().toISOString(),
      fetched_date: new Date().toISOString().split('T')[0],
      source: 'rapidapi_pricegraph',
    }))
    await supabase.from('price_history').upsert(historyRows, {
      onConflict: 'departure_airport,arrival_airport,travel_date',
      ignoreDuplicates: true,
    })
  }

  // Delete stale deals: routes not updated in 36 hours
  const staleThreshold = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  await supabase
    .from('flights')
    .delete()
    .lt('updated_at', staleThreshold)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    runType,
    runIndex: runIndex + 1,
    seasonStart,
    seasonEnd,
    summerStart,
    totalRoutes: ALL_ROUTES.length,
    apiCallsThisRun: results.processed,
    ...results,
    dealsUpserted: dealsToUpsert.length,
    upsertError,
    note: '3x daily: 05:00 UTC=OW Apr-Sep | 11:00 UTC=RT Apr-May | 17:00 UTC=RT Jul-Aug',
  })
}
