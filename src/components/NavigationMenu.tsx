/**
 * TOC Expand/Collapse Architecture
 * 
 * UNIVERSAL COMPONENT: This component is used for ALL versions (5.13, 6.1, 6.1.1, NextGen)
 * and ALL modules (Admin, CMDB, ITSM, ITAM, etc.). The active state logic applies universally.
 * 
 * This component implements a comprehensive expand/collapse system for the Table of Contents
 * with three levels of control:
 * 
 * 1. GLOBAL CONTROLS (Header Buttons)
 *    - Expand All: Opens every expandable node at all levels (sections, pages, subPages)
 *    - Collapse All: Closes every expandable node at all levels
 *    - Keyboard Shortcuts: Ctrl/Cmd+Shift+E (Expand All), Ctrl/Cmd+Shift+C (Collapse All)
 * 
 * 2. BRANCH CONTROLS (Per Section)
 *    - Expand Branch: Opens a section and all its descendant pages and subPages
 *    - Collapse Branch: Closes a section and all its descendant pages and subPages
 *    - UI: Small icon (ChevronsDownUp) appears on hover next to each section header
 * 
 * 3. NODE CONTROLS (Individual Toggle)
 *    - Single click on any chevron toggles just that one node
 *    - Maintains existing behavior for individual expand/collapse
 * 
 * STATE MANAGEMENT:
 * - expandedSections: Set<string> - Tracks which sections are expanded
 * - expandedPages: Set<string> - Tracks which pages are expanded
 * - expandedSubPages: Set<string> - Tracks which subPages are expanded
 * 
 * HELPER FUNCTIONS (in DocumentationLayout.tsx):
 * - getAllExpandableSectionIds() - Returns all section IDs
 * - getAllExpandablePageIds() - Returns all page IDs that have subPages
 * - getAllExpandableSubPageIds() - Returns all subPage IDs that have nested subPages
 * - getDescendantPageIds(sectionId) - Returns page IDs within a specific section
 * - getDescendantSubPageIds(pageId) - Returns subPage IDs within a specific page
 * 
 * ARCHITECTURE PRINCIPLES:
 * - Version-specific TOC isolation maintained
 * - No disruption to existing navigation logic
 * - Preserves perfect vertical alignment (w-6 chevron areas)
 * - Green resize indicator values untouched (2px width, 0.4 opacity)
 */

import { ChevronDown, ChevronRight, ChevronsDown, ChevronsUp, ChevronsDownUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onExpandBranch: (sectionId: string) => void;
  onCollapseBranch: (sectionId: string) => void;
  onClose: () => void;
}

export function NavigationMenu({
  modules,
  selectedModule,
  onModuleChange,
  sections,
  selectedSection: _selectedSection, // Intentionally unused - active state determined by selectedPage
  onSectionChange,
  selectedPage,
  onPageChange,
  expandedSections,
  toggleSection,
  expandedPages,
  togglePage,
  expandedSubPages,
  toggleSubPage,
  onExpandAll,
  onCollapseAll,
  onExpandBranch,
  onCollapseBranch,
  onClose,
}: NavigationMenuProps) {
  // Debug: Log modules to console
  console.log('NavigationMenu modules:', modules);
  console.log('NavigationMenu selectedModule:', selectedModule);
  
  return (
    <div className="py-8 px-6">
      {/* Module Selector with Expand/Collapse Controls */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <label className="text-xs text-slate-500 mb-2 block">
          MODULE
        </label>
        <div className="flex items-center gap-2">
          <Select
            value={selectedModule}
            onValueChange={(value) => {
              onModuleChange(value);
              onClose();
            }}
          >
            <SelectTrigger className="flex-1 h-9 bg-white border-slate-200">
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
          
          {/* Global Expand/Collapse Controls */}
          <TooltipProvider>
            <div className="flex items-center gap-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExpandAll}
                    className="h-9 w-5 p-0 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  >
                    <ChevronsDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>Expand All</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCollapseAll}
                    className="h-9 w-5 p-0 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  >
                    <ChevronsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>Collapse All</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          
          // Safety check: ensure section has pages array
          if (!section.pages || section.pages.length === 0) {
            console.warn('Section has no pages:', section.id);
            return null;
          }

          // UNIVERSAL ACTIVE STATE LOGIC (applies to all versions and modules):
          // Only the section containing the selected page should have bold/dark styling
          // All other sections should remain muted/gray
          // Expansion state is completely independent from active styling
          
          // CRITICAL: Default to false - only set to true if this section is confirmed to contain selectedPage
          // This prevents all sections from appearing active when selectedPage is empty/undefined/invalid
          // This logic applies universally to ALL modules and ALL versions
          let shouldShowActiveStyle = false;
          
          // Strict validation: selectedPage must be a non-empty string
          // Additional check: ensure selectedPage is not just whitespace
          const isValidSelectedPage = selectedPage && 
                                      typeof selectedPage === 'string' && 
                                      selectedPage.trim() !== '' &&
                                      selectedPage.trim().length > 0;
          
          if (isValidSelectedPage) {
            // Normalize selectedPage for comparison (trim whitespace)
            const normalizedSelectedPage = selectedPage.trim();
            
            // Recursive helper to check if a page or any of its descendants matches selectedPage
            // Uses strict equality (===) to ensure exact matches only - no partial or fuzzy matching
            const checkPageMatch = (page: any): boolean => {
              // Safety check: page must have an id
              if (!page || !page.id) return false;
              
              // Exact match: page itself is selected (strict equality)
              if (normalizedSelectedPage === page.id) return true;
              
              // Check subpages recursively (only if they exist and are valid)
              if (page.subPages && Array.isArray(page.subPages) && page.subPages.length > 0) {
                return page.subPages.some((subPage: any) => {
                  // Recursive check for nested structure
                  return checkPageMatch(subPage);
                });
              }
              
              return false;
            };
            
            // Check if ANY page in this section (or its descendants) matches selectedPage
            // Use strict equality (===) to ensure exact matches only
            // This ensures only ONE section can match at a time
            const hasChildPageSelected = section.pages.some((page: any) => {
              return checkPageMatch(page);
            });

            // CRITICAL: Only show active style if this section actually contains the selected page
            // This ensures ONLY the active parent chain is bold, all others are muted
            // Double-check: hasChildPageSelected must be explicitly true (strict boolean check)
            shouldShowActiveStyle = hasChildPageSelected === true;
          } else {
            // Explicitly set to false when selectedPage is invalid/empty
            // This prevents any section from appearing active when there's no valid selection
            // This is critical to prevent all sections from appearing bold when selectedPage is undefined/null/empty
            shouldShowActiveStyle = false;
          }
          
          // Final safety check: ensure shouldShowActiveStyle is a boolean
          // This prevents any edge cases where it might be undefined or truthy in unexpected ways
          shouldShowActiveStyle = Boolean(shouldShowActiveStyle);

          return (
            <div key={section.id} className="space-y-1">
              <div className="flex items-center gap-1 group">
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
                    shouldShowActiveStyle
                      ? "text-slate-900 hover:text-slate-900 hover:bg-slate-50 font-medium"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{section.title || section.label || section.id}</span>
                </button>
                {/* Branch Expand/Collapse Control - Shows on hover */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (isExpanded) {
                            onCollapseBranch(section.id);
                          } else {
                            onExpandBranch(section.id);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={
                          isExpanded
                            ? "Collapse branch"
                            : "Expand branch"
                        }
                      >
                        <ChevronsDownUp className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      <p>{isExpanded ? "Collapse All Below" : "Expand All Below"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {isExpanded && (
                <div className="space-y-1 pl-6">
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
                    const isPageDirectlySelected = selectedPage === page.id && !isSubPageSelected;
                    
                    return (
                      <div key={page.id}>
                        <div className="flex items-center">
                          <div className="w-6 flex-shrink-0 flex items-center justify-start">
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
                          </div>
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
                            }`}
                          >
                            {page.label}
                          </button>
                        </div>
                        
                        {hasSubPages && isPageExpanded && (
                          <div className="ml-6 space-y-1 mt-1">
                            {page.subPages.map((subPage: any) => {
                              const hasNestedSubPages = subPage.subPages && subPage.subPages.length > 0;
                              const isSubPageExpanded = expandedSubPages.has(subPage.id);
                              
                              // Check if any nested subpage is selected
                              const isNestedSubPageSelected = hasNestedSubPages && subPage.subPages.some((nested: any) => selectedPage === nested.id);
                              
                              // Only show green if this exact subpage is selected, not a nested subpage
                              const isSubPageDirectlySelected = selectedPage === subPage.id && !isNestedSubPageSelected;
                              
                              return (
                                <div key={subPage.id}>
                                  <div className="flex items-center">
                                    <div className="w-6 flex-shrink-0 flex items-center justify-start">
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
                                    </div>
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
                                      }`}
                                    >
                                      {subPage.label}
                                    </button>
                                  </div>
                                  
                                  {hasNestedSubPages && isSubPageExpanded && (
                                    <div className="ml-6 space-y-1 mt-1">
                                      {subPage.subPages.map((nestedSubPage: any) => (
                                        <button
                                          key={nestedSubPage.id}
                                          onClick={() => {
                                            onSectionChange(section.id);
                                            onPageChange(nestedSubPage.id);
                                            onClose();
                                          }}
                                          className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors pl-8 ${
                                            selectedPage === nestedSubPage.id
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