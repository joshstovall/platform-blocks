import { useEffect, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';

export type KeyboardModifiers = {
  /** Whether the Alt key is pressed */
  alt?: boolean;
  /** Whether the Ctrl key is pressed */
  ctrl?: boolean;
  /** Whether the Meta (Cmd) key is pressed */
  meta?: boolean;
  /** Whether the Shift key is pressed */
  shift?: boolean;
};

export type HotkeyItem = [
  /** key combination like 'mod+k', 'escape', 'ctrl+j' */
  string,
  /** handler function */
  (event: KeyboardEvent) => void,
  /** optional modifiers override */
  KeyboardModifiers?,
  /** optional description */
  string[]?
];

// Parse hotkey string into modifiers and key
function parseHotkey(hotkey: string): { modifiers: KeyboardModifiers; key: string } {
  const keys = hotkey.toLowerCase().split('+');
  const key = keys[keys.length - 1];
  const modifiers: KeyboardModifiers = {};

  for (let i = 0; i < keys.length - 1; i++) {
    const modifier = keys[i];
    switch (modifier) {
      case 'mod':
        // 'mod' maps to cmd on Mac, ctrl on others
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
          const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
          if (isMac) {
            modifiers.meta = true;
          } else {
            modifiers.ctrl = true;
          }
        } else {
          modifiers.ctrl = true;
        }
        break;
      case 'ctrl':
        modifiers.ctrl = true;
        break;
      case 'alt':
        modifiers.alt = true;
        break;
      case 'meta':
      case 'cmd':
        modifiers.meta = true;
        break;
      case 'shift':
        modifiers.shift = true;
        break;
    }
  }

  return { modifiers, key };
}

// Check if event matches the hotkey
function matchesHotkey(
  event: KeyboardEvent,
  modifiers: KeyboardModifiers,
  key: string
): boolean {
  // Check key match (case insensitive)
  if (event.key.toLowerCase() !== key.toLowerCase()) {
    return false;
  }

  // Check modifiers
  if (!!modifiers.alt !== !!event.altKey) return false;
  if (!!modifiers.ctrl !== !!event.ctrlKey) return false;
  if (!!modifiers.meta !== !!event.metaKey) return false;
  if (!!modifiers.shift !== !!event.shiftKey) return false;

  return true;
}

// Main useHotkeys hook
export function useHotkeys(
  hotkeys: HotkeyItem[],
  dependencies: React.DependencyList = []
) {
  const hotkeyRefs = useRef<HotkeyItem[]>([]);
  
  // Update refs when dependencies change
  useEffect(() => {
    hotkeyRefs.current = hotkeys;
  }, dependencies);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger hotkeys when user is typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Exception: allow escape key to work in input fields
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const [hotkeyString, handler, customModifiers] of hotkeyRefs.current) {
        const { modifiers, key } = parseHotkey(hotkeyString);
        const finalModifiers = customModifiers || modifiers;

        if (matchesHotkey(event, finalModifiers, key)) {
          event.preventDefault();
          event.stopPropagation();
          handler(event);
          break; // Only trigger first matching hotkey
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Global hotkey manager
class GlobalHotkeyManager {
  private hotkeys: Map<string, HotkeyItem> = new Map();
  private isListening = false;
  private currentAppState: AppStateStatus | 'active' | 'background' = 'active';
  private appStateSubscription?: { remove?: () => void } | (() => void);
  private visibilityCleanup?: () => void;

  constructor() {
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        this.currentAppState = document.hidden ? 'background' : 'active';
        const handleVisibility = () => {
          this.currentAppState = document.hidden ? 'background' : 'active';
          this.syncListening();
        };
        document.addEventListener('visibilitychange', handleVisibility, { passive: true } as any);
        this.visibilityCleanup = () => document.removeEventListener('visibilitychange', handleVisibility);
      }
    } else if (typeof AppState?.addEventListener === 'function') {
      try {
        const state = AppState.currentState;
        if (state) {
          this.currentAppState = state;
        }
      } catch {
        this.currentAppState = 'active';
      }

      const subscriber = AppState.addEventListener('change', this.handleAppStateChange);
      this.appStateSubscription = subscriber ?? undefined;
    }
  }

  register(id: string, hotkey: HotkeyItem) {
    this.hotkeys.set(id, hotkey);
    this.syncListening();
  }

  unregister(id: string) {
    this.hotkeys.delete(id);
    this.syncListening();
  }

  private handleAppStateChange = (nextState: AppStateStatus) => {
    this.currentAppState = nextState;
    this.syncListening();
  };

  private isForeground() {
    return this.currentAppState === 'active' || (this.currentAppState as string) === 'foreground';
  }

  private syncListening() {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const shouldListen = this.hotkeys.size > 0 && this.isForeground();
    if (shouldListen && !this.isListening) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    } else if (!shouldListen && this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger hotkeys when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // Exception: allow escape key to work in input fields
      if (event.key !== 'Escape') {
        return;
      }
    }

    for (const [hotkeyString, handler, customModifiers] of this.hotkeys.values()) {
      const { modifiers, key } = parseHotkey(hotkeyString);
      const finalModifiers = customModifiers || modifiers;

      if (matchesHotkey(event, finalModifiers, key)) {
        event.preventDefault();
        event.stopPropagation();
        handler(event);
        break;
      }
    }
  };

  dispose() {
    if (Platform.OS === 'web' && typeof document !== 'undefined' && this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }

    if (typeof this.visibilityCleanup === 'function') {
      this.visibilityCleanup();
      this.visibilityCleanup = undefined;
    }

    if (this.appStateSubscription) {
      if (typeof (this.appStateSubscription as any)?.remove === 'function') {
        (this.appStateSubscription as any).remove();
      } else if (typeof this.appStateSubscription === 'function') {
        (this.appStateSubscription as () => void)();
      }
      this.appStateSubscription = undefined;
    }
  }
}

export const globalHotkeys = new GlobalHotkeyManager();

// Hook for global hotkeys that persist across component unmounts
export function useGlobalHotkeys(id: string, hotkey: HotkeyItem) {
  useEffect(() => {
    globalHotkeys.register(id, hotkey);
    return () => globalHotkeys.unregister(id);
  }, [id, hotkey[0], hotkey[1], hotkey[2], hotkey[3]]);
}

// Convenience hooks for common patterns
export function useEscapeKey(handler: () => void, enabled = true) {
  useHotkeys(
    enabled ? [['escape', handler]] : [],
    [handler, enabled]
  );
}

export function useToggleColorScheme(handler: () => void, enabled = true) {
  useHotkeys(
    enabled ? [['ctrl+j', handler]] : [],
    [handler, enabled]
  );
}

export function useSpotlightToggle(handler: () => void, enabled = true) {
  useGlobalHotkeys('spotlight-toggle', ['mod+k', handler]);
}
