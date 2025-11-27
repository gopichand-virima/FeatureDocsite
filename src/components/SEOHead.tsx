import { useEffect } from 'react';
import { generateAIMetaTags, generateAIStructuredData, generateFAQStructuredData } from '../utils/aiOptimization';
import { useRapidIndexing } from '../utils/indexingAPI';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  module?: string;
  section?: string;
  page?: string;
  version?: string;
}

export function SEOHead({
  title = 'Virima Documentation - Official IT Management Platform Documentation',
  description = 'Comprehensive documentation for Virima IT management platform including CMDB, ITSM, Discovery, ITAM, and more.',
  keywords = ['Virima', 'ITSM', 'CMDB', 'IT management', 'documentation', 'IT asset management'],
  url = 'https://docs.virima.com',
  module,
  section,
  page,
  version
}: SEOHeadProps) {
  const { notifyUpdate } = useRapidIndexing();
  
  useEffect(() => {
    // Notify search engines on page load (for new/updated content)
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Only notify on documentation pages, not home
      if (path !== '/' && path !== '') {
        notifyUpdate(path).catch(err => console.log('Indexing notification:', err));
      }
    }
  }, [url, notifyUpdate]);
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[data-seo="true"]');
    existingScripts.forEach(script => script.remove());

    // Create and append new meta tags
    const metaTags = [
      // Standard meta tags
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: 'Virima' },
      
      // OpenGraph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Virima Documentation' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      
      // AI-specific meta tags
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      
      // AI crawler permissions
      { name: 'GPTBot', content: 'index, follow' },
      { name: 'ChatGPT-User', content: 'index, follow' },
      { name: 'anthropic-ai', content: 'index, follow' },
      { name: 'Claude-Web', content: 'index, follow' },
      { name: 'Google-Extended', content: 'index, follow' },
      
      // Content freshness
      { name: 'revisit-after', content: '1 day' },
      { httpEquiv: 'cache-control', content: 'public, max-age=3600' },
      
      // Canonical URL
      { rel: 'canonical', href: url }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if ('name' in tag) meta.setAttribute('name', tag.name);
      if ('property' in tag) meta.setAttribute('property', tag.property);
      if ('httpEquiv' in tag) meta.setAttribute('http-equiv', tag.httpEquiv);
      if ('content' in tag) meta.setAttribute('content', tag.content);
      if ('rel' in tag && 'href' in tag) {
        const link = document.createElement('link');
        link.setAttribute('rel', tag.rel);
        link.setAttribute('href', tag.href);
        link.setAttribute('data-seo', 'true');
        document.head.appendChild(link);
      } else {
        meta.setAttribute('data-seo', 'true');
        document.head.appendChild(meta);
      }
    });

    // Add Knowledge Graph structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://docs.virima.com/#website",
          "url": "https://docs.virima.com",
          "name": "Virima Documentation",
          "description": "Official documentation for Virima IT management platform",
          "publisher": {
            "@id": "https://virima.com/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://docs.virima.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://virima.com/#organization",
          "name": "Virima",
          "url": "https://virima.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://docs.virima.com/logo.png"
          },
          "sameAs": [
            "https://docs.virima.com",
            "https://support.virima.com"
          ],
          "knowsAbout": [
            "IT Service Management",
            "Configuration Management Database",
            "IT Asset Management",
            "Discovery and Dependency Mapping",
            "Vulnerability Management"
          ]
        },
        {
          "@type": "TechArticle",
          "@id": `${url}#article`,
          "headline": title,
          "description": description,
          "url": url,
          "datePublished": "2025-01-20T00:00:00Z",
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Organization",
            "name": "Virima"
          },
          "publisher": {
            "@id": "https://virima.com/#organization"
          },
          "keywords": keywords.join(', '),
          "articleSection": section || "Documentation",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-answer", ".key-steps", "h1", "h2"]
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://docs.virima.com"
            },
            ...(version ? [{
              "@type": "ListItem",
              "position": 2,
              "name": version,
              "item": `https://docs.virima.com/${version}`
            }] : []),
            ...(module ? [{
              "@type": "ListItem",
              "position": version ? 3 : 2,
              "name": module,
              "item": `https://docs.virima.com/${version || 'NextGen'}/${module}`
            }] : []),
            ...(section && section !== module ? [{
              "@type": "ListItem",
              "position": (version ? 3 : 2) + (module ? 1 : 0),
              "name": section,
              "item": `https://docs.virima.com/${version || 'NextGen'}/${module}/${section}`
            }] : [])
          ]
        }
      ]
    };

    // Add FAQ structured data if it's a documentation page
    if (page) {
      (structuredData["@graph"] as any[]).push({
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How to access ${section || module} in Virima?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": description
            }
          }
        ]
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, url, module, section, page, version]);

  return null;
}