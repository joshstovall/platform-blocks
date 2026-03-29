import { ViewStyle, DimensionValue } from 'react-native';

// Layout prop types
export interface LayoutProps {
  /** Makes the component fill the full width of its parent */
  fullWidth?: boolean;
  /** Sets a specific width */
  w?: DimensionValue;
  /** Sets a specific height */
  h?: DimensionValue;
  /** Sets the maximum width */
  maxW?: DimensionValue;
  /** Sets the minimum width */
  minW?: DimensionValue;
  /** Sets the maximum height */
  maxH?: DimensionValue;
  /** Sets the minimum height */
  minH?: DimensionValue;
}

// Utility function to generate layout styles from props
/**
 * Generates layout styles based on provided layout properties.
 * 
 * @param props - The layout properties object
 * @param props.fullWidth - When true, sets width to 100%
 * @param props.w - Width property (overrides fullWidth)
 * @param props.h - Height value
 * @param props.maxW - Maximum width constraint
 * @param props.minW - Minimum width constraint
 * @param props.maxH - Maximum height constraint
 * @param props.minH - Minimum height constraint
 * 
 * @returns A partial ViewStyle object containing the computed layout styles
 * 
 * @remarks
 * Property precedence for width: w > fullWidth
 * The function processes width properties in order of specificity, with more specific
 * properties overriding more general ones.
 */
export function getLayoutStyles(props: LayoutProps): Partial<ViewStyle> {
  const styles: Partial<ViewStyle> = {};

  // Handle fullWidth prop
  if (props.fullWidth) {
    styles.width = '100%';
  }

  // Handle width prop (overrides fullWidth)
  if (props.w !== undefined) {
    styles.width = props.w;
  }

  if (props.h !== undefined) {
    styles.height = props.h;
  }

  if (props.maxW !== undefined) {
    styles.maxWidth = props.maxW;
  }

  if (props.minW !== undefined) {
    styles.minWidth = props.minW;
  }

  if (props.maxH !== undefined) {
    styles.maxHeight = props.maxH;
  }

  if (props.minH !== undefined) {
    styles.minHeight = props.minH;
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
    h,
    maxW,
    minW,
    maxH,
    minH,
    ...otherProps
  } = props;

  const layoutProps: LayoutProps = {
    fullWidth,
    w,
    h,
    maxW,
    minW,
    maxH,
    minH
  };

  return { layoutProps, otherProps };
}
