import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Full 237 destination list from FLYDNO report (Flajts sitemap analysis)
const DESTINATIONS = [
  // Sør-Europa (40)
  'BCN','MAD','PMI','AGP','ALC','IBZ','SVQ','VLC','FAO','LIS','OPO','FCO','MXP','NAP','VCE',
  'BLQ','PSA','CTA','PMO','CAG','ATH','HER','SKG','CHQ','RHO','KOS','ACE','AGA','AYT','BGY',
  'CFU','DBV','FLR','FUE','KGS','LCA','LPA','PFO','SPU','TFS',
  // Vest-Europa (36)
  'LHR','LGW','STN','MAN','BHX','EDI','GLA','BRS','NCL','DUB','CDG','ORY','NCE','LYS','MRS',
  'BOD','NTE','TLS','BRU','AMS','EIN','RTM','FRA','MUC','BER','HAM','CGN','DUS','STR','NUE',
  'GVA','ZRH','BSL','ABZ','BIO','MPL',
  // Nord-Europa (18)
  'CPH','ARN','GOT','MMX','LLA','UME','HEL','TLL','RIX','VNO','WAW','KRK','GDN','WRO','PRG',
  'BUD','VIE','BLL',
  // Øst-Europa (13)
  'SOF','OTP','BBU','SKP','BEG','TIA','LJU','ZAG','SJJ','POZ','KTW','WMI','TBS',
  // Midtøsten (14)
  'DXB','AUH','DOH','AMM','BEY','TLV','IST','SAW','ESB','ADB','RUH','JED','SHJ','MED',
  // Afrika (18)
  'CMN','RAK','TUN','CAI','HRG','SSH','NBO','CPT','ADD','WDH','LOS','ACC','DAR','JNB','JRO',
  'MBA','MRU','ZNZ',
  // Asia (35)
  'BKK','HKT','USM','KBV','SIN','KUL','HKG','ICN','NRT','HND','BOM','DEL','MAA','BLR','COK',
  'CMB','DAC','KTM','DPS','CEB','MNL','ADL','CAN','CCU','CHC','DAD','KIX','PEK','PER','PNH',
  'POM','PVG','REP','SGN','TPE',
  // Karibia/Mellom-Amerika (13)
  'CUN','PUJ','HAV','AUA','CUR','GUA','JMK','MBJ','MLE','PTY','SJO','SJU','SXM',
  // Nord-Amerika (32)
  'JFK','EWR','BOS','MIA','ORD','LAX','SFO','SEA','YYZ','YUL','YVR','ATL','BNA','BWI','CLT',
  'DEN','DTW','FLL','HNL','IAD','IAH','LAS','MCO','MSP','MSY','OAK','PHL','PHX','RDU','SAN',
  'SLC','TPA',
  // Sør-Amerika (14)
  'GRU','EZE','BOG','LIM','GIG','HUX','LPB','MEX','PVR','QRO','SCL','SJD','SMR','UIO',
  // Langdistanse (4)
  'KEF','AKL','SYD','MEL',
]

// 6 Norwegian departure airports
const ORIGINS = ['OSL', 'TRF', 'TRD', 'BGO', 'SVG', 'TOS']

// Airport to city name
const AIRPORT_CITY: Record<string, string> = {
  OSL:'Oslo', TRF:'Torp', TRD:'Trondheim', BGO:'Bergen', SVG:'Stavanger', TOS:'Tromsø',
  BCN:'Barcelona', MAD:'Madrid', PMI:'Palma', AGP:'Málaga', ALC:'Alicante', IBZ:'Ibiza',
  SVQ:'Sevilla', VLC:'Valencia', FAO:'Faro', LIS:'Lisboa', OPO:'Porto', FCO:'Roma',
  MXP:'Milano', NAP:'Napoli', VCE:'Venezia', BLQ:'Bologna', PSA:'Pisa', CTA:'Catania',
  PMO:'Palermo', CAG:'Cagliari', ATH:'Athen', HER:'Heraklion', SKG:'Thessaloniki',
  CHQ:'Chania', RHO:'Rhodos', KOS:'Kos', ACE:'Lanzarote', AGA:'Agadir', AYT:'Antalya',
  BGY:'Bergamo', CFU:'Korfu', DBV:'Dubrovnik', FLR:'Firenze', FUE:'Fuerteventura',
  KGS:'Kos', LCA:'Larnaca', LPA:'Las Palmas', PFO:'Paphos', SPU:'Split', TFS:'Tenerife',
  LHR:'London', LGW:'London Gatwick', STN:'London Stansted', MAN:'Manchester',
  BHX:'Birmingham', EDI:'Edinburgh', GLA:'Glasgow', BRS:'Bristol', NCL:'Newcastle',
  DUB:'Dublin', CDG:'Paris', ORY:'Paris Orly', NCE:'Nice', LYS:'Lyon', MRS:'Marseille',
  BOD:'Bordeaux', NTE:'Nantes', TLS:'Toulouse', BRU:'Brussel', AMS:'Amsterdam',
  EIN:'Eindhoven', RTM:'Rotterdam', FRA:'Frankfurt', MUC:'München', BER:'Berlin',
  HAM:'Hamburg', CGN:'Köln', DUS:'Düsseldorf', STR:'Stuttgart', NUE:'Nürnberg',
  GVA:'Genève', ZRH:'Zürich', BSL:'Basel', ABZ:'Aberdeen', BIO:'Bilbao', MPL:'Montpellier',
  CPH:'København', ARN:'Stockholm', GOT:'Göteborg', MMX:'Malmö', LLA:'Luleå', UME:'Umeå',
  HEL:'Helsinki', TLL:'Tallinn', RIX:'Riga', VNO:'Vilnius', WAW:'Warszawa', KRK:'Kraków',
  GDN:'Gdańsk', WRO:'Wrocław', PRG:'Praha', BUD:'Budapest', VIE:'Wien', BLL:'Billund',
  SOF:'Sofia', OTP:'Bucuresti', BBU:'Bucuresti', SKP:'Skopje', BEG:'Beograd', TIA:'Tirana',
  LJU:'Ljubljana', ZAG:'Zagreb', SJJ:'Sarajevo', POZ:'Poznan', KTW:'Katowice', WMI:'Warszawa',
  TBS:'Tbilisi', DXB:'Dubai', AUH:'Abu Dhabi', DOH:'Doha', AMM:'Amman', BEY:'Beirut',
  TLV:'Tel Aviv', IST:'Istanbul', SAW:'Istanbul Sabiha', ESB:'Ankara', ADB:'Izmir',
  RUH:'Riyadh', JED:'Jeddah', SHJ:'Sharjah', MED:'Medina', CMN:'Casablanca', RAK:'Marrakech',
  TUN:'Tunis', CAI:'Kairo', HRG:'Hurghada', SSH:'Sharm el-Sheikh', NBO:'Nairobi',
  CPT:'Cape Town', ADD:'Addis Abeba', WDH:'Windhoek', LOS:'Lagos', ACC:'Accra',
  DAR:'Dar es Salaam', JNB:'Johannesburg', JRO:'Kilimanjaro', MBA:'Mombasa',
  MRU:'Mauritius', ZNZ:'Zanzibar', BKK:'Bangkok', HKT:'Phuket', USM:'Koh Samui',
  KBV:'Krabi', SIN:'Singapore', KUL:'Kuala Lumpur', HKG:'Hong Kong', ICN:'Seoul',
  NRT:'Tokyo', HND:'Tokyo Haneda', BOM:'Mumbai', DEL:'New Delhi', MAA:'Chennai',
  BLR:'Bangalore', COK:'Kochi', CMB:'Colombo', DAC:'Dhaka', KTM:'Kathmandu',
  DPS:'Bali', CEB:'Cebu', MNL:'Manila', ADL:'Adelaide', CAN:'Guangzhou', CCU:'Kolkata',
  CHC:'Christchurch', DAD:'Da Nang', KIX:'Osaka', PEK:'Beijing', PER:'Perth',
  PNH:'Phnom Penh', POM:'Port Moresby', PVG:'Shanghai', REP:'Siem Reap',
  SGN:'Ho Chi Minh', TPE:'Taipei', CUN:'Cancún', PUJ:'Punta Cana', HAV:'Havana',
  AUA:'Aruba', CUR:'Curaçao', GUA:'Guatemala City', JMK:'Mykonos', MBJ:'Montego Bay',
  MLE:'Malé', PTY:'Panama City', SJO:'San José', SJU:'San Juan', SXM:'Sint Maarten',
  JFK:'New York', EWR:'New York Newark', BOS:'Boston', MIA:'Miami', ORD:'Chicago',
  LAX:'Los Angeles', SFO:'San Francisco', SEA:'Seattle', YYZ:'Toronto', YUL:'Montreal',
  YVR:'Vancouver', ATL:'Atlanta', BNA:'Nashville', BWI:'Baltimore', CLT:'Charlotte',
  DEN:'Denver', DTW:'Detroit', FLL:'Fort Lauderdale', HNL:'Honolulu', IAD:'Washington',
  IAH:'Houston', LAS:'Las Vegas', MCO:'Orlando', MSP:'Minneapolis', MSY:'New Orleans',
  OAK:'Oakland', PHL:'Philadelphia', PHX:'Phoenix', RDU:'Raleigh', SAN:'San Diego',
  SLC:'Salt Lake City', TPA:'Tampa', GRU:'São Paulo', EZE:'Buenos Aires', BOG:'Bogotá',
  LIM:'Lima', GIG:'Rio de Janeiro', HUX:'Huatulco', LPB:'La Paz', MEX:'Mexico City',
  PVR:'Puerto Vallarta', QRO:'Querétaro', SCL:'Santiago', SJD:'Los Cabos',
  SMR:'Santa Marta', UIO:'Quito', KEF:'Reykjavik', AKL:'Auckland', SYD:'Sydney', MEL:'Melbourne',
}

// Country code for flag display
const AIRPORT_COUNTRY: Record<string, string> = {
  BCN:'es',MAD:'es',PMI:'es',AGP:'es',ALC:'es',IBZ:'es',SVQ:'es',VLC:'es',FAO:'pt',
  LIS:'pt',OPO:'pt',FCO:'it',MXP:'it',NAP:'it',VCE:'it',BLQ:'it',PSA:'it',CTA:'it',
  PMO:'it',CAG:'it',ATH:'gr',HER:'gr',SKG:'gr',CHQ:'gr',RHO:'gr',KOS:'gr',ACE:'es',
  AGA:'ma',AYT:'tr',BGY:'it',CFU:'gr',DBV:'hr',FLR:'it',FUE:'es',KGS:'gr',LCA:'cy',
  LPA:'es',PFO:'cy',SPU:'hr',TFS:'es',LHR:'gb',LGW:'gb',STN:'gb',MAN:'gb',BHX:'gb',
  EDI:'gb',GLA:'gb',BRS:'gb',NCL:'gb',DUB:'ie',CDG:'fr',ORY:'fr',NCE:'fr',LYS:'fr',
  MRS:'fr',BOD:'fr',NTE:'fr',TLS:'fr',BRU:'be',AMS:'nl',EIN:'nl',RTM:'nl',FRA:'de',
  MUC:'de',BER:'de',HAM:'de',CGN:'de',DUS:'de',STR:'de',NUE:'de',GVA:'ch',ZRH:'ch',
  BSL:'ch',ABZ:'gb',BIO:'es',MPL:'fr',CPH:'dk',ARN:'se',GOT:'se',MMX:'se',LLA:'se',
  UME:'se',HEL:'fi',TLL:'ee',RIX:'lv',VNO:'lt',WAW:'pl',KRK:'pl',GDN:'pl',WRO:'pl',
  PRG:'cz',BUD:'hu',VIE:'at',BLL:'dk',SOF:'bg',OTP:'ro',BBU:'ro',SKP:'mk',BEG:'rs',
  TIA:'al',LJU:'si',ZAG:'hr',SJJ:'ba',POZ:'pl',KTW:'pl',WMI:'pl',TBS:'ge',
  DXB:'ae',AUH:'ae',DOH:'qa',AMM:'jo',BEY:'lb',TLV:'il',IST:'tr',SAW:'tr',ESB:'tr',
  ADB:'tr',RUH:'sa',JED:'sa',SHJ:'ae',MED:'sa',CMN:'ma',RAK:'ma',TUN:'tn',CAI:'eg',
  HRG:'eg',SSH:'eg',NBO:'ke',CPT:'za',ADD:'et',WDH:'na',LOS:'ng',ACC:'gh',DAR:'tz',
  JNB:'za',JRO:'tz',MBA:'ke',MRU:'mu',ZNZ:'tz',BKK:'th',HKT:'th',USM:'th',KBV:'th',
  SIN:'sg',KUL:'my',HKG:'hk',ICN:'kr',NRT:'jp',HND:'jp',BOM:'in',DEL:'in',MAA:'in',
  BLR:'in',COK:'in',CMB:'lk',DAC:'bd',KTM:'np',DPS:'id',CEB:'ph',MNL:'ph',ADL:'au',
  CAN:'cn',CCU:'in',CHC:'nz',DAD:'vn',KIX:'jp',PEK:'cn',PER:'au',PNH:'kh',POM:'pg',
  PVG:'cn',REP:'kh',SGN:'vn',TPE:'tw',CUN:'mx',PUJ:'do',HAV:'cu',AUA:'aw',CUR:'cw',
  GUA:'gt',JMK:'gr',MBJ:'jm',MLE:'mv',PTY:'pa',SJO:'cr',SJU:'pr',SXM:'sx',
  JFK:'us',EWR:'us',BOS:'us',MIA:'us',ORD:'us',LAX:'us',SFO:'us',SEA:'us',YYZ:'ca',
  YUL:'ca',YVR:'ca',ATL:'us',BNA:'us',BWI:'us',CLT:'us',DEN:'us',DTW:'us',FLL:'us',
  HNL:'us',IAD:'us',IAH:'us',LAS:'us',MCO:'us',MSP:'us',MSY:'us',OAK:'us',PHL:'us',
  PHX:'us',RDU:'us',SAN:'us',SLC:'us',TPA:'us',GRU:'br',EZE:'ar',BOG:'co',LIM:'pe',
  GIG:'br',HUX:'mx',LPB:'bo',MEX:'mx',PVR:'mx',QRO:'mx',SCL:'cl',SJD:'mx',SMR:'co',
  UIO:'ec',KEF:'is',AKL:'nz',SYD:'au',MEL:'au',
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '94d8ca287cmsh020d29e3ffb7fd3p16cb7bjsn64a15b813501'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://erhlxomyatirrqhaxroh.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Get the start date for the next month to search
function getNextMonthDate(): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

interface PriceEntry {
  departure: string
  return: string | null
  price: number
}

/**
 * Fetch price graph for a route using DataCrawler /getPriceGraph
 * Returns all dates (61 days) with prices in one API call
 */
async function fetchPriceGraph(origin: string, destination: string, startDate: string): Promise<PriceEntry[]> {
  try {
    const url = `https://google-flights2.p.rapidapi.com/api/v1/getPriceGraph?departure_id=${origin}&arrival_id=${destination}&outbound_date=${startDate}&travel_class=ECONOMY&currency=NOK`
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function GET(request: Request) {
  // Verify cron secret in production
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

  const startDate = getNextMonthDate()
  const results = { processed: 0, deals: 0, errors: 0, skipped: 0 }
  const dealsToUpsert: Record<string, unknown>[] = []

  // Rotate through destination batches across 3 daily runs
  // Each run covers: 6 origins × ~80 destinations = ~480 calls
  // 3 runs/day = ~1440 calls/day → full 237 dest coverage every ~3 days
  // Monthly: ~43,200 calls — well within 150,000 quota
  const DEST_BATCH_SIZE = 80
  const runIndex = Math.floor(Date.now() / (8 * 3600 * 1000)) % Math.ceil(DESTINATIONS.length / DEST_BATCH_SIZE)
  const destOffset = runIndex * DEST_BATCH_SIZE
  const destBatch = DESTINATIONS.slice(destOffset, destOffset + DEST_BATCH_SIZE)

  for (const origin of ORIGINS) {
    for (const dest of destBatch) {
      if (origin === dest) { results.skipped++; continue }

      const entries = await fetchPriceGraph(origin, dest, startDate)
      results.processed++

      if (!entries || entries.length === 0) {
        results.errors++
        await sleep(500)
        continue
      }

      // Calculate average price across all returned dates
      const prices = entries.map(e => e.price).filter(p => p > 0)
      if (prices.length === 0) { results.skipped++; continue }

      const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      // Find all deal dates: price 30%+ below average (matching the report's algorithm)
      const dealThreshold = avgPrice * 0.70 // 30% below average = deal
      const dealDates = entries
        .filter(e => e.price > 0 && e.price <= dealThreshold)
        .sort((a, b) => a.price - b.price)

      if (dealDates.length === 0) {
        results.skipped++
        await sleep(300)
        continue
      }

      // Take the best deal date (cheapest)
      const bestDeal = dealDates[0]
      const discountPct = Math.round(((avgPrice - bestDeal.price) / avgPrice) * 100)
      const travelDate = bestDeal.departure

      // Calculate return date (7 days after departure)
      const returnD = new Date(travelDate)
      returnD.setDate(returnD.getDate() + 7)
      const returnDate = returnD.toISOString().split('T')[0]

      const monthLabel = new Date(travelDate).toLocaleString('nb-NO', { month: 'short', year: 'numeric' })

      dealsToUpsert.push({
        departure_airport: origin,
        arrival_airport: dest,
        price_nok: bestDeal.price,
        travel_date: travelDate,
        return_date: returnDate,
        normal_price: avgPrice,
        discount_pct: discountPct,
        airline: null, // getPriceGraph doesn't return airline — will be enriched later
        direct: null,
        country: 'NO',
        departure_city: AIRPORT_CITY[origin] || origin,
        arrival_city: AIRPORT_CITY[dest] || dest,
        country_code: AIRPORT_COUNTRY[dest] || 'un',
        dates_text: monthLabel,
        booking_url: `https://www.google.com/travel/flights?q=Flights+from+${origin}+to+${dest}+on+${travelDate}&curr=NOK`,
        avg_price: avgPrice,
        typical_price_low: minPrice,
        typical_price_high: maxPrice,
        found_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      results.deals++

      // Rate limiting: ~400ms between calls = ~2.5 calls/sec
      await sleep(400)
    }
  }

  // Upsert all deals to Supabase
  let upsertError = null
  if (dealsToUpsert.length > 0) {
    // Delete stale deals for these routes first
    const routePairs = dealsToUpsert.map(d => ({
      dep: d.departure_airport as string,
      arr: d.arrival_airport as string,
    }))

    // Batch upsert
    const { error } = await supabase
      .from('flights')
      .upsert(dealsToUpsert, {
        onConflict: 'departure_airport,arrival_airport',
        ignoreDuplicates: false,
      })

    if (error) {
      upsertError = error.message
      console.error('Supabase upsert error:', error)
    }

    // Also store raw price data in price_history for future deal detection improvement
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
    destBatch: `${destOffset + 1}–${Math.min(destOffset + DEST_BATCH_SIZE, DESTINATIONS.length)} of ${DESTINATIONS.length}`,
    ...results,
    dealsUpserted: dealsToUpsert.length,
    upsertError,
  })
}
