import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { AnyNodeData, AIMapAnalysis } from './types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MindMapJeevesChatProps {
  isOpen: boolean;
  onClose: () => void;
  sourceText: string;
  selectedNode: AnyNodeData | null;
  currentAnalysis: AIMapAnalysis | null;
}

// Quick question suggestions based on context
const QUICK_QUESTIONS = [
  { icon: Lightbulb, text: "What's the main theme here?" },
  { icon: Sparkles, text: "How does this connect to Christ?" },
  { icon: Bot, text: "Explain this in simpler terms" },
  { icon: Lightbulb, text: "What are practical applications?" },
];

export default function MindMapJeevesChat({
  isOpen,
  onClose,
  sourceText,
  selectedNode,
  currentAnalysis,
}: MindMapJeevesChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Build context for Jeeves
  const buildContext = useCallback(() => {
    let context = `The user is exploring a Mind Map of the following text:\n\n"${sourceText.substring(0, 500)}${sourceText.length > 500 ? '...' : ''}"\n\n`;

    if (currentAnalysis) {
      context += `Overall Theme: ${currentAnalysis.overallTheme}\n\n`;
    }

    if (selectedNode) {
      context += `Currently selected node:\n`;
      switch (selectedNode.type) {
        case 'floor':
          context += `- Floor ${selectedNode.floorNumber}: ${selectedNode.floorName}\n`;
          context += `- ${selectedNode.subtitle}\n`;
          break;
        case 'room':
          context += `- Room: ${selectedNode.roomName} (${selectedNode.roomTag})\n`;
          context += `- Core Question: ${selectedNode.coreQuestion}\n`;
          if (selectedNode.principles?.length) {
            context += `- Insights found: ${selectedNode.principles.length}\n`;
            context += `- First insight: ${selectedNode.principles[0].content}\n`;
          }
          break;
        case 'principle':
          context += `- Principle: ${selectedNode.content}\n`;
          context += `- Insight: ${selectedNode.insight}\n`;
          context += `- Visual Hook: ${selectedNode.visualHook}\n`;
          break;
        case 'sanctuary-element':
          context += `- Sanctuary Element: ${selectedNode.elementName}\n`;
          context += `- Christ Connection: ${selectedNode.christConnection}\n`;
          break;
      }
    }

    return context;
  }, [sourceText, currentAnalysis, selectedNode]);

  const handleSend = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = buildContext();

      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          message: text,
          context: context,
          systemPrompt: `You are Jeeves, the Phototheology AI assistant. The user is studying a Mind Map visualization of biblical/spiritual text.

Help them understand the insights, make connections, and apply the teachings. Be warm, scholarly, and Christ-centered in your responses.
Keep responses concise (2-3 paragraphs max) unless they ask for more detail.

Context about what they're studying:
${context}`,
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.response || data?.message || "I apologize, but I couldn't process that request. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Jeeves chat error:', err);

      // Fallback response for development
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `That's a wonderful question about the Mind Map!

Based on what you're exploring, I can see rich theological connections. The Phototheology framework helps us see how every passage points to Christ and His redemptive work.

Would you like me to elaborate on any specific aspect of the insights shown in the map?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, buildContext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-6 z-40 w-[380px] h-[500px] max-h-[70vh]
                     bg-card/95 backdrop-blur-lg border border-white/20 rounded-2xl
                     shadow-2xl shadow-primary/20 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10
                          bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent
                              flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ask Jeeves</h3>
                <p className="text-xs text-muted-foreground">Your Mind Map Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground
                         hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <Bot className="w-12 h-12 mx-auto text-primary/40 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Ask me anything about your Mind Map!
                </p>
                <div className="space-y-2">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q.text)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg
                                 bg-white/5 hover:bg-white/10 border border-white/10
                                 text-sm text-muted-foreground hover:text-foreground
                                 transition-colors text-left"
                    >
                      <q.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent
                                    flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-white/10 text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/20
                                    flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent
                                flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Jeeves is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this Mind Map..."
                rows={1}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                           text-sm text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                           resize-none"
                style={{ minHeight: '42px', maxHeight: '100px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="px-4 rounded-xl bg-primary text-primary-foreground
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
