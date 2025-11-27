import { useState, useRef, useEffect } from 'react';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import { AIMonitoringDashboard } from './components/AIMonitoringDashboard';
import { AISearchDialogSimplified } from './components/AISearchDialogSimplified';
import { loadTocForVersion } from './utils/tocLoader';
import { getSectionsForModule } from './data/navigationData';
import logo from 'figma:asset/20803a9cc590c8a78bca4489c80f3bfca906561c.png';

export default function App() {
  const [selectedVersion, setSelectedVersion] = useState('NextGen');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);
  
  // Store scroll positions for each page
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

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

  const showHomePage = !selectedModule;

  const handleModuleChange = async (module: string) => {
    saveScrollPosition(); // Save before changing
    setSelectedModule(module);
    
    // Load TOC to get the first section and page
    try {
      const toc = await loadTocForVersion(selectedVersion);
      const selectedModuleData = toc.modules.find(m => m.id === module);
      
      if (selectedModuleData && selectedModuleData.sections.length > 0) {
        const firstSection = selectedModuleData.sections[0];
        const firstPage = firstSection.pages[0];
        
        if (firstSection && firstPage) {
          setSelectedSection(firstSection.id);
          setSelectedPage(firstPage.id);
          return; // Successfully set from TOC
        }
      }
    } catch (error) {
      console.error('Failed to load TOC for module selection:', error);
    }
    
    // Fallback to hardcoded sections if TOC fails or is empty
    console.log('Using hardcoded sections fallback for module:', module);
    const hardcodedSections = getSectionsForModule(module);
    
    if (hardcodedSections && hardcodedSections.length > 0) {
      const firstSection = hardcodedSections[0];
      if (firstSection.pages && firstSection.pages.length > 0) {
        const firstPage = firstSection.pages[0];
        setSelectedSection(firstSection.id);
        setSelectedPage(firstPage.id);
        console.log('Set section and page from hardcoded data:', {
          section: firstSection.id,
          page: firstPage.id
        });
      }
    } else {
      // Ultimate fallback to common patterns
      console.warn('No sections found for module, using ultimate fallback');
      if (module === 'cmdb') {
        setSelectedSection('cmdb');
        setSelectedPage('access-cmdb');
      } else if (module === 'discovery-scan') {
        setSelectedSection('discovery-scan');
        setSelectedPage('dashboard');
      } else if (module === 'my-dashboard') {
        setSelectedSection('getting-started');
        setSelectedPage('quick-start');
      } else if (module === 'admin') {
        setSelectedSection('admin');
        setSelectedPage('organizational-details');
      } else {
        setSelectedSection('getting-started');
        setSelectedPage('quick-start');
      }
    }
  };

  const handleHomeClick = () => {
    saveScrollPosition(); // Save before going home
    setSelectedModule('');
    setSelectedSection('');
    setSelectedPage('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* AI Discovery Monitoring Dashboard (dev mode only) */}
      <AIMonitoringDashboard />
      
      <DocumentationLayout
        logo={logo}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
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
            onModuleClick={() => {
              saveScrollPosition();
              if (selectedModule === 'cmdb') {
                setSelectedSection('cmdb');
                setSelectedPage('access-cmdb');
              } else if (selectedModule === 'discovery-scan') {
                setSelectedSection('discovery-scan');
                setSelectedPage('access-dashboard');
              } else if (selectedModule === 'my-dashboard') {
                setSelectedSection('my-dashboard');
                setSelectedPage('my-dashboard-overview');
              } else if (selectedModule === 'admin') {
                setSelectedSection('admin');
                setSelectedPage('admin-functions-new');
              } else {
                setSelectedSection('application-overview');
                setSelectedPage('advanced-search');
              }
            }}
            onVersionClick={() => {
              versionDropdownTriggerRef.current?.();
            }}
          />
        )}
      </DocumentationLayout>

      {/* AI Search Dialog */}
      <AISearchDialogSimplified
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        currentModule={selectedModule}
        currentPage={selectedPage}
      />
    </div>
  );
}