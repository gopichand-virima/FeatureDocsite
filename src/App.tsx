import { useState, useRef } from 'react';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import logo from 'figma:asset/20803a9cc590c8a78bca4489c80f3bfca906561c.png';

export default function App() {
  const [selectedVersion, setSelectedVersion] = useState('NextGen');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);

  const showHomePage = !selectedModule;

  return (
    <div className="min-h-screen bg-white">
      <DocumentationLayout
        logo={logo}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        selectedModule={selectedModule}
        onModuleChange={(module) => {
          setSelectedModule(module);
          if (module === 'cmdb') {
            setSelectedSection('cmdb');
            setSelectedPage('access-cmdb');
          } else if (module === 'discovery-scan') {
            setSelectedSection('discovery-scan');
            setSelectedPage('access-dashboard');
          } else if (module === 'my-dashboard') {
            setSelectedSection('my-dashboard');
            setSelectedPage('my-dashboard-overview');
          } else {
            setSelectedSection('application-overview');
            setSelectedPage('advanced-search');
          }
        }}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedPage={selectedPage}
        onPageChange={setSelectedPage}
        onHomeClick={() => {
          setSelectedModule('');
          setSelectedSection('');
          setSelectedPage('');
        }}
        isHomePage={showHomePage}
        versionDropdownTriggerRef={versionDropdownTriggerRef}
      >
        {showHomePage ? (
          <HomePage onModuleSelect={(module) => {
            setSelectedModule(module);
            if (module === 'cmdb') {
              setSelectedSection('cmdb');
              setSelectedPage('access-cmdb');
            } else if (module === 'discovery-scan') {
              setSelectedSection('discovery-scan');
              setSelectedPage('access-dashboard');
            } else if (module === 'my-dashboard') {
              setSelectedSection('my-dashboard');
              setSelectedPage('my-dashboard-overview');
            } else {
              setSelectedSection('application-overview');
              setSelectedPage('advanced-search');
            }
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
              if (selectedModule === 'cmdb') {
                setSelectedSection('cmdb');
                setSelectedPage('access-cmdb');
              } else if (selectedModule === 'discovery-scan') {
                setSelectedSection('discovery-scan');
                setSelectedPage('access-dashboard');
              } else if (selectedModule === 'my-dashboard') {
                setSelectedSection('my-dashboard');
                setSelectedPage('my-dashboard-overview');
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
    </div>
  );
}
