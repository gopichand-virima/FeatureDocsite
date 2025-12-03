/**
 * Vector Search Service - Pinecone Integration
 * Handles semantic search using vector embeddings
 */

import { SearchConfig } from '../config';
import { openAIService } from './openai-service';

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: {
    title: string;
    content: string;
    module: string;
    section?: string;
    path: string;
    version?: string;
  };
}

export interface VectorSearchResponse {
  matches: VectorSearchResult[];
  totalResults: number;
}

class VectorSearchService {
  private apiKey: string;
  private indexName: string;
  private environment: string;

  constructor() {
    this.apiKey = SearchConfig.pinecone.apiKey;
    this.indexName = SearchConfig.pinecone.indexName;
    this.environment = SearchConfig.pinecone.environment;
  }

  /**
   * Perform semantic search using vector embeddings
   */
  async search(
    query: string,
    topK: number = 10,
    filter?: Record<string, any>
  ): Promise<VectorSearchResponse> {
    try {
      // Generate embedding for the query
      const { embedding } = await openAIService.createEmbedding(query);

      // Query Pinecone
      const response = await fetch(
        `https://${this.indexName}-${this.environment}.svc.pinecone.io/query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey,
          },
          body: JSON.stringify({
            vector: embedding,
            topK,
            includeMetadata: true,
            filter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Pinecone API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        matches: data.matches.map((match: any) => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        })),
        totalResults: data.matches.length,
      };
    } catch (error) {
      console.error('Vector Search Error:', error);
      throw error;
    }
  }

  /**
   * Upsert document embeddings to Pinecone
   */
  async upsertDocuments(
    documents: Array<{
      id: string;
      content: string;
      metadata: Record<string, any>;
    }>
  ): Promise<void> {
    try {
      // Generate embeddings for all documents
      const vectors = await Promise.all(
        documents.map(async (doc) => {
          const { embedding } = await openAIService.createEmbedding(doc.content);
          return {
            id: doc.id,
            values: embedding,
            metadata: doc.metadata,
          };
        })
      );

      // Upsert to Pinecone
      const response = await fetch(
        `https://${this.indexName}-${this.environment}.svc.pinecone.io/vectors/upsert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey,
          },
          body: JSON.stringify({
            vectors,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Pinecone Upsert error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Vector Upsert Error:', error);
      throw error;
    }
  }

  /**
   * Check if Pinecone is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== 'YOUR_PINECONE_API_KEY' && this.apiKey.length > 0;
  }
}

export const vectorSearchService = new VectorSearchService();
