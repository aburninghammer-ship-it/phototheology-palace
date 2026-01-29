import { useState } from "react";
import { MessageSquare, Plus, Trash2, Phone, User, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSMSRecipients } from "@/hooks/useSMSRecipients";
import { useDevotionals } from "@/hooks/useDevotionals";
import { formatDistanceToNow } from "date-fns";

interface SMSRecipientsManagerProps {
  planId?: string;
}

const COUNTRY_CODES = [
  { code: "+1", label: "US/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+91", label: "India (+91)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+63", label: "Philippines (+63)" },
];

export function SMSRecipientsManager({ planId }: SMSRecipientsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("+1");
  const [selectedPlanId, setSelectedPlanId] = useState(planId || "");

  const { recipients, isLoading, addRecipient, deleteRecipient, toggleActive, activeCount, totalSent } = useSMSRecipients(planId);
  const { plans } = useDevotionals();

  const activePlans = plans?.filter(p => p.status === "active") || [];

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) return;

    addRecipient.mutate({
      name: newName.trim(),
      phone_number: newPhone.trim(),
      phone_country_code: newCountryCode,
      plan_id: selectedPlanId || undefined,
    }, {
      onSuccess: () => {
        setNewName("");
        setNewPhone("");
        setShowAddForm(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Recipients
            </CardTitle>
            <CardDescription>
              Send daily devotionals directly to phone numbers
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Recipient
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
            <span className="text-muted-foreground">Active: </span>
            <span className="font-medium">{activeCount}</span>
          </div>
          <div className="bg-muted px-3 py-1.5 rounded-lg">
            <span className="text-muted-foreground">Total Sent: </span>
            <span className="font-medium">{totalSent}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={newCountryCode} onValueChange={setNewCountryCode}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map(cc => (
                        <SelectItem key={cc.code} value={cc.code}>{cc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="555-123-4567"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {!planId && activePlans.length > 0 && (
              <div className="space-y-2">
                <Label>Assign to Devotional Plan (optional)</Label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a devotional plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No plan assigned</SelectItem>
                    {activePlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.title} ({plan.duration} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!newName.trim() || !newPhone.trim() || addRecipient.isPending}>
                {addRecipient.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Add Recipient</>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>

            <p className="text-xs text-muted-foreground">
              By adding a recipient, you confirm they have consented to receive SMS messages.
              Standard message rates may apply. Recipients can reply STOP to unsubscribe.
            </p>
          </div>
        )}

        {/* Recipients List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !recipients?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No SMS recipients yet</p>
            <p className="text-sm mt-1">Add phone numbers to send daily devotionals via SMS</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  recipient.is_active && !recipient.opted_out_at
                    ? "bg-card"
                    : "bg-muted/50 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{recipient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {recipient.phone_country_code}{recipient.phone_number}
                      {recipient.total_sms_sent > 0 && (
                        <span className="ml-2">
                          ({recipient.total_sms_sent} sent)
                        </span>
                      )}
                    </p>
                    {recipient.last_sms_sent_at && (
                      <p className="text-xs text-muted-foreground">
                        Last sent {formatDistanceToNow(new Date(recipient.last_sms_sent_at), { addSuffix: true })}
                      </p>
                    )}
                    {recipient.opted_out_at && (
                      <p className="text-xs text-destructive">Unsubscribed</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive.mutate({
                      id: recipient.id,
                      isActive: !recipient.is_active
                    })}
                    disabled={!!recipient.opted_out_at}
                    title={recipient.is_active ? "Disable SMS" : "Enable SMS"}
                  >
                    {recipient.is_active && !recipient.opted_out_at ? (
                      <ToggleRight className="h-5 w-5 text-primary" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecipient.mutate(recipient.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
