import { ReactNode, useState, useEffect, MutableRefObject } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { LoginDialog } from "./LoginDialog";
import { ResizableSidebar } from "./ResizableSidebar";
import { DocumentationHeader } from "./DocumentationHeader";
import { NavigationMenu } from "./NavigationMenu";
import { versions, modules as hardcodedModules, getSectionsForModule } from "../data/navigationData";
import { useToc } from "../utils/useToc";
import { clearTocCache } from "../utils/tocLoader";

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
  contentContainerRef?: MutableRefObject<HTMLDivElement | null>;
  onSearchDialogOpen?: () => void;
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
  contentContainerRef,
  onSearchDialogOpen,
}: DocumentationLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Load TOC structure for selected version
  const { structure, modules: tocModules, loading: tocLoading, reload: reloadToc } = useToc(selectedVersion);

  // Handle TOC refresh
  const handleRefreshTOC = () => {
    console.log('🔄 Refreshing TOC cache and reloading navigation...');
    clearTocCache();
    if (reloadToc) {
      reloadToc();
    }
    // Force component re-render by clearing and re-expanding sections
    setExpandedSections(new Set([selectedSection]));
  };

  // Use hardcoded modules as fallback if TOC modules are empty or still loading
  const modules = tocModules && tocModules.length > 0 ? tocModules : hardcodedModules;

  console.log('DocumentationLayout modules:', {
    tocModules,
    hardcodedModules,
    selectedModules: modules,
    tocLoading
  });

  // Set up the trigger function for opening the version dropdown
  useEffect(() => {
    if (versionDropdownTriggerRef) {
      versionDropdownTriggerRef.current = () => {
        setVersionDropdownOpen(true);
      };
    }
  }, [versionDropdownTriggerRef]);

  const showSidebar = !!selectedModule;
  
  // Get sections from TOC structure, with hardcoded fallback
  const tocSections = structure?.modules
    .find(m => m.id === selectedModule)
    ?.sections || [];
  
  // Use hardcoded sections as fallback if TOC sections are empty
  const hardcodedSections = selectedModule ? getSectionsForModule(selectedModule) : [];
  const sections = tocSections.length > 0 ? tocSections : hardcodedSections;
  
  // Only log when a module is actually selected (not empty string)
  if (selectedModule && selectedModule.trim() !== '') {
    console.log('📚 DocumentationLayout Navigation Data:', {
      selectedModule,
      selectedSection,
      selectedPage,
      tocAvailable: !!structure,
      tocSectionsCount: tocSections.length,
      hardcodedSectionsCount: hardcodedSections?.length || 0,
      usingTOC: tocSections.length > 0,
      tocLoading,
      structureModules: structure?.modules.map(m => m.id) || [],
    });
    
    if (tocSections.length > 0) {
      console.log('✅ Using TOC sections for navigation');
    } else if (hardcodedSections?.length > 0) {
      console.warn('⚠️ Using hardcoded fallback sections - TOC may not be loaded properly');
    } else {
      console.error('❌ No sections available for module:', selectedModule);
    }
  }

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
        onSearchDialogOpen={() => {
          if (onSearchDialogOpen) {
            onSearchDialogOpen();
          }
        }}
        onLoginDialogOpen={() => setLoginDialogOpen(true)}
        onRefreshTOC={handleRefreshTOC}
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
          <main
            className="flex-1 overflow-auto bg-white"
            ref={contentContainerRef}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
}