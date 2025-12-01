import { motion } from "motion/react";
import { ArrowRight, Command, PieChart, Database, FileText, AlertTriangle, Monitor, User, Network, ClipboardList, TrendingUp, BookOpen, Zap, Workflow, Layers, Shield, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { AISearchDialogSimplified } from "./AISearchDialogSimplified";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { Binoculars } from "./icons/Binoculars";
import coverImage from "figma:asset/dfabb390914b79df631271c3335e876d8bc63966.png";
import aiIcon from "figma:asset/d98ba8c1a392c8e922d637a419de7c9d29bf791a.png";

interface CoverPageProps {
  onModuleSelect: (module: string) => void;
}

const modules = [
  {
    id: "admin",
    name: "Admin",
    icon: Settings,
    description: "Administrative functions for organizational setup, user management, discovery configuration, and system integrations.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
  },
  {
    id: "my-dashboard",
    name: "My Dashboard",
    icon: PieChart,
    description: "Centralized view of your IT environment with customizable widgets and real-time monitoring.",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: "cmdb",
    name: "CMDB",
    icon: Database,
    description: "Configuration Management Database for tracking and managing all IT assets and their relationships.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    id: "discovery-scan",
    name: "Discovery Scan",
    icon: Binoculars,
    description: "Automated discovery and scanning of IT infrastructure, applications, and cloud resources.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "itsm",
    name: "ITSM",
    icon: FileText,
    description: "IT Service Management for incident, problem, change, and service request management.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "vulnerability-management",
    name: "Vulnerability Management",
    icon: AlertTriangle,
    description: "Identify, assess, and remediate security vulnerabilities across your IT infrastructure.",
    iconBg: "bg-indigo-600",
    iconColor: "text-white",
  },
  {
    id: "itam",
    name: "ITAM",
    icon: Monitor,
    description: "IT Asset Management for complete lifecycle management of hardware and software assets.",
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
  },
  {
    id: "self-service",
    name: "Self Service",
    icon: User,
    description: "Empower users with self-service portal for requests, catalog items, and knowledge base.",
    iconBg: "bg-pink-500",
    iconColor: "text-white",
  },
  {
    id: "program-project-management",
    name: "Program and Project Management",
    icon: Network,
    description: "Manage IT programs and projects with planning, tracking, and resource allocation.",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "risk-register",
    name: "Risk Register",
    icon: ClipboardList,
    description: "Track and manage IT risks with assessment, mitigation planning, and compliance monitoring.",
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  {
    id: "reports",
    name: "Reports",
    icon: TrendingUp,
    description: "Comprehensive reporting and analytics with customizable dashboards and scheduled reports.",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
  },
];

export function CoverPage({ onModuleSelect }: CoverPageProps) {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation every time component mounts (navigates to home)
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  return (
    <div className="relative w-full bg-white">
      {/* Hero Section with Cover Page */}
      <div className="relative w-full min-h-screen bg-white flex items-center justify-center">
        {/* Animated Hexagon Background Image - Slides in from right with pixel-perfect coverage */}
        <motion.div
          key={`background-${animationKey}`}
          className="absolute inset-0 w-full h-full"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <motion.div
            key={`shake-${animationKey}`}
            className="w-full h-full"
            initial={{ scale: 1.05 }}
            animate={{ 
              scale: [1.05, 1.07, 1.03, 1.06, 1.04, 1.05],
            }}
            transition={{
              delay: 1.2,
              duration: 0.6,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
          >
            <ImageWithFallback
              src={coverImage}
              alt="Virima Hexagon Pattern"
              className="w-full h-full object-cover"
              style={{
                minWidth: '100%',
                minHeight: '100%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Content Overlay - Centered and Responsive */}
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Virima Brand - Perfectly Centered with Fade In */}
          <motion.div
            key={`title-${animationKey}`}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.4,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-slate-900 tracking-tight">
              Virima
            </h1>
          </motion.div>

          {/* Tagline - Fade In */}
          <motion.div
            key={`tagline-${animationKey}`}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.6,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl text-slate-900 leading-relaxed px-2">
              Welcome to the Documentation Platform
            </p>
          </motion.div>

          {/* Description - Fade In */}
          <motion.p
            key={`description-${animationKey}`}
            className="text-base sm:text-lg md:text-lg lg:text-xl text-slate-600 mb-5 sm:mb-6 md:mb-7 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.8,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            Explore comprehensive feature documentation,
            release notes, and more across all Virima modules
            and versions.
          </motion.p>

          {/* Search CTA - Fade In with Scale */}
          <motion.div
            key={`search-${animationKey}`}
            className="max-w-2xl mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-8 px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 2.0,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSearchDialogOpen(true)}
              className="w-full max-w-xl mx-auto flex items-center gap-2 sm:gap-3 justify-start text-slate-700 bg-white/90 backdrop-blur-sm hover:bg-emerald-50/80 border-2 border-slate-200 hover:border-emerald-400 h-14 sm:h-16 px-4 sm:px-6 text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 group"
            >
              <img
                src={aiIcon}
                alt="AI"
                className="h-6 w-6 sm:h-7.5 sm:w-7.5 group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "crisp-edges" }}
              />
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300 hidden sm:inline">
                Ask AI anything about Virima
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300 sm:hidden">
                Ask AI about Virima
              </span>
              <div className="ml-auto flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                <Command className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>K</span>
              </div>
            </Button>
          </motion.div>

          {/* Get Started Button - Fade In with Scale */}
          <motion.div
            key={`button-${animationKey}`}
            className="flex justify-center px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 2.2,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <Button
              size="lg"
              onClick={() => onModuleSelect('admin')}
              className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-700 text-white px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">Get Started</span>
              <ArrowRight className="relative ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>

        {/* Bottom gradient fade - responsive */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
      </div>

      {/* Value Proposition Section */}
    <div className="bg-gradient-to-b from-white via-slate-50/30 to-white pt-8 pb-0 lg:pt-12 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl text-black-premium mb-8 tracking-tight">
            Enterprise IT Operations, Simplified
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Virima delivers a comprehensive suite of IT management solutions designed for enterprise-scale operations with the agility modern businesses demand.
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
                      onClick={() => onModuleSelect(module.id)}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-50 via-white to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative flex flex-col flex-grow">
                        <div className="mb-8">
                          <div className={`inline-flex p-5 rounded-2xl ${module.iconBg} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            <Icon className={`h-7 w-7 ${module.iconColor}`} />
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

    {/* Documentation Resources */}
    <div className="bg-gradient-to-b from-white via-slate-50/20 to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-5xl lg:text-6xl text-black-premium mb-8 tracking-tight">
            Quick Links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: "Getting Started", description: "Detailed guides, tutorials, and step-by-step instructions for daily operations and workflows.", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
            { icon: Zap, title: "Release Notes", description: "Latest updates, new features, improvements, and bug fixes for each version release.", gradient: "from-green-500 to-green-600", shadow: "shadow-green-500/20" },
            { icon: Layers, title: "Online Help", description: "Quick start guides and tutorials to get up and running with each module in minutes.", gradient: "from-blue-500 to-green-500", shadow: "shadow-blue-500/20" },
            { icon: Database, title: "Knowledge base (KB) Articles", description: "Complete reference documentation covering all features, capabilities, and configurations.", gradient: "from-green-500 to-blue-500", shadow: "shadow-green-500/20" },
            { icon: Workflow, title: "API Integration", description: "Developer guides, API references, and code examples for seamless integrations.", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
            { icon: Shield, title: "Compatibility Matrix", description: "System requirements, browser support, database compatibility, and integrations.", gradient: "from-green-500 to-green-600", shadow: "shadow-green-500/20" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] transition-all duration-500"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-lg ${item.shadow} group-hover:shadow-xl transition-shadow duration-500`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl text-black-premium mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Footer */}
    <Footer />

    {/* AI Search Dialog */}
    <AISearchDialogSimplified
      isOpen={searchDialogOpen}
      onClose={() => setSearchDialogOpen(false)}
    />
  </div>
  );
}
