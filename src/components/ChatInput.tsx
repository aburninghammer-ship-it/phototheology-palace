import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Send, X, Image as ImageIcon, Camera } from "lucide-react";
import { MentionAutocomplete } from "@/components/MentionAutocomplete";

interface ChatInputProps {
  onSend: (message: string, images?: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  externalMessage?: string;
  onExternalMessageChange?: (msg: string) => void;
  externalImages?: string[];
  onExternalImagesChange?: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ChatInput({ onSend, placeholder = "Type a message... (emojis supported 😊)", disabled = false, externalMessage, onExternalMessageChange, externalImages, onExternalImagesChange }: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const [internalImages, setInternalImages] = useState<string[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionVisible, setMentionVisible] = useState(false);
  const [mentionStart, setMentionStart] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const message = externalMessage !== undefined ? externalMessage : internalMessage;
  const setMessage = onExternalMessageChange || setInternalMessage;
  const images = externalImages !== undefined ? externalImages : internalImages;
  const setImages = onExternalImagesChange || setInternalImages;

  const handleSend = () => {
    if (message.trim() || images.length > 0) {
      onSend(message, images);
      setMessage("");
      setImages([]);
      setMentionVisible(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);

    const cursorPos = e.target.selectionStart || 0;
    // Check if we're in a mention context
    const textBefore = val.slice(0, cursorPos);
    const atIndex = textBefore.lastIndexOf('@');

    if (atIndex >= 0) {
      const charBefore = atIndex > 0 ? textBefore[atIndex - 1] : ' ';
      const query = textBefore.slice(atIndex + 1);
      // Only trigger if @ is at start or preceded by whitespace, and no space-then-space in query
      if ((charBefore === ' ' || charBefore === '\n' || atIndex === 0) && !query.includes('\n') && query.length <= 30) {
        setMentionQuery(query);
        setMentionStart(atIndex);
        setMentionVisible(query.length > 0);
        return;
      }
    }
    setMentionVisible(false);
  };

  const handleMentionSelect = useCallback((user: { display_name: string }) => {
    const before = message.slice(0, mentionStart);
    const cursorPos = textareaRef.current?.selectionStart || message.length;
    const after = message.slice(cursorPos);
    const mention = `@${user.display_name} `;
    const newMsg = before + mention + after;
    setMessage(newMsg);
    setMentionVisible(false);

    // Restore focus
    setTimeout(() => {
      if (textareaRef.current) {
        const pos = before.length + mention.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  }, [message, mentionStart, setMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && mentionVisible) {
      setMentionVisible(false);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const maxImages = 4;
    const remaining = maxImages - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
    // Reset so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1 space-y-2 relative">
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
        <MentionAutocomplete
          query={mentionQuery}
          visible={mentionVisible}
          onSelect={handleMentionSelect}
        />
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="resize-none text-base py-3 px-4 rounded-xl"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            Paste or upload images · Type @ to mention
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || images.length >= 4}
              title="Upload image"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <EmojiPicker onEmojiSelect={(emoji) => setMessage(message + emoji)} />
          </div>
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
