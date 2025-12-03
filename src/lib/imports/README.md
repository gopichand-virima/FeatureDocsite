# Static MDX Imports - Directory Guide

This directory contains static imports of actual MDX files organized by module.

## Purpose

Instead of using placeholders, we import actual MDX content at build time for:
- ✅ **Performance**: Content bundled at build time
- ✅ **Reliability**: No dynamic import failures
- ✅ **Type Safety**: TypeScript validation
- ✅ **Instant Loading**: No fetch delays

## Current Files

| File | Module | Files | Status |
|------|--------|-------|--------|
| `adminMDXImports.ts` | Admin (all versions) | 13 | ✅ Active |

## How to Add More Content

### Example: Adding Discovery Module

1. **Create the import file**: `/lib/imports/discoveryMDXImports.ts`

```typescript
/**
 * Discovery Module - Static MDX Imports
 */

// Import all Discovery MDX files
import discoveryOverview61 from '../../content/6_1/discovery_6_1/overview_6_1.mdx?raw';
import accessDiscovery61 from '../../content/6_1/discovery_6_1/access_discovery_6_1.mdx?raw';
// ... more imports

// Export as map
export const discoveryMDXContent: Record<string, string> = {
  '/content/6_1/discovery_6_1/overview_6_1.mdx': discoveryOverview61,
  '/content/6_1/discovery_6_1/access_discovery_6_1.mdx': accessDiscovery61,
  // ... more mappings
};

console.log(`✅ [Discovery MDX] Loaded ${Object.keys(discoveryMDXContent).length} files`);
```

2. **Register in contentLoader**: `/content/contentLoader.ts`

```typescript
// Add import at top
import { adminMDXContent } from '../lib/imports/adminMDXImports';
import { discoveryMDXContent } from '../lib/imports/discoveryMDXImports'; // NEW

// Combine all static MDX content maps
const allStaticMDXContent: Record<string, string> = {
  ...adminMDXContent,
  ...discoveryMDXContent, // NEW
};
```

3. **Test**: Navigate to a Discovery page and verify actual content loads

## File Naming Convention

Use clear, descriptive names that match the module:

```
adminMDXImports.ts       → Admin module
discoveryMDXImports.ts   → Discovery module
cmdbMDXImports.ts        → CMDB module
itamMDXImports.ts        → ITAM module
itsmMDXImports.ts        → ITSM module
```

## Path Mapping Format

**CRITICAL**: File paths MUST exactly match the paths used in TOC:

```typescript
// ✅ CORRECT
'/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx': costCenter61

// ❌ WRONG - missing version folder
'/admin_6_1/admin_org_details/cost_center_6_1.mdx': costCenter61

// ❌ WRONG - incorrect folder structure
'/content/admin/org_details/cost_center_6_1.mdx': costCenter61
```

## Version Handling

Import files for ALL versions when applicable:

```typescript
// Version 6.1
import overview61 from '../../content/6_1/admin_6_1/overview_6_1.mdx?raw';

// Version 6.1.1
import overview611 from '../../content/6_1_1/admin_6_1_1/overview_6_1_1.mdx?raw';

// Version 5.13
import overview513 from '../../content/5_13/admin_5_13/overview_5_13.mdx?raw';

// NextGen
import overviewNG from '../../content/NG/admin_ng/overview_ng.mdx?raw';

export const adminMDXContent: Record<string, string> = {
  '/content/6_1/admin_6_1/overview_6_1.mdx': overview61,
  '/content/6_1_1/admin_6_1_1/overview_6_1_1.mdx': overview611,
  '/content/5_13/admin_5_13/overview_5_13.mdx': overview513,
  '/content/NG/admin_ng/overview_ng.mdx': overviewNG,
};
```

## Debugging

Check browser console for strategy messages:

```
✅ Strategy 1 (STATIC MDX): Loaded actual content (2345 chars)
   → Static import working! ✅

⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder (500 chars)
   → Add this file to static imports! ⚠️
```

## Benefits Over Dynamic Loading

| Feature | Static Import | Dynamic Import |
|---------|--------------|----------------|
| Build-time bundling | ✅ Yes | ❌ No |
| Reliability | ✅ 100% | ⚠️ Variable |
| Performance | ✅ Instant | ⚠️ Fetch delay |
| Type safety | ✅ Yes | ❌ No |
| Works offline | ✅ Yes | ❌ No |

## Current Coverage

```
Total MDX files: 822
Static imports: 13 (1.6%)
Placeholders: 809 (98.4%)

Modules completed:
- Admin: ✅ 13 files (Overview + Org Details)

Modules remaining:
- Admin Discovery: ⏳ ~73 files
- Discovery: ⏳ ~50 files
- CMDB: ⏳ ~56 files
- ITAM: ⏳ ~46 files
- ITSM: ⏳ ~90 files
- Others: ⏳ ~494 files
```

## Quick Reference: Adding 1 File

```typescript
// 1. Import in appropriate module file
import myFile from '../../content/6_1/module/myFile.mdx?raw';

// 2. Add to map
export const moduleMDXContent: Record<string, string> = {
  '/content/6_1/module/myFile.mdx': myFile,
};

// 3. Verify path matches TOC exactly
// 4. Test in browser
```

## Notes

- Always use `?raw` suffix when importing MDX files
- Path mapping keys must match TOC paths exactly (including `/content/` prefix)
- Import variables should use camelCase (e.g., `costCenter61`)
- Test each module file before moving to the next
- Console logs will confirm static content is loading
