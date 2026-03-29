import { createSelectionContract, handleSelectionComplete } from '../selection';
import type { KeyboardManagerContextValue } from '../../providers/KeyboardManagerProvider';

describe('handleSelectionComplete', () => {
  const originalRequestAnimationFrame = global.requestAnimationFrame;

  beforeEach(() => {
    global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(0);
      return 0;
    };
  });

  afterEach(() => {
    if (originalRequestAnimationFrame) {
      global.requestAnimationFrame = originalRequestAnimationFrame;
    } else {
      delete (global as unknown as { requestAnimationFrame?: typeof globalThis.requestAnimationFrame }).requestAnimationFrame;
    }
    jest.clearAllMocks();
  });

  it('refocuses immediately when preferRefocus is true', () => {
    const focusPrimary = jest.fn();
    const focusModal = jest.fn();
    const onRefocus = jest.fn();

    const result = handleSelectionComplete({
      mode: 'single',
      preferRefocus: true,
      useModal: true,
      focusCallbacks: {
        focusPrimary,
        focusModal,
      },
      onRefocus,
    });

    expect(result.refocused).toBe(true);
    expect(onRefocus).toHaveBeenCalledTimes(1);
    expect(focusModal).toHaveBeenCalledTimes(1);
    expect(focusPrimary).not.toHaveBeenCalled();
  });

  it('requests focus via keyboard manager when focusTargetId provided', () => {
    const focusPrimary = jest.fn();
    const setFocusTarget = jest.fn();
    const refocus = jest.fn();
    const keyboardManager: KeyboardManagerContextValue = {
      isKeyboardVisible: false,
      keyboardHeight: 0,
      keyboardEndCoordinates: undefined,
      keyboardAnimationDuration: 0,
      keyboardAnimationEasing: undefined,
      pendingFocusTarget: null,
  dismissKeyboard: jest.fn(),
      setFocusTarget,
      consumeFocusTarget: jest.fn(() => false),
      refocus,
    };

    const result = handleSelectionComplete({
      mode: 'single',
      preferRefocus: true,
      focusCallbacks: {
        focusPrimary,
      },
      keyboardManager,
      focusTargetId: 'field-email',
    });

    expect(result.refocused).toBe(true);
    expect(refocus).toHaveBeenCalledWith('field-email', { dismiss: false });
    expect(focusPrimary).toHaveBeenCalledTimes(1);
  });

  it('dismisses keyboard when preferRefocus is false', () => {
    const dismissKeyboard = jest.fn();
    const blurPrimary = jest.fn();
    const onBlur = jest.fn();
    const scheduler = jest.fn((cb: () => void) => cb());

    const keyboardManager: KeyboardManagerContextValue = {
      isKeyboardVisible: false,
      keyboardHeight: 0,
      keyboardEndCoordinates: undefined,
      keyboardAnimationDuration: 0,
      keyboardAnimationEasing: undefined,
      pendingFocusTarget: null,
  dismissKeyboard,
  setFocusTarget: jest.fn(),
  consumeFocusTarget: jest.fn(() => false),
  refocus: jest.fn(),
    };

    const result = handleSelectionComplete({
      mode: 'single',
      preferRefocus: false,
      keyboardManager,
      focusCallbacks: {
        blurPrimary,
      },
      onBlur,
      interactionScheduler: scheduler,
    });

    expect(result.refocused).toBe(false);
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(blurPrimary).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(dismissKeyboard).toHaveBeenCalledTimes(1);
  });

  it('defaults to refocusing in multiple mode when preference is undefined', () => {
    const focusPrimary = jest.fn();
    const onRefocus = jest.fn();

    const result = handleSelectionComplete({
      mode: 'multiple',
      focusCallbacks: {
        focusPrimary,
      },
      onRefocus,
    });

    expect(result.refocused).toBe(true);
    expect(onRefocus).toHaveBeenCalledTimes(1);
    expect(focusPrimary).toHaveBeenCalledTimes(1);
  });

  it('creates reusable selection contract with override support', () => {
    const baseFocusPrimary = jest.fn();
    const runtimeFocusPrimary = jest.fn();
    const onRefocus = jest.fn();
    const onBlur = jest.fn();
    const keyboardManager: KeyboardManagerContextValue = {
      isKeyboardVisible: false,
      keyboardHeight: 0,
      keyboardEndCoordinates: undefined,
      keyboardAnimationDuration: 0,
      keyboardAnimationEasing: undefined,
      pendingFocusTarget: null,
      dismissKeyboard: jest.fn(),
      setFocusTarget: jest.fn(),
      consumeFocusTarget: jest.fn(() => false),
      refocus: jest.fn(),
    };

    const contract = createSelectionContract({
      mode: 'single',
      focusCallbacks: {
        focusPrimary: baseFocusPrimary,
      },
      keyboardManager,
      focusTargetId: 'primary-field',
    });

    const result = contract({
      focusCallbacks: {
        focusPrimary: runtimeFocusPrimary,
      },
      onRefocus,
      onBlur,
      preferRefocus: true,
    });

    expect(result.refocused).toBe(true);
    expect(onRefocus).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();
    expect(baseFocusPrimary).not.toHaveBeenCalled();
    expect(runtimeFocusPrimary).toHaveBeenCalledTimes(1);
  expect(keyboardManager.refocus).toHaveBeenCalledWith('primary-field', { dismiss: false });
  });
});
