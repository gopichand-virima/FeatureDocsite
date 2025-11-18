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

  // Helper function to map folder names to module names
  const mapFolderToModule = (folder: string): string => {
    const folderMap: Record<string, string> = {
      'application_overview_6_1': 'application-overview',
      'my-dashboard-6_1': 'my-dashboard',
      'cmdb_6_1': 'cmdb',
      'discovery_scan_6_1': 'discovery-scan',
      'itsm_6_1': 'itsm',
      'itam_6_1': 'itam',
      'vulnerability_management-6_1': 'vulnerability-management',
      'self-service-6_1': 'self-service',
      'program-project-management-6_1': 'program-project-management',
      'risk-register-6_1': 'risk-register',
      'reports-6_1': 'reports',
      'admin_6_1': 'admin',
    };
    return folderMap[folder] || folder;
  };

  // Helper function to map file names to page/section
  const mapFileNameToPage = (fileName: string, module: string, subFolder?: string): { section: string; page: string } => {
    // Remove .mdx extension if present
    const cleanName = fileName.replace(/\.mdx$/, '').replace(/\.html$/, '');
    
    // Handle shared functions (subfolder case)
    if (subFolder === 'shared_functions_6_1') {
      // Map shared function file names to page IDs
      const sharedFunctionMap: Record<string, string> = {
        'about_common_functions_6_1': 'about-common-functions',
        'advanced_search_6_1': 'advanced-search',
        'attachments_6_1': 'attachments',
        'auto_refresh_6_1': 'auto-refresh',
        'collapse_maximize_6_1': 'collapse-maximize',
        'comments_6_1': 'comments',
        'copy_to_cherwell_6_1': 'copy-to-cherwell',
        'copy_to_ivanti_6_1': 'copy-to-ivanti',
        'copy_to_servicenow_6_1': 'copy-to-servicenow',
        'delete_remove_6_1': 'delete-remove',
        'email_prefs_6_1': 'email-preferences',
        'enable_disable_editing_6_1': 'enable-disable-editing',
        'export_6_1': 'export',
        'history_6_1': 'history',
        'import_6_1': 'import',
        'items_per_page_6_1': 'items-per-page',
        'mark_as_knowledge_6_1': 'mark-as-knowledge',
        'other_asset_info_6_1': 'other-asset-info',
        'outage_calendar_6_1': 'outage-calendar',
        'personalize_columns_6_1': 'personalize-columns',
        'print_6_1': 'print',
        'process_adm_6_1': 'process-adm',
        'process_missing_components_6_1': 'process-missing-components',
        'records_per_page_6_1': 'records-per-page',
        'reload_default_mapping_6_1': 'reload-default-mapping',
        're_scan_6_1': 're-scan',
        're_sync_data_6_1': 're-sync-data',
        'save_6_1': 'save',
        'saved_filters_6_1': 'saved-filters',
        'searching_6_1': 'searching',
        'show_main_all_properties_6_1': 'show-main-all-properties',
        'tasks_6_1': 'tasks',
        'updates_6_1': 'updates',
        'version_control_6_1': 'version-control',
        'go_to_page_6_1': 'go-to-page',
        'send_report_to_6_1': 'send-report-to',
      };
      const page = sharedFunctionMap[cleanName] || cleanName.replace(/_6_1$/, '').replace(/_/g, '-');
      return { section: 'shared-functions', page };
    }
    
    // For application overview
    if (module === 'application-overview') {
      if (cleanName === 'all_about_virima_v6_1') {
        return { section: 'application-overview', page: 'all-about-virima' };
      }
      if (cleanName === 'icons_6_1' || cleanName === 'system-icons-6_1') {
        return { section: 'application-overview', page: 'system-icons' };
      }
      if (cleanName === 'user_specific_functions_6_1') {
        return { section: 'application-overview', page: 'user-specific-functions' };
      }
      if (cleanName === 'online_help_6_1') {
        return { section: 'application-overview', page: 'online-help' };
      }
    }
    
    // For my-dashboard
    if (module === 'my-dashboard') {
      const pageMap: Record<string, string> = {
        'my-dashboard-overview-6_1': 'my-dashboard-overview',
        'dashboards-6_1': 'dashboards',
        'dashboards-contents-6_1': 'dashboards-contents',
        'dashboards-customization-6_1': 'customization',
        'dashboards-report-actions-6_1': 'report-actions',
        'system-icons-6_1': 'system-icons',
      };
      const page = pageMap[cleanName] || cleanName.replace(/-6_1$/, '');
      return { section: 'my-dashboard', page };
    }
    
    // Default: try to extract section and page from file name
    const parts = cleanName.split('_');
    if (parts.length > 1) {
      const page = parts.slice(0, -1).join('-');
      return { section: module, page };
    }
    
    return { section: module, page: cleanName.replace(/-6_1$/, '').replace(/_6_1$/, '') };
  };

  // Sync URL with state on mount and location changes
  useEffect(() => {
    // Clean up the path: remove leading slash, basename, and index.html
    let path = location.pathname
      .replace(/^\//, '')
      .replace(/^FeatureDocsite\//, '')
      .replace(/\/index\.html$/, '')
      .replace(/index\.html$/, '');
    
    if (!path || path === '' || path === 'index.html') {
      setSelectedModule('');
      setSelectedSection('');
      setSelectedPage('');
      setSelectedVersion('NextGen');
      return;
    }

    const parts = path.split('/');
    
    // Handle new URL format: /6_1/module_folder/file_name
    if (parts.length >= 1 && parts[0]) {
      const versionPart = parts[0];
      // Handle both 6_1 and 6.1 formats
      if (versionPart === '6_1' || versionPart === '6.1') {
        setSelectedVersion('6.1');
      } else if (versionPart === '6.1.1' || versionPart === '6_1_1') {
        setSelectedVersion('6.1.1');
      } else if (versionPart === '5.13' || versionPart === '5_13') {
        setSelectedVersion('5.13');
      } else {
        setSelectedVersion('NextGen');
      }
    }
    
    // New URL format: /6_1/module_folder/[subfolder/]file_name
    // Special case: /6_1/file_name (root level files like filter_by_6_1)
    if (parts.length >= 2 && parts[1]) {
      const moduleFolder = parts[1];
      
      // Check if this is a root-level file (not a module folder)
      const rootLevelFiles = ['filter_by_6_1', 'glossary_6_1', 'common_tasks_v6_6_1'];
      if (rootLevelFiles.includes(moduleFolder) && parts.length === 2) {
        // Root level file - map to application-overview > shared-functions or appropriate section
        if (moduleFolder === 'filter_by_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('shared-functions');
          setSelectedPage('filter-by');
        } else if (moduleFolder === 'glossary_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('application-overview');
          setSelectedPage('glossary');
        } else if (moduleFolder === 'common_tasks_v6_6_1') {
          setSelectedModule('application-overview');
          setSelectedSection('application-overview');
          setSelectedPage('common-tasks');
        }
        return;
      }
      
      const module = mapFolderToModule(moduleFolder);
      setSelectedModule(module);
      
      // Check if we have a subfolder (like shared_functions_6_1)
      let fileName = '';
      let subFolder = '';
      
      if (parts.length >= 4 && parts[2] === 'shared_functions_6_1') {
        // Format: /6_1/application_overview_6_1/shared_functions_6_1/file_name
        subFolder = parts[2];
        fileName = parts[3];
      } else if (parts.length >= 3) {
        // Format: /6_1/module_folder/file_name
        fileName = parts[2];
      }
      
      if (fileName) {
        const { section, page } = mapFileNameToPage(fileName, module, subFolder);
        setSelectedSection(section);
        setSelectedPage(page);
      } else {
        // Default section/page based on module
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
      }
    } else {
      // Old URL format: /6.1/module/section/page (fallback)
      if (parts.length >= 2 && parts[1]) {
        setSelectedModule(parts[1]);
      }
      if (parts.length >= 3 && parts[2]) {
        setSelectedSection(parts[2]);
      }
      if (parts.length >= 4 && parts[3]) {
        setSelectedPage(parts[3]);
      }
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

  const showHomePage = !selectedModule || selectedModule === '';

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
