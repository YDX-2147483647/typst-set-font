import { marked, Tokens } from "marked";

export type Markdown = string;

const renderer = {
  link(token: Tokens.Link): string {
    const html = marked.Renderer.prototype.link.call(this, token);
    // Add `target="_blank" rel="noopener"`
    return html.replace("<a", '<a target="_blank" rel="noopener"');
  },
};

marked.use({ renderer });

export function markdown(md: string): string | Promise<string> {
  return marked.parseInline(md);
}

export function markdownBlock(md: string): string | Promise<string> {
  return marked.parse(md);
}
