/**
 * Security utilities for URL validation and sanitization
 */

/**
 * List of dangerous protocols that should be blocked
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:',
] as const;

/**
 * Allowed protocols for navigation
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:'] as const;

/**
 * Validates and sanitizes a URL input
 * @param input - The URL or search query to validate
 * @returns A normalized, safe URL
 * @throws Error if the URL contains dangerous content
 */
export function validateAndSanitizeURL(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid URL: input must be a non-empty string');
  }

  const sanitized = input.trim();
  
  // Check for dangerous protocols
  const lowerInput = sanitized.toLowerCase();
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lowerInput.startsWith(protocol)) {
      throw new Error(`Blocked protocol: ${protocol}`);
    }
  }

  // Try to parse as URL
  try {
    const url = new URL(sanitized);
    
    // Only allow http and https
    if (!ALLOWED_PROTOCOLS.includes(url.protocol as typeof ALLOWED_PROTOCOLS[number])) {
      throw new Error(`Only http:// and https:// protocols are allowed`);
    }
    
    return url.href;
  } catch {
    // If not a valid URL, try with https://
    try {
      const url = new URL(`https://${sanitized}`);
      return url.href;
    } catch {
      // If all else fails, treat as search query
      return `https://www.google.com/search?q=${encodeURIComponent(sanitized)}`;
    }
  }
}

/**
 * Checks if a URL is safe to navigate to
 * @param url - The URL to check
 * @returns true if the URL is safe, false otherwise
 */
export function isSafeURL(url: string): boolean {
  try {
    validateAndSanitizeURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes user input to prevent XSS
 * @param input - The input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters and patterns
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validates that a string is a valid tab ID
 * @param tabId - The tab ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidTabId(tabId: string): boolean {
  return typeof tabId === 'string' && tabId.length > 0 && /^tab-/.test(tabId);
}

