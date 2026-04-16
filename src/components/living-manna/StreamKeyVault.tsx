import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { KeyRound, Plus, Trash2, Eye, EyeOff, Copy, Check, Shield } from "lucide-react";
import { toast } from "sonner";

interface StreamPlatform {
  id: string;
  platform_name: string;
  rtmp_url: string;
  stream_key: string;
  is_active: boolean;
  display_order: number;
}

interface StreamKeyVaultProps {
  churchId: string;
}

const PLATFORM_PRESETS: Record<string, { rtmp_url: string; color: string }> = {
  YouTube: { rtmp_url: "rtmp://a.rtmp.youtube.com/live2", color: "bg-red-500/10 text-red-600 border-red-500/30" },
  Facebook: { rtmp_url: "rtmps://live-api-s.facebook.com:443/rtmp/", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  Twitch: { rtmp_url: "rtmp://live.twitch.tv/app/", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  Custom: { rtmp_url: "", color: "bg-muted text-muted-foreground border-border" },
};

export function StreamKeyVault({ churchId }: StreamKeyVaultProps) {
  const [platforms, setPlatforms] = useState<StreamPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState({
    platform_name: "YouTube",
    rtmp_url: PLATFORM_PRESETS.YouTube.rtmp_url,
    stream_key: "",
  });

  useEffect(() => {
    loadPlatforms();
  }, [churchId]);

  const loadPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from("church_stream_platforms")
        .select("*")
        .eq("church_id", churchId)
        .order("display_order");

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error: any) {
      console.error("Error loading stream platforms:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPlatform = async () => {
    if (!newPlatform.stream_key) {
      toast.error("Please enter a stream key");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("church_stream_platforms")
        .insert({
          church_id: churchId,
          platform_name: newPlatform.platform_name,
          rtmp_url: newPlatform.rtmp_url,
          stream_key: newPlatform.stream_key,
          display_order: platforms.length,
        });

      if (error) throw error;
      toast.success(`${newPlatform.platform_name} added to vault`);
      setDialogOpen(false);
      setNewPlatform({ platform_name: "YouTube", rtmp_url: PLATFORM_PRESETS.YouTube.rtmp_url, stream_key: "" });
      loadPlatforms();
    } catch (error: any) {
      toast.error(error.message || "Failed to add platform");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("church_stream_platforms")
        .update({ is_active: !currentState })
        .eq("id", id);
      if (error) throw error;
      loadPlatforms();
    } catch (error: any) {
      toast.error("Failed to update platform");
    }
  };

  const deletePlatform = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("church_stream_platforms")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success(`${name} removed from vault`);
      loadPlatforms();
    } catch (error: any) {
      toast.error("Failed to remove platform");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePresetChange = (name: string) => {
    const preset = PLATFORM_PRESETS[name];
    setNewPlatform({
      platform_name: name,
      rtmp_url: preset?.rtmp_url || "",
      stream_key: "",
    });
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle>Stream Key Vault</CardTitle>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Platform
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Streaming Platform</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={newPlatform.platform_name}
                      onValueChange={handlePresetChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitch">Twitch</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>RTMP URL</Label>
                    <Input
                      value={newPlatform.rtmp_url}
                      onChange={(e) => setNewPlatform({ ...newPlatform, rtmp_url: e.target.value })}
                      placeholder="rtmp://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stream Key</Label>
                    <Input
                      type="password"
                      value={newPlatform.stream_key}
                      onChange={(e) => setNewPlatform({ ...newPlatform, stream_key: e.target.value })}
                      placeholder="Paste your stream key here"
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your platform's live streaming settings
                    </p>
                  </div>
                  <Button onClick={addPlatform} disabled={saving} className="w-full">
                    {saving ? "Adding..." : "Add to Vault"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Store RTMP keys securely. Copy them into OBS to stream to multiple platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {platforms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No streaming platforms configured. Add your first platform to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {platforms.map((platform) => {
                const preset = PLATFORM_PRESETS[platform.platform_name] || PLATFORM_PRESETS.Custom;
                const isVisible = visibleKeys[platform.id];
                return (
                  <div
                    key={platform.id}
                    className="border border-border/50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={preset.color}>
                          {platform.platform_name}
                        </Badge>
                        {!platform.is_active && (
                          <Badge variant="secondary" className="text-xs">Disabled</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={platform.is_active}
                          onCheckedChange={() => toggleActive(platform.id, platform.is_active)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deletePlatform(platform.id, platform.platform_name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground w-20 shrink-0">RTMP URL</Label>
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                          {platform.rtmp_url}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => copyToClipboard(platform.rtmp_url, `url-${platform.id}`)}
                        >
                          {copiedId === `url-${platform.id}` ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground w-20 shrink-0">Stream Key</Label>
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate font-mono">
                          {isVisible ? platform.stream_key : "••••••••••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => toggleKeyVisibility(platform.id)}
                        >
                          {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => copyToClipboard(platform.stream_key, `key-${platform.id}`)}
                        >
                          {copiedId === `key-${platform.id}` ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
