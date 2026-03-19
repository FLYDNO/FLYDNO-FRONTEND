import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // Fallback for development (no webhook secret)
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_details?.email
        const customerId = session.customer as string

        if (customerEmail) {
          // Update user in Supabase
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
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const email = (customer as Stripe.Customer).email

        if (email) {
          await supabase
            .from('payments')
            .upsert({
              email,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'inactive',
              plan: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const email = (customer as Stripe.Customer).email

        if (email) {
          await supabase
            .from('payments')
            .upsert({
              email,
              stripe_customer_id: subscription.customer as string,
              status: 'cancelled',
              plan: 'free',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
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
