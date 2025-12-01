import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Loader2,
  FileText,
  Globe,
  ExternalLink,
  Copy,
  Check,
  History,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  conversationService,
  Message,
} from "../lib/chat/conversation-service";
import { searchOrchestrator } from "../lib/search/search-orchestrator";
import { webSearchService } from "../lib/search/services/web-search-service";
import { openAIService, ChatMessage } from "../lib/search/services/openai-service";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  onOpenHistory: () => void;
  currentModule?: string;
  currentPage?: string;
  mdxContent?: string;
  initialMessages?: Message[];
}

export function ChatPanel({
  isOpen,
  onClose,
  conversationId: initialConversationId,
  onOpenHistory,
  currentModule,
  currentPage,
  mdxContent,
  initialMessages,
}: ChatPanelProps) {
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showContextBanner, setShowContextBanner] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation messages
  useEffect(() => {
    if (conversationId) {
      const conversation = conversationService.getConversation(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Update conversation ID when prop changes
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        // Smooth scroll for initial messages, instant for new messages
        const behavior = showContextBanner ? "smooth" : "auto";
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior,
        });
      }
    }
  }, [messages, showContextBanner]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle initial messages - create conversation with context
  useEffect(() => {
    if (isOpen && initialMessages && initialMessages.length > 0 && !conversationId) {
      // Create a new conversation with the initial messages
      const newConversation = conversationService.createConversation(
        initialMessages[0].content,
        initialMessages
      );
      setConversationId(newConversation.id);
      setMessages(initialMessages);
      setShowContextBanner(true);
    }
  }, [isOpen, initialMessages, conversationId]);

  // Hide context banner after user sends first follow-up
  useEffect(() => {
    if (initialMessages && messages.length > initialMessages.length) {
      setShowContextBanner(false);
    }
  }, [messages.length, initialMessages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Create new conversation if needed
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const newConversation = conversationService.createConversation(userMessage);
      currentConversationId = newConversation.id;
      setConversationId(currentConversationId);
    }

    // Add user message
    conversationService.addMessage(
      currentConversationId,
      "user",
      userMessage
    );

    // Update local state immediately
    setMessages((prev) => [
      ...prev,
      {
        id: `temp_${Date.now()}`,
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);

    try {
      // Search both docs and web
      const [docsResults, webResults] = await Promise.all([
        searchOrchestrator.search(userMessage, {
          currentModule: currentModule,
          scope: "all-docs",
        }),
        webSearchService.search(userMessage).catch(() => ({ results: [], totalResults: 0, searchTime: 0 })),
      ]);

      // Prepare sources
      const sources: Message["sources"] = [];
      
      // Build documentation context for AI
      const documentationContext: string[] = [];
      
      if (docsResults.length > 0) {
        docsResults.slice(0, 5).forEach((result) => {
          const snippet = result.content?.substring(0, 200) || '';
          documentationContext.push(`${result.title}\n${snippet}`);
          sources.push({
            title: result.title,
            url: result.path || '',
            snippet: snippet,
            type: "doc",
          });
        });
      }

      if (webResults.results && webResults.results.length > 0) {
        webResults.results.slice(0, 3).forEach((result) => {
          documentationContext.push(`Web: ${result.title}\n${result.description}`);
          sources.push({
            title: result.title,
            url: result.url,
            snippet: result.description,
            type: "web",
          });
        });
      }

      // Generate AI response using OpenAI GPT-4
      let response = "";
      
      if (openAIService.isConfigured()) {
        // Get conversation history for context
        const conversationHistory: ChatMessage[] = messages
          .slice(-6) // Last 3 exchanges (6 messages)
          .map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          }));

        try {
          response = await openAIService.generateAnswer(
            userMessage,
            documentationContext,
            conversationHistory
          );
        } catch (error) {
          console.error("OpenAI generation error:", error);
          // Fallback to simple response
          response = documentationContext.length > 0
            ? `Based on the documentation:\n\n${documentationContext[0]}`
            : "I couldn't generate a response. Please try again.";
        }
      } else {
        // Fallback if OpenAI is not configured
        if (documentationContext.length > 0) {
          response = "Based on the Virima documentation:\n\n" + documentationContext[0];
        } else {
          response = "I couldn't find specific information about that in the documentation or on the web. Could you please rephrase your question or provide more context?";
        }
      }

      // Add assistant message
      conversationService.addMessage(
        currentConversationId,
        "assistant",
        response,
        sources.length > 0 ? sources : undefined
      );

      // Update local state
      const conversation = conversationService.getConversation(
        currentConversationId
      );
      if (conversation) {
        setMessages(conversation.messages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage =
        "I encountered an error while processing your request. Please try again.";
      
      conversationService.addMessage(
        currentConversationId,
        "assistant",
        errorMessage
      );

      const conversation = conversationService.getConversation(
        currentConversationId
      );
      if (conversation) {
        setMessages(conversation.messages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
  };

  const handleDeleteConversation = () => {
    if (!conversationId) return;
    
    if (confirm("Delete this conversation?")) {
      conversationService.deleteConversation(conversationId);
      handleNewChat();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-white rounded-t-xl shadow-2xl border border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${
        isMinimized
          ? "bottom-0 right-6 w-80 h-14"
          : "bottom-4 right-4 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
      }`}
      style={{
        boxShadow:
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        height: isMinimized ? "3.5rem" : "min(600px, calc(100vh - 2rem))",
        maxHeight: isMinimized ? "3.5rem" : "calc(100vh - 2rem)",
        maxWidth: isMinimized ? "20rem" : "calc(100vw - 2rem)",
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-5 w-5 text-emerald-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-slate-900">Virima Assistant</h3>
              {openAIService.isConfigured() && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                  GPT-4
                </span>
              )}
            </div>
            {messages.length > 0 && (
              <p className="text-xs text-slate-500">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHistory}
            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="View conversation history"
          >
            <History className="h-4 w-4" />
          </Button>
          {conversationId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteConversation}
              className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
              title="Delete conversation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollAreaRef} className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <Bot className="h-12 w-12 text-slate-300 mb-4" />
                <h4 className="text-slate-900 mb-2">
                  Start a conversation
                </h4>
                <p className="text-sm text-slate-500">
                  Ask me anything about Virima documentation, features, or get
                  help with troubleshooting.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Context continuation indicator */}
                {showContextBanner && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-blue-900">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Continuing from your search</span>
                      </div>
                      <button
                        onClick={() => setShowContextBanner(false)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Your previous Q&A has been preserved — ask follow-up questions below
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={`flex-1 max-w-[85%] ${
                        message.role === "user" ? "flex justify-end" : ""
                      }`}
                    >
                      <div
                        className={`group relative rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm">
                          {message.content}
                        </div>
                        
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                            {message.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 text-xs hover:bg-white/50 rounded p-2 -mx-2 transition-colors"
                              >
                                {source.type === "doc" ? (
                                  <FileText className="h-3 w-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Globe className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-slate-900 truncate">
                                    {source.title}
                                  </div>
                                  <div className="text-slate-500 line-clamp-1">
                                    {source.snippet}
                                  </div>
                                </div>
                                <ExternalLink className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Copy button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopyMessage(message.id, message.content)
                          }
                          className={`absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            message.role === "user"
                              ? "text-white hover:bg-emerald-700"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div
                        className={`mt-1 text-xs text-slate-500 ${
                          message.role === "user" ? "text-right" : ""
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-100 rounded-lg px-4 py-3 inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        <span className="text-sm text-slate-600">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="min-h-[44px] max-h-[120px] resize-none bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="mt-2 w-full text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                Start new conversation
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
