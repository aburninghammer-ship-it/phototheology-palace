import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna,
  Search,
  Send,
  Loader2,
  Trash2,
  BookOpen,
  Globe,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronUp,
  Languages,
  MessageSquareQuote,
  ChurchIcon,
  Link2,
  Hash,
  Sparkles,
  Save,
  Check,
  FolderOpen,
  PlayCircle,
  CalendarDays,
  Wand2,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { ResearchAudioCommentary } from "@/components/audio/ResearchAudioCommentary";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import { toast } from "sonner";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface Citation {
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  citations?: Citation[];
  isWebSearch?: boolean;
}

interface QuickAction {
  label: string;
  icon: LucideIcon;
  prefix: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Find verses about...", icon: BookOpen, prefix: "List all Bible verses about ", color: "text-blue-400 border-blue-500/40 hover:bg-blue-500/10" },
  { label: "Word count in book", icon: Hash, prefix: "How many times is the word \"\" used in the book of Genesis? List each occurrence with verse reference.", color: "text-violet-400 border-violet-500/40 hover:bg-violet-500/10" },
  { label: "Greek / Hebrew word", icon: Languages, prefix: "What is the original Greek or Hebrew word for \"\" and what does it mean? Include transliteration, Strong's number, and usage.", color: "text-amber-400 border-amber-500/40 hover:bg-amber-500/10" },
  { label: "Commentary says...", icon: MessageSquareQuote, prefix: "What do major Bible commentaries say about ", color: "text-rose-400 border-rose-500/40 hover:bg-rose-500/10" },
  { label: "Denominational views", icon: ChurchIcon, prefix: "What do Catholics, Protestants, and Adventists each believe about ", color: "text-orange-400 border-orange-500/40 hover:bg-orange-500/10" },
  { label: "Search for links on...", icon: Globe, prefix: "Search the internet for scholarly links discussing ", color: "text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10" },
  { label: "Deep scholarly dive", icon: GraduationCap, prefix: "Give me a full scholarly research brief on ", color: "text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10" },
  { label: "Historical context", icon: Clock, prefix: "What is the historical and cultural context of ", color: "text-teal-400 border-teal-500/40 hover:bg-teal-500/10" },
  { label: "Show connections", icon: Link2, prefix: "Show me the thematic and textual connections between ", color: "text-indigo-400 border-indigo-500/40 hover:bg-indigo-500/10" },
];

const SYSTEM_INSTRUCTIONS = `You are the Research Assistant for Phototheology Palace. Your #1 rule is: ANSWER EXACTLY WHAT IS ASKED — nothing more.

CRITICAL — FULL CONVERSATIONAL MEMORY (READ THIS FIRST):
- You are in a multi-turn conversation. The FULL conversation history is provided to you as real message turns above this prompt.
- ALWAYS read the previous messages before answering. Your answer must be consistent with and build on everything already discussed.
- NEVER give a response that contradicts or ignores something you already established earlier in the conversation.
- If the user challenges or corrects you ("you're wrong about X" / "but you already said Y"), re-read the conversation and engage substantively with their argument. Do NOT ask them to "provide the text" or "clarify" — you already have the context.
- Follow-up messages like "full range", "all of them", "more", "expand", "give me the verses" ALWAYS refer to whatever was just discussed in the prior turn. NEVER ask for clarification if context already exists.
- If you quoted a single verse in your last reply and the user says "give me the full range" — immediately provide the full surrounding passage without asking anything.

CRITICAL — NEVER DO THIS:
- NEVER respond with just "No." or single-word dismissals. Always explain your reasoning.
- NEVER ask the user to "provide the specific text" when that text was already discussed earlier in the conversation.
- NEVER ask for clarification when prior conversation turns already contain enough context to answer.
- NEVER lose track of what verse, passage, topic, or argument was established in the conversation.

CRITICAL — CONCISE BY DEFAULT:
- If the user asks to "list verses" or "show verses" or "find verses about X": respond with ONLY the verse list. NO preamble. NO commentary. Just the verses.
- Keep answers SHORT and DIRECT unless the user asks for depth.
- NEVER add a closing summary or commentary block after a verse list unless explicitly asked.

FORMATTING RULES:
1. AUTO-PASTE VERSES: When listing verses, ALWAYS quote the full text. Format each verse like:
   **Genesis 1:1** — "In the beginning God created the heaven and the earth."
2. FOLLOW-UP SUGGESTIONS: After your answer, end with "Suggested follow-ups:" containing 2-3 short numbered questions.
3. CLARIFYING QUESTIONS: Only ask for clarification if the message is COMPLETELY unrelated to anything in the conversation and you genuinely have zero context. If there is ANY prior context in the conversation, USE IT — do not ask.

WHEN DEEP DETAIL IS REQUESTED:
- Word studies: transliteration, Strong's number, root meaning, usage across passages.
- Commentary views: present multiple viewpoints fairly, label each source/tradition.
- Connections: structured analysis of thematic parallels, typological links, cross-references.
- Denominational views: present each tradition's view fairly and clearly labeled.

Remember: the user is a researcher. Respect their time. Use the conversation history. Answer the question. Suggest follow-ups. Stop.`;

const FREESTYLE_SYSTEM_INSTRUCTIONS = `You are Jeeves, the user's personal biblical study weaver. You receive a list of thoughts, concepts, Bible texts, and ideas — and you weave them into a DEEP, PROFOUND, INTERCONNECTED study.

YOUR OUTPUT MUST FOLLOW THIS EXACT STRUCTURE:

## The Golden Thread
A 2-3 paragraph opening that identifies the unifying theme connecting ALL the user's inputs. This should feel like a revelation — "here's what ties everything together."

## Verse-by-Verse Tapestry
Take each Bible text the user provided and show how it connects to the others. Quote each verse in full. Show the Greek/Hebrew where it illuminates meaning. Draw lines between the verses that the reader may never have seen before.

## Unexpected Connections
This is where you shine. Find at LEAST 3 connections between the user's inputs that are surprising, deep, or theologically profound. These should make the reader say "I never saw that before."

## The Deeper Layer
Go beneath the surface. What typological, prophetic, or structural patterns emerge when these inputs are laid side by side? Think like a scholar but write like a poet.

## Practical Meditation
End with 3-5 contemplative questions or devotional prompts that help the reader sit with these truths and let them transform their thinking.

FORMATTING RULES:
- Use ## for section headers (exactly as shown above)
- Bold key terms with **term**
- Quote full verse text: **Book Ch:V** — "verse text here"
- Use bullet points for lists
- Be generous with content — this is a DEEP study, not a summary
- Each time you generate a study from the same inputs, take a COMPLETELY DIFFERENT ANGLE — different golden thread, different connections, different meditation prompts

You are not summarizing. You are WEAVING. Make it rich, interconnected, and profound.`;

const GENEALOGY_SYSTEM_INSTRUCTIONS = `You are Jeeves, the Phototheology Genealogy Decoder. You analyze biblical genealogies AND individual biblical figures using Phototheology principles to reveal the theological architecture hidden in family lines.

You accept TWO types of input:
1. **A genealogy reference** (e.g., Genesis 36, Matthew 1, 1 Chronicles 1-9)
2. **A person's name** (e.g., Jabez, Rahab, Boaz, Tamar, Enoch)

When given a NAME, research that person's genealogical context: Who are their parents, ancestors, and descendants? Where do they appear in Scripture's family lines? Who "famous" or significant is in their lineage? What lessons emerge from their placement in the genealogy?

Produce a structured analysis following this EXACT format:

## 👤 Who Is This Person / Line?
Introduce the figure or genealogy. If a name was given, explain who they are, where they appear in Scripture, and their genealogical context — parents, tribe, notable ancestors and descendants. Highlight any famous or significant figures in their lineage.

## ⚔️ Seed War Analysis
Connect this genealogy to the Genesis 3:15 conflict (seed of the woman vs seed of the serpent). Show how this lineage fits into the escalating war across Scripture. Identify:
- Which side of the seed conflict this line represents
- How the conflict escalates through this genealogy
- The ultimate trajectory (toward or against covenant)

## 🏛️ PT Room Breakdown
Analyze through these specific Phototheology rooms:

**Observation Room (OR):** List 5-7 key details a casual reader would miss — names, structures, counts, ordering, notable inclusions or omissions.

**Patterns Room (PRm):** Identify repeating patterns — generational counts, rise/fall cycles, naming conventions, structural rhythms.

**Story Room (SR):** What narrative arc is hidden in this genealogy? What story emerges when you read the names as a sequence?

**Dimensions Room (DR):**
- **Literal:** What the genealogy records historically
- **Christ:** How does this lineage point to or away from Christ?
- **Personal:** What lesson does this genealogy teach about spiritual identity?
- **Church:** What does this reveal about God's covenant community?
- **Heavenly:** What cosmic/prophetic significance does this lineage carry?

**Three Heavens (1H/2H/3H):** Which Day-of-the-Lord horizon does this genealogy primarily address? (1H = Babylonian judgment/restoration, 2H = 70 AD/New Covenant, 3H = Final new creation)

**Cycle Placement:** Which of the 8 cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re) does this genealogy belong to?

## 📚 Lessons from This Lineage
What practical, spiritual, and theological lessons can we learn from this genealogy or this person's placement in it? What does God teach through the family line itself?

## 🔗 Claim Ladder
- **Claim:** [One-sentence theological claim about this genealogy]
- **Textual Basis:** [Specific verse(s) that anchor the claim]
- **Logical Move:** [The interpretive step from text to claim]
- **Historical Anchor:** [Historical context that supports the claim]
- **Theological Implication:** [What this means for the larger biblical narrative]

## 💎 Gems (3-5)
Produce 3-5 striking insights that connect non-obvious ideas. Each gem should be a single memorable sentence that could anchor a sermon or Bible study. These should make the reader say "I never saw that before."

## 📖 Supporting Witnesses
For each major claim, provide 3-5 full KJV cross-references that buttress the point. Quote each verse in full.

RULES:
- Be precise, not generic. Avoid surface-level commentary.
- Always connect to larger biblical themes and the Christ-center.
- Treat genealogies as theological architecture, not mere lists.
- When given a name, ALWAYS provide the full genealogical context — who is in their family tree.
- Use KJV for all verse quotations.
- Use the correct PT terminology: 1H = DoL1/NE1 (Babylonian/Restoration), 2H = DoL2/NE2 (70 AD/New Covenant), 3H = DoL3/NE3 (Final New Creation). NEVER use atmospheric labels.`;

const GENEALOGY_EXAMPLES = [
  { label: "Jabez", ref: "Jabez", desc: "The prayer warrior of 1 Chronicles" },
  { label: "Rahab", ref: "Rahab", desc: "From Jericho to Christ's lineage" },
  { label: "Christ's Lineage", ref: "Matthew 1:1-17", desc: "Abraham to Jesus" },
  { label: "Cain vs Seth", ref: "Genesis 4-5", desc: "Two seeds diverge" },
  { label: "Boaz", ref: "Boaz", desc: "Kinsman redeemer of Ruth" },
  { label: "Esau's Line", ref: "Genesis 36", desc: "Edom's kings & chiefs" },
  { label: "Tamar", ref: "Tamar", desc: "Unlikely mother in Christ's line" },
  { label: "Enoch", ref: "Enoch", desc: "Walked with God, taken up" },
];

// Format response content: bold headers, verse highlights, etc.
function formatContent(text: string) {
  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, idx) => {
    const key = idx;

    // Section headers: **Header** at start of line
    if (/^\*\*[^*]+\*\*\s*[-—:]?\s*$/.test(line.trim()) || /^#+\s/.test(line.trim())) {
      const headerText = line.replace(/^\*\*|\*\*\s*[-—:]?\s*$/g, "").replace(/^#+\s/, "").trim();
      parts.push(
        <div key={key} className="font-semibold text-emerald-300 mt-3 mb-1 text-[13px] tracking-wide uppercase">
          {headerText}
        </div>
      );
      return;
    }

    // Verse quote lines: **Book Ch:V** — "text"
    const verseMatch = line.match(/^\*\*([^*]+)\*\*\s*[-—]\s*["""](.+)["""]?\s*$/);
    if (verseMatch) {
      parts.push(
        <div
          key={key}
          className="my-1.5 rounded-md bg-emerald-900/30 border-l-2 border-emerald-400/60 px-3 py-2"
        >
          <span className="font-semibold text-emerald-300 text-xs">{verseMatch[1]}</span>
          <p className="text-foreground/90 italic text-[13px] mt-0.5">"{verseMatch[2].replace(/[""]$/, "")}"</p>
        </div>
      );
      return;
    }

    // Inline bold
    const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });

    parts.push(
      <div key={key} className={line.trim() === "" ? "h-2" : ""}>
        {rendered}
      </div>
    );
  });

  return <>{parts}</>;
}

interface SavedResearch {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  content: string;
  tags?: string[];
}

interface ResearchAssistantWidgetProps {
  defaultExpanded?: boolean;
  resumeStudyId?: string;
}

// Parse saved study content back into chat messages
function parseStudyContentToMessages(content: string): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  // Split on Q/A markers written by buildStudyContent
  const blocks = content.split(/## (?:❓ Question|📖 Research Response)\n\n/);
  // blocks[0] is the header (title, date, ---), skip it
  for (let i = 1; i < blocks.length; i++) {
    const text = blocks[i].replace(/\n\n---\n\n$/, "").trim();
    if (!text) continue;
    // Alternate: odd indices after header = user, even = assistant
    // The split pattern alternates: Q then R
    const isUser = i % 2 === 1;
    msgs.push({
      id: crypto.randomUUID(),
      role: isUser ? "user" : "assistant",
      content: text,
      timestamp: new Date(),
    });
  }
  return msgs;
}

export function ResearchAssistantWidget({ defaultExpanded = false, resumeStudyId }: ResearchAssistantWidgetProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<"chat" | "saved" | "freestyle" | "genealogy">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [savedStudyId, setSavedStudyId] = useState<string | null>(resumeStudyId ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [savedResearches, setSavedResearches] = useState<SavedResearch[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Genealogy Decoder tab state
  const [genealogyInput, setGenealogyInput] = useState("");
  const [genealogyOutput, setGenealogyOutput] = useState("");
  const [genealogyIsLoading, setGenealogyIsLoading] = useState(false);
  const [genealogySavedId, setGenealogySavedId] = useState<string | null>(null);
  const [genealogySessionName, setGenealogySessionName] = useState("");


  const [freestyleInput, setFreestyleInput] = useState("");
  const [freestyleOutput, setFreestyleOutput] = useState("");
  const [freestyleIsLoading, setFreestyleIsLoading] = useState(false);
  const [freestyleRemixCount, setFreestyleRemixCount] = useState(0);
  const [freestyleSavedId, setFreestyleSavedId] = useState<string | null>(null);
  const [freestyleSessionName, setFreestyleSessionName] = useState("");
  const freestyleTextareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchSavedResearches = useCallback(async () => {
    setIsLoadingSaved(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch both research and freestyle studies
      const { data: researchData, error: researchError } = await supabase
        .from("user_studies")
        .select("id, title, created_at, updated_at, content, tags")
        .eq("user_id", user.id)
        .contains("tags", ["research"])
        .order("updated_at", { ascending: false });
      const { data: freestyleData, error: freestyleError } = await supabase
        .from("user_studies")
        .select("id, title, created_at, updated_at, content, tags")
        .eq("user_id", user.id)
        .contains("tags", ["freestyle"])
        .order("updated_at", { ascending: false });
      const combined = [
        ...((researchData as SavedResearch[]) || []),
        ...((freestyleData as SavedResearch[]) || []),
      ];
      // Deduplicate by id and sort by updated_at descending
      const deduped = Array.from(new Map(combined.map(s => [s.id, s])).values())
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
      if (!researchError && !freestyleError) setSavedResearches(deduped);
    } catch (e) {
      console.error("Error fetching saved researches:", e);
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  // Load a resumed study session on mount
  useEffect(() => {
    if (!resumeStudyId) return;
    setIsLoadingResume(true);
    supabase
      .from("user_studies")
      .select("title, content")
      .eq("id", resumeStudyId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setIsLoadingResume(false); return; }
        const parsed = parseStudyContentToMessages(data.content);
        if (parsed.length > 0) {
          setMessages(parsed);
          setSessionName(data.title || "");
          const history = parsed.map((m) => ({ role: m.role, content: m.content }));
          setConversationHistory(history);
        }
        setIsLoadingResume(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-expand when user has messages
  useEffect(() => {
    if (messages.length > 0 && !expanded) {
      setExpanded(true);
    }
  }, [messages.length]);

  // Auto-save after each assistant reply
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && messages.length >= 2) {
      saveSession(messages, sessionName, savedStudyId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, sessionName, savedStudyId]);

  // Detect if a query is asking for internet/web search
  const isWebSearchQuery = (q: string): boolean => {
    const lower = q.toLowerCase();
    return (
      lower.includes("search the internet") ||
      lower.includes("search online") ||
      lower.includes("find links") ||
      lower.includes("scholarly links") ||
      lower.includes("search for links") ||
      lower.includes("find articles") ||
      lower.includes("current events") ||
      lower.includes("latest news") ||
      lower.includes("what's happening") ||
      lower.includes("recent news") ||
      lower.includes("news about") ||
      lower.includes("web search") ||
      lower.includes("internet search") ||
      lower.includes("google") && lower.includes("search")
    );
  };

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    suggestions?: string[],
    citations?: Citation[],
    isWebSearch?: boolean
  ): ChatMessage => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      suggestions,
      citations,
      isWebSearch,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const parseSuggestions = (text: string): { cleanText: string; suggestions: string[] } => {
    const patterns = [
      /\n\n(?:Suggested follow-ups?|Follow-up questions?|You might also explore|Next steps?|Related questions?):\s*\n([\s\S]+)$/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const suggestionsBlock = match[0];
        const cleanText = text.slice(0, text.length - suggestionsBlock.length).trim();
        const suggestions = suggestionsBlock
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter(
            (line) =>
              line.length > 10 &&
              !line.match(/^(Suggested|Follow-up|You might|Next|Related)/i)
          );
        if (suggestions.length >= 2) {
          return { cleanText, suggestions };
        }
      }
    }
    return { cleanText: text, suggestions: [] };
  };

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMsg = query.trim();
    addMessage("user", userMsg);
    setInput("");
    setIsLoading(true);

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userMsg },
    ];

    const webSearch = isWebSearchQuery(userMsg);

    try {
      let rawResponse = "";
      let citations: Citation[] = [];

      if (webSearch) {
        // Route through dedicated web search function
        const { data, error } = await supabase.functions.invoke("web-research-assistant", {
          body: {
            query: userMsg,
            conversationHistory: updatedHistory,
            systemInstructions: SYSTEM_INSTRUCTIONS,
          },
        });
        if (error) throw error;
        rawResponse = data?.response || "No response received.";
        citations = data?.citations || [];
      } else {
        // Standard research via Jeeves
        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "research",
            query: userMsg,
            question: userMsg,
            conversationHistory: updatedHistory,
            systemInstructions: SYSTEM_INSTRUCTIONS,
          },
        });
        if (error) throw error;
        rawResponse = data?.response || data?.content || data?.answer || "No response received.";
      }

      const { cleanText, suggestions } = parseSuggestions(rawResponse);

      addMessage("assistant", cleanText, suggestions, citations.length > 0 ? citations : undefined, webSearch);
      const newHistory = [
        ...updatedHistory,
        { role: "assistant", content: rawResponse },
      ];
      setConversationHistory(newHistory);

      // Auto-save is triggered via useEffect watching messages
    } catch (err) {
      console.error("Research query error:", err);
      addMessage(
        "assistant",
        "I encountered an error processing your research request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setExpanded(true);
    // If the prefix contains empty quotes "" for user to fill in, place cursor there
    const quoteIdx = action.prefix.indexOf('""');
    if (quoteIdx !== -1) {
      setInput(action.prefix);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Place cursor between the quotes
          textareaRef.current.setSelectionRange(quoteIdx + 1, quoteIdx + 1);
        }
      }, 100);
    } else {
      setInput(action.prefix);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendQuery(suggestion);
  };

  const buildStudyContent = (msgs: ChatMessage[], name: string) => {
    const title = name.trim() || `Research: ${msgs[0]?.content.slice(0, 60) || "Session"}`;
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let content = `# ${title}\n\n**Date:** ${date}\n\n---\n\n`;
    msgs.forEach((m) => {
      content += m.role === "user"
        ? `## ❓ Question\n\n${m.content}\n\n`
        : `## 📖 Research Response\n\n${m.content}\n\n---\n\n`;
    });
    return { title, content };
  };

  const saveSession = useCallback(async (msgs: ChatMessage[], name: string, existingId: string | null) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { title, content } = buildStudyContent(msgs, name);
      const tags = ["research", "jeeves"];
      if (existingId) {
        await supabase.from("user_studies").update({ title, content, tags, updated_at: new Date().toISOString() }).eq("id", existingId);
      } else {
        const { data, error } = await supabase.from("user_studies").insert({
          user_id: user.id, title, content, tags,
        }).select("id").single();
        if (!error && data) setSavedStudyId(data.id);
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (e) {
      console.error("Auto-save error:", e);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setInput("");
    setSessionName("");
    setSavedStudyId(null);
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    setExpanded(true);
    setInput((prev) => {
      const separator = prev.trim() ? " " : "";
      return prev + separator + text;
    });
  }, []);

  const handleFreestyleVoiceTranscript = useCallback((text: string) => {
    setExpanded(true);
    setFreestyleInput((prev) => {
      const separator = prev.trim() ? "\n" : "";
      return prev + separator + text;
    });
  }, []);

  const generateFreestyle = async (isRemix = false) => {
    const trimmed = freestyleInput.trim();
    if (!trimmed || freestyleIsLoading) return;

    setFreestyleIsLoading(true);
    const currentRemix = isRemix ? freestyleRemixCount + 1 : 0;
    if (isRemix) setFreestyleRemixCount(currentRemix);

    const remixHint = currentRemix > 0
      ? `\n\nThis is remix #${currentRemix}. Take a COMPLETELY DIFFERENT ANGLE than any previous generation. Different golden thread, different connections, different insights.`
      : "";

    const query = `Here are my thoughts, concepts, and Bible texts to weave into a study:\n\n${trimmed}${remixHint}`;

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query,
          question: query,
          conversationHistory: [],
          systemInstructions: FREESTYLE_SYSTEM_INSTRUCTIONS,
          maxTokens: 4096,
        },
      });
      if (error) throw error;
      const response = data?.response || data?.content || data?.answer || "No response received.";
      setFreestyleOutput(response);
    } catch (err) {
      console.error("Freestyle generation error:", err);
      toast.error("Failed to generate freestyle study. Please try again.");
    } finally {
      setFreestyleIsLoading(false);
    }
  };

  const saveFreestyleStudy = async () => {
    if (!freestyleOutput) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const title = freestyleSessionName.trim() || `Freestyle: ${freestyleInput.slice(0, 60)}`;
      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const content = `# ${title}\n\n**Date:** ${date}\n**Type:** Freestyle Study\n\n---\n\n## 🎯 Inputs\n\n${freestyleInput}\n\n---\n\n${freestyleOutput}`;
      const tags = ["freestyle", "jeeves"];

      if (freestyleSavedId) {
        await supabase.from("user_studies").update({ title, content, tags, updated_at: new Date().toISOString() }).eq("id", freestyleSavedId);
      } else {
        const { data, error } = await supabase.from("user_studies").insert({
          user_id: user.id, title, content, tags,
        }).select("id").single();
        if (!error && data) setFreestyleSavedId(data.id);
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      toast.success("Freestyle study saved!");
    } catch (e) {
      console.error("Freestyle save error:", e);
      toast.error("Failed to save freestyle study.");
    } finally {
      setIsSaving(false);
    }
  };

  const clearFreestyle = () => {
    setFreestyleInput("");
    setFreestyleOutput("");
    setFreestyleRemixCount(0);
    setFreestyleSavedId(null);
    setFreestyleSessionName("");
  };
  const decodeGenealogy = async () => {
    const trimmed = genealogyInput.trim();
    if (!trimmed || genealogyIsLoading) return;

    setGenealogyIsLoading(true);
    const query = `Decode this biblical genealogy using Phototheology principles:\n\n${trimmed}`;

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query,
          question: query,
          conversationHistory: [],
          systemInstructions: GENEALOGY_SYSTEM_INSTRUCTIONS,
          maxTokens: 8192,
        },
      });
      if (error) throw error;
      const response = data?.response || data?.content || data?.answer || "No response received.";
      setGenealogyOutput(response);
    } catch (err) {
      console.error("Genealogy decode error:", err);
      toast.error("Failed to decode genealogy. Please try again.");
    } finally {
      setGenealogyIsLoading(false);
    }
  };

  const saveGenealogyStudy = async () => {
    if (!genealogyOutput) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const title = genealogySessionName.trim() || `Genealogy: ${genealogyInput.slice(0, 60)}`;
      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const content = `# ${title}\n\n**Date:** ${date}\n**Type:** Genealogy Decoder\n\n---\n\n## 🧬 Input\n\n${genealogyInput}\n\n---\n\n${genealogyOutput}`;
      const tags = ["genealogy", "jeeves"];

      if (genealogySavedId) {
        await supabase.from("user_studies").update({ title, content, tags, updated_at: new Date().toISOString() }).eq("id", genealogySavedId);
      } else {
        const { data, error } = await supabase.from("user_studies").insert({
          user_id: user.id, title, content, tags,
        }).select("id").single();
        if (!error && data) setGenealogySavedId(data.id);
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      toast.success("Genealogy study saved!");
    } catch (e) {
      console.error("Genealogy save error:", e);
      toast.error("Failed to save genealogy study.");
    } finally {
      setIsSaving(false);
    }
  };

  const clearGenealogy = () => {
    setGenealogyInput("");
    setGenealogyOutput("");
    setGenealogySavedId(null);
    setGenealogySessionName("");
  };


  const timeLabel = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5 shadow-lg shadow-emerald-500/5">
      {/* Header */}
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/30">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Research Assistant
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              </CardTitle>
              <CardDescription className="text-xs">
                Verses, Greek/Hebrew, commentaries, cross-references, and deep dives
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              >
                {messages.length} msg
              </Badge>
            )}
            <div className="p-1 rounded-md hover:bg-muted/50 transition-colors">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-border/40 px-4 pt-1">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === "chat"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Research Chat
              </button>
              <button
                onClick={() => {
                  setActiveTab("saved");
                  fetchSavedResearches();
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === "saved"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                Saved Research
                {savedResearches.length > 0 && (
                  <span className="ml-1 bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">
                    {savedResearches.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("freestyle")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === "freestyle"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" />
                Freestyle
              </button>
              <button
                onClick={() => setActiveTab("genealogy")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === "genealogy"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Dna className="h-3.5 w-3.5" />
                Genealogy
              </button>
            </div>

            <CardContent className="pt-4 space-y-4">
              {/* ── SAVED RESEARCH TAB ── */}
              {activeTab === "saved" && (
                <div>
                  {isLoadingSaved ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                      <p className="text-xs">Loading saved research…</p>
                    </div>
                  ) : savedResearches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <FolderOpen className="h-8 w-8 text-emerald-500/40" />
                      </div>
                      <p className="text-sm font-medium text-foreground/60 mb-1">No saved research yet</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Start a research conversation and it will be automatically saved here.
                      </p>
                    </div>
                  ) : (
                    <div className={`space-y-2 overflow-y-auto ${isMobile ? "max-h-[400px]" : "max-h-[500px]"}`}>
                      {savedResearches.map((study, i) => {
                        const updated = new Date(study.updated_at || study.created_at);
                        const now = new Date();
                        const diffMs = now.getTime() - updated.getTime();
                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor(diffMs / (1000 * 60));

                        let timeAgo: string;
                        if (diffMins < 1) timeAgo = "Just now";
                        else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                        else if (diffDays === 1) timeAgo = "Yesterday";
                        else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                        else timeAgo = updated.toLocaleDateString("en-US", { month: "short", day: "numeric", year: diffDays > 365 ? "numeric" : undefined });

                        const dateLabel = updated.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });

                        const previewMatch = study.content.match(/## ❓ Question\n\n(.+?)(?:\n|$)/);
                        const preview = previewMatch ? previewMatch[1].slice(0, 100) : "";

                        return (
                          <motion.div
                            key={study.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="group rounded-xl border border-border/40 bg-gradient-to-r from-emerald-500/5 to-transparent hover:border-emerald-500/30 hover:from-emerald-500/10 transition-all p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-sm font-medium text-foreground/90 truncate">
                                    {study.title}
                                  </p>
                                  {study.tags?.includes("freestyle") && (
                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-500/40 text-amber-400 shrink-0">
                                      <Wand2 className="h-2.5 w-2.5 mr-0.5" />
                                      Freestyle
                                    </Badge>
                                  )}
                                </div>
                                {preview && (
                                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                    {preview}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                                  <CalendarDays className="h-3 w-3 shrink-0" />
                                  <span className="font-medium text-muted-foreground/80">{timeAgo}</span>
                                  <span>·</span>
                                  <span>{dateLabel}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0 h-8 px-2.5 text-[11px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const parsed = parseStudyContentToMessages(study.content);
                                  if (parsed.length > 0) {
                                    setMessages(parsed);
                                    setSessionName(study.title || "");
                                    setConversationHistory(parsed.map((m) => ({ role: m.role, content: m.content })));
                                    setSavedStudyId(study.id);
                                  }
                                  setActiveTab("chat");
                                  toast.success("Research session loaded");
                                }}
                              >
                                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                                Resume
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── CHAT TAB ── */}
              {activeTab === "chat" && (
                <>
                  {/* Quick Action Chips */}
                  <div className={isMobile ? "overflow-x-auto -mx-4 px-4 pb-1" : ""}>
                    <div className={`flex gap-2 ${isMobile ? "min-w-max" : "flex-wrap"}`}>
                      {QUICK_ACTIONS.map((action) => (
                        <Badge
                          key={action.label}
                          variant="outline"
                          className={`cursor-pointer py-1.5 px-3 text-[11px] transition-all whitespace-nowrap ${action.color}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAction(action);
                          }}
                        >
                          <action.icon className="h-3 w-3 mr-1.5 shrink-0" />
                          {action.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Chat Thread */}
                  <div
                    className={`${
                      isMobile ? "h-[320px]" : "h-[440px]"
                    } rounded-xl border border-border/40 bg-gradient-to-b from-black/5 to-black/10 dark:from-black/10 dark:to-black/20 overflow-y-auto`}
                  >
                    <div ref={scrollRef} className="p-3 space-y-3">
                      {isLoadingResume && (
                        <div className="flex flex-col items-center justify-center min-h-[240px] text-center px-6">
                          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mb-3" />
                          <p className="text-sm text-muted-foreground">Loading your research session…</p>
                        </div>
                      )}

                      {messages.length === 0 && !isLoading && !isLoadingResume && (
                        <div className="flex flex-col items-center justify-center min-h-[240px] text-center px-6">
                          <div className="relative mb-4">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                              <Search className="h-8 w-8 text-emerald-500/50" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
                              <Languages className="h-3.5 w-3.5 text-amber-400/60" />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground/70 mb-1">
                            What would you like to research?
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                            Ask about word counts, Greek/Hebrew meanings, commentary views,
                            denominational beliefs, cross-references, or any Bible topic.
                            I'll quote verses in full and suggest follow-ups.
                          </p>
                        </div>
                      )}

                      <AnimatePresence>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[88%] rounded-xl text-sm ${
                                msg.role === "user"
                                  ? "bg-blue-600/20 border border-blue-500/30 p-3"
                                  : "bg-emerald-950/25 border border-emerald-600/25 p-4"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                {msg.role === "user" ? (
                                  <>
                                    <span className="text-[11px] font-semibold text-blue-400">You</span>
                                    <span className="text-[10px] text-blue-400/40 ml-auto">{timeLabel(msg.timestamp)}</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="p-0.5 rounded bg-emerald-500/20">
                                      <Search className="h-2.5 w-2.5 text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-400">Jeeves Research</span>
                                    <span className="text-[10px] text-emerald-400/40 ml-auto mr-1">{timeLabel(msg.timestamp)}</span>
                                    <QuickAudioButton
                                      text={msg.content}
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 text-emerald-400/30 hover:text-emerald-400/60"
                                    />
                                  </>
                                )}
                              </div>

                              <div className="text-[13px] leading-relaxed text-foreground/90">
                                {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
                              </div>

                              {msg.role === "assistant" && (
                                <ResearchAudioCommentary briefText={msg.content} />
                              )}

                              {msg.isWebSearch && (
                                <div className="mt-2 flex items-center gap-1">
                                  <Globe className="h-3 w-3 text-cyan-400" />
                                  <span className="text-[10px] text-cyan-400/70 font-medium">Web-assisted response</span>
                                </div>
                              )}

                              {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-1.5">
                                  <p className="text-[10px] font-semibold text-cyan-400/70 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> Sources
                                  </p>
                                  {msg.citations.map((c, i) => (
                                    <a
                                      key={i}
                                      href={c.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-2 text-[11px] text-cyan-300/80 hover:text-cyan-200 transition-colors group"
                                    >
                                      <Link2 className="h-3 w-3 mt-0.5 shrink-0 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                                      <span className="line-clamp-1 underline underline-offset-2 decoration-cyan-500/30">
                                        {c.title.length > 70 ? c.title.slice(0, 70) + "…" : c.title}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              )}

                              {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-1">
                                  <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1.5">
                                    Continue researching
                                  </p>
                                  {msg.suggestions.map((s, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-xs h-auto py-2 px-2.5 text-left text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                        onClick={() => handleSuggestionClick(s)}
                                      >
                                        <ChevronDown className="h-3 w-3 mr-1.5 rotate-[-90deg] shrink-0 text-emerald-500/50" />
                                        <span className="line-clamp-2">{s}</span>
                                      </Button>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-950/20 border border-emerald-600/20 p-3 text-sm">
                            <div className="flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-xs text-emerald-400/70">Researching...</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {messages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="Name this research session…"
                        className="h-8 text-xs bg-background/60 border-border/50 focus:border-emerald-500/50 rounded-lg flex-1"
                        onBlur={() => {
                          if (messages.length >= 2) saveSession(messages, sessionName, savedStudyId);
                        }}
                      />
                      <div className="flex items-center gap-1 text-[11px] shrink-0">
                        {isSaving ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                          </span>
                        ) : justSaved ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Check className="h-3 w-3" /> Saved
                          </span>
                        ) : savedStudyId ? (
                          <span className="text-muted-foreground/60 flex items-center gap-1">
                            <Save className="h-3 w-3" /> Auto-saved
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Ask about verses, Greek words, commentaries, connections..."
                        className="min-h-[48px] max-h-[120px] bg-background/60 border-border/60 text-sm pr-24 resize-none rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <div className="absolute right-2 bottom-2 flex items-center gap-1">
                        <VoiceInput onTranscript={handleVoiceTranscript} variant="icon" />
                        <Button
                          size="icon"
                          disabled={!input.trim() || isLoading}
                          onClick={() => sendQuery(input)}
                          className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/20"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {messages.length > 0 && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearChat}
                          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground h-6"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Clear conversation
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── FREESTYLE TAB ── */}
              {activeTab === "freestyle" && (
                <div className="space-y-4">
                  {/* Input Area */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        ref={freestyleTextareaRef}
                        placeholder={"Enter your thoughts, concepts, and Bible texts — one per line:\n\nExample:\nJohn 3:16\nThe concept of adoption into God's family\nRomans 8:15\nEphesians 1:5\nHow does grace transform identity?\nThe prodigal son as adoption story"}
                        className="min-h-[140px] max-h-[200px] bg-background/60 border-border/60 text-sm pr-12 resize-none rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                        value={freestyleInput}
                        onChange={(e) => setFreestyleInput(e.target.value)}
                        disabled={freestyleIsLoading}
                      />
                      <div className="absolute right-2 bottom-2">
                        <VoiceInput onTranscript={handleFreestyleVoiceTranscript} variant="icon" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => generateFreestyle(false)}
                        disabled={!freestyleInput.trim() || freestyleIsLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                      >
                        {freestyleIsLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        {freestyleIsLoading ? "Weaving study…" : "Generate Study"}
                      </Button>
                      {freestyleOutput && (
                        <Button
                          onClick={() => generateFreestyle(true)}
                          disabled={freestyleIsLoading}
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Remix
                          {freestyleRemixCount > 0 && (
                            <span className="ml-1 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-full">
                              #{freestyleRemixCount}
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Output Area */}
                  {freestyleIsLoading && !freestyleOutput && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex gap-1.5 mb-3">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <p className="text-sm text-emerald-400/70">Weaving your study together…</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a moment for deep studies</p>
                    </div>
                  )}

                  {freestyleOutput && (
                    <div className="space-y-3">
                      {/* Save Controls */}
                      <div className="flex items-center gap-2">
                        <Input
                          value={freestyleSessionName}
                          onChange={(e) => setFreestyleSessionName(e.target.value)}
                          placeholder="Name this freestyle study…"
                          className="h-8 text-xs bg-background/60 border-border/50 focus:border-emerald-500/50 rounded-lg flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={saveFreestyleStudy}
                          disabled={isSaving}
                          className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {isSaving ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : justSaved ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Save className="h-3 w-3 mr-1" />
                          )}
                          {justSaved ? "Saved" : "Save"}
                        </Button>
                        <QuickAudioButton
                          text={freestyleOutput}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                        />
                      </div>

                      {/* Rendered Output */}
                      <div
                        className={`rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 to-black/10 dark:from-emerald-950/20 dark:to-black/20 overflow-y-auto p-5 ${
                          isMobile ? "max-h-[400px]" : "max-h-[500px]"
                        }`}
                      >
                        <div className="text-[13px] leading-relaxed text-foreground/90">
                          {formatJeevesResponse(freestyleOutput)}
                        </div>
                      </div>

                      {/* Clear Button */}
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFreestyle}
                          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground h-6"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Clear freestyle
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!freestyleOutput && !freestyleIsLoading && (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-6">
                      <div className="relative mb-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <Wand2 className="h-8 w-8 text-emerald-500/50" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400/60" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground/70 mb-1">
                        Freestyle Bible Study Weaver
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                        Enter a mix of Bible verses, theological concepts, and questions above.
                        Jeeves will weave them into a deep, interconnected study with surprising connections.
                        Hit "Remix" for a fresh angle on the same inputs.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── GENEALOGY DECODER TAB ── */}
              {activeTab === "genealogy" && (
                <div className="space-y-4">
                  {/* Quick Examples */}
                  <div className={isMobile ? "overflow-x-auto -mx-4 px-4 pb-1" : ""}>
                    <div className={`flex gap-2 ${isMobile ? "min-w-max" : "flex-wrap"}`}>
                      {GENEALOGY_EXAMPLES.map((ex) => (
                        <Badge
                          key={ex.ref}
                          variant="outline"
                          className="cursor-pointer py-1.5 px-3 text-[11px] transition-all whitespace-nowrap text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                          onClick={() => setGenealogyInput(ex.ref)}
                        >
                          <Dna className="h-3 w-3 mr-1.5 shrink-0" />
                          {ex.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder={"Enter a name or genealogy reference:\n\nExamples:\n• Jabez — who is he and what's in his lineage?\n• Rahab — from Jericho to Christ's line\n• Matthew 1:1-17 (Christ's lineage)\n• Genesis 4-5 (Cain vs Seth)"}
                      className="min-h-[100px] max-h-[160px] bg-background/60 border-border/60 text-sm resize-none rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20"
                      value={genealogyInput}
                      onChange={(e) => setGenealogyInput(e.target.value)}
                      disabled={genealogyIsLoading}
                    />
                    <Button
                      onClick={decodeGenealogy}
                      disabled={!genealogyInput.trim() || genealogyIsLoading}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-600/20"
                    >
                      {genealogyIsLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Dna className="h-4 w-4 mr-2" />
                      )}
                      {genealogyIsLoading ? "Decoding lineage…" : "Decode Genealogy"}
                    </Button>
                  </div>

                  {/* Loading State */}
                  {genealogyIsLoading && !genealogyOutput && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex gap-1.5 mb-3">
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <p className="text-sm text-amber-400/70">Decoding the bloodline…</p>
                      <p className="text-xs text-muted-foreground mt-1">Analyzing seed wars, patterns, and PT room connections</p>
                    </div>
                  )}

                  {/* Output */}
                  {genealogyOutput && (
                    <div className="space-y-3">
                      {/* Save Controls */}
                      <div className="flex items-center gap-2">
                        <Input
                          value={genealogySessionName}
                          onChange={(e) => setGenealogySessionName(e.target.value)}
                          placeholder="Name this genealogy study…"
                          className="h-8 text-xs bg-background/60 border-border/50 focus:border-amber-500/50 rounded-lg flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={saveGenealogyStudy}
                          disabled={isSaving}
                          className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {isSaving ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : justSaved ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Save className="h-3 w-3 mr-1" />
                          )}
                          {justSaved ? "Saved" : "Save"}
                        </Button>
                        <QuickAudioButton
                          text={genealogyOutput}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                        />
                      </div>

                      {/* Rendered Output */}
                      <div
                        className={`rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/10 to-black/10 dark:from-amber-950/20 dark:to-black/20 overflow-y-auto p-5 ${
                          isMobile ? "max-h-[400px]" : "max-h-[500px]"
                        }`}
                      >
                        <div className="text-[13px] leading-relaxed text-foreground/90">
                          {formatJeevesResponse(genealogyOutput)}
                        </div>
                      </div>

                      {/* Clear Button */}
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearGenealogy}
                          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground h-6"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Clear genealogy
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!genealogyOutput && !genealogyIsLoading && (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-6">
                      <div className="relative mb-4">
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                          <Dna className="h-8 w-8 text-amber-500/50" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-red-500/15 border border-red-500/25">
                          <Sparkles className="h-3.5 w-3.5 text-red-400/60" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground/70 mb-1">
                        Genealogy Decoder
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                        Enter a genealogy reference and Jeeves will decode it using PT principles — 
                        Seed War analysis, Claim Ladder, PT Room Breakdown, and Gems.
                        Genealogies aren't lists — they're theological architecture.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
