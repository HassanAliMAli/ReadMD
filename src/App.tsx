import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "katex/dist/katex.min.css";
import "./styles/prism.css";
import { Toolbar } from "./components/Toolbar";
import { Landing } from "./components/Landing";
import { Reader } from "./components/Reader";
import { TableOfContents } from "./components/TableOfContents";
import { SearchBar } from "./components/SearchBar";
import { Settings } from "./components/Settings";
import { ExportMenu } from "./components/ExportMenu";
import { HelpModal } from "./components/HelpModal";
import { CommandPalette } from "./components/CommandPalette";
import { useTheme } from "./hooks/useTheme";
import { useSearch } from "./hooks/useSearch";
import { renderMarkdown, extractHeadings, estimateReadingTime, getSampleDocument } from "./utils/markdown";
import type { ViewMode, ReaderSettings, Heading, ReadingProgress } from "./types";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [document, setDocument] = useState<{ content: string; html: string; headings: Heading[]; fileName: string } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("rendered");
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: "sans-serif",
    contentWidth: 800,
    focusMode: false,
    lineWrap: false,
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({ current: 0, total: 0, percentage: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const search = useSearch(document?.content || "");

  const readingTime = useMemo(() => {
    if (!document) return 0;
    return estimateReadingTime(document.content);
  }, [document]);

  useEffect(() => {
    if (!document) return;
    const html = renderMarkdown(document.content);
    setDocument((prev) => prev ? { ...prev, html } : null);
  }, [document?.content]);

  const handleLoadContent = useCallback((content: string, fileName: string | null) => {
    const html = renderMarkdown(content);
    const headings = extractHeadings(html);
    setDocument({ content, html, headings, fileName: fileName || "Document" });
    setSearchOpen(false);
  }, []);

  const handleHeadingClick = useCallback((id: string) => {
    setActiveHeadingId(id);
    const element = window.document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleScroll = useCallback((progress: ReadingProgress) => {
    setReadingProgress(progress);
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }));
  }, []);

  const handleLoadSample = useCallback(() => {
    const content = getSampleDocument();
    handleLoadContent(content, "Sample Document");
  }, [handleLoadContent]);

  const handleOpenFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        handleLoadContent(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  }, [handleLoadContent]);

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (text.trim()) {
        handleLoadContent(text, "Pasted Document");
      }
    });
  }, [handleLoadContent]);

  const handlePrint = useCallback(() => {
    if (!document) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${document.fileName}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #333; }
              h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
              h1 { font-size: 2em; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
              pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
              pre code { background: none; padding: 0; }
              blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f4f4f4; }
              img { max-width: 100%; height: auto; }
              @media print { body { padding: 0; } pre { white-space: pre-wrap; } }
            </style>
          </head>
          <body>${document.html}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [document]);

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      search.search(query);
    },
    [search]
  );

  return (
    <div className={`app ${isDark ? "dark" : "light"} ${settings.focusMode ? "focus-mode" : ""}`}>
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearchOpen={() => setSearchOpen(true)}
        onThemeToggle={toggleTheme}
        onSettingsOpen={() => setSettingsOpen(true)}
        onExportOpen={() => setExportOpen(true)}
        onHelpOpen={() => setHelpOpen(true)}
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        isDark={isDark}
        hasDocument={!!document}
      />

      {!document ? (
        <Landing onLoadContent={handleLoadContent} />
      ) : (
        <div className="reader-layout">
          {viewMode !== "raw" && (
            <aside className="sidebar">
              <TableOfContents
                headings={document.headings}
                activeId={activeHeadingId}
                onHeadingClick={handleHeadingClick}
                readingTime={readingTime}
              />
            </aside>
          )}

          <Reader
            content={document.content}
            html={document.html}
            viewMode={viewMode}
            settings={settings}
            activeHeadingId={activeHeadingId}
            onActiveHeadingChange={setActiveHeadingId}
            onScroll={handleScroll}
          />
        </div>
      )}

      {readingProgress.percentage > 0 && document && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${readingProgress.percentage}%` }} />
        </div>
      )}

      <SearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={search.query}
        onQueryChange={handleSearchQueryChange}
        onNext={search.next}
        onPrev={search.prev}
        totalResults={search.totalResults}
        currentIndex={search.currentIndex}
        hasResults={search.hasResults}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <ExportMenu
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        html={document?.html || ""}
        markdown={document?.content || ""}
        fileName={document?.fileName || "document"}
      />

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={[]}
        onOpenFile={handleOpenFile}
        onLoadSample={handleLoadSample}
        onPaste={handlePaste}
        onToggleTheme={toggleTheme}
        onToggleFocusMode={handleToggleFocusMode}
        onExportOpen={() => setExportOpen(true)}
        onPrint={handlePrint}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default App;