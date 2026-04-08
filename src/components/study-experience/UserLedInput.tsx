import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface UserLedInputProps {
  roomName: string;
  principleName: string;
  userInput: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function UserLedInput({
  roomName,
  principleName,
  userInput,
  onChange,
  onSubmit,
  loading,
}: UserLedInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card/80 border border-blue-500/30 space-y-3"
    >
      <p className="text-sm font-medium">
        How does <span className="text-blue-400">{roomName}: {principleName}</span> illuminate this verse?
      </p>
      <Textarea
        value={userInput}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your connection here..."
        rows={3}
        className="bg-background/50 border-border/50 resize-none"
      />
      <Button
        onClick={onSubmit}
        disabled={!userInput.trim() || loading}
        size="sm"
        className="w-full"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {loading ? "Evaluating..." : "Submit Connection"}
      </Button>
    </motion.div>
  );
}
