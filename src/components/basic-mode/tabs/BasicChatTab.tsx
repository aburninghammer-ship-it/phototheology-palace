/**
 * BasicChatTab — ChatGPT-style Jeeves chat for Level 1 (Basic) mode
 * Offers PT-depth study options in plain language without naming rooms/floors.
 * Dynamic, colorful output with Level 3 design tokens.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { callJeeves } from "@/lib/jeevesClient";
import { Send, Sparkles, BookOpen, Eye, Layers, Link2, MapPin, Palette, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/** Study lenses — plain-language labels for hidden PT rooms */
const STUDY_LENSES = [
  { id: "5d", icon: Layers, label: "5 Perspectives", hint: "Literal, Christ, Personal, Church, Heavenly", color: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/30" },
  { id: "c6", icon: Link2, label: "6 Scripture Categories", hint: "Prophecy, Poetry, History, Gospels, Epistles, Parables", color: "from-purple-500 to-pink-500", borderColor: "border-purple-500/30" },
  { id: "christ", icon: Eye, label: "Find Christ Here", hint: "Typology, parallels, and fulfillment", color: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30" },
  { id: "timeline", icon: MapPin, label: "Place It in Time", hint: "Past, present, future — earth and heaven", color: "from-emerald-500 to-teal-500", borderColor: "border-emerald-500/30" },
  { id: "visual", icon: Palette, label: "Paint the Picture", hint: "An image you'll never forget", color: "from-rose-500 to-red-500", borderColor: "border-rose-500/30" },
  { id: "deep", icon: BookOpen, label: "Go All In", hint: "Everything — the full deep dive", color: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30" },
];

const ALL_SUGGESTIONS = [
  // Set A
  { text: "Break down Genesis 3:15", gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-400/30", glow: "shadow-blue-500/20", hoverGlow: "hover:shadow-blue-500/40" },
  { text: "How can I learn to find Christ in the Old Testament?", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-400/30", glow: "shadow-amber-500/20", hoverGlow: "hover:shadow-amber-500/40" },
  { text: "What principles can I use to study the Bible better?", gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-400/30", glow: "shadow-purple-500/20", hoverGlow: "hover:shadow-purple-500/40" },
  { text: "Analyze my thoughts on why David picked 5 stones", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-400/30", glow: "shadow-emerald-500/20", hoverGlow: "hover:shadow-emerald-500/40" },
  { text: "What does the Sanctuary teach about salvation?", gradient: "from-rose-500/20 to-red-500/20", border: "border-rose-400/30", glow: "shadow-rose-500/20", hoverGlow: "hover:shadow-rose-500/40" },
  { text: "Who is the Lamb in Revelation 5?", gradient: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-400/30", glow: "shadow-indigo-500/20", hoverGlow: "hover:shadow-indigo-500/40" },
  // Set B
  { text: "Trace the theme of 'three days' through the Bible", gradient: "from-teal-500/20 to-cyan-500/20", border: "border-teal-400/30", glow: "shadow-teal-500/20", hoverGlow: "hover:shadow-teal-500/40" },
  { text: "Show me how Psalm 23 connects to Jesus", gradient: "from-sky-500/20 to-blue-500/20", border: "border-sky-400/30", glow: "shadow-sky-500/20", hoverGlow: "hover:shadow-sky-500/40" },
  { text: "What makes Jeeves different from ChatGPT?", gradient: "from-violet-500/20 to-fuchsia-500/20", border: "border-violet-400/30", glow: "shadow-violet-500/20", hoverGlow: "hover:shadow-violet-500/40" },
  { text: "Why did God ask Abraham to sacrifice Isaac?", gradient: "from-orange-500/20 to-yellow-500/20", border: "border-orange-400/30", glow: "shadow-orange-500/20", hoverGlow: "hover:shadow-orange-500/40" },
  { text: "How does the number 40 repeat across Scripture?", gradient: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-400/30", glow: "shadow-cyan-500/20", hoverGlow: "hover:shadow-cyan-500/40" },
  { text: "What can nature teach me about God?", gradient: "from-lime-500/20 to-green-500/20", border: "border-lime-400/30", glow: "shadow-lime-500/20", hoverGlow: "hover:shadow-lime-500/40" },
];

/** Rotate suggestions — show 6 at a time, cycling based on the current day */
function getRotatedSuggestions() {
  const day = new Date().getDate();
  const setIndex = day % 2; // alternates daily
  const start = setIndex * 6;
  return ALL_SUGGESTIONS.slice(start, start + 6);
}


/** Maps plain-language lens IDs to hidden PT instructions for the AI */
function getLensInstruction(lensId: string, originalMessage: string): string {
  const instructions: Record<string, string> = {
    "5d": `The user wants a 5-Dimensions breakdown. Analyze "${originalMessage}" through ALL FIVE dimensions (Literal, Christ, Personal, Church, Heavenly) as clearly distinct sections. Use headers and emojis for each. Do NOT name the Dimensions Room — just present the five perspectives naturally as "Literal Meaning", "The Christ Connection", "What This Means For You", "What This Means For The Church", and "The Heavenly Reality".`,
    "c6": `The user wants to see how this connects across 6 genres. Show how "${originalMessage}" connects to Prophecy, Poetry, History, Gospels, Epistles, and Parables — with specific verse references from each genre. Present these as "six categories of Scripture" naturally, not as "Connect 6 Room". Use emojis and distinct sections.`,
    "christ": `The user wants to find Christ. Run "${originalMessage}" through intensive Christ-centered analysis: typology, sanctuary parallels, prophetic fulfillment, symbols pointing to Jesus. Show deep typological connections. Use the Concentration Room engine internally but NEVER name it.`,
    "timeline": `The user wants temporal placement. Show where "${originalMessage}" sits in redemptive history — past fulfillment, present application, future completion. Show both the earthly and heavenly dimensions of time. Use the Time Zone Room engine internally but NEVER name it.`,
    "visual": `The user wants a memorable visual. Create a vivid, unforgettable mental image for "${originalMessage}" — like a movie frame they can recall instantly. Draw on the 24FPS and Imagination Room concepts but NEVER name them. Make it immersive and cinematic.`,
    "deep": `The user wants the FULL deep dive. Run "${originalMessage}" through ALL 8 floors of analysis exhaustively. Give 5 Dimensions, Christ connections, cross-references, sanctuary parallels, prophetic significance, patterns, emotional weight, and practical application. This should be your most comprehensive answer possible — 10+ paragraphs with extensive KJV quotations.`,
  };
  return instructions[lensId] || `Analyze "${originalMessage}" with maximum depth.`;
}

export default function BasicChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestion]);

  /** Detect if the user's message looks like a Bible study question (verse reference, doctrine, etc.) */
  const isBibleStudyQuestion = useCallback((text: string): boolean => {
    const biblePatterns = [
      /\b(genesis|exodus|leviticus|numbers|deuteronomy|joshua|judges|ruth|samuel|kings|chronicles|ezra|nehemiah|esther|job|psalm|proverbs|ecclesiastes|song|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi|matthew|mark|luke|john|acts|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|revelation)\b/i,
      /\b\d+:\d+/,
      /\b(break\s*down|explain|analyze|study|teach|what\s+does|what\s+is|who\s+is|where|why|how|trace|connect|meaning\s+of|significance)\b/i,
      /\b(sanctuary|sabbath|prophecy|covenant|salvation|baptism|commandment|gospel|parable|miracle|creation|flood|exodus|temple|priest|sacrifice|lamb|cross|resurrection|rapture|second\s+coming|tribulation|millennium|judgment|heaven|hell|seal|trumpet|angel|beast|dragon|mark\s+of)\b/i,
    ];
    return biblePatterns.some((p) => p.test(text));
  }, []);

  const sendMessage = async (text: string, lensOverride?: string) => {
    if (!text.trim() || loading) return;

    // If this is a Bible study question and no lens selected, show the menu
    if (!lensOverride && isBibleStudyQuestion(text) && !pendingQuestion) {
      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setPendingQuestion(text.trim());
      return;
    }

    const actualQuestion = lensOverride ? (pendingQuestion || text) : text;
    const userMsg: Message = { role: "user", content: actualQuestion.trim() };
    
    // Only add user message if not already added (from pendingQuestion flow)
    const updatedMessages = pendingQuestion
      ? [...messages]  // user message already in messages
      : [...messages, userMsg];
    
    if (!pendingQuestion) {
      setMessages(updatedMessages);
    }
    
    setInput("");
    setPendingQuestion(null);
    setLoading(true);

    try {
      // Build the final message with lens instructions
      const finalMessage = lensOverride
        ? getLensInstruction(lensOverride, actualQuestion)
        : actualQuestion;

      const { data, error } = await callJeeves({
        mode: "basic-deep",
        message: finalMessage,
        conversationHistory: updatedMessages.slice(-20),
        experienceMode: "simple",
      }, "basic-mode-chat");

      const reply = error
        ? "I'm sorry, I couldn't process that right now. Please try again."
        : typeof data === "string"
          ? data
          : (data as any)?.response || (data as any)?.reply || "I'm here to help. Could you rephrase that?";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLensSelect = (lensId: string) => {
    if (pendingQuestion) {
      sendMessage(pendingQuestion, lensId);
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
        {messages.length === 0 && !pendingQuestion ? (
          <div className="flex flex-col items-center justify-center h-full px-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Ask Jeeves Anything</h2>
            <p className="text-sm text-center mb-2 max-w-md text-muted-foreground">
              Your personal Bible study partner. Ask about any verse, story, doctrine, or question — and get deep, Christ-centered insight.
            </p>
            <p className="text-xs text-center mb-8 max-w-md text-muted-foreground/70 italic leading-relaxed">
              Other AIs search a Bible. Jeeves <span className="text-primary font-medium not-italic">thinks</span> through one — running every answer through a proprietary engine of <span className="text-primary font-medium not-italic">38 interconnected study principles</span> that trace patterns, symbols, prophecy, sanctuary design, and Christ across all 66 books. That's why Jeeves will never answer the same question the same way twice — and why no other AI can replicate what happens here.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {getRotatedSuggestions().map((s) => (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className={cn(
                    "text-left p-4 rounded-xl text-sm transition-all duration-300 border backdrop-blur-md",
                    "bg-gradient-to-br", s.gradient, s.border, s.glow, s.hoverGlow,
                    "shadow-lg hover:shadow-xl hover:scale-[1.03] hover:text-foreground text-muted-foreground"
                  )}
                >
                  {s.text}
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
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 bg-primary/15">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 border border-primary/30"
                    : "backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-primary/10 border border-primary/20 shadow-[0_0_25px_-5px] shadow-primary/15 text-foreground ring-1 ring-primary/10"
                )}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none 
                      [&>p]:my-2 [&>ul]:my-2 [&>ol]:my-2 
                      [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-primary [&>h1]:mb-3
                      [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mb-2
                      [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-secondary [&>h3]:mb-1
                      [&>h4]:text-accent [&>h5]:text-emerald-400
                      [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:text-muted-foreground [&>blockquote]:bg-primary/5 [&>blockquote]:rounded-r-lg [&>blockquote]:px-4 [&>blockquote]:py-2 [&>blockquote]:my-3 [&>blockquote]:italic
                      [&>hr]:border-primary/20 [&>hr]:my-4
                      [&_strong]:text-primary [&_strong]:font-semibold
                      [&_em]:text-secondary/90
                      [&>ul>li]:marker:text-primary [&>ol>li]:marker:text-primary
                      [&>ul]:space-y-1 [&>ol]:space-y-1
                    ">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Study Lens Menu — shown when Jeeves detects a Bible study question */}
            {pendingQuestion && !loading && (
              <div className="flex gap-3 justify-start">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 bg-primary/15">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="max-w-[90%] space-y-3">
                  <div className="rounded-2xl px-4 py-3 bg-card border border-border text-foreground text-sm">
                    Great question! How would you like me to approach this?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STUDY_LENSES.map((lens) => {
                      const Icon = lens.icon;
                      return (
                        <button
                          key={lens.id}
                          onClick={() => handleLensSelect(lens.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                            "bg-card border hover:scale-[1.02] hover:shadow-lg group",
                            lens.borderColor
                          )}
                        >
                          <div className={cn(
                            "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br text-white",
                            lens.color
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground flex items-center gap-1">
                              {lens.label}
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{lens.hint}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setPendingQuestion(null);
                      sendMessage(pendingQuestion!, "deep");
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Or just give me the full answer →
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 bg-primary/15">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-card border border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms] bg-primary/40" />
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms] bg-secondary/40" />
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms] bg-accent/40" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-primary/15 backdrop-blur-xl bg-gradient-to-r from-card/80 via-card/60 to-primary/5 shadow-[0_-4px_20px_-5px] shadow-primary/10">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any Bible verse, story, or topic..."
            rows={1}
            className="w-full resize-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all backdrop-blur-md bg-background/70 border border-primary/20 text-foreground placeholder:text-muted-foreground shadow-inner shadow-primary/5"
            style={{
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
              input.trim() && !loading
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[10px] mt-2 text-muted-foreground/50">
          Powered by deep theological analysis — Christ-centered, Scripture-grounded answers.
        </p>
      </div>
    </div>
  );
}
