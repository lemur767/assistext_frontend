import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: () => void,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
      
      if (
        key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!ctrlKey === !!shortcut.ctrlKey &&
        !!shiftKey === !!shortcut.shiftKey &&
        !!altKey === !!shortcut.altKey &&
        !!metaKey === !!shortcut.metaKey
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, deps);
}