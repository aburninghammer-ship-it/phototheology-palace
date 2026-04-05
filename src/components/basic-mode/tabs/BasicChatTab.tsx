/**
 * BasicChatTab — ChatGPT-style Jeeves chat for Level 1 (Basic) mode
 */
import { useState, useRef, useEffect } from "react";
import { callJeeves } from "@/lib/jeevesClient";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What does John 3:16 really mean?",
  "Explain the Sanctuary in simple terms",
  "Who is the Lamb in Revelation 5?",
  "How do I start studying the Bible daily?",
];

export default function BasicChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await callJeeves({
        mode: "general",
        message: text.trim(),
        experienceMode: "simple",
      }, "basic-mode-chat");

      const reply = error
        ? "I'm sorry, I couldn't process that right now. Please try again."
        : typeof data === "string"
          ? data
          : (data as any)?.response || (data as any)?.reply || "I'm here to help. Could you rephrase that?";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome / Empty State */
          <div className="flex flex-col items-center justify-center h-full px-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-[hsl(220,10%,15%)] mb-6">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ask Jeeves Anything</h2>
            <p className="text-sm text-[hsl(220,10%,50%)] text-center mb-8 max-w-md">
              Your personal Bible study assistant. Ask about any verse, topic, doctrine, or question — Jeeves uses the Phototheology method to give you deep, Christ-centered answers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 rounded-xl border border-[hsl(220,10%,20%)] bg-[hsl(220,13%,12%)] text-sm text-[hsl(220,10%,65%)] hover:bg-[hsl(220,10%,16%)] hover:text-white hover:border-[hsl(220,10%,30%)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}>
                {msg.role === "assistant" && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center mt-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-[hsl(220,50%,45%)] text-white"
                    : "bg-[hsl(220,10%,15%)] text-[hsl(220,10%,85%)]"
                )}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>p]:my-1.5 [&>ul]:my-2 [&>ol]:my-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center mt-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                </div>
                <div className="bg-[hsl(220,10%,15%)] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[hsl(220,10%,40%)] animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(220,10%,40%)] animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(220,10%,40%)] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-[hsl(220,10%,18%)] bg-[hsl(220,13%,10%)] p-4">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any Bible verse, topic, or question..."
            rows={1}
            className="w-full resize-none rounded-xl bg-[hsl(220,10%,15%)] border border-[hsl(220,10%,22%)] text-white placeholder:text-[hsl(220,10%,40%)] px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[hsl(220,10%,35%)] transition-colors"
            style={{ minHeight: 44, maxHeight: 120 }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className={cn(
              "absolute right-2 bottom-2 p-2 rounded-lg transition-colors",
              input.trim() && !loading
                ? "bg-white text-black hover:bg-white/90"
                : "bg-[hsl(220,10%,20%)] text-[hsl(220,10%,40%)] cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-[hsl(220,10%,35%)] mt-2">
          Jeeves uses Phototheology principles to provide Christ-centered, Scripture-grounded answers.
        </p>
      </div>
    </div>
  );
}
