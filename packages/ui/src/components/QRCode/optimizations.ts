   /**
 * QR Code optimization utilities (Legacy API-based generation)
 * 
 * NOTE: This file is now used only for legacy API-based QR generation.
 * The QRCode component no longer uses this API approach by default.
 * Entire file retained only for potential external migration and will be removed.
 * All consumers should rely on <QRCode /> which now always renders the full-spec internal engine.
 */
/**
 * Simple QR code cache for commonly used values
 */
class QRCodeCache {
  private cache = new Map<string, string>();
  private maxSize = 50; // Maximum number of cached QR codes
  
  getCacheKey(value: string, size: number, bg: string, color: string): string {
    return `${value}|${size}|${bg}|${color}`;
  }
  
  get(key: string): string | undefined {
    return this.cache.get(key);
  }
  
  set(key: string, url: string): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, url);
  }
}

export const qrCodeCache = new QRCodeCache();
