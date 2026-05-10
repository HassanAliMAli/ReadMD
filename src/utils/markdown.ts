import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import DOMPurify from "dompurify";
import katex from "katex";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-php";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markdown";
import type { Heading } from "../types";

let md: MarkdownIt | null = null;

const sampleDocument = `# Welcome to Ephemeral Markdown Viewer

A privacy-first markdown viewer that runs entirely in your browser. Nothing is saved after you leave.

## Features

- **Privacy First**: Your content stays in your browser
- **Advanced Rendering**: Code highlighting, math, diagrams
- **Navigation**: Table of contents, search, progress
- **Export**: Print, PDF, or copy HTML

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);
\`\`\`

## Math Support

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do Something]
    B -->|No| D[Do Something Else]
    C --> E[End]
    D --> E
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Markdown | ✓ |
| Code | ✓ |
| Math | ✓ |
| Diagrams | ✓ |

## Task Lists

- [x] Create viewer
- [x] Add math support
- [x] Add diagrams
- [ ] Add more features

## Blockquotes

> This is a blockquote. It can span multiple lines and include **formatting**.

## Links

Check out [GitHub Flavored Markdown](https://github.github.com/gfm/) for more info.

---

*Thank you for trying Ephemeral Markdown Viewer!*
`;

export function getSampleDocument(): string {
  return sampleDocument;
}

export function initializeMarkdown(): void {
  if (!md) {
    md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
    }).use(anchor, {
      permalink: anchor.permalink.headerLink(),
      slugify: (s: string) =>
        s
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim(),
    });
  }
}

export function renderMarkdown(source: string): string {
  if (!md) {
    initializeMarkdown();
  }

  let html = source;

  html = renderMermaidBlocks(html);
  html = renderMathBlocks(html);
  html = renderInlineMath(html);

  html = md!.render(html);

  html = highlightCodeBlocks(html);

  html = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"],
    ADD_TAGS: ["iframe"],
  });

  return html;
}

function renderMathBlocks(source: string): string {
  return source.replace(
    /\$\$([\s\S]*?)\$\$/g,
    (_match, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `<div class="math-block">${rendered}</div>`;
      } catch {
        return `<div class="math-block math-error">Invalid math expression</div>`;
      }
    }
  );
}

function renderInlineMath(source: string): string {
  return source.replace(
    /\$([^\$\n]+?)\$/g,
    (_match, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
        return `<span class="math-inline">${rendered}</span>`;
      } catch {
        return `<span class="math-inline math-error">${math}</span>`;
      }
    }
  );
}

function renderMermaidBlocks(source: string): string {
  return source.replace(
    /```mermaid\n([\s\S]*?)```/g,
    (_match, diagram) => {
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      return `<div class="mermaid-container" data-diagram="${id}">${diagram.trim()}</div>`;
    }
  );
}

function highlightCodeBlocks(html: string): string {
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;

  return html.replace(
    codeBlockRegex,
    (_match, lang, code) => {
      try {
        const decoded = code
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const grammar = Prism.languages[lang] || Prism.languages.plaintext;
        const highlighted = Prism.highlight(decoded, grammar, lang);

        const langLabel = lang ? `<span class="code-lang">${lang}</span>` : "";

        return `<div class="code-block">
          <div class="code-header">
            ${langLabel}
            <button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('code').textContent)">Copy</button>
          </div>
          <pre><code class="language-${lang}">${highlighted}</code></pre>
        </div>`;
      } catch {
        return `<pre><code>${code}</code></pre>`;
      }
    }
  );
}

export function extractHeadings(html: string): Heading[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h[1-6]>/g;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, "").trim();

    headings.push({ id, text, level, children: [] });
  }

  return buildHeadingTree(headings);
}

function buildHeadingTree(headings: Heading[]): Heading[] {
  const result: Heading[] = [];
  const stack: Heading[] = [];

  for (const heading of headings) {
    const node: Heading = { ...heading, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return result;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
}