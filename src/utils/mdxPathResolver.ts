/**
 * Utility to resolve MDX file paths based on version, module, section, and page
 */

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
}

/**
 * Convert version string to directory format
 * NextGen -> NG
 * 6.1.1 -> 6_1_1
 * 6.1 -> 6_1
 * 5.13 -> 5_13
 */
function formatVersionForPath(version: string): string {
  if (version === 'NextGen') return 'NG';
  return version.replace(/\./g, '_');
}

/**
 * Get the MDX file path for My Dashboard module in version 6.1
 * 
 * Navigation structure:
 * - My Dashboard (section: my-dashboard)
 *   - Dashboards (page: dashboards) → dashboards-6_1.mdx
 *     - Contents (page: dashboards-contents) → dashboards-contents-6_1.mdx
 *     - Customization (page: customization) → dashboards-customization-6_1.mdx
 *     - Report Actions (page: report-actions) → dashboards-report-actions-6_1.mdx
 *     - My Dashboard (page: my-dashboard-section) → my-dashboard-6_1.mdx
 *       - Contents (page: my-dashboard-contents) → my-dashboard-contents-6_1.mdx
 */
function getMyDashboard61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/my_dashboard_6_1';
  
  // Direct page-to-file mapping
  const fileMap: Record<string, string> = {
    'dashboards': 'dashboards-6_1.mdx',
    'dashboards-contents': 'dashboards-contents-6_1.mdx',
    'customization': 'dashboards-customization-6_1.mdx',
    'report-actions': 'dashboards-report-actions-6_1.mdx',
    'my-dashboard-section': 'my-dashboard-6_1.mdx',
    'my-dashboard-contents': 'my-dashboard-contents-6_1.mdx',
    'my-dashboard-overview': 'my-dashboard-overview-6_1.mdx',
    'system-icons': 'system-icons-6_1.mdx',
  };

  const fileName = fileMap[page];
  if (fileName) {
    return `${basePath}/${fileName}`;
  }

  return null;
}

/**
 * Get the MDX file path for NextGen version
 */
function getNextGenPath(module: string, section: string, page: string): string | null {
  const basePath = '/content/NG';
  
  // Special handling for my-dashboard
  if (module === 'my-dashboard') {
    if (page === 'system-icons') {
      return `${basePath}/my-dashboard/system-icons.mdx`;
    }
    // For my-dashboard-overview, NextGen doesn't have this file
    // Return null to fall back to DefaultContent
    if (page === 'my-dashboard-overview') {
      return null;
    }
  }
  
  // For NextGen, most modules have overview.mdx files
  // Map common page patterns to overview
  if (page === 'overview' || page === `${module}-overview` || page === `${section}-overview`) {
    return `${basePath}/${module}/overview.mdx`;
  }
  
  // Try generic path: /content/NG/{module}/{page}.mdx
  // If not found, will fall back to DefaultContent
  return `${basePath}/${module}/${page}.mdx`;
}

/**
 * Resolve the path to the MDX file based on navigation parameters
 */
export function resolveMDXPath({ version, module, section, page }: PathResolverParams): string | null {
  const versionDir = formatVersionForPath(version);
  
  // Special handling for NextGen
  if (version === 'NextGen') {
    return getNextGenPath(module, section, page);
  }
  
  // Special handling for My Dashboard in version 6.1
  if (module === 'my-dashboard' && version === '6.1') {
    return getMyDashboard61Path(page, section);
  }
  
  // For now, only return paths for files that actually exist in contentLoader
  // This prevents attempting to load non-existent MDX files
  // Other content will fall back to the default hardcoded content
  
  // Return null to indicate no MDX file is available
  // The component will fall back to hardcoded content
  return null;
}

/**
 * Check if a specific module/version combination has custom file structure
 */
export function hasCustomFileStructure(module: string, version: string): boolean {
  return module === 'my-dashboard' && version === '6.1';
}
