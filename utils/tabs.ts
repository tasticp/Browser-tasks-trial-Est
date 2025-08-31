// Utility for browser tab operations
/**
 * Returns the active tab in the current window for Chrome or browser extension APIs.
 */
export async function getActiveTab(): Promise<any | undefined> {
  return new Promise((resolve) => {
    // Support both Chrome and browser extension APIs
    const chromeTabs = typeof chrome !== 'undefined' && chrome.tabs;
    const browserTabs = (window as any).browser && (window as any).browser.tabs;
    if (chromeTabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        resolve(tabs[0]);
      });
    } else if (browserTabs) {
      (window as any).browser.tabs.query({ active: true, currentWindow: true }).then((tabs: any[]) => {
        resolve(tabs[0]);
      });
    } else {
      resolve(undefined);
    }
  });
}
