import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Tag } from "lucide-react";

interface CommunitySearchProps {
  onSearch: (query: string) => void;
  onTagFilter: (tags: string[]) => void;
  selectedTags: string[];
  availableTags: string[];
}

export const CommunitySearch = ({ 
  onSearch, 
  onTagFilter, 
  selectedTags, 
  availableTags 
}: CommunitySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTags, setShowTags] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagFilter(selectedTags.filter(t => t !== tag));
    } else {
      onTagFilter([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    setSearchQuery("");
    onSearch("");
    onTagFilter([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts and comments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showTags ? "default" : "outline"}
          size="icon"
          onClick={() => setShowTags(!showTags)}
        >
          <Tag className="h-4 w-4" />
        </Button>
        {(searchQuery || selectedTags.length > 0) && (
          <Button variant="ghost" size="icon" onClick={clearAll}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showTags && availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filtering by:</span>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              #{tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleTag(tag)} 
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
