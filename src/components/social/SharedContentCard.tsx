import { Badge } from "@/components/ui/badge";
import { SHARE_SOURCE_CONFIG } from "@/types/sharedContent";
import type { SharedContent } from "@/types/sharedContent";

interface SharedContentCardProps {
  sharedContent: SharedContent;
}

export function SharedContentCard({ sharedContent }: SharedContentCardProps) {
  const config = SHARE_SOURCE_CONFIG[sharedContent.source_type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="border border-border/50 bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <Badge variant="outline" className={`text-[10px] ${config.badgeClass}`}>
          {config.label}
        </Badge>
      </div>
      <h5 className="font-medium text-sm">{sharedContent.source_title}</h5>
      <p className="text-xs text-muted-foreground line-clamp-3">{sharedContent.source_excerpt}</p>
      {sharedContent.verse_reference && (
        <p className="text-xs text-primary font-medium">{sharedContent.verse_reference}</p>
      )}
    </div>
  );
}
