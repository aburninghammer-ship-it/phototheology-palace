import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-08-27.basil',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const tierSeats = {
  tier1: 50,
  tier2: 150,
  tier3: 150, // Enterprise tier - custom capacity set during onboarding
};

// PDF Product configurations for auto-detection
const PDF_PRODUCTS = {
  "genesis-6-days": {
    name: "Genesis in 6 Days",
    priceId: "price_1SnQAcFGDAd3RU8IRqoiIPsh",
    productId: "prod_Tkw2inXRI6c6Ow",
    amount: 900,
  },
  "study-suite": {
    name: "Phototheology Study Suite",
    priceId: "price_1SnNoGFGDAd3RU8I4ALn4b0N",
    productId: "prod_TktboSZYb6oAQt",
    amount: 9700,
  },
  "quick-start-guide": {
    name: "Phototheology Quick-Start Guide",
    priceId: "price_1SnPPvFGDAd3RU8ID1mGI7TR",
    productId: "prod_TktbhIk7zIQ28w",
    amount: 1200,
  }
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    logStep('ERROR: Missing signature or webhook secret');
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    logStep('Received webhook request', { bodyLength: body.length });
    
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

    logStep(`Webhook received: ${receivedEvent.type}`, { eventId: receivedEvent.id });

    switch (receivedEvent.type) {
      case 'checkout.session.completed': {
        const session = receivedEvent.data.object as Stripe.Checkout.Session;
        // Use mutable metadata object
        let metadata: Record<string, string> = session.metadata ? { ...session.metadata } : {};
        const customerId = session.customer as string;
        const customerEmail = session.customer_email || session.customer_details?.email;

        logStep('Processing checkout.session.completed', { 
          sessionId: session.id, 
          metadata, 
          customerId,
          customerEmail,
          mode: session.mode 
        });

        // Handle one-time donations
        if (session.mode === 'payment' && session.submit_type === 'donate') {
          logStep('Processing donation', { 
            amount: session.amount_total, 
            email: customerEmail 
          });

          // Send donation notification email
          try {
            await supabase.functions.invoke('send-purchase-notification', {
              body: {
                userEmail: customerEmail || 'anonymous',
                userName: session.customer_details?.name || 'Anonymous Donor',
                amount: session.amount_total || 0,
                currency: session.currency || 'usd',
                product: 'Donation',
                subscriptionTier: 'donation',
              }
            });
            logStep('Donation notification sent', { email: customerEmail });
          } catch (emailError) {
            logStep('Failed to send donation notification', { error: emailError });
          }
          break;
        }

        // Handle one-time product purchases (like Genesis in 6 Days, Quick-Start Guide, Study Suite)
        if (session.mode === 'payment' && !session.submit_type) {
          const productName = metadata.product || 'Product';
          
          logStep('Processing one-time product purchase', { 
            amount: session.amount_total, 
            email: customerEmail,
            product: productName,
            sessionId: session.id
          });

          // Auto-detect PDF product by price ID, product ID, or amount
          let detectedProductKey: string | null = metadata.product_id || null;
          
          if (!detectedProductKey) {
            // Fetch line items from Stripe API (they are NOT included in webhook events by default)
            try {
              const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
              const lineItems = lineItemsResponse.data || [];
              logStep('Fetched line items from Stripe API', { count: lineItems.length });
              
              for (const [key, config] of Object.entries(PDF_PRODUCTS)) {
                for (const item of lineItems) {
                  if (item.price?.id === config.priceId || item.price?.product === config.productId) {
                    detectedProductKey = key;
                    logStep('Detected PDF product from line items', { key, priceId: item.price?.id });
                    break;
                  }
                }
                if (detectedProductKey) break;
              }
            } catch (lineItemsError) {
              logStep('Failed to fetch line items, falling back to amount detection', { error: String(lineItemsError) });
            }
          }

          if (!detectedProductKey) {
            // Fallback: detect by amount
            for (const [key, config] of Object.entries(PDF_PRODUCTS)) {
              if (session.amount_total === config.amount) {
                detectedProductKey = key;
                logStep('Detected PDF product from amount', { key, amount: session.amount_total });
                break;
              }
            }
          }

          // Send admin notification about the purchase
          try {
            await supabase.functions.invoke('send-purchase-notification', {
              body: {
                userEmail: customerEmail || 'unknown',
                userName: session.customer_details?.name || 'Customer',
                amount: session.amount_total || 0,
                currency: session.currency || 'usd',
                product: detectedProductKey ? PDF_PRODUCTS[detectedProductKey as keyof typeof PDF_PRODUCTS]?.name || productName : productName,
                subscriptionTier: 'one-time',
              }
            });
            logStep('Product purchase notification sent', { email: customerEmail });
          } catch (emailError) {
            logStep('Failed to send product purchase notification', { error: emailError });
          }

          // Send the product delivery email to the customer
          if (customerEmail && detectedProductKey) {
            try {
              await supabase.functions.invoke('send-product-email', {
                body: {
                  email: customerEmail,
                  name: session.customer_details?.name || undefined,
                  product: detectedProductKey
                }
              });
              logStep('Product delivery email sent', { email: customerEmail, product: detectedProductKey });

              // Log the successful email to pdf_email_logs
              await supabase.from('pdf_email_logs').insert({
                email: customerEmail,
                product_key: detectedProductKey,
                checkout_session_id: session.id,
                success: true,
              });
              logStep('PDF email logged', { sessionId: session.id, product: detectedProductKey });
            } catch (emailError) {
              logStep('Failed to send product delivery email', { error: emailError });
              // Log the failed attempt
              await supabase.from('pdf_email_logs').insert({
                email: customerEmail,
                product_key: detectedProductKey,
                checkout_session_id: session.id,
                success: false,
                error_message: String(emailError),
              });
            }
          } else if (!detectedProductKey) {
            logStep('No PDF product detected - skipping auto-send', { amount: session.amount_total });
          }
          break;
        }

        // Check if we have user_id in metadata
        if (!metadata.user_id) {
          // Try to find user by email if user_id not in metadata
          if (customerEmail) {
            logStep('No user_id in metadata, trying to find by email', { email: customerEmail });
            const { data: userByEmail } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customerEmail)
              .single();
            
            if (userByEmail) {
              metadata.user_id = userByEmail.id;
              logStep('Found user by email', { userId: userByEmail.id });
            } else {
              logStep('WARNING: Could not find user by email', { email: customerEmail });
              
              // Still send admin notification about the purchase even when user not found
              try {
                await supabase.functions.invoke('send-purchase-notification', {
                  body: {
                    userEmail: customerEmail,
                    userName: session.customer_details?.name || 'Unknown User',
                    amount: session.amount_total || 0,
                    currency: session.currency || 'usd',
                    product: `${metadata.tier || 'Unknown'} Subscription (USER NOT FOUND IN DB)`,
                    subscriptionTier: metadata.tier || 'unknown',
                  }
                });
                logStep('Admin notification sent for unmatched user', { email: customerEmail });
              } catch (emailError) {
                logStep('Failed to send admin notification', { error: emailError });
              }
              break;
            }
          } else {
            logStep('ERROR: Missing user_id in session metadata and no email available');
            
            // Still try to send admin notification
            try {
              await supabase.functions.invoke('send-purchase-notification', {
                body: {
                  userEmail: 'unknown@email.com',
                  userName: session.customer_details?.name || 'Unknown User',
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  product: `${metadata.tier || 'Unknown'} Subscription (NO EMAIL OR USER_ID)`,
                  subscriptionTier: metadata.tier || 'unknown',
                }
              });
              logStep('Admin notification sent for unknown user');
            } catch (emailError) {
              logStep('Failed to send admin notification', { error: emailError });
            }
            break;
          }
        }

        // Check if this is an INDIVIDUAL subscription (not a church)
        const isIndividualSubscription = metadata.is_trial === 'true' || !metadata.church_name;

        if (isIndividualSubscription) {
          logStep(`Processing individual subscription for user ${metadata.user_id}`);
          
          const tier = metadata.tier || 'premium';
          let subscription = null;
          let renewalDate = null;
          let isInTrial = false;
          let trialEnd = null;

          if (session.subscription) {
            subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            renewalDate = new Date(subscription.current_period_end * 1000);
            isInTrial = subscription.status === 'trialing';
            trialEnd = subscription.trial_end 
              ? new Date(subscription.trial_end * 1000)
              : null;
            logStep('Retrieved subscription details', { 
              subscriptionId: subscription.id, 
              status: subscription.status,
              renewalDate,
              isInTrial,
              trialEnd
            });
          }

          // Prepare update data
          const updateData: Record<string, any> = {
            user_id: metadata.user_id,
            subscription_status: isInTrial ? 'trial' : 'active',
            subscription_tier: tier,
            stripe_customer_id: customerId,
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

          logStep('Upserting subscription', updateData);

          const { error: subscriptionError } = await supabase
            .from('user_subscriptions')
            .upsert(updateData, {
              onConflict: 'user_id'
            });

          if (subscriptionError) {
            logStep('ERROR updating subscription', { error: subscriptionError });
          } else {
            logStep(`Individual subscription activated for user ${metadata.user_id}, tier: ${tier}, status: ${isInTrial ? 'trial' : 'active'}`);
          }

          // Send purchase notification email
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, email')
              .eq('id', metadata.user_id)
              .single();

            if (profile?.email) {
              // Get billing interval from subscription price
              let billingInterval = 'month';
              if (subscription?.items?.data?.[0]?.price?.recurring?.interval) {
                billingInterval = subscription.items.data[0].price.recurring.interval;
              }

              await supabase.functions.invoke('send-purchase-notification', {
                body: {
                  userEmail: profile.email,
                  userName: profile.display_name || 'User',
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  product: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
                  subscriptionTier: tier,
                  isTrialing: isInTrial,
                  trialEndsAt: trialEnd?.toISOString() || null,
                  billingInterval,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscription?.id || null,
                  renewalDate: renewalDate?.toISOString() || null,
                }
              });
              logStep('Purchase notification sent', { email: profile.email, tier, isInTrial });
            }
          } catch (emailError) {
            logStep('Failed to send purchase notification', { error: emailError });
          }

          break;
        }

        // Handle CHURCH subscription (original logic)
        if (!metadata.tier || !metadata.church_name) {
          logStep('ERROR: Missing tier or church_name in church subscription metadata');
          break;
        }

        // Check if user is already part of a church
        const { data: existingMembership } = await supabase
          .from('church_members')
          .select('id')
          .eq('user_id', metadata.user_id)
          .single();

        if (existingMembership) {
          logStep('ERROR: User already has a church membership');
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
            stripe_customer_id: customerId,
          })
          .select()
          .single();

        if (churchError) {
          logStep('ERROR creating church', { error: churchError });
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
          logStep('ERROR adding admin member', { error: memberError });
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
          logStep('Failed to send church purchase notification', { error: emailError });
        }

        logStep(`Church created successfully: ${church.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const renewalDate = new Date(subscription.current_period_end * 1000);
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        logStep('Processing subscription update', { 
          subscriptionId: subscription.id, 
          customerId, 
          status: subscription.status,
          renewalDate 
        });

        // Try to update church subscription
        const { data: church } = await supabase
          .from('churches')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (church) {
          const { error } = await supabase
            .from('churches')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
              subscription_ends_at: renewalDate.toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            logStep('ERROR updating church subscription', { error });
          } else {
            logStep(`Church subscription updated for customer ${customerId}`);
          }
        }

        // Also update individual subscription if exists
        const { data: userSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userSub) {
          const updateData: Record<string, any> = {
            subscription_status: subscription.status === 'trialing' ? 'trial' : (isActive ? 'active' : 'cancelled'),
            subscription_renewal_date: renewalDate.toISOString(),
          };

          if (subscription.trial_end) {
            updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
          }

          const { error } = await supabase
            .from('user_subscriptions')
            .update(updateData)
            .eq('stripe_customer_id', customerId);

          if (error) {
            logStep('ERROR updating user subscription', { error });
          } else {
            logStep(`User subscription updated for customer ${customerId}: ${subscription.status}`);
          }
        } else {
          logStep('No existing user subscription found for customer', { customerId });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        logStep('Processing subscription deletion', { subscriptionId: subscription.id, customerId });

        // Mark church subscription as cancelled
        const { error: churchError } = await supabase
          .from('churches')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('stripe_customer_id', customerId);

        if (churchError) {
          logStep('ERROR cancelling church subscription', { error: churchError });
        } else {
          logStep(`Church subscription cancelled for customer ${customerId}`);
        }

        // Mark individual user subscription as cancelled
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_status: 'cancelled',
            subscription_cancelled_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (subscriptionError) {
          logStep('ERROR cancelling user subscription', { error: subscriptionError });
        } else {
          logStep(`User subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        logStep('Processing payment failure', { invoiceId: invoice.id, customerId });

        // Mark church subscription as past_due
        await supabase
          .from('churches')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        // Mark individual user subscription as expired
        await supabase
          .from('user_subscriptions')
          .update({ subscription_status: 'expired' })
          .eq('stripe_customer_id', customerId);

        logStep(`Payment failed for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        logStep('Processing payment success', { invoiceId: invoice.id, customerId });

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const renewalDate = new Date(subscription.current_period_end * 1000);
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';

          // Update user subscription with new renewal date
          const { error } = await supabase
            .from('user_subscriptions')
            .update({
              subscription_status: subscription.status === 'trialing' ? 'trial' : (isActive ? 'active' : 'expired'),
              subscription_renewal_date: renewalDate.toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            logStep('ERROR updating subscription after payment success', { error });
          } else {
            logStep(`Subscription renewed for customer ${customerId}`);
          }
        }
        break;
      }

      default:
        logStep(`Unhandled event type: ${receivedEvent.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logStep(`Webhook error: ${errorMessage}`);
    return new Response(`Webhook error: ${errorMessage}`, { status: 400 });
  }
});
