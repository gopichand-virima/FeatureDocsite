/**
 * Dashboard Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Dashboard content loads instantly from bundled assets
 * 
 * Auto-generated: 2025-12-04T11:24:42.044Z
 * Total files: 4
 */

import dashboardAddContentsNew6161 from '../../content/6_1/dashboard_6_1/dashboard_add_contents_new_6_1.mdx?raw';
import dashboardCustomization6161 from '../../content/6_1/dashboard_6_1/dashboard_customization_6_1.mdx?raw';
import dashboardReportsActions6161 from '../../content/6_1/dashboard_6_1/dashboard_reports_actions_6_1.mdx?raw';
import myDashboardNew6161 from '../../content/6_1/dashboard_6_1/my_dashboard_new_6_1.mdx?raw';

/**
 * Dashboard MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const dashboardMDXContent: Record<string, string> = {
  '/content/6_1/dashboard_6_1/dashboard_add_contents_new_6_1.mdx': dashboardAddContentsNew6161,
  '/content/6_1/dashboard_6_1/dashboard_customization_6_1.mdx': dashboardCustomization6161,
  '/content/6_1/dashboard_6_1/dashboard_reports_actions_6_1.mdx': dashboardReportsActions6161,
  '/content/6_1/dashboard_6_1/my_dashboard_new_6_1.mdx': myDashboardNew6161,
};

console.log(`✅ [Dashboard MDX Content] Loaded ${Object.keys(dashboardMDXContent).length} static MDX files`);
