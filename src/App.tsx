import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import logo from 'figma:asset/20803a9cc590c8a78bca4489c80f3bfca906561c.png';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVersion, setSelectedVersion] = useState('NextGen');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);

  // Sync URL with state on mount and location changes
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '');
    if (!path || path === '') {
      setSelectedModule('');
      setSelectedSection('');
      setSelectedPage('');
      return;
    }

    const parts = path.split('/');
    if (parts.length >= 1 && parts[0]) {
      const version = parts[0];
      setSelectedVersion(version === '6.1' ? '6.1' : version === '6.1.1' ? '6.1.1' : version === '5.13' ? '5.13' : 'NextGen');
    }
    if (parts.length >= 2 && parts[1]) {
      setSelectedModule(parts[1]);
    }
    if (parts.length >= 3 && parts[2]) {
      setSelectedSection(parts[2]);
    }
    if (parts.length >= 4 && parts[3]) {
      setSelectedPage(parts[3]);
    }
  }, [location]);

  // Update URL when state changes
  const updateURL = (version: string, module: string, section: string, page: string) => {
    if (!module) {
      navigate('/');
      return;
    }
    const versionPath = version === '6.1' ? '6.1' : version === '6.1.1' ? '6.1.1' : version === '5.13' ? '5.13' : 'NextGen';
    const path = `/${versionPath}/${module}${section ? `/${section}` : ''}${page ? `/${page}` : ''}`;
    navigate(path);
  };

  const showHomePage = !selectedModule;

  return (
    <div className="min-h-screen bg-white">
      <DocumentationLayout
        logo={logo}
        selectedVersion={selectedVersion}
        onVersionChange={(version) => {
          setSelectedVersion(version);
          updateURL(version, selectedModule, selectedSection, selectedPage);
        }}
        selectedModule={selectedModule}
        onModuleChange={(module) => {
          setSelectedModule(module);
          let section = '';
          let page = '';
          if (module === 'cmdb') {
            section = 'cmdb';
            page = 'access-cmdb';
          } else if (module === 'discovery-scan') {
            section = 'discovery-scan';
            page = 'access-dashboard';
          } else if (module === 'my-dashboard') {
            section = 'my-dashboard';
            page = 'my-dashboard-overview';
          } else {
            section = 'application-overview';
            page = 'advanced-search';
          }
          setSelectedSection(section);
          setSelectedPage(page);
          updateURL(selectedVersion, module, section, page);
        }}
        selectedSection={selectedSection}
        onSectionChange={(section) => {
          setSelectedSection(section);
          updateURL(selectedVersion, selectedModule, section, selectedPage);
        }}
        selectedPage={selectedPage}
        onPageChange={(page) => {
          setSelectedPage(page);
          updateURL(selectedVersion, selectedModule, selectedSection, page);
        }}
        onHomeClick={() => {
          setSelectedModule('');
          setSelectedSection('');
          setSelectedPage('');
          updateURL(selectedVersion, '', '', '');
        }}
        isHomePage={showHomePage}
        versionDropdownTriggerRef={versionDropdownTriggerRef}
      >
        {showHomePage ? (
          <HomePage onModuleSelect={(module) => {
            setSelectedModule(module);
            let section = '';
            let page = '';
            if (module === 'cmdb') {
              section = 'cmdb';
              page = 'access-cmdb';
            } else if (module === 'discovery-scan') {
              section = 'discovery-scan';
              page = 'access-dashboard';
            } else if (module === 'my-dashboard') {
              section = 'my-dashboard';
              page = 'my-dashboard-overview';
            } else {
              section = 'application-overview';
              page = 'advanced-search';
            }
            setSelectedSection(section);
            setSelectedPage(page);
            updateURL(selectedVersion, module, section, page);
          }} />
        ) : (
          <DocumentationContent
            version={selectedVersion}
            module={selectedModule}
            section={selectedSection}
            page={selectedPage}
            onHomeClick={() => {
              setSelectedModule('');
              setSelectedSection('');
              setSelectedPage('');
            }}
            onModuleClick={() => {
              let section = '';
              let page = '';
              if (selectedModule === 'cmdb') {
                section = 'cmdb';
                page = 'access-cmdb';
              } else if (selectedModule === 'discovery-scan') {
                section = 'discovery-scan';
                page = 'access-dashboard';
              } else if (selectedModule === 'my-dashboard') {
                section = 'my-dashboard';
                page = 'my-dashboard-overview';
              } else {
                section = 'application-overview';
                page = 'advanced-search';
              }
              setSelectedSection(section);
              setSelectedPage(page);
              updateURL(selectedVersion, selectedModule, section, page);
            }}
            onVersionClick={() => {
              versionDropdownTriggerRef.current?.();
            }}
          />
        )}
      </DocumentationLayout>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/FeatureDocsite">
      <AppContent />
    </BrowserRouter>
  );
}
