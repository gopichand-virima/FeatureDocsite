import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface NavigationMenuProps {
  modules: Array<{ id: string; label: string }>;
  selectedModule: string;
  onModuleChange: (value: string) => void;
  sections: any[];
  selectedSection: string;
  onSectionChange: (sectionId: string) => void;
  selectedPage: string;
  onPageChange: (pageId: string) => void;
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
  expandedPages: Set<string>;
  togglePage: (pageId: string) => void;
  expandedSubPages: Set<string>;
  toggleSubPage: (subPageId: string) => void;
  onClose: () => void;
}

export function NavigationMenu({
  modules,
  selectedModule,
  onModuleChange,
  sections,
  selectedSection,
  onSectionChange,
  selectedPage,
  onPageChange,
  expandedSections,
  toggleSection,
  expandedPages,
  togglePage,
  expandedSubPages,
  toggleSubPage,
  onClose,
}: NavigationMenuProps) {
  // Debug: Log modules to console
  console.log('NavigationMenu modules:', modules);
  console.log('NavigationMenu selectedModule:', selectedModule);
  
  return (
    <div className="py-8 px-6">
      {/* Module Selector */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <label className="text-xs text-slate-500 mb-2 block">
          MODULE
        </label>
        <Select
          value={selectedModule}
          onValueChange={(value) => {
            onModuleChange(value);
            onClose();
          }}
        >
          <SelectTrigger className="w-full h-9 bg-white border-slate-200">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-white">
            {modules.map((module) => (
              <SelectItem
                key={module.id}
                value={module.id}
              >
                {module.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => {
          const isActive = selectedSection === section.id;
          const isExpanded = expandedSections.has(section.id);
          
          // Safety check: ensure section has pages array
          if (!section.pages || section.pages.length === 0) {
            console.warn('Section has no pages:', section.id);
            return null;
          }

          // Check if any child page is selected within this section
          const hasChildPageSelected = section.pages.some((page: any) => {
            // Check if the page itself is selected
            if (selectedPage === page.id) return true;
            // Check if any subpage is selected
            if (page.subPages && page.subPages.length > 0) {
              if (page.subPages.some((subPage: any) => {
                if (selectedPage === subPage.id) return true;
                // Check nested subpages
                if (subPage.subPages && subPage.subPages.length > 0) {
                  return subPage.subPages.some((nested: any) => selectedPage === nested.id);
                }
                return false;
              })) return true;
            }
            return false;
          });

          // Parent section should NEVER be green if any child is selected
          const isSectionDirectlySelected = false; // Parents should never be green when children exist

          return (
            <div key={section.id} className="space-y-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  aria-label={
                    isExpanded
                      ? "Collapse section"
                      : "Expand section"
                  }
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (section.pages && section.pages.length > 0) {
                      onSectionChange(section.id);
                      onPageChange(section.pages[0].id);
                      onClose();
                      toggleSection(section.id);
                    }
                  }}
                  className={`flex-1 text-left px-2 py-1.5 rounded transition-colors ${
                    isSectionDirectlySelected
                      ? "text-green-600 bg-green-50 font-medium"
                      : hasChildPageSelected
                      ? "text-slate-900 hover:text-slate-900 hover:bg-slate-50 font-medium"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{section.title || section.label || section.id}</span>
                </button>
              </div>

              {isExpanded && (
                <div className="ml-5 space-y-1 pl-4">
                  {section.pages.map((page: any) => {
                    const hasSubPages = page.subPages && page.subPages.length > 0;
                    const isPageExpanded = expandedPages.has(page.id);
                    
                    // Check if any subpage is selected
                    const isSubPageSelected = hasSubPages && page.subPages.some((subPage: any) => 
                      selectedPage === subPage.id || 
                      (subPage.subPages && subPage.subPages.some((nested: any) => selectedPage === nested.id))
                    );
                    
                    // Page should only be green if directly selected AND no subpage is selected
                    // If a subpage is selected, the page parent should be slate/black
                    const isPageDirectlySelected = selectedPage === page.id && isActive && !isSubPageSelected;
                    
                    return (
                      <div key={page.id}>
                        <div className="flex items-center gap-1">
                          {hasSubPages && (
                            <button
                              onClick={() => togglePage(page.id)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                              aria-label={
                                isPageExpanded
                                  ? "Collapse page"
                                  : "Expand page"
                              }
                            >
                              {isPageExpanded ? (
                                <ChevronDown className="h-3 w-3 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-slate-500" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onSectionChange(section.id);
                              onPageChange(page.id);
                              onClose();
                              if (hasSubPages) {
                                togglePage(page.id);
                              }
                            }}
                            className={`flex-1 text-left text-sm py-1.5 px-2 rounded transition-colors ${
                              isPageDirectlySelected
                                ? "text-green-600 bg-green-50"
                                : isSubPageSelected
                                ? "text-slate-900 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            } ${!hasSubPages ? 'ml-5' : ''}`}
                          >
                            {page.label}
                          </button>
                        </div>
                        
                        {hasSubPages && isPageExpanded && (
                          <div className="ml-8 space-y-1 pl-4 mt-1">
                            {page.subPages.map((subPage: any) => {
                              const hasNestedSubPages = subPage.subPages && subPage.subPages.length > 0;
                              const isSubPageExpanded = expandedSubPages.has(subPage.id);
                              
                              // Check if any nested subpage is selected
                              const isNestedSubPageSelected = hasNestedSubPages && subPage.subPages.some((nested: any) => selectedPage === nested.id);
                              
                              // Only show green if this exact subpage is selected, not a nested subpage
                              const isSubPageDirectlySelected = selectedPage === subPage.id && isActive && !isNestedSubPageSelected;
                              
                              return (
                                <div key={subPage.id}>
                                  <div className="flex items-center gap-1">
                                    {hasNestedSubPages && (
                                      <button
                                        onClick={() => toggleSubPage(subPage.id)}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                        aria-label={
                                          isSubPageExpanded
                                            ? "Collapse subpage"
                                            : "Expand subpage"
                                        }
                                      >
                                        {isSubPageExpanded ? (
                                          <ChevronDown className="h-3 w-3 text-slate-500" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3 text-slate-500" />
                                        )}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        onSectionChange(section.id);
                                        onPageChange(subPage.id);
                                        onClose();
                                        if (hasNestedSubPages) {
                                          toggleSubPage(subPage.id);
                                        }
                                      }}
                                      className={`flex-1 text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                        isSubPageDirectlySelected
                                          ? "text-green-600 bg-green-50"
                                          : isNestedSubPageSelected
                                          ? "text-slate-900 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                      } ${!hasNestedSubPages ? 'ml-5' : ''}`}
                                    >
                                      {subPage.label}
                                    </button>
                                  </div>
                                  
                                  {hasNestedSubPages && isSubPageExpanded && (
                                    <div className="ml-8 space-y-1 pl-4 mt-1">
                                      {subPage.subPages.map((nestedSubPage: any) => (
                                        <button
                                          key={nestedSubPage.id}
                                          onClick={() => {
                                            onSectionChange(section.id);
                                            onPageChange(nestedSubPage.id);
                                            onClose();
                                          }}
                                          className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                            selectedPage === nestedSubPage.id && isActive
                                              ? "text-green-600 bg-green-50"
                                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                          }`}
                                        >
                                          {nestedSubPage.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}