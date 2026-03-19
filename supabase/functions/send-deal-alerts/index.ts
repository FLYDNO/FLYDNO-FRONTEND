// Supabase Edge Function: send-deal-alerts
// Matches user alerts against current deals and sends email notifications via Resend
// Intended to be called via cron after fetch-flights completes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Alert {
  id: string;
  user_id: string;
  departure_airport?: string;
  arrival_airport: string;
  max_price?: number;
  email: string;
  is_active: boolean;
}

interface Flight {
  departure_airport: string;
  arrival_airport: string;
  departure_city: string;
  arrival_city: string;
  price_nok: number;
  normal_price: number;
  discount_pct: number;
  airline: string;
  direct: boolean;
  dates_text: string;
}

interface EmailDeal {
  route: string;
  departure: string;
  departure_code: string;
  destination: string;
  destination_code: string;
  price: number;
  normal_price: number;
  discount_pct: number;
  airline: string;
}

function buildDealEmailHTML(deals: EmailDeal[], recipientName: string): string {
  const dealRows = deals
    .map((d) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;">
        <strong style="color:#fff;">${escapeHtml(d.destination)}</strong>
        <br><span style="color:#888;font-size:12px;">${escapeHtml(d.departure)} (${escapeHtml(d.departure_code)}) → ${escapeHtml(d.destination_code)}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;text-align:right;">
        <strong style="color:#ff6b00;font-size:18px;">${d.price.toLocaleString("no")} kr</strong>
        <br><span style="color:#666;font-size:12px;text-decoration:line-through;">${d.normal_price.toLocaleString("no")} kr</span>
        <span style="color:#22c55e;font-size:12px;font-weight:700;margin-left:6px;">-${d.discount_pct}%</span>
      </td>
    </tr>
  `)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
        a { color: #ff6b00; text-decoration: none; }
      </style>
    </head>
    <body style="background:#050505;margin:0;padding:40px 20px;">
      <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
        <!-- Header -->
        <div style="padding:24px 24px 16px;border-bottom:1px solid #1e1e1e;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;background:#ff6b00;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;">
              ✈
            </div>
            <span style="color:#fff;font-weight:800;font-size:16px;">FlyDeals</span>
          </div>
        </div>
        <!-- Body -->
        <div style="padding:24px;">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">
            Nye deals funnet! 🎉
          </h1>
          <p style="color:#888;font-size:14px;margin:0 0 20px;">
            Hei ${escapeHtml(recipientName)}, vi har funnet ${deals.length} nye tilbud for deg.
          </p>
          <table style="width:100%;border-collapse:collapse;background:#0e0e0e;border-radius:12px;overflow:hidden;">
            ${dealRows}
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="https://flydno-frontend.vercel.app/deals.html" style="display:inline-block;background:#ff6b00;color:#fff;padding:12px 32px;border-radius:100px;font-weight:700;font-size:14px;text-decoration:none;">
              Se alle deals
            </a>
          </div>
        </div>
        <!-- Footer -->
        <div style="padding:16px 24px;border-top:1px solid #1e1e1e;text-align:center;">
          <p style="color:#555;font-size:11px;margin:0;">
            FlyDeals — Varsler deg om de beste flydealsene fra Skandinavia
          </p>
          <p style="color:#444;font-size:11px;margin:4px 0 0;">
            <a href="https://flydno-frontend.vercel.app/innstillinger.html" style="color:#ff6b00;">Endre varslingsinnstillinger</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
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

  try {
    // Fetch all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("alerts")
      .select("*")
      .eq("is_active", true);

    if (alertsError) throw alertsError;

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          emails_sent: 0,
          message: "No active alerts found",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch all current deals
    const { data: flights, error: flightsError } = await supabase
      .from("flights")
      .select("*");

    if (flightsError) throw flightsError;

    if (!flights || flights.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          emails_sent: 0,
          message: "No flights available",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Group alerts by user email to send one email per user with all matching deals
    const userAlerts: Map<string, { user_id: string; name: string; alerts: Alert[] }> =
      new Map();

    for (const alert of alerts) {
      const userKey = alert.email;
      if (!userAlerts.has(userKey)) {
        // Fetch user name
        const { data: user } = await supabase
          .from("users")
          .select("name")
          .eq("id", alert.user_id)
          .single();

        userAlerts.set(userKey, {
          user_id: alert.user_id,
          name: (user?.name as string) || "Bruker",
          alerts: [],
        });
      }
      userAlerts.get(userKey)!.alerts.push(alert);
    }

    // Send emails
    let emailsSent = 0;
    const sendResults = [];

    for (const [email, userData] of userAlerts) {
      // Find matching deals for this user's alerts
      const matchingDeals: EmailDeal[] = [];

      for (const alert of userData.alerts) {
        const matchedFlights = flights.filter((f: Flight) => {
          const arrivalMatch = f.arrival_airport === alert.arrival_airport;
          const departureMatch = !alert.departure_airport ||
            f.departure_airport === alert.departure_airport;
          const priceMatch = !alert.max_price || f.price_nok <= alert.max_price;

          return arrivalMatch && departureMatch && priceMatch;
        });

        for (const flight of matchedFlights) {
          matchingDeals.push({
            route: `${flight.departure_airport}→${flight.arrival_airport}`,
            departure: flight.departure_city,
            departure_code: flight.departure_airport,
            destination: flight.arrival_city,
            destination_code: flight.arrival_airport,
            price: flight.price_nok,
            normal_price: flight.normal_price,
            discount_pct: flight.discount_pct,
            airline: flight.airline,
          });
        }
      }

      // Skip if no matching deals
      if (matchingDeals.length === 0) continue;

      // Remove duplicates
      const uniqueDeals = Array.from(
        new Map(
          matchingDeals.map((d) => [`${d.departure_code}→${d.destination_code}`, d])
        ).values()
      );

      // Send email via Resend
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "FlyDeals <deals@flydeals.no>",
            to: [email],
            subject: `🛫 ${uniqueDeals.length} nye flydeals fra ${uniqueDeals[0].departure}`,
            html: buildDealEmailHTML(uniqueDeals, userData.name),
          }),
        });

        const emailData = await emailRes.json();

        if (emailRes.ok) {
          emailsSent++;
          sendResults.push({
            email,
            status: "ok",
            deals_count: uniqueDeals.length,
            message: emailData.id,
          });
        } else {
          sendResults.push({
            email,
            status: "error",
            deals_count: uniqueDeals.length,
            message: emailData.error || "Unknown error",
          });
        }
      } catch (e) {
        sendResults.push({
          email,
          status: "error",
          deals_count: matchingDeals.length,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        emails_sent: emailsSent,
        total_users: userAlerts.size,
        details: sendResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("Error:", e.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: e instanceof Error ? e.message : String(e),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
