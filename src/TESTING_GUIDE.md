# Testing Guide - Actual MDX Content Rendering

## 🧪 How to Verify Actual Content is Loading

### Test 1: Navigate to Cost Center

1. **Open the application** in your browser
2. **Navigate to**: `Admin > Organizational Details > Cost Center`
3. **Open browser console** (F12 or right-click > Inspect > Console)

### Expected Console Output (Success)

```javascript
✅ [Admin MDX Imports] Loaded 13 files
📄 [Cost Center Preview]: # Cost Center

Use this function to define the cost centers.

In the main window, click **Admin > Organizational Details > Cost Center**. The Cost Center window displays...

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

### New Cost...
```

### Expected Page Content (Success)

The page should display:

```markdown
# Cost Center

Use this function to define the cost centers.

In the main window, click **Admin > Organizational Details > Cost Center**. The Cost Center window displays.

### New Cost Center

- From the Select Actions drop-down list, choose New Cost Center.
- Enter the Name, Account Number, and Code for the cost center.
- To associate a Manager, Location or Parent, click Add then search for and select the application item.
- Specify the Valid From and Valid To dates for this cost center to be active.
- When all selections/entries are made, click Add.

### Edit Cost Center

Not all functions include an option to edit record line items shown in the main window.

- Navigate to the window containing the record to edit.
- Click the line containing the record. The applicable window or dialog box displays.
- Make the necessary modifications.
- Click Save or Add, as applicable.

When editing an existing item, other options may be available, such as adding Tasks, Comments, and Attachments and viewing History.

### Delete Cost Center

Deleting is a permanent action and cannot be undone...

### Export Cost Center

Exports data for the selected record as an Excel spreadsheet...

### Import Cost Center

- From the Select Actions drop-down list, choose Import...
```

## 🚨 Troubleshooting

### Issue 1: Still Showing Placeholder Content

**Console shows**: `⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder`

**Diagnosis**:
- Static import not working
- Path mismatch between TOC and import map

**Check**:
1. Is the path in console logs exact?
2. Does it match the path in `/lib/imports/adminMDXImports.ts`?
3. Are there 13 files shown as loaded?

**Example of path mismatch**:
```javascript
// Console shows:
Looking for: "content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"

// But adminMDXImports.ts has:
'/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'

// Note: Missing leading slash!
```

### Issue 2: 0 Static Files Loaded

**Console shows**: `📦 [Content Loader] Initialized with 0 static MDX files`

**Problem**: Import not working

**Fix**:
1. Check `/lib/imports/adminMDXImports.ts` exists
2. Check imports use `?raw` suffix
3. Verify file paths are correct
4. Try browser hard refresh (Ctrl+Shift+R)

### Issue 3: Import Error

**Console shows**: `Module not found: Can't resolve '../../content/6_1/admin_6_1/overview_6_1.mdx'`

**Problem**: File path incorrect in import

**Fix**:
1. Check actual file location in `/content/` directory
2. Verify path is relative to `/lib/imports/adminMDXImports.ts`
3. Count the `../` needed to get from `/lib/imports/` to `/content/`

## ✅ Success Indicators

| Indicator | What to Check | Expected Value |
|-----------|---------------|----------------|
| Static files loaded | Console: "Initialized with X static MDX files" | 13 |
| Strategy used | Console: "Strategy 1 (STATIC MDX): SUCCESS!" | Strategy 1 |
| Content length | Console: "(XXXX chars)" | >1000 chars |
| Content preview | Console first 200 chars | Should start with "# Cost Center" |
| Page heading | Visual: H1 on page | "Cost Center" |
| Page content | Visual: Subsections | "New Cost Center", "Edit Cost Center", etc. |

## 🔍 Detailed Debug Checklist

### Step 1: Check Static Imports Loaded
```javascript
// Console should show:
✅ [Admin MDX Imports] Loaded 13 files
📄 [Cost Center Preview]: # Cost Center...
```
✅ If YES → Continue to Step 2  
❌ If NO → Check `/lib/imports/adminMDXImports.ts` file exists and has imports

### Step 2: Check Content Loader Initialization
```javascript
// Console should show:
📦 [Content Loader] Initialized with 13 static MDX files
```
✅ If 13 → Continue to Step 3  
❌ If 0 → Check import statement in `/content/contentLoader.ts`

### Step 3: Check Path Matching
```javascript
// Console should show:
🎯 [Strategy 1] Looking for path: "/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"
  🔎 [getStaticMDX] Checking exact path: "/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx"
  ✅ [getStaticMDX] Found exact match!
```
✅ If Found → Content should render  
❌ If Not Found → Path mismatch - check both paths match exactly

### Step 4: Verify Content Renders
Look at the page content visually:
- Should see formatted headers (H1, H2, H3)
- Should see bullet lists
- Should see proper paragraph spacing
- Should NOT see raw markdown (e.g., should not see `###` or `**text**`)

## 📊 Content Comparison

### Placeholder Content (Wrong - ~300 chars)
```markdown
# Cost Center

This section provides detailed information about cost center in Virima Admin.

## Overview
Learn about managing cost centers and associated configurations.
```

### Actual Content (Correct - ~2000+ chars)
```markdown
# Cost Center

Use this function to define the cost centers.

In the main window, click **Admin > Organizational Details > Cost Center**...

### New Cost Center
[detailed instructions]

### Edit Cost Center
[detailed instructions]

### Delete Cost Center
[detailed instructions]

### Export Cost Center
[detailed instructions]

### Import Cost Center
[detailed instructions]

Other Functions and Page Elements
- Records per Page
- Auto Refresh
...
```

## 🎯 Quick Visual Check

If you see this → **PLACEHOLDER (Wrong)**:
- Short content (~5-10 lines)
- Generic text like "This section provides detailed information..."
- No specific instructions

If you see this → **ACTUAL CONTENT (Correct)**:
- Long content (multiple screens)
- Specific instructions with field names
- Multiple subsections (New, Edit, Delete, Export, Import)
- Links to other topics
- Detailed procedures

## 🔧 Path Debugging

If path matching fails, check these common issues:

| Issue | Wrong Path | Correct Path |
|-------|-----------|--------------|
| Missing leading slash | `content/6_1/...` | `/content/6_1/...` |
| Extra slash | `//content/6_1/...` | `/content/6_1/...` |
| Wrong casing | `/Content/6_1/...` | `/content/6_1/...` |
| Missing version | `/admin_6_1/...` | `/content/6_1/admin_6_1/...` |
| Wrong extension | `.md` instead of `.mdx` | Use `.mdx` |

## 📞 Support Commands

Run these in browser console to debug:

### Check if imports loaded
```javascript
// This will be logged automatically on page load
// Look for: ✅ [Admin MDX Imports] Loaded 13 files
```

### Check available static paths
```javascript
// Look in console for:
// 📋 [Strategy 1] Available paths sample: [...]
```

### Check content preview
```javascript
// Look for:
// 📄 [Preview] First 200 chars: ...
```

## ✅ Final Checklist

Before reporting issues, verify:

- [ ] Browser console is open
- [ ] Page has been fully loaded
- [ ] Hard refresh performed (Ctrl+Shift+R)
- [ ] Console shows 13 static files loaded
- [ ] Path in console matches path in adminMDXImports.ts
- [ ] Strategy 1 is being used (not Strategy 4)
- [ ] Content length is >1000 characters
- [ ] Visual content matches expected actual content

## 🎊 Success!

If everything works correctly, you should see:

1. ✅ Console: 13 files loaded
2. ✅ Console: Strategy 1 used
3. ✅ Console: 2000+ character content
4. ✅ Page: Detailed, formatted documentation
5. ✅ Page: Multiple subsections with instructions
6. ✅ No placeholder text

**Next Steps**: Add more modules following the pattern in `/lib/imports/README.md`
