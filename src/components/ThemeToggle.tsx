/**
 * Theme Toggle Button
 * Switches between Light, Dark, and System themes
 */

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme } from '../lib/theme/theme-provider';

export function ThemeToggle() {
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {actualTheme === 'dark' ? (
            <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 rotate-0 dark:rotate-90" />
          ) : (
            <Sun className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 rotate-0 dark:-rotate-90" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={theme === 'system' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
