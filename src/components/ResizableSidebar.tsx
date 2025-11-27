import { ReactNode, useState } from 'react';
import { Resizable } from 're-resizable';

interface ResizableSidebarProps {
  children: ReactNode;
  initialWidth: number;
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
}

export function ResizableSidebar({
  children,
  initialWidth,
  onResize,
  minWidth = 200,
  maxWidth = 600,
  side = 'left',
}: ResizableSidebarProps) {
  const [isResizing, setIsResizing] = useState(false);

  const handleClasses = side === 'left' 
    ? { right: 'resize-handle-left' }
    : { left: 'resize-handle-right' };

  const handleStyles = side === 'left'
    ? {
        right: {
          width: '8px',
          right: '-4px',
          cursor: 'col-resize',
          background: 'transparent',
          zIndex: 10,
        },
      }
    : {
        left: {
          width: '8px',
          left: '-4px',
          cursor: 'col-resize',
          background: 'transparent',
          zIndex: 10,
        },
      };

  const enableConfig = side === 'left'
    ? {
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }
    : {
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      };

  return (
    <Resizable
      size={{ width: initialWidth, height: '100%' }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(e, direction, ref, d) => {
        setIsResizing(false);
        onResize(initialWidth + d.width);
      }}
      minWidth={minWidth}
      maxWidth={maxWidth}
      enable={enableConfig}
      handleStyles={handleStyles}
      handleClasses={handleClasses}
      className="hidden lg:block relative"
    >
      <div className={`h-full relative ${isResizing ? 'resizing' : ''}`}>
        {children}
        {/* Resize handle indicator */}
        <div 
          className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-transparent hover:bg-emerald-500/50 transition-all duration-200 pointer-events-none z-20 ${isResizing ? 'bg-emerald-500/50' : ''}`}
        >
          <div className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-1 h-16 bg-emerald-600/70 rounded-full transition-opacity duration-200 ${isResizing ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
      </div>
    </Resizable>
  );
}