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

        if (!metadata || !metadata.user_id) {
          console.error('Missing user_id in session metadata');
          break;
        }

        // Check if this is an INDIVIDUAL subscription (not a church)
        // Individual subscriptions have is_trial or no church_name
        const isIndividualSubscription = metadata.is_trial === 'true' || !metadata.church_name;

        if (isIndividualSubscription) {
          // Handle individual premium subscription
          console.log(`Processing individual subscription for user ${metadata.user_id}`);
          
          const tier = metadata.tier || 'premium';
          const subscription = session.subscription 
            ? await stripe.subscriptions.retrieve(session.subscription as string)
            : null;
          
          const renewalDate = subscription 
            ? new Date(subscription.current_period_end * 1000)
            : null;
          
          // Determine if user is in trial
          const isInTrial = subscription?.status === 'trialing';
          const trialEnd = subscription?.trial_end 
            ? new Date(subscription.trial_end * 1000)
            : null;

          // Update user profile with subscription
          const updateData: Record<string, any> = {
            subscription_status: isInTrial ? 'trial' : 'active',
            subscription_tier: tier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription?.id || null,
            payment_source: 'stripe',
            is_recurring: true,
          };

          if (renewalDate) {
            updateData.subscription_renewal_date = renewalDate.toISOString();
          }

          if (trialEnd) {
            updateData.trial_ends_at = trialEnd.toISOString();
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', metadata.user_id);

          if (profileError) {
            console.error('Error updating profile for individual subscription:', profileError);
          } else {
            console.log(`Individual subscription activated for user ${metadata.user_id}, tier: ${tier}, status: ${isInTrial ? 'trial' : 'active'}`);
          }

          // Send purchase notification email
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, email')
              .eq('id', metadata.user_id)
              .single();

            if (profile?.email) {
              await supabase.functions.invoke('send-purchase-notification', {
                body: {
                  userEmail: profile.email,
                  userName: profile.display_name || 'User',
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  product: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
                  subscriptionTier: tier,
                }
              });
            }
          } catch (emailError) {
            console.error('Failed to send purchase notification:', emailError);
          }

          break;
        }

        // Handle CHURCH subscription (original logic)
        if (!metadata.tier || !metadata.church_name) {
          console.error('Missing tier or church_name in church subscription metadata');
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

        // Get subscription details
        const churchSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const churchRenewalDate = new Date(churchSubscription.current_period_end * 1000);

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
            subscription_ends_at: churchRenewalDate.toISOString(),
            stripe_customer_id: session.customer as string,
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
          await supabase.from('churches').delete().eq('id', church.id);
          break;
        }

        // Send purchase notification email
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', metadata.user_id)
            .single();

          await supabase.functions.invoke('send-purchase-notification', {
            body: {
              userEmail: metadata.billing_email,
              userName: profile?.display_name || metadata.contact_person,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              product: 'Church Subscription',
              subscriptionTier: metadata.tier,
            }
          });
        } catch (emailError) {
          console.error('Failed to send purchase notification:', emailError);
        }

        console.log(`Church created successfully: ${church.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const renewalDate = new Date(subscription.current_period_end * 1000);
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        // Try to update church subscription
        const { data: church } = await supabase
          .from('churches')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (church) {
          // Update church subscription
          const { error } = await supabase
            .from('churches')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
              subscription_ends_at: renewalDate.toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            console.error('Error updating church subscription:', error);
          } else {
            console.log(`Church subscription updated for customer ${customerId}`);
          }
        }

        // Also update individual profile if exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const updateData: Record<string, any> = {
            subscription_status: subscription.status === 'trialing' ? 'trial' : (isActive ? 'active' : 'cancelled'),
            subscription_renewal_date: renewalDate.toISOString(),
          };

          // Update trial_ends_at if in trial
          if (subscription.trial_end) {
            updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
          }

          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('stripe_customer_id', customerId);

          if (error) {
            console.error('Error updating profile subscription:', error);
          } else {
            console.log(`Profile subscription updated for customer ${customerId}: ${subscription.status}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Mark church subscription as cancelled
        const { error: churchError } = await supabase
          .from('churches')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('stripe_customer_id', customerId);

        if (churchError) {
          console.error('Error cancelling church subscription:', churchError);
        } else {
          console.log(`Church subscription cancelled for customer ${customerId}`);
        }

        // Mark individual profile subscription as cancelled
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_cancelled_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (profileError) {
          console.error('Error cancelling profile subscription:', profileError);
        } else {
          console.log(`Profile subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Mark church subscription as past_due
        await supabase
          .from('churches')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        // Mark individual profile as past_due
        await supabase
          .from('profiles')
          .update({ subscription_status: 'expired' })
          .eq('stripe_customer_id', customerId);

        console.log(`Payment failed for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle successful renewal payments
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const renewalDate = new Date(subscription.current_period_end * 1000);
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';

          // Update profile with new renewal date
          await supabase
            .from('profiles')
            .update({
              subscription_status: isActive ? 'active' : subscription.status,
              subscription_renewal_date: renewalDate.toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          console.log(`Payment succeeded, renewal date updated for customer ${customerId}`);
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
