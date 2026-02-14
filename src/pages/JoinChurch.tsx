import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function JoinChurch() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // Read code from URL on mount and auto-submit if user is logged in
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setInvitationCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  // Auto-submit when user is logged in and code is present from URL
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (user && codeFromUrl && !autoSubmitted && !loading && !success) {
      setAutoSubmitted(true);
      // Trigger form submission programmatically
      const form = document.getElementById('join-church-form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  }, [user, searchParams, autoSubmitted, loading, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationCode.trim()) {
      toast.error(t('church.errorEnterInvitationCode'));
      return;
    }

    if (!user) {
      toast.error(t('church.errorMustBeLoggedInToJoin'));
      // Preserve the invitation code in the redirect so they can return after login
      navigate(`/auth?redirect=/join-church?code=${encodeURIComponent(invitationCode.trim())}`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('accept_church_invitation', {
        _invitation_code: invitationCode.trim().toUpperCase()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string; church_id?: string };

      if (!result.success) {
        // Workaround: if someone clicks a valid invite twice, the code is "used" but
        // they may already be connected to the church.
        if (result.error?.toLowerCase().includes("already used")) {
          const { data: accessRows, error: accessError } = await supabase.rpc('has_church_access', {
            _user_id: user.id,
          });

          const hasAccess = Array.isArray(accessRows) ? Boolean(accessRows[0]?.has_access) : false;

          if (!accessError && hasAccess) {
            setSuccess(true);
            toast.success(t('church.alreadyInChurch'));
            setTimeout(() => navigate("/living-manna"), 1000);
            return;
          }
        }

        toast.error(result.error || t('church.errorFailedToAcceptInvitation'));
        return;
      }


      // Update profile to reflect church membership access
      // This prevents stale trial/expired status from triggering upgrade prompts or emails
      if (result.church_id) {
        const { data: churchData } = await supabase.rpc('has_church_access', { _user_id: user.id });
        const churchTier = Array.isArray(churchData) ? churchData[0]?.church_tier : null;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_tier: churchTier || 'premium',
            payment_source: 'church' as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }

      setSuccess(true);
      toast.success(result.message || t('church.successfullyJoined'));

      // Redirect to Living Manna church space after a short delay
      setTimeout(() => {
        navigate("/living-manna");
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      // Handle duplicate key = user already in this church
      if (error.message?.includes('church_members_church_id_user_id_key') || error.message?.includes('duplicate key')) {
        setSuccess(true);
        toast.success(t('church.alreadyInChurch', 'You are already a member of this church!'));
        setTimeout(() => navigate("/living-manna"), 1000);
        return;
      }
      toast.error(error.message || t('church.errorFailedToAcceptInvitation'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('church.welcomeToYourChurch')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('church.welcomeDescription')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('common.redirecting')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('church.joinChurchPageTitle')}</title>
        <meta name="description" content={t('church.joinChurchMetaDescription')} />
        <meta property="og:title" content={t('church.joinChurchOgTitle')} />
        <meta property="og:description" content={t('church.joinChurchOgDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://phototheology.app/og-invite.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('church.joinChurchOgTitle')} />
        <meta name="twitter:description" content={t('church.joinChurchTwitterDescription')} />
      </Helmet>
      <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('church.joinYourChurch')}</CardTitle>
          <CardDescription>
            {t('church.joinChurchDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="join-church-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="invitation-code">{t('church.invitationCode')}</Label>
              <Input
                id="invitation-code"
                placeholder="CHURCH-XXXXXXXX"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                className="font-mono"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('church.invitationCodeHint')}
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('church.joinAccessDescription')}
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('church.joiningChurch')}
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('church.joinChurch')}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('church.noInvitationCode')}{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/")}>
                {t('church.contactChurchAdmin')}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
