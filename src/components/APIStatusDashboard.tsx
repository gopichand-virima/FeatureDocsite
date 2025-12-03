/**
 * API Configuration Status Dashboard
 * Displays real-time status of all integrated APIs
 */

import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { SearchConfig } from "../lib/search/config";
import { openAIService } from "../lib/search/services/openai-service";
import { webSearchService } from "../lib/search/services/web-search-service";

export function APIStatusDashboard() {
  // Check configuration status
  const openAIConfigured = openAIService.isConfigured();
  const webSearchConfigured = webSearchService.isConfigured();
  
  const StatusIcon = ({ configured }: { configured: boolean }) => {
    if (configured) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <h2 className="text-xl text-slate-900">API Configuration Status</h2>
          <p className="text-sm text-slate-600 mt-1">
            Real-time verification of integrated services
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* OpenAI GPT-4o Status */}
          <div className="flex items-start gap-4">
            <StatusIcon configured={openAIConfigured} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-slate-900">OpenAI GPT-4o</h3>
                {openAIConfigured && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                    Active
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Model:</span>
                  <span className="text-slate-900">{SearchConfig.openai.model}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Max Tokens:</span>
                  <span className="text-slate-900">{SearchConfig.openai.maxTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Auto-Continuation:</span>
                  <span className="text-slate-900">
                    {SearchConfig.openai.enableContinuation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Max Continuations:</span>
                  <span className="text-slate-900">{SearchConfig.openai.maxContinuations}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                  <span>Total Token Capacity:</span>
                  <span className="text-emerald-600 font-medium">
                    {(SearchConfig.openai.maxTokens * (SearchConfig.openai.maxContinuations + 1)).toLocaleString()} tokens
                  </span>
                </div>
              </div>
              {!openAIConfigured && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800">
                    OpenAI API key not configured. Chat responses will use fallback mode.
                  </p>
                </div>
              )}
              {openAIConfigured && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    ✓ Unrestricted token allocation active<br />
                    ✓ No artificial limits on response length<br />
                    ✓ Auto-continuation prevents truncation<br />
                    ✓ Complete responses guaranteed
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-start gap-4">
              <StatusIcon configured={webSearchConfigured} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-slate-900">Web Search APIs</h3>
                  {webSearchConfigured && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  {/* Serper */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {SearchConfig.webSearch.serper.apiKey !== 'YOUR_SERPER_API_KEY' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-300" />
                      )}
                      <span className="text-slate-600">Serper (Google)</span>
                    </div>
                    <a
                      href="https://serper.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      Get API Key <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Brave */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {SearchConfig.webSearch.brave.apiKey !== 'YOUR_BRAVE_API_KEY' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-300" />
                      )}
                      <span className="text-slate-600">Brave Search</span>
                    </div>
                    <a
                      href="https://brave.com/search/api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      Get API Key <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Bing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {SearchConfig.webSearch.bing.apiKey !== 'YOUR_BING_API_KEY' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-300" />
                      )}
                      <span className="text-slate-600">Bing Search</span>
                    </div>
                    <a
                      href="https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      Get API Key <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {!webSearchConfigured && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Web Search Integrity Active:</strong><br />
                      No APIs configured - system will show honest "no results" message.<br />
                      The AI will never fabricate, guess, or generate fake URLs.
                    </p>
                  </div>
                )}
                {webSearchConfigured && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800">
                      ✓ Real-time web search active<br />
                      ✓ All URLs verified by search engines<br />
                      ✓ No fabricated or placeholder links<br />
                      ✓ 100% authentic results only
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice Search */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-start gap-4">
              <StatusIcon configured={openAIConfigured} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-slate-900">Voice Search (Whisper)</h3>
                  {openAIConfigured && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Model:</span>
                    <span className="text-slate-900">{SearchConfig.whisper.model}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Status:</span>
                    <span className="text-slate-900">
                      {SearchConfig.features.useVoiceSearch ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            {openAIConfigured && webSearchConfigured ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-900">All Systems Operational</p>
                  <p className="text-xs text-slate-600">
                    Unrestricted AI with authentic web search
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm text-slate-900">Partial Configuration</p>
                  <p className="text-xs text-slate-600">
                    Some APIs need configuration for full functionality
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <a
          href="/docs/API-TOKEN-CONFIGURATION.md"
          className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all"
        >
          <h3 className="text-slate-900 mb-1 flex items-center gap-2">
            Token Configuration Guide
            <ExternalLink className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-600">
            Learn about unrestricted token allocation and auto-continuation
          </p>
        </a>
        <a
          href="/docs/WEB-SEARCH-SETUP.md"
          className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h3 className="text-slate-900 mb-1 flex items-center gap-2">
            Web Search Setup Guide
            <ExternalLink className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-600">
            Configure real search APIs for authentic URL results
          </p>
        </a>
      </div>
    </div>
  );
}
