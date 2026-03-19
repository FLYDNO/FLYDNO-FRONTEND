import { NextResponse } from 'next/server'

const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1TCCV4BH30TF6uRO4Dshmthq'

function getStripe() {
  const Stripe = require('stripe').default || require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia',
  })
}

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, userId } = body

    if (!email) {
      return NextResponse.json({ error: 'E-post er påkrevd' }, { status: 400 })
    }

    const stripe = getStripe()

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let customer: any

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId || '' },
      })
    }

    // Check if user already has an active subscription
    const existingSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    })

    if (existingSubs.data.length > 0) {
      return NextResponse.json({ error: 'Du har allerede et aktivt abonnement', alreadyActive: true }, { status: 400 })
    }

    // Also check for trialing subscriptions
    const trialingSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'trialing',
      limit: 1,
    })

    if (trialingSubs.data.length > 0) {
      return NextResponse.json({ error: 'Du har allerede en aktiv prøveperiode', alreadyActive: true }, { status: 400 })
    }

    // Create Checkout Session with 7-day trial
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: userId || '' },
      },
      success_url: `${request.headers.get('origin') || 'https://flydeals.no'}/deals?payment=success`,
      cancel_url: `${request.headers.get('origin') || 'https://flydeals.no'}/innstillinger?payment=cancelled`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Noe gikk galt med betalingen' }, { status: 500 })
  }
}
