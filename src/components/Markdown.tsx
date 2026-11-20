import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

// Default (GitHub-style) allow-lists, unchanged. Only the clobber prefix is off: remark-rehype already prefixes
// footnote ids and their #hrefs ("user-content-"), and sanitize prefixes ids but not hrefs, so a second prefix
// would break every footnote link.
const schema = { ...defaultSchema, clobberPrefix: "" };

// Sanitized even though react-markdown drops raw HTML itself: the source is admin-editable.
// Prose styles are in markdown.css, imported by the site layout.
export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, schema]]}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
