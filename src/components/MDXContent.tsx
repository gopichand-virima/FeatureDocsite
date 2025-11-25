import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getContent, hasContent, getAvailablePaths } from '../content/contentLoader';
import { FeedbackSection } from './FeedbackSection';

// Helper function to generate ID from heading text
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Transform image paths for versioned content
 * Converts ../Resources/Images/... to /images_{version}/...
 * - NextGen files → /images_ng/
 * - 6_1 files → /images_6_1/
 */
function transformImagePaths(content: string, filePath: string): string {
  // Determine which image folder to use based on file path
  let imageFolder = '';
  if (filePath.startsWith('/content/NG')) {
    imageFolder = '/images_ng';
  } else if (filePath.startsWith('/content/6_1')) {
    imageFolder = '/images_6_1';
  } else if (filePath.startsWith('/content/6_1_1')) {
    imageFolder = '/images_6_1_1';
  } else if (filePath.startsWith('/content/5_13')) {
    imageFolder = '/images_5_13';
  } else {
    // No transformation for other versions or unknown paths
    return content;
  }

  // Pattern to match image markdown syntax: ![alt](path)
  // Also handles URL-encoded paths like %20 for spaces
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imagePattern, (match, altText, imagePath) => {
    try {
      // Decode URL-encoded paths (handles %20 for spaces, etc.)
      let decodedPath = decodeURIComponent(imagePath);
      
      // Check if path contains Resources/Images/ (handles both ../Resources/Images/ and Resources/Images/)
      if (decodedPath.includes('Resources/Images/')) {
        // Extract the path after Resources/Images/
        const resourcesMatch = decodedPath.match(/Resources\/Images\/(.+)$/);
        if (resourcesMatch) {
          // Reconstruct path with version-specific image folder prefix
          const relativePath = resourcesMatch[1];
          const newPath = `${imageFolder}/${relativePath}`;
          // Encode spaces and special characters, but keep slashes unencoded
          const encodedPath = newPath.split('/').map(segment => 
            segment ? encodeURIComponent(segment) : ''
          ).join('/');
          return `![${altText}](${encodedPath})`;
        }
      }
    } catch (e) {
      // If decoding fails, return original
      console.warn('Failed to transform image path:', imagePath, e);
    }
    
    // Return original if no transformation needed or if error occurred
    return match;
  });
}

interface MDXContentProps {
  filePath: string;
}

export function MDXContent({ filePath }: MDXContentProps) {
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
        
        if (mdxContent) {
          // Strip frontmatter if present (simple approach - look for --- delimiters)
          let content = mdxContent;
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
          const match = mdxContent.match(frontmatterRegex);
          if (match) {
            content = match[2]; // Use content after frontmatter
          }
          // Transform image paths for versioned content
          content = transformImagePaths(content, filePath);
          setContent(content);
        } else {
          // Content not found - this is expected for pages that fall back to DefaultContent
          // Don't throw error, just set error state (parent component will handle fallback)
          // Add debugging info in development
          if (import.meta.env.DEV) {
            const availablePaths = getAvailablePaths();
            const similarPaths = availablePaths.filter(path => {
              const fileParts = filePath.split('/').filter(Boolean);
              const pathParts = path.split('/').filter(Boolean);
              // Check if last 2-3 parts match
              const fileEnd = fileParts.slice(-2).join('/');
              const pathEnd = pathParts.slice(-2).join('/');
              return pathEnd.includes(fileEnd) || fileEnd.includes(pathEnd) || 
                     path.includes(fileParts[fileParts.length - 1]) ||
                     filePath.includes(pathParts[pathParts.length - 1]);
            });
            const errorMsg = similarPaths.length > 0
              ? `Content not found for path: ${filePath}\nSimilar paths found:\n${similarPaths.slice(0, 5).join('\n')}`
              : `Content not found for path: ${filePath}\nTotal available paths: ${availablePaths.length}`;
            console.warn('[MDXContent]', errorMsg);
            setError(errorMsg);
          } else {
            setError(`Content not found for path: ${filePath}`);
          }
        }
      } catch (err) {
        // Only log unexpected errors, not missing content
        console.error('Unexpected error loading MDX content:', err);
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
      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-amber-900 mb-2">Content Not Available</h3>
            <p className="text-sm text-amber-800 mb-2">
              The documentation for this page is currently being prepared.
            </p>
            <p className="text-xs text-amber-700 font-mono">
              File path: {filePath}
            </p>
            <p className="text-xs text-amber-600 mt-2">
              Error details: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="prose prose-slate max-w-none">
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
            h1: ({ node, children, ...props }) => {
              const text = typeof children === 'string' ? children : String(children);
              const id = generateHeadingId(text);
              return (
                <h1 id={id} className="text-slate-900 mb-6 scroll-mt-20" {...props}>
                  {children}
                </h1>
              );
            },
            h2: ({ node, children, ...props }) => {
              const text = typeof children === 'string' ? children : String(children);
              const id = generateHeadingId(text);
              return (
                <h2 id={id} className="text-slate-900 mt-12 mb-6 scroll-mt-20" {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ node, children, ...props }) => {
              const text = typeof children === 'string' ? children : String(children);
              const id = generateHeadingId(text);
              return (
                <h3 id={id} className="text-slate-900 mt-8 mb-4 scroll-mt-20" {...props}>
                  {children}
                </h3>
              );
            },
            h4: ({ node, children, ...props }) => {
              const text = typeof children === 'string' ? children : String(children);
              const id = generateHeadingId(text);
              return (
                <h4 id={id} className="text-slate-900 mt-6 mb-3 scroll-mt-20" {...props}>
                  {children}
                </h4>
              );
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
      </div>
      <FeedbackSection />
    </>
  );
}
