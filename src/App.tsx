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
import { ThemeProvider } from './lib/theme/theme-provider';
import { loadHierarchicalToc } from './utils/hierarchicalTocLoader';
import { setVersion } from './content/contentLoader';
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
    setSelectedVersion(newVersion);
    
    // Update content loader version
    const internalVersion = versionMap[newVersion] || newVersion;
    setVersion(internalVersion);
    
    console.log(`🔄 [App] Version changed: ${newVersion} (internal: ${internalVersion})`);
  };
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showSupportPolicies, setShowSupportPolicies] = useState(false);
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);
  
  // Store scroll positions for each page
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize content loader with selected version
  useEffect(() => {
    const internalVersion = versionMap[selectedVersion] || selectedVersion;
    setVersion(internalVersion);
    console.log(`🚀 [App] Initialized content loader with version: ${internalVersion}`);
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

  // Generate unique key for current page
  const getPageKey = (version: string, module: string, section: string, page: string) => {
    return `${version}-${module}-${section}-${page}`;
  };

  // Save current scroll position before navigation
  const saveScrollPosition = () => {
    if (contentContainerRef.current && selectedModule) {
      const pageKey = getPageKey(selectedVersion, selectedModule, selectedSection, selectedPage);
      const scrollTop = contentContainerRef.current.scrollTop;
      scrollPositions.current.set(pageKey, scrollTop);
    }
  };

  // Restore scroll position after navigation
  const restoreScrollPosition = () => {
    if (contentContainerRef.current && selectedModule) {
      const pageKey = getPageKey(selectedVersion, selectedModule, selectedSection, selectedPage);
      const savedPosition = scrollPositions.current.get(pageKey);
      
      if (savedPosition !== undefined) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          if (contentContainerRef.current) {
            contentContainerRef.current.scrollTo({
              top: savedPosition,
              behavior: 'instant'
            });
          }
        });
      } else {
        // New page - scroll to top
        requestAnimationFrame(() => {
          if (contentContainerRef.current) {
            contentContainerRef.current.scrollTo({
              top: 0,
              behavior: 'instant'
            });
          }
        });
      }
    }
  };

  // Restore scroll position when page changes
  useEffect(() => {
    restoreScrollPosition();
  }, [selectedVersion, selectedModule, selectedSection, selectedPage]);

  const showHomePage = !selectedModule && !showCommunityForum && !showKnowledgeBase && !showSupportPolicies;

  const handleModuleChange = async (module: string) => {
    // Check if it's the community forum special case
    if (module === 'virima-tech-central') {
      setShowCommunityForum(true);
      return;
    }
    
    // Check if it's the knowledge base special case
    if (module === 'knowledge-base') {
      setShowKnowledgeBase(true);
      return;
    }
    
    // Check if it's the product support policies special case
    if (module === 'product-support-policies') {
      setShowSupportPolicies(true);
      return;
    }
    
    saveScrollPosition(); // Save before changing
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
  };

  const handleHomeClick = () => {
    saveScrollPosition(); // Save before going home
    setSelectedModule('');
    setSelectedSection('');
    setSelectedPage('');
    setShowCommunityForum(false);
    setShowKnowledgeBase(false);
    setShowSupportPolicies(false);
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
          ) : (
            <DocumentationLayout
            logo={logo}
            selectedVersion={selectedVersion}
            onVersionChange={handleVersionChange}
            selectedModule={selectedModule}
            onModuleChange={handleModuleChange}
            selectedSection={selectedSection}
            onSectionChange={(section) => {
              saveScrollPosition();
              setSelectedSection(section);
            }}
            selectedPage={selectedPage}
            onPageChange={(page) => {
              saveScrollPosition();
              setSelectedPage(page);
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
                  saveScrollPosition();
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