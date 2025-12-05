import { useState, useRef, useEffect } from 'react';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import { AIMonitoringDashboard } from './components/AIMonitoringDashboard';
import { AISearchDialogSimplified } from './components/AISearchDialogSimplified';
import { GlobalChatProvider } from './components/GlobalChatProvider';
import { MDXRenderingTest } from './components/MDXRenderingTest';
import { VirumaTechCentral } from './components/VirimaTechCentral';
import { VirimaKnowledgeBase } from './components/VirimaKnowledgeBase';
import { ProductSupportPolicies } from './components/ProductSupportPolicies';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { ThemeProvider } from './lib/theme/theme-provider';
import { loadHierarchicalToc } from './utils/hierarchicalTocLoader';
import { setVersion } from './content/contentLoader';
import { updateUrl, parseUrl, getCurrentState, type NavigationState } from './utils/browserHistory';
import logo from './assets/virima_logo.png';
// Import debug helpers to expose to window
import './utils/debugHelpers';
// Import sample content registration
import './content/registerSampleContent';
// Import all content registration
import './content/registerAllContent';
// Import nested content registration
import './content/registerNestedContent';
// Import admin modules registration
import './content/registerAdminModules';
// Import remaining content registration
import './content/registerRemainingContent';
// Import missing files registration
import './content/registerMissingFiles';
// Import NextGen content registration
import './content/registerNextGenContent';
// Import 6.1 Admin Discovery registration
import './content/register61AdminDiscovery';

// Version mapping: UI version → internal version code
const versionMap: Record<string, string> = {
  'NextGen': 'NG',
  '6.1.1': '6_1_1',
  '6.1': '6_1',
  '5.13': '5_13',
};

export default function App() {
  const [selectedVersion, setSelectedVersion] = useState('NextGen');
  
  // Handle version changes - update content loader
  const handleVersionChange = (newVersion: string) => {
    // Scroll to top immediately on version change
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedVersion(newVersion);
    
    // Update content loader version
    const internalVersion = versionMap[newVersion] || newVersion;
    setVersion(internalVersion);
    
    // Update URL
    if (!isNavigatingBack.current) {
      updateUrl({
        version: newVersion,
        module: selectedModule,
        section: selectedSection,
        page: selectedPage,
      });
    }
    
    console.log(`🔄 [App] Version changed: ${newVersion} (internal: ${internalVersion})`);
  };
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showSupportPolicies, setShowSupportPolicies] = useState(false);
  const [showCompatibilityMatrix, setShowCompatibilityMatrix] = useState(false);
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);
  
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);
  const isNavigatingBack = useRef(false);

  // Initialize content loader with selected version
  useEffect(() => {
    const internalVersion = versionMap[selectedVersion] || selectedVersion;
    setVersion(internalVersion);
    console.log(`🚀 [App] Initialized content loader with version: ${internalVersion}`);
  }, []); // Only run on mount

  // Initialize state from URL on mount
  useEffect(() => {
    const urlState = getCurrentState();
    console.log('🔍 [App] Initial URL state:', urlState);
    
    // Store initial state in history
    window.history.replaceState(urlState, '', window.location.href);
    
    if (urlState.specialPage) {
      // Handle special pages
      if (urlState.specialPage === 'compatibility-matrix') {
        setShowCompatibilityMatrix(true);
      } else if (urlState.specialPage === 'product-support-policies') {
        setShowSupportPolicies(true);
      } else if (urlState.specialPage === 'knowledge-base') {
        setShowKnowledgeBase(true);
      } else if (urlState.specialPage === 'virima-tech-central') {
        setShowCommunityForum(true);
      }
      isInitialLoad.current = false;
      return;
    }
    
    // Restore navigation state from URL
    if (urlState.version) {
      setSelectedVersion(urlState.version);
      const internalVersion = versionMap[urlState.version] || urlState.version;
      setVersion(internalVersion);
    }
    
    if (urlState.module) {
      setSelectedModule(urlState.module);
    }
    
    if (urlState.section) {
      setSelectedSection(urlState.section);
    }
    
    if (urlState.page) {
      setSelectedPage(urlState.page);
    }
    
    isInitialLoad.current = false;
  }, []); // Only run on mount

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('⬅️ [App] Browser back/forward detected:', event.state);
      isNavigatingBack.current = true;
      
      const state = event.state || getCurrentState();
      
      // Reset all special page flags
      setShowCommunityForum(false);
      setShowKnowledgeBase(false);
      setShowSupportPolicies(false);
      setShowCompatibilityMatrix(false);
      
      // Handle special pages
      if (state.specialPage) {
        if (state.specialPage === 'compatibility-matrix') {
          setShowCompatibilityMatrix(true);
        } else if (state.specialPage === 'product-support-policies') {
          setShowSupportPolicies(true);
        } else if (state.specialPage === 'knowledge-base') {
          setShowKnowledgeBase(true);
        } else if (state.specialPage === 'virima-tech-central') {
          setShowCommunityForum(true);
        }
        setSelectedModule('');
        setSelectedSection('');
        setSelectedPage('');
        return;
      }
      
      // Restore navigation state
      if (state.version) {
        setSelectedVersion(state.version);
        const internalVersion = versionMap[state.version] || state.version;
        setVersion(internalVersion);
      } else {
        setSelectedVersion('NextGen');
      }
      
      setSelectedModule(state.module || '');
      setSelectedSection(state.section || '');
      setSelectedPage(state.page || '');
      
      // Reset flag after a short delay
      setTimeout(() => {
        isNavigatingBack.current = false;
      }, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Only run on mount

  // Enable MDX testing mode with URL parameter
  const showMDXTest = window.location.search.includes('test-mdx');

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
      // Also support Cmd/Ctrl + / as alternative
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state changes to URL (except during back/forward navigation)
  useEffect(() => {
    // Skip URL update on initial load or during back/forward navigation
    if (isInitialLoad.current || isNavigatingBack.current) {
      return;
    }
    
    // Skip if we're on a special page (handled in their respective handlers)
    if (showCommunityForum || showKnowledgeBase || showSupportPolicies || showCompatibilityMatrix) {
      return;
    }
    
    // Update URL when navigation state changes
    updateUrl({
      version: selectedVersion,
      module: selectedModule,
      section: selectedSection,
      page: selectedPage,
    });
  }, [selectedVersion, selectedModule, selectedSection, selectedPage, showCommunityForum, showKnowledgeBase, showSupportPolicies, showCompatibilityMatrix]);

  // Universal scroll-to-top on navigation
  // This ensures every navigation action starts at the top of the page
  useEffect(() => {
    // Use multiple requestAnimationFrame calls to ensure DOM is fully ready
    const scrollToTop = () => {
      // Scroll content container if it exists
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
      
      // Also scroll window to top (for any window-level scrolling)
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

    // Use double RAF to ensure content is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
  }, [selectedVersion, selectedModule, selectedSection, selectedPage]);

  const showHomePage = !selectedModule && !showCommunityForum && !showKnowledgeBase && !showSupportPolicies && !showCompatibilityMatrix;

  const handleModuleChange = async (module: string) => {
    // Check if it's the community forum special case
    if (module === 'virima-tech-central') {
      setShowCommunityForum(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'virima-tech-central' });
      }
      return;
    }
    
    // Check if it's the knowledge base special case
    if (module === 'knowledge-base') {
      setShowKnowledgeBase(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'knowledge-base' });
      }
      return;
    }
    
    // Check if it's the product support policies special case
    if (module === 'product-support-policies') {
      setShowSupportPolicies(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'product-support-policies' });
      }
      return;
    }
    
    // Check if it's the compatibility matrix special case
    if (module === 'compatibility-matrix') {
      setShowCompatibilityMatrix(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'compatibility-matrix' });
      }
      return;
    }
    
    // Scroll to top immediately on module change
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedModule(module);
    
    // Load hierarchical TOC to get the first section and page
    try {
      const toc = await loadHierarchicalToc(selectedVersion);
      const selectedModuleData = toc.modules.find(m => m.id === module);
      
      if (selectedModuleData && selectedModuleData.sections.length > 0) {
        const firstSection = selectedModuleData.sections[0];
        
        if (firstSection && firstSection.pages.length > 0) {
          const firstPage = firstSection.pages[0];
          setSelectedSection(firstSection.id);
          setSelectedPage(firstPage.id);
          
          // Update URL
          if (!isNavigatingBack.current) {
            updateUrl({
              version: selectedVersion,
              module: module,
              section: firstSection.id,
              page: firstPage.id,
            });
          }
          
          console.log('✅ Set section and page from hierarchical TOC:', {
            section: firstSection.id,
            page: firstPage.id
          });
          return; // Successfully set from TOC
        }
      }
      
      console.warn('⚠️ Module has no sections or pages:', module);
    } catch (error) {
      console.error('❌ Failed to load hierarchical TOC for module selection:', error);
    }
    
    // If we get here, couldn't load from TOC - set empty to trigger module landing page
    setSelectedSection('');
    setSelectedPage('');
    
    // Update URL for module-only navigation
    if (!isNavigatingBack.current) {
      updateUrl({
        version: selectedVersion,
        module: module,
      });
    }
  };

  const handleHomeClick = () => {
    // Scroll to top when going home
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedModule('');
    setSelectedSection('');
    setSelectedPage('');
    setShowCommunityForum(false);
    setShowKnowledgeBase(false);
    setShowSupportPolicies(false);
    setShowCompatibilityMatrix(false);
    
    // Update URL to homepage
    if (!isNavigatingBack.current) {
      updateUrl({});
    }
  };

  // Show test interface if requested
  if (showMDXTest) {
    return <MDXRenderingTest />;
  }

  return (
    <ThemeProvider>
      <GlobalChatProvider
        currentModule={selectedModule}
        currentPage={selectedPage}
      >
        <div className="min-h-screen bg-white dark:bg-slate-900">
          {/* AI Discovery Monitoring Dashboard (dev mode only) */}
          <AIMonitoringDashboard />
          
          {showCommunityForum ? (
            <VirumaTechCentral onBack={handleHomeClick} />
          ) : showKnowledgeBase ? (
            <VirimaKnowledgeBase onBack={handleHomeClick} />
          ) : showSupportPolicies ? (
            <ProductSupportPolicies onBack={handleHomeClick} />
          ) : showCompatibilityMatrix ? (
            <CompatibilityMatrix onBack={handleHomeClick} />
          ) : (
            <DocumentationLayout
            logo={logo}
            selectedVersion={selectedVersion}
            onVersionChange={handleVersionChange}
            selectedModule={selectedModule}
            onModuleChange={handleModuleChange}
            selectedSection={selectedSection}
            onSectionChange={(section) => {
              // Scroll to top on section change
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
              setSelectedSection(section);
              
              // Update URL
              if (!isNavigatingBack.current) {
                updateUrl({
                  version: selectedVersion,
                  module: selectedModule,
                  section: section,
                  page: selectedPage, // Keep current page if section changes
                });
              }
            }}
            selectedPage={selectedPage}
            onPageChange={(page) => {
              // Scroll to top on page change
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
              setSelectedPage(page);
              
              // Update URL
              if (!isNavigatingBack.current) {
                updateUrl({
                  version: selectedVersion,
                  module: selectedModule,
                  section: selectedSection,
                  page: page,
                });
              }
            }}
            onHomeClick={handleHomeClick}
            isHomePage={showHomePage}
            versionDropdownTriggerRef={versionDropdownTriggerRef}
            contentContainerRef={contentContainerRef}
            onSearchDialogOpen={() => setSearchDialogOpen(true)}
          >
            {showHomePage ? (
              <HomePage onModuleSelect={handleModuleChange} />
            ) : (
              <DocumentationContent
                version={selectedVersion}
                module={selectedModule}
                section={selectedSection}
                page={selectedPage}
                onHomeClick={handleHomeClick}
                onModuleClick={async () => {
                  // Scroll to top on module click
                  if (contentContainerRef.current) {
                    contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
                  }
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  
                  // Load TOC and navigate to first page of module
                  try {
                    const toc = await loadHierarchicalToc(selectedVersion);
                    const module = toc.modules.find(m => m.id === selectedModule);
                    
                    if (module && module.sections.length > 0) {
                      const firstSection = module.sections[0];
                      if (firstSection && firstSection.pages.length > 0) {
                        const firstPage = firstSection.pages[0];
                        setSelectedSection(firstSection.id);
                        setSelectedPage(firstPage.id);
                        return;
                      }
                    }
                  } catch (error) {
                    console.error('Failed to load module:', error);
                  }
                  
                  // Fallback: set empty
                  setSelectedSection('');
                  setSelectedPage('');
                }}
                onVersionClick={() => {
                  versionDropdownTriggerRef.current?.();
                }}
              />
            )}
          </DocumentationLayout>
          )}

        {/* AI Search Dialog */}
        <AISearchDialogSimplified
          isOpen={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
          currentModule={selectedModule}
          currentPage={selectedPage}
        />
      </div>
    </GlobalChatProvider>
    </ThemeProvider>
  );
}