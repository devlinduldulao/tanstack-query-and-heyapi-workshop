import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExternalLink } from "lucide-react";

type Props = {
  content: string;
};

export function MarkdownRenderer({ content }: Props) {
  const components: Components = {
    h1: ({ children, ...p }) => (
      <h1 className="mt-8 mb-4 text-2xl font-bold first:mt-0" {...p}>
        {children}
      </h1>
    ),
    h2: ({ children, ...p }) => (
      <h2 className="mt-6 mb-3 text-xl font-semibold first:mt-0" {...p}>
        {children}
      </h2>
    ),
    h3: ({ children, ...p }) => (
      <h3 className="mt-4 mb-2 text-lg font-semibold first:mt-0" {...p}>
        {children}
      </h3>
    ),
    p: ({ children, ...p }) => (
      <p className="mb-3 text-sm leading-relaxed" {...p}>
        {children}
      </p>
    ),
    a: ({ href, children, ...p }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80"
          {...p}
        >
          {children}
          {isExternal && <ExternalLink className="h-3 w-3" />}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children, className }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      return match ? (
        <div className="my-4">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
              padding: "1rem",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{children}</code>
      );
    },
    ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6 text-sm">{children}</ul>,
    ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-sm">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <div className="bg-accent/40 border-primary my-4 rounded-r-lg border-l-4 p-4 text-sm italic [&>*:last-child]:mb-0">
        {children}
      </div>
    ),
    hr: () => <hr className="border-border my-6 border-t" />,
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="border-border w-full border-collapse overflow-hidden rounded-lg border">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="border-border bg-muted border px-3 py-2 text-sm font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-border border px-3 py-2 text-sm">{children}</td>,
  };

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
