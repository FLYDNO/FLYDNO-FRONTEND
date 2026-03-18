import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

console.log("✅ send-deal-email v1 started");

interface Deal {
  destination: string;
  destination_code: string;
  departure: string;
  departure_code: string;
  price: number;
  normal_price: number;
  discount_pct: number;
  airline: string;
  travel_date: string;
}

function buildDealHTML(deals: Deal[]): string {
  const dealRows = deals.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;">
        <strong style="color:#fff;">${d.destination}</strong>
        <br><span style="color:#888;font-size:12px;">${d.departure} (${d.departure_code}) → ${d.destination_code}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;text-align:right;">
        <strong style="color:#ff6b00;font-size:18px;">${d.price.toLocaleString('no')} kr</strong>
        <br><span style="color:#666;font-size:12px;text-decoration:line-through;">${d.normal_price.toLocaleString('no')} kr</span>
        <span style="color:#22c55e;font-size:12px;font-weight:700;margin-left:6px;">-${d.discount_pct}%</span>
      </td>
    </tr>
  `).join('');

  return `
    <div style="background:#050505;padding:40px 0;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
        <div style="padding:24px 24px 16px;border-bottom:1px solid #1e1e1e;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;background:#ff6b00;border-radius:8px;display:flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-size:16px;">✈</span>
            </div>
            <span style="color:#fff;font-weight:800;font-size:16px;">FlyDeals</span>
          </div>
        </div>
        <div style="padding:24px;">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">Nye deals funnet! 🎉</h1>
          <p style="color:#888;font-size:14px;margin:0 0 20px;">Vi har funnet ${deals.length} nye tilbud for deg i dag.</p>
          <table style="width:100%;border-collapse:collapse;background:#0e0e0e;border-radius:12px;overflow:hidden;">
            ${dealRows}
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="https://flydno-frontend.vercel.app/deals.html" style="display:inline-block;background:#ff6b00;color:#fff;padding:12px 32px;border-radius:100px;font-weight:700;font-size:14px;text-decoration:none;">Se alle deals</a>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #1e1e1e;text-align:center;">
          <p style="color:#555;font-size:11px;margin:0;">FlyDeals — Varsler deg om de beste flydealsene fra Skandinavia</p>
          <p style="color:#444;font-size:11px;margin:4px 0 0;"><a href="https://flydno-frontend.vercel.app/innstillinger.html" style="color:#ff6b00;text-decoration:none;">Endre varslingsinnstillinger</a></p>
        </div>
      </div>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
    });
  }

  try {
    const { deals } = await req.json();

    if (!deals || !deals.length) {
      return new Response(JSON.stringify({ error: "No deals provided" }), { status: 400 });
    }

    // Hent alle aktive brukere med subscription
    const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/users?subscription_active=eq.true&select=id,email,name,preferred_airports,email_frequency`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY!,
      },
    });
    const users = await usersRes.json();

    let sent = 0;

    for (const user of users) {
      // Filtrer deals basert på brukerens foretrukne flyplasser
      const userDeals = deals.filter((d: Deal) =>
        !user.preferred_airports || user.preferred_airports.includes(d.departure_code)
      );

      if (userDeals.length === 0) continue;

      // Send e-post via Resend
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "FlyDeals <deals@flydeals.no>",
          to: [user.email],
          subject: `🛫 ${userDeals.length} nye flydeals fra ${userDeals[0].departure}`,
          html: buildDealHTML(userDeals),
        }),
      });

      const emailData = await emailRes.json();
      console.log(`📧 E-post sendt til ${user.email}:`, emailData.id || emailData.error);
      sent++;
    }

    return new Response(JSON.stringify({ sent, total_users: users.length }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    console.error("❌ Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
