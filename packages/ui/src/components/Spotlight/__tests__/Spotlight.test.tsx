import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Spotlight } from '../Spotlight';
import { SpotlightProvider, spotlight } from '../SpotlightStore';
import type { SpotlightActionData, SpotlightItem } from '../SpotlightTypes';

const mockTheme = {
  colorScheme: 'light',
  text: { primary: '#111111', secondary: '#666666' },
  colors: {
    primary: ['#000', '#111', '#222', '#333', '#444', '#555', '#666'],
    gray: ['#fafafa', '#f0f0f0', '#e0e0e0', '#cccccc', '#bbbbbb', '#999999'],
    surface: ['#ffffff', '#f7f7f7'],
  },
};

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('../../../core/providers/KeyboardManagerProvider', () => ({
  useKeyboardManagerOptional: () => null,
}));

jest.mock('../../../hooks/useHotkeys', () => ({
  useGlobalHotkeys: jest.fn(),
  useHotkeys: jest.fn(),
  useEscapeKey: jest.fn(),
}));

jest.mock('../../Dialog', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Dialog: ({ children, ...props }: any) => (
      <View accessibilityRole="dialog" {...props}>{children}</View>
    ),
  };
});

jest.mock('../../Block', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Block: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('../../Icon/Icon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Icon: ({ children, ...props }: any) => <View accessibilityRole="image" {...props}>{children}</View>,
  };
});

jest.mock('../../Text/Text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock('../../Highlight', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Highlight: ({ children, style }: any) => <Text style={style}>{children}</Text>,
  };
});

const ensureWindow = () => {
  if (typeof window === 'undefined') {
    (global as any).window = {};
  }

  if (!window.addEventListener) {
    window.addEventListener = jest.fn();
  }

  if (!window.removeEventListener) {
    window.removeEventListener = jest.fn();
  }
};

ensureWindow();

if (typeof global.requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (cb: (...args: any[]) => void) => setTimeout(cb, 0);
}

const renderSpotlight = (props: { actions: SpotlightItem[] } & Partial<React.ComponentProps<typeof Spotlight>>) => (
  render(
    <SpotlightProvider>
      <Spotlight {...props} />
    </SpotlightProvider>
  )
);

afterEach(() => {
  act(() => {
    spotlight.close();
  });
});

describe('Spotlight - behavior', () => {
  it('filters actions by query and executes the selected action on Enter', async () => {
    const actionSpy = jest.fn();
    const actions: SpotlightActionData[] = [
      { id: 'docs', label: 'View Docs' },
      { id: 'settings', label: 'Open Settings', description: 'Navigate to app settings', onPress: actionSpy },
    ];

    const { getByPlaceholderText, getByText } = renderSpotlight({
      actions,
      nothingFound: 'No results',
    });

    act(() => {
      spotlight.open();
    });

    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'settings');

    expect(getByText('Open Settings')).toBeTruthy();

    fireEvent(searchInput, 'onKeyPress', {
      nativeEvent: { key: 'Enter' },
      preventDefault: jest.fn(),
    });

    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  it('honors the limit prop by flattening actions and omitting group headers', () => {
    const groupedActions: SpotlightItem[] = [
      {
        group: 'Guides',
        actions: [
          { id: 'intro', label: 'Getting Started' },
          { id: 'theme', label: 'Theme Overview' },
        ],
      },
      { id: 'cta', label: 'Jump to CTA' },
    ];

    const { getByText, queryByText } = renderSpotlight({ actions: groupedActions, limit: 2 });

    act(() => {
      spotlight.open();
    });

    expect(getByText('Getting Started')).toBeTruthy();
    expect(getByText('Theme Overview')).toBeTruthy();
    expect(queryByText('Guides')).toBeNull();
    expect(queryByText('Jump to CTA')).toBeNull();
  });
});
