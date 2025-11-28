/**
 * Content Loader - Dynamically loads content based on TOC hierarchy
 * 
 * This loader automatically:
 * 1. Reads index.mdx files (TOC hierarchy)
 * 2. Discovers all content files
 * 3. Loads content on-demand
 * 
 * NO MANUAL UPDATES NEEDED - Just edit index.mdx files!
 */

import { 
  loadHierarchicalToc, 
  loadSectionPages, 
  type HierarchicalPage 
} from '../utils/hierarchicalTocLoader';
import { getMDXContent } from './mdxContentBundle';
import { getRegisteredContent, isContentRegistered } from './mdxContentRegistry';

// Cache for loaded content
const contentCache = new Map<string, string>();

/**
 * Extracts all file paths from hierarchical pages
 */
function extractFilePaths(pages: HierarchicalPage[]): string[] {
  const paths: string[] = [];
  
  for (const page of pages) {
    if (page.filePath) {
      paths.push(page.filePath);
    }
    if (page.subPages) {
      paths.push(...extractFilePaths(page.subPages));
    }
  }
  
  return paths;
}

/**
 * Discovers all content files from TOC hierarchy
 */
async function discoverContentFiles(version: string): Promise<string[]> {
  console.log(`📂 Discovering content files for version ${version}...`);
  
  try {
    const toc = await loadHierarchicalToc(version);
    const allPaths: string[] = [];
    
    // Iterate through all modules and sections
    for (const module of toc.modules) {
      for (const section of module.sections) {
        // Load section pages (this triggers lazy loading)
        const pages = await loadSectionPages(version, module.id, section.id);
        
        // Extract all file paths
        const paths = extractFilePaths(pages);
        allPaths.push(...paths);
      }
    }
    
    console.log(`✅ Discovered ${allPaths.length} content files for ${version}`);
    return allPaths;
  } catch (error) {
    console.error(`❌ Failed to discover content files for ${version}:`, error);
    return [];
  }
}

/**
 * Fetches content from a file path
 * Tries multiple strategies to load MDX content
 */
async function fetchContent(filePath: string): Promise<string> {
  // Safety: Remove backticks if somehow they still exist
  let cleanPath = filePath;
  if (cleanPath.startsWith('`') && cleanPath.endsWith('`')) {
    console.warn(`⚠️ Found backticks in file path, removing: ${cleanPath}`);
    cleanPath = cleanPath.slice(1, -1);
  }
  
  console.log(`📥 Fetching content from: ${cleanPath}`);
  console.log(`📥 File path length: ${cleanPath.length}, has backticks: ${cleanPath.includes('`')}`);
  
  // Strategy 1: Check the manual content registry first
  if (isContentRegistered(cleanPath)) {
    const content = getRegisteredContent(cleanPath);
    if (content) {
      console.log(`✅ Strategy 1: Loaded from registry (${content.length} chars)`);
      return content;
    }
  }
  
  // Strategy 2: Try the MDX content bundle
  try {
    const content = await getMDXContent(cleanPath);
    
    if (content) {
      console.log(`✅ Strategy 2: Loaded from MDX bundle (${content.length} chars)`);
      return content;
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 2 (MDX bundle) failed:`, error);
  }
  
  // Strategy 3: Try direct dynamic import with ?raw
  try {
    console.log(`🔄 Strategy 3: Attempting direct import with ?raw`);
    const module = await import(/* @vite-ignore */ `${cleanPath}?raw`);
    
    if (module.default && typeof module.default === 'string') {
      console.log(`✅ Strategy 3: Loaded via ?raw import (${module.default.length} chars)`);
      return module.default;
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 3 (?raw import) failed:`, error);
  }
  
  // Strategy 4: Try reading the file content directly from the module
  try {
    console.log(`🔄 Strategy 4: Attempting to read MDX file directly`);
    
    // For MDX files in Figma Make, we need to handle them specially
    // Let's try to import and extract the raw content
    const response = await fetch(cleanPath);
    
    if (response.ok) {
      const text = await response.text();
      
      // Check if we got HTML instead of MDX (Figma Make wraps files)
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        console.error(`❌ Strategy 4: Got HTML wrapper instead of raw MDX`);
        
        // Try to extract content from HTML if possible
        const match = text.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
        if (match) {
          const extracted = match[1]
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"');
          console.log(`✅ Strategy 4: Extracted from HTML wrapper (${extracted.length} chars)`);
          return extracted;
        }
      } else {
        console.log(`✅ Strategy 4: Loaded via fetch (${text.length} chars)`);
        return text;
      }
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 4 (fetch) failed:`, error);
  }
  
  // All strategies failed
  console.error(`❌ All strategies failed for ${cleanPath}`);
  throw new Error(`Content not found: ${cleanPath} - All loading strategies failed`);
}

/**
 * Gets content for a given file path
 * Automatically loads from disk on-demand
 * 
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export async function getContent(filePath: string): Promise<string | null> {
  console.log(`🔍 getContent called with: ${filePath}`);
  
  // Check cache first
  if (contentCache.has(filePath)) {
    console.log(`📦 Cache hit for ${filePath}`);
    return contentCache.get(filePath)!;
  }
  
  try {
    // Fetch content
    const content = await fetchContent(filePath);
    
    // Cache it
    contentCache.set(filePath, content);
    
    return content;
  } catch (error) {
    console.error(`Failed to get content for ${filePath}:`, error);
    return null;
  }
}

/**
 * Checks if content exists for a given file path
 * This now checks if the file is listed in TOC hierarchy
 * 
 * @param filePath - The path to the content file
 * @returns True if content exists, false otherwise
 */
export async function hasContent(filePath: string): Promise<boolean> {
  console.log(`🔍 Checking if content exists: ${filePath}`);
  
  // Check cache first
  if (contentCache.has(filePath)) {
    return true;
  }
  
  // Try to fetch it
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gets all available content paths for a version
 * Dynamically discovered from TOC hierarchy
 * 
 * @param version - Version to get paths for
 * @returns Array of all available content file paths
 */
export async function getAvailablePaths(version: string): Promise<string[]> {
  console.log(`📋 Getting available paths for version ${version}`);
  
  try {
    const paths = await discoverContentFiles(version);
    return paths;
  } catch (error) {
    console.error(`Failed to get available paths for ${version}:`, error);
    return [];
  }
}

/**
 * Preloads content for a specific version
 * Useful for improving performance
 * 
 * @param version - Version to preload
 * @param maxFiles - Maximum number of files to preload (default: 50)
 */
export async function preloadContent(version: string, maxFiles: number = 50): Promise<void> {
  console.log(`⚡ Preloading content for version ${version}...`);
  
  try {
    const paths = await discoverContentFiles(version);
    const filesToPreload = paths.slice(0, maxFiles);
    
    console.log(`📦 Preloading ${filesToPreload.length} files...`);
    
    // Load files in parallel
    const promises = filesToPreload.map(async (path) => {
      try {
        await getContent(path);
      } catch (error) {
        console.warn(`Failed to preload ${path}:`, error);
      }
    });
    
    await Promise.all(promises);
    
    console.log(`✅ Preloaded ${filesToPreload.length} files for ${version}`);
  } catch (error) {
    console.error(`Failed to preload content for ${version}:`, error);
  }
}

/**
 * Clears the content cache
 * Useful for development/hot reload
 */
export function clearContentCache(): void {
  contentCache.clear();
  console.log('🧹 Content cache cleared');
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { size: number; paths: string[] } {
  return {
    size: contentCache.size,
    paths: Array.from(contentCache.keys()),
  };
}

/**
 * Validates that all content files in TOC exist
 * Useful for checking broken links
 * 
 * @param version - Version to validate
 * @returns Object with validation results
 */
export async function validateContent(version: string): Promise<{
  total: number;
  valid: number;
  invalid: string[];
}> {
  console.log(`🔍 Validating content for version ${version}...`);
  
  const paths = await discoverContentFiles(version);
  const invalid: string[] = [];
  
  for (const path of paths) {
    const exists = await hasContent(path);
    if (!exists) {
      invalid.push(path);
    }
  }
  
  console.log(`✅ Validation complete: ${paths.length - invalid.length}/${paths.length} valid`);
  
  return {
    total: paths.length,
    valid: paths.length - invalid.length,
    invalid,
  };
}

// For backward compatibility with synchronous code
// This creates a wrapper that returns cached content or null
export function getContentSync(filePath: string): string | null {
  if (contentCache.has(filePath)) {
    return contentCache.get(filePath)!;
  }
  
  console.warn(`⚠️ getContentSync called for uncached file: ${filePath}`);
  console.warn(`Consider using getContent() (async) or preload content first`);
  
  return null;
}
