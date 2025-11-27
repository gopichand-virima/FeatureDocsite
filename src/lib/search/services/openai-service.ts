/**
 * OpenAI Service - GPT-4 Integration for Conversational AI
 * Handles all OpenAI API interactions including chat completions and embeddings
 */

import { SearchConfig } from '../config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  answer: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    totalTokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = SearchConfig.openai.apiKey;
  }

  /**
   * Generate embeddings for text using OpenAI's embedding model
   */
  async createEmbedding(text: string): Promise<EmbeddingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: SearchConfig.openai.embeddingModel,
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        embedding: data.data[0].embedding,
        usage: {
          totalTokens: data.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('OpenAI Embedding Error:', error);
      throw error;
    }
  }

  /**
   * Generate chat completion using GPT-4
   */
  async createChatCompletion(
    messages: ChatMessage[],
    temperature?: number
  ): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: SearchConfig.openai.model,
          messages,
          max_tokens: SearchConfig.openai.maxTokens,
          temperature: temperature ?? SearchConfig.openai.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        answer: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
      };
    } catch (error) {
      console.error('OpenAI Chat Completion Error:', error);
      throw error;
    }
  }

  /**
   * Generate conversational answer with documentation context (RAG)
   */
  async generateAnswer(
    query: string,
    documentationContext: string[],
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = `You are Virima's AI Documentation Assistant. You help users understand Virima's features, configuration, and best practices.

You have access to the following documentation context:
${documentationContext.map((doc, i) => `[${i + 1}] ${doc}`).join('\n\n')}

Instructions:
- Provide accurate, helpful answers based on the documentation context
- If information is not in the context, acknowledge this and suggest where to look
- Include source citations using [1], [2], etc. format
- Be conversational and friendly
- Provide code examples when relevant
- For troubleshooting, offer step-by-step guidance`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query },
    ];

    const response = await this.createChatCompletion(messages);
    return response.answer;
  }

  /**
   * Transcribe audio using Whisper API
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', SearchConfig.whisper.model);

      const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Whisper Transcription Error:', error);
      throw error;
    }
  }

  /**
   * Check if OpenAI is configured and available
   */
  isConfigured(): boolean {
    return this.apiKey !== 'YOUR_OPENAI_API_KEY' && this.apiKey.length > 0;
  }
}

export const openAIService = new OpenAIService();
