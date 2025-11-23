import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

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

const flattenStyle = (style: any): Record<string, any> => {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return typeof style === 'object' ? style : {};
};

describe('SegmentedControl - behavior', () => {
  it('selects the first enabled value by default when initial item is disabled', () => {
    const { getByTestId } = render(
      <SegmentedControl
        data={[
          { value: 'draft', label: 'Drafts', disabled: true, testID: 'seg-draft' },
          { value: 'sent', label: 'Sent', testID: 'seg-sent' },
        ]}
      />
    );

    expect(getByTestId('seg-draft').props.accessibilityState.selected).toBe(false);
    expect(getByTestId('seg-sent').props.accessibilityState.selected).toBe(true);
  });

  it('invokes onChange and updates selection in uncontrolled mode', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <SegmentedControl
        defaultValue="daily"
        onChange={handleChange}
        data={[
          { value: 'daily', label: 'Daily', testID: 'seg-daily' },
          { value: 'weekly', label: 'Weekly', testID: 'seg-weekly' },
        ]}
      />
    );

    fireEvent.press(getByTestId('seg-weekly'));
    expect(handleChange).toHaveBeenCalledWith('weekly');
    expect(getByTestId('seg-weekly').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('seg-daily').props.accessibilityState.selected).toBe(false);
  });

  it('does not emit changes when the control is readOnly', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <SegmentedControl
        readOnly
        value="daily"
        onChange={handleChange}
        data={[
          { value: 'daily', label: 'Daily', testID: 'seg-daily' },
          { value: 'weekly', label: 'Weekly', testID: 'seg-weekly' },
        ]}
      />
    );

    fireEvent.press(getByTestId('seg-weekly'));
    expect(handleChange).not.toHaveBeenCalled();
    expect(getByTestId('seg-daily').props.accessibilityState.selected).toBe(true);
  });

  it('honors the controlled value and only updates after rerender', () => {
    const handleChange = jest.fn();
    const data = [
      { value: 'monthly', label: 'Monthly', testID: 'seg-monthly' },
      { value: 'quarterly', label: 'Quarterly', testID: 'seg-quarterly' },
    ];

    const { getByTestId, rerender } = render(
      <SegmentedControl value="monthly" onChange={handleChange} data={data} />
    );

    fireEvent.press(getByTestId('seg-quarterly'));
    expect(handleChange).toHaveBeenCalledWith('quarterly');
    expect(getByTestId('seg-quarterly').props.accessibilityState.selected).toBe(false);

    rerender(<SegmentedControl value="quarterly" onChange={handleChange} data={data} />);
    expect(getByTestId('seg-quarterly').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('seg-monthly').props.accessibilityState.selected).toBe(false);
  });

  it('applies divider styles when withItemsBorders is enabled', () => {
    const { getByTestId } = render(
      <SegmentedControl
        withItemsBorders
        defaultValue="reports"
        data={[
          { value: 'overview', label: 'Overview', testID: 'seg-overview' },
          { value: 'analytics', label: 'Analytics', testID: 'seg-analytics' },
          { value: 'reports', label: 'Reports', testID: 'seg-reports' },
        ]}
      />
    );

    const firstItemStyles = flattenStyle(getByTestId('seg-overview').props.style);
    expect(firstItemStyles.borderRightWidth).toBe(StyleSheet.hairlineWidth);
    expect(firstItemStyles.borderRightColor).toBe('#CBD5F5');
  });
});
