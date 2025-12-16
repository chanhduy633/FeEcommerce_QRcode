import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Bot, User } from "lucide-react";
import { useAIChatViewModel } from "../../../viewmodels/useAIChatViewModel";

const AIChatbox: React.FC = () => {
  const { messages, loading, sendMessage } = useAIChatViewModel();

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 cursor-pointer bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full p-5 shadow-2xl hover:shadow-purple-500/50 hover:scale-110 hover:rotate-12 transition-all duration-500 z-30 group animate-pulse-slow"
          aria-label="Mở chat AI"
        >
          {/* Animated rings around button */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-75 group-hover:animate-ping"></span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 animate-pulse"></span>
          
          {/* Robot Icon */}
          <div className="relative z-10">
            <Bot size={24} className="drop-shadow-lg group-hover:animate-bounce" />
          </div>
          
          {/* AI Badge with glow */}
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg animate-bounce border-2 border-white">
            AI
          </span>
          
          {/* Sparkle effects */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
          <span className="absolute bottom-0 left-0 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.2s' }}></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-80 h-[520px] bg-white border-2 border-gray-200 rounded-2xl shadow-2xl flex flex-col z-30 overflow-hidden animate-slideIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Trợ lý AI</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-100">Đang hoạt động</p>
                </div>
              </div>
            </div>

            <button
              onClick={toggleChat}
              className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition"
              aria-label="Đóng chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot size={48} className="mx-auto mb-4 text-blue-600" />
                <p className="font-semibold mb-2">Xin chào! 👋</p>
                <p className="text-sm">Tôi có thể giúp bạn tìm sản phẩm công nghệ phù hợp.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gray-800 text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Bot size={18} />
                </div>
                <div className="bg-white border rounded-2xl px-5 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                aria-label="Gửi tin nhắn"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbox;
