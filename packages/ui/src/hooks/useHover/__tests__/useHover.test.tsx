import { renderHook, act } from '@testing-library/react-native';
import { useHover } from '../useHover';

describe('useHover', () => {
  it('starts unhovered', () => {
    const { result } = renderHook(() => useHover());
    expect(result.current[0]).toBe(false);
  });

  it('flips to hovered on onHoverIn / onMouseEnter', () => {
    const { result } = renderHook(() => useHover());

    act(() => result.current[1].onHoverIn());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1].onHoverOut());
    expect(result.current[0]).toBe(false);

    // Aliases work too
    act(() => result.current[1].onMouseEnter());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1].onMouseLeave());
    expect(result.current[0]).toBe(false);
  });

  it('returns stable handler references', () => {
    const { result, rerender } = renderHook(() => useHover());
    const first = result.current[1];
    rerender({});
    expect(result.current[1].onHoverIn).toBe(first.onHoverIn);
    expect(result.current[1].onHoverOut).toBe(first.onHoverOut);
  });
});
