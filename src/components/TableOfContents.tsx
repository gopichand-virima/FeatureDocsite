import { useState, useEffect } from 'react';
import { extractHeadingsFromDOM, ensureHeadingIds, createHeadingObserver } from '../utils/extractHeadings';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TOCItem[];
  autoExtract?: boolean;
}

export function TableOfContents({ items, autoExtract = true }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>(items || []);

  // Auto-extract headings from DOM if enabled and no manual items provided
  useEffect(() => {
    if (autoExtract && (!items || items.length === 0)) {
      // Small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        // Ensure all headings have IDs first
        ensureHeadingIds();
        
        // Initial extraction
        const extractedHeadings = extractHeadingsFromDOM();
        setTocItems(extractedHeadings);
        
        // Set up observer for dynamic content changes
        const observer = createHeadingObserver((headings) => {
          setTocItems(headings);
        });
        
        return () => observer.disconnect();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (items) {
      setTocItems(items);
    }
  }, [items, autoExtract]);

  // Intersection Observer to track which heading is in view
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all headings
    const headingElements = document.querySelectorAll('h2[id], h3[id], h4[id]');
    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <div className="sticky top-20">
      <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm text-black-premium dark:text-white">On this page</h4>
      </div>
      {tocItems.length === 0 ? (
        <p className="text-xs text-slate-500 italic">
          No sections found on this page.
        </p>
      ) : (
        <nav className="space-y-2">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                item.level === 2 ? 'pl-2' : item.level === 3 ? 'pl-4' : 'pl-8'
              } ${
                activeId === item.id
                  ? 'text-green-600 bg-green-50 font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                  
                  // Update URL hash
                  setTimeout(() => {
                    window.history.pushState(null, '', `#${item.id}`);
                  }, 100);
                }
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}