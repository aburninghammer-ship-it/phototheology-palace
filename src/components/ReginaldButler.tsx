import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, Loader2, ChevronDown, Volume2, VolumeX, Mic, MicOff, ExternalLink } from "lucide-react";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import React from "react";

// Web Speech API TTS helper
function speakText(text: string, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 0.9;
  utterance.volume = 1.0;
  // Prefer a distinguished British-ish voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.toLowerCase().includes("daniel") ||
      v.name.toLowerCase().includes("george") ||
      v.name.toLowerCase().includes("david") ||
      v.name.toLowerCase().includes("arthur") ||
      v.name.toLowerCase().includes("male")
  );
  if (preferred) utterance.voice = preferred;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "What should I try next?",
  "What does this tab do?",
  "Give me a tour of the Palace",
  "Where are my saved studies?",
  "What room should I start with?",
  "Take me to the Research tab",
  "Something isn't working",
];

export const ReginaldButler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    // Fetch user context for personalized Reginald suggestions
    supabase.functions.invoke("user-context-snapshot", {
      body: { target: "reginald" },
    }).then(({ data }) => {
      if (data?.promptBlock) setUserContext(data.promptBlock);
    }).catch(() => { /* graceful fallback */ });
  }, [user]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = userName ?? "there";
      const msg = `Good day, ${greeting}! I'm Reginald, your Palace concierge. I'm here to help you navigate every corner of the Phototheology Palace — from finding your saved studies to understanding how each room works. What may I assist you with today?`;
      setMessages([{ role: "assistant", content: msg }]);
      if (audioEnabled) speakText(msg, () => setSpeaking(false));
    }
  }, [open, userName, messages.length, audioEnabled]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Moved after all hooks — see renderReginaldMessage useCallback below

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("reginald", {
        body: {
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userName,
          userContextBlock: userContext,
        },
      });

      if (error) throw error;

      let reply = data.response || "I do beg your pardon — let us try that again.";

      // Check for navigation marker
      const navMatch = reply.match(/\[NAVIGATE:\s*(\/[^\]]+)\]/);
      if (navMatch) {
        const path = navMatch[1].trim();
        reply = reply.replace(/\n?\[NAVIGATE:\s*\/[^\]]+\]/, "").trim();
        // Navigate after a short delay so the user sees the message
        setTimeout(() => {
          navigate(path);
        }, 1200);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      if (audioEnabled) {
        setSpeaking(true);
        speakText(reply, () => setSpeaking(false));
      }
    } catch (err) {
      console.error("Reginald error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I do beg your pardon — something went amiss on my end. Please try again in a moment.",
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

  /** Parse Reginald's response, converting [text](/path) into clickable nav links */
  const renderReginaldMessage = useCallback((content: string): React.ReactNode => {
    // First use the standard formatter to get base formatting
    const formatted = formatJeevesResponse(content);
    
    // Now we need to walk the formatted output and inject navigation links
    // Instead, let's parse the raw content for [text](/path) patterns before formatting
    const linkPattern = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
    
    if (!linkPattern.test(content)) {
      return formatted; // No links, use standard formatting
    }
    
    // Split content into segments: text and links
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    linkPattern.lastIndex = 0;
    let match;
    let keyIdx = 0;
    
    while ((match = linkPattern.exec(content)) !== null) {
      // Add text before this link
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        parts.push(
          <React.Fragment key={`text-${keyIdx++}`}>
            {formatJeevesResponse(textBefore)}
          </React.Fragment>
        );
      }
      
      // Add the clickable link
      const linkText = match[1];
      const linkPath = match[2];
      parts.push(
        <button
          key={`link-${keyIdx++}`}
          onClick={() => {
            navigate(linkPath);
            setOpen(false);
          }}
          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline underline-offset-2 font-medium transition-colors cursor-pointer"
        >
          {linkText}
          <ExternalLink className="h-3 w-3 inline-block flex-shrink-0" />
        </button>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after last link
    if (lastIndex < content.length) {
      const remaining = content.slice(lastIndex);
      parts.push(
        <React.Fragment key={`text-${keyIdx++}`}>
          {formatJeevesResponse(remaining)}
        </React.Fragment>
      );
    }
    
    return <>{parts}</>;
  }, [navigate]);

  // Don't render for unauthenticated users (after all hooks)
  if (!user) return null;

  return (
    <>
      {/* Floating trigger button */}
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
            <span className="whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full shadow-lg bg-amber-900/90 text-amber-100 pointer-events-none">
              Reginald
            </span>
            <Button
              onClick={() => setOpen(true)}
              className="h-11 w-11 rounded-full shadow-xl border-2 border-amber-500/40 p-0 flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #78350f, #92400e)" }}
              aria-label="Open Reginald the Palace Butler"
            >
              <img src={reginaldAvatar} alt="Reginald" className="h-full w-full object-cover object-top" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel — fixed to viewport bottom-right */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-2 top-2 bottom-[72px] md:inset-x-auto md:top-auto md:bottom-6 md:right-5 md:w-[24rem] md:max-h-[min(600px,calc(100dvh-90px))] z-[999] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border bg-background"
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between flex-shrink-0"
              style={{ background: "linear-gradient(to right, #451a03, #78350f)" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-amber-500/30">
                  <img src={reginaldAvatar} alt="Reginald" className="h-full w-full object-cover object-top" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight text-amber-50">Reginald</p>
                  <p className="text-xs text-amber-300/80">Palace Concierge &amp; Tour Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleAudio}
                  className="h-7 w-7 text-amber-300 hover:text-amber-100"
                  style={{ background: "transparent" }}
                  title={audioEnabled ? "Mute Reginald" : "Enable Reginald's voice"}
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
                  className="text-amber-300 hover:text-amber-100 h-7 w-7"
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
                    className={`max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground border border-border rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-2 [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>div]:mb-2 text-sm">
                        {renderReginaldMessage(msg.content)}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Reginald is consulting the Palace plans…
                  </div>
                </div>
              )}
              {speaking && (
                <div className="flex justify-start">
                  <div className="bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-amber-300">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    Speaking…
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions (only show after greeting) */}
            {messages.length === 1 && !loading && (
              <div className="bg-background border-t border-border px-4 py-2 flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick questions:</p>
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
                placeholder={listening ? "Listening…" : "Ask Reginald about the Palace…"}
                disabled={loading}
                rows={2}
                className="flex-1 min-h-[56px] max-h-32 resize-none text-base leading-5 rounded-xl bg-muted/50 border-border focus:bg-background"
                style={{ fontSize: "16px" }}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-10 w-10 flex-shrink-0 text-primary-foreground rounded-xl"
                style={{ background: "linear-gradient(135deg, #78350f, #92400e)" }}
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
