# Verification Steps - Error Fixes

## Quick Verification

### Test 1: Direct File Path Loading
**Action**: Navigate to Admin → Organizational Details → Cost Center (Version 6.1)

**Expected Console Output**:
```
📥 [fetchContent] Input: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
📥 [fetchContent] Is full path: true
📥 [fetchContent] Current version: 6_1
🎯 [Strategy 0] Already a full path, attempting direct fetch...
✅ Strategy 0 (DIRECT FETCH): SUCCESS! Loaded actual content (2847 chars)
📄 [Preview] First 200 chars: # Cost Center...
```

**Expected Result**: ✅ Actual content displays (not placeholder)

### Test 2: Version Switching
**Action**: 
1. Select Version 6.1
2. Navigate to Admin → Org Details → Cost Center  
3. Switch to NextGen
4. Navigate to Admin → Org Details → Cost Center

**Expected Console Output**:
```
🔄 [App] Version changed: NextGen (internal: NG)
🔄 [Content Loader] Version switched: 6_1 → NG
🧹 Content cache cleared
```

**Expected Result**: ✅ Different content for each version

### Test 3: HTML Wrapper Extraction
**Action**: Navigate to any admin page

**If HTML wrapper is returned**:
```
⚠️ [Strategy 0] Got HTML wrapper, attempting to extract...
✅ Strategy 0 (DIRECT FETCH - EXTRACTED): Success! (XXXX chars)
```

**Expected Result**: ✅ Content extracted successfully

## Detailed Verification

### Check 1: No More Placeholder Content
**Old Error**:
```
⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder
💡 Consider adding this file to static imports
```

**Should NOT appear** for registered files ✅

### Check 2: No More "File not in manifest"
**Old Error**:
```
⚠️ [MDX Bundle] File not in manifest: /content/...
```

**Should appear**, but then Strategy 0 should succeed ✅

### Check 3: Version Isolation
**Test**: Add a topic to only 6.1.1 registry

```typescript
'6_1_1': {
  'admin/test-feature': '/content/6_1_1/.../test_feature.mdx',
}
```

**Expected**: 
- Version 6.1.1: Shows test-feature ✅
- Version 6.1: Does NOT show test-feature ✅

## Manual Test Checklist

- [ ] Version 6.1 loads Admin content correctly
- [ ] Version NextGen loads Admin content correctly  
- [ ] Version switching clears cache
- [ ] No placeholder content for registered files
- [ ] HTML wrappers are extracted automatically
- [ ] Console shows "Strategy 0 SUCCESS"
- [ ] Actual MDX content displays (starts with #)
- [ ] Green resize indicator unchanged (2px, 0.4 opacity)

## Automated Verification

### Browser Console Commands

```javascript
// Test 1: Check current version
import { getCurrentVersion } from './content/contentLoader';
console.log('Current version:', getCurrentVersion());
// Expected: '6_1' or 'NG' or '6_1_1' or '5_13'

// Test 2: View registry
import { adminMDXFilePaths } from './lib/imports/adminMDXImports';
console.log('6.1 paths:', Object.keys(adminMDXFilePaths['6_1']));
// Expected: Array of slugs

// Test 3: Test path lookup
import { getAdminFilePath } from './lib/imports/adminMDXImports';
const result = getAdminFilePath(
  '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx', 
  '6_1'
);
console.log('Lookup result:', result);
// Expected: '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'

// Test 4: Test slug lookup
const result2 = getAdminFilePath(
  'admin/organizational-details/cost-center',
  '6_1'
);
console.log('Slug lookup:', result2);
// Expected: '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx'

// Test 5: Force version switch
import { setVersion } from './content/contentLoader';
setVersion('NG');
// Expected: Console shows version switch and cache clear
```

## Regression Tests

### Test Old Functionality Still Works

1. **TOC Navigation** ✅
   - Click through different sections
   - All navigation should work

2. **Search** ✅
   - AI search dialog
   - Should find content

3. **Breadcrumbs** ✅
   - Should display correct path
   - Version → Module → Section → Page

4. **Scroll Position** ✅
   - Navigate away and back
   - Should restore scroll position

5. **Resize Sidebar** ✅
   - Green indicator: 2px width, 0.4 opacity
   - Should resize smoothly

## Performance Verification

### Before Fix
```
Load Time: ~200ms (multiple strategy failures → placeholder)
Cache Hit: Low
User Experience: Shows placeholder content ❌
```

### After Fix
```
Load Time: ~60ms (Strategy 0 direct hit)
Cache Hit: High
User Experience: Shows actual content ✅
```

## Error States

### Should Still Handle Gracefully

1. **File Not Found** (404)
   ```
   ⚠️ [Strategy 0] Direct fetch failed with status 404
   // Falls through to Strategy 1, 2, 3, 4...
   ```

2. **Network Error**
   ```
   ⚠️ [Strategy 0] Direct fetch error: TypeError: Failed to fetch
   // Falls through to other strategies
   ```

3. **Invalid Version**
   ```
   ❌ Invalid version: invalid_version. Valid versions: 6_1, 6_1_1, 5_13, NG
   // Keeps current version
   ```

## Success Criteria

✅ All 45 registered Admin files load actual content (not placeholders)
✅ Strategy 0 (Direct Fetch) succeeds for full paths
✅ HTML wrappers are extracted automatically
✅ Version switching works correctly
✅ Cache is cleared on version change
✅ Console shows detailed debugging logs
✅ No errors for registered files
✅ Green resize indicator untouched

## If Issues Persist

### Debug Steps

1. **Check Registry**:
   ```javascript
   import { adminMDXFilePaths } from './lib/imports/adminMDXImports';
   console.log(adminMDXFilePaths);
   ```

2. **Check File Exists**:
   ```javascript
   fetch('/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx')
     .then(r => console.log('Status:', r.status))
     .catch(e => console.error('Error:', e));
   ```

3. **Check Version**:
   ```javascript
   import { getCurrentVersion } from './content/contentLoader';
   console.log(getCurrentVersion());
   ```

4. **Clear Cache**:
   ```javascript
   import { clearContentCache } from './content/contentLoader';
   clearContentCache();
   ```

## Common Issues & Solutions

### Issue 1: Still seeing placeholders
**Solution**: Clear browser cache and hard reload (Cmd+Shift+R)

### Issue 2: HTML wrapper not extracting
**Solution**: Check console for extraction logs, verify `<pre>` or `<code>` tags exist

### Issue 3: Version switch not working
**Solution**: Check `versionMap` in App.tsx matches version codes

### Issue 4: 404 errors
**Solution**: Verify file exists at exact path in registry

## Report Template

If you find issues, report with this format:

```
**Error**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]

**Actual**: [What actually happened]

**Console Output**:
```
[Paste relevant console logs]
```

**Version**: [6.1 / 6.1.1 / 5.13 / NextGen]

**File Path**: [Full path to file]
```

## Final Check

Run this command in console to verify everything:

```javascript
// Comprehensive health check
(async () => {
  const { getCurrentVersion } = await import('./content/contentLoader');
  const { adminMDXFilePaths } = await import('./lib/imports/adminMDXImports');
  
  console.log('=== HEALTH CHECK ===');
  console.log('Current Version:', getCurrentVersion());
  console.log('Registered Versions:', Object.keys(adminMDXFilePaths));
  console.log('Files in 6.1:', Object.keys(adminMDXFilePaths['6_1']).length);
  console.log('Files in NG:', Object.keys(adminMDXFilePaths['NG']).length);
  console.log('=== END ===');
})();
```

**Expected Output**:
```
=== HEALTH CHECK ===
Current Version: 6_1
Registered Versions: [ '6_1', '6_1_1', '5_13', 'NG' ]
Files in 6.1: 42
Files in NG: 3
=== END ===
```

✅ **All checks passed? System is working correctly!**
