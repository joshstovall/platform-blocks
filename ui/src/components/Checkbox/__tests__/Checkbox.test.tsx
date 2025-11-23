import React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

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
  const MockFieldHeader = ({ label }: { label: React.ReactNode }) => (
    React.createElement(Text, { accessibilityRole: 'text' }, label)
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

describe('Checkbox', () => {
  it('toggles state and calls onChange when pressed in uncontrolled mode', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Checkbox label="Marketing" defaultChecked={false} onChange={onChange} />
    );

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(false);

    fireEvent.press(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('honors controlled checked prop without mutating accessibility state automatically', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Checkbox label="Controlled" checked={true} onChange={onChange} />
    );

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);

    fireEvent.press(checkbox);

    expect(onChange).toHaveBeenCalledWith(false);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('reports mixed accessibility state when indeterminate', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Checkbox label="Partial" indeterminate onChange={onChange} />
    );

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe('mixed');

    fireEvent.press(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('allows clicking the label to toggle when enabled', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Checkbox label="Accept" onChange={onChange} />);

    fireEvent.press(getByText('Accept'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('prevents interaction when disabled even via label press', () => {
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <Checkbox label="Disabled" disabled defaultChecked onChange={onChange} />
    );

    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);
    fireEvent.press(getByText('Disabled'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
