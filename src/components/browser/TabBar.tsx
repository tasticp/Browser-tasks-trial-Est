import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BrowserTab } from '@/core/engine/types';

interface TabBarProps {
  tabs: BrowserTab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

export const TabBar = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onNewTab,
}: TabBarProps) => {
  return (
    <div className="flex items-center gap-1 px-2 bg-muted/30 border-b overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={cn(
            'group flex items-center gap-2 px-3 py-2 min-w-[200px] max-w-[240px] cursor-pointer',
            'border-b-2 transition-colors',
            activeTabId === tab.id
              ? 'bg-background border-primary text-foreground'
              : 'bg-muted/50 border-transparent hover:bg-muted text-muted-foreground'
          )}
        >
          {tab.favicon ? (
            <img
              src={tab.favicon}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={(e) => {
                // Security: Validate favicon URL is safe
                const img = e.target as HTMLImageElement;
                try {
                  const url = new URL(img.src);
                  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                    img.style.display = 'none';
                  }
                } catch {
                  img.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="truncate flex-1 text-sm">
            {tab.title || 'New Tab'}
          </span>
          {tab.isLoading && (
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            title="Close tab"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={onNewTab}
        title="New tab"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

