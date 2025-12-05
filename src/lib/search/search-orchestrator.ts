/**
 * Search Orchestrator - Ultra-Premium Search Intelligence Layer
 * Coordinates all search services and implements RAG (Retrieval-Augmented Generation)
 */

import { SearchConfig } from './config';
import { openAIService, ChatMessage } from './services/openai-service';
import { vectorSearchService } from './services/vector-search-service';
import { webSearchService } from './services/web-search-service';
import { algoliaService } from './services/algolia-service';
import { analyticsService } from './services/analytics-service';

export interface SearchResult {
  id: string;
  title: string;
  module: string;
  section?: string;
  content: string;
  path: string;
  relevance: number;
  source: 'documentation' | 'vector' | 'algolia';
  version?: string;
}

export interface AIResponse {
  answer: string;
  sources: Array<{
    title: string;
    url: string;
    type: 'docs' | 'web';
    excerpt?: string;
  }>;
  confidence: number;
  searchTime: number;
}

export interface SearchOptions {
  scope?: 'this-page' | 'all-docs' | 'all-versions';
  currentModule?: string;
  useAI?: boolean;
  useWeb?: boolean;
  useVector?: boolean;
  conversationHistory?: ChatMessage[];
}

class SearchOrchestrator {
  /**
   * Perform intelligent search with fallback hierarchy
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const startTime = Date.now();
    
    try {
      let results: SearchResult[] = [];

      // Try Algolia first (fastest, most reliable)
      if (SearchConfig.features.useAlgolia && algoliaService.isConfigured()) {
        results = await this.searchAlgolia(query, options);
      }
      
      // Fallback to vector search if enabled
      if (results.length === 0 && SearchConfig.features.usePinecone && options.useVector) {
        results = await this.searchVector(query, options);
      }
      
      // Final fallback to local semantic search
      if (results.length === 0) {
        results = await this.searchLocal(query, options);
      }

      // Track analytics
      const searchTime = Date.now() - startTime;
      analyticsService.trackSearch({
        query,
        resultCount: results.length,
        searchTime,
        searchScope: options.scope || 'all-docs',
      });

      if (results.length === 0) {
        analyticsService.trackNoResults(query, options.scope || 'all-docs');
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  /**
   * AI-powered conversational search with RAG
   */
  async aiSearch(query: string, options: SearchOptions = {}): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Retrieve relevant documentation
      const docResults = await this.search(query, {
        ...options,
        useVector: true,
      });

      // Step 2: Optionally search the web
      let webResults: any[] = [];
      if (options.useWeb && SearchConfig.features.useWebSearch) {
        const webResponse = await webSearchService.search(query, 5);
        webResults = webResponse.results;
      }

      // Step 3: Prepare context for AI
      const documentationContext = docResults
        .slice(0, 5)
        .map(result => `${result.title}\n${result.content}\nSource: ${result.path}`);

      // Step 4: Generate AI response with GPT-4
      // Use enhanced web search method when web results are available
      let answer: string;
      
      if (SearchConfig.features.useOpenAI && openAIService.isConfigured()) {
        if (options.useWeb && webResults.length > 0) {
          // Enhanced web search mode: combine docs + web results
          answer = await openAIService.generateAnswerWithWebSearch(
            query,
            documentationContext,
            webResults,
            options.conversationHistory || []
          );
        } else {
          // Standard docs-only mode
          answer = await openAIService.generateAnswer(
            query,
            documentationContext,
            options.conversationHistory || []
          );
        }
      } else {
        // Fallback to synthesized answer without AI
        answer = this.synthesizeAnswerLocal(query, docResults, webResults);
      }

      // Step 5: Compile sources
      const sources = [
        ...docResults.slice(0, 3).map(result => ({
          title: result.title,
          url: result.path,
          type: 'docs' as const,
          excerpt: result.content.substring(0, 150) + '...',
        })),
        ...webResults.slice(0, 2).map(result => ({
          title: result.title,
          url: result.url,
          type: 'web' as const,
        })),
      ];

      const searchTime = Date.now() - startTime;

      // Track AI query
      analyticsService.trackAIQuery({
        query,
        responseTime: searchTime,
        sourcesCount: sources.length,
      });

      return {
        answer,
        sources,
        confidence: docResults.length > 0 ? 0.9 : 0.5,
        searchTime,
      };
    } catch (error) {
      console.error('AI Search error:', error);
      
      return {
        answer: `I encountered an error while searching for "${query}". Please try rephrasing your question or contact support if the issue persists.`,
        sources: [],
        confidence: 0,
        searchTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Search using Algolia
   */
  private async searchAlgolia(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const filters = this.buildAlgoliaFilters(options);
      const response = await algoliaService.search(query, { filters });

      return response.hits.map((hit, index) => ({
        id: hit.objectID,
        title: hit.title,
        module: hit.module,
        section: hit.section,
        content: hit.content,
        path: hit.path,
        relevance: 100 - index,
        source: 'algolia' as const,
        version: hit.version,
      }));
    } catch (error) {
      console.error('Algolia search error:', error);
      return [];
    }
  }

  /**
   * Search using vector embeddings
   */
  private async searchVector(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const filter = this.buildVectorFilter(options);
      const response = await vectorSearchService.search(query, 10, filter);

      return response.matches.map(match => ({
        id: match.id,
        title: match.metadata.title,
        module: match.metadata.module,
        section: match.metadata.section,
        content: match.metadata.content,
        path: match.metadata.path,
        relevance: match.score * 100,
        source: 'vector' as const,
        version: match.metadata.version,
      }));
    } catch (error) {
      console.error('Vector search error:', error);
      return [];
    }
  }

  /**
   * Local semantic search (fallback)
   */
  private async searchLocal(query: string, options: SearchOptions): Promise<SearchResult[]> {
    // Import the local documentation database
    const { documentationDatabase } = await import('../../components/AISearchDialog');
    
    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(/\s+/);

    const results = documentationDatabase
      .map((doc: any) => {
        let relevance = 0;

        // Scope filtering
        if (options.scope === 'this-page' && options.currentModule) {
          if (doc.module.toLowerCase().replace(/\s+/g, '-') !== options.currentModule.toLowerCase()) {
            return null;
          }
        }

        // Calculate relevance
        keywords.forEach((keyword) => {
          if (doc.title.toLowerCase().includes(keyword)) relevance += 10;
          if (doc.content.toLowerCase().includes(keyword)) relevance += 5;
          if (doc.module.toLowerCase().includes(keyword)) relevance += 7;
          if (doc.section?.toLowerCase().includes(keyword)) relevance += 6;
        });

        return relevance > 0 ? { ...doc, relevance, source: 'documentation' as const } : null;
      })
      .filter((doc: any): doc is SearchResult => doc !== null)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);

    return results;
  }

  /**
   * Synthesize answer from local data (fallback when no AI)
   */
  private synthesizeAnswerLocal(query: string, docResults: SearchResult[], webResults: any[]): string {
    if (docResults.length === 0 && webResults.length === 0) {
      return `I couldn't find specific information about "${query}" in the documentation. Could you try rephrasing your question or provide more context?`;
    }

    let answer = `Based on the Virima documentation, here's what I found about ${query}:\n\n`;

    docResults.slice(0, 3).forEach((result, index) => {
      answer += `**${index + 1}. ${result.title}**\n${result.content}\n\n`;
    });

    if (docResults.length > 3) {
      answer += `\nI found ${docResults.length - 3} additional related documentation pages that might be helpful.`;
    }

    if (webResults.length > 0) {
      answer += `\n\n**Additional Resources:**\n`;
      webResults.slice(0, 2).forEach((result) => {
        answer += `\n• ${result.title} (${result.domain})`;
      });
    }

    return answer;
  }

  /**
   * Build Algolia filters based on search options
   */
  private buildAlgoliaFilters(options: SearchOptions): string | undefined {
    const filters: string[] = [];

    if (options.scope === 'this-page' && options.currentModule) {
      filters.push(`module:"${options.currentModule}"`);
    }

    return filters.length > 0 ? filters.join(' AND ') : undefined;
  }

  /**
   * Build vector search filter
   */
  private buildVectorFilter(options: SearchOptions): Record<string, any> | undefined {
    if (options.scope === 'this-page' && options.currentModule) {
      return { module: options.currentModule };
    }
    return undefined;
  }

  /**
   * Transcribe audio for voice search
   */
  async transcribeVoice(audioBlob: Blob): Promise<string> {
    const startTime = Date.now();

    try {
      if (!SearchConfig.features.useVoiceSearch) {
        throw new Error('Voice search is not enabled');
      }

      if (!openAIService.isConfigured()) {
        throw new Error('OpenAI is not configured for voice transcription');
      }

      const transcript = await openAIService.transcribeAudio(audioBlob);
      
      const transcriptionTime = Date.now() - startTime;
      analyticsService.trackVoiceSearch({
        query: transcript,
        transcriptionTime,
      });

      return transcript;
    } catch (error) {
      console.error('Voice transcription error:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions (autocomplete)
   */
  async getSuggestions(query: string): Promise<string[]> {
    if (SearchConfig.features.useAlgolia && algoliaService.isConfigured()) {
      return algoliaService.getSuggestions(query);
    }
    
    // Fallback to local suggestions
    return [
      'How do I configure SNMP discovery?',
      'What are the best practices for cloud discovery?',
      'How do I set up incident management workflows?',
      'Explain the CMDB relationship mapping process',
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get search metrics
   */
  getMetrics() {
    return analyticsService.getMetrics();
  }
}

export const searchOrchestrator = new SearchOrchestrator();
