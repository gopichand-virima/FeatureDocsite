import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import logo from 'figma:asset/20803a9cc590c8a78bca4489c80f3bfca906561c.png';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVersion, setSelectedVersion] = useState('NextGen');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);

  // Helper function to map folder names to module names
  const mapFolderToModule = (folder: string): string => {
    const folderMap: Record<string, string> = {
      'application_overview_6_1': 'application-overview',
      'my-dashboard-6_1': 'my-dashboard',
      'cmdb_6_1': 'cmdb',
      'discovery_scan_6_1': 'discovery-scan',
      'itsm_6_1': 'itsm',
      'itam_6_1': 'itam',
      'vulnerability_management-6_1': 'vulnerability-management',
      'self-service-6_1': 'self-service',
      'program-project-management-6_1': 'program-project-management',
      'risk-register-6_1': 'risk-register',
      'reports-6_1': 'reports',
      'admin_6_1': 'admin',
    };
    return folderMap[folder] || folder;
  };

  // Helper function to map file names to page/section
  const mapFileNameToPage = (fileName: string, module: string, subFolder?: string): { section: string; page: string } => {
    // Remove .mdx extension if present
    const cleanName = fileName.replace(/\.mdx$/, '').replace(/\.html$/, '');
    
    // Handle shared functions (subfolder case)
    if (subFolder === 'shared_functions_6_1') {
      // Map shared function file names to page IDs
      const sharedFunctionMap: Record<string, string> = {
        'about_common_functions_6_1': 'about-common-functions',
        'advanced_search_6_1': 'advanced-search',
        'attachments_6_1': 'attachments',
        'auto_refresh_6_1': 'auto-refresh',
        'collapse_maximize_6_1': 'collapse-maximize',
        'comments_6_1': 'comments',
        'copy_to_cherwell_6_1': 'copy-to-cherwell',
        'copy_to_ivanti_6_1': 'copy-to-ivanti',
        'copy_to_servicenow_6_1': 'copy-to-servicenow',
        'delete_remove_6_1': 'delete-remove',
        'email_prefs_6_1': 'email-preferences',
        'enable_disable_editing_6_1': 'enable-disable-editing',
        'export_6_1': 'export',
        'history_6_1': 'history',
        'import_6_1': 'import',
        'items_per_page_6_1': 'items-per-page',
        'mark_as_knowledge_6_1': 'mark-as-knowledge',
        'other_asset_info_6_1': 'other-asset-info',
        'outage_calendar_6_1': 'outage-calendar',
        'personalize_columns_6_1': 'personalize-columns',
        'print_6_1': 'print',
        'process_adm_6_1': 'process-adm',
        'process_missing_components_6_1': 'process-missing-components',
        'records_per_page_6_1': 'records-per-page',
        'reload_default_mapping_6_1': 'reload-default-mapping',
        're_scan_6_1': 're-scan',
        're_sync_data_6_1': 're-sync-data',
        'save_6_1': 'save',
        'saved_filters_6_1': 'saved-filters',
        'searching_6_1': 'searching',
        'show_main_all_properties_6_1': 'show-main-all-properties',
        'tasks_6_1': 'tasks',
        'updates_6_1': 'updates',
        'version_control_6_1': 'version-control',
        'go_to_page_6_1': 'go-to-page',
        'send_report_to_6_1': 'send-report-to',
      };
      const page = sharedFunctionMap[cleanName] || cleanName.replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'shared-functions', page };
    }
    
    // For application overview module
    if (module === 'application-overview') {
      if (cleanName === 'all_about_virima_v6_1') {
        return { section: 'application-overview', page: 'all-about-virima' };
      }
      if (cleanName === 'icons_6_1' || cleanName === 'system-icons-6_1') {
        return { section: 'application-overview', page: 'system-icons' };
      }
      if (cleanName === 'user_specific_functions_6_1') {
        return { section: 'application-overview', page: 'user-specific-functions' };
      }
      if (cleanName === 'online_help_6_1' || cleanName === 'online-help-6_1') {
        return { section: 'application-overview', page: 'online-help' };
      }
    }
    
    // For my-dashboard module (check for application-overview pages that appear under my-dashboard)
    if (module === 'my-dashboard') {
      // Application overview pages that can appear under my-dashboard module
      if (cleanName === 'online_help_6_1' || cleanName === 'online-help-6_1') {
        return { section: 'application-overview', page: 'online-help' };
      }
      if (cleanName === 'icons_6_1') {
        // Icons under application-overview section in my-dashboard module
        return { section: 'application-overview', page: 'system-icons' };
      }
      if (cleanName === 'user_specific_functions_6_1') {
        return { section: 'application-overview', page: 'user-specific-functions' };
      }
      
      // My-dashboard specific pages
      const pageMap: Record<string, string> = {
        'my-dashboard-overview-6_1': 'my-dashboard-overview',
        'dashboards-6_1': 'dashboards',
        'dashboards-contents-6_1': 'dashboards-contents',
        'dashboards-customization-6_1': 'customization',
        'dashboards-report-actions-6_1': 'report-actions',
        'my-dashboard-6_1': 'my-dashboard-section', // Nested My Dashboard under Dashboards
        'my-dashboard-contents-6_1': 'my-dashboard-contents', // Contents under nested My Dashboard
        'system-icons-6_1': 'system-icons', // This is for my-dashboard section, not application-overview
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'my-dashboard', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '');
      return { section: 'my-dashboard', page: fallbackPage };
    }
    
    // For CMDB module
    if (module === 'cmdb') {
      // CMDB page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'cmdb_overview_6_1': 'cmdb-overview',
        'access_cmdb_6_1': 'access-cmdb',
        'manage_cmdb_6_1': 'manage-cmdb',
        'view_and_edit_ci_6_1': 'view-and-edit-ci',
        'view_and_edit_a_ci_6_1': 'view-and-edit-ci',
        'ci_left_panel_6_1': 'ci-left-panel',
        'contacts_on_ci_6_1': 'contacts-on-ci',
        'contacts_on_a_ci_6_1': 'contacts-on-ci',
        'ci_details_and_tabs_6_1': 'ci-details-and-tabs',
        'details_6_1': 'details',
        'manage_ci_6_1': 'manage-ci',
        'business_service_map_6_1': 'business-service-map',
        'components_6_1': 'components',
        'logon_events_6_1': 'logon-events',
        'itsm_6_1': 'itsm',
        'relationships_6_1': 'relationships',
        'audits_tab_6_1': 'audits-tab',
        'sla_6_1': 'sla',
        'maintenance_6_1': 'maintenance',
        'vulnerability_6_1': 'vulnerability',
        'private_properties_6_1': 'private-properties',
        'tasks_6_1': 'tasks',
        'history_6_1': 'history',
        'attachments_6_1': 'attachments',
        'comments_6_1': 'comments',
        'other_functions_and_page_elements_6_1': 'other-functions-and-page-elements',
        // Manage CMDB sub-pages
        'audits_6_1': 'audits',
        'change_attributes_6_1': 'change-attributes',
        'delete_6_1': 'delete',
        'export_6_1': 'export',
        'new_6_1': 'new',
        'copy_to_ivanti_6_1': 'copy-to-ivanti',
        'copy_to_jira_6_1': 'copy-to-jira',
        'copy_to_servicenow_6_1': 'copy-to-servicenow',
        'generate_installed_software_report_6_1': 'generate-installed-software-report',
        'process_adm_6_1': 'process-adm',
        'process_available_patch_report_6_1': 'process-available-patch-report',
        'process_cloud_hierarchy_6_1': 'process-cloud-hierarchy',
        'process_devops_6_1': 'process-devops',
        'process_missing_components_6_1': 'process-missing-components',
        'process_network_connection_6_1': 'process-network-connection',
        'process_software_installation_6_1': 'process-software-installation',
        'process_network_virtualization_hierarchy_6_1': 'process-network-virtualization-hierarchy',
        'proces_network_virtualization_hierarchy_6_1': 'process-network-virtualization-hierarchy', // Handle typo in filename
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'cmdb', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'cmdb', page: fallbackPage };
    }
    
    // For Discovery Scan module
    if (module === 'discovery-scan') {
      // Discovery Scan page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'discovery_scan_6_1': 'discovery-scan-overview',
        'dashboard_6_1': 'dashboard',
        'access_dashboard_6_1': 'access-dashboard',
        'dashboard_features_6_1': 'dashboard-features',
        'add_contents_6_1': 'add-contents',
        'dashboard_customization_6_1': 'dashboard-customization',
        'run_a_scan_6_1': 'run-a-scan',
        'pre_requisites_for_scan_6_1': 'pre-requisites-for-scan',
        'initiate_and_configure_discovery_scan_6_1': 'initiate-and-configure-discovery-scan',
        'access_run_a_scan_6_1': 'access-run-a-scan',
        'configure_discovery_scan_6_1': 'configure-discovery-scan',
        'probes_configuration_6_1': 'probes-configuration',
        'client_configuration_6_1': 'client-configuration',
        'recent_scans_6_1': 'recent-scans',
        'access_recent_scan_6_1': 'access-recent-scan',
        'view_recent_scan_6_1': 'view-recent-scan',
        'details_6_1': 'details',
        'export_scan_report_6_1': 'export-scan-report',
        'refresh_6_1': 'refresh',
        'logs_6_1': 'logs',
        'tasks_6_1': 'tasks',
        'comments_6_1': 'comments',
        'attachments_6_1': 'attachments',
        'scheduled_scans_and_imports_6_1': 'scheduled-scans-and-imports',
        'prerequisites_scheduled_scans_and_imports_6_1': 'prerequisites',
        'accessing_scheduled_scan_and_imports_6_1': 'accessing-scheduled-scan-and-imports',
        'key_features_and_options_on_the_landing_page_6_1': 'key-features-and-options-on-the-landing-page',
        'scans_and_import_options_6_1': 'scans-and-import-options',
        'scan_and_import_schedule_list_6_1': 'scan-and-import-schedule-list',
        'schedule_a_network_scan_6_1': 'schedule-a-network-scan',
        'editing_a_scheduled_scan_6_1': 'editing-a-scheduled-scan',
        'history_of_scheduled_scan_execution_6_1': 'history-of-scheduled-scan-execution',
        'bulk_update_scan_6_1': 'bulk-update-scan',
        'exporting_a_scan_6_1': 'exporting-a-scan',
        'importing_scan_schedules_6_1': 'importing-scan-schedules',
        'deleting_a_scan_schedule_6_1': 'deleting-a-scan-schedule',
        'scheduled_import_setup_6_1': 'scheduled-import-setup',
        'aws_import_6_1': 'aws-import',
        'azure_import_6_1': 'azure-import',
        'meraki_import_6_1': 'meraki-import',
        'ipam_networks_6_1': 'ipam-networks',
        'ipam_procedure_6_1': 'ipam-procedure',
        'infoblox_configuration_6_1': 'infoblox-configuration',
        'ipam_ip_address_management_6_1': 'ipam-ip-address-management',
        'ipam_functions_overview_6_1': 'ipam-functions-overview',
        'scan_function_6_1': 'scan-function',
        'status_update_6_1': 'status-update',
        'regular_scan_6_1': 'regular-scan',
        'sync_instant_and_scheduled_6_1': 'sync-instant-and-scheduled',
        'view_and_edit_a_network_6_1': 'view-and-edit-a-network',
        'other_functions_and_page_elements_ipam_6_1': 'other-functions-and-page-elements-ipam',
        'discovered_items_6_1': 'discovered-items',
        'prerequisites_discovered_items_6_1': 'prerequisites-discovered-items',
        'access_discovered_items_6_1': 'access-discovered-items',
        'manage_discovered_items_6_1': 'manage-discovered-items',
        'delete_discovered_items_6_1': 'delete-discovered-items',
        'export_discovered_items_6_1': 'export-discovered-items',
        'export_without_selecting_any_record_6_1': 'export-without-selecting-any-record',
        'move_to_cmdb_6_1': 'move-to-cmdb',
        're_scan_6_1': 're-scan',
        'column_descriptions_6_1': 'column-descriptions',
        'detailed_view_of_discovered_items_6_1': 'detailed-view-of-discovered-items',
        'primary_details_block_6_1': 'primary-details-block',
        'owner_block_6_1': 'owner-block',
        'main_information_area_6_1': 'main-information-area',
        'action_buttons_6_1': 'action-buttons',
        'navigation_tabs_6_1': 'navigation-tabs',
        'other_functions_and_page_elements_discovered_items_6_1': 'other-functions-and-page-elements-discovered-items',
        'toolbar_or_control_bar_6_1': 'toolbar-or-control-bar',
        'filter_by_6_1': 'filter-by',
        'import_from_aws_6_1': 'import-from-aws',
        'access_the_import_aws_window_6_1': 'access-the-import-aws-window',
        'import_aws_record_6_1': 'import-aws-record',
        'view_aws_import_record_6_1': 'view-aws-import-record',
        'key_columns_aws_6_1': 'key-columns-aws',
        'move_items_to_cmdb_aws_6_1': 'move-items-to-cmdb-aws',
        'logs_aws_6_1': 'logs-aws',
        'delete_aws_record_6_1': 'delete-aws-record',
        'export_aws_records_6_1': 'export-aws-records',
        'view_a_discovered_aws_record_6_1': 'view-a-discovered-aws-record',
        'import_from_azure_6_1': 'import-from-azure',
        'access_import_azure_window_6_1': 'access-import-azure-window',
        'import_azure_record_6_1': 'import-azure-record',
        'view_azure_import_record_6_1': 'view-azure-import-record',
        'common_controls_azure_6_1': 'common-controls-azure',
        'key_columns_azure_6_1': 'key-columns-azure',
        'move_items_to_the_cmdb_azure_6_1': 'move-items-to-the-cmdb-azure',
        'delete_azure_record_6_1': 'delete-azure-record',
        'export_azure_records_6_1': 'export-azure-records',
        'view_a_discovered_azure_record_6_1': 'view-a-discovered-azure-record',
        'discovered_item_view_overview_azure_6_1': 'discovered-item-view-overview-azure',
        'top_right_actions_azure_6_1': 'top-right-actions-azure',
        'tabs_main_panel_azure_6_1': 'tabs-main-panel-azure',
        'import_from_meraki_6_1': 'import-from-meraki',
        'prerequisites_meraki_6_1': 'prerequisites-meraki',
        'assess_import_meraki_window_6_1': 'assess-import-meraki-window',
        'import_meraki_record_6_1': 'import-meraki-record',
        'view_meraki_import_record_6_1': 'view-meraki-import-record',
        'common_controls_meraki_6_1': 'common-controls-meraki',
        'key_columns_meraki_6_1': 'key-columns-meraki',
        'move_items_to_the_cmdb_meraki_6_1': 'move-items-to-the-cmdb-meraki',
        'logs_meraki_6_1': 'logs-meraki',
        'delete_meraki_record_6_1': 'delete-meraki-record',
        'export_meraki_records_6_1': 'export-meraki-records',
        'view_a_discovered_meraki_record_6_1': 'view-a-discovered-meraki-record',
        'discovered_item_view_overview_meraki_6_1': 'discovered-item-view-overview-meraki',
        'top_right_actions_meraki_6_1': 'top-right-actions-meraki',
        'tabs_main_panel_meraki_6_1': 'tabs-main-panel-meraki',
        'import_from_intune_6_1': 'import-from-intune',
        'access_import_from_intune_6_1': 'access-import-from-intune',
        'import_intune_record_6_1': 'import-intune-record',
        'view_intune_import_record_6_1': 'view-intune-import-record',
        'delete_intune_record_6_1': 'delete-intune-record',
        'export_intune_records_6_1': 'export-intune-records',
        'view_a_discovered_intune_record_6_1': 'view-a-discovered-intune-record',
        'import_data_files_6_1': 'import-data-files',
        'access_the_import_data_files_6_1': 'access-the-import-data-files',
        'manage_import_data_files_6_1': 'manage-import-data-files',
        'import_ci_6_1': 'import-ci',
        'view_an_imported_data_file_6_1': 'view-an-imported-data-file',
        'all_tab_6_1': 'all-tab',
        'authorized_tab_6_1': 'authorized-tab',
        'unauthorized_tab_6_1': 'unauthorized-tab',
        'import_asset_ci_relations_6_1': 'import-asset-ci-relations',
        'delete_import_data_files_6_1': 'delete-import-data-files',
        'export_import_data_files_6_1': 'export-import-data-files',
        'imported_assets_6_1': 'imported-assets',
        'access_the_imported_assets_6_1': 'access-the-imported-assets',
        'manage_imported_assets_6_1': 'manage-imported-assets',
        'imported_asset_details_6_1': 'imported-asset-details',
        'ad_user_import_logs_6_1': 'ad-user-import-logs',
        'ad_configuration_and_import_6_1': 'ad-configuration-and-import',
        'ad_configuration_property_descriptions_6_1': 'ad-configuration-property-descriptions',
        'testing_ad_configuration_6_1': 'testing-ad-configuration',
        'import_users_6_1': 'import-users',
        'scheduled_ad_import_6_1': 'scheduled-ad-import',
        'access_the_ad_user_import_logs_6_1': 'access-the-ad-user-import-logs',
        'view_import_log_details_6_1': 'view-import-log-details',
        'details_tab_6_1': 'details-tab',
        'tabs_for_extended_information_6_1': 'tabs-for-extended-information',
        'customize_columns_6_1': 'customize-columns',
        'azure_ad_user_import_logs_6_1': 'azure-ad-user-import-logs',
        'azure_ad_configuration_and_import_6_1': 'azure-ad-configuration-and-import',
        'azure_ad_configuration_property_descriptions_6_1': 'azure-ad-configuration-property-descriptions',
        'testing_ad_configuration_azure_6_1': 'testing-ad-configuration-azure',
        'import_users_azure_6_1': 'import-users-azure',
        'scheduled_azure_ad_import_6_1': 'scheduled-azure-ad-import',
        'access_the_azure_ad_user_import_logs_6_1': 'access-the-azure-ad-user-import-logs',
        'view_import_log_details_azure_6_1': 'view-import-log-details-azure',
        'details_tab_azure_6_1': 'details-tab-azure',
        'key_information_displayed_6_1': 'key-information-displayed',
        'tabs_for_extended_information_azure_6_1': 'tabs-for-extended-information-azure',
        'customize_columns_azure_6_1': 'customize-columns-azure',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'discovery-scan', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'discovery-scan', page: fallbackPage };
    }
    
    // For ITSM module
    if (module === 'itsm') {
      // ITSM page mappings - maps file names to page IDs
      // Handle CMDB submodule files (from itam_6_1/cmdb_6_1/)
      const pageMap: Record<string, string> = {
        // Configuration Management > CMDB pages
        'access_cmdb_6_1': 'access-cmdb',
        'manage_cmdb_6_1': 'manage-cmdb',
        'audits_6_1': 'audits',
        'change_attributes_6_1': 'change-attributes',
        'delete_6_1': 'delete',
        'export_6_1': 'export',
        'new_6_1': 'new',
        'copy_to_ivanti_6_1': 'copy-to-ivanti',
        'copy_to_jira_6_1': 'copy-to-jira',
        'copy_to_servicenow_6_1': 'copy-to-servicenow',
        'generate_installed_software_report_6_1': 'generate-installed-software-report',
        'process_adm_6_1': 'process-adm',
        'process_available_patch_report_6_1': 'process-available-patch-report',
        'process_cloud_hierarchy_6_1': 'process-cloud-hierarchy',
        'process_devops_6_1': 'process-devops',
        'process_missing_components_6_1': 'process-missing-components',
        'process_network_connection_6_1': 'process-network-connection',
        'process_software_installation_6_1': 'process-software-installation',
        // View and Edit a CI pages
        'ci_left_panel_6_1': 'ci-left-panel',
        'contacts_on_ci_6_1': 'contacts-on-ci',
        'contacts_on_a_ci_6_1': 'contacts-on-ci',
        // CI Details and Tabs pages
        'ci_details_and_tabs_6_1': 'ci-details-and-tabs',
        'details_6_1': 'details',
        'manage_ci_6_1': 'manage-ci',
        'business_service_map_6_1': 'business-service-map',
        'components_6_1': 'components',
        'logon_events_6_1': 'logon-events',
        'itsm_6_1': 'itsm-tab',
        'relationships_6_1': 'relationships',
        'audits_tab_6_1': 'audits-tab',
        'sla_6_1': 'sla',
        'maintenance_6_1': 'maintenance',
        'vulnerability_6_1': 'vulnerability',
        'private_properties_6_1': 'private-properties',
        'tasks_6_1': 'tasks',
        'history_6_1': 'history',
        'attachments_6_1': 'attachments',
        'comments_6_1': 'comments',
        // Other Functions and Page Elements
        'other_functions_and_page_elements_6_1': 'other-functions-and-page-elements',
        'sync_logs_6_1': 'sync-logs',
        'tags_6_1': 'tags',
        // Configuration Management
        'configuration_management_6_1': 'configuration-management',
        'dashboard_6_1': 'dashboard',
      };
      const page = pageMap[cleanName];
      if (page) {
        // Determine section based on page
        if (page === 'configuration-management' || page === 'dashboard' || page === 'cmdb' || page === 'access-cmdb' || page === 'manage-cmdb' || 
            ['audits', 'change-attributes', 'delete', 'export', 'new', 'copy-to-ivanti', 'copy-to-jira', 'copy-to-servicenow',
             'generate-installed-software-report', 'process-adm', 'process-available-patch-report', 'process-cloud-hierarchy',
             'process-devops', 'process-missing-components', 'process-network-connection', 'process-software-installation'].includes(page)) {
          return { section: 'itsm', page };
        } else if (['ci-left-panel', 'contacts-on-ci', 'ci-details-and-tabs', 'details', 'manage-ci', 'business-service-map',
                     'components', 'logon-events', 'itsm-tab', 'relationships', 'audits-tab', 'sla', 'maintenance',
                     'vulnerability', 'private-properties', 'tasks', 'history', 'attachments', 'comments',
                     'other-functions-and-page-elements', 'sync-logs', 'tags'].includes(page)) {
          return { section: 'itsm', page };
        }
        return { section: 'itsm', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'itsm', page: fallbackPage };
    }
    
    // For ITAM module
    if (module === 'itam') {
      // ITAM page mappings - maps file names to page IDs
      // Handle CMDB submodule files (from itam_6_1/cmdb_6_1/)
      const pageMap: Record<string, string> = {
        // Configuration Management > CMDB pages
        'access_cmdb_6_1': 'access-cmdb',
        'manage_cmdb_6_1': 'manage-cmdb',
        'audits_6_1': 'audits',
        'change_attributes_6_1': 'change-attributes',
        'delete_6_1': 'delete',
        'export_6_1': 'export',
        'new_6_1': 'new',
        'copy_to_ivanti_6_1': 'copy-to-ivanti',
        'copy_to_jira_6_1': 'copy-to-jira',
        'copy_to_servicenow_6_1': 'copy-to-servicenow',
        'generate_installed_software_report_6_1': 'generate-installed-software-report',
        'process_adm_6_1': 'process-adm',
        'process_available_patch_report_6_1': 'process-available-patch-report',
        'process_cloud_hierarchy_6_1': 'process-cloud-hierarchy',
        'process_devops_6_1': 'process-devops',
        'process_missing_components_6_1': 'process-missing-components',
        'process_network_connection_6_1': 'process-network-connection',
        'process_software_installation_6_1': 'process-software-installation',
        'process_network_virtualization_hierarchy_6_1': 'process-network-virtualization-hierarchy',
        // View and Edit a CI pages
        'ci_left_panel_6_1': 'ci-left-panel',
        'contacts_on_ci_6_1': 'contacts-on-ci',
        // CI Details and Tabs pages
        'ci_details_and_tabs_6_1': 'ci-details-and-tabs',
        'details_6_1': 'details',
        'manage_ci_6_1': 'manage-ci',
        'business_service_map_6_1': 'business-service-map',
        'components_6_1': 'components',
        'logon_events_6_1': 'logon-events',
        'itsm_6_1': 'itsm',
        'relationships_6_1': 'relationships',
        'audits_tab_6_1': 'audits-tab',
        'sla_6_1': 'sla',
        'maintenance_6_1': 'maintenance',
        'vulnerability_6_1': 'vulnerability',
        'private_properties_6_1': 'private-properties',
        'tasks_6_1': 'tasks',
        'history_6_1': 'history',
        'attachments_6_1': 'attachments',
        'comments_6_1': 'comments',
        // Other Functions and Page Elements
        'other_functions_and_page_elements_6_1': 'other-functions-and-page-elements',
        'sync_logs_6_1': 'sync-logs',
        'tags_6_1': 'tags',
        // Main ITAM pages
        'audits_itam_6_1': 'audits',
        'asset_lic_entitlement_6_1': 'asset-license-entitlement',
        'user_license_entitle_6_1': 'user-license-entitlement',
        'stockroom_6_1': 'stockroom',
        'stockroom_type_6_1': 'stockroom-type',
        'service_design_package_6_1': 'service-design-package',
        // Procurement pages
        'req_items_6_1': 'requested-items',
        'po_6_1': 'purchase-orders',
        'po_line_items_6_1': 'purchase-order-line-items',
        'recv_slip_6_1': 'receiving-slips',
        'recv_slip_lines_6_1': 'receiving-slip-lines',
        'transfer_order_6_1': 'transfer-order',
        // Financial Management pages
        'about_financial_management_6_1': 'about-financial-management',
        'ci_financial_plan_6_1': 'ci-financial-plan',
        'service_financial_plan_6_1': 'service-financial-plan',
      };
      const page = pageMap[cleanName];
      if (page) {
        // Determine section based on page
        if (page === 'configuration-management' || page === 'dashboard' || page === 'cmdb' || page === 'access-cmdb' || page === 'manage-cmdb' ||
            ['audits', 'change-attributes', 'delete', 'export', 'new', 'copy-to-ivanti', 'copy-to-jira', 'copy-to-servicenow',
             'generate-installed-software-report', 'process-adm', 'process-available-patch-report', 'process-cloud-hierarchy',
             'process-devops', 'process-missing-components', 'process-network-connection', 'process-software-installation',
             'process-network-virtualization-hierarchy'].includes(page)) {
          return { section: 'itam', page };
        } else if (['ci-left-panel', 'contacts-on-ci', 'ci-details-and-tabs', 'details', 'manage-ci', 'business-service-map',
                     'components', 'logon-events', 'itsm', 'relationships', 'audits-tab', 'sla', 'maintenance',
                     'vulnerability', 'private-properties', 'tasks', 'history', 'attachments', 'comments',
                     'other-functions-and-page-elements', 'sync-logs', 'tags'].includes(page)) {
          return { section: 'itam', page };
        } else if (['requested-items', 'purchase-orders', 'purchase-order-line-items', 'receiving-slips',
                     'receiving-slip-lines', 'transfer-order'].includes(page)) {
          return { section: 'itam', page };
        } else if (['about-financial-management', 'ci-financial-plan', 'service-financial-plan'].includes(page)) {
          return { section: 'itam', page };
        }
        return { section: 'itam', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'itam', page: fallbackPage };
    }
    
    // For Self Service module
    if (module === 'self-service') {
      // Self Service page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'service_catalog_6_1': 'service-catalog',
        'my_incidents_6_1': 'my-incidents',
        'my_requests_6_1': 'my-requests',
        'about_self_service_6_1': 'self-service',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'self-service', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'self-service', page: fallbackPage };
    }
    
    // For Program/Project Management module
    if (module === 'program-project-management') {
      // Program/Project Management page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'programs_6_1': 'programs',
        'program_dashboard_6_1': 'program-dashboard',
        'projects_6_1': 'projects',
        'project_dashboard_6_1': 'project-dashboard',
        'about_prog_proj_mngmnt_6_1': 'program-project-management',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'program-project-management', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'program-project-management', page: fallbackPage };
    }
    
    // For Risk Register module
    if (module === 'risk-register') {
      // Risk Register page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'risk_dashboard_6_1': 'risk-dashboard',
        'risks_6_1': 'risks',
        'risks_new_6_1': 'risks',
        'about_risk_register_6_1': 'risk-register',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'risk-register', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'risk-register', page: fallbackPage };
    }
    
    // For Reports module
    if (module === 'reports') {
      // Reports page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'reports_ad_hoc_6_1': 'ad-hoc-reports',
        'reports_new_ad_hoc_6_1': 'ad-hoc-reports',
        'reports_canned_6_1': 'canned-reports',
        'reports_new_canned_6_1': 'canned-reports',
        'reports_props_conds_6_1': 'properties-and-conditions',
        'reports_run_6_1': 'run-report',
        'reports_delete_6_1': 'delete-report',
        'reports_6_1': 'reports',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'reports', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'reports', page: fallbackPage };
    }
    
    // For Admin module
    if (module === 'admin') {
      // Admin page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        // Organizational Details pages (admin_org_details folder)
        'cost_center_6_1': 'cost-center',
        'departments_6_1': 'departments',
        'departments_members_6_1': 'members',
        'designations_6_1': 'designations',
        'holidays_6_1': 'holidays',
        'locations_6_1': 'locations',
        'operational_hours_6_1': 'operational-hours',
        'organizational_details_6_1': 'organizational-details-nested',
        'about_org_details_6_1': 'organizational-details',
        // Discovery pages (admin_discovery folder)
        'application_map_6_1': 'application-map',
        'client_6_1': 'client',
        'client_discovery_agents_6_1': 'discovery-agents',
        'client_remote_install_6_1': 'remote-install',
        'client_restart_6_1': 'restart-client',
        'correlation_6_1': 'correlation',
        'credentials_6_1': 'credentials',
        'credentials_details_6_1': 'details',
        'credentials_backup_file_6_1': 'backup-file',
        'credentials_flush_6_1': 'flush-credential',
        'downloading_discovery_6_1': 'download-application',
        'import_templates_6_1': 'import-templates',
        'ignore_adm_process_6_1': 'ignore-adm-process',
        'ignore_process_6_1': 'ignore-process',
        'major_software_6_1': 'major-software',
        'mon_prof_6_1': 'monitoring-profile',
        'mon_prof_action_details_6_1': 'action-details',
        'mon_prof_details_6_1': 'details',
        'mon_prof_frequency_6_1': 'frequency',
        'mon_prof_notifications_6_1': 'notifications',
        'mon_prof_trigger_conditions_6_1': 'trigger-conditions',
        'patterns_6_1': 'patterns',
        'port_config_process_6_1': 'port-configuration',
        'probe_workflow_6_1': 'probe-workflow',
        'probes_6_1': 'probes',
        'scan_configuration_6_1': 'scan-configuration',
        'sensors_6_1': 'sensors',
        // SACM pages (admin_sacm folder)
        'blueprints_6_1': 'blueprints',
        'custom_bsm_views_6_1': 'bsm-views',
        'bsm_views_6_1': 'bsm-views',
        'cmdb_graphical_workflow_6_1': 'cmdb-graphical-workflow',
        'cmdb_properties_6_1': 'cmdb-properties',
        'confidence_config_6_1': 'confidence-configuration',
        'dups_remediation_6_1': 'duplicates-remediation',
        'export_ci_template_6_1': 'export-ci-template',
        'ip_conn_score_threshold_6_1': 'ip-connection-score-threshold',
        'process_tags_6_1': 'process-tags',
        'property_group_6_1': 'property-group',
        'relationship_types_6_1': 'relationship-types',
        'software_lic_validity_check_6_1': 'software-license-validity-check',
        'sw_lic_validity_check_6_1': 'software-license-validity-check',
        'software_usage_report_6_1': 'software-usage-report',
        // Users pages (admin_users folder)
        'ad_imp_auth_6_1': 'ad-configuration',
        'azure_ad_config_6_1': 'azure-ad-configuration',
        'saml_config_6_1': 'saml-configuration',
        'time_track_reports_6_1': 'time-track-reports',
        'user_groups_6_1': 'user-groups',
        'user_roles_6_1': 'user-roles',
        'users_6_1': 'users-list',
        // Management Functions pages
        'about_change_mngmnt_6_1': 'change-management',
        'about_contract_mngmnt_6_1': 'contract-management',
        'about_event_mngmnt_6_1': 'event-management',
        'hardware_asset_mngmnt_6_1': 'hardware-asset-management',
        'about_incident_mngmnt_6_1': 'incident-management',
        'about_knowledge_mngmnt_6_1': 'knowledge-management',
        'about_problem_mngmnt_6_1': 'problem-management',
        'about_procurement_6_1': 'about-procurement',
        'procurement_properties_6_1': 'procurement-properties',
        'procurement_property_group_6_1': 'procurement-property-group',
        'about_project_mngmnt_6_1': 'project-management',
        'about_release_mngmnt_6_1': 'release-management',
        'about_request_mngmnt_6_1': 'request-management',
        'about_vendor_mngmnt_6_1': 'vendor-management',
        // Integrations pages (admin_integrations folder)
        'cherwell_credential_6_1': 'cherwell-credential',
        'cherwell_mappings_6_1': 'cherwell-mappings',
        'infoblox_config_6_1': 'infoblox-configuration',
        'ivanti_credentials_6_1': 'ivanti-credentials',
        'ivanti_mappings_6_1': 'ivanti-mappings',
        'jira_credentials_6_1': 'jira-credentials',
        'jira_mappings_6_1': 'jira-asset-mappings',
        'servicenow_credentials_6_1': 'servicenow-credentials',
        'servicenow_mappings_6_1': 'servicenow-mappings',
        // Others pages (admin_other folder)
        'announcements_6_1': 'announcements',
        'business_rules_6_1': 'business-rules',
        'custom_reports_6_1': 'custom-reports',
        'documentation_tester_6_1': 'documentation-and-tester',
        'inbox_config_itsm_ticket_mngmnt_6_1': 'inbox-configuration-itsm',
        'kpis_6_1': 'kpis',
        'reports_6_1': 'reports',
        'role_access_6_1': 'role-access',
        'sla_6_1': 'service-level-agreements',
        'smtp_config_6_1': 'smtp-configuration',
        'risk_score_calculator_6_1': 'risk-score-calculator',
        'graphical_workflows_6_1': 'graphical-workflows',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'admin', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'admin', page: fallbackPage };
    }
    
    // For Vulnerability Management module
    if (module === 'vulnerability-management') {
      // Vulnerability Management page mappings - maps file names to page IDs
      const pageMap: Record<string, string> = {
        'core_functionality_6_1': 'core-functionality',
        'access_vulnerability_management_6_1': 'access-vulnerability-management',
        'view_vulnerability_management_6_1': 'view-vulnerability-management',
        'best_practices_6_1': 'best-practices',
        'limitations_considerations_6_1': 'limitations-and-considerations',
        'vulnerability_management_6_1': 'vulnerability-management',
      };
      const page = pageMap[cleanName];
      if (page) {
        return { section: 'vulnerability-management', page };
      }
      // Fallback: try to extract from cleanName
      const fallbackPage = cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'vulnerability-management', page: fallbackPage };
    }
    
    // Default: try to extract section and page from file name
    // Enterprise-grade: Comprehensive fallback logic for all file name formats
    let normalizedPage = cleanName;
    
    // Remove version suffix (handle both -6_1 and _6_1 formats)
    normalizedPage = normalizedPage.replace(/-6_1$/, '').replace(/_6_1$/, '');
    
    // Convert underscores to hyphens for consistency with sidebar page IDs
    normalizedPage = normalizedPage.replace(/_/g, '-');
    
    // Convert to lowercase for consistency
    normalizedPage = normalizedPage.toLowerCase();
    
    return { section: module, page: normalizedPage };
  };

  // Sync URL with state on mount and location changes
  useEffect(() => {
    // Clean up the path: remove leading slash, basename, and index.html
    // main.tsx already handles 404.html redirects and updates location.pathname
    // BrowserRouter with basename="/FeatureDocsite" automatically strips the base from location.pathname
    // So /FeatureDocsite/NextGen/my-dashboard/my-dashboard/index.html becomes /NextGen/my-dashboard/my-dashboard/index.html
    let path = location.pathname
      .replace(/^\//, '') // Remove leading slash
      .replace(/\/index\.html$/, '') // Remove trailing /index.html
      .replace(/index\.html$/, '') // Remove trailing index.html
      .replace(/\/$/, ''); // Remove trailing slash
    
    // Also handle case where path might still have FeatureDocsite (defensive)
    if (path.startsWith('FeatureDocsite/')) {
      path = path.replace(/^FeatureDocsite\//, '');
    }
    
    // If path is empty or just the base, show homepage
    if (!path || path === '' || path === 'index.html') {
      setSelectedModule('');
      setSelectedSection('');
      setSelectedPage('');
      setSelectedVersion('NextGen');
      return;
    }

    const parts = path.split('/').filter(Boolean); // Filter out empty strings
    
    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Routing debug:', { path, parts, location: location.pathname });
    }
    
    // Handle version detection - Enterprise-grade: supports all versions consistently
    // Supports both formats: dots (6.1, 6.1.1, 5.13) and underscores (6_1, 6_1_1, 5_13)
    // Also supports NG as alias for NextGen
    if (parts.length >= 1 && parts[0]) {
      const versionPart = parts[0];
      // Handle both underscore and dot formats for all versions
      if (versionPart === '6_1' || versionPart === '6.1') {
        setSelectedVersion('6.1');
      } else if (versionPart === '6_1_1' || versionPart === '6.1.1') {
        setSelectedVersion('6.1.1');
      } else if (versionPart === '5_13' || versionPart === '5.13') {
        setSelectedVersion('5.13');
      } else if (versionPart === 'NextGen' || versionPart === 'NG') {
        setSelectedVersion('NextGen');
      } else {
        // Default to NextGen if version not recognized (enterprise fallback)
        setSelectedVersion('NextGen');
      }
    } else {
      setSelectedVersion('NextGen');
    }
    
    // Determine if this is new format (with underscores like 6_1) or old format (with dots like 6.1, 6.1.1, 5.13, or NextGen)
    // New format uses underscores: 6_1, 6_1_1, 5_13
    // Old format uses dots or NextGen: 6.1, 6.1.1, 5.13, NextGen
    const isNewFormat = parts[0] && (parts[0].includes('_') || parts[0] === '6_1' || parts[0] === '6_1_1' || parts[0] === '5_13');
    const isOldFormat = parts[0] && (
      parts[0].includes('.') || 
      parts[0] === 'NextGen' || 
      parts[0] === '6.1' || 
      parts[0] === '6.1.1' || 
      parts[0] === '5.13'
    ) && !parts[0].includes('_');
    
    // Handle old URL format: /6.1/module/section/page, /6.1.1/module/section/page, /5.13/module/section/page, or /NextGen/module/section/page
    if (isOldFormat && parts.length >= 2) {
      // Set module
      if (parts.length >= 2 && parts[1]) {
        setSelectedModule(parts[1]);
      }
      
      // Handle different URL lengths
      if (parts.length >= 4 && parts[3]) {
        // Full path: /6.1/module/section/page
        if (parts.length >= 3 && parts[2]) {
          setSelectedSection(parts[2]);
        }
        setSelectedPage(parts[3]);
      } else if (parts.length === 3 && parts[2]) {
        // Path like /version/my-dashboard/my-dashboard (module/section, no page)
        // Works for: NextGen, 6.1, 6.1.1, 5.13
        // Check if parts[2] is the same as parts[1] (duplicate module name)
        if (parts[1] === parts[2]) {
          // This is a duplicate - treat as module only, set default section/page
          if (parts[1] === 'my-dashboard') {
            setSelectedSection('my-dashboard');
            setSelectedPage('my-dashboard-overview');
          } else if (parts[1] === 'cmdb') {
            setSelectedSection('cmdb');
            setSelectedPage('access-cmdb');
          } else if (parts[1] === 'discovery-scan') {
            setSelectedSection('discovery-scan');
            setSelectedPage('access-dashboard');
          } else {
            setSelectedSection(parts[1]);
            setSelectedPage('overview');
          }
        } else {
          // Different section name
          setSelectedSection(parts[2]);
          // Set default page based on module (consistent across all versions)
          if (parts[1] === 'my-dashboard') {
            setSelectedPage('my-dashboard-overview');
          } else if (parts[1] === 'cmdb') {
            setSelectedPage('access-cmdb');
          } else if (parts[1] === 'discovery-scan') {
            setSelectedPage('access-dashboard');
          } else {
            setSelectedPage('overview');
          }
        }
      } else if (parts.length === 2) {
        // Path like /version/my-dashboard (only module)
        // Works consistently for: NextGen, 6.1, 6.1.1, 5.13
        if (parts[1] === 'my-dashboard') {
          setSelectedSection('my-dashboard');
          setSelectedPage('my-dashboard-overview');
        } else if (parts[1] === 'cmdb') {
          setSelectedSection('cmdb');
          setSelectedPage('access-cmdb');
        } else if (parts[1] === 'discovery-scan') {
          setSelectedSection('discovery-scan');
          setSelectedPage('access-dashboard');
        } else {
          setSelectedSection('application-overview');
          setSelectedPage('advanced-search');
        }
      }
      return;
    }
    
    // New URL format: /6_1/module_folder/[subfolder/]file_name
    // Special case: /6_1/file_name (root level files like filter_by_6_1)
    if (parts.length >= 2 && parts[1]) {
      const moduleFolder = parts[1];
      
      // Check if this is a root-level file (not a module folder)
      const rootLevelFiles = ['filter_by_6_1', 'glossary_6_1', 'common_tasks_v6_6_1'];
      if (rootLevelFiles.includes(moduleFolder) && parts.length === 2) {
        // Root level file - map to application-overview > shared-functions or appropriate section
        if (moduleFolder === 'filter_by_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('shared-functions');
          setSelectedPage('filter-by');
        } else if (moduleFolder === 'glossary_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('application-overview');
          setSelectedPage('glossary');
        } else if (moduleFolder === 'common_tasks_v6_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('application-overview');
          setSelectedPage('common-tasks');
        }
        return;
      }
      
      const module = mapFolderToModule(moduleFolder);
      setSelectedModule(module);
      
      // Check if we have a subfolder (like shared_functions_6_1 or cmdb_6_1 for ITSM)
      let fileName = '';
      let subFolder = '';
      let actualModule = module;
      
      if (parts.length >= 4 && parts[2] === 'shared_functions_6_1') {
        // Format: /6_1/application_overview_6_1/shared_functions_6_1/file_name
        subFolder = parts[2];
        fileName = parts[3];
      } else if (parts.length >= 4 && parts[2] === 'cmdb_6_1' && moduleFolder === 'itam_6_1') {
        // Format: /6_1/itam_6_1/cmdb_6_1/file_name (ITSM CMDB submodule)
        subFolder = parts[2];
        fileName = parts[3];
        // Override module to 'itsm' since files are under itam_6_1 but module is itsm
        actualModule = 'itsm';
        setSelectedModule('itsm');
      } else if (parts.length >= 4 && parts[2] === 'admin_org_details' && moduleFolder === 'admin_6_1') {
        // Format: /6_1/admin_6_1/admin_org_details/file_name (Admin Organizational Details submodule)
        subFolder = parts[2];
        fileName = parts[3];
        actualModule = 'admin';
        setSelectedModule('admin');
      } else if (parts.length >= 3) {
        // Format: /6_1/module_folder/file_name
        fileName = parts[2];
      }
      
      if (fileName) {
        const { section, page } = mapFileNameToPage(fileName, actualModule, subFolder);
        setSelectedSection(section);
        setSelectedPage(page);
      } else {
        // Default section/page based on module
        if (actualModule === 'cmdb') {
          setSelectedSection('cmdb');
          setSelectedPage('access-cmdb');
        } else if (actualModule === 'discovery-scan') {
          setSelectedSection('discovery-scan');
          setSelectedPage('access-dashboard');
        } else if (actualModule === 'my-dashboard') {
          setSelectedSection('my-dashboard');
          setSelectedPage('my-dashboard-overview');
        } else if (actualModule === 'itsm') {
          setSelectedSection('itsm');
          setSelectedPage('configuration-management');
        } else if (actualModule === 'risk-register') {
          setSelectedSection('risk-register');
          setSelectedPage('risk-dashboard');
        } else if (actualModule === 'reports') {
          setSelectedSection('reports');
          setSelectedPage('ad-hoc-reports');
        } else if (actualModule === 'admin') {
          setSelectedSection('admin');
          setSelectedPage('organizational-details');
        } else if (actualModule === 'vulnerability-management') {
          setSelectedSection('vulnerability-management');
          setSelectedPage('core-functionality');
        } else {
          setSelectedSection('application-overview');
          setSelectedPage('advanced-search');
        }
      }
    }
  }, [location]);

  // Update URL when state changes
  // Enterprise-grade: Consistent URL generation across all versions (NextGen, 6.1.1, 6.1, 5.13)
  const updateURL = (version: string, module: string, section: string, page: string) => {
    if (!module) {
      navigate('/');
      return;
    }
    
    // Determine version path format
    // New format uses underscores: 6_1, 6_1_1, 5_13 (for version 6.1 only currently)
    // Old format uses dots: 6.1, 6.1.1, 5.13, NextGen (for all other versions)
    const useNewFormat = version === '6.1';
    const versionPath = useNewFormat 
      ? (version === '6.1' ? '6_1' : version === '6.1.1' ? '6_1_1' : version === '5.13' ? '5_13' : 'NextGen')
      : (version === '6.1' ? '6.1' : version === '6.1.1' ? '6.1.1' : version === '5.13' ? '5.13' : 'NextGen');
    
    // For version 6.1, use new format with folder structure: /6_1/module_folder/file_name
    if (useNewFormat && (module === 'my-dashboard' || module === 'itsm' || module === 'vulnerability-management' || module === 'itam' || module === 'self-service' || module === 'program-project-management' || module === 'risk-register' || module === 'reports' || module === 'admin')) {
      // Map to folder structure
      const folderMap: Record<string, string> = {
        'my-dashboard': 'my-dashboard-6_1',
        'cmdb': 'cmdb_6_1',
        'discovery-scan': 'discovery_scan_6_1',
        'application-overview': 'application_overview_6_1',
        'itsm': 'itam_6_1', // ITSM files are in itam_6_1 folder
        'itam': 'itam_6_1',
        'vulnerability-management': 'vulnerability_management-6_1',
        'self-service': 'self-service-6_1',
        'program-project-management': 'program-project-management-6_1',
        'risk-register': 'risk-register-6_1',
        'reports': 'reports_6_1',
        'admin': 'admin_6_1',
      };
      const moduleFolder = folderMap[module] || module;
      
      // Handle Self Service files
      if (module === 'self-service') {
        const fileName = `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle Program/Project Management files
      if (module === 'program-project-management') {
        const fileName = `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle Risk Register files
      if (module === 'risk-register') {
        const fileName = `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle Reports files
      if (module === 'reports') {
        // Map page IDs to actual file names
        const pageToFileMap: Record<string, string> = {
          'ad-hoc-reports': 'reports_ad_hoc_6_1',
          'canned-reports': 'reports_canned_6_1',
          'properties-and-conditions': 'reports_props_conds_6_1',
          'run-report': 'reports_run_6_1',
          'delete-report': 'reports_delete_6_1',
        };
        const fileName = pageToFileMap[page] || `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle Admin files
      if (module === 'admin') {
        // Map page IDs to actual file names and subfolders
        const pageToFileMap: Record<string, { file: string; subfolder?: string }> = {
          // Organizational Details
          'cost-center': { file: 'cost_center_6_1', subfolder: 'admin_org_details' },
          'departments': { file: 'departments_6_1', subfolder: 'admin_org_details' },
          'members': { file: 'departments_members_6_1', subfolder: 'admin_org_details' },
          'designations': { file: 'designations_6_1', subfolder: 'admin_org_details' },
          'holidays': { file: 'holidays_6_1', subfolder: 'admin_org_details' },
          'locations': { file: 'locations_6_1', subfolder: 'admin_org_details' },
          'operational-hours': { file: 'operational_hours_6_1', subfolder: 'admin_org_details' },
          'organizational-details-nested': { file: 'organizational_details_6_1', subfolder: 'admin_org_details' },
          'organizational-details': { file: 'about_org_details_6_1', subfolder: 'admin_org_details' },
          // Discovery
          'application-map': { file: 'application_map_6_1', subfolder: 'admin_discovery' },
          'client': { file: 'client_6_1', subfolder: 'admin_discovery' },
          'discovery-agents': { file: 'client_discovery_agents_6_1', subfolder: 'admin_discovery' },
          'remote-install': { file: 'client_remote_install_6_1', subfolder: 'admin_discovery' },
          'restart-client': { file: 'client_restart_6_1', subfolder: 'admin_discovery' },
          'correlation': { file: 'correlation_6_1', subfolder: 'admin_discovery' },
          'credentials': { file: 'credentials_6_1', subfolder: 'admin_discovery' },
          'details': { file: 'credentials_details_6_1', subfolder: 'admin_discovery' },
          'backup-file': { file: 'credentials_backup_file_6_1', subfolder: 'admin_discovery' },
          'flush-credential': { file: 'credentials_flush_6_1', subfolder: 'admin_discovery' },
          'download-application': { file: 'downloading_discovery_6_1', subfolder: 'admin_discovery' },
          'import-templates': { file: 'import_templates_6_1', subfolder: 'admin_discovery' },
          'ignore-adm-process': { file: 'ignore_adm_process_6_1', subfolder: 'admin_discovery' },
          'ignore-process': { file: 'ignore_process_6_1', subfolder: 'admin_discovery' },
          'major-software': { file: 'major_software_6_1', subfolder: 'admin_discovery' },
          'monitoring-profile': { file: 'mon_prof_6_1', subfolder: 'admin_discovery' },
          'action-details': { file: 'mon_prof_action_details_6_1', subfolder: 'admin_discovery' },
          'frequency': { file: 'mon_prof_frequency_6_1', subfolder: 'admin_discovery' },
          'notifications': { file: 'mon_prof_notifications_6_1', subfolder: 'admin_discovery' },
          'trigger-conditions': { file: 'mon_prof_trigger_conditions_6_1', subfolder: 'admin_discovery' },
          'patterns': { file: 'patterns_6_1', subfolder: 'admin_discovery' },
          'port-configuration': { file: 'port_config_process_6_1', subfolder: 'admin_discovery' },
          'probe-workflow': { file: 'probe_workflow_6_1', subfolder: 'admin_discovery' },
          'probes': { file: 'probes_6_1', subfolder: 'admin_discovery' },
          'scan-configuration': { file: 'scan_configuration_6_1', subfolder: 'admin_discovery' },
          'sensors': { file: 'sensors_6_1', subfolder: 'admin_discovery' },
          // SACM
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
          'software-license-validity-check': { file: 'software_lic_validity_check_6_1', subfolder: 'admin_sacm' },
          'software-usage-report': { file: 'software_usage_report_6_1', subfolder: 'admin_sacm' },
          // Users
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
          'hardware-asset-management': { file: 'hardware_asset_mngmnt_6_1', subfolder: 'admin_hardware_asset_mngmnt' },
          'incident-management': { file: 'about_incident_mngmnt_6_1', subfolder: 'admin_incident_mngmnt' },
          'knowledge-management': { file: 'about_knowledge_mngmnt_6_1', subfolder: 'admin_knowledge_mngmnt' },
          'problem-management': { file: 'about_problem_mngmnt_6_1', subfolder: 'admin_problem_mngmnt' },
          'about-procurement': { file: 'about_procurement_6_1', subfolder: 'admin_procurement' },
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
          'graphical-workflows': { file: 'graphical_workflows_6_1', subfolder: 'admin_other' },
        };
        
        const pageInfo = pageToFileMap[page];
        if (pageInfo) {
          const path = pageInfo.subfolder 
            ? `/${versionPath}/${moduleFolder}/${pageInfo.subfolder}/${pageInfo.file}`
            : `/${versionPath}/${moduleFolder}/${pageInfo.file}`;
          navigate(path);
          return;
        }
        // Fallback: try to determine subfolder from page
        const fileName = `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle Vulnerability Management files
      if (module === 'vulnerability-management') {
        const fileName = `${page.replace(/-/g, '_')}_6_1`;
        const path = `/${versionPath}/${moduleFolder}/${fileName}`;
        navigate(path);
        return;
      }
      
      // Handle ITSM CMDB submodule files
      if (module === 'itsm' && section === 'itsm') {
        // Check if this is a CMDB submodule page
        const itsmCmdbPages = ['access-cmdb', 'manage-cmdb', 'audits', 'change-attributes', 'delete', 'export', 'new',
          'copy-to-ivanti', 'copy-to-jira', 'copy-to-servicenow', 'generate-installed-software-report',
          'process-adm', 'process-available-patch-report', 'process-cloud-hierarchy', 'process-devops',
          'process-missing-components', 'process-network-connection', 'process-software-installation',
          'ci-left-panel', 'contacts-on-ci', 'ci-details-and-tabs', 'details', 'manage-ci', 'business-service-map',
          'components', 'logon-events', 'itsm-tab', 'relationships', 'audits-tab', 'sla', 'maintenance',
          'vulnerability', 'private-properties', 'tasks', 'history', 'attachments', 'comments',
          'other-functions-and-page-elements', 'sync-logs', 'tags'];
        
        if (itsmCmdbPages.includes(page)) {
          // ITSM CMDB files are in itam_6_1/cmdb_6_1/ subfolder
          const fileName = `${page.replace(/-/g, '_')}_6_1`;
          const path = `/${versionPath}/${moduleFolder}/cmdb_6_1/${fileName}`;
          navigate(path);
          return;
        }
      }
      
      // Map page to file name
      const pageToFileMap: Record<string, string> = {
        'my-dashboard-overview': 'my-dashboard-overview-6_1',
        'dashboards': 'dashboards-6_1',
        'dashboards-contents': 'dashboards-contents-6_1',
        'customization': 'dashboards-customization-6_1',
        'report-actions': 'dashboards-report-actions-6_1',
        'system-icons': 'system-icons-6_1',
      };
      const fileName = pageToFileMap[page] || `${page.replace(/-/g, '_')}_6_1`;
      const path = `/${versionPath}/${moduleFolder}/${fileName}`;
      navigate(path);
    } else {
      // Old format for all versions: /version/module/section/page
      // This ensures consistent behavior for NextGen, 6.1.1, 5.13, and 6.1 (when not using new format)
      const path = `/${versionPath}/${module}${section ? `/${section}` : ''}${page ? `/${page}` : ''}`;
      navigate(path);
    }
  };

  const showHomePage = !selectedModule || selectedModule === '';

  return (
    <div className="min-h-screen bg-white">
      <DocumentationLayout
        logo={logo}
        selectedVersion={selectedVersion}
        onVersionChange={(version) => {
          setSelectedVersion(version);
          updateURL(version, selectedModule, selectedSection, selectedPage);
        }}
        selectedModule={selectedModule}
        onModuleChange={(module) => {
          setSelectedModule(module);
          let section = '';
          let page = '';
          if (module === 'cmdb') {
            section = 'cmdb';
            page = 'access-cmdb';
          } else if (module === 'discovery-scan') {
            section = 'discovery-scan';
            page = 'access-dashboard';
          } else if (module === 'my-dashboard') {
            section = 'my-dashboard';
            page = 'my-dashboard-overview';
          } else if (module === 'risk-register') {
            section = 'risk-register';
            page = 'risk-dashboard';
          } else if (module === 'reports') {
            section = 'reports';
            page = 'ad-hoc-reports';
          } else if (module === 'admin') {
            section = 'admin';
            page = 'organizational-details';
          } else if (module === 'vulnerability-management') {
            section = 'vulnerability-management';
            page = 'core-functionality';
          } else {
            section = 'application-overview';
            page = 'advanced-search';
          }
          setSelectedSection(section);
          setSelectedPage(page);
          updateURL(selectedVersion, module, section, page);
        }}
        selectedSection={selectedSection}
        onSectionChange={(section) => {
          setSelectedSection(section);
          updateURL(selectedVersion, selectedModule, section, selectedPage);
        }}
        selectedPage={selectedPage}
        onPageChange={(page) => {
          setSelectedPage(page);
          updateURL(selectedVersion, selectedModule, selectedSection, page);
        }}
        onHomeClick={() => {
          setSelectedModule('');
          setSelectedSection('');
          setSelectedPage('');
          updateURL(selectedVersion, '', '', '');
        }}
        isHomePage={showHomePage}
        versionDropdownTriggerRef={versionDropdownTriggerRef}
      >
        {showHomePage ? (
          <HomePage onModuleSelect={(module) => {
            setSelectedModule(module);
            let section = '';
            let page = '';
            if (module === 'cmdb') {
              section = 'cmdb';
              page = 'access-cmdb';
            } else if (module === 'discovery-scan') {
              section = 'discovery-scan';
              page = 'access-dashboard';
            } else if (module === 'my-dashboard') {
              section = 'my-dashboard';
              page = 'my-dashboard-overview';
            } else if (module === 'vulnerability-management') {
              section = 'vulnerability-management';
              page = 'core-functionality';
            } else {
              section = 'application-overview';
              page = 'advanced-search';
            }
            setSelectedSection(section);
            setSelectedPage(page);
            updateURL(selectedVersion, module, section, page);
          }} />
        ) : (
          <DocumentationContent
            version={selectedVersion}
            module={selectedModule}
            section={selectedSection}
            page={selectedPage}
            onHomeClick={() => {
              setSelectedModule('');
              setSelectedSection('');
              setSelectedPage('');
            }}
            onModuleClick={() => {
              let section = '';
              let page = '';
              if (selectedModule === 'cmdb') {
                section = 'cmdb';
                page = 'access-cmdb';
              } else if (selectedModule === 'discovery-scan') {
                section = 'discovery-scan';
                page = 'access-dashboard';
              } else if (selectedModule === 'my-dashboard') {
                section = 'my-dashboard';
                page = 'my-dashboard-overview';
              } else if (selectedModule === 'risk-register') {
                section = 'risk-register';
                page = 'risk-dashboard';
              } else if (selectedModule === 'reports') {
                section = 'reports';
                page = 'ad-hoc-reports';
              } else if (selectedModule === 'admin') {
                section = 'admin';
                page = 'organizational-details';
              } else {
                section = 'application-overview';
                page = 'advanced-search';
              }
              setSelectedSection(section);
              setSelectedPage(page);
              updateURL(selectedVersion, selectedModule, section, page);
            }}
            onVersionClick={() => {
              versionDropdownTriggerRef.current?.();
            }}
            onPageClick={(version, module, section, page) => {
              setSelectedVersion(version);
              setSelectedModule(module);
              setSelectedSection(section);
              setSelectedPage(page);
              updateURL(version, module, section, page);
            }}
          />
        )}
      </DocumentationLayout>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/FeatureDocsite">
      <AppContent />
    </BrowserRouter>
  );
}
