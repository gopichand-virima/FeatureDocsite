/**
 * Content Loader - Statically imports all MDX content files
 * This file maps file paths to their actual content for runtime access
 */

import matter from 'gray-matter';

// Import My Dashboard 6.1 content
import dashboards61 from './6_1/my_dashboard_6_1/dashboards-6_1.mdx?raw';
import dashboardsContents61 from './6_1/my_dashboard_6_1/dashboards-contents-6_1.mdx?raw';
import dashboardsCustomization61 from './6_1/my_dashboard_6_1/dashboards-customization-6_1.mdx?raw';
import dashboardsReportActions61 from './6_1/my_dashboard_6_1/dashboards-report-actions-6_1.mdx?raw';
import myDashboard61 from './6_1/my_dashboard_6_1/my-dashboard-6_1.mdx?raw';
import myDashboardContents61 from './6_1/my_dashboard_6_1/my-dashboard-contents-6_1.mdx?raw';
import myDashboardOverview61 from './6_1/my_dashboard_6_1/my-dashboard-overview-6_1.mdx?raw';
import systemIcons61 from './6_1/my_dashboard_6_1/system-icons-6_1.mdx?raw';

/**
 * Content map - maps file paths to their content
 */
const contentMap: Record<string, string> = {
  // My Dashboard 6.1
  '/content/6_1/my_dashboard_6_1/dashboards-6_1.mdx': dashboards61,
  '/content/6_1/my_dashboard_6_1/dashboards-contents-6_1.mdx': dashboardsContents61,
  '/content/6_1/my_dashboard_6_1/dashboards-customization-6_1.mdx': dashboardsCustomization61,
  '/content/6_1/my_dashboard_6_1/dashboards-report-actions-6_1.mdx': dashboardsReportActions61,
  '/content/6_1/my_dashboard_6_1/my-dashboard-6_1.mdx': myDashboard61,
  '/content/6_1/my_dashboard_6_1/my-dashboard-contents-6_1.mdx': myDashboardContents61,
  '/content/6_1/my_dashboard_6_1/my-dashboard-overview-6_1.mdx': myDashboardOverview61,
  '/content/6_1/my_dashboard_6_1/system-icons-6_1.mdx': systemIcons61,
};

/**
 * Get content for a given file path
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export function getContent(filePath: string): string | null {
  return contentMap[filePath] || null;
}

interface ContentEntry {
  body: string;
  frontmatter: Record<string, unknown>;
}

const parsedContentCache = new Map<string, ContentEntry>();

/**
 * Return MDX content and parsed frontmatter for a given file path.
 */
export function getContentEntry(filePath: string): ContentEntry | null {
  if (parsedContentCache.has(filePath)) {
    return parsedContentCache.get(filePath)!;
  }

  try {
    const raw = getContent(filePath);
    if (!raw) return null;

    const parsed = matter(raw);
    const entry: ContentEntry = {
      body: parsed.content.startsWith('\n') ? parsed.content.slice(1) : parsed.content,
      frontmatter: parsed.data || {},
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
