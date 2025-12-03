# TOC Sync Script - Single Source of Truth

## Overview

This documentation describes the automatic synchronization system that keeps all navigation and content files in sync with the `index.mdx` files.

**SINGLE SOURCE OF TRUTH**: `/content/<version>/index.mdx`

## Quick Start

### Manual Sync

```bash
# Sync all versions (uses 6_1 as reference)
npm run sync-toc

# Sync specific version
npm run sync-toc -- 6_1
npm run sync-toc -- NG
npm run sync-toc -- 5_13
npm run sync-toc -- 6_1_1
```

### Auto-Watch Mode

```bash
# Watch for changes and auto-sync
npm run watch-toc
```

This will:
- Watch all `index.mdx` files for changes
- Automatically run sync when you save changes
- Debounce changes (waits 1 second after last change)

## What Gets Updated

When you edit an `index.mdx` file and run sync, the following files are automatically updated:

### 1. `src/data/navigationData.ts`
- Navigation structure for the application
- Module definitions
- Section definitions
- Page hierarchies

### 2. `src/utils/indexContentMap.ts`
- Static TOC content for all versions
- Used as fallback when dynamic loading fails
- Browser-compatible content map

## File Structure

```
/content/
├── 6_1/
│   └── index.mdx          ← Edit this for version 6.1
├── 6_1_1/
│   └── index.mdx          ← Edit this for version 6.1.1
├── 5_13/
│   └── index.mdx          ← Edit this for version 5.13
└── NG/
    └── index.mdx          ← Edit this for NextGen

/scripts/
├── sync-toc-from-index.mjs    ← Main sync script
└── watch-toc.mjs              ← Watch mode script

/src/data/
└── navigationData.ts          ← AUTO-GENERATED (do not edit)

/src/utils/
└── indexContentMap.ts         ← AUTO-GENERATED (do not edit)
```

## index.mdx Format

The `index.mdx` file uses a simple markdown structure:

```markdown
# Virima Documentation - Version 6.1

> Master Table of Contents for Version 6.1

---

## Module Name

### Section Name

- Page Name → /content/6_1/path/to/file.mdx
- Another Page → /content/6_1/path/to/another.mdx
  - Sub Page → /content/6_1/path/to/subpage.mdx
  - Another Sub Page → /content/6_1/path/to/another-sub.mdx

### Another Section

- Page Name → /content/6_1/path/to/file.mdx

#### Subsection Name

- Subsection Page → /content/6_1/path/to/subsection.mdx

---

## Another Module

### Section Name

- Page Name → /content/6_1/path/to/file.mdx
```

### Format Rules

1. **Modules**: `## Module Name` (H2)
2. **Sections**: `### Section Name` (H3)
3. **Subsections**: `#### Subsection Name` (H4)
4. **Pages**: `- Page Name → /path/to/file.mdx`
   - Use 2-space indentation for nested pages
   - Arrow (`→`) separates title from path

## Workflow

### Adding a New Page

1. Edit the appropriate `index.mdx` file
2. Add the page entry: `- Page Name → /content/version/path/to/file.mdx`
3. Run `npm run sync-toc` (or it will auto-sync if watching)
4. The navigation will automatically update!

### Adding a New Section

1. Edit the appropriate `index.mdx` file
2. Add a new `### Section Name` header
3. Add pages under it
4. Run `npm run sync-toc`

### Adding a New Module

1. Edit the appropriate `index.mdx` file
2. Add a new `## Module Name` header
3. Add sections and pages under it
4. Update `MODULE_VAR_MAP` in `scripts/sync-toc-from-index.mjs` if needed
5. Run `npm run sync-toc`

## Integration with Build Process

The sync script runs automatically before builds:

```json
{
  "scripts": {
    "prebuild": "npm run sync-toc"
  }
}
```

This ensures that navigation data is always up-to-date in production builds.

## Troubleshooting

### Script fails to parse index.mdx

- Check that the file uses proper markdown syntax
- Ensure all list items use the arrow format: `- Name → /path`
- Verify indentation is consistent (2 spaces per level)

### Navigation not updating

- Make sure you ran `npm run sync-toc` after editing
- Check that the generated files were updated (check timestamps)
- Verify the module ID exists in `MODULE_VAR_MAP`

### Watch mode not working

- Ensure you're using Node.js 18+ (for ES modules)
- Check that file paths are correct
- Try running sync manually first

## Best Practices

1. **Always edit index.mdx, never the generated files**
2. **Run sync after making changes** (or use watch mode)
3. **Test navigation after syncing** to ensure everything works
4. **Commit both index.mdx and generated files** to version control
5. **Use consistent naming** for modules, sections, and pages

## Version Control

Both source (`index.mdx`) and generated files should be committed:

```bash
git add src/content/*/index.mdx
git add src/data/navigationData.ts
git add src/utils/indexContentMap.ts
git commit -m "Update navigation structure"
```

This ensures:
- Team members always have the latest navigation
- Builds work correctly on CI/CD
- History of navigation changes is preserved

## Support

For issues or questions:
1. Check the generated files for syntax errors
2. Verify index.mdx format matches examples
3. Review console output from sync script
4. Check that all file paths in index.mdx are valid

