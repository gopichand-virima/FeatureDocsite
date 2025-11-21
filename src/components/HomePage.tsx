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
  Globe,
  Lock,
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
    <div className="min-h-screen bg-[#E6F8ED] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-5xl rounded-[40px] bg-gradient-to-br from-[#F4FFF9] via-white to-[#E7F8EE] border border-white/70 shadow-[0_30px_80px_rgba(16,185,129,0.25)] overflow-hidden px-6 sm:px-12 py-14 sm:py-18 text-center">
          {/* subtle top glow line */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-1 rounded-b-full bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

          {/* Virima logo text */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-slate-900">
            Virima
          </h1>

          {/* green underline bar */}
          <div className="mt-6 mb-10 flex justify-center">
            <div className="relative h-2 w-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
              <div className="absolute inset-0 rounded-full blur-md bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 opacity-80" />
            </div>
          </div>

          {/* Title + description */}
          <p className="text-xl sm:text-2xl text-slate-900 mb-4">
            Welcome to the Documentation Platform
          </p>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Explore comprehensive feature documentation, release notes,
            and more across all Virima modules and versions.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSearchDialogOpen(true)}
              className="w-full h-14 sm:h-16 justify-start gap-3 rounded-xl border border-slate-200 bg-white shadow-md hover:shadow-lg hover:border-emerald-400 transition-all"
            >
              <img
                src={aiIcon}
                alt="AI"
                className="h-6 w-6 sm:h-7 sm:w-7"
                style={{ imageRendering: "crisp-edges" }}
              />
              <span className="text-sm sm:text-base text-slate-400">
                Ask AI anything about Virima
              </span>
              <div className="ml-auto flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                <Command className="h-3.5 w-3.5" />
                <span>K</span>
              </div>
            </Button>
          </div>

          {/* Get Started button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => onModuleSelect("my-dashboard")}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-9 py-5 text-base sm:text-lg font-medium shadow-lg shadow-emerald-500/40 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
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
            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] transition-all duration-500">
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

            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] transition-all duration-500">
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

            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] transition-all duration-500">
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

            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] transition-all duration-500">
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

            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] transition-all duration-500">
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

            <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] transition-all duration-500">
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