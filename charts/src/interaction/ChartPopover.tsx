import React from 'react';
import { View, Text, Animated, I18nManager } from 'react-native';
import { useChartTheme } from '../theme/ChartThemeContext';
import { useChartInteractionContext } from '../interaction/ChartInteractionContext';
import { useTooltipAggregator } from '../hooks/useTooltipAggregator';

export interface ChartPopoverProps {
  /** Max entries to show by default (after filtering & sorting) */
  maxEntries?: number;
  /** Provide a function to filter entries (return false to exclude) */
  filterEntry?: (entry: any, index: number, all: any[]) => boolean;
  /** Provide custom sort compare; default sorts by |point.x - crosshairX| ascending */
  sortEntries?: (a: any, b: any) => number;
  /** Custom renderer for each entry (fallback to internal) */
  renderEntry?: (entry: any, defaultNode: React.ReactNode) => React.ReactNode;
  /** Optional wrapper header (e.g., x-value or timestamp) */
  renderHeader?: (entries: any[]) => React.ReactNode;
  /** Allow overriding container style */
  style?: any;
}

export const ChartPopover: React.FC<ChartPopoverProps> = (props) => {
  const { maxEntries = 8, filterEntry, sortEntries, renderEntry: customRenderEntry, renderHeader, style } = props;
  const theme = useChartTheme();
  const { config, pointer: interactionPointer, rootOffset, crosshair, series: registeredSeries } = useChartInteractionContext() as any;
  const { entries, anchorPixelX } = useTooltipAggregator();
  const isRTL = I18nManager.isRTL;
  const [reactDomModule, setReactDomModule] = React.useState<typeof import('react-dom') | null>(() => null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('react-dom');
        if (!cancelled) setReactDomModule(mod);
      } catch {
        if (!cancelled) setReactDomModule(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Smooth animated position (lerp towards target)
  const animX = React.useRef(new Animated.Value(0)).current;
  const animY = React.useRef(new Animated.Value(0)).current;
  const targetRef = React.useRef({ x: 0, y: 0 });
  const lastActiveTs = React.useRef<number>(0);
  const [visible, setVisible] = React.useState(false);
  const lastInsideRef = React.useRef(false);
  const rootOffsetRef = React.useRef(rootOffset);
  rootOffsetRef.current = rootOffset;

  // Desired display states – keep hooks unconditional (no early returns) to avoid hook order mismatch.
  const pointerPayload = interactionPointer?.data;
  const candlestickPointer = pointerPayload?.type === 'candlestick' ? pointerPayload : null;
  const bubblePointer = pointerPayload?.type === 'bubble' ? pointerPayload : null;
  const candlestickCustomMap = React.useMemo(() => {
    if (!candlestickPointer) return null;
    const map = new Map<any, any>();
    candlestickPointer.candles.forEach((entry: any) => {
      map.set(entry.datum, entry.formatted);
    });
    return map;
  }, [candlestickPointer]);

  const wantMulti = !!config.multiTooltip && entries.length > 0;
  const wantLive = (!!config.liveTooltip && !!interactionPointer?.inside) || (!!pointerPayload && !!interactionPointer?.inside);
  // Hide whenever the pointer explicitly reports inside === false (mouse left chart). This overrides multi tooltip persistence.
  const explicitlyOutside = interactionPointer?.inside === false;
  const shouldShow = !explicitlyOutside && (wantMulti || wantLive);

  const usePortal = !!(typeof document !== 'undefined' && reactDomModule && (config.popoverPortal ?? true));

  // Compute raw target position (portal uses page coordinates, non-portal uses local container coordinates)
  let rawLeft = 0; let rawTop = 0;
  if (usePortal) {
    if (interactionPointer?.pageX != null && interactionPointer?.pageY != null) {
      rawLeft = interactionPointer.pageX + 14;
      rawTop = interactionPointer.pageY + 14;
    } else if (crosshair?.pixelX != null && rootOffset) {
      rawLeft = crosshair.pixelX + rootOffset.left + 14;
      rawTop = (interactionPointer?.pageY ?? (rootOffset.top + 20)) + 14;
    } else if (anchorPixelX != null && rootOffset) {
      rawLeft = anchorPixelX + rootOffset.left + 14;
      rawTop = (interactionPointer?.pageY ?? (rootOffset.top + 20)) + 14;
    } else if (interactionPointer) {
      // Fallback to local transformed to page if possible
      if (rootOffset) {
        rawLeft = interactionPointer.x + rootOffset.left + 14;
        rawTop = interactionPointer.y + rootOffset.top + 14;
      } else {
        rawLeft = (interactionPointer.pageX || interactionPointer.x) + 14;
        rawTop = (interactionPointer.pageY || interactionPointer.y) + 14;
      }
    }
  } else {
    // Container-relative mode (legacy / RN)
    let baseLeft: number;
    if (interactionPointer?.pageX != null && rootOffset) baseLeft = interactionPointer.pageX - rootOffset.left;
    else if (anchorPixelX != null) baseLeft = anchorPixelX;
    else if (crosshair?.pixelX != null) baseLeft = crosshair.pixelX;
    else baseLeft = interactionPointer?.x || 0;
    let baseTop: number;
    if (interactionPointer?.pageY != null && rootOffset) baseTop = interactionPointer.pageY - rootOffset.top;
    else baseTop = interactionPointer?.y || 0;
    rawLeft = baseLeft + 14;
    rawTop = baseTop + 14;
  }

  // Clamp inside container bounds if we know them (rootOffset + window size approximation)
  // We can't easily access container width/height here without context; attempt minimal viewport clamp to avoid huge drift.
  if (typeof window !== 'undefined') {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    rawLeft = Math.min(Math.max(0, rawLeft), vw - 10); // keep inside viewport horizontally
    rawTop = Math.min(Math.max(0, rawTop), vh - 10);
  }

  // Animate target whenever position changes while we intend to show.
  React.useEffect(() => {
    if (!shouldShow) return;
    targetRef.current = { x: rawLeft, y: rawTop };
    lastActiveTs.current = Date.now();
    Animated.timing(animX, { toValue: rawLeft, duration: 120, useNativeDriver: false }).start();
    Animated.timing(animY, { toValue: rawTop, duration: 120, useNativeDriver: false }).start();
  }, [shouldShow, rawLeft, rawTop, animX, animY]);

  // Visibility with a small grace window (prevents flicker when cursor crosses over the popover itself)
  React.useEffect(() => {
    if (shouldShow) {
      setVisible(true);
      return;
    }
    const timeout = setTimeout(() => {
      // Only hide if still inactive beyond grace
      if (Date.now() - lastActiveTs.current > 170) setVisible(false);
    }, 170);
    return () => clearTimeout(timeout);
  }, [shouldShow]);

  // Hide on document click (outside) & pointer leave viewport
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleDocClick = (e: MouseEvent) => {
      // If pointer currently outside (inside flag false) hide immediately
      if (!interactionPointer?.inside) {
        setVisible(false);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      // If no interactionPointer or recently inside but now left charts area for >250ms, hide
      if (!interactionPointer?.inside && visible) {
        // Debounce with small delay to avoid flicker when passing between charts
        if (!lastInsideRef.current) return; // already outside processed
        lastInsideRef.current = false;
        setTimeout(() => { if (!interactionPointer?.inside) setVisible(false); }, 250);
      } else if (interactionPointer?.inside) {
        lastInsideRef.current = true;
      }
    };
    document.addEventListener('click', handleDocClick, true);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener('click', handleDocClick, true);
      window.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [interactionPointer, visible]);

  const colorLookup = React.useMemo(() => {
    const map = new Map<any, string>();
    (registeredSeries || []).forEach((s: any) => {
      if (s?.id != null && s?.color) map.set(s.id, s.color);
    });
    return map;
  }, [registeredSeries]);

  const renderSeriesDetail = (key: string | number, label: string, color: string, content: any) => (
    <View key={key} style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
        <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
        <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>{label}</Text>
      </View>
      {typeof content === 'string' || typeof content === 'number' ? (
        <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{content}</Text>
      ) : content ? (
        <View style={{ marginTop: 2 }}>{content}</View>
      ) : null}
    </View>
  );

  const baseRenderEntry = (e: any) => {
    const meta = e.point.meta || {};
    const rawDatum = meta.raw;
    const customFromPointer = rawDatum && candlestickCustomMap?.get(rawDatum);
    const customFromMeta = rawDatum && meta.customTooltip;
    const resolvedCustom = customFromPointer ?? customFromMeta;
    const entryColor = meta.color || e.color || theme.colors.accentPalette?.[0] || theme.colors.textPrimary;
    const entryLabel = meta.label || e.label;
    if (resolvedCustom != null && (meta.open != null && meta.high != null && meta.low != null && meta.close != null)) {
      return renderSeriesDetail(e.seriesId, entryLabel, entryColor, resolvedCustom);
    }
    if (meta.customTooltip != null) {
      return renderSeriesDetail(e.seriesId, entryLabel, entryColor, meta.customTooltip);
    }
    // Candlestick special case
    if (meta.open != null && meta.high != null && meta.low != null && meta.close != null) {
      const defaultContent = `O ${meta.open}  H ${meta.high}  L ${meta.low}  C ${meta.close}${meta.volume != null ? `  Vol ${meta.volume}` : ''}`;
      return renderSeriesDetail(e.seriesId, entryLabel, entryColor, defaultContent);
    }
    if (meta.formattedValue != null && meta.value != null && meta.radius != null) {
      return renderSeriesDetail(e.seriesId, entryLabel, entryColor, meta.formattedValue);
    }
    if (meta.bandIndex != null && meta.density != null && meta.value != null) {
      const resolvedUnitSuffix = meta.unitSuffix ?? (meta.unit ? ` ${meta.unit}` : '');
      const fallbackFormatter = (val: number) => `${val.toFixed(2)}${resolvedUnitSuffix}`;
      const formatValue = typeof meta.valueFormatter === 'function' ? meta.valueFormatter : fallbackFormatter;
      const valueLabel = meta.valueLabel ?? formatValue(meta.value);
      const probability = Math.max(0, Math.min(1, meta.probability ?? 0));
      const relativeDensity = Math.max(0, Math.min(1, meta.normalizedDensity ?? meta.density ?? 0));
      const probabilityPercent = (probability * 100).toFixed(probability >= 0.1 ? 1 : 2);
      const relativePercent = (relativeDensity * 100).toFixed(relativeDensity >= 0.1 ? 1 : 2);
      const pdfLabel = meta.pdf != null ? meta.pdf.toFixed(meta.pdf >= 1 ? 2 : 4) : null;
      const stats = meta.stats || {};

      const detail = (
        <View style={{ marginTop: 2 }}>
          <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`Value ${valueLabel}`}</Text>
          <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`Share ${probabilityPercent}%`}</Text>
          <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`Relative ${relativePercent}%`}</Text>
          {pdfLabel != null && (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`PDF ${pdfLabel}`}</Text>
          )}
          {stats.median != null && (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`Median ${formatValue(stats.median)}`}</Text>
          )}
          {stats.p90 != null && (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{`P90 ${formatValue(stats.p90)}`}</Text>
          )}
        </View>
      );
      return renderSeriesDetail(e.seriesId, entryLabel, entryColor, detail);
    }
    // Radar axis value
    if (meta.axis != null && meta.raw) {
      const axisLabel = meta.label ?? meta.raw.label ?? meta.axis;
      const displayValue = meta.formattedValue ?? meta.raw.formattedValue ?? meta.raw.value;
      return (
        <View key={e.seriesId} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ width: 10, height: 10, backgroundColor: entryColor, borderRadius: 5, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
          <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>{entryLabel} • {String(axisLabel)}: {displayValue}</Text>
        </View>
      );
    }
    // Heatmap cell (meta.value & meta.x/meta.y)
    if (meta.value != null && meta.x != null && meta.y != null && meta.label) {
      return (
        <View key={e.seriesId} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ width: 10, height: 10, backgroundColor: entryColor, borderRadius: 2, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
          <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>Col {meta.x}, Row {meta.y}: {meta.value}</Text>
        </View>
      );
    }
    // Histogram bin range (meta.bin or meta.start/end)
    if ((meta.bin && meta.bin.start != null) || (meta.start != null && meta.end != null)) {
      const bin = meta.bin || meta;
      const rangeLabel = `${Number(bin.start).toFixed(2)} – ${Number(bin.end).toFixed(2)}`;
      const val = meta.formattedValue ?? meta.density ?? meta.count ?? bin.count;
      return (
        <View key={e.seriesId} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ width: 10, height: 10, backgroundColor: entryColor, borderRadius: 3, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
          <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>{e.label}: {rangeLabel} = {val}</Text>
        </View>
      );
    }
    // Funnel step (meta.step)
    if (meta.step && meta.step.label) {
      const step = meta.step;
      const conversion = step.conversion ?? (step._conversionComputed); // fallback
      const drop = step.drop ?? step._dropComputed;
      return (
        <View key={e.seriesId} style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, backgroundColor: entryColor, borderRadius: 3, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
            <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>{step.label}: {step.value}</Text>
          </View>
          {conversion != null && (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>Conv {(conversion * 100).toFixed(1)}%{drop != null && ` • Drop ${(drop * 100).toFixed(1)}%`}</Text>
          )}
        </View>
      );
    }
    // Default: label + y
    const formatted = e.point.meta?.formattedValue;
    return (
      <View key={e.seriesId} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }}>
        <View style={{ width: 10, height: 10, backgroundColor: entryColor, borderRadius: 5, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) }} />
        <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>{e.label}: {formatted ?? e.point.y}</Text>
      </View>
    );
  };

  // Derive relevance score (distance to crosshair) when possible for default sorting
  const scored = React.useMemo(() => {
    if (!entries.length) return [] as any[];
    return entries.map(e => {
      const targetX = e.point?.x;
      const crosshairX = e.point?.x; // aggregator already nearest by x; could enhance with actual crosshair
      const score = crosshairX != null && targetX != null ? Math.abs(targetX - crosshairX) : 0;
      return { ...e, _score: score };
    });
  }, [entries]);

  const processed = React.useMemo(() => {
    let arr = scored;
    if (filterEntry) arr = arr.filter(filterEntry);
    const sorter = sortEntries || ((a: any, b: any) => a._score - b._score);
    arr = [...arr].sort(sorter);
    if (arr.length > maxEntries) arr = arr.slice(0, maxEntries);
    return arr;
  }, [scored, filterEntry, sortEntries, maxEntries]);

  const renderEntry = (e: any) => {
    const def = baseRenderEntry(e);
    return customRenderEntry ? customRenderEntry(e, def) : def;
  };

  if (!visible) return null;

  const renderPointerFallback = () => {
    if (candlestickPointer?.candles?.length) {
      const headerValue = candlestickPointer.xValue instanceof Date
        ? candlestickPointer.xValue.toLocaleString()
        : typeof candlestickPointer.xValue === 'number'
          ? candlestickPointer.xValue
          : String(candlestickPointer.xValue ?? '');
      return (
        <View>
          <Text style={{ fontSize: 12, color: theme.colors.textPrimary, marginBottom: 4 }}>{headerValue}</Text>
          {candlestickPointer.candles.map((entry: any) => {
            const { datum, seriesName, seriesId, formatted } = entry;
            const fill = colorLookup.get(seriesId) || theme.colors.accentPalette?.[0] || theme.colors.textPrimary;
            const defaultContent = datum
              ? `O ${datum.open}  H ${datum.high}  L ${datum.low}  C ${datum.close}${datum.volume != null ? `  Vol ${datum.volume}` : ''}`
              : '';
            const content = formatted ?? defaultContent;
            return renderSeriesDetail(`${seriesId}-${entry.dataIndex}`, seriesName || seriesId, fill, content);
          })}
        </View>
      );
    }
    if (bubblePointer) {
      const headerValue = bubblePointer.label || bubblePointer.payload?.label || '';
      const fill = bubblePointer.color || theme.colors.accentPalette?.[0] || theme.colors.textPrimary;
      const content = bubblePointer.customTooltip ?? bubblePointer.formattedValue ?? bubblePointer.value;
      const coordinates: string[] = [];
      if (bubblePointer.rawX != null) coordinates.push(`X: ${bubblePointer.rawX}`);
      if (bubblePointer.rawY != null) coordinates.push(`Y: ${bubblePointer.rawY}`);
      return (
        <View>
          {headerValue ? (
            <Text style={{ fontSize: 12, color: theme.colors.textPrimary, marginBottom: coordinates.length ? 2 : 6 }}>{headerValue}</Text>
          ) : null}
          {coordinates.length ? (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 6 }}>{coordinates.join('  ·  ')}</Text>
          ) : null}
          {renderSeriesDetail('bubble-pointer', 'Size', fill, content)}
        </View>
      );
    }
    return (
      <Text style={{ fontSize: 12, color: theme.colors.textPrimary }}>
        x: {interactionPointer?.x?.toFixed?.(2)} y: {interactionPointer?.y?.toFixed?.(2)}
      </Text>
    );
  };

  const body = (
    <Animated.View
      pointerEvents="none"
      style={{
        position: usePortal ? 'fixed' : 'absolute',
        left: animX,
        top: animY,
        backgroundColor: theme.colors.background,
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.colors.grid,
        maxWidth: 240,
        zIndex: 9999,
        ...style,
      }}
    >
      {config.multiTooltip ? (
        <View>
          {renderHeader && processed.length > 0 && (
            <View style={{ marginBottom: 4 }}>{renderHeader(processed)}</View>
          )}
          {processed.map(renderEntry)}
          {processed.length === 0 && (
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>No data</Text>
          )}
        </View>
      ) : (
        renderPointerFallback()
      )}
    </Animated.View>
  );

  if (usePortal && reactDomModule?.createPortal) {
    return reactDomModule.createPortal(body, document.body);
  }
  return body;
};
