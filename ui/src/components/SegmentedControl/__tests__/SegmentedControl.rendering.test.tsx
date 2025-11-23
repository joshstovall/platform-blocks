import React from 'react';
import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';

import { SegmentedControl } from '../SegmentedControl';

const mockTheme = {
  colorScheme: 'light',
  colors: {
    primary: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'],
    gray: ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5F5', '#94A3B8', '#64748B'],
    surface: ['#FFFFFF'],
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#CBD5F5',
    onPrimary: '#FFFFFF',
    muted: '#64748B',
  },
};

jest.mock('../../../core/theme', () => {
  const actual = jest.requireActual('../../../core/theme');
  return {
    ...actual,
    useTheme: () => mockTheme,
  };
});

jest.mock('../../../core/motion/ReducedMotionProvider', () => ({
  useReducedMotion: () => false,
}));

jest.mock('../../../core/providers/DirectionProvider', () => ({
  useDirection: () => ({ isRTL: false }),
}));

jest.mock('../../Text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => React.createElement(Text, props, children),
  };
});

jest.mock('../../_internal/FieldHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    FieldHeader: ({ label, description }: any) => (
      React.createElement(
        View,
        null,
        label ? React.createElement(Text, null, label) : null,
        description ? React.createElement(Text, null, description) : null
      )
    ),
  };
});

describe('SegmentedControl - rendering', () => {
  it('matches snapshot for a filled segmented control with label content', () => {
    const tree = render(
      <SegmentedControl
        label="Traffic source"
        description="Last 7 days"
        variant="filled"
        color="primary.5"
        size="lg"
        autoContrast
        data={[
          { value: 'organic', label: 'Organic', testID: 'seg-organic' },
          { value: 'paid', label: 'Paid', testID: 'seg-paid' },
          { value: 'referrals', label: 'Referrals', testID: 'seg-referrals' },
        ]}
        defaultValue="paid"
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for a vertical ghost segmented control with custom labels', () => {
    const tree = render(
      <SegmentedControl
        orientation="vertical"
        withItemsBorders
        variant="ghost"
        size="sm"
        label="Notifications"
        description="Choose what to receive"
        labelPosition="left"
        fullWidth
        data={[
          { value: 'mentions', label: <RNText>Mentions</RNText>, testID: 'seg-mentions' },
          { value: 'replies', label: <RNText>Replies</RNText>, testID: 'seg-replies' },
          { value: 'follows', label: <RNText>Follows</RNText>, testID: 'seg-follows' },
        ]}
        defaultValue="replies"
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
