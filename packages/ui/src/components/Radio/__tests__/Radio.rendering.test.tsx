import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import { Radio, RadioGroup } from '../Radio';

const mockTheme = {
  colors: {
    primary: ['#EDF2FF', '#DBE4FF', '#BAC8FF', '#91A7FF', '#748FFC', '#5C7CFA', '#4C6EF5', '#3B5BDB'],
    secondary: ['#F8F9FA', '#F1F3F5', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#868E96', '#495057'],
    success: ['#EBF8EA', '#C6F6D5', '#9AE6B4', '#68D391', '#48BB78', '#38A169', '#2F855A', '#276749'],
    warning: ['#FFF9DB', '#FFF3BF', '#FFEC99', '#FFE066', '#FFD43B', '#FCC419', '#FAB005', '#F59F00'],
    error: ['#FFF5F5', '#FFE3E3', '#FFC9C9', '#FFA8A8', '#FF8787', '#FF6B6B', '#FA5252', '#F03E3E'],
    gray: ['#F8F9FA', '#F1F3F5', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#868E96', '#495057'],
  },
  text: {
    primary: '#111111',
    secondary: '#555555',
    disabled: '#9CA3AF',
  },
  spacing: {
    sm: '8',
    md: '12',
  },
};

jest.mock('../../../core/theme', () => {
  const actual = jest.requireActual('../../../core/theme');
  return {
    ...actual,
    useTheme: () => mockTheme,
  };
});

jest.mock('../../../core/providers/DirectionProvider', () => ({
  useDirection: () => ({ isRTL: false }),
}));

jest.mock('../../Text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...rest }: any) => React.createElement(Text, rest, children),
  };
});

jest.mock('../../_internal/FieldHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    FieldHeader: ({ label, description }: any) => (
      React.createElement(View, null,
        typeof label === 'string' ? React.createElement(Text, null, label) : label,
        description ? React.createElement(Text, null, description) : null
      )
    ),
  };
});

describe('Radio - rendering', () => {
  it('applies size tokens to radio control dimensions', () => {
    const { getByTestId } = render(
      <Radio value="lg" label="Large" size="lg" onChange={() => {}} testID="radio-lg" />
    );

    const styles = StyleSheet.flatten(getByTestId('radio-lg').props.style);
    expect(styles.height).toBe(28);
    expect(styles.width).toBe(28);
    expect(styles.borderRadius).toBe(14);
  });

  it('uses variant colors for checked states', () => {
    const { getByTestId } = render(
      <Radio
        value="success"
        label="Success"
        color="success"
        checked
        onChange={() => {}}
        testID="radio-success"
      />
    );

    const outerStyles = StyleSheet.flatten(getByTestId('radio-success').props.style);
    const innerChildren = React.Children.toArray(getByTestId('radio-success').props.children);
    const innerView = innerChildren.find((child): child is React.ReactElement<{ style?: any }> => (
      React.isValidElement(child) && !!(child.props as any)?.style
    ));

    if (!innerView) {
      throw new Error('Radio inner circle not found');
    }

    const innerStyles = StyleSheet.flatten(innerView.props.style);

    expect(outerStyles.borderColor).toBe(mockTheme.colors.success[6]);
    expect(innerStyles.backgroundColor).toBe(mockTheme.colors.success[6]);
  });
});

describe('RadioGroup - rendering', () => {
  it('switches layout direction and gap for horizontal orientation', () => {
    const { UNSAFE_getAllByType } = render(
      <RadioGroup
        value="basic"
        orientation="horizontal"
        gap={16}
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Pro', value: 'pro' },
        ]}
        testID="horizontal-group"
      />
    );

    const containers = UNSAFE_getAllByType(View);
    const radiogroup = containers.find(node => node.props.accessibilityRole === 'radiogroup');
    const styles = StyleSheet.flatten(radiogroup?.props.style);
    expect(styles.flexDirection).toBe('row');
    expect(styles.gap).toBe(16);
  });

  it('dims group label when disabled', () => {
    const { getByText } = render(
      <RadioGroup
        label="Choose plan"
        disabled
        value="basic"
        options={[{ label: 'Basic', value: 'basic' }]}
      />
    );

    const label = getByText('Choose plan');
    const labelStyles = StyleSheet.flatten(label.props.style);
    expect(labelStyles.color).toBe(mockTheme.text.disabled);
  });
});

describe('Radio snapshots', () => {
  it('matches snapshot for checked radios with helper text', () => {
    const { toJSON } = render(
      <Radio
        value="snap"
        label="Snapshot radio"
        description="Helper copy"
        checked
        onChange={() => {}}
        size="sm"
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for vertical RadioGroup with description and error', () => {
    const { toJSON } = render(
      <RadioGroup
        label="Subscription"
        description="Choose carefully"
        error="Selection required"
        value="monthly"
        options={[
          { label: 'Monthly', value: 'monthly' },
          { label: 'Yearly', value: 'yearly', description: 'Best value' },
        ]}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
