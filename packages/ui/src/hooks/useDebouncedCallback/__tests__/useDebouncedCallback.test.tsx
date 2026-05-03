import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedCallback } from '../useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('delays invocation by `wait` ms', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => result.current('a'));
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('coalesces rapid calls and uses the latest args', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('cancel() prevents pending invocation', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => result.current('a'));
    act(() => {
      result.current.cancel();
      jest.advanceTimersByTime(500);
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('flush() runs immediately with the most recent args', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => result.current('a'));
    act(() => result.current('b'));
    act(() => result.current.flush());
    expect(fn).toHaveBeenCalledWith('b');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('reads the latest callback without recreating the wrapper', () => {
    const calls: string[] = [];
    const { result, rerender } = renderHook(
      ({ tag }: { tag: string }) => useDebouncedCallback((arg: string) => calls.push(`${tag}:${arg}`), 200),
      { initialProps: { tag: 'v1' } },
    );

    const wrapper = result.current;
    act(() => wrapper('first'));
    rerender({ tag: 'v2' });
    expect(result.current).toBe(wrapper); // identity stable

    act(() => {
      jest.advanceTimersByTime(200);
    });
    // Latest callback (v2) is the one that runs even though we called the wrapper before rerender
    expect(calls).toEqual(['v2:first']);
  });
});
