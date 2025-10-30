import React, { createContext, useContext, useRef, useEffect } from 'react';
import { View, Text, Pressable, I18nManager } from 'react-native';
import { useChartTheme } from './theme/ChartThemeContext';
import { BaseChartProps } from './types';
import { ChartInteractionProvider } from './interaction/ChartInteractionContext';
import { ChartPopover } from './interaction/ChartPopover';
import { calculateChartDimensions } from './utils';
import { isWeb } from './utils/platform';

// Lightweight spacing props (decoupled from ui). Extend later if needed.
export interface SpacingProps {
  m?: number; mt?: number; mr?: number; mb?: number; ml?: number; mx?: number; my?: number;
  p?: number; pt?: number; pr?: number; pb?: number; pl?: number; px?: number; py?: number;
}

const extractSpacing = (props: any): { spacing: SpacingProps; rest: any } => {
  const spacing: SpacingProps = {};
  const rest: any = {};
  Object.keys(props).forEach(k => {
    if (['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'].includes(k)) spacing[k as keyof SpacingProps] = props[k];
    else rest[k] = props[k];
  });
  return { spacing, rest };
};

const spacingToStyle = (s: SpacingProps) => {
  const style: any = {};
  if (s.m != null) style.margin = s.m;
  if (s.mx != null) { style.marginLeft = s.mx; style.marginRight = s.mx; }
  if (s.my != null) { style.marginTop = s.my; style.marginBottom = s.my; }
  if (s.mt != null) style.marginTop = s.mt;
  if (s.mr != null) style.marginRight = s.mr;
  if (s.mb != null) style.marginBottom = s.mb;
  if (s.ml != null) style.marginLeft = s.ml;
  if (s.p != null) style.padding = s.p;
  if (s.px != null) { style.paddingLeft = s.px; style.paddingRight = s.px; }
  if (s.py != null) { style.paddingTop = s.py; style.paddingBottom = s.py; }
  if (s.pt != null) style.paddingTop = s.pt;
  if (s.pr != null) style.paddingRight = s.pr;
  if (s.pb != null) style.paddingBottom = s.pb;
  if (s.pl != null) style.paddingLeft = s.pl;
  return style;
};

// Chart Context for sharing configuration
interface ChartContextValue {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  plotArea: { x: number; y: number; width: number; height: number };
  disabled: boolean;
  animationDuration: number;
  animationEasing: string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('Chart compound components must be used within a Chart component');
  }
  return context;
};

// Base Chart Container Component
export const ChartContainer: React.FC<BaseChartProps & {
  children: React.ReactNode;
  padding?: { top: number; right: number; bottom: number; left: number };
  interactionConfig?: any;
  /** If false, assumes parent has provided a ChartInteractionProvider. */
  useOwnInteractionProvider?: boolean;
  /** Suppress internal ChartPopover (useful when sharing one globally). */
  suppressPopover?: boolean;
  popoverProps?: import('./interaction/ChartPopover').ChartPopoverProps;
}> = (props) => {
  const {
    width = 400,
    height = 300,
    padding = { top: 20, right: 20, bottom: 40, left: 60 },
    animationDuration = 500,
    animationEasing = 'ease-out',
    disabled = false,
    children,
    testID,
    style,
    interactionConfig,
    useOwnInteractionProvider = true,
    suppressPopover,
    popoverProps,
    ...rest
  } = props;

  const { spacing, rest: otherProps } = extractSpacing(rest);
  const spacingStyles = spacingToStyle(spacing);

  const dimensions = calculateChartDimensions(width, height, padding);

  const contextValue: ChartContextValue = {
    width,
    height,
    padding,
    plotArea: dimensions.plotArea,
    disabled,
    animationDuration,
    animationEasing,
  };

  // If a parent ChartsProvider supplies interaction context (useOwnInteractionProvider=false) we default to suppressing
  const effectiveSuppressPopover = suppressPopover ?? !useOwnInteractionProvider;

  const content = (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: 'transparent',
          position: 'relative',
        },
        spacingStyles,
        style,
      ]}
      testID={testID}
      {...otherProps}
    >
      {children}
      {!effectiveSuppressPopover && <ChartPopover {...popoverProps} />}
    </View>
  );

  if (!useOwnInteractionProvider) {
    return (
      <ChartContext.Provider value={contextValue}>
        {content}
      </ChartContext.Provider>
    );
  }

  return (
    <ChartContext.Provider value={contextValue}>
      <ChartInteractionProvider config={interactionConfig}>
        <RootOffsetCapture>{content}</RootOffsetCapture>
      </ChartInteractionProvider>
    </ChartContext.Provider>
  );
};

// Internal component to capture root offset once.
const RootOffsetCapture: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<View>(null);
  // dynamic import to avoid circular
  const { useChartInteractionContext } = require('./interaction/ChartInteractionContext');
  let ctx: any = null; try { ctx = useChartInteractionContext(); } catch { }
  useEffect(() => {
    if (!ref.current || !ctx?.setRootOffset) return;
    // Only run DOM measurement logic on web
    if (!isWeb()) {
      // On native, we can approximate (0,0) or attempt async measure if needed later.
      // Set a neutral offset once so interactions still work with local coordinates.
      try { ctx.setRootOffset({ left: 0, top: 0 }); } catch { }
      return; // Skip DOM listeners
    }
    const update = () => {
      try {
        const el = (ref.current as any)?._internalFiberInstanceHandleDEV?.stateNode || ref.current;
        if (el && el.getBoundingClientRect) {
          const r = el.getBoundingClientRect();
          ctx.setRootOffset({ left: r.left + window.scrollX, top: r.top + window.scrollY });
        }
      } catch { }
    };
    update();
    window.addEventListener?.('scroll', update, { passive: true } as any);
    window.addEventListener?.('resize', update as any);
    return () => {
      window.removeEventListener?.('scroll', update as any);
      window.removeEventListener?.('resize', update as any);
    };
  }, [ctx?.setRootOffset]);
  return <View ref={ref} style={{ position: 'relative', display: 'contents' as any }}>{children}</View>;
};

// Chart Title Component
export const ChartTitle: React.FC<{
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleSize?: number;
  subtitleSize?: number;
  align?: 'left' | 'center' | 'right';
  style?: any;
}> = (props) => {
  const {
    title,
    subtitle,
    titleColor,
    subtitleColor,
    titleSize = 18,
    subtitleSize = 14,
    align = 'center',
    style,
  } = props;

  const theme = useChartTheme();
  const context = useChartContext();
  // (Title component) no legend adjustments needed here

  if (!title && !subtitle) return null;

  const alignStyle = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }[align];

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          alignItems: alignStyle,
          paddingHorizontal: 10,
          paddingVertical: 5,
          zIndex: 10,
        },
        style,
      ]}
    >
      {title && (
        <Text
          style={{
            fontSize: titleSize,
            fontWeight: '600',
            color: titleColor || theme.colors.textPrimary,
            textAlign: align,
          }}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{
            fontSize: subtitleSize,
            fontWeight: '400',
            color: subtitleColor || theme.colors.textSecondary,
            textAlign: align,
            marginTop: title ? 4 : 0,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// Chart Legend Component
export const ChartLegend: React.FC<{
  items: Array<{ label: string; color: string; visible?: boolean }>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  textColor?: string;
  fontSize?: number;
  /** onItemPress now receives (item, index, nativeEvent?) where nativeEvent may hold modifier keys (altKey, metaKey, shiftKey, ctrlKey) on web */
  onItemPress?: (item: any, index: number, nativeEvent?: any) => void;
  style?: any;
}> = (props) => {
  const {
    items,
    position = 'bottom',
    align = 'center',
    textColor,
    fontSize = 12,
    onItemPress,
    style,
  } = props;

  const theme = useChartTheme();
  const context = useChartContext();
  // Pressable's onPress event (RN / RN Web) often omits modifier keys; capture last pointerdown globally (web only)
  const lastMods = React.useRef<{ altKey: boolean; metaKey: boolean; shiftKey: boolean; ctrlKey: boolean }>({ altKey: false, metaKey: false, shiftKey: false, ctrlKey: false });
  React.useEffect(() => {
    // Only register global pointer listener on web where window API exists
    if (!isWeb()) return;
    const handler = (e: any) => {
      lastMods.current = {
        altKey: !!e.altKey,
        metaKey: !!e.metaKey,
        shiftKey: !!e.shiftKey,
        ctrlKey: !!e.ctrlKey,
      };
    };
    window.addEventListener('pointerdown', handler, { passive: true } as any);
    return () => window.removeEventListener('pointerdown', handler as any);
  }, []);

  if (!items || items.length === 0) return null;

  const isHorizontal = position === 'top' || position === 'bottom';
  const alignStyle = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }[align];

  const positionStyle = {
    top: { top: 0, left: 0, right: 0 },
    bottom: { bottom: 0, left: 0, right: 0 },
    left: { left: 0, top: 0, bottom: 0 },
    right: { right: 0, top: 0, bottom: 0 },
  }[position];

  // Determine an accessible legend text color when host theme background is dark
  const computeReadable = React.useCallback((fallback: string) => {
    const hex = (fallback || '').startsWith('#') ? fallback : theme.colors.textPrimary;
    const bg = theme.colors.background || '#000';
    const parse = (h: string) => {
      const s = h.replace('#', '');
      if (s.length === 3) return [parseInt(s[0] + s[0], 16), parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16)];
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    const lum = (r: number, g: number, b: number) => {
      const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    const [br, bgG, bb] = parse(bg);
    const bgLum = lum(br, bgG, bb);
    if (bgLum < 0.35) return '#f5f6f8';
    return fallback || hex;
  }, [theme.colors.background, theme.colors.textPrimary]);

  const isRTL = I18nManager.isRTL;

  return (
    <View
      style={[
        {
          position: 'absolute',
          ...positionStyle,
          flexDirection: isHorizontal ? (isRTL ? 'row-reverse' : 'row') : 'column',
          alignItems: alignStyle,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: 10,
          zIndex: 10,
        },
        style,
      ]}
    >
      {items.map((item, index) => (
        <Pressable
          key={index}
          onPress={(e: any) => {
            const native = e?.nativeEvent || {};
            const enriched = { ...native, ...lastMods.current };
            onItemPress?.(item, index, enriched);
          }}
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            marginHorizontal: isHorizontal ? 8 : 0,
            marginVertical: isHorizontal ? 0 : 4,
            opacity: item.visible !== false ? 1 : 0.5,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: item.color,
              borderRadius: 2,
              ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }),
            }}
          />
          <Text
            style={{
              fontSize,
              color: textColor || computeReadable(theme.colors.textPrimary),
              fontFamily: theme.fontFamily,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

// Display names
ChartContainer.displayName = 'Chart.Container';
ChartTitle.displayName = 'Chart.Title';
ChartLegend.displayName = 'Chart.Legend';
