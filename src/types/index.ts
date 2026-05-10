export interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
}

export interface SearchMatch {
  index: number;
  text: string;
  line: number;
}

export interface ReadingProgress {
  current: number;
  total: number;
  percentage: number;
}

export type ViewMode = "rendered" | "split" | "raw";

export type Theme = "light" | "dark";

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: "sans-serif" | "serif";
  contentWidth: number;
  focusMode: boolean;
  lineWrap: boolean;
}

export interface DocumentState {
  content: string;
  renderedHtml: string;
  headings: Heading[];
  fileName: string | null;
  lastModified: Date | null;
}

export interface AppState {
  document: DocumentState | null;
  viewMode: ViewMode;
  theme: Theme;
  settings: ReaderSettings;
  searchOpen: boolean;
  searchQuery: string;
  searchMatches: SearchMatch[];
  currentMatchIndex: number;
  commandPaletteOpen: boolean;
  activeHeadingId: string | null;
  readingProgress: ReadingProgress;
}

export interface SampleDocument {
  title: string;
  content: string;
}