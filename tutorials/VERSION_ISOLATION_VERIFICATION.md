# Version Isolation - Complete Verification

## ✅ Status: All Versions Are Completely Isolated

Each documentation version (5.13, 6.1, 6.1.1, NG) operates as a **standalone system** with zero cross-version dependencies.

---

## Isolation Mechanisms

### 1. **Independent TOC Files** ✅

Each version has its own `index.mdx` file that serves as the **single source of truth**:

| Version | TOC File | All Paths Point To |
|---------|----------|-------------------|
| 5.13 | `src/content/5_13/index.mdx` | `/content/5_13/` |
| 6.1 | `src/content/6_1/index.mdx` | `/content/6_1/` |
| 6.1.1 | `src/content/6_1_1/index.mdx` | `/content/6_1_1/` |
| NG | `src/content/NG/index.mdx` | `/content/NG/` |

**Verification:**
```bash
# Check for cross-references (should return 0 for all)
Select-String -Path "src\content\6_1_1\index.mdx" -Pattern "/content/(6_1|5_13|NG)/"
Select-String -Path "src\content\6_1\index.mdx" -Pattern "/content/(6_1_1|5_13|NG)/"
Select-String -Path "src\content\5_13\index.mdx" -Pattern "/content/(6_1|6_1_1|NG)/"
Select-String -Path "src\content\NG\index.mdx" -Pattern "/content/(6_1|6_1_1|5_13)/"
```

**Result**: ✅ 0 cross-references found in all versions

---

### 2. **Version-Specific TOC Loading** ✅

**File**: `src/utils/tocLoader.ts`

```typescript
// Version-specific cache keys
const cacheKey = `${version}_v${CACHE_VERSION}`;

// Version-specific path mapping
const VERSION_PATH_MAP: Record<string, string> = {
  '5.13': '5_13',
  '6.1': '6_1',
  '6.1.1': '6_1_1',
  'NextGen': 'NG',
};

// Loads TOC for specific version only
export async function loadTocForVersion(version: string): Promise<TocStructure> {
  const versionPath = VERSION_PATH_MAP[version] || version;
  const content = await loadIndexContent(versionPath); // Loads from /content/{versionPath}/index.mdx
  // ...
}
```

**Isolation Guarantee:**
- Each version's TOC is cached separately
- TOC loading is scoped to the version's directory
- No shared state between versions

---

### 3. **Version-Aware Path Resolution** ✅

**File**: `src/utils/tocPathResolver.ts`

```typescript
export async function resolveMDXPathFromTOC({
  version,
  module,
  section,
  page,
}: PathResolverParams): Promise<string | null> {
  // Loads TOC for THIS version only
  const structure = await loadTocForVersion(version);
  
  // Resolves path from THIS version's TOC
  const filePath = resolveFilePath(structure, module, section, page);
  
  return filePath; // Path will be /content/{version}/...
}
```

**Isolation Guarantee:**
- Path resolution uses the version's own TOC
- No fallback to other versions
- Missing files return `null` (version-specific error)

---

### 4. **Version-Specific Content Loading** ✅

**File**: `src/content/contentLoader.ts`

```typescript
// Global version state (scoped to current session)
let currentVersion = '6_1';

export function setVersion(version: string): void {
  const validVersions = ['6_1', '6_1_1', '5_13', 'NG'];
  if (!validVersions.includes(version)) {
    console.error(`❌ Invalid version: ${version}`);
    return;
  }
  
  currentVersion = version;
  clearContentCache(); // Clear cache on version switch
}

export function getCurrentVersion(): string {
  return currentVersion;
}
```

**Isolation Guarantee:**
- Version is set per user session
- Cache is cleared when version changes
- Content loading uses current version only

---

### 5. **Version-Specific Error Handling** ✅

**File**: `src/components/ContentNotAvailable.tsx`

When a file is missing:
- Error is shown **only for the current version**
- Error message includes the file path (version-specific)
- No impact on other versions

**Example Scenario:**
```
User on Version 6.1 → Navigates to "Credentials" → File exists → ✅ Displays content
User on Version NG → Navigates to "Credentials" → File missing → ⚠️ Shows "Content Not Available" (only for NG)
```

**Result**: 6.1 continues to work normally. NG shows error. Zero cross-impact.

---

## Isolation Test Scenarios

### Scenario 1: Missing File in One Version

**Setup:**
- Version 6.1: `cost_center_6_1.mdx` exists ✅
- Version NG: `cost_center_ng.mdx` missing ❌

**Expected Behavior:**
- 6.1: Displays "Cost Center" content correctly
- NG: Shows "Content Not Available" error
- **No impact on 6.1**

**Verification:**
```typescript
// User on 6.1
setVersion('6_1');
const content = await getContent('/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx');
// ✅ Returns content

// User on NG
setVersion('NG');
const content = await getContent('/content/NG/admin_ng/admin_org_details/cost_center_ng.mdx');
// ❌ Returns null → Shows "Content Not Available"
```

---

### Scenario 2: Different TOC Structures

**Setup:**
- Version 6.1: Has "Discovery Scan" module with 18 sections
- Version 5.13: Has "Discovery Scan" module with 10 sections

**Expected Behavior:**
- Each version shows its own TOC structure
- Navigation reflects version-specific sections
- **No cross-contamination**

**Verification:**
```typescript
// Load 6.1 TOC
const toc61 = await loadTocForVersion('6.1');
const discovery61 = toc61.modules.find(m => m.id === 'discovery-scan');
// ✅ Returns 18 sections

// Load 5.13 TOC
const toc513 = await loadTocForVersion('5.13');
const discovery513 = toc513.modules.find(m => m.id === 'discovery-scan');
// ✅ Returns 10 sections (different structure)
```

---

### Scenario 3: Adding Content to One Version

**Setup:**
- Add new topic "New Feature" to Version 6.1 only
- Update `src/content/6_1/index.mdx` to include new topic

**Expected Behavior:**
- Version 6.1: New topic appears in navigation
- Other versions: No change (topic doesn't appear)
- **Zero impact on other versions**

**Verification:**
```typescript
// After adding to 6_1/index.mdx
const toc61 = await loadTocForVersion('6.1');
// ✅ New topic appears in TOC

const tocNG = await loadTocForVersion('NextGen');
// ✅ No new topic (unchanged)
```

---

### Scenario 4: Version Switch

**Setup:**
- User is viewing Version 6.1
- User switches to Version NG

**Expected Behavior:**
- Cache is cleared for 6.1
- NG TOC is loaded fresh
- NG content is loaded from NG paths
- **No residual data from 6.1**

**Verification:**
```typescript
// User on 6.1
setVersion('6_1');
const path61 = await resolveMDXPathFromTOC({ version: '6.1', module: 'admin', section: 'organizational-details', page: 'cost-center' });
// ✅ Returns: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx

// User switches to NG
setVersion('NG');
const pathNG = await resolveMDXPathFromTOC({ version: 'NextGen', module: 'admin', section: 'organizational-details', page: 'cost-center' });
// ✅ Returns: /content/NG/admin_ng/admin_org_details/cost_center_ng.mdx
// ✅ Cache cleared, fresh TOC loaded
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Selects Version                      │
│                    (5.13, 6.1, 6.1.1, NG)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              setVersion(version)                              │
│              - Sets currentVersion                           │
│              - Clears content cache                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         loadTocForVersion(version)                           │
│         - Loads /content/{version}/index.mdx                 │
│         - Caches with key: {version}_v{CACHE_VERSION}        │
│         - Returns version-specific TOC structure             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      resolveMDXPathFromTOC(version, module, section, page)   │
│      - Uses version's TOC only                               │
│      - Returns /content/{version}/... path                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              getContent(filePath)                             │
│              - Uses currentVersion                            │
│              - Loads from version-specific path               │
│              - Returns content or null (version-specific)     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         If content missing → ContentNotAvailable              │
│         - Error shown only for current version                │
│         - No impact on other versions                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Isolation Points

### ✅ TOC Isolation
- Each version loads its own `index.mdx`
- TOC cache is version-keyed
- No shared TOC state

### ✅ Path Resolution Isolation
- Paths resolved from version's own TOC
- No fallback to other versions
- Version-specific file paths

### ✅ Content Loading Isolation
- Content loaded from version-specific paths
- Cache cleared on version switch
- Version state is session-scoped

### ✅ Error Handling Isolation
- Errors are version-specific
- Missing files affect only current version
- No cross-version error propagation

---

## Verification Checklist

- [x] **TOC Files**: Each version has independent `index.mdx`
- [x] **Path References**: No cross-version path references
- [x] **TOC Loading**: Version-specific cache keys
- [x] **Path Resolution**: Uses version's own TOC
- [x] **Content Loading**: Version-specific paths
- [x] **Cache Management**: Cleared on version switch
- [x] **Error Handling**: Version-specific errors
- [x] **File Suffixes**: Version-specific (`_6_1`, `_6_1_1`, `_5_13`, `_ng`)

---

## Summary

✅ **Complete Version Isolation Achieved**

- Each version operates as a **standalone documentation site**
- Changes to one version have **zero impact** on others
- Missing files show errors **only for that version**
- TOC structures are **completely independent**
- Path resolution is **version-scoped**
- Content loading is **version-aware**

**The system treats each version as a separate entity sharing only the platform infrastructure, not the content or structure.**

