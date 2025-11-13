import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const tierSeats = {
  tier1: 50,
  tier2: 150,
  tier3: 300,
};

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Webhook received: ${receivedEvent.type}`);

    switch (receivedEvent.type) {
      case 'checkout.session.completed': {
        const session = receivedEvent.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata || !metadata.user_id || !metadata.tier) {
          console.error('Missing metadata in session');
          break;
        }

        // Check if user is already part of a church
        const { data: existingMembership } = await supabase
          .from('church_members')
          .select('id')
          .eq('user_id', metadata.user_id)
          .single();

        if (existingMembership) {
          console.error('User already has a church membership');
          break;
        }

        // Create church
        const { data: church, error: churchError } = await supabase
          .from('churches')
          .insert({
            name: metadata.church_name,
            tier: metadata.tier as 'tier1' | 'tier2' | 'tier3',
            max_seats: tierSeats[metadata.tier as keyof typeof tierSeats],
            billing_email: metadata.billing_email,
            contact_person: metadata.contact_person || null,
            contact_phone: metadata.contact_phone || null,
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .select()
          .single();

        if (churchError) {
          console.error('Error creating church:', churchError);
          break;
        }

        // Add creator as admin
        const { error: memberError } = await supabase
          .from('church_members')
          .insert({
            church_id: church.id,
            user_id: metadata.user_id,
            role: 'admin',
          });

        if (memberError) {
          console.error('Error adding admin member:', memberError);
          // Rollback: delete the church
          await supabase.from('churches').delete().eq('id', church.id);
          break;
        }

        // Get subscription details to set renewal date
        if (session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            if (subscription.current_period_end) {
              const renewalDate = new Date(subscription.current_period_end * 1000);
              
              // Update user profile with renewal date
              await supabase
                .from('profiles')
                .update({
                  subscription_renewal_date: renewalDate.toISOString(),
                })
                .eq('id', metadata.user_id);
              
              console.log(`Set renewal date for user ${metadata.user_id}: ${renewalDate.toISOString()}`);
            }
          } catch (subError) {
            console.error('Error fetching subscription details:', subError);
          }
        }

        console.log(`Church created successfully: ${church.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update church subscription status
        const { error } = await supabase
          .from('churches')
          .update({
            subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
            stripe_subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription:', error);
        } else {
          console.log(`Subscription updated for customer ${customerId}: ${subscription.status}`);
        }

        // Update renewal date in profiles
        if (subscription.current_period_end) {
          const renewalDate = new Date(subscription.current_period_end * 1000);
          
          // Find user associated with this church
          const { data: church } = await supabase
            .from('churches')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (church) {
            const { data: members } = await supabase
              .from('church_members')
              .select('user_id')
              .eq('church_id', church.id)
              .eq('role', 'admin');

            if (members && members.length > 0) {
              for (const member of members) {
                await supabase
                  .from('profiles')
                  .update({
                    subscription_renewal_date: renewalDate.toISOString(),
                  })
                  .eq('id', member.user_id);
              }
              console.log(`Updated renewal date: ${renewalDate.toISOString()}`);
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Mark church subscription as cancelled
        const { error } = await supabase
          .from('churches')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error cancelling subscription:', error);
        } else {
          console.log(`Subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Mark church subscription as past_due
        const { error } = await supabase
          .from('churches')
          .update({
            subscription_status: 'past_due',
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating failed payment:', error);
        } else {
          console.log(`Payment failed for customer ${customerId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${receivedEvent.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
