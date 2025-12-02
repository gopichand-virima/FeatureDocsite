# Technical Deep Dive - Virima Documentation Platform

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React 18   │  │  Tailwind    │  │  Shadcn/ui   │          │
│  │  Components  │  │     CSS      │  │  Components  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React      │  │ LocalStorage │  │SessionStorage│          │
│  │   Hooks      │  │  Persistence │  │  Temp State  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CONTENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     MDX      │  │   Dynamic    │  │   Version    │          │
│  │   Content    │  │   Imports    │  │  Isolation   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI & SEARCH LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   OpenAI     │  │    Brave     │  │   Search     │          │
│  │   GPT-4o     │  │    Search    │  │ Orchestrator │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Whisper    │  │  Conversation│  │   Search     │          │
│  │     API      │  │   Service    │  │   History    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIS                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   OpenAI     │  │    Brave     │  │   Browser    │          │
│  │     API      │  │     API      │  │     APIs     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
/
├── components/                 # React components (45+ files)
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx         # Base button component
│   │   ├── dialog.tsx         # Modal dialogs
│   │   ├── scroll-area.tsx    # Custom scrollbar
│   │   └── ...                # 30+ more components
│   ├── ChatPanel.tsx          # AI chat interface
│   ├── FloatingChatButton.tsx # Chat trigger button
│   ├── ResizableSidebar.tsx   # Sidebar with resize
│   ├── DocumentationLayout.tsx# Main layout wrapper
│   ├── TableOfContents.tsx    # TOC navigation
│   └── AISearchDialog.tsx     # Search modal
│
├── content/                    # All documentation (822 files)
│   ├── 5_13/                  # Version 5.13 docs
│   ├── 6_1/                   # Version 6.1 docs
│   │   ├── admin_6_1/         # Admin module
│   │   ├── cmdb_6_1/          # CMDB module
│   │   ├── discovery_6_1/     # Discovery module
│   │   ├── itam_6_1/          # ITAM module
│   │   ├── itsm_6_1/          # ITSM module
│   │   └── ...                # More modules
│   ├── 6_1_1/                 # Version 6.1.1 docs
│   └── NG/                    # NextGen docs
│
├── lib/                        # Business logic
│   ├── chat/                  # Chat functionality
│   │   ├── conversation-service.ts  # Chat persistence
│   │   ├── chat-analytics.ts        # Usage tracking
│   │   └── chat-export.ts           # Export/import
│   └── search/                # Search functionality
│       ├── search-orchestrator.ts   # Main search logic
│       ├── config.ts                # Environment config
│       └── services/
│           ├── openai-service.ts    # GPT-4o integration
│           ├── web-search-service.ts# Brave Search
│           ├── voice-input-service.ts# Whisper API
│           ├── search-history-service.ts
│           └── vector-search-service.ts
│
├── data/                       # Static data
│   └── navigationData.ts      # Version/module structure
│
├── utils/                      # Utility functions
│   ├── tocLoader.ts           # TOC loading logic
│   ├── mdxPathResolver.ts     # Path resolution
│   └── versionContentLoader.ts# Dynamic imports
│
├── styles/
│   └── globals.css            # Global styles + Tailwind
│
├── App.tsx                     # Root component
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── tailwind.config.js         # Tailwind config
```

---

## 🔧 Core Systems Explained

### 1. Cover Page Animation System

#### Motion/React Integration
```typescript
// Component structure
import { motion } from "motion/react";

export function CoverPage({ onModuleSelect }: CoverPageProps) {
  const [animationKey, setAnimationKey] = useState(0);
  
  // Reset animation on every mount (home navigation)
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);
  
  return (
    <div className="relative w-full min-h-screen">
      {/* Stage 1: Background slide-in (0-1.2s) */}
      <motion.div
        key={`background-${animationKey}`}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.43, 0.13, 0.23, 0.96]  // Custom cubic-bezier
        }}
      >
        {/* Stage 2: Shake effect (1.2-1.8s) */}
        <motion.div
          key={`shake-${animationKey}`}
          initial={{ scale: 1.05 }}
          animate={{ 
            scale: [1.05, 1.07, 1.03, 1.06, 1.04, 1.05]
          }}
          transition={{
            delay: 1.2,
            duration: 0.6,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          }}
        >
          <img src={hexagonPattern} className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
      
      {/* Stage 3: Title fade-in (1.4-2.2s) */}
      <motion.div
        key={`title-${animationKey}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <h1 className="text-9xl">Virima</h1>
      </motion.div>
      
      {/* Stage 4: Tagline (1.6-2.4s) */}
      <motion.div
        key={`tagline-${animationKey}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <p>Welcome to the Documentation Platform</p>
      </motion.div>
      
      {/* Stage 5: Description (1.8-2.6s) */}
      <motion.p
        key={`description-${animationKey}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        Explore comprehensive documentation...
      </motion.p>
      
      {/* Stage 6: Search CTA (2.0-2.6s) */}
      <motion.div
        key={`search-${animationKey}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        <Button>Ask AI anything about Virima</Button>
      </motion.div>
      
      {/* Stage 7: Get Started (2.2-2.8s) */}
      <motion.div
        key={`button-${animationKey}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}
```

#### Animation Timeline Breakdown

| Time | Element | Animation | Properties |
|------|---------|-----------|------------|
| 0.0-1.2s | Background | Slide from right | x: 100% → 0, opacity: 0 → 1 |
| 1.2-1.8s | Background | Shake/pulse | scale: [1.05, 1.07, 1.03, 1.06, 1.04, 1.05] |
| 1.4-2.2s | Title | Fade + slide up | opacity: 0 → 1, y: 30 → 0 |
| 1.6-2.4s | Tagline | Fade + slide up | opacity: 0 → 1, y: 20 → 0 |
| 1.8-2.6s | Description | Fade + slide up | opacity: 0 → 1, y: 20 → 0 |
| 2.0-2.6s | Search Button | Fade + scale in | opacity: 0 → 1, scale: 0.9 → 1 |
| 2.2-2.8s | Get Started | Fade + scale in | opacity: 0 → 1, scale: 0.9 → 1 |

#### Performance Optimization
```typescript
// Use keys to force re-animation on navigation
key={`element-${animationKey}`}

// Increment key on mount
useEffect(() => {
  setAnimationKey(prev => prev + 1);
}, []);

// Efficient cubic-bezier easing
ease: [0.43, 0.13, 0.23, 0.96]  // Smooth deceleration

// Staggered timing prevents overwhelming GPU
// Each animation has 200-400ms offset
```

#### Responsive Design
```typescript
// Text sizing scales across breakpoints
<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
  Virima
</h1>

// Button sizing adapts
<Button className="h-14 sm:h-16 px-4 sm:px-6 text-sm sm:text-base">

// Spacing adjusts
className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8"
```

#### Accessibility Considerations
```typescript
// Respect user motion preferences
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// Focus visible for keyboard navigation
.focus-visible:focus {
  outline: 2px solid var(--color-emerald-500);
}
```

---

### 2. State Persistence System

#### LocalStorage Schema
```typescript
// User preferences (persistent across sessions)
interface PersistentState {
  // Navigation state
  lastVisitedVersion: string;      // "6_1"
  lastVisitedModule: string;       // "admin_6_1"
  lastVisitedPage: string;         // Full path
  
  // UI preferences
  sidebarWidth: number;            // 200-600px
  sidebarCollapsed: boolean;       // true/false
  theme: 'light' | 'dark';         // Future use
  
  // Search history
  searchHistory: SearchQuery[];    // Last 50 searches
  
  // Chat conversations
  conversations: Conversation[];   // All chat history
  
  // Settings
  enableVoiceInput: boolean;
  enableAIChat: boolean;
  enableWebSearch: boolean;
  
  // API keys (optional)
  openaiApiKey?: string;
  braveSearchApiKey?: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER_STATE: 'virima_user_state',
  SIDEBAR_WIDTH: 'virima_sidebar_width',
  SEARCH_HISTORY: 'virima_search_history',
  CONVERSATIONS: 'virima_conversations',
  API_KEYS: 'virima_api_keys',
};

// Save state
function saveState(state: Partial<PersistentState>) {
  const current = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.USER_STATE) || '{}'
  );
  
  const updated = { ...current, ...state };
  localStorage.setItem(
    STORAGE_KEYS.USER_STATE, 
    JSON.stringify(updated)
  );
}

// Load state
function loadState(): PersistentState {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_STATE);
  return stored ? JSON.parse(stored) : getDefaultState();
}
```

#### SessionStorage Schema
```typescript
// Temporary state (cleared on tab close)
interface SessionState {
  // Current scroll position
  scrollPosition: number;
  
  // Expanded TOC nodes
  expandedNodes: string[];
  
  // Active search query
  currentSearch?: string;
  
  // Temporary form data
  formDrafts: Record<string, any>;
}
```

#### Page Remembrance Implementation
```typescript
// On page load
useEffect(() => {
  const state = loadState();
  
  // Restore version
  if (state.lastVisitedVersion) {
    setCurrentVersion(state.lastVisitedVersion);
  }
  
  // Restore module
  if (state.lastVisitedModule) {
    setCurrentModule(state.lastVisitedModule);
  }
  
  // Restore exact page
  if (state.lastVisitedPage) {
    navigate(state.lastVisitedPage);
  }
  
  // Restore scroll position (delayed)
  setTimeout(() => {
    const scrollPos = sessionStorage.getItem('scroll_position');
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos));
    }
  }, 100);
}, []);

// On page change
useEffect(() => {
  saveState({
    lastVisitedVersion: currentVersion,
    lastVisitedModule: currentModule,
    lastVisitedPage: window.location.pathname,
  });
  
  // Save scroll position on scroll
  const handleScroll = () => {
    sessionStorage.setItem(
      'scroll_position', 
      window.scrollY.toString()
    );
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [currentVersion, currentModule, pathname]);
```

---

### 3. Version Isolation System

#### Dynamic Import Strategy
```typescript
// Version-aware content loader
async function loadContent(
  version: string, 
  module: string, 
  page: string
) {
  try {
    // Construct path
    const path = `/content/${version}/${module}/${page}.mdx`;
    
    // Dynamic import (code splitting)
    const content = await import(/* @vite-ignore */ path);
    
    return content.default;
  } catch (error) {
    console.error(`Failed to load: ${path}`, error);
    return null;
  }
}

// Usage in component
const Content = useMemo(() => {
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    loadContent(version, module, page).then(setContent);
  }, [version, module, page]);
  
  if (!content) return <LoadingSpinner />;
  return <MDXProvider>{content}</MDXProvider>;
}, [version, module, page]);
```

#### Path Resolution
```typescript
// Smart path resolver
class PathResolver {
  // Convert version string to folder name
  versionToFolder(version: string): string {
    return version.replace('.', '_'); // "6.1" → "6_1"
  }
  
  // Build full path
  buildPath(version: string, module: string, page: string): string {
    const folder = this.versionToFolder(version);
    return `/content/${folder}/${module}/${page}.mdx`;
  }
  
  // Check if path exists
  async pathExists(path: string): Promise<boolean> {
    try {
      await import(/* @vite-ignore */ path);
      return true;
    } catch {
      return false;
    }
  }
  
  // Fallback resolution
  async resolveWithFallback(
    version: string, 
    module: string, 
    page: string
  ): Promise<string> {
    const primary = this.buildPath(version, module, page);
    
    if (await this.pathExists(primary)) {
      return primary;
    }
    
    // Try index file
    const index = this.buildPath(version, module, 'index');
    if (await this.pathExists(index)) {
      return index;
    }
    
    // Return 404 path
    return '/404';
  }
}
```

#### Version-Specific TOC
```typescript
// TOC data structure
interface TOCData {
  [version: string]: {
    [module: string]: TOCNode[];
  };
}

const tocData: TOCData = {
  '5_13': {
    'overview': [...],
  },
  '6_1': {
    'admin_6_1': [...],
    'cmdb_6_1': [...],
    'discovery_6_1': [...],
    // ... more modules
  },
  '6_1_1': {
    'overview': [...],
  },
  'NG': {
    'admin_ng': [...],
    'cmdb_ng': [...],
    // ... more modules
  }
};

// Get TOC for current version
function getTOC(version: string, module: string): TOCNode[] {
  return tocData[version]?.[module] || [];
}
```

---

### 4. AI Chat System

#### Conversation Service Implementation
```typescript
// Full conversation management
class ConversationService {
  private conversations: Map<string, Conversation> = new Map();
  private listeners: Set<Function> = new Set();
  private readonly STORAGE_KEY = 'virima_conversations';
  
  constructor() {
    this.loadFromStorage();
  }
  
  // Create new conversation
  createConversation(
    initialMessage: string,
    messages: Message[] = []
  ): Conversation {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: this.generateTitle(initialMessage),
      messages: messages,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        messageCount: messages.length,
        lastSender: messages[messages.length - 1]?.role || 'user'
      }
    };
    
    this.conversations.set(conversation.id, conversation);
    this.saveToStorage();
    this.notifyListeners();
    
    return conversation;
  }
  
  // Add message to conversation
  addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: Source[]
  ): Message {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      sources,
      timestamp: new Date()
    };
    
    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    conversation.metadata.messageCount++;
    conversation.metadata.lastSender = role;
    
    this.saveToStorage();
    this.notifyListeners();
    
    return message;
  }
  
  // Get conversation
  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }
  
  // Get all conversations
  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  // Delete conversation
  deleteConversation(id: string): void {
    this.conversations.delete(id);
    this.saveToStorage();
    this.notifyListeners();
  }
  
  // Search conversations
  searchConversations(query: string): Conversation[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllConversations().filter(conv => 
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      )
    );
  }
  
  // Export conversation as JSON
  exportConversation(id: string): string {
    const conversation = this.conversations.get(id);
    if (!conversation) throw new Error('Conversation not found');
    
    return JSON.stringify(conversation, null, 2);
  }
  
  // Import conversation from JSON
  importConversation(data: string): Conversation {
    const conversation = JSON.parse(data);
    this.conversations.set(conversation.id, conversation);
    this.saveToStorage();
    this.notifyListeners();
    return conversation;
  }
  
  // Save to localStorage
  private saveToStorage(): void {
    const data = Array.from(this.conversations.values());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  
  // Load from localStorage
  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return;
    
    try {
      const data = JSON.parse(stored);
      data.forEach((conv: Conversation) => {
        // Convert date strings back to Date objects
        conv.createdAt = new Date(conv.createdAt);
        conv.updatedAt = new Date(conv.updatedAt);
        conv.messages = conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        this.conversations.set(conv.id, conv);
      });
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }
  
  // Generate title from first message
  private generateTitle(message: string): string {
    const maxLength = 50;
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }
  
  // Subscribe to changes
  subscribe(listener: Function): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Singleton instance
export const conversationService = new ConversationService();
```

#### OpenAI Integration
```typescript
// GPT-4o service
class OpenAIService {
  private apiKey: string | undefined;
  private readonly MODEL = 'gpt-4o'; // Latest model
  private readonly MAX_TOKENS = 4000; // Unrestricted allocation
  
  configure(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  isConfigured(): boolean {
    return !!this.apiKey;
  }
  
  async generateAnswer(
    query: string,
    context: string[],
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Build system prompt
    const systemPrompt = `You are Virima Assistant, an expert on Virima documentation.
    
Guidelines:
- Provide accurate, detailed answers based on the context
- If information is not in the context, say so clearly
- Include specific version numbers when relevant
- Format responses in clear, readable markdown
- Be concise but comprehensive
- Always cite sources when possible

Context from Virima documentation:
${context.join('\n\n---\n\n')}`;
    
    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query }
    ];
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages,
        max_tokens: this.MAX_TOKENS,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }
}

export const openAIService = new OpenAIService();
```

---

### 5. Voice Input System

#### Whisper API Integration
```typescript
// Voice input service
class VoiceInputService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private apiKey: string | undefined;
  
  configure(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioChunks = [];
      
      // Use best available codec
      const mimeType = this.getBestMimeType();
      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start(100); // Collect data every 100ms
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Microphone access denied or unavailable');
    }
  }
  
  async stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }
      
      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { 
            type: this.mediaRecorder!.mimeType 
          });
          
          const transcription = await this.transcribe(audioBlob);
          
          // Clean up
          this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
          this.mediaRecorder = null;
          this.audioChunks = [];
          
          resolve(transcription);
        } catch (error) {
          reject(error);
        }
      };
      
      this.mediaRecorder.stop();
    });
  }
  
  private async transcribe(audioBlob: Blob): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Convert to format Whisper accepts
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Whisper API error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.text;
  }
  
  private getBestMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/wav'
    ];
    
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
  }
  
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
  
  cancelRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
      this.audioChunks = [];
    }
  }
}

export const voiceInputService = new VoiceInputService();
```

---

### 6. Keyboard Shortcuts System

#### Global Event Listeners
```typescript
// App.tsx - Global keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K → Open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

#### TOC Navigation Shortcuts
```typescript
// DocumentationLayout.tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + Shift + E → Expand all
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      setExpandedKeys(getAllKeys(tocData));
    }
    
    // Cmd/Ctrl + Shift + C → Collapse all
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      setExpandedKeys([]);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [tocData]);
```

#### Chat Input Shortcuts
```typescript
// ChatPanel.tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  // Enter → Submit message
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
  // Shift + Enter → New line (default behavior, don't prevent)
};
```

#### Settings Configuration
```typescript
// ChatSettings.tsx
interface ChatSettings {
  enableKeyboardShortcuts: boolean;
  // ... other settings
}

const DEFAULT_SETTINGS: ChatSettings = {
  enableKeyboardShortcuts: true,
  // ... defaults
};

// Persist to localStorage
localStorage.setItem('chat-settings', JSON.stringify(settings));
```

#### Cross-Platform Compatibility
```typescript
// Detect platform
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modifierKey = isMac ? 'metaKey' : 'ctrlKey';

// Use correct modifier
if (e[modifierKey] && e.key === 'k') {
  // Open search
}

// Display correct hint
const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';
```

#### Accessibility Features
```typescript
// Focus management
const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Circular tab navigation
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};

// ESC to close modals
const handleEscape = (callback: () => void) => {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') callback();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [callback]);
};
```

---

### 7. Search Orchestration

#### Multi-Source Search Implementation
```typescript
// Main search orchestrator
class SearchOrchestrator {
  async search(
    query: string, 
    options: SearchOptions
  ): Promise<SearchResult[]> {
    // Define scope
    const scope = this.determineScope(options);
    
    // Search documentation
    const docsResults = await this.searchDocumentation(query, scope);
    
    // Rank and format results
    const rankedResults = this.rankResults(docsResults, query);
    
    // Save to history
    searchHistoryService.addSearch(query, rankedResults.length);
    
    return rankedResults;
  }
  
  private async searchDocumentation(
    query: string,
    scope: SearchScope
  ): Promise<RawResult[]> {
    const allFiles = await this.getAllMDXFiles(scope);
    const results: RawResult[] = [];
    
    for (const file of allFiles) {
      const content = await this.loadFileContent(file.path);
      const matches = this.findMatches(query, content);
      
      if (matches.length > 0) {
        results.push({
          file,
          matches,
          score: this.calculateScore(query, content, matches)
        });
      }
    }
    
    return results;
  }
  
  private findMatches(query: string, content: string): Match[] {
    const matches: Match[] = [];
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Exact phrase matching
    let index = contentLower.indexOf(queryLower);
    while (index !== -1) {
      matches.push({
        type: 'exact',
        position: index,
        snippet: this.extractSnippet(content, index, query.length),
        score: 10
      });
      
      index = contentLower.indexOf(queryLower, index + 1);
    }
    
    // Individual word matching
    const words = queryLower.split(/\s+/);
    words.forEach(word => {
      let wordIndex = contentLower.indexOf(word);
      while (wordIndex !== -1) {
        // Avoid duplicating exact matches
        const isDuplicate = matches.some(m => 
          Math.abs(m.position - wordIndex) < word.length
        );
        
        if (!isDuplicate) {
          matches.push({
            type: 'word',
            position: wordIndex,
            snippet: this.extractSnippet(content, wordIndex, word.length),
            score: 5
          });
        }
        
        wordIndex = contentLower.indexOf(word, wordIndex + 1);
      }
    });
    
    return matches;
  }
  
  private calculateScore(
    query: string,
    content: string,
    matches: Match[]
  ): number {
    let score = 0;
    
    // Base score from matches
    matches.forEach(match => {
      score += match.score;
    });
    
    // Boost for title matches
    const title = this.extractTitle(content);
    if (title && title.toLowerCase().includes(query.toLowerCase())) {
      score *= 2;
    }
    
    // Boost for early matches (higher in document)
    const avgPosition = matches.reduce((sum, m) => sum + m.position, 0) / matches.length;
    const positionBoost = 1 - (avgPosition / content.length);
    score *= (1 + positionBoost);
    
    // Penalty for document length (prefer concise docs)
    const lengthPenalty = Math.min(content.length / 10000, 0.5);
    score *= (1 - lengthPenalty);
    
    return score;
  }
  
  private rankResults(
    results: RawResult[],
    query: string
  ): SearchResult[] {
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 50) // Top 50 results
      .map(result => ({
        title: this.extractTitle(result.file.content),
        url: result.file.path,
        snippet: this.getBestSnippet(result.matches),
        score: result.score,
        type: 'doc' as const
      }));
  }
  
  private determineScope(options: SearchOptions): SearchScope {
    if (options.scope === 'current-page') {
      return {
        version: options.version,
        module: options.module,
        page: options.page
      };
    } else if (options.scope === 'current-module') {
      return {
        version: options.version,
        module: options.module
      };
    } else if (options.scope === 'current-version') {
      return {
        version: options.version
      };
    } else {
      return {}; // All docs
    }
  }
}

export const searchOrchestrator = new SearchOrchestrator();
```

---

## 🎨 UI/UX Patterns

### Resizable Sidebar
```typescript
function ResizableSidebar() {
  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  
  const handleMouseDown = () => setIsResizing(true);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
        localStorage.setItem('sidebar_width', newWidth.toString());
      }
    };
    
    const handleMouseUp = () => setIsResizing(false);
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  return (
    <div style={{ width }}>
      {/* Sidebar content */}
      
      {/* Resize handle - LOCKED VALUES */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '2px',              // LOCKED
          opacity: 0.4,              // LOCKED
          backgroundColor: '#10b981', // emerald-500 - LOCKED
          cursor: 'col-resize'
        }}
      />
    </div>
  );
}
```

---

## 🔐 Security Implementation

### Safe Environment Variable Getter
```typescript
// Bulletproof env var access
export function getEnvVar(key: string): string | undefined {
  try {
    // Vite uses import.meta.env
    return import.meta.env?.[key];
  } catch (error) {
    console.warn(`Failed to read env var: ${key}`, error);
    return undefined;
  }
}

// Usage
const openaiKey = getEnvVar('VITE_OPENAI_API_KEY');
if (!openaiKey) {
  console.warn('OpenAI API key not configured');
}
```

---

## 📊 Performance Optimization

### Code Splitting Strategy
```typescript
// Lazy load MDX files
const Content = lazy(() => 
  import(`/content/${version}/${module}/${page}.mdx`)
);

// Usage with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <Content />
</Suspense>
```

### Memoization
```typescript
// Expensive computations
const searchResults = useMemo(() => {
  return searchOrchestrator.search(query, options);
}, [query, options]);

// Prevent re-renders
const MemoizedComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('ConversationService', () => {
  it('creates conversation with unique ID', () => {
    const conv = conversationService.createConversation('Test');
    expect(conv.id).toBeDefined();
    expect(conv.title).toBe('Test');
  });
  
  it('persists conversations to localStorage', () => {
    const conv = conversationService.createConversation('Test');
    const stored = localStorage.getItem('virima_conversations');
    expect(stored).toContain(conv.id);
  });
});
```

---

## 📈 Monitoring & Analytics

### Error Tracking
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Send to monitoring service (Sentry, etc.)
  // logError(event.error);
});

// React error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
  }
}
```

---

**This technical deep dive covers the core architectural patterns and implementation details that make the Virima documentation platform a world-class solution.**
