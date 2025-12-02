import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateSlug } from '../utils/extractHeadings';

interface MDXRendererProps {
  content: string;
  className?: string;
}

/**
 * MDXRenderer - Enhanced Markdown/MDX rendering component
 * 
 * Features:
 * - Full GitHub Flavored Markdown (GFM) support
 * - Syntax highlighting for code blocks
 * - Auto-generated heading IDs for anchor links
 * - Responsive tables
 * - Custom styled components
 * - HTML support via rehype-raw
 */
export function MDXRenderer({ content, className = '' }: MDXRendererProps) {
  // Memoize the rendered content to avoid unnecessary re-renders
  const renderedContent = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !my-6"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            ) : (
              <code 
                className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded text-[0.875em] font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Headings with auto-generated IDs
          h1: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h1 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-3xl mb-6" 
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h2 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-2xl mt-12 mb-6" 
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h3 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-xl mt-8 mb-4" 
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h4 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-lg mt-6 mb-3" 
                {...props}
              >
                {children}
              </h4>
            );
          },
          h5: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h5 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-base mt-4 mb-2" 
                {...props}
              >
                {children}
              </h5>
            );
          },
          h6: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h6 
                id={id} 
                className="scroll-mt-24 text-slate-900 font-bold text-sm mt-4 mb-2" 
                {...props}
              >
                {children}
              </h6>
            );
          },
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-slate-700 leading-relaxed mb-4" {...props} />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="mb-6 space-y-2 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-6 space-y-2 list-decimal pl-6" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-slate-700 leading-relaxed" {...props} />
          ),
          
          // Links
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a 
                href={href}
                className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500 transition-colors"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          
          // Emphasis and strong
          em: ({ node, ...props }) => (
            <em className="italic text-slate-700" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900" {...props} />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-emerald-500 pl-6 pr-4 py-2 my-6 bg-emerald-50/50 rounded-r-lg italic text-slate-700" 
              {...props} 
            />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="virima-table-container my-8">
              <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="virima-table" {...props} />
              </div>
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="virima-table-header" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-white" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="virima-table-row" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th 
              className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider" 
              {...props} 
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 text-sm text-slate-700" {...props} />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-slate-200" {...props} />
          ),
          
          // Images
          img: ({ node, src, alt, ...props }) => (
            <img 
              src={src}
              alt={alt || ''}
              className="rounded-lg shadow-md my-6 max-w-full h-auto"
              loading="lazy"
              {...props}
            />
          ),
          
          // Task lists (GFM)
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return (
                <input 
                  type="checkbox" 
                  className="mr-2 rounded text-emerald-600 focus:ring-emerald-500"
                  disabled
                  {...props}
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content]);

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      {renderedContent}
    </div>
  );
}