/**
 * Content Loader - FIXED STRATEGY ORDER
 * 
 * Priority: Actual MDX Files → MDX Bundle → Fetch → Registry (fallback only)
 * 
 * Strategy 1: Static MDX imports (ACTUAL CONTENT - HIGHEST PRIORITY)
 * Strategy 2: MDX Bundle (compiled content)
 * Strategy 3: Fetch from server
 * Strategy 4: Registry (FALLBACK ONLY - placeholder content)
 */

import { 
  loadHierarchicalToc, 
  loadSectionPages, 
  type HierarchicalPage 
} from '../utils/hierarchicalTocLoader';
import { getMDXContent } from './mdxContentBundle';
import { getRegisteredContent, isContentRegistered } from './mdxContentRegistry';

// Import priority file registries
import { adminMDXFilePaths, getAdminFilePath, adminMDXContent } from '../lib/imports/adminMDXImports';
import { cmdbMDXContent } from '../lib/imports/cmdbMDXImports';
import { itsmMDXContent } from '../lib/imports/itsmMDXImports';
import { discoveryMDXContent } from '../lib/imports/discoveryMDXImports';
import { itamMDXContent } from '../lib/imports/itamMDXImports';
import { dashboardMDXContent } from '../lib/imports/dashboardMDXImports';
import { applicationoverviewMDXContent } from '../lib/imports/applicationoverviewMDXImports';
import { gettingstartedMDXContent } from '../lib/imports/gettingstartedMDXImports';
import { programprojectmanagementMDXContent } from '../lib/imports/programprojectmanagementMDXImports';
import { reportsMDXContent } from '../lib/imports/reportsMDXImports';
import { riskregisterMDXContent } from '../lib/imports/riskregisterMDXImports';
import { vulnerabilitymanagementMDXContent } from '../lib/imports/vulnerabilitymanagementMDXImports';

// Combine all static MDX content maps (Strategy 1 - Highest Priority)
// This ensures all version 6.1 module content loads instantly from bundled assets
const allStaticMDXContent: Record<string, string> = {
  ...adminMDXContent,
  ...cmdbMDXContent,
  ...itsmMDXContent,
  ...discoveryMDXContent,
  ...itamMDXContent,
  ...dashboardMDXContent,
  ...applicationoverviewMDXContent,
  ...gettingstartedMDXContent,
  ...programprojectmanagementMDXContent,
  ...reportsMDXContent,
  ...riskregisterMDXContent,
  ...vulnerabilitymanagementMDXContent,
};

/**
 * Detects the base path for content files
 * Supports GitHub Pages deployment at /FeatureDocsite/
 */
function getBasePath(): string {
  // Check if we're running in browser
  if (typeof window === 'undefined') {
    return '';
  }
  
  const pathname = window.location.pathname;
  
  // Check for GitHub Pages base path
  if (pathname.startsWith('/FeatureDocsite/')) {
    return '/FeatureDocsite';
  }
  
  // Local development or other deployment
  return '';
}

// Current version (can be changed dynamically)
let currentVersion = '6_1';

/**
 * Extracts MDX content from HTML wrapper
 * Tries multiple extraction methods
 */
function extractMDXFromHTML(html: string): string | null {
  // Method 1: Try <pre> tag
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch && preMatch[1]) {
    const decoded = decodeHTMLEntities(preMatch[1]);
    // Less strict validation - just check if it has reasonable content
    if (decoded.trim().length > 20) {
      console.log(`  ✅ Method 1 (<pre>): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  // Method 2: Try <code> tag
  const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  if (codeMatch && codeMatch[1]) {
    const decoded = decodeHTMLEntities(codeMatch[1]);
    if (decoded.trim().length > 20) {
      console.log(`  ✅ Method 2 (<code>): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  // Method 3: Try nested <pre><code>
  const nestedMatch = html.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
  if (nestedMatch && nestedMatch[1]) {
    const decoded = decodeHTMLEntities(nestedMatch[1]);
    if (decoded.trim().length > 20) {
      console.log(`  ✅ Method 3 (nested): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  // Method 4: Try to find text between <body> tags
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    // Remove all HTML tags
    let content = bodyMatch[1].replace(/<[^>]+>/g, '');
    content = decodeHTMLEntities(content);
    if (content.trim().length > 50) {
      console.log(`  ✅ Method 4 (<body> strip): Extracted ${content.trim().length} chars`);
      return content.trim();
    }
  }
  
  // Method 5: Try to strip all HTML tags and decode
  let stripped = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  stripped = stripped.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  stripped = stripped.replace(/<[^>]+>/g, '');
  stripped = decodeHTMLEntities(stripped);
  
  // Less strict - just needs some content
  if (stripped.trim().length > 50) {
    console.log(`  ✅ Method 5 (strip all): Extracted ${stripped.trim().length} chars`);
    return stripped.trim();
  }
  
  // If all else fails, log detailed debug info
  console.error(`  ❌ All extraction methods failed`);
  console.log(`  📊 HTML structure:`, {
    length: html.length,
    hasDoctype: html.includes('<!DOCTYPE'),
    hasHtml: html.includes('<html'),
    hasPre: html.includes('<pre'),
    hasCode: html.includes('<code'),
    hasBody: html.includes('<body'),
    first200: html.substring(0, 200)
  });
  
  return null;
}

/**
 * Decodes HTML entities to plain text
 */
function decodeHTMLEntities(text: string): string {
  // Create a temporary element to decode entities
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  let decoded = txt.value;
  
  // Additional manual decoding for common entities
  decoded = decoded
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
  
  return decoded;
}

/**
 * Sets the current version for content loading
 * @param version - Version identifier ('6_1', '6_1_1', '5_13', 'NG')
 */
export function setVersion(version: string): void {
  const validVersions = ['6_1', '6_1_1', '5_13', 'NG'];
  
  if (!validVersions.includes(version)) {
    console.error(`❌ Invalid version: ${version}. Valid versions: ${validVersions.join(', ')}`);
    return;
  }
  
  const oldVersion = currentVersion;
  currentVersion = version;
  console.log(`🔄 [Content Loader] Version switched: ${oldVersion} → ${currentVersion}`);
  
  // Clear cache when version changes
  clearContentCache();
}

/**
 * Gets the current version
 */
export function getCurrentVersion(): string {
  return currentVersion;
}

console.log(`📦 [Content Loader] Initialized with version: ${currentVersion}`);

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
 * Gets the file path for a priority file from version-aware registry
 * @param pathOrSlug - File path or URL slug
 * @returns File path or null if not found
 */
function getPriorityFilePath(pathOrSlug: string): string | null {
  // Clean the input (remove leading/trailing slashes)
  const cleanInput = pathOrSlug.replace(/^\/+|\/+$/g, '');
  
  console.log(`🔍 [getPriorityFilePath] Input: "${cleanInput}"`);
  console.log(`🔍 [getPriorityFilePath] Current version: ${currentVersion}`);
  
  // Try admin module
  const adminPath = getAdminFilePath(cleanInput, currentVersion);
  if (adminPath) {
    console.log(`✅ [getPriorityFilePath] Found in admin registry: ${adminPath}`);
    return adminPath;
  }
  
  // Add other modules here:
  // const discoveryPath = getDiscoveryFilePath(cleanInput, currentVersion);
  // if (discoveryPath) return discoveryPath;
  
  console.log(`❌ [getPriorityFilePath] Not found in any registry`);
  return null;
}

/**
 * Checks if a path/slug is in the priority list for current version
 */
function isPriorityFile(pathOrSlug: string): boolean {
  return getPriorityFilePath(pathOrSlug) !== null;
}

/**
 * Fetches content from a file path
 * Tries multiple strategies to load MDX content (CORRECT ORDER)
 */
async function fetchContent(filePath: string): Promise<string> {
  // Safety: Remove backticks if somehow they still exist
  let cleanPath = filePath;
  if (cleanPath.startsWith('`') && cleanPath.endsWith('`')) {
    console.warn(`⚠️ Found backticks in file path, removing: ${cleanPath}`);
    cleanPath = cleanPath.slice(1, -1);
  }
  
  console.log(`📥 [fetchContent] Input: ${cleanPath}`);
  const isFullPath = cleanPath.startsWith('/content/') || cleanPath.startsWith('content/');
  console.log(`📥 [fetchContent] Is full path: ${isFullPath}`);
  console.log(`📥 [fetchContent] Current version: ${currentVersion}`);
  
  // Strategy 1: Static MDX Imports (ACTUAL CONTENT - HIGHEST PRIORITY) ⭐⭐⭐
  // Try multiple path variations to match static content
  const pathVariations = [
    cleanPath,
    cleanPath.startsWith('/') ? cleanPath.slice(1) : `/${cleanPath}`,
    cleanPath.replace(/^\/content\/versions\//, '/content/'),
    cleanPath.replace(/^\/content\//, ''),
  ];
  
  for (const pathVar of pathVariations) {
    if (allStaticMDXContent[pathVar]) {
      const content = allStaticMDXContent[pathVar];
      console.log(`✅✅ Strategy 1 (STATIC MDX IMPORT): SUCCESS! (${content.length} chars) - Matched path: ${pathVar}`);
      console.log(`📄 [Preview]:`, content.substring(0, Math.min(150, content.length)) + '...');
      return content;
    }
  }
  
  // Strategy 0: Direct Fetch with ?raw (if already a full file path) ⭐⭐
  if (isFullPath) {
    console.log(`🎯 [Strategy 0] Already a full path, attempting direct import...`);
    
    const basePath = getBasePath();
    const fullPath = basePath ? `${basePath}${cleanPath}` : cleanPath;
    console.log(`📍 [Strategy 0] Base path: "${basePath}", Full path: "${fullPath}"`);
    
    // Try Method A: Dynamic import with ?raw suffix (gets actual file content)
    try {
      const rawPath = `${fullPath}?raw`;
      const module = await import(/* @vite-ignore */ rawPath);
      
      if (module && module.default) {
        const content = module.default;
        console.log(`✅ Strategy 0A (RAW IMPORT): SUCCESS! (${content.length} chars)`);
        console.log(`📄 [Preview] First 200 chars:`, content.substring(0, Math.min(200, content.length)));
        return content;
      }
    } catch (rawError) {
      // Raw imports often fail in dev mode - this is expected, fall through to Method B
      // Suppressing detailed error to reduce console noise
    }
    
    // Try Method B: Regular fetch with HTML extraction
    try {
      const response = await fetch(fullPath);
      if (response.ok) {
        const text = await response.text();
        
        // Check if we got HTML wrapper
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          const extracted = extractMDXFromHTML(text);
          if (extracted) {
            console.log(`✅✅ Strategy 0B (HTML EXTRACTION): SUCCESS! (${extracted.length} chars)`);
            console.log(`📄 [Preview]:`, extracted.substring(0, Math.min(150, extracted.length)) + '...');
            return extracted;
          } else {
            console.error(`❌ Strategy 0B: Could not extract MDX from HTML wrapper`);
            console.log(`📄 [HTML Debug] First 500 chars:`, text.substring(0, 500));
          }
        } else {
          // Got raw MDX!
          console.log(`✅ Strategy 0B (FETCH RAW): SUCCESS! (${text.length} chars)`);
          console.log(`📄 [Preview]:`, text.substring(0, Math.min(150, text.length)) + '...');
          return text;
        }
      } else {
        console.warn(`⚠️ [Strategy 0B] Fetch failed with status ${response.status}`);
      }
    } catch (fetchError) {
      console.warn(`⚠️ [Strategy 0B] Fetch error:`, fetchError);
    }
  }
  
  // Strategy 1: Priority Fetch (ACTUAL CONTENT - HIGHEST PRIORITY) ⭐
  console.log(`🔍 [Strategy 1] Checking version-aware priority registry...`);
  console.log(`📊 [Strategy 1] Current version: ${currentVersion}`);
  console.log(`🎯 [Strategy 1] Looking for: "${cleanPath}"`);
  
  const priorityFilePath = getPriorityFilePath(cleanPath);
  if (priorityFilePath) {
    console.log(`✅ [Strategy 1] Found in priority registry! Path: ${priorityFilePath}`);
    
    const basePath = getBasePath();
    const fullPath = basePath ? `${basePath}${priorityFilePath}` : priorityFilePath;
    console.log(`📍 [Strategy 1] Full path with base: "${fullPath}"`);
    
    // Try Method A: Dynamic import with ?raw suffix
    try {
      const rawPath = `${fullPath}?raw`;
      const module = await import(/* @vite-ignore */ rawPath);
      
      if (module && module.default) {
        const content = module.default;
        console.log(`✅ Strategy 1A (PRIORITY RAW IMPORT): SUCCESS! (${content.length} chars)`);
        console.log(`📄 [Preview]:`, content.substring(0, Math.min(150, content.length)) + '...');
        return content;
      }
    } catch (rawError) {
      // Raw imports often fail in dev mode - fall through to Method B
    }
    
    // Try Method B: Regular fetch with HTML extraction
    try {
      const response = await fetch(fullPath);
      if (response.ok) {
        const text = await response.text();
        
        // Check if we got HTML wrapper instead of raw MDX
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          const extracted = extractMDXFromHTML(text);
          if (extracted) {
            console.log(`✅✅ Strategy 1B (PRIORITY HTML EXTRACTION): SUCCESS! (${extracted.length} chars)`);
            console.log(`📄 [Preview]:`, extracted.substring(0, Math.min(150, extracted.length)) + '...');
            return extracted;
          } else {
            console.error(`❌ Strategy 1B: Could not extract MDX from HTML wrapper`);
            console.log(`📄 [HTML Debug] First 500 chars:`, text.substring(0, 500));
          }
        } else {
          // Got raw MDX - perfect!
          console.log(`✅ Strategy 1B (PRIORITY FETCH RAW): SUCCESS! (${text.length} chars)`);
          console.log(`📄 [Preview]:`, text.substring(0, Math.min(150, text.length)) + '...');
          return text;
        }
      } else {
        console.error(`❌ Strategy 1B: Fetch failed with status ${response.status}`);
      }
    } catch (fetchError) {
      console.error(`❌ Strategy 1B: Fetch error:`, fetchError);
    }
  } else {
    console.log(`ℹ️ [Strategy 1] Not in priority registry for version ${currentVersion}`);
  }
  
  // Strategy 2: Try the MDX content bundle (compiled content)
  try {
    const content = await getMDXContent(cleanPath);
    
    if (content) {
      console.log(`✅ Strategy 2 (MDX Bundle): Loaded from bundle (${content.length} chars)`);
      return content;
    }
  } catch (error) {
    console.warn(`⚠️ Strategy 2 (MDX bundle) failed:`, error);
  }
  
  // Strategy 3: Try reading the file content directly
  const basePath = getBasePath();
  const fullPath = basePath ? `${basePath}${cleanPath}` : cleanPath;
  console.log(`📍 [Strategy 3] Full path with base: "${fullPath}"`);
  
  // Method A: Try dynamic import with ?raw
  try {
    const rawPath = `${fullPath}?raw`;
    const module = await import(/* @vite-ignore */ rawPath);
    
    if (module && module.default) {
      const content = module.default;
      console.log(`✅ Strategy 3A (RAW IMPORT): SUCCESS! (${content.length} chars)`);
      return content;
    }
  } catch (rawError) {
    // Raw imports often fail in dev mode - fall through to Method B
  }
  
  // Method B: Try regular fetch with HTML extraction
  try {
    const response = await fetch(fullPath);
    
    if (response.ok) {
      const text = await response.text();
      
      // Check if we got HTML instead of MDX (Figma Make wraps files)
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        const extracted = extractMDXFromHTML(text);
        if (extracted) {
          console.log(`✅✅ Strategy 3B (HTML EXTRACTION): SUCCESS! (${extracted.length} chars)`);
          console.log(`📄 [Preview]:`, extracted.substring(0, Math.min(150, extracted.length)) + '...');
          return extracted;
        } else {
          console.error(`❌ Strategy 3B: Could not extract MDX from HTML wrapper`);
          console.log(`📄 [HTML Debug] First 500 chars:`, text.substring(0, 500));
        }
      } else {
        console.log(`✅ Strategy 3B (FETCH RAW): SUCCESS! (${text.length} chars)`);
        console.log(`📄 [Preview]:`, text.substring(0, Math.min(150, text.length)) + '...');
        return text;
      }
    }
  } catch (fetchError) {
    console.warn(`⚠️ Strategy 3B (Fetch) failed:`, fetchError);
  }
  
  // Strategy 4: Registry (FALLBACK ONLY - placeholder content) ⚠️
  // Skip registry for priority files - they should always have actual content
  const isPriority = isPriorityFile(cleanPath);
  if (isPriority) {
    console.warn(`⚠️ [Strategy 4] Skipping registry for priority file: ${cleanPath}`);
    console.warn(`💡 Priority files should have actual MDX content. Check file path and fetch strategies.`);
  } else if (isContentRegistered(cleanPath)) {
    const content = getRegisteredContent(cleanPath);
    if (content) {
      console.warn(`⚠️ Strategy 4 (REGISTRY PLACEHOLDER): Using placeholder for ${cleanPath} (${content.length} chars)`);
      console.warn(`💡 Consider adding this file to static imports for actual content`);
      return content;
    }
  }
  
  // All strategies failed
  console.error(`❌ All strategies failed for ${cleanPath}`);
  throw new Error(`Content not found: ${cleanPath} - All loading strategies failed`);
}

/**
 * Strips YAML frontmatter from MDX content
 * Handles standard, malformed, and inline frontmatter
 */
function stripFrontmatter(content: string): string {
  if (!content || content.trim().length === 0) {
    return content;
  }
  
  const trimmed = content.trimStart();
  
  // Pattern 1: Standard frontmatter with --- markers
  const standardPattern = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(\r?\n|$)/;
  const standardMatch = trimmed.match(standardPattern);
  
  if (standardMatch) {
    const contentWithoutFrontmatter = trimmed.replace(standardPattern, '').trim();
    return contentWithoutFrontmatter;
  }
  
  // Pattern 2: Malformed frontmatter (only opening ---)
  const malformedPattern = /^---\s*\r?\n([\s\S]{0,500}?)(?=\r?\n\r?\n|$)/;
  const malformedMatch = trimmed.match(malformedPattern);
  if (malformedMatch && malformedMatch[1] && 
      (malformedMatch[1].includes('title:') || malformedMatch[1].includes('description:'))) {
    const contentWithoutFrontmatter = trimmed.replace(malformedPattern, '').trim();
    return contentWithoutFrontmatter;
  }
  
  // Pattern 3: Inline frontmatter at the start (without --- markers)
  const inlinePattern = /^(title:\s*["'][^"']*["']|description:\s*["'][^"']*["']|version:\s*["'][^"']*["']|module:\s*["'][^"']*["'])[\s\S]{0,500}?(?=\r?\n\r?\n|$)/;
  const inlineMatch = trimmed.match(inlinePattern);
  if (inlineMatch && trimmed.indexOf('\n\n') > 0 && trimmed.indexOf('\n\n') < 200) {
    const contentWithoutFrontmatter = trimmed.substring(trimmed.indexOf('\n\n') + 2).trim();
    return contentWithoutFrontmatter;
  }
  
  // No frontmatter detected, return as-is
  return content;
}

/**
 * Gets content for a given file path
 * Automatically loads from disk on-demand
 * Strips frontmatter before returning
 * 
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export async function getContent(filePath: string): Promise<string | null> {
  console.log(`🔍 getContent called with: ${filePath}`);
  
  // Check cache first
  if (contentCache.has(filePath)) {
    console.log(`📦 Cache hit for ${filePath}`);
    const cached = contentCache.get(filePath)!;
    // Strip frontmatter from cached content too
    return stripFrontmatter(cached);
  }
  
  try {
    // Fetch content
    const content = await fetchContent(filePath);
    
    // Strip frontmatter before caching and returning
    const cleanedContent = stripFrontmatter(content);
    
    // Cache the cleaned content
    contentCache.set(filePath, cleanedContent);
    
    return cleanedContent;
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
  
  // Try to fetch it with base path
  try {
    const basePath = getBasePath();
    const fullPath = basePath ? `${basePath}${filePath}` : filePath;
    const response = await fetch(fullPath, { method: 'HEAD' });
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
