/**
 * Utility to resolve MDX file paths based on version, module, section, and page
 */

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
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

/**
 * Get the MDX file path for My Dashboard module in version 6.1
 * 
 * Navigation structure:
 * - My Dashboard (section: my-dashboard)
 *   - Dashboards (page: dashboards) → dashboards-6_1.mdx
 *     - Contents (page: dashboards-contents) → dashboards-contents-6_1.mdx
 *     - Customization (page: customization) → dashboards-customization-6_1.mdx
 *     - Report Actions (page: report-actions) → dashboards-report-actions-6_1.mdx
 *     - My Dashboard (page: my-dashboard-section) → my-dashboard-6_1.mdx
 *       - Contents (page: my-dashboard-contents) → my-dashboard-contents-6_1.mdx
 */
function getMyDashboard61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/my_dashboard_6_1';
  
  // Direct page-to-file mapping
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
 * Convert page ID (kebab-case) to file name (snake_case + _ng)
 * Example: "cmdb-graphical-workflow" -> "cmdb_graphical_workflow_ng"
 */
function pageIdToFileName(pageId: string): string {
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
 * Get Admin subfolder based on section
 */
function getAdminSubfolder(section: string): string | null {
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
 * Get the MDX file path for NextGen version
 */
function getNextGenPath(module: string, section: string, page: string): string | null {
  const basePath = '/content/NG';
  const moduleFolder = moduleToNgFolder(module);
  
  // Application Overview pages - use application_overview_ng folder
  const applicationOverviewPages = [
    "system-icons",
    "user-specific-functions", 
    "online-help",
    "shared-functions",
    "advanced-search", "attachments", "auto-refresh", "collapse-maximize",
    "comments", "copy-to-cherwell", "copy-to-ivanti", "copy-to-servicenow",
    "delete-remove", "email-preferences", "enable-disable-editing", "export",
    "filter-by", "history", "import", "items-per-page", "mark-as-knowledge",
    "other-asset-info", "outage-calendar", "personalize-columns", "print",
    "process-adm", "process-missing-components", "records-per-page",
    "reload-default-mapping", "re-scan", "re-sync-data", "save",
    "saved-filters", "searching", "show-main-all-properties", "tasks",
    "updates", "version-control", "go-to-page", "send-report-to"
  ];
  
  // Application Overview pages
  if (section === 'application-overview' || (module === 'my-dashboard' && applicationOverviewPages.includes(page))) {
    // Shared functions pages are in shared_functions_ng subfolder
    const sharedFunctionsPages = ['advanced-search', 'attachments', 'auto-refresh', 'collapse-maximize',
      'comments', 'copy-to-cherwell', 'copy-to-ivanti', 'copy-to-servicenow',
      'delete-remove', 'email-preferences', 'enable-disable-editing', 'export',
      'filter-by', 'history', 'import', 'items-per-page', 'mark-as-knowledge',
      'other-asset-info', 'outage-calendar', 'personalize-columns', 'print',
      'process-adm', 'process-missing-components', 'records-per-page',
      'reload-default-mapping', 're-scan', 're-sync-data', 'save',
      'saved-filters', 'searching', 'show-main-all-properties', 'tasks',
      'updates', 'version-control', 'go-to-page', 'send-report-to'];
    
    if (page === 'shared-functions') {
      // Shared functions parent page
      return `${basePath}/application_overview_ng/shared_functions_ng/about_common_functions_ng.mdx`;
    }
    
    if (sharedFunctionsPages.includes(page)) {
      // Special mappings for shared functions pages
      const sharedFunctionsFileMap: Record<string, string> = {
        'email-preferences': 'email_prefs_ng',
      };
      const fileName = sharedFunctionsFileMap[page] || pageIdToFileName(page);
      return `${basePath}/application_overview_ng/shared_functions_ng/${fileName}.mdx`;
    }
    
    // Other application overview pages (system-icons, user-specific-functions, online-help)
    if (applicationOverviewPages.includes(page)) {
      // Special mapping for system-icons -> icons_ng
      if (page === 'system-icons') {
        return `${basePath}/application_overview_ng/icons_ng.mdx`;
      }
      return `${basePath}/application_overview_ng/${pageIdToFileName(page)}.mdx`;
    }
  }
  
  // Admin module - has subfolders
  if (module === 'admin') {
    const subfolder = getAdminSubfolder(section);
    if (!subfolder) {
      // Try to determine subfolder from page
      // This is a fallback - ideally section should be set correctly
      return null;
    }
    
    // Special mappings for Admin pages
    const adminPageMap: Record<string, { file: string; subfolder: string }> = {
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
      'correlation': { file: 'correlation_ng', subfolder: 'admin_discovery' },
      'credentials': { file: 'credentials_ng', subfolder: 'admin_discovery' },
      'details': { file: 'credentials_details_ng', subfolder: 'admin_discovery' },
      'backup-file': { file: 'credentials_backup_file_ng', subfolder: 'admin_discovery' },
      'flush-credential': { file: 'credentials_flush_ng', subfolder: 'admin_discovery' },
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
      // Management Functions - need to map based on page
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
      'graphical-workflows': { file: 'admin_graphical_workflows_ng', subfolder: 'admin_other' },
    };
    
    const pageMapping = adminPageMap[page];
    if (pageMapping) {
      return `${basePath}/${moduleFolder}/${pageMapping.subfolder}/${pageMapping.file}.mdx`;
    }
    
    // Fallback: try to construct path from section and page
    if (subfolder) {
      const fileName = pageIdToFileName(page);
      return `${basePath}/${moduleFolder}/${subfolder}/${fileName}.mdx`;
    }
    
    return null;
  }
  
  // My Dashboard module
  if (module === 'my-dashboard') {
    // Special handling for my-dashboard-overview - file exists with -6_1 suffix
    if (page === 'my-dashboard-overview') {
      return `${basePath}/${moduleFolder}/my-dashboard-overview-6_1.mdx`;
    }
    // system-icons is in application_overview_ng, not my_dashboard_ng
    if (page === 'system-icons') {
      return `${basePath}/application_overview_ng/${pageIdToFileName(page)}.mdx`;
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
    const fileName = pageIdToFileName(page);
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
  const fileName = pageIdToFileName(page);
  return `${basePath}/${moduleFolder}/${fileName}.mdx`;
}

/**
 * Resolve the path to the MDX file based on navigation parameters
 */
export function resolveMDXPath({ version, module, section, page }: PathResolverParams): string | null {
  const versionDir = formatVersionForPath(version);
  
  // Special handling for NextGen
  if (version === 'NextGen') {
    return getNextGenPath(module, section, page);
  }
  
  // Special handling for My Dashboard in version 6.1
  if (module === 'my-dashboard' && version === '6.1') {
    return getMyDashboard61Path(page, section);
  }
  
  // Special handling for Admin > SACM pages in version 6.1
  if (module === 'admin' && section === 'sacm' && version === '6.1') {
    const sacmPageToFileMap: Record<string, string> = {
      'blueprints': 'blueprints_6_1',
      'bsm-views': 'custom_bsm_views_6_1',
      'cmdb-graphical-workflow': 'cmdb_graphical_workflow_6_1',
      'cmdb-properties': 'cmdb_properties_6_1',
      'confidence-configuration': 'confidence_config_6_1',
      'duplicates-remediation': 'dups_remediation_6_1',
      'export-ci-template': 'export_ci_template_6_1',
      'ip-connection-score-threshold': 'ip_conn_score_threshold_6_1',
      'process-tags': 'process_tags_6_1',
      'property-group': 'property_group_6_1',
      'relationship-types': 'relationship_types_6_1',
      'software-license-validity-check': 'software_lic_validity_check_6_1',
      'software-usage-report': 'software_usage_report_6_1',
    };
    const fileName = sacmPageToFileMap[page];
    if (fileName) {
      return `/content/6_1/admin_6_1/admin_sacm/${fileName}.mdx`;
    }
  }
  
  // For now, only return paths for files that actually exist in contentLoader
  // This prevents attempting to load non-existent MDX files
  // Other content will fall back to the default hardcoded content
  
  // Return null to indicate no MDX file is available
  // The component will fall back to hardcoded content
  return null;
}

/**
 * Check if a specific module/version combination has custom file structure
 */
export function hasCustomFileStructure(module: string, version: string): boolean {
  return module === 'my-dashboard' && version === '6.1';
}
