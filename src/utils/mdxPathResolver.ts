/**
 * Utility to resolve MDX file paths based on version, module, section, and page
 * 
 * This file maintains completely separate, independent path resolution logic for:
 * - NextGen (NG): Uses _ng file extensions
 * - Version 6.1: Uses _6_1 file extensions
 * 
 * Changes to NG paths will NOT affect 6.1 paths and vice versa.
 */

// hasContent is no longer needed - path resolution doesn't check content existence
// Content existence is handled by contentLoader.getContent()
import { applicationOverviewPages, sharedFunctionsPages } from '../constants/adminPages';

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
  currentPath?: string;
}

/**
 * Convert version string to directory format
 * NextGen -> NG
 * 6.1.1 -> 6_1_1
 * 6.1 -> 6_1
 * 5.13 -> 5_13
 */
function formatVersionForPath(version: string): string {
  if (version === 'NextGen') return 'NG';
  return version.replace(/\./g, '_');
}

const directPathVersionMap: Record<string, string> = {
  '6_1': '6_1',
  '6.1': '6_1',
  '6_1_1': '6_1_1',
  '6.1.1': '6_1_1',
  '5_13': '5_13',
  '5.13': '5_13',
};

/**
 * Try to resolve MDX path directly from the current URL when it already matches the file structure.
 * Works for version-first content (6.1, 6.1.1, 5.13, NextGen) where TOC links point to actual file paths.
 */
function resolvePathFromCurrentUrl(currentPath?: string): string | null {
  if (!currentPath) return null;

  let normalized = currentPath.split(/[?#]/)[0] || '';
  if (!normalized) return null;

  // Remove base path if present
  normalized = normalized.replace(/^\/?FeatureDocsite/, '');

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/+$/, '');
  if (!normalized || normalized === '/') return null;

  const parts = normalized.split('/').filter(Boolean);
  if (parts.length < 2) return null;

  const versionPart = parts[0].toLowerCase();
  
  // Handle NextGen paths (NextGen, NG, nextgen)
  if (versionPart === 'nextgen' || versionPart === 'ng') {
    const remainder = parts.slice(1).join('/');
    if (!remainder) return null;
    
    let candidate = `/content/NG/${remainder}`;
    if (!candidate.endsWith('.mdx')) {
      candidate = `${candidate}.mdx`;
    }
    
    // Return the candidate path - let contentLoader handle existence check
    return candidate;
  }

  // Handle versioned paths (6.1, 6.1.1, 5.13, etc.)
  const mappedVersion = directPathVersionMap[versionPart];
  if (!mappedVersion) return null;

  const remainder = parts.slice(1).join('/');
  if (!remainder) return null;

  let candidate = `/content/${mappedVersion}/${remainder}`;
  if (!candidate.endsWith('.mdx')) {
    candidate = `${candidate}.mdx`;
  }

  // Return the candidate path - let contentLoader handle existence check
  // This allows paths to be resolved even if contentMap isn't fully populated yet
  return candidate;
}

// ============================================================================
// NEXTGEN (NG) PATH RESOLUTION - Independent implementation
// All NG functions use _ng file extensions
// ============================================================================

/**
 * Convert page ID (kebab-case) to NG file name (snake_case + _ng)
 * Example: "cmdb-graphical-workflow" -> "cmdb_graphical_workflow_ng"
 */
function pageIdToNgFileName(pageId: string): string {
  return pageId.replace(/-/g, '_') + '_ng';
}

/**
 * Convert module name to NextGen folder name
 * Example: "discovery-scan" -> "discovery_scan_ng", "admin" -> "admin_ng"
 */
function moduleToNgFolder(module: string): string {
  const moduleMap: Record<string, string> = {
    'admin': 'admin_ng',
    'my-dashboard': 'my_dashboard_ng',
    'cmdb': 'cmdb_ng',
    'discovery-scan': 'discovery_scan_ng',
    'itsm': 'itsm_ng',
    'itam': 'itam_ng',
    'self-service': 'self_service_ng',
    'program-project-management': 'program-project-management_ng',
    'risk-register': 'risk_register_ng',
    'reports': 'reports_ng',
    'vulnerability-management': 'vulnerability_management_ng',
  };
  return moduleMap[module] || module.replace(/-/g, '_') + '_ng';
}

/**
 * Get Admin subfolder for NG based on section
 * NG-specific implementation - independent from 6.1
 */
function getNgAdminSubfolder(section: string): string | null {
  const sectionToSubfolder: Record<string, string> = {
    'organizational-details': 'admin_org_details',
    'discovery': 'admin_discovery',
    'sacm': 'admin_sacm',
    'users': 'admin_users',
    'management-functions': 'admin_change_mngmnt', // Default, can be overridden per page
    'integrations': 'admin_integrations',
    'others': 'admin_other',
  };
  return sectionToSubfolder[section] || null;
}

/**
 * Get the MDX file path for Admin module in NextGen version
 * NG-specific implementation following TOC structure
 * All files use _ng extension
 */
function getNgAdminPath(section: string, page: string): string | null {
  const basePath = '/content/NG';
  const moduleFolder = 'admin_ng';
  
  // Comprehensive mapping of all Admin NG pages (following TOC structure)
  // All file names use _ng extension
  const ngAdminPageMap: Record<string, { file: string; subfolder: string }> = {
    // Organizational Details
    'cost-center': { file: 'cost_center_ng', subfolder: 'admin_org_details' },
    'departments': { file: 'departments_ng', subfolder: 'admin_org_details' },
    'members': { file: 'departments_members_ng', subfolder: 'admin_org_details' },
    'designations': { file: 'designations_ng', subfolder: 'admin_org_details' },
    'holidays': { file: 'holidays_ng', subfolder: 'admin_org_details' },
    'locations': { file: 'locations_ng', subfolder: 'admin_org_details' },
    'operational-hours': { file: 'operational_hours_ng', subfolder: 'admin_org_details' },
    'organizational-details-nested': { file: 'organizational_details_ng', subfolder: 'admin_org_details' },
    'organizational-details': { file: 'about_org_details_ng', subfolder: 'admin_org_details' },
    
    // Discovery
    'application-map': { file: 'application_map_ng', subfolder: 'admin_discovery' },
    'client': { file: 'client_ng', subfolder: 'admin_discovery' },
    'discovery-agents': { file: 'client_discovery_agents_ng', subfolder: 'admin_discovery' },
    'remote-install': { file: 'client_remote_install_ng', subfolder: 'admin_discovery' },
    'restart-client': { file: 'client_restart_ng', subfolder: 'admin_discovery' },
    'scan': { file: 'client_scan_ng', subfolder: 'admin_discovery' },
    'correlation': { file: 'correlation_ng', subfolder: 'admin_discovery' },
    'credentials': { file: 'credentials_ng', subfolder: 'admin_discovery' },
    'details': { file: 'credentials_details_ng', subfolder: 'admin_discovery' },
    'backup-file': { file: 'credentials_backup_file_ng', subfolder: 'admin_discovery' },
    'flush-credential': { file: 'credentials_flush_ng', subfolder: 'admin_discovery' },
    'custom-patterns': { file: 'custom_patterns_ng', subfolder: 'admin_discovery' },
    'download-application': { file: 'downloading_discovery_ng', subfolder: 'admin_discovery' },
    'import-templates': { file: 'import_templates_ng', subfolder: 'admin_discovery' },
    'ignore-adm-process': { file: 'ignore_adm_process_ng', subfolder: 'admin_discovery' },
    'ignore-process': { file: 'ignore_process_ng', subfolder: 'admin_discovery' },
    'major-software': { file: 'major_software_ng', subfolder: 'admin_discovery' },
    'monitoring-profile': { file: 'mon_prof_ng', subfolder: 'admin_discovery' },
    'action-details': { file: 'mon_prof_action_details_ng', subfolder: 'admin_discovery' },
    'frequency': { file: 'mon_prof_frequency_ng', subfolder: 'admin_discovery' },
    'notifications': { file: 'mon_prof_notifications_ng', subfolder: 'admin_discovery' },
    'trigger-conditions': { file: 'mon_prof_trigger_conditions_ng', subfolder: 'admin_discovery' },
    'patterns': { file: 'patterns_ng', subfolder: 'admin_discovery' },
    'port-configuration': { file: 'port_config_process_ng', subfolder: 'admin_discovery' },
    'probe-workflow': { file: 'probe_workflow_ng', subfolder: 'admin_discovery' },
    'probes': { file: 'probes_ng', subfolder: 'admin_discovery' },
    'scan-configuration': { file: 'scan_configuration_ng', subfolder: 'admin_discovery' },
    'sensors': { file: 'sensors_ng', subfolder: 'admin_discovery' },
    'graphical-workflows': { file: 'graphical_workflows_ng', subfolder: 'admin_discovery' },
    
    // SACM
    'blueprints': { file: 'blueprints_ng', subfolder: 'admin_sacm' },
    'bsm-views': { file: 'custom_bsm_views_ng', subfolder: 'admin_sacm' },
    'cmdb-graphical-workflow': { file: 'cmdb_graphical_workflow_ng', subfolder: 'admin_sacm' },
    'cmdb-properties': { file: 'cmdb_properties_ng', subfolder: 'admin_sacm' },
    'confidence-configuration': { file: 'confidence_config_ng', subfolder: 'admin_sacm' },
    'duplicates-remediation': { file: 'dups_remediation_ng', subfolder: 'admin_sacm' },
    'export-ci-template': { file: 'export_ci_template_ng', subfolder: 'admin_sacm' },
    'ip-connection-score-threshold': { file: 'ip_conn_score_threshold_ng', subfolder: 'admin_sacm' },
    'process-tags': { file: 'process_tags_ng', subfolder: 'admin_sacm' },
    'property-group': { file: 'property_group_ng', subfolder: 'admin_sacm' },
    'relationship-types': { file: 'relationship_types_ng', subfolder: 'admin_sacm' },
    'software-license-validity-check': { file: 'software_lic_validity_check_ng', subfolder: 'admin_sacm' },
    'software-usage-report': { file: 'software_usage_report_ng', subfolder: 'admin_sacm' },
    
    // Users
    'ad-configuration': { file: 'ad_imp_auth_ng', subfolder: 'admin_users' },
    'azure-ad-configuration': { file: 'azure_ad_config_ng', subfolder: 'admin_users' },
    'saml-configuration': { file: 'saml_config_ng', subfolder: 'admin_users' },
    'time-track-reports': { file: 'time_track_reports_ng', subfolder: 'admin_users' },
    'user-groups': { file: 'user_groups_ng', subfolder: 'admin_users' },
    'user-roles': { file: 'user_roles_ng', subfolder: 'admin_users' },
    'users-list': { file: 'users_ng', subfolder: 'admin_users' },
    
    // Management Functions
    'change-management': { file: 'about_change_mngmnt_ng', subfolder: 'admin_change_mngmnt' },
    'contract-management': { file: 'about_contract_mngmnt_ng', subfolder: 'admin_contract_mngmt' },
    'event-management': { file: 'about_event_mngmnt_ng', subfolder: 'admin_event_mngmnt' },
    'hardware-asset-management': { file: 'about_hw_asset_mngmnt_ng', subfolder: 'admin_hardware_asset_mngmnt' },
    'incident-management': { file: 'about_incident_mngmnt_ng', subfolder: 'admin_incident_mngmnt' },
    'knowledge-management': { file: 'about_knowledge_mngmnt_ng', subfolder: 'admin_knowledge_mngmnt' },
    'problem-management': { file: 'about_problem_mngmnt_ng', subfolder: 'admin_problem_mngmnt' },
    'about-procurement': { file: 'about_procurement_ng', subfolder: 'admin_procurement' },
    'procurement-properties': { file: 'procurement_properties_ng', subfolder: 'admin_procurement' },
    'procurement-property-group': { file: 'procurement_property_group_ng', subfolder: 'admin_procurement' },
    'project-management': { file: 'about_project_mngmnt_ng', subfolder: 'admin_project_mngmnt' },
    'release-management': { file: 'about_release_mngmnt_ng', subfolder: 'admin_release_mngmnt' },
    'request-management': { file: 'about_request_mngmnt_ng', subfolder: 'admin_request_mngmnt' },
    'vendor-management': { file: 'about_vendor_mngmnt_ng', subfolder: 'admin_vendor_mngmnt' },
    
    // Integrations
    'cherwell-credential': { file: 'cherwell_credential_ng', subfolder: 'admin_integrations' },
    'cherwell-mappings': { file: 'cherwell_mappings_ng', subfolder: 'admin_integrations' },
    'infoblox-configuration': { file: 'infoblox_config_ng', subfolder: 'admin_integrations' },
    'ivanti-credentials': { file: 'ivanti_credentials_ng', subfolder: 'admin_integrations' },
    'ivanti-mappings': { file: 'ivanti_mappings_ng', subfolder: 'admin_integrations' },
    'jira-credentials': { file: 'jira_credentials_ng', subfolder: 'admin_integrations' },
    'jira-asset-mappings': { file: 'jira_mappings_ng', subfolder: 'admin_integrations' },
    'servicenow-credentials': { file: 'servicenow_credentials_ng', subfolder: 'admin_integrations' },
    'servicenow-mappings': { file: 'servicenow_mappings_ng', subfolder: 'admin_integrations' },
    
    // Others
    'announcements': { file: 'announcements_ng', subfolder: 'admin_other' },
    'business-rules': { file: 'business_rules_ng', subfolder: 'admin_other' },
    'custom-reports': { file: 'custom_reports_ng', subfolder: 'admin_other' },
    'documentation-and-tester': { file: 'documentation_tester_ng', subfolder: 'admin_other' },
    'inbox-configuration-itsm': { file: 'inbox_config_itsm_ticket_mngmnt_ng', subfolder: 'admin_other' },
    'kpis': { file: 'kpis_ng', subfolder: 'admin_other' },
    'reports': { file: 'reports_ng', subfolder: 'admin_other' },
    'role-access': { file: 'role_access_ng', subfolder: 'admin_other' },
    'service-level-agreements': { file: 'sla_ng', subfolder: 'admin_other' },
    'smtp-configuration': { file: 'smtp_config_ng', subfolder: 'admin_other' },
    'risk-score-calculator': { file: 'risk_score_calculator_ng', subfolder: 'admin_other' },
    'admin-graphical-workflows': { file: 'admin_graphical_workflows_ng', subfolder: 'admin_other' },
  };
  
  const pageMapping = ngAdminPageMap[page];
  if (pageMapping) {
    return `${basePath}/${moduleFolder}/${pageMapping.subfolder}/${pageMapping.file}.mdx`;
  }
  
  // Fallback: try to construct path from section and page
  const subfolder = getNgAdminSubfolder(section);
  if (subfolder) {
    const fileName = pageIdToNgFileName(page);
    return `${basePath}/${moduleFolder}/${subfolder}/${fileName}.mdx`;
  }
  
  return null;
}

/**
 * Get the MDX file path for NextGen version
 * NG-specific implementation - completely independent from 6.1
 */
function getNextGenPath(module: string, section: string, page: string): string | null {
  const basePath = '/content/NG';
  const moduleFolder = moduleToNgFolder(module);
  
  // Application Overview pages
  if (section === 'application-overview' || (module === 'my-dashboard' && applicationOverviewPages.includes(page))) {
    if (page === 'shared-functions') {
      // Shared functions parent page
      return `${basePath}/application_overview_ng/shared_functions_ng/about_common_functions_ng.mdx`;
    }
    
    if (sharedFunctionsPages.includes(page)) {
      // Special mappings for shared functions pages
      const sharedFunctionsFileMap: Record<string, string> = {
        'email-preferences': 'email_prefs_ng',
      };
      const fileName = sharedFunctionsFileMap[page] || pageIdToNgFileName(page);
      return `${basePath}/application_overview_ng/shared_functions_ng/${fileName}.mdx`;
    }
    
    // Other application overview pages (system-icons, user-specific-functions, online-help)
    if (applicationOverviewPages.includes(page)) {
      // Special mapping for system-icons -> icons_ng
      if (page === 'system-icons') {
        return `${basePath}/application_overview_ng/icons_ng.mdx`;
      }
      return `${basePath}/application_overview_ng/${pageIdToNgFileName(page)}.mdx`;
    }
  }
  
  // Admin module - has subfolders
  if (module === 'admin') {
    return getNgAdminPath(section, page);
  }
  
  // My Dashboard module
  if (module === 'my-dashboard') {
    // Special handling for my-dashboard-overview - file exists with -6_1 suffix (legacy)
    if (page === 'my-dashboard-overview') {
      return `${basePath}/${moduleFolder}/my-dashboard-overview-6_1.mdx`;
    }
    // system-icons is in application_overview_ng, not my_dashboard_ng
    if (page === 'system-icons') {
      return `${basePath}/application_overview_ng/${pageIdToNgFileName(page)}.mdx`;
    }
    // Check for dashboards subfolder
    const dashboardPageMap: Record<string, string> = {
      'dashboards': 'dashboard_overview_ng',
      'dashboards-contents': 'dashboard_contents_ng',
      'customization': 'dashboard_customization_ng',
      'report-actions': 'dashboard_reports_actions_ng',
    };
    if (dashboardPageMap[page]) {
      return `${basePath}/${moduleFolder}/dashboards/${dashboardPageMap[page]}.mdx`;
    }
    // Default: try root folder with _ng suffix
    const fileName = pageIdToNgFileName(page);
    return `${basePath}/${moduleFolder}/${fileName}.mdx`;
  }
  
  // For other modules, handle special cases first
  // Module overview pages that use "about_*_ng.mdx" naming
  if (page === 'overview' || page === `${module}-overview`) {
    const moduleOverviewMap: Record<string, string> = {
      'itsm': 'about_itsm_ng',
      'itam': 'about_itam_ng',
      'self-service': 'about_self_service_ng',
      'program-project-management': 'about_prog_proj_mngmnt_ng',
      'risk-register': 'about_risk_register_ng',
    };
    const overviewFile = moduleOverviewMap[module];
    if (overviewFile) {
      return `${basePath}/${moduleFolder}/${overviewFile}.mdx`;
    }
  }
  
  // For other pages, convert page ID to file name and use module folder
  const fileName = pageIdToNgFileName(page);
  return `${basePath}/${moduleFolder}/${fileName}.mdx`;
}

// ============================================================================
// VERSION 6.1 PATH RESOLUTION - Independent implementation
// All 6.1 functions use _6_1 file extensions
// ============================================================================

/**
 * Convert page ID (kebab-case) to 6.1 file name (snake_case + _6_1)
 * Example: "cost-center" -> "cost_center_6_1"
 */
function pageIdTo61FileName(pageId: string): string {
  return pageId.replace(/-/g, '_') + '_6_1';
}

/**
 * Get Admin subfolder for 6.1 based on section
 * 6.1-specific implementation - independent from NG
 */
function get61AdminSubfolder(section: string): string | null {
  const sectionToSubfolder: Record<string, string> = {
    'organizational-details': 'admin_org_details',
    'discovery': 'admin_discovery',
    'sacm': 'admin_sacm',
    'users': 'admin_users',
    'management-functions': 'admin_change_mngmnt', // Default, can be overridden per page
    'integrations': 'admin_integrations',
    'others': 'admin_other',
  };
  return sectionToSubfolder[section] || null;
}

/**
 * Get the MDX file path for My Dashboard module in version 6.1
 * 6.1-specific implementation
 */
function getMyDashboard61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/my_dashboard_6_1';
  
  // Direct page-to-file mapping (all use _6_1 extension)
  const fileMap: Record<string, string> = {
    'dashboards': 'dashboards-6_1.mdx',
    'dashboards-contents': 'dashboards-contents-6_1.mdx',
    'customization': 'dashboards-customization-6_1.mdx',
    'report-actions': 'dashboards-report-actions-6_1.mdx',
    'my-dashboard-section': 'my-dashboard-6_1.mdx',
    'my-dashboard-contents': 'my-dashboard-contents-6_1.mdx',
    'my-dashboard-overview': 'my-dashboard-overview-6_1.mdx',
    'system-icons': 'system-icons-6_1.mdx',
  };

  const fileName = fileMap[page];
  if (fileName) {
    return `${basePath}/${fileName}`;
  }

  return null;
}

/**
 * Get the MDX file path for Admin module in version 6.1
 * 6.1-specific implementation following TOC structure
 * All files use _6_1 extension
 */
function getAdmin61Path(section: string, page: string): string | null {
  const basePath = '/content/6_1/admin_6_1';
  
  // Comprehensive mapping of all Admin 6.1 pages (following TOC structure)
  // All file names use _6_1 extension
  const admin61PageMap: Record<string, { file: string; subfolder: string }> = {
    // Admin Functions
    'admin-functions': { file: 'admin_functions_new_6_1', subfolder: 'admin' },
    
    // Organizational Details
    'organizational-details': { file: 'about_org_details_6_1', subfolder: 'admin_org_details' },
    'organizational-details-nested': { file: 'organizational_details_6_1', subfolder: 'admin_org_details' },
    'cost-center': { file: 'cost_center_6_1', subfolder: 'admin_org_details' },
    'departments': { file: 'departments_6_1', subfolder: 'admin_org_details' },
    'members': { file: 'departments_members_6_1', subfolder: 'admin_org_details' },
    'designations': { file: 'designations_6_1', subfolder: 'admin_org_details' },
    'holidays': { file: 'holidays_6_1', subfolder: 'admin_org_details' },
    'locations': { file: 'locations_6_1', subfolder: 'admin_org_details' },
    'operational-hours': { file: 'operational_hours_6_1', subfolder: 'admin_org_details' },
    
    // Discovery
    'discovery': { file: 'admin_discovery_6_1', subfolder: 'admin_discovery' },
    'application-map': { file: 'application_map_6_1', subfolder: 'admin_discovery' },
    'client': { file: 'client_6_1', subfolder: 'admin_discovery' },
    'discovery-agents': { file: 'client_discovery_agents_6_1', subfolder: 'admin_discovery' },
    'remote-install': { file: 'client_remote_install_6_1', subfolder: 'admin_discovery' },
    'restart-client': { file: 'client_restart_6_1', subfolder: 'admin_discovery' },
    'scan': { file: 'client_scan_6_1', subfolder: 'admin_discovery' },
    'client-scan': { file: 'client_scan_6_1', subfolder: 'admin_discovery' },
    'correlation': { file: 'correlation_6_1', subfolder: 'admin_discovery' },
    'credentials': { file: 'credentials_6_1', subfolder: 'admin_discovery' },
    'details': { file: 'credentials_details_6_1', subfolder: 'admin_discovery' },
    'backup-file': { file: 'credentials_backup_file_6_1', subfolder: 'admin_discovery' },
    'flush-credential': { file: 'credentials_flush_6_1', subfolder: 'admin_discovery' },
    'custom-patterns': { file: 'custom_patterns_6_1', subfolder: 'admin_discovery' },
    'download-application': { file: 'downloading_discovery_6_1', subfolder: 'admin_discovery' },
    'import-templates': { file: 'import_templates_6_1', subfolder: 'admin_discovery' },
    'ignore-adm-process': { file: 'ignore_adm_process_6_1', subfolder: 'admin_discovery' },
    'ignore-process': { file: 'ignore_process_6_1', subfolder: 'admin_discovery' },
    'major-software': { file: 'major_software_6_1', subfolder: 'admin_discovery' },
    'monitoring-profile': { file: 'mon_prof_6_1', subfolder: 'admin_discovery' },
    'monitoring-profile-details': { file: 'mon_prof_details_6_1', subfolder: 'admin_discovery' },
    'frequency': { file: 'mon_prof_frequency_6_1', subfolder: 'admin_discovery' },
    'trigger-conditions': { file: 'mon_prof_trigger_conditions_6_1', subfolder: 'admin_discovery' },
    'action-details': { file: 'mon_prof_action_details_6_1', subfolder: 'admin_discovery' },
    'notifications': { file: 'mon_prof_notifications_6_1', subfolder: 'admin_discovery' },
    'port-configuration': { file: 'port_config_process_6_1', subfolder: 'admin_discovery' },
    'probe-workflow': { file: 'probe_workflow_6_1', subfolder: 'admin_discovery' },
    'probes': { file: 'probes_6_1', subfolder: 'admin_discovery' },
    'scan-configuration': { file: 'scan_configuration_6_1', subfolder: 'admin_discovery' },
    'sensors': { file: 'sensors_6_1', subfolder: 'admin_discovery' },
    'graphical-workflows': { file: 'graphical_workflows_6_1', subfolder: 'admin_discovery' },
    
    // SACM
    'sacm': { file: 'admin_sacm_6_1', subfolder: 'admin_sacm' },
    'blueprints': { file: 'blueprints_6_1', subfolder: 'admin_sacm' },
    'bsm-views': { file: 'custom_bsm_views_6_1', subfolder: 'admin_sacm' },
    'cmdb-graphical-workflow': { file: 'cmdb_graphical_workflow_6_1', subfolder: 'admin_sacm' },
    'cmdb-properties': { file: 'cmdb_properties_6_1', subfolder: 'admin_sacm' },
    'confidence-configuration': { file: 'confidence_config_6_1', subfolder: 'admin_sacm' },
    'duplicates-remediation': { file: 'dups_remediation_6_1', subfolder: 'admin_sacm' },
    'export-ci-template': { file: 'export_ci_template_6_1', subfolder: 'admin_sacm' },
    'ip-connection-score-threshold': { file: 'ip_conn_score_threshold_6_1', subfolder: 'admin_sacm' },
    'process-tags': { file: 'process_tags_6_1', subfolder: 'admin_sacm' },
    'property-group': { file: 'property_group_6_1', subfolder: 'admin_sacm' },
    'relationship-types': { file: 'relationship_types_6_1', subfolder: 'admin_sacm' },
    'software-license-validity-check': { file: 'sw_lic_validity_check_6_1', subfolder: 'admin_sacm' },
    'software-usage-report': { file: 'software_usage_report_6_1', subfolder: 'admin_sacm' },
    
    // Users
    'users': { file: 'admin_users_6_1', subfolder: 'admin_users' },
    'ad-configuration': { file: 'ad_imp_auth_6_1', subfolder: 'admin_users' },
    'azure-ad-configuration': { file: 'azure_ad_config_6_1', subfolder: 'admin_users' },
    'saml-configuration': { file: 'saml_config_6_1', subfolder: 'admin_users' },
    'time-track-reports': { file: 'time_track_reports_6_1', subfolder: 'admin_users' },
    'user-groups': { file: 'user_groups_6_1', subfolder: 'admin_users' },
    'user-roles': { file: 'user_roles_6_1', subfolder: 'admin_users' },
    'users-list': { file: 'users_6_1', subfolder: 'admin_users' },
    
    // Management Functions
    'change-management': { file: 'about_change_mngmnt_6_1', subfolder: 'admin_change_mngmnt' },
    'contract-management': { file: 'about_contract_mngmnt_6_1', subfolder: 'admin_contract_mngmt' },
    'event-management': { file: 'about_event_mngmnt_6_1', subfolder: 'admin_event_mngmnt' },
    'hardware-asset-management': { file: 'about_hw_asset_mngmnt_6_1', subfolder: 'admin_hardware_asset_mngmnt' },
    'incident-management': { file: 'about_incident_mngmnt_6_1', subfolder: 'admin_incident_mngmnt' },
    'knowledge-management': { file: 'about_knowledge_mngmnt_6_1', subfolder: 'admin_knowledge_mngmnt' },
    'problem-management': { file: 'about_problem_mngmnt_6_1', subfolder: 'admin_problem_mngmnt' },
    'procurement': { file: 'about_procurement_6_1', subfolder: 'admin_procurement' },
    'procurement-properties': { file: 'procurement_properties_6_1', subfolder: 'admin_procurement' },
    'procurement-property-group': { file: 'procurement_property_group_6_1', subfolder: 'admin_procurement' },
    'project-management': { file: 'about_project_mngmnt_6_1', subfolder: 'admin_project_mngmnt' },
    'release-management': { file: 'about_release_mngmnt_6_1', subfolder: 'admin_release_mngmnt' },
    'request-management': { file: 'about_request_mngmnt_6_1', subfolder: 'admin_request_mngmnt' },
    'vendor-management': { file: 'about_vendor_mngmnt_6_1', subfolder: 'admin_vendor_mngmnt' },
    
    // Integrations
    'cherwell-credential': { file: 'cherwell_credential_6_1', subfolder: 'admin_integrations' },
    'cherwell-mappings': { file: 'cherwell_mappings_6_1', subfolder: 'admin_integrations' },
    'infoblox-configuration': { file: 'infoblox_config_6_1', subfolder: 'admin_integrations' },
    'ivanti-credentials': { file: 'ivanti_credentials_6_1', subfolder: 'admin_integrations' },
    'ivanti-mappings': { file: 'ivanti_mappings_6_1', subfolder: 'admin_integrations' },
    'jira-credentials': { file: 'jira_credentials_6_1', subfolder: 'admin_integrations' },
    'jira-asset-mappings': { file: 'jira_mappings_6_1', subfolder: 'admin_integrations' },
    'servicenow-credentials': { file: 'servicenow_credentials_6_1', subfolder: 'admin_integrations' },
    'servicenow-mappings': { file: 'servicenow_mappings_6_1', subfolder: 'admin_integrations' },
    
    // Others
    'announcements': { file: 'announcements_6_1', subfolder: 'admin_other' },
    'business-rules': { file: 'business_rules_6_1', subfolder: 'admin_other' },
    'custom-reports': { file: 'custom_reports_6_1', subfolder: 'admin_other' },
    'documentation-and-tester': { file: 'documentation_tester_6_1', subfolder: 'admin_other' },
    'inbox-configuration-itsm': { file: 'inbox_config_itsm_ticket_mngmnt_6_1', subfolder: 'admin_other' },
    'kpis': { file: 'kpis_6_1', subfolder: 'admin_other' },
    'reports': { file: 'reports_6_1', subfolder: 'admin_other' },
    'role-access': { file: 'role_access_6_1', subfolder: 'admin_other' },
    'service-level-agreements': { file: 'sla_6_1', subfolder: 'admin_other' },
    'smtp-configuration': { file: 'smtp_config_6_1', subfolder: 'admin_other' },
    'risk-score-calculator': { file: 'risk_score_calculator_6_1', subfolder: 'admin_other' },
    'admin-graphical-workflows': { file: 'admin_graphical_workflows_6_1', subfolder: 'admin' },
  };
  
  // Try to find exact page match
  const pageMapping = admin61PageMap[page];
  if (pageMapping) {
    return `${basePath}/${pageMapping.subfolder}/${pageMapping.file}.mdx`;
  }
  
  // Try to determine subfolder from section
  const subfolder = get61AdminSubfolder(section);
  if (subfolder) {
    // Convert page ID to file name (kebab-case to snake_case + _6_1)
    const fileName = pageIdTo61FileName(page);
    return `${basePath}/${subfolder}/${fileName}.mdx`;
  }
  
  return null;
}

// ============================================================================
// MAIN PATH RESOLVER - Routes to appropriate version handler
// ============================================================================

/**
 * Resolve the path to the MDX file based on navigation parameters
 * Routes to NG or 6.1 specific handlers - completely independent
 */
export function resolveMDXPath({ version, module, section, page, currentPath }: PathResolverParams): string | null {
  // First, attempt to resolve directly from the current URL (covers TOC links and deep links)
  const directPath = resolvePathFromCurrentUrl(currentPath);
  if (directPath) {
    return directPath;
  }

  // Route to NextGen handler - completely independent
  if (version === 'NextGen') {
    return getNextGenPath(module, section, page);
  }
  
  // Route to 6.1 handler - completely independent
  if (version === '6.1') {
    // My Dashboard 6.1
    if (module === 'my-dashboard') {
      return getMyDashboard61Path(page, section);
    }
    
    // Admin 6.1
    if (module === 'admin') {
      return getAdmin61Path(section, page);
    }
    
    // Other 6.1 modules can be added here with their own handlers
  }
  
  // For other versions or unsupported combinations, return null
  // The component will fall back to hardcoded content
  return null;
}

/**
 * Check if a specific module/version combination has custom file structure
 */
export function hasCustomFileStructure(module: string, version: string): boolean {
  return (module === 'my-dashboard' && version === '6.1') || 
         (module === 'admin' && version === '6.1') ||
         version === 'NextGen';
}
