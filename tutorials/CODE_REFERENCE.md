# Code Reference - Content Loading System

## 📁 Complete Code Structure

### 1. Static MDX Imports (`/lib/imports/adminMDXImports.ts`)

```typescript
/**
 * Admin Module - Static MDX Imports
 * All Admin module MDX files imported as raw text for direct serving.
 */

// VERSION 6.1 - ADMIN MODULE
import overview61 from '../../content/6_1/admin_6_1/overview_6_1.mdx?raw';
import aboutOrgDetails61 from '../../content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx?raw';
import costCenter61 from '../../content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx?raw';
import departments61 from '../../content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx?raw';
import departmentsMembers61 from '../../content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx?raw';
import designations61 from '../../content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx?raw';
import holidays61 from '../../content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx?raw';
import locations61 from '../../content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx?raw';
import operationalHours61 from '../../content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx?raw';
import organizationalDetails61 from '../../content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx?raw';

// VERSION 5.13
import overview513 from '../../content/5_13/admin_5_13/overview_5_13.mdx?raw';

// VERSION 6.1.1
import overview611 from '../../content/6_1_1/admin_6_1_1/overview_6_1_1.mdx?raw';

// VERSION NextGen
import overviewNG from '../../content/NG/admin_ng/overview_ng.mdx?raw';

/**
 * Admin MDX Content Map
 * Maps file paths to actual MDX content
 */
export const adminMDXContent: Record<string, string> = {
  // Version 6.1
  '/content/6_1/admin_6_1/overview_6_1.mdx': overview61,
  '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx': aboutOrgDetails61,
  '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx': costCenter61,
  '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx': departments61,
  '/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx': departmentsMembers61,
  '/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx': designations61,
  '/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx': holidays61,
  '/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx': locations61,
  '/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx': operationalHours61,
  '/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx': organizationalDetails61,
  
  // Version 5.13
  '/content/5_13/admin_5_13/overview_5_13.mdx': overview513,
  
  // Version 6.1.1
  '/content/6_1_1/admin_6_1_1/overview_6_1_1.mdx': overview611,
  
  // Version NextGen
  '/content/NG/admin_ng/overview_ng.mdx': overviewNG,
};

console.log(`✅ [Admin MDX Imports] Loaded ${Object.keys(adminMDXContent).length} files`);

export function hasAdminMDX(path: string): boolean {
  return path in adminMDXContent;
}

export function getAdminMDX(path: string): string | null {
  return adminMDXContent[path] || null;
}
```

### 2. Content Loader (`/content/contentLoader.ts`) - KEY SECTIONS

```typescript
/**
 * Content Loader - FIXED STRATEGY ORDER
 * Priority: Actual MDX Files → MDX Bundle → Fetch → Registry (fallback only)
 */

// Import static MDX content (actual files)
import { adminMDXContent } from '../lib/imports/adminMDXImports';
// Add other modules:
// import { discoveryMDXContent } from '../lib/imports/discoveryMDXImports';

// Combine all static MDX content maps
const allStaticMDXContent: Record<string, string> = {
  ...adminMDXContent,
  // ...discoveryMDXContent, (when ready)
};

console.log(`📦 [Content Loader] Initialized with ${Object.keys(allStaticMDXContent).length} static MDX files`);

/**
 * Gets static MDX content from imported files
 */
function getStaticMDXContent(path: string): string | null {
  // Try exact match first
  if (allStaticMDXContent[path]) {
    return allStaticMDXContent[path];
  }
  
  // Try with/without leading slash
  const altPath = path.startsWith('/') ? path.slice(1) : `/${path}`;
  if (allStaticMDXContent[altPath]) {
    return allStaticMDXContent[altPath];
  }
  
  return null;
}

/**
 * Fetches content from a file path
 * CORRECT STRATEGY ORDER
 */
async function fetchContent(filePath: string): Promise<string> {
  let cleanPath = filePath;
  // ... path cleaning logic
  
  // ⭐ Strategy 1: Static MDX imports (ACTUAL CONTENT - HIGHEST PRIORITY)
  const staticContent = getStaticMDXContent(cleanPath);
  if (staticContent) {
    console.log(`✅ Strategy 1 (STATIC MDX): Loaded actual content (${staticContent.length} chars)`);
    return staticContent;
  }
  
  // Strategy 2: Try the MDX content bundle
  try {
    const content = await getMDXContent(cleanPath);
    if (content) {
      console.log(`✅ Strategy 2 (MDX Bundle): Loaded from bundle (${content.length} chars)`);
      return content;
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 2 (MDX bundle) failed:`, error);
  }
  
  // Strategy 3: Try reading via fetch
  try {
    const response = await fetch(cleanPath);
    if (response.ok) {
      const text = await response.text();
      console.log(`✅ Strategy 3 (Fetch): Loaded via fetch (${text.length} chars)`);
      return text;
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 3 (Fetch) failed:`, error);
  }
  
  // ⚠️ Strategy 4: Registry (FALLBACK ONLY - placeholder content)
  if (isContentRegistered(cleanPath)) {
    const content = getRegisteredContent(cleanPath);
    if (content) {
      console.warn(`⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder for ${cleanPath}`);
      console.warn(`💡 Consider adding this file to static imports for actual content`);
      return content;
    }
  }
  
  // All strategies failed
  throw new Error(`Content not found: ${cleanPath}`);
}
```

### 3. Console Output Examples

#### ✅ When Static Content Loads (Good)
```
📦 [Content Loader] Initialized with 13 static MDX files
🔍 getContent called with: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
📥 Fetching content from: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
✅ Strategy 1 (STATIC MDX): Loaded actual content (2134 chars)
```

#### ⚠️ When Placeholder Loads (Needs Static Import)
```
📦 [Content Loader] Initialized with 13 static MDX files
🔍 getContent called with: /content/6_1/discovery_6_1/overview_6_1.mdx
📥 Fetching content from: /content/6_1/discovery_6_1/overview_6_1.mdx
⚠️ Strategy 1 (STATIC MDX): No static import found
⚠️ Strategy 2 (MDX bundle) failed: Module not found
⚠️ Strategy 3 (Fetch) failed: 404
⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder for /content/6_1/discovery_6_1/overview_6_1.mdx
💡 Consider adding this file to static imports for actual content
```

## 🔄 Adding New Module - Complete Example

### Step 1: Create Import File

**File**: `/lib/imports/discoveryMDXImports.ts`

```typescript
/**
 * Discovery Module - Static MDX Imports
 */

// Import Discovery MDX files as raw text
import overview61 from '../../content/6_1/discovery_6_1/overview_6_1.mdx?raw';
import accessDiscovery61 from '../../content/6_1/discovery_6_1/access_discovery_6_1.mdx?raw';
import agent61 from '../../content/6_1/discovery_6_1/agent_6_1.mdx?raw';
// ... more imports

export const discoveryMDXContent: Record<string, string> = {
  '/content/6_1/discovery_6_1/overview_6_1.mdx': overview61,
  '/content/6_1/discovery_6_1/access_discovery_6_1.mdx': accessDiscovery61,
  '/content/6_1/discovery_6_1/agent_6_1.mdx': agent61,
  // ... more mappings
};

console.log(`✅ [Discovery MDX Imports] Loaded ${Object.keys(discoveryMDXContent).length} files`);
```

### Step 2: Update Content Loader

**File**: `/content/contentLoader.ts`

```typescript
// Add import at top
import { adminMDXContent } from '../lib/imports/adminMDXImports';
import { discoveryMDXContent } from '../lib/imports/discoveryMDXImports'; // ADD THIS

// Update the combined map
const allStaticMDXContent: Record<string, string> = {
  ...adminMDXContent,
  ...discoveryMDXContent, // ADD THIS
};
```

### Step 3: Test

1. Navigate to Discovery pages
2. Check console for "Strategy 1 (STATIC MDX)" messages
3. Verify actual content displays

## 🎯 Path Matching Rules

### ✅ CORRECT Paths

```typescript
// Exact match with TOC
'/content/6_1/admin_6_1/overview_6_1.mdx': overview61

// Multiple versions of same file
'/content/6_1/admin_6_1/overview_6_1.mdx': overview61,
'/content/5_13/admin_5_13/overview_5_13.mdx': overview513,
'/content/6_1_1/admin_6_1_1/overview_6_1_1.mdx': overview611,
'/content/NG/admin_ng/overview_ng.mdx': overviewNG
```

### ❌ WRONG Paths

```typescript
// Missing /content/ prefix
'6_1/admin_6_1/overview_6_1.mdx': overview61 // ❌

// Wrong folder structure
'/content/admin/overview_6_1.mdx': overview61 // ❌

// Missing version suffix
'/content/6_1/admin_6_1/overview.mdx': overview61 // ❌
```

## 📊 Strategy Decision Flow

```
┌─────────────────────────────────┐
│  getContent(filePath) called    │
└────────────┬────────────────────┘
             │
             v
┌────────────────────────────────────┐
│ Strategy 1: Check allStaticMDXContent │
│ - adminMDXContent                  │
│ - discoveryMDXContent (when added) │
└────────┬───────────────────────────┘
         │
    ┌────┴────┐
    │  Found? │
    └────┬────┘
         │
    YES  │  NO
    ─────┼─────→ Strategy 2: MDX Bundle
         │              │
         v              │ NO
    [Return]       ─────┼─────→ Strategy 3: Fetch
                        │              │
                        │              │ NO
                        │         ─────┼─────→ Strategy 4: Registry (Placeholder)
                        │              │              │
                        │              │              │
                        │              v              v
                        │         [Return]      [Return with warning]
                        │
                        v
                   [Return]
```

## 🧪 Testing Checklist

- [ ] Admin > Overview shows actual content (all 4 versions)
- [ ] Admin > Organizational Details > Cost Center shows actual content
- [ ] Console shows "Strategy 1 (STATIC MDX)" for Admin files
- [ ] Console shows "Strategy 4 (REGISTRY PLACEHOLDER)" for non-Admin files
- [ ] Content length is >1000 chars for actual files
- [ ] Content length is ~300-500 chars for placeholder files
- [ ] No import errors in console
- [ ] No 404 errors for static imports

## 📝 Quick Reference

### Import Pattern
```typescript
import fileName from '../../content/VERSION/module/file.mdx?raw';
```

### Map Pattern
```typescript
'/content/VERSION/module/file.mdx': fileName
```

### Register Pattern
```typescript
const allStaticMDXContent = {
  ...module1MDXContent,
  ...module2MDXContent,
};
```

## 🎓 Key Takeaways

1. **Static imports = Actual content** (Strategy 1)
2. **Registry = Placeholder fallback** (Strategy 4)
3. **Path mapping must match TOC exactly**
4. **Console logs show which strategy loaded content**
5. **Easy to add more modules incrementally**

---

**Last Updated**: 2024
**Files**: 13 Admin MDX files loaded
**Status**: ✅ Working and tested
