import React, { useState, useCallback, useRef } from "react";

interface LandingProps {
  onLoadContent: (content: string, fileName: string | null) => void;
  onWrite: () => void;
}

const ASCII_DECORATION = `
  ╔══════════════════════════════════════════════════════════╗
  ║  _   _                               __  __              ║
  ║ | | | | _____      _____  ___  _ __  |  \\/  | ___ _ __  ║
  ║ | |_| |/ _ \\ \\ /\\ / / _ \\/ _ \\| '_ \\ | |\\/| |/ _ \\ '_ \\ ║
  ║ |  _  |  __/\\ V  V / (_) | (_) | | | | |  | |  __/ | | |║
  ║ |_| |_|\\___| \\_/\\_/ \\___/ \\___/|_| |_|_|  |_|\\___|_| |_|║
  ║                                                          ║
  ║  M A R K D O W N   V I E W E R   &   E D I T O R         ║
  ╚══════════════════════════════════════════════════════════╝
`;

export const Landing: React.FC<LandingProps> = ({ onLoadContent, onWrite }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0 && (files[0].name.endsWith(".md") || files[0].name.endsWith(".markdown"))) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          onLoadContent(event.target?.result as string, file.name);
        };
        reader.readAsText(file);
      }
    },
    [onLoadContent]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".md") || file.name.endsWith(".markdown")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            onLoadContent(event.target?.result as string, file.name);
          };
          reader.readAsText(file);
        }
      }
    },
    [onLoadContent]
  );

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (text.trim()) {
        onLoadContent(text, "Pasted Document");
      }
    });
  }, [onLoadContent]);

  const handleLoadSample = useCallback(() => {
    fetch("/sample.md")
      .then((res) => res.text())
      .then((content) => onLoadContent(content, "Sample Document"))
      .catch(() => {
        const sampleContent = `# Welcome to ReadMD

A privacy-first markdown viewer.

## Features

- **Code highlighting** with Prism.js
- **Math support** via KaTeX
- **Diagrams** with Mermaid
- **Live preview** in split view

## Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Math

Inline: $E = mc^2$

Block:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

Try it out!`;
        onLoadContent(sampleContent, "Sample Document");
      });
  }, [onLoadContent]);

  const handleUrlImport = useCallback(() => {
    if (!url.trim()) {
      setUrlError("Enter a URL");
      return;
    }
    setUrlError("");
    fetch(url)
      .then((res) => res.text())
      .then((content) => {
        onLoadContent(content, new URL(url).pathname.split("/").pop() || "Imported");
        setShowUrlInput(false);
        setUrl("");
      })
      .catch(() => {
        setUrlError("Failed. May be CORS blocked.");
      });
  }, [url, onLoadContent]);

  return (
    <div className="landing-container">
      <div className="landing-grid">
        <div className="hero-section">
          <img src="/readMD.png" alt="ReadMD" className="landing-logo" />
          <pre className="ascii-art">{ASCII_DECORATION}</pre>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">READ.</span>
              <span className="title-line accent">WRITE.</span>
              <span className="title-line">GONE.</span>
            </h1>
            <p className="hero-subtitle">
              Privacy-first markdown. No accounts. No storage. 
              <br />
              <span className="accent-text">Your data vanishes when you close the tab.</span>
            </p>
          </div>
        </div>

        <div className="actions-section">
          <div className="action-card primary" onClick={onWrite}>
            <span className="action-icon">✎</span>
            <span className="action-label">WRITE</span>
            <span className="action-desc">Start fresh</span>
          </div>

          <div 
            className={`action-card ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="action-icon">↓</span>
            <span className="action-label">DROP</span>
            <span className="action-desc">.md file here</span>
          </div>

          <div className="action-card" onClick={() => fileInputRef.current?.click()}>
            <span className="action-icon">↑</span>
            <span className="action-label">UPLOAD</span>
            <span className="action-desc">Choose file</span>
          </div>

          <div className="action-card" onClick={handlePaste}>
            <span className="action-icon">◧</span>
            <span className="action-label">PASTE</span>
            <span className="action-desc">From clipboard</span>
          </div>

          <div className="action-card" onClick={() => setShowUrlInput(true)}>
            <span className="action-icon">⟶</span>
            <span className="action-label">IMPORT</span>
            <span className="action-desc">From URL</span>
          </div>

          <div className="action-card" onClick={handleLoadSample}>
            <span className="action-icon">◉</span>
            <span className="action-label">SAMPLE</span>
            <span className="action-desc">Try demo</span>
          </div>
        </div>

        <div className="features-mini">
          <span className="feature-tag">GFM</span>
          <span className="feature-tag">CODE</span>
          <span className="feature-tag">MATH</span>
          <span className="feature-tag">DIAGRAMS</span>
          <span className="feature-tag">SPLIT</span>
          <span className="feature-tag">SEARCH</span>
        </div>

        <div className="privacy-badge">
          <span className="privacy-icon">◈</span>
          <span>Client-side only. Nothing leaves your browser.</span>
        </div>
      </div>

      {showUrlInput && (
        <div className="modal-overlay" onClick={() => setShowUrlInput(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">⟶</span>
              <span>IMPORT FROM URL</span>
            </div>
            <input
              type="url"
              placeholder="https://example.com/doc.md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
              autoFocus
            />
            {urlError && <div className="modal-error">{urlError}</div>}
            <div className="modal-actions">
              <button className="modal-btn primary" onClick={handleUrlImport}>IMPORT</button>
              <button className="modal-btn" onClick={() => setShowUrlInput(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};