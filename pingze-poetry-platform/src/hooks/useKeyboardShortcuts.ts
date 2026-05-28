import { useEffect, useCallback, useRef } from 'react';

export interface ShortcutHandler {
  combo: string;
  handler: (e: KeyboardEvent) => void;
  description?: string;
}

function normalizeCombo(key: string, ctrlKey: boolean, metaKey: boolean): string {
  const parts: string[] = [];
  if (ctrlKey || metaKey) parts.push('mod');
  if (key) parts.push(key.toLowerCase());
  return parts.join('+');
}

export function useKeyboardShortcuts(handlers: ShortcutHandler[], enabled = true) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    const combo = normalizeCombo(e.key, e.ctrlKey, e.metaKey);

    for (const handler of handlersRef.current) {
      if (handler.combo === combo) {
        if (isInput && combo !== 'mod+s' && combo !== 'mod+/' && e.key !== 'Escape' && e.key !== 'Tab') {
          continue;
        }
        e.preventDefault();
        handler.handler(e);
        break;
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export function createShortcutManager() {
  const listeners = new Map<string, Set<(e: KeyboardEvent) => void>>();

  function register(combo: string, handler: (e: KeyboardEvent) => void) {
    if (!listeners.has(combo)) {
      listeners.set(combo, new Set());
    }
    listeners.get(combo)!.add(handler);
    return () => unregister(combo, handler);
  }

  function unregister(combo: string, handler: (e: KeyboardEvent) => void) {
    const set = listeners.get(combo);
    if (set) {
      set.delete(handler);
      if (set.size === 0) listeners.delete(combo);
    }
  }

  function dispatch(e: KeyboardEvent) {
    const combo = normalizeCombo(e.key, e.ctrlKey, e.metaKey);
    const set = listeners.get(combo);
    if (set) {
      for (const handler of set) {
        handler(e);
      }
    }
  }

  return { register, unregister, dispatch };
}

export const globalShortcutManager = createShortcutManager();
