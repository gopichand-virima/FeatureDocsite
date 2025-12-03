/**
 * Algolia Service - Enterprise Search Infrastructure
 * Provides typo-tolerant, faceted search with sub-50ms latency
 */

import { SearchConfig } from '../config';

export interface AlgoliaSearchResult {
  objectID: string;
  title: string;
  content: string;
  module: string;
  section?: string;
  path: string;
  version?: string;
  _highlightResult?: any;
  _snippetResult?: any;
}

export interface AlgoliaSearchResponse {
  hits: AlgoliaSearchResult[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  facets?: Record<string, Record<string, number>>;
}

export interface AlgoliaSearchOptions {
  hitsPerPage?: number;
  page?: number;
  filters?: string;
  facets?: string[];
  attributesToHighlight?: string[];
  attributesToSnippet?: string[];
}

class AlgoliaService {
  private appId: string;
  private apiKey: string;
  private indexName: string;
  private baseURL: string;

  constructor() {
    this.appId = SearchConfig.algolia.appId;
    this.apiKey = SearchConfig.algolia.apiKey;
    this.indexName = SearchConfig.algolia.indexName;
    this.baseURL = `https://${this.appId}-dsn.algolia.net/1/indexes/${this.indexName}`;
  }

  /**
   * Perform search with Algolia
   */
  async search(
    query: string,
    options: AlgoliaSearchOptions = {}
  ): Promise<AlgoliaSearchResponse> {
    try {
      const searchParams = {
        query,
        hitsPerPage: options.hitsPerPage || 10,
        page: options.page || 0,
        filters: options.filters,
        facets: options.facets,
        attributesToHighlight: options.attributesToHighlight || ['title', 'content'],
        attributesToSnippet: options.attributesToSnippet || ['content:20'],
      };

      const response = await fetch(`${this.baseURL}/query`, {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': this.appId,
          'X-Algolia-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: new URLSearchParams(
            Object.entries(searchParams)
              .filter(([_, value]) => value !== undefined)
              .map(([key, value]) => [
                key,
                Array.isArray(value) ? JSON.stringify(value) : String(value),
              ])
          ).toString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Algolia API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Algolia Search Error:', error);
      throw error;
    }
  }

  /**
   * Search with faceted filtering
   */
  async facetedSearch(
    query: string,
    facetFilters: Record<string, string[]>
  ): Promise<AlgoliaSearchResponse> {
    const filters = Object.entries(facetFilters)
      .map(([facet, values]) => {
        if (values.length === 0) return '';
        return `(${values.map(v => `${facet}:${v}`).join(' OR ')})`;
      })
      .filter(Boolean)
      .join(' AND ');

    return this.search(query, {
      filters,
      facets: Object.keys(facetFilters),
    });
  }

  /**
   * Get search suggestions (autocomplete)
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await this.search(query, {
        hitsPerPage: limit,
        attributesToHighlight: [],
        attributesToSnippet: [],
      });

      return response.hits.map(hit => hit.title);
    } catch (error) {
      console.error('Algolia Suggestions Error:', error);
      return [];
    }
  }

  /**
   * Index a document
   */
  async indexDocument(document: Omit<AlgoliaSearchResult, 'objectID'> & { objectID?: string }): Promise<void> {
    try {
      const objectID = document.objectID || this.generateObjectID(document);
      
      await fetch(`${this.baseURL}/${objectID}`, {
        method: 'PUT',
        headers: {
          'X-Algolia-Application-Id': this.appId,
          'X-Algolia-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...document, objectID }),
      });
    } catch (error) {
      console.error('Algolia Index Error:', error);
      throw error;
    }
  }

  /**
   * Batch index documents
   */
  async indexDocuments(documents: Array<Omit<AlgoliaSearchResult, 'objectID'> & { objectID?: string }>): Promise<void> {
    try {
      const requests = documents.map(doc => ({
        action: 'addObject',
        body: {
          ...doc,
          objectID: doc.objectID || this.generateObjectID(doc),
        },
      }));

      await fetch(`${this.baseURL}/batch`, {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': this.appId,
          'X-Algolia-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });
    } catch (error) {
      console.error('Algolia Batch Index Error:', error);
      throw error;
    }
  }

  /**
   * Generate unique object ID from document
   */
  private generateObjectID(document: Partial<AlgoliaSearchResult>): string {
    const base = `${document.module}-${document.section}-${document.title}`;
    return base.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  /**
   * Check if Algolia is configured
   */
  isConfigured(): boolean {
    return (
      this.appId !== 'YOUR_ALGOLIA_APP_ID' &&
      this.apiKey !== 'YOUR_ALGOLIA_API_KEY'
    );
  }
}

export const algoliaService = new AlgoliaService();
