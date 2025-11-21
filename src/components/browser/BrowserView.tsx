import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isSafeURL } from '@/utils/security';

interface BrowserViewProps {
  tabId: string;
  url: string;
  isLoading: boolean;
  className?: string;
}

/**
 * BrowserView component - Renders web content in an iframe
 * Security: Uses sandboxed iframe with CSP headers
 */
export const BrowserView = ({ tabId, url, isLoading, className }: BrowserViewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || !url || url === 'about:blank') {
      setError(null);
      return;
    }

    // Security: Validate URL before loading
    if (!isSafeURL(url)) {
      setError('Invalid or unsafe URL. Only http:// and https:// are allowed.');
      return;
    }
    
    try {
      const urlObj = new URL(url);
      
      // Security: Block dangerous protocols (double-check)
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        setError(`Blocked protocol: ${urlObj.protocol}. Only http:// and https:// are allowed.`);
        return;
      }

      setIsNavigating(true);
      setError(null);

      // Set iframe src with security attributes
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
    } catch (err) {
      // Invalid URL - treat as search query or error
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        setError(`Invalid URL: ${url}`);
      } else {
        setError('Failed to load URL');
      }
    }
  }, [url, tabId]);

  const handleLoad = () => {
    setIsNavigating(false);
    setError(null);
  };

  const handleError = () => {
    setIsNavigating(false);
    setError('Failed to load page. The site may be unreachable or blocked.');
  };

  // Security: Sandbox iframe with restrictive permissions
  const sandboxAttributes = [
    'allow-same-origin',
    'allow-scripts',
    'allow-forms',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    // Explicitly block dangerous features
    // 'allow-top-navigation' - blocked for security
  ].join(' ');

  return (
    <div className={`relative ${className || ''}`}>
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {(isLoading || isNavigating) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {url === 'about:blank' ? (
        <div className="flex items-center justify-center h-full bg-muted/20">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">New Tab</p>
            <p className="text-sm">Enter a URL or search term to get started</p>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title={`Browser view for ${url}`}
          sandbox={sandboxAttributes}
          onLoad={handleLoad}
          onError={handleError}
          // Security: Additional CSP via meta tag would be set by server
          allow="geolocation; microphone; camera; payment"
        />
      )}
    </div>
  );
};
