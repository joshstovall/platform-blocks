import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

import type { KnobPointerStyle } from '../types';
import type { LayoutState } from '../hooks/useKnobGeometry';
import { clamp } from '../utils/math';
import { toRadians } from '../utils/geometry';
import { knobStyles as styles } from '../styles';

export type PointerLayerProps = {
  pointerConfig?: KnobPointerStyle | false | null;
  labelColor: string;
  displayAngle: number;
  layoutState: LayoutState;
  size: number;
  thumbSize: number;
  ringRadius: number;
};

export const PointerLayer: React.FC<PointerLayerProps> = ({
  pointerConfig,
  labelColor,
  displayAngle,
  layoutState,
  size,
  thumbSize,
  ringRadius,
}) => {
  if (!pointerConfig || pointerConfig.visible === false) {
    return null;
  }

  const pointerWidth = pointerConfig.width ?? Math.max(2, Math.round(size * 0.015));
  const pointerColor = pointerConfig.color ?? labelColor;
  const pointerCap = pointerConfig.cap ?? 'round';
  const pointerLengthBase = pointerConfig.length ?? ringRadius;
  const pointerOffset = pointerConfig.offset ?? 0;
  const pointerEndRadius = clamp(
    pointerLengthBase + pointerOffset,
    0,
    layoutState.radius + thumbSize
  );
  const pointerCounterweightRadius = pointerConfig.counterweight?.size
    ? Math.max(0, pointerConfig.counterweight.size / 2)
    : 0;
  const pointerCounterweightColor = pointerConfig.counterweight?.color ?? pointerColor;
  const pointerAngleRad = toRadians(displayAngle);
  const pointerStartRadius = pointerCounterweightRadius > 0 ? pointerCounterweightRadius : 0;
  const pointerStartX = layoutState.cx + Math.sin(pointerAngleRad) * pointerStartRadius;
  const pointerStartY = layoutState.cy - Math.cos(pointerAngleRad) * pointerStartRadius;
  const pointerEndX = layoutState.cx + Math.sin(pointerAngleRad) * pointerEndRadius;
  const pointerEndY = layoutState.cy - Math.cos(pointerAngleRad) * pointerEndRadius;

  if (pointerEndRadius <= pointerStartRadius) {
    return null;
  }

  const pointerSvgWidth = layoutState.width || size;
  const pointerSvgHeight = layoutState.height || size;

  return (
    <Svg
      pointerEvents="none"
      width={pointerSvgWidth}
      height={pointerSvgHeight}
      style={styles.pointerLayer}
    >
      <Line
        x1={pointerStartX}
        y1={pointerStartY}
        x2={pointerEndX}
        y2={pointerEndY}
        stroke={pointerColor}
        strokeWidth={pointerWidth}
        strokeLinecap={pointerCap}
      />
      {pointerCounterweightRadius > 0 ? (
        <Circle
          cx={layoutState.cx}
          cy={layoutState.cy}
          r={pointerCounterweightRadius}
          fill={pointerCounterweightColor}
        />
      ) : null}
    </Svg>
  );
};
