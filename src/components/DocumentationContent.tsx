import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Clock, ArrowRight, Home } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { TableOfContents } from "./TableOfContents";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { MDXContent } from "./MDXContent";
import { resolveMDXPathFromTOC } from "../utils/tocPathResolver";
import { FeedbackSection } from "./FeedbackSection";
import { ResizableSidebar } from "./ResizableSidebar";
import { 
  buildBreadcrumbPath, 
  type BreadcrumbItem as HierarchicalBreadcrumbItem 
} from "../utils/hierarchicalTocLoader";

interface DocumentationContentProps {
  version: string;
  module: string;
  section: string;
  page: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}

const moduleNames: Record<string, string> = {
  admin: "Admin",
  "my-dashboard": "My Dashboard",
  cmdb: "CMDB",
  "discovery-scan": "Discovery Scan",
  itsm: "ITSM",
  "vulnerability-management": "Vulnerability Management",
  itam: "ITAM",
  "self-service": "Self Service",
  "program-project-management":
    "Program and Project Management",
  "risk-register": "Risk Register",
  reports: "Reports",
};

// Helper function to get section display name
function getSectionDisplayName(section: string): string {
  const sectionNames: Record<string, string> = {
    "getting-started": "Getting Started",
    "application-overview": "Application Overview",
    "online-help": "OnlineHelp",
    "api-integration": "API Integration",
    "compatibility-matrix": "Compatibility Matrix",
    "release-notes": "Release Notes",
    "manuals": "Manuals",
    "admin": "Admin",
    "cmdb": "CMDB",
    "discovery-scan": "Discovery Scan",
    "itsm": "ITSM",
    "vulnerability-management": "Vulnerability Management",
    "itam": "ITAM",
    "self-service": "Self Service",
    "program-project-management": "Program and Project Management",
    "risk-register": "Risk Register",
    "reports": "Reports",
  };
  return sectionNames[section] || section
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper function to get parent topic information
function getParentTopic(section: string, page: string): string | null {
  // Shared Functions pages
  const sharedFunctionsPages = [
    "advanced-search", "attachments", "auto-refresh", "collapse-maximize",
    "comments", "copy-to-cherwell", "copy-to-ivanti", "copy-to-servicenow",
    "delete-remove", "email-preferences", "enable-disable-editing", "export",
    "filter-by", "history", "import", "items-per-page", "mark-as-knowledge",
    "other-asset-info", "outage-calendar", "personalize-columns", "print",
    "process-adm", "process-missing-components", "records-per-page",
    "reload-default-mapping", "re-scan", "re-sync-data", "save",
    "saved-filters", "searching", "show-main-all-properties", "tasks",
    "updates", "version-control"
  ];
  
  // CMDB pages
  const manageCmdbPages = [
    "audits", "change-attributes", "delete", "export", "new",
    "copy-to-ivanti", "copy-to-jira", "copy-to-servicenow",
    "generate-installed-software-report", "process-adm",
    "process-available-patch-report", "process-cloud-hierarchy",
    "process-devops", "process-missing-components", "process-network-connection",
    "process-software-installation", "process-network-virtualization-hierarchy"
  ];
  
  const viewEditCiPages = ["ci-left-panel", "contacts-on-ci"];
  
  const ciDetailsPages = [
    "details", "components", "logon-events", "itsm", "relationships",
    "audits-tab", "sla", "maintenance", "vulnerability", "private-properties",
    "tasks", "history", "attachments"
  ];
  
  const detailsNestedPages = ["manage-ci", "business-service-map"];
  
  // Discovery Scan pages
  const dashboardPages = ["access-dashboard", "dashboard-features", "add-contents", "dashboard-customization"];
  const runAScanPages = ["pre-requisites-for-scan", "access-run-a-scan", "probes-configuration", "client-configuration"];
  const recentScansPages = ["access-recent-scan", "export-scan-report", "refresh", "logs", "tasks", "comments", "attachments"];
  const azureAdPages = ["azure-ad-configuration-and-import", "access-the-azure-ad-user-import-logs", "customize-columns", "delete-azure-ad-user-import-logs"];
  
  if (section === "application-overview" && sharedFunctionsPages.includes(page)) {
    return "Shared Functions";
  }
  
  if (section === "cmdb") {
    if (manageCmdbPages.includes(page)) return "Manage CMDB";
    if (viewEditCiPages.includes(page)) return "View/Edit CI";
    if (ciDetailsPages.includes(page)) return "CI Details";
    if (detailsNestedPages.includes(page)) return "Details";
  }
  
  if (section === "discovery-scan") {
    if (dashboardPages.includes(page)) return "Dashboard";
    if (runAScanPages.includes(page)) return "Run A Scan";
    if (recentScansPages.includes(page)) return "Recent Scans";
    if (azureAdPages.includes(page)) return "Azure AD";
  }
  
  return null;
}

export function DocumentationContent({
  version,
  module,
  section,
  page,
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: DocumentationContentProps) {
  const [rightSidebarWidth, setRightSidebarWidth] = useState(256); // 64 * 4 = 256px (w-64)
  const [mdxPath, setMdxPath] = useState<string | null>(null);
  const [loadingPath, setLoadingPath] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<HierarchicalBreadcrumbItem[]>([]);
  const moduleName = moduleNames[module] || module;

  // Load MDX path and breadcrumbs from TOC when navigation changes
  useEffect(() => {
    let mounted = true;
    
    async function loadPathAndBreadcrumbs() {
      setLoadingPath(true);
      try {
        // Load both the MDX path and breadcrumbs
        const [path, breadcrumbPath] = await Promise.all([
          resolveMDXPathFromTOC({ version, module, section, page }),
          buildBreadcrumbPath(version, module, section, page)
        ]);
        
        if (mounted) {
          setMdxPath(path);
          setBreadcrumbs(breadcrumbPath);
          setLoadingPath(false);
        }
      } catch (error) {
        console.error('Error loading MDX path from TOC:', error);
        if (mounted) {
          setMdxPath(null);
          setBreadcrumbs([]);
          setLoadingPath(false);
        }
      }
    }
    
    loadPathAndBreadcrumbs();
    
    return () => {
      mounted = false;
    };
  }, [version, module, section, page]);

  const getTOCItems = () => {
    const contentKey = `${section}-${page}`;

    // Define TOC items based on page content
    const tocMap: Record<
      string,
      Array<{ id: string; text: string; level: number }>
    > = {
      "online-help-overview": [
        {
          id: "key-capabilities",
          text: "Key Capabilities",
          level: 2,
        },
        {
          id: "getting-started",
          text: "Getting Started",
          level: 2,
        },
        {
          id: "whats-new",
          text: `What's New in Version ${version}`,
          level: 2,
        },
      ],
      "release-notes-latest-release": [
        { id: "new-features", text: "New Features", level: 2 },
        { id: "improvements", text: "Improvements", level: 2 },
        { id: "bug-fixes", text: "Bug Fixes", level: 2 },
      ],
      "getting-started-quick-start": [
        {
          id: "prerequisites",
          text: "Prerequisites",
          level: 2,
        },
        {
          id: "quick-start-steps",
          text: "Quick Start Steps",
          level: 2,
        },
        { id: "next-steps", text: "Next Steps", level: 2 },
      ],
      "api-integration-api-overview": [
        {
          id: "api-endpoints",
          text: "API Endpoints",
          level: 2,
        },
        {
          id: "authentication",
          text: "Authentication",
          level: 2,
        },
        {
          id: "response-format",
          text: "Response Format",
          level: 2,
        },
      ],
      "compatibility-matrix-system-requirements": [
        {
          id: "browser-compatibility",
          text: "Browser Compatibility",
          level: 2,
        },
        {
          id: "user-permissions",
          text: "User Permissions",
          level: 2,
        },
        {
          id: "integration-dependencies",
          text: "Integration Dependencies",
          level: 2,
        },
      ],
    };

    return (
      tocMap[contentKey] || [
        { id: "overview", text: "Overview", level: 2 },
        { id: "key-topics", text: "Key Topics", level: 2 },
        {
          id: "example-configuration",
          text: "Example Configuration",
          level: 2,
        },
        {
          id: "additional-resources",
          text: "Additional Resources",
          level: 2,
        },
      ]
    );
  };

  const renderContent = () => {
    const contentKey = `${section}-${page}`;
    
    console.log('DocumentationContent - Rendering:', { version, module, section, page });
    console.log('DocumentationContent - MDX Path resolved from TOC:', mdxPath);
    
    // Show loading state while resolving path
    if (loadingPath) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Loading...</div>
        </div>
      );
    }
    
    // If we have a valid MDX path from TOC, load it
    if (mdxPath) {
      return (
        <MDXContent
          filePath={mdxPath}
          version={version}
          module={module}
          moduleName={moduleName}
          section={section}
          sectionName={getSectionDisplayName(section)}
          page={page}
          pageName={page ? page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined}
          onHomeClick={onHomeClick}
          onVersionClick={onVersionClick}
          onModuleClick={onModuleClick}
        />
      );
    }

    // No MDX file found - show error
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-slate-700 mb-4">Content not available</div>
        <div className="text-sm text-slate-500">
          MDX file not found for this page. Please check the TOC configuration.
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full overflow-x-hidden">
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 max-w-[1200px] mx-auto">
        {renderContent()}
      </div>
      <ResizableSidebar
        initialWidth={rightSidebarWidth}
        onResize={setRightSidebarWidth}
        minWidth={200}
        maxWidth={500}
        side="right"
      >
        <aside className="h-full w-full px-6 py-12 lg:py-16 border-l border-slate-200/60 overflow-y-auto overflow-x-hidden">
        <div className="-mt-12 mb-6 pb-6 border-b border-slate-200/60">
          <div className="flex items-start gap-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Release Date</div>
              <div className="text-sm text-slate-700 text-[14px]">November 1, 2025</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Last Updated</div>
              <div className="text-sm text-slate-700">November 10, 2025</div>
            </div>
          </div>
        </div>
        <TableOfContents autoExtract={true} />
      </aside>
      </ResizableSidebar>
    </div>
  );
}

function OnlineHelpOverview({
  version,
  module,
  moduleName,
  section,
  page = "online-help",
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  version: string;
  module: string;
  moduleName: string;
  section: string;
  page?: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  const sectionDisplayName = getSectionDisplayName(section);
  
  const getModuleDescription = () => {
    switch (module) {
      case "admin":
        return "Admin provides comprehensive administrative functions for organizational setup, user management, discovery configuration, SACM settings, integrations, and system-wide configurations.";
      case "my-dashboard":
        return "My Dashboard provides a centralized, customizable view of your IT environment with real-time monitoring, widgets, and analytics.";
      case "cmdb":
        return "The Configuration Management Database (CMDB) tracks and manages all IT assets, their attributes, and relationships across your infrastructure.";
      case "discovery-scan":
        return "Discovery Scan automatically discovers and scans IT infrastructure, applications, and cloud resources across your network.";
      case "itsm":
        return "IT Service Management (ITSM) provides comprehensive incident, problem, change, and service request management capabilities.";
      case "vulnerability-management":
        return "Vulnerability Management identifies, assesses, prioritizes, and helps remediate security vulnerabilities across your IT infrastructure.";
      case "itam":
        return "IT Asset Management (ITAM) provides complete lifecycle management of hardware and software assets from procurement to retirement.";
      case "self-service":
        return "Self Service Portal empowers users with self-service capabilities for requests, catalog items, knowledge base access, and ticket tracking.";
      case "program-project-management":
        return "Program and Project Management helps you plan, track, and manage IT programs and projects with resource allocation and portfolio management.";
      case "risk-register":
        return "Risk Register tracks and manages IT risks with comprehensive assessment, mitigation planning, and compliance monitoring capabilities.";
      case "reports":
        return "Reports provides comprehensive reporting and analytics with customizable dashboards, scheduled reports, and data visualization.";
      default:
        return `${moduleName} module provides comprehensive capabilities for managing your IT environment.`;
    }
  };

  return (
    <article className="prose prose-slate max-w-none">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isHome = crumb.type === 'home';
              
              return (
                <div key={`${crumb.type}-${index}`} className="contents">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-slate-900 dark:text-white">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => {
                          if (crumb.type === 'home' && onHomeClick) {
                            onHomeClick();
                          } else if (crumb.type === 'version' && onVersionClick) {
                            onVersionClick();
                          } else if (crumb.type === 'module' && onModuleClick) {
                            onModuleClick();
                          }
                        }}
                        className="text-slate-700 hover:text-emerald-600 cursor-pointer"
                      >
                        {isHome ? <Home className="w-4 h-4" /> : crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <span className="text-xs text-slate-500">
          Last updated: November 10, 2025
        </span>
      </div>

      <h1 className="mb-4">{moduleName} Overview</h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        {getModuleDescription()}
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 not-prose">
        <p className="text-sm text-green-800">
          <strong>Version Notice:</strong> This documentation is
          for {moduleName} in Virima version{" "}
          <strong>{version}</strong>. Make sure you're viewing
          the correct version for your deployment.
        </p>
      </div>

      <h2 id="key-capabilities" className="mt-12 mb-6">
        Key Capabilities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-12">
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all">
          <h3 className="mb-3 text-slate-900 dark:text-white">
            Comprehensive Management
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Complete management capabilities with intuitive
            interfaces and powerful automation features.
          </p>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all">
          <h3 className="mb-3 text-slate-900 dark:text-white">
            Real-time Monitoring
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Monitor activities and changes in real-time with
            instant notifications and alerts.
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all">
          <h3 className="mb-3 text-slate-900 dark:text-white">
            Advanced Reporting
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Generate detailed reports and analytics with
            customizable dashboards and visualizations.
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all">
          <h3 className="mb-3 text-slate-900 dark:text-white">
            Integration Ready
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Seamlessly integrate with third-party tools and
            platforms via REST APIs and webhooks.
          </p>
        </div>
      </div>

      {module === "my-dashboard" && (
        <>
          <h2 id="about-virima-modules" className="mt-12 mb-6">
            About the Virima Modules and Functions
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The All Modules window contains quick access to selected functions. From this main window, all functions are reached either through:
          </p>
          <ul className="mb-6">
            <li>The <strong>Navigation pane</strong> (down the left side of the window)</li>
            <li>The <strong>Admin menu</strong> (in the upper right corner of the window)</li>
          </ul>
          
          <div className="my-8 not-prose">
            <img 
              src="/assets/home_cover_page.png" 
              alt="Virima Application Overview"
              className="w-full border border-slate-200 rounded-lg shadow-md"
            />
          </div>

          <h3 className="mt-8 mb-4">Home Page/All Modules Window</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            The home page provides quick access to the most frequently used modules, such as favorite functions and dashboards.
          </p>
          <ul className="mb-6">
            <li><strong>Adding a Favorite:</strong> Locate an icon for the applicable section inside the box with the text, "Drag here to add."</li>
            <li><strong>Deleting a Favorite:</strong> Locate the icon in the Favorites section. Then, click and drag the icon above the Favorite section until the text "Drag here to delete" inside a red box displays.</li>
          </ul>

          <h3 className="mt-8 mb-4">Left Navigation Pane</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            The left navigation pane includes the following:
          </p>
          <ul className="mb-6">
            <li><strong>My Dashboard</strong> displays data content information with a customization option.</li>
            <li><strong>Discovery Scan</strong> manages scanning activities (running, scheduling, etc.) and importing data (such as from AWS and Azure).</li>
            <li><strong>ITAM</strong> (asset management functions) and <strong>ITSM</strong> (service management functions) availability is based upon the subscription.</li>
          </ul>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 not-prose">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The menu heading displayed - either ITAM or ITSM - is based upon the subscription.
            </p>
          </div>

          <ul className="mb-6">
            <li><strong>Vulnerability Management</strong> identifies, evaluates, and reports security vulnerabilities in CIs present inside the CMDB.</li>
            <li><strong>Self Service</strong> creates catalog items and shows incidents and requests for the current user.</li>
            <li><strong>Project and Program Management</strong> defines project aspects and managing related projects.</li>
            <li><strong>Risk Register</strong> provides a tool for managing risk and compliance.</li>
            <li><strong>Reports</strong> has both canned and custom ad hoc reports.</li>
            <li><strong>MSP</strong> displays a list of clients and includes a Dashboard, Reports, My Incidents, and Administrative functions (Client, Users, Mailbox Monitoring Configuration, and Email Templates). It also provides access to the Virima application.</li>
          </ul>

          <h3 className="mt-8 mb-4">Admin Window</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            The administrative functions include the following:
          </p>
          <ul className="mb-8">
            <li>Configuration displays setting details, such as departments, cost centers, locations, designations, operational hours, and holidays.</li>
          </ul>
        </>
      )}

      <h2 id="getting-started" className="mt-12 mb-6">
        Getting Started
      </h2>
      <p className="text-slate-600 leading-relaxed mb-4">
        To start using {moduleName}, navigate through the
        documentation sections:
      </p>
      <div className="space-y-3 not-prose mb-12">
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>Online Help</strong> — Detailed guides and
              how-to articles
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>Release Notes</strong> — Latest updates
              and improvements
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>Getting Started</strong> — Quick start
              guides for new users
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>Manuals</strong> — Complete reference
              documentation
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>API Integration</strong> — Developer
              guides and API references
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-slate-900 dark:text-white">
              <strong>Compatibility Matrix</strong> — System
              requirements and compatibility
            </p>
          </div>
        </div>
      </div>

      <h2 id="whats-new" className="mt-12 mb-6">
        What's New in Version {version}
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Version {version} includes significant improvements in
        performance, new capabilities, enhanced visualization
        features, and expanded integration options for{" "}
        {moduleName}.
      </p>

      <FeedbackSection />
    </article>
  );
}

function LatestRelease({
  version,
  module,
  moduleName,
  section,
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  version: string;
  module: string;
  moduleName: string;
  section: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  return (
    <article className="prose prose-slate max-w-none">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onHomeClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onVersionClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onModuleClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {moduleName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 dark:text-white">
                {section
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1),
                  )
                  .join(" ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1">
            Latest
          </Badge>
          <span className="text-xs text-slate-500">
            Last updated: November 10, 2025
          </span>
        </div>
      </div>

      <h1 className="mb-4">{moduleName} - Release Notes</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-12">
        Version {version} brings enhanced performance, new
        features, and important bug fixes to {moduleName}.
      </p>

      <h2 id="new-features" className="mt-12 mb-6">
        New Features
      </h2>

      <div className="space-y-6 not-prose mb-12">
        <div className="border-l-4 border-emerald-500 pl-6 py-2">
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="outline" className="text-xs">
              Feature
            </Badge>
          </div>
          <h3 className="mb-2 text-slate-900">
            Enhanced User Interface
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Redesigned interface with improved navigation,
            better accessibility, and modern design patterns.
          </p>
        </div>

        <div className="border-l-4 border-emerald-500 pl-6 py-2">
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="outline" className="text-xs">
              Feature
            </Badge>
          </div>
          <h3 className="mb-2 text-slate-900">
            Advanced Analytics
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            New analytics dashboard with real-time insights,
            predictive analytics, and customizable widgets.
          </p>
        </div>

        <div className="border-l-4 border-emerald-500 pl-6 py-2">
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="outline" className="text-xs">
              Feature
            </Badge>
          </div>
          <h3 className="mb-2 text-slate-900">
            Automation Capabilities
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Enhanced automation with workflow builder, scheduled
            tasks, and intelligent recommendations.
          </p>
        </div>
      </div>

      <h2 id="improvements" className="mt-12 mb-6">
        Improvements
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>
          Performance optimization for large datasets (50%
          faster load times)
        </li>
        <li>
          Enhanced search with fuzzy matching and advanced
          filters
        </li>
        <li>
          Improved export capabilities with multiple format
          support
        </li>
        <li>
          Better mobile responsiveness and touch interface
          support
        </li>
        <li>Enhanced security with MFA and SSO integration</li>
      </ul>

      <h2 id="bug-fixes" className="mt-12 mb-6">
        Bug Fixes
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>
          Fixed issue with data synchronization in real-time
          updates
        </li>
        <li>Resolved memory leak in long-running operations</li>
        <li>
          Fixed UI rendering issues in specific browser
          configurations
        </li>
        <li>
          Corrected timezone handling in scheduled operations
        </li>
        <li>
          Fixed export formatting issues with special characters
        </li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12 not-prose">
        <p className="text-sm text-blue-900">
          <strong>Upgrade Notice:</strong> This version includes
          database schema updates for {moduleName}. Please
          review the upgrade guide and backup your data before
          proceeding.
        </p>
      </div>

      <FeedbackSection />
    </article>
  );
}

function QuickStart({
  version,
  module,
  moduleName,
  section,
  page = "quick-start",
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  version: string;
  module: string;
  moduleName: string;
  section: string;
  page?: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  const sectionDisplayName = getSectionDisplayName(section);
  
  return (
    <article className="prose prose-slate max-w-none">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onHomeClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onVersionClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onModuleClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {moduleName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {sectionDisplayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 dark:text-white">
                Quick Start
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4">{moduleName} - Quick Start</h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-12">
        Get started with {moduleName} in just a few minutes.
        This guide covers the essential steps to configure and
        start using the module.
      </p>

      <h2 id="prerequisites" className="mt-12 mb-6">
        Prerequisites
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>Virima {version} installed and configured</li>
        <li>Appropriate user permissions and roles assigned</li>
        <li>Network access to required resources</li>
        <li>Browser meets compatibility requirements</li>
      </ul>

      <h2 id="quick-start-steps" className="mt-12 mb-6">
        Quick Start Steps
      </h2>

      <div className="space-y-8 not-prose mb-12">
        <div className="flex gap-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shrink-0">
            1
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-slate-900 dark:text-white">
              Access {moduleName}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Navigate to the {moduleName} module from the main
              Virima dashboard. You can find it in the left
              navigation menu or quick access panel.
            </p>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="flex gap-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shrink-0">
            2
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-slate-900 dark:text-white">
              Initial Configuration
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Complete the initial configuration wizard. This
              includes setting up basic preferences,
              notification settings, and data sources.
            </p>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="flex gap-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shrink-0">
            3
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-slate-900 dark:text-white">
              Explore Dashboard
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Familiarize yourself with the {moduleName}{" "}
              dashboard. Customize widgets, arrange panels, and
              configure your preferred view.
            </p>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="flex gap-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shrink-0">
            4
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-slate-900 dark:text-white">
              Start Using Features
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Begin using the core features of {moduleName}.
              Refer to the User Guide for detailed information
              on specific capabilities.
            </p>
          </div>
        </div>
      </div>

      <h2 id="next-steps" className="mt-12 mb-6">
        Next Steps
      </h2>
      <p className="text-slate-600 leading-relaxed mb-4">
        After completing the quick start, explore these
        resources:
      </p>
      <ul className="space-y-2 text-slate-600">
        <li>
          Review the User Manual for comprehensive feature
          documentation
        </li>
        <li>
          Configure advanced settings and automation rules
        </li>
        <li>
          Set up integrations with other modules and external
          systems
        </li>
        <li>Create custom reports and dashboards</li>
        <li>Review security and compliance best practices</li>
      </ul>

      <FeedbackSection />
    </article>
  );
}

function APIOverview({
  version,
  module,
  moduleName,
  section,
  page = "api-overview",
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  version: string;
  module: string;
  moduleName: string;
  section: string;
  page?: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  const sectionDisplayName = getSectionDisplayName(section);
  
  return (
    <article className="prose prose-slate max-w-none">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onHomeClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onVersionClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onModuleClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {moduleName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {sectionDisplayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 dark:text-white">
                API Overview
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4">{moduleName} - API Integration</h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-12">
        The {moduleName} API provides comprehensive REST
        endpoints for integration with third-party systems,
        automation workflows, and custom applications.
      </p>

      <h2 id="api-endpoints" className="mt-12 mb-6">
        API Endpoints
      </h2>
      <p className="text-slate-600 leading-relaxed mb-6">
        All API endpoints follow RESTful conventions with JSON
        request/response format.
      </p>

      <div className="not-prose space-y-3 mb-12">
        <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <code className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded">
                GET
              </code>
              <span className="text-sm font-mono text-slate-700">
                /api/v1/{module}
              </span>
            </div>
            <span className="text-sm text-slate-500">
              List all items
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <code className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded">
                POST
              </code>
              <span className="text-sm font-mono text-slate-700">
                /api/v1/{module}
              </span>
            </div>
            <span className="text-sm text-slate-500">
              Create new item
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <code className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded">
                GET
              </code>
              <span className="text-sm font-mono text-slate-700">
                /api/v1/{module}/:id
              </span>
            </div>
            <span className="text-sm text-slate-500">
              Get item details
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <code className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded">
                PUT
              </code>
              <span className="text-sm font-mono text-slate-700">
                /api/v1/{module}/:id
              </span>
            </div>
            <span className="text-sm text-slate-500">
              Update item
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <code className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded">
                DELETE
              </code>
              <span className="text-sm font-mono text-slate-700">
                /api/v1/{module}/:id
              </span>
            </div>
            <span className="text-sm text-slate-500">
              Delete item
            </span>
          </div>
        </div>
      </div>

      <h2 id="authentication" className="mt-12 mb-6">
        Authentication
      </h2>
      <p className="text-slate-600 leading-relaxed mb-6">
        All API requests require authentication using API keys
        or OAuth 2.0 tokens.
      </p>

      <div className="bg-slate-900 text-slate-100 p-6 rounded-lg text-sm font-mono not-prose mb-12 overflow-x-auto">
        <div className="text-slate-400 mb-2">
          # Example API request
        </div>
        <div>
          curl -H "Authorization: Bearer YOUR_API_KEY" \
        </div>
        <div className="ml-4">
          -H "Content-Type: application/json" \
        </div>
        <div className="ml-4">
          https://your-server/api/v1/{module}
        </div>
      </div>

      <h2 id="response-format" className="mt-12 mb-6">
        Response Format
      </h2>
      <p className="text-slate-600 leading-relaxed mb-6">
        All API responses follow a standard JSON format with
        consistent status codes.
      </p>

      <div className="bg-slate-900 text-slate-100 p-6 rounded-lg text-sm font-mono not-prose mb-12 overflow-x-auto">
        <pre>{`{
  "status": "success",
  "data": {
    "id": "item-12345",
    "module": "${module}",
    "created_at": "2025-11-10T10:30:00Z",
    "updated_at": "2025-11-10T14:22:15Z"
  },
  "meta": {
    "version": "${version}",
    "timestamp": "2025-11-10T14:22:15Z"
  }
}`}</pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 not-prose">
        <p className="text-sm text-blue-900">
          <strong>Rate Limiting:</strong> API requests are
          limited to 1000 requests per hour per API key. Contact
          support for higher limits or enterprise plans.
        </p>
      </div>

      <FeedbackSection />
    </article>
  );
}

function SystemRequirements({
  version,
  module,
  moduleName,
  section,
  page = "system-requirements",
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  version: string;
  module: string;
  moduleName: string;
  section: string;
  page?: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  const sectionDisplayName = getSectionDisplayName(section);
  
  return (
    <article className="prose prose-slate max-w-none">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onHomeClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onVersionClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onModuleClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {moduleName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {sectionDisplayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 dark:text-white">
                System Requirements
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4">
        {moduleName} - System Requirements
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-12">
        Review the system requirements and compatibility
        information for {moduleName} module.
      </p>

      <h2 id="browser-compatibility" className="mt-12 mb-6">
        Browser Compatibility
      </h2>

      <div className="not-prose mb-12 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-slate-900">
                Browser
              </TableHead>
              <TableHead className="text-slate-900">
                Minimum Version
              </TableHead>
              <TableHead className="text-slate-900">
                Recommended
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Google Chrome</TableCell>
              <TableCell className="text-slate-600">
                100+
              </TableCell>
              <TableCell className="text-slate-600">
                Latest version
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mozilla Firefox</TableCell>
              <TableCell className="text-slate-600">
                100+
              </TableCell>
              <TableCell className="text-slate-600">
                Latest version
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Microsoft Edge</TableCell>
              <TableCell className="text-slate-600">
                100+
              </TableCell>
              <TableCell className="text-slate-600">
                Latest version
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Safari</TableCell>
              <TableCell className="text-slate-600">
                15+
              </TableCell>
              <TableCell className="text-slate-600">
                Latest version
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h2 id="user-permissions" className="mt-12 mb-6">
        User Permissions
      </h2>

      <div className="not-prose mb-12 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-slate-900">
                Role
              </TableHead>
              <TableHead className="text-slate-900">
                Access Level
              </TableHead>
              <TableHead className="text-slate-900">
                Capabilities
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Administrator</TableCell>
              <TableCell className="text-slate-600">
                Full Access
              </TableCell>
              <TableCell className="text-slate-600">
                All features and configuration
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Power User</TableCell>
              <TableCell className="text-slate-600">
                Advanced
              </TableCell>
              <TableCell className="text-slate-600">
                Advanced features, limited config
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Standard User</TableCell>
              <TableCell className="text-slate-600">
                Standard
              </TableCell>
              <TableCell className="text-slate-600">
                Basic features and reporting
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Read Only</TableCell>
              <TableCell className="text-slate-600">
                View Only
              </TableCell>
              <TableCell className="text-slate-600">
                View data and reports
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h2 id="integration-dependencies" className="mt-12 mb-6">
        Integration Dependencies
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>Virima Core Platform {version} or later</li>
        <li>
          Database connectivity (PostgreSQL, MySQL, or SQL
          Server)
        </li>
        <li>
          Network access to required endpoints and services
        </li>
        <li>Appropriate firewall rules configured</li>
        <li>SSL/TLS certificates for secure communications</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-12 not-prose">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> Additional requirements may
          apply based on your specific deployment configuration
          and integration requirements. Contact Virima support
          for detailed sizing and planning assistance.
        </p>
      </div>

      <FeedbackSection />
    </article>
  );
}

function DefaultContent({
  section,
  page,
  version,
  module,
  moduleName,
  onHomeClick,
  onModuleClick,
  onVersionClick,
}: {
  section: string;
  page: string;
  version: string;
  module: string;
  moduleName: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
}) {
  /**
   * BREADCRUMB HIERARCHY SYSTEM
   * 
   * This system ensures breadcrumbs show the complete navigation path including all parent levels.
   * Each array contains child pages under a parent topic. Parent pages themselves are also included
   * in their respective arrays using the OR condition (e.g., `page === "parent-page-id"`).
   * 
   * Structure by module:
   * - My Dashboard > Application Overview: Shared Functions > [child pages]
   * - My Dashboard > My Dashboard: Dashboards > [child pages] > My Dashboard > [nested child pages]
   * - CMDB: Manage CMDB / View and Edit a CI / CI Details and Tabs > [child pages] > Details > [nested child pages]
   * - Discovery Scan: Dashboard / Run a Scan / Recent Scans / Azure AD User Import Logs > [child pages with nested hierarchies]
   */
  
  // My Dashboard - Application Overview hierarchy
  const sharedFunctionsPages = [
    "advanced-search", "attachments", "auto-refresh", "collapse-maximize",
    "comments", "copy-to-cherwell", "copy-to-ivanti", "copy-to-servicenow",
    "delete-remove", "email-preferences", "enable-disable-editing", "export",
    "filter-by", "history", "import", "items-per-page", "mark-as-knowledge",
    "other-asset-info", "outage-calendar", "personalize-columns", "print",
    "process-adm", "process-missing-components", "records-per-page",
    "reload-default-mapping", "re-scan", "re-sync-data", "save",
    "saved-filters", "searching", "show-main-all-properties", "tasks",
    "updates", "version-control"
  ];
  
  // My Dashboard - My Dashboard section hierarchy
  const dashboardsPages = ["contents", "customization", "report-actions", "my-dashboard-section"];
  const myDashboardSectionPages = ["contents"];
  
  // CMDB breadcrumb hierarchy
  const manageCmdbPages = [
    "audits", "change-attributes", "delete", "export", "new",
    "copy-to-ivanti", "copy-to-jira", "copy-to-servicenow",
    "generate-installed-software-report", "process-adm",
    "process-available-patch-report", "process-cloud-hierarchy",
    "process-devops", "process-missing-components", "process-network-connection",
    "process-software-installation", "process-network-virtualization-hierarchy"
  ];
  
  const viewEditCiPages = ["ci-left-panel", "contacts-on-ci"];
  
  const ciDetailsPages = [
    "details", "components", "logon-events", "itsm", "relationships",
    "audits-tab", "sla", "maintenance", "vulnerability", "private-properties",
    "tasks", "history", "attachments"
  ];
  
  const detailsNestedPages = ["manage-ci", "business-service-map"];
  
  // Discovery Scan breadcrumb hierarchy
  const dashboardPages = ["access-dashboard", "dashboard-features", "add-contents", "dashboard-customization"];
  
  const runAScanPages = ["pre-requisites-for-scan", "access-run-a-scan", "initiate-and-configure-discovery-scan", "configure-discovery-scan", "probes-configuration", "client-configuration"];
  const initiateConfigurePages = ["access-run-a-scan", "configure-discovery-scan", "probes-configuration", "client-configuration"];
  const configureDiscoveryPages = ["probes-configuration", "client-configuration"];
  
  const recentScansPages = ["access-recent-scan", "view-recent-scan", "details", "export-scan-report", "refresh", "logs", "tasks", "comments", "attachments"];
  const viewRecentScanPages = ["details", "export-scan-report", "refresh", "logs", "tasks", "comments", "attachments"];
  const recentScanDetailsPages = ["export-scan-report", "refresh", "logs", "tasks", "comments", "attachments"];
  
  const azureAdPages = ["azure-ad-configuration-and-import", "access-the-azure-ad-user-import-logs", "view-import-log-details", "customize-columns", "delete-azure-ad-user-import-logs"];
  const viewImportLogPages = ["customize-columns", "delete-azure-ad-user-import-logs"];
  
  // ITSM breadcrumb hierarchy
  const configurationManagementPages = ["dashboard", "cmdb", "access-cmdb", "manage-cmdb", "view-and-edit-ci", "ci-left-panel", "contacts-on-ci", "ci-details-and-tabs", "details", "components", "logon-events", "itsm-tab", "relationships", "audits", "sla", "maintenance", "vulnerability", "private-properties", "tasks", "history", "attachments", "comments", "other-functions-and-page-elements", "sync-logs", "tags"];
  
  const itsmCmdbPages = ["access-cmdb", "manage-cmdb", "view-and-edit-ci", "ci-left-panel", "contacts-on-ci", "ci-details-and-tabs", "details", "components", "logon-events", "itsm-tab", "relationships", "audits", "sla", "maintenance", "vulnerability", "private-properties", "tasks", "history", "attachments", "comments", "other-functions-and-page-elements", "sync-logs", "tags"];
  
  const itsmViewEditCiPages = ["ci-left-panel", "contacts-on-ci", "ci-details-and-tabs", "details", "components", "logon-events", "itsm-tab", "relationships", "audits", "sla", "maintenance", "vulnerability", "private-properties", "tasks", "history", "attachments", "comments", "other-functions-and-page-elements"];
  
  const itsmCiDetailsPages = ["details", "components", "logon-events", "itsm-tab", "relationships", "audits", "sla", "maintenance", "vulnerability", "private-properties", "tasks", "history", "attachments", "comments"];
  
  // Admin breadcrumb hierarchy
  const organizationalDetailsPages = ["cost-center", "departments", "members", "designations", "holidays", "locations", "operational-hours", "organizational-details-nested"];
  const departmentsPages = ["members", "designations", "holidays", "locations", "operational-hours", "organizational-details-nested"];
  
  const discoveryPages = ["application-map", "client", "discovery-agents", "remote-install", "restart-client", "correlation", "credentials", "details", "backup-file", "flush-credential", "download-application", "import-templates", "ignore-adm-process", "ignore-process", "major-software", "monitoring-profile", "patterns", "port-configuration", "probe-workflow", "probes", "scan-configuration", "sensors"];
  const clientPages = ["discovery-agents", "remote-install", "restart-client"];
  const credentialsPages = ["details", "backup-file", "flush-credential"];
  
  const sacmPages = ["blueprints", "bsm-views", "cmdb-graphical-workflow", "cmdb-properties", "confidence-configuration", "duplicates-remediation", "export-ci-template", "ip-connection-score-threshold", "process-tags", "property-group", "relationship-types", "software-license-validity-check", "software-usage-report"];
  
  const usersPages = ["ad-import-and-authentication", "azure-ad-configuration", "saml-configuration", "time-track-reports", "user-groups", "user-roles", "users-list"];
  
  const managementFunctionsPages = ["change-management", "contract-management", "event-management", "hardware-asset-management", "incident-management", "knowledge-management", "problem-management", "procurement", "procurement-properties", "about-procurement", "procurement-property-group", "project-management", "release-management", "request-management", "vendor-management"];
  const procurementPages = ["procurement-properties", "about-procurement", "procurement-property-group"];
  
  const integrationsPages = ["cherwell-credential", "mappings", "infoblox-configuration", "ivanti-credentials", "ivanti-mappings", "jira-credentials", "jira-mappings", "servicenow-credentials", "servicenow-mappings"];
  const cherwellCredentialPages = ["mappings"];
  const ivantiCredentialsPages = ["ivanti-mappings"];
  const jiraCredentialsPages = ["jira-mappings"];
  const servicenowCredentialsPages = ["servicenow-mappings"];
  
  const othersPages = ["announcements", "business-rules", "custom-reports", "documentation-and-tester", "inbox-configuration-itsm", "kpis", "reports", "role-access", "service-level-agreements", "smtp-configuration", "graphical-workflows"];
  
  const isUnderSharedFunctions = section === "application-overview" && (sharedFunctionsPages.includes(page) || page === "shared-functions");
  const isUnderDashboards = section === "my-dashboard" && (dashboardsPages.includes(page) || page === "dashboards");
  const isUnderMyDashboardSection = section === "my-dashboard" && (myDashboardSectionPages.includes(page) && page !== "contents") || page === "my-dashboard-section";
  
  const isUnderManageCmdb = section === "cmdb" && (manageCmdbPages.includes(page) || page === "manage-cmdb");
  const isUnderViewEditCi = section === "cmdb" && (viewEditCiPages.includes(page) || page === "view-and-edit-ci");
  const isUnderCiDetails = section === "cmdb" && (ciDetailsPages.includes(page) || page === "ci-details-and-tabs");
  const isUnderDetailsNested = section === "cmdb" && (detailsNestedPages.includes(page) || page === "details");
  
  const isUnderDashboard = section === "discovery-scan" && (dashboardPages.includes(page) || page === "dashboard");
  const isUnderRunAScan = section === "discovery-scan" && runAScanPages.includes(page);
  const isUnderInitiateConfigure = section === "discovery-scan" && (initiateConfigurePages.includes(page) || page === "initiate-and-configure-discovery-scan");
  const isUnderConfigureDiscovery = section === "discovery-scan" && (configureDiscoveryPages.includes(page) || page === "configure-discovery-scan");
  const isUnderRecentScans = section === "discovery-scan" && (recentScansPages.includes(page) || page === "recent-scans");
  const isUnderViewRecentScan = section === "discovery-scan" && (viewRecentScanPages.includes(page) || page === "view-recent-scan");
  const isUnderRecentScanDetails = section === "discovery-scan" && (recentScanDetailsPages.includes(page) || page === "details");
  const isUnderAzureAd = section === "discovery-scan" && (azureAdPages.includes(page) || page === "azure-ad-user-import-logs");
  const isUnderViewImportLog = section === "discovery-scan" && (viewImportLogPages.includes(page) || page === "view-import-log-details");
  
  // ITSM hierarchy checks
  const isUnderConfigurationManagement = section === "itsm" && (configurationManagementPages.includes(page) || page === "configuration-management");
  const isUnderItsmCmdb = section === "itsm" && (itsmCmdbPages.includes(page) || page === "cmdb");
  const isUnderItsmViewEditCi = section === "itsm" && (itsmViewEditCiPages.includes(page) || page === "view-and-edit-ci");
  const isUnderItsmCiDetails = section === "itsm" && (itsmCiDetailsPages.includes(page) || page === "ci-details-and-tabs");
  
  // Admin hierarchy checks
  const isUnderOrganizationalDetails = section === "admin" && (organizationalDetailsPages.includes(page) || page === "organizational-details");
  const isUnderDepartments = section === "admin" && (departmentsPages.includes(page) || page === "departments");
  
  const isUnderDiscovery = section === "admin" && (discoveryPages.includes(page) || page === "discovery");
  const isUnderClient = section === "admin" && (clientPages.includes(page) || page === "client");
  const isUnderCredentials = section === "admin" && (credentialsPages.includes(page) || page === "credentials");
  
  const isUnderSacm = section === "admin" && (sacmPages.includes(page) || page === "sacm");
  const isUnderUsers = section === "admin" && (usersPages.includes(page) || page === "users");
  
  const isUnderManagementFunctions = section === "admin" && (managementFunctionsPages.includes(page) || page === "management-functions");
  const isUnderProcurement = section === "admin" && (procurementPages.includes(page) || page === "procurement");
  
  const isUnderIntegrations = section === "admin" && (integrationsPages.includes(page) || page === "integrations");
  const isUnderCherwellCredential = section === "admin" && (cherwellCredentialPages.includes(page) || page === "cherwell-credential");
  const isUnderIvantiCredentials = section === "admin" && (ivantiCredentialsPages.includes(page) || page === "ivanti-credentials");
  const isUnderJiraCredentials = section === "admin" && (jiraCredentialsPages.includes(page) || page === "jira-credentials");
  const isUnderServicenowCredentials = section === "admin" && (servicenowCredentialsPages.includes(page) || page === "servicenow-credentials");
  
  const isUnderOthers = section === "admin" && (othersPages.includes(page) || page === "others");
  
  // Get section display name
  const sectionDisplayName = getSectionDisplayName(section);
  
  // Determine parent topic to show after section
  // Important: Only set parentTopic if we're NOT on the parent page itself
  let parentTopic: string | null = null;
  if (isUnderSharedFunctions && page !== "shared-functions") parentTopic = "Shared Functions";
  else if (isUnderDashboards && page !== "dashboards") parentTopic = "Dashboards";
  else if (isUnderManageCmdb && page !== "manage-cmdb") parentTopic = "Manage CMDB";
  else if (isUnderViewEditCi && page !== "view-and-edit-ci") parentTopic = "View and Edit a CI";
  else if (isUnderCiDetails || isUnderDetailsNested) parentTopic = "CI Details and Tabs";
  else if (isUnderDashboard && page !== "dashboard") parentTopic = "Dashboard";
  else if (isUnderRunAScan && page !== "run-a-scan") parentTopic = "Run a Scan";
  else if (isUnderRecentScans && page !== "recent-scans") parentTopic = "Recent Scans";
  else if (isUnderAzureAd && page !== "azure-ad-user-import-logs") parentTopic = "Azure AD User Import Logs";
  else if (isUnderConfigurationManagement && page !== "configuration-management") parentTopic = "Configuration Management";
  else if (isUnderOrganizationalDetails && page !== "organizational-details") parentTopic = "Organizational Details";
  else if (isUnderDiscovery && page !== "discovery") parentTopic = "Discovery";
  else if (isUnderSacm && page !== "sacm") parentTopic = "SACM";
  else if (isUnderUsers && page !== "users") parentTopic = "Users";
  else if (isUnderManagementFunctions && page !== "management-functions") parentTopic = "Management Functions";
  else if (isUnderIntegrations && page !== "integrations") parentTopic = "Integrations";
  else if (isUnderOthers && page !== "others") parentTopic = "Others";

  return (
    <article className="prose prose-slate max-w-none -mt-9">
      <div className="flex flex-col gap-3 mb-8 not-prose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onHomeClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onVersionClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onModuleClick}
                className="text-slate-700 hover:text-emerald-600 cursor-pointer"
              >
                {moduleName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-slate-700 hover:text-emerald-600 cursor-pointer">
                {sectionDisplayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {parentTopic && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    {parentTopic}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            {/* My Dashboard nested hierarchy */}
            {isUnderMyDashboardSection && page !== "my-dashboard-section" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    My Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* CMDB nested hierarchy */}
            {isUnderDetailsNested && page !== "details" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Discovery Scan - Run a Scan hierarchy */}
            {isUnderInitiateConfigure && page !== "initiate-and-configure-discovery-scan" && !isUnderConfigureDiscovery && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Initiate and Configure Discovery Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {isUnderConfigureDiscovery && page !== "configure-discovery-scan" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Initiate and Configure Discovery Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Configure Discovery Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {page === "configure-discovery-scan" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Initiate and Configure Discovery Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Discovery Scan - Recent Scans hierarchy */}
            {isUnderViewRecentScan && page !== "view-recent-scan" && !isUnderRecentScanDetails && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View Recent Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {isUnderRecentScanDetails && page !== "details" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View Recent Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {page === "details" && section === "discovery-scan" && isUnderViewRecentScan && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View Recent Scan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Discovery Scan - Azure AD hierarchy */}
            {isUnderViewImportLog && page !== "view-import-log-details" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View Import Log Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* ITSM - Configuration Management > CMDB hierarchy */}
            {isUnderItsmCmdb && page !== "cmdb" && !isUnderItsmViewEditCi && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CMDB
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {isUnderItsmViewEditCi && page !== "view-and-edit-ci" && !isUnderItsmCiDetails && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CMDB
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View and Edit a CI
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {isUnderItsmCiDetails && page !== "ci-details-and-tabs" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CMDB
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View and Edit a CI
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CI Details and Tabs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {page === "ci-details-and-tabs" && section === "itsm" && isUnderItsmViewEditCi && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CMDB
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    View and Edit a CI
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {page === "view-and-edit-ci" && section === "itsm" && isUnderItsmCmdb && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    CMDB
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Organizational Details > Departments hierarchy */}
            {isUnderDepartments && page !== "departments" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Departments
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Discovery > Client hierarchy */}
            {isUnderClient && page !== "client" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Client
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Discovery > Credentials hierarchy */}
            {isUnderCredentials && page !== "credentials" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Credentials
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Management Functions > Procurement hierarchy */}
            {isUnderProcurement && page !== "procurement" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Procurement
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Integrations > Cherwell Credential hierarchy */}
            {isUnderCherwellCredential && page !== "cherwell-credential" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Cherwell Credential
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Integrations > Ivanti Credentials hierarchy */}
            {isUnderIvantiCredentials && page !== "ivanti-credentials" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Ivanti Credentials
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Integrations > Jira Credentials hierarchy */}
            {isUnderJiraCredentials && page !== "jira-credentials" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    Jira Credentials
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Admin - Integrations > ServiceNow Credentials hierarchy */}
            {isUnderServicenowCredentials && page !== "servicenow-credentials" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-slate-700">
                    ServiceNow Credentials
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 dark:text-white">
                {page
                  .split("-")
                  .map(
                    (word) =>
                      word.toLowerCase() === "cmdb"
                        ? "CMDB"
                        : word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(" ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4">
        {page
          .split("-")
          .map(
            (word) =>
              word.toLowerCase() === "cmdb"
                ? "CMDB"
                : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join(" ")}
      </h1>

      <p className="text-slate-600 leading-relaxed mb-12">
        This section contains detailed documentation for{" "}
        {page.replace(/-/g, " ")} in the {moduleName} module.
        The content is maintained in MDX format for easy updates
        and version control.
      </p>

      <h2 id="overview" className="mt-12 mb-6">
        Overview
      </h2>
      <p className="text-slate-600 leading-relaxed">
        This page provides comprehensive information about{" "}
        {page.replace(/-/g, " ")} in {moduleName} for Virima
        version {version}. Use the navigation menu to explore
        related topics and other sections of the documentation.
      </p>

      <h2 id="key-topics" className="mt-12 mb-6">
        Key Topics
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>
          Understanding the fundamentals and core concepts
        </li>
        <li>Step-by-step configuration and setup guide</li>
        <li>Best practices and recommended approaches</li>
        <li>Common issues and troubleshooting steps</li>
        <li>Advanced features and customization options</li>
      </ul>

      <h2 id="example-configuration" className="mt-12 mb-6">
        Example Configuration
      </h2>
      <p className="text-slate-600 leading-relaxed mb-6">
        Sample configuration and code snippets:
      </p>

      <h2 id="additional-resources" className="mt-12 mb-6">
        Additional Resources
      </h2>
      <ul className="space-y-2 text-slate-600">
        <li>
          Related documentation sections and cross-references
        </li>
        <li>Video tutorials and training webinars</li>
        <li>Community forums and user discussions</li>
        <li>Knowledge base articles and FAQs</li>
        <li>Support resources and contact information</li>
      </ul>

      <FeedbackSection />
    </article>
  );
}