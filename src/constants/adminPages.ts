// Admin page constants - shared across components
// These constants define which pages belong to which Admin sub-sections
// Direct exports to prevent bundler reordering issues - each constant is exported independently

export const organizationalDetailsPages: readonly string[] = [
  "cost-center",
  "departments",
  "members",
  "designations",
  "holidays",
  "locations",
  "operational-hours",
  "organizational-details-nested",
  "organizational-details",
];

export const departmentsPages: readonly string[] = [
  "members",
  "designations",
  "holidays",
  "locations",
  "operational-hours",
  "organizational-details-nested",
];

export const discoveryPages: readonly string[] = [
  "application-map",
  "client",
  "discovery-agents",
  "remote-install",
  "restart-client",
  "correlation",
  "credentials",
  "details",
  "backup-file",
  "flush-credential",
  "download-application",
  "import-templates",
  "ignore-adm-process",
  "ignore-process",
  "major-software",
  "monitoring-profile",
  "action-details",
  "frequency",
  "notifications",
  "trigger-conditions",
  "patterns",
  "port-configuration",
  "probe-workflow",
  "probes",
  "scan-configuration",
  "sensors",
];

export const clientPages: readonly string[] = [
  "discovery-agents",
  "remote-install",
  "restart-client",
];

export const credentialsPages: readonly string[] = [
  "details",
  "backup-file",
  "flush-credential",
];

export const monitoringProfilePages: readonly string[] = [
  "action-details",
  "details",
  "frequency",
  "notifications",
  "trigger-conditions",
];

export const sacmPages: readonly string[] = [
  "blueprints",
  "bsm-views",
  "cmdb-graphical-workflow",
  "cmdb-properties",
  "confidence-configuration",
  "duplicates-remediation",
  "export-ci-template",
  "ip-connection-score-threshold",
  "process-tags",
  "property-group",
  "relationship-types",
  "software-license-validity-check",
  "software-usage-report",
];

export const usersPages: readonly string[] = [
  "ad-configuration",
  "azure-ad-configuration",
  "saml-configuration",
  "time-track-reports",
  "user-groups",
  "user-roles",
  "users-list",
];

export const managementFunctionsPages: readonly string[] = [
  "change-management",
  "contract-management",
  "event-management",
  "hardware-asset-management",
  "incident-management",
  "knowledge-management",
  "problem-management",
  "about-procurement",
  "procurement-properties",
  "procurement-property-group",
  "project-management",
  "release-management",
  "request-management",
  "vendor-management",
];

export const procurementPages: readonly string[] = [
  "procurement-properties",
  "about-procurement",
  "procurement-property-group",
];

export const integrationsPages: readonly string[] = [
  "cherwell-credential",
  "cherwell-mappings",
  "infoblox-configuration",
  "ivanti-credentials",
  "ivanti-mappings",
  "jira-credentials",
  "jira-asset-mappings",
  "servicenow-credentials",
  "servicenow-mappings",
];

export const cherwellCredentialPages: readonly string[] = [
  "cherwell-mappings",
];

export const ivantiCredentialsPages: readonly string[] = [
  "ivanti-mappings",
];

export const jiraCredentialsPages: readonly string[] = [
  "jira-asset-mappings",
];

export const servicenowCredentialsPages: readonly string[] = [
  "servicenow-mappings",
];

export const othersPages: readonly string[] = [
  "announcements",
  "business-rules",
  "custom-reports",
  "documentation-and-tester",
  "inbox-configuration-itsm",
  "kpis",
  "reports",
  "role-access",
  "service-level-agreements",
  "smtp-configuration",
  "risk-score-calculator",
  "graphical-workflows",
];

// Application Overview and Shared Functions pages - used across multiple components
export const sharedFunctionsPages: readonly string[] = [
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

export const applicationOverviewPages: readonly string[] = [
  "system-icons",
  "user-specific-functions", 
  "online-help",
  "shared-functions",
  ...sharedFunctionsPages,
];

