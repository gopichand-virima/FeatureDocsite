// Module definitions
export const modules = [
  { id: "my-dashboard", label: "My Dashboard" },
  { id: "admin", label: "Admin" },
  { id: "cmdb", label: "CMDB" },
  { id: "discovery-scan", label: "Discovery Scan" },
  { id: "itsm", label: "ITSM" },
  {
    id: "vulnerability-management",
    label: "Vulnerability Management",
  },
  { id: "itam", label: "ITAM" },
  { id: "self-service", label: "Self Service" },
  {
    id: "program-project-management",
    label: "Program and Project Management",
  },
  { id: "risk-register", label: "Risk Register" },
  { id: "reports", label: "Reports" },
];

// Version definitions
export const versions = ["NextGen", "6.1.1", "6.1", "5.13"];

// Default sections for modules without specific sections
export const defaultSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    label: "Getting Started",
    pages: [
      { id: "quick-start", label: "Quick Start" },
      { id: "installation", label: "Installation" },
      { id: "configuration", label: "Configuration" },
      { id: "first-steps", label: "First Steps" },
    ],
  },
  {
    id: "application-overview",
    title: "Application Overview",
    label: "Application Overview",
    pages: [
      { id: "system-icons", label: "System Icons" },
      { id: "user-specific-functions", label: "User Specific Functions" },
      {
        id: "shared-functions",
        label: "Shared Functions",
        subPages: [
          { id: "advanced-search", label: "Advanced Search" },
          { id: "attachments", label: "Attachments" },
          { id: "auto-refresh", label: "Auto Refresh" },
          { id: "collapse-maximize", label: "Collapse/Maximize" },
          { id: "comments", label: "Comments" },
          { id: "delete-remove", label: "Delete/Remove" },
          { id: "email-preferences", label: "Email Preferences" },
          { id: "enable-disable-editing", label: "Enable/Disable Editing" },
          { id: "export", label: "Export" },
          { id: "filter-by", label: "Filter By" },
          { id: "history", label: "History" },
          { id: "import", label: "Import" },
          { id: "items-per-page", label: "Items per Page" },
          { id: "mark-as-knowledge", label: "Mark as Knowledge" },
          { id: "other-asset-info", label: "Other Asset Info" },
          { id: "outage-calendar", label: "Outage Calendar" },
          { id: "personalize-columns", label: "Personalize Columns" },
          { id: "print", label: "Print" },
          { id: "records-per-page", label: "Records per Page" },
          { id: "reload-default-mapping", label: "Reload Default Mapping" },
          { id: "re-scan", label: "Re-scan" },
          { id: "re-sync-data", label: "Re-Sync Data" },
          { id: "save", label: "Save" },
          { id: "saved-filters", label: "Saved Filters" },
          { id: "searching", label: "Searching" },
          { id: "show-main-all-properties", label: "Show Main/All Properties" },
          { id: "tasks", label: "Tasks" },
          { id: "updates", label: "Updates" },
          { id: "version-control", label: "Version Control" },
        ],
      },
      { id: "online-help", label: "Online Help" },
    ],
  },
];

// My Dashboard sections
export const myDashboardSections = [
  {
    id: "dashboards",
    title: "Dashboards",
    label: "Dashboards",
    pages: [
      { id: "contents", label: "Contents" },
      { id: "customization", label: "Customization" },
      {
        id: "my-dashboard",
        label: "My Dashboard",
        subPages: [
          { id: "contents", label: "Contents" },
        ],
      },
      { id: "report-actions", label: "Report Actions" },
    ],
  },
];

// CMDB sections
export const cmdbSections = [
  {
    id: "cmdb",
    title: "CMDB",
    label: "CMDB",
    pages: [
      { id: "access-cmdb", label: "Access CMDB" },
      {
        id: "manage-cmdb",
        label: "Manage CMDB",
        subPages: [
          { id: "audits", label: "Audits" },
          { id: "change-attributes", label: "Change Attributes" },
          { id: "delete", label: "Delete" },
          { id: "export", label: "Export" },
          { id: "new", label: "New" },
          { id: "copy-to-ivanti", label: "Copy to Ivanti" },
          { id: "copy-to-jira", label: "Copy to Jira" },
          { id: "copy-to-servicenow", label: "Copy to ServiceNow" },
          { id: "generate-installed-software-report", label: "Generate Installed Software Report" },
          { id: "process-adm", label: "Process ADM" },
          { id: "process-available-patch-report", label: "Process Available Patch Report" },
          { id: "process-cloud-hierarchy", label: "Process Cloud Hierarchy" },
          { id: "process-devops", label: "Process DevOps" },
          { id: "process-missing-components", label: "Process Missing Components" },
          { id: "process-network-connection", label: "Process Network Connection" },
          { id: "process-software-installation", label: "Process Software Installation" },
          { id: "process-network-virtualization-hierarchy", label: "Process Network Virtualization Hierarchy" },
        ],
      },
      {
        id: "view-and-edit-ci",
        label: "View and Edit a CI",
        subPages: [
          { id: "ci-left-panel", label: "CI Left Panel" },
          { id: "contacts-on-ci", label: "Contacts on a CI" },
        ],
      },
      {
        id: "ci-details-and-tabs",
        label: "CI Details and Tabs",
        subPages: [
          {
            id: "details",
            label: "Details",
            subPages: [
              { id: "manage-ci", label: "Manage CI" },
              { id: "business-service-map", label: "Business Service Map" },
            ],
          },
          { id: "components", label: "Components" },
          { id: "logon-events", label: "Logon Events" },
          { id: "itsm", label: "ITSM" },
          { id: "relationships", label: "Relationships" },
          { id: "audits-tab", label: "Audits" },
          { id: "sla", label: "SLA" },
          { id: "maintenance", label: "Maintenance" },
          { id: "vulnerability", label: "Vulnerability" },
          { id: "private-properties", label: "Private Properties" },
          { id: "tasks", label: "Tasks" },
          { id: "history", label: "History" },
          { id: "attachments", label: "Attachments" },
          { id: "comments", label: "Comments" },
        ],
      },
      { id: "other-functions-and-page-elements", label: "Other Functions and Page Elements" },
    ],
  },
];

// Discovery Scan sections (simplified version - full structure maintained in hierarchical loader)
export const discoveryScanSections = [
  {
    id: "discovery-scan",
    title: "Discovery Scan",
    label: "Discovery Scan",
    pages: [
      {
        id: "dashboard",
        label: "Dashboard",
        subPages: [
          { id: "access-dashboard", label: "Access Dashboard" },
          { id: "dashboard-features", label: "Dashboard Features" },
          { id: "add-contents", label: "Add Contents" },
          { id: "dashboard-customization", label: "Dashboard Customization" },
        ],
      },
      {
        id: "run-a-scan",
        label: "Run a Scan",
        subPages: [
          { id: "pre-requisites-for-scan", label: "Pre-requisites for Scan" },
          {
            id: "initiate-and-configure-discovery-scan",
            label: "Initiate and Configure Discovery Scan",
            subPages: [
              { id: "access-run-a-scan", label: "Access Run A Scan" },
              {
                id: "configure-discovery-scan",
                label: "Configure Discovery Scan",
                subPages: [
                  { id: "probes-configuration", label: "Probes Configuration" },
                  { id: "client-configuration", label: "Client Configuration" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "recent-scans",
        label: "Recent Scans",
        subPages: [
          { id: "access-recent-scan", label: "Access Recent Scan" },
          {
            id: "view-recent-scan",
            label: "View Recent Scan",
            subPages: [
              {
                id: "details",
                label: "Details",
                subPages: [
                  { id: "export-scan-report", label: "Export Scan Report" },
                  { id: "refresh", label: "Refresh" },
                ],
              },
              { id: "logs", label: "Logs" },
              { id: "tasks", label: "Tasks" },
              { id: "comments", label: "Comments" },
              { id: "attachments", label: "Attachments" },
            ],
          },
        ],
      },
      { id: "scheduled-scans-and-imports", label: "Scheduled Scans and Imports" },
      { id: "ipam-networks", label: "IPAM Networks" },
      { id: "discovered-items", label: "Discovered Items" },
      { id: "import-from-aws", label: "Import from AWS" },
      { id: "import-from-azure", label: "Import from Azure" },
      { id: "import-from-meraki", label: "Import from Meraki" },
      { id: "import-from-intune", label: "Import from Intune" },
      { id: "import-data-files", label: "Import Data Files" },
      { id: "imported-assets", label: "Imported Assets" },
      { id: "ad-user-import-logs", label: "AD User Import Logs" },
      { id: "azure-ad-user-import-logs", label: "Azure AD User Import Logs" },
    ],
  },
];

// Admin sections - CORRECTED HIERARCHY
export const adminSections = [
  {
    id: "organizational-details",
    title: "Organizational Details",
    label: "Organizational Details",
    pages: [
      { id: "cost-center", label: "Cost Center" },
      {
        id: "departments",
        label: "Departments",
        subPages: [
          { id: "members", label: "Members" },
        ],
      },
      { id: "designations", label: "Designations" },
      { id: "holidays", label: "Holidays" },
      { id: "locations", label: "Locations" },
      { id: "operational-hours", label: "Operational Hours" },
      { id: "organizational-details", label: "Organizational Details" },
    ],
  },
  {
    id: "discovery",
    title: "Discovery",
    label: "Discovery",
    pages: [
      { id: "application-map", label: "Application Map" },
      {
        id: "client",
        label: "Client",
        subPages: [
          { id: "discovery-agents", label: "Discovery Agents" },
          { id: "remote-install", label: "Remote Install" },
          { id: "restart-client", label: "Restart Client" },
          { id: "scan", label: "Scan" },
        ],
      },
      { id: "correlation", label: "Correlation" },
      {
        id: "credentials",
        label: "Credentials",
        subPages: [
          { id: "details", label: "Details" },
          { id: "backup-file", label: "Backup File" },
          { id: "flush-credential", label: "Flush Credential" },
        ],
      },
      { id: "custom-patterns", label: "Custom Patterns" },
      { id: "download-application", label: "Download Application" },
      { id: "import-templates", label: "Import Templates" },
      { id: "ignore-adm-process", label: "Ignore ADM Process" },
      { id: "ignore-process", label: "Ignore Process" },
      { id: "major-software", label: "Major Software" },
      {
        id: "monitoring-profile",
        label: "Monitoring Profile",
        subPages: [
          { id: "details", label: "Details" },
          { id: "frequency", label: "Frequency" },
          { id: "trigger-conditions", label: "Trigger Conditions" },
          { id: "action-details", label: "Action Details" },
          { id: "notifications", label: "Notifications" },
        ],
      },
      { id: "port-configuration", label: "Port Configuration" },
      { id: "probe-workflow", label: "Probe Workflow" },
      { id: "probes", label: "Probes" },
      { id: "scan-configuration", label: "Scan Configuration" },
      { id: "sensors", label: "Sensors" },
      { id: "graphical-workflows", label: "Graphical Workflows" },
    ],
  },
  {
    id: "sacm",
    title: "SACM",
    label: "SACM",
    pages: [
      { id: "blueprints", label: "Blueprints" },
      { id: "custom-bsm-views", label: "Custom BSM Views" },
      { id: "cmdb-graphical-workflow", label: "CMDB Graphical Workflow" },
      { id: "cmdb-properties", label: "CMDB Properties" },
      { id: "confidence-configuration", label: "Confidence Configuration" },
      { id: "duplicates-remediation", label: "Duplicates Remediation" },
      { id: "export-ci-template", label: "Export CI Template" },
      { id: "ip-connection-score-threshold", label: "IP Connection Score Threshold" },
      { id: "process-tags", label: "Process Tags" },
      { id: "property-group", label: "Property Group" },
      { id: "relationship-types", label: "Relationship Types" },
      { id: "software-license-validity-check", label: "Software License Validity Check" },
      { id: "software-usage-report", label: "Software Usage Report" },
    ],
  },
  {
    id: "users",
    title: "Users",
    label: "Users",
    pages: [
      { id: "ad-configuration", label: "AD Configuration" },
      { id: "azure-ad-configuration", label: "Azure AD Configuration" },
      { id: "saml-configuration", label: "SAML Configuration" },
      { id: "time-track-reports", label: "Time Track Reports" },
      { id: "user-groups", label: "User Groups" },
      { id: "user-roles", label: "User Roles" },
      { id: "users", label: "Users" },
    ],
  },
  {
    id: "management-functions",
    title: "Management Functions",
    label: "Management Functions",
    pages: [
      { id: "change-management", label: "Change Management" },
      { id: "contract-management", label: "Contract Management" },
      { id: "event-management", label: "Event Management" },
      { id: "hardware-asset-management", label: "Hardware Asset Management" },
      { id: "incident-management", label: "Incident Management" },
      { id: "knowledge-management", label: "Knowledge Management" },
      { id: "problem-management", label: "Problem Management" },
      {
        id: "procurement",
        label: "Procurement",
        subPages: [
          { id: "about-procurement", label: "About Procurement" },
          { id: "procurement-properties", label: "Procurement Properties" },
          { id: "procurement-property-group", label: "Procurement Property Group" },
        ],
      },
      { id: "project-management", label: "Project Management" },
      { id: "release-management", label: "Release Management" },
      { id: "request-management", label: "Request Management" },
      { id: "vendor-management", label: "Vendor Management" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    label: "Integrations",
    pages: [
      {
        id: "cherwell-credential",
        label: "Cherwell Credential",
        subPages: [
          { id: "cherwell-mappings", label: "Cherwell Mappings" },
        ],
      },
      { id: "infoblox-configuration", label: "Infoblox Configuration" },
      {
        id: "ivanti-credentials",
        label: "Ivanti Credentials",
        subPages: [
          { id: "ivanti-mappings", label: "Ivanti Mappings" },
        ],
      },
      {
        id: "jira-credentials",
        label: "Jira Credentials",
        subPages: [
          { id: "jira-asset-mappings", label: "Jira Asset Mappings" },
        ],
      },
      {
        id: "servicenow-credentials",
        label: "ServiceNow Credentials",
        subPages: [
          { id: "servicenow-mappings", label: "ServiceNow Mappings" },
        ],
      },
    ],
  },
  {
    id: "others",
    title: "Others",
    label: "Others",
    pages: [
      { id: "announcements", label: "Announcements" },
      { id: "business-rules", label: "Business Rules" },
      { id: "custom-reports", label: "Custom Reports" },
      { id: "documentation-and-tester", label: "Documentation and Tester" },
      { id: "inbox-configuration-itsm", label: "Inbox Configuration for ITSM Ticket Management" },
      { id: "kpis", label: "KPIs" },
      { id: "reports", label: "Reports" },
      { id: "role-access", label: "Role Access" },
      { id: "service-level-agreements", label: "Service Level Agreements" },
      { id: "smtp-configuration", label: "SMTP Configuration" },
      { id: "risk-score-calculator", label: "Risk Score Calculator" },
      { id: "graphical-workflows", label: "Graphical Workflows" },
    ],
  },
];

// ITSM sections - CORRECTED HIERARCHY
export const itsmSections = [
  {
    id: "configuration-management",
    title: "Configuration Management",
    label: "Configuration Management",
    pages: [
      { id: "dashboard", label: "Dashboard" },
      {
        id: "cmdb",
        label: "CMDB",
        subPages: [
          { id: "access-cmdb", label: "Access CMDB" },
          {
            id: "manage-cmdb",
            label: "Manage CMDB",
            subPages: [
              { id: "audits", label: "Audits" },
              { id: "change-attributes", label: "Change Attributes" },
              { id: "delete", label: "Delete" },
              { id: "export", label: "Export" },
              { id: "new", label: "New" },
              { id: "copy-to-ivanti", label: "Copy to Ivanti" },
              { id: "copy-to-jira", label: "Copy to Jira" },
              { id: "copy-to-servicenow", label: "Copy to ServiceNow" },
              { id: "generate-installed-software-report", label: "Generate Installed Software Report" },
              { id: "process-adm", label: "Process ADM" },
              { id: "process-available-patch-report", label: "Process Available Patch Report" },
              { id: "process-cloud-hierarchy", label: "Process Cloud Hierarchy" },
              { id: "process-devops", label: "Process DevOps" },
              { id: "process-missing-components", label: "Process Missing Components" },
              { id: "process-network-connection", label: "Process Network Connection" },
              { id: "process-software-installation", label: "Process Software Installation" },
              { id: "process-network-virtualization-hierarchy", label: "Process Network Virtualization Hierarchy" },
            ],
          },
          {
            id: "view-and-edit-ci",
            label: "View and Edit a CI",
            subPages: [
              { id: "ci-left-panel", label: "CI Left Panel" },
              { id: "contacts-on-ci", label: "Contacts on a CI" },
            ],
          },
          {
            id: "ci-details-and-tabs",
            label: "CI Details and Tabs",
            subPages: [
              {
                id: "details",
                label: "Details",
                subPages: [
                  { id: "manage-ci", label: "Manage CI" },
                  { id: "business-service-map", label: "Business Service Map" },
                ],
              },
              { id: "components", label: "Components" },
              { id: "logon-events", label: "Logon Events" },
              { id: "itsm", label: "ITSM" },
              { id: "relationships", label: "Relationships" },
              { id: "audits", label: "Audits" },
              { id: "sla", label: "SLA" },
              { id: "maintenance", label: "Maintenance" },
              { id: "vulnerability", label: "Vulnerability" },
              { id: "private-properties", label: "Private Properties" },
              { id: "tasks", label: "Tasks" },
              { id: "history", label: "History" },
              { id: "attachments", label: "Attachments" },
              { id: "comments", label: "Comments" },
            ],
          },
          { id: "other-functions-and-page-elements", label: "Other Functions and Page Elements" },
        ],
      },
      { id: "sync-logs", label: "Sync Logs" },
      { id: "tags", label: "Tags" },
      { id: "audits", label: "Audits" },
    ],
  },
  {
    id: "change-management",
    title: "Change Management",
    label: "Change Management",
    pages: [],
  },
  {
    id: "incident-management",
    title: "Incident Management",
    label: "Incident Management",
    pages: [],
  },
  {
    id: "knowledge-management",
    title: "Knowledge Management",
    label: "Knowledge Management",
    pages: [],
  },
  {
    id: "problem-management",
    title: "Problem Management",
    label: "Problem Management",
    pages: [],
  },
  {
    id: "release-management",
    title: "Release Management",
    label: "Release Management",
    pages: [],
  },
  {
    id: "request-fulfillment",
    title: "Request Fulfillment",
    label: "Request Fulfillment",
    pages: [],
  },
  {
    id: "service-portfolio",
    title: "Service Portfolio",
    label: "Service Portfolio",
    pages: [],
  },
  {
    id: "runbook",
    title: "RunBook",
    label: "RunBook",
    pages: [],
  },
];

// ITAM sections - CORRECTED HIERARCHY
export const itamSections = [
  {
    id: "configuration-management",
    title: "Configuration Management",
    label: "Configuration Management",
    pages: [
      { id: "dashboard", label: "Dashboard" },
      {
        id: "cmdb",
        label: "CMDB",
        subPages: [
          { id: "access-cmdb", label: "Access CMDB" },
          {
            id: "manage-cmdb",
            label: "Manage CMDB",
            subPages: [
              { id: "audits", label: "Audits" },
              { id: "change-attributes", label: "Change Attributes" },
              { id: "delete", label: "Delete" },
              { id: "export", label: "Export" },
              { id: "new", label: "New" },
              { id: "copy-to-ivanti", label: "Copy to Ivanti" },
              { id: "copy-to-jira", label: "Copy to Jira" },
              { id: "copy-to-servicenow", label: "Copy to ServiceNow" },
              { id: "generate-installed-software-report", label: "Generate Installed Software Report" },
              { id: "process-adm", label: "Process ADM" },
              { id: "process-available-patch-report", label: "Process Available Patch Report" },
              { id: "process-cloud-hierarchy", label: "Process Cloud Hierarchy" },
              { id: "process-devops", label: "Process DevOps" },
              { id: "process-missing-components", label: "Process Missing Components" },
              { id: "process-network-connection", label: "Process Network Connection" },
              { id: "process-software-installation", label: "Process Software Installation" },
              { id: "process-network-virtualization-hierarchy", label: "Process Network Virtualization Hierarchy" },
            ],
          },
          {
            id: "view-and-edit-ci",
            label: "View and Edit a CI",
            subPages: [
              { id: "ci-left-panel", label: "CI Left Panel" },
              { id: "contacts-on-ci", label: "Contacts on a CI" },
            ],
          },
          {
            id: "ci-details-and-tabs",
            label: "CI Details and Tabs",
            subPages: [
              {
                id: "details",
                label: "Details",
                subPages: [
                  { id: "manage-ci", label: "Manage CI" },
                  { id: "business-service-map", label: "Business Service Map" },
                ],
              },
              { id: "components", label: "Components" },
              { id: "logon-events", label: "Logon Events" },
              { id: "itsm", label: "ITSM" },
              { id: "relationships", label: "Relationships" },
              { id: "audits", label: "Audits" },
              { id: "sla", label: "SLA" },
              { id: "maintenance", label: "Maintenance" },
              { id: "vulnerability", label: "Vulnerability" },
              { id: "private-properties", label: "Private Properties" },
              { id: "tasks", label: "Tasks" },
              { id: "history", label: "History" },
              { id: "attachments", label: "Attachments" },
              { id: "comments", label: "Comments" },
            ],
          },
          { id: "other-functions-and-page-elements", label: "Other Functions and Page Elements" },
        ],
      },
      { id: "sync-logs", label: "Sync Logs" },
      { id: "tags", label: "Tags" },
      { id: "audits", label: "Audits" },
    ],
  },
  {
    id: "hardware-assets",
    title: "Hardware Assets",
    label: "Hardware Assets",
    pages: [],
  },
  {
    id: "software-asset-management",
    title: "Software Asset Management",
    label: "Software Asset Management",
    pages: [
      { id: "software-asset", label: "Software Asset" },
      { id: "software-license-keys", label: "Software License Keys" },
      { id: "certificate-management", label: "Certificate Management" },
    ],
  },
  {
    id: "contract-management",
    title: "Contract Management",
    label: "Contract Management",
    pages: [],
  },
  {
    id: "vendor-management",
    title: "Vendor Management",
    label: "Vendor Management",
    pages: [],
  },
  {
    id: "procurement",
    title: "Procurement",
    label: "Procurement",
    pages: [
      { id: "requested-items", label: "Requested Items" },
      { id: "purchase-orders", label: "Purchase Orders" },
      { id: "purchase-order-line-items", label: "Purchase Order Line Items" },
      { id: "receiving-slips", label: "Receiving Slips" },
      { id: "receiving-slip-lines", label: "Receiving Slip Lines" },
      { id: "transfer-order", label: "Transfer Order" },
    ],
  },
  {
    id: "financial-management",
    title: "Financial Management",
    label: "Financial Management",
    pages: [
      { id: "service-financial-plan", label: "Service Financial Plan" },
      { id: "ci-financial-plan", label: "CI Financial Plan" },
    ],
  },
];

// Vulnerability Management sections
export const vulnerabilityManagementSections = [
  {
    id: "vulnerability-management",
    title: "Vulnerability Management",
    label: "Vulnerability Management",
    pages: [
      { id: "core-functionality", label: "Core Functionality" },
      { id: "access-vulnerability-management", label: "Access Vulnerability Management" },
      { id: "view-vulnerability-management", label: "View Vulnerability Management" },
      { id: "best-practices", label: "Best Practices" },
      { id: "limitations-considerations", label: "Limitations and Considerations" },
    ],
  },
];

// Self Service sections
export const selfServiceSections = [
  {
    id: "self-service",
    title: "Self Service",
    label: "Self Service",
    pages: [
      { id: "service-catalog", label: "Service Catalog" },
      { id: "my-incidents", label: "My Incidents" },
      { id: "my-requests", label: "My Requests" },
    ],
  },
];

// Program/Project Management sections
export const programProjectManagementSections = [
  {
    id: "program-project-management",
    title: "Program and Project Management",
    label: "Program and Project Management",
    pages: [
      {
        id: "programs",
        label: "Programs",
        subPages: [
          { id: "program-dashboard", label: "Program Dashboard" },
        ],
      },
      {
        id: "projects",
        label: "Projects",
        subPages: [
          { id: "project-dashboard", label: "Project Dashboard" },
        ],
      },
    ],
  },
];

// Risk Register sections
export const riskRegisterSections = [
  {
    id: "risk-register",
    title: "Risk Register",
    label: "Risk Register",
    pages: [
      { id: "risk-dashboard", label: "Risk Dashboard" },
      { id: "risks", label: "Risks" },
    ],
  },
];

// Reports sections
export const reportsSections = [
  {
    id: "reports",
    title: "Reports",
    label: "Reports",
    pages: [
      { id: "ad-hoc-reports", label: "Ad Hoc Reports" },
      { id: "canned-reports", label: "Canned Reports" },
      { id: "properties-and-conditions", label: "Properties and Conditions" },
      { id: "run-report", label: "Run Report" },
      { id: "delete-report", label: "Delete Report" },
    ],
  },
];

// Helper function to get sections for a specific module
export function getSectionsForModule(moduleId: string) {
  switch (moduleId) {
    case "admin":
      return adminSections;
    case "my-dashboard":
      return myDashboardSections;
    case "cmdb":
      return cmdbSections;
    case "discovery-scan":
      return discoveryScanSections;
    case "itsm":
      return itsmSections;
    case "itam":
      return itamSections;
    case "vulnerability-management":
      return vulnerabilityManagementSections;
    case "self-service":
      return selfServiceSections;
    case "program-project-management":
      return programProjectManagementSections;
    case "risk-register":
      return riskRegisterSections;
    case "reports":
      return reportsSections;
    default:
      return defaultSections;
  }
}