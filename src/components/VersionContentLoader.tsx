/**
 * Version Content Loader Component
 * 
 * Intelligently loads content based on version-specific architecture
 * Routes to appropriate content loading strategy (TOC-driven vs path-based)
 */

import { ReactNode } from 'react';
import { useVersionContent, useVersionStrategy } from '../utils/useVersionContent';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface VersionContentLoaderProps {
  version: string;
  moduleId: string;
  sectionId: string;
  pageId: string;
  children: (props: { filePath: string; loadedFrom: string }) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

/**
 * Main component for version-aware content loading
 */
export function VersionContentLoader({
  version,
  moduleId,
  sectionId,
  pageId,
  children,
  loadingComponent,
  errorComponent,
}: VersionContentLoaderProps) {
  const { filePath, error, loading, loadedFrom } = useVersionContent(
    version,
    moduleId,
    sectionId,
    pageId
  );
  const { isTOCDriven, strategy } = useVersionStrategy(version);

  // Loading state
  if (loading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Error state
  if (error || !filePath) {
    return (
      errorComponent || (
        <DefaultErrorComponent
          error={error || 'Content not found'}
          version={version}
          moduleId={moduleId}
          sectionId={sectionId}
          pageId={pageId}
        />
      )
    );
  }

  // Success - render children with file path
  return <>{children({ filePath, loadedFrom })}</>;
}

/**
 * Default loading component
 */
function DefaultLoadingComponent() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

/**
 * Default error component
 */
function DefaultErrorComponent({
  error,
  version,
  moduleId,
  sectionId,
  pageId,
}: {
  error: string;
  version: string;
  moduleId: string;
  sectionId: string;
  pageId: string;
}) {
  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTitle>Content Loading Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          <div className="text-sm mt-4 space-y-1">
            <p className="text-slate-600">
              <strong>Version:</strong> {version}
            </p>
            <p className="text-slate-600">
              <strong>Module:</strong> {moduleId}
            </p>
            <p className="text-slate-600">
              <strong>Section:</strong> {sectionId}
            </p>
            <p className="text-slate-600">
              <strong>Page:</strong> {pageId}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Version-specific content info badge
 */
export function VersionContentInfo({ version }: { version: string }) {
  const { isTOCDriven, strategy } = useVersionStrategy(version);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-700">
      <span className="font-medium">{version}</span>
      <span className="text-slate-400">•</span>
      <span className={isTOCDriven ? 'text-emerald-600' : 'text-amber-600'}>
        {strategy === 'toc-driven' && '📋 TOC-Driven'}
        {strategy === 'path-based' && '📁 Path-Based'}
        {strategy === 'hybrid' && '🔀 Hybrid'}
      </span>
    </div>
  );
}

/**
 * Content loading strategy indicator
 */
export function ContentLoadingIndicator({
  loadedFrom,
}: {
  loadedFrom: 'toc' | 'direct' | 'fallback';
}) {
  const labels = {
    toc: '📋 Loaded from TOC',
    direct: '📁 Direct path',
    fallback: '⚠️ Fallback mode',
  };

  const colors = {
    toc: 'text-emerald-600',
    direct: 'text-blue-600',
    fallback: 'text-amber-600',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs ${colors[loadedFrom]}`}
      title={`Content loading strategy: ${loadedFrom}`}
    >
      <span>{labels[loadedFrom]}</span>
    </div>
  );
}
