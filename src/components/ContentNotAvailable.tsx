/**
 * Content Not Available Component
 * Displays when documentation content is missing or being prepared
 */

import { AlertTriangle } from 'lucide-react';

interface ContentNotAvailableProps {
  filePath?: string;
  errorDetails?: string;
  version?: string;
}

export function ContentNotAvailable({ filePath, errorDetails, version }: ContentNotAvailableProps) {
  return (
    <div className="border-l-4 border-l-amber-500 bg-amber-50 rounded-r-md p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <h3 className="text-amber-800 font-semibold text-lg">Content Not Available</h3>
          <p className="text-slate-700">
            The documentation for this page is currently being prepared.
          </p>
          {filePath && (
            <div className="space-y-2">
              <p className="text-amber-700 text-sm">
                <span className="font-semibold">File path:</span> {filePath}
                {version && ` (Version ${version})`}
              </p>
              {errorDetails && (
                <p className="text-amber-700 text-sm">
                  <span className="font-semibold">Error details:</span> {errorDetails}
                </p>
              )}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-slate-700 text-sm mb-2">
              <span className="font-semibold">To add this topic:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 ml-1">
              <li>Create the MDX file at the path shown above</li>
              <li>Update the TOC structure in <code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">/utils/indexContentMap.ts</code></li>
              <li>Register the content in the appropriate registration file:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-0.5">
                  <li><code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">/content/registerAdminModules.ts</code> for Admin module</li>
                  <li><code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">/content/registerAllContent.ts</code> for core modules</li>
                  <li><code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">/content/registerNestedContent.ts</code> for nested sections</li>
                  <li><code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">/content/registerNextGenContent.ts</code> for NextGen-specific content</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}