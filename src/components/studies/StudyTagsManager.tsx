import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Tag, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StudyTagsManagerProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
  onClearFilters: () => void;
}

export function StudyTagsManager({
  allTags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onClearFilters,
}: StudyTagsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tagColors: Record<string, string> = {
    prophecy: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
    typology: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
    character: "bg-green-500/20 text-green-400 hover:bg-green-500/30",
    parable: "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
    sanctuary: "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30",
    gospel: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
    devotional: "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30",
    sermon: "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30",
  };

  const getTagColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    for (const [key, value] of Object.entries(tagColors)) {
      if (lowerTag.includes(key)) return value;
    }
    return "bg-muted text-muted-foreground hover:bg-muted/80";
  };

  if (allTags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter by Tag
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Tags</h4>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-auto py-1 px-2 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                        : ""
                    } ${getTagColor(tag)}`}
                    onClick={() =>
                      isSelected ? onTagDeselect(tag) : onTagSelect(tag)
                    }
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Show selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`cursor-pointer ${getTagColor(tag)}`}
              onClick={() => onTagDeselect(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
