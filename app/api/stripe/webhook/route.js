import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { PLANS } from '@/lib/constants'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const userId = session.metadata.userId
        const planId = session.metadata.planId
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_plan: planId,
            subscription_renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
            stripe_customer_id: session.customer,
          })
          .eq('id', userId)

        // Record payment
        const plan = PLANS[planId]
        await supabaseAdmin.from('subscription_payments').insert({
          user_id: userId,
          stripe_subscription_id: session.subscription,
          amount: plan.price,
          plan: planId,
          prize_pool_contribution: plan.price * plan.prizePoolPercent,
          charity_contribution: plan.price * plan.charityMinPercent,
          status: 'completed',
        })
        break
      }

      case 'customer.subscription.deleted': {
        const customerId = session.customer
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_status: 'cancelled' })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.updated': {
        const customerId = session.customer
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_renewal_date: new Date(session.current_period_end * 1000).toISOString(),
            subscription_status: session.status === 'active' ? 'active' : 'lapsed'
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_failed': {
        const customerId = session.customer
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_status: 'lapsed' })
          .eq('stripe_customer_id', customerId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}
