import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function StudentVerification() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [eduEmail, setEduEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eduEmail.toLowerCase().endsWith('.edu')) {
      toast({
        title: t('access.invalidEmail'),
        description: t('access.enterValidEduEmail'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-student", {
        body: { email: eduEmail },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({
          title: t('access.verified'),
          description: data.message,
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error: any) {
      toast({
        title: t('access.verificationFailed'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              {t('access.studentVerification')}
            </h1>
            <p className="text-muted-foreground">
              {t('access.studentFreeAccess')}
            </p>
          </div>

          {!verified ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('access.verifyStudentStatus')}</CardTitle>
                <CardDescription>
                  {t('access.verifyStudentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edu-email">{t('access.educationalEmail')}</Label>
                    <Input
                      id="edu-email"
                      type="email"
                      placeholder="yourname@university.edu"
                      value={eduEmail}
                      onChange={(e) => setEduEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('access.mustBeEduEmail')}
                    </p>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>{t('access.whatYouGet')}:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>{t('access.benefitPremiumAccess')}</li>
                        <li>{t('access.benefitAiStudy')}</li>
                        <li>{t('access.benefitUnlimitedGames')}</li>
                        <li>{t('access.benefitAnnualRenewal')}</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full gradient-palace" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('access.verifying')}
                      </>
                    ) : (
                      t('access.verifyStudentStatus')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold">{t('access.verified')}</h2>
                  <p className="text-muted-foreground">
                    {t('access.verifiedDescription')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
