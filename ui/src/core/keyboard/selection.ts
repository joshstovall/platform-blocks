import { InteractionManager, Keyboard, Platform } from 'react-native';
import type { KeyboardManagerContextValue } from '../providers/KeyboardManagerProvider';

export type SelectionMode = 'single' | 'multiple';

export interface SelectionFocusCallbacks {
  focusPrimary?: () => void;
  focusModal?: () => void;
  blurPrimary?: () => void;
  blurModal?: () => void;
}

export interface HandleSelectionCompleteOptions {
  mode: SelectionMode;
  preferRefocus?: boolean;
  useModal?: boolean;
  keyboardManager?: KeyboardManagerContextValue | null;
  focusCallbacks?: SelectionFocusCallbacks;
  onRefocus?: () => void;
  onBlur?: () => void;
  interactionScheduler?: (cb: () => void) => void;
  focusTargetId?: string;
}

export interface SelectionCompleteResult {
  refocused: boolean;
}

export interface SelectionContractConfig extends Omit<HandleSelectionCompleteOptions, 'onRefocus' | 'onBlur' | 'focusCallbacks'> {
  focusCallbacks?: SelectionFocusCallbacks;
}

export interface SelectionContractRunOptions {
  focusCallbacks?: SelectionFocusCallbacks;
  onRefocus?: () => void;
  onBlur?: () => void;
  preferRefocus?: boolean;
  focusTargetId?: string;
  keyboardManager?: KeyboardManagerContextValue | null;
}

export type SelectionContract = (options?: SelectionContractRunOptions) => SelectionCompleteResult;

export function resolveRefocusBehavior(options: {
  mode: SelectionMode;
  preferRefocus?: boolean;
  platform?: typeof Platform.OS;
}): boolean {
  if (typeof options.preferRefocus === 'boolean') {
    return options.preferRefocus;
  }

  if (options.mode === 'multiple') {
    return true;
  }

  const platform = options.platform ?? Platform.OS;
  return platform === 'web';
}

export function handleSelectionComplete(options: HandleSelectionCompleteOptions): SelectionCompleteResult {
  const {
    mode,
    preferRefocus,
    useModal,
    keyboardManager,
    focusCallbacks,
    onRefocus,
    onBlur,
    interactionScheduler,
    focusTargetId,
  } = options;

  const shouldRefocus = resolveRefocusBehavior({
    mode,
    preferRefocus,
  });

  if (shouldRefocus) {
    if (focusTargetId && keyboardManager) {
      keyboardManager.refocus(focusTargetId, { dismiss: false });
    }

    requestAnimationFrame(() => {
      onRefocus?.();
      if (useModal && focusCallbacks?.focusModal) {
        focusCallbacks.focusModal();
      } else {
        focusCallbacks?.focusPrimary?.();
      }
    });

    return { refocused: true };
  }

  const schedule = interactionScheduler ?? ((cb: () => void) => InteractionManager.runAfterInteractions(cb));

  schedule(() => {
    if (useModal) {
      focusCallbacks?.blurModal?.();
    }
    focusCallbacks?.blurPrimary?.();
    onBlur?.();

    if (keyboardManager) {
      keyboardManager.dismissKeyboard();
    } else {
      Keyboard.dismiss();
    }
  });

  return { refocused: false };
}

export function createSelectionContract(config: SelectionContractConfig): SelectionContract {
  return (options = {}) => {
    const {
      focusCallbacks: runtimeFocusCallbacks,
      onRefocus,
      onBlur,
      preferRefocus,
      focusTargetId,
      keyboardManager,
    } = options;

    const hasCallbacks = Boolean(config.focusCallbacks || runtimeFocusCallbacks);
    const mergedCallbacks: SelectionFocusCallbacks | undefined = hasCallbacks
      ? {
          ...config.focusCallbacks,
          ...runtimeFocusCallbacks,
        }
      : undefined;

    return handleSelectionComplete({
      ...config,
      keyboardManager: keyboardManager ?? config.keyboardManager,
      focusCallbacks: mergedCallbacks,
      onRefocus,
      onBlur,
      preferRefocus: preferRefocus ?? config.preferRefocus,
      focusTargetId: focusTargetId ?? config.focusTargetId,
    });
  };
}
