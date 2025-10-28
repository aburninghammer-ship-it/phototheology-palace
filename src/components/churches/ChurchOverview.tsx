import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, CreditCard } from "lucide-react";

interface Church {
  id: string;
  name: string;
  tier: string;
  max_seats: number;
  billing_email: string;
  contact_person: string | null;
  contact_phone: string | null;
  branded_name: string | null;
}

interface ChurchOverviewProps {
  church: Church;
  usedSeats: number;
  onUpdate: () => void;
}

export function ChurchOverview({ church, usedSeats, onUpdate }: ChurchOverviewProps) {
  const [saving, setSaving] = useState(false);
  const [contactPerson, setContactPerson] = useState(church.contact_person || "");
  const [contactPhone, setContactPhone] = useState(church.contact_phone || "");
  const [brandedName, setBrandedName] = useState(church.branded_name || "");

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('churches')
        .update({
          contact_person: contactPerson,
          contact_phone: contactPhone,
          branded_name: brandedName,
        })
        .eq('id', church.id);

      if (error) throw error;

      toast.success("Church information updated successfully");
      onUpdate();
    } catch (error) {
      console.error('Error updating church:', error);
      toast.error("Failed to update church information");
    } finally {
      setSaving(false);
    }
  };

  const tierDetails = {
    tier1: {
      name: "Church Access",
      price: "$199/month",
      seats: "Up to 50 members",
      features: [
        "Full Phototheology platform access for all members",
        "Church-wide study challenges",
        "Basic member management",
      ]
    },
    tier2: {
      name: "Leadership Tools",
      price: "$399/month",
      seats: "Up to 150 members",
      features: [
        "Everything in Tier 1",
        "Leader teaching outlines & discussion guides",
        "Analytics dashboard",
        "Advanced campaign management",
      ]
    },
    tier3: {
      name: "Growth & Evangelism Suite",
      price: "$699/month",
      seats: "Up to 300 members",
      features: [
        "Everything in Tier 2",
        "Ministry Launch Academy training",
        "Youth & Kids content packs",
        "Branded onboarding experience",
        "Priority support",
      ]
    }
  };

  const currentTier = tierDetails[church.tier as keyof typeof tierDetails];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your church subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{currentTier.name}</h3>
            <p className="text-2xl font-bold text-primary mb-2">{currentTier.price}</p>
            <p className="text-sm text-muted-foreground mb-4">{currentTier.seats}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Included Features:</p>
            <ul className="space-y-1">
              {currentTier.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Seats Used</span>
              <span className="font-semibold">{usedSeats} / {church.max_seats}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(usedSeats / church.max_seats) * 100}%` }}
              />
            </div>
          </div>

          <Button className="w-full gap-2" variant="outline">
            <CreditCard className="h-4 w-4" />
            Manage Billing
          </Button>
        </CardContent>
      </Card>

      {/* Church Information */}
      <Card>
        <CardHeader>
          <CardTitle>Church Information</CardTitle>
          <CardDescription>Update your church details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="church-name">Church Name</Label>
            <Input 
              id="church-name"
              value={church.name}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Contact support to change church name
            </p>
          </div>

          <div>
            <Label htmlFor="branded-name">Display Name (Optional)</Label>
            <Input 
              id="branded-name"
              value={brandedName}
              onChange={(e) => setBrandedName(e.target.value)}
              placeholder="e.g., Grace Community Phototheology"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Custom name shown to members during onboarding
            </p>
          </div>

          <div>
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input 
              id="contact-person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Pastor John Smith"
            />
          </div>

          <div>
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input 
              id="contact-phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              type="tel"
            />
          </div>

          <div>
            <Label htmlFor="billing-email">Billing Email</Label>
            <Input 
              id="billing-email"
              value={church.billing_email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Contact support to change billing email
            </p>
          </div>

          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
