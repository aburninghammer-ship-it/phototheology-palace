import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SubscriptionRenewal() {
  const { subscription, loading } = useSubscription();
  const [managingBilling, setManagingBilling] = useState(false);

  const handleManageBilling = async () => {
    setManagingBilling(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Could not open billing portal. Redirecting to plans page...');
      window.location.href = '/pricing';
    } finally {
      setManagingBilling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">Loading subscription...</div>
        </CardContent>
      </Card>
    );
  }

  // Only show for users with active paid subscriptions
  if (!subscription.hasAccess || subscription.tier === 'free' || subscription.tier === null) {
    return null;
  }

  // Check if church subscription
  if (subscription.church.hasChurchAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Church Subscription
          </CardTitle>
          <CardDescription>
            You have access through your church membership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Church: {subscription.church.churchId}</p>
              <p className="text-sm text-muted-foreground">
                Tier: {subscription.church.churchTier?.toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {subscription.church.churchRole}
              </p>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Contact your church administrator for subscription details
          </p>
        </CardContent>
      </Card>
    );
  }

  // For individual subscriptions
  const isStudent = subscription.isStudent;
  const renewalDate = subscription.studentExpiresAt || subscription.promotionalExpiresAt;
  const tierName = subscription.tier === 'essential' ? 'Essential' : subscription.tier === 'premium' ? 'Premium' : subscription.tier === 'student' ? 'Student' : 'Free';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription & Renewal
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <p className="font-medium">{tierName} Plan</p>
            <p className="text-sm text-muted-foreground">
              {isStudent ? 'Student Access' : subscription.status === 'trial' ? 'Trial Period' : 'Annual Subscription'}
            </p>
          </div>
          <Badge 
            variant={subscription.status === 'active' ? 'default' : 'secondary'}
            className={subscription.status === 'active' ? 'bg-green-600' : ''}
          >
            {subscription.status === 'active' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </>
            ) : subscription.status === 'trial' ? (
              'Trial'
            ) : (
              'Inactive'
            )}
          </Badge>
        </div>

        {/* Renewal Information */}
        {renewalDate && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">
                {isStudent ? 'Student Access Expires' : subscription.promotionalExpiresAt ? 'Promotional Access Expires' : 'Next Renewal'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(renewalDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(renewalDate), { addSuffix: true })}
              </p>
            </div>
          </div>
        )}

        {/* Trial Information */}
        {subscription.status === 'trial' && subscription.trialEndsAt && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Trial Period</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your trial ends {formatDistanceToNow(new Date(subscription.trialEndsAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isStudent && (subscription.status === 'active' || subscription.status === 'trial') && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleManageBilling}
                disabled={managingBilling}
              >
                {managingBilling ? (
                  <>
                    <CreditCard className="h-4 w-4 mr-2 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Subscription & Billing
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Change plan, update payment method, view invoices, or cancel subscription
              </p>
            </>
          )}
          
          {subscription.status === 'trial' && (
            <Button
              variant="default"
              className="w-full gradient-palace"
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade to Premium
            </Button>
          )}

          {isStudent && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Renew your student access by verifying your .edu email again before expiration
            </p>
          )}
        </div>

        {/* Renewal Reminder Info */}
        {renewalDate && !isStudent && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              💌 You'll receive an email reminder 30 days before your renewal date
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
