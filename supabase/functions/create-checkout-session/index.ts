import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const PRICE_ID = "price_1TCCV4BH30TF6uRO4Dshmthq"; // 149 NOK/mnd
const SUCCESS_URL = "https://flydno-frontend.vercel.app/deals.html";
const CANCEL_URL = "https://flydno-frontend.vercel.app/login.html";

console.log("✅ create-checkout-session v2 started");

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

    console.log("📧 Creating checkout for:", email);

    // Sjekk om Stripe-kunde allerede finnes
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${encodeURIComponent(email)}'`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );
    const searchData = await searchRes.json();
    let customerId: string;

    if (searchData.data && searchData.data.length > 0) {
      customerId = searchData.data[0].id;
      console.log("👤 Existing customer:", customerId);
    } else {
      // Opprett ny Stripe-kunde
      const customerRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });
      const customer = await customerRes.json();
      customerId = customer.id;
      console.log("✅ New customer created:", customerId);

      // Lagre stripe_customer_id på bruker i Supabase
      await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      });
    }

    // Opprett Stripe Checkout Session med 7 dager trial
    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: customerId,
        "line_items[0][price]": PRICE_ID,
        "line_items[0][quantity]": "1",
        mode: "subscription",
        "subscription_data[trial_period_days]": "7",
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
        "allow_promotion_codes": "true",
      }),
    });

    const session = await sessionRes.json();

    if (!session.url) {
      console.error("❌ No session URL:", JSON.stringify(session));
      return new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error("❌ Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
