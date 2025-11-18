import { useState, useEffect, useRef } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TOCItem[]; // Optional: fallback to auto-detection if not provided
  contentSelector?: string; // CSS selector for the content area to scan
}

export function TableOfContents({ items: providedItems, contentSelector = 'article, .prose' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [items, setItems] = useState<TOCItem[]>(providedItems || []);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Auto-detect headings from the content area
  useEffect(() => {
    // If items are provided, use them; otherwise auto-detect
    if (providedItems && providedItems.length > 0) {
      setItems(providedItems);
      return;
    }

    // Function to detect headings
    const detectHeadings = () => {
      const contentArea = document.querySelector(contentSelector);
      if (!contentArea) return;

      const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const detectedItems: TOCItem[] = [];

      headings.forEach((heading) => {
        const text = heading.textContent || '';
        if (!text.trim()) return;

        let id = heading.id;
        if (!id) {
          id = generateIdFromText(text);
          heading.id = id;
        }

        // Add scroll margin for smooth scrolling with fixed header
        if (!heading.classList.contains('scroll-mt-20')) {
          heading.classList.add('scroll-mt-20');
        }

        const level = parseInt(heading.tagName.charAt(1));
        
        detectedItems.push({
          id,
          text: text.trim(),
          level,
        });
      });

      // Only update if we found headings
      if (detectedItems.length > 0) {
        setItems(detectedItems);
      }
    };

    // Initial detection
    detectHeadings();

    // Use MutationObserver to detect when content changes (for async-loaded content)
    const observer = new MutationObserver(() => {
      detectHeadings();
    });

    // Observe the content area for changes
    const contentArea = document.querySelector(contentSelector);
    if (contentArea) {
      observer.observe(contentArea, {
        childList: true,
        subtree: true,
      });
    }

    // Also check after a short delay for async-loaded content (fallback)
    const timeoutId = setTimeout(() => {
      detectHeadings();
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [providedItems, contentSelector]);

  // Set up Intersection Observer for active section tracking
  useEffect(() => {
    if (items.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with improved rootMargin for better detection
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio that's in view
        let maxRatio = 0;
        let activeEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeEntry = entry;
          }
        });

        // Also check for entries that are at the top of the viewport
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          if (rect.top <= 100 && rect.bottom >= 100) {
            activeEntry = entry;
          }
        });

        if (activeEntry) {
          setActiveId(activeEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all heading elements
    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items]);

  // Handle URL hash changes (when user navigates via URL or browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(hash);
          }, 100);
        }
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helper function to generate ID from text
  function generateIdFromText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Handle smooth scroll navigation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Update URL hash without triggering scroll
      window.history.pushState(null, '', `#${id}`);
      
      // Smooth scroll to element with offset for fixed header
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      
      // Update active state
      setActiveId(id);
      
      // Focus the heading for accessibility
      element.focus();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="sticky top-20 hidden xl:block" role="complementary" aria-label="Table of contents">
      <div className="pb-4 mb-4 border-b border-slate-200">
        <h4 className="text-sm text-black-premium font-semibold">On this page</h4>
      </div>
      <nav 
        className="space-y-2" 
        aria-label="Page sections"
        role="navigation"
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indentClass = item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : item.level === 4 ? 'pl-8' : 'pl-12';
          
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded ${indentClass} ${
                isActive
                  ? 'text-emerald-600 font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-current={isActive ? 'location' : undefined}
              aria-label={`Navigate to ${item.text} section`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
