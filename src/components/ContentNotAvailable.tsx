/**
 * Content Not Available Component
 * Displays context-aware error messages with accurate file paths and registration files
 * based on the specific version and module being accessed.
 */

import { AlertTriangle } from 'lucide-react';
import { generateAccurateErrorMessage, type ContentErrorContext } from '../utils/errorMessageService';

interface ContentNotAvailableProps {
  filePath?: string;
  errorDetails?: string;
  version?: string;
  module?: string;
  section?: string;
  page?: string;
}

export function ContentNotAvailable({ 
  filePath, 
  errorDetails, 
  version, 
  module,
  section,
  page 
}: ContentNotAvailableProps) {
  // Generate context-aware error message
  const errorMessage = filePath 
    ? generateAccurateErrorMessage({
        filePath,
        version,
        module,
        section,
        page,
      })
    : null;

  return (
    <div className="border-l-4 border-l-amber-500 bg-amber-50 rounded-r-md p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <h3 className="text-amber-800 font-semibold text-lg">
            {errorMessage?.title || 'Content Not Available'}
          </h3>
          <p className="text-slate-700">
            The documentation for this page is currently being prepared.
          </p>
          {filePath && (
            <div className="space-y-2">
              <p className="text-amber-700 text-sm">
                <span className="font-semibold">File path:</span> <code className="px-1.5 py-0.5 bg-amber-100 rounded text-amber-800 font-mono text-xs">{filePath}</code>
                {errorMessage?.version && (
                  <span className="ml-2">(Version {errorMessage.version})</span>
                )}
              </p>
              {errorDetails && (
                <p className="text-amber-700 text-sm">
                  <span className="font-semibold">Error details:</span> {errorDetails}
                </p>
              )}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-slate-700 text-sm mb-2">
                <span className="font-semibold">To add this topic:</span>
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 ml-1">
                {errorMessage.instructions.map((instruction, index) => (
                  <li key={index} className="mb-1">
                    <span dangerouslySetInnerHTML={{ 
                      __html: instruction.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-amber-100 rounded text-amber-800 font-mono text-xs">$1</code>')
                    }} />
                  </li>
                ))}
              </ol>
              <div className="mt-3 pt-3 border-t border-amber-200">
                <p className="text-xs text-amber-600 italic">
                  💡 The registration file shown above is specific to {errorMessage.version} {module ? `→ ${module}` : ''} module.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}