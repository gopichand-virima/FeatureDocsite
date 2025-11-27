import { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
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
  Send,
  Bot,
  User,
  Copy,
  Check,
  FileQuestion,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { searchOrchestrator } from "../lib/search/search-orchestrator";
import { webSearchService } from "../lib/search/services/web-search-service";
import { analyticsService } from "../lib/search/services/analytics-service";
import { SearchConfig } from "../lib/search/config";

interface AISearchDialogProps {
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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
}

interface Source {
  title: string;
  url: string;
  type: "docs" | "web";
  excerpt?: string;
}

const aiSuggestions = [
  {
    id: 1,
    text: "How do I configure SNMP discovery?",
    icon: Sparkles,
  },
  {
    id: 2,
    text: "What are the best practices for cloud discovery?",
    icon: TrendingUp,
  },
  {
    id: 3,
    text: "How do I set up incident management workflows?",
    icon: TrendingUp,
  },
  {
    id: 4,
    text: "Explain the CMDB relationship mapping",
    icon: TrendingUp,
  },
];

const popularResources = [
  {
    id: 1,
    title: "Virima Official Website",
    url: "https://virima.com",
    description: "Product information and company details",
    icon: Globe,
  },
  {
    id: 2,
    title: "Community Forum",
    url: "https://community.virima.com",
    description: "Connect with other Virima users",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "Support Portal",
    url: "https://support.virima.com",
    description: "Get technical support and open tickets",
    icon: FileQuestion,
  },
];

// Comprehensive documentation database
const documentationDatabase = [
  // Discovery Scan Module
  {
    id: "ds-1",
    title: "Getting Started with Discovery",
    module: "Discovery Scan",
    section: "Getting Started",
    content:
      "Learn how to configure and run your first discovery scan in Virima. This guide covers initial setup, network configuration, and scanning best practices.",
    path: "/discovery-scan/getting-started",
  },
  {
    id: "ds-2",
    title: "Running a Network Scan",
    module: "Discovery Scan",
    section: "Run a Scan",
    content:
      "Execute network discovery scans to identify devices, applications, and infrastructure. Configure scan parameters, schedule automated scans, and monitor scan progress in real-time.",
    path: "/discovery-scan/run-a-scan",
  },
  {
    id: "ds-3",
    title: "SNMP Configuration Guide",
    module: "Discovery Scan",
    section: "Configuration",
    content:
      "Configure SNMP discovery to identify network devices. Set up community strings, configure SNMPv2c and SNMPv3, and troubleshoot common SNMP issues.",
    path: "/discovery-scan/snmp-configuration",
  },
  {
    id: "ds-4",
    title: "Cloud Discovery Best Practices",
    module: "Discovery Scan",
    section: "Best Practices",
    content:
      "Optimize cloud discovery across AWS, Azure, and Google Cloud Platform. Configure service accounts, manage API credentials, and schedule regular cloud scans.",
    path: "/discovery-scan/cloud-discovery",
  },
  // CMDB Module
  {
    id: "cmdb-1",
    title: "CMDB Overview",
    module: "CMDB",
    section: "Getting Started",
    content:
      "Understand the Configuration Management Database (CMDB) and how it stores and manages configuration items (CIs) and their relationships.",
    path: "/cmdb/overview",
  },
  {
    id: "cmdb-2",
    title: "Managing Configuration Items",
    module: "CMDB",
    section: "CI Management",
    content:
      "Create, edit, and delete configuration items. Manage CI attributes, relationships, and lifecycles. Import and export CI data.",
    path: "/cmdb/manage-ci",
  },
  {
    id: "cmdb-3",
    title: "Relationship Mapping",
    module: "CMDB",
    section: "Relationships",
    content:
      "Define and visualize relationships between configuration items. Create dependency maps, understand upstream and downstream impacts, and manage relationship types.",
    path: "/cmdb/relationships",
  },
  // ITSM Module
  {
    id: "itsm-1",
    title: "Incident Management Setup",
    module: "ITSM",
    section: "Incident Management",
    content:
      "Configure incident management workflows, priority levels, and escalation rules. Set up automated incident routing and notifications.",
    path: "/itsm/incident-management",
  },
  {
    id: "itsm-2",
    title: "Change Management Process",
    module: "ITSM",
    section: "Change Management",
    content:
      "Implement change management workflows following ITIL best practices. Configure change approval boards, risk assessment, and rollback procedures.",
    path: "/itsm/change-management",
  },
  {
    id: "itsm-3",
    title: "Service Request Fulfillment",
    module: "ITSM",
    section: "Service Catalog",
    content:
      "Set up service catalog items, configure request fulfillment workflows, and automate approval processes for common service requests.",
    path: "/itsm/service-requests",
  },
  // Admin Module
  {
    id: "admin-1",
    title: "Admin Functions Overview",
    module: "Admin",
    section: "Configuration",
    content:
      "Access administrative functions to configure system settings, manage users and roles, customize modules, and configure integrations.",
    path: "/admin/overview",
  },
  {
    id: "admin-2",
    title: "User Management",
    module: "Admin",
    section: "Users & Roles",
    content:
      "Create and manage user accounts, assign roles and permissions, configure authentication methods, and set up single sign-on (SSO).",
    path: "/admin/user-management",
  },
  {
    id: "admin-3",
    title: "Email Template Configuration",
    module: "Admin",
    section: "Configuration",
    content:
      "Customize email templates for notifications, alerts, and automated communications. Configure SMTP settings and test email delivery.",
    path: "/admin/email-templates",
  },
];

// Export for use by search orchestrator
export { documentationDatabase };

// Simulate AI-powered semantic search with intent understanding
function performSemanticSearch(
  query: string,
  scope: "this-page" | "all-docs" | "all-versions",
  currentModule?: string,
): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/\s+/);

  // Intent recognition patterns
  const howToPattern =
    /^(how|what|why|when|where|can|could|should|explain|show|tell|guide)/i;
  const isQuestionIntent = howToPattern.test(query);

  // Enhanced keyword matching with synonyms
  const synonymMap: Record<string, string[]> = {
    discovery: ["scan", "scanning", "discover", "probe"],
    configure: ["setup", "set up", "configuration", "config"],
    incident: ["problem", "issue", "ticket"],
    cmdb: ["configuration", "ci", "asset"],
    network: ["lan", "wan", "subnet"],
  };

  const results = documentationDatabase
    .map((doc) => {
      let relevance = 0;

      // Scope filtering
      if (scope === "this-page" && currentModule) {
        if (
          doc.module.toLowerCase().replace(/\s+/g, "-") !==
          currentModule.toLowerCase()
        ) {
          return null;
        }
      }

      // Calculate relevance score with semantic understanding
      keywords.forEach((keyword) => {
        const titleMatch = doc.title
          .toLowerCase()
          .includes(keyword);
        const contentMatch = doc.content
          .toLowerCase()
          .includes(keyword);
        const moduleMatch = doc.module
          .toLowerCase()
          .includes(keyword);
        const sectionMatch = doc.section
          ?.toLowerCase()
          .includes(keyword);

        if (titleMatch) relevance += 10;
        if (contentMatch) relevance += 5;
        if (moduleMatch) relevance += 7;
        if (sectionMatch) relevance += 6;

        // Check synonyms
        Object.entries(synonymMap).forEach(
          ([main, synonyms]) => {
            if (
              keyword === main ||
              synonyms.includes(keyword)
            ) {
              if (
                doc.content.toLowerCase().includes(main) ||
                synonyms.some((s) =>
                  doc.content.toLowerCase().includes(s),
                )
              ) {
                relevance += 3;
              }
            }
          },
        );
      });

      // Boost relevance for question-intent queries
      if (isQuestionIntent) {
        if (
          doc.title.toLowerCase().includes("how") ||
          doc.title.toLowerCase().includes("guide")
        ) {
          relevance += 5;
        }
      }

      return relevance > 0 ? { ...doc, relevance } : null;
    })
    .filter((doc): doc is SearchResult => doc !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);

  return results;
}

// Simulate web search results
function performWebSearch(query: string): WebResult[] {
  if (!query.trim()) return [];

  const webResults: WebResult[] = [
    {
      id: "web-1",
      title:
        "Virima Discovery - Network Scanning Best Practices",
      url: "https://virima.com/blog/discovery-best-practices",
      description:
        "Learn the industry best practices for network discovery scanning, including optimal scheduling, credential management, and scan optimization techniques.",
      domain: "virima.com",
    },
    {
      id: "web-2",
      title: "ITIL Framework - Incident Management Guide",
      url: "https://itil.com/incident-management",
      description:
        "Comprehensive guide to ITIL incident management processes, including classification, prioritization, escalation, and resolution procedures.",
      domain: "itil.com",
    },
    {
      id: "web-3",
      title: "CMDB Implementation Strategy - Community Forum",
      url: "https://community.virima.com/cmdb-implementation",
      description:
        "Community-driven discussion on CMDB implementation strategies, data population techniques, and maintaining data accuracy.",
      domain: "community.virima.com",
    },
    {
      id: "web-4",
      title: "SNMP Configuration Tutorial",
      url: "https://support.virima.com/kb/snmp-tutorial",
      description:
        "Step-by-step tutorial for configuring SNMP discovery, including community strings, SNMP versions, and troubleshooting common issues.",
      domain: "support.virima.com",
    },
  ];

  // Filter based on query relevance
  const lowerQuery = query.toLowerCase();
  return webResults.filter(
    (result) =>
      result.title.toLowerCase().includes(lowerQuery) ||
      result.description.toLowerCase().includes(lowerQuery),
  );
}

// AI-powered answer synthesis
function synthesizeAnswer(
  query: string,
  searchResults: SearchResult[],
  webResults: WebResult[],
): Message {
  const hasDocResults = searchResults.length > 0;
  const hasWebResults = webResults.length > 0;

  let content = "";
  const sources: Source[] = [];

  if (!hasDocResults && !hasWebResults) {
    content = `I couldn't find specific information about "${query}" in the documentation. Could you try rephrasing your question or provide more context? I'm here to help you find what you need.`;
  } else if (hasDocResults) {
    // Synthesize answer from documentation
    const topResults = searchResults.slice(0, 3);

    content = `Based on the Virima documentation, here's what I found about ${query}:\n\n`;

    topResults.forEach((result, index) => {
      content += `**${index + 1}. ${result.title}**\n${result.content}\n\n`;
      sources.push({
        title: result.title,
        url: result.path,
        type: "docs",
        excerpt: result.content.substring(0, 100) + "...",
      });
    });

    if (searchResults.length > 3) {
      content += `\nI found ${searchResults.length - 3} additional related documentation pages that might be helpful.`;
    }

    // Add web context if available
    if (hasWebResults) {
      content += `\n\n**Additional Resources:**\n`;
      webResults.slice(0, 2).forEach((result, index) => {
        content += `\n• [${result.title}](${result.url}) - ${result.description}`;
        sources.push({
          title: result.title,
          url: result.url,
          type: "web",
        });
      });
    }
  } else if (hasWebResults) {
    // Only web results available
    content = `I found relevant information from web sources about "${query}":\n\n`;

    webResults.slice(0, 3).forEach((result, index) => {
      content += `**${index + 1}. ${result.title}**\n${result.description}\n[View source](${result.url})\n\n`;
      sources.push({
        title: result.title,
        url: result.url,
        type: "web",
      });
    });

    content += `\n*Note: These results are from external sources. For official Virima documentation, try rephrasing your search.*`;
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content,
    sources,
    timestamp: new Date(),
  };
}

export function AISearchDialog({
  isOpen: isOpenProp,
  open: openProp,
  onClose: onCloseProp,
  onOpenChange: onOpenChangeProp,
  currentModule,
  currentPage,
}: AISearchDialogProps) {
  const open = isOpenProp ?? openProp ?? false;
  const setOpen = (newOpen: boolean) => {
    if (!newOpen) {
      onCloseProp?.();
    }
    onOpenChangeProp?.(newOpen);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "docs" | "web" | "ai"
  >("docs");
  const [searchScope, setSearchScope] = useState<
    "this-page" | "all-docs" | "all-versions"
  >("all-docs");
  const [searchResults, setSearchResults] = useState<
    SearchResult[]
  >([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<
    string[]
  >([
    "Configure SNMP discovery",
    "CMDB best practices",
    "Incident workflow setup",
  ]);
  const [isListening, setIsListening] = useState(false);

  // AI Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Focus AI input when switching to AI tab
  useEffect(() => {
    if (activeTab === "ai" && aiInputRef.current) {
      aiInputRef.current.focus();
    }
  }, [activeTab]);

  // Perform search
  useEffect(() => {
    if (searchQuery.trim() && activeTab !== "ai") {
      setIsSearching(true);
      setHasResults(true);

      // Simulate API delay
      const timer = setTimeout(() => {
        if (activeTab === "docs") {
          const results = performSemanticSearch(
            searchQuery,
            searchScope,
            currentModule,
          );
          setSearchResults(results);
        } else if (activeTab === "web") {
          const results = performWebSearch(searchQuery);
          setWebResults(results);
        }
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setHasResults(false);
      setSearchResults([]);
      setWebResults([]);
    }
  }, [searchQuery, activeTab, searchScope, currentModule]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      searchQuery.trim() &&
      !recentSearches.includes(searchQuery)
    ) {
      setRecentSearches([
        searchQuery,
        ...recentSearches.slice(0, 4),
      ]);
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
    // Auto-switch to AI chat for question-like suggestions
    if (suggestion.match(/^(how|what|why|explain)/i)) {
      setActiveTab("ai");
      setAiInput(suggestion);
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setSearchQuery("How do I configure network discovery?");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  // AI Chat functions
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: aiInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsAiThinking(true);

    // Simulate AI thinking time
    setTimeout(() => {
      // Perform searches
      const docResults = performSemanticSearch(
        aiInput,
        "all-docs",
      );
      const webResults = performWebSearch(aiInput);

      // Synthesize answer
      const aiResponse = synthesizeAnswer(
        aiInput,
        docResults,
        webResults,
      );
      setMessages((prev) => [...prev, aiResponse]);
      setIsAiThinking(false);

      // Add to recent searches
      if (!recentSearches.includes(aiInput)) {
        setRecentSearches([
          aiInput,
          ...recentSearches.slice(0, 4),
        ]);
      }
    }, 1500);
  };

  const handleCopyMessage = (
    messageId: string,
    content: string,
  ) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleResourceClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 bg-white overflow-hidden">
        <DialogTitle className="sr-only">
          AI-Powered Documentation Search
        </DialogTitle>
        <DialogDescription className="sr-only">
          Search Virima documentation with AI assistance, get
          instant answers, and explore resources
        </DialogDescription>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"></div>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Ask me anything about Virima"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                isListening
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5 animate-pulse" />
                  <span className="sr-only">
                    Stop voice input
                  </span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  <span className="sr-only">
                    Start voice input
                  </span>
                </>
              )}
            </Button>
          </form>

          {/* Voice input indicator */}
          {isListening && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400 animate-pulse">
              <div
                className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  animation: "shimmer 2s linear infinite",
                }}
              >
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
              </div>
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "docs" | "web" | "ai")
          }
          className="w-full"
        >
          <div className="border-b border-slate-200">
            <TabsList className="bg-transparent h-14 p-0 w-full grid grid-cols-2">
              <TabsTrigger
                value="docs"
                className="bg-transparent data-[state=active]:bg-emerald-50 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-emerald-600 rounded-none h-full text-slate-600 data-[state=active]:text-emerald-700 transition-all hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Search Docs
                {searchResults.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                    {searchResults.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="web"
                className="bg-transparent data-[state=active]:bg-blue-50 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none h-full text-slate-600 data-[state=active]:text-blue-700 transition-all hover:bg-slate-50"
              >
                <Globe className="h-4 w-4 mr-2" />
                Search Web
                {webResults.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {webResults.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[500px]">
            {/* Docs Tab */}
            <TabsContent value="docs" className="m-0">
              <div className="p-6 pb-12 space-y-6">
                {/* Search Scope Selection */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <RadioGroup
                    value={searchScope}
                    onValueChange={(value) =>
                      setSearchScope(
                        value as
                          | "this-page"
                          | "all-docs"
                          | "all-versions",
                      )
                    }
                    className="flex justify-evenly"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="this-page"
                        id="this-page"
                        className="border-slate-400 text-emerald-600"
                      />
                      <Label
                        htmlFor="this-page"
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        Search this page
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="all-docs"
                        id="all-docs"
                        className="border-slate-400 text-emerald-600"
                      />
                      <Label
                        htmlFor="all-docs"
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        Search all docs
                      </Label>
                    </div>
                  </RadioGroup>
                  {searchScope === "this-page" &&
                    currentModule &&
                    currentPage && (
                      <div className="mt-2 text-xs text-slate-500">
                        Searching in: {currentModule} ›{" "}
                        {currentPage}
                      </div>
                    )}
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
                          onClick={() =>
                            handleResultClick(result)
                          }
                          className="w-full flex flex-col gap-2 px-4 py-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-emerald-300"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-black-premium mb-1 group-hover:text-emerald-700 transition-colors">
                                {result.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2">
                                <span>{result.module}</span>
                                {result.section && (
                                  <>
                                    <span>›</span>
                                    <span>
                                      {result.section}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {result.content}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {hasResults &&
                  searchResults.length === 0 &&
                  !isSearching && (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Try the AI Assistant or search the web
                      </p>
                    </div>
                  )}

                {/* AI Suggestions - Show when no search */}
                {!hasResults && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          Try asking
                        </span>
                      </div>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() =>
                              handleSuggestionClick(
                                suggestion.text,
                              )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-slate-50 to-white hover:from-emerald-50 hover:to-white rounded-lg transition-all group text-left border border-slate-200 hover:border-emerald-300"
                          >
                            <suggestion.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                            <span className="text-sm text-slate-600 group-hover:text-emerald-700 transition-colors">
                              {suggestion.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          Recent Searches
                        </span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleRecentSearchClick(search)
                            }
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
                          >
                            <Clock className="h-4 w-4 text-slate-300" />
                            <span className="text-sm text-slate-600">
                              {search}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent
              value="ai"
              className="m-0 h-[500px] flex flex-col"
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="max-w-md text-center space-y-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
                      <Bot className="h-12 w-12 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-black-premium mb-2">
                        AI Documentation Assistant
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Ask me anything about Virima. I'll
                        search the documentation and web to
                        provide comprehensive answers with
                        sources.
                      </p>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Try asking:
                      </p>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => {
                              setAiInput(suggestion.text);
                              aiInputRef.current?.focus();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg transition-all"
                          >
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Popular Resources */}
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                        Popular Resources
                      </p>
                      <div className="space-y-2">
                        {popularResources.map((resource) => (
                          <button
                            key={resource.id}
                            onClick={() =>
                              handleResourceClick(resource.url)
                            }
                            className="w-full flex items-start gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-all group"
                          >
                            <resource.icon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-black-premium group-hover:text-blue-700 transition-colors">
                                {resource.title}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {resource.description}
                              </div>
                            </div>
                            <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`flex-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>

                        {/* Sources */}
                        {message.role === "assistant" &&
                          message.sources &&
                          message.sources.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-slate-500 px-2">
                                Sources:
                              </p>
                              {message.sources.map(
                                (source, index) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      window.open(
                                        source.url,
                                        "_blank",
                                      )
                                    }
                                    className="flex items-center gap-2 px-2 py-1 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    {source.type === "docs" ? (
                                      <FileText className="h-3 w-3" />
                                    ) : (
                                      <Globe className="h-3 w-3" />
                                    )}
                                    <span className="truncate">
                                      {source.title}
                                    </span>
                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                  </button>
                                ),
                              )}
                            </div>
                          )}

                        {/* Message Actions */}
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-2 px-2">
                            <button
                              onClick={() =>
                                handleCopyMessage(
                                  message.id,
                                  message.content,
                                )
                              }
                              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                            >
                              {copiedMessageId ===
                              message.id ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </button>
                            <span className="text-xs text-slate-400">
                              {message.timestamp.toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Thinking Indicator */}
                  {isAiThinking && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-sm text-slate-600">
                            Searching and analyzing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* AI Input */}
              <div className="border-t border-slate-200 p-4 bg-white">
                <form
                  onSubmit={handleAiSubmit}
                  className="flex gap-2"
                >
                  <Textarea
                    ref={aiInputRef}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAiSubmit(e);
                      }
                    }}
                    placeholder="Ask anything about Virima..."
                    className="flex-1 min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button
                    type="submit"
                    disabled={!aiInput.trim() || isAiThinking}
                    className="h-11 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">
                      Send message
                    </span>
                  </Button>
                </form>
                <p className="text-xs text-slate-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </TabsContent>

            {/* Web Tab */}
            <TabsContent value="web" className="m-0">
              <div className="p-6 pb-12 space-y-6">
                {/* Web Search Results */}
                {hasResults && webResults.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        Found {webResults.length} web results
                      </span>
                    </div>
                    <div className="space-y-3">
                      {webResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() =>
                            handleWebResultClick(result)
                          }
                          className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-blue-300"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg mt-0.5 group-hover:bg-white transition-colors flex-shrink-0">
                            <Globe className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm text-black-premium group-hover:text-blue-700 transition-colors">
                                {result.title}
                              </h4>
                              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-all shrink-0" />
                            </div>
                            <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                              {result.domain}
                            </p>
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
                {hasResults &&
                  webResults.length === 0 &&
                  !isSearching && (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">
                        No web results found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Try the documentation search
                      </p>
                    </div>
                  )}

                {/* Show when no search */}
                {!hasResults && (
                  <>
                    {/* Common Questions Section with Scrollbar */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Common Questions
                        </span>
                      </div>
                      <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-2">
                          {aiSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() =>
                                handleSuggestionClick(
                                  suggestion.text,
                                )
                              }
                              className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all"
                            >
                              {suggestion.text}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Popular Resources */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          Popular Resources
                        </span>
                      </div>
                      <div className="space-y-3">
                        {popularResources.map((resource) => (
                          <button
                            key={resource.id}
                            onClick={() =>
                              handleResourceClick(resource.url)
                            }
                            className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-blue-300"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg mt-0.5 group-hover:bg-white transition-colors flex-shrink-0">
                              <resource.icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm text-black-premium group-hover:text-blue-700 transition-colors">
                                  {resource.title}
                                </h4>
                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-all shrink-0" />
                              </div>
                              <p className="text-xs text-slate-600">
                                {resource.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}