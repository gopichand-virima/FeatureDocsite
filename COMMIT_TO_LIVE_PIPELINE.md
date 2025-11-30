# Commit-to-Live Pipeline - Documentation

## Overview

The documentation site uses a **fully automated commit-to-live pipeline** that ensures any MDX file update is automatically built, tested, and deployed to the live site.

## Simplified Flow

```
Edit MDX → Commit to Repo → Build Triggers → Build Succeeds → Changes Go Live
```

## Key Principle

**Single action (commit) drives the entire publish cycle** — no manual deployment steps. Authors focus only on content; the system handles everything else.

---

## How It Works

### 1. **Edit MDX File**
- Author edits any MDX file in any version directory:
  - `src/content/5_13/` (Version 5.13)
  - `src/content/6_1/` (Version 6.1)
  - `src/content/6_1_1/` (Version 6.1.1)
  - `src/content/NG/` (Version NextGen)
- Files can be in any module:
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

### 2. **Commit to Repository**
```bash
git add src/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
git commit -m "Update Cost Center documentation"
git push origin main
```

### 3. **Automatic Build Trigger**
- GitHub Actions workflow (`deploy.yml`) automatically triggers on push to `main` or `master`
- No manual intervention required

### 4. **Build Process**
The workflow runs two jobs:

#### **Test Job** (Runs on all pushes)
- ✅ Installs dependencies (`npm ci`)
- ✅ Type checks TypeScript
- ✅ Builds the project (`npm run build`)
- ✅ Verifies build output
- ✅ Verifies MDX content files (2,122+ files)
- ✅ Checks build size

#### **Deploy Job** (Runs only on main/master pushes)
- ✅ Rebuilds the project
- ✅ Verifies content files
- ✅ Creates 404.html for client-side routing
- ✅ Uploads build artifact
- ✅ Deploys to GitHub Pages

### 5. **Changes Go Live**
- Deployment completes automatically
- Changes are visible on the live site within 1-2 minutes
- No manual steps required

---

## Workflow Configuration

### File: `.github/workflows/deploy.yml`

**Triggers:**
```yaml
on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master
  workflow_dispatch: # Manual trigger available
```

**Key Features:**
- ✅ Automatic trigger on push to main/master
- ✅ Test job runs on all pushes (including PRs)
- ✅ Deploy job runs only on main/master branch pushes
- ✅ Manual trigger available via GitHub UI

---

## Multi-Version Support

### All Versions Are Independent

The documentation site supports **4 independent versions**:
- ✅ **Version 5.13** - `/content/5_13/`
- ✅ **Version 6.1** - `/content/6_1/`
- ✅ **Version 6.1.1** - `/content/6_1_1/`
- ✅ **Version NextGen** - `/content/NG/`

**Key Principle**: Each version is completely independent. Changes to one version do **NOT** affect any other version.

### Version-Specific Index Files

Each version has its own `index.mdx` file that serves as the master Table of Contents:
- `src/content/5_13/index.mdx` - Only references `/content/5_13/`
- `src/content/6_1/index.mdx` - Only references `/content/6_1/`
- `src/content/6_1_1/index.mdx` - Only references `/content/6_1_1/`
- `src/content/NG/index.mdx` - Only references `/content/NG/`

---

## Consistent Formatting Across All Modules

### All Modules Use the Same System (All Versions)

**Components:**
- ✅ **MDXRenderer** - Single rendering component for all modules
- ✅ **MDXContent** - Single content wrapper for all modules
- ✅ **Breadcrumb System** - Consistent navigation across all pages
- ✅ **Heading Styles** - Bold headings (H1-H6) with no dividers
- ✅ **Content Loader** - Unified content loading system

**Result:**
- All modules (Admin, CMDB, Discovery, ITSM, ITAM, etc.) have:
  - Same breadcrumb format: `Home > 6.1 > Module > Section > Page`
  - Same heading styles: Bold, properly sized, no divider lines
  - Same content formatting: Consistent typography and spacing
  - Same user experience: Uniform across all documentation

---

## Module List (Version 6.1)

All modules follow the same formatting standards:

1. **Admin** ✅
   - Organizational Details (Cost Center, Departments, etc.)
   - Discovery Configuration
   - User Management
   - Security Settings
   - And 20+ more sections

2. **My Dashboard** ✅
   - Application Overview
   - Shared Functions
   - Dashboards
   - Customization

3. **CMDB** ✅
   - Access CMDB
   - Manage CMDB
   - View and Edit CI
   - CI Details and Tabs

4. **Discovery Scan** ✅
   - Dashboard
   - Run a Scan
   - Recent Scans
   - Scheduled Scans
   - Import from AWS/Azure/Meraki/Intune

5. **ITSM** ✅
   - Configuration Management
   - Change Management
   - Incident Management
   - Problem Management
   - Knowledge Management
   - Release Management
   - Request Fulfillment
   - Service Portfolio
   - Runbook

6. **ITAM** ✅
   - Configuration Management
   - Audits
   - Asset License Entitlement
   - User License Entitlement
   - Stockroom
   - Procurement

7. **Vulnerability Management** ✅
   - Core Functionality
   - Access and View
   - Best Practices

8. **Self Service** ✅
   - Service Catalog
   - My Incidents
   - My Requests

9. **Program/Project Management** ✅
   - Programs
   - Projects
   - Dashboards

10. **Risk Register** ✅
    - Risk Dashboard
    - Risks

11. **Reports** ✅
    - Ad-hoc Reports
    - Canned Reports
    - Properties and Conditions

---

## Verification

### Check Workflow Status

1. Go to GitHub repository
2. Click **Actions** tab
3. View latest workflow run
4. Verify:
   - ✅ Test job passed
   - ✅ Deploy job passed (on main/master)
   - ✅ Deployment completed

### Verify Live Site

1. Visit: `https://gopichand-virima.github.io/FeatureDocsite/`
2. Navigate to any module
3. Verify:
   - ✅ Breadcrumbs display correctly
   - ✅ Headings are bold (no divider lines)
   - ✅ Content loads properly
   - ✅ Formatting is consistent

---

## Troubleshooting

### Build Fails

**Check:**
- ✅ No syntax errors in MDX files
- ✅ All dependencies installed correctly
- ✅ TypeScript errors resolved
- ✅ Build output directory created

**Solution:**
- Fix errors shown in workflow logs
- Commit and push again

### Content Not Updating

**Check:**
- ✅ Workflow completed successfully
- ✅ Deploy job ran (only on main/master)
- ✅ Wait 1-2 minutes for GitHub Pages to update
- ✅ Clear browser cache

**Solution:**
- Verify deployment in Actions tab
- Check if changes were pushed to main/master branch

### Formatting Inconsistent

**Check:**
- ✅ All modules use `MDXContent` component
- ✅ All content uses `MDXRenderer` component
- ✅ No custom styling overriding defaults

**Solution:**
- All modules automatically use the same formatting
- No action needed - consistency is automatic

---

## Best Practices

### For Content Authors

1. **Edit MDX files directly** in `src/content/6_1/[module]/`
2. **Use standard Markdown** - headings, lists, links, etc.
3. **Commit and push** - system handles the rest
4. **Verify in Actions tab** - check workflow status
5. **Test on live site** - verify changes appear correctly

### For Developers

1. **Don't modify** `MDXRenderer.tsx` unless needed for all modules
2. **Keep formatting consistent** - changes affect all modules
3. **Test locally** before committing: `npm run build`
4. **Monitor workflow runs** - ensure automatic deployment works

---

## Summary

✅ **Commit-to-Live Pipeline**: Fully automated  
✅ **All Modules**: Use same formatting system  
✅ **Consistent Experience**: Uniform across all documentation  
✅ **Zero Manual Steps**: Authors just edit and commit  
✅ **Automatic Deployment**: Changes go live within minutes  

**The system is ready for production use!**

