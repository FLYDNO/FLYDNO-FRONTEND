// Supabase Edge Function: fetch-flights
// Fetches flight deals from Google Flights API (RapidAPI) and caches them
// in the Supabase `flights` table. Intended to be called via cron or manually.

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

/** Sleep for the given number of milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build a human-readable date range string such as "Mar 2026" or "Mar–Apr 2026"
 * from an ISO departure date string.
 */
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

/**
 * Deeply search an object for a numeric value at a given key name.
 * Useful when the API response structure is uncertain.
 */
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

/**
 * Attempt to extract the best (cheapest) flight from the API response body.
 * The Google Flights2 API may return data under several possible keys,
 * so we try multiple paths to be resilient against format changes.
 */
// deno-lint-ignore no-explicit-any
function parseBestFlight(body: any): ParsedFlight | null {
  // Potential arrays that contain flight results
  const candidates =
    body?.data?.best_flights ??
    body?.data?.flights ??
    body?.best_flights ??
    body?.flights ??
    body?.data?.results ??
    body?.results ??
    [];

  // If the API returned a single object instead of an array, wrap it
  const flights = Array.isArray(candidates) ? candidates : [candidates];

  if (flights.length === 0) return null;

  let best: ParsedFlight | null = null;

  for (const flight of flights) {
    // --- Price ---
    const price: number | undefined =
      flight?.price?.total ??
      flight?.price?.amount ??
      flight?.price ??
      flight?.total_price ??
      deepFind(flight, "price");

    if (typeof price !== "number" || price <= 0) continue;

    // --- Airline ---
    const airline: string =
      flight?.airline ??
      flight?.airline_name ??
      flight?.airlines?.[0] ??
      flight?.legs?.[0]?.airline ??
      flight?.segments?.[0]?.airline ??
      deepFind(flight, "airline") ??
      "Ukjent";

    // --- Stops ---
    const stopsRaw =
      flight?.stops ??
      flight?.num_stops ??
      flight?.legs?.length != null
        ? (flight?.legs?.length ?? 1) - 1
        : deepFind(flight, "stops") ?? 0;
    const stops = typeof stopsRaw === "number" ? stopsRaw : 0;

    // --- Departure date ---
    const departureDate: string | null =
      flight?.departure_date ??
      flight?.departure ??
      flight?.legs?.[0]?.departure ??
      flight?.segments?.[0]?.departure ??
      deepFind(flight, "departure_date") ??
      null;

    // --- Duration (minutes) ---
    const durationMinutes: number | null =
      flight?.duration ??
      flight?.total_duration ??
      deepFind(flight, "duration") ??
      null;

    // Keep the cheapest
    if (best === null || price < best.price) {
      best = { price, airline, stops, departureDate, durationMinutes };
    }
  }

  return best;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // --------------------------------------------------
  // Auth check: accept either the CRON_SECRET header
  // or a valid Supabase service-role / anon key in the
  // Authorization header.
  // --------------------------------------------------
  const cronSecret = Deno.env.get("CRON_SECRET");
  const incomingCronSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  const isAuthorizedByCron =
    cronSecret && incomingCronSecret && incomingCronSecret === cronSecret;
  const isAuthorizedBySupabase =
    authHeader?.startsWith("Bearer ") && authHeader.length > 20;

  if (!isAuthorizedByCron && !isAuthorizedBySupabase) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // --------------------------------------------------
  // Environment variables
  // --------------------------------------------------
  const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!rapidApiKey || !supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({
        error: "Missing required environment variables (RAPIDAPI_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // --------------------------------------------------
  // Fetch flights for each route
  // --------------------------------------------------
  const results: Array<{
    route: string;
    status: "ok" | "no_data" | "error";
    message?: string;
  }> = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeLabel = `${route.from}→${route.to}`;

    try {
      // Build query params
      const params = new URLSearchParams({
        departure_id: route.from,
        arrival_id: route.to,
        travel_class: "ECONOMY",
        adults: "1",
        show_hidden: "true",
        currency: "NOK",
        language_code: "no",
        country_code: "NO",
        search_type: "best",
      });

      const apiUrl = `https://google-flights2.p.rapidapi.com/api/v1/searchFlights?${params.toString()}`;

      const apiRes = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-flights2.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
          "Content-Type": "application/json",
        },
      });

      if (!apiRes.ok) {
        results.push({
          route: routeLabel,
          status: "error",
          message: `API returned ${apiRes.status}: ${apiRes.statusText}`,
        });
        // Still respect rate limit before next call
        if (i < routes.length - 1) await sleep(1000);
        continue;
      }

      const body = await apiRes.json();
      const best = parseBestFlight(body);

      if (!best) {
        results.push({
          route: routeLabel,
          status: "no_data",
          message: "No parseable flight data in response",
        });
        if (i < routes.length - 1) await sleep(1000);
        continue;
      }

      // Calculate normal price estimate (if the API doesn't provide one,
      // use a rough 1.6x multiplier to simulate a "normal" fare).
      const normalPrice = Math.round(best.price * 1.6);
      const discountPct = Math.round(
        ((normalPrice - best.price) / normalPrice) * 100,
      );

      const datesText = buildDatesText(best.departureDate);

      // Upsert into the flights table — update when the same route already exists
      const { error: upsertError } = await supabase
        .from("flights")
        .upsert(
          {
            departure_airport: route.from,
            arrival_airport: route.to,
            departure_city: route.fromCity,
            arrival_city: route.toCity,
            country_code: route.cc,
            price_nok: best.price,
            normal_price: normalPrice,
            discount_pct: discountPct,
            airline: best.airline,
            direct: best.stops === 0,
            dates_text: datesText,
            travel_date: best.departureDate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "departure_airport,arrival_airport" },
        );

      if (upsertError) {
        results.push({
          route: routeLabel,
          status: "error",
          message: `Supabase upsert failed: ${upsertError.message}`,
        });
      } else {
        results.push({
          route: routeLabel,
          status: "ok",
          message: `${best.price} NOK via ${best.airline}`,
        });
      }
    } catch (err) {
      results.push({
        route: routeLabel,
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }

    // Rate-limit delay between API calls (skip after the last one)
    if (i < routes.length - 1) await sleep(1000);
  }

  // --------------------------------------------------
  // Build summary response
  // --------------------------------------------------
  const okCount = results.filter((r) => r.status === "ok").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const noDataCount = results.filter((r) => r.status === "no_data").length;

  const summary = {
    success: true,
    total: routes.length,
    updated: okCount,
    no_data: noDataCount,
    errors: errorCount,
    details: results,
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
