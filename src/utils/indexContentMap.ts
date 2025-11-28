/**
 * Index Content Map
 * 
 * This file contains all the index.mdx content as raw strings.
 * This is necessary because in the browser environment, we can't use fetch() to load local files.
 * 
 * IMPORTANT: All versions maintain the SAME TOC structure universally for consistency.
 * Only the file paths differ based on version prefix (NG, 5_13, 6_1, 6_1_1).
 */

/**
 * Generates the complete TOC structure for any version
 * This ensures all versions have identical navigation structure
 */
function generateTOC(versionCode: string, versionName: string): string {
  console.log(`🔧 [TOC Generator] Generating TOC for ${versionName} (${versionCode})`);
  const tocContent = `# Virima Documentation - Version ${versionName}

> Master Table of Contents for Version ${versionName}

---

## Application Overview

### System Functions

- System Icons → /content/${versionCode}/application_overview_${versionCode}/system_icons_${versionCode}.mdx
- User Specific Functions → /content/${versionCode}/application_overview_${versionCode}/user_specific_functions_${versionCode}.mdx

### Shared Functions

- Advanced Search → /content/${versionCode}/application_overview_${versionCode}/shared_functions/advanced_search_${versionCode}.mdx
- Attachments → /content/${versionCode}/application_overview_${versionCode}/shared_functions/attachments_${versionCode}.mdx
- Auto Refresh → /content/${versionCode}/application_overview_${versionCode}/shared_functions/auto_refresh_${versionCode}.mdx
- Collapse/Maximize → /content/${versionCode}/application_overview_${versionCode}/shared_functions/collapse_maximize_${versionCode}.mdx
- Comments → /content/${versionCode}/application_overview_${versionCode}/shared_functions/comments_${versionCode}.mdx
- Delete/Remove → /content/${versionCode}/application_overview_${versionCode}/shared_functions/delete_remove_${versionCode}.mdx
- Email Preferences → /content/${versionCode}/application_overview_${versionCode}/shared_functions/email_preferences_${versionCode}.mdx
- Enable/Disable Editing → /content/${versionCode}/application_overview_${versionCode}/shared_functions/enable_disable_editing_${versionCode}.mdx
- Export → /content/${versionCode}/application_overview_${versionCode}/shared_functions/export_${versionCode}.mdx
- Filter By → /content/${versionCode}/application_overview_${versionCode}/shared_functions/filter_by_${versionCode}.mdx
- History → /content/${versionCode}/application_overview_${versionCode}/shared_functions/history_${versionCode}.mdx
- Import → /content/${versionCode}/application_overview_${versionCode}/shared_functions/import_${versionCode}.mdx
- Items per Page → /content/${versionCode}/application_overview_${versionCode}/shared_functions/items_per_page_${versionCode}.mdx
- Mark as Knowledge → /content/${versionCode}/application_overview_${versionCode}/shared_functions/mark_as_knowledge_${versionCode}.mdx
- Other Asset Info → /content/${versionCode}/application_overview_${versionCode}/shared_functions/other_asset_info_${versionCode}.mdx
- Outage Calendar → /content/${versionCode}/application_overview_${versionCode}/shared_functions/outage_calendar_${versionCode}.mdx
- Personalize Columns → /content/${versionCode}/application_overview_${versionCode}/shared_functions/personalize_columns_${versionCode}.mdx
- Print → /content/${versionCode}/application_overview_${versionCode}/shared_functions/print_${versionCode}.mdx
- Records per Page → /content/${versionCode}/application_overview_${versionCode}/shared_functions/records_per_page_${versionCode}.mdx
- Reload Default Mapping → /content/${versionCode}/application_overview_${versionCode}/shared_functions/reload_default_mapping_${versionCode}.mdx
- Re-scan → /content/${versionCode}/application_overview_${versionCode}/shared_functions/re_scan_${versionCode}.mdx
- Re-Sync Data → /content/${versionCode}/application_overview_${versionCode}/shared_functions/re_sync_data_${versionCode}.mdx
- Save → /content/${versionCode}/application_overview_${versionCode}/shared_functions/save_${versionCode}.mdx
- Saved Filters → /content/${versionCode}/application_overview_${versionCode}/shared_functions/saved_filters_${versionCode}.mdx
- Searching → /content/${versionCode}/application_overview_${versionCode}/shared_functions/searching_${versionCode}.mdx
- Show Main/All Properties → /content/${versionCode}/application_overview_${versionCode}/shared_functions/show_main_all_properties_${versionCode}.mdx
- Tasks → /content/${versionCode}/application_overview_${versionCode}/shared_functions/tasks_${versionCode}.mdx
- Updates → /content/${versionCode}/application_overview_${versionCode}/shared_functions/updates_${versionCode}.mdx
- Version Control → /content/${versionCode}/application_overview_${versionCode}/shared_functions/version_control_${versionCode}.mdx

### Online Help

- Online Help → /content/${versionCode}/application_overview_${versionCode}/online_help_${versionCode}.mdx

---

## My Dashboard

### Overview

- Contents → /content/${versionCode}/dashboards_${versionCode}/contents_${versionCode}.mdx
- Customization → /content/${versionCode}/dashboards_${versionCode}/customization_${versionCode}.mdx

### Dashboard Management

- Contents → /content/${versionCode}/dashboards_${versionCode}/my_dashboard/contents_${versionCode}.mdx
- Report Actions → /content/${versionCode}/dashboards_${versionCode}/my_dashboard/report_actions_${versionCode}.mdx

---

## CMDB

### Getting Started

- Access CMDB → /content/${versionCode}/cmdb_${versionCode}/access_cmdb_${versionCode}.mdx

### Manage CMDB

- Audits → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/audits_${versionCode}.mdx
- Change Attributes → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/change_attributes_${versionCode}.mdx
- Delete → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/delete_${versionCode}.mdx
- Export → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/export_${versionCode}.mdx
- New → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/new_${versionCode}.mdx
- Copy to Ivanti → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/copy_to_ivanti_${versionCode}.mdx
- Copy to IxD → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/copy_to_ixd_${versionCode}.mdx
- Copy to ServiceNow → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/copy_to_servicenow_${versionCode}.mdx
- Generate Installed Software Report → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/generate_installed_software_report_${versionCode}.mdx
- Process ADM → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_adm_${versionCode}.mdx
- Process Available Patch Report → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_available_patch_report_${versionCode}.mdx
- Process Cloud Hierarchy → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_cloud_hierarchy_${versionCode}.mdx
- Process DevOps → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_devops_${versionCode}.mdx
- Process Missing Components → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_missing_components_${versionCode}.mdx
- Process Network Connection → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_network_connection_${versionCode}.mdx
- Process Software Installation → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_software_installation_${versionCode}.mdx
- Process Network Virtualization Hierarchy → /content/${versionCode}/cmdb_${versionCode}/manage_cmdb/process_network_virtualization_hierarchy_${versionCode}.mdx

### View and Edit a CI

- CI Left Panel → /content/${versionCode}/cmdb_${versionCode}/ci_left_panel_${versionCode}.mdx
- Contacts on a CI → /content/${versionCode}/cmdb_${versionCode}/contacts_on_a_ci_${versionCode}.mdx

### CI Details and Tabs

- Details → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/details_${versionCode}.mdx
  - Manage CI → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/manage_ci_${versionCode}.mdx
  - Business Service Map → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/business_service_map_${versionCode}.mdx
- Components → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/components_${versionCode}.mdx
- Logon Events → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/logon_events_${versionCode}.mdx
- ITSM → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/itsm_${versionCode}.mdx
- Relationships → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/relationships_${versionCode}.mdx
- Audits → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/audits_${versionCode}.mdx
- SLA → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/sla_${versionCode}.mdx
- Maintenance → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/maintenance_${versionCode}.mdx
- Vulnerability → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/vulnerability_${versionCode}.mdx
- Private Properties → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/private_properties_${versionCode}.mdx
- Tasks → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/tasks_${versionCode}.mdx
- History → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/history_${versionCode}.mdx
- Attachments → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/attachments_${versionCode}.mdx
- Comments → /content/${versionCode}/cmdb_${versionCode}/ci_details_tabs/comments_${versionCode}.mdx

### Other Functions and Page Elements

- Other Functions and Page Elements → /content/${versionCode}/cmdb_${versionCode}/other_functions_${versionCode}.mdx

---

## Discovery Scan

### Overview

- About Discovery Scan → /content/${versionCode}/discovery_${versionCode}/about_discovery_scan_${versionCode}.mdx

### Dashboard

- Dashboard → /content/${versionCode}/discovery_${versionCode}/dashboard/dashboard_${versionCode}.mdx
- Access Dashboard → /content/${versionCode}/discovery_${versionCode}/dashboard/access_dashboard_${versionCode}.mdx
- Dashboard Features → /content/${versionCode}/discovery_${versionCode}/dashboard/dashboard_features_${versionCode}.mdx
- Add Contents → /content/${versionCode}/discovery_${versionCode}/dashboard/add_contents_${versionCode}.mdx
- Dashboard Customization → /content/${versionCode}/discovery_${versionCode}/dashboard/dashboard_customization_${versionCode}.mdx

### Run a Scan

- Pre-requisites for Scan → /content/${versionCode}/discovery_${versionCode}/run_a_scan/prerequisites_for_scan_${versionCode}.mdx
- Initiate and Configure Discovery Scan → /content/${versionCode}/discovery_${versionCode}/run_a_scan/initiate_and_configure_discovery_scan_${versionCode}.mdx
  - Access Run A Scan → /content/${versionCode}/discovery_${versionCode}/run_a_scan/access_run_scan_${versionCode}.mdx
  - Configure Discovery Scan → /content/${versionCode}/discovery_${versionCode}/run_a_scan/configure_discovery_scan_${versionCode}.mdx
    - Probes Configuration → /content/${versionCode}/discovery_${versionCode}/run_a_scan/probes_configuration_${versionCode}.mdx
    - Client Configuration → /content/${versionCode}/discovery_${versionCode}/run_a_scan/client_configuration_${versionCode}.mdx

### Recent Scans

- Access Recent Scan → /content/${versionCode}/discovery_${versionCode}/recent_scans/access_recent_scan_${versionCode}.mdx
- View Recent Scan → /content/${versionCode}/discovery_${versionCode}/recent_scans/view_recent_scan_${versionCode}.mdx
  - Details → /content/${versionCode}/discovery_${versionCode}/recent_scans/details_${versionCode}.mdx
    - Export Scan Report → /content/${versionCode}/discovery_${versionCode}/recent_scans/export_scan_report_${versionCode}.mdx
    - Refresh → /content/${versionCode}/discovery_${versionCode}/recent_scans/refresh_${versionCode}.mdx
  - Logs → /content/${versionCode}/discovery_${versionCode}/recent_scans/logs_${versionCode}.mdx
  - Tasks → /content/${versionCode}/discovery_${versionCode}/recent_scans/tasks_${versionCode}.mdx
  - Comments → /content/${versionCode}/discovery_${versionCode}/recent_scans/comments_${versionCode}.mdx
  - Attachments → /content/${versionCode}/discovery_${versionCode}/recent_scans/attachments_${versionCode}.mdx

### Scheduled Scans and Imports

- Pre-requisites → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/prerequisites_${versionCode}.mdx
- Accessing Scheduled Scan and Imports → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/accessing_scheduled_scan_and_imports_${versionCode}.mdx
- Key Features and Options on the Landing Page → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/key_features_and_options_${versionCode}.mdx
- Scans and Import Options → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/scans_and_import_options_${versionCode}.mdx
  - Scan and Import Schedule List → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/scan_and_import_schedule_list_${versionCode}.mdx
  - Schedule a Network Scan → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/schedule_a_network_scan_${versionCode}.mdx
  - Editing a Scheduled Scan → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/editing_a_scheduled_scan_${versionCode}.mdx
  - History of Scheduled Scan Execution → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/history_of_scheduled_scan_execution_${versionCode}.mdx
  - Bulk Update Scan → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/bulk_update_scan_${versionCode}.mdx
  - Exporting a Scan → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/exporting_a_scan_${versionCode}.mdx
  - Importing Scan Schedule(s) → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/importing_scan_schedules_${versionCode}.mdx
  - Deleting a Scan Schedule → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/deleting_a_scan_schedule_${versionCode}.mdx
- Scheduled Import Setup → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/scheduled_import_setup_${versionCode}.mdx
  - AWS Import → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/aws_import_${versionCode}.mdx
  - Azure Import → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/azure_import_${versionCode}.mdx
  - Meraki Import → /content/${versionCode}/discovery_${versionCode}/scheduled_scans_imports/meraki_import_${versionCode}.mdx

### IPAM Networks

- IPAM Procedure → /content/${versionCode}/discovery_${versionCode}/ipam_networks/ipam_procedure_${versionCode}.mdx
- Infobox Configuration → /content/${versionCode}/discovery_${versionCode}/ipam_networks/infobox_configuration_${versionCode}.mdx
- IPAM (IP Address Management) → /content/${versionCode}/discovery_${versionCode}/ipam_networks/ipam_ip_address_management_${versionCode}.mdx

### IPAM Functions Overview

- Scan Function → /content/${versionCode}/discovery_${versionCode}/ipam_functions/scan_function_${versionCode}.mdx
  - Status Update → /content/${versionCode}/discovery_${versionCode}/ipam_functions/status_update_${versionCode}.mdx
  - Regular Scan → /content/${versionCode}/discovery_${versionCode}/ipam_functions/regular_scan_${versionCode}.mdx
- Sync (Instant and Scheduled) → /content/${versionCode}/discovery_${versionCode}/ipam_functions/sync_instant_and_scheduled_${versionCode}.mdx
- View and Edit a Network → /content/${versionCode}/discovery_${versionCode}/ipam_functions/view_and_edit_a_network_${versionCode}.mdx
- Other Functions and Page Elements → /content/${versionCode}/discovery_${versionCode}/ipam_functions/other_functions_and_page_elements_${versionCode}.mdx

### Discovered Items

- Prerequisites → /content/${versionCode}/discovery_${versionCode}/discovered_items/prerequisites_${versionCode}.mdx
- Access Discovered Items → /content/${versionCode}/discovery_${versionCode}/discovered_items/access_discovered_items_${versionCode}.mdx
- Manage Discovered Items → /content/${versionCode}/discovery_${versionCode}/discovered_items/manage_discovered_items_${versionCode}.mdx
  - Delete → /content/${versionCode}/discovery_${versionCode}/discovered_items/delete_${versionCode}.mdx
  - Export → /content/${versionCode}/discovery_${versionCode}/discovered_items/export_${versionCode}.mdx
  - Export Without Selecting Any Record → /content/${versionCode}/discovery_${versionCode}/discovered_items/export_without_selecting_any_record_${versionCode}.mdx
  - Move to CMDB → /content/${versionCode}/discovery_${versionCode}/discovered_items/move_to_cmdb_${versionCode}.mdx
  - Re-scan → /content/${versionCode}/discovery_${versionCode}/discovered_items/rescan_${versionCode}.mdx
  - Column Descriptions → /content/${versionCode}/discovery_${versionCode}/discovered_items/column_descriptions_${versionCode}.mdx
- Detailed View of Discovered Items → /content/${versionCode}/discovery_${versionCode}/discovered_items/detailed_view_of_discovered_items_${versionCode}.mdx
  - Primary Details Block → /content/${versionCode}/discovery_${versionCode}/discovered_items/primary_details_block_${versionCode}.mdx
  - Owner Block → /content/${versionCode}/discovery_${versionCode}/discovered_items/owner_block_${versionCode}.mdx
  - Main Information Area → /content/${versionCode}/discovery_${versionCode}/discovered_items/main_information_area_${versionCode}.mdx
  - Action Buttons → /content/${versionCode}/discovery_${versionCode}/discovered_items/action_buttons_${versionCode}.mdx
  - Navigation Tabs → /content/${versionCode}/discovery_${versionCode}/discovered_items/navigation_tabs_${versionCode}.mdx
- Other Functions and Page Elements → /content/${versionCode}/discovery_${versionCode}/discovered_items/other_functions_and_page_elements_${versionCode}.mdx
  - Toolbar or Control Bar → /content/${versionCode}/discovery_${versionCode}/discovered_items/toolbar_or_control_bar_${versionCode}.mdx
  - Filter By → /content/${versionCode}/discovery_${versionCode}/discovered_items/filter_by_${versionCode}.mdx

### Import from AWS

- Access the Import AWS Window → /content/${versionCode}/discovery_${versionCode}/import_from_aws/access_the_import_aws_window_${versionCode}.mdx
- Import AWS Record → /content/${versionCode}/discovery_${versionCode}/import_from_aws/import_aws_record_${versionCode}.mdx
- View AWS Import Record → /content/${versionCode}/discovery_${versionCode}/import_from_aws/view_aws_import_record_${versionCode}.mdx
  - Key columns → /content/${versionCode}/discovery_${versionCode}/import_from_aws/key_columns_${versionCode}.mdx
  - Move Items to CMDB → /content/${versionCode}/discovery_${versionCode}/import_from_aws/move_items_to_cmdb_${versionCode}.mdx
  - Logs → /content/${versionCode}/discovery_${versionCode}/import_from_aws/logs_${versionCode}.mdx
  - Delete AWS Record → /content/${versionCode}/discovery_${versionCode}/import_from_aws/delete_aws_record_${versionCode}.mdx
  - Export AWS Records → /content/${versionCode}/discovery_${versionCode}/import_from_aws/export_aws_records_${versionCode}.mdx
  - View a discovered AWS record → /content/${versionCode}/discovery_${versionCode}/import_from_aws/view_a_discovered_aws_record_${versionCode}.mdx

### Import from Azure

- Access the Import AZURE Window → /content/${versionCode}/discovery_${versionCode}/import_from_azure/access_the_import_azure_window_${versionCode}.mdx
- Import AZURE Record → /content/${versionCode}/discovery_${versionCode}/import_from_azure/import_azure_record_${versionCode}.mdx
- View AZURE Import Record → /content/${versionCode}/discovery_${versionCode}/import_from_azure/view_azure_import_record_${versionCode}.mdx
  - Common controls (top-right of the grid) → /content/${versionCode}/discovery_${versionCode}/import_from_azure/common_controls_${versionCode}.mdx
  - Key columns → /content/${versionCode}/discovery_${versionCode}/import_from_azure/key_columns_${versionCode}.mdx
  - Move items to the CMDB → /content/${versionCode}/discovery_${versionCode}/import_from_azure/move_items_to_cmdb_${versionCode}.mdx
  - Delete AZURE Record → /content/${versionCode}/discovery_${versionCode}/import_from_azure/delete_azure_record_${versionCode}.mdx
  - Export AZURE Records → /content/${versionCode}/discovery_${versionCode}/import_from_azure/export_azure_records_${versionCode}.mdx
  - View a discovered AZURE record → /content/${versionCode}/discovery_${versionCode}/import_from_azure/view_a_discovered_azure_record_${versionCode}.mdx
    - Discovered item view overview → /content/${versionCode}/discovery_${versionCode}/import_from_azure/discovered_item_view_overview_${versionCode}.mdx
    - Top-right actions → /content/${versionCode}/discovery_${versionCode}/import_from_azure/top_right_actions_${versionCode}.mdx
    - Tabs (main panel) → /content/${versionCode}/discovery_${versionCode}/import_from_azure/tabs_main_panel_${versionCode}.mdx

### Import from Meraki

- Prerequisites → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/prerequisites_${versionCode}.mdx
- Assess Import Meraki Window → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/assess_import_meraki_window_${versionCode}.mdx
- Import Meraki Record → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/import_meraki_record_${versionCode}.mdx
- View Meraki Import Record → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/view_meraki_import_record_${versionCode}.mdx
  - Common controls → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/common_controls_${versionCode}.mdx
  - Key columns → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/key_columns_${versionCode}.mdx
  - Move items to the CMDB → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/move_items_to_cmdb_${versionCode}.mdx
  - Logs → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/logs_${versionCode}.mdx
- Delete Meraki Record → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/delete_meraki_record_${versionCode}.mdx
- Export Meraki Records → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/export_meraki_records_${versionCode}.mdx
- View a discovered Meraki record → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/view_a_discovered_meraki_record_${versionCode}.mdx
  - Discovered item view overview → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/discovered_item_view_overview_${versionCode}.mdx
  - Top-right actions → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/top_right_actions_${versionCode}.mdx
  - Tabs (main panel) → /content/${versionCode}/discovery_${versionCode}/import_from_meraki/tabs_main_panel_${versionCode}.mdx

### Import from Intune

- Access Import From Intune → /content/${versionCode}/discovery_${versionCode}/import_from_intune/access_import_from_intune_${versionCode}.mdx
- Import Intune Record → /content/${versionCode}/discovery_${versionCode}/import_from_intune/import_intune_record_${versionCode}.mdx
- View Intune Import Record → /content/${versionCode}/discovery_${versionCode}/import_from_intune/view_intune_import_record_${versionCode}.mdx
- Delete Intune Record → /content/${versionCode}/discovery_${versionCode}/import_from_intune/delete_intune_record_${versionCode}.mdx
- Export Intune Records → /content/${versionCode}/discovery_${versionCode}/import_from_intune/export_intune_records_${versionCode}.mdx
- View a discovered Intune record → /content/${versionCode}/discovery_${versionCode}/import_from_intune/view_a_discovered_intune_record_${versionCode}.mdx

### Import Data Files

- Access the Import Data Files → /content/${versionCode}/discovery_${versionCode}/import_data_files/access_the_import_data_files_${versionCode}.mdx
- Manage Import Data Files → /content/${versionCode}/discovery_${versionCode}/import_data_files/manage_import_data_files_${versionCode}.mdx
  - Import CI → /content/${versionCode}/discovery_${versionCode}/import_data_files/import_ci_${versionCode}.mdx
  - View an Imported Data File → /content/${versionCode}/discovery_${versionCode}/import_data_files/view_an_imported_data_file_${versionCode}.mdx
    - All Tab → /content/${versionCode}/discovery_${versionCode}/import_data_files/all_tab_${versionCode}.mdx
    - Authorized Tab → /content/${versionCode}/discovery_${versionCode}/import_data_files/authorized_tab_${versionCode}.mdx
    - Unauthorized Tab → /content/${versionCode}/discovery_${versionCode}/import_data_files/unauthorized_tab_${versionCode}.mdx
  - Import Asset/CI Relations → /content/${versionCode}/discovery_${versionCode}/import_data_files/import_asset_ci_relations_${versionCode}.mdx
  - Delete → /content/${versionCode}/discovery_${versionCode}/import_data_files/delete_${versionCode}.mdx
  - Export → /content/${versionCode}/discovery_${versionCode}/import_data_files/export_${versionCode}.mdx

### Imported Assets

- Access the Imported Assets → /content/${versionCode}/discovery_${versionCode}/imported_assets/access_the_imported_assets_${versionCode}.mdx
- Manage Imported Assets → /content/${versionCode}/discovery_${versionCode}/imported_assets/manage_imported_assets_${versionCode}.mdx
- Imported Asset Details → /content/${versionCode}/discovery_${versionCode}/imported_assets/imported_asset_details_${versionCode}.mdx

### AD User Import Logs

- AD Configuration and Import → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/ad_configuration_and_import_${versionCode}.mdx
  - AD Configuration Property Descriptions → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/ad_configuration_property_descriptions_${versionCode}.mdx
  - Testing AD Configuration → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/testing_ad_configuration_${versionCode}.mdx
  - Import Users → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/import_users_${versionCode}.mdx
  - Scheduled AD Import → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/scheduled_ad_import_${versionCode}.mdx
- Access the AD User Import Logs → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/access_the_ad_user_import_logs_${versionCode}.mdx
- View Import Log Details → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/view_import_log_details_${versionCode}.mdx
  - Details Tab → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/details_tab_${versionCode}.mdx
  - Tabs for Extended Information → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/tabs_for_extended_information_${versionCode}.mdx
- Customize Columns → /content/${versionCode}/discovery_${versionCode}/ad_user_import_logs/customize_columns_${versionCode}.mdx

### Azure AD User Import Logs

- Azure AD Configuration and Import → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/azure_ad_configuration_and_import_${versionCode}.mdx
  - Azure AD Configuration Property Descriptions → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/azure_ad_configuration_property_descriptions_${versionCode}.mdx
  - Testing Azure AD Configuration → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/testing_azure_ad_configuration_${versionCode}.mdx
  - Import Users → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/import_users_${versionCode}.mdx
  - Scheduled Azure AD Import → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/scheduled_azure_ad_import_${versionCode}.mdx
- Access the Azure AD User Import Logs → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/access_the_azure_ad_user_import_logs_${versionCode}.mdx
- View Import Log Details → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/view_import_log_details_${versionCode}.mdx
  - Details Tab → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/details_tab_${versionCode}.mdx
  - Key Information Displayed → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/key_information_displayed_${versionCode}.mdx
  - Tabs for Extended Information → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/tabs_for_extended_information_${versionCode}.mdx
- Customize Columns → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/customize_columns_${versionCode}.mdx
- Delete Azure AD User Import Logs → /content/${versionCode}/discovery_${versionCode}/azure_ad_user_import_logs/delete_azure_ad_user_import_logs_${versionCode}.mdx

---

## ITSM

### Overview

- About ITSM → /content/${versionCode}/itsm_${versionCode}/about_itsm_${versionCode}.mdx

### Configuration Management

- Dashboard → /content/${versionCode}/itsm_${versionCode}/config_mngmt/dashboard_${versionCode}.mdx
- CMDB → /content/${versionCode}/itsm_${versionCode}/config_mngmt/cmdb_${versionCode}.mdx
  - Access CMDB → /content/${versionCode}/itsm_${versionCode}/config_mngmt/access_cmdb_${versionCode}.mdx
  - Manage CMDB → /content/${versionCode}/itsm_${versionCode}/config_mngmt/manage_cmdb_${versionCode}.mdx
    - Audits → /content/${versionCode}/itsm_${versionCode}/config_mngmt/audits_${versionCode}.mdx
    - Change Attributes → /content/${versionCode}/itsm_${versionCode}/config_mngmt/change_attributes_${versionCode}.mdx
    - Delete → /content/${versionCode}/itsm_${versionCode}/config_mngmt/delete_${versionCode}.mdx
    - Export → /content/${versionCode}/itsm_${versionCode}/config_mngmt/export_${versionCode}.mdx
    - New → /content/${versionCode}/itsm_${versionCode}/config_mngmt/new_${versionCode}.mdx
    - Copy to Ivanti → /content/${versionCode}/itsm_${versionCode}/config_mngmt/copy_to_ivanti_${versionCode}.mdx
    - Copy to IxD → /content/${versionCode}/itsm_${versionCode}/config_mngmt/copy_to_ixd_${versionCode}.mdx
    - Copy to ServiceNow → /content/${versionCode}/itsm_${versionCode}/config_mngmt/copy_to_servicenow_${versionCode}.mdx
    - Generate Installed Software Report → /content/${versionCode}/itsm_${versionCode}/config_mngmt/generate_installed_software_report_${versionCode}.mdx
    - Process ADM → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_adm_${versionCode}.mdx
    - Process Available Patch Report → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_available_patch_report_${versionCode}.mdx
    - Process Cloud Hierarchy → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_cloud_hierarchy_${versionCode}.mdx
    - Process DevOps → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_devops_${versionCode}.mdx
    - Process Missing Components → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_missing_components_${versionCode}.mdx
    - Process Network Connection → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_network_connection_${versionCode}.mdx
    - Process Software Installation → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_software_installation_${versionCode}.mdx
    - Process Network Virtualization Hierarchy → /content/${versionCode}/itsm_${versionCode}/config_mngmt/process_network_virtualization_hierarchy_${versionCode}.mdx

### View and Edit a CI

- CI Left Panel → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_left_panel_${versionCode}.mdx
- Contacts on a CI → /content/${versionCode}/itsm_${versionCode}/config_mngmt/contacts_on_a_ci_${versionCode}.mdx

### CI Details and Tabs

- Details → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/details_${versionCode}.mdx
  - Manage CI → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/manage_ci_${versionCode}.mdx
  - Business Service Map → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/business_service_map_${versionCode}.mdx
- Components → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/components_${versionCode}.mdx
- Logon Events → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/logon_events_${versionCode}.mdx
- ITSM → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/itsm_${versionCode}.mdx
- Relationships → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/relationships_${versionCode}.mdx
- Audits → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/audits_${versionCode}.mdx
- SLA → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/sla_${versionCode}.mdx
- Maintenance → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/maintenance_${versionCode}.mdx
- Vulnerability → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/vulnerability_${versionCode}.mdx
- Private Properties → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/private_properties_${versionCode}.mdx
- Tasks → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/tasks_${versionCode}.mdx
- History → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/history_${versionCode}.mdx
- Attachments → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/attachments_${versionCode}.mdx
- Comments → /content/${versionCode}/itsm_${versionCode}/config_mngmt/ci_details_tabs/comments_${versionCode}.mdx

### Other Functions and Page Elements

- Other Functions and Page Elements → /content/${versionCode}/itsm_${versionCode}/config_mngmt/other_functions_${versionCode}.mdx
- Sync Logs → /content/${versionCode}/itsm_${versionCode}/config_mngmt/sync_logs_${versionCode}.mdx
- Tags → /content/${versionCode}/itsm_${versionCode}/config_mngmt/tags_${versionCode}.mdx
- Audits → /content/${versionCode}/itsm_${versionCode}/config_mngmt/audits_section_${versionCode}.mdx

### Change Management

- Change Management → /content/${versionCode}/itsm_${versionCode}/change_mngmt/change_management_${versionCode}.mdx

### Incident Management

- Incident Management → /content/${versionCode}/itsm_${versionCode}/incident_mngmt/incident_management_${versionCode}.mdx

### Knowledge Management

- Knowledge Management → /content/${versionCode}/itsm_${versionCode}/knowledge_mngmt/knowledge_management_${versionCode}.mdx

### Problem Management

- Problem Management → /content/${versionCode}/itsm_${versionCode}/problem_mngmt/problem_management_${versionCode}.mdx

### Release Management

- Release Management → /content/${versionCode}/itsm_${versionCode}/release_mngmt/release_management_${versionCode}.mdx

### Request Fulfillment

- Request Fulfillment → /content/${versionCode}/itsm_${versionCode}/request_fulfillment/request_fulfillment_${versionCode}.mdx

### Service Portfolio

- Service Portfolio → /content/${versionCode}/itsm_${versionCode}/service_portfolio/service_portfolio_${versionCode}.mdx

### Runbook

- Runbook → /content/${versionCode}/itsm_${versionCode}/runbook/runbook_${versionCode}.mdx

### Vulnerability Management

- Core Functionality → /content/${versionCode}/itsm_${versionCode}/vulnerability_mngmt/core_functionality_${versionCode}.mdx
- Access Vulnerability Management → /content/${versionCode}/itsm_${versionCode}/vulnerability_mngmt/access_vulnerability_management_${versionCode}.mdx
- View Vulnerability Management → /content/${versionCode}/itsm_${versionCode}/vulnerability_mngmt/view_vulnerability_management_${versionCode}.mdx
- Best Practices → /content/${versionCode}/itsm_${versionCode}/vulnerability_mngmt/best_practices_${versionCode}.mdx
- Limitations and Considerations → /content/${versionCode}/itsm_${versionCode}/vulnerability_mngmt/limitations_and_considerations_${versionCode}.mdx

---

## ITAM

### Overview

- About ITAM → /content/${versionCode}/itam_${versionCode}/about_itam_${versionCode}.mdx

### Configuration Management

- Dashboard → /content/${versionCode}/itam_${versionCode}/config_mngmt/dashboard_${versionCode}.mdx
- CMDB → /content/${versionCode}/itam_${versionCode}/config_mngmt/cmdb_${versionCode}.mdx
  - Access CMDB → /content/${versionCode}/itam_${versionCode}/config_mngmt/access_cmdb_${versionCode}.mdx
  - Manage CMDB → /content/${versionCode}/itam_${versionCode}/config_mngmt/manage_cmdb_${versionCode}.mdx
    - Audits → /content/${versionCode}/itam_${versionCode}/config_mngmt/audits_${versionCode}.mdx
    - Change Attributes → /content/${versionCode}/itam_${versionCode}/config_mngmt/change_attributes_${versionCode}.mdx
    - Delete → /content/${versionCode}/itam_${versionCode}/config_mngmt/delete_${versionCode}.mdx
    - Export → /content/${versionCode}/itam_${versionCode}/config_mngmt/export_${versionCode}.mdx
    - New → /content/${versionCode}/itam_${versionCode}/config_mngmt/new_${versionCode}.mdx
    - Copy to Ivanti → /content/${versionCode}/itam_${versionCode}/config_mngmt/copy_to_ivanti_${versionCode}.mdx
    - Copy to Jira → /content/${versionCode}/itam_${versionCode}/config_mngmt/copy_to_jira_${versionCode}.mdx
    - Copy to ServiceNow → /content/${versionCode}/itam_${versionCode}/config_mngmt/copy_to_servicenow_${versionCode}.mdx
    - Generate Installed Software Report → /content/${versionCode}/itam_${versionCode}/config_mngmt/generate_installed_software_report_${versionCode}.mdx
    - Process ADM → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_adm_${versionCode}.mdx
    - Process Available Patch Report → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_available_patch_report_${versionCode}.mdx
    - Process Cloud Hierarchy → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_cloud_hierarchy_${versionCode}.mdx
    - Process DevOps → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_devops_${versionCode}.mdx
    - Process Missing Components → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_missing_components_${versionCode}.mdx
    - Process Network Connection → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_network_connection_${versionCode}.mdx
    - Process Software Installation → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_software_installation_${versionCode}.mdx
    - Process Network Virtualization Hierarchy → /content/${versionCode}/itam_${versionCode}/config_mngmt/process_network_virtualization_hierarchy_${versionCode}.mdx
  - View and Edit a CI → /content/${versionCode}/itam_${versionCode}/config_mngmt/view_and_edit_a_ci_${versionCode}.mdx
    - CI Left Panel → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_left_panel_${versionCode}.mdx
    - Contacts on a CI → /content/${versionCode}/itam_${versionCode}/config_mngmt/contacts_on_a_ci_${versionCode}.mdx
  - CI Details and Tabs → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_and_tabs_${versionCode}.mdx
    - Details → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/details_${versionCode}.mdx
      - Manage CI → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/manage_ci_${versionCode}.mdx
      - Business Service Map → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/business_service_map_${versionCode}.mdx
    - Components → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/components_${versionCode}.mdx
    - Logon Events → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/logon_events_${versionCode}.mdx
    - ITSM → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/itsm_${versionCode}.mdx
    - Relationships → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/relationships_${versionCode}.mdx
    - Audits → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/audits_${versionCode}.mdx
    - SLA → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/sla_${versionCode}.mdx
    - Maintenance → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/maintenance_${versionCode}.mdx
    - Vulnerability → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/vulnerability_${versionCode}.mdx
    - Private Properties → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/private_properties_${versionCode}.mdx
    - Tasks → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/tasks_${versionCode}.mdx
    - History → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/history_${versionCode}.mdx
    - Attachments → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/attachments_${versionCode}.mdx
    - Comments → /content/${versionCode}/itam_${versionCode}/config_mngmt/ci_details_tabs/comments_${versionCode}.mdx
  - Other Functions and Page Elements → /content/${versionCode}/itam_${versionCode}/config_mngmt/other_functions_${versionCode}.mdx
- Sync Logs → /content/${versionCode}/itam_${versionCode}/config_mngmt/sync_logs_${versionCode}.mdx
- Tags → /content/${versionCode}/itam_${versionCode}/config_mngmt/tags_${versionCode}.mdx
- Audits → /content/${versionCode}/itam_${versionCode}/config_mngmt/audits_section_${versionCode}.mdx

### Hardware Assets

- Hardware Assets → /content/${versionCode}/itam_${versionCode}/hw_assets/hw_assets_${versionCode}.mdx

### Software Asset Management

- Software Asset → /content/${versionCode}/itam_${versionCode}/software_asset_mngmt/software_asset_${versionCode}.mdx
- Software License Keys → /content/${versionCode}/itam_${versionCode}/software_asset_mngmt/software_license_keys_${versionCode}.mdx
- Certificate Management → /content/${versionCode}/itam_${versionCode}/software_asset_mngmt/certificate_management_${versionCode}.mdx

### Contract Management

- Contract Management → /content/${versionCode}/itam_${versionCode}/contract_management/contract_mngmnt_${versionCode}.mdx

### Vendor Management

- Vendor Management → /content/${versionCode}/itam_${versionCode}/vendor_management/vendor_management_${versionCode}.mdx

### Audits

- Audits → /content/${versionCode}/itam_${versionCode}/audits/audits_${versionCode}.mdx

### License Entitlement

- Asset License Entitlement → /content/${versionCode}/itam_${versionCode}/license_entitlement/asset_license_entitlement_${versionCode}.mdx
- User License Entitlement → /content/${versionCode}/itam_${versionCode}/license_entitlement/user_license_entitlement_${versionCode}.mdx

### Stockroom

- Stockroom → /content/${versionCode}/itam_${versionCode}/stockroom/stockroom_${versionCode}.mdx
- Stockroom Type → /content/${versionCode}/itam_${versionCode}/stockroom/stockroom_type_${versionCode}.mdx

### Procurement

- Requested Items → /content/${versionCode}/itam_${versionCode}/procurement/requested_items_${versionCode}.mdx
- Purchase Orders → /content/${versionCode}/itam_${versionCode}/procurement/purchase_orders_${versionCode}.mdx
- Purchase Order Line Items → /content/${versionCode}/itam_${versionCode}/procurement/purchase_order_line_items_${versionCode}.mdx
- Receiving Slips → /content/${versionCode}/itam_${versionCode}/procurement/receiving_slips_${versionCode}.mdx
- Receiving Slip Lines → /content/${versionCode}/itam_${versionCode}/procurement/receiving_slip_lines_${versionCode}.mdx
- Purchase Order → /content/${versionCode}/itam_${versionCode}/procurement/purchase_order_${versionCode}.mdx

### Service Design Package

- Service Design Package → /content/${versionCode}/itam_${versionCode}/service_design_package/service_design_package_${versionCode}.mdx

### Financial Management

- Service Financial Plan → /content/${versionCode}/itam_${versionCode}/financial_management/service_financial_plan_${versionCode}.mdx
- CI Financial Plan → /content/${versionCode}/itam_${versionCode}/financial_management/ci_financial_plan_${versionCode}.mdx

### Self-Service

- Service Catalog → /content/${versionCode}/itam_${versionCode}/self_service/service_catalog_${versionCode}.mdx
- My Incidents → /content/${versionCode}/itam_${versionCode}/self_service/my_incidents_${versionCode}.mdx
- My Requests → /content/${versionCode}/itam_${versionCode}/self_service/my_requests_${versionCode}.mdx

### Program/Project Management

- Programs → /content/${versionCode}/itam_${versionCode}/program_project_management/programs_${versionCode}.mdx
  - Program Dashboard → /content/${versionCode}/itam_${versionCode}/program_project_management/program_dashboard_${versionCode}.mdx
- Projects → /content/${versionCode}/itam_${versionCode}/program_project_management/projects_${versionCode}.mdx
  - Project Dashboard → /content/${versionCode}/itam_${versionCode}/program_project_management/project_dashboard_${versionCode}.mdx

### Risk Register

- Risk Dashboard → /content/${versionCode}/itam_${versionCode}/risk_register/risk_dashboard_${versionCode}.mdx
- Risks → /content/${versionCode}/itam_${versionCode}/risk_register/risks_${versionCode}.mdx

### Reports

- Reports → /content/${versionCode}/itam_${versionCode}/reports/reports_${versionCode}.mdx

---

## Vulnerability Management

### Overview

- Vulnerability Management → /content/${versionCode}/vulnerability_managment_${versionCode}/vulnerability_management_${versionCode}.mdx
- Core Functionality → /content/${versionCode}/vulnerability_managment_${versionCode}/core_functionality_${versionCode}.mdx

---

## Reports

### Overview

- Reports → /content/${versionCode}/reports_${versionCode}/reports_${versionCode}.mdx
- Ad Hoc Reports → /content/${versionCode}/reports_${versionCode}/reports_ad_hoc_${versionCode}.mdx
- Canned Reports → /content/${versionCode}/reports_${versionCode}/reports_canned_${versionCode}.mdx

---

## Admin

### Overview

- About Admin → /content/${versionCode}/admin_${versionCode}/about_admin_${versionCode}.mdx

### Flush Credential

- Flush Credential → /content/${versionCode}/admin_${versionCode}/flush_credential_${versionCode}.mdx

### Custom Patterns

- Custom Patterns → /content/${versionCode}/admin_${versionCode}/custom_patterns_${versionCode}.mdx

### Download Application

- Download Application → /content/${versionCode}/admin_${versionCode}/download_application_${versionCode}.mdx

### Import Templates

- Import Templates → /content/${versionCode}/admin_${versionCode}/import_templates_${versionCode}.mdx

### Ignore ADM Process

- Ignore ADM Process → /content/${versionCode}/admin_${versionCode}/admin_discovery/ignore_adm_process_${versionCode}.mdx

### Ignore Process

- Ignore Process → /content/${versionCode}/admin_${versionCode}/admin_discovery/ignore_process_${versionCode}.mdx

### Major Software

- Major Software → /content/${versionCode}/admin_${versionCode}/major_software_${versionCode}.mdx

### Monitoring Profile

- Monitoring Profile → /content/${versionCode}/admin_${versionCode}/monitoring_profile_${versionCode}.mdx
- Details → /content/${versionCode}/admin_${versionCode}/monitoring_profile/details_${versionCode}.mdx
- Frequency → /content/${versionCode}/admin_${versionCode}/monitoring_profile/frequency_${versionCode}.mdx
- Trigger Conditions → /content/${versionCode}/admin_${versionCode}/monitoring_profile/trigger_conditions_${versionCode}.mdx
- Action Details → /content/${versionCode}/admin_${versionCode}/monitoring_profile/action_details_${versionCode}.mdx
- Notifications → /content/${versionCode}/admin_${versionCode}/monitoring_profile/notifications_${versionCode}.mdx

### Port Configuration

- Port Configuration → /content/${versionCode}/admin_${versionCode}/port_configuration_${versionCode}.mdx

### Probe Workflow

- Probe Workflow → /content/${versionCode}/admin_${versionCode}/probe_workflow_${versionCode}.mdx

### Probes

- Probes → /content/${versionCode}/admin_${versionCode}/probes_${versionCode}.mdx

### Scan Configuration

- Scan Configuration → /content/${versionCode}/admin_${versionCode}/scan_configuration_${versionCode}.mdx

### Sensors

- Sensors → /content/${versionCode}/admin_${versionCode}/sensors_${versionCode}.mdx

### Graphical Workflows

- Graphical Workflows → /content/${versionCode}/admin_${versionCode}/graphical_workflows_${versionCode}.mdx

### SACM

- SACM → /content/${versionCode}/admin_${versionCode}/sacm/sacm_${versionCode}.mdx
- Blueprints → /content/${versionCode}/admin_${versionCode}/sacm/blueprints_${versionCode}.mdx
- Custom BSM Views → /content/${versionCode}/admin_${versionCode}/sacm/custom_bsm_views_${versionCode}.mdx
- Critical BSM Workflow → /content/${versionCode}/admin_${versionCode}/sacm/critical_bsm_workflow_${versionCode}.mdx
- CMDB Properties → /content/${versionCode}/admin_${versionCode}/sacm/cmdb_properties_${versionCode}.mdx
- Confidence Configuration → /content/${versionCode}/admin_${versionCode}/sacm/confidence_configuration_${versionCode}.mdx
- Duplicates Remediation → /content/${versionCode}/admin_${versionCode}/sacm/duplicates_remediation_${versionCode}.mdx
- Export CI Template → /content/${versionCode}/admin_${versionCode}/sacm/export_ci_template_${versionCode}.mdx
- IP Connection Score Threshold → /content/${versionCode}/admin_${versionCode}/sacm/ip_connection_score_threshold_${versionCode}.mdx
- Process Tags → /content/${versionCode}/admin_${versionCode}/sacm/process_tags_${versionCode}.mdx
- Property Group → /content/${versionCode}/admin_${versionCode}/sacm/property_group_${versionCode}.mdx
- Relationship Types → /content/${versionCode}/admin_${versionCode}/sacm/relationship_types_${versionCode}.mdx
- Software License Validity Check → /content/${versionCode}/admin_${versionCode}/sacm/software_license_validity_check_${versionCode}.mdx
- Software Usage Report → /content/${versionCode}/admin_${versionCode}/sacm/software_usage_report_${versionCode}.mdx

### Users

- Users → /content/${versionCode}/admin_${versionCode}/users/users_${versionCode}.mdx
- AD Configuration → /content/${versionCode}/admin_${versionCode}/users/ad_configuration_${versionCode}.mdx
- Azure AD Configuration → /content/${versionCode}/admin_${versionCode}/users/azure_ad_configuration_${versionCode}.mdx
- SAML Configuration → /content/${versionCode}/admin_${versionCode}/users/saml_configuration_${versionCode}.mdx
- Time Track Reports → /content/${versionCode}/admin_${versionCode}/users/time_track_reports_${versionCode}.mdx
- User Groups → /content/${versionCode}/admin_${versionCode}/users/user_groups_${versionCode}.mdx
- User Roles → /content/${versionCode}/admin_${versionCode}/users/user_roles_${versionCode}.mdx
- Users → /content/${versionCode}/admin_${versionCode}/users/users_list_${versionCode}.mdx

### Management Functions

- Management Functions → /content/${versionCode}/admin_${versionCode}/management_functions/management_functions_${versionCode}.mdx
- Change Management → /content/${versionCode}/admin_${versionCode}/management_functions/change_management_${versionCode}.mdx
- Contract Management → /content/${versionCode}/admin_${versionCode}/management_functions/contract_management_${versionCode}.mdx
- Event Management → /content/${versionCode}/admin_${versionCode}/management_functions/event_management_${versionCode}.mdx
- Hardware Asset Management → /content/${versionCode}/admin_${versionCode}/management_functions/hardware_asset_management_${versionCode}.mdx
- Incident Management → /content/${versionCode}/admin_${versionCode}/management_functions/incident_management_${versionCode}.mdx
- Knowledge Management → /content/${versionCode}/admin_${versionCode}/management_functions/knowledge_management_${versionCode}.mdx
- Problem Management → /content/${versionCode}/admin_${versionCode}/management_functions/problem_management_${versionCode}.mdx

### Procurement

- Procurement → /content/${versionCode}/admin_${versionCode}/procurement/procurement_${versionCode}.mdx
- About-Procurement → /content/${versionCode}/admin_${versionCode}/procurement/about_procurement_${versionCode}.mdx
- Procurement Properties → /content/${versionCode}/admin_${versionCode}/procurement/procurement_properties_${versionCode}.mdx
- Procurement Property Group → /content/${versionCode}/admin_${versionCode}/procurement/procurement_property_group_${versionCode}.mdx

### Project Management

- Project Management → /content/${versionCode}/admin_${versionCode}/project_management/project_management_${versionCode}.mdx

### Release Management

- Release Management → /content/${versionCode}/admin_${versionCode}/release_management/release_management_${versionCode}.mdx

### Request Management

- Request Management → /content/${versionCode}/admin_${versionCode}/request_management/request_management_${versionCode}.mdx

### Vendor Management

- Vendor Management → /content/${versionCode}/admin_${versionCode}/vendor_management/vendor_management_${versionCode}.mdx

### Integrations

- Integrations → /content/${versionCode}/admin_${versionCode}/integrations/integrations_${versionCode}.mdx
- Cherwell Credential → /content/${versionCode}/admin_${versionCode}/integrations/cherwell_credential_${versionCode}.mdx
  - Cherwell Mappings → /content/${versionCode}/admin_${versionCode}/integrations/cherwell_mappings_${versionCode}.mdx
- Infoblox Configuration → /content/${versionCode}/admin_${versionCode}/integrations/infoblox_configuration_${versionCode}.mdx
- Ivanti Credentials → /content/${versionCode}/admin_${versionCode}/integrations/ivanti_credentials_${versionCode}.mdx
  - Ivanti Mappings → /content/${versionCode}/admin_${versionCode}/integrations/ivanti_mappings_${versionCode}.mdx
- Jira Credentials → /content/${versionCode}/admin_${versionCode}/integrations/jira_credentials_${versionCode}.mdx
  - Jira Asset Mappings → /content/${versionCode}/admin_${versionCode}/integrations/jira_asset_mappings_${versionCode}.mdx
- ServiceNow Credentials → /content/${versionCode}/admin_${versionCode}/integrations/servicenow_credentials_${versionCode}.mdx
  - ServiceNow Mappings → /content/${versionCode}/admin_${versionCode}/integrations/servicenow_mappings_${versionCode}.mdx

### Others

- Others → /content/${versionCode}/admin_${versionCode}/others/others_${versionCode}.mdx
- Announcements → /content/${versionCode}/admin_${versionCode}/others/announcements_${versionCode}.mdx
- Business Rules → /content/${versionCode}/admin_${versionCode}/others/business_rules_${versionCode}.mdx
- Custom Reports → /content/${versionCode}/admin_${versionCode}/others/custom_reports_${versionCode}.mdx
- Documentation and Tester → /content/${versionCode}/admin_${versionCode}/others/documentation_and_tester_${versionCode}.mdx
- Inbox Configuration for ITSM Ticket Management → /content/${versionCode}/admin_${versionCode}/others/inbox_configuration_for_itsm_ticket_management_${versionCode}.mdx
- KPIs → /content/${versionCode}/admin_${versionCode}/others/kpis_${versionCode}.mdx
- Reports → /content/${versionCode}/admin_${versionCode}/others/reports_${versionCode}.mdx
- Role Access → /content/${versionCode}/admin_${versionCode}/others/role_access_${versionCode}.mdx
- Service Level Agreements → /content/${versionCode}/admin_${versionCode}/others/service_level_agreements_${versionCode}.mdx
- SMTP Configuration → /content/${versionCode}/admin_${versionCode}/others/smtp_configuration_${versionCode}.mdx
- Risk Score Calculator → /content/${versionCode}/admin_${versionCode}/others/risk_score_calculator_${versionCode}.mdx
- Graphical Workflows → /content/${versionCode}/admin_${versionCode}/others/graphical_workflows_${versionCode}.mdx
`;
  
  const moduleCount = tocContent.split('##').length - 1;
  const lineCount = tocContent.split('\n').length;
  console.log(`✅ [TOC Generator] Generated TOC with ${moduleCount} modules, ${lineCount} lines`);
  console.log(`✅ [TOC Generator] First 800 chars:`, tocContent.substring(0, 800));
  console.log(`✅ [TOC Generator] Lines 20-25:`, tocContent.split('\n').slice(20, 25));
  return tocContent;
}

/**
 * Generates NG-specific TOC that matches the actual NG/index.mdx structure
 */
function generateNGTOC(): string {
  const tocContent = `# Virima Documentation - Version NextGen

> Master Table of Contents for Version NextGen
> Single source of truth for all navigation, routing, and structure

---

## Application Overview

### Getting Started

- Application Overview → /content/NG/all_about_virima_ng.mdx
- System Icons → /content/NG/admin_ng/admin/icons_ng.mdx
- User Specific Functions → /content/NG/user_specific_functions_ng.mdx

### Shared Functions

- Advanced Search → /content/NG/common_topics/advanced_search_ng.mdx
- Attachments → /content/NG/common_topics/attachments_ng.mdx

### Online Help

- Online Help → /content/NG/online_help_ng.mdx

---

## Dashboards

### Overview

- Contents → /content/NG/my_dashboard/dashboards_contents_ng.mdx
- Customization → /content/NG/my_dashboard/dashboards_customization_ng.mdx

---

## CMDB

### Getting Started

- CMDB Overview → /content/NG/cmdb_ng/cmdb_overview_ng.mdx
- Access CMDB → /content/NG/cmdb_ng/access_cmdb_ng.mdx

---

## Discovery Scan

### Overview

- About Discovery Scan → /content/NG/discovery_ng/about_discovery_scan_ng.mdx

---

## ITSM

### Overview

- About ITSM → /content/NG/itsm_ng/about_itsm_ng.mdx

---

## Vulnerability Management

### Overview

- Vulnerability Management → /content/NG/vulnerability_managment_ng/vulnerability_management_ng.mdx

---

## ITAM

### Overview

- About ITAM → /content/NG/itam_ng/about_itam_ng.mdx

---

## Program/Project Management

### Overview

- About Program/Project Management → /content/NG/prog_proj_mngmnt_ng/about_prog_proj_mngmnt_ng.mdx

---

## Risk Register

### Overview

- About Risk Register → /content/NG/risk_register_ng/about_risk_register_ng.mdx

---

## Reports

### Overview

- Reports → /content/NG/reports_ng/reports_ng.mdx

---

## Admin

### Overview

- About Admin → /content/NG/admin_ng/admin/about_admin_ng.mdx

### Organizational Details

- About Organizational Details → /content/NG/admin_ng/admin_org_details/about_org_details_ng.mdx
- Cost Center → /content/NG/admin_ng/admin_org_details/cost_center_ng.mdx
- Departments → /content/NG/admin_ng/admin_org_details/departments_ng.mdx
- Designations → /content/NG/admin_ng/admin_org_details/designations_ng.mdx
- Holidays → /content/NG/admin_ng/admin_org_details/holidays_ng.mdx
- Locations → /content/NG/admin_ng/admin_org_details/locations_ng.mdx
- Operational Hours → /content/NG/admin_ng/admin_org_details/operational_hours_ng.mdx
- Organizational Details → /content/NG/admin_ng/admin_org_details/organizational_details_ng.mdx

### Discovery

- Admin Discovery → /content/NG/admin_ng/admin_discovery/admin_discovery_ng.mdx

### Users

- AD Configuration → /content/NG/admin_ng/admin_users/ad_imp_auth_ng.mdx
- Azure AD Configuration → /content/NG/admin_ng/admin_users/azure_ad_config_ng.mdx
- User Groups → /content/NG/admin_ng/admin_users/user_groups_ng.mdx
- User Roles → /content/NG/admin_ng/admin_users/user_roles_ng.mdx
- Users → /content/NG/admin_ng/admin_users/users_ng.mdx
`;

  console.log(`✅ [TOC Generator - NG] Generated NextGen TOC`);
  console.log(`✅ [TOC Generator - NG] Content length: ${tocContent.length} chars`);
  console.log(`✅ [TOC Generator - NG] Line count: ${tocContent.split('\n').length}`);
  console.log(`✅ [TOC Generator - NG] Module markers (##): ${tocContent.split('##').length - 1}`);
  
  return tocContent;
}

console.log('📦 [indexContentMap] Initializing TOC content map...');

const ngContent = generateNGTOC();
const v61Content = generateTOC('6_1', '6.1');
const v611Content = generateTOC('6_1_1', '6.1.1');
const v513Content = generateTOC('5_13', '5.13');

export const indexContentMap: Record<string, string> = {
  'NG': ngContent,
  '6_1': v61Content,
  '6_1_1': v611Content,
  '5_13': v513Content,
};

// Test the NG content immediately
console.log('🧪 [indexContentMap] Testing NG content...');
console.log('🧪 [indexContentMap] NG content length:', ngContent.length);
console.log('🧪 [indexContentMap] NG has newlines:', ngContent.includes('\n'));
console.log('🧪 [indexContentMap] NG line count:', ngContent.split('\n').length);
console.log('🧪 [indexContentMap] NG first line:', ngContent.split('\n')[0]);
console.log('🧪 [indexContentMap] NG lines 20-25:', ngContent.split('\n').slice(20, 25));

console.log('✅ [indexContentMap] TOC map initialized with', Object.keys(indexContentMap).length, 'versions');
console.log('📊 [indexContentMap] Sample NG content length:', indexContentMap['NG']?.length || 0);
console.log('📊 [indexContentMap] NG content includes "My Dashboard":', indexContentMap['NG']?.includes('## My Dashboard') || false);

/**
 * Gets the index content for a version
 * Returns programmatic content from the indexContentMap
 */
export function getIndexContent(version: string): string | null {
  const versionPath = versionToPath(version);
  console.log(`🔍 [getIndexContent] Called with version: "${version}", mapped to path: "${versionPath}"`);
  
  const content = indexContentMap[versionPath];
  
  if (content) {
    console.log(`✅ [getIndexContent] Returning content for ${versionPath}: ${content.length} chars`);
    return content;
  }
  
  console.warn(`⚠️ [getIndexContent] No content found for version "${versionPath}"`);
  console.log(`📋 [getIndexContent] Available versions:`, Object.keys(indexContentMap));
  return null;
}

/**
 * Helper function to convert version to file path
 */
function versionToPath(version: string): string {
  const mapping: Record<string, string> = {
    '5.13': '5_13',
    '6.1': '6_1',
    '6.1.1': '6_1_1',
    'NextGen': 'NG',
  };
  return mapping[version] || version;
}
