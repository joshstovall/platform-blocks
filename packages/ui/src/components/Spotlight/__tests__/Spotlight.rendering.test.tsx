import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Spotlight } from '../Spotlight';
import { SpotlightProvider, spotlight } from '../SpotlightStore';
import type { SpotlightItem } from '../SpotlightTypes';

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

describe('Spotlight - rendering', () => {
  it('matches snapshot for grouped actions in a modal layout', async () => {
    const actions: SpotlightItem[] = [
      {
        group: 'Navigation',
        actions: [
          { id: 'home', label: 'Go Home' },
          { id: 'reports', label: 'View Reports' },
        ],
      },
      { id: 'users', label: 'Manage Users' },
    ];

    const { toJSON } = renderSpotlight({ actions });

    act(() => {
      spotlight.open();
    });

    await waitFor(() => expect(toJSON()).toBeTruthy());
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for the empty state when no actions are provided', async () => {
    const { toJSON } = renderSpotlight({
      actions: [],
      nothingFound: 'Try another keyword',
    });

    act(() => {
      spotlight.open();
    });

    await waitFor(() => expect(toJSON()).toBeTruthy());
    expect(toJSON()).toMatchSnapshot();
  });
});
