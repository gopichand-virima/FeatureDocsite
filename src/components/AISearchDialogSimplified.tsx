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
    content: "Configure SNMP discovery to identify network devices. Set up community strings, configure SNMPv2c and SNMPv3, and troubleshoot common SNMP issues.",
    path: "/discovery-scan/snmp-configuration",
  },
  {
    id: "cmdb-1",
    title: "CMDB Overview",
    module: "CMDB",
    section: "Getting Started",
    content: "Understand the Configuration Management Database (CMDB) and how it stores and manages configuration items (CIs) and their relationships.",
    path: "/cmdb/overview",
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

function performWebSearch(query: string): WebResult[] {
  if (!query.trim()) return [];

  const webResults: WebResult[] = [
    {
      id: "web-1",
      title: "Virima Discovery - Network Scanning Best Practices",
      url: "https://virima.com/blog/discovery-best-practices",
      description: "Learn the industry best practices for network discovery scanning, including optimal scheduling, credential management, and scan optimization techniques.",
      domain: "virima.com",
    },
    {
      id: "web-2",
      title: "ITIL Framework - Incident Management Guide",
      url: "https://itil.com/incident-management",
      description: "Comprehensive guide to ITIL incident management processes, including classification, prioritization, escalation, and resolution procedures.",
      domain: "itil.com",
    },
    {
      id: "web-3",
      title: "CMDB Implementation Strategy",
      url: "https://community.virima.com/cmdb-implementation",
      description: "Community-driven discussion on CMDB implementation strategies, data population techniques, and maintaining data accuracy.",
      domain: "community.virima.com",
    },
  ];

  const lowerQuery = query.toLowerCase();
  return webResults.filter(result => 
    result.title.toLowerCase().includes(lowerQuery) ||
    result.description.toLowerCase().includes(lowerQuery)
  );
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
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Configure SNMP discovery",
    "CMDB best practices",
  ]);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Perform search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setHasResults(true);

      const timer = setTimeout(() => {
        if (activeTab === "docs") {
          const results = performSemanticSearch(searchQuery, searchScope, currentModule);
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
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
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

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery("How do I configure network discovery?");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 bg-white overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only">Documentation Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search Virima documentation and web resources
        </DialogDescription>

        {/* Clean Header with Search Bar */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-black-premium">Search</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
            >
              <X className="h-4 w-4 text-slate-500" />
              <span className="sr-only">Close</span>
            </Button>
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
                  {hasResults && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <RadioGroup
                        value={searchScope}
                        onValueChange={(value) => setSearchScope(value as typeof searchScope)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
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
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all-versions" id="all-versions" className="border-slate-400 text-emerald-600" />
                          <Label htmlFor="all-versions" className="text-sm text-slate-700 cursor-pointer">
                            All versions
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

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
                              <h4 className="text-sm text-black-premium mb-1 group-hover:text-emerald-700 transition-colors">
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
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">Recent Searches</span>
                          </div>
                          <div className="space-y-1.5">
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => handleRecentSearchClick(search)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
                              >
                                <Clock className="h-4 w-4 text-slate-300" />
                                <span className="text-sm text-slate-600">{search}</span>
                              </button>
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
                  {/* Web Results */}
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
                            onClick={() => handleWebResultClick(result)}
                            className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors group text-left border border-slate-200 hover:border-blue-300 shadow-sm"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg mt-0.5 group-hover:bg-white transition-colors">
                              <Globe className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm text-black-premium group-hover:text-blue-700 transition-colors">
                                  {result.title}
                                </h4>
                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-all shrink-0" />
                              </div>
                              <p className="text-xs text-blue-600 mb-1">{result.domain}</p>
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
                      <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No web results found for "{searchQuery}"</p>
                      <p className="text-sm text-slate-500 mt-1">Try the docs search tab</p>
                    </div>
                  )}

                  {/* Default State */}
                  {!hasResults && (
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
