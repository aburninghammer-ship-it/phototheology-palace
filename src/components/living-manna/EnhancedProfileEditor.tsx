import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Camera, Save, Plus, X, Globe, Twitter, Linkedin, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  display_name: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
  cover_photo_url: string;
  ministry_tags: string[];
  interests: string[];
  social_links: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  is_profile_public: boolean;
}

export function EnhancedProfileEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    display_name: "",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
    cover_photo_url: "",
    ministry_tags: [],
    interests: [],
    social_links: {},
    is_profile_public: true,
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, location, website, avatar_url, cover_photo_url, ministry_tags, interests, social_links, is_profile_public")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          display_name: data.display_name || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          avatar_url: data.avatar_url || "",
          cover_photo_url: data.cover_photo_url || "",
          ministry_tags: data.ministry_tags || [],
          interests: data.interests || [],
          social_links: (data.social_links as any) || {},
          is_profile_public: data.is_profile_public ?? true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          cover_photo_url: profile.cover_photo_url,
          ministry_tags: profile.ministry_tags,
          interests: profile.interests,
          social_links: profile.social_links,
          is_profile_public: profile.is_profile_public,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag && !profile.ministry_tags.includes(newTag)) {
      setProfile({ ...profile, ministry_tags: [...profile.ministry_tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setProfile({ ...profile, ministry_tags: profile.ministry_tags.filter((t) => t !== tag) });
  };

  const addInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest] });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter((i) => i !== interest) });
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
      {/* Cover Photo & Avatar */}
      <Card variant="glass">
        <div 
          className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg relative"
          style={profile.cover_photo_url ? { backgroundImage: `url(${profile.cover_photo_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-2 right-2"
            onClick={() => {/* TODO: Implement cover upload */}}
          >
            <Camera className="h-4 w-4 mr-1" />
            Change Cover
          </Button>
        </div>
        <CardContent className="pt-0">
          <div className="flex items-end gap-4 -mt-10">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h2 className="text-xl font-bold">{profile.display_name || "Your Name"}</h2>
              <p className="text-sm text-muted-foreground">{profile.location || "Add your location"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell others about yourself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell others about yourself, your faith journey, or ministry involvement..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ministry Tags */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Ministry Tags</CardTitle>
          <CardDescription>What areas of ministry are you involved in?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.ministry_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a ministry tag (e.g., Youth, Worship, Outreach)"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Interests</CardTitle>
          <CardDescription>What topics interest you?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="outline" className="gap-1">
                {interest}
                <button onClick={() => removeInterest(interest)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest (e.g., Prophecy, Apologetics, Family)"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
            />
            <Button variant="outline" onClick={addInterest}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.social_links.twitter || ""}
              onChange={(e) => setProfile({ ...profile, social_links: { ...profile.social_links, twitter: e.target.value } })}
              placeholder="Twitter username"
            />
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.social_links.instagram || ""}
              onChange={(e) => setProfile({ ...profile, social_links: { ...profile.social_links, instagram: e.target.value } })}
              placeholder="Instagram username"
            />
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.social_links.linkedin || ""}
              onChange={(e) => setProfile({ ...profile, social_links: { ...profile.social_links, linkedin: e.target.value } })}
              placeholder="LinkedIn profile URL"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow other church members to see your profile</p>
            </div>
            <Switch
              checked={profile.is_profile_public}
              onCheckedChange={(checked) => setProfile({ ...profile, is_profile_public: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={saveProfile} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
