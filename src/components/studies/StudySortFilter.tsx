import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Clock, Star, BookOpen, SortAsc } from "lucide-react";

export type SortOption = "updated" | "created" | "title" | "favorites";

interface StudySortFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  favoriteCount: number;
}

const sortLabels: Record<SortOption, { label: string; icon: React.ReactNode }> = {
  updated: { label: "Last Updated", icon: <Clock className="w-4 h-4" /> },
  created: { label: "Date Created", icon: <BookOpen className="w-4 h-4" /> },
  title: { label: "Title A-Z", icon: <SortAsc className="w-4 h-4" /> },
  favorites: { label: "Favorites First", icon: <Star className="w-4 h-4" /> },
};

export function StudySortFilter({ 
  currentSort, 
  onSortChange, 
  totalCount, 
  favoriteCount 
}: StudySortFilterProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{totalCount} {totalCount === 1 ? "study" : "studies"}</span>
        {favoriteCount > 0 && (
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {favoriteCount} favorites
          </span>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort: {sortLabels[currentSort].label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(sortLabels).map(([key, { label, icon }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onSortChange(key as SortOption)}
              className={`gap-2 ${currentSort === key ? "bg-accent" : ""}`}
            >
              {icon}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
