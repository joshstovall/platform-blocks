import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../Skeleton';
import { getHeight, getSpacing } from '../../../core/theme/sizes';

const mockTheme = {
  colors: {
    gray: ['#f5f5f5', '#e0e0e0', '#cccccc'],
  },
};

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => mockTheme,
}));

const getFlattenedStyle = (node: any) => StyleSheet.flatten(node.props.style);

describe('Skeleton - behavior', () => {
  it('renders a static rectangle when animation is disabled', () => {
    const { getByTestId } = render(
      <Skeleton
        animate={false}
        radius="sm"
        testID="skeleton-static"
        colors={['#111111', '#222222']}
      />
    );

    const skeleton = getByTestId('skeleton-static');
    const style = getFlattenedStyle(skeleton);

    expect(style.backgroundColor).toBe('#111111');
    expect(skeleton.children).toHaveLength(0);
  });

  it('applies circle defaults from the "size" token', () => {
    const { getByTestId } = render(
      <Skeleton shape="circle" size="lg" testID="skeleton-circle" />
    );

    const style = getFlattenedStyle(getByTestId('skeleton-circle'));
    const expectedSize = getHeight('lg');

    expect(style.width).toBe(expectedSize);
    expect(style.height).toBe(expectedSize);
    expect(style.borderRadius).toBe(expectedSize / 2);
  });

  it('overrides the border radius when the radius prop is provided', () => {
    const { getByTestId } = render(
      <Skeleton shape="rectangle" radius="xl" testID="skeleton-radius" />
    );

    const style = getFlattenedStyle(getByTestId('skeleton-radius'));

    expect(style.borderRadius).toBe(getSpacing('xl'));
  });

  it('uses the text presets to determine height and width', () => {
    const { getByTestId } = render(
      <Skeleton
        shape="text"
        size="sm"
        testID="skeleton-text"
        mt="lg"
      />
    );

    const style = getFlattenedStyle(getByTestId('skeleton-text'));

    expect(style.width).toBe('100%');
    expect(style.height).toBe(getSpacing('md'));
    expect(style.marginTop).toBe(getSpacing('lg'));
  });
});
