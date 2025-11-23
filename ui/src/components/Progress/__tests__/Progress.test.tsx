import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { Progress, ProgressRoot, ProgressSection, ProgressLabel } from '../Progress';

const palette = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#aaaaaa'];
const mockTheme = {
  colors: {
    primary: palette,
    secondary: palette,
    success: palette,
    warning: palette,
    error: palette,
    gray: palette,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
};

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => mockTheme,
}));

describe('Progress - behavior', () => {
  it('clamps the value and exposes it via accessibility props', () => {
    const { getByTestId } = render(<Progress value={150} testID="progress-bar" />);

    const track = getByTestId('progress-bar');
    expect(track.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 100 });
  });

  it('uses a custom hex color when provided', () => {
    const { getByTestId } = render(
      <Progress value={42} color="#123456" testID="progress-color" />
    );

    const track = getByTestId('progress-color');
    const fill = track.props.children;
    const baseStyle = Array.isArray(fill.props.style) ? fill.props.style[0] : fill.props.style;

    expect(baseStyle.backgroundColor).toBe('#123456');
  });

  it('composes sections with the provided values inside Progress.Root', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressRoot testID="segmented-progress">
        <ProgressSection value={30}>
          <ProgressLabel>30%</ProgressLabel>
        </ProgressSection>
        <ProgressSection value={70}>
          <ProgressLabel>70%</ProgressLabel>
        </ProgressSection>
      </ProgressRoot>
    );

    const sections = UNSAFE_getAllByType(View).filter(
      (instance) => instance.props.accessibilityRole === 'progressbar'
    );
    expect(sections).toHaveLength(2);
    expect(sections[0].props.accessibilityValue.now).toBe(30);
    expect(sections[1].props.accessibilityValue.now).toBe(70);
  });
});
