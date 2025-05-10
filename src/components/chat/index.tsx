"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, FileUp, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/util/tailwind";
import { SearchBar } from "@/components/document/search-bar";

const initialMessages = [
  {
    id: "1",
    content: "Hello! How can I help you with your technical documents today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000 * 5),
  },
];

export function Chat({ chatId }: { chatId: string }) {
  console.log(chatId);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I help you with your technical documents today?";
    }

    if (input.includes("documentation") || input.includes("api")) {
      return "I can help you search through your API documentation. What specific information are you looking for?";
    }

    if (input.includes("search") || input.includes("find")) {
      return "I can search through all your uploaded documents. Please specify what you're looking for, or ask me a question about your technical content.";
    }

    return "I'm analyzing your documents to find the most relevant information. Could you provide more details about what you're looking for?";
  };

  return (
    <div className="container max-w-screen-2xl overflow-hidden h-[calc(100vh-4rem)] flex flex-col pt-6 pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium mb-1">Chat with Your Documents</h1>
        <p className="text-muted-foreground">
          Ask questions and get answers from your technical documentation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="flex flex-col md:col-span-2 bg-card rounded-xl border shadow-subtle overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%] animate-slide-in",
                  message.sender === "user"
                    ? "ml-auto items-end"
                    : "mr-auto items-start",
                )}
              >
                <div
                  className={cn(
                    "px-4 py-2 rounded-2xl",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary text-secondary-foreground rounded-tl-none",
                  )}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex max-w-[80%] mr-auto">
                <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="rounded-full transition-all"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col border rounded-xl shadow-subtle">
          <div className="p-4 border-b">
            <h3 className="font-medium">Referenced Documents</h3>
            <p className="text-sm text-muted-foreground">
              Documents used to answer your questions
            </p>
            <div className="mt-3">
              <SearchBar placeholder="Filter documents..." className="w-full" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start p-3 rounded-lg border hover:border-primary/20 hover:bg-accent/10 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center mr-3 flex-shrink-0">
                    <FileUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      Technical Document {i}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last accessed 2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
