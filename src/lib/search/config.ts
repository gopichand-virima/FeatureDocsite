/**
 * Ultra-Premium Search Configuration
 * Centralized configuration for all search and AI services
 */

// Safe environment variable getter with fallback
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return (import.meta.env[key as keyof ImportMetaEnv] as string) || '';
    }
  } catch (e) {
    console.warn(`Environment variable ${key} not available`);
  }
  return '';
};

export const SearchConfig = {
  // OpenAI Configuration - UNRESTRICTED TOKEN ALLOCATION
  // ⚠️ SECURITY: API keys must NEVER be hardcoded. Use environment variables.
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    model: 'gpt-4o',
    embeddingModel: 'text-embedding-3-large',
    maxTokens: 16000, // Maximum for GPT-4o - ensures complete responses
    temperature: 0.7,
    enableContinuation: true, // Auto-continue if response is truncated
    maxContinuations: 3, // Allow up to 3 continuation calls for very long responses
  },

  // Anthropic Claude Configuration
  anthropic: {
    apiKey: getEnvVar('VITE_ANTHROPIC_API_KEY'),
    model: 'claude-3-opus-20240229',
    maxTokens: 4000,
  },

  // Algolia Configuration
  algolia: {
    appId: getEnvVar('VITE_ALGOLIA_APP_ID'),
    apiKey: getEnvVar('VITE_ALGOLIA_API_KEY'),
    indexName: 'virima_documentation',
  },

  // Pinecone Vector Database Configuration
  pinecone: {
    apiKey: getEnvVar('VITE_PINECONE_API_KEY'),
    environment: 'us-west1-gcp',
    indexName: 'virima-docs-embeddings',
    dimension: 3072, // text-embedding-3-large dimension
  },

  // Elasticsearch Configuration
  elasticsearch: {
    cloudId: getEnvVar('VITE_ELASTICSEARCH_CLOUD_ID'),
    apiKey: getEnvVar('VITE_ELASTICSEARCH_API_KEY'),
    indexName: 'virima-documentation',
  },

  // Web Search APIs
  webSearch: {
    // Serper API for real-time web results
    serper: {
      apiKey: getEnvVar('VITE_SERPER_API_KEY'),
      endpoint: 'https://google.serper.dev/search',
    },
    // Brave Search API
    brave: {
      apiKey: getEnvVar('VITE_BRAVE_API_KEY'),
      endpoint: 'https://api.search.brave.com/res/v1/web/search',
    },
    // Bing Search API
    bing: {
      apiKey: getEnvVar('VITE_BING_API_KEY'),
      endpoint: 'https://api.bing.microsoft.com/v7.0/search',
    },
  },

  // Azure Cognitive Search
  azure: {
    endpoint: getEnvVar('VITE_AZURE_SEARCH_ENDPOINT'),
    apiKey: getEnvVar('VITE_AZURE_SEARCH_KEY'),
    indexName: 'virima-cognitive-search',
  },

  // OpenAI Whisper for Voice Search
  // ⚠️ SECURITY: API keys must NEVER be hardcoded. Use environment variables.
  whisper: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    model: 'whisper-1',
  },

  // Analytics
  analytics: {
    mixpanel: {
      token: getEnvVar('VITE_MIXPANEL_TOKEN'),
    },
    amplitude: {
      apiKey: getEnvVar('VITE_AMPLITUDE_KEY'),
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
