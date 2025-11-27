import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Calendar, 
  Trash2, 
  Edit, 
  BookOpen, 
  FileText, 
  Flame,
  ScrollText,
  Building2,
  Clock
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface StudyPreviewCardProps {
  study: Study;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  variant?: "default" | "featured";
}

// Detect study type from content
const detectStudyType = (content: string, title: string): { type: string; icon: React.ReactNode; color: string } => {
  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerContent.includes("verse analysis") || lowerTitle.includes("verse")) {
    return { type: "Verse Study", icon: <BookOpen className="w-4 h-4" />, color: "text-blue-500 bg-blue-500/10" };
  }
  if (lowerContent.includes("chapter study") || lowerTitle.includes("chapter")) {
    return { type: "Chapter Study", icon: <FileText className="w-4 h-4" />, color: "text-purple-500 bg-purple-500/10" };
  }
  if (lowerContent.includes("theme study") || lowerTitle.includes("theme")) {
    return { type: "Theme Study", icon: <Flame className="w-4 h-4" />, color: "text-amber-500 bg-amber-500/10" };
  }
  if (lowerContent.includes("prophecy") || lowerTitle.includes("prophecy")) {
    return { type: "Prophecy", icon: <ScrollText className="w-4 h-4" />, color: "text-red-500 bg-red-500/10" };
  }
  return { type: "Study", icon: <Building2 className="w-4 h-4" />, color: "text-primary bg-primary/10" };
};

// Extract Palace Rooms mentioned in content
const detectPalaceRooms = (content: string): string[] => {
  const rooms: string[] = [];
  const roomPatterns = [
    { pattern: /\b(story room|SR)\b/i, name: "Story" },
    { pattern: /\b(imagination room|IR)\b/i, name: "Imagination" },
    { pattern: /\b(24fps|24FPS)\b/i, name: "24FPS" },
    { pattern: /\b(observation|OR)\b/i, name: "Observation" },
    { pattern: /\b(def-com|DC)\b/i, name: "Def-Com" },
    { pattern: /\b(symbols?\/types?|ST)\b/i, name: "Symbols" },
    { pattern: /\b(concentration|CR)\b/i, name: "Concentration" },
    { pattern: /\b(dimensions?|DR|5D)\b/i, name: "Dimensions" },
    { pattern: /\b(connect.?6|C6)\b/i, name: "Connect-6" },
    { pattern: /\b(typology)\b/i, name: "Typology" },
    { pattern: /\b(patterns?|PRm)\b/i, name: "Patterns" },
    { pattern: /\b(parallels?|P‖)\b/i, name: "Parallels" },
    { pattern: /\b(sanctuary|blue room|BL)\b/i, name: "Sanctuary" },
    { pattern: /\b(prophecy room|PR)\b/i, name: "Prophecy" },
    { pattern: /\b(three angels|3A)\b/i, name: "3 Angels" },
  ];
  
  roomPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(content) && !rooms.includes(name)) {
      rooms.push(name);
    }
  });
  
  return rooms.slice(0, 4); // Limit to 4 rooms
};

// Extract verse references from content
const extractVerseReferences = (content: string): string[] => {
  const versePattern = /\b([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?\b/g;
  const matches = content.match(versePattern) || [];
  return [...new Set(matches)].slice(0, 3);
};

export function StudyPreviewCard({ 
  study, 
  onToggleFavorite, 
  onDelete, 
  onEdit,
  variant = "default"
}: StudyPreviewCardProps) {
  const contentPreview = study.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/#+\s/g, "") // Remove markdown headers
    .replace(/\*\*/g, "") // Remove bold markers
    .replace(/\[.*?\]/g, "") // Remove placeholder brackets
    .trim()
    .slice(0, variant === "featured" ? 200 : 120);

  const studyType = detectStudyType(study.content, study.title);
  const palaceRooms = detectPalaceRooms(study.content);
  const verseRefs = extractVerseReferences(study.content);

  if (variant === "featured") {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/30 hover:shadow-xl transition-all cursor-pointer group">
        <CardHeader onClick={() => onEdit(study.id)} className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${studyType.color} border-0 gap-1`}>
                  {studyType.icon}
                  {studyType.type}
                </Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(study.updated_at), { addSuffix: true })}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {study.title}
              </CardTitle>
              <CardDescription className="text-sm">
                Created {format(new Date(study.created_at), "MMM d, yyyy")}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(study.id, study.is_favorite);
              }}
              className="shrink-0"
            >
              <Star
                className={`w-5 h-5 ${
                  study.is_favorite ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent onClick={() => onEdit(study.id)}>
          {contentPreview && (
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {contentPreview}...
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {verseRefs.map((ref) => (
              <Badge key={ref} variant="secondary" className="text-xs">
                📖 {ref}
              </Badge>
            ))}
            {palaceRooms.map((room) => (
              <Badge key={room} variant="outline" className="text-xs">
                🏛️ {room}
              </Badge>
            ))}
          </div>

          {study.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {study.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} className="bg-primary/10 text-primary border-0 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(study.id);
              }}
              className="gap-2 flex-1"
            >
              <Edit className="w-4 h-4" />
              Continue Study
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(study.id);
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
      <CardHeader onClick={() => onEdit(study.id)} className="pb-2 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1.5 rounded ${studyType.color}`}>
                {studyType.icon}
              </span>
              <span className="text-xs text-muted-foreground">{studyType.type}</span>
            </div>
            <CardTitle className="text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {study.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(study.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(study.id, study.is_favorite);
            }}
            className="shrink-0 -mr-2 -mt-2"
          >
            <Star
              className={`w-4 h-4 ${
                study.is_favorite ? "fill-amber-500 text-amber-500" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent onClick={() => onEdit(study.id)} className="flex-1 flex flex-col">
        {contentPreview && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {contentPreview}...
          </p>
        )}
        
        {/* Verse refs and Palace rooms */}
        {(verseRefs.length > 0 || palaceRooms.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {verseRefs.slice(0, 2).map((ref) => (
              <Badge key={ref} variant="secondary" className="text-xs py-0">
                {ref}
              </Badge>
            ))}
            {palaceRooms.slice(0, 2).map((room) => (
              <Badge key={room} variant="outline" className="text-xs py-0">
                {room}
              </Badge>
            ))}
          </div>
        )}
        
        {study.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {study.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} className="bg-primary/10 text-primary border-0 text-xs py-0">
                {tag}
              </Badge>
            ))}
            {study.tags.length > 2 && (
              <Badge variant="outline" className="text-xs py-0">
                +{study.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t mt-auto gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(study.id);
            }}
            className="gap-1.5 text-xs h-8"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(study.id);
            }}
            className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
