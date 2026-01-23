import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Image, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BrandingData {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  banner_url: string;
  tagline: string;
  custom_css: string;
}

interface ChurchBrandingSettingsProps {
  churchId: string;
}

export function ChurchBrandingSettings({ churchId }: ChurchBrandingSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState<BrandingData>({
    primary_color: "#8B5CF6",
    secondary_color: "#3B82F6",
    accent_color: "#10B981",
    logo_url: "",
    banner_url: "",
    tagline: "",
    custom_css: "",
  });

  useEffect(() => {
    loadBranding();
  }, [churchId]);

  const loadBranding = async () => {
    try {
      const { data, error } = await supabase
        .from("church_branding")
        .select("*")
        .eq("church_id", churchId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setBranding({
          primary_color: data.primary_color || "#8B5CF6",
          secondary_color: data.secondary_color || "#3B82F6",
          accent_color: data.accent_color || "#10B981",
          logo_url: data.logo_url || "",
          banner_url: data.banner_url || "",
          tagline: data.tagline || "",
          custom_css: data.custom_css || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading branding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("church_branding")
        .upsert({
          church_id: churchId,
          ...branding,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast({
        title: "Branding saved",
        description: "Your church branding has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving branding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
    <div className="space-y-6">
      {/* Preview Banner */}
      <Card variant="glass" className="overflow-hidden">
        <div 
          className="h-24 flex items-center justify-center"
          style={{ 
            background: branding.banner_url 
              ? `url(${branding.banner_url}) center/cover` 
              : `linear-gradient(135deg, ${branding.primary_color}, ${branding.secondary_color})`
          }}
        >
          {branding.logo_url && (
            <img src={branding.logo_url} alt="Church Logo" className="h-16 object-contain" />
          )}
        </div>
        <CardContent className="text-center py-3">
          <p className="text-sm text-muted-foreground italic">
            {branding.tagline || "Your church tagline will appear here"}
          </p>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Brand Colors</CardTitle>
          </div>
          <CardDescription>Customize your church's color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  placeholder="#8B5CF6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.accent_color}
                  onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={branding.accent_color}
                  onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                  placeholder="#10B981"
                />
              </div>
            </div>
          </div>
          
          {/* Color Preview */}
          <div className="flex gap-2 pt-2">
            <div 
              className="w-full h-8 rounded-l-md" 
              style={{ backgroundColor: branding.primary_color }}
            />
            <div 
              className="w-full h-8" 
              style={{ backgroundColor: branding.secondary_color }}
            />
            <div 
              className="w-full h-8 rounded-r-md" 
              style={{ backgroundColor: branding.accent_color }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo & Banner */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            <CardTitle>Logo & Banner</CardTitle>
          </div>
          <CardDescription>Upload your church logo and banner images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={branding.logo_url}
              onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">Recommended: Square image, minimum 200x200px</p>
          </div>
          <div className="space-y-2">
            <Label>Banner URL</Label>
            <Input
              value={branding.banner_url}
              onChange={(e) => setBranding({ ...branding, banner_url: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            <p className="text-xs text-muted-foreground">Recommended: 1200x300px for best display</p>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={branding.tagline}
              onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
              placeholder="Your church's mission statement or tagline"
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Advanced: Custom CSS</CardTitle>
          <CardDescription>Add custom styling (for advanced users)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={branding.custom_css}
            onChange={(e) => setBranding({ ...branding, custom_css: e.target.value })}
            placeholder=".church-header { /* your styles */ }"
            rows={6}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={saveBranding} disabled={saving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Branding"}
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  );
}
