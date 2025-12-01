/**
 * Ultra-Premium Search Configuration
 * Centralized configuration for all search and AI services
 */

// Safe environment variable access for browser
const getEnv = (key: string): string | undefined => {
  if (typeof window !== 'undefined') {
    return (window as any)[key];
  }
  return undefined;
};

export const SearchConfig = {
  // OpenAI Configuration - UNRESTRICTED TOKEN ALLOCATION
  openai: {
    apiKey: getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || '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',
    model: 'gpt-4o',
    embeddingModel: 'text-embedding-3-large',
    maxTokens: 16000, // Maximum for GPT-4o - ensures complete responses
    temperature: 0.7,
    enableContinuation: true, // Auto-continue if response is truncated
    maxContinuations: 3, // Allow up to 3 continuation calls for very long responses
  },

  // Anthropic Claude Configuration
  anthropic: {
    apiKey: getEnv('NEXT_PUBLIC_ANTHROPIC_API_KEY') || 'YOUR_ANTHROPIC_API_KEY',
    model: 'claude-3-opus-20240229',
    maxTokens: 4000,
  },

  // Algolia Configuration
  algolia: {
    appId: getEnv('NEXT_PUBLIC_ALGOLIA_APP_ID') || 'YOUR_ALGOLIA_APP_ID',
    apiKey: getEnv('NEXT_PUBLIC_ALGOLIA_API_KEY') || 'YOUR_ALGOLIA_API_KEY',
    indexName: 'virima_documentation',
  },

  // Pinecone Vector Database Configuration
  pinecone: {
    apiKey: getEnv('NEXT_PUBLIC_PINECONE_API_KEY') || 'YOUR_PINECONE_API_KEY',
    environment: 'us-west1-gcp',
    indexName: 'virima-docs-embeddings',
    dimension: 3072, // text-embedding-3-large dimension
  },

  // Elasticsearch Configuration
  elasticsearch: {
    cloudId: getEnv('NEXT_PUBLIC_ELASTICSEARCH_CLOUD_ID') || 'YOUR_CLOUD_ID',
    apiKey: getEnv('NEXT_PUBLIC_ELASTICSEARCH_API_KEY') || 'YOUR_API_KEY',
    indexName: 'virima-documentation',
  },

  // Web Search APIs
  webSearch: {
    // Serper API for real-time web results
    serper: {
      apiKey: getEnv('NEXT_PUBLIC_SERPER_API_KEY') || 'YOUR_SERPER_API_KEY',
      endpoint: 'https://google.serper.dev/search',
    },
    // Brave Search API
    brave: {
      apiKey: getEnv('NEXT_PUBLIC_BRAVE_API_KEY') || 'YOUR_BRAVE_API_KEY',
      endpoint: 'https://api.search.brave.com/res/v1/web/search',
    },
    // Bing Search API
    bing: {
      apiKey: getEnv('NEXT_PUBLIC_BING_API_KEY') || 'YOUR_BING_API_KEY',
      endpoint: 'https://api.bing.microsoft.com/v7.0/search',
    },
  },

  // Azure Cognitive Search
  azure: {
    endpoint: getEnv('NEXT_PUBLIC_AZURE_SEARCH_ENDPOINT') || 'YOUR_AZURE_ENDPOINT',
    apiKey: getEnv('NEXT_PUBLIC_AZURE_SEARCH_KEY') || 'YOUR_AZURE_KEY',
    indexName: 'virima-cognitive-search',
  },

  // OpenAI Whisper for Voice Search
  whisper: {
    apiKey: getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || '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',
    model: 'whisper-1',
  },

  // Analytics
  analytics: {
    mixpanel: {
      token: getEnv('NEXT_PUBLIC_MIXPANEL_TOKEN') || 'YOUR_MIXPANEL_TOKEN',
    },
    amplitude: {
      apiKey: getEnv('NEXT_PUBLIC_AMPLITUDE_KEY') || 'YOUR_AMPLITUDE_KEY',
    },
  },

  // Feature Flags
  features: {
    useOpenAI: true,
    useClaude: false, // Fallback to Claude if OpenAI fails
    useAlgolia: false, // Use Algolia for enterprise search
    usePinecone: false, // Use vector search
    useElasticsearch: false, // Use Elasticsearch
    useWebSearch: true, // Enable web search
    useVoiceSearch: true, // Enable voice input
    useVisualSearch: false, // Enable image search (future)
    useCollaboration: false, // Enable real-time collaboration (future)
    useAnalytics: true, // Track search analytics
  },

  // Performance
  performance: {
    searchTimeout: 5000, // 5 seconds
    cacheEnabled: true,
    cacheTTL: 3600, // 1 hour
    maxRetries: 3,
    edgeComputing: false, // Use Cloudflare Workers (future)
  },

  // Security
  security: {
    rateLimitPerMinute: 60,
    enableAuditLog: true,
    sanitizeInput: true,
    enablePIIDetection: false, // Detect and redact PII (future)
  },
};

export type SearchConfigType = typeof SearchConfig;
