/**
 * Web Search Service - Multi-Source Web Search Integration
 * Aggregates results from Serper, Brave, and Bing APIs
 */

import { SearchConfig } from '../config';

export interface WebSearchResult {
  title: string;
  url: string;
  description: string;
  domain: string;
  source: 'serper' | 'brave' | 'bing';
  relevanceScore?: number;
}

export interface WebSearchResponse {
  results: WebSearchResult[];
  totalResults: number;
  searchTime: number;
}

class WebSearchService {
  /**
   * Search using Serper API (Google Search wrapper)
   */
  private async searchSerper(query: string, limit: number = 10): Promise<WebSearchResult[]> {
    try {
      const response = await fetch(SearchConfig.webSearch.serper.endpoint, {
        method: 'POST',
        headers: {
          'X-API-KEY': SearchConfig.webSearch.serper.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: `${query} site:virima.com OR site:community.virima.com OR site:support.virima.com`,
          num: limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return (data.organic || []).map((result: any) => ({
        title: result.title,
        url: result.link,
        description: result.snippet,
        domain: new URL(result.link).hostname,
        source: 'serper' as const,
        relevanceScore: result.position ? 1 / result.position : 0,
      }));
    } catch (error) {
      console.error('Serper Search Error:', error);
      return [];
    }
  }

  /**
   * Search using Brave Search API
   */
  private async searchBrave(query: string, limit: number = 10): Promise<WebSearchResult[]> {
    try {
      const response = await fetch(
        `${SearchConfig.webSearch.brave.endpoint}?q=${encodeURIComponent(query)}&count=${limit}`,
        {
          headers: {
            'X-Subscription-Token': SearchConfig.webSearch.brave.apiKey,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Brave API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return (data.web?.results || []).map((result: any) => ({
        title: result.title,
        url: result.url,
        description: result.description,
        domain: new URL(result.url).hostname,
        source: 'brave' as const,
      }));
    } catch (error) {
      console.error('Brave Search Error:', error);
      return [];
    }
  }

  /**
   * Search using Bing Search API
   */
  private async searchBing(query: string, limit: number = 10): Promise<WebSearchResult[]> {
    try {
      const response = await fetch(
        `${SearchConfig.webSearch.bing.endpoint}?q=${encodeURIComponent(query)}&count=${limit}`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': SearchConfig.webSearch.bing.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Bing API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return (data.webPages?.value || []).map((result: any) => ({
        title: result.name,
        url: result.url,
        description: result.snippet,
        domain: new URL(result.url).hostname,
        source: 'bing' as const,
      }));
    } catch (error) {
      console.error('Bing Search Error:', error);
      return [];
    }
  }

  /**
   * Perform multi-source web search
   */
  async search(query: string, limit: number = 10): Promise<WebSearchResponse> {
    const startTime = Date.now();

    try {
      // Search all sources in parallel
      const [serperResults, braveResults, bingResults] = await Promise.allSettled([
        this.searchSerper(query, Math.ceil(limit / 2)),
        this.searchBrave(query, Math.ceil(limit / 3)),
        this.searchBing(query, Math.ceil(limit / 3)),
      ]);

      // Aggregate results
      const allResults: WebSearchResult[] = [];

      if (serperResults.status === 'fulfilled') {
        allResults.push(...serperResults.value);
      }
      if (braveResults.status === 'fulfilled') {
        allResults.push(...braveResults.value);
      }
      if (bingResults.status === 'fulfilled') {
        allResults.push(...bingResults.value);
      }

      // Deduplicate by URL
      const uniqueResults = Array.from(
        new Map(allResults.map(result => [result.url, result])).values()
      );

      // Sort by relevance and domain priority
      const sortedResults = uniqueResults.sort((a, b) => {
        // Prioritize Virima domains
        const aIsVirima = a.domain.includes('virima.com');
        const bIsVirima = b.domain.includes('virima.com');
        
        if (aIsVirima && !bIsVirima) return -1;
        if (!aIsVirima && bIsVirima) return 1;
        
        // Then by relevance score
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });

      const searchTime = Date.now() - startTime;

      return {
        results: sortedResults.slice(0, limit),
        totalResults: sortedResults.length,
        searchTime,
      };
    } catch (error) {
      console.error('Web Search Error:', error);
      return {
        results: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Search specific domains (e.g., Stack Overflow, GitHub)
   */
  async searchDomain(query: string, domain: string, limit: number = 5): Promise<WebSearchResult[]> {
    const domainQuery = `${query} site:${domain}`;
    const response = await this.search(domainQuery, limit);
    return response.results;
  }

  /**
   * Check if any web search API is configured
   */
  isConfigured(): boolean {
    return (
      SearchConfig.webSearch.serper.apiKey !== 'YOUR_SERPER_API_KEY' ||
      SearchConfig.webSearch.brave.apiKey !== 'YOUR_BRAVE_API_KEY' ||
      SearchConfig.webSearch.bing.apiKey !== 'YOUR_BING_API_KEY'
    );
  }
}

export const webSearchService = new WebSearchService();
