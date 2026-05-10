import React, { useEffect, useRef } from "react";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  onNext: () => void;
  onPrev: () => void;
  totalResults: number;
  currentIndex: number;
  hasResults: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onNext,
  onPrev,
  totalResults,
  currentIndex,
  hasResults,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-bar" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search document..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => onQueryChange("")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {hasResults && (
          <div className="search-results-info">
            <span>
              {currentIndex + 1} of {totalResults}
            </span>
            <div className="search-nav">
              <button onClick={onPrev} title="Previous (Shift+Enter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button onClick={onNext} title="Next (Enter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {!hasResults && query && (
          <div className="search-no-results">No results found</div>
        )}

        <button className="search-close" onClick={onClose}>
          <kbd>ESC</kbd>
        </button>
      </div>
    </div>
  );
};