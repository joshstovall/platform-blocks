import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value on first render', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 200));
    expect(result.current[0]).toBe('hello');
  });

  it('updates on the first change immediately when leading is true (default)', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    expect(result.current[0]).toBe('b'); // leading edge — immediate
  });

  it('debounces subsequent changes during the cooldown window', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' }); // leading — fires immediately
    expect(result.current[0]).toBe('b');

    rerender({ value: 'c' });
    rerender({ value: 'd' });
    expect(result.current[0]).toBe('b'); // still 'b' during cooldown

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current[0]).toBe('d'); // last value flushes
  });

  it('honors leading: false — only fires after the wait expires', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200, { leading: false }),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    expect(result.current[0]).toBe('a'); // not yet

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(result.current[0]).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current[0]).toBe('b');
  });

  it('cancel() clears a pending update', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200, { leading: false }),
      { initialProps: { value: 'a' } },
    );
    rerender({ value: 'b' });

    act(() => {
      result.current[1](); // cancel
      jest.advanceTimersByTime(500);
    });

    expect(result.current[0]).toBe('a'); // never flushed
  });
});
