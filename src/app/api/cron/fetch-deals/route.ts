import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * FlyDeals.no — Live Flight Deal Fetcher
 * 
 * Uses the EXACT 153 destinations from Flajts sitemap.xml (flajts.se)
 * 6 Norwegian airports × 153 destinations = 918 routes
 * 2 API calls per route (one-way + round-trip) = 1,836 calls per full run
 * Runs 2× daily via Vercel cron = 3,672 calls/day = ~110,160 calls/month
 * (within 150,000 RapidAPI DataCrawler quota)
 * 
 * Deal detection: price ≥25% below average = deal
 * Stores best deal per route (one-way or round-trip, whichever is better)
 */

// EXACT 153 destinations from Flajts sitemap.xml (flajts.se/from/norway/oslo/to/...)
const DESTINATIONS = [
  'AUH','ALC','AMS','AYT','ATH','ATL','AKL','BKK','BCN','PEK','BEG','BLR','BER','BLL',
  'BHX','BOG','BOI','BOD','BOS','BNE','BRU','OTP','BUD','EZE','BUR','CAI','YYC','CUN',
  'CPT','CLT','ORD','CVG','CLE','CGN','CMB','CPH','DFW','DEL','DPS','DEN','DTW','DOH',
  'DXB','DUB','DUS','EDI','YEG','EIN','FLL','FRA','FNC','GDN','GVA','YHZ','HAN','HEL',
  'SGN','HKG','IAH','HRG','IND','ISB','IST','JAX','JED','JNB','MCI','USM','KRK','KUL',
  'LHE','LCA','LPA','LAS','LIM','LIS','LHR','LAX','LUX','LYS','MAD','AGP','MLE','MAN',
  'MNL','RAK','MRS','MEL','MEX','MIA','MXP','MKE','MSP','YUL','BOM','MUC','NBO','NTE',
  'MSY','JFK','NCE','ORF','MCO','KIX','YOW','PMI','CDG','PER','PHL','PHX','HKT','PDX',
  'OPO','POZ','PRG','YQB','KEF','RIX','GIG','FCO','SMF','SLC','SAT','SAN','SFO','SJC',
  'TFS','SCL','GRU','SEA','ICN','PVG','SHJ','SIN','STL','ARN','SYD','TLL','TLV','TIA',
  'NRT','YYZ','TLS','TUL','MLA','YVR','VIE','VNO','WAW','IAD','WRO','ZAG','ZRH',
]

// 6 Norwegian departure airports
const ORIGINS = ['OSL', 'TRF', 'TRD', 'BGO', 'SVG', 'TOS']

const AIRPORT_CITY: Record<string, string> = {
  OSL:'Oslo', TRF:'Torp', TRD:'Trondheim', BGO:'Bergen', SVG:'Stavanger', TOS:'Tromsø',
  AUH:'Abu Dhabi', ALC:'Alicante', AMS:'Amsterdam', AYT:'Antalya', ATH:'Athen',
  ATL:'Atlanta', AKL:'Auckland', BKK:'Bangkok', BCN:'Barcelona', PEK:'Beijing',
  BEG:'Beograd', BLR:'Bangalore', BER:'Berlin', BLL:'Billund', BHX:'Birmingham',
  BOG:'Bogotá', BOI:'Boise', BOD:'Bordeaux', BOS:'Boston', BNE:'Brisbane',
  BRU:'Brussel', OTP:'Bucuresti', BUD:'Budapest', EZE:'Buenos Aires', BUR:'Burbank',
  CAI:'Kairo', YYC:'Calgary', CUN:'Cancún', CPT:'Cape Town', CLT:'Charlotte',
  ORD:'Chicago', CVG:'Cincinnati', CLE:'Cleveland', CGN:'Köln', CMB:'Colombo',
  CPH:'København', DFW:'Dallas', DEL:'New Delhi', DPS:'Bali', DEN:'Denver',
  DTW:'Detroit', DOH:'Doha', DXB:'Dubai', DUB:'Dublin', DUS:'Düsseldorf',
  EDI:'Edinburgh', YEG:'Edmonton', EIN:'Eindhoven', FLL:'Fort Lauderdale',
  FRA:'Frankfurt', FNC:'Funchal', GDN:'Gdansk', GVA:'Genève', YHZ:'Halifax',
  HAN:'Hanoi', HEL:'Helsinki', SGN:'Ho Chi Minh', HKG:'Hong Kong', IAH:'Houston',
  HRG:'Hurghada', IND:'Indianapolis', ISB:'Islamabad', IST:'Istanbul',
  JAX:'Jacksonville', JED:'Jeddah', JNB:'Johannesburg', MCI:'Kansas City',
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
  ZAG:'Zagreb', ZRH:'Zürich',
}

const AIRPORT_COUNTRY: Record<string, string> = {
  AUH:'ae', ALC:'es', AMS:'nl', AYT:'tr', ATH:'gr', ATL:'us', AKL:'nz', BKK:'th',
  BCN:'es', PEK:'cn', BEG:'rs', BLR:'in', BER:'de', BLL:'dk', BHX:'gb', BOG:'co',
  BOI:'us', BOD:'fr', BOS:'us', BNE:'au', BRU:'be', OTP:'ro', BUD:'hu', EZE:'ar',
  BUR:'us', CAI:'eg', YYC:'ca', CUN:'mx', CPT:'za', CLT:'us', ORD:'us', CVG:'us',
  CLE:'us', CGN:'de', CMB:'lk', CPH:'dk', DFW:'us', DEL:'in', DPS:'id', DEN:'us',
  DTW:'us', DOH:'qa', DXB:'ae', DUB:'ie', DUS:'de', EDI:'gb', YEG:'ca', EIN:'nl',
  FLL:'us', FRA:'de', FNC:'pt', GDN:'pl', GVA:'ch', YHZ:'ca', HAN:'vn', HEL:'fi',
  SGN:'vn', HKG:'hk', IAH:'us', HRG:'eg', IND:'us', ISB:'pk', IST:'tr', JAX:'us',
  JED:'sa', JNB:'za', MCI:'us', USM:'th', KRK:'pl', KUL:'my', LHE:'pk', LCA:'cy',
  LPA:'es', LAS:'us', LIM:'pe', LIS:'pt', LHR:'gb', LAX:'us', LUX:'lu', LYS:'fr',
  MAD:'es', AGP:'es', MLE:'mv', MAN:'gb', MNL:'ph', RAK:'ma', MRS:'fr', MEL:'au',
  MEX:'mx', MIA:'us', MXP:'it', MKE:'us', MSP:'us', YUL:'ca', BOM:'in', MUC:'de',
  NBO:'ke', NTE:'fr', MSY:'us', JFK:'us', NCE:'fr', ORF:'us', MCO:'us', KIX:'jp',
  YOW:'ca', PMI:'es', CDG:'fr', PER:'au', PHL:'us', PHX:'us', HKT:'th', PDX:'us',
  OPO:'pt', POZ:'pl', PRG:'cz', YQB:'ca', KEF:'is', RIX:'lv', GIG:'br', FCO:'it',
  SMF:'us', SLC:'us', SAT:'us', SAN:'us', SFO:'us', SJC:'us', TFS:'es', SCL:'cl',
  GRU:'br', SEA:'us', ICN:'kr', PVG:'cn', SHJ:'ae', SIN:'sg', STL:'us', ARN:'se',
  SYD:'au', TLL:'ee', TLV:'il', TIA:'al', NRT:'jp', YYZ:'ca', TLS:'fr', TUL:'us',
  MLA:'mt', YVR:'ca', VIE:'at', VNO:'lt', WAW:'pl', IAD:'us', WRO:'pl', ZAG:'hr',
  ZRH:'ch',
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '94d8ca287cmsh020d29e3ffb7fd3p16cb7bjsn64a15b813501'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://erhlxomyatirrqhaxroh.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getStartDate(): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

interface PriceEntry {
  departure: string
  return?: string | null
  price: number
}

async function fetchPriceGraph(
  origin: string,
  destination: string,
  startDate: string,
  returnDate?: string
): Promise<PriceEntry[]> {
  try {
    let url = `https://google-flights2.p.rapidapi.com/api/v1/getPriceGraph?departure_id=${origin}&arrival_id=${destination}&outbound_date=${startDate}&travel_class=ECONOMY&currency=NOK`
    if (returnDate) url += `&return_date=${returnDate}`
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

function analyzeEntries(entries: PriceEntry[]): { price: number; avg: number; discount: number; date: string; returnDate?: string } | null {
  const valid = entries.filter(e => e.price > 0)
  if (!valid.length) return null
  const prices = valid.map(e => e.price)
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  const best = valid.reduce((a, b) => a.price < b.price ? a : b)
  const discount = Math.round(((avg - best.price) / avg) * 100)
  return { price: best.price, avg, discount, date: best.departure, returnDate: best.return ?? undefined }
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

  const startDate = getStartDate()
  const returnBase = new Date(startDate)
  returnBase.setDate(returnBase.getDate() + 7)
  const returnDate = returnBase.toISOString().split('T')[0]

  const results = { processed: 0, deals: 0, errors: 0, skipped: 0 }
  const dealsToUpsert: Record<string, unknown>[] = []

  // Split 153 destinations into 2 batches (one per daily run)
  // Run index rotates based on time: 0 = morning, 1 = evening
  const BATCH_SIZE = Math.ceil(DESTINATIONS.length / 2)
  const runIndex = Math.floor(Date.now() / (12 * 3600 * 1000)) % 2
  const destBatch = DESTINATIONS.slice(runIndex * BATCH_SIZE, (runIndex + 1) * BATCH_SIZE)

  for (const origin of ORIGINS) {
    for (const dest of destBatch) {
      if (origin === dest) { results.skipped++; continue }

      // Fetch one-way prices
      const owEntries = await fetchPriceGraph(origin, dest, startDate)
      results.processed++
      await sleep(300)

      // Fetch round-trip prices
      const rtEntries = await fetchPriceGraph(origin, dest, startDate, returnDate)
      results.processed++
      await sleep(300)

      const ow = analyzeEntries(owEntries)
      const rt = analyzeEntries(rtEntries)

      const owDisc = ow && ow.discount >= 25 ? ow.discount : 0
      const rtDisc = rt && rt.discount >= 25 ? rt.discount : 0

      if (owDisc === 0 && rtDisc === 0) {
        results.skipped++
        continue
      }

      // Pick best deal type
      const bestType = owDisc >= rtDisc ? 'oneway' : 'roundtrip'
      const best = bestType === 'oneway' ? ow! : rt!

      dealsToUpsert.push({
        departure_airport: origin,
        arrival_airport: dest,
        price_nok: best.price,
        travel_date: best.date,
        return_date: bestType === 'roundtrip' ? best.returnDate ?? returnDate : null,
        normal_price: best.avg,
        avg_price: best.avg,
        discount_pct: best.discount,
        airline: 'Diverse',
        direct: false,
        country: bestType, // 'oneway' or 'roundtrip'
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
    }
  }

  // Upsert to Supabase
  let upsertError = null
  if (dealsToUpsert.length > 0) {
    const { error } = await supabase
      .from('flights')
      .upsert(dealsToUpsert, {
        onConflict: 'departure_airport,arrival_airport',
        ignoreDuplicates: false,
      })
    if (error) {
      upsertError = error.message
    }

    // Store raw price history
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

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    startDate,
    batch: `${runIndex + 1}/2 (dests ${runIndex * BATCH_SIZE + 1}–${Math.min((runIndex + 1) * BATCH_SIZE, DESTINATIONS.length)} of ${DESTINATIONS.length})`,
    origins: ORIGINS.length,
    ...results,
    dealsUpserted: dealsToUpsert.length,
    upsertError,
  })
}
