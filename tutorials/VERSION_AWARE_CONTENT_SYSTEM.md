# Version-Aware Content Loading System

## Overview

The Virima documentation site now uses a **version-aware content loading system** that provides complete version isolation and clean path management for all MDX files across multiple versions (5.13, 6.1, 6.1.1, and NextGen).

## Architecture

### 1. Version-Keyed Registry Structure

**File**: `/lib/imports/adminMDXImports.ts` (and similar for other modules)

```typescript
export const adminMDXFilePaths: Record<string, Record<string, string>> = {
  '6_1': {
    'admin/organizational-details/cost-center': '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx',
    'admin/discovery/probes': '/content/6_1/admin_6_1/admin_discovery/probes_6_1.mdx',
    // ... more paths
  },
  '6_1_1': {
    'admin/organizational-details/cost-center': '/content/6_1_1/admin_6_1_1/admin_org_details/cost_center_6_1_1.mdx',
    // ... version 6.1.1 paths
  },
  'NG': {
    'admin/organizational-details/cost-center': '/content/NG/admin_ng/admin_org_details/cost_center_ng.mdx',
    // ... NextGen paths
  },
};
```

**Key Benefits:**
- ✅ Complete version isolation
- ✅ Clean URL slugs (no version suffix in URLs)
- ✅ Easy to maintain (one file per module)
- ✅ Type-safe structure

### 2. Content Loader with Version Support

**File**: `/content/contentLoader.ts`

```typescript
let currentVersion = '6_1'; // Default version

export function setVersion(version: string): void {
  currentVersion = version;
  clearContentCache(); // Clear cache on version switch
}

export function getCurrentVersion(): string {
  return currentVersion;
}
```

**Loading Strategy** (in priority order):

1. **Priority Fetch (Highest Priority)** ⭐
   - Checks version-aware registry
   - Uses fetch to load actual MDX content
   - Works reliably in Figma Make environment

2. **MDX Bundle** (Fallback #1)
   - Compiled content from bundle

3. **Direct Fetch** (Fallback #2)
   - Attempts to fetch file directly

4. **Registry Placeholder** (Fallback #3)
   - Uses registered placeholder content
   - Should be avoided for production

### 3. UI Integration

**File**: `/App.tsx`

```typescript
// Version mapping
const versionMap: Record<string, string> = {
  'NextGen': 'NG',
  '6.1.1': '6_1_1',
  '6.1': '6_1',
  '5.13': '5_13',
};

// Handle version changes
const handleVersionChange = (newVersion: string) => {
  setSelectedVersion(newVersion);
  const internalVersion = versionMap[newVersion];
  setVersion(internalVersion); // Update content loader
};
```

## How It Works

### User Flow

```
User selects "Version 6.1" → clicks "Cost Center"
         ↓
handleVersionChange('6.1')
         ↓
setVersion('6_1')
         ↓
Content requested with slug: 'admin/organizational-details/cost-center'
         ↓
getPriorityFilePath('admin/organizational-details/cost-center')
         ↓
Looks up: adminMDXFilePaths['6_1']['admin/organizational-details/cost-center']
         ↓
Returns: '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'
         ↓
fetch('/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx')
         ↓
Renders actual MDX content ✅
```

### Version Isolation

Each version has its own independent path registry:

- Topics added to **6.1.1** only appear in the `6_1_1` registry
- Topics in **6.1** are isolated to the `6_1` registry
- No cross-version contamination
- Complete version independence

## File Structure

```
/lib/imports/
  ├── adminMDXImports.ts          ← Version-keyed Admin paths
  ├── discoveryMDXImports.ts      ← Version-keyed Discovery paths (future)
  ├── cmdbMDXImports.ts           ← Version-keyed CMDB paths (future)
  └── ...

/content/
  ├── 5_13/                       ← Version 5.13 MDX files
  ├── 6_1/                        ← Version 6.1 MDX files
  ├── 6_1_1/                      ← Version 6.1.1 MDX files
  ├── NG/                         ← NextGen MDX files
  └── contentLoader.ts            ← Version-aware loader
```

## Adding New Content

### 1. Add a New File to Existing Version

**Example**: Add "Departments" to Version 6.1

1. Create the MDX file:
   ```
   /content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx
   ```

2. Register in `/lib/imports/adminMDXImports.ts`:
   ```typescript
   '6_1': {
     // ... existing paths
     'admin/organizational-details/departments': '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx',
   }
   ```

3. Done! The file is now accessible when version 6.1 is selected.

### 2. Add Content to New Version Only

**Example**: Add "New Feature" to Version 6.1.1 only

1. Create the MDX file:
   ```
   /content/6_1_1/admin_6_1_1/admin_org_details/new_feature_6_1_1.mdx
   ```

2. Register ONLY in 6.1.1 registry:
   ```typescript
   '6_1_1': {
     // ... existing paths
     'admin/organizational-details/new-feature': '/content/6_1_1/admin_6_1_1/admin_org_details/new_feature_6_1_1.mdx',
   }
   ```

3. This topic will **only** appear when version 6.1.1 is selected!

### 3. Add a New Module

**Example**: Add Discovery module registry

1. Create `/lib/imports/discoveryMDXImports.ts`:
   ```typescript
   export const discoveryMDXFilePaths: Record<string, Record<string, string>> = {
     '6_1': {
       'discovery/scan-configuration': '/content/6_1/discovery_6_1/scan_configuration_6_1.mdx',
       // ... more paths
     },
   };
   
   export function getDiscoveryFilePath(slug: string, version: string): string | null {
     const versionPaths = discoveryMDXFilePaths[version];
     return versionPaths?.[slug] || null;
   }
   ```

2. Import in `/content/contentLoader.ts`:
   ```typescript
   import { discoveryMDXFilePaths, getDiscoveryFilePath } from '../lib/imports/discoveryMDXImports';
   
   // In getPriorityFilePath():
   const discoveryPath = getDiscoveryFilePath(cleanSlug, currentVersion);
   if (discoveryPath) return discoveryPath;
   ```

## Current Status

### ✅ Completed
- Version-keyed registry structure for Admin module
- Version-aware content loader with `setVersion()`
- UI integration with version switcher
- Fetch-based loading (works in Figma Make)
- Complete version isolation

### 📊 Registered Files
- **Admin Module**: 45 files across 4 versions
  - Version 6.1: 40+ files
  - Version NG: 3 files
  - Version 6.1.1: 1 file
  - Version 5.13: 1 file

### 🔄 Next Steps
1. Expand Admin registry to include all 822 files
2. Create registries for other modules:
   - Discovery
   - CMDB
   - ITAM
   - ITSM
3. Populate version-specific paths for 6.1.1 and 5.13

## Best Practices

### DO ✅
- Use clean slugs without version suffixes: `'admin/cost-center'`
- Keep version isolation strict (no shared paths)
- Use fetch-based loading for actual content
- Clear cache when switching versions
- Log version changes for debugging

### DON'T ❌
- Mix version paths in registry
- Use `?raw` imports (doesn't work in Figma Make)
- Include version in URL slug
- Share paths between versions
- Forget to register new files

## Debugging

### Check Current Version
```javascript
// In browser console
import { getCurrentVersion } from './content/contentLoader';
console.log(getCurrentVersion()); // '6_1'
```

### View Registry
```javascript
// In browser console
import { adminMDXFilePaths } from './lib/imports/adminMDXImports';
console.log(adminMDXFilePaths['6_1']); // View all 6.1 paths
```

### Force Version Switch
```javascript
// In browser console
import { setVersion } from './content/contentLoader';
setVersion('NG'); // Switch to NextGen
```

## Console Output Example

When loading content, you'll see:

```
🚀 [App] Initialized content loader with version: 6_1
📦 [Content Loader] Initialized with version: 6_1
✅ [Admin Version Registry] Registered 45 files across 4 versions

🔍 [Strategy 1] Checking version-aware priority registry...
📊 [Strategy 1] Current version: 6_1
🎯 [Strategy 1] Looking for slug: "admin/organizational-details/cost-center"
✅ [Strategy 1] Found in priority registry! Path: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
✅ Strategy 1 (PRIORITY FETCH): SUCCESS! Loaded actual content (2847 chars)
```

## Summary

This system provides:
- ✅ **Version Isolation**: Topics in 6.1.1 don't appear in 6.1
- ✅ **Clean Architecture**: One registry per module, version-keyed
- ✅ **Fetch-Based Loading**: Works reliably in Figma Make
- ✅ **Type Safety**: TypeScript ensures correctness
- ✅ **Easy Maintenance**: Simple to add new files or versions
- ✅ **No Symlinks Needed**: Files already accessible at `/content/`

The locked green resize indicator values (2px width, 0.4 opacity) are preserved and untouched. ✅
