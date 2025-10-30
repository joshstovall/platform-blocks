import React from 'react';
import { View, ViewStyle, useWindowDimensions } from 'react-native';

import { factory, Factory } from '../../core/factory';
import { SpacingProps, getSpacingStyles } from '../../core/utils/spacing';
import { getSpacing } from '../../core/theme/sizes';
import { resolveResponsiveProp } from '../../core/theme/breakpoints';
import type { GridProps, GridItemProps } from './types';
export type { GridProps, GridItemProps } from './types';

export const Grid = factory<Factory<{ props: GridProps; ref: View }>>(
  (props, ref) => {
    const { width } = useWindowDimensions();
    const {
      columns = 12,
      gap = 0,
      rowGap,
      columnGap,
      fullWidth = false,
      children,
      style,
      testID,
      ...spacingProps
    } = props;

  const resolvedColumns = resolveResponsiveProp(columns, width) ?? 12;
  const resolvedGap = getSpacing(gap);
    const resolvedRowGap = rowGap ? getSpacing(rowGap) : resolvedGap;
    const resolvedColumnGap = columnGap ? getSpacing(columnGap) : resolvedGap;

    const gridStyle: ViewStyle = {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -resolvedGap / 2,
      ...(fullWidth && { width: '100%' }),
    };

    const spacingStyle = getSpacingStyles(spacingProps);

    return (
      <View
        ref={ref}
        style={[gridStyle, spacingStyle, style]}
        testID={testID}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<GridItemProps>(child)) {
            const span = resolveResponsiveProp(child.props.span, width) || 1;
            const percentage = (span / resolvedColumns) * 100;

            return (
              <View style={{
                width: `${percentage}%`,
                paddingHorizontal: resolvedGap / 2,
                marginBottom: resolvedRowGap
              }}>
                {child}
              </View>
            );
          }
          return child;
        })}
      </View>
    );
  }
);

export const GridItem = factory<Factory<{ props: GridItemProps; ref: View }>>(
  (props, ref) => {
    const {
      children,
      style,
      testID,
      ...spacingProps
    } = props;

    const spacingStyle = getSpacingStyles(spacingProps);

    return (
      <View
        ref={ref}
        style={[spacingStyle, style, {flex: 1}]}
        testID={testID}
      >
        {children}
      </View>
    );
  }
);
