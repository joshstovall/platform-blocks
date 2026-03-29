import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import { Card } from '../Card';

const mockTheme = {
  backgrounds: {
    surface: '#FFFFFF',
    border: '#E4E7EC',
    subtle: '#F8FAFC',
    elevated: '#F4F6FB',
  },
  colors: {
    primary: ['#EEF2FF', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA'],
  },
  primaryColor: '#6366F1',
  semantic: {
    borderSubtle: '#CBD5F5',
  },
  shadows: {
    xs: '0px 1px 2px rgba(16, 24, 40, 0.1)',
    sm: '0px 1px 3px rgba(16, 24, 40, 0.1)',
    md: '0px 4px 6px rgba(16, 24, 40, 0.1)',
    lg: '0px 10px 15px rgba(16, 24, 40, 0.05)',
    none: 'none',
  },
};

jest.mock('../../../core/theme', () => {
  const actual = jest.requireActual('../../../core/theme');
  return {
    ...actual,
    useTheme: () => mockTheme,
  };
});

jest.mock('../../../utils/optionalDependencies', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    resolveLinearGradient: () => ({
      LinearGradient: ({ children, ...rest }: any) => (
        React.createElement(View, { testID: 'card-gradient', ...rest }, children)
      ),
      hasLinearGradient: true,
    }),
  };
});

describe('Card - rendering', () => {
  it('matches snapshot for filled card with vertical stack', () => {
    const { toJSON } = render(
      <Card {...({ testID: 'filled-card' } as any)} p="lg" style={{ gap: 8 }}>
        <Text accessibilityRole="header">Project Alpha</Text>
        <Text>Craft delightful experiences with Platform Blocks components.</Text>
      </Card>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for gradient showcase within container', () => {
    const { toJSON } = render(
      <View style={{ padding: 24 }}>
        <Card
          {...({ testID: 'gradient-card' } as any)}
          variant="gradient"
          radius="lg"
          style={{ minHeight: 120 }}
        >
          <Text accessibilityRole="header" style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Inspiration Mode
          </Text>
          <Text style={{ color: '#EEF2FF' }}>
            Blend gradients and shadows for elevated storytelling layouts.
          </Text>
        </Card>
      </View>
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
