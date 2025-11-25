/// <reference types="vite/client" />

/**
 * Content Loader - Dynamically imports all MDX content files
 * This file maps file paths to their actual content for runtime access
 */

/**
 * Content map - maps file paths to their content
 */
const contentMap: Record<string, string> = {};

// Only use import.meta.glob if available (Vite environment)
// In Node.js/tsx environments (like scripts), this will be undefined
const globAvailable = typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function';

if (globAvailable) {
  // Import all Version 6.1 content dynamically (covers every module referenced in the TOC)
  // Using as: 'raw' - this works reliably and loads all files (4968 modules)
  // Note: Deprecated but functional - will update when Vite 6 query syntax is stable
  const content61Modules = (import.meta as any).glob('./6_1/**/*.mdx', {
    eager: true,
    as: 'raw',
  }) as Record<string, string>;

  // Import all NextGen content dynamically (covers every module referenced in the TOC)
  const contentNGModules = (import.meta as any).glob('./NG/**/*.mdx', {
    eager: true,
    as: 'raw',
  }) as Record<string, string>;

  // Dynamically add all Version 6.1 content (every module and page)
  for (const [relativePath, content] of Object.entries(content61Modules)) {
    // Normalize path: remove './' prefix and ensure consistent format
    let normalizedPath = relativePath.replace('./', '/content/');
    // Ensure path uses forward slashes and doesn't have duplicate slashes
    normalizedPath = normalizedPath.replace(/\\/g, '/').replace(/\/+/g, '/');
    if (content && typeof content === 'string') {
      contentMap[normalizedPath] = content;
    } else {
      console.warn(`[ContentLoader] Skipping invalid content for: ${normalizedPath}`, typeof content);
    }
  }

  // Dynamically add all NextGen content (every module and page)
  for (const [relativePath, content] of Object.entries(contentNGModules)) {
    // Normalize path: remove './' prefix and ensure consistent format
    let normalizedPath = relativePath.replace('./', '/content/');
    // Ensure path uses forward slashes and doesn't have duplicate slashes
    normalizedPath = normalizedPath.replace(/\\/g, '/').replace(/\/+/g, '/');
    if (content && typeof content === 'string') {
      contentMap[normalizedPath] = content;
    } else {
      console.warn(`[ContentLoader] Skipping invalid content for: ${normalizedPath}`, typeof content);
    }
  }

  // Debug: Log content map size (both dev and production for troubleshooting)
  const contentCount = Object.keys(contentMap).length;
  console.log(`[ContentLoader] Loaded ${contentCount} content files`);

  if (contentCount === 0) {
    console.error('[ContentLoader] WARNING: No content files loaded! Check import.meta.glob configuration.');
  } else {
    const adminFiles = Object.keys(contentMap).filter(p => p.includes('admin_6_1'));
    console.log(`[ContentLoader] Admin 6.1 files: ${adminFiles.length}`);
    if (adminFiles.length > 0 && import.meta.env.DEV) {
      console.log(`[ContentLoader] Sample admin paths:`, adminFiles.slice(0, 5));
    }
  }
}

/**
 * Normalize a file path to match contentMap keys
 * Handles various path formats and ensures consistency
 */
function normalizeContentPath(filePath: string): string {
  // Remove query params and hash
  let normalized = filePath.split('?')[0].split('#')[0];
  // Ensure it starts with /content/
  if (!normalized.startsWith('/content/')) {
    normalized = `/content/${normalized.replace(/^\/+/, '')}`;
  }
  // Normalize slashes
  normalized = normalized.replace(/\\/g, '/').replace(/\/+/g, '/');
  return normalized;
}

/**
 * Get content for a given file path
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export function getContent(filePath: string): string | null {
  // Try exact match first
  let normalizedPath = normalizeContentPath(filePath);
  let content = contentMap[normalizedPath];

  // If not found, try without .mdx extension
  if (!content && normalizedPath.endsWith('.mdx')) {
    const withoutExt = normalizedPath.slice(0, -4);
    content = contentMap[withoutExt];
    if (content) {
      normalizedPath = withoutExt;
    }
  }

  // If still not found, try with .mdx extension added
  if (!content && !normalizedPath.endsWith('.mdx')) {
    const withExt = `${normalizedPath}.mdx`;
    content = contentMap[withExt];
    if (content) {
      normalizedPath = withExt;
    }
  }

  if (!content) {
    // Debug: Log available paths that are close matches (both dev and production)
    const availablePaths = Object.keys(contentMap);
    const similarPaths = availablePaths.filter(path => {
      const fileParts = normalizedPath.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      // Check if last 2-3 parts match
      const fileEnd = fileParts.slice(-2).join('/');
      const pathEnd = pathParts.slice(-2).join('/');
      return pathEnd.includes(fileEnd) || fileEnd.includes(pathEnd) ||
        path.includes(fileParts[fileParts.length - 1]) ||
        normalizedPath.includes(pathParts[pathParts.length - 1]);
    });

    console.warn(`[ContentLoader] Content not found for: ${filePath} (normalized: ${normalizedPath})`);
    console.warn(`[ContentLoader] Total available paths: ${availablePaths.length}`);

    if (similarPaths.length > 0) {
      console.warn(`[ContentLoader] Similar paths found:`, similarPaths.slice(0, 10));
    } else {
      // Show some sample paths to help debug
      const adminPaths = availablePaths.filter(p => p.includes('admin_6_1')).slice(0, 10);
      if (adminPaths.length > 0) {
        console.warn(`[ContentLoader] Sample admin paths available:`, adminPaths);
      }
    }
  }

  return content || null;
}

/**
 * Simple frontmatter parser (browser-safe, no Buffer dependency)
 * Extracts frontmatter from YAML between --- delimiters
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  // Simple YAML parser for basic key-value pairs (browser-safe)
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value: unknown = trimmed.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (typeof value === 'string') {
      if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

interface ContentEntry {
  body: string;
  frontmatter: Record<string, unknown>;
}

const parsedContentCache = new Map<string, ContentEntry>();

/**
 * Return MDX content and parsed frontmatter for a given file path (browser-safe).
 */
export function getContentEntry(filePath: string): ContentEntry | null {
  if (parsedContentCache.has(filePath)) {
    return parsedContentCache.get(filePath)!;
  }

  try {
    const raw = getContent(filePath);
    if (!raw) return null;

    const { frontmatter, body } = parseFrontmatter(raw);
    const entry: ContentEntry = {
      body: body.startsWith('\n') ? body.slice(1) : body,
      frontmatter,
    };

    parsedContentCache.set(filePath, entry);
    return entry;
  } catch (error) {
    console.error(`Error parsing content for ${filePath}:`, error);
    return null;
  }
}

/**
 * Return only the parsed frontmatter for a given file path.
 */
export function getContentFrontmatter(filePath: string): Record<string, unknown> | null {
  const entry = getContentEntry(filePath);
  return entry ? entry.frontmatter : null;
}

/**
 * Return the MDX body content (without frontmatter) for a given file path.
 */
export function getContentBody(filePath: string): string | null {
  const entry = getContentEntry(filePath);
  return entry ? entry.body : null;
}

/**
 * Check if content exists for a given file path
 * @param filePath - The path to the content file
 * @returns True if content exists, false otherwise
 */
export function hasContent(filePath: string): boolean {
  return filePath in contentMap;
}

/**
 * Get all available content paths
 * @returns Array of all available content file paths
 */
export function getAvailablePaths(): string[] {
  return Object.keys(contentMap);
}

/**
 * Find content path by file name (ignoring directory structure)
 * Useful for finding files when we only know the file name
 * @param fileName - The name of the file to find (e.g., 'operational_hours_6_1.mdx')
 * @returns The full path to the content file or null if not found
 */
export function findContentPath(fileName: string): string | null {
  const normalizedFileName = fileName.endsWith('.mdx') ? fileName : `${fileName}.mdx`;

  // Search in contentMap keys
  for (const path of Object.keys(contentMap)) {
    if (path.endsWith(`/${normalizedFileName}`)) {
      return path;
    }
  }

  return null;
}
