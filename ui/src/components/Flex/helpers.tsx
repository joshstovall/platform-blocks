import React from 'react';
import { View } from 'react-native';
import { Flex, FlexProps } from './Flex';

/**
 * Row component - shorthand for Flex with direction="row"
 * Automatically mirrors to row-reverse in RTL
 */
export const Row = React.forwardRef<View, Omit<FlexProps, 'direction'>>((props, ref) => {
  // @ts-expect-error - factory components handle refs differently
  return <Flex {...props} direction="row" ref={ref} />;
});

Row.displayName = 'Row';

/**
 * Column component - shorthand for Flex with direction="column"
 * Not affected by RTL (columns are vertical)
 */
export const Column = React.forwardRef<View, Omit<FlexProps, 'direction'>>((props, ref) => {
  // @ts-expect-error - factory components handle refs differently
  return <Flex {...props} direction="column" ref={ref} />;
});

Column.displayName = 'Column';
