import React from "react";
import type { ReaderSettings } from "../types";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <label>Font Size</label>
            <div className="setting-control">
              <input
                type="range"
                min="12"
                max="24"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
              />
              <span>{settings.fontSize}px</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Line Height</label>
            <div className="setting-control">
              <input
                type="range"
                min="1.2"
                max="2.2"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSetting("lineHeight", parseFloat(e.target.value))}
              />
              <span>{settings.lineHeight.toFixed(1)}</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Content Width</label>
            <div className="setting-control">
              <input
                type="range"
                min="500"
                max="1200"
                step="50"
                value={settings.contentWidth}
                onChange={(e) => updateSetting("contentWidth", parseInt(e.target.value))}
              />
              <span>{settings.contentWidth}px</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Font Family</label>
            <div className="setting-control toggle-group">
              <button
                className={settings.fontFamily === "sans-serif" ? "active" : ""}
                onClick={() => updateSetting("fontFamily", "sans-serif")}
              >
                Sans
              </button>
              <button
                className={settings.fontFamily === "serif" ? "active" : ""}
                onClick={() => updateSetting("fontFamily", "serif")}
              >
                Serif
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label>Options</label>
            <div className="setting-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={(e) => updateSetting("focusMode", e.target.checked)}
                />
                <span>Focus Mode</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.lineWrap}
                  onChange={(e) => updateSetting("lineWrap", e.target.checked)}
                />
                <span>Line Wrap in Code</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};