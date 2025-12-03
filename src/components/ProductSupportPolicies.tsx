import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { getRegisteredContent } from "../content/mdxContentRegistry";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProductSupportPoliciesProps {
  onBack: () => void;
}

export function ProductSupportPolicies({
  onBack,
}: ProductSupportPoliciesProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const policyContent = getRegisteredContent("/content/support_policy/product-support-policies.mdx");
      if (policyContent) {
        setContent(policyContent);
      }
      setLoading(false);
    };

    loadContent();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "virima-software-support-policy.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Simple Header - No gradient */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-slate-900 dark:text-white mb-1">
                Product Support Policies and Software Lifecycle
                Information
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-slate-500 dark:text-slate-400">
              Loading documentation...
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 mt-8 first:mt-0"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      id={props.children
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")}
                      className="text-2xl text-slate-900 dark:text-white mt-12 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700 scroll-mt-20"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      id={props.children
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")}
                      className="text-xl text-slate-900 dark:text-white mt-8 mb-3 scroll-mt-20"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-lg text-slate-800 dark:text-slate-200 mt-6 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-[15px]"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-outside space-y-2 text-slate-700 dark:text-slate-300 mb-6 ml-6"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-outside space-y-2 text-slate-700 dark:text-slate-300 mb-6 ml-6"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-slate-700 dark:text-slate-300 mb-1 pl-2"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="text-slate-900 dark:text-white font-semibold"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em
                      className="text-slate-700 dark:text-slate-300 italic"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-600 dark:text-slate-400 my-6"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code
                        className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-slate-900 dark:text-slate-100 font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto font-mono border border-slate-200 dark:border-slate-700"
                        {...props}
                      />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto my-6 border border-slate-200 dark:border-slate-700"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-8 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <table
                        className="min-w-full divide-y divide-slate-200 dark:divide-slate-700"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead
                      className="bg-slate-50 dark:bg-slate-800"
                      {...props}
                    />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody
                      className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700"
                      {...props}
                    />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      {...props}
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr
                      className="my-8 border-slate-200 dark:border-slate-700"
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>

            {/* Footer - Was this article helpful? */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg text-slate-900 dark:text-white mb-4">
                  Was this article helpful?
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <Button variant="outline" size="sm">
                    Yes
                  </Button>
                  <Button variant="outline" size="sm">
                    No
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  For technical support inquiries, please
                  contact{" "}
                  <a
                    href="mailto:support@virima.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@virima.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          button, .no-print {
            display: none !important;
          }
          
          .prose {
            max-width: 100% !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }
          
          table, figure, img {
            page-break-inside: avoid;
          }
          
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
}