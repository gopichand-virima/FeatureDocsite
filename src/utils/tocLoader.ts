/**
 * TOC Loader - Loads and caches the Table of Contents from index.mdx files
 * 
 * This module is responsible for loading the master TOC files and providing
 * the navigation structure to the entire application.
 */

import { parseTocFile, TocStructure } from './tocParser';
import { NG_TOC_CONTENT } from './tocContent';

// Statically import all index.mdx files as raw text
// These must be static imports for the bundler to process them
import index513Raw from '../content/5_13/index.mdx?raw';
import index61Raw from '../content/6_1/index.mdx?raw';
import index611Raw from '../content/6_1_1/index.mdx?raw';

// Helper function to extract raw string content from imports
function getRawContent(imported: any): string {
  console.log('🔍 getRawContent called with type:', typeof imported);
  
  if (typeof imported === 'string') {
    console.log('  ✅ Already a string, length:', imported.length);
    return imported;
  }
  
  if (imported && typeof imported === 'object') {
    console.log('  ℹ️ Is an object, checking for default property');
    if ('default' in imported) {
      console.log('  ℹ️ Has default property, type:', typeof imported.default);
      return typeof imported.default === 'string' ? imported.default : '';
    }
    // Sometimes Vite returns the content directly as a property
    if ('content' in imported) {
      console.log('  ℹ️ Has content property, type:', typeof imported.content);
      return typeof imported.content === 'string' ? imported.content : '';
    }
  }
  
  console.log('  ❌ Could not extract string content from import');
  return '';
}

// Process imports to ensure we have strings
const index513Content = getRawContent(index513Raw);
const index61Content = getRawContent(index61Raw);
const index611Content = getRawContent(index611Raw);
// Use hardcoded content for NG
const indexNGContent = NG_TOC_CONTENT;

console.log('🔍 NG Content after replacement (first 300 chars):', indexNGContent.substring(0, 300));
console.log('🔍 Looking for backticks in NG content:', indexNGContent.includes('`') ? 'FOUND' : 'NOT FOUND');
console.log('🔍 Looking for escaped backticks in NG content:', indexNGContent.includes('\\`') ? 'STILL ESCAPED' : 'PROPERLY UNESCAPED');

const TOC_FILES: Record<string, string> = {
  '5_13': index513Content,
  '6_1': index61Content,
  '6_1_1': index611Content,
  'NG': indexNGContent,
};

// Cache for loaded TOC structures
const tocCache: Map<string, TocStructure> = new Map();

/**
 * Available versions
 */
export const VERSIONS = ['5.13', '6.1', '6.1.1', 'NextGen'] as const;
export type Version = typeof VERSIONS[number];

/**
 * Version mapping for file paths
 */
const VERSION_PATH_MAP: Record<string, string> = {
  '5.13': '5_13',
  '6.1': '6_1',
  '6.1.1': '6_1_1',
  'NextGen': 'NG',
};

/**
 * Loads raw content from index.mdx files
 * This function fetches the files since they can't be statically imported
 */
async function loadIndexContent(versionPath: string): Promise<string> {
  // First, try to fetch from the public directory
  const indexPath = `/content/${versionPath}/index.mdx`;
  console.log(`🔍 Attempting to fetch TOC from: ${indexPath}`);
  
  try {
    const response = await fetch(indexPath);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`✅ Successfully fetched TOC, length: ${content.length}`);
    console.log(`📄 First 300 chars of fetched content:`, content.substring(0, 300));
    return content;
  } catch (fetchError) {
    console.error(`❌ Fetch failed for ${indexPath}:`, fetchError);
    
    // Fallback to embedded content if available
    console.log(`🔍 Checking embedded TOC_FILES for ${versionPath}:`, {
      exists: versionPath in TOC_FILES,
      hasContent: TOC_FILES[versionPath] && TOC_FILES[versionPath].length > 0,
      contentLength: TOC_FILES[versionPath]?.length || 0,
    });
    
    if (TOC_FILES[versionPath] && TOC_FILES[versionPath].length > 0) {
      console.log(`✅ Using embedded TOC content for ${versionPath}, length: ${TOC_FILES[versionPath].length}`);
      return TOC_FILES[versionPath];
    }
    
    // Last resort: generate fallback
    console.warn(`⚠️ Using fallback TOC structure for ${versionPath}`);
    return generateFallbackToc(versionPath);
  }
}

/**
 * Generates a minimal fallback TOC when the file cannot be loaded
 */
function generateFallbackToc(versionPath: string): string {
  const versionDisplay = pathToVersionDisplay(versionPath);
  
  return `# Virima Documentation - ${versionDisplay}

> Master Table of Contents for ${versionDisplay}

---

## My Dashboard

### Getting Started
- System Overview → \`/content/${versionPath}/my-dashboard/system-icons.mdx\`

---

## CMDB

### Overview
- CMDB Overview → \`/content/${versionPath}/cmdb/overview.mdx\`

---

## Discovery Scan

### Overview
- Discovery Overview → \`/content/${versionPath}/discovery-scan/overview.mdx\`

---

## ITAM

### Overview
- ITAM Overview → \`/content/${versionPath}/itam/overview.mdx\`

---

## ITSM

### Overview
- ITSM Overview → \`/content/${versionPath}/itsm/overview.mdx\`

---

## Vulnerability Management

### Overview
- Vulnerability Overview → \`/content/${versionPath}/vulnerability-management/overview.mdx\`

---

## Program and Project Management

### Overview
- Program Overview → \`/content/${versionPath}/program-project-management/overview.mdx\`

---

## Reports

### Overview
- Reports Overview → \`/content/${versionPath}/reports/overview.mdx\`

---

## Risk Register

### Overview
- Risk Register Overview → \`/content/${versionPath}/risk-register/overview.mdx\`

---

## Self Service

### Overview
- Self Service Overview → \`/content/${versionPath}/self-service/overview.mdx\`
`;
}

/**
 * Converts version path to display name
 */
function pathToVersionDisplay(path: string): string {
  const mapping: Record<string, string> = {
    '5_13': 'Version 5.13',
    '6_1': 'Version 6.1',
    '6_1_1': 'Version 6.1.1',
    'NG': 'NextGen',
  };
  return mapping[path] || path;
}

/**
 * Loads the TOC for a specific version
 */
export async function loadTocForVersion(version: string): Promise<TocStructure> {
  // Check cache first
  if (tocCache.has(version)) {
    console.log(`TOC cache hit for version ${version}`);
    return tocCache.get(version)!;
  }

  console.log(`Loading TOC for version ${version}...`);

  try {
    const versionPath = VERSION_PATH_MAP[version] || version;
    
    // Load the content
    const content = await loadIndexContent(versionPath);
    
    console.log(`TOC content loaded for ${version}, length: ${content.length} characters`);
    
    if (typeof content !== 'string' || content.length === 0) {
      throw new Error(`Invalid TOC content for ${version}`);
    }

    // Parse the TOC
    const structure = parseTocFile(content, version);
    
    console.log(`TOC parsed successfully for ${version}:`, {
      modulesCount: structure.modules.length,
      modules: structure.modules.map(m => m.id),
    });
    
    // Cache the result
    tocCache.set(version, structure);
    
    return structure;
  } catch (error) {
    console.error(`Failed to load TOC for version ${version}:`, error);
    
    // Return empty structure as fallback
    return {
      version,
      modules: [],
      missingFiles: [],
      validationErrors: [`Failed to load index.mdx for version ${version}: ${error}`],
    };
  }
}

/**
 * Clears the TOC cache (useful for development/hot reload)
 */
export function clearTocCache(): void {
  tocCache.clear();
}

/**
 * Gets all available modules for a version
 */
export async function getModulesForVersion(version: string): Promise<Array<{ id: string; label: string }>> {
  const toc = await loadTocForVersion(version);
  return toc.modules.map(m => ({ id: m.id, label: m.label }));
}

/**
 * Gets all sections for a specific module
 */
export async function getSectionsForModule(
  version: string,
  moduleId: string
): Promise<Array<{ id: string; title: string; label: string }>> {
  const toc = await loadTocForVersion(version);
  const module = toc.modules.find(m => m.id === moduleId);
  
  if (!module) return [];
  
  return module.sections.map(s => ({
    id: s.id,
    title: s.title,
    label: s.label,
  }));
}

/**
 * Gets the complete navigation structure for a module
 */
export async function getNavigationForModule(
  version: string,
  moduleId: string
): Promise<TocStructure['modules'][0] | null> {
  const toc = await loadTocForVersion(version);
  return toc.modules.find(m => m.id === moduleId) || null;
}

/**
 * Converts version display name to file path format
 */
export function versionToPath(version: string): string {
  return VERSION_PATH_MAP[version] || version;
}

/**
 * Converts version file path to display name
 */
export function pathToVersion(path: string): string {
  const entry = Object.entries(VERSION_PATH_MAP).find(([_, v]) => v === path);
  return entry ? entry[0] : path;
}

/**
 * Checks if a version has a TOC file
 */
export async function hasVersionToc(version: string): Promise<boolean> {
  try {
    await loadTocForVersion(version);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the default landing page for a module
 */
export async function getDefaultPageForModule(
  version: string,
  moduleId: string
): Promise<{ sectionId: string; pageId: string } | null> {
  const toc = await loadTocForVersion(version);
  const module = toc.modules.find(m => m.id === moduleId);
  
  if (!module || module.sections.length === 0) return null;
  
  const firstSection = module.sections[0];
  if (firstSection.pages.length === 0) return null;
  
  return {
    sectionId: firstSection.id,
    pageId: firstSection.pages[0].id,
  };
}