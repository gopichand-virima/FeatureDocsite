# Quick Debug - Is Actual Content Loading?

## 🚀 30-Second Test

1. **Open browser** and navigate to your Virima docs site
2. **Press F12** to open DevTools Console
3. **Navigate to**: Admin > Organizational Details > Cost Center
4. **Look for these lines** in console:

### ✅ SUCCESS Pattern
```
✅ [Admin MDX Imports] Loaded 13 files
📄 [Cost Center Preview]: # Cost Center...
✅ Strategy 1 (STATIC MDX): SUCCESS! Loaded actual content (2134 chars)
```

### ❌ FAILURE Pattern
```
⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder
```

## 🎯 Visual Check

**Look at the page content:**

### ✅ Real Content (Success)
- Page shows: "Use this function to define the cost centers"
- Has sections: "New Cost Center", "Edit Cost Center", "Delete Cost Center"
- Content is detailed with specific instructions
- Length: Multiple paragraphs and subsections

### ❌ Placeholder (Failure)
- Page shows: "This section provides detailed information about..."
- Generic content without specific instructions
- Length: Only a few lines

## 🔧 If Showing Placeholder

Run this checklist:

### Check 1: Are imports loading?
**Look for**: `✅ [Admin MDX Imports] Loaded 13 files`
- ✅ YES (13 files) → Go to Check 2
- ❌ NO (0 files or error) → File `/lib/imports/adminMDXImports.ts` has issue

### Check 2: Is contentLoader initialized?
**Look for**: `📦 [Content Loader] Initialized with 13 static MDX files`
- ✅ YES (13 files) → Go to Check 3
- ❌ NO (0 files) → Import statement in `/content/contentLoader.ts` is wrong

### Check 3: Is path matching?
**Look for exact path being requested in console**

Example of MISMATCH:
```javascript
// Console shows request for:
Looking for: "content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"
//            ^ Missing leading slash

// But adminMDXImports.ts has:
'/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'
//^ Has leading slash

// These don't match! Path needs to be exact.
```

### Check 4: Which strategy is being used?
- Strategy 1 (STATIC MDX) = ✅ Actual content
- Strategy 2 (MDX Bundle) = ⚠️ May work
- Strategy 3 (Fetch) = ⚠️ May work  
- Strategy 4 (REGISTRY PLACEHOLDER) = ❌ Wrong! Placeholder content

## 🎯 Most Common Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Import syntax error** | Console: Module not found | Check file paths in `/lib/imports/adminMDXImports.ts` |
| **Missing ?raw suffix** | Console: Can't import MDX | Add `?raw` to all imports |
| **Path mismatch** | Strategy 4 used instead of 1 | Ensure exact path match between TOC and imports |
| **Not imported in contentLoader** | 0 static files | Add import to `/content/contentLoader.ts` |

## 🔍 Console Command Quick Reference

### See all console output
Just navigate to Cost Center and watch the console. You'll see detailed logs showing:
1. How many static files loaded
2. Which strategy is trying
3. What path it's looking for
4. If it found the content
5. Preview of the content

### Expected Full Log (Success)
```javascript
✅ [Admin MDX Imports] Loaded 13 files
📄 [Cost Center Preview]: # Cost Center

Use this function to define the cost centers...

📦 [Content Loader] Initialized with 13 static MDX files
🔍 getContent called with: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
📥 Fetching content from: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
🔍 [Strategy 1] Checking static MDX imports...
📊 [Strategy 1] Total static files available: 13
🎯 [Strategy 1] Looking for path: "/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"
  🔎 [getStaticMDX] Checking exact path: "/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"
  ✅ [getStaticMDX] Found exact match!
✅ Strategy 1 (STATIC MDX): SUCCESS! Loaded actual content (2134 chars)
📄 [Preview] First 200 chars: # Cost Center

Use this function to define the cost centers.

In the main window, click **Admin > Organizational Details > Cost Center**. The Cost Center window displays.

### New Cost
```

## ✅ Verification Checklist

Quick checks in order:

1. [ ] Open browser DevTools (F12)
2. [ ] Navigate to Admin > Organizational Details > Cost Center
3. [ ] Console shows "Loaded 13 files"
4. [ ] Console shows "Strategy 1 (STATIC MDX): SUCCESS!"
5. [ ] Console shows content >2000 chars
6. [ ] Page displays "Use this function to define the cost centers"
7. [ ] Page has subsections: New, Edit, Delete, Export, Import
8. [ ] Content is detailed (not generic)

**If all checked ✅ → System working correctly!**

**If any unchecked ❌ → See TESTING_GUIDE.md for detailed troubleshooting**

## 📞 Quick Fixes

### Fix 1: Hard Refresh
Sometimes cached:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Fix 2: Clear Console
Click the 🚫 icon in console to clear old logs, then navigate to Cost Center again

### Fix 3: Check File Exists
Verify `/lib/imports/adminMDXImports.ts` exists and has 13 imports

### Fix 4: Check Import Syntax
Each import should look like:
```typescript
import fileName from '../../content/VERSION/module/file.mdx?raw';
//                                                         ^^^^^ MUST have ?raw
```

## 🎊 Success = Strategy 1

The key indicator is seeing **Strategy 1** in the console logs:

```
✅ Strategy 1 (STATIC MDX): SUCCESS!
```

If you see **Strategy 4** instead:
```
⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder
```
Then actual content is NOT loading - check path matching!

---

**TL;DR**: 
- Open console
- Go to Cost Center
- Look for "Strategy 1 (STATIC MDX): SUCCESS!"
- If not there → path mismatch or import error
