import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../core';
import { useDirection } from '../../core/providers/DirectionProvider';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Text } from '../Text';

export interface TableData {
  head?: React.ReactNode[];
  body?: React.ReactNode[][];
  foot?: React.ReactNode[];
  caption?: React.ReactNode;
}

export interface TableProps extends SpacingProps {
  children?: React.ReactNode;
  /** Table data for automatic generation of rows */
  data?: TableData;
  /** Horizontal spacing between cells */
  horizontalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Vertical spacing between cells */
  verticalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Add striped styling to rows */
  striped?: boolean;
  /** Highlight rows on hover/press */
  highlightOnHover?: boolean;
  /** Add borders around table */
  withTableBorder?: boolean;
  /** Add borders between columns */
  withColumnBorders?: boolean;
  /** Add borders between rows */
  withRowBorders?: boolean;
  /** Caption position */
  captionSide?: 'top' | 'bottom';
  /** Table layout mode */
  layout?: 'auto' | 'fixed';
  /** Variant of table layout */
  variant?: 'default' | 'vertical';
  /** Enable tabular numbers for better number alignment */
  tabularNums?: boolean;
  /** Make table take full width of container */
  fullWidth?: boolean;
  /** Column width configuration for auto-sizing */
  columns?: Array<{
    /** Column key for identification */
    key?: string;
    /** Column width strategy */
    width?: number | string | 'auto' | 'min-content' | 'max-content';
    /** Minimum column width */
    minWidth?: number;
    /** Maximum column width */
    maxWidth?: number;
    /** Flex grow factor */
    flex?: number;
  }>;
  /** Additional styles */
  style?: any;
}

export interface TableScrollContainerProps extends SpacingProps {
  children?: React.ReactNode;
  /** Minimum width before scrolling kicks in */
  minW?: number;
  /** Maximum height before vertical scrolling */
  maxH?: number;
  /** Scroll type for web */
  type?: 'native' | 'custom';
  style?: any;
  [key: string]: any;
}

export interface TableSectionProps extends SpacingProps {
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

export interface TableRowProps extends SpacingProps {
  children?: React.ReactNode;
  /** Background color override */
  bg?: string;
  /** Row selection state */
  selected?: boolean;
  /** Press handler */
  onPress?: () => void;
  style?: any;
  [key: string]: any;
}

export interface TableCellProps extends SpacingProps {
  children?: React.ReactNode;
  /** Cell width (useful for fixed layout) */
  w?: number | string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Minimum width for auto-sizing */
  minW?: number;
  /** Maximum width for auto-sizing */
  maxW?: number;
  /** Flex grow factor for flexible sizing */
  flex?: number;
  /** Width strategy for responsive behavior */
  widthStrategy?: 'auto' | 'min-content' | 'max-content' | 'fixed';
  style?: any;
  [key: string]: any;
}

const getSpacingValue = (spacing: TableProps['horizontalSpacing'], theme: any): number => {
  if (typeof spacing === 'number') return spacing;

  const spacingMap = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20
  };

  return spacingMap[spacing as keyof typeof spacingMap] || 12;
};

// Table Cell Components
export const TableTh: React.FC<TableCellProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, w, align = 'left', minW, maxW, flex, widthStrategy = 'auto', style } = otherProps;
  const theme = useTheme();
  const { isRTL } = useDirection();

  // Swap alignment in RTL
  const effectiveAlign = (() => {
    if (align === 'center') return 'center';
    if (align === 'left') return isRTL ? 'right' : 'left';
    if (align === 'right') return isRTL ? 'left' : 'right';
    return align;
  })();

  // Calculate cell style based on width strategy and props
  const getCellWidth = () => {
    if (w) return { width: w };
    
    const widthStyle: any = {};
    
    if (flex !== undefined) {
      widthStyle.flex = flex;
    } else if (widthStrategy === 'min-content') {
      widthStyle.flex = 0;
      widthStyle.flexShrink = 0;
    } else if (widthStrategy === 'max-content') {
      widthStyle.flex = 1;
    } else if (widthStrategy === 'auto') {
      widthStyle.flex = 1;
    }
    
    if (minW) widthStyle.minWidth = minW;
    if (maxW) widthStyle.maxWidth = maxW;
    
    return widthStyle;
  };

  const cellStyle = [
    styles.th,
    {
      backgroundColor: theme.colorScheme === 'dark' ? '#2d3748' : '#f7fafc',
      borderColor: theme.colorScheme === 'dark' ? '#4a5568' : '#e2e8f0',
      ...getCellWidth()
    },
    effectiveAlign !== 'left' && { alignItems: effectiveAlign === 'center' ? 'center' : 'flex-end' },
    getSpacingStyles(spacingProps),
    style
  ];

  return (
    <View style={cellStyle}>
      <Text
        variant="p"
        weight="semibold"
        style={{
          textAlign: effectiveAlign,
          color: theme.text.primary
        }}
      >
        {children}
      </Text>
    </View>
  );
};

export const TableTd: React.FC<TableCellProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, w, align = 'left', minW, maxW, flex, widthStrategy = 'auto', style } = otherProps;
  const theme = useTheme();
  const { isRTL } = useDirection();

  // Swap alignment in RTL
  const effectiveAlign = (() => {
    if (align === 'center') return 'center';
    if (align === 'left') return isRTL ? 'right' : 'left';
    if (align === 'right') return isRTL ? 'left' : 'right';
    return align;
  })();

  // Calculate cell style based on width strategy and props
  const getCellWidth = () => {
    if (w) return { width: w };
    
    const widthStyle: any = {};
    
    if (flex !== undefined) {
      widthStyle.flex = flex;
    } else if (widthStrategy === 'min-content') {
      widthStyle.flex = 0;
      widthStyle.flexShrink = 0;
    } else if (widthStrategy === 'max-content') {
      widthStyle.flex = 1;
    } else if (widthStrategy === 'auto') {
      widthStyle.flex = 1;
    }
    
    if (minW) widthStyle.minWidth = minW;
    if (maxW) widthStyle.maxWidth = maxW;
    
    return widthStyle;
  };

  const cellStyle = [
    styles.td,
    {
      borderColor: theme.colorScheme === 'dark' ? '#4a5568' : '#e2e8f0',
      ...getCellWidth()
    },
    effectiveAlign !== 'left' && { alignItems: effectiveAlign === 'center' ? 'center' : 'flex-end' },
    getSpacingStyles(spacingProps),
    style
  ];

  return (
    <View style={cellStyle}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text
          variant="p"
          style={{
            textAlign: effectiveAlign,
            color: theme.text.primary
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

// Table Row Component
export const TableTr: React.FC<TableRowProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, bg, selected, onPress, style, hoverable } = otherProps as any;
  const theme = useTheme();

  const rowStyle = [
    styles.tr,
    bg && { backgroundColor: bg },
    selected && {
      backgroundColor: theme.colorScheme === 'dark' ? '#4299e1' : '#bee3f8'
    },
    hoverable && Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'background-color 120ms ease',
    },
    getSpacingStyles(spacingProps),
    style
  ];

  if (onPress) {
    // For interactive rows, we'd need TouchableOpacity
    // For now, just render as View
    return (
      <View style={rowStyle}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={rowStyle}
      // For web, emulate hover by using onMouseEnter/Leave to set state background if not provided
      {...(Platform.OS === 'web' && hoverable ? {
        onMouseEnter: (e: any) => {
          (e.currentTarget as any).style.backgroundColor = selected
            ? (theme.colorScheme === 'dark' ? '#2b5d85' : '#a9d8f2')
            : (theme.colorScheme === 'dark' ? '#2d3748' : '#f1f5f9');
        },
        onMouseLeave: (e: any) => {
          (e.currentTarget as any).style.backgroundColor = selected
            ? (theme.colorScheme === 'dark' ? '#4299e1' : '#bee3f8')
            : (bg || 'transparent');
        }
      } : {})}
    >
      {children}
    </View>
  );
};

// Table Section Components
export const TableThead: React.FC<TableSectionProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, style } = otherProps;

  return (
    <View style={[styles.thead, getSpacingStyles(spacingProps), style]}>
      {children}
    </View>
  );
};

export const TableTbody: React.FC<TableSectionProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, style } = otherProps;

  return (
    <View style={[styles.tbody, getSpacingStyles(spacingProps), style]}>
      {children}
    </View>
  );
};

export const TableTfoot: React.FC<TableSectionProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, style } = otherProps;

  return (
    <View style={[styles.tfoot, getSpacingStyles(spacingProps), style]}>
      {children}
    </View>
  );
};

export const TableCaption: React.FC<TableSectionProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, style } = otherProps;
  const theme = useTheme();

  return (
    <View style={[styles.caption, getSpacingStyles(spacingProps), style]}>
      <Text
        variant="small"
        colorVariant="secondary"
        style={{ textAlign: 'center' }}
      >
        {children}
      </Text>
    </View>
  );
};

// Scroll Container Component
export const TableScrollContainer: React.FC<TableScrollContainerProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, minW = 500, maxH, type = 'native', style } = otherProps;

  const containerStyle = [
    {
      width: '100%',
      maxHeight: maxH
    },
    getSpacingStyles(spacingProps),
    style
  ];

  const scrollViewStyle = minW ? { minWidth: minW } : undefined;

  return (
    <View style={containerStyle}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={scrollViewStyle}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          {children}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

// Main Table Component
export const Table: React.FC<TableProps> & {
  Th: typeof TableTh;
  Td: typeof TableTd;
  Tr: typeof TableTr;
  Thead: typeof TableThead;
  Tbody: typeof TableTbody;
  Tfoot: typeof TableTfoot;
  Caption: typeof TableCaption;
  ScrollContainer: typeof TableScrollContainer;
} = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const {
    children,
    data,
    horizontalSpacing = 'md',
    verticalSpacing = 'sm',
    striped = false,
    highlightOnHover = false,
    withTableBorder = false,
    withColumnBorders = false,
    withRowBorders = false,
    captionSide = 'bottom',
    layout = 'auto',
    variant = 'default',
    tabularNums = false,
    fullWidth = false,
    columns = [],
    style
  } = otherProps;

  const theme = useTheme();
  const hSpacing = getSpacingValue(horizontalSpacing, theme);
  const vSpacing = getSpacingValue(verticalSpacing, theme);

  const tableStyle = [
    styles.table,
    {
      borderColor: theme.colorScheme === 'dark' ? '#4a5568' : '#e2e8f0'
    },
    fullWidth && { width: '100%' },
    withTableBorder && styles.withTableBorder,
    layout === 'fixed' && styles.fixedLayout,
    variant === 'vertical' && styles.verticalVariant,
    tabularNums && styles.tabularNums,
    getSpacingStyles(spacingProps),
    style
  ];

  // Auto-generate table from data prop
  if (data) {
    const { head, body, foot, caption } = data;

    return (
      <View style={tableStyle}>
        {caption && captionSide === 'top' && (
          <TableCaption>{caption}</TableCaption>
        )}

        {head && (
          <TableThead>
            <TableTr>
              {head.map((cell, index) => {
                const columnConfig = columns[index] || {};
                return (
                  <TableTh 
                    key={index} 
                    w={columnConfig.width}
                    minWidth={columnConfig.minWidth}
                    maxWidth={columnConfig.maxWidth}
                    flex={columnConfig.flex}
                    style={{
                      paddingHorizontal: hSpacing,
                      paddingVertical: vSpacing,
                      borderRightWidth: withColumnBorders && index < head.length - 1 ? 1 : 0
                    }}
                  >
                    {cell}
                  </TableTh>
                );
              })}
            </TableTr>
          </TableThead>
        )}

        {body && (
          <TableTbody>
            {body.map((row, rowIndex) => (
              <TableTr
                key={rowIndex}
                style={{
                  backgroundColor: striped && rowIndex % 2 === 1
                    ? (theme.colorScheme === 'dark' ? '#2d3748' : '#f7fafc')
                    : 'transparent',
                  borderBottomWidth: withRowBorders ? 1 : 0,
                  borderColor: theme.colorScheme === 'dark' ? '#4a5568' : '#e2e8f0'
                }}
              >
                {row.map((cell, cellIndex) => {
                  const columnConfig = columns[cellIndex] || {};
                  return (
                    <TableTd 
                      key={cellIndex} 
                      w={columnConfig.width}
                      minWidth={columnConfig.minWidth}
                      maxWidth={columnConfig.maxWidth}
                      flex={columnConfig.flex}
                      style={{
                        paddingHorizontal: hSpacing,
                        paddingVertical: vSpacing,
                        borderRightWidth: withColumnBorders && cellIndex < row.length - 1 ? 1 : 0
                      }}
                    >
                      {cell}
                    </TableTd>
                  );
                })}
              </TableTr>
            ))}
          </TableTbody>
        )}

        {foot && (
          <TableTfoot>
            <TableTr>
              {foot.map((cell, index) => {
                const columnConfig = columns[index] || {};
                return (
                  <TableTh 
                    key={index} 
                    w={columnConfig.width}
                    minWidth={columnConfig.minWidth}
                    maxWidth={columnConfig.maxWidth}
                    flex={columnConfig.flex}
                    style={{
                      paddingHorizontal: hSpacing,
                      paddingVertical: vSpacing,
                      borderRightWidth: withColumnBorders && index < foot.length - 1 ? 1 : 0
                    }}
                  >
                    {cell}
                  </TableTh>
                );
              })}
            </TableTr>
          </TableTfoot>
        )}

        {caption && captionSide === 'bottom' && (
          <TableCaption>{caption}</TableCaption>
        )}
      </View>
    );
  }

  // Render with children
  return (
    <View style={tableStyle}>
      {children}
    </View>
  );
};

// Attach sub-components
Table.Th = TableTh;
Table.Td = TableTd;
Table.Tr = TableTr;
Table.Thead = TableThead;
Table.Tbody = TableTbody;
Table.Tfoot = TableTfoot;
Table.Caption = TableCaption;
Table.ScrollContainer = TableScrollContainer;

const styles = StyleSheet.create({
  caption: {
    padding: 8
  },
  fixedLayout: {
    // React Native doesn't support table-layout, but we can simulate with flex
  },
  table: {
    width: '100%'
  },
  tabularNums: {
    fontVariant: Platform.OS === 'web' ? ['tabular-nums' as any] : undefined
  },
  tbody: {
    // Body section styles
  },
  td: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: 'center',
    // paddingHorizontal: 12,
    // paddingVertical: 8
  },
  tfoot: {
    // Footer section styles
  },
  th: {
    borderBottomWidth: 1,
    flex: 1,
    justifyContent: 'center',
    // paddingHorizontal: 12,
    // paddingVertical: 8
  },
  thead: {
    // Header section styles
  },
  tr: {
    flexDirection: 'row',
    // minHeight: 40
    paddingVertical: 4
  },
  verticalVariant: {
    // Custom styles for vertical layout
  },
  withTableBorder: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden'
  }
});

export default Table;
