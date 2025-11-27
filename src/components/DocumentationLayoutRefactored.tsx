import { ReactNode, useState, useEffect, MutableRefObject } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { AISearchDialog } from "./AISearchDialog";
import { LoginDialog } from "./LoginDialog";
import { ResizableSidebar } from "./ResizableSidebar";
import { DocumentationHeader } from "./DocumentationHeader";
import { NavigationMenu } from "./NavigationMenu";
import { modules, versions, getSectionsForModule } from "../data/navigationData";

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
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([selectedSection])
  );
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedSubPages, setExpandedSubPages] = useState<Set<string>>(
    new Set()
  );
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(288); // 72 * 4 = 288px (w-72)

  // Set up the trigger function for opening the version dropdown
  useEffect(() => {
    if (versionDropdownTriggerRef) {
      versionDropdownTriggerRef.current = () => {
        setVersionDropdownOpen(true);
      };
    }
  }, [versionDropdownTriggerRef]);

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
    <div className="flex flex-col h-screen bg-slate-50/30">
      {/* Header */}
      <DocumentationHeader
        logo={logo}
        showSidebar={showSidebar}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onHomeClick={onHomeClick}
        isHomePage={isHomePage}
        selectedVersion={selectedVersion}
        onVersionChange={onVersionChange}
        versions={versions}
        versionDropdownOpen={versionDropdownOpen}
        onVersionDropdownOpenChange={setVersionDropdownOpen}
        onSearchDialogOpen={() => setSearchDialogOpen(true)}
        onLoginDialogOpen={() => setLoginDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Resizable Sidebar */}
            <ResizableSidebar
              initialWidth={leftSidebarWidth}
              onResize={setLeftSidebarWidth}
              minWidth={200}
              maxWidth={500}
              side="left"
            >
              <aside className="h-full border-r border-slate-200/60 bg-white">
                <ScrollArea className="h-full">
                  <NavigationMenu
                    modules={modules}
                    selectedModule={selectedModule}
                    onModuleChange={onModuleChange}
                    sections={sections}
                    selectedSection={selectedSection}
                    onSectionChange={onSectionChange}
                    selectedPage={selectedPage}
                    onPageChange={onPageChange}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    expandedPages={expandedPages}
                    togglePage={togglePage}
                    expandedSubPages={expandedSubPages}
                    toggleSubPage={toggleSubPage}
                    onClose={() => setSidebarOpen(false)}
                  />
                </ScrollArea>
              </aside>
            </ResizableSidebar>

            {/* Mobile Sidebar */}
            <aside
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:hidden fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/60 bg-white shadow-xl transition-transform duration-300`}
            >
              <ScrollArea className="h-full">
                <NavigationMenu
                  modules={modules}
                  selectedModule={selectedModule}
                  onModuleChange={onModuleChange}
                  sections={sections}
                  selectedSection={selectedSection}
                  onSectionChange={onSectionChange}
                  selectedPage={selectedPage}
                  onPageChange={onPageChange}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  expandedPages={expandedPages}
                  togglePage={togglePage}
                  expandedSubPages={expandedSubPages}
                  toggleSubPage={toggleSubPage}
                  onClose={() => setSidebarOpen(false)}
                />
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

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto bg-white">{children}</main>
        </div>
      </div>

      {/* AI Search Dialog */}
      <AISearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        currentModule={modules.find((m) => m.id === selectedModule)?.label}
        currentPage={sections
          .find((s) => s.id === selectedSection)
          ?.pages.find((p: any) => p.id === selectedPage)?.label}
      />

      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
}
