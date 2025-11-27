import { getIndexContent } from './indexContentMap';

// Type definitions
export interface HierarchicalPage {
  id: string;
  label: string;
  filePath?: string; // If it's a page
  indexPath?: string; // If it contains subsections
  subPages?: HierarchicalPage[];
}

export interface HierarchicalSection {
  id: string;
  title: string;
  label: string;
  indexPath?: string; // Path to this section's index.mdx
  pages: HierarchicalPage[];
}

export interface HierarchicalModule {
  id: string;
  label: string;
  indexPath?: string; // Path to this module's index.mdx
  sections: HierarchicalSection[];
}

export interface HierarchicalTocStructure {
  version: string;
  modules: HierarchicalModule[];
  loadedPaths: Set<string>; // Track what's been loaded
}

// Cache for loaded structures
const hierarchicalCache = new Map<string, HierarchicalTocStructure>();
const sectionCache = new Map<string, HierarchicalSection>();

/**
 * Fetches and parses an index.mdx file from any path
 */
async function fetchIndexFile(path: string): Promise<string> {
  console.log(`📥 Fetching index file from: ${path}`);
  
  try {
    // Check if this is a main version index file that we have statically
    const versionMatch = path.match(/\/content\/([^\/]+)\/index\.mdx$/);
    if (versionMatch) {
      const versionId = versionMatch[1];
      const staticContent = getIndexContent(versionId);
      if (staticContent) {
        console.log(`✅ Using static content for ${path}, length: ${staticContent.length}`);
        return staticContent;
      }
    }
    
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`✅ Successfully fetched ${path}, length: ${content.length}`);
    return content;
  } catch (error) {
    console.error(`❌ Failed to fetch ${path}:`, error);
    throw error;
  }
}

/**
 * Parses a main index.mdx that lists modules and top-level sections
 */
function parseMainIndex(content: string, version: string): HierarchicalTocStructure {
  console.log(`🔧 Parsing main index for version: ${version}`);
  
  const lines = content.split('\n');
  const modules: HierarchicalModule[] = [];
  let currentModule: HierarchicalModule | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, blockquotes, and horizontal rules
    if (!trimmed || trimmed.startsWith('>') || trimmed === '---') {
      continue;
    }

    // Module detection (## Module Name)
    if (trimmed.startsWith('## ') && !trimmed.includes('---')) {
      const moduleName = trimmed.substring(3).trim();
      const moduleId = convertToId(moduleName);
      
      console.log(`  📁 Module: "${moduleName}" -> ID: "${moduleId}"`);
      
      currentModule = {
        id: moduleId,
        label: moduleName,
        sections: [],
      };
      modules.push(currentModule);
      continue;
    }

    // Section detection (### Section Name)
    if (trimmed.startsWith('###') && currentModule) {
      const sectionName = trimmed.replace(/^#+\s+/, '').trim();
      const sectionId = convertToId(sectionName);
      
      console.log(`    📂 Section: "${sectionName}" -> ID: "${sectionId}"`);
      
      const section: HierarchicalSection = {
        id: sectionId,
        title: sectionName,
        label: sectionName,
        pages: [],
      };
      currentModule.sections.push(section);
      continue;
    }

    // Page with path detection (- Page Name → /path/to/file.mdx or path)
    if (trimmed.startsWith('- ') && trimmed.includes('→')) {
      const match = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (match && currentModule && currentModule.sections.length > 0) {
        const pageName = match[1].trim();
        const path = match[2].trim().replace(/`/g, ''); // Remove backticks
        const pageId = convertToId(pageName);

        const page: HierarchicalPage = {
          id: pageId,
          label: pageName,
        };

        // Determine if it's a file path or a folder with index
        if (path.endsWith('.mdx')) {
          page.filePath = path;
        } else {
          // It's a folder path - should have an index.mdx
          page.indexPath = path.endsWith('/') ? `${path}index.mdx` : `${path}/index.mdx`;
        }

        const currentSection = currentModule.sections[currentModule.sections.length - 1];
        currentSection.pages.push(page);
      }
    }
  }

  if (modules.length === 0) {
    console.error(`❌ ERROR: No modules were parsed for version ${version}!`);
    console.error(`Content length: ${content.length}`);
    console.error(`First 500 chars: ${content.substring(0, 500)}`);
  } else {
    console.log(`✅ Parsed main index: ${modules.length} modules`);
    modules.forEach(m => console.log(`  - ${m.label} (${m.id}): ${m.sections.length} sections`));
  }
  
  return {
    version,
    modules,
    loadedPaths: new Set([`/content/${versionToPath(version)}/index.mdx`]),
  };
}

/**
 * Parses a section's index.mdx to get its pages
 */
function parseSectionIndex(content: string, sectionPath: string): HierarchicalPage[] {
  console.log(`🔧 Parsing section index from: ${sectionPath}`);
  
  const lines = content.split('\n');
  const pages: HierarchicalPage[] = [];
  let indentStack: { level: number; pages: HierarchicalPage[] }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, blockquotes, and horizontal rules
    if (!trimmed || trimmed.startsWith('>') || trimmed === '---' || trimmed.startsWith('#')) {
      continue;
    }

    // Page detection (- Page Name → /path or /path/to/file.mdx)
    if (trimmed.startsWith('- ') && trimmed.includes('→')) {
      const match = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (match) {
        const pageName = match[1].trim();
        const path = match[2].trim().replace(/`/g, '');
        const pageId = convertToId(pageName);

        const page: HierarchicalPage = {
          id: pageId,
          label: pageName,
        };

        // Determine if it's a file or folder
        if (path.endsWith('.mdx')) {
          page.filePath = path;
        } else {
          page.indexPath = path.endsWith('/') ? `${path}index.mdx` : `${path}/index.mdx`;
        }

        // Handle indentation for nested pages
        const indent = line.search(/\S/);
        const currentLevel = Math.floor(indent / 2);

        if (currentLevel > 0 && indentStack.length > 0) {
          // Find parent at correct level
          while (indentStack.length > 0 && indentStack[indentStack.length - 1].level >= currentLevel) {
            indentStack.pop();
          }

          if (indentStack.length > 0) {
            const parent = indentStack[indentStack.length - 1];
            const lastPage = parent.pages[parent.pages.length - 1];
            if (lastPage) {
              if (!lastPage.subPages) {
                lastPage.subPages = [];
              }
              lastPage.subPages.push(page);
              indentStack.push({ level: currentLevel, pages: lastPage.subPages });
            }
          }
        } else {
          // Top-level page
          pages.push(page);
          indentStack = [{ level: currentLevel, pages }];
        }
      }
    }
  }

  console.log(`✅ Parsed section index: ${pages.length} pages`);
  return pages;
}

/**
 * Loads the main TOC for a version
 */
export async function loadHierarchicalToc(version: string): Promise<HierarchicalTocStructure> {
  const cacheKey = version;
  
  if (hierarchicalCache.has(cacheKey)) {
    console.log(`📦 Cache hit for version: ${version}`);
    return hierarchicalCache.get(cacheKey)!;
  }

  console.log(`🚀 Loading hierarchical TOC for version: ${version}`);

  try {
    const versionPath = versionToPath(version);
    const indexPath = `/content/${versionPath}/index.mdx`;
    
    const content = await fetchIndexFile(indexPath);
    const structure = parseMainIndex(content, version);
    
    hierarchicalCache.set(cacheKey, structure);
    return structure;
  } catch (error) {
    console.error(`❌ Failed to load hierarchical TOC for ${version}:`, error);
    throw error;
  }
}

/**
 * Loads a specific section's pages (lazy loading)
 */
export async function loadSectionPages(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<HierarchicalPage[]> {
  const cacheKey = `${version}-${moduleId}-${sectionId}`;
  
  if (sectionCache.has(cacheKey)) {
    console.log(`📦 Cache hit for section: ${cacheKey}`);
    return sectionCache.get(cacheKey)!.pages;
  }

  console.log(`🚀 Loading section pages for: ${cacheKey}`);

  try {
    const structure = await loadHierarchicalToc(version);
    const module = structure.modules.find(m => m.id === moduleId);
    
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    const section = module.sections.find(s => s.id === sectionId);
    
    if (!section) {
      throw new Error(`Section not found: ${sectionId}`);
    }

    // If section has an indexPath, load it
    if (section.indexPath) {
      const content = await fetchIndexFile(section.indexPath);
      const pages = parseSectionIndex(content, section.indexPath);
      
      const loadedSection: HierarchicalSection = {
        ...section,
        pages,
      };
      
      sectionCache.set(cacheKey, loadedSection);
      return pages;
    }

    // Return existing pages if no indexPath
    return section.pages;
  } catch (error) {
    console.error(`❌ Failed to load section pages for ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * Loads a specific page's subpages (lazy loading for nested navigation)
 */
export async function loadPageSubpages(
  page: HierarchicalPage
): Promise<HierarchicalPage[]> {
  if (!page.indexPath) {
    return page.subPages || [];
  }

  console.log(`🚀 Loading subpages for: ${page.label}`);

  try {
    const content = await fetchIndexFile(page.indexPath);
    const subpages = parseSectionIndex(content, page.indexPath);
    
    // Update the page object
    page.subPages = subpages;
    
    return subpages;
  } catch (error) {
    console.error(`❌ Failed to load subpages for ${page.label}:`, error);
    return page.subPages || [];
  }
}

/**
 * Helper function to convert display name to URL-safe ID
 */
function convertToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Helper function to convert version to file path
 */
function versionToPath(version: string): string {
  const mapping: Record<string, string> = {
    '5.13': '5_13',
    '6.1': '6_1',
    '6.1.1': '6_1_1',
    'NextGen': 'NG',
  };
  return mapping[version] || version;
}

/**
 * Clears all caches
 */
export function clearHierarchicalCache(): void {
  hierarchicalCache.clear();
  sectionCache.clear();
  console.log('🧹 Hierarchical cache cleared');
}

/**
 * Gets all modules for a version
 */
export async function getHierarchicalModules(version: string): Promise<HierarchicalModule[]> {
  const toc = await loadHierarchicalToc(version);
  console.log(`📋 Available modules for ${version}:`, toc.modules.map(m => m.id));
  return toc.modules;
}

/**
 * Gets all sections for a module
 */
export async function getHierarchicalSections(
  version: string,
  moduleId: string
): Promise<HierarchicalSection[]> {
  const toc = await loadHierarchicalToc(version);
  const module = toc.modules.find(m => m.id === moduleId);
  
  if (!module) {
    console.error(`❌ Module not found in TOC: ${moduleId}`);
    console.log(`Available modules:`, toc.modules.map(m => m.id));
  }
  
  return module ? module.sections : [];
}

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  label: string;
  type: 'home' | 'version' | 'module' | 'section' | 'page' | 'nested';
  path?: string; // Optional path for navigation
}

/**
 * Builds a complete breadcrumb path for a given page
 * Returns array: [Home, Version, Module, Section, Parent1, Parent2, ..., CurrentPage]
 */
export async function buildBreadcrumbPath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<BreadcrumbItem[]> {
  console.log(`🍞 Building breadcrumb path for:`, { version, moduleId, sectionId, pageId });
  
  const breadcrumbs: BreadcrumbItem[] = [];
  
  try {
    // 1. Home
    breadcrumbs.push({ 
      label: 'Home', 
      type: 'home',
      path: '/'
    });
    
    // 2. Version
    breadcrumbs.push({ 
      label: version, 
      type: 'version',
      path: `/${version}`
    });
    
    // 3. Load TOC to get module and section
    const toc = await loadHierarchicalToc(version);
    const module = toc.modules.find(m => m.id === moduleId);
    
    if (!module) {
      console.error(`❌ Module not found: ${moduleId}`);
      return breadcrumbs;
    }
    
    // 3. Module
    breadcrumbs.push({ 
      label: module.label, 
      type: 'module',
      path: `/${version}/${moduleId}`
    });
    
    // Check if we have section and page
    const hasSection = sectionId && sectionId.trim().length > 0;
    const hasPage = pageId && pageId.trim().length > 0;
    
    if (!hasSection || !hasPage) {
      // Just return module-level breadcrumb
      console.log(`✅ Built breadcrumb path (module-level): ${breadcrumbs.length} items`);
      return breadcrumbs;
    }
    
    const section = module.sections.find(s => s.id === sectionId);
    
    if (!section) {
      console.error(`❌ Section not found: ${sectionId}`);
      return breadcrumbs;
    }
    
    // 4. Section
    breadcrumbs.push({ 
      label: section.label, 
      type: 'section',
      path: `/${version}/${moduleId}/${sectionId}`
    });
    
    // 5. Load section pages to find the full path to the page
    const pages = await loadSectionPages(version, moduleId, sectionId);
    
    // 6. Find the page and build the nested path
    const findPagePath = (
      pages: HierarchicalPage[], 
      targetId: string,
      parentPath: BreadcrumbItem[] = []
    ): BreadcrumbItem[] | null => {
      for (const page of pages) {
        if (page.id === targetId) {
          // Found the target page!
          return [
            ...parentPath,
            { 
              label: page.label, 
              type: 'page',
              path: page.filePath 
            }
          ];
        }
        
        // Search in subpages
        if (page.subPages && page.subPages.length > 0) {
          const result = findPagePath(
            page.subPages, 
            targetId,
            [
              ...parentPath,
              { 
                label: page.label, 
                type: 'nested',
                path: page.filePath || page.indexPath
              }
            ]
          );
          
          if (result) {
            return result;
          }
        }
      }
      
      return null;
    };
    
    const pagePath = findPagePath(pages, pageId);
    
    if (pagePath) {
      breadcrumbs.push(...pagePath);
      console.log(`✅ Built breadcrumb path with ${breadcrumbs.length} items`);
    } else {
      console.warn(`⚠️ Page not found in TOC: ${pageId}. Adding basic breadcrumb.`);
      // Fallback: just add the page ID as label
      breadcrumbs.push({ 
        label: pageId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
        type: 'page'
      });
    }
    
    return breadcrumbs;
  } catch (error) {
    console.error(`❌ Failed to build breadcrumb path:`, error);
    return breadcrumbs;
  }
}

/**
 * Resolves the file path for a page
 */
export async function resolveHierarchicalFilePath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  console.log(`🔍 Resolving file path for:`, { version, moduleId, sectionId, pageId });
  
  try {
    // First, check if the module exists
    const toc = await loadHierarchicalToc(version);
    const module = toc.modules.find(m => m.id === moduleId);
    
    if (!module) {
      console.error(`❌ Module "${moduleId}" not found`);
      console.log(`Available modules:`, toc.modules.map(m => `${m.label} (${m.id})`));
      
      // Try fallback: attempt direct file path construction
      console.log(`⚠️ Attempting fallback file resolution...`);
      return await fallbackFilePathResolution(version, moduleId, sectionId, pageId);
    }
    
    // Check if we're looking for a module's main page (no section/page or empty strings)
    const hasSection = sectionId && sectionId.trim().length > 0;
    const hasPage = pageId && pageId.trim().length > 0;
    
    if (!hasSection && !hasPage) {
      console.log(`📄 Looking for module main page (no section/page specified)`);
      // Return the module's index.mdx file
      const versionPath = versionToPath(version);
      const moduleIndexPath = `/content/versions/${versionPath}/${moduleId}/index.mdx`;
      console.log(`✅ Returning module index path: ${moduleIndexPath}`);
      return moduleIndexPath;

      console.error(`❌ Module "${moduleId}" has no sections or pages`);
      return null;
    }
    
    // Make sure we have a section
    if (!hasSection) {
      console.error(`❌ Section is required but not provided`);
      return null;
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
      console.error(`❌ Page "${pageId}" not found in section "${sectionId}"`);
      return await fallbackFilePathResolution(version, moduleId, sectionId, pageId);
    }
    
    console.log(`✅ Resolved to: ${page.filePath}`);
    return page.filePath || null;
  } catch (error) {
    console.error(`❌ Failed to resolve file path:`, error);
    console.log(`⚠️ Attempting fallback resolution...`);
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
  
  console.error(`❌ No file path found in TOC for:`, { module: moduleId, section: sectionId, page: pageId });
  return null;
}