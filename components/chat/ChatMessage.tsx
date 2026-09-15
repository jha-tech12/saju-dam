"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

const STREAM_CHARS_PER_SECOND = 9;
const CATCHUP_CHARS_PER_SECOND = 22;

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h3 className="mb-2 mt-3 font-serif text-base text-gold">{children}</h3>
        ),
        h2: ({ children }) => (
          <h3 className="mb-2 mt-3 font-serif text-base text-gold">{children}</h3>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-3 font-semibold text-gold">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-ivory">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-2 pl-4">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ChatMessage({
  content,
  role,
  isStreaming = false,
}: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState(content);
  const displayedRef = useRef(content);
  const targetRef = useRef(content);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const streamingRef = useRef(isStreaming);

  useEffect(() => {
    targetRef.current = content;
  }, [content]);

  useEffect(() => {
    streamingRef.current = isStreaming;
  }, [isStreaming]);

  useEffect(() => {
    if (role === "user") {
      displayedRef.current = content;
      setDisplayedContent(content);
      return;
    }

    if (!isStreaming) {
      cancelAnimationFrame(rafRef.current);

      const current = displayedRef.current;
      if (current.length >= content.length) {
        displayedRef.current = content;
        setDisplayedContent(content);
        return;
      }

      lastTimeRef.current = 0;

      const catchUp = (timestamp: number) => {
        if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp;
        }

        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const target = targetRef.current;
        const nextLength = Math.min(
          displayedRef.current.length +
            Math.max(1, Math.round(delta * CATCHUP_CHARS_PER_SECOND)),
          target.length,
        );
        const next = target.slice(0, nextLength);
        displayedRef.current = next;
        setDisplayedContent(next);

        if (nextLength < target.length) {
          rafRef.current = requestAnimationFrame(catchUp);
        }
      };

      rafRef.current = requestAnimationFrame(catchUp);
      return () => cancelAnimationFrame(rafRef.current);
    }

    if (content.length < displayedRef.current.length) {
      displayedRef.current = content;
      setDisplayedContent(content);
    }

    lastTimeRef.current = 0;

    const reveal = (timestamp: number) => {
      if (!streamingRef.current) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const target = targetRef.current;
      if (displayedRef.current.length >= target.length) {
        rafRef.current = requestAnimationFrame(reveal);
        return;
      }

      const nextLength = Math.min(
        displayedRef.current.length +
          Math.max(1, Math.round(delta * STREAM_CHARS_PER_SECOND)),
        target.length,
      );
      const next = target.slice(0, nextLength);
      displayedRef.current = next;
      setDisplayedContent(next);
      rafRef.current = requestAnimationFrame(reveal);
    };

    rafRef.current = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(rafRef.current);
  }, [content, role, isStreaming]);

  if (role === "user") {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  return <MarkdownContent content={displayedContent} />;
}
