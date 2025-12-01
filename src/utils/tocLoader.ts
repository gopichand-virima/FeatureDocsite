/**
 * TOC Loader - Loads and caches the Table of Contents from index.mdx files
 * 
 * This module is responsible for loading the master TOC files and providing
 * the navigation structure to the entire application.
 */

import { parseTocFile, TocStructure } from './tocParser';
import { getIndexContent, indexContentMap } from './indexContentMap';

// Cache for loaded TOC structures
// Cache version - increment this when parser logic changes to invalidate old cache
const CACHE_VERSION = 3; // Incremented to force refresh after switching to fetch actual index.mdx files
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
 * Gets the base path for content requests (handles GitHub Pages deployment)
 */
function getBasePath(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const pathname = window.location.pathname;
  if (pathname.startsWith('/FeatureDocsite/')) {
    return '/FeatureDocsite';
  }
  return '';
}

/**
 * Loads raw content from index.mdx files
 * Fetches the actual index.mdx file from the content directory
 */
async function loadIndexContent(versionPath: string): Promise<string> {
  console.log(`🔍 [TOC Loader] Loading TOC content for version path: ${versionPath}`);
  
  try {
    // Fetch the actual index.mdx file
    const basePath = getBasePath();
    const indexPath = `${basePath}/content/${versionPath}/index.mdx`;
    console.log(`📥 [TOC Loader] Fetching index file from: ${indexPath}`);
    
    const response = await fetch(indexPath);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    
    if (content && content.length > 0) {
      console.log(`✅ [TOC Loader] Loaded TOC content for ${versionPath}, length: ${content.length}`);
      console.log(`📄 [TOC Loader] First 200 chars:`, content.substring(0, 200));
      console.log(`📄 [TOC Loader] Has "## Admin"?:`, content.includes('## Admin'));
      console.log(`📄 [TOC Loader] Has "## Application Overview"?:`, content.includes('## Application Overview'));
      return content;
    }
    
    throw new Error(`Empty content loaded from ${indexPath}`);
  } catch (error) {
    console.error(`❌ [TOC Loader] Failed to fetch index.mdx for ${versionPath}:`, error);
    
    // Fallback to hardcoded content map if fetch fails
    console.warn(`⚠️ [TOC Loader] Falling back to content map for ${versionPath}`);
    const fallbackContent = getIndexContent(versionPath);
    
    if (fallbackContent && fallbackContent.length > 0) {
      console.log(`✅ [TOC Loader] Using fallback content, length: ${fallbackContent.length}`);
      return fallbackContent;
    }
    
    // Last resort: generate minimal fallback
    console.warn(`⚠️ [TOC Loader] No content found in map for ${versionPath}, using minimal fallback`);
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
  // Create cache key with version number to invalidate on parser changes
  const cacheKey = `${version}_v${CACHE_VERSION}`;
  
  // Check cache first
  if (tocCache.has(cacheKey)) {
    console.log(`✅ TOC cache hit for version ${version} (cache v${CACHE_VERSION})`);
    return tocCache.get(cacheKey)!;
  }

  console.log(`🔄 Loading fresh TOC for version ${version} (cache v${CACHE_VERSION})...`);

  try {
    const versionPath = VERSION_PATH_MAP[version] || version;
    
    // Load the content
    const content = await loadIndexContent(versionPath);
    
    console.log(`TOC content loaded for ${version}, length: ${content.length} characters`);
    
    if (typeof content !== 'string' || content.length === 0) {
      throw new Error(`Invalid TOC content for ${version}`);
    }

    // Debug: Check content before parsing
    console.log('🔍 [TOC Loader] About to parse content...');
    console.log('🔍 [TOC Loader] Content type:', typeof content);
    console.log('🔍 [TOC Loader] Content length:', content.length);
    console.log('🔍 [TOC Loader] First char code:', content.charCodeAt(0));
    console.log('🔍 [TOC Loader] Has ## Application Overview:', content.includes('## Application Overview'));
    console.log('🔍 [TOC Loader] Content substring 0-100:', content.substring(0, 100));
    
    // Parse the TOC
    const structure = parseTocFile(content, version);
    
    console.log(`TOC parsed successfully for ${version}:`, {
      modulesCount: structure.modules.length,
      modules: structure.modules.map(m => m.id),
    });
    
    // Cache the result with versioned key
    tocCache.set(cacheKey, structure);
    console.log(`✅ Cached TOC for ${version} with key: ${cacheKey}`);
    
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
  console.log('🗑️ TOC cache cleared - next load will read fresh index.mdx files');
}

/**
 * Clears cache for a specific version
 */
export function clearTocCacheForVersion(version: string): void {
  // Clear all cache keys for this version (including versioned variants)
  const keysToDelete: string[] = [];
  for (const key of tocCache.keys()) {
    if (key.startsWith(version)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => tocCache.delete(key));
  console.log(`🗑️ TOC cache cleared for version ${version} (${keysToDelete.length} entries)`);
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