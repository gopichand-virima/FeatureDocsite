/**
 * Reports Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Reports content loads instantly from bundled assets
 * 
 * Auto-generated: 2025-12-04T11:24:42.053Z
 * Total files: 8
 */

import reports6161 from '../../content/6_1/reports_6_1/reports_6_1.mdx?raw';
import reportsAdHoc6161 from '../../content/6_1/reports_6_1/reports_ad_hoc_6_1.mdx?raw';
import reportsCanned6161 from '../../content/6_1/reports_6_1/reports_canned_6_1.mdx?raw';
import reportsDelete6161 from '../../content/6_1/reports_6_1/reports_delete_6_1.mdx?raw';
import reportsNewAdHoc6161 from '../../content/6_1/reports_6_1/reports_new_ad_hoc_6_1.mdx?raw';
import reportsNewCanned6161 from '../../content/6_1/reports_6_1/reports_new_canned_6_1.mdx?raw';
import reportsPropsConds6161 from '../../content/6_1/reports_6_1/reports_props_conds_6_1.mdx?raw';
import reportsRun6161 from '../../content/6_1/reports_6_1/reports_run_6_1.mdx?raw';

/**
 * Reports MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const reportsMDXContent: Record<string, string> = {
  '/content/6_1/reports_6_1/reports_6_1.mdx': reports6161,
  '/content/6_1/reports_6_1/reports_ad_hoc_6_1.mdx': reportsAdHoc6161,
  '/content/6_1/reports_6_1/reports_canned_6_1.mdx': reportsCanned6161,
  '/content/6_1/reports_6_1/reports_delete_6_1.mdx': reportsDelete6161,
  '/content/6_1/reports_6_1/reports_new_ad_hoc_6_1.mdx': reportsNewAdHoc6161,
  '/content/6_1/reports_6_1/reports_new_canned_6_1.mdx': reportsNewCanned6161,
  '/content/6_1/reports_6_1/reports_props_conds_6_1.mdx': reportsPropsConds6161,
  '/content/6_1/reports_6_1/reports_run_6_1.mdx': reportsRun6161,
};

console.log(`✅ [Reports MDX Content] Loaded ${Object.keys(reportsMDXContent).length} static MDX files`);
