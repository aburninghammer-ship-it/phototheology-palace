import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  FileType,
  Presentation,
  File,
  Star,
  StarOff,
  MoreVertical,
  Trash2,
  Eye,
  Tag,
  Edit,
  Calendar,
  HardDrive,
  ImageIcon,
  BookOpen
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SourceDocument } from "@/hooks/useSourceLibrary";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  source: SourceDocument;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (source: SourceDocument) => void;
  onGenerateInfographic?: (source: SourceDocument) => void;
  onCreateSeries?: (source: SourceDocument) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-10 w-10 text-red-500" />;
    case "docx":
      return <FileType className="h-10 w-10 text-blue-500" />;
    case "pptx":
      return <Presentation className="h-10 w-10 text-orange-500" />;
    case "txt":
      return <File className="h-10 w-10 text-gray-500" />;
    default:
      return <File className="h-10 w-10 text-gray-500" />;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
    case "docx":
      return "bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50";
    case "pptx":
      return "bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50";
    case "txt":
      return "bg-gray-100 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900/50";
    default:
      return "bg-gray-100 dark:bg-gray-950/30";
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export function SourceCard({
  source,
  onToggleFavorite,
  onDelete,
  onSelect,
  onGenerateInfographic,
  onCreateSeries,
  isSelected,
  selectable,
}: SourceCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(source);
    } else {
      setShowPreview(true);
    }
  };

  const previewText = source.extracted_text?.slice(0, 500) || "No text extracted";
  const wordCount = source.extracted_text?.split(/\s+/).length || 0;

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md",
          isSelected && "ring-2 ring-primary",
          selectable && "hover:ring-2 hover:ring-primary/50"
        )}
        onClick={handleClick}
      >
        {/* Favorite indicator */}
        {source.is_favorite && (
          <div className="absolute top-2 left-2 z-10">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}

        {/* File type header */}
        <div className={cn("p-4 flex items-center justify-center", getFileColor(source.document_type))}>
          {getFileIcon(source.document_type)}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate" title={source.title}>
                {source.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {source.document_type.toUpperCase()}
                </Badge>
                <span>{formatFileSize(source.file_size_bytes)}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(source.id); }}>
                  {source.is_favorite ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2" />
                      Remove Favorite
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </>
                  )}
                </DropdownMenuItem>
                {onGenerateInfographic && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onGenerateInfographic(source); }}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Infographic
                  </DropdownMenuItem>
                )}
                {onCreateSeries && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreateSeries(source); }}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create Study Series
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Preview snippet */}
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {previewText}...
          </p>

          {/* Tags */}
          {source.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {source.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {source.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{source.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(source.created_at), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon(source.document_type)}
              {source.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {formatFileSize(source.file_size_bytes)}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                ~{wordCount.toLocaleString()} words
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(source.created_at), { addSuffix: true })}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 p-4 bg-muted/50 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {source.extracted_text || "No text extracted from this document."}
            </pre>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {onGenerateInfographic && (
              <Button variant="outline" onClick={() => { setShowPreview(false); onGenerateInfographic(source); }}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Generate Infographic
              </Button>
            )}
            {onCreateSeries && (
              <Button variant="outline" onClick={() => { setShowPreview(false); onCreateSeries(source); }}>
                <BookOpen className="h-4 w-4 mr-2" />
                Create Study Series
              </Button>
            )}
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{source.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(source.id);
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
