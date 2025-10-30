import { ViewStyle, DimensionValue } from 'react-native';

// Layout prop types
export interface LayoutProps {
  /** Makes the component fill the full width of its parent */
  fullWidth?: boolean;
  /** Sets a specific width (shorthand for width) */
  w?: DimensionValue;
  /** Sets a specific width */
  width?: DimensionValue;
  /** Sets a specific height */
  height?: DimensionValue;
  /** Sets the maximum width */
  maxWidth?: DimensionValue;
  /** Sets the minimum width */
  minWidth?: DimensionValue;
  /** Sets the maximum height */
  maxHeight?: DimensionValue;
  /** Sets the minimum height */
  minHeight?: DimensionValue;
}

// Utility function to generate layout styles from props
/**
 * Generates layout styles based on provided layout properties.
 * 
 * @param props - The layout properties object
 * @param props.fullWidth - When true, sets width to 100%
 * @param props.w - Shorthand width property (overrides fullWidth)
 * @param props.width - Specific width value (overrides fullWidth and w)
 * @param props.height - Height value
 * @param props.maxWidth - Maximum width constraint
 * @param props.minWidth - Minimum width constraint
 * @param props.maxHeight - Maximum height constraint
 * @param props.minHeight - Minimum height constraint
 * 
 * @returns A partial ViewStyle object containing the computed layout styles
 * 
 * @remarks
 * Property precedence for width: width > w > fullWidth
 * The function processes width properties in order of specificity, with more specific
 * properties overriding more general ones.
 */
export function getLayoutStyles(props: LayoutProps): Partial<ViewStyle> {
  const styles: Partial<ViewStyle> = {};

  // Handle fullWidth prop
  if (props.fullWidth) {
    styles.width = '100%';
  }

  // Handle shorthand width prop first
  if (props.w !== undefined) {
    styles.width = props.w;
  }

  // Handle specific dimensions (override fullWidth and w if specified)
  if (props.width !== undefined) {
    styles.width = props.width;
  }

  if (props.height !== undefined) {
    styles.height = props.height;
  }

  if (props.maxWidth !== undefined) {
    styles.maxWidth = props.maxWidth;
  }

  if (props.minWidth !== undefined) {
    styles.minWidth = props.minWidth;
  }

  if (props.maxHeight !== undefined) {
    styles.maxHeight = props.maxHeight;
  }

  if (props.minHeight !== undefined) {
    styles.minHeight = props.minHeight;
  }

  return styles;
}

// Helper to extract layout props from component props
export function extractLayoutProps<T extends LayoutProps>(
  props: T
): { layoutProps: LayoutProps; otherProps: Omit<T, keyof LayoutProps> } {
  const {
    fullWidth,
    w,
    width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight,
    ...otherProps
  } = props;

  const layoutProps: LayoutProps = {
    fullWidth,
    w,
    width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight
  };

  return { layoutProps, otherProps };
}
