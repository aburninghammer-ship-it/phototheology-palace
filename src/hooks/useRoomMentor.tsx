import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useRoomMentor = (roomId: string, roomName: string, masteryLevel: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    const newUserMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setIsStreaming(true);

    let assistantContent = "";

    try {
      const { data, error } = await supabase.functions.invoke("room-mentor", {
        body: {
          messages: [...messages, newUserMsg],
          roomId,
          roomName,
          masteryLevel,
        },
      });

      if (error) throw error;

      // For non-streaming response
      if (data?.response) {
        assistantContent = data.response;
        setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
      }
    } catch (error) {
      console.error("Room mentor error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, roomId, roomName, masteryLevel]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
  };
};
