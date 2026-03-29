import React from 'react';
import { render } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

jest.mock('../../../core/theme/breakpoints', () => {
  const actual = jest.requireActual('../../../core/theme/breakpoints');
  return {
    ...actual,
    resolveResponsiveProp: jest.fn(actual.resolveResponsiveProp),
  };
});

import { Grid, GridItem } from '../Grid';
import { resolveResponsiveProp } from '../../../core/theme/breakpoints';

const resolveResponsivePropMock = resolveResponsiveProp as jest.Mock;

const flattenStyle = (style: any): Record<string, any> => {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return typeof style === 'object' ? style : {};
};

afterEach(() => {
  resolveResponsivePropMock.mockClear();
});

describe('Grid - behavior', () => {
  it('computes widths and gaps based on columns and spans', () => {
    const view = render(
      <Grid gap="md">
        <GridItem span={6}>
          <RNText>First</RNText>
        </GridItem>
        <GridItem span={3}>
          <RNText>Second</RNText>
        </GridItem>
      </Grid>
    );

    const tree = view.toJSON() as any;
    const wrapperNodes = Array.isArray(tree?.children) ? tree.children : [];
    const firstWrapperStyle = flattenStyle(wrapperNodes[0]?.props?.style);
    const secondWrapperStyle = flattenStyle(wrapperNodes[1]?.props?.style);

    expect(firstWrapperStyle.width).toBe('50%');
    expect(firstWrapperStyle.paddingHorizontal).toBe(6);
    expect(firstWrapperStyle.marginBottom).toBe(12);
    expect(secondWrapperStyle.width).toBe('25%');
  });

  it('applies fullWidth flag and spacing props to the container', () => {
    const { getByTestId } = render(
      <Grid fullWidth p="lg" testID="grid-root">
        <GridItem testID="child">
          <RNText>Only Child</RNText>
        </GridItem>
      </Grid>
    );

    const containerStyle = flattenStyle(getByTestId('grid-root').props.style);

    expect(containerStyle.width).toBe('100%');
    expect(containerStyle.paddingLeft).toBe(16);
    expect(containerStyle.paddingRight).toBe(16);
  });

  it('respects breakpoint resolver outputs when computing percentages', () => {
    resolveResponsivePropMock
      .mockImplementationOnce(() => 4) // resolvedColumns (render 1)
      .mockImplementationOnce(() => 4) // span (render 1)
      .mockImplementationOnce(() => 8) // resolvedColumns (render 2)
      .mockImplementationOnce(() => 2); // span (render 2)

    const utils = render(
      <Grid columns={{ base: 4, md: 8 }}>
        <GridItem span={{ base: 4, md: 2 }}>
          <RNText>Responsive</RNText>
        </GridItem>
      </Grid>
    );

    const getWrapperStyle = () => {
      const json = utils.toJSON() as any;
      const wrappers = Array.isArray(json?.children) ? json.children : [];
      return flattenStyle(wrappers[0]?.props?.style);
    };

    expect(getWrapperStyle().width).toBe('100%');

    utils.rerender(
      <Grid columns={{ base: 4, md: 8 }}>
        <GridItem span={{ base: 4, md: 2 }}>
          <RNText>Responsive</RNText>
        </GridItem>
      </Grid>
    );

    expect(getWrapperStyle().width).toBe('25%');
  });

  it('supports custom row gaps independent from the column gap', () => {
    const view = render(
      <Grid gap="sm" rowGap="xl">
        <GridItem span={6}>
          <RNText>With row gap</RNText>
        </GridItem>
      </Grid>
    );

    const tree = view.toJSON() as any;
    const wrapperNodes = Array.isArray(tree?.children) ? tree.children : [];
    const wrapperStyle = flattenStyle(wrapperNodes[0]?.props?.style);
    expect(wrapperStyle.marginBottom).toBe(20);
    expect(wrapperStyle.paddingHorizontal).toBe(4); // gap "sm" => 8 / 2
  });
});
