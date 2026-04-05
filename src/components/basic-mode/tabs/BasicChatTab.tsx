/**
 * BasicChatTab — ChatGPT-style Jeeves chat for Level 1 (Basic) mode
 * Offers PT-depth study options in plain language without naming rooms/floors.
 * Dynamic, colorful output with Level 3 design tokens.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { callJeeves } from "@/lib/jeevesClient";
import { supabase } from "@/integrations/supabase/client";
import { Send, Sparkles, BookOpen, Eye, Layers, Link2, MapPin, Palette, ChevronRight, Search, Shield, Repeat, Compass, Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { SaveChatResponseDialog } from "../SaveChatResponseDialog";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/** Study lenses — plain-language labels for hidden PT rooms */
const STUDY_LENSES_A = [
  { id: "5d", icon: Layers, label: "5 Perspectives", hint: "Literal, Christ, Personal, Church, Heavenly", color: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/30" },
  { id: "c6", icon: Link2, label: "6 Scripture Categories", hint: "Prophecy, Poetry, History, Gospels, Epistles, Parables", color: "from-purple-500 to-pink-500", borderColor: "border-purple-500/30" },
  { id: "christ", icon: Eye, label: "Find Christ Here", hint: "Typology, parallels, and fulfillment", color: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30" },
  { id: "timeline", icon: MapPin, label: "Place It in Time", hint: "Past, present, future — earth and heaven", color: "from-emerald-500 to-teal-500", borderColor: "border-emerald-500/30" },
  { id: "visual", icon: Palette, label: "Paint the Picture", hint: "An image you'll never forget", color: "from-rose-500 to-red-500", borderColor: "border-rose-500/30" },
  { id: "deep", icon: BookOpen, label: "Go All In", hint: "Everything — the full deep dive", color: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30" },
];

const STUDY_LENSES_B = [
  { id: "detective", icon: Search, label: "Be the Detective", hint: "30+ observations before interpreting", color: "from-sky-500 to-blue-500", borderColor: "border-sky-500/30" },
  { id: "sanctuary", icon: Shield, label: "The Blueprint", hint: "Trace it through the Sanctuary design", color: "from-cyan-500 to-teal-500", borderColor: "border-cyan-500/30" },
  { id: "patterns", icon: Repeat, label: "Spot the Pattern", hint: "Recurring motifs — 3s, 7s, 40s, deliverers", color: "from-fuchsia-500 to-purple-500", borderColor: "border-fuchsia-500/30" },
  { id: "freestyle", icon: Compass, label: "Connect It to Life", hint: "Nature, experience, history — see it everywhere", color: "from-lime-500 to-green-500", borderColor: "border-lime-500/30" },
  { id: "fruit", icon: Heart, label: "The Heart Test", hint: "Does this grow love, joy, peace, patience?", color: "from-pink-500 to-rose-500", borderColor: "border-pink-500/30" },
  { id: "deep", icon: BookOpen, label: "Go All In", hint: "Everything — the full deep dive", color: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30" },
];

/** Rotate lenses — alternate sets based on the hour */
function getRotatedLenses() {
  const hour = new Date().getHours();
  return hour % 2 === 0 ? STUDY_LENSES_A : STUDY_LENSES_B;
}


const GRADIENT_STYLES = [
  { gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-400/30", glow: "shadow-blue-500/20", hoverGlow: "hover:shadow-blue-500/40" },
  { gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-400/30", glow: "shadow-amber-500/20", hoverGlow: "hover:shadow-amber-500/40" },
  { gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-400/30", glow: "shadow-purple-500/20", hoverGlow: "hover:shadow-purple-500/40" },
  { gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-400/30", glow: "shadow-emerald-500/20", hoverGlow: "hover:shadow-emerald-500/40" },
  { gradient: "from-rose-500/20 to-red-500/20", border: "border-rose-400/30", glow: "shadow-rose-500/20", hoverGlow: "hover:shadow-rose-500/40" },
  { gradient: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-400/30", glow: "shadow-indigo-500/20", hoverGlow: "hover:shadow-indigo-500/40" },
];

const FALLBACK_SUGGESTIONS = [
  "Break down Genesis 3:15",
  "How can I learn to find Christ in the Old Testament?",
  "What principles can I use to study the Bible better?",
  "Analyze my thoughts on why David picked 5 stones",
  "What does the Sanctuary teach about salvation?",
  "Who is the Lamb in Revelation 5?",
];


/** Maps plain-language lens IDs to hidden PT instructions for the AI */
function getLensInstruction(lensId: string, originalMessage: string): string {
  const instructions: Record<string, string> = {
    "5d": `The user wants a 5-Dimensions breakdown. Analyze "${originalMessage}" through ALL FIVE dimensions (Literal, Christ, Personal, Church, Heavenly) as clearly distinct sections. Use headers and emojis for each. Do NOT name the Dimensions Room — just present the five perspectives naturally as "Literal Meaning", "The Christ Connection", "What This Means For You", "What This Means For The Church", and "The Heavenly Reality".`,
    "c6": `The user wants to see how this connects across 6 genres. Show how "${originalMessage}" connects to Prophecy, Poetry, History, Gospels, Epistles, and Parables — with specific verse references from each genre. Present these as "six categories of Scripture" naturally, not as "Connect 6 Room". Use emojis and distinct sections.`,
    "christ": `The user wants to find Christ. Run "${originalMessage}" through intensive Christ-centered analysis: typology, sanctuary parallels, prophetic fulfillment, symbols pointing to Jesus. Show deep typological connections. Use the Concentration Room engine internally but NEVER name it.`,
    "timeline": `The user wants temporal placement. Show where "${originalMessage}" sits in redemptive history — past fulfillment, present application, future completion. Show both the earthly and heavenly dimensions of time. Use the Time Zone Room engine internally but NEVER name it.`,
    "visual": `The user wants a memorable visual. Create a vivid, unforgettable mental image for "${originalMessage}" — like a movie frame they can recall instantly. Draw on the 24FPS and Imagination Room concepts but NEVER name them. Make it immersive and cinematic.`,
    "deep": `The user wants the FULL deep dive. Run "${originalMessage}" through ALL 8 floors of analysis exhaustively. Give 5 Dimensions, Christ connections, cross-references, sanctuary parallels, prophetic significance, patterns, emotional weight, and practical application. This should be your most comprehensive answer possible — 10+ paragraphs with extensive KJV quotations.`,
    "detective": `The user wants the detective approach. For "${originalMessage}", log 30+ raw observations first — fingerprints, footprints, details that casual readers miss. Then note word definitions (Greek/Hebrew where relevant), cultural context, and structural details. Present it as an investigation — clues first, theory second. Use the Observation and Def-Com Room engines internally but NEVER name them.`,
    "sanctuary": `The user wants the Sanctuary blueprint lens. Show how "${originalMessage}" maps onto the sanctuary furniture and services — altar, laver, lampstand, showbread, incense, ark, veil, gate. Trace the passage through the sanctuary as a map of salvation. Use the Blue Room engine internally but NEVER name it.`,
    "patterns": `The user wants to spot recurring patterns. For "${originalMessage}", identify biblical patterns: recurring numbers (3, 7, 12, 40), repeated story structures (deliverer stories, fall-covenant-sanctuary-enemy-restoration), and motifs that echo across Scripture. Show how history rhymes. Use the Patterns Room engine internally but NEVER name it.`,
    "freestyle": `The user wants real-life connections. For "${originalMessage}", connect it to nature, personal experience, history, and culture. Show how this truth appears in everyday life — sunrise, storms, seasons, work, relationships, current events. Make the Bible feel alive outside the page. Use the Freestyle Floor engine internally but NEVER name it.`,
    "fruit": `The user wants the heart test. For "${originalMessage}", examine: What character does this passage cultivate? Does it produce love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control? How does this text transform the reader's heart and life? What practical change should it inspire? Use the Fruit Room engine internally but NEVER name it.`,
  };
  return instructions[lensId] || `Analyze "${originalMessage}" with maximum depth.`;
}

export default function BasicChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [dailySuggestions, setDailySuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS);
  const [saveDialog, setSaveDialog] = useState<{ open: boolean; msgIndex: number | null }>({ open: false, msgIndex: null });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch today's AI-generated sample questions
  useEffect(() => {
    const fetchDailyQuestions = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("generated_sample_questions")
          .select("questions")
          .eq("generation_date", today)
          .maybeSingle();
        
        if (!error && data?.questions && Array.isArray(data.questions) && data.questions.length === 6) {
          const texts = data.questions.map((q: any) => 
            q.emoji ? `${q.emoji} ${q.text}` : q.text
          );
          setDailySuggestions(texts);
        }
      } catch {
        // silently fall back to static suggestions
      }
    };
    fetchDailyQuestions();
  }, []);

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
          <div className="flex flex-col items-center px-3 sm:px-6 max-w-2xl mx-auto py-3 sm:py-6">
            <div className="p-2.5 sm:p-4 rounded-2xl mb-2 sm:mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 text-foreground">Ask Jeeves Anything</h2>
            <p className="text-[11px] sm:text-sm text-center mb-1 sm:mb-2 max-w-md text-muted-foreground">
              Your personal Bible study partner — deep, Christ-centered insight.
            </p>
            <p className="text-[9px] sm:text-xs text-center mb-3 sm:mb-8 max-w-md text-muted-foreground/70 italic leading-relaxed hidden sm:block">
              Other AIs search a Bible. Jeeves <span className="text-primary font-medium not-italic">thinks</span> through one — running every answer through a proprietary engine of <span className="text-primary font-medium not-italic">38 interconnected study principles</span> that trace patterns, symbols, prophecy, sanctuary design, and Christ across all 66 books.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-3 w-full max-w-lg">
              {dailySuggestions.map((text, i) => {
                const style = GRADIENT_STYLES[i % GRADIENT_STYLES.length];
                return (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    className={cn(
                      "text-left p-2.5 sm:p-4 rounded-xl text-[11px] sm:text-sm transition-all duration-300 border backdrop-blur-md leading-snug",
                      "bg-gradient-to-br", style.gradient, style.border, style.glow, style.hoverGlow,
                      "shadow-lg hover:shadow-xl hover:scale-[1.03] hover:text-foreground text-muted-foreground"
                    )}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-2 sm:gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}>
                {msg.role === "assistant" && (
                  <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mt-1 bg-primary/15">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[90%] sm:max-w-[85%] rounded-2xl px-3.5 py-3 sm:px-5 sm:py-4 text-[13px] sm:text-sm leading-relaxed",
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
                  {msg.role === "assistant" && (
                    <div className="flex justify-end mt-2 pt-2 border-t border-primary/10">
                      <button
                        onClick={() => setSaveDialog({ open: true, msgIndex: i })}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Study Lens Menu — shown when Jeeves detects a Bible study question */}
            {pendingQuestion && !loading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mt-1 bg-primary/15">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                </div>
                <div className="max-w-[95%] sm:max-w-[90%] space-y-2 sm:space-y-3">
                  <div className="rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 bg-card border border-border text-foreground text-xs sm:text-sm">
                    Great question! How would you like me to approach this?
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {getRotatedLenses().map((lens) => {
                      const Icon = lens.icon;
                      return (
                         <button
                          key={lens.id}
                          onClick={() => handleLensSelect(lens.id)}
                          className={cn(
                            "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl text-left transition-all",
                            "bg-card border hover:scale-[1.02] hover:shadow-lg group",
                            lens.borderColor
                          )}
                        >
                          <div className={cn(
                            "shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-gradient-to-br text-white",
                            lens.color
                          )}>
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1">
                              {lens.label}
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hidden sm:block" />
                            </div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{lens.hint}</div>
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

      {/* Input Bar — mobile-optimized with safe area */}
      <div className="p-2.5 sm:p-4 border-t border-primary/15 backdrop-blur-xl bg-gradient-to-r from-card/80 via-card/60 to-primary/5 shadow-[0_-4px_20px_-5px] shadow-primary/10">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any Bible verse, story, or topic..."
            rows={1}
            className="w-full resize-none rounded-xl text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all backdrop-blur-md bg-background/70 border border-primary/20 text-foreground placeholder:text-muted-foreground shadow-inner shadow-primary/5"
            style={{
              padding: "0.625rem 2.75rem 0.625rem 0.75rem",
              minHeight: 40,
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
              "absolute right-1.5 bottom-1.5 p-2 rounded-lg transition-colors",
              input.trim() && !loading
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[9px] sm:text-[10px] mt-1.5 sm:mt-2 text-muted-foreground/50">
          Powered by deep theological analysis — Christ-centered, Scripture-grounded answers.
        </p>
      </div>

      {/* Save Dialog */}
      {saveDialog.msgIndex !== null && (
        <SaveChatResponseDialog
          open={saveDialog.open}
          onOpenChange={(open) => setSaveDialog({ open, msgIndex: open ? saveDialog.msgIndex : null })}
          responseContent={messages[saveDialog.msgIndex]?.content || ""}
          userQuestion={
            // Find the preceding user message
            messages.slice(0, saveDialog.msgIndex).reverse().find((m) => m.role === "user")?.content || ""
          }
          conversationHistory={messages.slice(0, saveDialog.msgIndex + 1)}
        />
      )}
    </div>
  );
}
