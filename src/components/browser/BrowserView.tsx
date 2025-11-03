import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BrowserViewProps {
  tabId: string;
  url: string;
  isLoading: boolean;
  className?: string;
}

/**
 * BrowserView component renders the actual web page
 * In a real implementation with native engine integration,
 * this would embed a WebView component that connects to the engine
 */
export const BrowserView = ({
  tabId,
  url,
  isLoading,
  className,
}: BrowserViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, this would embed the native WebView
    // For now, we'll show a placeholder that indicates where the page would render
    if (containerRef.current && url !== 'about:blank') {
      // This is where a native WebView would be embedded
      // For example: containerRef.current.appendChild(webViewElement);
    }
  }, [tabId, url]);

  if (url === 'about:blank') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'flex items-center justify-center h-full bg-background',
          className
        )}
      >
        <div className="text-center space-y-4">
          <div className="text-6xl">🌐</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">New Tab</h2>
            <p className="text-muted-foreground">
              Enter a URL or search query in the address bar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full bg-background', className)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}
      
      {/* In a real implementation, this would be the native WebView */}
      <iframe
        src={url}
        className="w-full h-full border-0"
        title={url}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="fullscreen; geolocation; microphone; camera"
      />
      
      {/* Note: For a true non-Chromium/Firefox browser, this iframe is just a placeholder.
          In production, you would embed the native rendering engine's WebView here */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md text-xs text-muted-foreground border shadow-sm">
        Engine: WebKit (placeholder - embed native WebView in production)
      </div>
    </div>
  );
};

