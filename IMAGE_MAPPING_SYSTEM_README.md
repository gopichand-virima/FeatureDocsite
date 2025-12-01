# Version-Aware Image-to-Content Mapping System

## Overview

This system automatically scans all `.mdx` content files, detects image references within them, and intelligently maps each reference to the correct version-specific image from the assets folder — ensuring every image path resolves to the appropriate version's asset.

## Problem Solved

Image filenames may be identical across versions (e.g., `dashboard_overview.png` exists in both NG and 6_1). The system ensures each MDX file references the image from its own version's folder — not a generic or incorrect version.

## How It Works

### 1. Version Detection from MDX Path
- Analyzes the MDX file's directory path to determine version context (NG, 6_1, 6_1_1, 5_13)
- Example: `/content/NG/dashboards/overview.mdx` → Version: `NG`

### 2. Image Reference Scanning
- Parses each MDX file to identify all image references:
  - Markdown: `![alt](path)`
  - HTML: `<img src="path">`
  - Relative paths: `../Resources/Images/...`

### 3. Intelligent Version Mapping
- Maps each detected image reference to the correct version-specific image path
- Example: `../Resources/Images/admin_org_details/cost_center.png` → `/images/6_1/admin_org_details/cost_center.png`

### 4. Automatic Path Correction
- If an MDX file references an image without version context, auto-resolves to the correct versioned path
- Preserves subdirectory structure (e.g., `admin_org_details/` folder structure)

### 5. Existence Validation
- Verifies that the resolved image file exists in the assets folder
- Performs case-insensitive search if exact match not found

## Usage

### Run the Scan

```powershell
.\scripts\image-mapping-system.ps1
```

### Output Files

1. **IMAGE_MAPPING_REPORT.txt** - Human-readable report with:
   - Summary statistics
   - Version breakdown
   - Files with missing images
   - Sample valid mappings

2. **IMAGE_MAPPING_REPORT.json** - Machine-readable JSON report with complete data

## Example Output

```
=== IMAGE MAPPING REPORT ===

SUMMARY
   Total MDX Files Scanned: 4061
   Total Image References: 28
   [OK] Valid Images: 28
   [MISSING] Missing Images: 0

VERSION BREAKDOWN
   6_1 :
      Files: 971
      Images: 22
      Missing: 0
   NG :
      Files: 1146
      Images: 6
      Missing: 0
```

## Mapping Flow Example

```
Scan MDX file: /content/NG/dashboards/overview.mdx
                    ↓
Detect version from path: NG 
                    ↓
Find image references in MDX:
   - ![Dashboard](../Resources/Images/admin_org_details/cost_center.png)
                    ↓
Map to version-specific assets:
   - /images/NG/admin_org_details/cost_center.png ✅
                    ↓
Validate existence: ✅ Found
```

## Features

- ✅ Automatic version detection from file paths
- ✅ Supports multiple image reference formats (Markdown, HTML, relative paths)
- ✅ Preserves subdirectory structure in image paths
- ✅ Case-insensitive file matching
- ✅ Comprehensive reporting (text + JSON)
- ✅ Identifies missing images with exact expected paths
- ✅ Version-specific path resolution

## Requirements Checklist

| Requirement | Status |
|------------|--------|
| Version detection | ✅ Implemented |
| Image extraction | ✅ Implemented |
| Version-aware resolution | ✅ Implemented |
| Existence validation | ✅ Implemented |
| Report generation | ✅ Implemented |
| Auto-correction (optional) | 🔄 Can be added |

## Next Steps (Optional Enhancements)

1. **Auto-correction**: Automatically update MDX files with corrected paths
2. **Batch fixing**: Fix all missing image references in one pass
3. **Image migration**: Copy missing images to correct version folders
4. **Validation in CI/CD**: Run as part of build process to catch issues early

## Files

- `scripts/image-mapping-system.ps1` - Main PowerShell script
- `scripts/image-mapping-system.ts` - TypeScript version (for future Node.js integration)
- `IMAGE_MAPPING_REPORT.txt` - Latest scan report
- `IMAGE_MAPPING_REPORT.json` - Latest JSON report

