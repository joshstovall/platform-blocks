import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { ShimmerText } from '../ShimmerText';

jest.mock('../../../utils/optionalDependencies', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockLinearGradient = ({ children, ...props }: any) => (
    React.createElement(View, { testID: 'shimmer-linear-gradient', ...props }, children)
  );

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

jest.mock('../../GradientText', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GradientText: ({ children, ...props }: any) => (
      React.createElement(View, { testID: 'gradient-text', ...props }, children)
    ),
  };
});

const originalPlatformOS = Platform.OS;

afterEach(() => {
  (Platform as any).OS = originalPlatformOS;
});

describe('ShimmerText - rendering', () => {
  it('matches snapshot for the initial native render before layout is measured', () => {
    (Platform as any).OS = 'ios';

    const tree = render(
      <ShimmerText text="Loading" color="#444444" repeat={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for the web GradientText variant', () => {
    (Platform as any).OS = 'web';

    const tree = render(
      <ShimmerText
        text="Live preview"
        direction="rtl"
        spread={2.5}
        repeat={false}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
