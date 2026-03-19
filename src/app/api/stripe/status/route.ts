import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
})

// Admin emails that bypass paywall
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'E-post er påkrevd' }, { status: 400 })
    }

    // Check if admin
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json({
        hasAccess: true,
        isAdmin: true,
        status: 'admin',
        message: 'Admin-tilgang',
      })
    }

    // Check Stripe for active subscription
    const customers = await stripe.customers.list({ email, limit: 1 })

    if (customers.data.length === 0) {
      return NextResponse.json({
        hasAccess: false,
        isAdmin: false,
        status: 'no_subscription',
        message: 'Ingen abonnement funnet',
      })
    }

    const customer = customers.data[0]

    // Check active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 5,
    })

    const activeSub = subscriptions.data.find(
      s => s.status === 'active' || s.status === 'trialing'
    )

    if (activeSub) {
      const isTrialing = activeSub.status === 'trialing'
      const trialEnd = activeSub.trial_end ? new Date(activeSub.trial_end * 1000) : null
      const daysLeft = trialEnd ? Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

      return NextResponse.json({
        hasAccess: true,
        isAdmin: false,
        status: activeSub.status,
        isTrialing,
        trialDaysLeft: daysLeft,
        currentPeriodEnd: activeSub.current_period_end ? new Date(activeSub.current_period_end * 1000).toISOString() : null,
        message: isTrialing ? `Prøveperiode (${daysLeft} dager igjen)` : 'Aktivt abonnement',
      })
    }

    return NextResponse.json({
      hasAccess: false,
      isAdmin: false,
      status: 'inactive',
      message: 'Abonnementet er ikke aktivt',
    })
  } catch (error) {
    console.error('Stripe status error:', error)
    return NextResponse.json({ error: 'Kunne ikke sjekke abonnementsstatus' }, { status: 500 })
  }
}
