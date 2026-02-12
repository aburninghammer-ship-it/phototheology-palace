import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Building2, Check, Users, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

type Tier = 'tier1' | 'tier2' | 'tier3';

export default function ChurchSignup() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const tiers = {
    tier1: {
      name: t('church.tierChurchAccess'),
      price: 399,
      seats: 50,
      icon: Users,
      popular: false,
      features: [
        t('church.featurePlatformAccess'),
        t('church.featureStudyChallenges'),
        t('church.featureBasicManagement'),
        t('church.featureInvitationSystem'),
      ]
    },
    tier2: {
      name: t('church.tierLeadershipTools'),
      price: 899,
      seats: 150,
      icon: Zap,
      popular: true,
      features: [
        t('church.featureEverythingChurchAccess'),
        t('church.featureTeachingOutlines'),
        t('church.featureAnalyticsDashboard'),
        t('church.featureAdvancedCampaign'),
        t('church.featureSmallGroupTraining'),
      ]
    },
    tier3: {
      name: t('church.tierEnterprise'),
      price: null, // Contact us
      seats: 150,
      icon: TrendingUp,
      popular: false,
      isContactUs: true,
      features: [
        t('church.featureEverythingLeadership'),
        t('church.featureCustomCapacity'),
        t('church.featureMinistryAcademy'),
        t('church.featureYouthKidsPacks'),
        t('church.featureBrandedOnboarding'),
        t('church.featurePrioritySupport'),
        t('church.featureCustomCampaign'),
      ]
    }
  };
  const [step, setStep] = useState<'tier' | 'info' | 'processing'>('tier');
  const [selectedTier, setSelectedTier] = useState<Tier>('tier2');
  const [loading, setLoading] = useState(false);
  
  // Church info form
  const [churchName, setChurchName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setStep('info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t('church.errorMustBeLoggedIn'));
      navigate("/auth");
      return;
    }

    if (!churchName || !billingEmail) {
      toast.error(t('church.errorFillRequiredFields'));
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          tier: selectedTier,
          church_name: churchName,
          billing_email: billingEmail,
          contact_person: contactPerson || null,
          contact_phone: contactPhone || null,
          notes: notes || null,
        }
      });

      if (error) throw error;

      if (!data.url) {
        throw new Error(t('church.errorCheckoutSession'));
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || t('church.errorStartCheckout'));
      setStep('info');
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{t('church.settingUpChurch')}</h2>
              <p className="text-muted-foreground">
                {t('church.settingUpDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-6xl px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('church.registerYourChurch')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('church.registerDescription')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'tier' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'tier' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'}`}>
              1
            </div>
            <span className="font-medium">{t('church.stepSelectTier')}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'info' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'}`}>
              2
            </div>
            <span className="font-medium">{t('church.stepChurchInfo')}</span>
          </div>
        </div>

        {/* Step 1: Tier Selection */}
        {step === 'tier' && (
          <div className="grid md:grid-cols-3 gap-6">
            {(Object.entries(tiers) as [Tier, typeof tiers.tier1 & { isContactUs?: boolean }][]).map(([tierKey, tier]) => {
              const Icon = tier.icon;
              const isContactUs = 'isContactUs' in tier && tier.isContactUs;
              return (
                <Card 
                  key={tierKey}
                  className={`relative hover-lift cursor-pointer transition-all ${
                    tier.popular ? 'border-2 border-primary shadow-lg' : ''
                  }`}
                  onClick={() => isContactUs ? window.open('mailto:enterprise@phototheology.com?subject=Enterprise%20Church%20Plan%20Inquiry', '_blank') : handleTierSelect(tierKey)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">{t('church.mostPopular')}</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <div className="text-right">
                        {isContactUs ? (
                          <div className="text-xl font-bold">{t('church.contactUs')}</div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold">${tier.price}</div>
                            <div className="text-sm text-muted-foreground">{t('church.perMonth')}</div>
                          </>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription>
                      {isContactUs ? t('church.membersUnlimited') : t('church.membersUpTo', { count: tier.seats })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"}>
                      {isContactUs ? t('church.contactSales') : t('church.selectPlan', { name: tier.name })}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Step 2: Church Information */}
        {step === 'info' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t('church.churchInformation')}</CardTitle>
                <CardDescription>
                  {t('church.churchInfoDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Tier Summary */}
                  <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{t('church.selectedPlan')}:</strong> {tiers[selectedTier].name} - ${tiers[selectedTier].price}/{t('church.perMonth')} {t('church.forUpToMembers', { count: tiers[selectedTier].seats })}
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-2 p-0 h-auto"
                        onClick={() => setStep('tier')}
                        type="button"
                      >
                        {t('common.change')}
                      </Button>
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="church-name">{t('church.churchName')} *</Label>
                      <Input
                        id="church-name"
                        placeholder={t('church.churchNamePlaceholder')}
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="billing-email">{t('church.billingEmail')} *</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        placeholder={t('church.billingEmailPlaceholder')}
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('church.billingEmailHint')}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contact-person">{t('church.contactPerson')}</Label>
                      <Input
                        id="contact-person"
                        placeholder={t('church.contactPersonPlaceholder')}
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone">{t('church.contactPhone')}</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder={t('church.contactPhonePlaceholder')}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="notes">{t('church.additionalNotes')}</Label>
                      <Textarea
                        id="notes"
                        placeholder={t('church.additionalNotesPlaceholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>{t('church.nextSteps')}:</strong> {t('church.nextStepsDescription')}
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('tier')}
                      disabled={loading}
                    >
                      {t('common.back')}
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t('church.creatingChurch')}
                        </>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4 mr-2" />
                          {t('church.completeRegistration')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
