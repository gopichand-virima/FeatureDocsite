/**
 * Search History Service
 * Tracks and persists user search queries in localStorage
 * 
 * Features:
 * - Real-time capture of all search queries
 * - Persistent storage across sessions
 * - Automatic deduplication
 * - Timestamp tracking
 * - Configurable max entries
 * - Ordered by recency (newest first)
 */

export interface SearchHistoryEntry {
  query: string;
  timestamp: number;
  type?: 'docs' | 'web' | 'ai';
}

export interface SearchHistoryConfig {
  maxEntries: number;
  storageKey: string;
  enableTimestamps: boolean;
}

export class SearchHistoryService {
  private config: SearchHistoryConfig;
  private history: SearchHistoryEntry[] = [];

  constructor(config?: Partial<SearchHistoryConfig>) {
    this.config = {
      maxEntries: config?.maxEntries || 10,
      storageKey: config?.storageKey || 'virima_search_history',
      enableTimestamps: config?.enableTimestamps ?? true,
    };

    this.loadHistory();
  }

  /**
   * Add a new search query to history
   */
  addSearch(query: string, type: 'docs' | 'web' | 'ai' = 'docs'): void {
    const trimmedQuery = query.trim();
    
    // Ignore empty queries
    if (!trimmedQuery) {
      return;
    }

    // Remove existing entry if it exists (deduplication)
    this.history = this.history.filter(
      entry => entry.query.toLowerCase() !== trimmedQuery.toLowerCase()
    );

    // Add new entry at the beginning (most recent first)
    const newEntry: SearchHistoryEntry = {
      query: trimmedQuery,
      timestamp: Date.now(),
      type,
    };

    this.history.unshift(newEntry);

    // Limit to max entries
    if (this.history.length > this.config.maxEntries) {
      this.history = this.history.slice(0, this.config.maxEntries);
    }

    // Persist to localStorage
    this.saveHistory();
  }

  /**
   * Get all search history entries
   */
  getHistory(): SearchHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Get search history as simple string array (for backward compatibility)
   */
  getHistoryQueries(): string[] {
    return this.history.map(entry => entry.query);
  }

  /**
   * Get recent searches (last N entries)
   */
  getRecentSearches(limit?: number): SearchHistoryEntry[] {
    const maxLimit = limit || this.config.maxEntries;
    return this.history.slice(0, maxLimit);
  }

  /**
   * Clear all search history
   */
  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Remove a specific search from history
   */
  removeSearch(query: string): void {
    this.history = this.history.filter(
      entry => entry.query !== query
    );
    this.saveHistory();
  }

  /**
   * Check if there's any search history
   */
  hasHistory(): boolean {
    return this.history.length > 0;
  }

  /**
   * Get history count
   */
  getHistoryCount(): number {
    return this.history.length;
  }

  /**
   * Load history from localStorage
   */
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validate and migrate data if needed
        if (Array.isArray(parsed)) {
          // Handle both old format (string[]) and new format (SearchHistoryEntry[])
          if (parsed.length === 0) {
            this.history = [];
          } else if (typeof parsed[0] === 'string') {
            // Migrate old format to new format
            this.history = parsed.map((query: string) => ({
              query,
              timestamp: Date.now(),
              type: 'docs' as const,
            }));
            this.saveHistory(); // Save migrated data
          } else {
            this.history = parsed;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
      this.history = [];
    }
  }

  /**
   * Save history to localStorage
   */
  private saveHistory(): void {
    try {
      localStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.history)
      );
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  /**
   * Get formatted timestamp for display
   */
  getFormattedTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Export history as JSON (for backup/debugging)
   */
  exportHistory(): string {
    return JSON.stringify(this.history, null, 2);
  }

  /**
   * Import history from JSON (for restore)
   */
  importHistory(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        this.history = parsed;
        this.saveHistory();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import search history:', error);
      return false;
    }
  }
}

// Export singleton instance
export const searchHistoryService = new SearchHistoryService({
  maxEntries: 10, // Keep last 10 searches
  storageKey: 'virima_search_history',
  enableTimestamps: true,
});
