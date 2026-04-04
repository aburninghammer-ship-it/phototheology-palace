import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "icon" | "default";
  label?: string;
}

export function CopyButton({ text, className, variant = "ghost", size = "sm", label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard", {
        description: "Tip: Use 'Save to My Studies' to keep permanently",
      });
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard", {
        description: "Tip: Use 'Save to My Studies' to keep permanently",
      });
    }
  }, [text]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className={cn("gap-1", className)}
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {label !== undefined ? (
        <span>{copied ? "Copied" : label}</span>
      ) : size !== "icon" ? (
        <span>{copied ? "Copied" : "Copy"}</span>
      ) : null}
    </Button>
  );
}
