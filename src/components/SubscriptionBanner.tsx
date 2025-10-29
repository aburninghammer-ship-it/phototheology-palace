import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, AlertTriangle, GraduationCap, Crown, Gift, Building2 } from "lucide-react";
import { useState, useEffect } from "react";

export function SubscriptionBanner() {
  const { subscription, loading } = useSubscription();
  const [showBanner, setShowBanner] = useState(false);

  // Delay showing the banner to prevent flash on mount
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowBanner(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [loading]);

  if (loading || !showBanner) return null;
  
  // Church member - show different banner
  if (subscription.church.hasChurchAccess) {
    return (
      <Alert className="mb-4 border-primary/20 bg-primary/5">
        <Building2 className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong className="text-primary">Church Member Access:</strong> You have access through your church organization. 
          {subscription.church.churchRole === 'admin' && (
            <Link to="/church-admin" className="ml-2 underline hover:text-primary">
              Manage your church →
            </Link>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  const now = new Date();
  const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const studentExpiresAt = subscription.studentExpiresAt ? new Date(subscription.studentExpiresAt) : null;
  const promotionalExpiresAt = subscription.promotionalExpiresAt ? new Date(subscription.promotionalExpiresAt) : null;
  const daysUntilTrialEnd = trialEndsAt ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysUntilStudentExpires = studentExpiresAt ? Math.ceil((studentExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysUntilPromotionalExpires = promotionalExpiresAt ? Math.ceil((promotionalExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Promotional access
  if (subscription.promotionalExpiresAt && daysUntilPromotionalExpires > 0) {
    return (
      <Alert className="border-purple-500 bg-purple-50 dark:bg-purple-950/20">
        <Gift className="h-4 w-4 text-purple-600" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>Promotional Access:</strong> Premium access expires in {daysUntilPromotionalExpires} days
          </span>
          {daysUntilPromotionalExpires <= 7 && (
            <Button asChild size="sm" variant="default">
              <Link to="/pricing">Subscribe Now</Link>
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Active subscription
  if (subscription.status === 'active' && subscription.tier && subscription.tier !== 'student') {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <Crown className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>Active Subscription:</strong> {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
        </AlertDescription>
      </Alert>
    );
  }

  // Student subscription
  if (subscription.isStudent && subscription.studentExpiresAt && daysUntilStudentExpires > 0) {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <GraduationCap className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>Student Plan Active:</strong> Free Premium access expires in {daysUntilStudentExpires} days. 
          {daysUntilStudentExpires < 30 && (
            <Link to="/student-verify" className="ml-2 underline">
              Renew early
            </Link>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Trial active
  if (subscription.status === 'trial' && daysUntilTrialEnd > 0) {
    return (
      <Alert className={daysUntilTrialEnd <= 2 ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : ""}>
        <Sparkles className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>Free Trial:</strong> {daysUntilTrialEnd} days remaining
          </span>
          {daysUntilTrialEnd <= 2 && (
            <Button asChild size="sm" variant="default">
              <Link to="/pricing">Upgrade Now</Link>
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Trial expired or no subscription
  if (subscription.status === 'expired' || subscription.status === 'none') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Your trial has ended. Subscribe to continue accessing all features.</span>
          <Button asChild size="sm" variant="default">
            <Link to="/pricing">View Plans</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
