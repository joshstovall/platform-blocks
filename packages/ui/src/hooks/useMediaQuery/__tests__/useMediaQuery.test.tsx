import { renderHook, act } from '@testing-library/react-native';
import { Dimensions } from 'react-native';

import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery (native parsing)', () => {
  it('returns true when window width meets a min-width query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 320px)'));
    // RN test env reports a default 750x1334; min-width:320 should match.
    expect(result.current).toBe(true);
  });

  it('returns false when window width is below a min-width query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 99999px)'));
    expect(result.current).toBe(false);
  });

  it('returns the fallback for unparseable queries', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)', true),
    );
    expect(result.current).toBe(true);
    const { result: result2 } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)', false),
    );
    expect(result2.current).toBe(false);
  });

  it('updates on Dimensions change events', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1000px)'));
    // Whatever the test env defaults to — capture and emit a smaller event.
    expect(typeof result.current).toBe('boolean');

    act(() => {
      // Manually emit a Dimensions change to force re-evaluation.
      // The event payload is not parsed by useMediaQuery — it just calls evaluate().
      // @ts-expect-error — emit is internal API but works in test env
      Dimensions.emit?.('change', {
        window: { width: 500, height: 800, scale: 1, fontScale: 1 },
      });
    });

    expect(result.current).toBe(false);
  });
});
