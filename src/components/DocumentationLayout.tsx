import { ReactNode, useState, useEffect, MutableRefObject } from "react";
import { Search, Menu, X, Home, Command, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { AISearchDialog } from "./AISearchDialog";
import { LoginDialog } from "./LoginDialog";

interface DocumentationLayoutProps {
  logo: string;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  selectedModule: string;
  onModuleChange: (module: string) => void;
  selectedSection: string;
  onSectionChange: (section: string) => void;
  selectedPage: string;
  onPageChange: (page: string) => void;
  onHomeClick: () => void;
  children: ReactNode;
  isHomePage?: boolean;
  versionDropdownTriggerRef?: MutableRefObject<(() => void) | null>;
}

const versions = ["NextGen", "6.1.1", "6.1", "5.13"];

const modules = [
  { id: "admin", label: "Admin" },
  { id: "my-dashboard", label: "My Dashboard" },
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

const defaultSections = [
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
          { id: "copy-to-cherwell", label: "Copy to Cherwell" },
          { id: "copy-to-ivanti", label: "Copy to Ivanti" },
          { id: "copy-to-servicenow", label: "Copy to ServiceNow" },
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
          { id: "process-adm", label: "Process ADM" },
          { id: "process-missing-components", label: "Process Missing Components" },
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

const myDashboardSections = [
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
          { id: "copy-to-cherwell", label: "Copy to Cherwell" },
          { id: "copy-to-ivanti", label: "Copy to Ivanti" },
          { id: "copy-to-servicenow", label: "Copy to ServiceNow" },
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
          { id: "process-adm", label: "Process ADM" },
          { id: "process-missing-components", label: "Process Missing Components" },
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
  {
    id: "my-dashboard",
    title: "My Dashboard",
    label: "My Dashboard",
    pages: [
      { id: "my-dashboard-overview", label: "Overview" },
      {
        id: "dashboards",
        label: "Dashboards",
        subPages: [
          { id: "dashboards-contents", label: "Contents" },
          { id: "customization", label: "Customization" },
          { id: "report-actions", label: "Report Actions" },
          {
            id: "my-dashboard-section",
            label: "My Dashboard",
            subPages: [
              { id: "my-dashboard-contents", label: "Contents" },
            ],
          },
        ],
      },
      { id: "system-icons", label: "System Icons" },
    ],
  },
];

const cmdbSections = [
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
        ],
      },
    ],
  },
];

const discoveryScanSections = [
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
                  { id: "logs", label: "Logs" },
                  { id: "tasks", label: "Tasks" },
                  { id: "comments", label: "Comments" },
                  { id: "attachments", label: "Attachments" },
                ],
              },
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
      {
        id: "azure-ad-user-import-logs",
        label: "Azure AD User Import Logs",
        subPages: [
          { id: "azure-ad-configuration-and-import", label: "Azure AD Configuration and Import" },
          { id: "access-the-azure-ad-user-import-logs", label: "Access the Azure AD User Import Logs" },
          {
            id: "view-import-log-details",
            label: "View Import Log Details",
            subPages: [
              { id: "customize-columns", label: "Customize Columns" },
              { id: "delete-azure-ad-user-import-logs", label: "Delete Azure AD User Import Logs" },
            ],
          },
        ],
      },
    ],
  },
];

const adminSections = [
  {
    id: "admin",
    title: "Admin",
    label: "Admin",
    pages: [
      {
        id: "organizational-details",
        label: "Organizational Details",
        subPages: [
          { id: "cost-center", label: "Cost Center" },
          {
            id: "departments",
            label: "Departments",
            subPages: [
              { id: "members", label: "Members" },
              { id: "designations", label: "Designations" },
              { id: "holidays", label: "Holidays" },
              { id: "locations", label: "Locations" },
              { id: "operational-hours", label: "Operational Hours" },
              { id: "organizational-details-nested", label: "Organizational Details" },
            ],
          },
        ],
      },
      {
        id: "discovery",
        label: "Discovery",
        subPages: [
          { id: "application-map", label: "Application Map" },
          {
            id: "client",
            label: "Client",
            subPages: [
              { id: "discovery-agents", label: "Discovery Agents" },
              { id: "remote-install", label: "Remote Install" },
              { id: "restart-client", label: "Restart Client" },
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
          { id: "download-application", label: "Download Application" },
          { id: "import-templates", label: "Import Templates" },
          { id: "ignore-adm-process", label: "Ignore ADM Process" },
          { id: "ignore-process", label: "Ignore Process" },
          { id: "major-software", label: "Major Software" },
          { id: "monitoring-profile", label: "Monitoring Profile" },
          { id: "patterns", label: "Patterns" },
          { id: "port-configuration", label: "Port Configuration" },
          { id: "probe-workflow", label: "Probe Workflow" },
          { id: "probes", label: "Probes" },
          { id: "scan-configuration", label: "Scan Configuration" },
          { id: "sensors", label: "Sensors" },
        ],
      },
      {
        id: "sacm",
        label: "SACM",
        subPages: [
          { id: "blueprints", label: "Blueprints" },
          { id: "bsm-views", label: "BSM Views" },
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
        label: "Users",
        subPages: [
          { id: "ad-import-and-authentication", label: "AD Import and Authentication" },
          { id: "azure-ad-configuration", label: "Azure AD Configuration" },
          { id: "saml-configuration", label: "SAML Configuration" },
          { id: "time-track-reports", label: "Time Track Reports" },
          { id: "user-groups", label: "User Groups" },
          { id: "user-roles", label: "User Roles" },
          { id: "users-list", label: "Users" },
        ],
      },
      {
        id: "management-functions",
        label: "Management Functions",
        subPages: [
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
              { id: "procurement-properties", label: "Procurement Properties" },
              { id: "about-procurement", label: "About-Procurement" },
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
        label: "Integrations",
        subPages: [
          {
            id: "cherwell-credential",
            label: "Cherwell Credential",
            subPages: [
              { id: "mappings", label: "Mappings" },
            ],
          },
          { id: "infoblox-configuration", label: "Infoblox Configuration" },
          {
            id: "ivanti-credentials",
            label: "Ivanti Credentials",
            subPages: [
              { id: "ivanti-mappings", label: "Mappings" },
            ],
          },
          {
            id: "jira-credentials",
            label: "Jira Credentials",
            subPages: [
              { id: "jira-mappings", label: "Mappings" },
            ],
          },
          {
            id: "servicenow-credentials",
            label: "ServiceNow Credentials",
            subPages: [
              { id: "servicenow-mappings", label: "Mappings" },
            ],
          },
        ],
      },
      {
        id: "others",
        label: "Others",
        subPages: [
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
          { id: "graphical-workflows", label: "Graphical Workflows" },
        ],
      },
    ],
  },
];

const itsmSections = [
  {
    id: "itsm",
    title: "ITSM",
    label: "ITSM",
    pages: [
      {
        id: "configuration-management",
        label: "Configuration Management",
        subPages: [
          { id: "dashboard", label: "Dashboard" },
          {
            id: "cmdb",
            label: "CMDB",
            subPages: [
              { id: "access-cmdb", label: "Access CMDB" },
              { id: "manage-cmdb", label: "Manage CMDB" },
              {
                id: "view-and-edit-ci",
                label: "View and Edit a CI",
                subPages: [
                  { id: "ci-left-panel", label: "CI Left Panel" },
                  { id: "contacts-on-ci", label: "Contacts on a CI" },
                  {
                    id: "ci-details-and-tabs",
                    label: "CI Details and Tabs",
                    subPages: [
                      { id: "details", label: "Details" },
                      { id: "components", label: "Components" },
                      { id: "logon-events", label: "Logon Events" },
                      { id: "itsm-tab", label: "ITSM" },
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
        ],
      },
      { id: "change-management", label: "Change Management" },
      { id: "incident-management", label: "Incident Management" },
      { id: "knowledge-management", label: "Knowledge Management" },
      { id: "problem-management", label: "Problem Management" },
      { id: "release-management", label: "Release Management" },
      { id: "request-fulfillment", label: "Request Fulfillment" },
      { id: "service-portfolio", label: "Service Portfolio" },
      { id: "runbook", label: "RunBook" },
    ],
  },
];

const getSectionsForModule = (moduleId: string) => {
  if (moduleId === "admin") {
    return adminSections;
  }
  if (moduleId === "my-dashboard") {
    return myDashboardSections;
  }
  if (moduleId === "cmdb") {
    return cmdbSections;
  }
  if (moduleId === "discovery-scan") {
    return discoveryScanSections;
  }
  if (moduleId === "itsm") {
    return itsmSections;
  }
  return defaultSections;
};

export function DocumentationLayout({
  logo,
  selectedVersion,
  onVersionChange,
  selectedModule,
  onModuleChange,
  selectedSection,
  onSectionChange,
  selectedPage,
  onPageChange,
  onHomeClick,
  children,
  isHomePage = false,
  versionDropdownTriggerRef,
}: DocumentationLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] =
    useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Set<string>
  >(new Set([selectedSection]));
  const [expandedPages, setExpandedPages] = useState<
    Set<string>
  >(new Set());
  const [expandedSubPages, setExpandedSubPages] = useState<
    Set<string>
  >(new Set());
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);

  // Set up the trigger function for opening the version dropdown
  useEffect(() => {
    if (versionDropdownTriggerRef) {
      versionDropdownTriggerRef.current = () => {
        setVersionDropdownOpen(true);
      };
    }
  }, [versionDropdownTriggerRef]);

  // Auto-expand sections and pages when selected (enterprise-grade: works across all versions)
  useEffect(() => {
    if (selectedSection) {
      setExpandedSections((prev) => new Set(prev).add(selectedSection));
    }
  }, [selectedSection]);

  // Auto-expand parent pages when a subPage is selected
  useEffect(() => {
    if (selectedPage && selectedModule) {
      const sections = getSectionsForModule(selectedModule);
      // Find the parent page that contains the selected page
      for (const section of sections) {
        for (const page of section.pages || []) {
          // Check if selectedPage is a direct child
          if (page.id === selectedPage) {
            // This page is selected, ensure its section is expanded
            setExpandedSections((prev) => new Set(prev).add(section.id));
            break;
          }
          // Check if selectedPage is a subPage
          if (page.subPages) {
            for (const subPage of page.subPages) {
              if (subPage.id === selectedPage) {
                // This subPage is selected, ensure parent page and section are expanded
                setExpandedSections((prev) => new Set(prev).add(section.id));
                setExpandedPages((prev) => new Set(prev).add(page.id));
                break;
              }
              // Check nested subPages
              if (subPage.subPages) {
                for (const nestedSubPage of subPage.subPages) {
                  if (nestedSubPage.id === selectedPage) {
                    // This nested subPage is selected, ensure all parents are expanded
                    setExpandedSections((prev) => new Set(prev).add(section.id));
                    setExpandedPages((prev) => new Set(prev).add(page.id));
                    setExpandedSubPages((prev) => new Set(prev).add(subPage.id));
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
  }, [selectedPage, selectedModule]);

  const showSidebar = !!selectedModule;
  const sections = getSectionsForModule(selectedModule);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const toggleSubPage = (subPageId: string) => {
    setExpandedSubPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subPageId)) {
        newSet.delete(subPageId);
      } else {
        newSet.add(subPageId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <div className="flex items-center gap-8">
            {showSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden -ml-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <button
              onClick={onHomeClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="Virima" className="h-7" />
              <Separator
                orientation="vertical"
                className="h-5 hidden sm:block bg-slate-200"
              />
              <span className="text-slate-600 hidden"></span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHomeClick}
              className="hidden md:flex items-center gap-2 text-slate-700"
            >
              <a
                href="https://login-v61b.virima.com/www_em/pages/usersDashboard/?entity=my-dashboard-items&tab=MyciTab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition-colors"
              >
                Dashboard
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-slate-700"
              asChild
            >
              <a
                href="https://virima.com/why-virima"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Support</span>
              </a>
            </Button>

            <Button
              size="sm"
              onClick={() => setLoginDialogOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Log in</span>
            </Button>

            {!isHomePage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchDialogOpen(true)}
                className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-green-600"
              >
                <Sparkles className="h-4 w-4" />
                <span>Ask Virima</span>
              </Button>
            )}

            {!isHomePage && (
              <Select
                value={selectedVersion}
                onValueChange={onVersionChange}
                open={versionDropdownOpen}
                onOpenChange={setVersionDropdownOpen}
              >
                <SelectTrigger className="w-28 h-9 bg-white border-2 border-black-premium text-black-premium font-semibold [&>svg]:stroke-[3] [&>svg]:opacity-100 gap-0 pr-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem
                      key={version}
                      value={version}
                      className="text-black-premium"
                    >
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <>
            <aside
              className={`${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 border-r border-slate-200/60 bg-white shadow-xl lg:shadow-none transition-transform duration-300`}
            >
              <ScrollArea className="h-full">
                <div className="py-8 px-6">
                  {/* Module Selector */}
                  <div className="mb-8 pb-6 border-b border-slate-200">
                    <label className="text-xs text-slate-500 mb-2 block">
                      MODULE
                    </label>
                    <Select
                      value={selectedModule}
                      onValueChange={(value) => {
                        onModuleChange(value);
                        setSidebarOpen(false);
                      }}
                    >
                      <SelectTrigger className="w-full h-9 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem
                            key={module.id}
                            value={module.id}
                          >
                            {module.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <nav className="space-y-2">
                    {sections.map((section, index) => {
                      const isActive =
                        selectedSection === section.id;
                      const isExpanded = expandedSections.has(
                        section.id,
                      );

                      return (
                        <div key={section.id} className="space-y-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                toggleSection(section.id)
                              }
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                              aria-label={
                                isExpanded
                                  ? "Collapse section"
                                  : "Expand section"
                              }
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                onSectionChange(section.id);
                                onPageChange(section.pages[0].id);
                                setSidebarOpen(false);
                                setExpandedSections((prev) =>
                                  new Set(prev).add(section.id),
                                );
                              }}
                              className={`flex-1 text-left px-2 py-1.5 rounded transition-colors ${
                                isActive
                                  ? "text-black-premium"
                                  : "text-slate-600 hover:text-black-premium hover:bg-slate-50"
                              }`}
                            >
                              <span>{section.title}</span>
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="ml-5 space-y-1 pl-4">
                              {section.pages.map((page: any) => {
                                const hasSubPages = page.subPages && page.subPages.length > 0;
                                const isPageExpanded = expandedPages.has(page.id);
                                
                                return (
                                  <div key={page.id}>
                                    <div className="flex items-center gap-1">
                                      {hasSubPages && (
                                        <button
                                          onClick={() => togglePage(page.id)}
                                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                                          aria-label={
                                            isPageExpanded
                                              ? "Collapse page"
                                              : "Expand page"
                                          }
                                        >
                                          {isPageExpanded ? (
                                            <ChevronDown className="h-3 w-3 text-slate-500" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3 text-slate-500" />
                                          )}
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          onSectionChange(section.id);
                                          onPageChange(page.id);
                                          setSidebarOpen(false);
                                          if (hasSubPages) {
                                            setExpandedPages((prev) =>
                                              new Set(prev).add(page.id)
                                            );
                                          }
                                        }}
                                        className={`flex-1 text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                          selectedPage === page.id
                                            ? "text-green-600 bg-green-50 font-medium"
                                            : "text-slate-600 hover:text-black-premium hover:bg-slate-50"
                                        } ${!hasSubPages ? 'ml-5' : ''}`}
                                      >
                                        {page.label}
                                      </button>
                                    </div>
                                    
                                    {hasSubPages && isPageExpanded && (
                                      <div className="ml-8 space-y-1 pl-4 mt-1">
                                        {page.subPages.map((subPage: any) => {
                                          const hasNestedSubPages = subPage.subPages && subPage.subPages.length > 0;
                                          const isSubPageExpanded = expandedSubPages.has(subPage.id);
                                          
                                          return (
                                            <div key={subPage.id}>
                                              <div className="flex items-center gap-1">
                                                {hasNestedSubPages && (
                                                  <button
                                                    onClick={() => toggleSubPage(subPage.id)}
                                                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                    aria-label={
                                                      isSubPageExpanded
                                                        ? "Collapse subpage"
                                                        : "Expand subpage"
                                                    }
                                                  >
                                                    {isSubPageExpanded ? (
                                                      <ChevronDown className="h-3 w-3 text-slate-500" />
                                                    ) : (
                                                      <ChevronRight className="h-3 w-3 text-slate-500" />
                                                    )}
                                                  </button>
                                                )}
                                                <button
                                                  onClick={() => {
                                                    onSectionChange(section.id);
                                                    onPageChange(subPage.id);
                                                    setSidebarOpen(false);
                                                    if (hasNestedSubPages) {
                                                      setExpandedSubPages((prev) =>
                                                        new Set(prev).add(subPage.id)
                                                      );
                                                    }
                                                  }}
                                                  className={`flex-1 text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                                    selectedPage === subPage.id
                                                      ? "text-green-600 bg-green-50 font-medium"
                                                      : "text-slate-600 hover:text-black-premium hover:bg-slate-50"
                                                  } ${!hasNestedSubPages ? 'ml-5' : ''}`}
                                                >
                                                  {subPage.label}
                                                </button>
                                              </div>
                                              
                                              {hasNestedSubPages && isSubPageExpanded && (
                                                <div className="ml-8 space-y-1 pl-4 mt-1">
                                                  {subPage.subPages.map((nestedSubPage: any) => (
                                                    <button
                                                      key={nestedSubPage.id}
                                                      onClick={() => {
                                                        onSectionChange(section.id);
                                                        onPageChange(nestedSubPage.id);
                                                        setSidebarOpen(false);
                                                      }}
                                                      className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                                        selectedPage === nestedSubPage.id
                                                          ? "text-green-600 bg-green-50 font-medium"
                                                          : "text-slate-600 hover:text-black-premium hover:bg-slate-50"
                                                      }`}
                                                    >
                                                      {nestedSubPage.label}
                                                    </button>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </ScrollArea>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}

        {/* Main content area with right sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </div>

      {/* AI Search Dialog */}
      <AISearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        currentModule={modules.find(m => m.id === selectedModule)?.label}
        currentPage={sections
          .find(s => s.id === selectedSection)
          ?.pages.find(p => p.id === selectedPage)?.label}
      />

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </div>
  );
}