import { useState, useEffect } from "react";
import {
  X,
  Search,
  Pin,
  Trash2,
  Download,
  MessageSquare,
  Calendar,
  Clock,
  BarChart3,
  Loader2,
  FileText,
  Globe,
  ChevronRight,
  FileDown,
  MoreVertical,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  conversationService,
  Conversation,
} from "../lib/chat/conversation-service";
import {
  exportAsMarkdown,
  exportAsHTML,
  exportAsText,
} from "../lib/chat/chat-export";
import { ChatSettings } from "./ChatSettings";
import { ChatStatistics } from "./ChatStatistics";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationHistory({
  isOpen,
  onClose,
  onSelectConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<ReturnType<
    typeof conversationService.getStats
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      loadStats();
    }
  }, [isOpen]);

  useEffect(() => {
    // Subscribe to conversation changes
    const unsubscribe = conversationService.subscribe(() => {
      loadConversations();
      loadStats();
    });

    return unsubscribe;
  }, []);

  const loadConversations = () => {
    setIsLoading(true);
    try {
      const allConversations =
        conversationService.getAllConversations();
      setConversations(allConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = () => {
    const statsData = conversationService.getStats();
    setStats(statsData);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results =
        conversationService.searchConversations(query);
      setConversations(results);
    } else {
      loadConversations();
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
    onClose();
  };

  const handleTogglePin = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    conversationService.togglePin(conversationId);
    loadConversations();
  };

  const handleDeleteConversation = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (
      confirm(
        "Delete this conversation? This action cannot be undone.",
      )
    ) {
      conversationService.deleteConversation(conversationId);
      loadConversations();
      loadStats();
    }
  };

  const handleExportConversation = (
    conversationId: string,
    format: "json" | "markdown" | "html" | "text",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const conversation =
      conversationService.getConversation(conversationId);
    if (!conversation) return;

    switch (format) {
      case "json":
        conversationService.exportConversation(conversationId);
        break;
      case "markdown":
        exportAsMarkdown(conversation);
        break;
      case "html":
        exportAsHTML(conversation);
        break;
      case "text":
        exportAsText(conversation);
        break;
    }
  };

  const handleClearAll = () => {
    conversationService.clearAll();
    loadConversations();
    loadStats();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  const groupConversationsByDate = (convs: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      "Last 30 days": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    convs.forEach((conv) => {
      if (conv.isPinned) {
        groups.Pinned.push(conv);
        return;
      }

      const convDate = new Date(conv.updatedAt);
      const convDay = new Date(
        convDate.getFullYear(),
        convDate.getMonth(),
        convDate.getDate(),
      );

      const diffTime = today.getTime() - convDay.getTime();
      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24),
      );

      if (convDay.getTime() === today.getTime()) {
        groups.Today.push(conv);
      } else if (convDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(conv);
      } else if (diffDays < 7) {
        groups["Last 7 days"].push(conv);
      } else if (diffDays < 30) {
        groups["Last 30 days"].push(conv);
      } else {
        groups.Older.push(conv);
      }
    });

    // Remove empty groups
    return Object.entries(groups).filter(
      ([_, convs]) => convs.length > 0,
    );
  };

  const groupedConversations =
    groupConversationsByDate(conversations);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 bg-white overflow-hidden">
        <DialogTitle className="sr-only">
          Conversation History
        </DialogTitle>
        <DialogDescription className="sr-only">
          View and manage your past conversations with Virima
          Assistant
        </DialogDescription>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white">
                  Conversation History
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Resume or review your past conversations
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-xs">Conversations</span>
                  </div>
                  <div className="text-slate-900 dark:text-white">
                    {stats.totalConversations}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <BarChart3 className="h-3 w-3" />
                    <span className="text-xs">Messages</span>
                  </div>
                  <div className="text-slate-900 dark:text-white">
                    {stats.totalMessages}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">Since</span>
                  </div>
                  <div className="text-slate-900 dark:text-white text-sm">
                    {stats.oldestConversation
                      ? stats.oldestConversation.toLocaleDateString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsStatsOpen(true)}
                className="w-full mt-3 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="h-[500px]">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 dark:text-white mb-2">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start chatting with the Virima Assistant to see your conversation history here"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedConversations.map(([group, convs]) => (
                  <div key={group}>
                    <h3 className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      {group}
                    </h3>
                    <div className="space-y-2">
                      {convs.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() =>
                            handleSelectConversation(
                              conversation.id,
                            )
                          }
                          className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-slate-900 dark:text-white truncate">
                                  {conversation.title}
                                </h4>
                                {conversation.isPinned && (
                                  <Pin className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {conversation.messages.length}{" "}
                                  message
                                  {conversation.messages
                                    .length !== 1
                                    ? "s"
                                    : ""}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(
                                    conversation.updatedAt,
                                  )}
                                </div>
                              </div>

                              {/* Preview of last message */}
                              {conversation.messages.length >
                                0 && (
                                <div className="mt-2 text-sm text-slate-600 line-clamp-2">
                                  {
                                    conversation.messages[
                                      conversation.messages
                                        .length - 1
                                    ].content
                                  }
                                </div>
                              )}

                              {/* Source indicators */}
                              <div className="mt-2 flex items-center gap-2">
                                {conversation.messages.some(
                                  (m) =>
                                    m.sources?.some(
                                      (s) => s.type === "doc",
                                    ),
                                ) && (
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                    <FileText className="h-3 w-3" />
                                    Docs
                                  </div>
                                )}
                                {conversation.messages.some(
                                  (m) =>
                                    m.sources?.some(
                                      (s) => s.type === "web",
                                    ),
                                ) && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    <Globe className="h-3 w-3" />
                                    Web
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) =>
                                  handleTogglePin(
                                    conversation.id,
                                    e,
                                  )
                                }
                                className={`h-7 w-7 p-0 ${
                                  conversation.isPinned
                                    ? "text-emerald-600 hover:text-emerald-700"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                                title={
                                  conversation.isPinned
                                    ? "Unpin"
                                    : "Pin to top"
                                }
                              >
                                <Pin className="h-3 w-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="h-7 w-7 p-0 text-slate-600 hover:text-slate-900"
                                    title="More options"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "json",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as JSON
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "markdown",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as Markdown
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "html",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as HTML
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "text",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as Text
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleDeleteConversation(
                                        conversation.id,
                                        e,
                                      )
                                    }
                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Conversations
            </Button>
          </div>
        )}
      </DialogContent>
      
      {/* Settings Dialog */}
      <ChatSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      {/* Statistics Dialog */}
      <ChatStatistics
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </Dialog>
  );
}