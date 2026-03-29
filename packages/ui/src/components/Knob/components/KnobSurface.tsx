import React, { useCallback } from 'react';
import { View, ViewProps, PanResponderInstance, LayoutChangeEvent } from 'react-native';

import { knobStyles as styles } from '../styles';
import { SurfaceLayers, type SurfaceLayersProps } from './SurfaceLayers';
import { TickLayers, type TickLayersProps } from './TickLayers';
import { PointerLayer, type PointerLayerProps } from './PointerLayer';
import { ThumbLayer, type ThumbLayerProps } from './ThumbLayer';

/**
 * Encapsulates the interactive host view for the Knob plus its visual layers so the
 * root component can stay focused on state/logic.
 */
export type KnobSurfaceProps = Omit<ViewProps, 'onLayout' | 'children'> & {
  size: number;
  disabled: boolean;
  trackColor: string;
  accessibilityLabel?: string;
  accessibilityMin: number;
  accessibilityMax: number;
  accessibilityNow: number;
  setHostRef: (node: View | null) => void;
  panHandlers?: PanResponderInstance['panHandlers'];
  handleLayout?: (event: LayoutChangeEvent) => void;
  keyboardHandlers?: Partial<ViewProps>;
  surfaceLayersProps: SurfaceLayersProps;
  tickLayersProps: TickLayersProps;
  pointerLayerProps: PointerLayerProps;
  thumbLayerProps: ThumbLayerProps;
  centerSlot?: React.ReactNode;
  onLayout?: ViewProps['onLayout'];
};

export const KnobSurface: React.FC<KnobSurfaceProps> = ({
  size,
  disabled,
  trackColor,
  accessibilityLabel,
  accessibilityMin,
  accessibilityMax,
  accessibilityNow,
  setHostRef,
  panHandlers,
  handleLayout,
  keyboardHandlers,
  surfaceLayersProps,
  tickLayersProps,
  pointerLayerProps,
  thumbLayerProps,
  centerSlot,
  style,
  focusable,
  testID,
  onLayout: userOnLayout,
  ...rest
}) => {
  const combinedOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      handleLayout?.(event);
      userOnLayout?.(event);
    },
    [handleLayout, userOnLayout]
  );

  const computedFocusable = focusable ?? !disabled;
  const responderHandlers = panHandlers ?? ({} as PanResponderInstance['panHandlers']);

  return (
    <View
      ref={setHostRef}
      {...responderHandlers}
      onLayout={combinedOnLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? 'Knob'}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min: accessibilityMin, max: accessibilityMax, now: accessibilityNow }}
      focusable={computedFocusable}
      {...keyboardHandlers}
      style={[
        styles.knob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: trackColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      testID={testID}
      {...rest}
    >
      <SurfaceLayers {...surfaceLayersProps} />
      <TickLayers {...tickLayersProps} />
      {centerSlot}
      <PointerLayer {...pointerLayerProps} />
      <ThumbLayer {...thumbLayerProps} />
    </View>
  );
};
