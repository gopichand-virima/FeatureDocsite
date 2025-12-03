/**
 * Analytics Service - Search Analytics & User Behavior Tracking
 * Tracks search queries, results, and user interactions
 */

import { SearchConfig } from '../config';

export interface SearchAnalyticsEvent {
  eventType: 'search' | 'click' | 'voice_search' | 'no_results' | 'ai_query' | 'feedback';
  query: string;
  resultCount?: number;
  clickedResult?: string;
  searchTime?: number;
  searchScope?: string;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SearchMetrics {
  totalSearches: number;
  avgSearchTime: number;
  successRate: number;
  noResultsRate: number;
  popularQueries: Array<{ query: string; count: number }>;
  clickThroughRate: number;
}

class AnalyticsService {
  private events: SearchAnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Track a search event
   */
  trackSearch(params: {
    query: string;
    resultCount: number;
    searchTime: number;
    searchScope: string;
    metadata?: Record<string, any>;
  }): void {
    const event: SearchAnalyticsEvent = {
      eventType: 'search',
      query: params.query,
      resultCount: params.resultCount,
      searchTime: params.searchTime,
      searchScope: params.searchScope,
      sessionId: this.sessionId,
      timestamp: new Date(),
      metadata: params.metadata,
    };

    this.events.push(event);
    this.sendToMixpanel(event);
    this.sendToAmplitude(event);
  }

  /**
   * Track a result click
   */
  trackClick(params: {
    query: string;
    clickedResult: string;
    resultPosition?: number;
    metadata?: Record<string, any>;
  }): void {
    const event: SearchAnalyticsEvent = {
      eventType: 'click',
      query: params.query,
      clickedResult: params.clickedResult,
      sessionId: this.sessionId,
      timestamp: new Date(),
      metadata: {
        ...params.metadata,
        resultPosition: params.resultPosition,
      },
    };

    this.events.push(event);
    this.sendToMixpanel(event);
    this.sendToAmplitude(event);
  }

  /**
   * Track voice search
   */
  trackVoiceSearch(params: {
    query: string;
    transcriptionTime: number;
    metadata?: Record<string, any>;
  }): void {
    const event: SearchAnalyticsEvent = {
      eventType: 'voice_search',
      query: params.query,
      sessionId: this.sessionId,
      timestamp: new Date(),
      metadata: {
        ...params.metadata,
        transcriptionTime: params.transcriptionTime,
      },
    };

    this.events.push(event);
    this.sendToMixpanel(event);
    this.sendToAmplitude(event);
  }

  /**
   * Track no results
   */
  trackNoResults(query: string, searchScope: string): void {
    const event: SearchAnalyticsEvent = {
      eventType: 'no_results',
      query,
      searchScope,
      sessionId: this.sessionId,
      timestamp: new Date(),
    };

    this.events.push(event);
    this.sendToMixpanel(event);
    this.sendToAmplitude(event);
  }

  /**
   * Track AI assistant query
   */
  trackAIQuery(params: {
    query: string;
    responseTime: number;
    sourcesCount: number;
    metadata?: Record<string, any>;
  }): void {
    const event: SearchAnalyticsEvent = {
      eventType: 'ai_query',
      query: params.query,
      sessionId: this.sessionId,
      timestamp: new Date(),
      metadata: {
        ...params.metadata,
        responseTime: params.responseTime,
        sourcesCount: params.sourcesCount,
      },
    };

    this.events.push(event);
    this.sendToMixpanel(event);
    this.sendToAmplitude(event);
  }

  /**
   * Get search metrics for analysis
   */
  getMetrics(): SearchMetrics {
    const searches = this.events.filter(e => e.eventType === 'search');
    const clicks = this.events.filter(e => e.eventType === 'click');
    const noResults = this.events.filter(e => e.eventType === 'no_results');

    const totalSearches = searches.length;
    const avgSearchTime = searches.reduce((sum, e) => sum + (e.searchTime || 0), 0) / totalSearches || 0;
    const successRate = totalSearches > 0 ? ((totalSearches - noResults.length) / totalSearches) * 100 : 0;
    const noResultsRate = totalSearches > 0 ? (noResults.length / totalSearches) * 100 : 0;
    const clickThroughRate = totalSearches > 0 ? (clicks.length / totalSearches) * 100 : 0;

    // Calculate popular queries
    const queryCounts = new Map<string, number>();
    searches.forEach(e => {
      queryCounts.set(e.query, (queryCounts.get(e.query) || 0) + 1);
    });

    const popularQueries = Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches,
      avgSearchTime,
      successRate,
      noResultsRate,
      popularQueries,
      clickThroughRate,
    };
  }

  /**
   * Send event to Mixpanel
   */
  private sendToMixpanel(event: SearchAnalyticsEvent): void {
    if (!SearchConfig.features.useAnalytics) return;

    try {
      // Mixpanel integration
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.track(event.eventType, {
          query: event.query,
          resultCount: event.resultCount,
          searchTime: event.searchTime,
          sessionId: event.sessionId,
          ...event.metadata,
        });
      }
    } catch (error) {
      console.error('Mixpanel tracking error:', error);
    }
  }

  /**
   * Send event to Amplitude
   */
  private sendToAmplitude(event: SearchAnalyticsEvent): void {
    if (!SearchConfig.features.useAnalytics) return;

    try {
      // Amplitude integration
      if (typeof window !== 'undefined' && (window as any).amplitude) {
        (window as any).amplitude.track(event.eventType, {
          query: event.query,
          resultCount: event.resultCount,
          searchTime: event.searchTime,
          sessionId: event.sessionId,
          ...event.metadata,
        });
      }
    } catch (error) {
      console.error('Amplitude tracking error:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Export analytics data
   */
  exportData(): SearchAnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();
