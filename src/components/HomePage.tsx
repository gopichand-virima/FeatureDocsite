import {
  ArrowRight,
  PieChart,
  Database,
  FlaskConical,
  FileText,
  AlertTriangle,
  Monitor,
  User,
  Network,
  ClipboardList,
  TrendingUp,
  Search,
  Command,
  BookOpen,
  Zap,
  Workflow,
  Layers,
  Shield,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AISearchDialog } from "./AISearchDialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { Binoculars } from "./icons/Binoculars";
import aiIcon from "figma:asset/d98ba8c1a392c8e922d637a419de7c9d29bf791a.png";

interface HomePageProps {
  onModuleSelect: (module: string) => void;
}

const modules = [
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
    id: "my-dashboard",
    name: "My Dashboard",
    icon: PieChart,
    description:
      "Centralized view of your IT environment with customizable widgets and real-time monitoring.",
    iconBg: "bg-orange-500",
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
  const [searchDialogOpen, setSearchDialogOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean Design Matching Screenshot */}
      <div className="relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          {/* Main Content Card */}
          <div className="relative text-center max-w-4xl mx-auto py-16 px-8 lg:py-20 lg:px-12 rounded-3xl overflow-hidden shadow-lg">
            {/* Light Green Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-white to-emerald-50/50"></div>
            
            {/* Subtle Geometric Pattern Overlay - Rounded squares in corners */}
            <div className="absolute inset-0 opacity-20">
              {/* Top-left corner geometric shape */}
              <div className="absolute top-4 left-4 w-24 h-24 bg-green-200/30 rounded-2xl blur-sm"></div>
              {/* Top-right corner geometric shape */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-emerald-200/30 rounded-2xl blur-sm"></div>
              {/* Bottom-left corner geometric shape */}
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-green-200/30 rounded-2xl blur-sm"></div>
              {/* Bottom-right corner geometric shape */}
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-200/30 rounded-2xl blur-sm"></div>
              {/* Additional subtle shapes along edges */}
              <div className="absolute top-1/2 left-0 w-16 h-16 bg-green-200/20 rounded-xl blur-md transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-0 w-16 h-16 bg-emerald-200/20 rounded-xl blur-md transform -translate-y-1/2"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Virima Title */}
              <div className="mb-8">
                <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 mb-4 tracking-tight">
                  Virima
                </h1>
                {/* Simple Green Underline */}
                <div className="flex justify-center">
                  <div className="h-1 w-32 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Welcome Message */}
              <p className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-6">
                Welcome to the Documentation Platform
              </p>

              {/* Description */}
              <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Explore comprehensive feature documentation, release notes, and more across all Virima modules and versions.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSearchDialogOpen(true)}
                  className="w-full flex items-center gap-3 justify-start text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 h-14 px-5 text-base rounded-lg shadow-sm group"
                >
                  <img
                    src={aiIcon}
                    alt="AI"
                    className="h-5 w-5"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                  <span className="text-slate-500">
                    Ask AI anything about Virima
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <Command className="h-3 w-3.5" />
                    <span>K</span>
                  </div>
                </Button>
              </div>

              {/* Get Started Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => onModuleSelect('my-dashboard')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Dialog */}
      <AISearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
      />

      {/* Value Proposition Section */}
      <div className="bg-gradient-to-b from-white via-slate-50/30 to-white pt-24 pb-0 lg:pt-36 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl text-black-premium mb-8 tracking-tight">
              Enterprise IT Operations, Simplified
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Virima delivers a comprehensive suite of IT
              management solutions designed for enterprise-scale
              operations with the agility modern businesses
              demand.
            </p>
            <div className="bg-white pt-16 pb-8 lg:pt-20 lg:pb-12">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.id}
                        className="group relative bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                        onClick={() =>
                          onModuleSelect(module.id)
                        }
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-50 via-white to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative flex flex-col flex-grow">
                          <div className="mb-8">
                            <div
                              className={`inline-flex p-5 rounded-2xl ${module.iconBg} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                            >
                              <Icon
                                className={`h-7 w-7 ${module.iconColor}`}
                              />
                            </div>
                          </div>

                          <h3 className="text-2xl text-black-premium mb-4 group-hover:text-green-600 transition-colors duration-300">
                            {module.name}
                          </h3>

                          <p className="text-base text-slate-600 leading-relaxed mb-8 flex-grow">
                            {module.description}
                          </p>

                          <div className="flex items-center gap-2 text-green-600 group-hover:gap-4 transition-all duration-300">
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
      <div className="bg-gradient-to-b from-white via-slate-50/20 to-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-5xl lg:text-6xl text-black-premium mb-8 tracking-tight">
              Quick Links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                Getting Started
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Detailed guides, tutorials, and step-by-step
                instructions for daily operations and workflows.
              </p>
            </div>

            <div className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                Release Notes
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Latest updates, new features, improvements, and
                bug fixes for each version release.
              </p>
            </div>

            <div className="group bg-white border border-slate-200/60 hover:border-blue-500/20 rounded-3xl p-10 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                Online Help
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Quick start guides and tutorials to get up and
                running with each module in minutes.
              </p>
            </div>

            <div className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                Knowledge base (KB) Articles
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Complete reference documentation covering all
                features, capabilities, and configurations.
              </p>
            </div>

            <div className="group bg-white border border-slate-200/60 hover:border-blue-500/20 rounded-3xl p-10 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <Workflow className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                API Integration
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Developer guides, API references, and code
                examples for seamless integrations.
              </p>
            </div>

            <div className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl text-black-premium mb-4">
                Compatibility Matrix
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                System requirements, browser support, database
                compatibility, and integrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}