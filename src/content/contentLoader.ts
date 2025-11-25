/// <reference types="vite/client" />

/**
 * Content Loader - Statically imports all MDX content files
 * This file maps file paths to their actual content for runtime access
 */

// Import all Version 6.1 content dynamically (covers every module referenced in the TOC)
const content61Modules = import.meta.glob('./6_1/**/*.mdx', {
  eager: true,
  as: 'raw',
}) as Record<string, string>;

// Import all NextGen content dynamically (covers every module referenced in the TOC)
const contentNGModules = import.meta.glob('./NG/**/*.mdx', {
  eager: true,
  as: 'raw',
}) as Record<string, string>;

/**
 * Content map - maps file paths to their content
 */
const contentMap: Record<string, string> = {};

// Dynamically add all Version 6.1 content (every module and page)
for (const [relativePath, content] of Object.entries(content61Modules)) {
  const normalizedPath = relativePath.replace('./', '/content/');
  contentMap[normalizedPath] = content;
}

// Dynamically add all NextGen content (every module and page)
for (const [relativePath, content] of Object.entries(contentNGModules)) {
  const normalizedPath = relativePath.replace('./', '/content/');
  contentMap[normalizedPath] = content;
}

/**
 * Get content for a given file path
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export function getContent(filePath: string): string | null {
  return contentMap[filePath] || null;
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
