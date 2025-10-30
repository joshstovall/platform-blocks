import React from 'react';

import { Flex, FlexProps } from '../Flex';

export interface RowProps extends Omit<FlexProps, 'direction'> {
  /** Override direction - defaults to 'row' but can be changed to 'row-reverse' */
  direction?: 'row' | 'row-reverse';
}

export interface ColumnProps extends Omit<FlexProps, 'direction'> {
  /** Override direction - defaults to 'column' but can be changed to 'column-reverse' */
  direction?: 'column' | 'column-reverse';
}

/**
 * Row component - alias for Flex with direction="row"
 */
export const Row: React.FC<RowProps> = ({ direction = 'row', gap = 'sm', ...props }) => {
  return <Flex direction={direction} gap={gap} {...props} />;
};

/**
 * Column component - alias for Flex with direction="column"
 */
export const Column: React.FC<ColumnProps> = ({ direction = 'column', gap = 'sm', ...props }) => {
  return <Flex direction={direction} gap={gap} {...props} />;
};

Row.displayName = 'Row';
// Column.displayName = 'Column';
