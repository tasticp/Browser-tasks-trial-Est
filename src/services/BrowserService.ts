/**
 * Browser service managing tabs, navigation, and session state
 * Acts as the core business logic layer for the browser
 */

import type { BrowserEngine, BrowserTab, BrowserSession, NavigationHistory } from '@/core/engine/types';
import { EngineFactory, type EngineType } from '@/core/engine/EngineFactory';
import { validateAndSanitizeURL, isValidTabId } from '@/utils/security';

export class BrowserService {
  private engine: BrowserEngine;
  private session: BrowserSession;
  private navigationUnsubscribers: Map<string, () => void> = new Map();

  constructor(engineType: EngineType = 'webkit') {
    this.engine = EngineFactory.createEngine(engineType);
    this.session = {
      tabs: new Map(),
      activeTabId: null,
      history: [],
    };
  }

  async initialize(): Promise<void> {
    await this.engine.initialize();
    // Create initial new tab
    const initialTab = await this.createTab();
    this.session.activeTabId = initialTab.id;
  }

  async createTab(url?: string, parentTabId?: string): Promise<BrowserTab> {
    // Security: Validate parent tab ID if provided
    if (parentTabId && !isValidTabId(parentTabId)) {
      throw new Error('Invalid parent tab ID');
    }
    
    const tabId = this.generateTabId();
    
    // Security: Validate and sanitize URL if provided
    let safeUrl = 'about:blank';
    if (url && url !== 'about:blank') {
      try {
        safeUrl = validateAndSanitizeURL(url);
      } catch (error) {
        // If URL is invalid, create tab with blank page
        console.warn('Invalid URL provided, creating blank tab:', error);
        safeUrl = 'about:blank';
      }
    }
    
    const tab: BrowserTab = {
      id: tabId,
      url: safeUrl,
      title: 'New Tab',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      createdAt: Date.now(),
      parentTabId,
    };

    this.session.tabs.set(tabId, tab);

    // Subscribe to navigation events
    const unsubscribe = this.engine.onNavigationStateChanged(tabId, (state) => {
      this.handleNavigationStateChange(tabId, state);
    });
    this.navigationUnsubscribers.set(tabId, unsubscribe);

    // Load URL if provided and valid
    if (safeUrl && safeUrl !== 'about:blank') {
      await this.engine.loadURL(safeUrl, tabId);
    }

    return tab;
  }

  async closeTab(tabId: string): Promise<void> {
    // Security: Validate tab ID
    if (!isValidTabId(tabId)) {
      throw new Error('Invalid tab ID');
    }
    
    const unsubscribe = this.navigationUnsubscribers.get(tabId);
    if (unsubscribe) {
      unsubscribe();
      this.navigationUnsubscribers.delete(tabId);
    }

    this.session.tabs.delete(tabId);

    // If this was the active tab, switch to another
    if (this.session.activeTabId === tabId) {
      const remainingTabs = Array.from(this.session.tabs.keys());
      this.session.activeTabId = remainingTabs[remainingTabs.length - 1] || null;
    }

    // Close child tabs recursively
    const childTabs = Array.from(this.session.tabs.values())
      .filter(tab => tab.parentTabId === tabId);
    
    for (const childTab of childTabs) {
      await this.closeTab(childTab.id);
    }
  }

  async navigateTo(tabId: string, url: string): Promise<void> {
    // Security: Validate tab ID
    if (!isValidTabId(tabId)) {
      throw new Error('Invalid tab ID');
    }
    
    const tab = this.session.tabs.get(tabId);
    if (!tab) {
      throw new Error('Tab not found');
    }

    // Security: Validate and normalize URL
    const normalizedURL = validateAndSanitizeURL(url);
    
    await this.engine.loadURL(normalizedURL, tabId);
    this.addToHistory(normalizedURL, tab.title);
  }

  async goBack(tabId: string): Promise<void> {
    await this.engine.goBack(tabId);
  }

  async goForward(tabId: string): Promise<void> {
    await this.engine.goForward(tabId);
  }

  async reload(tabId: string): Promise<void> {
    await this.engine.reload(tabId);
  }

  async stop(tabId: string): Promise<void> {
    await this.engine.stop(tabId);
  }

  setActiveTab(tabId: string): void {
    // Security: Validate tab ID
    if (!isValidTabId(tabId)) {
      throw new Error('Invalid tab ID');
    }
    
    if (this.session.tabs.has(tabId)) {
      this.session.activeTabId = tabId;
    } else {
      throw new Error('Tab not found');
    }
  }

  getActiveTab(): BrowserTab | null {
    if (!this.session.activeTabId) return null;
    return this.session.tabs.get(this.session.activeTabId) || null;
  }

  getTab(tabId: string): BrowserTab | undefined {
    return this.session.tabs.get(tabId);
  }

  getAllTabs(): BrowserTab[] {
    return Array.from(this.session.tabs.values());
  }

  getHistory(): NavigationHistory[] {
    return [...this.session.history].reverse(); // Most recent first
  }

  async createChildTab(parentTabId: string, url: string): Promise<BrowserTab> {
    return this.createTab(url, parentTabId);
  }

  getChildTabs(parentTabId: string): BrowserTab[] {
    return Array.from(this.session.tabs.values())
      .filter(tab => tab.parentTabId === parentTabId);
  }

  async destroy(): Promise<void> {
    // Unsubscribe from all navigation events
    this.navigationUnsubscribers.forEach(unsubscribe => unsubscribe());
    this.navigationUnsubscribers.clear();

    // Destroy engine
    await this.engine.destroy();

    // Clear session
    this.session.tabs.clear();
    this.session.activeTabId = null;
    this.session.history = [];
  }

  private handleNavigationStateChange(tabId: string, state: any): void {
    const tab = this.session.tabs.get(tabId);
    if (!tab) return;

    tab.url = state.url;
    tab.title = state.title;
    tab.isLoading = state.isLoading;
    tab.canGoBack = state.canGoBack;
    tab.canGoForward = state.canGoForward;

    this.session.tabs.set(tabId, tab);

    // Notify listeners (could use an event emitter here)
    this.onTabUpdated?.(tab);
  }

  private generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeURL(input: string): string {
    // Use centralized security utility
    return validateAndSanitizeURL(input);
  }

  private addToHistory(url: string, title: string): void {
    this.session.history.push({
      url,
      title,
      timestamp: Date.now(),
    });

    // Keep history size reasonable
    if (this.session.history.length > 1000) {
      this.session.history = this.session.history.slice(-1000);
    }
  }

  // Callback for tab updates (can be overridden or use event emitter)
  onTabUpdated?: (tab: BrowserTab) => void;
}

