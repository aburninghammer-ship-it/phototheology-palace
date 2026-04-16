import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Send,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Palette,
  Maximize2,
  Edit3,
  Check,
  X,
} from "lucide-react";
import type { SlideContent, SlideDeck } from "@/types/sermonPPT";

interface SlideEditorProps {
  deck: SlideDeck;
  onDeckUpdate: (deck: SlideDeck) => void;
  onClose?: () => void;
}

// Simple slide preview component
function SlidePreview({ slide, isActive }: { slide: SlideContent; isActive: boolean }) {
  const getMoodColors = (mood?: string) => {
    switch (mood) {
      case "dark": return { bg: "bg-gray-900", text: "text-white" };
      case "warm": return { bg: "bg-amber-50", text: "text-amber-900" };
      case "cool": return { bg: "bg-sky-50", text: "text-sky-900" };
      default: return { bg: "bg-white", text: "text-gray-900" };
    }
  };

  const colors = getMoodColors(slide.visualStyle?.mood);

  return (
    <div
      className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${
        isActive ? "border-purple-500 ring-2 ring-purple-500/30" : "border-gray-200"
      } ${colors.bg}`}
    >
      {slide.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
      )}
      <div className={`p-3 h-full flex flex-col justify-center relative ${colors.text}`}>
        {slide.type && (
          <div className="text-[8px] uppercase tracking-wider opacity-50 mb-1">
            {slide.type.replace("_", " ")}
          </div>
        )}
        {slide.title && (
          <div className="text-sm font-bold truncate">{slide.title}</div>
        )}
        {slide.body && (
          <div className="text-[10px] mt-1 line-clamp-2 opacity-80">{slide.body}</div>
        )}
        {slide.scripture?.reference && (
          <div className="text-[9px] italic mt-1 text-purple-600">{slide.scripture.reference}</div>
        )}
        {slide.bullets && slide.bullets.length > 0 && (
          <div className="text-[9px] mt-1 space-y-0.5">
            {slide.bullets.slice(0, 2).map((b, i) => (
              <div key={i} className="truncate">• {b}</div>
            ))}
            {slide.bullets.length > 2 && (
              <div className="opacity-50">+{slide.bullets.length - 2} more</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideEditor({ deck, onDeckUpdate, onClose }: SlideEditorProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const activeSlide = deck.slides[activeSlideIndex];

  // Refine a slide with AI
  const handleRefineSlide = async (instruction: string) => {
    if (!instruction.trim() || isRefining) return;

    setIsRefining(true);
    setChatHistory(prev => [...prev, { role: "user", content: instruction }]);
    setChatInput("");

    try {
      const { data, error } = await supabase.functions.invoke("refine-slide", {
        body: {
          slide: activeSlide,
          instruction,
          context: {
            sermonTitle: deck.metadata.sermonTitle,
            themePassage: deck.metadata.themePassage,
          },
        },
      });

      if (error) throw error;

      // Update the slide in the deck
      const newSlides = [...deck.slides];
      newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        ...data,
      };

      onDeckUpdate({ ...deck, slides: newSlides });

      const designNote = data.designNotes || "Slide updated successfully";
      setChatHistory(prev => [...prev, { role: "assistant", content: designNote }]);

      // If AI suggests generating an image, offer to do so
      if (data.imagePrompt) {
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", content: `💡 Would you like me to generate an image? Suggested: "${data.imagePrompt}"` },
        ]);
      }

      toast.success("Slide refined!");
    } catch (error) {
      console.error("Error refining slide:", error);
      toast.error("Failed to refine slide");
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't refine that. Try again?" }]);
    } finally {
      setIsRefining(false);
    }
  };

  // Generate an image for the slide
  const handleGenerateImage = async (customPrompt?: string) => {
    setIsGeneratingImage(true);

    try {
      // Build a prompt from slide content or use custom
      const prompt = customPrompt || 
        `${activeSlide.title || ""} ${activeSlide.body || ""} ${activeSlide.scripture?.reference || ""}`.trim() ||
        "Abstract spiritual background for presentation";

      const { data, error } = await supabase.functions.invoke("generate-slide-image", {
        body: {
          prompt,
          slideType: activeSlide.type,
          mood: activeSlide.visualStyle?.mood || "neutral",
          style: activeSlide.visualStyle?.emphasis || "elegant",
        },
      });

      if (error) throw error;

      // Update slide with image
      const newSlides = [...deck.slides];
      newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        imageUrl: data.imageUrl,
      };

      onDeckUpdate({ ...deck, slides: newSlides });
      setChatHistory(prev => [...prev, { role: "assistant", content: "✨ Image generated and added to slide!" }]);
      toast.success("Image generated!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "Add image", icon: ImageIcon, action: () => handleGenerateImage() },
    { label: "More dramatic", icon: Sparkles, action: () => handleRefineSlide("Make this slide more dramatic and impactful") },
    { label: "Simplify", icon: Edit3, action: () => handleRefineSlide("Simplify the text, make it more concise") },
    { label: "Different style", icon: Palette, action: () => handleRefineSlide("Try a different visual style") },
  ];

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Left: Slide Filmstrip */}
      <div className="w-48 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Slides</h3>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {deck.slides.map((slide, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSlideIndex(index)}
                className="cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 w-4 text-right">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <SlidePreview slide={slide} isActive={index === activeSlideIndex} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Main Preview */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              disabled={activeSlideIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {activeSlideIndex + 1} / {deck.slides.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveSlideIndex(Math.min(deck.slides.length - 1, activeSlideIndex + 1))}
              disabled={activeSlideIndex === deck.slides.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={action.action}
                disabled={isRefining || isGeneratingImage}
                className="gap-1.5 text-xs"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Large Slide Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <motion.div
            key={activeSlideIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl aspect-video rounded-lg shadow-2xl overflow-hidden"
          >
            <LargeSlidePreview slide={activeSlide} />
          </motion.div>
        </div>
      </div>

      {/* Right: Chat Refinement */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            AI Assistant
          </h3>
          <p className="text-xs text-gray-500 mt-1">Chat to refine this slide</p>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {chatHistory.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Ask me to refine this slide!</p>
                <p className="text-xs mt-1">Try: "Make it more dramatic" or "Add an image"</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-purple-100 dark:bg-purple-900/30 ml-4"
                    : "bg-gray-100 dark:bg-gray-700 mr-4"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {(isRefining || isGeneratingImage) && (
              <div className="flex items-center gap-2 text-sm text-gray-500 p-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isGeneratingImage ? "Generating image..." : "Thinking..."}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRefineSlide(chatInput);
            }}
            className="flex gap-2"
          >
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="How should I change this slide?"
              disabled={isRefining}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isRefining || !chatInput.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Large preview for the center panel
function LargeSlidePreview({ slide }: { slide: SlideContent }) {
  const getMoodStyles = (mood?: string) => {
    switch (mood) {
      case "dark": return { bg: "bg-gray-900", text: "text-white", accent: "text-purple-400" };
      case "warm": return { bg: "bg-gradient-to-br from-amber-50 to-orange-50", text: "text-amber-900", accent: "text-amber-600" };
      case "cool": return { bg: "bg-gradient-to-br from-sky-50 to-blue-50", text: "text-sky-900", accent: "text-sky-600" };
      default: return { bg: "bg-white", text: "text-gray-900", accent: "text-purple-600" };
    }
  };

  const styles = getMoodStyles(slide.visualStyle?.mood);
  const isDramatic = slide.visualStyle?.emphasis === "dramatic" || slide.type === "BIG_IDEA";

  return (
    <div className={`w-full h-full relative ${styles.bg}`}>
      {/* Background Image */}
      {slide.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-center items-center p-8 ${slide.imageUrl ? "text-white" : styles.text}`}>
        {/* Type badge */}
        <div className={`absolute top-4 left-4 text-xs uppercase tracking-widest opacity-50 ${slide.imageUrl ? "" : styles.accent}`}>
          {slide.type?.replace("_", " ")}
        </div>

        {/* Title */}
        {slide.title && (
          <h2 className={`font-bold text-center mb-4 ${isDramatic ? "text-4xl" : "text-2xl"}`}>
            {slide.title}
          </h2>
        )}

        {/* Subtitle */}
        {slide.subtitle && (
          <p className={`text-lg opacity-80 text-center mb-4 ${slide.imageUrl ? "" : styles.accent}`}>
            {slide.subtitle}
          </p>
        )}

        {/* Scripture */}
        {slide.scripture && (
          <div className="text-center max-w-2xl">
            <p className={`text-lg italic mb-2 ${slide.imageUrl ? "" : styles.accent}`}>
              {slide.scripture.reference}
            </p>
            <p className="text-xl leading-relaxed">{slide.scripture.text}</p>
          </div>
        )}

        {/* Body */}
        {slide.body && !slide.scripture && (
          <p className={`text-center max-w-2xl ${isDramatic ? "text-2xl font-semibold" : "text-lg"}`}>
            {slide.body}
          </p>
        )}

        {/* Bullets */}
        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-2 text-lg">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={styles.accent}>•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Quote */}
        {slide.quote && (
          <div className="text-center max-w-2xl">
            <p className="text-2xl italic mb-4">"{slide.quote.text}"</p>
            {slide.quote.attribution && (
              <p className={`text-sm opacity-70 ${styles.accent}`}>— {slide.quote.attribution}</p>
            )}
          </div>
        )}

        {/* Numbering badge */}
        {slide.numbering && (
          <div className="absolute bottom-4 right-4 text-xs opacity-50">
            {slide.numbering.label || `${slide.numbering.current} of ${slide.numbering.total}`}
          </div>
        )}
      </div>
    </div>
  );
}
