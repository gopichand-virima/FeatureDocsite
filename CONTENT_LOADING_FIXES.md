# Content Loading Fixes - FeatureDocsite

## Summary

Fixed content loading issues in FeatureDocsite by aligning the implementation with the working `alternate-feature-docsite` codebase. The main issues were related to module ID mapping and path resolution logic.

## Key Differences Identified

### 1. **Module ID Mapping Issue** (CRITICAL FIX)
- **Problem**: FeatureDocsite was using `mapModuleIdToTOC()` to map navigation module IDs to TOC module IDs BEFORE attempting resolution
- **Working Version**: Uses module ID directly without mapping
- **Fix**: Changed to try direct module ID first (matching working version), then fall back to mapped ID only if direct lookup fails

### 2. **Static Content Path Matching**
- **Problem**: Static content lookup only checked exact path match
- **Fix**: Added path normalization to try multiple path variations (with/without leading slash, `/content/versions/` vs `/content/`, etc.)

### 3. **Registry Fallback Complexity**
- **Problem**: Complex registry fallback logic that wasn't in the working version
- **Fix**: Simplified to match working implementation - removed registry fallback from `DocumentationContent.tsx`, relying on TOC resolution only

## Files Modified

### 1. `src/utils/tocPathResolver.ts`
**Changes:**
- Modified `resolveMDXPathFromTOC()` to try direct module ID first (like working version)
- Only uses `mapModuleIdToTOC()` as a fallback if direct lookup fails
- Improved fallback resolution to try both direct and mapped module IDs
- Fixed linting error in `resolveMDXPathFromTOCSync()`

**Key Logic Change:**
```typescript
// OLD: Always mapped module ID first
const tocModuleId = mapModuleIdToTOC(module);
const filePath = resolveFilePath(structure, tocModuleId, section, page);

// NEW: Try direct module ID first, then mapped as fallback
let filePath = resolveFilePath(structure, module, section, page);
if (!filePath) {
  const tocModuleId = mapModuleIdToTOC(module, section);
  if (tocModuleId !== module) {
    filePath = resolveFilePath(structure, tocModuleId, section, page);
  }
}
```

### 2. `src/content/contentLoader.ts`
**Changes:**
- Enhanced static MDX content lookup to try multiple path variations
- Added path normalization for better matching

**Key Logic Change:**
```typescript
// OLD: Single path check
if (allStaticMDXContent[cleanPath]) { ... }

// NEW: Multiple path variations
const pathVariations = [
  cleanPath,
  cleanPath.startsWith('/') ? cleanPath.slice(1) : `/${cleanPath}`,
  cleanPath.replace(/^\/content\/versions\//, '/content/'),
  cleanPath.replace(/^\/content\//, ''),
];
for (const pathVar of pathVariations) {
  if (allStaticMDXContent[pathVar]) { ... }
}
```

### 3. `src/components/DocumentationContent.tsx`
**Changes:**
- Removed complex registry fallback logic
- Simplified to match working implementation
- Removed unused imports (`getRegisteredContent`, `isContentRegistered`)

**Key Logic Change:**
```typescript
// OLD: Complex registry fallback with multiple path patterns
let path = await resolveMDXPathFromTOC(...);
if (!path) {
  // Try registry with multiple path patterns...
}

// NEW: Simple TOC resolution (matching working version)
const [path, breadcrumbPath] = await Promise.all([
  resolveMDXPathFromTOC({ version, module, section, page }),
  buildBreadcrumbPath(version, module, section, page)
]);
```

## Root Cause Analysis

The primary issue was that FeatureDocsite assumed the TOC structure used different module IDs than navigation, requiring a mapping step. However, the working version shows that the TOC structure uses the same module IDs as navigation in most cases. The mapping was causing mismatches and preventing content from being found.

## Testing Recommendations

1. **Test all modules** to ensure content loads correctly:
   - Admin
   - My Dashboard
   - CMDB
   - Discovery Scan
   - ITSM
   - ITAM
   - Vulnerability Management
   - Self Service
   - Program/Project Management
   - Risk Register
   - Reports

2. **Test version switching** to ensure all versions work:
   - 6.1
   - 6.1.1
   - 5.13
   - NextGen

3. **Test edge cases**:
   - Pages with nested hierarchies
   - Pages in different sections
   - Module index pages (no section/page)

## Expected Behavior After Fix

- Content should load correctly for all pages
- No "Content not available - MDX file not found" errors
- Faster content resolution (direct lookup first)
- Better error messages in console for debugging

## Notes

- The module ID mapping is still available as a fallback for special cases (e.g., `my-dashboard` sections mapping to separate modules)
- Static content lookup now handles path variations more robustly
- The implementation now closely matches the working `alternate-feature-docsite` codebase

