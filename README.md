# ReadMD

A privacy-first markdown viewer that runs entirely in your browser. Nothing is saved after you leave.

## Features

- **Privacy First**: Your content stays in your browser
- **GFM Support**: GitHub Flavored Markdown rendering
- **Syntax Highlighting**: Code blocks with 20+ languages
- **Math Support**: KaTeX for inline and block math
- **Diagrams**: Mermaid.js for flowcharts, sequences, Gantt, and more
- **Navigation**: Auto-generated TOC, search, reading progress
- **Themes**: Light and dark mode
- **Reading Controls**: Font size, line height, content width
- **Export**: Print/PDF, download HTML, copy content
- **Keyboard Shortcuts**: Ctrl+K command palette, Ctrl+F search, and more

## Quick Start

```bash
npm install
npm run dev
```

## Deployment

Deploy to Cloudflare Pages:

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`

## Usage

- **Paste**: Paste markdown directly
- **Upload**: Drag & drop a `.md` file
- **Import**: Load from a public URL
- **Sample**: Try the built-in sample document

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Command palette |
| Ctrl+F | Search document |
| Ctrl+B | Toggle split view |
| Ctrl+P | Print / Save as PDF |
| Ctrl+Shift+L | Toggle theme |

## License

MIT