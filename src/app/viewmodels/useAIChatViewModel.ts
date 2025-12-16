import { useState } from "react";
import { toast } from "sonner";
import { askAI } from "../../data/remotes/chatRemote";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export function useAIChatViewModel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askAI(text);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.aiResponse,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      toast.error(error.message || "Không thể gửi tin nhắn");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    resetChat,
  };
}
