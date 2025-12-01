import { ReactNode, useState, useEffect, MutableRefObject } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { LoginDialog } from "./LoginDialog";
import { ResizableSidebar } from "./ResizableSidebar";
import { DocumentationHeader } from "./DocumentationHeader";
import { NavigationMenu } from "./NavigationMenu";
import { versions, modules as hardcodedModules, getSectionsForModule } from "../data/navigationData";
import { useToc } from "../utils/useToc";

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
  const { structure, modules: tocModules, loading: tocLoading } = useToc(selectedVersion);

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
  
  // Use hardcoded sections as fallback ONLY if TOC is still loading or has errors
  // Once TOC is loaded, always use TOC sections (index.mdx is single source of truth)
  const hardcodedSections = selectedModule ? getSectionsForModule(selectedModule) : [];
  const sections = (!tocLoading && tocSections.length > 0) ? tocSections : (tocLoading ? [] : hardcodedSections);
  
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

  // ============================================================
  // TOC EXPAND/COLLAPSE HELPER FUNCTIONS
  // ============================================================
  // These functions power the comprehensive expand/collapse system
  // that provides global, branch, and node-level controls for the TOC.
  // See NavigationMenu.tsx for full architecture documentation.
  // ============================================================

  // Helper function: Get all expandable section IDs
  const getAllExpandableSectionIds = (): string[] => {
    return sections.map(section => section.id);
  };

  // Helper function: Get all expandable page IDs from all sections
  const getAllExpandablePageIds = (): string[] => {
    const pageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        section.pages.forEach((page: any) => {
          if (page.subPages && page.subPages.length > 0) {
            pageIds.push(page.id);
          }
        });
      }
    });
    return pageIds;
  };

  // Helper function: Get all expandable subPage IDs from all sections
  const getAllExpandableSubPageIds = (): string[] => {
    const subPageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        section.pages.forEach((page: any) => {
          if (page.subPages && Array.isArray(page.subPages)) {
            page.subPages.forEach((subPage: any) => {
              if (subPage.subPages && subPage.subPages.length > 0) {
                subPageIds.push(subPage.id);
              }
            });
          }
        });
      }
    });
    return subPageIds;
  };

  // Helper function: Get descendant page IDs for a given section
  const getDescendantPageIds = (sectionId: string): string[] => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.pages) return [];
    
    const pageIds: string[] = [];
    section.pages.forEach((page: any) => {
      if (page.subPages && page.subPages.length > 0) {
        pageIds.push(page.id);
      }
    });
    return pageIds;
  };

  // Helper function: Get descendant subPage IDs for a given page
  const getDescendantSubPageIds = (pageId: string): string[] => {
    const subPageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        const page = section.pages.find((p: any) => p.id === pageId);
        if (page && page.subPages && Array.isArray(page.subPages)) {
          page.subPages.forEach((subPage: any) => {
            if (subPage.subPages && subPage.subPages.length > 0) {
              subPageIds.push(subPage.id);
            }
          });
        }
      }
    });
    return subPageIds;
  };

  // Expand All: Opens all expandable nodes at all levels
  const expandAll = () => {
    const allSectionIds = getAllExpandableSectionIds();
    const allPageIds = getAllExpandablePageIds();
    const allSubPageIds = getAllExpandableSubPageIds();
    
    setExpandedSections(new Set(allSectionIds));
    setExpandedPages(new Set(allPageIds));
    setExpandedSubPages(new Set(allSubPageIds));
  };

  // Collapse All: Closes all expandable nodes at all levels
  const collapseAll = () => {
    setExpandedSections(new Set());
    setExpandedPages(new Set());
    setExpandedSubPages(new Set());
  };

  // Expand Branch: Opens a section and all its descendants
  const expandBranch = (sectionId: string) => {
    setExpandedSections(prev => new Set([...prev, sectionId]));
    
    const descendantPageIds = getDescendantPageIds(sectionId);
    setExpandedPages(prev => new Set([...prev, ...descendantPageIds]));
    
    // Also expand all subPages within those pages
    const allSubPageIds: string[] = [];
    descendantPageIds.forEach(pageId => {
      const subPageIds = getDescendantSubPageIds(pageId);
      allSubPageIds.push(...subPageIds);
    });
    setExpandedSubPages(prev => new Set([...prev, ...allSubPageIds]));
  };

  // Collapse Branch: Closes a section and all its descendants
  const collapseBranch = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
    
    const descendantPageIds = getDescendantPageIds(sectionId);
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      descendantPageIds.forEach(id => newSet.delete(id));
      return newSet;
    });
    
    // Also collapse all subPages within those pages
    const allSubPageIds: string[] = [];
    descendantPageIds.forEach(pageId => {
      const subPageIds = getDescendantSubPageIds(pageId);
      allSubPageIds.push(...subPageIds);
    });
    setExpandedSubPages(prev => {
      const newSet = new Set(prev);
      allSubPageIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  };

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

  // Keyboard shortcuts for TOC expand/collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+E or Cmd+Shift+E to expand all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        expandAll();
      }
      // Ctrl+Shift+C or Cmd+Shift+C to collapse all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        collapseAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections]); // Re-attach when sections change

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
                    onExpandAll={expandAll}
                    onCollapseAll={collapseAll}
                    onExpandBranch={expandBranch}
                    onCollapseBranch={collapseBranch}
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
                  onExpandAll={expandAll}
                  onCollapseAll={collapseAll}
                  onExpandBranch={expandBranch}
                  onCollapseBranch={collapseBranch}
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