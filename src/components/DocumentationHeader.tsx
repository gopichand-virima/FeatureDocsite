import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DocumentationHeaderProps {
  logo: string;
  showSidebar: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  isHomePage: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  versions: string[];
  versionDropdownOpen: boolean;
  onVersionDropdownOpenChange: (open: boolean) => void;
  onSearchDialogOpen: () => void;
  onLoginDialogOpen: () => void;
}

export function DocumentationHeader({
  logo,
  showSidebar,
  sidebarOpen,
  onToggleSidebar,
  onHomeClick,
  isHomePage,
  selectedVersion,
  onVersionChange,
  versions,
  versionDropdownOpen,
  onVersionDropdownOpenChange,
  onSearchDialogOpen,
  onLoginDialogOpen,
}: DocumentationHeaderProps) {
  return (
    <header className="border-b border-slate-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
        <div className="flex items-center gap-3 sm:gap-8 min-w-0 flex-1">
          {showSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2 flex-shrink-0"
              onClick={onToggleSidebar}
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
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0"
          >
            <img src={logo} alt="Virima" className="h-6 sm:h-7 flex-shrink-0" />
            <Separator
              orientation="vertical"
              className="h-4 sm:h-5 hidden sm:block bg-slate-200 flex-shrink-0"
            />
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onHomeClick}
            className="hidden md:flex items-center gap-2 text-slate-700 text-sm"
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
            className="hidden md:flex items-center gap-2 text-slate-700 text-sm"
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
            onClick={onLoginDialogOpen}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            <span>Log in</span>
          </Button>

          {!isHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchDialogOpen}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 text-slate-700 hover:text-green-600 text-sm px-2 sm:px-3"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Ask Virima</span>
            </Button>
          )}

          {!isHomePage && (
            <Select
              value={selectedVersion}
              onValueChange={onVersionChange}
              open={versionDropdownOpen}
              onOpenChange={onVersionDropdownOpenChange}
            >
              <SelectTrigger className="w-20 sm:w-28 h-8 sm:h-9 bg-white border-2 border-black-premium text-black-premium font-semibold [&>svg]:stroke-[3] [&>svg]:opacity-100 gap-0 pr-1 sm:pr-2 text-xs sm:text-sm">
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
  );
}
