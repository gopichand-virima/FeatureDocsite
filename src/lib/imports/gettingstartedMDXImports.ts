/**
 * GettingStarted Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures GettingStarted content loads instantly from bundled assets
 * 
 * Auto-generated: 2025-12-04T11:24:42.049Z
 * Total files: 6
 */

import authentcation6161 from '../../content/6_1/getting_started_6_1/authentcation_6_1.mdx?raw';
import branding6161 from '../../content/6_1/getting_started_6_1/branding_6_1.mdx?raw';
import organizationDetails6161 from '../../content/6_1/getting_started_6_1/organization_details_6_1.mdx?raw';
import ssoAuthentication6161 from '../../content/6_1/getting_started_6_1/sso_authentication_6_1.mdx?raw';
import userManagement6161 from '../../content/6_1/getting_started_6_1/user_management_6_1.mdx?raw';
import userSettings6161 from '../../content/6_1/getting_started_6_1/user_settings_6_1.mdx?raw';

/**
 * GettingStarted MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const gettingstartedMDXContent: Record<string, string> = {
  '/content/6_1/getting_started_6_1/authentcation_6_1.mdx': authentcation6161,
  '/content/6_1/getting_started_6_1/branding_6_1.mdx': branding6161,
  '/content/6_1/getting_started_6_1/organization_details_6_1.mdx': organizationDetails6161,
  '/content/6_1/getting_started_6_1/sso_authentication_6_1.mdx': ssoAuthentication6161,
  '/content/6_1/getting_started_6_1/user_management_6_1.mdx': userManagement6161,
  '/content/6_1/getting_started_6_1/user_settings_6_1.mdx': userSettings6161,
};

console.log(`✅ [GettingStarted MDX Content] Loaded ${Object.keys(gettingstartedMDXContent).length} static MDX files`);
