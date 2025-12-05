/**
 * Gettingstarted Module - Multi-Version Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Gettingstarted content loads instantly from bundled assets
 * 
 * Auto-synchronized from TOC files
 * Versions: NG, 6_1, 6_1_1, 5_13
 */

// ========================================
// Version 5_13
// ========================================

import gettingStartedAuthentcation513 from '../../content/5_13/getting_started_5_13/authentcation_5_13.mdx?raw';
import gettingStartedBranding513 from '../../content/5_13/getting_started_5_13/branding_5_13.mdx?raw';
import gettingStartedOrganizationDetails513 from '../../content/5_13/getting_started_5_13/organization_details_5_13.mdx?raw';
import gettingStartedSsoAuthentication513 from '../../content/5_13/getting_started_5_13/sso_authentication_5_13.mdx?raw';
import gettingStartedUserManagement513 from '../../content/5_13/getting_started_5_13/user_management_5_13.mdx?raw';

// ========================================
// Version 6_1
// ========================================

import gettingStartedAuthentcation61 from '../../content/6_1/getting_started_6_1/authentcation_6_1.mdx?raw';
import gettingStartedBranding61 from '../../content/6_1/getting_started_6_1/branding_6_1.mdx?raw';
import gettingStartedOrganizationDetails61 from '../../content/6_1/getting_started_6_1/organization_details_6_1.mdx?raw';
import gettingStartedSsoAuthentication61 from '../../content/6_1/getting_started_6_1/sso_authentication_6_1.mdx?raw';
import gettingStartedUserManagement61 from '../../content/6_1/getting_started_6_1/user_management_6_1.mdx?raw';

// ========================================
// Version 6_1_1
// ========================================

import gettingStartedAuthentcation611 from '../../content/6_1_1/getting_started_6_1_1/authentcation_6_1_1.mdx?raw';
import gettingStartedBranding611 from '../../content/6_1_1/getting_started_6_1_1/branding_6_1_1.mdx?raw';
import gettingStartedOrganizationDetails611 from '../../content/6_1_1/getting_started_6_1_1/organization_details_6_1_1.mdx?raw';
import gettingStartedSsoAuthentication611 from '../../content/6_1_1/getting_started_6_1_1/sso_authentication_6_1_1.mdx?raw';
import gettingStartedUserManagement611 from '../../content/6_1_1/getting_started_6_1_1/user_management_6_1_1.mdx?raw';

// ========================================
// Version NG
// ========================================

import gettingStartedAuthentcationNG from '../../content/NG/getting_started_ng/authentcation_ng.mdx?raw';
import gettingStartedBrandingNG from '../../content/NG/getting_started_ng/branding_ng.mdx?raw';
import gettingStartedOrganizationDetailsNG from '../../content/NG/getting_started_ng/organization_details_ng.mdx?raw';
import gettingStartedSsoAuthenticationNG from '../../content/NG/getting_started_ng/sso_authentication_ng.mdx?raw';
import gettingStartedUserManagementNG from '../../content/NG/getting_started_ng/user_management_ng.mdx?raw';

/**
 * Gettingstarted MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const gettingstartedMDXContent: Record<string, string> = {
  '/content/5_13/getting_started_5_13/authentcation_5_13.mdx': gettingStartedAuthentcation513,
  '/content/5_13/getting_started_5_13/branding_5_13.mdx': gettingStartedBranding513,
  '/content/5_13/getting_started_5_13/organization_details_5_13.mdx': gettingStartedOrganizationDetails513,
  '/content/5_13/getting_started_5_13/sso_authentication_5_13.mdx': gettingStartedSsoAuthentication513,
  '/content/5_13/getting_started_5_13/user_management_5_13.mdx': gettingStartedUserManagement513,
  '/content/6_1/getting_started_6_1/authentcation_6_1.mdx': gettingStartedAuthentcation61,
  '/content/6_1/getting_started_6_1/branding_6_1.mdx': gettingStartedBranding61,
  '/content/6_1/getting_started_6_1/organization_details_6_1.mdx': gettingStartedOrganizationDetails61,
  '/content/6_1/getting_started_6_1/sso_authentication_6_1.mdx': gettingStartedSsoAuthentication61,
  '/content/6_1/getting_started_6_1/user_management_6_1.mdx': gettingStartedUserManagement61,
  '/content/6_1_1/getting_started_6_1_1/authentcation_6_1_1.mdx': gettingStartedAuthentcation611,
  '/content/6_1_1/getting_started_6_1_1/branding_6_1_1.mdx': gettingStartedBranding611,
  '/content/6_1_1/getting_started_6_1_1/organization_details_6_1_1.mdx': gettingStartedOrganizationDetails611,
  '/content/6_1_1/getting_started_6_1_1/sso_authentication_6_1_1.mdx': gettingStartedSsoAuthentication611,
  '/content/6_1_1/getting_started_6_1_1/user_management_6_1_1.mdx': gettingStartedUserManagement611,
  '/content/NG/getting_started_ng/authentcation_ng.mdx': gettingStartedAuthentcationNG,
  '/content/NG/getting_started_ng/branding_ng.mdx': gettingStartedBrandingNG,
  '/content/NG/getting_started_ng/organization_details_ng.mdx': gettingStartedOrganizationDetailsNG,
  '/content/NG/getting_started_ng/sso_authentication_ng.mdx': gettingStartedSsoAuthenticationNG,
  '/content/NG/getting_started_ng/user_management_ng.mdx': gettingStartedUserManagementNG,
};

console.log(`✅ [Gettingstarted MDX Content] Loaded ${Object.keys(gettingstartedMDXContent).length} static MDX files`);