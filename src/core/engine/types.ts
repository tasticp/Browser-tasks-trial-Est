/**
 * Core type definitions for the browser engine
 */

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  createdAt: number;
  parentTabId?: string;
  // Rust service compatibility
  can_go_back?: boolean;
  can_go_forward?: boolean;
  is_loading?: boolean;
}

export interface NavigationHistory {
  url: string;
  title: string;
  timestamp: number;
}

export interface BrowserSession {
  tabs: Map<string, BrowserTab>;
  activeTabId: string | null;
  history: NavigationHistory[];
}

export interface NavigationState {
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  favicon?: string;
}

export interface BrowserEngine {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  loadURL(url: string, tabId: string): Promise<void>;
  goBack(tabId: string): Promise<void>;
  goForward(tabId: string): Promise<void>;
  reload(tabId: string): Promise<void>;
  stop(tabId: string): Promise<void>;
  onNavigationStateChanged(tabId: string, callback: (state: NavigationState) => void): () => void;
}
