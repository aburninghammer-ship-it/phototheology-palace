import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

type Status = "verifying" | "success" | "error";

export default function ChurchSignupSuccess() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [churchId, setChurchId] = useState<string | null>(null);

  const finalize = useCallback(async () => {
    if (!sessionId) return;

    if (!user) {
      setStatus("error");
      setErrorMessage(t('church.errorSignInToFinish'));
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    const { data, error } = await supabase.functions.invoke("finalize-church-signup", {
      body: { session_id: sessionId },
    });

    if (error || !data?.success) {
      const msg = (data && data.error) || error?.message || t('church.errorCouldNotFinish');
      setStatus("error");
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setChurchId(data.church_id || null);
    setStatus("success");
    toast.success(t('church.setupComplete'));
  }, [sessionId, user]);

  useEffect(() => {
    if (!sessionId) {
      navigate("/church-signup", { replace: true });
      return;
    }

    // Immediately finalize (we no longer rely on payment webhooks to create the church)
    finalize();
  }, [sessionId, navigate, finalize]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">{t('church.finalizingSetup')}</h1>
              <p className="text-muted-foreground">
                {t('church.finalizingDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);

    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto max-w-2xl px-4 py-20">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-center">{t('church.setupNotFinished')}</CardTitle>
              <CardDescription className="text-center">
                {errorMessage || t('church.errorCouldNotConfirm')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  {t('church.errorHelpText')}
                </AlertDescription>
              </Alert>

              <div className="grid gap-2 sm:grid-cols-2">
                {!user ? (
                  <Button onClick={() => navigate(`/auth?redirect=${redirect}`)}>{t('common.signIn')}</Button>
                ) : (
                  <Button onClick={finalize}>{t('church.retrySetup')}</Button>
                )}
                <Button variant="outline" onClick={() => navigate("/church-admin")}>{t('church.goToChurchAdmin')}</Button>
              </div>

              {sessionId && (
                <div className="text-xs text-muted-foreground">
                  {t('church.session')}: {sessionId}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{t('church.churchSetupComplete')}</h1>
              <p className="text-muted-foreground mb-6">
                {t('church.churchSetupCompleteDescription')}
              </p>

              {churchId && (
                <div className="text-xs text-muted-foreground mb-6">{t('church.churchId')}: {churchId}</div>
              )}

              <Button onClick={() => navigate("/church-admin")} size="lg" className="w-full">
                {t('church.goToAdminDashboard')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
