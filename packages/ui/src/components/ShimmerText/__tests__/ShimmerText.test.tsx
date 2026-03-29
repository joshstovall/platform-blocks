import React from 'react';
import { act, render } from '@testing-library/react-native';
import { ShimmerText } from '../ShimmerText';

const mockLinearGradientCalls: Array<Record<string, any>> = [];

jest.mock('../../../utils/optionalDependencies', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockLinearGradient = ({ children, ...props }: any) => {
    mockLinearGradientCalls.push(props);
    return React.createElement(View, { testID: 'shimmer-linear-gradient', ...props }, children);
  };

  return {
    resolveLinearGradient: () => ({
      LinearGradient: MockLinearGradient,
      hasLinearGradient: true,
    }),
  };
});

jest.mock('@react-native-masked-view/masked-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => React.createElement(View, { testID: 'shimmer-masked-view', ...props }, children);
});

beforeEach(() => {
  mockLinearGradientCalls.length = 0;
});

describe('ShimmerText - behavior', () => {
  it('renders only the base text before layout has been measured', () => {
    const { getByText, queryByTestId } = render(<ShimmerText text="Loading data" color="#333333" />);

    expect(getByText('Loading data')).toBeTruthy();
    expect(queryByTestId('shimmer-masked-view')).toBeNull();
  });

  it('creates a masked gradient overlay once layout is measured', () => {
    const { getByText, getByTestId } = render(
      <ShimmerText
        text="Revenue"
        colors={['#111111', '#777777', '#eeeeee']}
        direction="rtl"
      />
    );

    const baseText = getByText('Revenue');

    act(() => {
      baseText.props.onLayout?.({ nativeEvent: { layout: { width: 180, height: 28 } } });
    });

    expect(getByTestId('shimmer-masked-view')).toBeTruthy();
    expect(getByTestId('shimmer-linear-gradient')).toBeTruthy();
    expect(mockLinearGradientCalls.length).toBeGreaterThan(0);

    const latestCall = mockLinearGradientCalls[mockLinearGradientCalls.length - 1];
    expect(latestCall.colors).toEqual(['#111111', '#777777', '#eeeeee']);
    expect(latestCall.start).toEqual({ x: 1, y: 0.5 });
    expect(latestCall.end).toEqual({ x: 0, y: 0.5 });
  });

  it('forwards onLayout callbacks supplied via props', () => {
    const handleLayout = jest.fn();
    const { getByText } = render(<ShimmerText text="Docs" onLayout={handleLayout} />);

    const textNode = getByText('Docs');

    act(() => {
      textNode.props.onLayout?.({ nativeEvent: { layout: { width: 120, height: 18 } } });
    });

    expect(handleLayout).toHaveBeenCalled();
  });
});
