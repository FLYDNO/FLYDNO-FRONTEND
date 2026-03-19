// Supabase Edge Function: fetch-flights
// Fetches flight deals from RapidAPI Google Flights API and calculates real discounts
// using historical price data (getPriceGraph). Stores price history and updates flights table.
// Intended to be called via cron or manually.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// CORS headers – allow browser requests during development / manual triggers
// ---------------------------------------------------------------------------
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------------------------------------------------------------------------
// Route pairs: Norwegian airports → popular international destinations
// ---------------------------------------------------------------------------
const routes = [
  { from: "OSL", to: "BKK", fromCity: "Oslo", toCity: "Bangkok", cc: "th" },
  { from: "OSL", to: "JFK", fromCity: "Oslo", toCity: "New York", cc: "us" },
  { from: "OSL", to: "DXB", fromCity: "Oslo", toCity: "Dubai", cc: "ae" },
  { from: "OSL", to: "HND", fromCity: "Oslo", toCity: "Tokyo", cc: "jp" },
  { from: "BGO", to: "LHR", fromCity: "Bergen", toCity: "London", cc: "gb" },
  { from: "BGO", to: "FCO", fromCity: "Bergen", toCity: "Roma", cc: "it" },
  { from: "TRD", to: "BCN", fromCity: "Trondheim", toCity: "Barcelona", cc: "es" },
  { from: "SVG", to: "AMS", fromCity: "Stavanger", toCity: "Amsterdam", cc: "nl" },
  { from: "TOS", to: "KEF", fromCity: "Tromsø", toCity: "Reykjavik", cc: "is" },
  { from: "TRF", to: "ALC", fromCity: "Torp", toCity: "Alicante", cc: "es" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildDatesText(departureDate?: string): string {
  if (!departureDate) {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "short" });
    return `${month} ${now.getFullYear()}`;
  }

  const date = new Date(departureDate);
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${month} ${date.getFullYear()}`;
}

// deno-lint-ignore no-explicit-any
function deepFind(obj: any, key: string): any {
  if (obj == null || typeof obj !== "object") return undefined;
  if (key in obj) return obj[key];
  for (const k of Object.keys(obj)) {
    const result = deepFind(obj[k], key);
    if (result !== undefined) return result;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Flight data extraction
// ---------------------------------------------------------------------------

interface ParsedFlight {
  price: number;
  airline: string;
  stops: number;
  departureDate: string | null;
  durationMinutes: number | null;
}

interface PricePoint {
  date: string;
  price: number;
}

// deno-lint-ignore no-explicit-any
function parseBestFlight(body: any): ParsedFlight | null {
  const topFlights = body?.data?.itineraries?.topFlights;
  const candidates =
    topFlights ??
    body?.data?.itineraries?.otherFlights ??
    body?.data?.best_flights ??
    body?.data?.flights ??
    [];

  const flights = Array.isArray(candidates) ? candidates : [candidates];

  if (flights.length === 0) return null;

  let best: ParsedFlight | null = null;

  for (const flight of flights) {
    const price: number | undefined =
      typeof flight?.price === "number"
        ? flight.price
        : flight?.price?.total ?? flight?.price?.amount ?? undefined;

    if (typeof price !== "number" || price <= 0) continue;

    // Skip prices > 15000 NOK
    if (price > 15000) continue;

    const airline: string =
      flight?.flights?.[0]?.airline ??
      flight?.airline ??
      "Ukjent";

    const segmentCount = Array.isArray(flight?.flights)
      ? flight.flights.length
      : 1;
    const stops = segmentCount - 1;

    const departureDate: string | null =
      flight?.flights?.[0]?.departure_airport?.time ??
      flight?.departure_date ??
      null;

    const durationMinutes: number | null =
      flight?.duration?.raw ??
      (typeof flight?.duration === "number" ? flight.duration : null);

    if (best === null || price < best.price) {
      best = { price, airline, stops, departureDate, durationMinutes };
    }
  }

  return best;
}

// Parse price graph response to extract historical price data points
// deno-lint-ignore no-explicit-any
function parsePriceGraph(body: any): PricePoint[] {
  const pricePoints: PricePoint[] = [];

  // Look for price data in common locations
  const priceData =
    body?.data?.price_insights?.period_price_history ||
    body?.data?.price_graph ||
    body?.data?.prices ||
    body?.price_history ||
    [];

  if (Array.isArray(priceData)) {
    for (const point of priceData) {
      if (point.date && typeof point.price === "number") {
        pricePoints.push({
          date: point.date,
          price: point.price,
        });
      }
    }
  }

  // Fallback: try to find any numeric price data
  if (pricePoints.length === 0) {
    const priceArray = deepFind(body, "price");
    if (Array.isArray(priceArray)) {
      for (let i = 0; i < priceArray.length && i < 60; i++) {
        if (typeof priceArray[i] === "number" && priceArray[i] > 0) {
          pricePoints.push({
            date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
            price: priceArray[i],
          });
        }
      }
    }
  }

  return pricePoints;
}

// Calculate deal quality based on price comparison
interface DealAnalysis {
  avg_price: number | null;
  typical_low: number | null;
  typical_high: number | null;
  price_level: string;
  is_deal: boolean;
  savings_nok: number;
}

function analyzeDeal(
  currentPrice: number,
  pricePoints: PricePoint[]
): DealAnalysis {
  const prices = pricePoints
    .map((p) => p.price)
    .filter((p) => p > 0 && p <= 15000);

  if (prices.length === 0) {
    return {
      avg_price: null,
      typical_low: null,
      typical_high: null,
      price_level: "unknown",
      is_deal: false,
      savings_nok: 0,
    };
  }

  // Calculate statistics
  prices.sort((a, b) => a - b);
  const avg = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  );
  const low = prices[Math.floor(prices.length * 0.25)];
  const high = prices[Math.floor(prices.length * 0.75)];

  // Determine if this is a deal:
  // - Price must be 30%+ under average
  // - Must save at least 500 NOK
  const percentBelowAvg = ((avg - currentPrice) / avg) * 100;
  const savings = avg - currentPrice;

  const isDeal =
    percentBelowAvg >= 30 && savings >= 500;

  // Determine price level
  let priceLevel = "typical";
  if (currentPrice < low) priceLevel = "low";
  else if (currentPrice > high) priceLevel = "high";

  return {
    avg_price: avg,
    typical_low: low,
    typical_high: high,
    price_level: priceLevel,
    is_deal: isDeal,
    savings_nok: savings,
  };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Auth check
  const cronSecret = Deno.env.get("CRON_SECRET");
  const incomingCronSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  const isAuthorizedByCron =
    cronSecret && incomingCronSecret && incomingCronSecret === cronSecret;

  let isAuthorizedBySupabase = false;
  if (authHeader?.startsWith("Bearer ") && authHeader.length > 40) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const verifyClient = createClient(supabaseUrl, supabaseServiceKey);
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error } = await verifyClient.auth.getUser(token);
        isAuthorizedBySupabase = !!user && !error;
      } catch {
        isAuthorizedBySupabase = false;
      }
    }
  }

  if (!isAuthorizedByCron && !isAuthorizedBySupabase) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Environment variables
  const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!rapidApiKey || !supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({
        error: "Missing required environment variables",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch flights for each route
  const results: Array<{
    route: string;
    status: "ok" | "no_data" | "error";
    message?: string;
    is_deal?: boolean;
  }> = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeLabel = `${route.from}→${route.to}`;

    try {
      // Search ~30 days ahead
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const outboundDate = futureDate.toISOString().split("T")[0];

      // Step 1: Fetch current best price using searchFlights
      const searchParams = new URLSearchParams({
        departure_id: route.from,
        arrival_id: route.to,
        outbound_date: outboundDate,
        travel_class: "ECONOMY",
        adults: "1",
        currency: "NOK",
      });

      const searchUrl = `https://google-flights2.p.rapidapi.com/api/v1/searchFlights?${searchParams.toString()}`;

      const searchRes = await fetch(searchUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-flights2.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      });

      if (!searchRes.ok) {
        results.push({
          route: routeLabel,
          status: "error",
          message: `searchFlights API error ${searchRes.status}`,
        });
        if (i < routes.length - 1) await sleep(1000);
        continue;
      }

      const searchBody = await searchRes.json();
      const bestFlight = parseBestFlight(searchBody);

      if (!bestFlight) {
        results.push({
          route: routeLabel,
          status: "no_data",
          message: "No flight data from searchFlights",
        });
        if (i < routes.length - 1) await sleep(1000);
        continue;
      }

      // Rate limit
      await sleep(1000);

      // Step 2: Fetch historical price data using getPriceGraph
      const priceGraphParams = new URLSearchParams({
        departure_id: route.from,
        arrival_id: route.to,
        date: outboundDate,
        currency: "NOK",
      });

      const priceGraphUrl = `https://google-flights2.p.rapidapi.com/api/v1/getPriceGraph?${priceGraphParams.toString()}`;

      let priceHistory: PricePoint[] = [];
      try {
        const priceGraphRes = await fetch(priceGraphUrl, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "google-flights2.p.rapidapi.com",
            "x-rapidapi-key": rapidApiKey,
          },
        });

        if (priceGraphRes.ok) {
          const priceGraphBody = await priceGraphRes.json();
          priceHistory = parsePriceGraph(priceGraphBody);
        }
      } catch (e) {
        console.warn(`getPriceGraph failed for ${routeLabel}: ${e.message}`);
      }

      // Rate limit
      await sleep(1000);

      // Step 3: Analyze deal using historical data
      const analysis = analyzeDeal(bestFlight.price, priceHistory);

      // Step 4: Calculate discount percentage (based on average or fallback)
      let discountPct = 0;
      if (analysis.avg_price) {
        discountPct = Math.round(
          ((analysis.avg_price - bestFlight.price) / analysis.avg_price) * 100
        );
      } else {
        // Fallback: use 1.6x multiplier if no history
        const normalPrice = Math.round(bestFlight.price * 1.6);
        discountPct = Math.round(
          ((normalPrice - bestFlight.price) / normalPrice) * 100
        );
      }

      // Step 5: Store price history in price_history table
      if (priceHistory.length > 0) {
        for (const point of priceHistory) {
          try {
            // Skip invalid prices
            if (point.price <= 0 || point.price > 15000) continue;

            await supabase.from("price_history").insert({
              departure_airport: route.from,
              arrival_airport: route.to,
              travel_date: point.date,
              price_nok: point.price,
              source: "rapidapi",
            }).single();
          } catch {
            // Ignore duplicates and other insert errors
          }
        }
      }

      // Step 6: Insert current price into price_history
      try {
        await supabase.from("price_history").insert({
          departure_airport: route.from,
          arrival_airport: route.to,
          travel_date: outboundDate,
          price_nok: bestFlight.price,
          source: "rapidapi",
        }).single();
      } catch {
        // Ignore duplicates
      }

      // Step 7: Upsert into flights table with real data
      const datesText = buildDatesText(bestFlight.departureDate);

      const upsertResult = await supabase
        .from("flights")
        .upsert(
          {
            departure_airport: route.from,
            arrival_airport: route.to,
            departure_city: route.fromCity,
            arrival_city: route.toCity,
            country_code: route.cc,
            price_nok: bestFlight.price,
            normal_price: analysis.avg_price || Math.round(bestFlight.price * 1.6),
            discount_pct: discountPct,
            avg_price: analysis.avg_price,
            price_level: analysis.price_level,
            typical_price_low: analysis.typical_low,
            typical_price_high: analysis.typical_high,
            airline: bestFlight.airline,
            direct: bestFlight.stops === 0,
            dates_text: datesText,
            travel_date: bestFlight.departureDate ?? outboundDate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "departure_airport,arrival_airport" },
        );

      const upsertError = upsertResult?.error;

      if (upsertError) {
        results.push({
          route: routeLabel,
          status: "error",
          message: `Upsert failed: ${upsertError.message}`,
        });
      } else {
        results.push({
          route: routeLabel,
          status: "ok",
          message: `${bestFlight.price} NOK ${analysis.is_deal ? "⭐ DEAL" : ""}`,
          is_deal: analysis.is_deal,
        });
      }
    } catch (err) {
      results.push({
        route: routeLabel,
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }

    if (i < routes.length - 1) await sleep(1000);
  }

  // Build summary response
  const okCount = results.filter((r) => r.status === "ok").length;
  const dealCount = results.filter((r) => r.is_deal).length;
  const errorCount = results.filter((r) => r.status === "error").length;

  const summary = {
    success: true,
    total: routes.length,
    updated: okCount,
    deals_found: dealCount,
    errors: errorCount,
    details: results,
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
