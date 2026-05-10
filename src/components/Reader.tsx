import React, { useEffect, useRef, useState } from "react";
import type { ViewMode, ReaderSettings } from "../types";
import mermaid from "mermaid";

interface ReaderProps {
  content: string;
  html: string;
  viewMode: ViewMode;
  settings: ReaderSettings;
  activeHeadingId: string | null;
  onActiveHeadingChange: (id: string | null) => void;
  onScroll: (progress: { current: number; total: number; percentage: number }) => void;
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  html,
  viewMode,
  settings,
  activeHeadingId,
  onActiveHeadingChange,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mermaidReady, setMermaidReady] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default",
      securityLevel: "strict",
    });
    setMermaidReady(true);
  }, []);

  useEffect(() => {
    if (!mermaidReady || !contentRef.current) return;

    const renderMermaid = async () => {
      const containers = contentRef.current?.querySelectorAll(".mermaid-container");
      if (!containers) return;

      for (const container of Array.from(containers)) {
        const diagram = container.getAttribute("data-diagram");
        const code = container.textContent;
        if (diagram && code) {
          try {
            const { svg } = await mermaid.render(diagram, code);
            container.innerHTML = svg;
          } catch (e) {
            container.innerHTML = `<div class="mermaid-error">Invalid diagram syntax</div>`;
          }
        }
      }
    };

    renderMermaid();
  }, [html, mermaidReady]);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      const headings = el.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let currentHeading: string | null = null;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        }
      });

      onActiveHeadingChange(currentHeading);
      onScroll({
        current: scrollTop,
        total: scrollHeight,
        percentage,
      });
    };

    const el = contentRef.current;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [onActiveHeadingChange, onScroll]);

  useEffect(() => {
    if (activeHeadingId && contentRef.current) {
      const heading = contentRef.current.querySelector(`#${activeHeadingId}`);
      if (heading) {
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeHeadingId]);

  const style = {
    "--font-size": `${settings.fontSize}px`,
    "--line-height": settings.lineHeight,
    "--content-width": `${settings.contentWidth}px`,
    "--font-family": settings.fontFamily === "serif" ? "Georgia, serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  } as React.CSSProperties;

  const renderContent = () => {
    if (viewMode === "raw") {
      return (
        <pre className="raw-content" style={{ fontFamily: settings.fontFamily === "serif" ? "Georgia, serif" : "inherit" }}>
          {content}
        </pre>
      );
    }

    if (viewMode === "split") {
      return (
        <div className="split-view">
          <pre className="raw-content">{content}</pre>
          <div
            className="rendered-content"
            style={style}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    }

    return (
      <div
        className={`rendered-content ${settings.lineWrap ? "line-wrap" : ""}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div
      ref={contentRef}
      className={`reader-content ${viewMode} ${settings.focusMode ? "focus-mode" : ""}`}
    >
      {renderContent()}
    </div>
  );
};