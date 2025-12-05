/**
 * Selfservice Module - Multi-Version Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Selfservice content loads instantly from bundled assets
 * 
 * Auto-synchronized from TOC files
 * Versions: NG, 6_1, 6_1_1, 5_13
 */

// ========================================
// Version 5_13
// ========================================

import selfServiceAboutSelfService513 from '../../content/5_13/self_service_5_13/about_self_service_5_13.mdx?raw';
import selfServiceServiceCatalog513 from '../../content/5_13/self_service_5_13/service_catalog_5_13.mdx?raw';
import selfServiceMyIncidents513 from '../../content/5_13/self_service_5_13/my_incidents_5_13.mdx?raw';
import selfServiceMyRequests513 from '../../content/5_13/self_service_5_13/my_requests_5_13.mdx?raw';

// ========================================
// Version 6_1
// ========================================

import selfServiceAboutSelfService61 from '../../content/6_1/self_service_6_1/about_self_service_6_1.mdx?raw';
import selfServiceServiceCatalog61 from '../../content/6_1/self_service_6_1/service_catalog_6_1.mdx?raw';
import selfServiceMyIncidents61 from '../../content/6_1/self_service_6_1/my_incidents_6_1.mdx?raw';
import selfServiceMyRequests61 from '../../content/6_1/self_service_6_1/my_requests_6_1.mdx?raw';

// ========================================
// Version 6_1_1
// ========================================

import selfServiceAboutSelfService611 from '../../content/6_1_1/self_service_6_1_1/about_self_service_6_1_1.mdx?raw';
import selfServiceServiceCatalog611 from '../../content/6_1_1/self_service_6_1_1/service_catalog_6_1_1.mdx?raw';
import selfServiceMyIncidents611 from '../../content/6_1_1/self_service_6_1_1/my_incidents_6_1_1.mdx?raw';
import selfServiceMyRequests611 from '../../content/6_1_1/self_service_6_1_1/my_requests_6_1_1.mdx?raw';

// ========================================
// Version NG
// ========================================

import selfServiceAboutSelfServiceNG from '../../content/NG/self_service_ng/about_self_service_ng.mdx?raw';
import selfServiceServiceCatalogNG from '../../content/NG/self_service_ng/service_catalog_ng.mdx?raw';
import selfServiceMyIncidentsNG from '../../content/NG/self_service_ng/my_incidents_ng.mdx?raw';
import selfServiceMyRequestsNG from '../../content/NG/self_service_ng/my_requests_ng.mdx?raw';

/**
 * Selfservice MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const selfserviceMDXContent: Record<string, string> = {
  '/content/5_13/self_service_5_13/about_self_service_5_13.mdx': selfServiceAboutSelfService513,
  '/content/5_13/self_service_5_13/service_catalog_5_13.mdx': selfServiceServiceCatalog513,
  '/content/5_13/self_service_5_13/my_incidents_5_13.mdx': selfServiceMyIncidents513,
  '/content/5_13/self_service_5_13/my_requests_5_13.mdx': selfServiceMyRequests513,
  '/content/6_1/self_service_6_1/about_self_service_6_1.mdx': selfServiceAboutSelfService61,
  '/content/6_1/self_service_6_1/service_catalog_6_1.mdx': selfServiceServiceCatalog61,
  '/content/6_1/self_service_6_1/my_incidents_6_1.mdx': selfServiceMyIncidents61,
  '/content/6_1/self_service_6_1/my_requests_6_1.mdx': selfServiceMyRequests61,
  '/content/6_1_1/self_service_6_1_1/about_self_service_6_1_1.mdx': selfServiceAboutSelfService611,
  '/content/6_1_1/self_service_6_1_1/service_catalog_6_1_1.mdx': selfServiceServiceCatalog611,
  '/content/6_1_1/self_service_6_1_1/my_incidents_6_1_1.mdx': selfServiceMyIncidents611,
  '/content/6_1_1/self_service_6_1_1/my_requests_6_1_1.mdx': selfServiceMyRequests611,
  '/content/NG/self_service_ng/about_self_service_ng.mdx': selfServiceAboutSelfServiceNG,
  '/content/NG/self_service_ng/service_catalog_ng.mdx': selfServiceServiceCatalogNG,
  '/content/NG/self_service_ng/my_incidents_ng.mdx': selfServiceMyIncidentsNG,
  '/content/NG/self_service_ng/my_requests_ng.mdx': selfServiceMyRequestsNG,
};

console.log(`✅ [Selfservice MDX Content] Loaded ${Object.keys(selfserviceMDXContent).length} static MDX files`);

