import React, { useState, useCallback, useRef } from "react";

interface LandingProps {
  onLoadContent: (content: string, fileName: string | null) => void;
  onWrite: () => void;
}

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
      if (files.length > 0 && files[0].name.endsWith(".md")) {
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
        if (file.name.endsWith(".md")) {
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
        const sampleContent = `# Sample Document

This is a sample markdown document to demonstrate the **Ephmeral Markdown Viewer**.

## Features

- Code highlighting
- Math: $E = mc^2$
- And more!

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

Try loading your own markdown file!`;
        onLoadContent(sampleContent, "Sample Document");
      });
  }, [onLoadContent]);

  const handleUrlImport = useCallback(() => {
    if (!url.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    setUrlError("");
    fetch(url)
      .then((res) => res.text())
      .then((content) => {
        onLoadContent(content, new URL(url). pathname.split("/").pop() || "Imported Document");
        setShowUrlInput(false);
        setUrl("");
      })
      .catch(() => {
        setUrlError("Failed to load URL. It might be CORS blocked.");
      });
  }, [url, onLoadContent]);

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-header">
          <h1>ReadMD</h1>
          <p className="tagline">
            A privacy-first markdown viewer. Nothing is saved after you leave.
          </p>
        </div>

        <div className={`drop-zone ${isDragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <div className="drop-zone-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p>Drag & drop a markdown file here</p>
            <span>or</span>
            <div className="landing-actions">
              <button className="btn-primary" onClick={onWrite}>
                Write
              </button>
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                Upload File
              </button>
              <button className="btn-secondary" onClick={handlePaste}>
                Paste
              </button>
              <button className="btn-secondary" onClick={() => setShowUrlInput(true)}>
                Import URL
              </button>
              <button className="btn-ghost" onClick={handleLoadSample}>
                Try Sample
              </button>
            </div>
          </div>
        </div>

        {showUrlInput && (
          <div className="url-input-overlay" onClick={() => setShowUrlInput(false)}>
            <div className="url-input-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Import from URL</h3>
              <input
                type="url"
                placeholder="https://example.com/document.md"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                autoFocus
              />
              {urlError && <p className="error">{urlError}</p>}
              <div className="url-input-actions">
                <button className="btn-primary" onClick={handleUrlImport}>
                  Import
                </button>
                <button className="btn-ghost" onClick={() => setShowUrlInput(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="features-strip">
          <span>✓ GFM</span>
          <span>✓ Code</span>
          <span>✓ Math</span>
          <span>✓ Diagrams</span>
          <span>✓ Search</span>
          <span>✓ TOC</span>
        </div>

        <div className="privacy-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Your content is processed locally and never leaves your browser.</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};