import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Heading1, Heading2, Quote } from "lucide-react";

interface TextFormatToolbarProps {
  onFormat: (format: string) => void;
}

export const TextFormatToolbar = ({ onFormat }: TextFormatToolbarProps) => {
  return (
    <div className="flex gap-1 p-2 border rounded-lg bg-background/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("**bold**")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("*italic*")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("# Heading 1")}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("## Heading 2")}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("• ")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("> ")}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </Button>
    </div>
  );
};
