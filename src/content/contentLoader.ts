/**
 * Content Loader - Statically imports all MDX content files
 * This file maps file paths to their actual content for runtime access
 */

// Import My Dashboard 6.1 content
import dashboards61 from './6_1/my_dashboard_6_1/dashboards-6_1.mdx?raw';
import dashboardsContents61 from './6_1/my_dashboard_6_1/dashboards-contents-6_1.mdx?raw';
import dashboardsCustomization61 from './6_1/my_dashboard_6_1/dashboards-customization-6_1.mdx?raw';
import dashboardsReportActions61 from './6_1/my_dashboard_6_1/dashboards-report-actions-6_1.mdx?raw';
import myDashboard61 from './6_1/my_dashboard_6_1/my-dashboard-6_1.mdx?raw';
import myDashboardContents61 from './6_1/my_dashboard_6_1/my-dashboard-contents-6_1.mdx?raw';
import myDashboardOverview61 from './6_1/my_dashboard_6_1/my-dashboard-overview-6_1.mdx?raw';
import systemIcons61 from './6_1/my_dashboard_6_1/system-icons-6_1.mdx?raw';

// Import Admin 6.1 content - Organizational Details
import aboutOrgDetails61 from './6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx?raw';
import organizationalDetails61 from './6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx?raw';
import costCenter61 from './6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx?raw';
import departments61 from './6_1/admin_6_1/admin_org_details/departments_6_1.mdx?raw';
import departmentsMembers61 from './6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx?raw';
import designations61 from './6_1/admin_6_1/admin_org_details/designations_6_1.mdx?raw';
import holidays61 from './6_1/admin_6_1/admin_org_details/holidays_6_1.mdx?raw';
import locations61 from './6_1/admin_6_1/admin_org_details/locations_6_1.mdx?raw';
import operationalHours61 from './6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx?raw';

// Import NextGen content - Updated to use _ng file structure
// My Dashboard
import ngMyDashboardOverview from './NG/my_dashboard_ng/my-dashboard-overview-6_1.mdx?raw';
import ngDashboardOverview from './NG/my_dashboard_ng/dashboards/dashboard_overview_ng.mdx?raw';
import ngDashboardContents from './NG/my_dashboard_ng/dashboards/dashboard_contents_ng.mdx?raw';
import ngDashboardCustomization from './NG/my_dashboard_ng/dashboards/dashboard_customization_ng.mdx?raw';
import ngDashboardReportsActions from './NG/my_dashboard_ng/dashboards/dashboard_reports_actions_ng.mdx?raw';
// Application Overview
import ngSystemIcons from './NG/application_overview_ng/icons_ng.mdx?raw';
// Module overviews - using overview_ng.mdx naming
import ngItsmOverview from './NG/itsm_ng/overview_ng.mdx?raw';
import ngItamOverview from './NG/itam_ng/overview_ng.mdx?raw';
import ngSelfServiceOverview from './NG/self_service_ng/overview_ng.mdx?raw';
import ngReportsOverview from './NG/reports_ng/reports_ng.mdx?raw';
import ngProgramProjectManagementOverview from './NG/program-project-management_ng/overview_ng.mdx?raw';
import ngRiskRegisterOverview from './NG/risk_register_ng/overview_ng.mdx?raw';
// Note: CMDB, Discovery Scan, and Vulnerability Management don't have overview files
// They will fall back to DefaultContent when accessed

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
  // Admin 6.1 - Organizational Details
  '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx': aboutOrgDetails61,
  '/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx': organizationalDetails61,
  '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx': costCenter61,
  '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx': departments61,
  '/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx': departmentsMembers61,
  '/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx': designations61,
  '/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx': holidays61,
  '/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx': locations61,
  '/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx': operationalHours61,
  // NextGen content - Updated to match _ng file structure paths
  // My Dashboard
  '/content/NG/my_dashboard_ng/my-dashboard-overview-6_1.mdx': ngMyDashboardOverview,
  '/content/NG/my_dashboard_ng/dashboards/dashboard_overview_ng.mdx': ngDashboardOverview,
  '/content/NG/my_dashboard_ng/dashboards/dashboard_contents_ng.mdx': ngDashboardContents,
  '/content/NG/my_dashboard_ng/dashboards/dashboard_customization_ng.mdx': ngDashboardCustomization,
  '/content/NG/my_dashboard_ng/dashboards/dashboard_reports_actions_ng.mdx': ngDashboardReportsActions,
  // Application Overview
  '/content/NG/application_overview_ng/icons_ng.mdx': ngSystemIcons,
  // Module overviews - using overview_ng.mdx paths
  '/content/NG/itsm_ng/overview_ng.mdx': ngItsmOverview,
  '/content/NG/itam_ng/overview_ng.mdx': ngItamOverview,
  '/content/NG/self_service_ng/overview_ng.mdx': ngSelfServiceOverview,
  '/content/NG/reports_ng/reports_ng.mdx': ngReportsOverview,
  '/content/NG/program-project-management_ng/overview_ng.mdx': ngProgramProjectManagementOverview,
  '/content/NG/risk_register_ng/overview_ng.mdx': ngRiskRegisterOverview,
  // Note: Additional NextGen files can be added here as needed
  // The path resolver will return paths, and files can be imported and mapped incrementally
};

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
