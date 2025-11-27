/**
 * TOC Loader - Loads and caches the Table of Contents from index.mdx files
 * 
 * This module is responsible for loading the master TOC files and providing
 * the navigation structure to the entire application.
 */

import { parseTocFile, TocStructure } from './tocParser';
import { getIndexContent } from './indexContentMap';

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
 * Uses the indexContentMap which dynamically generates TOC content
 */
async function loadIndexContent(versionPath: string): Promise<string> {
  console.log(`🔍 Loading TOC content for version path: ${versionPath}`);
  
  // Use the getIndexContent function from indexContentMap
  const content = getIndexContent(versionPath);
  
  if (content && content.length > 0) {
    console.log(`✅ Using generated TOC content for ${versionPath}, length: ${content.length}`);
    console.log(`📄 First 300 chars:`, content.substring(0, 300));
    return content;
  }
  
  // Fallback if getIndexContent returns null
  console.warn(`⚠️ No content from indexContentMap for ${versionPath}, using fallback`);
  return generateFallbackToc(versionPath);
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