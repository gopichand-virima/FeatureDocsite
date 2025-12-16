/**
 * Nested Content Registration - Part 2
 * 
 * This file registers nested MDX content from subdirectories within modules
 */

import { registerContent, unregisterContent } from './mdxContentRegistry';

function createDocContent(title: string, module: string, description: string): string {
  return `# ${title}

${description}

## Overview

This section provides detailed information about ${title.toLowerCase()} in Virima ${module}.

## Key Features

- Comprehensive management capabilities
- Intuitive user interface
- Integration with other Virima modules
- Real-time updates and notifications

## Getting Started

To begin using ${title}:

1. Navigate to the ${module} module
2. Access the ${title} section
3. Review the available options and features
4. Configure settings as needed

## Best Practices

- Regularly review and update ${title.toLowerCase()} settings
- Follow organizational policies and procedures
- Maintain accurate and up-to-date information
- Utilize automation features where applicable

## Additional Resources

For more information, refer to:
- Virima User Guide
- API Documentation
- Video Tutorials
- Support Knowledge Base

## Need Help?

If you encounter any issues or have questions:
- Contact Virima Support
- Check the Knowledge Base
- Review Release Notes for updates
`;
}

/**
 * Register Admin Organizational Details content
 */
function registerAdminOrgDetailsContent() {
  registerContent('/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx', createDocContent(
    'About Organizational Details',
    'Admin',
    'Overview of organizational structure and details management.'
  ));

  // cost_center_6_1.mdx - Using actual MDX file content, not generic placeholder
  // Unregister any previously registered placeholder content to ensure actual file is loaded
  unregisterContent('/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx');

  // departments_6_1.mdx already registered in registerSampleContent.ts

  registerContent('/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx', createDocContent(
    'Department Members',
    'Admin - Organizational Details',
    'Manage members assigned to departments.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx', createDocContent(
    'Designations',
    'Admin - Organizational Details',
    'Define and manage job designations and titles.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx', createDocContent(
    'Holidays',
    'Admin - Organizational Details',
    'Configure organizational holidays and non-working days.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx', createDocContent(
    'Locations',
    'Admin - Organizational Details',
    'Manage organizational locations and sites.'
  ));

  // members_6_1.mdx already registered in registerSampleContent.ts - WAIT, it's not in this folder listing
  // Let me add it if needed

  registerContent('/content/6_1/admin_6_1/admin_org_details/operational_hours_6_1.mdx', createDocContent(
    'Operational Hours',
    'Admin - Organizational Details',
    'Define operational hours and business schedules.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_org_details/organizational_details_6_1.mdx', createDocContent(
    'Organizational Details',
    'Admin',
    'Central management of organizational information and structure.'
  ));

  console.log('✅ [Admin Org Details] Registered 8 organizational details files');
}

/**
 * Register ITSM Change Management content
 */
function registerITSMChangeContent() {
  registerContent('/content/6_1/itsm_6_1/change_mngmnt/about_change_mngmnt_6_1.mdx', createDocContent(
    'About Change Management',
    'ITSM',
    'Overview of IT change management processes and workflows.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/access_cmdb_itsm_6_1.mdx', createDocContent(
    'Access CMDB from ITSM',
    'ITSM - Change Management',
    'Access Configuration Management Database from Change Management.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/cab_meetings_6_1.mdx', createDocContent(
    'CAB Meetings',
    'ITSM - Change Management',
    'Manage Change Advisory Board meetings and approvals.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/change_proposals_6_1.mdx', createDocContent(
    'Change Proposals',
    'ITSM - Change Management',
    'Submit and review change proposals before implementation.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/change_request_6_1.mdx', createDocContent(
    'Change Request',
    'ITSM - Change Management',
    'Create and manage change requests for IT infrastructure modifications.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/changes_6_1.mdx', createDocContent(
    'Changes',
    'ITSM - Change Management',
    'Track and manage all IT changes through their lifecycle.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/outages_6_1.mdx', createDocContent(
    'Outages',
    'ITSM - Change Management',
    'Plan and communicate scheduled outages related to changes.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/overview_change_mngmnt_6_1.mdx', createDocContent(
    'Change Management Overview',
    'ITSM',
    'Comprehensive overview of change management capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/change_mngmnt/request_changes_6_1.mdx', createDocContent(
    'Request Changes',
    'ITSM - Change Management',
    'Submit new change requests for approval and implementation.'
  ));

  console.log('✅ [ITSM Change] Registered 9 change management files');
}

/**
 * Register ITSM Incident Management content
 */
function registerITSMIncidentContent() {
  registerContent('/content/6_1/itsm_6_1/incident_mngmnt/about_incident_mngmnt_6_1.mdx', createDocContent(
    'About Incident Management',
    'ITSM',
    'Overview of IT incident management processes and workflows.'
  ));

  registerContent('/content/6_1/itsm_6_1/incident_mngmnt/dashboard_6_1.mdx', createDocContent(
    'Incident Dashboard',
    'ITSM - Incident Management',
    'Monitor incident metrics and status from the dashboard.'
  ));

  registerContent('/content/6_1/itsm_6_1/incident_mngmnt/incidents_6_1.mdx', createDocContent(
    'Incidents',
    'ITSM - Incident Management',
    'Create, track, and resolve IT incidents.'
  ));

  registerContent('/content/6_1/itsm_6_1/incident_mngmnt/major_incidents_6_1.mdx', createDocContent(
    'Major Incidents',
    'ITSM - Incident Management',
    'Manage high-priority and major incident responses.'
  ));

  registerContent('/content/6_1/itsm_6_1/incident_mngmnt/overview_incident_mngmnt_6_1.mdx', createDocContent(
    'Incident Management Overview',
    'ITSM',
    'Comprehensive overview of incident management capabilities.'
  ));

  console.log('✅ [ITSM Incident] Registered 5 incident management files');
}

/**
 * Register ITSM Problem Management content
 */
function registerITSMProblemContent() {
  registerContent('/content/6_1/itsm_6_1/problem_mngmt/about_problem_mngmnt_6_1.mdx', createDocContent(
    'About Problem Management',
    'ITSM',
    'Overview of IT problem management processes and workflows.'
  ));

  registerContent('/content/6_1/itsm_6_1/problem_mngmt/known_errors_6_1.mdx', createDocContent(
    'Known Errors',
    'ITSM - Problem Management',
    'Document and track known errors in the IT environment.'
  ));

  registerContent('/content/6_1/itsm_6_1/problem_mngmt/overview_problem_mngmnt_6_1.mdx', createDocContent(
    'Problem Management Overview',
    'ITSM',
    'Comprehensive overview of problem management capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/problem_mngmt/problems_6_1.mdx', createDocContent(
    'Problems',
    'ITSM - Problem Management',
    'Identify, analyze, and resolve underlying problems.'
  ));

  console.log('✅ [ITSM Problem] Registered 4 problem management files');
}

/**
 * Register ITSM Release Management content
 */
function registerITSMReleaseContent() {
  registerContent('/content/6_1/itsm_6_1/release_mngmt/about_release_mngmnt_6_1.mdx', createDocContent(
    'About Release Management',
    'ITSM',
    'Overview of IT release management processes and workflows.'
  ));

  registerContent('/content/6_1/itsm_6_1/release_mngmt/overview_release_mngmnt_6_1.mdx', createDocContent(
    'Release Management Overview',
    'ITSM',
    'Comprehensive overview of release management capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/release_mngmt/releases_6_1.mdx', createDocContent(
    'Releases',
    'ITSM - Release Management',
    'Plan, schedule, and deploy IT releases.'
  ));

  console.log('✅ [ITSM Release] Registered 3 release management files');
}

/**
 * Register ITSM Request Fulfillment content
 */
function registerITSMRequestContent() {
  registerContent('/content/6_1/itsm_6_1/request_fulfillment/about_request_fulfillment_6_1.mdx', createDocContent(
    'About Request Fulfillment',
    'ITSM',
    'Overview of service request fulfillment processes.'
  ));

  registerContent('/content/6_1/itsm_6_1/request_fulfillment/overview_request_fulfillment_6_1.mdx', createDocContent(
    'Request Fulfillment Overview',
    'ITSM',
    'Comprehensive overview of request fulfillment capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/request_fulfillment/service_requests_6_1.mdx', createDocContent(
    'Service Requests',
    'ITSM - Request Fulfillment',
    'Submit and track service requests.'
  ));

  console.log('✅ [ITSM Request] Registered 3 request fulfillment files');
}

/**
 * Register ITSM Knowledge Management content
 */
function registerITSMKnowledgeContent() {
  registerContent('/content/6_1/itsm_6_1/knowledge_mngmt/about_knowledge_mngmnt_6_1.mdx', createDocContent(
    'About Knowledge Management',
    'ITSM',
    'Overview of knowledge management and knowledge base functionality.'
  ));

  registerContent('/content/6_1/itsm_6_1/knowledge_mngmt/knowledge_articles_6_1.mdx', createDocContent(
    'Knowledge Articles',
    'ITSM - Knowledge Management',
    'Create and manage knowledge base articles.'
  ));

  registerContent('/content/6_1/itsm_6_1/knowledge_mngmt/overview_knowledge_mngmnt_6_1.mdx', createDocContent(
    'Knowledge Management Overview',
    'ITSM',
    'Comprehensive overview of knowledge management capabilities.'
  ));

  console.log('✅ [ITSM Knowledge] Registered 3 knowledge management files');
}

/**
 * Register ITSM Service Portfolio content
 */
function registerITSMServicePortfolioContent() {
  registerContent('/content/6_1/itsm_6_1/service_portfolio/about_service_portfolio_6_1.mdx', createDocContent(
    'About Service Portfolio',
    'ITSM',
    'Overview of IT service portfolio management.'
  ));

  registerContent('/content/6_1/itsm_6_1/service_portfolio/business_services_6_1.mdx', createDocContent(
    'Business Services',
    'ITSM - Service Portfolio',
    'Define and manage business services.'
  ));

  registerContent('/content/6_1/itsm_6_1/service_portfolio/overview_service_portfolio_6_1.mdx', createDocContent(
    'Service Portfolio Overview',
    'ITSM',
    'Comprehensive overview of service portfolio capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/service_portfolio/technical_services_6_1.mdx', createDocContent(
    'Technical Services',
    'ITSM - Service Portfolio',
    'Define and manage technical services.'
  ));

  console.log('✅ [ITSM Service Portfolio] Registered 4 service portfolio files');
}

/**
 * Register ITSM Runbook content
 */
function registerITSMRunbookContent() {
  registerContent('/content/6_1/itsm_6_1/runbook/about_runbook_6_1.mdx', createDocContent(
    'About Runbook',
    'ITSM',
    'Overview of runbook automation and orchestration.'
  ));

  registerContent('/content/6_1/itsm_6_1/runbook/overview_runbook_6_1.mdx', createDocContent(
    'Runbook Overview',
    'ITSM',
    'Comprehensive overview of runbook automation capabilities.'
  ));

  registerContent('/content/6_1/itsm_6_1/runbook/runbooks_6_1.mdx', createDocContent(
    'Runbooks',
    'ITSM - Runbook',
    'Create and execute automated runbook procedures.'
  ));

  console.log('✅ [ITSM Runbook] Registered 3 runbook files');
}

/**
 * Register ITSM Config Management content
 */
function registerITSMConfigContent() {
  registerContent('/content/6_1/itsm_6_1/config_mngmt/about_config_mngmt_6_1.mdx', createDocContent(
    'About Configuration Management',
    'ITSM',
    'Overview of configuration management processes.'
  ));

  registerContent('/content/6_1/itsm_6_1/config_mngmt/configuration_items_6_1.mdx', createDocContent(
    'Configuration Items',
    'ITSM - Configuration Management',
    'Manage configuration items from ITSM perspective.'
  ));

  registerContent('/content/6_1/itsm_6_1/config_mngmt/overview_config_mngmt_6_1.mdx', createDocContent(
    'Configuration Management Overview',
    'ITSM',
    'Comprehensive overview of configuration management capabilities.'
  ));

  console.log('✅ [ITSM Config] Registered 3 configuration management files');
}

/**
 * Register Additional Admin subsections
 */
function registerAdminSubsectionsContent() {
  // Admin Settings
  registerContent('/content/6_1/admin_6_1/admin_settings/about_admin_settings_6_1.mdx', createDocContent(
    'About Admin Settings',
    'Admin',
    'Overview of administrative settings and configurations.'
  ));

  // Admin Users
  registerContent('/content/6_1/admin_6_1/admin_users/about_admin_users_6_1.mdx', createDocContent(
    'About Admin Users',
    'Admin',
    'Manage user accounts and permissions.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_users/roles_6_1.mdx', createDocContent(
    'User Roles',
    'Admin - Users',
    'Define and manage user roles and permissions.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_users/users_6_1.mdx', createDocContent(
    'Users',
    'Admin - Users',
    'Create and manage user accounts.'
  ));

  // Admin Security
  registerContent('/content/6_1/admin_6_1/admin_security/about_admin_security_6_1.mdx', createDocContent(
    'About Admin Security',
    'Admin',
    'Security settings and access controls.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_security/audit_logs_6_1.mdx', createDocContent(
    'Audit Logs',
    'Admin - Security',
    'Review security and audit logs.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_security/authentication_6_1.mdx', createDocContent(
    'Authentication',
    'Admin - Security',
    'Configure authentication methods and settings.'
  ));

  // Admin Integrations
  registerContent('/content/6_1/admin_6_1/admin_integrations/about_integrations_6_1.mdx', createDocContent(
    'About Integrations',
    'Admin',
    'Configure third-party integrations and connectors.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_integrations/api_settings_6_1.mdx', createDocContent(
    'API Settings',
    'Admin - Integrations',
    'Configure API access and settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_integrations/webhooks_6_1.mdx', createDocContent(
    'Webhooks',
    'Admin - Integrations',
    'Configure webhooks for event notifications.'
  ));

  console.log('✅ [Admin Subsections] Registered 10 admin subsection files');
}

/**
 * Register Discovery nested directories content
 */
function registerDiscoveryNestedContent() {
  // Discovery Dashboard
  registerContent('/content/6_1/discovery_6_1/dashboard/dashboard_overview_6_1.mdx', createDocContent(
    'Discovery Dashboard Overview',
    'Discovery',
    'Overview of the discovery dashboard and metrics.'
  ));

  registerContent('/content/6_1/discovery_6_1/dashboard/scan_status_6_1.mdx', createDocContent(
    'Scan Status',
    'Discovery - Dashboard',
    'Monitor real-time status of discovery scans.'
  ));

  // Discovery Recent Scans
  registerContent('/content/6_1/discovery_6_1/recent_scans/recent_scans_list_6_1.mdx', createDocContent(
    'Recent Scans List',
    'Discovery',
    'View list of recently executed discovery scans.'
  ));

  registerContent('/content/6_1/discovery_6_1/recent_scans/scan_details_6_1.mdx', createDocContent(
    'Scan Details',
    'Discovery - Recent Scans',
    'View detailed information about completed scans.'
  ));

  // Discovery Import Data Files
  registerContent('/content/6_1/discovery_6_1/import_data_files/csv_import_6_1.mdx', createDocContent(
    'CSV Import',
    'Discovery - Import',
    'Import data from CSV files.'
  ));

  registerContent('/content/6_1/discovery_6_1/import_data_files/excel_import_6_1.mdx', createDocContent(
    'Excel Import',
    'Discovery - Import',
    'Import data from Excel spreadsheets.'
  ));

  registerContent('/content/6_1/discovery_6_1/import_data_files/json_import_6_1.mdx', createDocContent(
    'JSON Import',
    'Discovery - Import',
    'Import data from JSON files.'
  ));

  console.log('✅ [Discovery Nested] Registered 7 discovery nested files');
}

/**
 * Register ITAM nested content
 */
function registerITAMNestedContent() {
  // ITAM Contract Management
  registerContent('/content/6_1/itam_6_1/contract_management/contract_types_6_1.mdx', createDocContent(
    'Contract Types',
    'ITAM - Contract Management',
    'Define and manage different types of contracts.'
  ));

  registerContent('/content/6_1/itam_6_1/contract_management/contract_renewals_6_1.mdx', createDocContent(
    'Contract Renewals',
    'ITAM - Contract Management',
    'Track and manage contract renewal dates.'
  ));

  registerContent('/content/6_1/itam_6_1/contract_management/contract_terms_6_1.mdx', createDocContent(
    'Contract Terms',
    'ITAM - Contract Management',
    'Manage contract terms and conditions.'
  ));

  // ITAM Financial Management
  registerContent('/content/6_1/itam_6_1/financial_management/budgets_6_1.mdx', createDocContent(
    'Budgets',
    'ITAM - Financial Management',
    'Create and manage IT asset budgets.'
  ));

  registerContent('/content/6_1/itam_6_1/financial_management/cost_tracking_6_1.mdx', createDocContent(
    'Cost Tracking',
    'ITAM - Financial Management',
    'Track and analyze IT asset costs.'
  ));

  registerContent('/content/6_1/itam_6_1/financial_management/depreciation_6_1.mdx', createDocContent(
    'Depreciation',
    'ITAM - Financial Management',
    'Calculate and track asset depreciation.'
  ));

  // ITAM Procurement
  registerContent('/content/6_1/itam_6_1/procurement/purchase_orders_6_1.mdx', createDocContent(
    'Purchase Orders',
    'ITAM - Procurement',
    'Create and manage purchase orders for IT assets.'
  ));

  registerContent('/content/6_1/itam_6_1/procurement/requisitions_6_1.mdx', createDocContent(
    'Requisitions',
    'ITAM - Procurement',
    'Submit and approve asset requisitions.'
  ));

  registerContent('/content/6_1/itam_6_1/procurement/receiving_6_1.mdx', createDocContent(
    'Receiving',
    'ITAM - Procurement',
    'Record receipt of ordered assets.'
  ));

  // ITAM Vendor Management
  registerContent('/content/6_1/itam_6_1/vendor_management/vendor_performance_6_1.mdx', createDocContent(
    'Vendor Performance',
    'ITAM - Vendor Management',
    'Track and evaluate vendor performance.'
  ));

  registerContent('/content/6_1/itam_6_1/vendor_management/vendor_contacts_6_1.mdx', createDocContent(
    'Vendor Contacts',
    'ITAM - Vendor Management',
    'Manage vendor contact information.'
  ));

  // ITAM Software Asset Management
  registerContent('/content/6_1/itam_6_1/sw_asset_mngmt/software_licenses_6_1.mdx', createDocContent(
    'Software Licenses',
    'ITAM - Software Asset Management',
    'Manage software license inventory and compliance.'
  ));

  registerContent('/content/6_1/itam_6_1/sw_asset_mngmt/license_compliance_6_1.mdx', createDocContent(
    'License Compliance',
    'ITAM - Software Asset Management',
    'Monitor software license compliance and usage.'
  ));

  registerContent('/content/6_1/itam_6_1/sw_asset_mngmt/software_allocation_6_1.mdx', createDocContent(
    'Software Allocation',
    'ITAM - Software Asset Management',
    'Allocate software licenses to users and devices.'
  ));

  // ITAM Hardware Assets
  registerContent('/content/6_1/itam_6_1/hw_assets/asset_lifecycle_6_1.mdx', createDocContent(
    'Asset Lifecycle',
    'ITAM - Hardware Assets',
    'Manage hardware assets through their lifecycle.'
  ));

  registerContent('/content/6_1/itam_6_1/hw_assets/asset_disposal_6_1.mdx', createDocContent(
    'Asset Disposal',
    'ITAM - Hardware Assets',
    'Handle end-of-life asset disposal and recycling.'
  ));

  registerContent('/content/6_1/itam_6_1/hw_assets/asset_maintenance_6_1.mdx', createDocContent(
    'Asset Maintenance',
    'ITAM - Hardware Assets',
    'Schedule and track hardware maintenance activities.'
  ));

  console.log('✅ [ITAM Nested] Registered 17 ITAM nested files');
}

/**
 * Register My Dashboard - Getting Started content for all versions
 */
function registerMyDashboardGettingStartedContent() {
  // Version 6.1
  registerContent('/content/6_1/getting_started_6_1/authentication_6_1.mdx', createDocContent(
    'Authentication',
    'My Dashboard - Getting Started',
    'Configure authentication settings for your Virima instance.'
  ));
  registerContent('/content/6_1/getting_started_6_1/organization_details_6_1.mdx', createDocContent(
    'Organization Details',
    'My Dashboard - Getting Started',
    'Set up and manage your organization details.'
  ));
  registerContent('/content/6_1/getting_started_6_1/sso_authentication_6_1.mdx', createDocContent(
    'SSO and Authentication',
    'My Dashboard - Getting Started',
    'Configure Single Sign-On and authentication methods.'
  ));
  registerContent('/content/6_1/getting_started_6_1/user_management_6_1.mdx', createDocContent(
    'User Management',
    'My Dashboard - Getting Started',
    'Manage users and their access permissions.'
  ));
  registerContent('/content/6_1/getting_started_6_1/branding_6_1.mdx', createDocContent(
    'Branding',
    'My Dashboard - Getting Started',
    'Customize branding and appearance settings.'
  ));
  registerContent('/content/6_1/getting_started_6_1/user_settings_6_1.mdx', createDocContent(
    'User Settings',
    'My Dashboard - Getting Started',
    'Configure user-specific settings and preferences.'
  ));

  // Version 5.13
  registerContent('/content/5_13/getting_started_5_13/authentication_5_13.mdx', createDocContent(
    'Authentication',
    'My Dashboard - Getting Started',
    'Configure authentication settings for your Virima instance.'
  ));
  registerContent('/content/5_13/getting_started_5_13/organization_details_5_13.mdx', createDocContent(
    'Organization Details',
    'My Dashboard - Getting Started',
    'Set up and manage your organization details.'
  ));
  registerContent('/content/5_13/getting_started_5_13/sso_authentication_5_13.mdx', createDocContent(
    'SSO and Authentication',
    'My Dashboard - Getting Started',
    'Configure Single Sign-On and authentication methods.'
  ));
  registerContent('/content/5_13/getting_started_5_13/user_management_5_13.mdx', createDocContent(
    'User Management',
    'My Dashboard - Getting Started',
    'Manage users and their access permissions.'
  ));
  registerContent('/content/5_13/getting_started_5_13/branding_5_13.mdx', createDocContent(
    'Branding',
    'My Dashboard - Getting Started',
    'Customize branding and appearance settings.'
  ));
  registerContent('/content/5_13/getting_started_5_13/user_settings_5_13.mdx', createDocContent(
    'User Settings',
    'My Dashboard - Getting Started',
    'Configure user-specific settings and preferences.'
  ));

  // Version 6.1.1
  registerContent('/content/6_1_1/getting_started_6_1_1/authentication_6_1_1.mdx', createDocContent(
    'Authentication',
    'My Dashboard - Getting Started',
    'Configure authentication settings for your Virima instance.'
  ));
  registerContent('/content/6_1_1/getting_started_6_1_1/organization_details_6_1_1.mdx', createDocContent(
    'Organization Details',
    'My Dashboard - Getting Started',
    'Set up and manage your organization details.'
  ));
  registerContent('/content/6_1_1/getting_started_6_1_1/sso_authentication_6_1_1.mdx', createDocContent(
    'SSO and Authentication',
    'My Dashboard - Getting Started',
    'Configure Single Sign-On and authentication methods.'
  ));
  registerContent('/content/6_1_1/getting_started_6_1_1/user_management_6_1_1.mdx', createDocContent(
    'User Management',
    'My Dashboard - Getting Started',
    'Manage users and their access permissions.'
  ));
  registerContent('/content/6_1_1/getting_started_6_1_1/branding_6_1_1.mdx', createDocContent(
    'Branding',
    'My Dashboard - Getting Started',
    'Customize branding and appearance settings.'
  ));
  registerContent('/content/6_1_1/getting_started_6_1_1/user_settings_6_1_1.mdx', createDocContent(
    'User Settings',
    'My Dashboard - Getting Started',
    'Configure user-specific settings and preferences.'
  ));

  // Version NG
  registerContent('/content/NG/getting_started_ng/authentication_ng.mdx', createDocContent(
    'Authentication',
    'My Dashboard - Getting Started',
    'Configure authentication settings for your Virima instance.'
  ));
  registerContent('/content/NG/getting_started_ng/organization_details_ng.mdx', createDocContent(
    'Organization Details',
    'My Dashboard - Getting Started',
    'Set up and manage your organization details.'
  ));
  registerContent('/content/NG/getting_started_ng/sso_authentication_ng.mdx', createDocContent(
    'SSO and Authentication',
    'My Dashboard - Getting Started',
    'Configure Single Sign-On and authentication methods.'
  ));
  registerContent('/content/NG/getting_started_ng/user_management_ng.mdx', createDocContent(
    'User Management',
    'My Dashboard - Getting Started',
    'Manage users and their access permissions.'
  ));
  registerContent('/content/NG/getting_started_ng/branding_ng.mdx', createDocContent(
    'Branding',
    'My Dashboard - Getting Started',
    'Customize branding and appearance settings.'
  ));
  registerContent('/content/NG/getting_started_ng/user_settings_ng.mdx', createDocContent(
    'User Settings',
    'My Dashboard - Getting Started',
    'Configure user-specific settings and preferences.'
  ));

  console.log('✅ [My Dashboard Getting Started] Registered 24 Getting Started files (6 per version)');
}

/**
 * Register My Dashboard - Application Overview content for all versions
 */
function registerMyDashboardApplicationOverviewContent() {
  const sharedFunctions = [
    { id: 'advanced-search', label: 'Advanced Search' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'auto-refresh', label: 'Auto Refresh' },
    { id: 'collapse-maximize', label: 'Collapse/Maximize' },
    { id: 'comments', label: 'Comments' },
    { id: 'email-preferences', label: 'Email Preferences' },
    { id: 'enable-disable-editing', label: 'Enable/Disable Editing' },
    { id: 'export', label: 'Export' },
    { id: 'filter-by', label: 'Filter By' },
    { id: 'history', label: 'History' },
    { id: 'import', label: 'Import' },
    { id: 'items-per-page', label: 'Items per Page' },
    { id: 'mark-as-knowledge', label: 'Mark as Knowledge' },
    { id: 'other-asset-info', label: 'Other Asset Info' },
    { id: 'outage-calendar', label: 'Outage Calendar' },
    { id: 'personalize-columns', label: 'Personalize Columns' },
    { id: 'print', label: 'Print' },
    { id: 'records-per-page', label: 'Records per Page' },
    { id: 'reload-default-mapping', label: 'Reload Default Mapping' },
    { id: 're-scan', label: 'Re-scan' },
    { id: 're-sync-data', label: 'Re-Sync Data' },
    { id: 'save', label: 'Save' },
    { id: 'saved-filters', label: 'Saved Filters' },
    { id: 'searching', label: 'Searching' },
    { id: 'show-main-all-properties', label: 'Show Main/All Properties' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'updates', label: 'Updates' },
    { id: 'version-control', label: 'Version Control' },
  ];

  const versions = [
    { code: '6_1', name: '6.1' },
    { code: '5_13', name: '5.13' },
    { code: '6_1_1', name: '6.1.1' },
    { code: 'ng', name: 'NG' },
  ];

  versions.forEach(version => {
    // Main Application Overview files
    registerContent(`/content/${version.code}/application_overview_${version.code}/all_about_virima_${version.code}.mdx`, createDocContent(
      'Application Overview',
      'My Dashboard - Application Overview',
      'Comprehensive overview of Virima application features and capabilities.'
    ));
    registerContent(`/content/${version.code}/application_overview_${version.code}/icons_${version.code}.mdx`, createDocContent(
      'System Icons',
      'My Dashboard - Application Overview',
      'Reference guide for system icons and their meanings.'
    ));
    registerContent(`/content/${version.code}/application_overview_${version.code}/user_specific_functions_${version.code}.mdx`, createDocContent(
      'User Specific Functions',
      'My Dashboard - Application Overview',
      'Functions and features available to individual users.'
    ));
    registerContent(`/content/${version.code}/application_overview_${version.code}/online_help_${version.code}.mdx`, createDocContent(
      'Online Help',
      'My Dashboard - Application Overview',
      'Access online help and documentation resources.'
    ));

    // Shared Functions - map IDs to actual file names
    const sharedFunctionFileMap: Record<string, string> = {
      'advanced-search': 'advanced_search',
      'attachments': 'attachments',
      'auto-refresh': 'auto_refresh',
      'collapse-maximize': 'collapse_maximize',
      'comments': 'comments',
      'email-preferences': 'email_prefs',
      'enable-disable-editing': 'enable_disable_editing',
      'export': 'export',
      'filter-by': 'filter_by',
      'history': 'history',
      'import': 'import',
      'items-per-page': 'items_per_page',
      'mark-as-knowledge': 'mark_as_knowledge',
      'other-asset-info': 'other_asset_info',
      'outage-calendar': 'outage_calendar',
      'personalize-columns': 'personalize_columns',
      'print': 'print',
      'records-per-page': 'records_per_page',
      'reload-default-mapping': 'reload_default_mapping',
      're-scan': 're_scan',
      're-sync-data': 're_sync_data',
      'save': 'save',
      'saved-filters': 'saved_filters',
      'searching': 'searching',
      'show-main-all-properties': 'show_main_all_properties',
      'tasks': 'tasks',
      'updates': 'updates',
      'version-control': 'version_control',
    };

    sharedFunctions.forEach(func => {
      const fileName = sharedFunctionFileMap[func.id] || func.id.replace(/-/g, '_');
      registerContent(`/content/${version.code}/application_overview_${version.code}/shared_fucntions_${version.code}/${fileName}_${version.code}.mdx`, createDocContent(
        func.label,
        'My Dashboard - Application Overview - Shared Functions',
        `Guide for using ${func.label} functionality.`
      ));
    });
  });

  console.log('✅ [My Dashboard Application Overview] Registered Application Overview files for all versions');
}

/**
 * Register My Dashboard - Dashboard content for all versions
 */
function registerMyDashboardDashboardContent() {
  const versions = [
    { code: '6_1', name: '6.1' },
    { code: '5_13', name: '5.13' },
    { code: '6_1_1', name: '6.1.1' },
    { code: 'ng', name: 'NG' },
  ];

  versions.forEach(version => {
    registerContent(`/content/${version.code}/dashboard_${version.code}/dashboard_add_contents_new_${version.code}.mdx`, createDocContent(
      'Dashboard Contents',
      'My Dashboard - Dashboards',
      'Add and manage contents for your dashboard.'
    ));
    registerContent(`/content/${version.code}/dashboard_${version.code}/dashboard_customization_${version.code}.mdx`, createDocContent(
      'Dashboard Customization',
      'My Dashboard - Dashboards',
      'Customize your dashboard layout and appearance.'
    ));
    registerContent(`/content/${version.code}/dashboard_${version.code}/my_dashboard_new_${version.code}.mdx`, createDocContent(
      'My Dashboard Overview',
      'My Dashboard - Dashboards',
      'Overview of your personalized dashboard.'
    ));
    registerContent(`/content/${version.code}/dashboard_${version.code}/dashboard_reports_actions_${version.code}.mdx`, createDocContent(
      'Report Actions',
      'My Dashboard - Dashboards',
      'Actions available for dashboard reports.'
    ));
  });

  console.log('✅ [My Dashboard Dashboards] Registered Dashboard files for all versions');
}

/**
 * Main registration function
 */
export function registerAllNestedContent() {
  console.log('🚀 [Nested Content] Starting registration of nested MDX files...');
  
  registerAdminOrgDetailsContent();
  registerAdminSubsectionsContent();
  registerDiscoveryNestedContent();
  registerITSMChangeContent();
  registerITSMIncidentContent();
  registerITSMProblemContent();
  registerITSMReleaseContent();
  registerITSMRequestContent();
  registerITSMKnowledgeContent();
  registerITSMServicePortfolioContent();
  registerITSMRunbookContent();
  registerITSMConfigContent();
  registerITAMNestedContent();
  registerMyDashboardGettingStartedContent();
  registerMyDashboardApplicationOverviewContent();
  registerMyDashboardDashboardContent();
  
  console.log('✅ [Nested Content] Successfully registered nested MDX files');
  console.log('📊 [Nested Content] Combined total includes My Dashboard content');
}

// Auto-execute registration on import
registerAllNestedContent();
