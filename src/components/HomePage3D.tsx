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
import { useState, useEffect, useRef } from "react";
import { AISearchDialogSimplified } from "./AISearchDialogSimplified";
import { Footer } from "./Footer";

interface HomePage3DProps {
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
    icon: Search,
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

// Hexagon component for the 3D design
function Hexagon({ delay = 0, size = "medium", position }: { delay?: number; size?: "small" | "medium" | "large"; position: { x: number; y: number } }) {
  const hexRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  useEffect(() => {
    if (hexRef.current) {
      hexRef.current.style.left = `${position.x}%`;
      hexRef.current.style.top = `${position.y}%`;
    }
  }, [position]);

  return (
    <div
      ref={hexRef}
      className={`absolute ${sizeClasses[size]} transition-all duration-1000 ease-out`}
      style={{
        animationDelay: `${delay}s`,
        transform: isHovered ? "translateZ(20px) rotateY(15deg)" : "translateZ(0px)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full bg-[#66CC66] opacity-90 hover:opacity-100 transition-opacity duration-300"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          transform: "perspective(1000px) rotateX(10deg)",
          boxShadow: "0 10px 30px rgba(102, 204, 102, 0.3)",
        }}
      />
    </div>
  );
}

// Geometric shapes component for the green area
function GeometricShape({ type, delay = 0, position }: { type: "square" | "triangle"; delay?: number; position: { x: number; y: number } }) {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.style.left = `${position.x}%`;
      shapeRef.current.style.top = `${position.y}%`;
    }
  }, [position]);

  const clipPath = type === "square" 
    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    : "polygon(50% 0%, 0% 100%, 100% 100%)";

  return (
    <div
      ref={shapeRef}
      className="absolute w-12 h-12 opacity-40"
      style={{
        animationDelay: `${delay}s`,
        clipPath,
        backgroundColor: "#90EE90",
        transform: "perspective(500px) rotateY(15deg) rotateX(5deg)",
      }}
    />
  );
}

export function HomePage3D({ onModuleSelect }: HomePage3DProps) {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hexagon positions (matching the image layout)
  const hexagonPositions = [
    { x: 10, y: 70, size: "small" as const },
    { x: 15, y: 50, size: "medium" as const },
    { x: 20, y: 30, size: "large" as const },
    { x: 25, y: 15, size: "medium" as const },
    { x: 30, y: 40, size: "small" as const },
    { x: 35, y: 60, size: "medium" as const },
    { x: 40, y: 75, size: "small" as const },
    { x: 45, y: 55, size: "large" as const },
    { x: 50, y: 35, size: "medium" as const },
    { x: 55, y: 20, size: "small" as const },
  ];

  // Geometric shape positions for the green area
  const geometricPositions = [
    { x: 75, y: 10, type: "square" as const },
    { x: 80, y: 25, type: "triangle" as const },
    { x: 85, y: 15, type: "square" as const },
    { x: 78, y: 40, type: "triangle" as const },
    { x: 82, y: 55, type: "square" as const },
    { x: 88, y: 70, type: "triangle" as const },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with 3D Design */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {/* Left Side - White Background with Hexagons */}
        <div 
          className="absolute left-0 top-0 w-2/3 h-full bg-white z-10"
          style={{
            transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.01}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated Hexagons */}
          {hexagonPositions.map((pos, index) => (
            <Hexagon
              key={index}
              delay={index * 0.1}
              size={pos.size}
              position={pos}
            />
          ))}

          {/* Content on White Background */}
          <div className="relative z-20 h-full flex flex-col justify-center items-start pl-12 pr-8">
            <div className="max-w-2xl">
              <h1 className="text-7xl lg:text-9xl font-bold text-slate-900 mb-6 tracking-tight">
                Virima
              </h1>
              <p className="text-3xl lg:text-4xl text-slate-900 mb-4 leading-relaxed">
                Welcome to the Documentation Platform
              </p>
              <p className="text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed">
                Explore comprehensive feature documentation, release notes, and more across all Virima modules and versions.
              </p>

              {/* Search CTA */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSearchDialogOpen(true)}
                  className="w-full max-w-xl flex items-center gap-3 justify-start text-slate-700 bg-white/95 backdrop-blur-sm hover:bg-emerald-50/80 border-2 border-slate-200 hover:border-emerald-400 h-16 px-6 text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 group"
                >
                  <Search className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                    Ask AI anything about Virima
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    <Command className="h-3 w-3.5" />
                    <span>K</span>
                  </div>
                </Button>
              </div>

              {/* Get Started Button */}
              <Button
                size="lg"
                onClick={() => onModuleSelect('admin')}
                className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-700 text-white px-10 py-6 text-lg shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
                style={{
                  transform: "perspective(1000px) translateZ(20px)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative">Get Started</span>
                <ArrowRight className="relative ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Large Green Shape with Cut-outs */}
        <div 
          className="absolute right-0 top-0 w-1/3 h-full z-0"
          style={{
            transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * -0.01}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Large Green Shape with White Cut-outs */}
          <div
            className="absolute inset-0 bg-[#66CC66]"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%, 15% 20%, 15% 80%, 0% 80%)",
              boxShadow: "inset -20px 0 60px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* White Circular Cut-outs */}
            <div
              className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"
              style={{
                boxShadow: "0 0 40px rgba(102, 204, 102, 0.3)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 translate-y-32"
              style={{
                boxShadow: "0 0 40px rgba(102, 204, 102, 0.3)",
              }}
            />

            {/* Light Green Geometric Patterns */}
            {geometricPositions.map((pos, index) => (
              <GeometricShape
                key={index}
                type={pos.type}
                delay={index * 0.15}
                position={pos}
              />
            ))}

            {/* Light Green Dots */}
            <div className="absolute top-8 right-12 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-[#90EE90] rounded-full opacity-60"
                  style={{
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    transform: "translateZ(10px)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Dialog */}
      <AISearchDialogSimplified
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />

      {/* Value Proposition Section */}
      <div className="bg-gradient-to-b from-white via-slate-50/30 to-white pt-8 pb-0 lg:pt-12 lg:pb-0 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl text-slate-900 mb-8 tracking-tight">
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
                        style={{
                          transform: "perspective(1000px) translateZ(0px)",
                          transition: "transform 0.3s ease-out",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "perspective(1000px) translateZ(20px) rotateY(5deg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "perspective(1000px) translateZ(0px)";
                        }}
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

                          <h3 className="text-2xl text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                            {module.name}
                          </h3>

                          <p className="text-base text-slate-600 leading-relaxed mb-8 flex-grow">
                            {module.description}
                          </p>

                          <div className="flex items-center gap-2 text-emerald-600 group-hover:gap-4 transition-all duration-300">
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
      <div className="bg-gradient-to-b from-white via-slate-50/20 to-white py-12 lg:py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-5xl lg:text-6xl text-slate-900 mb-8 tracking-tight">
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
                  style={{
                    transform: "perspective(1000px) translateZ(0px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "perspective(1000px) translateZ(15px) rotateX(2deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(1000px) translateZ(0px)";
                  }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-lg ${item.shadow} group-hover:shadow-xl transition-shadow duration-500`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl text-slate-900 mb-4">
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

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateZ(10px);
          }
          50% {
            transform: translateY(-10px) translateZ(15px);
          }
        }
      `}</style>
    </div>
  );
}

