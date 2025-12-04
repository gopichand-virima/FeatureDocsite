/**
 * RiskRegister Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures RiskRegister content loads instantly from bundled assets
 * 
 * Auto-generated: 2025-12-04T11:24:42.054Z
 * Total files: 4
 */

import aboutRiskRegister6161 from '../../content/6_1/risk_register_6_1/about_risk_register_6_1.mdx?raw';
import riskDashboard6161 from '../../content/6_1/risk_register_6_1/risk_dashboard_6_1.mdx?raw';
import risks6161 from '../../content/6_1/risk_register_6_1/risks_6_1.mdx?raw';
import risksNew6161 from '../../content/6_1/risk_register_6_1/risks_new_6_1.mdx?raw';

/**
 * RiskRegister MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const riskregisterMDXContent: Record<string, string> = {
  '/content/6_1/risk_register_6_1/about_risk_register_6_1.mdx': aboutRiskRegister6161,
  '/content/6_1/risk_register_6_1/risk_dashboard_6_1.mdx': riskDashboard6161,
  '/content/6_1/risk_register_6_1/risks_6_1.mdx': risks6161,
  '/content/6_1/risk_register_6_1/risks_new_6_1.mdx': risksNew6161,
};

console.log(`✅ [RiskRegister MDX Content] Loaded ${Object.keys(riskregisterMDXContent).length} static MDX files`);
