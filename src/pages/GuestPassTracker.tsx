import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Flame, Users, Clock, CheckCircle, XCircle, Mail,
  ArrowRight, Copy, ExternalLink, TrendingUp, AlertTriangle
} from "lucide-react";
import { format, formatDistanceToNow, isPast, addDays, differenceInDays } from "date-fns";

interface GuestPass {
  id: string;
  pass_token: string;
  status: string;
  created_at: string;
  activated_at: string | null;
  expires_at: string | null;
  recipient_email: string | null;
  guest_name: string | null;
  personal_message: string | null;
  conversion_status: string;
  follow_up_sent_at: string | null;
  converted_at: string | null;
  last_active_at: string | null;
  missions_completed?: number;
}

function getStatusBadge(pass: GuestPass, t: (key: string, opts?: any) => string) {
  if (pass.conversion_status === "converted") {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t('guestPassTracker.convertedBadge')}</Badge>;
  }
  if (!pass.activated_at) {
    return <Badge variant="outline" className="text-muted-foreground">{t('guestPassTracker.notActivated')}</Badge>;
  }
  if (pass.expires_at && isPast(new Date(pass.expires_at))) {
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{t('guestPassTracker.expired')}</Badge>;
  }
  if (pass.expires_at) {
    const daysLeft = differenceInDays(new Date(pass.expires_at), new Date());
    if (daysLeft <= 1) {
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{t('guestPassTracker.expiringSoon')}</Badge>;
    }
    return <Badge className="bg-primary/20 text-primary border-primary/30">{t('guestPassTracker.active')} ({daysLeft}d)</Badge>;
  }
  return <Badge variant="outline">{t('followingFeedPage.unknown')}</Badge>;
}

function getDaysIntoPass(pass: GuestPass): number {
  if (!pass.activated_at) return 0;
  return Math.min(5, Math.max(1, differenceInDays(new Date(), new Date(pass.activated_at)) + 1));
}

export default function GuestPassTracker() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [passes, setPasses] = useState<GuestPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!user) return;

    const fetchPasses = async () => {
      const { data, error } = await (supabase as any)
        .from("lock_in_passes")
        .select("id, pass_token, status, created_at, activated_at, expires_at, recipient_email, guest_name, personal_message, conversion_status, follow_up_sent_at, converted_at, last_active_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Fetch mission completion counts
        const passIds = data.map((p: any) => p.id);
        if (passIds.length > 0) {
          const { data: missionData } = await supabase
            .from("lock_in_missions")
            .select("pass_id, is_completed")
            .in("pass_id", passIds);

          const missionCounts: Record<string, number> = {};
          missionData?.forEach((m: any) => {
            if (m.is_completed) {
              missionCounts[m.pass_id] = (missionCounts[m.pass_id] || 0) + 1;
            }
          });

          data.forEach((p: any) => {
            p.missions_completed = missionCounts[p.id] || 0;
          });
        }

        setPasses(data);
      }
      setLoading(false);
    };

    fetchPasses();
  }, [user]);

  const filteredPasses = passes.filter((p) => {
    if (tab === "active") return p.activated_at && p.expires_at && !isPast(new Date(p.expires_at)) && p.conversion_status !== "converted";
    if (tab === "expired") return p.expires_at && isPast(new Date(p.expires_at)) && p.conversion_status !== "converted";
    if (tab === "converted") return p.conversion_status === "converted";
    if (tab === "pending") return !p.activated_at;
    return true;
  });

  const stats = {
    total: passes.length,
    active: passes.filter((p) => p.activated_at && p.expires_at && !isPast(new Date(p.expires_at)) && p.conversion_status !== "converted").length,
    expired: passes.filter((p) => p.expires_at && isPast(new Date(p.expires_at)) && p.conversion_status !== "converted").length,
    converted: passes.filter((p) => p.conversion_status === "converted").length,
    pending: passes.filter((p) => !p.activated_at).length,
  };

  const conversionRate = stats.total > 0
    ? Math.round((stats.converted / Math.max(1, stats.total - stats.pending)) * 100)
    : 0;

  const copyFollowUpLink = (passToken: string) => {
    const link = `${window.location.origin}/pricing?skip_trial=true&ref=lockin_${passToken}`;
    navigator.clipboard.writeText(link);
    toast.success(t('guestPassTracker.conversionLinkCopied'));
  };

  const markConverted = async (passId: string) => {
    const { error } = await (supabase as any)
      .from("lock_in_passes")
      .update({ conversion_status: "converted", converted_at: new Date().toISOString() })
      .eq("id", passId);

    if (!error) {
      setPasses((prev) =>
        prev.map((p) =>
          p.id === passId
            ? { ...p, conversion_status: "converted", converted_at: new Date().toISOString() }
            : p
        )
      );
      toast.success(t('guestPassTracker.markedAsConverted'));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground">{t('guestPassTracker.signInRequired')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO title={`${t('guestPassTracker.title')} | Phototheology`} description={t('guestPassTracker.seoDescription')} />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('guestPassTracker.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('guestPassTracker.subtitle')}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">{t('guestPassTracker.totalShared')}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.active}</p>
              <p className="text-xs text-muted-foreground">{t('guestPassTracker.activeNow')}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">{t('guestPassTracker.notActivated')}</p>
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
              <p className="text-xs text-muted-foreground">{t('guestPassTracker.expired')}</p>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.converted}</p>
              <p className="text-xs text-muted-foreground">{t('guestPassTracker.percentConverted', { rate: conversionRate })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all">{t('guestPassTracker.all')} ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">{t('guestPassTracker.active')} ({stats.active})</TabsTrigger>
            <TabsTrigger value="pending">{t('guestPassTracker.pending')} ({stats.pending})</TabsTrigger>
            <TabsTrigger value="expired">{t('guestPassTracker.expired')} ({stats.expired})</TabsTrigger>
            <TabsTrigger value="converted">{t('guestPassTracker.converted')} ({stats.converted})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground text-center py-8">{t('guestPassTracker.loadingPasses')}</p>
            ) : filteredPasses.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Flame className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">{t('guestPassTracker.noPassesInCategory')}</p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href="/gift">{t('guestPassTracker.shareGuestPass')}</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredPasses.map((pass) => (
                <GuestPassRow
                  key={pass.id}
                  pass={pass}
                  onCopyLink={copyFollowUpLink}
                  onMarkConverted={markConverted}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GuestPassRow({
  pass,
  onCopyLink,
  onMarkConverted,
}: {
  pass: GuestPass;
  onCopyLink: (token: string) => void;
  onMarkConverted: (id: string) => void;
}) {
  const { t } = useTranslation();
  const isExpired = pass.expires_at && isPast(new Date(pass.expires_at));
  const isActive = pass.activated_at && !isExpired && pass.conversion_status !== "converted";
  const needsFollowUp = (isExpired || (pass.expires_at && differenceInDays(new Date(pass.expires_at), new Date()) <= 1)) && pass.conversion_status !== "converted";

  return (
    <Card className={`transition-all ${needsFollowUp ? "border-amber-500/40 bg-amber-500/5" : "border-border/50"}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          {/* Guest Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground truncate">
                {pass.guest_name || pass.recipient_email || t('guestPassTracker.unknownGuest')}
              </p>
              {getStatusBadge(pass, t)}
            </div>
            {pass.recipient_email && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {pass.recipient_email}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>{t('guestPassTracker.shared')} {formatDistanceToNow(new Date(pass.created_at), { addSuffix: true })}</span>
              {pass.activated_at && (
                <>
                  <span>•</span>
                  <span>{t('guestPassTracker.dayOfFive', { day: getDaysIntoPass(pass) })}</span>
                  <span>•</span>
                  <span>{t('guestPassTracker.missionsCount', { completed: pass.missions_completed || 0 })}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {needsFollowUp && pass.recipient_email && (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                onClick={() => {
                  const subject = encodeURIComponent("Your Phototheology experience");
                  const body = encodeURIComponent(`Hey${pass.guest_name ? ` ${pass.guest_name}` : ""}!\n\nI hope you enjoyed your 5-Day Lock-In Pass to PhototheologyOS! Your pass has ${isExpired ? "expired" : "almost expired"}.\n\nIf you'd like to continue, you can get started right away here:\n${window.location.origin}/pricing?skip_trial=true&ref=lockin_${pass.pass_token}\n\nThis link takes you straight to checkout — no extra trial period needed since you've already experienced PhototheologyOS.\n\nLet me know if you have any questions!`);

                  window.open(`mailto:${pass.recipient_email}?subject=${subject}&body=${body}`, "_blank");
                }}
              >
                <Mail className="h-3.5 w-3.5 mr-1" />
                {t('guestPassTracker.followUp')}
              </Button>
            )}

            {pass.conversion_status !== "converted" && pass.activated_at && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                onClick={() => onCopyLink(pass.pass_token)}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                {t('guestPassTracker.copyLink')}
              </Button>
            )}

            {pass.conversion_status !== "converted" && (isExpired || pass.activated_at) && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                onClick={() => onMarkConverted(pass.id)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {t('guestPassTracker.markConverted')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
