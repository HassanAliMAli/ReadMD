import React from "react";

interface ExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  markdown: string;
  fileName: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  isOpen,
  onClose,
  html,
  markdown,
  fileName,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                line-height: 1.6;
                color: #333;
              }
              h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
              h1 { font-size: 2em; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              code {
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.9em;
              }
              pre {
                background: #f4f4f4;
                padding: 16px;
                border-radius: 6px;
                overflow-x: auto;
              }
              pre code { background: none; padding: 0; }
              blockquote {
                border-left: 4px solid #ddd;
                margin: 0;
                padding-left: 16px;
                color: #666;
              }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f4f4f4; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { padding: 0; }
                pre { white-space: pre-wrap; }
              }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    onClose();
  };

  const handleExportHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.md$/, "")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleCopyHtml = async () => {
    await navigator.clipboard.writeText(html);
    onClose();
  };

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    onClose();
  };

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-menu" onClick={(e) => e.stopPropagation()}>
        <h3>Export</h3>
        <button onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print / Save as PDF
        </button>
        <button onClick={handleExportHtml}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download HTML
        </button>
        <button onClick={handleCopyHtml}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy HTML
        </button>
        <button onClick={handleCopyMarkdown}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          Copy Markdown
        </button>
      </div>
    </div>
  );
};