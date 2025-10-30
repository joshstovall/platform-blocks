import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../components/Text';
import { ThemeProvider } from '../core/theme';

describe('ThemeProvider', () => {
  it('provides theme context to children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Text>Test</Text>
      </ThemeProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('supports light theme', () => {
    const { getByText } = render(
      <ThemeProvider colorScheme="light">
        <Text>Light Theme</Text>
      </ThemeProvider>
    );
    expect(getByText('Light Theme')).toBeTruthy();
  });

  it('supports dark theme', () => {
    const { getByText } = render(
      <ThemeProvider colorScheme="dark">
        <Text>Dark Theme</Text>
      </ThemeProvider>
    );
    expect(getByText('Dark Theme')).toBeTruthy();
  });
});
