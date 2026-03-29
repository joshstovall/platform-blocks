import React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

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
        typeof label === 'string' ? React.createElement(Text, { accessibilityRole: 'text' }, label) : label,
        description ? React.createElement(Text, { accessibilityRole: 'text' }, description) : null
      )
    ),
  };
});

const mockIconSpy = jest.fn();

jest.mock('../../Icon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Icon: (props: { name: string }) => {
      mockIconSpy(props);
      return React.createElement(Text, { testID: `icon-${props.name}` }, props.name);
    },
  };
});

describe('Radio - behavior', () => {
  beforeEach(() => {
    mockIconSpy.mockClear();
  });

  it('fires onChange when the control is pressed', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(
      <Radio value="one" label="One" onChange={handleChange} />
    );

    fireEvent.press(getByRole('radio'));
    expect(handleChange).toHaveBeenCalledWith('one');
  });

  it('invokes onChange when the label region is pressed', () => {
    const handleChange = jest.fn();
    const { getByText } = render(
      <Radio value="label" label="Notify me" onChange={handleChange} />
    );

    fireEvent.press(getByText('Notify me'));
    expect(handleChange).toHaveBeenCalledWith('label');
  });

  it('prevents presses when disabled', () => {
    const handleChange = jest.fn();
    const { getByRole, getByText } = render(
      <Radio value="off" label="Offline" onChange={handleChange} disabled />
    );

    fireEvent.press(getByRole('radio'));
    fireEvent.press(getByText('Offline'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders description helper text when no error', () => {
    const { getByText } = render(
      <Radio
        value="help"
        label="Helpful"
        description="Small hint"
        onChange={() => {}}
      />
    );

    expect(getByText('Small hint')).toBeTruthy();
  });

  it('renders error helper text when provided', () => {
    const { getByText } = render(
      <Radio
        value="help"
        label="Helpful"
        error="Required"
        onChange={() => {}}
      />
    );

    expect(getByText('Required')).toBeTruthy();
  });

  it('renders supplied icon prop when string provided', () => {
    const { getByTestId } = render(
      <Radio value="icon" label="Icon option" icon="star" onChange={() => {}} />
    );

    expect(getByTestId('icon-star')).toBeTruthy();
    expect(mockIconSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'star' }));
  });
});

describe('RadioGroup - behavior', () => {
  it('calls onChange with option value', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <RadioGroup
        value="basic"
        onChange={handleChange}
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Pro', value: 'pro' },
        ]}
        testID="plan-group"
      />
    );

    fireEvent.press(getByTestId('plan-group-option-1'));
    expect(handleChange).toHaveBeenCalledWith('pro');
  });

  it('respects disabled options', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <RadioGroup
        value="basic"
        onChange={handleChange}
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Locked', value: 'locked', disabled: true },
        ]}
        testID="billing"
      />
    );

    fireEvent.press(getByTestId('billing-option-1'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('exposes radiogroup accessibility role and label when label is string', () => {
    const { UNSAFE_getAllByType } = render(
      <RadioGroup
        label="Choose plan"
        value="basic"
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Pro', value: 'pro' },
        ]}
      />
    );

    const viewNodes = UNSAFE_getAllByType(View);
    const radiogroup = viewNodes.find(node => node.props.accessibilityRole === 'radiogroup');
    if (!radiogroup) {
      throw new Error('radiogroup view not found');
    }
    expect(radiogroup.props.accessibilityLabel).toBe('Choose plan');
    expect(radiogroup.props.accessibilityRole).toBe('radiogroup');
  });

  it('sets checked and disabled accessibility state on child radios', () => {
    const { getAllByRole } = render(
      <RadioGroup
        value="pro"
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Pro', value: 'pro' },
          { label: 'Locked', value: 'locked', disabled: true },
        ]}
      />
    );

    const radios = getAllByRole('radio');
    expect(radios[0].props.accessibilityState).toMatchObject({ checked: false, disabled: false });
    expect(radios[1].props.accessibilityState).toMatchObject({ checked: true, disabled: false });
    expect(radios[2].props.accessibilityState).toMatchObject({ checked: false, disabled: true });
  });

  it('renders a visual asterisk for required groups', () => {
    const { getByText } = render(
      <RadioGroup
        label="Choose plan"
        required
        value="basic"
        options={[{ label: 'Basic', value: 'basic' }]}
      />
    );

    expect(getByText(/Choose plan/)).toBeTruthy();
    expect(getByText(/\*/)).toBeTruthy();
  });

  it('moves selection forward with arrow keys', () => {
    const handleChange = jest.fn();
    const preventDefault = jest.fn();
    const { getAllByRole } = render(
      <RadioGroup
        value="basic"
        onChange={handleChange}
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Pro', value: 'pro' },
        ]}
      />
    );

    fireEvent(getAllByRole('radio')[0], 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith('pro');
  });

  it('skips disabled options when navigating with arrow keys', () => {
    const handleChange = jest.fn();
    const { getAllByRole } = render(
      <RadioGroup
        value="basic"
        onChange={handleChange}
        options={[
          { label: 'Basic', value: 'basic' },
          { label: 'Disabled', value: 'disabled', disabled: true },
          { label: 'Enterprise', value: 'enterprise' },
        ]}
      />
    );

    fireEvent(getAllByRole('radio')[0], 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
    });

    expect(handleChange).toHaveBeenCalledWith('enterprise');
  });
});
