import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import "./markdown.css";

// Sanitized (default GitHub-style schema) even though react-markdown drops raw HTML itself: the source is admin-editable.
export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
