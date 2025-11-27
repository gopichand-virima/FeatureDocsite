/**
 * AI Search Dialog V2 - Unified Intelligent Search
 * Inspired by Perplexity, ChatGPT, and Claude
 * Optimized for Virima Documentation Platform
 */

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
  Paperclip,
  Lightbulb,
  Code,
  Rocket,
  Target,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Bookmark,
  ChevronDown,
  Command,
  BarChart3,
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
import { Textarea } from "./ui/textarea";
import { searchOrchestrator } from "../lib/search/search-orchestrator";
import { SearchConfig } from "../lib/search/config";

interface AISearchDialogV2Props {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentModule?: string;
  currentPage?: string;
  version?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
  type?: "text" | "code" | "steps" | "diagram";
  confidence?: "high" | "medium" | "low";
}

interface Source {
  title: string;
  url: string;
  type: "docs" | "web";
  excerpt?: string;
}

interface QuickAction {
  id: string;
  icon: any;
  label: string;
  query: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  { id: "getting-started", icon: Rocket, label: "Getting Started", query: "How do I get started with Virima?" },
  { id: "api-reference", icon: BookOpen, label: "API Reference", query: "Show me API documentation" },
  { id: "troubleshooting", icon: FileQuestion, label: "Troubleshooting", query: "Common troubleshooting steps" },
  { id: "best-practices", icon: BarChart3, label: "Best Practices", query: "What are the best practices?" },
  { id: "current-page", icon: Target, label: "Current Page", query: "Help with current page" },
  { id: "whats-new", icon: Sparkles, label: "What's New", query: "What's new in the latest version?" },
];

const contextualSuggestions = [
  { id: "snmp", icon: Lightbulb, label: "Common issues with SNMP discovery", type: "related" },
  { id: "code", icon: Code, label: "Show code examples", type: "related" },
];

const trendingSuggestions = [
  { id: "migration", icon: TrendingUp, label: "v6.2 migration guide", badge: "🔥 Hot", type: "trending" },
  { id: "cloud", icon: Globe, label: "Cloud discovery best practices", type: "trending" },
];

const conversationHistory = [
  { id: "1", query: "SNMP configuration help", time: "2 min ago" },
  { id: "2", query: "CMDB relationship mapping", time: "Yesterday" },
  { id: "3", query: "Cloud discovery setup", time: "Dec 20" },
];

export function AISearchDialogV2({
  isOpen: isOpenProp,
  open: openProp,
  onClose: onCloseProp,
  onOpenChange: onOpenChangeProp,
  currentModule,
  currentPage,
  version = "6.1",
}: AISearchDialogV2Props) {
  const open = isOpenProp ?? openProp ?? false;
  const setOpen = (newOpen: boolean) => {
    if (!newOpen) {
      onCloseProp?.();
    }
    onOpenChangeProp?.(newOpen);
  };

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [focusMode, setFocusMode] = useState<"automatic" | "docs" | "web" | "ai">("automatic");
  const [language, setLanguage] = useState("English");
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Detect search intent
  const detectIntent = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.match(/^(how|what|why|when|where|can|could|should|explain|show|tell|guide)/)) {
      return "tutorial";
    }
    if (lower.includes("error") || lower.includes("issue") || lower.includes("problem")) {
      return "troubleshooting";
    }
    if (lower.match(/^what is|^define|^explain/)) {
      return "concept";
    }
    if (lower.includes("code") || lower.includes("example") || lower.includes("snippet")) {
      return "code";
    }
    return "search";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isThinking) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setShowSuggestions(false);
    setIsThinking(true);

    // Detect intent and adjust response
    const intent = detectIntent(query);

    // Simulate AI response (replace with real orchestrator call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: `Based on the Virima documentation, here's what I found about "${query}":\n\nThis is a comprehensive answer that combines information from multiple sources. The system detected this as a ${intent} query and has tailored the response accordingly.\n\n**Key Points:**\n1. First important point about your query\n2. Second relevant detail\n3. Step-by-step guidance if applicable\n\nWould you like me to provide more specific details or code examples?`,
        sources: [
          {
            title: "SNMP Configuration Guide",
            url: "/discovery-scan/snmp-configuration",
            type: "docs",
            excerpt: "Configure SNMP discovery to identify network devices...",
          },
          {
            title: "Discovery Best Practices",
            url: "https://virima.com/blog/discovery-best-practices",
            type: "web",
          },
        ],
        timestamp: new Date(),
        confidence: "high",
        type: "text",
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setQuery(action.query);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.label);
    inputRef.current?.focus();
  };

  const handleConversationClick = (conversation: any) => {
    setQuery(conversation.query);
    inputRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setQuery("How do I configure network discovery?");
        setIsListening(false);
        inputRef.current?.focus();
      }, 2000);
    }
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not-helpful") => {
    console.log(`Feedback for ${messageId}: ${feedback}`);
    // Track analytics
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 bg-white/95 backdrop-blur-xl overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only">AI-Powered Documentation Search</DialogTitle>
        <DialogDescription className="sr-only">
          Intelligent search and AI assistant for Virima documentation
        </DialogDescription>

        {/* Modern Glass Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg text-black-premium flex items-center gap-2">
                  Ask Virima AI
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">Beta</span>
                </h2>
                <p className="text-xs text-slate-600">What can I help you find today?</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0 hover:bg-white/60 rounded-lg"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Unified Intelligent Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {focusMode === "automatic" && <Sparkles className="h-5 w-5 text-emerald-500" />}
                {focusMode === "docs" && <BookOpen className="h-5 w-5 text-emerald-500" />}
                {focusMode === "web" && <Globe className="h-5 w-5 text-blue-500" />}
                {focusMode === "ai" && <Bot className="h-5 w-5 text-purple-500" />}
              </div>
              
              <Textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask anything or type / for commands..."
                className="pl-12 pr-32 py-3.5 min-h-[52px] max-h-32 bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl shadow-sm resize-none transition-all"
                rows={1}
              />

              {/* Input Actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                  title="Attach file or screenshot"
                >
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="sr-only">Attach file</span>
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceInput}
                  className={`h-8 w-8 p-0 rounded-lg ${
                    isListening 
                      ? "bg-red-100 text-red-600 hover:bg-red-200" 
                      : "hover:bg-slate-100 text-slate-400"
                  }`}
                  title="Voice search (⌘+Shift+V)"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  <span className="sr-only">{isListening ? "Stop" : "Start"} voice input</span>
                </Button>
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={!query.trim() || isThinking}
                  className="h-8 px-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-lg shadow-sm"
                  title="Search (Enter)"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>

            {/* Voice Indicator */}
            {isListening && (
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>
            )}
          </form>

          {/* Context Bar */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Focus:</span>
              <button
                onClick={() => {
                  const modes: typeof focusMode[] = ["automatic", "docs", "web", "ai"];
                  const currentIndex = modes.indexOf(focusMode);
                  setFocusMode(modes[(currentIndex + 1) % modes.length]);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
              >
                <span className="capitalize text-slate-700">{focusMode}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Language:</span>
              <button className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors">
                <span className="text-slate-700">{language}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </div>

            <div className="ml-auto text-slate-500">
              <span className="hidden sm:inline">Searching: </span>
              <span className="text-emerald-600">Version {version}</span>
              <span className="mx-1">•</span>
              <span className="text-emerald-600">{currentModule || "All docs"}</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Empty State with Suggestions */}
            {messages.length === 0 && showSuggestions && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all group text-left"
                      >
                        <action.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                        <span className="text-sm text-slate-700 group-hover:text-emerald-700 transition-colors truncate">
                          {action.label}
                        </span>
                        {action.badge && (
                          <span className="ml-auto text-xs">{action.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contextual Suggestions */}
                {currentPage && (
                  <div>
                    <h3 className="text-sm text-slate-500 mb-3">Related to this page</h3>
                    <div className="space-y-2">
                      {contextualSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all group text-left"
                        >
                          <suggestion.icon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                          <span className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors">
                            {suggestion.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <h3 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending today
                  </h3>
                  <div className="space-y-2">
                    {trendingSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 hover:border-orange-300 rounded-lg transition-all group text-left"
                      >
                        <suggestion.icon className="h-4 w-4 text-orange-500 shrink-0" />
                        <span className="text-sm text-slate-700">
                          {suggestion.label}
                        </span>
                        {suggestion.badge && (
                          <span className="text-xs ml-auto">{suggestion.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation History */}
                <div>
                  <h3 className="text-sm text-slate-500 mb-3">Continue a conversation</h3>
                  <div className="space-y-1.5">
                    {conversationHistory.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleConversationClick(conversation)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                      >
                        <MessageSquare className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 flex-1">
                          {conversation.query}
                        </span>
                        <span className="text-xs text-slate-400">{conversation.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                      {/* Confidence Indicator for AI */}
                      {message.role === "assistant" && message.confidence && (
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                            message.confidence === "high" 
                              ? "bg-green-100 text-green-700" 
                              : message.confidence === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            <Check className="h-3 w-3" />
                            {message.confidence === "high" ? "High confidence" : message.confidence === "medium" ? "Medium confidence" : "Low confidence"}
                          </span>
                          {message.sources && (
                            <span className="text-slate-500">
                              {message.sources.length} sources
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                            : "bg-white border border-slate-200"
                        }`}
                      >
                        <div className={`text-sm whitespace-pre-wrap ${
                          message.role === "user" ? "text-white" : "text-slate-900"
                        }`}>
                          {message.content}
                        </div>
                      </div>

                      {/* Sources */}
                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs text-slate-500 px-2">Sources:</p>
                          <div className="space-y-1">
                            {message.sources.map((source, index) => (
                              <button
                                key={index}
                                onClick={() => window.open(source.url, "_blank")}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors w-full text-left group"
                              >
                                {source.type === "docs" ? (
                                  <FileText className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                                )}
                                <span className="truncate flex-1">{source.title}</span>
                                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Response Actions */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-3 px-2">
                          <button
                            onClick={() => handleFeedback(message.id, "helpful")}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Helpful"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, "not-helpful")}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleCopyMessage(message.id, message.content)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            {copiedMessageId === message.id ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors ml-auto"
                            title="Email this"
                          >
                            <Mail className="h-3 w-3" />
                          </button>
                          <button
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            title="Save answer"
                          >
                            <Bookmark className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Timestamp for user messages */}
                      {message.role === "user" && (
                        <div className="text-xs text-slate-400 mt-2 px-2 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking Indicator */}
                {isThinking && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        <span className="text-sm text-slate-600">Searching and analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/50 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span className="hidden sm:inline">K to open</span>
            </span>
            <span className="hidden sm:inline">/ for commands</span>
            <span className="hidden sm:inline">Esc to close</span>
          </div>
          <span className="flex items-center gap-1">
            <span className="hidden sm:inline">Powered by</span>
            <span className="text-emerald-600">Virima AI</span>
          </span>
        </div>
      </DialogContent>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </Dialog>
  );
}
