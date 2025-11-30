import { mdxFileRegistry } from './mdxFileRegistry';

// Types for hierarchical TOC structure
export interface HierarchicalPage {
  id: string;
  label: string;
  filePath: string;
  order: number;
  subPages?: HierarchicalPage[];
}

export interface HierarchicalSection {
  id: string;
  label: string;
  order: number;
  pages: HierarchicalPage[];
  indexPath?: string;
}

export interface HierarchicalModule {
  id: string;
  label: string;
  sections: HierarchicalSection[];
}

export interface VersionTOC {
  [moduleId: string]: HierarchicalModule;
}

// Cache for TOC data to avoid reloading
const tocCache: Map<string, VersionTOC> = new Map();

// Version path mapping
export function versionToPath(version: string): string {
  const versionMap: Record<string, string> = {
    '5.13': '5_13',
    '6.1': '6_1',
    '6.1.1': '6_1_1',
    'NextGen': 'NG',
  };
  return versionMap[version] || version;
}

/**
 * Load TOC for a specific version
 */
export async function loadVersionTOC(version: string): Promise<VersionTOC> {
  const cacheKey = `toc_${version}`;
  
  // Check cache first
  if (tocCache.has(cacheKey)) {
    console.log(`📦 Using cached TOC for version: ${version}`);
    return tocCache.get(cacheKey)!;
  }
  
  console.log(`🔄 Loading TOC for version: ${version}`);
  
  const versionPath = versionToPath(version);
  const tocPath = `/content/versions/${versionPath}/toc.json`;
  
  try {
    const response = await fetch(tocPath);
    if (!response.ok) {
      // TOC files don't exist yet - return empty TOC silently
      console.log(`⚠️ TOC file not found for version ${version} (this is expected - using legacy navigation)`);
      return {};
    }
    
    const tocData: VersionTOC = await response.json();
    
    // Cache the loaded TOC
    tocCache.set(cacheKey, tocData);
    
    console.log(`✅ Loaded TOC for version ${version}:`, Object.keys(tocData));
    return tocData;
  } catch (error) {
    // Silently return empty TOC - the system will fall back to legacy navigation
    console.log(`⚠️ TOC not available for version ${version} - using legacy navigation`);
    return {};
  }
}

/**
 * Get all modules for a version
 */
export async function loadModules(version: string): Promise<HierarchicalModule[]> {
  const toc = await loadVersionTOC(version);
  return Object.values(toc);
}

/**
 * Get a specific module's data
 */
export async function loadModule(version: string, moduleId: string): Promise<HierarchicalModule | null> {
  const toc = await loadVersionTOC(version);
  if (!toc || Object.keys(toc).length === 0) {
    // No TOC available - return null to trigger fallback
    return null;
  }
  return toc[moduleId] || null;
}

/**
 * Get all sections for a module
 */
export async function loadModuleSections(version: string, moduleId: string): Promise<HierarchicalSection[]> {
  const module = await loadModule(version, moduleId);
  return module?.sections || [];
}

/**
 * Get a specific section's data
 */
export async function loadSection(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<HierarchicalSection | null> {
  const sections = await loadModuleSections(version, moduleId);
  return sections.find(s => s.id === sectionId) || null;
}

/**
 * Get all pages for a section
 */
export async function loadSectionPages(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<HierarchicalPage[]> {
  const section = await loadSection(version, moduleId, sectionId);
  return section?.pages || [];
}

/**
 * Get a specific page's data (including nested pages)
 */
export async function loadPage(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<HierarchicalPage | null> {
  const pages = await loadSectionPages(version, moduleId, sectionId);
  
  // Recursively search for the page
  const findPage = (pages: HierarchicalPage[]): HierarchicalPage | null => {
    for (const page of pages) {
      if (page.id === pageId) {
        return page;
      }
      if (page.subPages) {
        const found = findPage(page.subPages);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findPage(pages);
}

/**
 * Get the file path for a specific page
 * This is the primary way to get the MDX file path
 */
export async function getPageFilePath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  const page = await loadPage(version, moduleId, sectionId, pageId);
  return page?.filePath || null;
}

/**
 * Get the index path for a section (if it exists)
 */
export async function getSectionIndexPath(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<string | null> {
  const section = await loadSection(version, moduleId, sectionId);
  return section?.indexPath || null;
}

/**
 * Check if a module exists in a version
 */
export async function moduleExists(version: string, moduleId: string): Promise<boolean> {
  const module = await loadModule(version, moduleId);
  return module !== null;
}

/**
 * Check if a section exists in a module
 */
export async function sectionExists(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<boolean> {
  const section = await loadSection(version, moduleId, sectionId);
  return section !== null;
}

/**
 * Check if a page exists in a section
 */
export async function pageExists(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<boolean> {
  const page = await loadPage(version, moduleId, sectionId, pageId);
  return page !== null;
}

/**
 * Get breadcrumb data for a page
 */
export async function getBreadcrumbs(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<Array<BreadcrumbItem>> {
  const breadcrumbs: Array<BreadcrumbItem> = [];
  
  try {
    // Always add Home first
    breadcrumbs.push({ id: 'home', label: 'Home', type: 'home' });
    
    // Always add Version
    breadcrumbs.push({ id: 'version', label: version, type: 'version' });
    
    // Add module
    const module = await loadModule(version, moduleId);
    if (module) {
      breadcrumbs.push({ id: moduleId, label: module.label, type: 'module' });
    } else {
      // Fallback: use moduleId as label
      breadcrumbs.push({ id: moduleId, label: moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'module' });
    }
    
    // Add section
    const section = await loadSection(version, moduleId, sectionId);
    
    if (!section) {
      console.log(`⚠️ Section "${sectionId}" not found - using basic breadcrumb`);
      // Add section with fallback label
      breadcrumbs.push({ id: sectionId, label: sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'section' });
      // Add page with fallback label
      breadcrumbs.push({ id: pageId, label: pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'page' });
      return breadcrumbs;
    }
    
    breadcrumbs.push({ id: sectionId, label: section.label, type: 'section' });
    
    // Add page (and its parent pages if nested)
    const page = await loadPage(version, moduleId, sectionId, pageId);
    if (page) {
      // For nested pages, we need to build the path
      const findPagePath = (
        pages: HierarchicalPage[],
        targetId: string,
        path: HierarchicalPage[] = []
      ): HierarchicalPage[] | null => {
        for (const p of pages) {
          if (p.id === targetId) {
            return [...path, p];
          }
          if (p.subPages) {
            const found = findPagePath(p.subPages, targetId, [...path, p]);
            if (found) return found;
          }
        }
        return null;
      };
      
      const pagePath = findPagePath(section.pages, pageId);
      if (pagePath) {
        pagePath.forEach((p, index) => {
          const isLast = index === pagePath.length - 1;
          breadcrumbs.push({ 
            id: p.id, 
            label: p.label, 
            type: isLast ? 'page' : 'nested' 
          });
        });
      } else {
        // Page found but path couldn't be built - add it directly
        breadcrumbs.push({ id: page.id, label: page.label, type: 'page' });
      }
    } else {
      console.log(`⚠️ Page not found in TOC: ${pageId}. Adding basic breadcrumb.`);
      // Add a basic breadcrumb even if page not found in TOC
      const pageLabel = pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ id: pageId, label: pageLabel, type: 'page' });
    }
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
    // Return basic breadcrumbs even on error
    if (breadcrumbs.length === 0) {
      breadcrumbs.push({ id: 'home', label: 'Home', type: 'home' });
      breadcrumbs.push({ id: 'version', label: version, type: 'version' });
      if (moduleId) {
        breadcrumbs.push({ id: moduleId, label: moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'module' });
      }
      if (sectionId) {
        breadcrumbs.push({ id: sectionId, label: sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'section' });
      }
      if (pageId) {
        breadcrumbs.push({ id: pageId, label: pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type: 'page' });
      }
    }
  }
  
  return breadcrumbs;
}

/**
 * Get all pages in a module (flattened)
 */
export async function getAllModulePages(
  version: string,
  moduleId: string
): Promise<HierarchicalPage[]> {
  const sections = await loadModuleSections(version, moduleId);
  
  const flattenPages = (pages: HierarchicalPage[]): HierarchicalPage[] => {
    const result: HierarchicalPage[] = [];
    for (const page of pages) {
      result.push(page);
      if (page.subPages) {
        result.push(...flattenPages(page.subPages));
      }
    }
    return result;
  };
  
  const allPages: HierarchicalPage[] = [];
  for (const section of sections) {
    allPages.push(...flattenPages(section.pages));
  }
  
  return allPages;
}

/**
 * Search for pages across all sections in a module
 */
export async function searchModulePages(
  version: string,
  moduleId: string,
  query: string
): Promise<HierarchicalPage[]> {
  const allPages = await getAllModulePages(version, moduleId);
  const lowerQuery = query.toLowerCase();
  
  return allPages.filter(page => 
    page.label.toLowerCase().includes(lowerQuery) ||
    page.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Clear the TOC cache (useful for development/testing)
 */
export function clearTOCCache(): void {
  tocCache.clear();
  console.log('🗑️ TOC cache cleared');
}

/**
 * Resolve file path from module/section/page identifiers
 * This is a key function used throughout the app
 */
export async function resolveFilePath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  console.log(`🔍 Resolving file path: ${version}/${moduleId}/${sectionId}/${pageId}`);
  
  try {
    const module = await loadModule(version, moduleId);
    
    if (!module) {
      console.log(`⚠️ Module "${moduleId}" not found - trying fallback`);
      return await fallbackFilePathResolution(version, moduleId, sectionId, pageId);
    }
    
    // Check if we're looking for just the module (no section or page)
    const hasSection = sectionId && sectionId !== '';
    const hasPage = pageId && pageId !== '';
    
    if (!hasSection && !hasPage) {
      console.log(`📄 Looking for module main page (no section/page specified)`);
      // Return the module's index.mdx file
      const versionPath = versionToPath(version);
      const moduleIndexPath = `/content/versions/${versionPath}/${moduleId}/index.mdx`;
      console.log(`✅ Returning module index path: ${moduleIndexPath}`);
      return moduleIndexPath;

      console.log(`⚠️ Module "${moduleId}" has no sections or pages`);
      return null;
    }
    
    // Make sure we have a section
    if (!hasSection) {
      console.log(`⚠️ Section is required but not provided`);
      return null;
    }
    
    const section = module.sections.find(s => s.id === sectionId);
    
    if (!section) {
      // Section not found - trigger fallback
      throw new Error(`Section not found: ${sectionId}`);
    }
    
    const pages = await loadSectionPages(version, moduleId, sectionId);
    
    // Recursively search for the page
    const findPage = (pages: HierarchicalPage[]): HierarchicalPage | null => {
      for (const page of pages) {
        if (page.id === pageId) {
          return page;
        }
        if (page.subPages) {
          const found = findPage(page.subPages);
          if (found) return found;
        }
      }
      return null;
    };
    
    const page = findPage(pages);
    
    if (!page) {
      console.log(`⚠️ Page "${pageId}" not found in section "${sectionId}" - trying fallback`);
      return await fallbackFilePathResolution(version, moduleId, sectionId, pageId);
    }
    
    console.log(`✅ Resolved to: ${page.filePath}`);
    return page.filePath || null;
  } catch (error) {
    // Only log if it's not a "Section not found" error (which is expected during navigation)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('Section not found')) {
      console.error(`❌ Failed to resolve file path:`, error);
    }
    console.log(`⚠️ Primary resolution failed. Attempting fallback resolution...`);
    return await fallbackFilePathResolution(version, moduleId, sectionId, pageId);
  }
}

/**
 * Fallback file path resolution when TOC lookup fails
 * Attempts to construct path based on naming conventions
 */
async function fallbackFilePathResolution(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  console.log(`🔄 Fallback resolution for: ${version}/${moduleId}/${sectionId}/${pageId}`);
  
  const versionPath = versionToPath(version);
  
  // Common path patterns to try
  const patterns = [
    // Pattern 1: /content/VERSION/MODULE_VERSION/SECTION/PAGE_VERSION.mdx
    `/content/${versionPath}/${moduleId}_${versionPath.toLowerCase()}/${sectionId}/${pageId}_${versionPath.toLowerCase()}.mdx`,
    
    // Pattern 2: /content/VERSION/MODULE_VERSION/PAGE_VERSION.mdx
    `/content/${versionPath}/${moduleId}_${versionPath.toLowerCase()}/${pageId}_${versionPath.toLowerCase()}.mdx`,
    
    // Pattern 3: /content/VERSION/MODULE/SECTION/PAGE.mdx (without version suffix)
    `/content/${versionPath}/${moduleId}/${sectionId}/${pageId}.mdx`,
    
    // Pattern 4: /content/VERSION/MODULE/PAGE.mdx (without version suffix)
    `/content/${versionPath}/${moduleId}/${pageId}.mdx`,
    
    // Pattern 5: Direct file in module folder
    `/content/${versionPath}/${moduleId}_${versionPath.toLowerCase()}/${moduleId}_${versionPath.toLowerCase()}.mdx`,
  ];
  
  console.log(`🔍 Trying ${patterns.length} path patterns...`);
  
  // Try each pattern
  for (const pattern of patterns) {
    try {
      const response = await fetch(pattern, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ Found file at: ${pattern}`);
        return pattern;
      }
    } catch (error) {
      // Continue to next pattern
    }
  }
  
  console.log(`⚠️ No file path found in TOC for: ${moduleId}/${sectionId}/${pageId} (version: ${version})`);
  return null;
}

/**
 * Load hierarchical TOC (legacy function for backwards compatibility)
 * Returns the TOC with version metadata
 */
export async function loadHierarchicalToc(version: string): Promise<{
  version: string;
  modules: HierarchicalModule[];
}> {
  const modules = await loadModules(version);
  return {
    version,
    modules
  };
}

/**
 * Breadcrumb item type for external use
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
  type?: 'home' | 'version' | 'module' | 'section' | 'page' | 'nested';
  path?: string;
}

/**
 * Build breadcrumb path (legacy function for backwards compatibility)
 * Returns array of breadcrumb items
 */
export async function buildBreadcrumbPath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<BreadcrumbItem[]> {
  return await getBreadcrumbs(version, moduleId, sectionId, pageId);
}
