import { useEffect, useState } from 'react';
import { getContent } from '../content/contentLoader';
import { FeedbackSection } from './FeedbackSection';
import { ContentNotAvailable } from './ContentNotAvailable';
import { MDXRenderer } from './MDXRenderer';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Home } from 'lucide-react';
import { 
  buildBreadcrumbPath, 
  type BreadcrumbItem as HierarchicalBreadcrumbItem 
} from '../utils/hierarchicalTocLoader';

interface MDXContentProps {
  filePath: string;
  version?: string;
  module?: string;
  moduleName?: string;
  section?: string;
  sectionName?: string;
  page?: string;
  pageName?: string;
  onHomeClick?: () => void;
  onVersionClick?: () => void;
  onModuleClick?: () => void;
}

export function MDXContent({ filePath, version, module, moduleName, section, sectionName, page, pageName, onHomeClick, onVersionClick, onModuleClick }: MDXContentProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<HierarchicalBreadcrumbItem[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load content dynamically from contentLoader (async)
        const mdxContent = await getContent(filePath);
        
        console.log('MDXContent - Loading file:', filePath);
        console.log('MDXContent - Content found:', mdxContent ? `Yes (${mdxContent.length} chars)` : 'No');
        
        if (mdxContent) {
          setContent(mdxContent);
        } else {
          throw new Error(`Content not found for path: ${filePath}`);
        }

        // Load breadcrumbs if we have the necessary params
        if (version && module && section && page) {
          try {
            const breadcrumbPath = await buildBreadcrumbPath(version, module, section, page);
            setBreadcrumbs(breadcrumbPath);
          } catch (breadcrumbError) {
            console.error('Error loading breadcrumbs:', breadcrumbError);
            // Don't fail the whole component if breadcrumbs fail
            setBreadcrumbs([]);
          }
        }
      } catch (err) {
        console.error('Error loading MDX content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filePath, version, module, section, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ContentNotAvailable filePath={filePath} errorDetails={error} version={version} />
    );
  }

  // Build fallback breadcrumbs if hierarchical breadcrumbs failed
  const fallbackBreadcrumbs: HierarchicalBreadcrumbItem[] = [];
  if (version) {
    fallbackBreadcrumbs.push({ id: 'home', label: 'Home', type: 'home' });
    fallbackBreadcrumbs.push({ id: 'version', label: version, type: 'version' });
    if (moduleName) {
      fallbackBreadcrumbs.push({ id: 'module', label: moduleName, type: 'module' });
    }
    if (sectionName) {
      fallbackBreadcrumbs.push({ id: 'section', label: sectionName, type: 'section' });
    }
    if (pageName) {
      fallbackBreadcrumbs.push({ id: 'page', label: pageName, type: 'page' });
    }
  }

  // Use hierarchical breadcrumbs if available, otherwise use fallback
  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : fallbackBreadcrumbs;

  return (
    <div>
      {/* Breadcrumb Navigation - Always show if we have any breadcrumb data */}
      {displayBreadcrumbs.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              {displayBreadcrumbs.map((crumb, index) => {
                const isLast = index === displayBreadcrumbs.length - 1;
                const isHome = crumb.type === 'home';
                
                return (
                  <div key={`${crumb.type}-${index}`} className="contents">
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-slate-900">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => {
                            if (crumb.type === 'home' && onHomeClick) {
                              onHomeClick();
                            } else if (crumb.type === 'version' && onVersionClick) {
                              onVersionClick();
                            } else if (crumb.type === 'module' && onModuleClick) {
                              onModuleClick();
                            }
                          }}
                          className="text-slate-700 hover:text-emerald-600 cursor-pointer"
                        >
                          {isHome ? <Home className="w-4 h-4" /> : crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      
      <MDXRenderer content={content} />
      
      <FeedbackSection />
    </div>
  );
}