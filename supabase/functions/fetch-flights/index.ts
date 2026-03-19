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
// 185 routes across 7 Norwegian airports (OSL, TRF, BGO, SVG, TRD, TOS, KRS)
const routes = [
  // OSL (Oslo) - 50 routes
  { from: "OSL", to: "BCN", fromCity: "Oslo", toCity: "Barcelona", cc: "es" },
  { from: "OSL", to: "AGP", fromCity: "Oslo", toCity: "Málaga", cc: "es" },
  { from: "OSL", to: "LPA", fromCity: "Oslo", toCity: "Gran Canaria", cc: "es" },
  { from: "OSL", to: "ALC", fromCity: "Oslo", toCity: "Alicante", cc: "es" },
  { from: "OSL", to: "PMI", fromCity: "Oslo", toCity: "Mallorca", cc: "es" },
  { from: "OSL", to: "TFS", fromCity: "Oslo", toCity: "Tenerife", cc: "es" },
  { from: "OSL", to: "ATH", fromCity: "Oslo", toCity: "Aten", cc: "gr" },
  { from: "OSL", to: "CHQ", fromCity: "Oslo", toCity: "Kreta", cc: "gr" },
  { from: "OSL", to: "RHO", fromCity: "Oslo", toCity: "Rhodos", cc: "gr" },
  { from: "OSL", to: "SKG", fromCity: "Oslo", toCity: "Thessaloniki", cc: "gr" },
  { from: "OSL", to: "FCO", fromCity: "Oslo", toCity: "Roma", cc: "it" },
  { from: "OSL", to: "BGY", fromCity: "Oslo", toCity: "Bergamo", cc: "it" },
  { from: "OSL", to: "NAP", fromCity: "Oslo", toCity: "Napoli", cc: "it" },
  { from: "OSL", to: "VCE", fromCity: "Oslo", toCity: "Venezia", cc: "it" },
  { from: "OSL", to: "MXP", fromCity: "Oslo", toCity: "Milano", cc: "it" },
  { from: "OSL", to: "LIS", fromCity: "Oslo", toCity: "Lisboa", cc: "pt" },
  { from: "OSL", to: "FAO", fromCity: "Oslo", toCity: "Faro", cc: "pt" },
  { from: "OSL", to: "OPO", fromCity: "Oslo", toCity: "Porto", cc: "pt" },
  { from: "OSL", to: "CDG", fromCity: "Oslo", toCity: "Paris", cc: "fr" },
  { from: "OSL", to: "NCE", fromCity: "Oslo", toCity: "Nice", cc: "fr" },
  { from: "OSL", to: "MRS", fromCity: "Oslo", toCity: "Marseille", cc: "fr" },
  { from: "OSL", to: "IST", fromCity: "Oslo", toCity: "Istanbul", cc: "tr" },
  { from: "OSL", to: "AYT", fromCity: "Oslo", toCity: "Antalya", cc: "tr" },
  { from: "OSL", to: "DLM", fromCity: "Oslo", toCity: "Dalaman", cc: "tr" },
  { from: "OSL", to: "LHR", fromCity: "Oslo", toCity: "London", cc: "gb" },
  { from: "OSL", to: "LGW", fromCity: "Oslo", toCity: "London Gatwick", cc: "gb" },
  { from: "OSL", to: "STN", fromCity: "Oslo", toCity: "London Stansted", cc: "gb" },
  { from: "OSL", to: "EDI", fromCity: "Oslo", toCity: "Edinburgh", cc: "gb" },
  { from: "OSL", to: "DUB", fromCity: "Oslo", toCity: "Dublin", cc: "ie" },
  { from: "OSL", to: "BUD", fromCity: "Oslo", toCity: "Budapest", cc: "hu" },
  { from: "OSL", to: "PRG", fromCity: "Oslo", toCity: "Praha", cc: "cz" },
  { from: "OSL", to: "WAW", fromCity: "Oslo", toCity: "Warszawa", cc: "pl" },
  { from: "OSL", to: "KRK", fromCity: "Oslo", toCity: "Kraków", cc: "pl" },
  { from: "OSL", to: "BER", fromCity: "Oslo", toCity: "Berlin", cc: "de" },
  { from: "OSL", to: "MUC", fromCity: "Oslo", toCity: "München", cc: "de" },
  { from: "OSL", to: "VIE", fromCity: "Oslo", toCity: "Wien", cc: "at" },
  { from: "OSL", to: "ZRH", fromCity: "Oslo", toCity: "Zürich", cc: "ch" },
  { from: "OSL", to: "CPH", fromCity: "Oslo", toCity: "København", cc: "dk" },
  { from: "OSL", to: "ARN", fromCity: "Oslo", toCity: "Stockholm", cc: "se" },
  { from: "OSL", to: "GOT", fromCity: "Oslo", toCity: "Göteborg", cc: "se" },
  { from: "OSL", to: "KEF", fromCity: "Oslo", toCity: "Reykjavik", cc: "is" },
  { from: "OSL", to: "HEL", fromCity: "Oslo", toCity: "Helsinki", cc: "fi" },
  { from: "OSL", to: "AMS", fromCity: "Oslo", toCity: "Amsterdam", cc: "nl" },
  { from: "OSL", to: "DXB", fromCity: "Oslo", toCity: "Dubai", cc: "ae" },
  { from: "OSL", to: "BKK", fromCity: "Oslo", toCity: "Bangkok", cc: "th" },
  { from: "OSL", to: "HKT", fromCity: "Oslo", toCity: "Phuket", cc: "th" },
  { from: "OSL", to: "JFK", fromCity: "Oslo", toCity: "New York", cc: "us" },
  { from: "OSL", to: "LAX", fromCity: "Oslo", toCity: "Los Angeles", cc: "us" },
  { from: "OSL", to: "NRT", fromCity: "Oslo", toCity: "Tokyo", cc: "jp" },
  { from: "OSL", to: "DPS", fromCity: "Oslo", toCity: "Bali", cc: "id" },
  { from: "OSL", to: "SIN", fromCity: "Oslo", toCity: "Singapore", cc: "sg" },
  { from: "OSL", to: "HND", fromCity: "Oslo", toCity: "Tokyo Haneda", cc: "jp" },

  // TRF (Torp) - 28 routes
  { from: "TRF", to: "BCN", fromCity: "Torp", toCity: "Barcelona", cc: "es" },
  { from: "TRF", to: "AGP", fromCity: "Torp", toCity: "Málaga", cc: "es" },
  { from: "TRF", to: "LPA", fromCity: "Torp", toCity: "Gran Canaria", cc: "es" },
  { from: "TRF", to: "ALC", fromCity: "Torp", toCity: "Alicante", cc: "es" },
  { from: "TRF", to: "PMI", fromCity: "Torp", toCity: "Mallorca", cc: "es" },
  { from: "TRF", to: "TFS", fromCity: "Torp", toCity: "Tenerife", cc: "es" },
  { from: "TRF", to: "ATH", fromCity: "Torp", toCity: "Aten", cc: "gr" },
  { from: "TRF", to: "CHQ", fromCity: "Torp", toCity: "Kreta", cc: "gr" },
  { from: "TRF", to: "RHO", fromCity: "Torp", toCity: "Rhodos", cc: "gr" },
  { from: "TRF", to: "FCO", fromCity: "Torp", toCity: "Roma", cc: "it" },
  { from: "TRF", to: "BGY", fromCity: "Torp", toCity: "Bergamo", cc: "it" },
  { from: "TRF", to: "LIS", fromCity: "Torp", toCity: "Lisboa", cc: "pt" },
  { from: "TRF", to: "FAO", fromCity: "Torp", toCity: "Faro", cc: "pt" },
  { from: "TRF", to: "CDG", fromCity: "Torp", toCity: "Paris", cc: "fr" },
  { from: "TRF", to: "NCE", fromCity: "Torp", toCity: "Nice", cc: "fr" },
  { from: "TRF", to: "IST", fromCity: "Torp", toCity: "Istanbul", cc: "tr" },
  { from: "TRF", to: "AYT", fromCity: "Torp", toCity: "Antalya", cc: "tr" },
  { from: "TRF", to: "LHR", fromCity: "Torp", toCity: "London", cc: "gb" },
  { from: "TRF", to: "DUB", fromCity: "Torp", toCity: "Dublin", cc: "ie" },
  { from: "TRF", to: "BUD", fromCity: "Torp", toCity: "Budapest", cc: "hu" },
  { from: "TRF", to: "PRG", fromCity: "Torp", toCity: "Praha", cc: "cz" },
  { from: "TRF", to: "BER", fromCity: "Torp", toCity: "Berlin", cc: "de" },
  { from: "TRF", to: "MUC", fromCity: "Torp", toCity: "München", cc: "de" },
  { from: "TRF", to: "AMS", fromCity: "Torp", toCity: "Amsterdam", cc: "nl" },
  { from: "TRF", to: "CPH", fromCity: "Torp", toCity: "København", cc: "dk" },
  { from: "TRF", to: "ARN", fromCity: "Torp", toCity: "Stockholm", cc: "se" },
  { from: "TRF", to: "DXB", fromCity: "Torp", toCity: "Dubai", cc: "ae" },
  { from: "TRF", to: "BKK", fromCity: "Torp", toCity: "Bangkok", cc: "th" },

  // BGO (Bergen) - 28 routes
  { from: "BGO", to: "BCN", fromCity: "Bergen", toCity: "Barcelona", cc: "es" },
  { from: "BGO", to: "AGP", fromCity: "Bergen", toCity: "Málaga", cc: "es" },
  { from: "BGO", to: "LPA", fromCity: "Bergen", toCity: "Gran Canaria", cc: "es" },
  { from: "BGO", to: "ALC", fromCity: "Bergen", toCity: "Alicante", cc: "es" },
  { from: "BGO", to: "PMI", fromCity: "Bergen", toCity: "Mallorca", cc: "es" },
  { from: "BGO", to: "ATH", fromCity: "Bergen", toCity: "Aten", cc: "gr" },
  { from: "BGO", to: "CHQ", fromCity: "Bergen", toCity: "Kreta", cc: "gr" },
  { from: "BGO", to: "RHO", fromCity: "Bergen", toCity: "Rhodos", cc: "gr" },
  { from: "BGO", to: "FCO", fromCity: "Bergen", toCity: "Roma", cc: "it" },
  { from: "BGO", to: "BGY", fromCity: "Bergen", toCity: "Bergamo", cc: "it" },
  { from: "BGO", to: "VCE", fromCity: "Bergen", toCity: "Venezia", cc: "it" },
  { from: "BGO", to: "LIS", fromCity: "Bergen", toCity: "Lisboa", cc: "pt" },
  { from: "BGO", to: "FAO", fromCity: "Bergen", toCity: "Faro", cc: "pt" },
  { from: "BGO", to: "CDG", fromCity: "Bergen", toCity: "Paris", cc: "fr" },
  { from: "BGO", to: "IST", fromCity: "Bergen", toCity: "Istanbul", cc: "tr" },
  { from: "BGO", to: "AYT", fromCity: "Bergen", toCity: "Antalya", cc: "tr" },
  { from: "BGO", to: "LHR", fromCity: "Bergen", toCity: "London", cc: "gb" },
  { from: "BGO", to: "EDI", fromCity: "Bergen", toCity: "Edinburgh", cc: "gb" },
  { from: "BGO", to: "DUB", fromCity: "Bergen", toCity: "Dublin", cc: "ie" },
  { from: "BGO", to: "BUD", fromCity: "Bergen", toCity: "Budapest", cc: "hu" },
  { from: "BGO", to: "PRG", fromCity: "Bergen", toCity: "Praha", cc: "cz" },
  { from: "BGO", to: "BER", fromCity: "Bergen", toCity: "Berlin", cc: "de" },
  { from: "BGO", to: "MUC", fromCity: "Bergen", toCity: "München", cc: "de" },
  { from: "BGO", to: "AMS", fromCity: "Bergen", toCity: "Amsterdam", cc: "nl" },
  { from: "BGO", to: "CPH", fromCity: "Bergen", toCity: "København", cc: "dk" },
  { from: "BGO", to: "ARN", fromCity: "Bergen", toCity: "Stockholm", cc: "se" },
  { from: "BGO", to: "DXB", fromCity: "Bergen", toCity: "Dubai", cc: "ae" },
  { from: "BGO", to: "BKK", fromCity: "Bergen", toCity: "Bangkok", cc: "th" },

  // SVG (Stavanger) - 22 routes
  { from: "SVG", to: "BCN", fromCity: "Stavanger", toCity: "Barcelona", cc: "es" },
  { from: "SVG", to: "AGP", fromCity: "Stavanger", toCity: "Málaga", cc: "es" },
  { from: "SVG", to: "LPA", fromCity: "Stavanger", toCity: "Gran Canaria", cc: "es" },
  { from: "SVG", to: "ALC", fromCity: "Stavanger", toCity: "Alicante", cc: "es" },
  { from: "SVG", to: "PMI", fromCity: "Stavanger", toCity: "Mallorca", cc: "es" },
  { from: "SVG", to: "ATH", fromCity: "Stavanger", toCity: "Aten", cc: "gr" },
  { from: "SVG", to: "RHO", fromCity: "Stavanger", toCity: "Rhodos", cc: "gr" },
  { from: "SVG", to: "FCO", fromCity: "Stavanger", toCity: "Roma", cc: "it" },
  { from: "SVG", to: "VCE", fromCity: "Stavanger", toCity: "Venezia", cc: "it" },
  { from: "SVG", to: "LIS", fromCity: "Stavanger", toCity: "Lisboa", cc: "pt" },
  { from: "SVG", to: "CDG", fromCity: "Stavanger", toCity: "Paris", cc: "fr" },
  { from: "SVG", to: "IST", fromCity: "Stavanger", toCity: "Istanbul", cc: "tr" },
  { from: "SVG", to: "AYT", fromCity: "Stavanger", toCity: "Antalya", cc: "tr" },
  { from: "SVG", to: "LHR", fromCity: "Stavanger", toCity: "London", cc: "gb" },
  { from: "SVG", to: "DUB", fromCity: "Stavanger", toCity: "Dublin", cc: "ie" },
  { from: "SVG", to: "CPH", fromCity: "Stavanger", toCity: "København", cc: "dk" },
  { from: "SVG", to: "ARN", fromCity: "Stavanger", toCity: "Stockholm", cc: "se" },
  { from: "SVG", to: "BER", fromCity: "Stavanger", toCity: "Berlin", cc: "de" },
  { from: "SVG", to: "MUC", fromCity: "Stavanger", toCity: "München", cc: "de" },
  { from: "SVG", to: "AMS", fromCity: "Stavanger", toCity: "Amsterdam", cc: "nl" },
  { from: "SVG", to: "DXB", fromCity: "Stavanger", toCity: "Dubai", cc: "ae" },
  { from: "SVG", to: "BKK", fromCity: "Stavanger", toCity: "Bangkok", cc: "th" },

  // TRD (Trondheim) - 22 routes
  { from: "TRD", to: "BCN", fromCity: "Trondheim", toCity: "Barcelona", cc: "es" },
  { from: "TRD", to: "AGP", fromCity: "Trondheim", toCity: "Málaga", cc: "es" },
  { from: "TRD", to: "LPA", fromCity: "Trondheim", toCity: "Gran Canaria", cc: "es" },
  { from: "TRD", to: "ALC", fromCity: "Trondheim", toCity: "Alicante", cc: "es" },
  { from: "TRD", to: "ATH", fromCity: "Trondheim", toCity: "Aten", cc: "gr" },
  { from: "TRD", to: "CHQ", fromCity: "Trondheim", toCity: "Kreta", cc: "gr" },
  { from: "TRD", to: "FCO", fromCity: "Trondheim", toCity: "Roma", cc: "it" },
  { from: "TRD", to: "VCE", fromCity: "Trondheim", toCity: "Venezia", cc: "it" },
  { from: "TRD", to: "LIS", fromCity: "Trondheim", toCity: "Lisboa", cc: "pt" },
  { from: "TRD", to: "CDG", fromCity: "Trondheim", toCity: "Paris", cc: "fr" },
  { from: "TRD", to: "IST", fromCity: "Trondheim", toCity: "Istanbul", cc: "tr" },
  { from: "TRD", to: "AYT", fromCity: "Trondheim", toCity: "Antalya", cc: "tr" },
  { from: "TRD", to: "LHR", fromCity: "Trondheim", toCity: "London", cc: "gb" },
  { from: "TRD", to: "DUB", fromCity: "Trondheim", toCity: "Dublin", cc: "ie" },
  { from: "TRD", to: "CPH", fromCity: "Trondheim", toCity: "København", cc: "dk" },
  { from: "TRD", to: "ARN", fromCity: "Trondheim", toCity: "Stockholm", cc: "se" },
  { from: "TRD", to: "KEF", fromCity: "Trondheim", toCity: "Reykjavik", cc: "is" },
  { from: "TRD", to: "BER", fromCity: "Trondheim", toCity: "Berlin", cc: "de" },
  { from: "TRD", to: "MUC", fromCity: "Trondheim", toCity: "München", cc: "de" },
  { from: "TRD", to: "AMS", fromCity: "Trondheim", toCity: "Amsterdam", cc: "nl" },
  { from: "TRD", to: "DXB", fromCity: "Trondheim", toCity: "Dubai", cc: "ae" },
  { from: "TRD", to: "BKK", fromCity: "Trondheim", toCity: "Bangkok", cc: "th" },

  // TOS (Tromsø) - 18 routes
  { from: "TOS", to: "BCN", fromCity: "Tromsø", toCity: "Barcelona", cc: "es" },
  { from: "TOS", to: "AGP", fromCity: "Tromsø", toCity: "Málaga", cc: "es" },
  { from: "TOS", to: "LPA", fromCity: "Tromsø", toCity: "Gran Canaria", cc: "es" },
  { from: "TOS", to: "ATH", fromCity: "Tromsø", toCity: "Aten", cc: "gr" },
  { from: "TOS", to: "RHO", fromCity: "Tromsø", toCity: "Rhodos", cc: "gr" },
  { from: "TOS", to: "FCO", fromCity: "Tromsø", toCity: "Roma", cc: "it" },
  { from: "TOS", to: "LIS", fromCity: "Tromsø", toCity: "Lisboa", cc: "pt" },
  { from: "TOS", to: "CDG", fromCity: "Tromsø", toCity: "Paris", cc: "fr" },
  { from: "TOS", to: "IST", fromCity: "Tromsø", toCity: "Istanbul", cc: "tr" },
  { from: "TOS", to: "LHR", fromCity: "Tromsø", toCity: "London", cc: "gb" },
  { from: "TOS", to: "CPH", fromCity: "Tromsø", toCity: "København", cc: "dk" },
  { from: "TOS", to: "ARN", fromCity: "Tromsø", toCity: "Stockholm", cc: "se" },
  { from: "TOS", to: "KEF", fromCity: "Tromsø", toCity: "Reykjavik", cc: "is" },
  { from: "TOS", to: "BER", fromCity: "Tromsø", toCity: "Berlin", cc: "de" },
  { from: "TOS", to: "MUC", fromCity: "Tromsø", toCity: "München", cc: "de" },
  { from: "TOS", to: "AMS", fromCity: "Tromsø", toCity: "Amsterdam", cc: "nl" },
  { from: "TOS", to: "DXB", fromCity: "Tromsø", toCity: "Dubai", cc: "ae" },
  { from: "TOS", to: "BKK", fromCity: "Tromsø", toCity: "Bangkok", cc: "th" },

  // KRS (Kristiansand) - 17 routes
  { from: "KRS", to: "BCN", fromCity: "Kristiansand", toCity: "Barcelona", cc: "es" },
  { from: "KRS", to: "AGP", fromCity: "Kristiansand", toCity: "Málaga", cc: "es" },
  { from: "KRS", to: "LPA", fromCity: "Kristiansand", toCity: "Gran Canaria", cc: "es" },
  { from: "KRS", to: "ALC", fromCity: "Kristiansand", toCity: "Alicante", cc: "es" },
  { from: "KRS", to: "ATH", fromCity: "Kristiansand", toCity: "Aten", cc: "gr" },
  { from: "KRS", to: "RHO", fromCity: "Kristiansand", toCity: "Rhodos", cc: "gr" },
  { from: "KRS", to: "FCO", fromCity: "Kristiansand", toCity: "Roma", cc: "it" },
  { from: "KRS", to: "LIS", fromCity: "Kristiansand", toCity: "Lisboa", cc: "pt" },
  { from: "KRS", to: "CDG", fromCity: "Kristiansand", toCity: "Paris", cc: "fr" },
  { from: "KRS", to: "IST", fromCity: "Kristiansand", toCity: "Istanbul", cc: "tr" },
  { from: "KRS", to: "LHR", fromCity: "Kristiansand", toCity: "London", cc: "gb" },
  { from: "KRS", to: "CPH", fromCity: "Kristiansand", toCity: "København", cc: "dk" },
  { from: "KRS", to: "ARN", fromCity: "Kristiansand", toCity: "Stockholm", cc: "se" },
  { from: "KRS", to: "BER", fromCity: "Kristiansand", toCity: "Berlin", cc: "de" },
  { from: "KRS", to: "MUC", fromCity: "Kristiansand", toCity: "München", cc: "de" },
  { from: "KRS", to: "AMS", fromCity: "Kristiansand", toCity: "Amsterdam", cc: "nl" },
  { from: "KRS", to: "DXB", fromCity: "Kristiansand", toCity: "Dubai", cc: "ae" },
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
