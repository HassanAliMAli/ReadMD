import React from "react";
import type { ViewMode } from "../types";

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchOpen: () => void;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  onExportOpen: () => void;
  onHelpOpen: () => void;
  onCommandPaletteOpen: () => void;
  isDark: boolean;
  hasDocument: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onSearchOpen,
  onThemeToggle,
  onSettingsOpen,
  onExportOpen,
  onHelpOpen,
  onCommandPaletteOpen,
  isDark,
  hasDocument,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onCommandPaletteOpen();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        if (hasDocument) onSearchOpen();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        onViewModeChange(viewMode === "split" ? "rendered" : "split");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCommandPaletteOpen, onSearchOpen, onViewModeChange, viewMode, hasDocument]);

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn logo" onClick={() => window.location.reload()}>
          <img src="/readMD.png" alt="ReadMD" className="logo-img" />
          <span>ReadMD</span>
        </button>
      </div>

      <div className="toolbar-center">
        {hasDocument && (
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "edit" ? "active" : ""}`}
              onClick={() => onViewModeChange("edit")}
            >
              Edit
            </button>
            <button
              className={`view-btn ${viewMode === "raw" ? "active" : ""}`}
              onClick={() => onViewModeChange("raw")}
            >
              Raw
            </button>
            <button
              className={`view-btn ${viewMode === "rendered" ? "active" : ""}`}
              onClick={() => onViewModeChange("rendered")}
            >
              Rendered
            </button>
            <button
              className={`view-btn ${viewMode === "split" ? "active" : ""}`}
              onClick={() => onViewModeChange("split")}
            >
              Split
            </button>
          </div>
        )}
      </div>

      <div className="toolbar-right">
        {hasDocument && (
          <>
            <button className="toolbar-btn" onClick={onSearchOpen} title="Search (Ctrl+F)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="toolbar-btn" onClick={onExportOpen} title="Export">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </>
        )}
        <button className="toolbar-btn" onClick={onThemeToggle} title="Toggle theme">
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <button className="toolbar-btn" onClick={onSettingsOpen} title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <button className="toolbar-btn" onClick={onHelpOpen} title="Keyboard shortcuts">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>
    </header>
  );
};