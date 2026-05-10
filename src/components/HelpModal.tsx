import React from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["Ctrl", "F"], description: "Search document" },
    { keys: ["Ctrl", "K"], description: "Open command palette" },
    { keys: ["Ctrl", "B"], description: "Toggle split view" },
    { keys: ["Ctrl", "P"], description: "Print / Save as PDF" },
    { keys: ["Ctrl", "Shift", "L"], description: "Toggle theme" },
    { keys: ["Ctrl", "Shift", "F"], description: "Toggle focus mode" },
    { keys: ["Esc"], description: "Close modal / Clear search" },
  ];

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="help-content">
          <table>
            <tbody>
              {shortcuts.map((shortcut, i) => (
                <tr key={i}>
                  <td className="keys">
                    {shortcut.keys.map((key, j) => (
                      <kbd key={j}>{key}</kbd>
                    ))}
                  </td>
                  <td>{shortcut.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};