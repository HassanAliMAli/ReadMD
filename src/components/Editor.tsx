import React, { useCallback, useRef, useEffect } from "react";
import type { ReaderSettings } from "../types";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  settings: ReaderSettings;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange, settings }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
    }
  }, []);

  const style: React.CSSProperties = {
    fontFamily: settings.fontFamily === "serif" ? "Georgia, serif" : "SF Mono, Monaco, Consolas, 'Liberation Mono', Menlo, monospace",
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    whiteSpace: settings.lineWrap ? "pre-wrap" : "pre",
    wordWrap: settings.lineWrap ? "break-word" : "normal",
  };

  return (
    <div className="editor-container">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        style={style}
        placeholder="Start writing markdown..."
        spellCheck={false}
      />
    </div>
  );
};