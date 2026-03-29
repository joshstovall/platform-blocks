import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import { Checkbox } from '../Checkbox';

jest.mock('../../../core/theme', () => ({
  useTheme: () => ({
    colors: {
      primary: ['#EEE', '#DDD', '#CCC', '#BBB', '#AAA', '#999'],
      gray: ['#f8f8f8', '#f0f0f0', '#d9d9d9', '#bfbfbf', '#a6a6a6', '#8c8c8c', '#737373'],
      error: ['#fee', '#fdd', '#fbb', '#f99', '#f77', '#f55', '#d00'],
    },
    text: {
      primary: '#111',
      secondary: '#666',
      disabled: '#aaa',
      onPrimary: '#fff',
    },
  }),
}));

jest.mock('../styles', () => ({
  useCheckboxStyles: () => ({
    checkboxContainer: {},
    checkbox: {},
    checkboxInner: {},
    container: {},
    labelContainer: {},
    error: {},
  }),
}));

jest.mock('../../_internal/FieldHeader', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockFieldHeader = ({
    label,
    description,
  }: {
    label: React.ReactNode;
    description?: React.ReactNode;
  }) => (
    React.createElement(
      React.Fragment,
      null,
      React.createElement(Text, { accessibilityRole: 'text' }, label),
      description ? React.createElement(Text, { accessibilityRole: 'text' }, description) : null
    )
  );
  return { FieldHeader: MockFieldHeader };
});

jest.mock('../../Icon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = ({ name }: { name: string }) => React.createElement(Text, null, name);
  return { Icon: MockIcon };
});

jest.mock('../../Layout', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockContainer = ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children);
  return {
    Row: MockContainer,
    Column: MockContainer,
  };
});

jest.mock('../../../core/providers/DirectionProvider', () => ({
  useDirection: () => ({ isRTL: false }),
}));

describe('Checkbox rendering', () => {
  it('renders label and description text when provided', () => {
    const { getByText } = render(
      <Checkbox label="Marketing" description="Choose if you agree" />
    );

    expect(getByText('Marketing')).toBeTruthy();
    expect(getByText('Choose if you agree')).toBeTruthy();
  });

  it('shows error text inline when error prop is set', () => {
    const { getByText } = render(
      <Checkbox label="Terms" error="Required field" />
    );

    expect(getByText('Required field')).toBeTruthy();
  });

  it('renders custom children in place of label content', () => {
    const { getByTestId, queryByText } = render(
      <Checkbox>
        <Text testID="custom-label">Custom Label</Text>
      </Checkbox>
    );

    expect(getByTestId('custom-label')).toBeTruthy();
    expect(queryByText('Custom Label')).toBeTruthy();
  });

  it('renders custom indeterminate icon when provided', () => {
    const { getByTestId } = render(
      <Checkbox
        indeterminate
        indeterminateIcon={<Text testID="dash">-</Text>}
      />
    );

    expect(getByTestId('dash')).toBeTruthy();
  });
});
