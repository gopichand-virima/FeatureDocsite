# Version-Aware Content System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│  │ Version: 6.1 │   │  Module      │   │   Section    │              │
│  │   Selector   │   │  Admin       │   │  Org Details │              │
│  └──────┬───────┘   └──────────────┘   └──────────────┘              │
│         │                                                              │
└─────────┼──────────────────────────────────────────────────────────────┘
          │
          │ handleVersionChange('6.1')
          ├──────────────────────────────────┐
          │                                  │
          ▼                                  ▼
┌────────────────────┐           ┌─────────────────────┐
│   setVersion()     │           │  UI State Update    │
│                    │           │  selectedVersion    │
│  Maps: '6.1' → '6_1'│          └─────────────────────┘
│  Clears cache      │
└────────┬───────────┘
         │
         │ currentVersion = '6_1'
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CONTENT LOADER LAYER                              │
│                     /content/contentLoader.ts                           │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Content Request: slug = 'admin/organizational-details/cost-center'│ │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                        │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Strategy 1: Priority Fetch (Version-Aware) ⭐                     │  │
│  │                                                                  │  │
│  │  getPriorityFilePath(slug, currentVersion)                       │  │
│  │  ├─ Try Admin Registry                                           │  │
│  │  ├─ Try Discovery Registry                                       │  │
│  │  ├─ Try CMDB Registry                                            │  │
│  │  └─ Return: file path or null                                    │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                        │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Strategy 2: MDX Bundle (Fallback)                                │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                        │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Strategy 3: Direct Fetch (Fallback)                              │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                        │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Strategy 4: Registry Placeholder (Last Resort)                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Queries registry for current version
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       VERSION REGISTRY LAYER                            │
│                   /lib/imports/adminMDXImports.ts                       │
│                                                                         │
│  adminMDXFilePaths = {                                                  │
│    '6_1': {                                                             │
│      'admin/organizational-details/cost-center':                        │
│        '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'  │
│    },                                                                   │
│    '6_1_1': {                                                           │
│      'admin/organizational-details/cost-center':                        │
│        '/content/6_1_1/admin_6_1_1/.../cost_center_6_1_1.mdx'          │
│    },                                                                   │
│    'NG': {                                                              │
│      'admin/organizational-details/cost-center':                        │
│        '/content/NG/admin_ng/.../cost_center_ng.mdx'                   │
│    }                                                                    │
│  }                                                                      │
│                                                                         │
│  getAdminFilePath(slug, version) → filePath                            │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         │ Returns file path
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       FILE SYSTEM LAYER                                 │
│                        /content/ directory                              │
│                                                                         │
│  /content/                                                              │
│    ├── 5_13/                      ← Version 5.13 MDX files             │
│    │   └── admin_5_13/                                                 │
│    │       └── ...                                                      │
│    │                                                                    │
│    ├── 6_1/                       ← Version 6.1 MDX files              │
│    │   └── admin_6_1/                                                  │
│    │       ├── admin_org_details/                                      │
│    │       │   └── cost_center_6_1.mdx  ⭐ ACTUAL CONTENT              │
│    │       ├── admin_discovery/                                        │
│    │       └── ...                                                      │
│    │                                                                    │
│    ├── 6_1_1/                     ← Version 6.1.1 MDX files            │
│    │   └── admin_6_1_1/                                                │
│    │       └── ...                                                      │
│    │                                                                    │
│    └── NG/                        ← NextGen MDX files                  │
│        └── admin_ng/                                                   │
│            └── ...                                                      │
│                                                                         │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         │ fetch() retrieves file
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           RENDERING LAYER                               │
│                                                                         │
│  MDX Content → Parse → React Components → Render to Screen             │
│                                                                         │
│  User sees:                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ # Cost Center                                                     │ │
│  │                                                                   │ │
│  │ Use this function to define the cost centers.                    │ │
│  │                                                                   │ │
│  │ In the main window, click Admin > Organizational Details >...    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Example

### Scenario: User switches to Version 6.1 and clicks "Cost Center"

```
Step 1: Version Selection
┌─────────────────────────────────────────┐
│ User clicks: [Version: 6.1 ▼]          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ handleVersionChange('6.1')              │
│ → setVersion('6_1')                     │
│ → currentVersion = '6_1'                │
│ → clearContentCache()                   │
└─────────────────────────────────────────┘

Step 2: Content Navigation
┌─────────────────────────────────────────┐
│ User clicks: Cost Center                │
│ slug = 'admin/organizational-details/   │
│         cost-center'                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ getContent(slug)                        │
│ → fetchContent(slug)                    │
│ → getPriorityFilePath(slug)             │
└─────────────────────────────────────────┘

Step 3: Registry Lookup
┌─────────────────────────────────────────┐
│ getAdminFilePath(                       │
│   'admin/organizational-details/        │
│    cost-center',                        │
│   '6_1'                                 │
│ )                                       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ adminMDXFilePaths['6_1']                │
│   ['admin/organizational-details/       │
│    cost-center']                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Returns:                                │
│ '/content/6_1/admin_6_1/                │
│  admin_org_details/cost_center_6_1.mdx' │
└─────────────────────────────────────────┘

Step 4: File Fetch
┌─────────────────────────────────────────┐
│ fetch('/content/6_1/admin_6_1/          │
│       admin_org_details/                │
│       cost_center_6_1.mdx')             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Response: MDX content (2847 chars)      │
│ # Cost Center                           │
│ Use this function to...                 │
└─────────────────────────────────────────┘

Step 5: Render
┌─────────────────────────────────────────┐
│ MDXContent renders to screen            │
│ User sees formatted documentation       │
└─────────────────────────────────────────┘
```

---

## Version Isolation Visualization

```
┌──────────────────────────────────────────────────────────────────┐
│                    VERSION REGISTRIES                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Version 6.1 Registry                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 'admin/cost-center' → /content/6_1/.../cost_center_6_1.mdx│  │
│  │ 'admin/departments' → /content/6_1/.../departments_6_1.mdx│  │
│  │ 'admin/locations'   → /content/6_1/.../locations_6_1.mdx  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                 ↕ ISOLATED                        │
│  Version 6.1.1 Registry                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 'admin/cost-center'   → /content/6_1_1/.../cost_center... │  │
│  │ 'admin/departments'   → /content/6_1_1/.../departments... │  │
│  │ 'admin/new-feature'   → /content/6_1_1/.../new_feature... │  │
│  │                           ↑ Only in 6.1.1!                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                 ↕ ISOLATED                        │
│  NextGen Registry                                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 'admin/cost-center'    → /content/NG/.../cost_center_ng..│  │
│  │ 'admin/modern-feature' → /content/NG/.../modern_feature..│  │
│  │                           ↑ Only in NextGen!              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

Result: When user switches versions, they see ONLY the content
        registered for that specific version. Complete isolation! ✅
```

---

## Module Integration Pattern

```
┌────────────────────────────────────────────────────────────────┐
│              getPriorityFilePath(slug, version)                │
│                                                                 │
│  Try each module registry in order:                            │
│                                                                 │
│  1. Admin Module                                               │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ getAdminFilePath(slug, version)                      │   │
│     │ → Check adminMDXFilePaths[version][slug]            │   │
│     │ → Return path if found                               │   │
│     └──────────────────────────────────────────────────────┘   │
│                         ↓ (if not found)                       │
│                                                                 │
│  2. Discovery Module                                           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ getDiscoveryFilePath(slug, version)                  │   │
│     │ → Check discoveryMDXFilePaths[version][slug]        │   │
│     │ → Return path if found                               │   │
│     └──────────────────────────────────────────────────────┘   │
│                         ↓ (if not found)                       │
│                                                                 │
│  3. CMDB Module                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ getCMDBFilePath(slug, version)                       │   │
│     │ → Check cmdbMDXFilePaths[version][slug]             │   │
│     │ → Return path if found                               │   │
│     └──────────────────────────────────────────────────────┘   │
│                         ↓ (if not found)                       │
│                                                                 │
│  4. Continue for all modules...                                │
│                                                                 │
│  Return: file path or null                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## Cache Management

```
┌────────────────────────────────────────────────────────────────┐
│                       CONTENT CACHE                             │
│                                                                 │
│  Map<string, string>                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ '/content/6_1/.../cost_center_6_1.mdx' → '# Cost Center' │  │
│  │ '/content/6_1/.../departments_6_1.mdx' → '# Departments' │  │
│  │ '/content/6_1/.../locations_6_1.mdx'   → '# Locations'   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  When version changes:                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ setVersion('NG')                                         │  │
│  │ → clearContentCache()                                    │  │
│  │ → Cache is empty                                         │  │
│  │ → Next requests fetch fresh content for NG version      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Performance Characteristics

```
┌────────────────────────────────────────────────────────────────┐
│                   LOADING PERFORMANCE                           │
│                                                                 │
│  First Load (Cold Cache)                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Registry Lookup:    ~1ms   (in-memory)                   │  │
│  │ Fetch Request:      ~50ms  (network)                     │  │
│  │ MDX Parse:          ~10ms  (parsing)                     │  │
│  │ Total:              ~61ms                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Subsequent Loads (Warm Cache)                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Cache Lookup:       <1ms   (in-memory)                   │  │
│  │ MDX Parse:          ~10ms  (parsing)                     │  │
│  │ Total:              ~10ms  (6x faster!)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Version Switch                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Clear Cache:        <1ms                                 │  │
│  │ Registry Update:    <1ms                                 │  │
│  │ Next Load:          ~61ms  (cold cache again)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                              │
│                                                                 │
│  Scenario 1: File not in registry for current version         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ getPriorityFilePath() → null                             │  │
│  │ ↓ Fall back to Strategy 2 (MDX Bundle)                  │  │
│  │ ↓ Fall back to Strategy 3 (Direct Fetch)                │  │
│  │ ↓ Fall back to Strategy 4 (Registry Placeholder)        │  │
│  │ ↓ All fail → Show "Content Not Available"               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Scenario 2: File in registry but 404 on fetch                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ fetch() → 404 Not Found                                  │  │
│  │ ↓ Log error to console                                   │  │
│  │ ↓ Fall back to Strategy 2, 3, 4...                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Scenario 3: Invalid version                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ setVersion('invalid') → Log error                        │  │
│  │ → Keep current version (don't switch)                    │  │
│  │ → Show warning in console                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

This architecture ensures robust content delivery with complete version isolation!
