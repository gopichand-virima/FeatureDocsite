/**
 * Admin Module - Version-Keyed Path Registry
 * 
 * Maps URL slugs to actual MDX file paths, organized by version.
 * This provides version isolation and clean path management.
 * 
 * Structure: adminMDXFilePaths[version][slug] = filePath
 */

/**
 * Admin MDX File Paths - Version-Keyed Registry
 * Maps URL slugs to actual MDX file paths (relative to project root)
 */
export const adminMDXFilePaths: Record<string, Record<string, string>> = {
  // ========================================
  // Version 6.1
  // ========================================
  '6_1': {
    // Overview
    'admin': '/content/6_1/admin_6_1/overview_6_1.mdx',
    
    // Organizational Details
    'admin/organizational-details': '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx',
    'admin/organizational-details/cost-center': '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx',
    'admin/organizational-details/departments': '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx',
    'admin/organizational-details/departments/members': '/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx',
    'admin/organizational-details/designations': '/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx',
    'admin/organizational-details/holidays': '/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx',
    'admin/organizational-details/locations': '/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx',
    'admin/organizational-details/operational-hours': '/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx',
    'admin/organizational-details/details': '/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx',
    
    // Discovery
    'admin/discovery': '/content/6_1/admin_6_1/admin_discovery/admin_discovery_6_1.mdx',
    'admin/discovery/application-map': '/content/6_1/admin_6_1/admin_discovery/application_map_6_1.mdx',
    'admin/discovery/credentials': '/content/6_1/admin_6_1/admin_discovery/credentials_6_1.mdx',
    'admin/discovery/credentials/flush-credential': '/content/6_1/admin_6_1/admin_discovery/credentials_flush_6_1.mdx',
    'admin/discovery/custom-patterns': '/content/6_1/admin_6_1/admin_discovery/custom_patterns_6_1.mdx',
    'admin/discovery/download-application': '/content/6_1/admin_6_1/admin_discovery/downloading_discovery_6_1.mdx',
    'admin/discovery/import-templates': '/content/6_1/admin_6_1/admin_discovery/import_templates_6_1.mdx',
    'admin/discovery/ignore-adm-process': '/content/6_1/admin_6_1/admin_discovery/ignore_adm_process_6_1.mdx',
    'admin/discovery/ignore-process': '/content/6_1/admin_6_1/admin_discovery/ignore_process_6_1.mdx',
    'admin/discovery/major-software': '/content/6_1/admin_6_1/admin_discovery/major_software_6_1.mdx',
    'admin/discovery/port-configuration': '/content/6_1/admin_6_1/admin_discovery/port_config_process_6_1.mdx',
    'admin/discovery/probe-workflow': '/content/6_1/admin_6_1/admin_discovery/probe_workflow_6_1.mdx',
    'admin/discovery/probes': '/content/6_1/admin_6_1/admin_discovery/probes_6_1.mdx',
    'admin/discovery/scan-configuration': '/content/6_1/admin_6_1/admin_discovery/scan_configuration_6_1.mdx',
    'admin/discovery/sensors': '/content/6_1/admin_6_1/admin_discovery/sensors_6_1.mdx',
    'admin/discovery/graphical-workflows': '/content/6_1/admin_6_1/admin_discovery/graphical_workflows_6_1.mdx',
    
    // SACM
    'admin/sacm': '/content/6_1/admin_6_1/admin_sacm/admin_sacm_6_1.mdx',
    'admin/sacm/blueprints': '/content/6_1/admin_6_1/admin_sacm/blueprints_6_1.mdx',
    'admin/sacm/custom-bsm-views': '/content/6_1/admin_6_1/admin_sacm/custom_bsm_views_6_1.mdx',
    'admin/sacm/cmdb-graphical-workflow': '/content/6_1/admin_6_1/admin_sacm/cmdb_graphical_workflow_6_1.mdx',
    'admin/sacm/cmdb-properties': '/content/6_1/admin_6_1/admin_sacm/cmdb_properties_6_1.mdx',
    
    // Users
    'admin/users': '/content/6_1/admin_6_1/admin_users/admin_users_6_1.mdx',
    'admin/users/ad-configuration': '/content/6_1/admin_6_1/admin_users/ad_imp_auth_6_1.mdx',
    'admin/users/azure-ad-configuration': '/content/6_1/admin_6_1/admin_users/azure_ad_config_6_1.mdx',
    'admin/users/saml-configuration': '/content/6_1/admin_6_1/admin_users/saml_config_6_1.mdx',
    'admin/users/user-groups': '/content/6_1/admin_6_1/admin_users/user_groups_6_1.mdx',
    'admin/users/user-roles': '/content/6_1/admin_6_1/admin_users/user_roles_6_1.mdx',
    'admin/users/users': '/content/6_1/admin_6_1/admin_users/users_6_1.mdx',
    
    // Others
    'admin/others': '/content/6_1/admin_6_1/admin_other/admin_other_6_1.mdx',
    'admin/others/announcements': '/content/6_1/admin_6_1/admin_other/announcements_6_1.mdx',
    'admin/others/business-rules': '/content/6_1/admin_6_1/admin_other/business_rules_6_1.mdx',
    'admin/others/smtp-configuration': '/content/6_1/admin_6_1/admin_other/smtp_config_6_1.mdx',
  },
  
  // ========================================
  // Version 6.1.1
  // ========================================
  '6_1_1': {
    'admin': '/content/6_1_1/overview_6_1_1.mdx',
    // Add 6.1.1 specific paths here as they differ from 6.1
  },
  
  // ========================================
  // Version 5.13
  // ========================================
  '5_13': {
    'admin': '/content/5_13/overview_5_13.mdx',
    // Add 5.13 specific paths here
  },
  
  // ========================================
  // Version NextGen
  // ========================================
  'NG': {
    'admin': '/content/NG/admin_ng/overview_ng.mdx',
    'admin/organizational-details': '/content/NG/admin_ng/admin_org_details/about_org_details_ng.mdx',
    'admin/organizational-details/cost-center': '/content/NG/admin_ng/admin_org_details/cost_center_ng.mdx',
  },
};

// Create reverse mapping: file path → slug (for backwards compatibility)
const pathToSlugMap: Record<string, Record<string, string>> = {};

for (const [version, paths] of Object.entries(adminMDXFilePaths)) {
  pathToSlugMap[version] = {};
  for (const [slug, filePath] of Object.entries(paths)) {
    pathToSlugMap[version][filePath] = slug;
  }
}

// Count total registered files
const totalFiles = Object.values(adminMDXFilePaths).reduce(
  (sum, version) => sum + Object.keys(version).length, 
  0
);

console.log(`✅ [Admin Version Registry] Registered ${totalFiles} files across ${Object.keys(adminMDXFilePaths).length} versions`);

// Export helper to check if file should be loaded with priority
export function isAdminPriorityFile(path: string): boolean {
  // Check if path exists in any version
  for (const versionPaths of Object.values(adminMDXFilePaths)) {
    if (path in versionPaths) {
      return true;
    }
  }
  return false;
}

// Export helper to get file path for a specific version
export function getAdminFilePath(slugOrPath: string, version: string): string | null {
  const versionPaths = adminMDXFilePaths[version];
  if (!versionPaths) {
    console.warn(`⚠️ [getAdminFilePath] Version ${version} not found in admin registry`);
    return null;
  }
  
  // Normalize input
  const normalized = slugOrPath.replace(/^\/+|\/+$/g, '');
  
  console.log(`🔍 [getAdminFilePath] Looking for: "${normalized}" in version ${version}`);
  
  // Try direct slug lookup first
  if (versionPaths[normalized]) {
    console.log(`✅ [getAdminFilePath] Found by slug: ${versionPaths[normalized]}`);
    return versionPaths[normalized];
  }
  
  // Try as file path - check if the input matches any registered file path
  for (const [slug, filePath] of Object.entries(versionPaths)) {
    const normalizedFilePath = filePath.replace(/^\/+|\/+$/g, '');
    if (normalizedFilePath === normalized || filePath === slugOrPath) {
      console.log(`✅ [getAdminFilePath] Found by path match: ${filePath}`);
      return filePath; // It's already the file path we want
    }
  }
  
  console.log(`❌ [getAdminFilePath] Not found in version ${version}`);
  console.log(`📋 [getAdminFilePath] Available slugs:`, Object.keys(versionPaths).slice(0, 5));
  return null;
}

// Export helper to convert file path to slug
export function getAdminSlugFromPath(filePath: string, version: string): string | null {
  const versionMap = pathToSlugMap[version];
  return versionMap?.[filePath] || null;
}

// Export helper to get all slugs for a version
export function getAdminSlugs(version: string): string[] {
  const versionPaths = adminMDXFilePaths[version];
  return versionPaths ? Object.keys(versionPaths) : [];
}
