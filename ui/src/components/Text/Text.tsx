import React from 'react';
import { Text as RNText, Platform, TextProps as RNTextProps } from 'react-native';

import { useTheme } from '../../core/theme/ThemeProvider';
import { SizeValue, getFontSize, getLineHeight } from '../../core/theme/sizes';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { useI18n } from '../../core/i18n';
import { useDirection } from '../../core/providers/DirectionProvider';

export type HTMLTextVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div'
  | 'small' | 'caption' | 'strong' | 'b' | 'i' | 'em' | 'u'
  | 'sub' | 'sup' | 'mark' | 'code' | 'kbd'
  | 'blockquote' | 'cite';

export interface TextProps extends SpacingProps {
  /** Text node children. Optional if using translation via `tx`. */
  children?: React.ReactNode;
  /** Translation key (if provided, overrides children when found) */
  tx?: string;
  /** Params for translation interpolation */
  txParams?: Record<string, any>;
  /** Text variant (mirrors semantic HTML tags) */
  variant?: HTMLTextVariant;
  /** Size can be a size token or number (overrides variant fontSize) */
  size?: SizeValue;
  /** Text color (overrides theme text color) */
  color?: string;
  /** Semantic color variant (overrides color prop). Supports text palette plus status colors */
  colorVariant?: 'primary' | 'secondary' | 'muted' | 'disabled' | 'link' | 'success' | 'warning' | 'error' | 'info';
  /** Font weight (supports all CSS font-weight values) */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'light' | 'black' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Line height as a multiplier (e.g., 1.5) or absolute value */
  lineHeight?: number;
  /** Letter spacing (tracking) in pixels or em units */
  tracking?: number;
  /** Convert text to uppercase */
  uppercase?: boolean;
  /** Additional styles (overrides computed styles) */
  style?: any;
  /** Custom font family (overrides theme font) */
  fontFamily?: string;
  /** For platform-specific rendering on web */
  as?: HTMLTextVariant;
  /** Whether text is selectable (default: true) */
  selectable?: boolean;
  /** Called when text is pressed */
  onPress?: () => void;
  /** Called when the text layout is calculated */
  onLayout?: (event: any) => void;
  /** Value to display (overrides children, useful for numbers) */
  value?: string | number;
  /** Maximum number of lines to display (native + web) */
  numberOfLines?: RNTextProps['numberOfLines'];
  /** Ellipsis strategy when text exceeds available space */
  ellipsizeMode?: RNTextProps['ellipsizeMode'];
}

const getTextStyles = (
  theme: any,
  variant: HTMLTextVariant = 'p',
  size?: SizeValue,
  weight?: TextProps['weight'],
  align: 'left' | 'center' | 'right' | 'justify' = 'left',
  color?: string,
  colorVariant?: 'primary' | 'secondary' | 'muted' | 'disabled' | 'link' | 'success' | 'warning' | 'error' | 'info',
  fontFamily?: string,
  lineHeight?: number,
  tracking?: number,
  uppercase?: boolean,
  isRTL?: boolean
) => {
  const variantFontSizes: Record<HTMLTextVariant, number> = {
    // HTML heading variants
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,

    // HTML text variants
    p: 16,
    span: 16,
    div: 16,
    small: 12,
    caption: 12,
    code: 14,
    kbd: 14,
    blockquote: 18,
    cite: 14,

    // HTML semantic variants (inherit base size, styling via weight/style)
    strong: 16,
    b: 16,
    i: 16,
    em: 16,
    u: 16,
    sub: 12,
    sup: 12,
    mark: 16
  };

  // Use size prop if provided, otherwise use variant-based size
  const fontSize = size !== undefined ? getFontSize(size) : variantFontSizes[variant as keyof typeof variantFontSizes] || 16;
  const lineHeightMultiplier = size !== undefined ? getLineHeight(size) : 1.4;
  const calculatedLineHeight = lineHeight !== undefined 
    ? (lineHeight > 3 ? lineHeight : fontSize * lineHeight) // If > 3, treat as absolute value, else as multiplier
    : fontSize * lineHeightMultiplier;

  // HTML variant styles with semantic defaults
  const variantStyles: Record<HTMLTextVariant, any> = {
    // HTML headings
    h1: { fontSize, fontWeight: '700', lineHeight: calculatedLineHeight },
    h2: { fontSize, fontWeight: '700', lineHeight: calculatedLineHeight },
    h3: { fontSize, fontWeight: '600', lineHeight: calculatedLineHeight },
    h4: { fontSize, fontWeight: '600', lineHeight: calculatedLineHeight },
    h5: { fontSize, fontWeight: '500', lineHeight: calculatedLineHeight },
    h6: { fontSize, fontWeight: '500', lineHeight: calculatedLineHeight },

    // HTML text elements
    p: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight },
    span: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight },
    div: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight },
    small: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight },
    caption: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight },

    // HTML semantic elements
    strong: { fontSize, fontWeight: '700', lineHeight: calculatedLineHeight },
    b: { fontSize, fontWeight: '700', lineHeight: calculatedLineHeight },
    i: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontStyle: 'italic' },
    em: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontStyle: 'italic' },
    u: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, textDecorationLine: 'underline' },
    sub: { fontSize, fontWeight: '400', lineHeight: fontSize * 1.2, ...(Platform.OS === 'web' ? { verticalAlign: 'sub' } : {}) },
    sup: { fontSize, fontWeight: '400', lineHeight: fontSize * 1.2, ...(Platform.OS === 'web' ? { verticalAlign: 'super' } : {}) },
    mark: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, ...(Platform.OS === 'web' ? { backgroundColor: '#ffff00' } : {}) },
    code: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontFamily: Platform.select({ web: 'monospace', default: 'Courier New' }) },
    kbd: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontFamily: Platform.select({ web: 'monospace', default: 'Courier New' }) },
    blockquote: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontStyle: 'italic' },
    cite: { fontSize, fontWeight: '400', lineHeight: calculatedLineHeight, fontStyle: 'italic' }
  };

  // Enhanced weight styles supporting all CSS font-weight values
  const weightStyles: Record<string, { fontWeight: string }> = {
    '100': { fontWeight: '100' },
    '200': { fontWeight: '200' },
    '300': { fontWeight: '300' },
    '400': { fontWeight: '400' },
    '500': { fontWeight: '500' },
    '600': { fontWeight: '600' },
    '700': { fontWeight: '700' },
    '800': { fontWeight: '800' },
    '900': { fontWeight: '900' },
    normal: { fontWeight: '400' },
    medium: { fontWeight: '500' },
    semibold: { fontWeight: '600' },
    bold: { fontWeight: '700' },
    light: { fontWeight: '300' },
    black: { fontWeight: '900' }
  };

  // Handle numeric weights
  const getFontWeight = (weight: TextProps['weight']): string => {
    if (typeof weight === 'number') {
      return weight.toString();
    }
    return weightStyles[weight || 'normal']?.fontWeight || '400';
  };

  // Resolve text color with semantic variants
  const getTextColor = (): string => {
    // Direct color override: allow raw color strings AND token keys (theme.colors / theme.text)
    if (color) {
      // If matches a text token
      if ((theme.text as any)[color]) return (theme.text as any)[color];
      // If matches a color palette key (take middle shade 5 if present)
      if ((theme.colors as any)[color]) {
        const palette = (theme.colors as any)[color];
        return Array.isArray(palette) ? (palette[5] || palette[0]) : palette;
      }
      return color; // assume raw CSS color
    }
    if (colorVariant) {
      if ((theme.text as any)[colorVariant]) return (theme.text as any)[colorVariant];
      if ((theme.colors as any)[colorVariant]) {
        const palette = (theme.colors as any)[colorVariant];
        return Array.isArray(palette) ? (palette[5] || palette[0]) : palette;
      }
      if (colorVariant === 'info' && (theme.colors as any).primary) {
        const palette = (theme.colors as any).primary;
        return Array.isArray(palette) ? (palette[5] || palette[0]) : palette;
      }
    }
    return theme.text.primary;
  };

  const baseStyles = {
    fontFamily: fontFamily || theme.fontFamily,
    textAlign: align === 'left' && isRTL ? 'right' : align === 'right' && isRTL ? 'left' : align,
    color: getTextColor()
  };

  const variantStyle = variantStyles[variant as keyof typeof variantStyles] || variantStyles.p;

  return {
    ...baseStyles,
    ...variantStyle,
    // Only override fontWeight if weight prop is explicitly provided
    ...(weight !== undefined && { fontWeight: getFontWeight(weight) }),
    fontSize: size ? (typeof size === 'number' ? size : getFontSize(size)) : variantStyle.fontSize,
    lineHeight: calculatedLineHeight,
    ...(tracking !== undefined && { letterSpacing: tracking }),
    ...(uppercase && { textTransform: 'uppercase' })
  };
};

// Helper function to convert React Native styles to web CSS
const convertToWebStyles = (rnStyles: any): React.CSSProperties => {
  if (!rnStyles) return {};

  // Flatten the styles if it's an array
  const flatStyles = Array.isArray(rnStyles) ? Object.assign({}, ...rnStyles) : rnStyles;

  // Convert React Native style properties to web CSS properties
  const webStyles: React.CSSProperties = {};

  Object.keys(flatStyles).forEach(key => {
    const value = flatStyles[key];

    switch (key) {
      case 'fontWeight':
        webStyles.fontWeight = value;
        break;
      case 'fontSize':
        webStyles.fontSize = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'lineHeight':
        webStyles.lineHeight = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'textAlign':
        webStyles.textAlign = value;
        break;
      case 'color':
        webStyles.color = value;
        break;
      case 'fontFamily':
        webStyles.fontFamily = value;
        break;
      case 'fontStyle':
        webStyles.fontStyle = value;
        break;
      case 'textDecorationLine':
        webStyles.textDecoration = value;
        break;
      case 'backgroundColor':
        webStyles.backgroundColor = value;
        break;
      case 'letterSpacing':
        webStyles.letterSpacing = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'textTransform':
        webStyles.textTransform = value;
        break;
      default:
        // For other properties, pass them through if they're valid CSS
        if (typeof value === 'string' || typeof value === 'number') {
          (webStyles as any)[key] = value;
        }
        break;
    }
  });

  return webStyles;
};

const containsPlatformText = (node: React.ReactNode): boolean => {
  return React.Children.toArray(node).some(child => {
    if (React.isValidElement(child)) {
      const childType: any = child.type;
      if (childType?.__PLATFORM_BLOCKS_TEXT__ === true) {
        return true;
      }
      const childProps: any = child.props;
      if (childProps?.children) {
        return containsPlatformText(childProps.children);
      }
    }
    return false;
  });
};

export const Text: React.FC<TextProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const {
    children,
    tx,
    txParams,
    variant = 'p',
    size,
    weight,
    align = 'left',
    color,
    colorVariant,
    lineHeight,
    tracking,
    uppercase,
    style,
    fontFamily,
    as,
    selectable = true,
    onPress,
    onLayout,
    value,
    numberOfLines,
    ellipsizeMode
  } = otherProps as any;

  const theme = useTheme();
  const { t } = useI18n();
  const { isRTL } = useDirection();
  
  // // Only use i18n if tx prop is provided
  // let t: ((key: string, params?: Record<string, any>) => string) | undefined;
  // try {
  //   if (tx) {
  //     const i18n = useI18n();
  //     t = i18n.t;
  //   }
  // } catch (error) {
  //   // I18n not available, will use children instead
  //   console.warn('I18n not available for Text component, using children prop');
  // }
  
  const textStyles = getTextStyles(theme, variant, size, weight, align, color, colorVariant, fontFamily, lineHeight, tracking, uppercase, isRTL);
  const spacingStyles = getSpacingStyles(spacingProps);
  const content = 
  (tx && t )
  ? t(tx, txParams) 
  : value ? value :
  children;

  // Determine if children contain heading-level Text components to avoid invalid <h*> inside <p>
  let htmlTag = as || variant;
  if (Platform.OS === 'web' && htmlTag === 'p') {
    const headingVariants = new Set(['h1','h2','h3','h4','h5','h6']);
    const hasHeadingChild = React.Children.toArray(children).some(ch => {
      if (React.isValidElement(ch)) {
        const propsAny: any = ch.props; // runtime inspection only
        const v = propsAny?.variant;
        if (typeof v === 'string' && headingVariants.has(v)) return true;
      }
      return false;
    });
    if (hasHeadingChild) {
      // Switch to div to prevent <h*> inside <p> DOM nesting warning / hydration error
      htmlTag = 'div';
    }
    if (htmlTag === 'p' && containsPlatformText(children)) {
      // Avoid nested paragraphs when Text components are nested
      htmlTag = 'div';
    }
  }

  // Platform-specific rendering
  if (Platform.OS === 'web' && isHTMLVariant(htmlTag)) {
    const styleArray = Array.isArray(style) ? style : [style];
    const hasDisplayOverride = styleArray.some((item) => item && (((item as any).display !== undefined) || ((item as any).whiteSpace !== undefined)));

    const webStyles = convertToWebStyles([
      textStyles,
      spacingStyles,
      style,
      // default to inline unless caller explicitly requests display/whitespace behavior
      ...(hasDisplayOverride ? [] : [{ display: 'inline' }]),
    ]);

    // Handle text selection for web
    if (!selectable) {
      webStyles.userSelect = 'none';
      webStyles.WebkitUserSelect = 'none';
      webStyles.MozUserSelect = 'none';
      webStyles.msUserSelect = 'none';
    }

    // Reset default browser margins for heading elements
    const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(htmlTag);
    if (isHeading && !spacingStyles.margin && !spacingStyles.marginTop && !spacingStyles.marginBottom) {
      webStyles.margin = 0;
    }

    const webExtraStyles: Record<string, any> = {};
    if (numberOfLines === 1) {
      webExtraStyles.whiteSpace = 'nowrap';
      webExtraStyles.overflow = 'hidden';
      if (ellipsizeMode === 'tail' || ellipsizeMode === undefined) {
        webExtraStyles.textOverflow = 'ellipsis';
      }
    }

    return React.createElement(
      htmlTag as string,
      {
        style: { ...webStyles, ...webExtraStyles },
        className: 'platform-blocks-text', // Optional: for CSS targeting
        onClick: onPress, // Handle onPress for web
        ...(onPress && { style: { ...webStyles, ...webExtraStyles, cursor: 'pointer' } })
      },
  content
    );
  }

  // Fallback to React Native Text for mobile or non-HTML variants
  return (
    <RNText 
      style={[textStyles, spacingStyles, style]}
      selectable={selectable}
      onPress={onPress}
      onLayout={onLayout}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
  {content}
    </RNText>
  );
};

(Text as any).__PLATFORM_BLOCKS_TEXT__ = true;

// Helper function to check if variant is a valid HTML tag
const isHTMLVariant = (variant: any): variant is HTMLTextVariant => {
  const htmlTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'div', 'small', 'caption', 'strong', 'b', 'i', 'em', 'u',
    'sub', 'sup', 'mark', 'code', 'kbd', 'blockquote', 'cite'
  ];
  return htmlTags.includes(variant);
};
