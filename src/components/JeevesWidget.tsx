import { useState, useRef, useEffect } from "react";
import jeevesAvatar from "@/assets/avatars/jeeves-avatar.png";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, Loader2, ChevronDown, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "Who is Christ in Genesis?",
  "Explain the Sanctuary types",
  "What is the Great Controversy?",
  "Walk me through Daniel 7",
  "How does the Gospel connect all floors?",
];

// Web Speech API TTS helper
function speakText(text: string, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  // Prefer a deep British-ish voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.toLowerCase().includes("daniel") ||
      v.name.toLowerCase().includes("george") ||
      v.name.toLowerCase().includes("david") ||
      v.name.toLowerCase().includes("male")
  );
  if (preferred) utterance.voice = preferred;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export const JeevesWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch user name and context snapshot
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setUserName(data.display_name.split(" ")[0]);
      });
    // Fetch user context for personalized Jeeves responses
    supabase.functions.invoke("user-context-snapshot", {
      body: { target: "jeeves" },
    }).then(({ data }) => {
      if (data?.promptBlock) setUserContext(data.promptBlock);
    }).catch(() => { /* graceful fallback — Jeeves works without context */ });
  }, [user]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = userName ?? "there";
      const msg = `Good day, ${greeting}. I am Jeeves, your theological guide through the Phototheology Palace. I am here to illuminate Scripture, trace Christ through every chapter, expound the Palace principles, and help you mine the treasures of the Word. What shall we explore today?`;
      setMessages([{ role: "assistant", content: msg }]);
      if (audioEnabled) speakText(msg, () => setSpeaking(false));
    }
  }, [open, userName, messages.length, audioEnabled]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  if (!user) return null;

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "qa",
          message: content,
          conversationHistory: updatedMessages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userName,
          userContextBlock: userContext,
        },
      });

      if (error) throw error;

      const reply =
        data?.response ||
        data?.content ||
        data?.answer ||
        "My apologies — I seem to have lost my train of thought. Do try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      if (audioEnabled) {
        setSpeaking(true);
        speakText(reply, () => setSpeaking(false));
      }
    } catch (err) {
      console.error("Jeeves widget error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I do beg your pardon — something interrupted my contemplation. Shall we try once more?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    }
    setAudioEnabled((prev) => !prev);
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex items-center gap-2"
            style={{ zIndex: 50 }}
          >
            <span className="whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full shadow-lg bg-indigo-950/90 text-indigo-100 pointer-events-none">
              Jeeves
            </span>
            <button
              onClick={() => setOpen(true)}
              className="h-11 w-11 rounded-full shadow-xl border-2 border-indigo-500/40 flex-shrink-0 overflow-hidden"
              style={{ background: "#fff", padding: 0 }}
              aria-label="Open Jeeves the Theological Guide"
            >
              <img src={jeevesAvatar} alt="Jeeves" className="h-full w-full object-cover object-center" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel — fixed to viewport, offset up so Reginald panel doesn't overlap */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-2 top-2 bottom-[72px] md:inset-x-auto md:top-auto md:bottom-6 md:right-[22rem] md:w-[24rem] md:max-h-[min(600px,calc(100dvh-90px))] z-[998] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border bg-background"
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between flex-shrink-0"
              style={{ background: "linear-gradient(to right, #1e1b4b, #312e81)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-indigo-400/30"
                >
                  <img src={jeevesAvatar} alt="Jeeves" className="h-full w-full object-cover object-top" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight text-indigo-50">Jeeves</p>
                  <p className="text-xs text-indigo-300/80">Theological Guide &amp; Scripture Scholar</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleAudio}
                  className="h-7 w-7 text-indigo-300 hover:text-indigo-100"
                  style={{ background: "transparent" }}
                  title={audioEnabled ? "Mute Jeeves" : "Enable Jeeves voice"}
                >
                  {audioEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setOpen(false);
                    window.speechSynthesis?.cancel();
                    setSpeaking(false);
                  }}
                  className="text-indigo-300 hover:text-indigo-100 h-7 w-7"
                  style={{ background: "transparent" }}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-background px-4 py-3 space-y-3 min-h-0"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed group/msg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground border border-border rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && (
                      <div className="mt-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                        <CopyButton text={msg.content} size="sm" className="h-6 text-[10px] text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Jeeves is searching the Scriptures…
                  </div>
                </div>
              )}
              {speaking && (
                <div className="flex justify-start">
                  <div className="bg-indigo-950/30 border border-indigo-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-indigo-300">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    Speaking…
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {messages.length === 1 && !loading && (
              <div className="bg-background border-t border-border px-4 py-2 flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-background border-t border-border px-3 py-3 flex items-end gap-2 flex-shrink-0" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
              <Button
                type="button"
                onClick={toggleMic}
                size="icon"
                variant="ghost"
                className={`h-10 w-10 flex-shrink-0 transition-colors ${listening ? "text-red-500 animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
                title={listening ? "Stop recording" : "Speak your question"}
              >
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={listening ? "Listening…" : "Ask Jeeves a theological question…"}
                disabled={loading}
                rows={2}
                className="flex-1 min-h-[56px] max-h-32 resize-none text-base leading-5 rounded-xl bg-muted/50 border-border focus:bg-background"
                style={{ fontSize: "16px" }}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-10 w-10 flex-shrink-0 text-white rounded-xl"
                style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
