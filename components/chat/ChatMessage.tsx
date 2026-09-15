import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export function ChatMessage({ content, role }: ChatMessageProps) {
  if (role === "user") {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

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
