# ReadMD 📖

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://readme.hassanali.site/)
[![Build Tool](https://img.shields.io/badge/built%20with-Vite-646CFF)](https://vitejs.dev/)
[![Language](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**ReadMD** is a privacy-first, browser-based Markdown viewer built for high-fidelity reading. It provides a desktop-class documentation experience with zero server-side persistence, making it the perfect tool for viewing sensitive or complex `.md` files securely.

![ReadMD Project Showcase](https://hassanali.site/images/projects/readmd.jpg)

## 🚀 Key Features

- **🔒 Absolute Privacy**: No trackers, no databases, no server uploads. All processing happens entirely in your browser's local memory.
- **📊 Advanced Rendering**:
    - **Mermaid.js**: Full support for flowcharts, sequence diagrams, and Gantt charts.
    - **KaTeX**: High-performance LaTeX math rendering for scientific documentation.
    - **GFM Compliant**: Full GitHub Flavored Markdown support.
- **🛠️ Power Tools**:
    - **Command Palette (`Ctrl+K`)**: Rapidly access reading controls and actions.
    - **Smart TOC**: Auto-generated, clickable Table of Contents for long documents.
    - **Full-Text Search**: Search within the rendered document instantly.
- **🎨 Reading UX**:
    - Customizable themes (Light/Dark).
    - Adjustable font size, line height, and content width.
    - Reading progress indicator.

## 🛠️ Tech Stack

- **Logic**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS & Modern HTML5
- **Build System**: [Vite](https://vitejs.dev/)
- **Libraries**: Mermaid.js, KaTeX, Markdown-it
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 📦 Installation & Local Development

To run ReadMD locally:

```bash
# Clone the repository
git clone https://github.com/HassanAliMAli/ReadMD.git

# Enter the directory
cd ReadMD

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment

ReadMD is optimized for **Cloudflare Pages**. To deploy your own version:
1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.

## 🤝 Contributing

Contributions are welcome! If you have a feature request or found a bug, please open an [issue](https://github.com/HassanAliMAli/ReadMD/issues) or submit a [pull request](https://github.com/HassanAliMAli/ReadMD/pulls).

---

Built with ❤️ by [Hassan Ali](https://hassanali.site)