import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Send, X, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, images?: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, placeholder = "Type a message... (emojis supported 😊)", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() || images.length > 0) {
      onSend(message, images);
      setMessage("");
      setImages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setImages((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1 space-y-2">
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap p-2 bg-muted/50 rounded-lg">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Pasted image ${idx + 1}`}
                  className="h-20 w-20 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="resize-none text-base py-3 px-4 rounded-xl"
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            Paste images with Ctrl+V
          </div>
          <EmojiPicker onEmojiSelect={(emoji) => setMessage(message + emoji)} />
        </div>
      </div>
      <Button 
        onClick={handleSend} 
        disabled={disabled || (!message.trim() && images.length === 0)}
        size="icon"
        className="h-12 w-12 shrink-0 rounded-xl"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}