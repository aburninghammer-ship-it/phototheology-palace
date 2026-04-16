// SMS Recipients Manager - Updated 2026-02-07
import { useState } from "react";
import { MessageSquare, Plus, Trash2, Phone, User, ToggleLeft, ToggleRight, Loader2, CheckCircle2, XCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSMSRecipients } from "@/hooks/useSMSRecipients";
import { useDevotionals } from "@/hooks/useDevotionals";
import { formatDistanceToNow, format } from "date-fns";

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

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
  { value: "Europe/London", label: "UK (GMT/BST)" },
  { value: "Europe/Paris", label: "Central Europe (CET)" },
  { value: "Africa/Lagos", label: "West Africa (WAT)" },
  { value: "Africa/Nairobi", label: "East Africa (EAT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Manila", label: "Philippines (PHT)" },
  { value: "Australia/Sydney", label: "Australia East (AEST)" },
];

const SEND_HOURS = [
  { value: 6, label: "6:00 AM" },
  { value: 7, label: "7:00 AM" },
  { value: 8, label: "8:00 AM" },
  { value: 9, label: "9:00 AM" },
  { value: 10, label: "10:00 AM" },
  { value: 12, label: "12:00 PM" },
  { value: 18, label: "6:00 PM" },
  { value: 20, label: "8:00 PM" },
];

export function SMSRecipientsManager({ planId }: SMSRecipientsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("+1");
  const [newTimezone, setNewTimezone] = useState("America/New_York");
  const [newSendHour, setNewSendHour] = useState(8);
  const [selectedPlanId, setSelectedPlanId] = useState(planId || "");

  const { recipients, isLoading, addRecipient, deleteRecipient, toggleActive, activeCount, totalSent, todaysSends, todayLoading, sendHistory } = useSMSRecipients(planId);
  const { plans } = useDevotionals();

  const activePlans = plans?.filter(p => p.status === "active") || [];

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) return;

    addRecipient.mutate({
      name: newName.trim(),
      phone_number: newPhone.trim(),
      phone_country_code: newCountryCode,
      timezone: newTimezone,
      preferred_send_hour: newSendHour,
      plan_id: selectedPlanId === "none" ? undefined : selectedPlanId || undefined,
    }, {
      onSuccess: () => {
        setNewName("");
        setNewPhone("");
        setNewTimezone("America/New_York");
        setNewSendHour(8);
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
          {todaysSends && todaysSends.length > 0 && (
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-medium">{todaysSends.length} sent today</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Today's SMS Status */}
        {todaysSends && todaysSends.length > 0 && (
          <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
            <div className="px-4 py-3 bg-emerald-100/50 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Today's SMS Deliveries ({format(new Date(), "MMM d")})
              </h4>
            </div>
            <div className="divide-y divide-emerald-200 dark:divide-emerald-800">
              {todaysSends.map((send) => {
                // Find recipient name by matching phone number
                const recipient = recipients?.find(r =>
                  send.phone_number.includes(r.phone_number) ||
                  r.phone_number.includes(send.phone_number.slice(-10))
                );
                const displayName = recipient?.name || send.phone_number;

                const statusColor =
                  send.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' :
                  send.status === 'sent' ? 'text-blue-600 dark:text-blue-400' :
                  send.status === 'queued' ? 'text-amber-600 dark:text-amber-400' :
                  send.status === 'failed' || send.status === 'undelivered' ? 'text-red-600 dark:text-red-400' :
                  'text-muted-foreground';

                const StatusIcon =
                  send.status === 'delivered' ? CheckCircle2 :
                  send.status === 'sent' ? CheckCircle2 :
                  send.status === 'queued' ? Clock :
                  send.status === 'failed' || send.status === 'undelivered' ? XCircle :
                  Clock;

                return (
                  <div key={send.id} className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                          {displayName}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {format(new Date(send.sent_at), "h:mm a")}
                          {send.day_number && ` • Day ${send.day_number}`}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        send.status === 'delivered' ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300' :
                        send.status === 'sent' ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' :
                        send.status === 'queued' ? 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300' :
                        send.status === 'failed' ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300' :
                        ''
                      }`}
                    >
                      {send.status === 'delivered' ? 'Delivered' :
                       send.status === 'sent' ? 'Sent' :
                       send.status === 'queued' ? 'Queued' :
                       send.status === 'failed' ? 'Failed' :
                       send.status || 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent SMS History (shows past sends with dates) */}
        {sendHistory && sendHistory.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent SMS History
              </h4>
            </div>
            <div className="divide-y max-h-[300px] overflow-y-auto">
              {sendHistory.slice(0, 20).map((send) => {
                const recipient = recipients?.find(r =>
                  send.phone_number.includes(r.phone_number) ||
                  r.phone_number.includes(send.phone_number.slice(-10))
                );
                const displayName = recipient?.name || send.phone_number;

                const statusColor =
                  send.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' :
                  send.status === 'sent' ? 'text-blue-600 dark:text-blue-400' :
                  send.status === 'failed' || send.status === 'undelivered' ? 'text-red-600 dark:text-red-400' :
                  'text-muted-foreground';

                const StatusIcon =
                  send.status === 'delivered' ? CheckCircle2 :
                  send.status === 'sent' ? CheckCircle2 :
                  send.status === 'failed' || send.status === 'undelivered' ? XCircle :
                  Clock;

                return (
                  <div key={send.id} className="px-4 py-2 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(send.sent_at), "MMM d, yyyy 'at' h:mm a")}
                          {send.day_number && ` • Day ${send.day_number}`}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        send.status === 'delivered' ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300' :
                        send.status === 'sent' ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' :
                        send.status === 'failed' ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300' :
                        ''
                      }`}
                    >
                      {send.status === 'delivered' ? 'Delivered' :
                       send.status === 'sent' ? 'Sent' :
                       send.status === 'failed' ? 'Failed' :
                       send.status || 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

            {/* Timezone and Send Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={newTimezone} onValueChange={setNewTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Send Time</Label>
                <Select value={String(newSendHour)} onValueChange={(v) => setNewSendHour(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEND_HOURS.map(h => (
                      <SelectItem key={h.value} value={String(h.value)}>{h.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="none">No plan assigned</SelectItem>
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
                    <p className="text-xs text-muted-foreground">
                      Sends at {SEND_HOURS.find(h => h.value === recipient.preferred_send_hour)?.label || '8:00 AM'} • {TIMEZONES.find(tz => tz.value === recipient.timezone)?.label || 'Eastern'}
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
