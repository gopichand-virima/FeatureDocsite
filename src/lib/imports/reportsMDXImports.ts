/**
 * Reports Module - Multi-Version Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Reports content loads instantly from bundled assets
 * 
 * Auto-synchronized from TOC files
 * Versions: NG, 6_1, 6_1_1, 5_13
 */

// ========================================
// Version 5_13
// ========================================

import reportsReports513 from '../../content/5_13/reports_5_13/reports_5_13.mdx?raw';
import reportsReportsAdHoc513 from '../../content/5_13/reports_5_13/reports_ad_hoc_5_13.mdx?raw';
import reportsReportsCanned513 from '../../content/5_13/reports_5_13/reports_canned_5_13.mdx?raw';
import reportsReportsDelete513 from '../../content/5_13/reports_5_13/reports_delete_5_13.mdx?raw';
import reportsReportsPropsConds513 from '../../content/5_13/reports_5_13/reports_props_conds_5_13.mdx?raw';
import reportsReportsRun513 from '../../content/5_13/reports_5_13/reports_run_5_13.mdx?raw';

// ========================================
// Version 6_1
// ========================================

import reportsReports61 from '../../content/6_1/reports_6_1/reports_6_1.mdx?raw';
import reportsReportsAdHoc61 from '../../content/6_1/reports_6_1/reports_ad_hoc_6_1.mdx?raw';
import reportsReportsCanned61 from '../../content/6_1/reports_6_1/reports_canned_6_1.mdx?raw';
import reportsReportsDelete61 from '../../content/6_1/reports_6_1/reports_delete_6_1.mdx?raw';
import reportsReportsPropsConds61 from '../../content/6_1/reports_6_1/reports_props_conds_6_1.mdx?raw';
import reportsReportsRun61 from '../../content/6_1/reports_6_1/reports_run_6_1.mdx?raw';

// ========================================
// Version 6_1_1
// ========================================

import reportsReports611 from '../../content/6_1_1/reports_6_1_1/reports_6_1_1.mdx?raw';
import reportsReportsAdHoc611 from '../../content/6_1_1/reports_6_1_1/reports_ad_hoc_6_1_1.mdx?raw';
import reportsReportsCanned611 from '../../content/6_1_1/reports_6_1_1/reports_canned_6_1_1.mdx?raw';
import reportsReportsDelete611 from '../../content/6_1_1/reports_6_1_1/reports_delete_6_1_1.mdx?raw';
import reportsReportsPropsConds611 from '../../content/6_1_1/reports_6_1_1/reports_props_conds_6_1_1.mdx?raw';
import reportsReportsRun611 from '../../content/6_1_1/reports_6_1_1/reports_run_6_1_1.mdx?raw';

// ========================================
// Version NG
// ========================================

import reportsReportsAdHocNG from '../../content/NG/reports_ng/reports_ad_hoc_ng.mdx?raw';
import reportsReportsCannedNG from '../../content/NG/reports_ng/reports_canned_ng.mdx?raw';
import reportsReportsDeleteNG from '../../content/NG/reports_ng/reports_delete_ng.mdx?raw';
import reportsReportsNG from '../../content/NG/reports_ng/reports_ng.mdx?raw';
import reportsReportsPropsCondsNG from '../../content/NG/reports_ng/reports_props_conds_ng.mdx?raw';
import reportsReportsRunNG from '../../content/NG/reports_ng/reports_run_ng.mdx?raw';

/**
 * Reports MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const reportsMDXContent: Record<string, string> = {
  '/content/5_13/reports_5_13/reports_5_13.mdx': reportsReports513,
  '/content/5_13/reports_5_13/reports_ad_hoc_5_13.mdx': reportsReportsAdHoc513,
  '/content/5_13/reports_5_13/reports_canned_5_13.mdx': reportsReportsCanned513,
  '/content/5_13/reports_5_13/reports_delete_5_13.mdx': reportsReportsDelete513,
  '/content/5_13/reports_5_13/reports_props_conds_5_13.mdx': reportsReportsPropsConds513,
  '/content/5_13/reports_5_13/reports_run_5_13.mdx': reportsReportsRun513,
  '/content/6_1/reports_6_1/reports_6_1.mdx': reportsReports61,
  '/content/6_1/reports_6_1/reports_ad_hoc_6_1.mdx': reportsReportsAdHoc61,
  '/content/6_1/reports_6_1/reports_canned_6_1.mdx': reportsReportsCanned61,
  '/content/6_1/reports_6_1/reports_delete_6_1.mdx': reportsReportsDelete61,
  '/content/6_1/reports_6_1/reports_props_conds_6_1.mdx': reportsReportsPropsConds61,
  '/content/6_1/reports_6_1/reports_run_6_1.mdx': reportsReportsRun61,
  '/content/6_1_1/reports_6_1_1/reports_6_1_1.mdx': reportsReports611,
  '/content/6_1_1/reports_6_1_1/reports_ad_hoc_6_1_1.mdx': reportsReportsAdHoc611,
  '/content/6_1_1/reports_6_1_1/reports_canned_6_1_1.mdx': reportsReportsCanned611,
  '/content/6_1_1/reports_6_1_1/reports_delete_6_1_1.mdx': reportsReportsDelete611,
  '/content/6_1_1/reports_6_1_1/reports_props_conds_6_1_1.mdx': reportsReportsPropsConds611,
  '/content/6_1_1/reports_6_1_1/reports_run_6_1_1.mdx': reportsReportsRun611,
  '/content/NG/reports_ng/reports_ad_hoc_ng.mdx': reportsReportsAdHocNG,
  '/content/NG/reports_ng/reports_canned_ng.mdx': reportsReportsCannedNG,
  '/content/NG/reports_ng/reports_delete_ng.mdx': reportsReportsDeleteNG,
  '/content/NG/reports_ng/reports_ng.mdx': reportsReportsNG,
  '/content/NG/reports_ng/reports_props_conds_ng.mdx': reportsReportsPropsCondsNG,
  '/content/NG/reports_ng/reports_run_ng.mdx': reportsReportsRunNG,
};

console.log(`✅ [Reports MDX Content] Loaded ${Object.keys(reportsMDXContent).length} static MDX files`);