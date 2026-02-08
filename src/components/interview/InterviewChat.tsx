"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Square, Sparkles } from "lucide-react";
import type { Message, GuideSection } from "@/types";

interface InterviewChatProps {
  interviewId: string;
  participantName: string;
  initialMessages: Message[];
  sections: GuideSection[];
  onEnd: () => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lumora-100">
        <Sparkles className="h-4 w-4 text-lumora-600" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-lumora-50 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-lumora-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-lumora-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-lumora-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function InterviewChat({
  interviewId,
  participantName,
  initialMessages,
  sections,
  onEnd,
}: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [sending]);

  // Estimate which section we're on based on message count
  const totalSections = sections.length || 1;
  const aiMessageCount = messages.filter((m) => m.role === "ai").length;
  const questionsPerSection = 3;
  const currentSection = Math.min(
    Math.ceil(aiMessageCount / questionsPerSection),
    totalSections
  );
  const progress = Math.min((currentSection / totalSections) * 100, 100);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/interview/${interviewId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages((prev) => [...prev, data.userMessage, data.aiMessage]);
    } catch {
      // On error, still show the user message so they know it was attempted
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "participant",
          content: text,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function handleEnd() {
    setEnding(true);
    try {
      await fetch(`/api/interview/${interviewId}/end`, { method: "POST" });
      onEnd();
    } catch {
      setEnding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Interview with {participantName}
            </h2>
            <p className="text-xs text-gray-500">
              {sections.length > 0
                ? `Section ${currentSection} of ${totalSections}`
                : "In progress"}
            </p>
          </div>
          <button
            onClick={handleEnd}
            disabled={ending}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Square className="h-3 w-3" />
            {ending ? "Ending..." : "End Interview"}
          </button>
        </div>

        {/* Progress bar */}
        {sections.length > 0 && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-lumora-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "participant" ? "flex-row-reverse" : ""
              }`}
            >
              {message.role === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lumora-100">
                  <Sparkles className="h-4 w-4 text-lumora-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "ai"
                    ? "rounded-tl-sm bg-lumora-50 text-gray-800"
                    : "rounded-tr-sm bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {sending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            disabled={sending}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-lumora-400 focus:ring-2 focus:ring-lumora-100 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lumora-600 text-white transition-colors hover:bg-lumora-700 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
