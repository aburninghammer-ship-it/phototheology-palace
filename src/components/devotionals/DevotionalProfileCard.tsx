import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Send,
  Calendar,
  MessageSquare,
  Trash2,
  Edit,
  Share2,
  History,
  Sparkles,
  Link,
  Clock,
} from "lucide-react";
import { DevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { useDevotionalPlan, DevotionalDay } from "@/hooks/useDevotionals";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

interface DevotionalProfileCardProps {
  profile: DevotionalProfile;
  onSelect: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

const STRUGGLE_LABELS: Record<string, { label: string; emoji: string }> = {
  anxiety: { label: "Anxiety", emoji: "😰" },
  depression: { label: "Depression", emoji: "😢" },
  grief: { label: "Grief", emoji: "💔" },
  addiction: { label: "Addiction", emoji: "⛓️" },
  identity: { label: "Identity", emoji: "🪞" },
  fear: { label: "Fear", emoji: "😨" },
  loneliness: { label: "Loneliness", emoji: "🏝️" },
  anger: { label: "Anger", emoji: "😤" },
  doubt: { label: "Doubt", emoji: "❓" },
  purpose: { label: "Purpose", emoji: "🧭" },
  relationships: { label: "Relationships", emoji: "💬" },
  purity: { label: "Purity", emoji: "🕊️" },
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  child: "Child",
  spouse: "Spouse",
  friend: "Friend",
  student: "Student",
  team_member: "Team Member",
  mentee: "Mentee",
  parent: "Parent",
  sibling: "Sibling",
};

export function DevotionalProfileCard({
  profile,
  onSelect,
  onDelete,
  onEdit,
}: DevotionalProfileCardProps) {
  const { plan, days, completedDayIds } = useDevotionalPlan(profile.active_plan_id || "");

  const progress = plan && days
    ? Math.round((completedDayIds.size / days.length) * 100)
    : 0;

  const currentDay = days?.find((d) => !completedDayIds.has(d.id));

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
        !profile.is_active && "opacity-60"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3" onClick={onSelect}>
            <div className="text-4xl">{profile.avatar_emoji}</div>
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {RELATIONSHIP_LABELS[profile.relationship] || profile.relationship}
                {profile.linked_user_id && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSelect}>
                <History className="h-4 w-4 mr-2" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Devotional
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" onClick={onSelect}>
        {/* Struggles */}
        <div className="flex flex-wrap gap-1">
          {profile.struggles.slice(0, 3).map((struggle) => (
            <Badge key={struggle} variant="outline" className="text-xs">
              {STRUGGLE_LABELS[struggle]?.emoji}{" "}
              {STRUGGLE_LABELS[struggle]?.label || struggle}
            </Badge>
          ))}
          {profile.struggles.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.struggles.length - 3} more
            </Badge>
          )}
        </div>

        {/* Active Plan Progress */}
        {plan && days && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{plan.title}</span>
              <span className="text-muted-foreground">
                {completedDayIds.size}/{days.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {currentDay && (
              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Today: </span>
                  <span className="font-medium">Day {currentDay.day_number}</span>
                  <span className="text-muted-foreground"> - {currentDay.title}</span>
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  <Send className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Active Plan */}
        {!plan && (
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Sparkles className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">No active devotional plan</p>
            <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
              Generate Plan
            </Button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{profile.total_devotionals_sent} sent</span>
          </div>
          {profile.last_devotional_sent_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(profile.last_devotional_sent_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
