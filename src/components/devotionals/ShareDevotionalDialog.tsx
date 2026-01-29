import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Copy, Download, Check, Mail, MessageCircle, Gift, Twitter, Facebook, Phone, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DevotionalDay, DevotionalPlan } from "@/hooks/useDevotionals";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const COUNTRY_CODES = [
  { code: "+1", label: "US/CA" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
  { code: "+91", label: "IN" },
  { code: "+234", label: "NG" },
  { code: "+254", label: "KE" },
  { code: "+27", label: "ZA" },
  { code: "+63", label: "PH" },
];

interface ShareDevotionalDialogProps {
  plan: DevotionalPlan;
  day?: DevotionalDay;
  trigger?: React.ReactNode;
  isPublicView?: boolean;
}

export const ShareDevotionalDialog = ({ plan, day, trigger, isPublicView }: ShareDevotionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareToken, setShareToken] = useState(plan.share_token);
  const { toast } = useToast();
  const { user } = useAuth();

  // SMS Automation state
  const [showSMSSetup, setShowSMSSetup] = useState(false);
  const [smsName, setSmsName] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsCountryCode, setSmsCountryCode] = useState("+1");
  const [smsFrequency, setSmsFrequency] = useState<"daily" | "weekly">("daily");
  const [isSavingSMS, setIsSavingSMS] = useState(false);

  // Generate share token if it doesn't exist and make plan public
  useEffect(() => {
    const ensureShareToken = async () => {
      if (!plan.share_token && open) {
        const token = crypto.randomUUID().slice(0, 12);
        const { error } = await supabase
          .from("devotional_plans")
          .update({ share_token: token, is_public: true })
          .eq("id", plan.id);
        
        if (!error) {
          setShareToken(token);
        }
      }
    };
    ensureShareToken();
  }, [open, plan.id, plan.share_token]);

  const shareUrl = shareToken 
    ? `${window.location.origin}/shared-devotional/${shareToken}`
    : `${window.location.origin}/devotionals/${plan.id}`;

  const getShareContent = () => {
    const appLink = `${window.location.origin}`;
    const divider = "═".repeat(20);
    
    if (day) {
      // Beautified devotional content with emojis and spacing
      const parts: string[] = [];
      
      // Header
      parts.push(`✨ ${day.title} ✨`);
      parts.push("");
      
      // Scripture reference
      if (day.scripture_reference) {
        parts.push(`📖 ${day.scripture_reference}`);
      }
      
      // Scripture text
      if (day.scripture_text) {
        parts.push("");
        parts.push(`"${day.scripture_text}"`);
      }
      
      parts.push("");
      parts.push(divider);
      
      // Main devotional content or Christ connection
      if (day.devotional_text) {
        parts.push("");
        parts.push("💭 Today's Reflection:");
        parts.push("");
        parts.push(day.devotional_text);
      } else if (day.christ_connection) {
        parts.push("");
        parts.push("✝️ Christ Connection:");
        parts.push("");
        parts.push(day.christ_connection);
      }
      
      // Memory hook if present
      if (day.memory_hook) {
        parts.push("");
        parts.push(divider);
        parts.push("");
        parts.push(`🧠 Remember: "${day.memory_hook}"`);
      }
      
      // App invite
      parts.push("");
      parts.push(divider);
      parts.push("");
      parts.push("🌟 Get your own daily devotionals:");
      parts.push(`📱 ${appLink}`);
      
      return parts.join("\n");
    }
    
    // Plan-level share (no specific day)
    const planParts: string[] = [];
    planParts.push(`📘 ${plan.title}`);
    planParts.push("");
    planParts.push(divider);
    planParts.push("");
    planParts.push(`🎯 Theme: ${plan.theme}`);
    planParts.push(`📅 Duration: ${plan.duration} days`);
    planParts.push("");
    planParts.push("Join me on this spiritual journey!");
    planParts.push("");
    planParts.push(divider);
    planParts.push("");
    planParts.push("🌟 Get Phototheology Free:");
    planParts.push(`📱 ${appLink}`);
    
    return planParts.join("\n");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(getShareContent() + `\n\n${shareUrl}`);
    toast({
      title: "Content Copied",
      description: "Devotional content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const content = day
      ? `${day.title}\n\n${day.scripture_reference}\n${day.scripture_text}\n\nVisual Imagery:\n${day.visual_imagery}\n\nApplication:\n${day.application}\n\nChrist Connection:\n${day.christ_connection}\n\nPrayer:\n${day.prayer}\n\nChallenge:\n${day.challenge}\n\n---\nGet free access to personalized devotionals at: ${window.location.origin}`
      : `${plan.title}\n\nTheme: ${plan.theme}\nDuration: ${plan.duration} days\nFormat: ${plan.format}\n\n---\nGet free access to personalized devotionals at: ${window.location.origin}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(day?.title || plan.title).replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Devotional saved as text file",
    });
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(day ? day.title : plan.title);
    const body = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareViaSMS = () => {
    const text = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`sms:?body=${text}`);
  };

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(day ? `📖 ${day.title} - ${day.scripture_reference}\n\n${shareUrl}` : `📘 ${plan.title}\n\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareViaFacebook = () => {
    // Use edge function URL for Facebook so crawlers get dynamic OG tags
    const ogUrl = shareToken 
      ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-devotional?token=${shareToken}`
      : shareUrl;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`, "_blank");
  };

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(getShareContent());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleSetupAutoSMS = async () => {
    if (!smsName.trim() || !smsPhone.trim() || !user?.id) {
      toast({
        title: "Missing Information",
        description: "Please enter a name and phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSavingSMS(true);
    try {
      const cleanPhone = smsPhone.replace(/\D/g, '');

      // Check if this recipient already exists
      const { data: existing } = await (supabase as any)
        .from("sms_devotional_recipients")
        .select("id")
        .eq("user_id", user.id)
        .eq("phone_number", cleanPhone)
        .maybeSingle();

      if (existing) {
        // Update existing recipient with this plan
        await (supabase as any)
          .from("sms_devotional_recipients")
          .update({
            plan_id: plan.id,
            is_active: true,
            opted_out_at: null,
          })
          .eq("id", existing.id);
      } else {
        // Create new recipient
        await (supabase as any)
          .from("sms_devotional_recipients")
          .insert({
            user_id: user.id,
            name: smsName.trim(),
            phone_number: cleanPhone,
            phone_country_code: smsCountryCode,
            plan_id: plan.id,
            is_active: true,
          });
      }

      toast({
        title: "SMS Automation Set Up!",
        description: `${smsName} will receive ${smsFrequency} devotionals via text`,
      });

      // Reset form
      setSmsName("");
      setSmsPhone("");
      setShowSMSSetup(false);
    } catch (error: any) {
      console.error("Error setting up SMS:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set up SMS automation",
        variant: "destructive",
      });
    } finally {
      setIsSavingSMS(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          React.cloneElement(trigger as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }
          })
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-background via-background to-purple-50/50 dark:to-purple-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            Share {day ? "Today's Devotion" : "Devotional"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 line-clamp-3">
              {day ? day.title : plan.title}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              {day ? day.scripture_reference : `${plan.duration}-day journey on ${plan.theme}`}
            </p>
          </div>

          {/* AUTO-SEND SMS - PROMINENT SECTION */}
          {user && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              {!showSMSSetup ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Phone className="w-5 h-5" />
                    <span className="font-bold">Auto-Send Daily Texts</span>
                  </div>
                  <p className="text-sm text-violet-100 mb-3">
                    Automatically send this devotional to someone's phone daily or weekly
                  </p>
                  <Button
                    onClick={() => setShowSMSSetup(true)}
                    variant="secondary"
                    className="w-full bg-white text-violet-700 hover:bg-violet-50"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Set Up Automated Texts
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium text-sm">Set Up Auto-Send</span>
                    </div>
                    <Button
                      onClick={() => setShowSMSSetup(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-violet-400/30 h-7 px-2"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-violet-100">Recipient Name</Label>
                    <Input
                      placeholder="John Smith"
                      value={smsName}
                      onChange={(e) => setSmsName(e.target.value)}
                      className="h-9 bg-white/90 text-gray-900 border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-violet-100">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={smsCountryCode} onValueChange={setSmsCountryCode}>
                        <SelectTrigger className="w-24 h-9 bg-white/90 text-gray-900 border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map(cc => (
                            <SelectItem key={cc.code} value={cc.code}>{cc.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="555-123-4567"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        className="flex-1 h-9 bg-white/90 text-gray-900 border-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-violet-100">How Often?</Label>
                    <Select value={smsFrequency} onValueChange={(v) => setSmsFrequency(v as "daily" | "weekly")}>
                      <SelectTrigger className="h-9 bg-white/90 text-gray-900 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily - Every day</SelectItem>
                        <SelectItem value="weekly">Weekly - Once a week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSetupAutoSMS}
                    disabled={isSavingSMS || !smsName.trim() || !smsPhone.trim()}
                    className="w-full bg-white text-violet-700 hover:bg-violet-50"
                  >
                    {isSavingSMS ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Clock className="w-4 h-4 mr-2" /> Start Sending Texts</>
                    )}
                  </Button>

                  <p className="text-xs text-violet-200 text-center">
                    They can reply STOP anytime to unsubscribe
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Share Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-muted/50" />
              <Button onClick={handleCopyLink} size="icon" variant="secondary">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleShareViaEmail} variant="outline" className="gap-2 border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-950">
              <Mail className="w-4 h-4 text-amber-600" />
              Email
            </Button>
            <Button onClick={handleShareViaSMS} variant="outline" className="gap-2 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Text
            </Button>
            <Button onClick={handleShareViaWhatsApp} variant="outline" className="gap-2 border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp
            </Button>
            <Button onClick={handleShareViaTwitter} variant="outline" className="gap-2 border-sky-300 hover:bg-sky-50 dark:border-sky-700 dark:hover:bg-sky-950">
              <Twitter className="w-4 h-4 text-sky-500" />
              Twitter/X
            </Button>
            <Button onClick={handleShareViaFacebook} variant="outline" className="gap-2 border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950 col-span-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Button>
          </div>

          {/* Other Options */}
          <div className="space-y-2 pt-2 border-t">
            <Button onClick={handleCopyContent} variant="ghost" className="w-full justify-start gap-2">
              <Copy className="w-4 h-4" />
              Copy Content
            </Button>
            <Button onClick={handleDownload} variant="ghost" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Download as Text
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
