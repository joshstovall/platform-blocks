import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { Icon } from '../../Icon';
import { Text } from '../../Text';
import type { KnobAppearance, KnobMark, KnobTickLayer } from '../types';
import type { LayoutState } from '../hooks/useKnobGeometry';
import { clamp } from '../utils/math';
import { knobStyles as styles } from '../styles';
import { polarToCartesian, getPositionRadius, toRadians } from '../utils/geometry';

const generateStepValues = (min: number, max: number, step?: number) => {
  if (!(Number.isFinite(step) && step && step > 0) || max <= min) {
    return [] as number[];
  }
  const values: number[] = [];
  const limit = 600;
  let count = 0;
  for (let current = min; current <= max + 1e-8 && count < limit; current += step) {
    values.push(Number(current.toFixed(6)));
    count += 1;
  }
  if (values[values.length - 1] !== max) {
    values.push(max);
  }
  return values;
};

export type TickLayersProps = {
  appearanceTicks?: KnobAppearance['ticks'];
  marksNormalized: KnobMark[];
  min: number;
  max: number;
  step: number;
  isEndless: boolean;
  valueToAngle: (value: number) => number;
  layoutState: LayoutState;
  ringRadius: number;
  ringThickness: number;
  theme: any;
  boundedRatio: number;
  size: number;
  thumbSize: number;
  resolvedVariant: string;
  displayValue: number;
  activeMark?: KnobMark | null;
  disabled: boolean;
  markLabelStyle?: TextStyle;
  labelColor: string;
};

type DerivedTickItem = {
  value: number;
  angle: number;
  ratio: number;
  mark?: KnobMark;
};

type DerivedTickLayer = {
  id: string;
  config: KnobTickLayer;
  source: 'marks' | 'steps' | 'values';
  ticks: DerivedTickItem[];
};

export const TickLayers: React.FC<TickLayersProps> = ({
  appearanceTicks,
  marksNormalized,
  min,
  max,
  step,
  isEndless,
  valueToAngle,
  layoutState,
  ringRadius,
  ringThickness,
  theme,
  boundedRatio,
  size,
  thumbSize,
  resolvedVariant,
  displayValue,
  disabled,
  markLabelStyle,
  labelColor,
  activeMark,
}) => {
  const derivedTickLayers = useMemo<DerivedTickLayer[]>(() => {
    const layersArray = Array.isArray(appearanceTicks)
      ? appearanceTicks
      : appearanceTicks
        ? [appearanceTicks]
        : [];
    if (!layersArray.length) return [];
    const span = max - min;
    return layersArray
      .map((layer: KnobTickLayer, layerIndex: number) => {
        const source = layer.source ?? 'marks';
        let entries: { value: number; mark?: KnobMark }[] = [];
        if (source === 'marks') {
          entries = marksNormalized.map((mark) => ({ value: mark.value, mark }));
        } else if (source === 'values') {
          const rawValues = Array.isArray(layer.values) ? layer.values : [];
          entries = rawValues.map((val: number) => ({ value: val }));
        } else if (source === 'steps') {
          const stepValues =
            Array.isArray(layer.values) && layer.values.length > 0
              ? layer.values
              : generateStepValues(min, max, step);
          entries = stepValues.map((val: number) => ({ value: val }));
        }
        if (!entries.length) {
          return null;
        }
        const seen = new Set<number>();
        const ticks = entries
          .map((entry) => {
            const candidate = Number.isFinite(entry.value) ? entry.value : min;
            const clampedValue = isEndless ? candidate : clamp(candidate, min, max);
            if (!isEndless && (clampedValue < min || clampedValue > max)) {
              return null;
            }
            const key = Number(clampedValue.toFixed(6));
            if (seen.has(key)) {
              return null;
            }
            seen.add(key);
            const angleForValue = valueToAngle(clampedValue);
            const ratio = !isEndless && span > 0 ? (clampedValue - min) / span : 0;
            return {
              value: clampedValue,
              angle: angleForValue,
              ratio,
              mark: entry.mark,
            } as DerivedTickItem;
          })
          .filter(Boolean) as DerivedTickItem[];
        if (!ticks.length) return null;
        ticks.sort((a, b) => a.value - b.value);
        return {
          id: `tick-layer-${layerIndex}`,
          config: layer,
          source,
          ticks,
        } as DerivedTickLayer;
      })
      .filter(Boolean) as DerivedTickLayer[];
  }, [appearanceTicks, marksNormalized, min, max, step, isEndless, valueToAngle]);

  const hasTickLayers = derivedTickLayers.length > 0;

  const markRadius = Math.max(0, ringRadius);
  const markDotSize = Math.max(4, Math.round(size * 0.05));
  const markLabelDistance = markRadius + thumbSize / 2 + 16;
  const markLabelWidth = Math.max(48, Math.round(size * 0.55));
  const markLabelHeight = Math.max(20, Math.round(size * 0.18));
  const markColor = disabled ? theme.colors.gray[4] : theme.colors.gray[6];

  if (hasTickLayers) {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {derivedTickLayers.map((layerData) => {
          const shape = layerData.config.shape ?? 'dot';
          const position = layerData.config.position ?? 'center';
          const radiusOffset = layerData.config.radiusOffset ?? 0;
          const baseRadius = getPositionRadius(
            ringRadius,
            ringThickness,
            position,
            radiusOffset
          );
          const tickLength = layerData.config.length ?? Math.max(6, Math.round(ringThickness * 0.9));
          const tickWidth = layerData.config.width ?? Math.max(2, Math.round(ringThickness * 0.25));
          const activeColor = layerData.config.color ?? theme.text.primary;
          const inactiveColor =
            layerData.config.inactiveColor ?? theme.colors.gray?.[4] ?? 'rgba(0,0,0,0.4)';
          const labelConfig = layerData.config.label;
          const labelPosition = labelConfig?.position ?? 'outer';
          const labelOffset = labelConfig?.offset ?? 12;

          return (
            <React.Fragment key={layerData.id}>
              {layerData.ticks.map((tick, tickIndex) => {
                const tickKey = `${layerData.id}-${tickIndex}`;
                const isActive = !isEndless && tick.ratio <= boundedRatio + 0.0001;
                const color = isActive ? activeColor : inactiveColor;
                const coords = polarToCartesian(
                  layoutState.cx,
                  layoutState.cy,
                  baseRadius,
                  tick.angle
                );

                let tickNode: React.ReactNode = null;
                if (shape === 'line') {
                  const startRadius =
                    position === 'inner'
                      ? baseRadius
                      : position === 'outer'
                        ? baseRadius
                        : baseRadius - tickLength / 2;
                  const endRadius =
                    position === 'inner'
                      ? Math.max(0, baseRadius - tickLength)
                      : position === 'outer'
                        ? baseRadius + tickLength
                        : baseRadius + tickLength / 2;
                  const start = polarToCartesian(
                    layoutState.cx,
                    layoutState.cy,
                    startRadius,
                    tick.angle
                  );
                  const end = polarToCartesian(layoutState.cx, layoutState.cy, endRadius, tick.angle);
                  tickNode = (
                    <Svg
                      key={`${tickKey}-line`}
                      pointerEvents="none"
                      width={layoutState.width}
                      height={layoutState.height}
                      style={StyleSheet.absoluteFill}
                    >
                      <Line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={color}
                        strokeWidth={tickWidth}
                        strokeLinecap="round"
                      />
                    </Svg>
                  );
                } else if (shape === 'icon' && layerData.config.iconName) {
                  const iconSize = Math.max(12, tickWidth * 2);
                  tickNode = (
                    <View
                      key={`${tickKey}-icon`}
                      pointerEvents="none"
                      style={[
                        styles.tickIcon,
                        {
                          left: coords.x,
                          top: coords.y,
                          transform: [
                            { translateX: -iconSize / 2 },
                            { translateY: -iconSize / 2 },
                          ],
                        },
                      ]}
                    >
                      <Icon name={layerData.config.iconName} size={iconSize} color={color} decorative />
                    </View>
                  );
                } else if (shape === 'custom' && layerData.config.renderTick) {
                  const customSize = Math.max(8, tickWidth * 2);
                  const customNode = layerData.config.renderTick({
                    value: tick.value,
                    angle: tick.angle,
                    index: tickIndex,
                    isActive,
                    center: { x: layoutState.cx, y: layoutState.cy },
                    radius: baseRadius,
                  });
                  tickNode = customNode ? (
                    <View
                      key={`${tickKey}-custom`}
                      pointerEvents="none"
                      style={[
                        styles.tickCustom,
                        {
                          left: coords.x,
                          top: coords.y,
                          transform: [
                            { translateX: -customSize / 2 },
                            { translateY: -customSize / 2 },
                          ],
                        },
                      ]}
                    >
                      {customNode}
                    </View>
                  ) : null;
                } else {
                  const dotSize = Math.max(4, tickWidth);
                  tickNode = (
                    <View
                      key={`${tickKey}-dot`}
                      pointerEvents="none"
                      style={[
                        styles.tickDot,
                        {
                          width: dotSize,
                          height: dotSize,
                          borderRadius: dotSize / 2,
                          backgroundColor: color,
                          left: coords.x - dotSize / 2,
                          top: coords.y - dotSize / 2,
                        },
                      ]}
                    />
                  );
                }

                const labelNodes: React.ReactNode[] = [];
                if (labelConfig) {
                  const wantsLabel =
                    labelConfig.show ??
                    Boolean(labelConfig.formatter || tick.mark?.label != null);
                  if (wantsLabel) {
                    const labelRadius = getPositionRadius(
                      ringRadius,
                      ringThickness,
                      labelPosition,
                      radiusOffset + labelOffset
                    );
                    const labelCoords = polarToCartesian(
                      layoutState.cx,
                      layoutState.cy,
                      labelRadius,
                      tick.angle
                    );
                    const markForLabel = tick.mark ?? ({ value: tick.value } as KnobMark);
                    const formatted =
                      labelConfig.formatter?.(markForLabel, tickIndex) ?? tick.mark?.label;
                    const labelContent =
                      formatted ?? (labelConfig.show ? `${Math.round(tick.value)}` : null);
                    if (labelContent != null) {
                      labelNodes.push(
                        <View
                          key={`${tickKey}-label`}
                          pointerEvents="none"
                          style={[
                            styles.tickLabelContainer,
                            {
                              left: labelCoords.x,
                              top: labelCoords.y,
                              width: markLabelWidth,
                              height: markLabelHeight,
                              transform: [
                                { translateX: -markLabelWidth / 2 },
                                { translateY: -markLabelHeight / 2 },
                              ],
                            },
                          ]}
                        >
                          {typeof labelContent === 'string' || typeof labelContent === 'number' ? (
                            <Text
                              size="xs"
                              weight="500"
                              selectable={false}
                              style={[styles.tickLabelText, labelConfig.style]}
                            >
                              {labelContent}
                            </Text>
                          ) : (
                            labelContent
                          )}
                        </View>
                      );
                    }
                  }
                }

                return (
                  <React.Fragment key={tickKey}>
                    {tickNode}
                    {labelNodes}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </View>
    );
  }

  if (marksNormalized.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {marksNormalized.map((mark) => {
        const markAngle = valueToAngle(mark.value);
        const rad = toRadians(markAngle);
        const dotX = layoutState.cx + Math.sin(rad) * markRadius - markDotSize / 2;
        const dotY = layoutState.cy - Math.cos(rad) * markRadius - markDotSize / 2;
        const labelX = layoutState.cx + Math.sin(rad) * markLabelDistance;
        const labelY = layoutState.cy - Math.cos(rad) * markLabelDistance;
        const isActiveMark = activeMark?.value === mark.value;
        const dotScale = isActiveMark && resolvedVariant !== 'status' ? 1.25 : 1;
        const dotAccent =
          !disabled && isActiveMark ? mark.accentColor ?? theme.colors.primary[5] : markColor;

        return (
          <React.Fragment key={`mark-${mark.value}`}>
            <View
              pointerEvents="none"
              style={[
                styles.markDot,
                {
                  width: markDotSize * dotScale,
                  height: markDotSize * dotScale,
                  borderRadius: (markDotSize * dotScale) / 2,
                  left: dotX,
                  top: dotY,
                  backgroundColor: dotAccent,
                },
              ]}
            />
            {mark.label != null && (
              <View
                pointerEvents="none"
                style={[
                  styles.markLabelContainer,
                  {
                    left: labelX,
                    top: labelY,
                    width: markLabelWidth,
                    height: markLabelHeight,
                    transform: [
                      { translateX: -markLabelWidth / 2 },
                      { translateY: -markLabelHeight / 2 },
                    ],
                  },
                ]}
              >
                {typeof mark.label === 'string' ? (
                  <Text
                    size="xs"
                    weight="500"
                    selectable={false}
                    style={[
                      styles.markLabelText,
                      {
                        color:
                          isActiveMark && !disabled
                            ? mark.accentColor ?? labelColor
                            : labelColor,
                      },
                      markLabelStyle,
                    ]}
                  >
                    {mark.label}
                  </Text>
                ) : (
                  mark.label
                )}
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
