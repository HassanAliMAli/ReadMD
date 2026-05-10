import { useState, useCallback, useMemo } from "react";
import type { SearchMatch } from "../types";

export function useSearch(content: string) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      if (!searchQuery.trim()) {
        setMatches([]);
        setCurrentIndex(0);
        return;
      }

      const lines = content.split("\n");
      const found: SearchMatch[] = [];
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");

      lines.forEach((line, index) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
          found.push({
            index: match.index,
            text: line,
            line: index + 1,
          });
        }
      });

      setMatches(found);
      setCurrentIndex(0);
    },
    [content]
  );

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  }, [matches.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
  }, [matches.length]);

  const clear = useCallback(() => {
    setQuery("");
    setMatches([]);
    setCurrentIndex(0);
  }, []);

  const highlightMatches = useMemo(() => {
    if (!query.trim() || matches.length === 0) return null;
    return matches[currentIndex] || null;
  }, [query, matches, currentIndex]);

  return {
    query,
    matches,
    currentIndex,
    search,
    next,
    prev,
    clear,
    highlightMatches,
    hasResults: matches.length > 0,
    totalResults: matches.length,
  };
}