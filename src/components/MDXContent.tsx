import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getContent, hasContent } from '../content/contentLoader';
import { FeedbackSection } from './FeedbackSection';
import { ContentNotAvailable } from './ContentNotAvailable';
import { generateSlug } from '../utils/extractHeadings';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Home } from 'lucide-react';

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

  useEffect(() => {
    const loadContent = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get content from the static content loader
        const mdxContent = getContent(filePath);
        
        console.log('MDXContent - Loading file:', filePath);
        console.log('MDXContent - Content found:', mdxContent ? `Yes (${mdxContent.length} chars)` : 'No');
        
        if (mdxContent) {
          setContent(mdxContent);
        } else {
          throw new Error(`Content not found for path: ${filePath}`);
        }
      } catch (err) {
        console.error('Error loading MDX content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filePath]);

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
      <ContentNotAvailable filePath={filePath} errorDetails={error} />
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      {/* Breadcrumb Navigation */}
      {(version || module || section || page) && (
        <div className="flex flex-col gap-3 mb-8 not-prose">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={onHomeClick}
                  className="text-slate-700 hover:text-emerald-600 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {version && version.trim() !== '' && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={onVersionClick}
                      className="text-slate-700 hover:text-emerald-600 cursor-pointer"
                    >
                      {version}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {module && module.trim() !== '' && (moduleName && moduleName.trim() !== '' || module) && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={onModuleClick}
                      className="text-slate-700 hover:text-emerald-600 cursor-pointer"
                    >
                      {moduleName || module}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {section && section.trim() !== '' && (sectionName && sectionName.trim() !== '' || section) && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-slate-700 hover:text-emerald-600 cursor-pointer">
                      {sectionName || section}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {page && page.trim() !== '' && (pageName && pageName.trim() !== '' || page) && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-slate-900">
                      {pageName || page}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="text-xs text-slate-500">
            Last updated: November 10, 2025
          </span>
        </div>
      )}
      
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = generateSlug(text);
            return <h1 id={id} className="text-slate-900 mb-6" {...props} />;
          },
          h2: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = generateSlug(text);
            return <h2 id={id} className="text-slate-900 mt-12 mb-6" {...props} />;
          },
          h3: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = generateSlug(text);
            return <h3 id={id} className="text-slate-900 mt-8 mb-4" {...props} />;
          },
          p: ({ node, ...props }) => (
            <p className="text-slate-600 leading-relaxed mb-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-6 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-6 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-slate-600" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-emerald-600 hover:text-emerald-700 underline" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-slate-900" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-6" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-slate-200" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-slate-200 px-4 py-2 text-left text-slate-900" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-slate-200 px-4 py-2 text-slate-600" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      
      <FeedbackSection />
    </div>
  );
}