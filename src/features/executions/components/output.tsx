"use client"; // needed if the parent page uses state/hooks; harmless otherwise

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function extractText(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (output && typeof output === "object") {
    const obj = output as Record<string, unknown>;
    if (typeof obj.text === "string") return obj.text;
    for (const value of Object.values(obj)) {
      const found = extractText(value);
      if (found) return found;
    }
  }
  return null;
}

export function ExecutionOutput({ output }: { output: unknown }) {
  const text = extractText(output);

  return (
    <div className="mt-6 p-4 bg-muted rounded-md">
      <p className="text-sm font-medium mb-2">Output</p>

      {text ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      ) : (
        <pre className="text-xs font-mono overflow-auto">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </div>
  );
}