import React, { forwardRef, useContext } from 'react';
import { View, type ViewProps } from 'react-native';

import { getSpacing, type SizeValue } from '../../core/theme/sizes';
import { CardContext } from './CardContext';
import type { CardSectionProps } from './types';

const resolvePad = (value: SizeValue | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return getSpacing(value);
};

// Forward arbitrary RN View props (testID, accessibilityLabel, onLayout…) so
// users aren't artificially constrained by our explicit prop list.
type FullCardSectionProps = CardSectionProps & Omit<ViewProps, keyof CardSectionProps>;

const CardSectionComponent = forwardRef<View, FullCardSectionProps>(
  ({ children, withBorder, inheritPadding, py, px, style, _isFirst, _isLast, ...rest }, ref) => {
    const ctx = useContext(CardContext);
    const padding = ctx?.paddingPx ?? 0;
    const borderColor = ctx?.borderColor ?? 'rgba(0,0,0,0.08)';

    // Negative margins so the section escapes the parent Card's padding.
    // Only escape the edges that touch the Card's outer wall — a middle
    // section keeps the natural vertical flow, only going full-bleed
    // horizontally.
    const escapeStyle = {
      marginLeft: -padding,
      marginRight: -padding,
      marginTop: _isFirst ? -padding : 0,
      marginBottom: _isLast ? -padding : 0,
    };

    // Optional inside padding overrides
    const explicitPy = resolvePad(py);
    const explicitPx = resolvePad(px);
    const insidePadding = {
      ...(explicitPy !== undefined && { paddingTop: explicitPy, paddingBottom: explicitPy }),
      ...(inheritPadding && explicitPx === undefined && {
        paddingLeft: padding,
        paddingRight: padding,
      }),
      ...(explicitPx !== undefined && { paddingLeft: explicitPx, paddingRight: explicitPx }),
    };

    // Conditional dividers when withBorder is set on the section
    const dividers =
      withBorder
        ? {
            ...(!_isFirst && { borderTopWidth: 1, borderTopColor: borderColor }),
            ...(!_isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }),
          }
        : null;

    return (
      <View ref={ref} {...rest} style={[escapeStyle, insidePadding, dividers, style]}>
        {children}
      </View>
    );
  },
);

CardSectionComponent.displayName = 'CardSection';

// Tag so the parent Card can identify Section children when walking
// `React.Children` to inject first/last position metadata.
(CardSectionComponent as any).__CARD_SECTION__ = true;

export const CardSection = CardSectionComponent;
