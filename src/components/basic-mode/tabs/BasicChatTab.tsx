/**
 * BasicChatTab — ChatGPT-style Jeeves chat for Level 1 (Basic) mode
 * Teal/green themed to match Level 1 palette
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
  "Give me a breakdown of Joseph, the butler, and the baker",
  "What does the Sanctuary teach us about salvation?",
  "Who is the Lamb in Revelation 5?",
  "Trace the theme of 'three days' through the Bible",
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
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await callJeeves({
        mode: "basic-deep",
        message: text.trim(),
        conversationHistory: updatedMessages.slice(-20),
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
          <div className="flex flex-col items-center justify-center h-full px-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl mb-6" style={{ background: "hsl(170 25% 12%)" }}>
              <Sparkles className="h-8 w-8" style={{ color: "hsl(170 55% 50%)" }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "hsl(170 10% 93%)" }}>Ask Jeeves Anything</h2>
            <p className="text-sm text-center mb-8 max-w-md" style={{ color: "hsl(170 15% 48%)" }}>
              Your personal Bible study partner. Ask about any verse, story, doctrine, or question — and get deep, Christ-centered insight.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 rounded-xl text-sm transition-all"
                  style={{
                    border: "1px solid hsl(170 20% 20%)",
                    background: "hsl(170 22% 10%)",
                    color: "hsl(170 15% 60%)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}>
                {msg.role === "assistant" && (
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
                    style={{ background: "hsl(170 50% 40% / 0.2)" }}>
                    <Sparkles className="h-3.5 w-3.5" style={{ color: "hsl(170 55% 50%)" }} />
                  </div>
                )}
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                )}
                  style={{
                    background: msg.role === "user" ? "hsl(170 45% 35%)" : "hsl(170 20% 13%)",
                    color: msg.role === "user" ? "white" : "hsl(170 10% 85%)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>p]:my-2 [&>ul]:my-2 [&>ol]:my-2 [&>blockquote]:border-emerald-500/30 [&>blockquote]:text-emerald-100/80">
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
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
                  style={{ background: "hsl(170 50% 40% / 0.2)" }}>
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: "hsl(170 55% 50%)" }} />
                </div>
                <div className="rounded-2xl px-4 py-3" style={{ background: "hsl(170 20% 13%)" }}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]" style={{ background: "hsl(170 25% 35%)" }} />
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]" style={{ background: "hsl(170 25% 35%)" }} />
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]" style={{ background: "hsl(170 25% 35%)" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4" style={{ borderTop: "1px solid hsl(170 20% 15%)", background: "hsl(170 22% 8%)" }}>
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any Bible verse, story, or topic..."
            rows={1}
            className="w-full resize-none rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              background: "hsl(170 20% 12%)",
              border: "1px solid hsl(170 20% 20%)",
              color: "hsl(170 10% 90%)",
              padding: "0.75rem 3rem 0.75rem 1rem",
              minHeight: 44,
              maxHeight: 120,
            }}
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
            )}
            style={{
              background: input.trim() && !loading ? "hsl(170 55% 45%)" : "hsl(170 20% 18%)",
              color: input.trim() && !loading ? "white" : "hsl(170 15% 40%)",
              cursor: !input.trim() || loading ? "not-allowed" : "pointer",
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color: "hsl(170 15% 32%)" }}>
          Powered by deep theological analysis — Christ-centered, Scripture-grounded answers.
        </p>
      </div>
    </div>
  );
}
