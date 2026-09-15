"use client";

import { useChat } from "ai/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import {
  COUNSELOR_LABELS,
  RECOMMENDED_QUESTIONS,
  TOPIC_LABELS,
} from "@/lib/constants";
import type { SajuResult } from "@/lib/saju/types";

function formatChatError(message?: string) {
  if (!message) return "상담 중 오류가 발생했습니다.";
  try {
    const parsed = JSON.parse(message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // not JSON
  }
  return message;
}

interface ChatInterfaceProps {
  saju: SajuResult;
  topic: "basic" | "love" | "career";
  counselor: "cold" | "warm";
}

export function ChatInterface({ saju, topic, counselor }: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    ...RECOMMENDED_QUESTIONS[topic],
  ]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const lastFetchedRef = useRef<string>("");

  const { messages, append, isLoading, error } = useChat({
    api: "/api/chat",
    body: { saju, counselor, topic },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `${saju.birth.name}님, ${TOPIC_LABELS[topic]} 상담을 시작합니다. ${COUNSELOR_LABELS[counselor]}가 명식을 바탕으로 답변드릴게요. 궁금한 점을 편하게 물어보세요.`,
      },
    ],
  });

  const askedQuestions = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user")
        .map((m) => m.content.trim()),
    [messages],
  );

  const fetchSuggestions = useCallback(async () => {
    const chatMessages = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    if (chatMessages.length < 2) return;

    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.id !== "welcome");
    if (!lastAssistant) return;

    const fetchKey = `${lastAssistant.id}-${lastAssistant.content.length}`;
    if (lastFetchedRef.current === fetchKey) return;
    lastFetchedRef.current = fetchKey;

    setLoadingSuggestions(true);
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saju,
          topic,
          messages: chatMessages,
          askedQuestions,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { questions?: string[] };
        if (data.questions && data.questions.length > 0) {
          setSuggestedQuestions(data.questions);
        }
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }, [messages, saju, topic, askedQuestions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (isLoading) return;

    const hasUserMessage = messages.some((m) => m.role === "user");
    const lastMessage = messages[messages.length - 1];

    if (hasUserMessage && lastMessage?.role === "assistant") {
      fetchSuggestions();
    }
  }, [isLoading, lastMessageId, fetchSuggestions, messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    setInput("");
    await append({ role: "user", content: text.trim() });
  }

  const visibleQuestions = suggestedQuestions.filter(
    (q) => !askedQuestions.includes(q),
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <div className="mb-4 flex items-center gap-3 border-b border-gold/10 pb-4">
        <Link
          href={`/consult/${topic}`}
          className="text-ivory/60 hover:text-gold"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs text-gold/70">{TOPIC_LABELS[topic]}</p>
          <h1 className="font-medium text-ivory">
            {COUNSELOR_LABELS[counselor]}
          </h1>
          <p className="text-xs text-ivory/50">명식 기반 상담</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "chat-bubble-user text-ivory"
                  : "chat-bubble-ai text-ivory/90"
              }`}
            >
              <ChatMessage
                content={message.content}
                role={message.role === "user" ? "user" : "assistant"}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <p className="text-sm text-ivory/40">답변을 작성하고 있습니다...</p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            {formatChatError(error.message)}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t border-gold/10 bg-navy pt-4">
        <p className="mb-2 text-xs text-ivory/50">
          이어서 궁금한 것
          {loadingSuggestions && (
            <span className="ml-2 text-ivory/30">추천 질문 생성 중...</span>
          )}
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {visibleQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question)}
              disabled={isLoading || loadingSuggestions}
              className="rounded-full border border-gold/20 px-3 py-1.5 text-xs text-ivory/70 transition hover:border-gold/50 hover:text-gold disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="직접 질문하기..."
            className="flex-1 rounded-full bg-navy-light px-4 py-3 text-sm text-ivory outline-none focus:ring-1 focus:ring-gold/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy transition hover:bg-gold-dark disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
