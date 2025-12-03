import {
  ArrowRight,
  PieChart,
  Database,
  FileText,
  AlertTriangle,
  Monitor,
  User,
  Network,
  ClipboardList,
  TrendingUp,
  BookOpen,
  Layers,
  Settings,
} from "lucide-react";
import { Binoculars } from "./icons/Binoculars";
import { VirimaTechCentral } from "./icons/VirimaTechCentral";
import { ApiIntegration } from "./icons/ApiIntegration";
import { ProductSupportPolicies } from "./icons/ProductSupportPolicies";
import { CoverPage } from "./CoverPage";
import { homePageText } from "./homePageConfig";

interface HomePageProps {
  onModuleSelect: (module: string) => void;
}

const modules = [
  {
    id: "my-dashboard",
    name: "My Dashboard",
    icon: PieChart,
    description:
      "Centralized view of your IT environment with customizable widgets and real-time monitoring.",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: "admin",
    name: "Admin",
    icon: Settings,
    description:
      "Administrative functions for organizational setup, user management, discovery configuration, and system integrations.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
  },
  {
    id: "cmdb",
    name: "CMDB",
    icon: Database,
    description:
      "Configuration Management Database for tracking and managing all IT assets and their relationships.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    id: "discovery-scan",
    name: "Discovery Scan",
    icon: Binoculars,
    description:
      "Automated discovery and scanning of IT infrastructure, applications, and cloud resources.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "itsm",
    name: "ITSM",
    icon: FileText,
    description:
      "IT Service Management for incident, problem, change, and service request management.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "vulnerability-management",
    name: "Vulnerability Management",
    icon: AlertTriangle,
    description:
      "Identify, assess, and remediate security vulnerabilities across your IT infrastructure.",
    iconBg: "bg-indigo-600",
    iconColor: "text-white",
  },
  {
    id: "itam",
    name: "ITAM",
    icon: Monitor,
    description:
      "IT Asset Management for complete lifecycle management of hardware and software assets.",
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
  },
  {
    id: "self-service",
    name: "Self Service",
    icon: User,
    description:
      "Empower users with self-service portal for requests, catalog items, and knowledge base.",
    iconBg: "bg-pink-500",
    iconColor: "text-white",
  },
  {
    id: "program-project-management",
    name: "Program and Project Management",
    icon: Network,
    description:
      "Manage IT programs and projects with planning, tracking, and resource allocation.",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "risk-register",
    name: "Risk Register",
    icon: ClipboardList,
    description:
      "Track and manage IT risks with assessment, mitigation planning, and compliance monitoring.",
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  {
    id: "reports",
    name: "Reports",
    icon: TrendingUp,
    description:
      "Comprehensive reporting and analytics with customizable dashboards and scheduled reports.",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
  },
];

export function HomePage({ onModuleSelect }: HomePageProps) {
  return (
    <div className="bg-white dark:bg-slate-950 pb-24">
      {/* 3D Animated Cover Page */}
      <CoverPage onModuleSelect={onModuleSelect} />

      {/* Value Proposition Section */}
      <div className="bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 pt-8 pb-0 lg:pt-12 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl text-black-premium dark:text-white mb-8 tracking-tight">
              {homePageText.valueProposition.title}
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {homePageText.valueProposition.description}
            </p>
            <div className="bg-white dark:bg-slate-900 pt-16 pb-8 lg:pt-20 lg:pb-12">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.id}
                        className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                        onClick={() =>
                          onModuleSelect(module.id)
                        }
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-50 via-white to-transparent dark:from-slate-700 dark:via-slate-800 dark:to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative flex flex-col flex-grow">
                          <div className="mb-8">
                            <div
                              className={`inline-flex p-5 rounded-2xl ${module.iconBg} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                            >
                              <Icon
                                className={`h-7 w-7 ${module.iconColor} ${
                                  module.id === "my-dashboard"
                                    ? "bounce-in-top-on-hover"
                                    : module.id === "admin"
                                    ? "rotate-2-circles-on-hover"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>

                          <h3 className="text-2xl text-black-premium dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            {module.name}
                          </h3>

                          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8 flex-grow">
                            {module.description}
                          </p>

                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 group-hover:gap-4 transition-all duration-300">
                            <span>Explore</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Modules */}

      {/* Documentation Resources */}
      <div className="bg-gradient-to-b from-white via-slate-50/20 to-white dark:from-slate-900 dark:via-slate-800/20 dark:to-slate-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-5xl lg:text-6xl text-black-premium dark:text-white mb-8 tracking-tight">
              {homePageText.quickLinks.title}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              onClick={() => onModuleSelect('product-support-policies')}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] dark:hover:shadow-[0_8px_40px_rgba(59,130,246,0.2)] transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <ProductSupportPolicies className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Product Support Policies
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Comprehensive support policies, maintenance schedules,
                and lifecycle information for all Virima products.
              </p>
            </div>

            <a
              href="https://virima.com/release-notes/release-notes-6-1"
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] dark:hover:shadow-[0_8px_40px_rgba(34,197,94,0.2)] transition-all duration-500"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4">
                Release Notes
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Latest updates, new features, improvements, and
                bug fixes for each version release.
              </p>
            </a>

            <div className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.08)] dark:hover:shadow-[0_8px_40px_rgba(168,85,247,0.2)] transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-shadow duration-500">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4">
                Compatibility Matrix
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                System requirements, browser support, database
                compatibility, and integrations.
              </p>
            </div>

            <div 
              onClick={() => onModuleSelect('knowledge-base')}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] dark:hover:shadow-[0_8px_40px_rgba(34,197,94,0.2)] transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Knowledge base (KB) Articles
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Complete reference documentation covering all
                features, capabilities, and configurations.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] dark:hover:shadow-[0_8px_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <ApiIntegration className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4">
                API Integration
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Developer guides, API references, and code
                examples for seamless integrations.
              </p>
            </div>

            <div 
              onClick={() => onModuleSelect('virima-tech-central')}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] dark:hover:shadow-[0_8px_40px_rgba(34,197,94,0.2)] transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <VirimaTechCentral className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Virima Tech Central
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Join our product community forum for discussions,
                best practices, and expert support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}