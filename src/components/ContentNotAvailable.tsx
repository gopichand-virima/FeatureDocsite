/**
 * Content Not Available Component
 * Displays when documentation content is missing or being prepared
 */

import { AlertTriangle } from 'lucide-react';

interface ContentNotAvailableProps {
  filePath?: string;
  errorDetails?: string;
}

export function ContentNotAvailable({ filePath, errorDetails }: ContentNotAvailableProps) {
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
              <li>Map the topic in the respective version's <code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">index.mdx</code> file</li>
              <li>Add the import and path mapping in <code className="px-1.5 py-0.5 bg-slate-100 rounded text-amber-700">contentLoader.ts</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}