/**
 * Rapid Indexing Protocol (RIP) - Instant Search Engine Notification
 * Implements Google Indexing API, IndexNow, and other rapid indexing protocols
 */

export interface IndexingConfig {
  googleApiKey?: string;
  googleClientEmail?: string;
  indexNowKey?: string;
  bingApiKey?: string;
}

export class RapidIndexingService {
  private config: IndexingConfig;
  private baseUrl = 'https://docs.virima.com';

  constructor(config: IndexingConfig = {}) {
    this.config = config;
  }

  /**
   * Notify all search engines about URL updates
   */
  async notifyAllEngines(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<void> {
    const promises = [
      this.notifyGoogleIndexing(url, type),
      this.notifyIndexNow(url),
      this.notifyBing(url),
      this.pingPubSubHubbub()
    ];

    await Promise.allSettled(promises);
  }

  /**
   * Google Indexing API - Same-day indexing
   */
  private async notifyGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED'): Promise<void> {
    if (!this.config.googleApiKey) {
      console.log('Google Indexing API: No API key configured');
      return;
    }

    try {
      const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.googleApiKey}`
        },
        body: JSON.stringify({
          url: url,
          type: type
        })
      });

      if (response.ok) {
        console.log(`✓ Google Indexing API notified for: ${url}`);
      }
    } catch (error) {
      console.error('Google Indexing API error:', error);
    }
  }

  /**
   * IndexNow Protocol - Instant Bing/Yandex indexing
   */
  private async notifyIndexNow(url: string): Promise<void> {
    const indexNowKey = this.config.indexNowKey || 'your-indexnow-key-here';
    
    const endpoints = [
      'https://www.bing.com/indexnow',
      'https://api.indexnow.org/indexnow',
      'https://yandex.com/indexnow'
    ];

    const payload = {
      host: 'docs.virima.com',
      key: indexNowKey,
      keyLocation: `https://docs.virima.com/${indexNowKey}.txt`,
      urlList: [url]
    };

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          console.log(`✓ IndexNow notified (${endpoint}): ${url}`);
        }
      } catch (error) {
        console.error(`IndexNow error (${endpoint}):`, error);
      }
    }
  }

  /**
   * Bing Webmaster API notification
   */
  private async notifyBing(url: string): Promise<void> {
    if (!this.config.bingApiKey) {
      console.log('Bing API: No API key configured');
      return;
    }

    try {
      const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${this.config.bingApiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: this.baseUrl,
          urlList: [url]
        })
      });

      if (response.ok) {
        console.log(`✓ Bing Webmaster API notified for: ${url}`);
      }
    } catch (error) {
      console.error('Bing API error:', error);
    }
  }

  /**
   * PubSubHubbub - Real-time feed updates
   */
  private async pingPubSubHubbub(): Promise<void> {
    const hub = 'https://pubsubhubbub.appspot.com';
    const feedUrl = `${this.baseUrl}/feed.xml`;

    try {
      const response = await fetch(hub, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `hub.mode=publish&hub.url=${encodeURIComponent(feedUrl)}`
      });

      if (response.ok) {
        console.log('✓ PubSubHubbub notified');
      }
    } catch (error) {
      console.error('PubSubHubbub error:', error);
    }
  }

  /**
   * Batch notify for multiple URLs
   */
  async notifyBatch(urls: string[]): Promise<void> {
    console.log(`📢 Notifying search engines about ${urls.length} URLs...`);
    
    for (const url of urls) {
      await this.notifyAllEngines(url);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ All notifications sent!');
  }

  /**
   * Notify on content publish/update
   */
  async onContentUpdate(path: string): Promise<void> {
    const fullUrl = `${this.baseUrl}${path}`;
    console.log(`🚀 Rapid indexing for: ${fullUrl}`);
    await this.notifyAllEngines(fullUrl);
  }
}

/**
 * Singleton instance for application-wide use
 */
export const rapidIndexing = new RapidIndexingService({
  // Configure with your actual API keys in production
  googleApiKey: process.env.GOOGLE_INDEXING_API_KEY,
  indexNowKey: process.env.INDEXNOW_KEY,
  bingApiKey: process.env.BING_WEBMASTER_API_KEY
});

/**
 * Hook to trigger indexing on page navigation
 */
export function useRapidIndexing() {
  return {
    notifyUpdate: (path: string) => rapidIndexing.onContentUpdate(path),
    notifyBatch: (paths: string[]) => {
      const urls = paths.map(p => `https://docs.virima.com${p}`);
      return rapidIndexing.notifyBatch(urls);
    }
  };
}
