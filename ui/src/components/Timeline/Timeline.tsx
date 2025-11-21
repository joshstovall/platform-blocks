import React, { createContext, useContext, forwardRef, useState, useCallback } from 'react';
import { View, Text, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';
import { TimelineProps, TimelineItemProps, TimelineContextValue, TimelineSizeMetrics } from './types';
import { useTheme } from '../../core/theme/ThemeProvider';
import { clampComponentSize, resolveComponentSize, type ComponentSize, type ComponentSizeValue } from '../../core/theme/componentSize';

// Context
const TimelineContext = createContext<TimelineContextValue | null>(null);
const useTimelineContext = () => {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error('Timeline components must be used within a Timeline');
  return ctx;
};

const TIMELINE_ALLOWED_SIZES: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

const TIMELINE_SIZE_SCALE: Record<ComponentSize, TimelineSizeMetrics> = {
  xs: { bulletSize: 16, lineWidth: 1, fontSize: 12, spacing: 8 },
  sm: { bulletSize: 20, lineWidth: 2, fontSize: 14, spacing: 12 },
  md: { bulletSize: 24, lineWidth: 2, fontSize: 16, spacing: 16 },
  lg: { bulletSize: 28, lineWidth: 3, fontSize: 18, spacing: 20 },
  xl: { bulletSize: 32, lineWidth: 3, fontSize: 20, spacing: 24 },
  '2xl': { bulletSize: 36, lineWidth: 4, fontSize: 22, spacing: 28 },
  '3xl': { bulletSize: 40, lineWidth: 4, fontSize: 24, spacing: 32 },
};

const BASE_TIMELINE_METRICS = TIMELINE_SIZE_SCALE.md;

const resolveTimelineMetrics = (value: ComponentSizeValue): TimelineSizeMetrics => {
  if (typeof value === 'number') {
    const ratio = value / BASE_TIMELINE_METRICS.fontSize;
    return {
      fontSize: value,
      bulletSize: Math.max(12, Math.round(BASE_TIMELINE_METRICS.bulletSize * ratio)),
      lineWidth: Math.max(1, Math.round(BASE_TIMELINE_METRICS.lineWidth * ratio)),
      spacing: Math.max(8, Math.round(BASE_TIMELINE_METRICS.spacing * ratio)),
    };
  }

  const resolved = resolveComponentSize(value, TIMELINE_SIZE_SCALE, {
    allowedSizes: TIMELINE_ALLOWED_SIZES,
    fallback: 'md',
  });

  if (typeof resolved === 'number') {
    return resolveTimelineMetrics(resolved);
  }

  return resolved;
};

// Token resolver (palette.shade or palette)
const resolveTokenColor = (token: string | undefined, theme: any): string | undefined => {
  if (!token) return undefined;
  const m = token.match(/^([a-zA-Z0-9_-]+)\.(\d{1,2})$/);
  if (m) {
    const [, palette, shadeStr] = m;
    const shade = parseInt(shadeStr, 10);
    const pal = theme.colors[palette];
    if (pal && Array.isArray(pal) && pal[shade] != null) return pal[shade];
  }
  const pal = theme.colors[token];
  if (pal) {
    if (Array.isArray(pal)) return pal[5] || pal[0];
    return pal;
  }
  return token; // assume raw color string
};

// Item
const TimelineItem = forwardRef<View, TimelineItemProps & { itemIndex?: number; isLastItem?: boolean }>(({
  children,
  title,
  bullet,
  colorVariant,
  lineVariant = 'solid',
  color,
  active,
  itemIndex = 0,
  isLastItem = false,
  itemAlign,
  ...rest
}, ref) => {
  const theme = useTheme();
  const {
    active: timelineActive,
    color: timelineColor,
    lineWidth,
    bulletSize: contextBulletSize,
    align,
    reverseActive,
    size,
    centerMode,
    metrics,
  } = useTimelineContext();

  const sizeConfig = metrics;
  const finalBulletSize = contextBulletSize || sizeConfig.bulletSize;
  const showAllColored = timelineActive === undefined;
  const [patternHeight, setPatternHeight] = useState(0);
  const handlePatternLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight > 0 && Math.abs(nextHeight - patternHeight) > 0.5) {
      setPatternHeight(nextHeight);
    }
  }, [patternHeight]);

  // Resolve item color precedence
  const resolvedItemColor = color
    ? color
    : (colorVariant ? resolveTokenColor(colorVariant, theme) : timelineColor);

  // Active logic
  const isActive = showAllColored
    ? true
    : (active !== undefined
      ? active
      : (timelineActive !== undefined
        ? (reverseActive ? itemIndex > timelineActive : itemIndex <= timelineActive)
        : true));

  const effectiveAlign = itemAlign || align;

  const lineColor = showAllColored ? resolvedItemColor : (isActive ? resolvedItemColor : theme.colors.gray[3]);

  const getLine = () => {
    if (isLastItem) return null;

    const baseLinePosition: ViewStyle = {
      position: 'absolute',
      left: effectiveAlign === 'right' ? undefined : (finalBulletSize / 2) - (lineWidth / 2),
      right: effectiveAlign === 'right' ? (finalBulletSize / 2) - (lineWidth / 2) : undefined,
      top: finalBulletSize,
      bottom: -(finalBulletSize / 2),
      zIndex: 1,
    };

    if (lineVariant === 'solid') {
      return (
        <View
          style={{
            ...baseLinePosition,
            width: lineWidth,
            backgroundColor: lineColor,
          }}
        />
      );
    }

    const patternLinePosition: ViewStyle = { ...baseLinePosition };

    if (lineVariant === 'dashed') {
      const dashHeight = 6;
      const gapHeight = 3;
      const totalHeight = patternHeight || 0;
      const segmentHeight = dashHeight + gapHeight;
      const dashCount = Math.max(1, Math.ceil(totalHeight / segmentHeight));
      return (
        <View style={patternLinePosition} onLayout={handlePatternLayout}>
          {patternHeight > 0 && Array.from({ length: dashCount }, (_, i) => {
            const isLast = i === dashCount - 1;
            const remaining = totalHeight - (i * segmentHeight);
            const actualDashHeight = isLast && remaining < dashHeight ? Math.max(remaining, 2) : dashHeight;
            return (
              <View
                key={i}
                style={{
                  width: lineWidth,
                  height: actualDashHeight,
                  backgroundColor: lineColor,
                  marginBottom: isLast ? 0 : gapHeight,
                }}
              />
            );
          })}
        </View>
      );
    }

    if (lineVariant === 'dotted') {
      const dotSize = lineWidth * 1.5;
      const gapHeight = 3;
      const totalHeight = patternHeight || 0;
      const segmentHeight = dotSize + gapHeight;
      const dotCount = Math.max(1, Math.ceil(totalHeight / segmentHeight));
      return (
        <View
          style={{ ...patternLinePosition, alignItems: effectiveAlign === 'right' ? 'flex-end' : 'flex-start' }}
          onLayout={handlePatternLayout}
        >
          {patternHeight > 0 && Array.from({ length: dotCount }, (_, i) => (
            <View
              key={i}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: lineColor,
                marginBottom: i === dotCount - 1 ? 0 : gapHeight,
              }}
            />
          ))}
        </View>
      );
    }
    return null;
  };

  const getBulletStyle = (): ViewStyle => ({
    width: finalBulletSize,
    height: finalBulletSize,
    borderRadius: finalBulletSize / 2,
    backgroundColor: showAllColored ? resolvedItemColor : (isActive ? resolvedItemColor : theme.colors.gray[3]),
    borderWidth: lineWidth,
    borderColor: showAllColored ? resolvedItemColor : (isActive ? resolvedItemColor : theme.colors.gray[3]),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
  });

  const getContentStyle = (): ViewStyle => ({
    flex: 1,
  marginLeft: effectiveAlign === 'right' ? 0 : sizeConfig.spacing,
  marginRight: effectiveAlign === 'right' ? sizeConfig.spacing : 0,
  paddingBottom: sizeConfig.spacing * 2,
    alignItems: effectiveAlign === 'right' ? 'flex-end' : 'flex-start',
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: sizeConfig.fontSize,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: title && children ? 4 : 0,
    textAlign: effectiveAlign === 'right' ? 'right' : 'left',
  });

  const getItemWrapperStyle = (): ViewStyle => {
    if (centerMode) {
      return {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'stretch',
      width: '100%',
      } as ViewStyle;
    }
    return {
      flexDirection: effectiveAlign === 'right' ? 'row-reverse' : 'row',
      position: 'relative',
      alignItems: 'flex-start',
    } as ViewStyle;
  };

  if (centerMode) {
    // Three column layout: left content | bullet/line | right content
    const leftContent = effectiveAlign === 'left' && (title || children);
    const rightContent = effectiveAlign === 'right' && (title || children);

    // Helper to clone Text children with alignment
    const alignChildText = (nodes: React.ReactNode, side: 'left' | 'right'): React.ReactNode => {
      return React.Children.map(nodes, (child): React.ReactNode => {
        if (!React.isValidElement(child)) return child;
        const props: any = child.props || {};
        const isTextLike = (child.type as any)?.displayName === 'Text' || (typeof props.children === 'string');
        if (isTextLike) {
          const mergedStyle = Array.isArray(props.style)
            ? [...props.style, { textAlign: side }]
            : [props.style, { textAlign: side }];
          return React.cloneElement(child as any, { style: mergedStyle });
        }
        if (props.children) {
          return React.cloneElement(child as any, { children: alignChildText(props.children, side) });
        }
        return child;
      });
    };
    return (
      <View ref={ref} style={getItemWrapperStyle()} {...rest}>
        {/* Left content placeholder */}
  <View style={{ flex: 1, paddingRight: sizeConfig.spacing, alignItems: 'flex-end' }}>
          {leftContent && (
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              {title && <Text style={[getTitleStyle(), { textAlign: 'right' }]}>{title}</Text>}
              {alignChildText(children, 'right')}
            </View>
          )}
        </View>
        {/* Bullet & line column */}
  <View style={{ width: finalBulletSize, alignItems: 'center', position: 'relative' }}>
          {getLine()}
          <View style={getBulletStyle()}>{bullet}</View>
        </View>
        {/* Right content placeholder */}
  <View style={{ flex: 1, paddingLeft: sizeConfig.spacing, alignItems: 'flex-start' }}>
          {rightContent && (
            <View style={{ width: '100%', alignItems: 'flex-start' }}>
              {title && <Text style={[getTitleStyle(), { textAlign: 'left' }]}>{title}</Text>}
              {alignChildText(children, 'left')}
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View ref={ref} style={getItemWrapperStyle()} {...rest}>
      {getLine()}
      <View style={getBulletStyle()}>{bullet}</View>
      {(title || children) && (
        <View style={getContentStyle()}>
          {title && <Text style={getTitleStyle()}>{title}</Text>}
          {children}
        </View>
      )}
    </View>
  );
});

// Root Timeline
const Timeline = forwardRef<View, TimelineProps>(({
  children,
  active,
  color,
  colorVariant,
  lineWidth,
  bulletSize,
  align = 'left',
  reverseActive = false,
  size = 'md',
  centerMode = false,
  ...rest
}, ref) => {
  const theme = useTheme();
  const clampedSize = clampComponentSize(size, TIMELINE_ALLOWED_SIZES);
  const baseMetrics = resolveTimelineMetrics(clampedSize);

  const resolvedTimelineColor = color || resolveTokenColor(colorVariant, theme) || theme.colors.primary[5];

  const effectiveLineWidth = lineWidth ?? baseMetrics.lineWidth;
  const effectiveBulletSize = bulletSize ?? baseMetrics.bulletSize;
  const metrics: TimelineSizeMetrics = {
    ...baseMetrics,
    lineWidth: effectiveLineWidth,
    bulletSize: effectiveBulletSize,
  };

  const contextValue: TimelineContextValue = {
    active,
    color: resolvedTimelineColor,
    lineWidth: effectiveLineWidth,
    bulletSize: effectiveBulletSize,
    align,
    reverseActive,
    size: clampedSize,
    metrics,
    centerMode,
  };

  const items: React.ReactElement[] = [];
  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child) && (child.type === (TimelineItem as any))) {
      items.push(React.cloneElement(child, { itemIndex: index, key: index } as any));
    }
  });

  const processedItems = centerMode
    ? items.map((item, idx) => {
      const existingAlign = (item.props as any).itemAlign;
      const autoAlign = existingAlign || (idx % 2 === 0 ? 'left' : 'right');
      return React.cloneElement(item, { isLastItem: idx === items.length - 1, key: idx, itemAlign: autoAlign } as any);
    })
    : items.map((item, idx) => React.cloneElement(item, { isLastItem: idx === items.length - 1, key: idx } as any));

  return (
    <TimelineContext.Provider value={contextValue}>
      <View ref={ref} style={{ position: 'relative', width: '100%' }} {...rest}>
        {processedItems}
      </View>
    </TimelineContext.Provider>
  );
});

// Attach
const TimelineWithItems = Timeline as typeof Timeline & { Item: typeof TimelineItem };
TimelineWithItems.Item = TimelineItem;

Timeline.displayName = 'Timeline';
TimelineItem.displayName = 'Timeline.Item';

export { TimelineWithItems as Timeline };
export type { TimelineProps, TimelineItemProps };
