import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Crosshair,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  conversationService,
  Conversation,
  Message,
} from "../lib/chat/conversation-service";
import { searchOrchestrator } from "../lib/search/search-orchestrator";
import { webSearchService } from "../lib/search/services/web-search-service";
import {
  openAIService,
  ChatMessage,
} from "../lib/search/services/openai-service";
import virimaAssistantIcon from "../assets/chat_panel_logo.png";

type SelectionKind = "text" | "element";

type SelectionContext = {
  kind: SelectionKind;
  text: string;
  domPath?: string;
  url: string;
  module?: string;
  page?: string;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
};

function getDomPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tag = current.tagName.toLowerCase();
    const id = (current as HTMLElement).id ? `#${(current as HTMLElement).id}` : "";
    const classList = (current as HTMLElement).classList;
    const classHint =
      classList && classList.length > 0
        ? "." + Array.from(classList).slice(0, 3).join(".")
        : "";

    let nth = "";
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        nth = `:nth-of-type(${index})`;
      }
    }

    parts.unshift(`${tag}${id}${classHint}${nth}`);
    current = parent;
    if (id) break; // stable enough
  }

  return parts.join(" > ");
}

function getElementPreviewText(el: HTMLElement): string {
  const aria = el.getAttribute("aria-label");
  if (aria && aria.trim()) return aria.trim();
  const alt = (el as HTMLImageElement).alt;
  if (alt && alt.trim()) return alt.trim();
  const title = el.getAttribute("title");
  if (title && title.trim()) return title.trim();
  const text = (el.innerText || el.textContent || "").trim();
  return text;
}

function unionClientRects(rects: DOMRectList | DOMRect[]): HighlightRect | null {
  const arr = Array.from(rects || []).filter(
    (r) => r && r.width > 0 && r.height > 0,
  );
  if (arr.length === 0) return null;

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  arr.forEach((r) => {
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  });

  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

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
  const [conversationId, setConversationId] = useState<
    string | null
  >(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionContext, setSelectionContext] =
    useState<SelectionContext | null>(null);
  const [hoverHighlight, setHoverHighlight] =
    useState<HighlightRect | null>(null);
  const [lockedHighlight, setLockedHighlight] =
    useState<HighlightRect | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<
    string | null
  >(null);
  const [showContextBanner, setShowContextBanner] =
    useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRootRef = useRef<HTMLDivElement>(null);
  const selectedElementRef = useRef<HTMLElement | null>(null);

  // Load conversation messages
  useEffect(() => {
    if (conversationId) {
      const conversation =
        conversationService.getConversation(conversationId);
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
      const scrollContainer =
        scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
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

  // Point & Ask selection mode: capture text or element selection outside the panel
  useEffect(() => {
    if (!isSelectionMode) return;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
    setHoverHighlight(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSelectionMode(false);
      }
    };

    const updateHoverFromTarget = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setHoverHighlight({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label: "Click to select element",
      });
    };

    let rafId: number | null = null;
    const handleMouseMoveCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRootRef.current?.contains(target)) {
        setHoverHighlight(null);
        return;
      }

      // If user is actively selecting text, prefer selection range highlight.
      const sel = window.getSelection?.();
      const selectedText = sel?.toString().trim() || "";
      if (sel && selectedText && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const rect = unionClientRects(range.getClientRects());
        if (rect) {
          setHoverHighlight({ ...rect, label: "Release mouse to capture text" });
        }
        return;
      }

      // Throttle hover updates
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updateHoverFromTarget(target));
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && panelRootRef.current?.contains(target)) return;

      const selected = window.getSelection?.()?.toString().trim() || "";
      if (!selected) return;

      // Capture selection highlight rect
      const sel = window.getSelection?.();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const rect = unionClientRects(range.getClientRects());
        if (rect) {
          setLockedHighlight({ ...rect, label: "Selected text" });
        }
      }
      selectedElementRef.current = null;
      setSelectionContext({
        kind: "text",
        text: selected,
        url: window.location.href,
        module: currentModule,
        page: currentPage,
      });
      setIsSelectionMode(false);
    };

    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Allow normal interaction inside the chat panel.
      if (panelRootRef.current?.contains(target)) return;

      // Prevent navigation/side-effects while selecting.
      e.preventDefault();
      e.stopPropagation();

      // If user is selecting text, mouseup handler will capture it.
      const selected = window.getSelection?.()?.toString().trim() || "";
      if (selected) return;

      const preview = getElementPreviewText(target);
      const text = preview.length > 0 ? preview : `<${target.tagName.toLowerCase()}>`;

      const rect = target.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setLockedHighlight({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          label: "Selected element",
        });
      }
      selectedElementRef.current = target;
      setSelectionContext({
        kind: "element",
        text: text.slice(0, 500),
        domPath: getDomPath(target),
        url: window.location.href,
        module: currentModule,
        page: currentPage,
      });
      setIsSelectionMode(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("mousemove", handleMouseMoveCapture, true);

    return () => {
      document.body.style.cursor = previousCursor;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleMouseUp, true);
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("mousemove", handleMouseMoveCapture, true);
      if (rafId) cancelAnimationFrame(rafId);
      setHoverHighlight(null);
    };
  }, [isSelectionMode, currentModule, currentPage]);

  // Keep locked highlight aligned for element selections on scroll/resize
  useEffect(() => {
    if (!selectionContext || selectionContext.kind !== "element") return;
    if (!selectedElementRef.current) return;

    const update = () => {
      const el = selectedElementRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setLockedHighlight((prev) =>
        prev
          ? {
              ...prev,
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          : {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              label: "Selected element",
            },
      );
    };

    let raf: number | null = null;
    const onScrollOrResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [selectionContext]);

  // Handle initial messages - create conversation with context
  useEffect(() => {
    if (
      isOpen &&
      initialMessages &&
      initialMessages.length > 0 &&
      !conversationId
    ) {
      // Create a new conversation with the initial messages
      const newConversation =
        conversationService.createConversation(
          initialMessages[0].content,
          initialMessages,
        );
      setConversationId(newConversation.id);
      setMessages(initialMessages);
      setShowContextBanner(true);
    }
  }, [isOpen, initialMessages, conversationId]);

  // Hide context banner after user sends first follow-up
  useEffect(() => {
    if (
      initialMessages &&
      messages.length > initialMessages.length
    ) {
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
      const newConversation =
        conversationService.createConversation(userMessage);
      currentConversationId = newConversation.id;
      setConversationId(currentConversationId);
    }

    // Add user message
    conversationService.addMessage(
      currentConversationId,
      "user",
      userMessage,
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
      const selectionPrefix = selectionContext
        ? [
            "User selected context (Point & Ask):",
            `- Type: ${selectionContext.kind}`,
            selectionContext.module
              ? `- Module: ${selectionContext.module}`
              : null,
            selectionContext.page ? `- Page: ${selectionContext.page}` : null,
            selectionContext.domPath
              ? `- DOM Path: ${selectionContext.domPath}`
              : null,
            `- URL: ${selectionContext.url}`,
            "",
            `Selected: """\n${selectionContext.text}\n"""`,
            "",
          ]
            .filter(Boolean)
            .join("\n")
        : "";

      const aiQuery = selectionPrefix
        ? `${selectionPrefix}Question: ${userMessage}`
        : userMessage;

      // Search both docs and web
      const [docsResults, webResults] = await Promise.all([
        searchOrchestrator.search(userMessage, {
          module: currentModule,
          page: currentPage,
          mdxContent,
          scope: "all-docs",
        }),
        webSearchService
          .search(userMessage)
          .catch(() => ({
            results: [],
            totalResults: 0,
            searchTime: 0,
          })),
      ]);

      // Prepare sources
      const sources: Message["sources"] = [];

      // Build documentation context for AI
      const documentationContext: string[] = [];

      if (docsResults.length > 0) {
        docsResults.slice(0, 5).forEach((result) => {
          documentationContext.push(
            `${result.title}\n${result.snippet}`,
          );
          sources.push({
            title: result.title,
            url: result.url,
            snippet: result.snippet,
            type: "doc",
          });
        });
      }

      if (webResults.results && webResults.results.length > 0) {
        webResults.results.slice(0, 3).forEach((result) => {
          documentationContext.push(
            `Web: ${result.title}\n${result.description}`,
          );
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
            aiQuery,
            documentationContext,
            conversationHistory,
          );
        } catch (error) {
          console.error("OpenAI generation error:", error);
          // Fallback to simple response
          response =
            documentationContext.length > 0
              ? `Based on the documentation:\n\n${documentationContext[0]}`
              : "I couldn't generate a response. Please try again.";
        }
      } else {
        // Fallback if OpenAI is not configured
        if (documentationContext.length > 0) {
          response =
            "Based on the Virima documentation:\n\n" +
            documentationContext[0];
        } else {
          response =
            "I couldn't find specific information about that in the documentation or on the web. Could you please rephrase your question or provide more context?";
        }
      }

      // Add assistant message
      conversationService.addMessage(
        currentConversationId,
        "assistant",
        response,
        sources.length > 0 ? sources : undefined,
      );

      // Update local state
      const conversation = conversationService.getConversation(
        currentConversationId,
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
        errorMessage,
      );

      const conversation = conversationService.getConversation(
        currentConversationId,
      );
      if (conversation) {
        setMessages(conversation.messages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (
    messageId: string,
    content: string,
  ) => {
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

  const overlay = (() => {
    if (typeof document === "undefined") return null;
    const rect = isSelectionMode ? hoverHighlight : lockedHighlight;
    if (!rect) return null;

    // Keep overlay below the chat panel (panel is z-50)
    return createPortal(
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 45 }}
      >
        <div
          className="absolute rounded-md"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            border: "2px solid rgba(120, 116, 242, 0.95)",
            background: "rgba(120, 116, 242, 0.12)",
            boxShadow: "0 0 0 4px rgba(120, 116, 242, 0.12)",
          }}
        >
          {rect.label && (
            <div
              className="absolute -top-6 left-0 text-[11px] font-medium px-2 py-1 rounded bg-slate-900 text-white"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}
            >
              {rect.label}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  })();

  const renderMessageContent = (message: Message) => {
    // Render assistant messages as Markdown for readability (tables, lists, headings, code blocks).
    // Keep user messages as plain text to preserve exactly what was typed.
    if (message.role !== "assistant") {
      return (
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.content}
        </div>
      );
    }

    return (
      <div className="text-sm break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // react-markdown is safe by default (HTML is not rendered unless rehypeRaw is used).
          components={{
            h1: ({ children }) => (
              <h1 className="text-base font-semibold mt-2 mb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-semibold mt-3 mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-medium mt-3 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-2 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-2 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500"
              >
                {children}
              </a>
            ),
            code: ({ children, className }) => {
              const isBlock = Boolean(className);
              if (!isBlock) {
                return (
                  <code className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 font-mono text-[0.85em]">
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs my-2">
                  <code className="font-mono">{children}</code>
                </pre>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="w-full border border-slate-200 border-collapse text-xs">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-slate-200 bg-slate-100 px-2 py-1 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-slate-200 px-2 py-1 align-top">
                {children}
              </td>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {overlay}
      <div
      ref={panelRootRef}
      className={`fixed z-50 bg-white rounded-t-xl shadow-2xl border border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${
        isMinimized
          ? "bottom-0 right-6 w-80 h-14"
          : "bottom-4 right-4 md:right-6 w-[calc(100%-2rem)] md:w-[30vw] md:min-w-[280px] md:max-w-[400px] mx-0"
      }`}
      style={{
        boxShadow:
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        height: isMinimized
          ? "3.5rem"
          : "min(600px, calc(100vh - 2rem))",
        maxHeight: isMinimized
          ? "3.5rem"
          : "calc(100vh - 2rem)",
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={virimaAssistantIcon}
              alt="Virima Assistant"
              className="h-5 w-5 transition-all duration-200"
              style={{
                imageRendering: "crisp-edges",
                WebkitFontSmoothing: "antialiased",
                mixBlendMode: "multiply",
                filter: "contrast(1.1) saturate(1.2)",
                backgroundColor: "transparent",
              }}
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-slate-900 dark:text-white">Virima DocGPT</h3>
              {openAIService.isConfigured() && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                  GPT-4
                </span>
              )}
            </div>
            {messages.length > 0 && (
              <p className="text-xs text-slate-500">
                {messages.length} message
                {messages.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSelectionMode((prev) => !prev)}
            className={`h-8 w-8 p-0 ${
              isSelectionMode
                ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title={
              isSelectionMode
                ? "Selection mode active (Esc to cancel)"
                : "Point & Ask: select something on the page"
            }
          >
            <Crosshair className="h-4 w-4" />
          </Button>
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
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <Bot className="h-12 w-12 text-slate-300 mb-4" />
                  <h4 className="text-slate-900 dark:text-white mb-2">
                    Start a conversation
                  </h4>
                  <p className="text-sm text-slate-500">
                    Ask me anything about Virima documentation,
                    features, or get help with troubleshooting.
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
                          <span className="font-medium">
                            Continuing from your search
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setShowContextBanner(false)
                          }
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Your previous Q&A has been preserved —
                        ask follow-up questions below
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-emerald-600" />
                        </div>
                      )}
                      <div
                        className={`flex-1 max-w-[85%] ${
                          message.role === "user"
                            ? "flex justify-end"
                            : ""
                        }`}
                      >
                        <div
                          className={`group relative rounded-lg px-4 py-3 ${
                            message.role === "user"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                          }`}
                        >
                          {renderMessageContent(message)}

                          {/* Sources */}
                          {message.sources &&
                            message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                                {message.sources.map(
                                  (source, idx) => (
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
                                  ),
                                )}
                              </div>
                            )}

                          {/* Copy button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopyMessage(
                                message.id,
                                message.content,
                              )
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
                            message.role === "user"
                              ? "text-right"
                              : ""
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
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
            {isSelectionMode && (
              <div className="mb-3 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                <span className="font-medium">Selection mode:</span>{" "}
                click an element or highlight text on the page. Press{" "}
                <span className="font-mono">Esc</span> to cancel.
              </div>
            )}
            {selectionContext && (
              <div className="mb-3 bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <Crosshair className="h-4 w-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-600 mb-1">
                    Using selected {selectionContext.kind} context
                    {selectionContext.page
                      ? ` • ${selectionContext.page}`
                      : ""}
                  </div>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap break-words line-clamp-3">
                    {selectionContext.text}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectionContext(null);
                    setLockedHighlight(null);
                    selectedElementRef.current = null;
                  }}
                  className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  title="Clear selected context"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
    </>
  );
}