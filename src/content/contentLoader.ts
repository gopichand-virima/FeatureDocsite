/**
 * Content Loader - Statically imports all MDX content files
 * This file maps file paths to their actual content for runtime access
 */

// Import My Dashboard 6.1 content
import dashboards61 from './6_1/my-dashboard/dashboards-6_1.mdx?raw';
import dashboardsContents61 from './6_1/my-dashboard/dashboards-contents-6_1.mdx?raw';
import dashboardsCustomization61 from './6_1/my-dashboard/dashboards-customization-6_1.mdx?raw';
import dashboardsReportActions61 from './6_1/my-dashboard/dashboards-report-actions-6_1.mdx?raw';
import myDashboard61 from './6_1/my-dashboard/my-dashboard-6_1.mdx?raw';
import myDashboardContents61 from './6_1/my-dashboard/my-dashboard-contents-6_1.mdx?raw';
import myDashboardOverview61 from './6_1/my-dashboard/my-dashboard-overview-6_1.mdx?raw';
import systemIcons61 from './6_1/my-dashboard/system-icons-6_1.mdx?raw';

// Import CMDB 6.1 content
import accessCmdb61 from './6_1/cmdb_6_1/access_cmdb_6_1.mdx?raw';
import attachments61 from './6_1/cmdb_6_1/attachments_6_1.mdx?raw';
import audits61 from './6_1/cmdb_6_1/audits_6_1.mdx?raw';
import auditsTab61 from './6_1/cmdb_6_1/audits_tab_6_1.mdx?raw';
import businessServiceMap61 from './6_1/cmdb_6_1/business_service_map_6_1.mdx?raw';
import changeAttributes61 from './6_1/cmdb_6_1/change_attributes_6_1.mdx?raw';
import ciDetailsAndTabs61 from './6_1/cmdb_6_1/ci_details_and_tabs_6_1.mdx?raw';
import ciLeftPanel61 from './6_1/cmdb_6_1/ci_left_panel_6_1.mdx?raw';
import cmdbOverview61 from './6_1/cmdb_6_1/cmdb_overview_6_1.mdx?raw';
import comments61 from './6_1/cmdb_6_1/comments_6_1.mdx?raw';
import components61 from './6_1/cmdb_6_1/components_6_1.mdx?raw';
import contactsOnACi61 from './6_1/cmdb_6_1/contacts_on_a_ci_6_1.mdx?raw';
import copyToIvanti61 from './6_1/cmdb_6_1/copy_to_ivanti_6_1.mdx?raw';
import copyToJira61 from './6_1/cmdb_6_1/copy_to_jira_6_1.mdx?raw';
import copyToServicenow61 from './6_1/cmdb_6_1/copy_to_servicenow_6_1.mdx?raw';
import deleteCi61 from './6_1/cmdb_6_1/delete_6_1.mdx?raw';
import details61 from './6_1/cmdb_6_1/details_6_1.mdx?raw';
import exportCi61 from './6_1/cmdb_6_1/export_6_1.mdx?raw';
import generateInstalledSoftwareReport61 from './6_1/cmdb_6_1/generate_installed_software_report_6_1.mdx?raw';
import history61 from './6_1/cmdb_6_1/history_6_1.mdx?raw';
import itsm61 from './6_1/cmdb_6_1/itsm_6_1.mdx?raw';
import logonEvents61 from './6_1/cmdb_6_1/logon_events_6_1.mdx?raw';
import maintenance61 from './6_1/cmdb_6_1/maintenance_6_1.mdx?raw';
import manageCi61 from './6_1/cmdb_6_1/manage_ci_6_1.mdx?raw';
import manageCmdb61 from './6_1/cmdb_6_1/manage_cmdb_6_1.mdx?raw';
import newCi61 from './6_1/cmdb_6_1/new_6_1.mdx?raw';
import otherFunctionsAndPageElements61 from './6_1/cmdb_6_1/other_functions_and_page_elements_6_1.mdx?raw';
import privateProperties61 from './6_1/cmdb_6_1/private_properties_6_1.mdx?raw';
import procesNetworkVirtualizationHierarchy61 from './6_1/cmdb_6_1/proce_network_virtualization_hierarchy_6_1.mdx?raw';
import processAdm61 from './6_1/cmdb_6_1/process_adm_6_1.mdx?raw';
import processAvailablePatchReport61 from './6_1/cmdb_6_1/process_available_patch_report_6_1.mdx?raw';
import processCloudHierarchy61 from './6_1/cmdb_6_1/process_cloud_hierarchy_6_1.mdx?raw';
import processDevops61 from './6_1/cmdb_6_1/process_devops_6_1.mdx?raw';
import processMissingComponents61 from './6_1/cmdb_6_1/process_missing_components_6_1.mdx?raw';
import processNetworkConnection61 from './6_1/cmdb_6_1/process_network_connection_6_1.mdx?raw';
import processSoftwareInstallation61 from './6_1/cmdb_6_1/process_software_installation_6_1.mdx?raw';
import relationships61 from './6_1/cmdb_6_1/relationships_6_1.mdx?raw';
import sla61 from './6_1/cmdb_6_1/sla_6_1.mdx?raw';
import tasks61 from './6_1/cmdb_6_1/tasks_6_1.mdx?raw';
import viewAndEditACi61 from './6_1/cmdb_6_1/view_and_edit_a_ci_6_1.mdx?raw';
import vulnerability61 from './6_1/cmdb_6_1/vulnerability_6_1.mdx?raw';

// Import Admin 6.1 content - admin subfolder
import adminFunctionsNew61 from './6_1/admin_6_1/admin/admin_functions_new_6_1.mdx?raw';

// Import Admin 6.1 content - admin_org_details subfolder  
import aboutOrgDetails61 from './6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx?raw';
import organizationalDetails61 from './6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx?raw';
import costCenter61 from './6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx?raw';
import departments61 from './6_1/admin_6_1/admin_org_details/departments_6_1.mdx?raw';
import departmentsMembers61 from './6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx?raw';
import designations61 from './6_1/admin_6_1/admin_org_details/designations_6_1.mdx?raw';
import holidays61 from './6_1/admin_6_1/admin_org_details/holidays_6_1.mdx?raw';
import locations61 from './6_1/admin_6_1/admin_org_details/locations_6_1.mdx?raw';
import operationalHours61 from './6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx?raw';

// Import Discovery 6.1 content
import aboutDiscoveryScan61 from './6_1/discovery_6_1/about_discovery_scan_6_1.mdx?raw';
import discoveredItems61 from './6_1/discovery_6_1/discovered_items_6_1.mdx?raw';
import importedAssets61 from './6_1/discovery_6_1/imported_assets_6_1.mdx?raw';

/**
 * Content map - maps file paths to their content
 */
const contentMap: Record<string, string> = {
  // My Dashboard 6.1
  '/content/6_1/my-dashboard/dashboards-6_1.mdx': dashboards61,
  '/content/6_1/my-dashboard/dashboards-contents-6_1.mdx': dashboardsContents61,
  '/content/6_1/my-dashboard/dashboards-customization-6_1.mdx': dashboardsCustomization61,
  '/content/6_1/my-dashboard/dashboards-report-actions-6_1.mdx': dashboardsReportActions61,
  '/content/6_1/my-dashboard/my-dashboard-6_1.mdx': myDashboard61,
  '/content/6_1/my-dashboard/my-dashboard-contents-6_1.mdx': myDashboardContents61,
  '/content/6_1/my-dashboard/my-dashboard-overview-6_1.mdx': myDashboardOverview61,
  '/content/6_1/my-dashboard/system-icons-6_1.mdx': systemIcons61,
  
  // CMDB 6.1
  '/content/6_1/cmdb_6_1/access_cmdb_6_1.mdx': accessCmdb61,
  '/content/6_1/cmdb_6_1/attachments_6_1.mdx': attachments61,
  '/content/6_1/cmdb_6_1/audits_6_1.mdx': audits61,
  '/content/6_1/cmdb_6_1/audits_tab_6_1.mdx': auditsTab61,
  '/content/6_1/cmdb_6_1/business_service_map_6_1.mdx': businessServiceMap61,
  '/content/6_1/cmdb_6_1/change_attributes_6_1.mdx': changeAttributes61,
  '/content/6_1/cmdb_6_1/ci_details_and_tabs_6_1.mdx': ciDetailsAndTabs61,
  '/content/6_1/cmdb_6_1/ci_left_panel_6_1.mdx': ciLeftPanel61,
  '/content/6_1/cmdb_6_1/cmdb_overview_6_1.mdx': cmdbOverview61,
  '/content/6_1/cmdb_6_1/comments_6_1.mdx': comments61,
  '/content/6_1/cmdb_6_1/components_6_1.mdx': components61,
  '/content/6_1/cmdb_6_1/contacts_on_a_ci_6_1.mdx': contactsOnACi61,
  '/content/6_1/cmdb_6_1/copy_to_ivanti_6_1.mdx': copyToIvanti61,
  '/content/6_1/cmdb_6_1/copy_to_jira_6_1.mdx': copyToJira61,
  '/content/6_1/cmdb_6_1/copy_to_servicenow_6_1.mdx': copyToServicenow61,
  '/content/6_1/cmdb_6_1/delete_6_1.mdx': deleteCi61,
  '/content/6_1/cmdb_6_1/details_6_1.mdx': details61,
  '/content/6_1/cmdb_6_1/export_6_1.mdx': exportCi61,
  '/content/6_1/cmdb_6_1/generate_installed_software_report_6_1.mdx': generateInstalledSoftwareReport61,
  '/content/6_1/cmdb_6_1/history_6_1.mdx': history61,
  '/content/6_1/cmdb_6_1/itsm_6_1.mdx': itsm61,
  '/content/6_1/cmdb_6_1/logon_events_6_1.mdx': logonEvents61,
  '/content/6_1/cmdb_6_1/maintenance_6_1.mdx': maintenance61,
  '/content/6_1/cmdb_6_1/manage_ci_6_1.mdx': manageCi61,
  '/content/6_1/cmdb_6_1/manage_cmdb_6_1.mdx': manageCmdb61,
  '/content/6_1/cmdb_6_1/new_6_1.mdx': newCi61,
  '/content/6_1/cmdb_6_1/other_functions_and_page_elements_6_1.mdx': otherFunctionsAndPageElements61,
  '/content/6_1/cmdb_6_1/private_properties_6_1.mdx': privateProperties61,
  '/content/6_1/cmdb_6_1/proce_network_virtualization_hierarchy_6_1.mdx': procesNetworkVirtualizationHierarchy61,
  '/content/6_1/cmdb_6_1/process_adm_6_1.mdx': processAdm61,
  '/content/6_1/cmdb_6_1/process_available_patch_report_6_1.mdx': processAvailablePatchReport61,
  '/content/6_1/cmdb_6_1/process_cloud_hierarchy_6_1.mdx': processCloudHierarchy61,
  '/content/6_1/cmdb_6_1/process_devops_6_1.mdx': processDevops61,
  '/content/6_1/cmdb_6_1/process_missing_components_6_1.mdx': processMissingComponents61,
  '/content/6_1/cmdb_6_1/process_network_connection_6_1.mdx': processNetworkConnection61,
  '/content/6_1/cmdb_6_1/process_software_installation_6_1.mdx': processSoftwareInstallation61,
  '/content/6_1/cmdb_6_1/relationships_6_1.mdx': relationships61,
  '/content/6_1/cmdb_6_1/sla_6_1.mdx': sla61,
  '/content/6_1/cmdb_6_1/tasks_6_1.mdx': tasks61,
  '/content/6_1/cmdb_6_1/view_and_edit_a_ci_6_1.mdx': viewAndEditACi61,
  '/content/6_1/cmdb_6_1/vulnerability_6_1.mdx': vulnerability61,

  // Admin 6.1 - admin subfolder
  '/content/6_1/admin_6_1/admin/admin_functions_new_6_1.mdx': adminFunctionsNew61,

  // Admin 6.1 - admin_org_details subfolder
  '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx': aboutOrgDetails61,
  '/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx': organizationalDetails61,
  '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx': costCenter61,
  '/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx': departments61,
  '/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx': departmentsMembers61,
  '/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx': designations61,
  '/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx': holidays61,
  '/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx': locations61,
  '/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx': operationalHours61,

  // Discovery 6.1
  '/content/6_1/discovery_6_1/about_discovery_scan_6_1.mdx': aboutDiscoveryScan61,
  '/content/6_1/discovery_6_1/discovered_items_6_1.mdx': discoveredItems61,
  '/content/6_1/discovery_6_1/imported_assets_6_1.mdx': importedAssets61,
};

/**
 * Get content for a given file path
 * @param filePath - The path to the content file
 * @returns The content string or null if not found
 */
export function getContent(filePath: string): string | null {
  console.log('contentLoader.getContent called with:', filePath);
  console.log('Available paths:', Object.keys(contentMap));
  console.log('Content exists?', filePath in contentMap);
  
  const rawContent = contentMap[filePath];
  
  if (!rawContent) {
    console.log('Content not found!');
    return null;
  }
  
  console.log('Raw content type:', typeof rawContent);
  console.log('Raw content:', rawContent);
  
  // Handle different types of content
  let content: string;
  
  if (typeof rawContent === 'string') {
    content = rawContent;
  } else if (typeof rawContent === 'object' && rawContent !== null) {
    // If it's an object with a default property (ESM default export)
    if ('default' in rawContent) {
      content = (rawContent as any).default;
    } else {
      // Try to stringify it
      content = JSON.stringify(rawContent);
    }
  } else {
    console.error('Unexpected content type:', typeof rawContent);
    return null;
  }
  
  console.log('Final content type:', typeof content);
  console.log('Content length:', content?.length || 0);
  if (typeof content === 'string' && content.length > 0) {
    console.log('First 100 chars:', content.substring(0, 100));
  }
  
  return content;
}

/**
 * Check if content exists for a given file path
 * @param filePath - The path to the content file
 * @returns True if content exists, false otherwise
 */
export function hasContent(filePath: string): boolean {
  return filePath in contentMap;
}

/**
 * Get all available content paths
 * @returns Array of all available content file paths
 */
export function getAvailablePaths(): string[] {
  return Object.keys(contentMap);
}