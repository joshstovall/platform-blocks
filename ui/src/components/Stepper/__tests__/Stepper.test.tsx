import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { Stepper } from '../Stepper';

const mockTheme = {
  colors: {
    primary: ['#E6F0FF', '#D0E2FF', '#A6C8FF', '#78A9FF', '#4589FF', '#0F62FE', '#0043CE', '#002D9C'],
    gray: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151'],
  },
  text: {
    primary: '#111111',
    secondary: '#555555',
  },
};

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('../../Loader', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Loader: ({ testID = 'stepper-loader' }: { testID?: string }) => (
      React.createElement(Text, { testID }, 'loading')
    ),
  };
});

describe('Stepper - behavior', () => {
  it('invokes onStepClick for completed steps when allowed', () => {
    const handleStepClick = jest.fn();
    const { getByLabelText } = render(
      <Stepper active={1} onStepClick={handleStepClick}>
        <Stepper.Step label="One" aria-label="step-one" />
        <Stepper.Step label="Two" aria-label="step-two" />
      </Stepper>
    );

    fireEvent.press(getByLabelText('step-one'));
    expect(handleStepClick).toHaveBeenCalledWith(0);
  });

  it('blocks presses on future steps when allowNextStepsSelect=false', () => {
    const handleStepClick = jest.fn();
    const { getByLabelText } = render(
      <Stepper active={0} onStepClick={handleStepClick} allowNextStepsSelect={false}>
        <Stepper.Step label="One" aria-label="step-one" />
        <Stepper.Step label="Two" aria-label="step-two" />
      </Stepper>
    );

    fireEvent.press(getByLabelText('step-two'));
    expect(handleStepClick).not.toHaveBeenCalled();
  });

  it('renders loader inside steps marked as loading', () => {
    const { getByTestId } = render(
      <Stepper active={0}>
        <Stepper.Step label="Loading" loading />
      </Stepper>
    );

    expect(getByTestId('stepper-loader')).toBeTruthy();
  });

  it('surfaces active step content beneath the indicators', () => {
    const { getByText } = render(
      <Stepper active={1}>
        <Stepper.Step label="Intro">
          <Text>Intro content</Text>
        </Stepper.Step>
        <Stepper.Step label="Details">
          <Text>Details content</Text>
        </Stepper.Step>
      </Stepper>
    );

    expect(getByText('Details content')).toBeTruthy();
  });

  it('renders completed content when active exceeds step count', () => {
    const { getByText } = render(
      <Stepper active={2}>
        <Stepper.Step label="Intro" />
        <Stepper.Step label="Details" />
        <Stepper.Completed>
          <Text>All done!</Text>
        </Stepper.Completed>
      </Stepper>
    );

    expect(getByText('All done!')).toBeTruthy();
  });
});
