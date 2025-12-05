/**
 * Dashboard Module - Multi-Version Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Dashboard content loads instantly from bundled assets
 * 
 * Auto-synchronized from TOC files
 * Versions: NG, 6_1, 6_1_1, 5_13
 */

// ========================================
// Version 5_13
// ========================================

import dashboardDashboardAddContentsNew513 from '../../content/5_13/dashboard_5_13/dashboard_add_contents_new_5_13.mdx?raw';
import dashboardDashboardCustomization513 from '../../content/5_13/dashboard_5_13/dashboard_customization_5_13.mdx?raw';
import dashboardDashboardReportsActions513 from '../../content/5_13/dashboard_5_13/dashboard_reports_actions_5_13.mdx?raw';
import dashboardMyDashboardNew513 from '../../content/5_13/dashboard_5_13/my_dashboard_new_5_13.mdx?raw';

// ========================================
// Version 6_1
// ========================================

import dashboardDashboardAddContentsNew61 from '../../content/6_1/dashboard_6_1/dashboard_add_contents_new_6_1.mdx?raw';
import dashboardDashboardCustomization61 from '../../content/6_1/dashboard_6_1/dashboard_customization_6_1.mdx?raw';
import dashboardDashboardReportsActions61 from '../../content/6_1/dashboard_6_1/dashboard_reports_actions_6_1.mdx?raw';
import dashboardMyDashboardNew61 from '../../content/6_1/dashboard_6_1/my_dashboard_new_6_1.mdx?raw';

// ========================================
// Version 6_1_1
// ========================================

import dashboardDashboardAddContentsNew611 from '../../content/6_1_1/dashboard_6_1_1/dashboard_add_contents_new_6_1_1.mdx?raw';
import dashboardDashboardCustomization611 from '../../content/6_1_1/dashboard_6_1_1/dashboard_customization_6_1_1.mdx?raw';
import dashboardDashboardReportsActions611 from '../../content/6_1_1/dashboard_6_1_1/dashboard_reports_actions_6_1_1.mdx?raw';
import dashboardMyDashboardNew611 from '../../content/6_1_1/dashboard_6_1_1/my_dashboard_new_6_1_1.mdx?raw';

// ========================================
// Version NG
// ========================================

import dashboardDashboardAddContentsNewNG from '../../content/NG/dashboard_ng/dashboard_add_contents_new_ng.mdx?raw';
import dashboardDashboardCustomizationNG from '../../content/NG/dashboard_ng/dashboard_customization_ng.mdx?raw';
import dashboardDashboardReportsActionsNG from '../../content/NG/dashboard_ng/dashboard_reports_actions_ng.mdx?raw';
import dashboardMyDashboardNewNG from '../../content/NG/dashboard_ng/my_dashboard_new_ng.mdx?raw';

/**
 * Dashboard MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const dashboardMDXContent: Record<string, string> = {
  '/content/5_13/dashboard_5_13/dashboard_add_contents_new_5_13.mdx': dashboardDashboardAddContentsNew513,
  '/content/5_13/dashboard_5_13/dashboard_customization_5_13.mdx': dashboardDashboardCustomization513,
  '/content/5_13/dashboard_5_13/dashboard_reports_actions_5_13.mdx': dashboardDashboardReportsActions513,
  '/content/5_13/dashboard_5_13/my_dashboard_new_5_13.mdx': dashboardMyDashboardNew513,
  '/content/6_1/dashboard_6_1/dashboard_add_contents_new_6_1.mdx': dashboardDashboardAddContentsNew61,
  '/content/6_1/dashboard_6_1/dashboard_customization_6_1.mdx': dashboardDashboardCustomization61,
  '/content/6_1/dashboard_6_1/dashboard_reports_actions_6_1.mdx': dashboardDashboardReportsActions61,
  '/content/6_1/dashboard_6_1/my_dashboard_new_6_1.mdx': dashboardMyDashboardNew61,
  '/content/6_1_1/dashboard_6_1_1/dashboard_add_contents_new_6_1_1.mdx': dashboardDashboardAddContentsNew611,
  '/content/6_1_1/dashboard_6_1_1/dashboard_customization_6_1_1.mdx': dashboardDashboardCustomization611,
  '/content/6_1_1/dashboard_6_1_1/dashboard_reports_actions_6_1_1.mdx': dashboardDashboardReportsActions611,
  '/content/6_1_1/dashboard_6_1_1/my_dashboard_new_6_1_1.mdx': dashboardMyDashboardNew611,
  '/content/NG/dashboard_ng/dashboard_add_contents_new_ng.mdx': dashboardDashboardAddContentsNewNG,
  '/content/NG/dashboard_ng/dashboard_customization_ng.mdx': dashboardDashboardCustomizationNG,
  '/content/NG/dashboard_ng/dashboard_reports_actions_ng.mdx': dashboardDashboardReportsActionsNG,
  '/content/NG/dashboard_ng/my_dashboard_new_ng.mdx': dashboardMyDashboardNewNG,
};

console.log(`✅ [Dashboard MDX Content] Loaded ${Object.keys(dashboardMDXContent).length} static MDX files`);