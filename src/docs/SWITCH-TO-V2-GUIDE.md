# 🔄 Switch to V2 - Quick Integration Guide

## ⚡ 5-Minute Switch Guide

### **Option 1: Immediate Switch** (Recommended for Testing)

Replace your current import:

```typescript
// Before (V1)
import { AISearchDialog } from './components/AISearchDialog';

// After (V2)
import { AISearchDialogV2 as AISearchDialog } from './components/AISearchDialogV2';

// Usage stays the same!
<AISearchDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  currentModule="discovery-scan"
  currentPage="getting-started"
/>
```

**That's it!** The V2 component accepts the same props as V1.

---

### **Option 2: Feature Flag** (Recommended for Production)

Add a feature flag to switch dynamically:

```typescript
import { AISearchDialog } from './components/AISearchDialog';
import { AISearchDialogV2 } from './components/AISearchDialogV2';

// Feature flag (from env or config)
const USE_V2_SEARCH = process.env.NEXT_PUBLIC_USE_V2_SEARCH === 'true';

function App() {
  const SearchDialog = USE_V2_SEARCH ? AISearchDialogV2 : AISearchDialog;
  
  return (
    <SearchDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      currentModule="discovery-scan"
      currentPage="getting-started"
      version="6.1" // V2 additional prop (optional)
    />
  );
}
```

Then toggle in `.env.local`:
```bash
NEXT_PUBLIC_USE_V2_SEARCH=true
```

---

### **Option 3: A/B Testing** (Recommended for Data-Driven Decision)

```typescript
import { AISearchDialog } from './components/AISearchDialog';
import { AISearchDialogV2 } from './components/AISearchDialogV2';

function App() {
  // Simple A/B test: 50% of users get V2
  const [variant] = useState(() => Math.random() > 0.5 ? 'v2' : 'v1');
  
  const SearchDialog = variant === 'v2' ? AISearchDialogV2 : AISearchDialog;
  
  return (
    <SearchDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      currentModule="discovery-scan"
    />
  );
}
```

Track which version performs better, then switch everyone to the winner.

---

## 📊 Prop Comparison

### **V1 Props**
```typescript
interface AISearchDialogProps {
  isOpen?: boolean;           // Legacy support
  open?: boolean;             // Primary
  onClose?: () => void;       // Legacy support
  onOpenChange?: (open: boolean) => void; // Primary
  currentModule?: string;     // Current module
  currentPage?: string;       // Current page
}
```

### **V2 Props** (All V1 props + new ones)
```typescript
interface AISearchDialogV2Props {
  // All V1 props (backward compatible)
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentModule?: string;
  currentPage?: string;
  
  // New in V2
  version?: string;           // e.g., "6.1" (defaults to version in UI)
}
```

**✅ 100% Backward Compatible** - All V1 props work in V2!

---

## 🎯 What Changes

### **User Experience**

**V1 → V2 Changes**:
- ❌ 3 tabs (Docs/AI/Web) → ✅ Unified interface with automatic mode
- ❌ Manual mode selection → ✅ Intelligent intent detection
- ❌ Basic suggestions → ✅ Contextual + Trending + Quick actions
- ❌ Simple input → ✅ Smart input with focus modes
- ❌ Basic design → ✅ Glass morphism with gradients

**What Stays the Same**:
- ✅ Keyboard shortcuts (⌘K to open, Esc to close)
- ✅ Voice search
- ✅ Search functionality
- ✅ AI conversations
- ✅ Source citations

---

### **Code Changes**

**Minimal!** Just change the import:

```typescript
// That's literally it:
- import { AISearchDialog } from './components/AISearchDialog';
+ import { AISearchDialogV2 } from './components/AISearchDialogV2';

// Or use alias for drop-in replacement:
import { AISearchDialogV2 as AISearchDialog } from './components/AISearchDialogV2';
```

---

## 🧪 Testing Checklist

### **Before Switching**

- [ ] Review V2 in isolated environment
- [ ] Test all features (search, AI, voice)
- [ ] Test keyboard shortcuts
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS, Android)
- [ ] Performance test (Lighthouse)
- [ ] Accessibility audit (aXe, WAVE)

### **During Switch**

- [ ] Deploy to staging first
- [ ] Smoke test all features
- [ ] Enable for internal users
- [ ] Collect feedback
- [ ] Monitor error rates
- [ ] Track performance metrics

### **After Switch**

- [ ] Monitor user engagement
- [ ] Track satisfaction scores
- [ ] Review analytics
- [ ] Iterate based on feedback
- [ ] Document issues/improvements

---

## 🚀 Rollout Strategies

### **Strategy 1: Instant Switch** (Aggressive)

```
Day 1: Deploy V2 to 100% of users
Day 2-7: Monitor closely, fix issues
Day 8+: Iterate based on feedback
```

**Pros**: 
- Fastest rollout
- Immediate benefits
- Single codebase

**Cons**:
- Higher risk
- Potential user confusion
- Harder to rollback

**Use when**: 
- High confidence in V2
- Small user base
- Development environment

---

### **Strategy 2: Gradual Rollout** (Recommended)

```
Week 1: Deploy to 10% (beta users)
Week 2: Increase to 25%
Week 3: Increase to 50%
Week 4: Increase to 75%
Week 5: Deploy to 100%
```

**Pros**:
- Lower risk
- Time to gather feedback
- Easy rollback

**Cons**:
- Slower rollout
- Maintain two versions
- More complex deployment

**Use when**:
- Large user base
- Enterprise customers
- Production environment

---

### **Strategy 3: Opt-In Beta** (Safest)

```
Week 1-2: Invite beta users to opt-in
Week 3-4: Open beta to all users
Week 5-6: Make V2 default (with opt-out)
Week 7+: Remove V1
```

**Pros**:
- Lowest risk
- User choice
- Valuable feedback

**Cons**:
- Slowest rollout
- Complexity of managing two versions
- Delayed full benefits

**Use when**:
- Risk-averse organization
- Complex enterprise deployment
- Want user buy-in

---

## 📝 Communication Template

### **For Internal Team**

```
Subject: New Search Interface - V2 Rollout

Team,

We're upgrading our documentation search with a new intelligent interface.

**What's Changing**:
- Unified search (no more tabs)
- Smarter intent detection
- Contextual suggestions
- Modern glass design

**Timeline**:
- Today: Beta testing begins (10% of users)
- Next week: Expand to 25%
- Week 3: 50%
- Week 4: 100%

**Action Required**:
- Test the new interface
- Report any issues
- Share feedback

**Resources**:
- Demo video: [link]
- Documentation: /docs/V1-VS-V2-COMPARISON.md
- Feedback form: [link]

Questions? Reply to this email.
```

---

### **For End Users**

```
🎉 Introducing: Smarter Documentation Search

We've redesigned our search to make finding answers faster and easier.

**What's New**:
✨ One intelligent search bar (no more tabs!)
🎯 Contextual suggestions based on what you're viewing
🔥 Trending topics
🎤 Enhanced voice search
📱 Better mobile experience

**How to Use**:
Just press ⌘K (or Ctrl+K) like before, then start typing!

The new search automatically detects what you're looking for:
- Questions → AI answers
- Keywords → Documentation
- Errors → Troubleshooting

**Feedback**:
Try it out and let us know what you think! 
👍👎 buttons are built right in.

Happy searching!
```

---

## 🔧 Troubleshooting

### **Issue: V2 not loading**

**Solution**:
```typescript
// Check import path
import { AISearchDialogV2 } from './components/AISearchDialogV2';

// Verify file exists
ls components/AISearchDialogV2.tsx

// Check for TypeScript errors
npm run type-check
```

---

### **Issue: Props not working**

**Solution**:
```typescript
// V2 accepts all V1 props
<AISearchDialogV2
  open={isOpen}              // ✅ Works
  onOpenChange={setIsOpen}   // ✅ Works
  currentModule="discovery"  // ✅ Works
  version="6.1"              // ✅ New in V2
/>
```

---

### **Issue: Styling looks wrong**

**Solution**:
```bash
# Ensure Tailwind is processing the new file
# Update tailwind.config.js if needed:
content: [
  './components/**/*.{ts,tsx}',
  './components/AISearchDialogV2.tsx', // Add explicitly if needed
]

# Rebuild
npm run build
```

---

### **Issue: Performance degradation**

**Solution**:
```typescript
// Check bundle size
npm run build
npm run analyze

// If too large, code split:
const AISearchDialogV2 = lazy(() => 
  import('./components/AISearchDialogV2').then(m => ({
    default: m.AISearchDialogV2
  }))
);
```

---

## 📊 Success Metrics

### **Track These Metrics**

```typescript
// Before switch (V1 baseline)
const v1Metrics = {
  searchUsage: 100,
  aiUsage: 40,
  avgSearchTime: 9,
  successRate: 85,
  satisfaction: 4.2,
};

// After switch (V2 target)
const v2Target = {
  searchUsage: 120,      // +20%
  aiUsage: 60,           // +50%
  avgSearchTime: 6,      // -33%
  successRate: 95,       // +12%
  satisfaction: 4.6,     // +10%
};

// Track with analytics
analyticsService.trackMetric('search_version', 'v2');
analyticsService.trackMetric('task_completion_time', searchTime);
analyticsService.trackMetric('user_satisfaction', rating);
```

---

## ✅ Pre-Launch Checklist

- [ ] **Code Review**: V2 implementation reviewed by team
- [ ] **Testing**: All features tested (desktop, mobile, accessibility)
- [ ] **Performance**: Lighthouse score > 90
- [ ] **Security**: No vulnerabilities detected
- [ ] **Analytics**: Tracking implemented
- [ ] **Documentation**: User guide updated
- [ ] **Communication**: Team and users notified
- [ ] **Rollback Plan**: Ready if needed
- [ ] **Monitoring**: Dashboards configured
- [ ] **Support**: Team trained on new features

---

## 🎉 Ready to Switch!

**You now have everything you need:**

1. ✅ V2 component (`/components/AISearchDialogV2.tsx`)
2. ✅ Integration options (instant, feature flag, A/B test)
3. ✅ Testing checklist
4. ✅ Rollout strategies
5. ✅ Communication templates
6. ✅ Troubleshooting guide
7. ✅ Success metrics

**Next Step**: Choose your rollout strategy and execute!

**Recommended**: Start with **Strategy 2 (Gradual Rollout)** for production.

---

**Quick Start**:
```bash
# 1. Enable V2
echo "NEXT_PUBLIC_USE_V2_SEARCH=true" >> .env.local

# 2. Test
npm run dev

# 3. Deploy to staging
npm run build
npm run deploy:staging

# 4. Monitor & iterate
# (Check analytics dashboard)

# 5. Rollout to production
# (Gradual increase: 10% → 25% → 50% → 100%)
```

---

**Need Help?**
- 📖 Full comparison: `/docs/V1-VS-V2-COMPARISON.md`
- 🎨 Design evaluation: `/docs/UI-REDESIGN-EVALUATION.md`
- 🔧 Implementation: `/components/AISearchDialogV2.tsx`

**Good luck with the switch!** 🚀
