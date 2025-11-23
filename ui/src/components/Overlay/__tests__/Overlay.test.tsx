import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { render } from '@testing-library/react-native';

import { Overlay } from '../Overlay';

const mockTheme = {
  colors: {
    primary: ['#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777'],
    secondary: ['#101010'],
  },
  backgrounds: {
    dim: '#123456',
  },
  text: {
    primary: '#000000',
  },
};

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => mockTheme,
}));

describe('Overlay - behavior', () => {
  it('resolves theme palette tokens and prioritizes backgroundOpacity', () => {
    const { getByTestId } = render(
      <Overlay
        testID="overlay"
        color="primary.6"
        opacity={0.2}
        backgroundOpacity={0.8}
      />
    );

    const style = StyleSheet.flatten(getByTestId('overlay').props.style);
    expect(style.backgroundColor).toBe('rgba(102, 102, 102, 0.8)');
  });

  it('clamps opacity extremes when values are invalid', () => {
    const { getByTestId, rerender } = render(
      <Overlay testID="overlay" opacity={-2} />
    );

    let style = StyleSheet.flatten(getByTestId('overlay').props.style);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');

    rerender(<Overlay testID="overlay" color="#ff0000" opacity={2} />);
    style = StyleSheet.flatten(getByTestId('overlay').props.style);
    expect(style.backgroundColor).toBe('rgba(255, 0, 0, 1)');
  });

  it('applies blur, gradient, and fixed positioning on web', () => {
    const originalOS = Platform.OS;
    (Platform as any).OS = 'web';

    try {
      const { getByTestId } = render(
        <Overlay
          testID="overlay"
          gradient="linear-gradient(90deg, rgba(0,0,0,0.8), transparent)"
          blur={12}
          fixed
        />
      );

      const style = StyleSheet.flatten(getByTestId('overlay').props.style);
      expect(style.backgroundImage).toBe('linear-gradient(90deg, rgba(0,0,0,0.8), transparent)');
      expect(style.backdropFilter).toContain('blur(12px)');
      expect(style.position).toBe('fixed');
      expect(style.top).toBe(0);
      expect(style.left).toBe(0);
    } finally {
      (Platform as any).OS = originalOS;
    }
  });

  it('translates radius tokens and centers children when center=true', () => {
    const { getByTestId } = render(
      <Overlay testID="overlay" radius="lg" center />
    );

    const style = StyleSheet.flatten(getByTestId('overlay').props.style);
    expect(style.borderRadius).toBe(8);
    expect(style.justifyContent).toBe('center');
    expect(style.alignItems).toBe('center');
  });
});
