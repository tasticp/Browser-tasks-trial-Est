import { useState, useEffect } from 'react';
import { AddressBar } from './AddressBar';
import { TabBar } from './TabBar';
import { BrowserView } from './BrowserView';
import { BrowserService } from '@/services/BrowserService';
import type { BrowserTab } from '@/core/engine/types';

interface BrowserWindowProps {
  engineType?: 'webkit' | 'servo';
  useRust?: boolean; // Use Rust backend for minimal memory
}

export const BrowserWindow = ({ 
  engineType = 'webkit',
  useRust = false 
}: BrowserWindowProps) => {
  const [browserService] = useState(() => new BrowserService(engineType));
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [rustService, setRustService] = useState<any>(null);
  const [memoryStats, setMemoryStats] = useState<{ current: number; peak: number } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (useRust) {
      // Initialize Rust WASM service for minimal memory usage
      import('@/services/RustBrowserService')
        .then(async ({ RustBrowserService }) => {
          try {
            const service = await RustBrowserService.getInstance(engineType);
            setRustService(service);
            
            // Create initial tab
            const tabId = await service.createTab();
            setActiveTabId(tabId);
          } catch (error) {
            console.error('Failed to initialize Rust service:', error);
            // Fallback to TypeScript service on error
            browserService.initialize().then(() => {
              const allTabs = browserService.getAllTabs();
              setTabs(allTabs);
              setActiveTabId(browserService.getActiveTab()?.id || null);
            });
          }
        })
        .catch((error) => {
          console.error('Failed to load Rust service:', error);
          // Fallback to TypeScript service
          browserService.initialize().then(() => {
            const allTabs = browserService.getAllTabs();
            setTabs(allTabs);
            setActiveTabId(browserService.getActiveTab()?.id || null);
          });
        });
    } else {
      // Use TypeScript service
      browserService.initialize().then(() => {
        const allTabs = browserService.getAllTabs();
        setTabs(allTabs);
        setActiveTabId(browserService.getActiveTab()?.id || null);
      }).catch((error) => {
        console.error('Failed to initialize browser service:', error);
      });

      browserService.onTabUpdated = (tab) => {
        setTabs([...browserService.getAllTabs()]);
      };

      // Memory monitoring (would connect to Rust service in production)
      interval = setInterval(() => {
        if (rustService) {
          // Query memory stats from Rust
          // TODO: Implement memory stats query when Rust service is available
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (!useRust) {
        browserService.destroy().catch(console.error);
      }
    };
  }, [browserService, useRust, engineType]);

  const activeTab = useRust && rustService && activeTabId
    ? rustService.getTabInfo(activeTabId)
    : activeTabId
    ? browserService.getTab(activeTabId)
    : null;

  const handleNewTab = async () => {
    if (useRust && rustService) {
      const tabId = await rustService.createTab();
      setActiveTabId(tabId);
    } else {
      const newTab = await browserService.createTab();
      setTabs(browserService.getAllTabs());
      setActiveTabId(newTab.id);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (useRust && rustService) {
      setActiveTabId(tabId);
    } else {
      browserService.setActiveTab(tabId);
      setActiveTabId(tabId);
    }
  };

  const handleTabClose = async (tabId: string) => {
    if (useRust && rustService) {
      await rustService.closeTab(tabId);
      const newActive = rustService.getActiveTab();
      setActiveTabId(newActive);
    } else {
      await browserService.closeTab(tabId);
      setTabs(browserService.getAllTabs());
      
      const newActiveTab = browserService.getActiveTab();
      setActiveTabId(newActiveTab?.id || null);
    }
  };

  const handleNavigate = async (url: string) => {
    if (!activeTabId) return;
    
    // Security: Validate URL before navigation
    if (!url || typeof url !== 'string') {
      console.error('Invalid URL provided');
      return;
    }
    
    try {
      if (useRust && rustService) {
        await rustService.navigate(activeTabId, url);
      } else {
        await browserService.navigateTo(activeTabId, url);
        setTabs([...browserService.getAllTabs()]);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Could show user-friendly error message here
    }
  };

  const handleGoBack = async () => {
    if (!activeTabId) return;
    try {
      if (useRust && rustService) {
        // TODO: Implement Rust service navigation methods
        console.warn('Rust service navigation not yet implemented');
      } else {
        await browserService.goBack(activeTabId);
        setTabs([...browserService.getAllTabs()]);
      }
    } catch (error) {
      console.error('Error going back:', error);
    }
  };

  const handleGoForward = async () => {
    if (!activeTabId) return;
    try {
      if (useRust && rustService) {
        // TODO: Implement Rust service navigation methods
        console.warn('Rust service navigation not yet implemented');
      } else {
        await browserService.goForward(activeTabId);
        setTabs([...browserService.getAllTabs()]);
      }
    } catch (error) {
      console.error('Error going forward:', error);
    }
  };

  const handleReload = async () => {
    if (!activeTabId) return;
    try {
      if (useRust && rustService) {
        // TODO: Implement Rust service reload
        console.warn('Rust service reload not yet implemented');
      } else {
        await browserService.reload(activeTabId);
        setTabs([...browserService.getAllTabs()]);
      }
    } catch (error) {
      console.error('Error reloading:', error);
    }
  };

  const handleStop = async () => {
    if (!activeTabId) return;
    try {
      if (useRust && rustService) {
        // TODO: Implement Rust service stop
        console.warn('Rust service stop not yet implemented');
      } else {
        await browserService.stop(activeTabId);
        setTabs([...browserService.getAllTabs()]);
      }
    } catch (error) {
      console.error('Error stopping:', error);
    }
  };

  // Get tabs list
  const allTabs = useRust && rustService
    ? tabs // TODO: Fetch from Rust service when implemented
    : tabs;

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {memoryStats && (
        <div className="px-4 py-1 text-xs bg-muted/50 border-b">
          Memory: {memoryStats.current.toFixed(2)} MB (Peak: {memoryStats.peak.toFixed(2)} MB)
          {useRust && <span className="ml-2 text-green-600">Rust Engine</span>}
        </div>
      )}
      
      <TabBar
        tabs={allTabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      
      <AddressBar
        url={activeTab?.url || ''}
        isLoading={activeTab?.isLoading || false}
        canGoBack={activeTab?.can_go_back || activeTab?.canGoBack || false}
        canGoForward={activeTab?.can_go_forward || activeTab?.canGoForward || false}
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onStop={handleStop}
      />

      <div className="flex-1 overflow-hidden">
        {activeTab && (
          <BrowserView
            tabId={activeTabId || ''}
            url={activeTab.url || activeTabId || ''}
            isLoading={activeTab.is_loading || activeTab.isLoading || false}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};
