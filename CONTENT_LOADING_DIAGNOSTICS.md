# Content Loading Failure - Diagnostic Guide

## Problem Summary

Users are seeing "Content not available" errors with message "MDX file not found for this page. Please check the TOC configuration."

## Root Cause Analysis

### Current Architecture

1. **TOC-Driven Path Resolution:**
   - Navigation items come from `index.mdx` files
   - Paths are resolved using `resolveMDXPathFromTOC()` in `src/utils/tocPathResolver.ts`
   - Uses `resolveFilePath()` from `src/utils/tocParser.ts` to find file paths

2. **Content Loading Strategy:**
   - `getContent()` in `src/content/contentLoader.ts` tries multiple strategies:
     - Strategy 0: Direct fetch with base path
     - Strategy 1: Priority registry (adminMDXImports)
     - Strategy 2: MDX bundle
     - Strategy 3: Regular fetch
     - Strategy 4: Registry placeholder (fallback)

3. **Version Mapping:**
   - UI versions: `NextGen`, `6.1`, `6.1.1`, `5.13`
   - File path versions: `NG`, `6_1`, `6_1_1`, `5_13`
   - Mapping handled in `versionMap` in `App.tsx` and `versionToPath()` in `tocLoader.ts`

## Common Issues & Solutions

### Issue 1: TOC/Sidebar Mismatch

**Symptom:** Navigation item exists in sidebar but shows "Content not available"

**Possible Causes:**
- TOC entry has incorrect file path
- File path in TOC doesn't match actual file location
- Case sensitivity mismatch (especially on Linux servers)
- Version suffix mismatch (e.g., `_ng.mdx` vs `_6_1.mdx`)

**Diagnosis:**
1. Open browser console (F12)
2. Look for logs starting with `resolveMDXPathFromTOC called with:`
3. Check the resolved path vs actual file location
4. Verify file exists at exact path

**Solution:**
- Check `src/content/{version}/index.mdx`
- Verify the path after `→` matches actual file location
- Ensure path uses correct version suffix

### Issue 2: File Path Resolution Failure

**Symptom:** `resolveMDXPathFromTOC` returns `null`

**Possible Causes:**
- Module ID mismatch (e.g., `admin` vs `Admin`)
- Section ID mismatch (e.g., `sacm` vs `SACM`)
- Page ID mismatch (e.g., `cmdb-properties` vs `cmdb_properties`)
- TOC structure not loaded correctly

**Diagnosis:**
1. Check console for: `❌ No file path found in TOC for:`
2. Verify module/section/page IDs match TOC structure
3. Check if TOC loaded successfully: `TOC structure loaded:`

**Solution:**
- Verify IDs match exactly (case-sensitive)
- Check `convertToId()` function converts names correctly
- Ensure TOC file is valid and parseable

### Issue 3: Content Fetch Failure

**Symptom:** Path resolves correctly but content fails to load

**Possible Causes:**
- File doesn't exist at resolved path
- Base path issue (GitHub Pages `/FeatureDocsite/` prefix)
- Network/CORS issues
- File not copied to build directory

**Diagnosis:**
1. Check console for: `📥 [fetchContent]` logs
2. Look for: `❌ All strategies failed for`
3. Verify file exists in `build/content/` after build
4. Check network tab for 404 errors

**Solution:**
- Verify file exists in `src/content/`
- Check `vite.config.ts` content copy plugin is working
- Verify base path detection in `getBasePath()`
- Check file is accessible via HTTP

### Issue 4: Version Mapping Error

**Symptom:** Wrong version files being loaded

**Possible Causes:**
- Version mapping not applied correctly
- Internal version code mismatch
- TOC loaded for wrong version

**Diagnosis:**
1. Check: `🔄 [App] Version changed:` logs
2. Verify: `Current version:` in fetchContent logs
3. Check version path mapping: `versionToPath()` result

**Solution:**
- Verify `versionMap` in `App.tsx` is correct
- Check `VERSION_PATH_MAP` in `tocLoader.ts`
- Ensure `setVersion()` is called when version changes

## Diagnostic Checklist

### Step 1: Verify TOC Entry
- [ ] Open `src/content/{version}/index.mdx`
- [ ] Find the navigation item in question
- [ ] Verify the path after `→` is correct
- [ ] Check path uses correct version suffix

### Step 2: Verify File Exists
- [ ] Check file exists at path specified in TOC
- [ ] Verify file naming matches exactly (case-sensitive)
- [ ] Check file is in correct version directory

### Step 3: Check Browser Console
- [ ] Open DevTools Console (F12)
- [ ] Look for `resolveMDXPathFromTOC called with:`
- [ ] Check resolved path: `✅ TOC resolved path:`
- [ ] Look for fetch errors: `📥 [fetchContent]`
- [ ] Check for strategy failures

### Step 4: Verify Build Output
- [ ] Run `npm run build`
- [ ] Check `build/content/` directory
- [ ] Verify file exists in build output
- [ ] Check file is accessible via HTTP

### Step 5: Test Path Resolution
- [ ] Check module ID matches TOC: `module.id === selectedModule`
- [ ] Check section ID matches: `section.id === selectedSection`
- [ ] Check page ID matches: `page.id === selectedPage`
- [ ] Verify `convertToId()` produces correct IDs

## Quick Fixes

### Fix 1: Update TOC Entry
If file path is wrong in TOC:
```markdown
# In src/content/NG/index.mdx
- CMDB Properties → `/content/NG/admin_ng/admin_sacm/cmdb_properties_ng.mdx`
```

### Fix 2: Fix File Naming
If file name doesn't match:
- Rename file to match TOC path exactly
- Or update TOC to match actual file name

### Fix 3: Add Missing File
If file doesn't exist:
1. Create the MDX file at the path specified in TOC
2. Add content to the file
3. Rebuild: `npm run build`

### Fix 4: Fix Version Mapping
If wrong version files loading:
- Check `versionMap` in `App.tsx`
- Verify `setVersion()` is called correctly
- Check `versionToPath()` mapping

## Enhanced Error Messages

The error component now shows:
- Exact file path being requested
- Version, module, section, page context
- TOC file path
- Registration file suggestions
- Step-by-step instructions

## Debugging Commands

### Check if file exists:
```powershell
Test-Path "src\content\NG\admin_ng\admin_sacm\cmdb_properties_ng.mdx"
```

### List all files in a directory:
```powershell
Get-ChildItem -Path "src\content\NG\admin_ng\admin_sacm" -Filter "*.mdx"
```

### Search TOC for entry:
```powershell
Get-Content "src\content\NG\index.mdx" | Select-String -Pattern "CMDB Properties"
```

## Next Steps

1. **Check Browser Console** - Look for detailed error logs
2. **Verify TOC Entry** - Check `index.mdx` for correct path
3. **Verify File Exists** - Confirm file is at specified location
4. **Check Version Mapping** - Ensure correct version is being used
5. **Test Path Resolution** - Verify IDs match TOC structure

## Common Patterns

### Pattern 1: Missing Version Suffix
**TOC:** `/content/NG/admin_ng/admin_sacm/cmdb_properties.mdx`  
**Actual:** `/content/NG/admin_ng/admin_sacm/cmdb_properties_ng.mdx`  
**Fix:** Add `_ng` suffix to TOC path

### Pattern 2: Wrong Directory
**TOC:** `/content/NG/admin_ng/admin/cmdb_properties_ng.mdx`  
**Actual:** `/content/NG/admin_ng/admin_sacm/cmdb_properties_ng.mdx`  
**Fix:** Update TOC path to correct directory

### Pattern 3: Case Mismatch
**TOC:** `CMDB Properties` → converts to `cmdb-properties`  
**Actual file:** `CMDB_Properties_ng.mdx`  
**Fix:** Ensure `convertToId()` produces matching ID or rename file

---

**Last Updated:** Today  
**Status:** Enhanced error messages and diagnostics added

