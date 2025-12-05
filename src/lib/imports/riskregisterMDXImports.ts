/**
 * Riskregister Module - Multi-Version Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Riskregister content loads instantly from bundled assets
 * 
 * Auto-synchronized from TOC files
 * Versions: NG, 6_1, 6_1_1, 5_13
 */

// ========================================
// Version 5_13
// ========================================

import riskRegisterAboutRiskRegister513 from '../../content/5_13/risk_register_5_13/about_risk_register_5_13.mdx?raw';
import riskRegisterRiskDashboard513 from '../../content/5_13/risk_register_5_13/risk_dashboard_5_13.mdx?raw';
import riskRegisterRisks513 from '../../content/5_13/risk_register_5_13/risks_5_13.mdx?raw';

// ========================================
// Version 6_1
// ========================================

import riskRegisterAboutRiskRegister61 from '../../content/6_1/risk_register_6_1/about_risk_register_6_1.mdx?raw';
import riskRegisterRiskDashboard61 from '../../content/6_1/risk_register_6_1/risk_dashboard_6_1.mdx?raw';
import riskRegisterRisks61 from '../../content/6_1/risk_register_6_1/risks_6_1.mdx?raw';

// ========================================
// Version 6_1_1
// ========================================

import riskRegisterAboutRiskRegister611 from '../../content/6_1_1/risk_register_6_1_1/about_risk_register_6_1_1.mdx?raw';
import riskRegisterRiskDashboard611 from '../../content/6_1_1/risk_register_6_1_1/risk_dashboard_6_1_1.mdx?raw';
import riskRegisterRisks611 from '../../content/6_1_1/risk_register_6_1_1/risks_6_1_1.mdx?raw';

// ========================================
// Version NG
// ========================================

import riskRegisterAboutRiskRegisterNG from '../../content/NG/risk_register_ng/about_risk_register_ng.mdx?raw';
import riskRegisterRiskDashboardNG from '../../content/NG/risk_register_ng/risk_dashboard_ng.mdx?raw';
import riskRegisterRisksNG from '../../content/NG/risk_register_ng/risks_ng.mdx?raw';

/**
 * Riskregister MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const riskregisterMDXContent: Record<string, string> = {
  '/content/5_13/risk_register_5_13/about_risk_register_5_13.mdx': riskRegisterAboutRiskRegister513,
  '/content/5_13/risk_register_5_13/risk_dashboard_5_13.mdx': riskRegisterRiskDashboard513,
  '/content/5_13/risk_register_5_13/risks_5_13.mdx': riskRegisterRisks513,
  '/content/6_1/risk_register_6_1/about_risk_register_6_1.mdx': riskRegisterAboutRiskRegister61,
  '/content/6_1/risk_register_6_1/risk_dashboard_6_1.mdx': riskRegisterRiskDashboard61,
  '/content/6_1/risk_register_6_1/risks_6_1.mdx': riskRegisterRisks61,
  '/content/6_1_1/risk_register_6_1_1/about_risk_register_6_1_1.mdx': riskRegisterAboutRiskRegister611,
  '/content/6_1_1/risk_register_6_1_1/risk_dashboard_6_1_1.mdx': riskRegisterRiskDashboard611,
  '/content/6_1_1/risk_register_6_1_1/risks_6_1_1.mdx': riskRegisterRisks611,
  '/content/NG/risk_register_ng/about_risk_register_ng.mdx': riskRegisterAboutRiskRegisterNG,
  '/content/NG/risk_register_ng/risk_dashboard_ng.mdx': riskRegisterRiskDashboardNG,
  '/content/NG/risk_register_ng/risks_ng.mdx': riskRegisterRisksNG,
};

console.log(`✅ [Riskregister MDX Content] Loaded ${Object.keys(riskregisterMDXContent).length} static MDX files`);