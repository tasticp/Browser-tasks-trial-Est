import { useState, useEffect, useCallback } from 'react';
import { BrowserService } from '@/services/BrowserService';
import type { BrowserTab } from '@/core/engine/types';
import type { EngineType } from '@/core/engine/EngineFactory';

export const useBrowser = (engineType: EngineType = 'webkit') => {
  const [browserService] = useState(() => new BrowserService(engineType));
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    browserService.initialize().then(() => {
      if (!mounted) return;
      
      const allTabs = browserService.getAllTabs();
      setTabs(allTabs);
      setActiveTabId(browserService.getActiveTab()?.id || null);
      setIsInitialized(true);
    });

    // Set up tab update callback
    browserService.onTabUpdated = (tab) => {
      if (mounted) {
        setTabs([...browserService.getAllTabs()]);
      }
    };

    return () => {
      mounted = false;
      browserService.destroy();
    };
  }, [browserService]);

  const activeTab = activeTabId ? browserService.getTab(activeTabId) : null;

  const createTab = useCallback(async (url?: string, parentTabId?: string) => {
    const newTab = await browserService.createTab(url, parentTabId);
    setTabs(browserService.getAllTabs());
    setActiveTabId(newTab.id);
    return newTab;
  }, [browserService]);

  const closeTab = useCallback(async (tabId: string) => {
    await browserService.closeTab(tabId);
    setTabs(browserService.getAllTabs());
    
    const newActiveTab = browserService.getActiveTab();
    setActiveTabId(newActiveTab?.id || null);
  }, [browserService]);

  const setActiveTab = useCallback((tabId: string) => {
    browserService.setActiveTab(tabId);
    setActiveTabId(tabId);
  }, [browserService]);

  const navigateTo = useCallback(async (tabId: string, url: string) => {
    await browserService.navigateTo(tabId, url);
    setTabs([...browserService.getAllTabs()]);
  }, [browserService]);

  const goBack = useCallback(async (tabId: string) => {
    await browserService.goBack(tabId);
  }, [browserService]);

  const goForward = useCallback(async (tabId: string) => {
    await browserService.goForward(tabId);
  }, [browserService]);

  const reload = useCallback(async (tabId: string) => {
    await browserService.reload(tabId);
  }, [browserService]);

  const stop = useCallback(async (tabId: string) => {
    await browserService.stop(tabId);
  }, [browserService]);

  const createChildTab = useCallback(async (parentTabId: string, url: string) => {
    const newTab = await browserService.createChildTab(parentTabId, url);
    setTabs(browserService.getAllTabs());
    setActiveTabId(newTab.id);
    return newTab;
  }, [browserService]);

  return {
    tabs,
    activeTab,
    activeTabId,
    isInitialized,
    createTab,
    closeTab,
    setActiveTab,
    navigateTo,
    goBack,
    goForward,
    reload,
    stop,
    createChildTab,
    getTab: useCallback((tabId: string) => browserService.getTab(tabId), [browserService]),
    getAllTabs: useCallback(() => browserService.getAllTabs(), [browserService]),
    getHistory: useCallback(() => browserService.getHistory(), [browserService]),
  };
};

