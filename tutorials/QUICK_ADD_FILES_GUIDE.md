# Quick Guide: Adding Files to Version Registry

## TL;DR

**3 Steps to add a new file:**

1. **Create** the MDX file: `/content/6_1/admin_6_1/your_folder/your_file_6_1.mdx`
2. **Register** in `/lib/imports/adminMDXImports.ts`:
   ```typescript
   '6_1': {
     'admin/your-slug': '/content/6_1/admin_6_1/your_folder/your_file_6_1.mdx',
   }
   ```
3. **Done!** The file loads automatically when version 6.1 is selected.

---

## Full Example: Adding "Probes" to Admin Discovery

### Step 1: File is Already Created
```
/content/6_1/admin_6_1/admin_discovery/probes_6_1.mdx
```

### Step 2: Open Registry File
```
/lib/imports/adminMDXImports.ts
```

### Step 3: Add to Version 6.1 Registry

```typescript
export const adminMDXFilePaths: Record<string, Record<string, string>> = {
  '6_1': {
    // ... existing paths
    
    // Discovery section
    'admin/discovery': '/content/6_1/admin_6_1/admin_discovery/admin_discovery_6_1.mdx',
    'admin/discovery/probes': '/content/6_1/admin_6_1/admin_discovery/probes_6_1.mdx', // ← NEW
    'admin/discovery/sensors': '/content/6_1/admin_6_1/admin_discovery/sensors_6_1.mdx',
  },
};
```

### Step 4: Test
1. Select "Version 6.1" in UI
2. Navigate to Admin → Discovery → Probes
3. Content should load! ✅

---

## Bulk Adding Files

If you have many files to add, use this pattern:

```typescript
'6_1': {
  // Organizational Details (9 files)
  'admin/organizational-details': '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx',
  'admin/organizational-details/cost-center': '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx',
  'admin/organizational-details/departments': '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx',
  'admin/organizational-details/departments/members': '/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx',
  'admin/organizational-details/designations': '/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx',
  'admin/organizational-details/holidays': '/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx',
  'admin/organizational-details/locations': '/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx',
  'admin/organizational-details/operational-hours': '/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx',
  'admin/organizational-details/details': '/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx',
  
  // Discovery (90+ files)
  'admin/discovery': '/content/6_1/admin_6_1/admin_discovery/admin_discovery_6_1.mdx',
  'admin/discovery/agent-adm-policies': '/content/6_1/admin_6_1/admin_discovery/agent_adm_policies_6_1.mdx',
  'admin/discovery/agent-adm-probes': '/content/6_1/admin_6_1/admin_discovery/agent_adm_probes_6_1.mdx',
  // ... continue pattern
},
```

---

## Slug Naming Convention

**Rule**: Use kebab-case, no version suffix

✅ **GOOD:**
```typescript
'admin/organizational-details/cost-center'
'admin/discovery/scan-configuration'
'admin/users/azure-ad-configuration'
```

❌ **BAD:**
```typescript
'admin/organizational-details/cost-center-6-1'  // No version in slug!
'admin/OrganizationalDetails/CostCenter'        // Use kebab-case!
'admin_discovery_scan_configuration'            // Use slashes for hierarchy!
```

---

## File Path Patterns

### Version 6.1
```
/content/6_1/admin_6_1/[section]/[file_name]_6_1.mdx
                └─────┘ └───────┘ └─────────┘
                module   section   file with version
```

### Version 6.1.1
```
/content/6_1_1/admin_6_1_1/[section]/[file_name]_6_1_1.mdx
```

### Version NextGen
```
/content/NG/admin_ng/[section]/[file_name]_ng.mdx
```

### Version 5.13
```
/content/5_13/admin_5_13/[section]/[file_name]_5_13.mdx
```

---

## Adding Version-Specific Content

### Scenario: Feature only exists in 6.1.1

**Register ONLY in 6.1.1 registry:**

```typescript
'6_1': {
  // Does NOT include new-feature
  'admin/organizational-details/cost-center': '/content/6_1/...',
},

'6_1_1': {
  // Includes new feature unique to 6.1.1
  'admin/organizational-details/cost-center': '/content/6_1_1/...',
  'admin/organizational-details/new-feature': '/content/6_1_1/admin_6_1_1/admin_org_details/new_feature_6_1_1.mdx',
},
```

**Result**: "New Feature" only appears when version 6.1.1 is selected! ✅

---

## Checklist

Before committing changes:

- [ ] File exists in correct folder
- [ ] File has version suffix (`_6_1.mdx`, `_ng.mdx`, etc.)
- [ ] Slug uses kebab-case
- [ ] Path starts with `/content/`
- [ ] Registered in correct version
- [ ] Tested in browser

---

## Common Mistakes

### ❌ Mistake 1: Wrong version suffix in file path
```typescript
'admin/cost-center': '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1_1.mdx'
                                                                              ^^^^^^
                                                                        Wrong! Should be _6_1
```

### ❌ Mistake 2: Version in slug
```typescript
'admin/cost-center-6-1': '/content/6_1/...'
                   ^^^^
              Remove this!
```

### ❌ Mistake 3: Forgetting leading slash
```typescript
'admin/cost-center': 'content/6_1/admin_6_1/...'
                     ^
                Missing /
```

---

## Need Help?

1. Check console for errors:
   ```
   ❌ Strategy 1: Fetch failed with status 404
   ```

2. Verify slug matches registry:
   ```javascript
   // Browser console
   import { adminMDXFilePaths } from './lib/imports/adminMDXImports';
   console.log(adminMDXFilePaths['6_1']['admin/your-slug']);
   ```

3. Check current version:
   ```javascript
   import { getCurrentVersion } from './content/contentLoader';
   console.log(getCurrentVersion());
   ```

---

## Next Module: Discovery

To add Discovery registry:

1. Create `/lib/imports/discoveryMDXImports.ts` (copy structure from adminMDXImports.ts)
2. Add to `/content/contentLoader.ts`:
   ```typescript
   import { getDiscoveryFilePath } from '../lib/imports/discoveryMDXImports';
   
   // In getPriorityFilePath():
   const discoveryPath = getDiscoveryFilePath(cleanSlug, currentVersion);
   if (discoveryPath) return discoveryPath;
   ```
3. Register all Discovery files!
