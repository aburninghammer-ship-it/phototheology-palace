import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const tiers = {
  tier1: {
    name: "Church Access",
    price: 199,
    seats: 50,
    icon: Users,
    popular: false,
    features: [
      "Full Phototheology platform access for all members",
      "Church-wide study challenges",
      "Basic member management",
      "Member invitation system",
    ]
  },
  tier2: {
    name: "Leadership Tools",
    price: 399,
    seats: 150,
    icon: Zap,
    popular: false,
    features: [
      "Everything in Church Access",
      "Leader teaching outlines & discussion guides",
      "Analytics dashboard for engagement insights",
      "Advanced campaign management",
      "Small group leader training materials",
    ]
  },
  tier3: {
    name: "Growth & Evangelism Suite",
    price: 699,
    seats: 300,
    icon: TrendingUp,
    popular: true,
    features: [
      "Everything in Leadership Tools",
      "Ministry Launch Academy training track",
      "Youth & Kids content packs",
      "Branded onboarding experience",
      "Priority support",
      "Custom campaign creation",
    ]
  }
};

export default function ChurchSignup() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      toast.error("You must be logged in to register a church");
      navigate("/auth");
      return;
    }

    if (!churchName || !billingEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      // Call edge function to create church and set up admin
      const { data, error } = await supabase.functions.invoke('create-church', {
        body: {
          church_name: churchName,
          tier: selectedTier,
          billing_email: billingEmail,
          contact_person: contactPerson || null,
          contact_phone: contactPhone || null,
          notes: notes || null,
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to create church");
      }

      toast.success("Church registered successfully!");
      
      // Redirect to church admin dashboard
      setTimeout(() => {
        navigate("/church-admin");
      }, 1500);
    } catch (error: any) {
      console.error('Error creating church:', error);
      toast.error(error.message || "Failed to register church");
      setStep('info');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Setting Up Your Church...</h2>
              <p className="text-muted-foreground">
                Creating your organization, setting up your admin account, and preparing your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      
      <div className="container mx-auto max-w-6xl px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Register Your Church
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unite your congregation around one discipleship system. Choose your plan and get started today.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'tier' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'tier' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'}`}>
              1
            </div>
            <span className="font-medium">Select Tier</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'info' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'}`}>
              2
            </div>
            <span className="font-medium">Church Info</span>
          </div>
        </div>

        {/* Step 1: Tier Selection */}
        {step === 'tier' && (
          <div className="grid md:grid-cols-3 gap-6">
            {(Object.entries(tiers) as [Tier, typeof tiers.tier1][]).map(([tierKey, tier]) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tierKey}
                  className={`relative hover-lift cursor-pointer transition-all ${
                    tier.popular ? 'border-2 border-primary shadow-lg' : ''
                  }`}
                  onClick={() => handleTierSelect(tierKey)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <div className="text-right">
                        <div className="text-3xl font-bold">${tier.price}</div>
                        <div className="text-sm text-muted-foreground">/month</div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription>
                      Up to {tier.seats} active members
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
                      Select {tier.name}
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
                <CardTitle>Church Information</CardTitle>
                <CardDescription>
                  Tell us about your church. You'll be set as the admin and can invite members after registration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Tier Summary */}
                  <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Selected Plan:</strong> {tiers[selectedTier].name} - ${tiers[selectedTier].price}/month for up to {tiers[selectedTier].seats} members
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="ml-2 p-0 h-auto"
                        onClick={() => setStep('tier')}
                        type="button"
                      >
                        Change
                      </Button>
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="church-name">Church Name *</Label>
                      <Input
                        id="church-name"
                        placeholder="Grace Community Church"
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="billing-email">Billing Email *</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        placeholder="billing@church.org"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Invoices and billing updates will be sent here
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input
                        id="contact-person"
                        placeholder="Pastor John Smith"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requirements or questions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Next Steps:</strong> After registration, you'll be redirected to your admin dashboard where you can invite members, create campaigns, and manage your church.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('tier')}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating Church...
                        </>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4 mr-2" />
                          Complete Registration
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
