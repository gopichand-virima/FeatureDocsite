# Content Editor's Guide - TOC-Driven Documentation

## 🎯 Quick Start for Content Editors

This guide shows you how to add and manage documentation content using the new TOC-driven system.

---

## 📚 What You Need to Know

### **Single Source of Truth**

All navigation, structure, and file paths are defined in **ONE FILE** per version:

- `/content/5_13/index.mdx` - Version 5.13
- `/content/6_1/index.mdx` - Version 6.1
- `/content/6_1_1/index.mdx` - Version 6.1.1
- `/content/NG/index.mdx` - NextGen

**Edit this file to control everything!**

---

## ✍️ Adding a New Page

### **Step 1: Create Your MDX File**

Create a new `.mdx` file in the appropriate folder:

```bash
/content/6_1/admin_6_1/admin/my-new-feature.mdx
```

Write your content:

```markdown
# My New Feature

This is a new feature in the Admin module.

## Key Points

- Point 1
- Point 2
- Point 3
```

---

### **Step 2: Add to index.mdx**

Open `/content/6_1/index.mdx` and find the correct module and section:

```markdown
## Admin

### Configuration
- Configure Blueprints → `/content/6_1/admin_6_1/admin/configure_blueprints_6_1.mdx`
- Email Templates → `/content/6_1/admin_6_1/admin/email_templates_6_1.mdx`
- My New Feature → `/content/6_1/admin_6_1/admin/my-new-feature.mdx`  ← ADD THIS
```

---

### **Step 3: Done!**

That's it! The system automatically:
- ✅ Adds it to navigation
- ✅ Creates the route
- ✅ Resolves the file path
- ✅ Generates breadcrumbs
- ✅ Indexes for search

**No code changes needed!**

---

## 📖 index.mdx Format

### **Basic Structure**

```markdown
# Virima Documentation - Version X.X

> Master Table of Contents for Version X.X

---

## Module Name

### Section Name

- Page Name → `/content/version/folder/file.mdx`
- Another Page → `/content/version/folder/another.mdx`

#### Subsection Name

- Subsection Page → `/content/version/folder/subsection.mdx`
```

---

### **Rules**

1. **Modules** start with `##`
2. **Sections** start with `###` or `####`
3. **Pages** start with `-` and use format: `Name → /path`
4. **Paths** must be absolute from project root
5. **Indent** with 2 spaces for nested pages

---

### **Example with Nesting**

```markdown
## Discovery Scan

### Discovered Items
- Overview → `/content/6_1/discovery_6_1/discovered_items/overview.mdx`
  - Access Items → `/content/6_1/discovery_6_1/discovered_items/access.mdx`
  - Manage Items → `/content/6_1/discovery_6_1/discovered_items/manage.mdx`
    - Export → `/content/6_1/discovery_6_1/discovered_items/export.mdx`
    - Delete → `/content/6_1/discovery_6_1/discovered_items/delete.mdx`
```

**Hierarchy:**
- Overview (top level)
  - Access Items (nested 1 level)
  - Manage Items (nested 1 level)
    - Export (nested 2 levels)
    - Delete (nested 2 levels)

---

## 🎨 Common Tasks

### **Add a New Module**

```markdown
---

## My New Module

### Getting Started
- Quick Start → `/content/6_1/my_module/quick-start.mdx`
- Overview → `/content/6_1/my_module/overview.mdx`

### Advanced
- Advanced Topics → `/content/6_1/my_module/advanced.mdx`

---
```

---

### **Add a New Section**

Find your module and add a new section:

```markdown
## Admin

### Configuration
- (existing pages...)

### My New Section   ← ADD THIS
- New Page 1 → `/content/6_1/admin_6_1/new-section/page1.mdx`
- New Page 2 → `/content/6_1/admin_6_1/new-section/page2.mdx`
```

---

### **Reorganize Pages**

Just move the lines in `index.mdx`!

**Before:**
```markdown
### Configuration
- Configure Blueprints → `/path/to/blueprints.mdx`
- Email Templates → `/path/to/email.mdx`
- Icons → `/path/to/icons.mdx`
```

**After:**
```markdown
### Configuration
- Email Templates → `/path/to/email.mdx`
- Icons → `/path/to/icons.mdx`
- Configure Blueprints → `/path/to/blueprints.mdx`
```

The navigation updates immediately!

---

### **Remove a Page**

Just delete or comment out the line:

```markdown
### Configuration
- Email Templates → `/path/to/email.mdx`
<!-- - Old Feature → `/path/to/old.mdx` -->  ← COMMENTED OUT
- Icons → `/path/to/icons.mdx`
```

---

## 🔧 File Naming Conventions

### **Folder Structure**

```
/content/
  ├── 6_1/
  │   ├── index.mdx           ← Master TOC
  │   ├── admin_6_1/
  │   │   ├── admin/
  │   │   │   ├── admin_functions_new_6_1.mdx
  │   │   │   └── email_templates_6_1.mdx
  │   │   └── about_admin_6_1.mdx
  │   ├── cmdb_6_1/
  │   └── discovery_6_1/
  └── NG/
      └── index.mdx
```

### **Naming Pattern**

```
{descriptive-name}_{version}.mdx

Examples:
- admin_functions_new_6_1.mdx
- about_discovery_scan_6_1.mdx
- cmdb_overview_6_1.mdx
```

---

## 📋 Checklist for New Content

Before adding a new page, make sure:

- [ ] MDX file created in correct folder
- [ ] File follows naming convention
- [ ] Content is properly formatted (Markdown/MDX)
- [ ] Added to correct module in `index.mdx`
- [ ] Added to correct section in `index.mdx`
- [ ] Path in `index.mdx` is absolute and correct
- [ ] Tested by navigating to the page
- [ ] Page appears in navigation sidebar
- [ ] Breadcrumbs show correctly

---

## 🐛 Troubleshooting

### **Page doesn't show in navigation**

**Check:**
1. Is it added to `index.mdx`?
2. Is the path correct?
3. Is the module/section defined with `##` or `###`?

### **"File not found" error**

**Check:**
1. Does the file exist at the exact path in `index.mdx`?
2. Is the path absolute (starts with `/content/`)?
3. Is the file extension `.mdx`?
4. Is there a typo in the filename?

### **Page loads but looks wrong**

**Check:**
1. Is the MDX syntax correct?
2. Are there any Markdown formatting issues?
3. Check browser console for errors

### **Navigation not updating**

**Try:**
1. Refresh the page
2. Clear browser cache
3. Check `index.mdx` has no syntax errors

---

## 💡 Best Practices

### **1. Descriptive Names**

**Good:**
```markdown
- Configure Email Templates → `/path/to/email_templates.mdx`
```

**Bad:**
```markdown
- Email → `/path/to/email.mdx`
```

### **2. Logical Grouping**

Group related pages under the same section:

```markdown
### Configuration
- Email Templates → `/path/to/email.mdx`
- Icons → `/path/to/icons.mdx`
- Blueprints → `/path/to/blueprints.mdx`

### User Management
- Users → `/path/to/users.mdx`
- Roles → `/path/to/roles.mdx`
- Permissions → `/path/to/permissions.mdx`
```

### **3. Consistent Hierarchy**

Keep nesting levels consistent:

```markdown
### Import Operations
- Import from AWS → `/path/to/aws.mdx`
  - Configure AWS → `/path/to/aws-config.mdx`
  - View AWS Logs → `/path/to/aws-logs.mdx`
- Import from Azure → `/path/to/azure.mdx`
  - Configure Azure → `/path/to/azure-config.mdx`
  - View Azure Logs → `/path/to/azure-logs.mdx`
```

### **4. Default Pages**

The **first page** in the **first section** becomes the default when the module is selected:

```markdown
## Admin

### Overview   ← First section
- Admin Functions → `/path/to/admin.mdx`   ← First page (DEFAULT!)
- About Admin → `/path/to/about.mdx`
```

---

## 📊 Current Status (Version 6.1)

| Module | Sections | Pages | Status |
|--------|----------|-------|--------|
| Admin | 3 | 17 | ✅ Complete |
| CMDB | 6 | 67 | ✅ Complete |
| Discovery Scan | 18 | 130+ | ✅ Complete |
| ITAM | 9 | 50+ | ✅ Complete |
| ITSM | 9 | 150+ | ✅ Complete |
| My Dashboard | 4 | 12 | ✅ Complete |
| Program & Project Mgmt | 2 | 4 | ✅ Complete |
| Reports | 3 | 6 | ✅ Complete |
| Risk Register | 2 | 3 | ✅ Complete |
| Vulnerability Mgmt | 2 | 5 | ✅ Complete |

**Total: 450+ documented pages**

---

## 🎯 Quick Reference

### **Add Page**
1. Create `.mdx` file
2. Add line to `index.mdx`: `- Name → /path`
3. Done!

### **Remove Page**
1. Comment out line in `index.mdx`
2. Done!

### **Move Page**
1. Cut line from old location in `index.mdx`
2. Paste in new location
3. Done!

### **Rename Page (in navigation)**
1. Change the text before `→` in `index.mdx`
2. Done! (file stays the same)

---

## 📚 Examples

### **Simple Page**

```markdown
## Reports

### Overview
- About Reports → `/content/6_1/reports_6_1/reports_6_1.mdx`
```

### **Page with Subsections**

```markdown
## Admin

### Configuration
- Email Templates → `/content/6_1/admin_6_1/admin/email_templates_6_1.mdx`

#### Advanced Configuration
- Custom Templates → `/content/6_1/admin_6_1/admin/custom_templates_6_1.mdx`
```

### **Nested Pages**

```markdown
## Discovery Scan

### Import from AWS
- Overview → `/content/6_1/discovery_6_1/import_from_aws/overview.mdx`
  - Import Record → `/content/6_1/discovery_6_1/import_from_aws/import_record.mdx`
    - View Details → `/content/6_1/discovery_6_1/import_from_aws/view_details.mdx`
```

---

## ✅ You're Ready!

You now know everything you need to add and manage documentation content using the TOC-driven system.

**Remember: Edit `index.mdx` and everything else happens automatically!**

Happy documenting! 📝
