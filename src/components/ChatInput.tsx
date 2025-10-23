import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, placeholder = "Type a message... (emojis supported 😊)", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1 space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="resize-none"
        />
        <div className="flex justify-end">
          <EmojiPicker onEmojiSelect={(emoji) => setMessage(message + emoji)} />
        </div>
      </div>
      <Button 
        onClick={handleSend} 
        disabled={disabled || !message.trim()}
        size="icon"
        className="h-10 w-10 shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}