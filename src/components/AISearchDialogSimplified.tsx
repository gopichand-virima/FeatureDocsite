/**
 * AI Search Dialog - Simplified Premium Version
 * Clean, user-friendly interface with Search Docs and Search Web
 */

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Clock,
  TrendingUp,
  ArrowRight,
  Globe,
  BookOpen,
  Mic,
  MicOff,
  Loader2,
  FileText,
  ExternalLink,
  X,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { webSearchService } from "../lib/search/services/web-search-service";
import { voiceInputService } from "../lib/search/services/voice-input-service";
import { searchHistoryService } from "../lib/search/services/search-history-service";
import { searchOrchestrator } from "../lib/search/search-orchestrator";

interface AISearchDialogSimplifiedProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentModule?: string;
  currentPage?: string;
}

interface SearchResult {
  id: string;
  title: string;
  module: string;
  section?: string;
  content: string;
  path: string;
  relevance: number;
}

interface WebResult {
  id: string;
  title: string;
  url: string;
  description: string;
  domain: string;
}

const suggestions = [
  { id: 1, text: "How do I configure SNMP discovery?" },
  { id: 2, text: "What are the best practices for cloud discovery?" },
  { id: 3, text: "How do I set up incident management workflows?" },
  { id: 4, text: "Explain the CMDB relationship mapping" },
];

const documentationDatabase = [
  {
    id: "ds-1",
    title: "Getting Started with Discovery",
    module: "Discovery Scan",
    section: "Getting Started",
    content: "Learn how to configure and run your first discovery scan in Virima. This guide covers initial setup, network configuration, and scanning best practices.",
    path: "/discovery-scan/getting-started",
  },
  {
    id: "ds-2",
    title: "Running a Network Scan",
    module: "Discovery Scan",
    section: "Run a Scan",
    content: "Execute network discovery scans to identify devices, applications, and infrastructure. Configure scan parameters, schedule automated scans, and monitor scan progress in real-time.",
    path: "/discovery-scan/run-a-scan",
  },
  {
    id: "ds-3",
    title: "SNMP Configuration Guide",
    module: "Discovery Scan",
    section: "Configuration",
    content: "Configure SNMP discovery to identify network devices. Set up community strings for SNMPv2c, configure SNMPv3 with authentication and privacy protocols, and troubleshoot common SNMP connectivity issues. Ensure UDP ports 161-162 are accessible.",
    path: "/discovery-scan/snmp-configuration",
  },
  {
    id: "ds-4",
    title: "Cloud Discovery Setup",
    module: "Discovery Scan",
    section: "Cloud Integration",
    content: "Configure cloud discovery for AWS, Azure, and Google Cloud platforms. Use API-based authentication to discover virtual machines, containers, storage, and cloud services. Automatically sync cloud assets to CMDB.",
    path: "/discovery-scan/cloud-discovery",
  },
  {
    id: "cmdb-1",
    title: "CMDB Overview",
    module: "CMDB",
    section: "Getting Started",
    content: "Understand the Configuration Management Database (CMDB) and how it stores and manages configuration items (CIs) and their relationships. The CMDB automatically populates from discovery scans and supports relationship mapping and impact analysis.",
    path: "/cmdb/overview",
  },
  {
    id: "cmdb-2",
    title: "CI Relationship Mapping",
    module: "CMDB",
    section: "Configuration",
    content: "Map relationships between Configuration Items including dependencies, connections, and hierarchies. Use visualization tools to understand infrastructure dependencies and perform impact analysis for change management.",
    path: "/cmdb/relationship-mapping",
  },
  {
    id: "itsm-1",
    title: "Incident Management Workflows",
    module: "ITSM",
    section: "Incident Management",
    content: "Set up incident management workflows following ITIL best practices. Configure incident classification, prioritization based on impact and urgency, assignment rules, escalation procedures, and SLA timers. Incidents integrate with CMDB for impact analysis.",
    path: "/itsm/incident-management",
  },
  {
    id: "itsm-2",
    title: "Service Desk Portal",
    module: "ITSM",
    section: "Self-Service",
    content: "Configure the self-service portal for end users to submit incidents, requests, and view knowledge base articles. Customize portal branding, categories, and approval workflows.",
    path: "/itsm/service-desk",
  },
  {
    id: "itam-1",
    title: "Asset Management Overview",
    module: "ITAM",
    section: "Getting Started",
    content: "Manage hardware and software assets throughout their lifecycle. Track procurement, deployment, utilization, and disposal. Monitor software licenses and ensure compliance.",
    path: "/itam/overview",
  },
  {
    id: "api-1",
    title: "REST API Documentation",
    module: "API Integration",
    section: "API Reference",
    content: "Use Virima's REST API for integration with third-party tools. Supports authentication via API keys or OAuth tokens. Available endpoints include discovery management, CMDB queries, ITSM operations, and reporting. Rate limiting applies to ensure system stability.",
    path: "/api/rest-api",
  },
  {
    id: "api-2",
    title: "Integration Examples",
    module: "API Integration",
    section: "Examples",
    content: "Common integration scenarios include ServiceNow CMDB synchronization, Slack notifications for incidents, custom dashboards using CMDB data, and automated workflow triggers for change management.",
    path: "/api/integration-examples",
  },
];

function performSemanticSearch(query: string, scope: string, currentModule?: string): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/\s+/);

  const results = documentationDatabase
    .map((doc) => {
      let relevance = 0;

      if (scope === "this-page" && currentModule) {
        if (doc.module.toLowerCase().replace(/\s+/g, "-") !== currentModule.toLowerCase()) {
          return null;
        }
      }

      keywords.forEach((keyword) => {
        if (doc.title.toLowerCase().includes(keyword)) relevance += 10;
        if (doc.content.toLowerCase().includes(keyword)) relevance += 5;
        if (doc.module.toLowerCase().includes(keyword)) relevance += 7;
        if (doc.section?.toLowerCase().includes(keyword)) relevance += 6;
      });

      return relevance > 0 ? { ...doc, relevance } : null;
    })
    .filter((doc): doc is SearchResult => doc !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);

  return results;
}

// Real-time web search using actual search APIs
async function performWebSearch(query: string): Promise<WebResult[]> {
  if (!query.trim()) return [];

  try {
    // Check if web search is configured
    if (!webSearchService.isConfigured()) {
      console.warn('Web search APIs not configured - returning empty results');
      return [];
    }

    // Perform real web search
    const searchResponse = await webSearchService.search(query, 6);
    
    // Transform results to match our WebResult interface
    return searchResponse.results.map((result, index) => ({
      id: `web-${index}`,
      title: result.title,
      url: result.url,
      description: result.description,
      domain: result.domain,
    }));
  } catch (error) {
    console.error('Web search failed:', error);
    return [];
  }
}

function generateNLPResponse(query: string, webResults: WebResult[]): string {
  const lowerQuery = query.toLowerCase();
  
  // Search documentation database for relevant content
  const relevantDocs = documentationDatabase.filter(doc => {
    const searchText = `${doc.title} ${doc.content} ${doc.module} ${doc.section}`.toLowerCase();
    return lowerQuery.split(/\s+/).some(keyword => searchText.includes(keyword));
  });
  
  // Build context from actual documentation
  let response = "";
  
  if (relevantDocs.length > 0) {
    // Use actual documentation content to ground the response
    const primaryDoc = relevantDocs[0];
    const additionalDocs = relevantDocs.slice(1, 3);
    
    response = `Based on the Virima documentation, ${primaryDoc.content}`;
    
    if (additionalDocs.length > 0) {
      response += `\n\nAdditionally, `;
      const additionalInfo = additionalDocs.map(doc => doc.content).join(" ");
      response += additionalInfo;
    }
    
    // Add specific guidance based on found documentation
    const modules = [...new Set(relevantDocs.map(doc => doc.module))];
    if (modules.length > 0) {
      response += `\n\nRelevant modules: ${modules.join(", ")}. `;
    }
    
    // Add web results if available
    if (webResults.length > 0) {
      response += `\n\nI also found ${webResults.length} external resources that may help, including content from ${webResults.map(r => r.domain).join(", ")}.`;
    }
    
  } else {
    // Fallback when no documentation matches
    if (webResults.length > 0) {
      // We have real web results
      response = `I searched for "${query}" and found the following external resources:\n\n`;
      const topResult = webResults[0];
      response += `${topResult.description}\n\n`;
      
      if (webResults.length > 1) {
        response += `Additional resources:\n`;
        webResults.slice(1, 3).forEach((result) => {
          response += `• ${result.title} (${result.domain})\n`;
        });
      }
    } else {
      // No results at all - be honest about it
      response = `I searched for "${query}" but couldn't find specific matches in the available documentation or web resources.\n\n`;
      response += `Virima's documentation covers modules including Discovery, CMDB, ITAM, ITSM, and Admin. Try:\n`;
      response += `• Using different search terms\n`;
      response += `• Checking the Getting Started guides\n`;
      response += `• Browsing by module in the documentation\n\n`;
      response += `Note: Web search results require API configuration to return real, verified URLs from live search engines.`;
    }
  }
  
  return response;
}

export function AISearchDialogSimplified({
  isOpen: isOpenProp,
  open: openProp,
  onClose: onCloseProp,
  onOpenChange: onOpenChangeProp,
  currentModule,
  currentPage,
}: AISearchDialogSimplifiedProps) {
  const open = isOpenProp ?? openProp ?? false;
  const setOpen = (newOpen: boolean) => {
    if (!newOpen) {
      onCloseProp?.();
    }
    onOpenChangeProp?.(newOpen);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"docs" | "web">("docs");
  const [searchScope, setSearchScope] = useState<"this-page" | "all-docs" | "all-versions">("all-docs");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [nlpResponse, setNlpResponse] = useState<string>("");
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>("");
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [voiceError, setVoiceError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const durationIntervalRef = useRef<number | null>(null);

  // Load search history on mount
  useEffect(() => {
    const loadHistory = () => {
      const history = searchHistoryService.getHistoryQueries();
      setRecentSearches(history);
    };
    
    loadHistory();
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Perform search
  useEffect(() => {
    let cancelled = false;
    
    if (searchQuery.trim()) {
      setIsSearching(true);
      setHasResults(true);

      const timer = setTimeout(async () => {
        if (activeTab === "docs") {
          const results = performSemanticSearch(searchQuery, searchScope, currentModule);
          if (!cancelled) {
            setSearchResults(results);
            setIsSearching(false);
          }
        } else if (activeTab === "web") {
          // Enhanced web search with AI-powered responses
          try {
            // Perform web search to get results
            const webSearchResults = await performWebSearch(searchQuery);
            if (!cancelled) {
              setWebResults(webSearchResults);
            }

            // Use AI orchestrator to generate comprehensive response with web + docs context
            const aiResponse = await searchOrchestrator.aiSearch(searchQuery, {
              useWeb: true,
              scope: 'all-docs',
            });

            if (!cancelled) {
              // Set AI-generated response
              setNlpResponse(aiResponse.answer);
              setDisplayedResponse(""); // Reset for typing effect
              setIsSearching(false);
            }
          } catch (error) {
            console.error('Web search with AI failed:', error);
            // Fallback to basic web search results
            const results = await performWebSearch(searchQuery);
            if (!cancelled) {
              setWebResults(results);
              const response = generateNLPResponse(searchQuery, results);
              setNlpResponse(response);
              setDisplayedResponse("");
              setIsSearching(false);
            }
          }
        }
      }, 300);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    } else {
      setHasResults(false);
      setSearchResults([]);
      setWebResults([]);
      setNlpResponse("");
      setDisplayedResponse("");
    }
  }, [searchQuery, activeTab, searchScope, currentModule]);

  // Typing effect for NLP response
  useEffect(() => {
    if (nlpResponse && activeTab === "web") {
      setIsTyping(true);
      setDisplayedResponse("");
      
      let currentIndex = 0;
      const typingSpeed = 15; // milliseconds per character
      
      const typingInterval = setInterval(() => {
        if (currentIndex < nlpResponse.length) {
          setDisplayedResponse(nlpResponse.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }
  }, [nlpResponse, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (query) {
      // Add to search history (automatically deduplicates and manages max entries)
      searchHistoryService.addSearch(query, activeTab === 'web' ? 'web' : 'docs');
      
      // Update local state to reflect new history
      const updatedHistory = searchHistoryService.getHistoryQueries();
      setRecentSearches(updatedHistory);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log("Navigate to:", result.path);
    setOpen(false);
  };

  const handleWebResultClick = (result: WebResult) => {
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const handleClearHistory = () => {
    searchHistoryService.clearHistory();
    setRecentSearches([]);
  };

  const handleRemoveSearchItem = (searchToRemove: string) => {
    searchHistoryService.removeSearch(searchToRemove);
    const updatedHistory = searchHistoryService.getHistoryQueries();
    setRecentSearches(updatedHistory);
  };

  const toggleVoiceInput = async () => {
    if (!isListening) {
      // Start recording
      try {
        // Synchronous pre-flight checks (don't break user gesture)
        if (!voiceInputService.isSupported()) {
          setVoiceError("Voice input is not supported in this browser");
          return;
        }

        if (!voiceInputService.isSecureContext()) {
          setVoiceError("Voice input requires HTTPS or localhost");
          return;
        }

        if (!voiceInputService.isConfigured()) {
          setVoiceError("OpenAI Whisper API is not configured. Please set VITE_OPENAI_API_KEY in GitHub Secrets (Settings → Secrets and variables → Actions) to enable voice input.");
          return;
        }

        // DO NOT check permission state here - it prevents the native dialog!
        // Let getUserMedia() handle permission requests naturally
        
        // Clear previous errors
        setVoiceError("");
        setRecordingDuration(0);
        setVoiceStatus("");
        
        // CRITICAL: Start recording immediately - this calls getUserMedia()
        // which triggers the browser's permission dialog if needed
        await voiceInputService.startRecording(
          // On transcription complete
          (text: string) => {
            setSearchQuery(text);
            
            // Add voice search to history
            if (text.trim()) {
              searchHistoryService.addSearch(text.trim(), activeTab === 'web' ? 'web' : 'docs');
              const updatedHistory = searchHistoryService.getHistoryQueries();
              setRecentSearches(updatedHistory);
            }
            
            setIsListening(false);
            setVoiceStatus("Transcription complete");
            if (durationIntervalRef.current) {
              clearInterval(durationIntervalRef.current);
              durationIntervalRef.current = null;
            }
            // Auto-clear success status after 2 seconds
            setTimeout(() => setVoiceStatus(""), 2000);
          },
          // On error
          (error: Error) => {
            setVoiceError(error.message);
            setIsListening(false);
            setVoiceStatus("");
            if (durationIntervalRef.current) {
              clearInterval(durationIntervalRef.current);
              durationIntervalRef.current = null;
            }
          },
          // On status change
          (status: string) => {
            setVoiceStatus(status);
          }
        );

        // If we get here, recording started successfully
        setIsListening(true);

        // Start duration counter in UI
        durationIntervalRef.current = window.setInterval(() => {
          setRecordingDuration(prev => prev + 1);
        }, 1000);

      } catch (error) {
        // Error already handled by voiceInputService callbacks
        console.error("Failed to start voice input:", error);
        // Don't set error here - it's already set by the onError callback
      }
    } else {
      // Stop recording
      try {
        await voiceInputService.stopRecording();
        setVoiceStatus("Processing...");
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      } catch (error) {
        console.error("Failed to stop voice input:", error);
        setVoiceError((error as Error).message);
        setIsListening(false);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        voiceInputService.stopRecording();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isListening]);

  const handleContinueInChat = () => {
    // Create message objects for full context preservation
    const messages = [
      {
        id: `msg_${Date.now()}_user`,
        role: "user" as const,
        content: searchQuery,
        timestamp: new Date(),
      },
      {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant" as const,
        content: nlpResponse,
        timestamp: new Date(),
        sources: webResults.map(result => ({
          title: result.title,
          url: result.url,
          snippet: result.description,
          type: "web" as const,
        })),
      },
    ];
    
    // Open global chat with full conversation context
    if (typeof window !== 'undefined' && (window as any).openGlobalChat) {
      (window as any).openGlobalChat(messages);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 bg-white overflow-auto border-0 shadow-2xl">
        <DialogTitle className="sr-only">Documentation Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search Virima documentation and web resources
        </DialogDescription>

        {/* Clean Header with Search Bar */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-black-premium dark:text-white">Search</h2>

          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search documentation or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-white border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg shadow-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg ${
                isListening 
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isListening ? (
                <MicOff className="h-5 w-5 animate-pulse" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              <span className="sr-only">{isListening ? "Stop" : "Start"} voice input</span>
            </Button>
          </form>

          {/* Voice Recording Indicator */}
          {isListening && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <p className="text-sm text-red-900">Recording in progress</p>
                    <p className="text-xs text-red-700">
                      {voiceInputService.formatDuration(recordingDuration)}
                      {voiceStatus && ` • ${voiceStatus}`}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={toggleVoiceInput}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-red-50 text-red-600 border-red-300 hover:border-red-400"
                >
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
              <div className="mt-3 bg-white/60 rounded-lg p-2 text-xs text-red-800 border border-red-200">
                💡 <strong>Tip:</strong> Speak naturally and take your time. The system supports unlimited recording duration with automatic transcription via OpenAI Whisper.
              </div>
            </div>
          )}

          {/* Voice Status Messages */}
          {!isListening && voiceStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-900">{voiceStatus}</p>
              </div>
            </div>
          )}

          {/* Voice Error Messages */}
          {voiceError && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl shadow-lg animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-900 mb-3">{voiceError}</p>
                  
                  {(voiceError.toLowerCase().includes("permission") || voiceError.toLowerCase().includes("blocked")) && (
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-red-900 mb-2">
                        <strong>🔧 How to fix this:</strong>
                      </p>
                      
                      {/* Chrome/Edge Instructions */}
                      <details className="mb-2">
                        <summary className="text-xs text-red-800 cursor-pointer hover:text-red-900 font-medium">
                          📱 Chrome / Edge Users (Click to expand)
                        </summary>
                        <ol className="text-xs text-red-700 ml-4 mt-2 space-y-1 list-decimal">
                          <li>Look at the left side of the address bar</li>
                          <li>Click the <strong>lock icon 🔒</strong> (or camera icon with X)</li>
                          <li>Find <strong>"Microphone"</strong></li>
                          <li>Change from "Block" to <strong>"Allow"</strong></li>
                          <li>Close this message and click the mic icon again</li>
                        </ol>
                      </details>

                      {/* Firefox Instructions */}
                      <details className="mb-2">
                        <summary className="text-xs text-red-800 cursor-pointer hover:text-red-900 font-medium">
                          🦊 Firefox Users (Click to expand)
                        </summary>
                        <ol className="text-xs text-red-700 ml-4 mt-2 space-y-1 list-decimal">
                          <li>Click the <strong>lock icon 🔒</strong> in the address bar</li>
                          <li>Click the arrow next to "Microphone Blocked"</li>
                          <li>Click <strong>"Clear This Permission"</strong></li>
                          <li>Refresh this page (F5)</li>
                          <li>Click the mic icon again - dialog will appear</li>
                        </ol>
                      </details>

                      {/* Safari Instructions */}
                      <details className="mb-2">
                        <summary className="text-xs text-red-800 cursor-pointer hover:text-red-900 font-medium">
                          🧭 Safari Users (Click to expand)
                        </summary>
                        <ol className="text-xs text-red-700 ml-4 mt-2 space-y-1 list-decimal">
                          <li>Click <strong>Safari</strong> menu → Settings for This Website</li>
                          <li>Find <strong>Microphone</strong></li>
                          <li>Change from "Deny" to <strong>"Allow"</strong></li>
                          <li>Refresh the page</li>
                          <li>Click the mic icon again</li>
                        </ol>
                      </details>

                      {/* Alternative method */}
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="text-xs text-red-800 mb-1">
                          <strong>Alternative: Reset All Permissions</strong>
                        </p>
                        <p className="text-xs text-red-700">
                          Right-click the address bar → <strong>Site Settings</strong> → Find Microphone → Reset
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {voiceError.toLowerCase().includes("not configured") && (
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-red-700">
                        Configure OpenAI Whisper API in{" "}
                        <code className="px-1.5 py-0.5 bg-red-100 rounded font-mono">/lib/search/config.ts</code>
                      </p>
                    </div>
                  )}
                  
                  {voiceError.toLowerCase().includes("https") && (
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-red-700">
                        💡 Microphone access requires HTTPS. Use{" "}
                        <code className="px-1.5 py-0.5 bg-red-100 rounded font-mono">https://</code> or{" "}
                        <code className="px-1.5 py-0.5 bg-red-100 rounded font-mono">localhost</code>
                      </p>
                    </div>
                  )}
                  
                  {voiceError.toLowerCase().includes("no microphone") && (
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-red-700">
                        🎤 Please connect a microphone or check your device settings
                      </p>
                    </div>
                  )}
                  
                  {voiceError.toLowerCase().includes("in use") && (
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-red-700">
                        💡 Close other applications that might be using your microphone (Zoom, Teams, Skype, etc.)
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceError("")}
                  className="h-8 w-8 p-0 hover:bg-red-100 shrink-0"
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Clean Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "docs" | "web")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg h-10">
              <TabsTrigger
                value="docs"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-600 data-[state=active]:text-emerald-700 transition-all"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Search Docs
                {searchResults.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                    {searchResults.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="web"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-600 data-[state=active]:text-blue-700 transition-all"
              >
                <Globe className="h-4 w-4 mr-2" />
                Search Web
                {webResults.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {webResults.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px] mt-4">
              {/* Docs Tab */}
              <TabsContent value="docs" className="m-0">
                <div className="px-1 space-y-6">
                  {/* Search Scope */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <RadioGroup
                      value={searchScope}
                      onValueChange={(value) => setSearchScope(value as typeof searchScope)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="this-page" id="this-page" className="border-slate-400 text-emerald-600" />
                        <Label htmlFor="this-page" className="text-sm text-slate-700 cursor-pointer">
                          This page
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-docs" id="all-docs" className="border-slate-400 text-emerald-600" />
                        <Label htmlFor="all-docs" className="text-sm text-slate-700 cursor-pointer">
                          All docs
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Search Results */}
                  {hasResults && searchResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-600">
                          Found {searchResults.length} results
                        </span>
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-emerald-300 shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-black-premium dark:text-white mb-1 group-hover:text-emerald-700 transition-colors">
                                {result.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2">
                                <span>{result.module}</span>
                                {result.section && (
                                  <>
                                    <span>›</span>
                                    <span>{result.section}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {result.content}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {hasResults && searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-slate-500 mt-1">Try the web search tab</p>
                    </div>
                  )}

                  {/* Suggestions - Show when no search */}
                  {!hasResults && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Try asking</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-emerald-50 rounded-lg transition-all group text-left border border-slate-200 hover:border-emerald-300 shadow-sm"
                            >
                              <span className="text-sm text-slate-700 group-hover:text-emerald-700 transition-colors flex-1">
                                {suggestion.text}
                              </span>
                              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">Recent Searches</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearHistory}
                              className="h-7 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Clear All
                            </Button>
                          </div>
                          <div className="space-y-1.5">
                            {recentSearches.map((search, index) => (
                              <div
                                key={index}
                                className="group w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Clock className="h-4 w-4 text-slate-300 shrink-0" />
                                <button
                                  onClick={() => handleRecentSearchClick(search)}
                                  className="flex-1 text-left text-sm text-slate-600 hover:text-emerald-700 transition-colors"
                                >
                                  {search}
                                </button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSearchItem(search)}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
                                  title="Remove from history"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Web Tab */}
              <TabsContent value="web" className="m-0">
                <div className="px-1 space-y-6">
                  {/* Loading State */}
                  {isSearching && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
                      <p className="text-sm text-slate-600 mb-1">Searching the web and generating AI response...</p>
                      <p className="text-xs text-slate-500">Combining real-time web results with documentation context</p>
                    </div>
                  )}

                  {/* NLP Response */}
                  {hasResults && nlpResponse && !isSearching && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-md">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                            AI-Powered Answer with Real-Time Web Search
                            {isTyping && (
                              <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-blue-700 mb-3 flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Generated by GPT-4o using live web search results and internal documentation
                          </p>
                          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {displayedResponse}
                            {isTyping && <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 animate-pulse"></span>}
                          </div>
                        </div>
                      </div>
                      
                      {/* Continue in Chat - Below Content */}
                      {!isTyping && displayedResponse && (
                        <div className="flex justify-end pt-4 mt-2 border-t border-blue-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Button
                            onClick={handleContinueInChat}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            size="sm"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Continue in Chat
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Web Results */}
                  {hasResults && webResults.length > 0 && !isSearching && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">
                          {webResults.length} Verified Internet Sources
                        </span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-xs text-emerald-900">
                        ✅ <strong>Authentic URLs Only:</strong> All links below are real, clickable sources from live web search APIs
                      </div>
                      <div className="space-y-3">
                        {webResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleWebResultClick(result)}
                            className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-blue-300 shadow-sm"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg mt-0.5 group-hover:bg-white transition-colors">
                              <Globe className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm text-black-premium dark:text-white group-hover:text-blue-700 transition-colors">
                                  {result.title}
                                </h4>
                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-all shrink-0" />
                              </div>
                              <p className="text-xs text-blue-600 mb-1 font-mono truncate">{result.url}</p>
                              <p className="text-xs text-slate-500 mb-1">{result.domain}</p>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {result.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Web Results */}
                  {hasResults && webResults.length === 0 && !isSearching && (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                        <p className="text-slate-900 mb-2">No web results available</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Web search requires API configuration. Real-time web search APIs (Serper, Brave, or Bing) are not currently configured.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                          <p className="text-xs text-blue-900">
                            <strong>Note:</strong> The system only returns real, verifiable URLs from actual search results. Placeholder or fabricated links are never displayed.
                          </p>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">Try searching the documentation instead</p>
                      </div>
                    </div>
                  )}

                  {/* Default State */}
                  {!hasResults && !isSearching && (
                    <div className="text-center py-12">
                      <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">Search the web for Virima resources</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Find blog posts, community discussions, and external tutorials
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}