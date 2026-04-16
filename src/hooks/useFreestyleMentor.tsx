import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FreestyleMessage {
  role: "user" | "assistant";
  content: string;
  tags?: string[];
  timestamp: Date;
  streaming?: boolean;
}

export type ExitCommand = 
  | "stabilize" 
  | "gem" 
  | "which_room" 
  | "is_dangerous" 
  | "where_break";

export const useFreestyleMentor = () => {
  const [messages, setMessages] = useState<FreestyleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    userMessage: string, 
    exitCommand?: ExitCommand
  ) => {
    const newUserMsg: FreestyleMessage = { 
      role: "user", 
      content: userMessage,
      timestamp: new Date()
    };
    
    // Add user message + empty streaming assistant placeholder
    const streamingMsg: FreestyleMessage = {
      role: "assistant",
      content: "",
      tags: [],
      timestamp: new Date(),
      streaming: true,
    };

    setMessages(prev => [...prev, newUserMsg, streamingMsg]);
    setIsLoading(true);

    try {
      // Get user profile for personalization
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = profile?.display_name || null;

      const exitCommandText = exitCommand ? {
        stabilize: "Stabilize this",
        gem: "Turn this into a Gem",
        which_room: "Which room owns this?",
        is_dangerous: "Is this dangerous?",
        where_break: "Where could this break?"
      }[exitCommand] : null;

      // Build messages array for API (excluding the empty streaming placeholder)
      const allMessages = [...messages, newUserMsg];

      // Get Supabase session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

      const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'tdjtumtdkjicnhlpqqzd';
      const functionUrl = `https://${projectRef}.supabase.co/functions/v1/freestyle-mentor`;

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          userName,
          exitCommand: exitCommandText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream")) {
        // Handle SSE streaming
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));

              if (json.chunk) {
                accumulated += json.chunk;
                // Update the streaming message in real-time
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (updated[lastIdx]?.streaming) {
                    updated[lastIdx] = { ...updated[lastIdx], content: accumulated };
                  }
                  return updated;
                });
              }

              if (json.done) {
                // Finalize the message
                const tags = json.tags || [];
                // Clean tag markers from content
                const tagPatterns = ["EMERGING_PATTERN", "CROSS_ROOM_ECHO", "GENTLE_TENSION", "UNRESOLVED_THREAD", "STRONG_ALIGNMENT"];
                let cleaned = accumulated;
                tagPatterns.forEach(t => { cleaned = cleaned.replace(`[${t}]`, "").trim(); });

                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (updated[lastIdx]?.streaming) {
                    updated[lastIdx] = {
                      role: "assistant",
                      content: cleaned,
                      tags,
                      timestamp: new Date(),
                      streaming: false,
                    };
                  }
                  return updated;
                });
              }

              if (json.error) {
                throw new Error(json.error);
              }
            } catch (parseErr) {
              // skip malformed SSE chunks
            }
          }
        }
      } else {
        // Fallback: handle as regular JSON
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (data.response) {
          setMessages(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx]?.streaming) {
              updated[lastIdx] = {
                role: "assistant",
                content: data.response,
                tags: data.tags || [],
                timestamp: new Date(),
                streaming: false,
              };
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Freestyle mentor error:", error);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.streaming) {
          updated[lastIdx] = {
            role: "assistant",
            content: "I'm having trouble connecting right now. Let's try that again in a moment.",
            timestamp: new Date(),
            streaming: false,
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
