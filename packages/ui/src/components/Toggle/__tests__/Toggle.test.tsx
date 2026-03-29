import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { ToggleButton, ToggleGroup } from '../Toggle';

const mockTheme = {
  colors: {
    primary: ['#F0F5FF', '#D6E4FF', '#ADC6FF', '#85A5FF', '#597EF7', '#2F54EB', '#1D39C4', '#10239E'],
    gray: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151'],
    success: ['#F0FFF4', '#C6F6D5', '#9AE6B4', '#68D391', '#48BB78', '#38A169', '#2F855A', '#276749'],
    warning: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309'],
  },
};

jest.mock('../../../core/theme', () => {
  const actual = jest.requireActual('../../../core/theme');
  return {
    ...actual,
    useTheme: () => mockTheme,
  };
});

jest.mock('../../Text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => React.createElement(Text, props, children),
  };
});

describe('Toggle - behavior', () => {
  it('calls onPress with value for standalone button', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <ToggleButton value="daily" onPress={handlePress} testID="toggle-daily">
        Daily
      </ToggleButton>
    );

    fireEvent.press(getByTestId('toggle-daily'));
    expect(handlePress).toHaveBeenCalledWith('daily');
  });

  it('does not call onPress when disabled', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <ToggleButton value="daily" onPress={handlePress} disabled testID="toggle-disabled">
        Daily
      </ToggleButton>
    );

    fireEvent.press(getByTestId('toggle-disabled'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('drives onChange in exclusive groups', () => {
    const handleChange = jest.fn();
    const { getByTestId, rerender } = render(
      <ToggleGroup exclusive value="daily" onChange={handleChange}>
        <ToggleButton value="daily" testID="exclusive-daily">Daily</ToggleButton>
        <ToggleButton value="weekly" testID="exclusive-weekly">Weekly</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('exclusive-weekly'));
    expect(handleChange).toHaveBeenCalledWith('weekly');

    handleChange.mockClear();
    rerender(
      <ToggleGroup exclusive value="weekly" onChange={handleChange}>
        <ToggleButton value="daily" testID="exclusive-daily">Daily</ToggleButton>
        <ToggleButton value="weekly" testID="exclusive-weekly">Weekly</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('exclusive-weekly'));
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('deselects and accumulates values in multi-select mode', () => {
    const handleChange = jest.fn();
    const { getByTestId, rerender } = render(
      <ToggleGroup value={['daily']} onChange={handleChange}>
        <ToggleButton value="daily" testID="multi-daily">Daily</ToggleButton>
        <ToggleButton value="weekly" testID="multi-weekly">Weekly</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('multi-weekly'));
    expect(handleChange).toHaveBeenCalledWith(['daily', 'weekly']);

    handleChange.mockClear();
    rerender(
      <ToggleGroup value={['daily', 'weekly']} onChange={handleChange}>
        <ToggleButton value="daily" testID="multi-daily">Daily</ToggleButton>
        <ToggleButton value="weekly" testID="multi-weekly">Weekly</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('multi-daily'));
    expect(handleChange).toHaveBeenCalledWith(['weekly']);
  });

  it('respects required exclusive toggles by blocking deselect', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <ToggleGroup exclusive required value="daily" onChange={handleChange}>
        <ToggleButton value="daily" testID="required-daily">Daily</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('required-daily'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('inherits disabled state from the group', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <ToggleGroup disabled value={['daily']} onChange={handleChange}>
        <ToggleButton value="daily" testID="group-disabled-daily">Daily</ToggleButton>
      </ToggleGroup>
    );

    fireEvent.press(getByTestId('group-disabled-daily'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
