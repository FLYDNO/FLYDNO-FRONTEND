import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getStripe() {
  const Stripe = require('stripe').default || require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia',
  })
}

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  const stripe = getStripe()
  const supabase = getSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      event = JSON.parse(body)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerEmail = session.customer_details?.email
        const customerId = session.customer

        if (customerEmail) {
          await supabase
            .from('payments')
            .upsert({
              email: customerEmail,
              stripe_customer_id: customerId,
              status: 'active',
              plan: 'premium',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer)
        const email = customer.email

        if (email) {
          await supabase
            .from('payments')
            .upsert({
              email,
              stripe_customer_id: subscription.customer,
              status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'inactive',
              plan: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer)
        const email = customer.email

        if (email) {
          await supabase
            .from('payments')
            .upsert({
              email,
              stripe_customer_id: subscription.customer,
              status: 'cancelled',
              plan: 'free',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const email = invoice.customer_email

        if (email) {
          await supabase
            .from('payments')
            .upsert({
              email,
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
  }

  return NextResponse.json({ received: true })
}
