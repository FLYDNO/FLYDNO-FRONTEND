import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

console.log("cancel-subscription v1 started");

serve(async (req: Request) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Cancelling subscription for:", email);

    // Finn Stripe-kunde via e-post
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${encodeURIComponent(email)}'`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );
    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      // Ingen Stripe-kunde funnet — oppdater DB uansett
      await updateSubscriptionInDB(email, false);
      return new Response(JSON.stringify({ cancelled: true, message: "No Stripe customer found, DB updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const customerId = searchData.data[0].id;

    // Hent aktive abonnementer for denne kunden
    const subsRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );
    const subsData = await subsRes.json();

    // Sjekk også trialing-abonnementer
    const trialRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=trialing`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );
    const trialData = await trialRes.json();

    const allSubs = [...(subsData.data || []), ...(trialData.data || [])];

    // Kanseller alle aktive/trialing abonnementer (cancel at period end)
    for (const sub of allSubs) {
      const cancelRes = await fetch(
        `https://api.stripe.com/v1/subscriptions/${sub.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            cancel_at_period_end: "true",
          }),
        }
      );
      const cancelData = await cancelRes.json();
      console.log("Cancelled subscription:", sub.id, cancelData.cancel_at_period_end);
    }

    // Oppdater DB
    await updateSubscriptionInDB(email, false);

    return new Response(JSON.stringify({
      cancelled: true,
      subscriptions_cancelled: allSubs.length,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    console.error("Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});

async function updateSubscriptionInDB(email: string, active: boolean) {
  await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
    },
    body: JSON.stringify({ subscription_active: active }),
  });
}
