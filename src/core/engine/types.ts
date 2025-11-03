/**
 * Core types for the browser engine abstraction layer
 * This allows the browser to work with different rendering engines
 * (WebKit, Servo, custom, etc.) without being tied to Chromium/Firefox
 */

export interface BrowserEngine {
  /**
   * Initialize the rendering engine
   */
  initialize(): Promise<void>;
  
  /**
   * Load a URL in the engine
   */
  loadURL(url: string, tabId: string): Promise<void>;
  
  /**
   * Navigate back in history
   */
  goBack(tabId: string): Promise<void>;
  
  /**
   * Navigate forward in history
   */
  goForward(tabId: string): Promise<void>;
  
  /**
   * Reload the current page
   */
  reload(tabId: string): Promise<void>;
  
  /**
   * Stop loading the current page
   */
  stop(tabId: string): Promise<void>;
  
  /**
   * Get the current URL for a tab
   */
  getCurrentURL(tabId: string): Promise<string>;
  
  /**
   * Get the page title for a tab
   */
  getPageTitle(tabId: string): Promise<string>;
  
  /**
   * Check if the page is loading
   */
  isLoading(tabId: string): Promise<boolean>;
  
  /**
   * Register event listeners for navigation events
   */
  onNavigationStateChanged(
    tabId: string,
    callback: (state: NavigationState) => void
  ): () => void;
  
  /**
   * Execute JavaScript in the page context
   */
  executeScript(tabId: string, script: string): Promise<any>;
  
  /**
   * Inject CSS into the page
   */
  injectCSS(tabId: string, css: string): Promise<void>;
  
  /**
   * Cleanup and destroy the engine
   */
  destroy(): Promise<void>;
}

export interface NavigationState {
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  loadingProgress: number;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  createdAt: number;
  parentTabId?: string; // For nested tab relationships
}

export interface BrowserSession {
  tabs: Map<string, BrowserTab>;
  activeTabId: string | null;
  history: NavigationHistory[];
}

export interface NavigationHistory {
  url: string;
  title: string;
  timestamp: number;
}

