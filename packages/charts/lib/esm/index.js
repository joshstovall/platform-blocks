import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { createContext, useContext, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { I18nManager, Animated, View, Text, Pressable, Platform, AccessibilityInfo, PanResponder } from 'react-native';
import Animated$1, { useSharedValue, withSpring, useAnimatedProps, withTiming, Easing, withDelay, useAnimatedStyle, withSequence } from 'react-native-reanimated';
import Svg, { Line, Defs, Pattern, Rect, Text as Text$1, G, Path, RadialGradient, Stop, LinearGradient, Filter, FeGaussianBlur, FeOffset, FeFlood, FeComposite, FeMerge, FeMergeNode, TSpan, Circle } from 'react-native-svg';

/**
 * Chart utility functions
 */
/**
 * Get data domain from multiple series
 */
function getMultiSeriesDomain(series, accessor) {
    const allData = series.filter(s => s.visible !== false).flatMap(s => s.data);
    return getDataDomain(allData, accessor);
}
/**
 * Normalize data/series input for LineChart
 */
function normalizeLineChartData(data, series) {
    if (series && series.length > 0) {
        return series;
    }
    if (data && data.length > 0) {
        return [{
                id: 'default',
                name: 'Data Series',
                data,
                visible: true,
            }];
    }
    return [];
}
/**
 * Calculate chart dimensions including padding for axes and labels
 */
function calculateChartDimensions(width, height, padding) {
    return {
        plotArea: {
            x: padding.left,
            y: padding.top,
            width: width - padding.left - padding.right,
            height: height - padding.top - padding.bottom,
        },
        total: { width, height },
        padding,
    };
}
/**
 * Scale a value from data domain to chart range
 */
function scaleLinear(value, domain, range) {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;
    if (domainMax === domainMin) {
        return rangeMin;
    }
    const ratio = (value - domainMin) / (domainMax - domainMin);
    return rangeMin + ratio * (rangeMax - rangeMin);
}
/** Log scale (base 10) */
function scaleLog(value, domain, range) {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const v = Math.max(value, 1e-12);
    const ld0 = Math.log10(Math.max(d0, 1e-12));
    const ld1 = Math.log10(Math.max(d1, 1e-12));
    if (ld1 === ld0)
        return r0;
    const t = (Math.log10(v) - ld0) / (ld1 - ld0);
    return r0 + t * (r1 - r0);
}
/** Time scale (value = ms epoch) linear wrapper */
function scaleTime(value, domain, range) {
    return scaleLinear(value, domain, range);
}
function generateLogTicks(domain, count = 6) {
    const [rawMin, rawMax] = domain;
    const min = Math.max(rawMin, 1e-12);
    const max = Math.max(rawMax, 1e-12);
    if (max <= min)
        return [min];
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const ticks = [];
    const span = logMax - logMin;
    for (let exp = Math.floor(logMin); exp <= Math.ceil(logMax); exp++) {
        [1, 2, 5].forEach(m => {
            const v = m * Math.pow(10, exp);
            const lv = Math.log10(v);
            if (lv < logMin - 1e-9 || lv > logMax + 1e-9)
                return;
            ticks.push(v);
        });
    }
    if (ticks.length > count * 1.8) {
        const ratio = Math.ceil(ticks.length / count);
        return ticks.filter((_, i) => i % ratio === 0);
    }
    while (ticks.length < count) {
        const needed = count - ticks.length;
        for (let i = 0; i < needed; i++) {
            const pos = (i + 1) / (needed + 1);
            ticks.push(Math.pow(10, logMin + span * pos));
        }
        ticks.sort((a, b) => a - b);
        break;
    }
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
}
function generateTimeTicks(domain, count = 6) {
    const [start, end] = domain;
    if (!(isFinite(start) && isFinite(end)) || end <= start)
        return [start];
    const span = end - start;
    // Choose nice interval
    const intervals = [
        1000, 5000, 15000, 30000, // seconds
        60000, 300000, 600000, 900000, 1800000, // minutes
        3600000, 7200000, 14400000, 28800000, 43200000, // hours
        86400000, 172800000, 604800000, // days / week
        2592000000, 7776000000, 15552000000, // months approx (30d, 90d, 180d)
        31536000000 // year
    ];
    let interval = intervals[intervals.length - 1];
    for (const iv of intervals) {
        if (span / iv <= count * 1.2) {
            interval = iv;
            break;
        }
    }
    const first = Math.ceil(start / interval) * interval;
    const ticks = [];
    for (let t = first; t <= end; t += interval)
        ticks.push(t);
    if (ticks.length < 2)
        return [start, end];
    return ticks;
}
/**
 * Get data domain (min/max values) from dataset
 */
function getDataDomain(data, accessor) {
    if (data.length === 0) {
        return [0, 1];
    }
    const values = data.map(accessor);
    return [Math.min(...values), Math.max(...values)];
}
/**
 * Generate nice tick values for an axis
 */
function generateTicks(min, max, targetCount = 5) {
    if (min === max) {
        return [min];
    }
    const range = max - min;
    const roughStep = range / (targetCount - 1);
    // Find the power of 10 that's less than or equal to roughStep
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    // Normalize the step to a nice value
    const normalizedStep = roughStep / magnitude;
    let step;
    if (normalizedStep <= 1) {
        step = magnitude;
    }
    else if (normalizedStep <= 2) {
        step = 2 * magnitude;
    }
    else if (normalizedStep <= 5) {
        step = 5 * magnitude;
    }
    else {
        step = 10 * magnitude;
    }
    // Generate ticks
    const ticks = [];
    const start = Math.ceil(min / step) * step;
    for (let tick = start; tick <= max + step * 0.01; tick += step) {
        ticks.push(Number(tick.toFixed(10))); // Avoid floating point precision issues
    }
    return ticks;
}
/**
 * Convert chart coordinates to data coordinates
 */
function chartToDataCoordinates(chartX, chartY, plotArea, xDomain, yDomain) {
    const relativeX = (chartX - plotArea.x) / plotArea.width;
    const relativeY = (chartY - plotArea.y) / plotArea.height;
    const dataX = scaleLinear(relativeX, [0, 1], xDomain);
    const dataY = scaleLinear(1 - relativeY, [0, 1], yDomain); // Flip Y axis
    return { x: dataX, y: dataY };
}
/**
 * Convert data coordinates to chart coordinates
 */
function dataToChartCoordinates(dataX, dataY, plotArea, xDomain, yDomain) {
    const relativeX = scaleLinear(dataX, xDomain, [0, 1]);
    const relativeY = scaleLinear(dataY, yDomain, [0, 1]);
    const chartX = plotArea.x + relativeX * plotArea.width;
    const chartY = plotArea.y + (1 - relativeY) * plotArea.height; // Flip Y axis
    return { x: chartX, y: chartY };
}
/**
 * Find the closest data point to a chart coordinate
 */
function findClosestDataPoint(chartX, chartY, data, plotArea, xDomain, yDomain, maxDistance = 20) {
    let closestPoint = null;
    let closestDistance = Infinity;
    for (const point of data) {
        const chartCoords = dataToChartCoordinates(point.x, point.y, plotArea, xDomain, yDomain);
        const distance = Math.sqrt(Math.pow(chartX - chartCoords.x, 2) + Math.pow(chartY - chartCoords.y, 2));
        if (distance < closestDistance && distance <= maxDistance) {
            closestDistance = distance;
            closestPoint = point;
        }
    }
    return closestPoint ? { dataPoint: closestPoint, distance: closestDistance } : null;
}
/**
 * Calculate angle for pie chart slice
 */
function calculatePieAngle(value, total, startAngle = 0, endAngle = 360) {
    const totalAngle = endAngle - startAngle;
    const percentage = value / total;
    const sliceAngle = percentage * totalAngle;
    const sliceStart = startAngle;
    const sliceEnd = startAngle + sliceAngle;
    const sliceCenter = startAngle + sliceAngle / 2;
    return {
        startAngle: sliceStart,
        endAngle: sliceEnd,
        centerAngle: sliceCenter,
    };
}
/**
 * Calculate point on circle for pie chart labels
 */
function getPointOnCircle$1(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleInRadians - Math.PI / 2);
    const y = centerY + radius * Math.sin(angleInRadians - Math.PI / 2);
    return { x, y };
}
/**
 * Create smooth path for line chart
 */
function createSmoothPath(points) {
    if (points.length < 2) {
        return '';
    }
    if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        if (i === 1) {
            // First curve
            const cp1x = prev.x + (curr.x - prev.x) * 0.3;
            const cp1y = prev.y;
            const cp2x = curr.x - (next ? (next.x - prev.x) * 0.2 : (curr.x - prev.x) * 0.3);
            const cp2y = curr.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
        else if (i === points.length - 1) {
            // Last curve
            const cp1x = prev.x + (curr.x - points[i - 2].x) * 0.2;
            const cp1y = prev.y;
            const cp2x = curr.x - (curr.x - prev.x) * 0.3;
            const cp2y = curr.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
        else {
            // Middle curves
            const cp1x = prev.x + (curr.x - points[i - 2].x) * 0.2;
            const cp1y = prev.y;
            const cp2x = curr.x - (next.x - prev.x) * 0.2;
            const cp2y = curr.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
    }
    return path;
}
/**
 * Default color schemes
 */
const FALLBACK_DEFAULT_SCHEME = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#f97316', // orange
    '#06b6d4', // cyan
    '#ec4899', // pink
];
const colorSchemes = {
    default: [...FALLBACK_DEFAULT_SCHEME],
    pastel: [
        '#93c5fd', // blue-300
        '#fca5a5', // red-300
        '#6ee7b7', // green-300
        '#fcd34d', // amber-300
        '#c4b5fd', // violet-300
        '#fdba74', // orange-300
        '#67e8f9', // cyan-300
        '#f9a8d4', // pink-300
    ],
};
/**
 * Replace the default categorical palette while preserving reference identity for consumers.
 */
function setDefaultColorScheme(palette) {
    const next = Array.isArray(palette) && palette.length ? palette : [...FALLBACK_DEFAULT_SCHEME];
    colorSchemes.default = next.map(color => `${color}`);
    return colorSchemes.default;
}
/**
 * Get color from scheme
 */
function getColorFromScheme(index, scheme = colorSchemes.default) {
    return scheme[index % scheme.length];
}
/**
 * Clamp value between min and max
 */
function clamp$6(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/**
 * Linear interpolation
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}
/**
 * Calculate distance between two points
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
/**
 * Format number for display
 */
function formatNumber$2(value, decimals = 2, locale = 'en-US') {
    return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    });
}
/**
 * Format percentage for display
 */
function formatPercentage(value, total, decimals = 1) {
    const percentage = (value / total) * 100;
    return `${formatNumber$2(percentage, decimals)}%`;
}

const defaultTheme = {
    colors: {
        textPrimary: '#111', // will be overridden by host when provided
        textSecondary: '#555',
        background: '#ffffff',
        grid: '#e3e3e3',
        accentPalette: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899']
    },
    fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
    radius: 4,
    fontFamily: 'System',
};
const ChartThemeCtx = createContext(defaultTheme);
/**
 * Provider component for chart theming
 * @param value - Partial theme overrides
 * @param hostThemeBridge - Optional bridge to host design system theme
 * @param children - Child components to render
 */
const ChartThemeProvider = ({ value, hostThemeBridge, children }) => {
    var _a, _b, _c, _d, _e, _f;
    const paletteRef = useRef(null);
    const merged = {
        ...defaultTheme,
        ...value,
        colors: {
            ...defaultTheme.colors,
            ...((value === null || value === void 0 ? void 0 : value.colors) || {}),
            ...(hostThemeBridge ? {
                textPrimary: (_a = hostThemeBridge.textPrimary) !== null && _a !== void 0 ? _a : defaultTheme.colors.textPrimary,
                textSecondary: (_b = hostThemeBridge.textSecondary) !== null && _b !== void 0 ? _b : defaultTheme.colors.textSecondary,
                background: (_c = hostThemeBridge.background) !== null && _c !== void 0 ? _c : defaultTheme.colors.background,
                grid: (_d = hostThemeBridge.grid) !== null && _d !== void 0 ? _d : defaultTheme.colors.grid,
                accentPalette: (_e = hostThemeBridge.accentPalette) !== null && _e !== void 0 ? _e : defaultTheme.colors.accentPalette,
            } : {})
        },
        fontSize: { ...defaultTheme.fontSize, ...((value === null || value === void 0 ? void 0 : value.fontSize) || {}) },
        fontFamily: (hostThemeBridge === null || hostThemeBridge === void 0 ? void 0 : hostThemeBridge.fontFamily) || (value === null || value === void 0 ? void 0 : value.fontFamily) || defaultTheme.fontFamily,
    };
    const palette = Array.isArray((_f = merged.colors) === null || _f === void 0 ? void 0 : _f.accentPalette) && merged.colors.accentPalette.length
        ? merged.colors.accentPalette
        : defaultTheme.colors.accentPalette;
    const paletteKey = palette.join('|');
    if (paletteRef.current !== paletteKey) {
        paletteRef.current = paletteKey;
        setDefaultColorScheme([...palette]);
    }
    return jsx(ChartThemeCtx.Provider, { value: merged, children: children });
};
/**
 * Hook to access the current chart theme
 * @returns Current chart theme configuration
 */
function useChartTheme() {
    return useContext(ChartThemeCtx);
}

const InteractionContext = createContext(null);
/**
 * Hook to access the chart interaction context
 * @throws Error if used outside of ChartInteractionProvider
 */
const useChartInteractionContext = () => {
    const ctx = useContext(InteractionContext);
    if (!ctx)
        throw new Error('useChartInteractionContext must be used within <ChartInteractionProvider>');
    return ctx;
};
/**
 * Provider component for chart interaction state and behaviors
 */
const ChartInteractionProvider = ({ config = {}, children }) => {
    var _a;
    const [state, setState] = useState({
        pointer: null,
        crosshair: null,
        selectedPoints: [],
        series: [],
        domains: null,
        rootOffset: null,
    });
    const registerSeries = useCallback((s) => {
        setState(prev => {
            var _a;
            const idx = prev.series.findIndex(sr => sr.id === s.id);
            // Ensure points sorted by x
            let pts = s.points;
            if (pts.length > 1) {
                let sorted = true;
                for (let i = 1; i < pts.length; i++) {
                    if (pts[i].x < pts[i - 1].x) {
                        sorted = false;
                        break;
                    }
                }
                if (!sorted)
                    pts = [...pts].sort((a, b) => a.x - b.x);
            }
            if (idx >= 0) {
                const existing = prev.series[idx];
                const pointsChanged = existing.points.length !== pts.length || (existing.points.length && (() => {
                    const a = existing.points[existing.points.length - 1];
                    const b = pts[pts.length - 1];
                    return a.x !== b.x || a.y !== b.y;
                })());
                const metaChanged = existing.name !== s.name || existing.color !== s.color;
                if (!pointsChanged && !metaChanged)
                    return prev;
                const nextSeries = [...prev.series];
                nextSeries[idx] = { ...existing, ...s, points: pts, visible: existing.visible };
                return { ...prev, series: nextSeries };
            }
            return { ...prev, series: [...prev.series, { ...s, points: pts, visible: (_a = s.visible) !== null && _a !== void 0 ? _a : true }] };
        });
    }, []);
    const updateSeriesVisibility = useCallback((id, visible) => {
        setState(prev => ({ ...prev, series: prev.series.map(s => s.id === id ? { ...s, visible } : s) }));
    }, []);
    // rAF coalesced pointer setter
    const rafRef = useRef(null);
    const pendingPointer = useRef(null);
    const lastPointer = useRef(null);
    const pointerThreshold = (_a = config.pointerPixelThreshold) !== null && _a !== void 0 ? _a : 0;
    const flushPointer = () => {
        rafRef.current = null;
        if (pendingPointer.current) {
            const next = pendingPointer.current;
            pendingPointer.current = null;
            lastPointer.current = next;
            setState(prev => ({ ...prev, pointer: next }));
        }
    };
    const setPointer = useCallback((p) => {
        var _a, _b, _c, _d;
        if (!config.pointerRAF && pointerThreshold === 0) {
            setState(prev => ({ ...prev, pointer: p }));
            return;
        }
        if (lastPointer.current && p && pointerThreshold > 0) {
            const dx = ((_a = p.pageX) !== null && _a !== void 0 ? _a : p.x) - ((_b = lastPointer.current.pageX) !== null && _b !== void 0 ? _b : lastPointer.current.x);
            const dy = ((_c = p.pageY) !== null && _c !== void 0 ? _c : p.y) - ((_d = lastPointer.current.pageY) !== null && _d !== void 0 ? _d : lastPointer.current.y);
            if (Math.abs(dx) < pointerThreshold && Math.abs(dy) < pointerThreshold) {
                return; // below movement threshold
            }
        }
        pendingPointer.current = p;
        if (config.pointerRAF) {
            if (rafRef.current == null && typeof window !== 'undefined') {
                rafRef.current = window.requestAnimationFrame(flushPointer);
            }
        }
        else {
            flushPointer();
        }
    }, [config.pointerRAF, pointerThreshold]);
    const setRootOffset = useCallback((o) => setState(prev => prev.rootOffset ? prev : ({ ...prev, rootOffset: o })), []);
    // rAF crosshair throttling
    const crosshairRAFRef = useRef(null);
    const pendingCrosshair = useRef(null);
    const hasPendingCrosshair = useRef(false);
    const resolveCrosshairValue = useCallback((prev, next) => {
        var _a, _b;
        if (next !== null)
            return next;
        if (config.stickyCrosshair === false)
            return null;
        const pointerActive = ((_a = prev.pointer) === null || _a === void 0 ? void 0 : _a.inside) || ((_b = prev.pointer) === null || _b === void 0 ? void 0 : _b.insideX);
        if (pointerActive)
            return prev.crosshair;
        return null;
    }, [config.stickyCrosshair]);
    const applyCrosshairUpdate = useCallback((next) => {
        setState(prev => {
            const resolved = resolveCrosshairValue(prev, next);
            if (resolved === prev.crosshair)
                return prev;
            return { ...prev, crosshair: resolved };
        });
    }, [resolveCrosshairValue]);
    const flushCrosshair = () => {
        crosshairRAFRef.current = null;
        if (!hasPendingCrosshair.current)
            return;
        hasPendingCrosshair.current = false;
        const next = pendingCrosshair.current;
        pendingCrosshair.current = null;
        applyCrosshairUpdate(next);
    };
    const setCrosshair = useCallback((c) => {
        if (!config.crosshairRAF) {
            applyCrosshairUpdate(c);
            return;
        }
        pendingCrosshair.current = c;
        hasPendingCrosshair.current = true;
        if (crosshairRAFRef.current == null && typeof window !== 'undefined') {
            crosshairRAFRef.current = window.requestAnimationFrame(flushCrosshair);
        }
    }, [config.crosshairRAF, applyCrosshairUpdate]);
    const initializeDomains = useCallback((initial) => setState(prev => ({ ...prev, domains: { initial, current: initial } })), []);
    const setDomains = useCallback((d) => setState(prev => {
        if (!prev.domains)
            return prev;
        const current = prev.domains.current;
        let next = { ...current };
        if (d.x)
            next.x = d.x;
        if (d.y)
            next.y = d.y;
        if (d.x && d.y == null && Array.isArray(d))
            next.x = d;
        return { ...prev, domains: { ...prev.domains, current: next } };
    }), []);
    const resetZoom = useCallback(() => setState(prev => prev.domains ? { ...prev, domains: { ...prev.domains, current: prev.domains.initial } } : prev), []);
    return (jsx(InteractionContext.Provider, { value: {
            ...state,
            config,
            registerSeries,
            updateSeriesVisibility,
            setPointer,
            setRootOffset,
            setCrosshair,
            initializeDomains,
            setDomains,
            resetZoom,
        }, children: children }));
};

const EPSILON$1 = 1e-9;
const preferEntry = (current, candidate) => {
    var _a, _b;
    if (!current)
        return candidate;
    if (candidate.distanceX + EPSILON$1 < current.distanceX)
        return candidate;
    if (Math.abs(candidate.distanceX - current.distanceX) <= EPSILON$1) {
        const candidateDy = (_a = candidate.distanceY) !== null && _a !== void 0 ? _a : Infinity;
        const currentDy = (_b = current.distanceY) !== null && _b !== void 0 ? _b : Infinity;
        if (candidateDy + EPSILON$1 < currentDy) {
            return candidate;
        }
    }
    return current;
};
const getPointPixelX = (point) => {
    if (typeof point.pixelX === 'number')
        return point.pixelX;
    const meta = point.meta || {};
    if (typeof meta.chartX === 'number')
        return meta.chartX;
    if (typeof meta.pixelX === 'number')
        return meta.pixelX;
    if (typeof meta.xPixel === 'number')
        return meta.xPixel;
    return undefined;
};
const getPointPixelY = (point) => {
    if (typeof point.pixelY === 'number')
        return point.pixelY;
    const meta = point.meta || {};
    if (typeof meta.chartY === 'number')
        return meta.chartY;
    if (typeof meta.pixelY === 'number')
        return meta.pixelY;
    if (typeof meta.yPixel === 'number')
        return meta.yPixel;
    return undefined;
};
const resolveDistanceX = (point, targetDataX, targetPixelX) => {
    const pointPixelX = getPointPixelX(point);
    if (targetPixelX != null && pointPixelX != null) {
        return Math.abs(pointPixelX - targetPixelX);
    }
    return Math.abs(point.x - targetDataX);
};
const resolveDistanceY = (point, pointerY) => {
    if (pointerY == null)
        return undefined;
    const pointPixelY = getPointPixelY(point);
    if (pointPixelY == null)
        return undefined;
    return Math.abs(pointPixelY - pointerY);
};
const findNearestPoint = (points, targetX, targetPixelX, pointerY) => {
    if (!points.length)
        return null;
    if (points.length === 1) {
        const point = points[0];
        return {
            point,
            distanceX: resolveDistanceX(point, targetX, targetPixelX),
            distanceY: resolveDistanceY(point, pointerY),
            pixelX: getPointPixelX(point),
            pixelY: getPointPixelY(point),
        };
    }
    let lo = 0;
    let hi = points.length - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (points[mid].x === targetX) {
            lo = hi = mid;
            break;
        }
        if (points[mid].x < targetX) {
            lo = mid;
        }
        else {
            hi = mid;
        }
    }
    const candidateIndices = new Set();
    candidateIndices.add(lo);
    candidateIndices.add(hi);
    let bestDataDx = Infinity;
    candidateIndices.forEach((idx) => {
        bestDataDx = Math.min(bestDataDx, Math.abs(points[idx].x - targetX));
    });
    const expand = (start, step) => {
        let idx = start + step;
        while (idx >= 0 && idx < points.length) {
            const dx = Math.abs(points[idx].x - targetX);
            if (dx - bestDataDx <= EPSILON$1) {
                candidateIndices.add(idx);
                bestDataDx = Math.min(bestDataDx, dx);
                idx += step;
            }
            else {
                break;
            }
        }
    };
    expand(lo, -1);
    expand(hi, 1);
    let bestIndex = lo;
    let bestDxValue = resolveDistanceX(points[bestIndex], targetX, targetPixelX);
    let bestDy = resolveDistanceY(points[bestIndex], pointerY);
    candidateIndices.forEach((idx) => {
        const point = points[idx];
        const dx = resolveDistanceX(point, targetX, targetPixelX);
        const dy = resolveDistanceY(point, pointerY);
        if (dx + EPSILON$1 < bestDxValue) {
            bestIndex = idx;
            bestDxValue = dx;
            bestDy = dy;
            return;
        }
        if (Math.abs(dx - bestDxValue) <= EPSILON$1) {
            const candidateDy = dy !== null && dy !== void 0 ? dy : Infinity;
            const currentBestDy = bestDy !== null && bestDy !== void 0 ? bestDy : Infinity;
            if (candidateDy + EPSILON$1 < currentBestDy) {
                bestIndex = idx;
                bestDy = dy;
            }
        }
    });
    const chosen = points[bestIndex];
    return {
        point: chosen,
        distanceX: bestDxValue,
        distanceY: bestDy,
        pixelX: getPointPixelX(chosen),
        pixelY: getPointPixelY(chosen),
    };
};
const useTooltipAggregator = () => {
    var _a, _b, _c, _d, _e;
    const { crosshair, series, pointer, config } = useChartInteractionContext();
    const pointerInside = (pointer === null || pointer === void 0 ? void 0 : pointer.inside) || (pointer === null || pointer === void 0 ? void 0 : pointer.insideX);
    const pointerY = pointerInside && typeof (pointer === null || pointer === void 0 ? void 0 : pointer.y) === 'number' ? pointer.y : null;
    const { entries: collectedEntries, bestEntry } = useMemo(() => {
        var _a;
        if (!crosshair)
            return { entries: [], bestEntry: null };
        const targetX = crosshair.dataX;
        const targetPixelX = (_a = crosshair.pixelX) !== null && _a !== void 0 ? _a : null;
        const visibleSeries = series.filter((s) => s.visible && s.points.length);
        const collected = visibleSeries
            .map((s) => {
            const nearest = findNearestPoint(s.points, targetX, targetPixelX, pointerY);
            if (!nearest)
                return null;
            return {
                ...nearest,
                seriesId: s.id,
                label: s.name || String(s.id),
                color: s.color,
            };
        })
            .filter((entry) => entry !== null);
        let best = null;
        collected.forEach((entry) => {
            best = preferEntry(best, entry);
        });
        return { entries: collected, bestEntry: best };
    }, [crosshair, series, pointerY]);
    const multiEntries = config.multiTooltip ? collectedEntries : [];
    const anchorPixelX = (_b = (_a = bestEntry === null || bestEntry === void 0 ? void 0 : bestEntry.pixelX) !== null && _a !== void 0 ? _a : crosshair === null || crosshair === void 0 ? void 0 : crosshair.pixelX) !== null && _b !== void 0 ? _b : (pointerInside ? (_c = pointer === null || pointer === void 0 ? void 0 : pointer.x) !== null && _c !== void 0 ? _c : null : null);
    const anchorPixelY = (_d = bestEntry === null || bestEntry === void 0 ? void 0 : bestEntry.pixelY) !== null && _d !== void 0 ? _d : (pointerInside ? (_e = pointer === null || pointer === void 0 ? void 0 : pointer.y) !== null && _e !== void 0 ? _e : null : null);
    return { entries: multiEntries, bestEntry, anchorPixelX, anchorPixelY, pointer };
};

const ChartPopover = (props) => {
    var _a, _b, _c, _d;
    const { maxEntries = 8, filterEntry, sortEntries, renderEntry: customRenderEntry, renderHeader, style } = props;
    const theme = useChartTheme();
    const { config, pointer: interactionPointer, rootOffset, crosshair, series: registeredSeries } = useChartInteractionContext();
    const { entries, bestEntry, anchorPixelX, anchorPixelY } = useTooltipAggregator();
    const isRTL = I18nManager.isRTL;
    const [reactDomModule, setReactDomModule] = React.useState(() => null);
    React.useEffect(() => {
        if (typeof document === 'undefined')
            return;
        let cancelled = false;
        (async () => {
            try {
                const mod = await import('react-dom');
                if (!cancelled)
                    setReactDomModule(mod);
            }
            catch (_a) {
                if (!cancelled)
                    setReactDomModule(null);
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
    const lastActiveTs = React.useRef(0);
    const [visible, setVisible] = React.useState(false);
    const lastInsideRef = React.useRef(false);
    const rootOffsetRef = React.useRef(rootOffset);
    rootOffsetRef.current = rootOffset;
    // Desired display states – keep hooks unconditional (no early returns) to avoid hook order mismatch.
    const pointerPayload = interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.data;
    const candlestickPointer = (pointerPayload === null || pointerPayload === void 0 ? void 0 : pointerPayload.type) === 'candlestick' ? pointerPayload : null;
    const bubblePointer = (pointerPayload === null || pointerPayload === void 0 ? void 0 : pointerPayload.type) === 'bubble' ? pointerPayload : null;
    const candlestickCustomMap = React.useMemo(() => {
        if (!candlestickPointer)
            return null;
        const map = new Map();
        candlestickPointer.candles.forEach((entry) => {
            map.set(entry.datum, entry.formatted);
        });
        return map;
    }, [candlestickPointer]);
    const wantMulti = !!config.multiTooltip && entries.length > 0;
    const wantLive = (!!config.liveTooltip && !!(interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside)) || (!!pointerPayload && !!(interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside));
    // Hide whenever the pointer explicitly reports inside === false (mouse left chart). This overrides multi tooltip persistence.
    const explicitlyOutside = (interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside) === false;
    const shouldShow = !explicitlyOutside && (wantMulti || wantLive);
    const usePortal = !!(typeof document !== 'undefined' && reactDomModule && ((_a = config.popoverPortal) !== null && _a !== void 0 ? _a : true));
    const followMode = (_b = config.popoverFollowMode) !== null && _b !== void 0 ? _b : 'crosshair';
    const hasAnchor = anchorPixelX != null && anchorPixelY != null;
    const anchorPageCoords = hasAnchor && rootOffset
        ? { x: anchorPixelX + rootOffset.left, y: anchorPixelY + rootOffset.top }
        : null;
    // Compute raw target position (portal uses page coordinates, non-portal uses local container coordinates)
    let rawLeft = 0;
    let rawTop = 0;
    if (usePortal) {
        if (followMode === 'crosshair' && anchorPageCoords) {
            rawLeft = anchorPageCoords.x + 14;
            rawTop = anchorPageCoords.y + 14;
        }
        else if ((interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.pageX) != null && (interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.pageY) != null) {
            rawLeft = interactionPointer.pageX + 14;
            rawTop = interactionPointer.pageY + 14;
        }
        else if (anchorPageCoords) {
            rawLeft = anchorPageCoords.x + 14;
            rawTop = ((_c = anchorPageCoords.y) !== null && _c !== void 0 ? _c : ((_d = rootOffset === null || rootOffset === void 0 ? void 0 : rootOffset.top) !== null && _d !== void 0 ? _d : 0)) + 14;
        }
        else if (interactionPointer) {
            if (rootOffset) {
                rawLeft = interactionPointer.x + rootOffset.left + 14;
                rawTop = interactionPointer.y + rootOffset.top + 14;
            }
            else {
                rawLeft = (interactionPointer.pageX || interactionPointer.x) + 14;
                rawTop = (interactionPointer.pageY || interactionPointer.y) + 14;
            }
        }
    }
    else {
        // Container-relative mode (legacy / RN)
        let baseLeft;
        let baseTop;
        if (followMode === 'crosshair' && hasAnchor) {
            baseLeft = anchorPixelX;
            baseTop = anchorPixelY;
        }
        else {
            if ((interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.pageX) != null && rootOffset)
                baseLeft = interactionPointer.pageX - rootOffset.left;
            else if (anchorPixelX != null)
                baseLeft = anchorPixelX;
            else if ((crosshair === null || crosshair === void 0 ? void 0 : crosshair.pixelX) != null)
                baseLeft = crosshair.pixelX;
            else
                baseLeft = (interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.x) || 0;
            if ((interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.pageY) != null && rootOffset)
                baseTop = interactionPointer.pageY - rootOffset.top;
            else
                baseTop = (interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.y) || 0;
        }
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
        if (!shouldShow)
            return;
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
            if (Date.now() - lastActiveTs.current > 170)
                setVisible(false);
        }, 170);
        return () => clearTimeout(timeout);
    }, [shouldShow]);
    // Hide on document click (outside) & pointer leave viewport
    React.useEffect(() => {
        if (typeof document === 'undefined')
            return;
        const handleDocClick = (e) => {
            // If pointer currently outside (inside flag false) hide immediately
            if (!(interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside)) {
                setVisible(false);
            }
        };
        const handleMouseMove = (e) => {
            // If no interactionPointer or recently inside but now left charts area for >250ms, hide
            if (!(interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside) && visible) {
                // Debounce with small delay to avoid flicker when passing between charts
                if (!lastInsideRef.current)
                    return; // already outside processed
                lastInsideRef.current = false;
                setTimeout(() => { if (!(interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside))
                    setVisible(false); }, 250);
            }
            else if (interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.inside) {
                lastInsideRef.current = true;
            }
        };
        document.addEventListener('click', handleDocClick, true);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            document.removeEventListener('click', handleDocClick, true);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [interactionPointer, visible]);
    const colorLookup = React.useMemo(() => {
        const map = new Map();
        (registeredSeries || []).forEach((s) => {
            if ((s === null || s === void 0 ? void 0 : s.id) != null && (s === null || s === void 0 ? void 0 : s.color))
                map.set(s.id, s.color);
        });
        return map;
    }, [registeredSeries]);
    const renderSeriesDetail = (key, label, color, content) => (jsxs(View, { style: { marginBottom: 6 }, children: [jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }, children: [jsx(View, { style: { width: 10, height: 10, borderRadius: 2, backgroundColor: color, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsx(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: label })] }), typeof content === 'string' || typeof content === 'number' ? (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: content })) : content ? (jsx(View, { style: { marginTop: 2 }, children: content })) : null] }, key));
    const baseRenderEntry = (e) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const meta = e.point.meta || {};
        const rawDatum = meta.raw;
        const customFromPointer = rawDatum && (candlestickCustomMap === null || candlestickCustomMap === void 0 ? void 0 : candlestickCustomMap.get(rawDatum));
        const customFromMeta = rawDatum && meta.customTooltip;
        const resolvedCustom = customFromPointer !== null && customFromPointer !== void 0 ? customFromPointer : customFromMeta;
        const entryColor = meta.color || e.color || ((_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a[0]) || theme.colors.textPrimary;
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
            const resolvedUnitSuffix = (_b = meta.unitSuffix) !== null && _b !== void 0 ? _b : (meta.unit ? ` ${meta.unit}` : '');
            const fallbackFormatter = (val) => `${val.toFixed(2)}${resolvedUnitSuffix}`;
            const formatValue = typeof meta.valueFormatter === 'function' ? meta.valueFormatter : fallbackFormatter;
            const valueLabel = (_c = meta.valueLabel) !== null && _c !== void 0 ? _c : formatValue(meta.value);
            const probability = Math.max(0, Math.min(1, (_d = meta.probability) !== null && _d !== void 0 ? _d : 0));
            const relativeDensity = Math.max(0, Math.min(1, (_f = (_e = meta.normalizedDensity) !== null && _e !== void 0 ? _e : meta.density) !== null && _f !== void 0 ? _f : 0));
            const probabilityPercent = (probability * 100).toFixed(probability >= 0.1 ? 1 : 2);
            const relativePercent = (relativeDensity * 100).toFixed(relativeDensity >= 0.1 ? 1 : 2);
            const pdfLabel = meta.pdf != null ? meta.pdf.toFixed(meta.pdf >= 1 ? 2 : 4) : null;
            const stats = meta.stats || {};
            const detail = (jsxs(View, { style: { marginTop: 2 }, children: [jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `Value ${valueLabel}` }), jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `Share ${probabilityPercent}%` }), jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `Relative ${relativePercent}%` }), pdfLabel != null && (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `PDF ${pdfLabel}` })), stats.median != null && (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `Median ${formatValue(stats.median)}` })), stats.p90 != null && (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: `P90 ${formatValue(stats.p90)}` }))] }));
            return renderSeriesDetail(e.seriesId, entryLabel, entryColor, detail);
        }
        // Radar axis value
        if (meta.axis != null && meta.raw) {
            const axisLabel = (_h = (_g = meta.label) !== null && _g !== void 0 ? _g : meta.raw.label) !== null && _h !== void 0 ? _h : meta.axis;
            const displayValue = (_k = (_j = meta.formattedValue) !== null && _j !== void 0 ? _j : meta.raw.formattedValue) !== null && _k !== void 0 ? _k : meta.raw.value;
            return (jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }, children: [jsx(View, { style: { width: 10, height: 10, backgroundColor: entryColor, borderRadius: 5, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: [entryLabel, " \u2022 ", String(axisLabel), ": ", displayValue] })] }, e.seriesId));
        }
        // Heatmap cell (meta.value & meta.x/meta.y)
        if (meta.value != null && meta.x != null && meta.y != null && meta.label) {
            return (jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }, children: [jsx(View, { style: { width: 10, height: 10, backgroundColor: entryColor, borderRadius: 2, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: ["Col ", meta.x, ", Row ", meta.y, ": ", meta.value] })] }, e.seriesId));
        }
        // Histogram bin range (meta.bin or meta.start/end)
        if ((meta.bin && meta.bin.start != null) || (meta.start != null && meta.end != null)) {
            const bin = meta.bin || meta;
            const rangeLabel = `${Number(bin.start).toFixed(2)} – ${Number(bin.end).toFixed(2)}`;
            const val = (_o = (_m = (_l = meta.formattedValue) !== null && _l !== void 0 ? _l : meta.density) !== null && _m !== void 0 ? _m : meta.count) !== null && _o !== void 0 ? _o : bin.count;
            return (jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }, children: [jsx(View, { style: { width: 10, height: 10, backgroundColor: entryColor, borderRadius: 3, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: [e.label, ": ", rangeLabel, " = ", val] })] }, e.seriesId));
        }
        // Funnel step (meta.step)
        if (meta.step && meta.step.label) {
            const step = meta.step;
            const conversion = (_p = step.conversion) !== null && _p !== void 0 ? _p : (step._conversionComputed); // fallback
            const drop = (_q = step.drop) !== null && _q !== void 0 ? _q : step._dropComputed;
            return (jsxs(View, { style: { marginBottom: 6 }, children: [jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }, children: [jsx(View, { style: { width: 10, height: 10, backgroundColor: entryColor, borderRadius: 3, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: [step.label, ": ", step.value] })] }), conversion != null && (jsxs(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: ["Conv ", (conversion * 100).toFixed(1), "%", drop != null && ` • Drop ${(drop * 100).toFixed(1)}%`] }))] }, e.seriesId));
        }
        // Default: label + y
        const formatted = (_r = e.point.meta) === null || _r === void 0 ? void 0 : _r.formattedValue;
        return (jsxs(View, { style: { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 4 }, children: [jsx(View, { style: { width: 10, height: 10, backgroundColor: entryColor, borderRadius: 5, ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }) } }), jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: [e.label, ": ", formatted !== null && formatted !== void 0 ? formatted : e.point.y] })] }, e.seriesId));
    };
    // Derive relevance score (distance to crosshair) when possible for default sorting
    const scored = React.useMemo(() => {
        if (!entries.length)
            return [];
        return entries.map(e => {
            var _a, _b;
            const targetX = (_a = e.point) === null || _a === void 0 ? void 0 : _a.x;
            const crosshairX = (_b = e.point) === null || _b === void 0 ? void 0 : _b.x; // aggregator already nearest by x; could enhance with actual crosshair
            const score = crosshairX != null && targetX != null ? Math.abs(targetX - crosshairX) : 0;
            return { ...e, _score: score };
        });
    }, [entries]);
    const processed = React.useMemo(() => {
        let arr = scored;
        if (filterEntry)
            arr = arr.filter(filterEntry);
        const sorter = sortEntries || ((a, b) => a._score - b._score);
        arr = [...arr].sort(sorter);
        if (arr.length > maxEntries)
            arr = arr.slice(0, maxEntries);
        return arr;
    }, [scored, filterEntry, sortEntries, maxEntries]);
    const renderEntry = (e) => {
        const def = baseRenderEntry(e);
        return customRenderEntry ? customRenderEntry(e, def) : def;
    };
    if (!visible)
        return null;
    const renderPointerFallback = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if ((_a = candlestickPointer === null || candlestickPointer === void 0 ? void 0 : candlestickPointer.candles) === null || _a === void 0 ? void 0 : _a.length) {
            const headerValue = candlestickPointer.xValue instanceof Date
                ? candlestickPointer.xValue.toLocaleString()
                : typeof candlestickPointer.xValue === 'number'
                    ? candlestickPointer.xValue
                    : String((_b = candlestickPointer.xValue) !== null && _b !== void 0 ? _b : '');
            return (jsxs(View, { children: [jsx(Text, { style: { fontSize: 12, color: theme.colors.textPrimary, marginBottom: 4 }, children: headerValue }), candlestickPointer.candles.map((entry) => {
                        var _a;
                        const { datum, seriesName, seriesId, formatted } = entry;
                        const fill = colorLookup.get(seriesId) || ((_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a[0]) || theme.colors.textPrimary;
                        const defaultContent = datum
                            ? `O ${datum.open}  H ${datum.high}  L ${datum.low}  C ${datum.close}${datum.volume != null ? `  Vol ${datum.volume}` : ''}`
                            : '';
                        const content = formatted !== null && formatted !== void 0 ? formatted : defaultContent;
                        return renderSeriesDetail(`${seriesId}-${entry.dataIndex}`, seriesName || seriesId, fill, content);
                    })] }));
        }
        if (bubblePointer) {
            const headerValue = bubblePointer.label || ((_c = bubblePointer.payload) === null || _c === void 0 ? void 0 : _c.label) || '';
            const fill = bubblePointer.color || ((_d = theme.colors.accentPalette) === null || _d === void 0 ? void 0 : _d[0]) || theme.colors.textPrimary;
            const content = (_f = (_e = bubblePointer.customTooltip) !== null && _e !== void 0 ? _e : bubblePointer.formattedValue) !== null && _f !== void 0 ? _f : bubblePointer.value;
            const coordinates = [];
            if (bubblePointer.rawX != null)
                coordinates.push(`X: ${bubblePointer.rawX}`);
            if (bubblePointer.rawY != null)
                coordinates.push(`Y: ${bubblePointer.rawY}`);
            return (jsxs(View, { children: [headerValue ? (jsx(Text, { style: { fontSize: 12, color: theme.colors.textPrimary, marginBottom: coordinates.length ? 2 : 6 }, children: headerValue })) : null, coordinates.length ? (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary, marginBottom: 6 }, children: coordinates.join('  ·  ') })) : null, renderSeriesDetail('bubble-pointer', 'Size', fill, content)] }));
        }
        return (jsxs(Text, { style: { fontSize: 12, color: theme.colors.textPrimary }, children: ["x: ", (_h = (_g = interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.x) === null || _g === void 0 ? void 0 : _g.toFixed) === null || _h === void 0 ? void 0 : _h.call(_g, 2), " y: ", (_k = (_j = interactionPointer === null || interactionPointer === void 0 ? void 0 : interactionPointer.y) === null || _j === void 0 ? void 0 : _j.toFixed) === null || _k === void 0 ? void 0 : _k.call(_j, 2)] }));
    };
    const body = (jsx(Animated.View, { pointerEvents: "none", style: {
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
        }, children: config.multiTooltip ? (jsxs(View, { children: [renderHeader && processed.length > 0 && (jsx(View, { style: { marginBottom: 4 }, children: renderHeader(processed) })), processed.map(renderEntry), processed.length === 0 && (jsx(Text, { style: { fontSize: 11, color: theme.colors.textSecondary }, children: "No data" }))] })) : bestEntry ? (renderEntry(bestEntry)) : (renderPointerFallback()) }));
    if (usePortal && (reactDomModule === null || reactDomModule === void 0 ? void 0 : reactDomModule.createPortal)) {
        return reactDomModule.createPortal(body, document.body);
    }
    return body;
};

// Simple platform detection helper for charts package without importing full React Native Platform everywhere.
// We treat 'web' as presence of window & document objects.
/**
 * Checks if the current platform is web (browser)
 * @returns True if running in a browser environment
 */
const isWeb$1 = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const extractSpacing = (props) => {
    const spacing = {};
    const rest = {};
    Object.keys(props).forEach(k => {
        if (['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'].includes(k))
            spacing[k] = props[k];
        else
            rest[k] = props[k];
    });
    return { spacing, rest };
};
const spacingToStyle = (s) => {
    const style = {};
    if (s.m != null)
        style.margin = s.m;
    if (s.mx != null) {
        style.marginLeft = s.mx;
        style.marginRight = s.mx;
    }
    if (s.my != null) {
        style.marginTop = s.my;
        style.marginBottom = s.my;
    }
    if (s.mt != null)
        style.marginTop = s.mt;
    if (s.mr != null)
        style.marginRight = s.mr;
    if (s.mb != null)
        style.marginBottom = s.mb;
    if (s.ml != null)
        style.marginLeft = s.ml;
    if (s.p != null)
        style.padding = s.p;
    if (s.px != null) {
        style.paddingLeft = s.px;
        style.paddingRight = s.px;
    }
    if (s.py != null) {
        style.paddingTop = s.py;
        style.paddingBottom = s.py;
    }
    if (s.pt != null)
        style.paddingTop = s.pt;
    if (s.pr != null)
        style.paddingRight = s.pr;
    if (s.pb != null)
        style.paddingBottom = s.pb;
    if (s.pl != null)
        style.paddingLeft = s.pl;
    return style;
};
const ChartContext = createContext(null);
const useChartContext = () => {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error('Chart compound components must be used within a Chart component');
    }
    return context;
};
// Base Chart Container Component
const ChartContainer = (props) => {
    const { width = 400, height = 300, padding = { top: 20, right: 20, bottom: 40, left: 60 }, animationDuration = 500, animationEasing = 'ease-out', disabled = false, children, testID, style, interactionConfig, useOwnInteractionProvider = true, suppressPopover, popoverProps, ...rest } = props;
    const { spacing, rest: otherProps } = extractSpacing(rest);
    const spacingStyles = spacingToStyle(spacing);
    const dimensions = calculateChartDimensions(width, height, padding);
    const contextValue = {
        width,
        height,
        padding,
        plotArea: dimensions.plotArea,
        disabled,
        animationDuration,
        animationEasing,
    };
    // If a parent ChartsProvider supplies interaction context (useOwnInteractionProvider=false) we default to suppressing
    const effectiveSuppressPopover = suppressPopover !== null && suppressPopover !== void 0 ? suppressPopover : !useOwnInteractionProvider;
    const content = (jsxs(View, { style: [
            {
                width,
                height,
                backgroundColor: 'transparent',
                position: 'relative',
                overflow: 'visible',
            },
            spacingStyles,
            style,
        ], testID: testID, ...otherProps, children: [children, !effectiveSuppressPopover && jsx(ChartPopover, { ...popoverProps })] }));
    if (!useOwnInteractionProvider) {
        return (jsx(ChartContext.Provider, { value: contextValue, children: content }));
    }
    return (jsx(ChartContext.Provider, { value: contextValue, children: jsx(ChartInteractionProvider, { config: interactionConfig, children: jsx(RootOffsetCapture$1, { children: content }) }) }));
};
// Internal component to capture root offset once.
const RootOffsetCapture$1 = ({ children }) => {
    const ref = useRef(null);
    let ctx = null;
    try {
        ctx = useChartInteractionContext();
    }
    catch (_a) {
        // Provider not mounted yet; ctx stays null
    }
    useEffect(() => {
        var _a, _b;
        if (!ref.current || !(ctx === null || ctx === void 0 ? void 0 : ctx.setRootOffset))
            return;
        // Only run DOM measurement logic on web
        if (!isWeb$1()) {
            // On native, we can approximate (0,0) or attempt async measure if needed later.
            // Set a neutral offset once so interactions still work with local coordinates.
            try {
                ctx.setRootOffset({ left: 0, top: 0 });
            }
            catch (_c) { }
            return; // Skip DOM listeners
        }
        const update = () => {
            var _a, _b;
            try {
                const el = ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a._internalFiberInstanceHandleDEV) === null || _b === void 0 ? void 0 : _b.stateNode) || ref.current;
                if (el && el.getBoundingClientRect) {
                    const r = el.getBoundingClientRect();
                    ctx.setRootOffset({ left: r.left + window.scrollX, top: r.top + window.scrollY });
                }
            }
            catch (_c) { }
        };
        update();
        (_a = window.addEventListener) === null || _a === void 0 ? void 0 : _a.call(window, 'scroll', update, { passive: true });
        (_b = window.addEventListener) === null || _b === void 0 ? void 0 : _b.call(window, 'resize', update);
        return () => {
            var _a, _b;
            (_a = window.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(window, 'scroll', update);
            (_b = window.removeEventListener) === null || _b === void 0 ? void 0 : _b.call(window, 'resize', update);
        };
    }, [ctx === null || ctx === void 0 ? void 0 : ctx.setRootOffset]);
    return jsx(View, { ref: ref, style: { position: 'relative', display: 'contents' }, children: children });
};
// Chart Title Component
const ChartTitle = (props) => {
    const { title, subtitle, titleColor, subtitleColor, titleSize = 18, subtitleSize = 14, align = 'center', style, } = props;
    const theme = useChartTheme();
    useChartContext();
    // (Title component) no legend adjustments needed here
    if (!title && !subtitle)
        return null;
    const alignStyle = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    }[align];
    return (jsxs(View, { style: [
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
        ], children: [title && (jsx(Text, { style: {
                    fontSize: titleSize,
                    fontWeight: '600',
                    color: titleColor || theme.colors.textPrimary,
                    textAlign: align,
                }, children: title })), subtitle && (jsx(Text, { style: {
                    fontSize: subtitleSize,
                    fontWeight: '400',
                    color: subtitleColor || theme.colors.textSecondary,
                    textAlign: align,
                    marginTop: title ? 4 : 0,
                }, children: subtitle }))] }));
};
// Chart Legend Component
const ChartLegend = (props) => {
    const { items, position = 'bottom', align = 'center', textColor, fontSize = 12, onItemPress, style, } = props;
    const theme = useChartTheme();
    useChartContext();
    // Pressable's onPress event (RN / RN Web) often omits modifier keys; capture last pointerdown globally (web only)
    const lastMods = React.useRef({ altKey: false, metaKey: false, shiftKey: false, ctrlKey: false });
    React.useEffect(() => {
        // Only register global pointer listener on web where window API exists
        if (!isWeb$1())
            return;
        const handler = (e) => {
            lastMods.current = {
                altKey: !!e.altKey,
                metaKey: !!e.metaKey,
                shiftKey: !!e.shiftKey,
                ctrlKey: !!e.ctrlKey,
            };
        };
        window.addEventListener('pointerdown', handler, { passive: true });
        return () => window.removeEventListener('pointerdown', handler);
    }, []);
    if (!items || items.length === 0)
        return null;
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
    const computeReadable = React.useCallback((fallback) => {
        const hex = (fallback || '').startsWith('#') ? fallback : theme.colors.textPrimary;
        const bg = theme.colors.background || '#000';
        const parse = (h) => {
            const s = h.replace('#', '');
            if (s.length === 3)
                return [parseInt(s[0] + s[0], 16), parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16)];
            return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
        };
        const lum = (r, g, b) => {
            const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
            return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        };
        const [br, bgG, bb] = parse(bg);
        const bgLum = lum(br, bgG, bb);
        if (bgLum < 0.35)
            return '#f5f6f8';
        return fallback || hex;
    }, [theme.colors.background, theme.colors.textPrimary]);
    const isRTL = I18nManager.isRTL;
    return (jsx(View, { style: [
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
        ], children: items.map((item, index) => (jsxs(Pressable, { onPress: (e) => {
                const native = (e === null || e === void 0 ? void 0 : e.nativeEvent) || {};
                const enriched = { ...native, ...lastMods.current };
                onItemPress === null || onItemPress === void 0 ? void 0 : onItemPress(item, index, enriched);
            }, style: {
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                marginHorizontal: isHorizontal ? 8 : 0,
                marginVertical: isHorizontal ? 0 : 4,
                opacity: item.visible !== false ? 1 : 0.5,
            }, children: [jsx(View, { style: {
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: 2,
                        ...(isRTL ? { marginLeft: 6 } : { marginRight: 6 }),
                    } }), jsx(Text, { style: {
                        fontSize,
                        color: textColor || computeReadable(theme.colors.textPrimary),
                        fontFamily: theme.fontFamily,
                    }, children: item.label })] }, index))) }));
};
// Display names
ChartContainer.displayName = 'Chart.Container';
ChartTitle.displayName = 'Chart.Title';
ChartLegend.displayName = 'Chart.Legend';

// Simple axis renderer (View-based). For high performance / crisp lines use SVG later.
const Axis = ({ scale, orientation, length, offset = {}, tickCount = 5, tickSize = 4, tickPadding = 4, tickFormat, label, labelOffset = 30, stroke = '#ccc', strokeWidth = 1, showLine = true, showTicks = true, showLabels = true, avoidLabelOverlap = true, style, tickLabelColor, tickLabelFontSize, tickLabelStyle, labelColor, labelFontSize, labelStyle, }) => {
    const theme = useChartTheme();
    const isHorizontal = orientation === 'top' || orientation === 'bottom';
    const domain = scale.domain();
    let rawTicks = [];
    if (scale.ticks)
        rawTicks = scale.ticks(tickCount);
    else if (Array.isArray(domain))
        rawTicks = domain;
    const processedTicks = useMemo(() => {
        if (!showLabels)
            return rawTicks.map(t => ({ value: t, hidden: false }));
        if (!(orientation === 'bottom' || orientation === 'top') || !avoidLabelOverlap) {
            return rawTicks.map(t => ({ value: t, hidden: false }));
        }
        const estWidth = (val) => String(tickFormat ? tickFormat(val) : val).length * 6.5;
        const placed = [];
        return rawTicks.map(t => {
            const x = scale(t);
            const w = estWidth(t);
            const start = x - w / 2;
            const end = x + w / 2;
            const collision = placed.some(p => !(end < p.start || start > p.end));
            if (!collision)
                placed.push({ start, end });
            return { value: t, hidden: collision };
        });
    }, [rawTicks, showLabels, orientation, tickFormat, scale, avoidLabelOverlap]);
    const rootStyle = {
        position: 'absolute',
        left: offset.x || 0,
        top: offset.y || 0,
    };
    const resolvedTickColor = tickLabelColor !== null && tickLabelColor !== void 0 ? tickLabelColor : theme.colors.textSecondary;
    const resolvedTickFontSize = tickLabelFontSize !== null && tickLabelFontSize !== void 0 ? tickLabelFontSize : 11;
    const resolvedLabelColor = labelColor !== null && labelColor !== void 0 ? labelColor : theme.colors.textPrimary;
    const resolvedLabelFontSize = labelFontSize !== null && labelFontSize !== void 0 ? labelFontSize : 12;
    return (jsxs(View, { style: [rootStyle, style], pointerEvents: "none", children: [showLine && (jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: isHorizontal ? length : strokeWidth,
                    height: isHorizontal ? strokeWidth : length,
                    backgroundColor: stroke,
                } })), processedTicks.map((tObj, i) => {
                const { value: t, hidden } = tObj;
                const pos = scale(t);
                const key = `tick-${i}`;
                const anchor = isHorizontal
                    ? { left: pos, top: 0, transform: [{ translateX: -0.5 }] }
                    : { top: pos, left: 0, transform: [{ translateY: -0.5 }] };
                const tickLineStyle = isHorizontal
                    ? { position: 'absolute', top: 0, left: 0, width: strokeWidth, height: tickSize, backgroundColor: stroke }
                    : { position: 'absolute', top: 0, left: 0, width: tickSize, height: strokeWidth, backgroundColor: stroke };
                const baseLabelStyle = isHorizontal
                    ? {
                        position: 'absolute',
                        top: tickSize + tickPadding,
                        left: -20,
                        width: 40,
                        textAlign: 'center',
                        color: resolvedTickColor,
                        fontSize: resolvedTickFontSize,
                    }
                    : {
                        position: 'absolute',
                        left: -(tickSize + tickPadding + 30),
                        top: -8,
                        width: 30,
                        textAlign: 'right',
                        color: resolvedTickColor,
                        fontSize: resolvedTickFontSize,
                    };
                const combinedTickLabelStyle = [baseLabelStyle, tickLabelStyle];
                return (jsxs(View, { style: [{ position: 'absolute' }, anchor], children: [showTicks && jsx(View, { style: tickLineStyle }), showLabels && !hidden && (jsx(Text, { style: combinedTickLabelStyle, children: tickFormat ? tickFormat(t) : String(t) }))] }, key));
            }), label && (jsx(Text, { style: {
                    position: 'absolute',
                    color: resolvedLabelColor,
                    fontSize: resolvedLabelFontSize,
                    fontWeight: '600',
                    ...(orientation === 'bottom' && { top: labelOffset, left: length / 2 - 50, width: 100, textAlign: 'center' }),
                    ...(orientation === 'top' && { top: -labelOffset, left: length / 2 - 50, width: 100, textAlign: 'center' }),
                    ...(orientation === 'left' && { top: length / 2 - 50, left: -labelOffset - 20, width: 100, textAlign: 'center', transform: [{ rotate: '-90deg' }] }),
                    ...(orientation === 'right' && { top: length / 2 - 50, left: labelOffset - 50, width: 100, textAlign: 'center', transform: [{ rotate: '90deg' }] }),
                    ...labelStyle,
                }, children: label }))] }));
};
Axis.displayName = 'Chart.Axis';

const AnimatedSvg = Animated$1.createAnimatedComponent(Svg);
const AnimatedLine$1 = Animated$1.createAnimatedComponent(Line);
const ChartGrid = ({ grid, plotWidth, plotHeight, xTicks = [], yTicks = [], padding, useSVG = true, }) => {
    useChartTheme();
    if (!grid.show) {
        return null;
    }
    const { color = 'red', thickness = 1, style = 'solid', showMajor = true, showMinor = false, majorLines, minorLines, } = grid;
    const opacity = 0.3;
    const minorOpacity = 0.15;
    // Get stroke dash array based on style
    const getStrokeDashArray = (lineStyle, lineThickness) => {
        switch (lineStyle) {
            case 'dashed':
                return `${lineThickness * 4},${lineThickness * 2}`;
            case 'dotted':
                return `${lineThickness},${lineThickness}`;
            default:
                return undefined;
        }
    };
    if (useSVG) {
        return (jsxs(AnimatedSvg, { width: plotWidth, height: plotHeight, style: {
                position: 'absolute',
                left: padding.left,
                top: padding.top,
                pointerEvents: 'none'
            }, children: [jsx(Defs, { children: style === 'dotted' && (jsx(Pattern, { id: "dots", patternUnits: "userSpaceOnUse", width: thickness * 2, height: thickness * 2, children: jsx(Line, { x1: "0", y1: thickness, x2: thickness * 2, y2: thickness, stroke: color, strokeWidth: thickness }) })) }), showMajor && yTicks.map((tick, index) => {
                    const y = tick * plotHeight;
                    return (jsx(AnimatedLine$1, { x1: "0", y1: y, x2: plotWidth, y2: y, stroke: color, strokeWidth: thickness, strokeOpacity: opacity, strokeDasharray: getStrokeDashArray(style, thickness) }, `y-major-${index}`));
                }), showMajor && xTicks.map((tick, index) => {
                    const x = tick * plotWidth;
                    return (jsx(AnimatedLine$1, { x1: x, y1: "0", x2: x, y2: plotHeight, stroke: color, strokeWidth: thickness, strokeOpacity: opacity, strokeDasharray: getStrokeDashArray(style, thickness) }, `x-major-${index}`));
                }), majorLines === null || majorLines === void 0 ? void 0 : majorLines.map((line, index) => (jsx(AnimatedLine$1, { x1: "0", y1: line * plotHeight, x2: plotWidth, y2: line * plotHeight, stroke: color, strokeWidth: thickness, strokeOpacity: opacity, strokeDasharray: getStrokeDashArray(style, thickness) }, `custom-major-${index}`))), showMinor && (minorLines === null || minorLines === void 0 ? void 0 : minorLines.map((line, index) => (jsx(AnimatedLine$1, { x1: "0", y1: line * plotHeight, x2: plotWidth, y2: line * plotHeight, stroke: color, strokeWidth: thickness * 0.5, strokeOpacity: minorOpacity, strokeDasharray: getStrokeDashArray(style, thickness * 0.5) }, `minor-${index}`))))] }));
    }
    // Fallback to View-based rendering
    return (jsxs(View, { style: {
            position: 'absolute',
            left: padding.left,
            top: padding.top,
            pointerEvents: 'none'
        }, children: [showMajor && yTicks.map((tick, index) => {
                const y = tick * plotHeight;
                return (jsx(View, { style: {
                        position: 'absolute',
                        left: 0,
                        top: y,
                        width: plotWidth,
                        height: thickness,
                        backgroundColor: color,
                        opacity,
                    } }, `y-major-${index}`));
            }), showMajor && xTicks.map((tick, index) => {
                const x = tick * plotWidth;
                return (jsx(View, { style: {
                        position: 'absolute',
                        left: x,
                        top: 0,
                        width: thickness,
                        height: plotHeight,
                        backgroundColor: color,
                        opacity,
                    } }, `x-major-${index}`));
            }), majorLines === null || majorLines === void 0 ? void 0 : majorLines.map((line, index) => (jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                    top: line * plotHeight,
                    width: plotWidth,
                    height: thickness,
                    backgroundColor: color,
                    opacity,
                } }, `custom-major-${index}`))), showMinor && (minorLines === null || minorLines === void 0 ? void 0 : minorLines.map((line, index) => (jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                    top: line * plotHeight,
                    width: plotWidth,
                    height: thickness * 0.5,
                    backgroundColor: color,
                    opacity: minorOpacity,
                } }, `minor-${index}`))))] }));
};

// Basic scale abstractions for the chart library
// These are intentionally lightweight and can be extended (time/log/etc.)
/**
 * Creates a linear scale that maps numeric values to a range
 * @param domain - Input domain [min, max]
 * @param range - Output range [min, max]
 * @returns Linear scale function with utility methods
 */
function linearScale(domain, range) {
    let [d0, d1] = domain;
    let [r0, r1] = range;
    const m = (r1 - r0) / (d1 - d0 || 1);
    const scale = ((value) => r0 + (value - d0) * m);
    scale.domain = () => [d0, d1];
    scale.range = () => [r0, r1];
    scale.invert = (val) => d0 + (val - r0) / (m || 1);
    scale.ticks = (count = 5) => generateNiceTicks(d0, d1, count);
    return scale;
}
/**
 * Creates a band scale for categorical data
 * @param domain - Array of category names
 * @param range - Output range [min, max]
 * @param opts - Band scale options
 * @returns Band scale function with utility methods
 */
function bandScale(domain, range, opts = {}) {
    const { paddingInner = 0.1, paddingOuter = 0.05, align = 0 } = opts;
    const [r0, r1] = range;
    const step = (r1 - r0) / Math.max(1, domain.length + paddingOuter * 2 - paddingInner);
    const bandwidthValue = step * (1 - paddingInner);
    const start = r0 + (r1 - r0 - (step * domain.length)) * align;
    const indexMap = new Map(domain.map((d, i) => [d, i]));
    const scale = ((value) => {
        const i = indexMap.get(value);
        if (i == null)
            return NaN;
        return start + i * step + (step - bandwidthValue) / 2;
    });
    scale.domain = () => domain.slice();
    scale.range = () => [r0, r1];
    scale.bandwidth = () => bandwidthValue;
    return scale;
}
/**
 * Helper function to generate nice tick values for a linear scale
 * @param min - Minimum value
 * @param max - Maximum value
 * @param target - Target number of ticks (default 5)
 * @returns Array of evenly-spaced tick values
 */
function generateNiceTicks(min, max, target = 5) {
    if (min === max)
        return [min];
    const span = max - min;
    const roughStep = span / Math.max(1, target - 1);
    const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(1e-12, roughStep))));
    const multiples = [1, 2, 5, 10];
    const step = multiples.find(m => roughStep / pow10 <= m) || 10;
    const niceStep = step * pow10;
    const first = Math.ceil(min / niceStep) * niceStep;
    const ticks = [];
    for (let v = first; v <= max + niceStep * 0.5; v += niceStep) {
        ticks.push(Number(v.toFixed(12)));
    }
    return ticks;
}

const AnimatedRect$7 = Animated$1.createAnimatedComponent(Rect);
const AnimatedBarRect = React.memo(({ bar, orientation, animationProgress, targetScale, borderRadius, fill, opacity, stroke, strokeWidth, onHoverIn, onHoverOut, onPress, onPressIn, onPressOut, }) => {
    const scale = useSharedValue(targetScale);
    useEffect(() => {
        scale.value = withSpring(targetScale, { damping: 16, stiffness: 180 });
    }, [targetScale, scale]);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const scaleValue = scale.value;
        if (orientation === 'vertical') {
            const scaledHeight = bar.height * progress * scaleValue;
            const clampedHeight = Math.max(0, scaledHeight);
            const y = bar.isPositive ? bar.originY - clampedHeight : bar.originY;
            return {
                x: bar.x,
                y,
                width: bar.width,
                height: clampedHeight,
            };
        }
        const scaledWidth = bar.width * progress * scaleValue;
        const clampedWidth = Math.max(0, scaledWidth);
        const x = bar.isPositive ? bar.originX : bar.originX - clampedWidth;
        return {
            x,
            y: bar.y,
            width: clampedWidth,
            height: bar.height,
        };
    }, [bar, orientation]);
    const isWeb = Platform.OS === 'web';
    const toNativePointerEvent = (event) => {
        var _a, _b, _c, _d;
        const rect = (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        return {
            nativeEvent: {
                locationX: rect ? event.clientX - rect.left : 0,
                locationY: rect ? event.clientY - rect.top : 0,
                pageX: (_c = event.pageX) !== null && _c !== void 0 ? _c : event.clientX,
                pageY: (_d = event.pageY) !== null && _d !== void 0 ? _d : event.clientY,
            },
        };
    };
    return (jsx(AnimatedRect$7, { animatedProps: animatedProps, rx: borderRadius, ry: borderRadius, fill: fill, opacity: opacity, stroke: stroke, strokeWidth: strokeWidth, 
        // @ts-ignore web-only events
        onMouseEnter: onHoverIn, 
        // @ts-ignore web-only events
        onMouseLeave: onHoverOut, ...(isWeb
            ? {
                // @ts-ignore pointer events exposed on web
                onPointerDown: (event) => {
                    var _a, _b;
                    onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn();
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                },
                // @ts-ignore pointer events exposed on web
                onPointerUp: (event) => {
                    var _a, _b;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                    onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut();
                    onPress === null || onPress === void 0 ? void 0 : onPress(toNativePointerEvent(event));
                },
                // @ts-ignore pointer events exposed on web
                onPointerLeave: () => {
                    onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut();
                },
                // @ts-ignore pointer events exposed on web
                onPointerCancel: () => {
                    onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut();
                },
            }
            : {
                onPress,
                onPressIn,
                onPressOut,
            }) }));
});
AnimatedBarRect.displayName = 'AnimatedBarRect';
const BarChart = React.memo((props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { data, series, width = 400, height = 300, barColor, barSpacing = 0.2, barBorderRadius = 4, orientation = 'vertical', layout, stackMode = 'normal', title, subtitle, xAxis, yAxis, grid, legend = { show: true, position: 'bottom', align: 'center' }, legendToggleEnabled, tooltip, onPress, onDataPointPress, disabled = false, animationDuration = 800, style, valueFormatter, valueLabel, thresholds, colorScale, ...rest } = props;
    const theme = useChartTheme();
    const showValueLabels = valueLabel ? valueLabel.show !== false : false;
    const valueLabelFormatter = (valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.formatter)
        ? valueLabel.formatter
        : ((value, datum, index) => valueFormatter ? valueFormatter(value, datum, index) : formatNumber$2(value));
    const valueLabelColor = (valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.color) || theme.colors.textPrimary;
    const valueLabelFontSize = (_a = valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.fontSize) !== null && _a !== void 0 ? _a : 12;
    const valueLabelFontWeightRaw = (_b = valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.fontWeight) !== null && _b !== void 0 ? _b : '600';
    const valueLabelFontWeight = typeof valueLabelFontWeightRaw === 'number' ? String(valueLabelFontWeightRaw) : valueLabelFontWeightRaw;
    const valueLabelOffset = (_c = valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.offset) !== null && _c !== void 0 ? _c : 8;
    const valueLabelPosition = (_d = valueLabel === null || valueLabel === void 0 ? void 0 : valueLabel.position) !== null && _d !== void 0 ? _d : 'outside';
    const valueLabelInside = valueLabelPosition === 'inside';
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_q) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [pressedIndex, setPressedIndex] = useState(null);
    const animationProgress = useSharedValue(0);
    const resolvedSeries = useMemo(() => {
        if (series && series.length > 0) {
            return series;
        }
        return [
            {
                id: 'series-default',
                name: title || 'Series',
                color: barColor,
                data,
            },
        ];
    }, [series, data, title, barColor]);
    const seriesCount = resolvedSeries.length;
    const resolvedLayout = useMemo(() => {
        if (layout) {
            if ((layout === 'grouped' || layout === 'stacked') && seriesCount <= 1) {
                return 'single';
            }
            return layout;
        }
        return seriesCount > 1 ? 'grouped' : 'single';
    }, [layout, seriesCount]);
    const categories = useMemo(() => {
        const seen = new Set();
        const ordered = [];
        const addCategory = (category) => {
            if (!seen.has(category)) {
                seen.add(category);
                ordered.push(category);
            }
        };
        resolvedSeries.forEach((seriesItem) => {
            seriesItem.data.forEach((datum) => {
                addCategory(datum.category);
            });
        });
        return ordered;
    }, [resolvedSeries]);
    const resolvePointColor = useCallback((datum, seriesItem, seriesIndex, categoryIndex) => {
        var _a;
        if (datum.color)
            return datum.color;
        if (seriesItem.color)
            return seriesItem.color;
        if (colorScale) {
            const resolved = colorScale({ datum, series: seriesItem, seriesIndex, categoryIndex });
            if (resolved)
                return resolved;
        }
        if (barColor && seriesCount === 1)
            return barColor;
        const palette = (_a = theme.colors.accentPalette) !== null && _a !== void 0 ? _a : colorSchemes.default;
        return getColorFromScheme(seriesIndex, palette);
    }, [colorScale, barColor, seriesCount, theme.colors.accentPalette]);
    const normalizedSeries = useMemo(() => {
        return resolvedSeries.map((seriesItem, seriesIndex) => {
            var _a;
            const pointByCategory = new Map();
            seriesItem.data.forEach((datum) => {
                pointByCategory.set(datum.category, datum);
            });
            const points = categories.map((category, categoryIndex) => {
                const datum = pointByCategory.get(category);
                if (datum) {
                    return {
                        datum,
                        value: datum.value,
                        color: resolvePointColor(datum, seriesItem, seriesIndex, categoryIndex),
                        category,
                        categoryIndex,
                        isSynthetic: false,
                    };
                }
                const synthetic = {
                    id: `${seriesItem.id}-${category}`,
                    category,
                    value: 0,
                };
                return {
                    datum: synthetic,
                    value: 0,
                    color: resolvePointColor(synthetic, seriesItem, seriesIndex, categoryIndex),
                    category,
                    categoryIndex,
                    isSynthetic: true,
                };
            });
            return {
                id: seriesItem.id,
                name: (_a = seriesItem.name) !== null && _a !== void 0 ? _a : seriesItem.id,
                seriesIndex,
                baseColor: seriesItem.color,
                points,
            };
        });
    }, [resolvedSeries, categories, resolvePointColor]);
    const autoLegend = !(legend === null || legend === void 0 ? void 0 : legend.items) || legend.items.length === 0;
    const allowLegendToggles = legendToggleEnabled !== null && legendToggleEnabled !== void 0 ? legendToggleEnabled : (autoLegend && normalizedSeries.length > 1);
    const [hiddenSeries, setHiddenSeries] = useState(() => new Set());
    useEffect(() => {
        setHiddenSeries((prev) => {
            const next = new Set();
            normalizedSeries.forEach((seriesItem) => {
                if (prev.has(seriesItem.id)) {
                    next.add(seriesItem.id);
                }
            });
            if (next.size === prev.size) {
                let unchanged = true;
                next.forEach((id) => {
                    if (!prev.has(id)) {
                        unchanged = false;
                    }
                });
                if (unchanged) {
                    return prev;
                }
            }
            return next;
        });
    }, [normalizedSeries]);
    const visibleSeries = useMemo(() => {
        const filtered = normalizedSeries.filter((seriesItem) => !hiddenSeries.has(seriesItem.id));
        if (filtered.length === 0) {
            return normalizedSeries;
        }
        return filtered;
    }, [normalizedSeries, hiddenSeries]);
    const displaySeries = useMemo(() => {
        var _a;
        if (resolvedLayout === 'single') {
            const primary = (_a = visibleSeries[0]) !== null && _a !== void 0 ? _a : normalizedSeries[0];
            return primary ? [primary] : [];
        }
        return visibleSeries;
    }, [resolvedLayout, visibleSeries, normalizedSeries]);
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const chartDimensions = useMemo(() => {
        const adjustedPadding = !(legend === null || legend === void 0 ? void 0 : legend.show) ? basePadding : (() => {
            const position = legend.position || 'bottom';
            return {
                ...basePadding,
                top: position === 'top' ? basePadding.top + 40 : basePadding.top,
                bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
                left: position === 'left' ? basePadding.left + 120 : basePadding.left,
                right: position === 'right' ? basePadding.right + 120 : basePadding.right,
            };
        })();
        return {
            padding: adjustedPadding,
            plotWidth: width - adjustedPadding.left - adjustedPadding.right,
            plotHeight: height - adjustedPadding.top - adjustedPadding.bottom,
        };
    }, [width, height, legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const { padding, plotWidth, plotHeight } = chartDimensions;
    const usePercentageStack = resolvedLayout === 'stacked' && stackMode === '100%';
    const metrics = useMemo(() => {
        if (!categories.length || !displaySeries.length) {
            return {
                minValue: 0,
                maxValue: 1,
                positiveTotals: [],
                negativeTotals: [],
                stackTotals: [],
            };
        }
        if (resolvedLayout === 'stacked') {
            const positiveTotals = categories.map(() => 0);
            const negativeTotals = categories.map(() => 0);
            const stackTotals = categories.map(() => 0);
            displaySeries.forEach((seriesItem) => {
                seriesItem.points.forEach((point, categoryIndex) => {
                    const value = point.value;
                    if (value >= 0) {
                        positiveTotals[categoryIndex] += value;
                    }
                    else {
                        negativeTotals[categoryIndex] += value;
                    }
                    stackTotals[categoryIndex] += Math.abs(value);
                });
            });
            if (usePercentageStack) {
                return {
                    minValue: 0,
                    maxValue: 1,
                    positiveTotals,
                    negativeTotals,
                    stackTotals,
                };
            }
            const maxPositive = Math.max(0, ...positiveTotals);
            const minNegative = Math.min(0, ...negativeTotals);
            return {
                minValue: Math.min(0, minNegative),
                maxValue: Math.max(0, maxPositive),
                positiveTotals,
                negativeTotals,
                stackTotals,
            };
        }
        const values = displaySeries.flatMap((seriesItem) => seriesItem.points.map((point) => point.value));
        const maxValue = values.length ? Math.max(...values, 0) : 0;
        const minValue = values.length ? Math.min(...values, 0) : 0;
        return {
            minValue,
            maxValue,
            positiveTotals: [],
            negativeTotals: [],
            stackTotals: [],
        };
    }, [categories.length, displaySeries, resolvedLayout, usePercentageStack]);
    const valueTicks = useMemo(() => generateTicks(metrics.minValue, metrics.maxValue, 5), [metrics.minValue, metrics.maxValue]);
    const valueScaleY = useMemo(() => linearScale([metrics.minValue, metrics.maxValue], [plotHeight, 0]), [metrics.minValue, metrics.maxValue, plotHeight]);
    const valueScaleX = useMemo(() => linearScale([metrics.minValue, metrics.maxValue], [0, plotWidth]), [metrics.minValue, metrics.maxValue, plotWidth]);
    const categoryScaleX = useMemo(() => {
        const count = Math.max(categories.length, 1);
        if (plotWidth <= 0)
            return linearScale([0, 1], [0, 0]);
        const band = plotWidth / count;
        const start = count > 1 ? band / 2 : plotWidth / 2;
        const end = count > 1 ? plotWidth - band / 2 : start;
        return linearScale([0, Math.max(count - 1, 1)], [start, end]);
    }, [categories.length, plotWidth]);
    const categoryScaleY = useMemo(() => {
        const count = Math.max(categories.length, 1);
        if (plotHeight <= 0)
            return linearScale([0, 1], [0, 0]);
        const band = plotHeight / count;
        const start = count > 1 ? band / 2 : plotHeight / 2;
        const end = count > 1 ? plotHeight - band / 2 : start;
        return linearScale([0, Math.max(count - 1, 1)], [start, end]);
    }, [categories.length, plotHeight]);
    const thresholdsConfig = useMemo(() => {
        return (thresholds !== null && thresholds !== void 0 ? thresholds : []).map((threshold, index) => {
            var _a, _b, _c, _d;
            return ({
                key: `threshold-${index}`,
                value: threshold.value,
                label: threshold.label,
                color: threshold.color || '#9CA3AF',
                width: (_a = threshold.width) !== null && _a !== void 0 ? _a : 1,
                style: (_b = threshold.style) !== null && _b !== void 0 ? _b : 'dashed',
                labelOffset: (_c = threshold.labelOffset) !== null && _c !== void 0 ? _c : 8,
                position: (_d = threshold.position) !== null && _d !== void 0 ? _d : 'front',
            });
        });
    }, [thresholds]);
    const bars = useMemo(() => {
        if (!categories.length || !displaySeries.length || plotWidth <= 0 || plotHeight <= 0) {
            return [];
        }
        const bandCount = Math.max(categories.length, 1);
        const bandSize = orientation === 'vertical'
            ? (plotWidth > 0 ? plotWidth / bandCount : 0)
            : (plotHeight > 0 ? plotHeight / bandCount : 0);
        const groupWidth = bandSize * (1 - barSpacing);
        const groupOffset = (bandSize - groupWidth) / 2;
        const positiveOffsets = resolvedLayout === 'stacked' ? categories.map(() => 0) : [];
        const negativeOffsets = resolvedLayout === 'stacked' ? categories.map(() => 0) : [];
        const percentTotals = metrics.stackTotals;
        const computed = [];
        let globalIndex = 0;
        displaySeries.forEach((seriesItem, seriesPosition) => {
            categories.forEach((category, categoryIndex) => {
                const point = seriesItem.points[categoryIndex];
                if (!point)
                    return;
                const originalValue = point.value;
                const percentContribution = usePercentageStack && percentTotals[categoryIndex]
                    ? originalValue / (percentTotals[categoryIndex] || 1)
                    : usePercentageStack
                        ? 0
                        : undefined;
                const displayedValue = usePercentageStack ? percentContribution !== null && percentContribution !== void 0 ? percentContribution : 0 : originalValue;
                const isPositive = displayedValue >= 0;
                let x = 0;
                let y = 0;
                let width = 0;
                let height = 0;
                let originX = 0;
                let originY = 0;
                if (orientation === 'vertical') {
                    if (resolvedLayout === 'stacked') {
                        const offsets = isPositive ? positiveOffsets : negativeOffsets;
                        const startValue = offsets[categoryIndex];
                        const endValue = startValue + displayedValue;
                        offsets[categoryIndex] = endValue;
                        const startY = valueScaleY(startValue);
                        const endY = valueScaleY(endValue);
                        y = Math.min(startY, endY);
                        height = Math.abs(endY - startY);
                        x = categoryIndex * bandSize + groupOffset;
                        width = groupWidth;
                    }
                    else {
                        const perBarWidth = resolvedLayout === 'grouped' ? groupWidth / displaySeries.length : groupWidth;
                        const zeroY = valueScaleY(0);
                        const valueY = valueScaleY(displayedValue);
                        x = categoryIndex * bandSize + groupOffset + (resolvedLayout === 'grouped' ? seriesPosition * perBarWidth : 0);
                        y = Math.min(valueY, zeroY);
                        height = Math.abs(zeroY - valueY);
                        width = perBarWidth;
                    }
                    originY = isPositive ? y + height : y;
                    originX = x + width / 2;
                }
                else {
                    if (resolvedLayout === 'stacked') {
                        const offsets = isPositive ? positiveOffsets : negativeOffsets;
                        const startValue = offsets[categoryIndex];
                        const endValue = startValue + displayedValue;
                        offsets[categoryIndex] = endValue;
                        const startX = valueScaleX(startValue);
                        const endX = valueScaleX(endValue);
                        x = Math.min(startX, endX);
                        width = Math.abs(endX - startX);
                        y = categoryIndex * bandSize + groupOffset;
                        height = groupWidth;
                    }
                    else {
                        const perBarHeight = resolvedLayout === 'grouped' ? groupWidth / displaySeries.length : groupWidth;
                        const zeroX = valueScaleX(0);
                        const valueX = valueScaleX(displayedValue);
                        x = Math.min(valueX, zeroX);
                        width = Math.abs(zeroX - valueX);
                        y = categoryIndex * bandSize + groupOffset + (resolvedLayout === 'grouped' ? seriesPosition * perBarHeight : 0);
                        height = perBarHeight;
                    }
                    originX = isPositive ? x : x + width;
                    originY = y + height / 2;
                }
                computed.push({
                    globalIndex,
                    datum: point.datum,
                    category,
                    categoryIndex,
                    seriesId: seriesItem.id,
                    seriesIndex: seriesItem.seriesIndex,
                    seriesName: seriesItem.name,
                    value: displayedValue,
                    originalValue,
                    percentContribution: usePercentageStack ? percentContribution : undefined,
                    x,
                    y,
                    width,
                    height,
                    color: point.color,
                    originX,
                    originY,
                    isPositive,
                });
                globalIndex += 1;
            });
        });
        return computed;
    }, [categories, displaySeries, resolvedLayout, orientation, barSpacing, plotWidth, plotHeight, valueScaleY, valueScaleX, metrics.stackTotals, usePercentageStack]);
    const [barScaleTargets, setBarScaleTargets] = useState([]);
    useEffect(() => {
        setBarScaleTargets((prev) => {
            if (prev.length === bars.length)
                return prev;
            const next = new Array(bars.length).fill(1);
            for (let i = 0; i < Math.min(prev.length, next.length); i += 1) {
                next[i] = prev[i];
            }
            return next;
        });
    }, [bars.length]);
    const updateScale = useCallback((index, scale) => {
        setBarScaleTargets((prev) => {
            if (prev[index] === scale)
                return prev;
            const next = [...prev];
            next[index] = scale;
            return next;
        });
    }, []);
    const dataSignature = useMemo(() => resolvedSeries
        .map((seriesItem) => `${seriesItem.id}:${seriesItem.data
        .map((d) => { var _a; return `${(_a = d.id) !== null && _a !== void 0 ? _a : d.category}:${d.value}`; })
        .join(',')}`)
        .join('|'), [resolvedSeries]);
    const startAnimation = useCallback(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [disabled, animationDuration, animationProgress]);
    useEffect(() => {
        startAnimation();
    }, [startAnimation, dataSignature]);
    const lastSignatureRef = React.useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        const signature = `${dataSignature}:${Array.from(hiddenSeries).sort().join(',')}:${valueFormatter ? 'vf' : 'plain'}`;
        if (lastSignatureRef.current === signature)
            return;
        lastSignatureRef.current = signature;
        normalizedSeries.forEach((seriesItem) => {
            var _a, _b;
            const samplePoint = seriesItem.points.find((point) => !point.isSynthetic);
            const palette = (_a = theme.colors.accentPalette) !== null && _a !== void 0 ? _a : colorSchemes.default;
            registerSeries({
                id: seriesItem.id,
                name: seriesItem.name,
                color: (samplePoint === null || samplePoint === void 0 ? void 0 : samplePoint.color) ||
                    ((_b = resolvedSeries[seriesItem.seriesIndex]) === null || _b === void 0 ? void 0 : _b.color) ||
                    barColor ||
                    getColorFromScheme(seriesItem.seriesIndex, palette),
                visible: !hiddenSeries.has(seriesItem.id),
                points: seriesItem.points.map((point, pointIndex) => ({
                    x: point.categoryIndex,
                    y: point.value,
                    meta: {
                        ...point.datum,
                        seriesId: seriesItem.id,
                        seriesName: seriesItem.name,
                        formattedValue: valueFormatter
                            ? valueFormatter(point.datum.value, point.datum, pointIndex)
                            : undefined,
                    },
                })),
            });
        });
    }, [registerSeries, normalizedSeries, resolvedSeries, barColor, theme.colors.accentPalette, hiddenSeries, dataSignature, valueFormatter]);
    const gridXTicks = useMemo(() => {
        if (!(grid === null || grid === void 0 ? void 0 : grid.show))
            return [];
        if (orientation === 'vertical')
            return [];
        return valueTicks.map((tick) => (plotWidth > 0 ? valueScaleX(tick) / plotWidth : 0));
    }, [grid === null || grid === void 0 ? void 0 : grid.show, orientation, valueTicks, valueScaleX, plotWidth]);
    const gridYTicks = useMemo(() => {
        if (!(grid === null || grid === void 0 ? void 0 : grid.show))
            return [];
        if (orientation === 'vertical') {
            return valueTicks.map((tick) => (plotHeight > 0 ? valueScaleY(tick) / plotHeight : 0));
        }
        if (plotHeight <= 0 || !categories.length)
            return [];
        const band = plotHeight / Math.max(categories.length, 1);
        return categories.map((_, index) => ((index + 0.5) * band) / plotHeight);
    }, [grid === null || grid === void 0 ? void 0 : grid.show, orientation, valueTicks, valueScaleY, plotHeight, categories.length]);
    const handlePressIn = useCallback((index) => {
        if (disabled)
            return;
        setPressedIndex(index);
        updateScale(index, 0.92);
    }, [disabled, updateScale]);
    const handlePressOut = useCallback((index) => {
        setPressedIndex(null);
        updateScale(index, hoveredIndex === index ? 1.05 : 1);
    }, [hoveredIndex, updateScale]);
    const handlePress = useCallback((bar, event) => {
        var _a;
        if (disabled)
            return;
        const centerX = bar.x + bar.width / 2;
        const centerY = bar.y + bar.height / 2;
        const interactionEvent = {
            nativeEvent: (_a = event === null || event === void 0 ? void 0 : event.nativeEvent) !== null && _a !== void 0 ? _a : event,
            chartX: centerX,
            chartY: centerY,
            dataPoint: bar.datum,
            dataX: bar.categoryIndex,
            dataY: bar.originalValue,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(bar.datum, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    }, [disabled, onDataPointPress, onPress]);
    const updatePointerState = useCallback((x, y, meta) => {
        var _a;
        if (!setPointer && !setCrosshair)
            return;
        const insideX = x >= 0 && x <= plotWidth;
        const insideY = y >= 0 && y <= plotHeight;
        if (setPointer) {
            setPointer({
                x,
                y,
                inside: insideX && insideY,
                insideX,
                insideY,
                pageX: meta === null || meta === void 0 ? void 0 : meta.pageX,
                pageY: meta === null || meta === void 0 ? void 0 : meta.pageY,
                data: (_a = meta === null || meta === void 0 ? void 0 : meta.data) !== null && _a !== void 0 ? _a : null,
            });
        }
        if (setCrosshair && insideX) {
            const clampedX = Math.max(0, Math.min(plotWidth, x));
            let dataX;
            if (orientation === 'vertical') {
                const rawIndex = categoryScaleX.invert ? categoryScaleX.invert(clampedX) : 0;
                const maxIndex = Math.max(categories.length - 1, 0);
                dataX = Math.max(0, Math.min(maxIndex, Math.round(rawIndex)));
            }
            else {
                dataX = valueScaleX.invert ? valueScaleX.invert(clampedX) : metrics.minValue;
            }
            setCrosshair({ dataX, pixelX: clampedX });
        }
    }, [setPointer, setCrosshair, plotWidth, plotHeight, orientation, categoryScaleX, categories.length, valueScaleX, metrics.minValue]);
    const handleHoverOut = useCallback((options) => {
        var _a;
        if (hoveredIndex != null) {
            updateScale(hoveredIndex, 1);
        }
        setHoveredIndex(null);
        if (!(options === null || options === void 0 ? void 0 : options.suppressPointerReset) && setPointer) {
            setPointer({ x: 0, y: 0, inside: false, insideX: false, insideY: false, data: null });
        }
        const shouldPreserve = (_a = options === null || options === void 0 ? void 0 : options.preserveCrosshair) !== null && _a !== void 0 ? _a : true;
        if (!shouldPreserve) {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [hoveredIndex, updateScale, setPointer, setCrosshair]);
    const handleHoverIn = useCallback((bar) => {
        if (disabled)
            return;
        setHoveredIndex(bar.globalIndex);
        updateScale(bar.globalIndex, pressedIndex === bar.globalIndex ? 0.92 : 1.05);
        const pointerX = bar.x + bar.width / 2;
        const pointerY = orientation === 'vertical' ? bar.y : bar.y + bar.height / 2;
        const formattedValue = valueFormatter
            ? valueFormatter(bar.originalValue, bar.datum, bar.globalIndex)
            : formatNumber$2(bar.originalValue);
        updatePointerState(pointerX, pointerY, {
            data: {
                type: 'bar',
                label: bar.datum.category,
                value: bar.originalValue,
                formattedValue,
                seriesId: bar.seriesId,
                seriesName: bar.seriesName,
                datum: bar.datum,
                percentContribution: bar.percentContribution,
            },
        });
    }, [disabled, updateScale, pressedIndex, orientation, valueFormatter, updatePointerState]);
    useEffect(() => {
        if (hoveredIndex == null)
            return;
        if (!bars.some((bar) => bar.globalIndex === hoveredIndex)) {
            handleHoverOut();
        }
    }, [bars, hoveredIndex, handleHoverOut]);
    const thresholdsBack = useMemo(() => thresholdsConfig.filter((threshold) => threshold.position === 'back'), [thresholdsConfig]);
    const thresholdsFront = useMemo(() => thresholdsConfig.filter((threshold) => threshold.position === 'front'), [thresholdsConfig]);
    const renderThresholds = useCallback((collection) => collection.map((threshold) => {
        if (orientation === 'vertical') {
            const y = valueScaleY(threshold.value);
            if (!Number.isFinite(y))
                return null;
            return (jsxs(React.Fragment, { children: [jsx(Line, { x1: 0, x2: plotWidth, y1: y, y2: y, stroke: threshold.color, strokeWidth: threshold.width, strokeDasharray: threshold.style === 'dashed' ? '4 4' : undefined }), threshold.label && (jsx(Text$1, { x: plotWidth - 4, y: y - threshold.labelOffset, fill: threshold.color, fontSize: 11, textAnchor: "end", children: threshold.label }))] }, threshold.key));
        }
        const x = valueScaleX(threshold.value);
        if (!Number.isFinite(x))
            return null;
        return (jsxs(React.Fragment, { children: [jsx(Line, { x1: x, x2: x, y1: 0, y2: plotHeight, stroke: threshold.color, strokeWidth: threshold.width, strokeDasharray: threshold.style === 'dashed' ? '4 4' : undefined }), threshold.label && (jsx(Text$1, { x: x + threshold.labelOffset, y: 12, fill: threshold.color, fontSize: 11, children: threshold.label }))] }, threshold.key));
    }), [orientation, plotWidth, plotHeight, valueScaleX, valueScaleY]);
    const legendItems = useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return [];
        if (legend.items && legend.items.length > 0) {
            return legend.items.map((item) => ({
                label: item.label,
                color: item.color,
                visible: item.visible !== false,
            }));
        }
        return normalizedSeries.map((seriesItem) => {
            var _a, _b, _c, _d;
            const sample = seriesItem.points.find((point) => !point.isSynthetic);
            const palette = (_a = theme.colors.accentPalette) !== null && _a !== void 0 ? _a : colorSchemes.default;
            return {
                label: (_c = (_b = resolvedSeries[seriesItem.seriesIndex]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : seriesItem.name,
                color: (sample === null || sample === void 0 ? void 0 : sample.color) ||
                    ((_d = resolvedSeries[seriesItem.seriesIndex]) === null || _d === void 0 ? void 0 : _d.color) ||
                    barColor ||
                    getColorFromScheme(seriesItem.seriesIndex, palette),
                visible: !hiddenSeries.has(seriesItem.id),
            };
        });
    }, [legend, normalizedSeries, hiddenSeries, resolvedSeries, theme.colors.accentPalette, barColor]);
    const handleLegendPress = useCallback((_item, index, nativeEvent) => {
        if (!allowLegendToggles || !autoLegend)
            return;
        const targetSeries = normalizedSeries[index];
        if (!targetSeries)
            return;
        setHiddenSeries((prev) => {
            const currentlyVisible = normalizedSeries.filter((seriesItem) => !prev.has(seriesItem.id));
            if (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey) {
                if (currentlyVisible.length === 1 && currentlyVisible[0].id === targetSeries.id) {
                    return new Set();
                }
                const next = new Set();
                normalizedSeries.forEach((seriesItem) => {
                    if (seriesItem.id !== targetSeries.id)
                        next.add(seriesItem.id);
                });
                return next;
            }
            const next = new Set(prev);
            if (next.has(targetSeries.id)) {
                next.delete(targetSeries.id);
            }
            else {
                next.add(targetSeries.id);
                if (next.size === normalizedSeries.length) {
                    return new Set();
                }
            }
            return next;
        });
    }, [allowLegendToggles, autoLegend, normalizedSeries]);
    const handlePointer = useCallback((nativeEvent, firePress = false) => {
        if (!nativeEvent || disabled)
            return;
        const { locationX, locationY, pageX, pageY } = nativeEvent;
        if (typeof locationX !== 'number' || typeof locationY !== 'number')
            return;
        const x = locationX;
        const y = locationY;
        updatePointerState(x, y, { pageX, pageY });
        let target = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (const bar of bars) {
            const withinX = x >= bar.x && x <= bar.x + bar.width;
            const withinY = y >= bar.y && y <= bar.y + bar.height;
            if (withinX && withinY) {
                const centerX = bar.x + bar.width / 2;
                const centerY = bar.y + bar.height / 2;
                const distance = Math.hypot(centerX - x, centerY - y);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    target = bar;
                }
            }
        }
        if (target) {
            handleHoverIn(target);
            if (firePress) {
                handlePress(target, {
                    nativeEvent: { locationX: x, locationY: y, pageX, pageY },
                });
            }
        }
        else {
            handleHoverOut({ preserveCrosshair: true, suppressPointerReset: true });
        }
    }, [bars, disabled, handleHoverIn, handlePress, handleHoverOut, updatePointerState]);
    const handlePointerEnd = useCallback(() => {
        handleHoverOut({ preserveCrosshair: false });
    }, [handleHoverOut]);
    const isWeb = Platform.OS === 'web';
    const mapWebPointerEvent = useCallback((event) => {
        var _a, _b, _c, _d;
        const rect = (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        return {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event.pageX) !== null && _c !== void 0 ? _c : event.clientX,
            pageY: (_d = event.pageY) !== null && _d !== void 0 ? _d : event.clientY,
        };
    }, []);
    const valueAxisTickSize = (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _e !== void 0 ? _e : 4;
    const categoryAxisTickSize = (_f = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _f !== void 0 ? _f : 4;
    const axisTickPadding = 4;
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, disabled: disabled, animationDuration: animationDuration, style: style, interactionConfig: { multiTooltip: true, enableCrosshair: true }, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && (jsx(ChartGrid, { grid: { show: true, ...grid, color: grid.color || theme.colors.grid }, plotWidth: plotWidth, plotHeight: plotHeight, padding: padding, xTicks: gridXTicks, yTicks: gridYTicks })), orientation === 'vertical' ? (jsxs(Fragment, { children: [(yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && (jsx(Axis, { scale: valueScaleY, orientation: "left", length: plotHeight, offset: {
                            x: padding.left - valueAxisTickSize - axisTickPadding - 6,
                            y: padding.top,
                        }, tickCount: valueTicks.length, tickSize: valueAxisTickSize, tickPadding: axisTickPadding, tickFormat: (val) => (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(Number(val)) : formatNumber$2(Number(val)), showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_g = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _g !== void 0 ? _g : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_h = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _h !== void 0 ? _h : 12) + 20 : 30, tickLabelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && (jsx(Axis, { scale: categoryScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: categories.length, tickSize: categoryAxisTickSize, tickPadding: axisTickPadding, tickFormat: (val) => {
                            var _a;
                            const index = Math.round(Number(val));
                            return (_a = categories[index]) !== null && _a !== void 0 ? _a : '';
                        }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_j = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _j !== void 0 ? _j : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _k !== void 0 ? _k : 12) + 20 : 40, tickLabelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize }))] })) : (jsxs(Fragment, { children: [(yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && (jsx(Axis, { scale: categoryScaleY, orientation: "left", length: plotHeight, offset: {
                            x: padding.left - categoryAxisTickSize - axisTickPadding - 6,
                            y: padding.top,
                        }, tickCount: categories.length, tickSize: categoryAxisTickSize, tickPadding: axisTickPadding, tickFormat: (val) => {
                            var _a;
                            const index = Math.round(Number(val));
                            return (_a = categories[index]) !== null && _a !== void 0 ? _a : '';
                        }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_l = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _l !== void 0 ? _l : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_m = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _m !== void 0 ? _m : 12) + 20 : 30, tickLabelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && (jsx(Axis, { scale: valueScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: valueTicks.length, tickSize: valueAxisTickSize, tickPadding: axisTickPadding, tickFormat: (val) => (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(Number(val)) : formatNumber$2(Number(val)), showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_o = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _o !== void 0 ? _o : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_p = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _p !== void 0 ? _p : 12) + 20 : 40, tickLabelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize }))] })), jsxs(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top }, children: [thresholdsBack.length > 0 && renderThresholds(thresholdsBack), jsx(G, { children: bars.map((bar) => {
                            var _a, _b;
                            const isHovered = hoveredIndex === bar.globalIndex;
                            const isPressed = pressedIndex === bar.globalIndex;
                            const stroke = isHovered ? ((_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a[0]) || '#6366f1' : 'transparent';
                            const opacity = isPressed ? 0.85 : isHovered ? 0.95 : 1;
                            const targetScale = (_b = barScaleTargets[bar.globalIndex]) !== null && _b !== void 0 ? _b : 1;
                            return (jsx(AnimatedBarRect, { bar: bar, orientation: orientation, animationProgress: animationProgress, targetScale: targetScale, borderRadius: barBorderRadius, fill: bar.color, opacity: opacity, stroke: stroke, strokeWidth: isHovered ? 1.5 : 0, onHoverIn: () => handleHoverIn(bar), onHoverOut: () => handleHoverOut({ preserveCrosshair: true, suppressPointerReset: true }), onPress: (e) => handlePress(bar, e), onPressIn: () => handlePressIn(bar.globalIndex), onPressOut: () => handlePressOut(bar.globalIndex) }, `${bar.seriesId}-${bar.globalIndex}`));
                        }) }), showValueLabels &&
                        bars.map((bar) => {
                            var _a;
                            const labelText = valueLabelFormatter(bar.originalValue, bar.datum, bar.globalIndex);
                            if (labelText == null || labelText === '')
                                return null;
                            const textKey = `${bar.seriesId}-${(_a = bar.datum.id) !== null && _a !== void 0 ? _a : `${bar.category}-${bar.globalIndex}`}-label`;
                            const isVertical = orientation === 'vertical';
                            const useInside = valueLabelInside
                                ? isVertical
                                    ? bar.height >= valueLabelFontSize * 1.6
                                    : bar.width >= valueLabelFontSize * 2.2
                                : false;
                            let x;
                            let y;
                            let textAnchor;
                            let alignmentBaseline;
                            if (isVertical) {
                                x = bar.x + bar.width / 2;
                                textAnchor = 'middle';
                                if (useInside) {
                                    y = bar.y + bar.height / 2;
                                    alignmentBaseline = 'middle';
                                }
                                else {
                                    y = bar.y - valueLabelOffset;
                                    alignmentBaseline = 'baseline';
                                }
                            }
                            else {
                                y = bar.y + bar.height / 2;
                                alignmentBaseline = 'middle';
                                if (useInside) {
                                    x = bar.x + bar.width - valueLabelOffset;
                                    textAnchor = 'end';
                                }
                                else {
                                    x = bar.x + bar.width + valueLabelOffset;
                                    textAnchor = 'start';
                                }
                            }
                            return (jsx(Text$1, { x: x, y: y, fill: valueLabelColor, fontSize: valueLabelFontSize, fontWeight: valueLabelFontWeight, textAnchor: textAnchor, alignmentBaseline: alignmentBaseline, pointerEvents: "none", children: labelText }, textKey));
                        }), thresholdsFront.length > 0 && renderThresholds(thresholdsFront)] }), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, pointerEvents: disabled ? 'none' : isWeb ? 'auto' : 'box-only', ...(isWeb
                    ? {
                        // @ts-ignore react-native-web pointer events
                        onPointerMove: (event) => {
                            handlePointer(mapWebPointerEvent(event));
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerDown: (event) => {
                            var _a, _b, _c;
                            (_a = event.preventDefault) === null || _a === void 0 ? void 0 : _a.call(event);
                            (_c = (_b = event.currentTarget) === null || _b === void 0 ? void 0 : _b.setPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, event.pointerId);
                            handlePointer(mapWebPointerEvent(event));
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerUp: (event) => {
                            var _a, _b;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                            handlePointer(mapWebPointerEvent(event), true);
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerLeave: () => {
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerCancel: () => {
                            handlePointerEnd();
                        },
                    }
                    : {
                        onStartShouldSetResponder: () => !disabled,
                        onMoveShouldSetResponder: () => !disabled,
                        onResponderGrant: (e) => handlePointer(e.nativeEvent),
                        onResponderMove: (e) => handlePointer(e.nativeEvent),
                        onResponderRelease: (e) => {
                            handlePointer(e.nativeEvent, true);
                            handlePointerEnd();
                        },
                        onResponderTerminate: handlePointerEnd,
                        onResponderTerminationRequest: () => true,
                    }) }), (legend === null || legend === void 0 ? void 0 : legend.show) && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: allowLegendToggles && autoLegend ? handleLegendPress : undefined }))] }));
});
BarChart.displayName = 'BarChart';

const AnimatedBubble = React.memo(({ bubble, color, opacity, strokeColor = 'rgba(0,0,0,0.12)', strokeWidth = 1, isSelected = false, index, disabled = false, theme, }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    const bubbleOpacity = useSharedValue(disabled ? opacity : 0);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            bubbleOpacity.value = opacity;
            return;
        }
        // Staggered appearance animation
        const delay = index * 75;
        scale.value = withDelay(delay, withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.back(1.1)),
        }));
        bubbleOpacity.value = withDelay(delay, withTiming(opacity, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, index, opacity, scale, bubbleOpacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value * (isSelected ? 1.2 : 1) }],
        opacity: bubbleOpacity.value,
    }));
    // Skip rendering if coordinates or radius are invalid
    if (typeof bubble.chartX !== 'number' ||
        typeof bubble.chartY !== 'number' ||
        typeof bubble.radius !== 'number' ||
        bubble.radius <= 0) {
        return null;
    }
    const diameter = bubble.radius * 2;
    return (jsx(Animated$1.View, { style: [
            {
                position: 'absolute',
                left: bubble.chartX - bubble.radius,
                top: bubble.chartY - bubble.radius,
                width: diameter,
                height: diameter,
                borderRadius: bubble.radius,
                backgroundColor: color,
                borderWidth: strokeWidth,
                borderColor: isSelected ? theme.colors.accentPalette[0] : strokeColor,
                pointerEvents: 'none',
            },
            animatedStyle,
        ] }));
});
AnimatedBubble.displayName = 'AnimatedBubble';

const buildSignature$7 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b, _c, _d, _e;
            const meta = point.meta;
            const metaId = (_a = meta === null || meta === void 0 ? void 0 : meta.id) !== null && _a !== void 0 ? _a : `${(_b = meta === null || meta === void 0 ? void 0 : meta.x) !== null && _b !== void 0 ? _b : ''}:${(_c = meta === null || meta === void 0 ? void 0 : meta.y) !== null && _c !== void 0 ? _c : ''}`;
            const radius = (_d = meta === null || meta === void 0 ? void 0 : meta.radius) !== null && _d !== void 0 ? _d : 0;
            const value = (_e = meta === null || meta === void 0 ? void 0 : meta.value) !== null && _e !== void 0 ? _e : 0;
            return `${point.x}:${point.y}:${metaId}:${radius}:${value}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
        .join('||');
};
const useBubbleSeriesRegistration = ({ series, registerSeries }) => {
    const registrations = useMemo(() => {
        if (!series.length)
            return [];
        return series.map((entry) => ({
            id: entry.id,
            name: entry.name,
            color: entry.color,
            points: entry.chartBubbles.map((bubble) => ({
                x: bubble.x,
                y: bubble.y,
                meta: bubble,
            })),
            visible: entry.visible !== false,
        }));
    }, [series]);
    const signature = useMemo(() => buildSignature$7(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (!registrations.length || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((entry) => registerSeries(entry));
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!registrations.length) {
            registeredSignatureRef.current = null;
        }
    }, [registrations.length]);
};

const clamp01$1 = (value) => {
    if (!Number.isFinite(value))
        return 0;
    if (value < 0)
        return 0;
    if (value > 1)
        return 1;
    return value;
};
const isLikelyColor = (value) => {
    if (typeof value !== 'string')
        return false;
    const trimmed = value.trim();
    if (!trimmed)
        return false;
    return /^#|^rgba?\(|^hsla?\(|^var\(/i.test(trimmed);
};
const resolveLegendItemKey = (item, index) => {
    var _a, _b;
    if (!item)
        return String(index);
    const candidate = (_b = (_a = item.key) !== null && _a !== void 0 ? _a : item.id) !== null && _b !== void 0 ? _b : item.label;
    if (candidate == null)
        return String(index);
    return String(candidate);
};
const setsEqual = (a, b) => {
    if (a === b)
        return true;
    if (a.size !== b.size)
        return false;
    for (const value of a) {
        if (!b.has(value))
            return false;
    }
    return true;
};
const deriveAxisState = (values) => {
    const filtered = values.filter((v) => v != null);
    if (!filtered.length) {
        return { isNumeric: true, domain: [0, 1], categories: [] };
    }
    const numericValues = filtered.filter((v) => typeof v === 'number' && Number.isFinite(v));
    const isNumeric = numericValues.length === filtered.length;
    if (isNumeric) {
        let min = Math.min(...numericValues);
        let max = Math.max(...numericValues);
        if (min === max) {
            const delta = Math.abs(min) * 0.1 || 1;
            min -= delta;
            max += delta;
        }
        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            min = 0;
            max = 1;
        }
        return { isNumeric: true, domain: [min, max], categories: [] };
    }
    const categories = Array.from(new Set(filtered.map((v) => String(v))));
    return {
        isNumeric: false,
        domain: [0, Math.max(categories.length - 1, 1)],
        categories,
    };
};
const BubbleChart = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const { data = [], dataKey, width = 400, height, h, range = [36, 576], color, colorScale, textColor, gridColor, grid = true, xAxis = {}, yAxis = {}, label, valueFormatter, withTooltip = true, tooltip, minBubbleSize, maxBubbleSize, bubbleOpacity: bubbleOpacityProp, bubbleStrokeColor = 'rgba(0,0,0,0.12)', bubbleStrokeWidth = 1, title, subtitle, onPress, onDataPointPress, disabled = false, animationDuration, style, legend, ...rest } = props;
    const theme = useChartTheme();
    const [hiddenLegendKeys, setHiddenLegendKeys] = useState(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.items))
            return new Set();
        const initial = new Set();
        legend.items.forEach((item, index) => {
            if (item.visible === false) {
                initial.add(resolveLegendItemKey(item, index));
            }
        });
        return initial;
    });
    const legendItemsSignature = useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.items))
            return null;
        return legend.items
            .map((item, index) => `${resolveLegendItemKey(item, index)}:${item.visible === false ? '0' : '1'}`)
            .join('|');
    }, [legend === null || legend === void 0 ? void 0 : legend.items]);
    useEffect(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.items)) {
            setHiddenLegendKeys((prev) => (prev.size === 0 ? prev : new Set()));
            return;
        }
        const nextHidden = new Set();
        legend.items.forEach((item, index) => {
            if (item.visible === false) {
                nextHidden.add(resolveLegendItemKey(item, index));
            }
        });
        setHiddenLegendKeys((prev) => (setsEqual(prev, nextHidden) ? prev : nextHidden));
    }, [legendItemsSignature, legend === null || legend === void 0 ? void 0 : legend.items]);
    const resolvedHeight = (_a = h !== null && h !== void 0 ? h : height) !== null && _a !== void 0 ? _a : 300;
    const resolvedBubbleOpacity = bubbleOpacityProp !== null && bubbleOpacityProp !== void 0 ? bubbleOpacityProp : 0.85;
    const padding = React.useMemo(() => {
        const baseTop = (title || subtitle) ? 72 : 48;
        const top = label ? baseTop + 20 : baseTop;
        const left = (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) === false ? 48 : 80;
        const bottom = (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? 72 : 56;
        const right = 32;
        return { top, right, bottom, left };
    }, [title, subtitle, label, xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, yAxis === null || yAxis === void 0 ? void 0 : yAxis.show]);
    const plotWidth = Math.max(1, width - padding.left - padding.right);
    const plotHeight = Math.max(1, resolvedHeight - padding.top - padding.bottom);
    const xState = useMemo(() => {
        const values = data.map((item) => item[dataKey.x]);
        return deriveAxisState(values);
    }, [data, dataKey.x]);
    const yState = useMemo(() => {
        const values = data.map((item) => item[dataKey.y]);
        return deriveAxisState(values);
    }, [data, dataKey.y]);
    const getXRatio = useCallback((value) => {
        if (xState.isNumeric) {
            const num = typeof value === 'number' && Number.isFinite(value) ? value : Number(value);
            const [min, max] = xState.domain;
            if (!Number.isFinite(num) || max === min)
                return 0.5;
            const ratio = (num - min) / (max - min);
            return clamp01$1(ratio);
        }
        const count = xState.categories.length;
        if (!count)
            return 0.5;
        const idx = xState.categories.indexOf(String(value));
        if (count === 1)
            return 0.5;
        return clamp01$1((idx < 0 ? 0 : idx) / (count - 1));
    }, [xState]);
    const getYRatio = useCallback((value) => {
        if (yState.isNumeric) {
            const num = typeof value === 'number' && Number.isFinite(value) ? value : Number(value);
            const [min, max] = yState.domain;
            if (!Number.isFinite(num) || max === min)
                return 0.5;
            const ratio = (num - min) / (max - min);
            return clamp01$1(ratio);
        }
        const count = yState.categories.length;
        if (!count)
            return 0.5;
        const idx = yState.categories.indexOf(String(value));
        if (count === 1)
            return 0.5;
        return clamp01$1((idx < 0 ? 0 : idx) / (count - 1));
    }, [yState]);
    const sizeDomain = useMemo(() => {
        const zKey = dataKey.z;
        if (!zKey) {
            return { min: 0, max: 1 };
        }
        const values = data
            .map((item) => Number(item[zKey]))
            .filter((val) => Number.isFinite(val));
        if (!values.length) {
            return { min: 0, max: 1 };
        }
        let min = Math.min(...values);
        let max = Math.max(...values);
        if (min === max) {
            const delta = Math.abs(min) * 0.1 || 1;
            min = Math.max(0, min - delta);
            max = max + delta;
        }
        if (max <= 0) {
            max = 1;
            min = 0;
        }
        return { min: Math.max(0, min), max: Math.max(max, 1) };
    }, [data, dataKey.z]);
    const [minAreaInput, maxAreaInput] = range;
    const minArea = Math.max(0, Math.min(minAreaInput, maxAreaInput));
    const maxArea = Math.max(minArea + 1, Math.max(minAreaInput, maxAreaInput));
    const derivedMinRadius = Math.sqrt(minArea / Math.PI);
    const derivedMaxRadius = Math.sqrt(maxArea / Math.PI);
    const minRadius = Math.max(0, minBubbleSize !== null && minBubbleSize !== void 0 ? minBubbleSize : derivedMinRadius);
    const maxRadius = Math.max(minRadius, maxBubbleSize !== null && maxBubbleSize !== void 0 ? maxBubbleSize : derivedMaxRadius);
    const computeRadius = useCallback((rawValue, index) => {
        const value = rawValue != null && Number.isFinite(rawValue) ? Math.max(0, rawValue) : undefined;
        if (sizeDomain.max === sizeDomain.min) {
            return minRadius;
        }
        const fallback = (sizeDomain.min + sizeDomain.max) / 2;
        const normalized = (Math.max(0, value !== null && value !== void 0 ? value : fallback) - sizeDomain.min) / (sizeDomain.max - sizeDomain.min);
        const area = minArea + clamp01$1(normalized) * (maxArea - minArea);
        const radius = Math.sqrt(Math.max(area, 0) / Math.PI);
        return Math.max(minRadius, Math.min(maxRadius, radius));
    }, [sizeDomain, minArea, maxArea, minRadius, maxRadius]);
    const resolvedTextColor = textColor || theme.colors.textSecondary;
    const xTitleColor = (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || resolvedTextColor;
    const yTitleColor = (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || resolvedTextColor;
    const tooltipEnabled = withTooltip && ((_b = tooltip === null || tooltip === void 0 ? void 0 : tooltip.show) !== null && _b !== void 0 ? _b : true);
    const chartGridConfig = useMemo(() => {
        var _a;
        if (grid === false)
            return null;
        if (grid === true || grid == null) {
            return {
                show: true,
                color: gridColor || theme.colors.grid,
                thickness: 1,
                style: 'solid',
            };
        }
        return {
            show: grid.show !== false,
            color: gridColor || grid.color || theme.colors.grid,
            thickness: (_a = grid.thickness) !== null && _a !== void 0 ? _a : 1,
            style: grid.style,
            showMajor: grid.showMajor,
            showMinor: grid.showMinor,
            majorLines: grid.majorLines,
            minorLines: grid.minorLines,
        };
    }, [grid, gridColor, theme.colors.grid]);
    const xTicks = useMemo(() => {
        if (xState.isNumeric) {
            const [min, max] = xState.domain;
            const tickValues = generateTicks(min, max, Math.min(6, Math.max(3, data.length)));
            return tickValues.map((value) => {
                const ratio = clamp01$1((value - min) / (max - min));
                return {
                    value,
                    label: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(value) : formatNumber$2(value, 2),
                    gridRatio: ratio,
                };
            });
        }
        const categories = xState.categories.length
            ? xState.categories
            : data.map((_item, idx) => String(idx + 1));
        return categories.map((labelValue, idx) => {
            const count = categories.length;
            const ratio = count <= 1 ? 0.5 : idx / (count - 1);
            return {
                value: labelValue,
                label: labelValue,
                gridRatio: ratio,
            };
        });
    }, [xState, xAxis, data, plotWidth]);
    const yTicks = useMemo(() => {
        if (yState.isNumeric) {
            const [min, max] = yState.domain;
            const tickValues = generateTicks(min, max, 5);
            return tickValues.map((value) => {
                const ratio = clamp01$1((value - min) / (max - min));
                const gridRatio = 1 - ratio;
                return {
                    value,
                    label: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(value) : formatNumber$2(value, 2),
                    gridRatio,
                };
            });
        }
        const categories = yState.categories.length
            ? yState.categories
            : data.map((_item, idx) => String(idx + 1));
        return categories.map((labelValue, idx) => {
            const count = categories.length;
            const ratio = count <= 1 ? 0.5 : idx / (count - 1);
            const gridRatio = 1 - ratio;
            return {
                value: labelValue,
                label: labelValue,
                gridRatio,
            };
        });
    }, [yState, yAxis, data, plotHeight]);
    const xTickValues = useMemo(() => xTicks.map((tick) => tick.value), [xTicks]);
    const yTickValues = useMemo(() => yTicks.map((tick) => tick.value), [yTicks]);
    const xAxisTickSize = (_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _c !== void 0 ? _c : 4;
    const yAxisTickSize = (_d = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _d !== void 0 ? _d : 4;
    const axisTickPadding = 4;
    const axisScaleX = useMemo(() => {
        if (plotWidth <= 0) {
            const scale = ((_) => 0);
            scale.domain = () => [];
            scale.range = () => [0, 0];
            scale.ticks = () => [];
            return scale;
        }
        if (xState.isNumeric) {
            const [min, max] = xState.domain;
            const scale = linearScale([min, max], [0, plotWidth]);
            const numericTicks = xTickValues.filter((val) => typeof val === 'number' && Number.isFinite(val));
            const baseTicks = scale.ticks ? scale.ticks.bind(scale) : undefined;
            scale.ticks = (count) => {
                if (numericTicks.length)
                    return numericTicks;
                return baseTicks ? baseTicks(count) : [];
            };
            return scale;
        }
        const domain = (xState.categories.length ? xState.categories : xTickValues.map((val) => String(val)));
        const count = domain.length;
        const step = count > 1 ? plotWidth / (count - 1) : 0;
        const scale = ((value) => {
            if (!count)
                return 0;
            const str = String(value);
            const idx = domain.indexOf(str);
            if (count === 1) {
                return plotWidth / 2;
            }
            const clampedIdx = idx >= 0 ? idx : 0;
            return clampedIdx * step;
        });
        scale.domain = () => domain.slice();
        scale.range = () => [0, plotWidth];
        scale.ticks = () => domain.slice();
        return scale;
    }, [plotWidth, xState, xTickValues]);
    const axisScaleY = useMemo(() => {
        if (plotHeight <= 0) {
            const scale = ((_) => 0);
            scale.domain = () => [];
            scale.range = () => [0, 0];
            scale.ticks = () => [];
            return scale;
        }
        if (yState.isNumeric) {
            const [min, max] = yState.domain;
            const scale = linearScale([min, max], [plotHeight, 0]);
            const numericTicks = yTickValues.filter((val) => typeof val === 'number' && Number.isFinite(val));
            const baseTicks = scale.ticks ? scale.ticks.bind(scale) : undefined;
            scale.ticks = (count) => {
                if (numericTicks.length)
                    return numericTicks;
                return baseTicks ? baseTicks(count) : [];
            };
            return scale;
        }
        const domain = (yState.categories.length ? yState.categories : yTickValues.map((val) => String(val)));
        const count = domain.length;
        const step = count > 1 ? plotHeight / (count - 1) : 0;
        const scale = ((value) => {
            if (!count)
                return plotHeight;
            const str = String(value);
            const idx = domain.indexOf(str);
            if (count === 1) {
                return plotHeight / 2;
            }
            const clampedIdx = idx >= 0 ? idx : 0;
            return plotHeight - clampedIdx * step;
        });
        scale.domain = () => domain.slice();
        scale.range = () => [plotHeight, 0];
        scale.ticks = () => domain.slice();
        return scale;
    }, [plotHeight, yState, yTickValues]);
    const allBubbles = useMemo(() => {
        if (!plotWidth || !plotHeight)
            return [];
        return data.map((item, index) => {
            var _a, _b, _c;
            const rawX = item[dataKey.x];
            const rawY = item[dataKey.y];
            const rawZ = dataKey.z ? Number(item[dataKey.z]) : undefined;
            const ratioX = getXRatio(rawX);
            const ratioY = getYRatio(rawY);
            const plotX = clamp01$1(ratioX) * plotWidth;
            const plotY = (1 - clamp01$1(ratioY)) * plotHeight;
            const value = rawZ != null && Number.isFinite(rawZ) ? Math.max(0, rawZ) : undefined;
            const radius = computeRadius(value, index);
            const rawColorValue = dataKey.color ? item[dataKey.color] : undefined;
            let bubbleColor = colorScale ? colorScale(rawColorValue, item, index) : undefined;
            if (!bubbleColor && rawColorValue != null) {
                if (isLikelyColor(rawColorValue)) {
                    bubbleColor = String(rawColorValue);
                }
            }
            if (!bubbleColor && item.color != null) {
                const inferred = item.color;
                if (isLikelyColor(inferred)) {
                    bubbleColor = String(inferred);
                }
            }
            if (!bubbleColor && color) {
                bubbleColor = color;
            }
            if (!bubbleColor) {
                bubbleColor = getColorFromScheme(index, (_a = theme.colors.accentPalette) !== null && _a !== void 0 ? _a : colorSchemes.default);
            }
            const labelValue = dataKey.label ? item[dataKey.label] : rawX;
            const legendKey = rawColorValue != null ? String(rawColorValue) : undefined;
            const legendLabel = legendKey !== null && legendKey !== void 0 ? legendKey : (labelValue != null ? String(labelValue) : String(rawX !== null && rawX !== void 0 ? rawX : index + 1));
            const idValue = dataKey.id ? item[dataKey.id] : (_b = item.id) !== null && _b !== void 0 ? _b : index;
            const dataXNumeric = xState.isNumeric
                ? (typeof rawX === 'number' && Number.isFinite(rawX) ? rawX : Number(rawX) || index)
                : Math.max(0, xState.categories.indexOf(String(rawX)));
            const dataYNumeric = yState.isNumeric
                ? (typeof rawY === 'number' && Number.isFinite(rawY) ? rawY : Number(rawY) || index)
                : Math.max(0, yState.categories.indexOf(String(rawY)));
            const bubbleValue = value !== null && value !== void 0 ? value : (sizeDomain.min === sizeDomain.max ? sizeDomain.max : (sizeDomain.min + sizeDomain.max) / 2);
            const formattedValue = valueFormatter ? valueFormatter(bubbleValue, item, index) : formatNumber$2(bubbleValue, 2);
            const tooltipPayload = {
                record: item,
                value: bubbleValue,
                label: labelValue != null ? String(labelValue) : String(rawX !== null && rawX !== void 0 ? rawX : index + 1),
                rawX,
                rawY,
                index,
                color: bubbleColor,
            };
            const customTooltip = (_c = tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) === null || _c === void 0 ? void 0 : _c.call(tooltip, tooltipPayload);
            return {
                index,
                id: typeof idValue === 'string' || typeof idValue === 'number' ? idValue : String(idValue !== null && idValue !== void 0 ? idValue : index),
                record: item,
                rawX,
                rawY,
                value: bubbleValue,
                radius,
                plotX,
                plotY,
                dataX: Number.isFinite(dataXNumeric) ? dataXNumeric : index,
                dataY: Number.isFinite(dataYNumeric) ? dataYNumeric : index,
                color: bubbleColor,
                label: labelValue != null ? String(labelValue) : String(rawX !== null && rawX !== void 0 ? rawX : index + 1),
                formattedValue,
                tooltipPayload,
                customTooltip,
                legendLabel,
                legendKey,
            };
        });
    }, [data, dataKey, getXRatio, getYRatio, computeRadius, color, colorScale, theme.colors.accentPalette, xState, yState, sizeDomain, valueFormatter, plotWidth, plotHeight, tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter]);
    const bubbles = useMemo(() => {
        if (!hiddenLegendKeys.size)
            return allBubbles;
        return allBubbles.filter((bubble) => { var _a; return !hiddenLegendKeys.has((_a = bubble.legendKey) !== null && _a !== void 0 ? _a : bubble.legendLabel); });
    }, [allBubbles, hiddenLegendKeys]);
    const legendItems = useMemo(() => {
        var _a;
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return [];
        if (legend.items && legend.items.length > 0) {
            return legend.items.map((item, index) => {
                const key = resolveLegendItemKey(item, index);
                const hidden = hiddenLegendKeys.has(key);
                return {
                    ...item,
                    key,
                    visible: !hidden,
                };
            });
        }
        const entries = new Map();
        for (const bubble of allBubbles) {
            const key = (_a = bubble.legendKey) !== null && _a !== void 0 ? _a : bubble.legendLabel;
            if (!entries.has(key)) {
                entries.set(key, {
                    label: bubble.legendLabel,
                    color: bubble.color,
                    key,
                    visible: !hiddenLegendKeys.has(key),
                });
            }
        }
        return Array.from(entries.values());
    }, [legend, hiddenLegendKeys, allBubbles]);
    const legendEntryKeys = useMemo(() => legendItems.map((item, index) => resolveLegendItemKey(item, index)), [legendItems]);
    const handleLegendPress = useCallback((item, index, nativeEvent) => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return;
        const key = resolveLegendItemKey(item, index);
        setHiddenLegendKeys((prev) => {
            const entryKeys = legendEntryKeys.filter(Boolean);
            if (!entryKeys.length)
                return prev;
            if (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey) {
                const visibleKeys = entryKeys.filter((entryKey) => !prev.has(entryKey));
                if (visibleKeys.length === 1 && visibleKeys[0] === key) {
                    return prev.size === 0 ? prev : new Set();
                }
                const nextHidden = new Set(entryKeys.filter((entryKey) => entryKey !== key));
                return setsEqual(prev, nextHidden) ? prev : nextHidden;
            }
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            }
            else {
                next.add(key);
            }
            return setsEqual(prev, next) ? prev : next;
        });
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legendEntryKeys]);
    const interactionContext = (() => {
        try {
            return useChartInteractionContext();
        }
        catch (_a) {
            return null;
        }
    })();
    const registerSeries = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.registerSeries;
    const setPointer = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.setPointer;
    const setCrosshair = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.setCrosshair;
    // Register series for tooltip interaction
    const bubbleSeriesData = useMemo(() => {
        var _a;
        if (!tooltipEnabled)
            return [];
        return [{
                id: 'bubble-series',
                name: title || label || 'Bubble Series',
                color: color || ((_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a[0]) || '#3B82F6',
                visible: true,
                chartBubbles: bubbles.map(bubble => ({
                    ...bubble.record,
                    id: bubble.id,
                    x: bubble.dataX,
                    y: bubble.dataY,
                    chartX: bubble.plotX,
                    chartY: bubble.plotY,
                    radius: bubble.radius,
                    value: bubble.value,
                    label: bubble.label,
                    color: bubble.color,
                    formattedValue: bubble.formattedValue,
                    customTooltip: bubble.customTooltip,
                    rawX: bubble.rawX,
                    rawY: bubble.rawY,
                    tooltipPayload: bubble.tooltipPayload,
                })),
            }];
    }, [bubbles, title, label, color, theme.colors.accentPalette, tooltipEnabled]);
    useBubbleSeriesRegistration({
        series: bubbleSeriesData,
        registerSeries,
    });
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const handlePointer = useCallback((nativeEvent, firePress = false) => {
        if (!nativeEvent || disabled)
            return;
        const { locationX, locationY, pageX, pageY } = nativeEvent;
        if (typeof locationX !== 'number' || typeof locationY !== 'number')
            return;
        const x = clamp01$1(locationX / plotWidth) * plotWidth;
        const y = clamp01$1(locationY / plotHeight) * plotHeight;
        let closest = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const bubble of bubbles) {
            const dx = x - bubble.plotX;
            const dy = y - bubble.plotY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const threshold = Math.max(bubble.radius * 1.15, 12);
            if (distance <= threshold && distance < closestDistance) {
                closest = bubble;
                closestDistance = distance;
            }
        }
        if (closest) {
            setHoveredIndex(closest.index);
            if (tooltipEnabled && setPointer) {
                const pointerData = {
                    type: 'bubble',
                    label: closest.label,
                    value: closest.value,
                    formattedValue: closest.formattedValue,
                    rawX: closest.rawX,
                    rawY: closest.rawY,
                    record: closest.record,
                    color: closest.color,
                    radius: closest.radius,
                    customTooltip: closest.customTooltip,
                    payload: closest.tooltipPayload,
                };
                setPointer({ x: closest.plotX, y: closest.plotY, inside: true, pageX, pageY, data: pointerData });
                setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: closest.dataX, pixelX: closest.plotX });
            }
            if (firePress) {
                const bubblePoint = {
                    id: closest.id,
                    x: closest.dataX,
                    y: closest.dataY,
                    label: closest.label,
                    color: closest.color,
                    size: closest.radius,
                    data: closest.record,
                };
                const interactionEvent = {
                    nativeEvent,
                    chartX: closest.plotX,
                    chartY: closest.plotY,
                    dataX: closest.dataX,
                    dataY: closest.dataY,
                    dataPoint: bubblePoint,
                    distance: closestDistance,
                };
                onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(bubblePoint, interactionEvent);
                onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
            }
        }
        else {
            setHoveredIndex(null);
            if (tooltipEnabled && setPointer) {
                setPointer({ x, y, inside: true, pageX, pageY, data: null });
                setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
            }
        }
    }, [bubbles, disabled, plotWidth, plotHeight, tooltipEnabled, setPointer, setCrosshair, onDataPointPress, onPress]);
    const handlePointerEnd = useCallback(() => {
        setHoveredIndex(null);
        if (tooltipEnabled && setPointer) {
            setPointer({ x: 0, y: 0, inside: false, data: null });
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [tooltipEnabled, setPointer, setCrosshair]);
    useEffect(() => {
        if (hoveredIndex == null)
            return;
        const stillVisible = bubbles.some((bubble) => bubble.index === hoveredIndex);
        if (!stillVisible) {
            setHoveredIndex(null);
            if (tooltipEnabled && setPointer) {
                setPointer({ x: 0, y: 0, inside: false, data: null });
                setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
            }
        }
    }, [bubbles, hoveredIndex, tooltipEnabled, setPointer, setCrosshair]);
    const isWeb = Platform.OS === 'web';
    const mapWebPointerEvent = useCallback((event) => {
        var _a, _b, _c, _d;
        const rect = (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        return {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event.pageX) !== null && _c !== void 0 ? _c : event.clientX,
            pageY: (_d = event.pageY) !== null && _d !== void 0 ? _d : event.clientY,
        };
    }, []);
    return (jsxs(ChartContainer, { width: width, height: resolvedHeight, padding: padding, disabled: disabled, style: style, animationDuration: animationDuration, interactionConfig: tooltipEnabled ? { multiTooltip: true, enableCrosshair: true, pointerRAF: true } : { multiTooltip: false, enableCrosshair: false }, suppressPopover: !tooltipEnabled, ...rest, children: [(title || subtitle) && (jsx(ChartTitle, { title: title, subtitle: subtitle, align: "left" })), label && (jsx(Text, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: (title || subtitle) ? padding.top - 28 : padding.top - 32,
                    fontSize: 13,
                    fontWeight: '600',
                    color: resolvedTextColor,
                }, children: label })), chartGridConfig && (jsx(ChartGrid, { grid: chartGridConfig, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: xTicks.map((tick) => tick.gridRatio), yTicks: yTicks.map((tick) => tick.gridRatio), padding: padding })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) && (jsx(View, { pointerEvents: "none", style: {
                    position: 'absolute',
                    left: 0,
                    top: padding.top - 28,
                    width: padding.left,
                    alignItems: 'flex-start',
                }, children: jsx(Text, { style: {
                        fontSize: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) || 12,
                        color: yTitleColor,
                        fontWeight: '500',
                    }, children: yAxis.title }) })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTickValues.length || undefined, tickSize: yAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    if (yState.isNumeric) {
                        const numeric = typeof value === 'number' ? value : Number(value);
                        return (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(numeric) : formatNumber$2(numeric, 2);
                    }
                    return String(value);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _e !== void 0 ? _e : 1, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || resolvedTextColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || resolvedTextColor, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTickValues.length || undefined, tickSize: xAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    if (xState.isNumeric) {
                        const numeric = typeof value === 'number' ? value : Number(value);
                        return (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(numeric) : formatNumber$2(numeric, 2);
                    }
                    return String(value);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_f = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _f !== void 0 ? _f : 1, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || resolvedTextColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || resolvedTextColor, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) && (jsx(View, { pointerEvents: "none", style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top + plotHeight + 32,
                    width: plotWidth,
                    alignItems: 'center',
                }, children: jsx(Text, { style: {
                        fontSize: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) || 12,
                        color: xTitleColor,
                        fontWeight: '500',
                    }, children: xAxis.title }) })), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, children: bubbles.map((bubble, index) => (jsx(AnimatedBubble, { bubble: {
                        ...bubble.record,
                        id: bubble.id,
                        x: bubble.dataX,
                        y: bubble.dataY,
                        chartX: bubble.plotX,
                        chartY: bubble.plotY,
                        radius: bubble.radius,
                        value: bubble.value,
                    }, color: bubble.color, opacity: resolvedBubbleOpacity, strokeColor: bubbleStrokeColor, strokeWidth: bubbleStrokeWidth, isSelected: hoveredIndex === bubble.index, index: index, disabled: disabled, theme: theme }, bubble.id))) }), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, pointerEvents: disabled ? 'none' : isWeb ? 'auto' : 'box-only', ...(isWeb
                    ? {
                        // @ts-ignore react-native-web pointer events
                        onPointerMove: (event) => {
                            handlePointer(mapWebPointerEvent(event));
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerDown: (event) => {
                            var _a, _b, _c;
                            (_a = event.preventDefault) === null || _a === void 0 ? void 0 : _a.call(event);
                            (_c = (_b = event.currentTarget) === null || _b === void 0 ? void 0 : _b.setPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, event.pointerId);
                            handlePointer(mapWebPointerEvent(event));
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerUp: (event) => {
                            var _a, _b;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                            handlePointer(mapWebPointerEvent(event), true);
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerLeave: () => {
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerCancel: () => {
                            handlePointerEnd();
                        },
                    }
                    : {
                        onStartShouldSetResponder: () => !disabled,
                        onMoveShouldSetResponder: () => !disabled,
                        onResponderGrant: (e) => handlePointer(e.nativeEvent),
                        onResponderMove: (e) => handlePointer(e.nativeEvent),
                        onResponderRelease: (e) => {
                            handlePointer(e.nativeEvent, true);
                            handlePointerEnd();
                        },
                        onResponderTerminate: handlePointerEnd,
                        onResponderTerminationRequest: () => true,
                    }) }), (legend === null || legend === void 0 ? void 0 : legend.show) && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: handleLegendPress }))] }));
};
BubbleChart.displayName = 'BubbleChart';

const clampOpacity = (value) => {
    if (Number.isNaN(value))
        return 0;
    return Math.min(1, Math.max(0, value));
};
const hexToRgba = (hex, opacity) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
        clean = clean.split('').map((char) => char + char).join('');
    }
    if (clean.length !== 6) {
        return null;
    }
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some((component) => Number.isNaN(component))) {
        return null;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
const ensureColorFormats = (color, opacity) => {
    const nextOpacity = clampOpacity(opacity);
    if (!color) {
        return {
            boxShadowColor: `rgba(0, 0, 0, ${nextOpacity})`,
            nativeColor: '#000',
            nativeOpacity: nextOpacity,
        };
    }
    const normalized = color.trim();
    if (normalized.startsWith('rgba(')) {
        return {
            boxShadowColor: normalized,
            nativeColor: normalized,
            nativeOpacity: 1,
        };
    }
    if (normalized.startsWith('rgb(')) {
        const boxShadowColor = normalized.replace('rgb(', 'rgba(').replace(')', `, ${nextOpacity})`);
        return {
            boxShadowColor,
            nativeColor: normalized,
            nativeOpacity: nextOpacity,
        };
    }
    if (normalized.startsWith('#')) {
        const rgba = hexToRgba(normalized, nextOpacity);
        return {
            boxShadowColor: rgba || `rgba(0, 0, 0, ${nextOpacity})`,
            nativeColor: normalized,
            nativeOpacity: nextOpacity,
        };
    }
    return {
        boxShadowColor: normalized,
        nativeColor: normalized,
        nativeOpacity: nextOpacity,
    };
};
const platformShadow = (options = {}) => {
    const { color = '#000', opacity = 0.15, offsetX = 0, offsetY = 2, radius = 8, spread = 0, elevation, } = options;
    const { boxShadowColor, nativeColor, nativeOpacity } = ensureColorFormats(color, opacity);
    if (Platform.OS === 'web') {
        const spreadPart = spread ? `${spread}px ` : '';
        return {
            boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${spreadPart}${boxShadowColor}`.trim(),
        };
    }
    return {
        shadowColor: nativeColor,
        shadowOpacity: nativeOpacity,
        shadowRadius: radius,
        shadowOffset: { width: offsetX, height: offsetY },
        ...(elevation !== undefined ? { elevation } : {}),
    };
};

const AnimatedPath$b = Animated$1.createAnimatedComponent(Path);
const DEG_TO_RAD = Math.PI / 180;
const EPSILON = 1e-6;
const DEFAULT_LABEL_THRESHOLD = 18;
const DEFAULT_LABEL_WRAP = 18;
const DEFAULT_LABEL_LINES = 2;
const LABEL_VERTICAL_SPACING = 16;
const clamp$5 = (value, min, max) => Math.max(min, Math.min(max, value));
const toRadians = (degrees) => degrees * DEG_TO_RAD;
const polarToCartesian$1 = (cx, cy, radius, angleDeg) => ({
    x: cx + radius * Math.cos(toRadians(angleDeg)),
    y: cy + radius * Math.sin(toRadians(angleDeg)),
});
const mergeSliceStyle = (base, override) => {
    var _a, _b;
    return ({
        ...base,
        ...override,
        gradient: (_a = override === null || override === void 0 ? void 0 : override.gradient) !== null && _a !== void 0 ? _a : base === null || base === void 0 ? void 0 : base.gradient,
        shadow: (_b = override === null || override === void 0 ? void 0 : override.shadow) !== null && _b !== void 0 ? _b : base === null || base === void 0 ? void 0 : base.shadow,
    });
};
const wrapLabelText = (text, maxChars, maxLines) => {
    if (!text)
        return [''];
    const words = text.split(/\s+/).filter(Boolean);
    if (!words.length)
        return [''];
    const lines = [];
    let current = '';
    words.forEach((word) => {
        const candidate = current.length ? `${current} ${word}` : word;
        if (candidate.length <= maxChars) {
            current = candidate;
        }
        else {
            if (current)
                lines.push(current);
            current = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word;
        }
    });
    if (current)
        lines.push(current);
    if (lines.length <= maxLines) {
        return lines;
    }
    const truncated = lines.slice(0, maxLines);
    const last = truncated[maxLines - 1];
    truncated[maxLines - 1] = last.length >= maxChars
        ? `${last.slice(0, Math.max(0, maxChars - 1))}…`
        : `${last}…`;
    return truncated;
};
const createSlicePath = ({ centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, cornerRadius = 0, }) => {
    const angleDelta = endAngle - startAngle;
    if (!(outerRadius > EPSILON) || !(Math.abs(angleDelta) > EPSILON)) {
        return '';
    }
    const sweepFlag = angleDelta > 180 ? 1 : 0;
    const outerCorner = cornerRadius > 0
        ? Math.min(cornerRadius, outerRadius * Math.abs(angleDelta) * DEG_TO_RAD)
        : 0;
    const innerCorner = innerRadius > 0 && cornerRadius > 0
        ? Math.min(cornerRadius, innerRadius * Math.abs(angleDelta) * DEG_TO_RAD)
        : 0;
    const outerDeltaDeg = outerCorner > 0 ? (outerCorner / outerRadius) * (180 / Math.PI) : 0;
    const innerDeltaDeg = innerCorner > 0 ? (innerCorner / Math.max(innerRadius, EPSILON)) * (180 / Math.PI) : 0;
    const outerStart = startAngle + outerDeltaDeg;
    const outerEnd = endAngle - outerDeltaDeg;
    const innerStart = innerRadius > EPSILON ? startAngle + innerDeltaDeg : startAngle;
    const innerEnd = innerRadius > EPSILON ? endAngle - innerDeltaDeg : endAngle;
    const outerStartPoint = polarToCartesian$1(centerX, centerY, outerRadius, outerStart);
    const outerEndPoint = polarToCartesian$1(centerX, centerY, outerRadius, outerEnd);
    const path = [];
    path.push(`M ${outerStartPoint.x} ${outerStartPoint.y}`);
    path.push(`A ${outerRadius} ${outerRadius} 0 ${sweepFlag} 1 ${outerEndPoint.x} ${outerEndPoint.y}`);
    if (innerRadius > EPSILON) {
        const innerStartPoint = polarToCartesian$1(centerX, centerY, innerRadius, innerEnd);
        if (cornerRadius > 0) {
            path.push(`A ${cornerRadius} ${cornerRadius} 0 0 1 ${innerStartPoint.x} ${innerStartPoint.y}`);
        }
        else {
            const joinPoint = polarToCartesian$1(centerX, centerY, innerRadius, endAngle);
            path.push(`L ${joinPoint.x} ${joinPoint.y}`);
        }
        const innerEndPoint = polarToCartesian$1(centerX, centerY, innerRadius, innerStart);
        const innerSweepFlag = angleDelta > 180 ? 1 : 0;
        path.push(`A ${innerRadius} ${innerRadius} 0 ${innerSweepFlag} 0 ${innerEndPoint.x} ${innerEndPoint.y}`);
        if (cornerRadius > 0) {
            path.push(`A ${cornerRadius} ${cornerRadius} 0 0 1 ${outerStartPoint.x} ${outerStartPoint.y}`);
        }
        else {
            const linkPoint = polarToCartesian$1(centerX, centerY, outerRadius, startAngle);
            path.push(`L ${linkPoint.x} ${linkPoint.y}`);
        }
    }
    else {
        path.push(`L ${centerX} ${centerY}`);
    }
    path.push('Z');
    return path.join(' ');
};
const AnimatedPieSlice = React.memo((props) => {
    const { slice, centerX, centerY, animationProgress, animationType, animationDelay, animationStagger, totalSlices, disabled, dataSignature, fill, stroke, strokeWidth, strokeOpacity, baseFillOpacity, highlightOpacity, radiusOffset, filterId, accessibilityLabel, onPress, onHoverIn, onHoverOut, } = props;
    const scale = useSharedValue(1);
    const isWeb = Platform.OS === 'web';
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            return;
        }
        const type = animationType || 'drawOn';
        const delay = animationDelay + slice.index * Math.max(animationStagger, 0);
        const overshoot = type === 'bounce' ? 1.22 : 1.08;
        const damping = type === 'bounce' ? 8 : 12;
        const stiffness = type === 'bounce' ? 110 : 140;
        if (type === 'bounce' || type === 'wave') {
            scale.value = 0;
            scale.value = withDelay(delay, withSequence(withSpring(overshoot, { damping, stiffness }), withSpring(1, { damping: 16, stiffness: 200 })));
        }
        else {
            scale.value = 1;
        }
    }, [animationDelay, animationStagger, animationType, dataSignature, disabled, slice.index, scale]);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const type = animationType || 'drawOn';
        let visibilityProgress = 1;
        if (type === 'drawOn') {
            visibilityProgress = Math.max(0, Math.min(1, progress * totalSlices - slice.index));
        }
        else if (type === 'bounce' || type === 'wave') {
            visibilityProgress = Math.min(progress * 1.1, 1);
        }
        else {
            visibilityProgress = Math.max(0, Math.min(1, progress * 1.4 - slice.index * 0.12));
        }
        const scaleFactor = Math.max(scale.value, 0.05);
        const outerRadius = slice.outerRadius * scaleFactor + radiusOffset * highlightOpacity;
        const innerRadius = slice.innerRadius * scaleFactor;
        return {
            d: createSlicePath({
                centerX,
                centerY,
                innerRadius,
                outerRadius,
                startAngle: slice.startAngle,
                endAngle: slice.endAngle,
                cornerRadius: slice.style.cornerRadius,
            }),
            opacity: visibilityProgress * highlightOpacity,
            fillOpacity: baseFillOpacity * visibilityProgress * highlightOpacity,
        };
    }, [
        slice,
        centerX,
        centerY,
        animationType,
        highlightOpacity,
        baseFillOpacity,
        radiusOffset,
    ]);
    const attachWebHandlers = isWeb
        ? {
            onMouseEnter: () => {
                if (disabled)
                    return;
                onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn();
            },
            onMouseLeave: () => {
                if (disabled)
                    return;
                onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut();
            },
            onPointerDown: (event) => {
                var _a, _b;
                if (disabled)
                    return;
                (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
            },
            onPointerUp: (event) => {
                var _a, _b, _c, _d, _e, _f;
                if (disabled)
                    return;
                (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut();
                onPress === null || onPress === void 0 ? void 0 : onPress({
                    nativeEvent: {
                        locationX: (_d = (_c = event.nativeEvent) === null || _c === void 0 ? void 0 : _c.locationX) !== null && _d !== void 0 ? _d : event.offsetX,
                        locationY: (_f = (_e = event.nativeEvent) === null || _e === void 0 ? void 0 : _e.locationY) !== null && _f !== void 0 ? _f : event.offsetY,
                        pageX: event.pageX,
                        pageY: event.pageY,
                    },
                });
            },
            onPointerCancel: (event) => {
                var _a, _b;
                (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut();
            },
        }
        : {
            onPress,
            onPressIn: () => {
                if (!disabled)
                    onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn();
            },
            onPressOut: () => {
                if (!disabled)
                    onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut();
            },
        };
    return (jsx(AnimatedPath$b, { animatedProps: animatedProps, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeOpacity: strokeOpacity, filter: filterId ? `url(#${filterId})` : undefined, ...(isWeb
            ? { 'aria-label': accessibilityLabel }
            : { accessible: true, accessibilityLabel }), ...attachWebHandlers }));
});
AnimatedPieSlice.displayName = 'AnimatedPieSlice';
const LeaderLine = React.memo(({ path, color, width }) => (jsx(Path, { d: path, stroke: color, strokeWidth: width, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", pointerEvents: "none" })));
const computeLayerSlices = (layer, layerIndex, palette, hiddenKeys, defaultSliceStyle) => {
    const totalAngle = Math.max(layer.endAngle - layer.startAngle, 0);
    const mapped = layer.data.map((datum, index) => {
        var _a;
        const key = String((_a = datum.id) !== null && _a !== void 0 ? _a : `${layer.id}-${index}`);
        const value = Math.max(0, datum.value);
        const style = mergeSliceStyle(defaultSliceStyle, datum.style);
        const color = datum.color || getColorFromScheme(index, palette);
        const visible = !hiddenKeys.has(key) && value > 0;
        return {
            datum,
            index,
            key,
            value,
            style,
            color,
            visible,
        };
    });
    const total = mapped.reduce((sum, slice) => (slice.visible ? sum + slice.value : sum), 0);
    const activeSlices = mapped.filter((slice) => slice.visible && slice.value > 0);
    const gapCount = activeSlices.length > 1 ? activeSlices.length : 0;
    let resolvedPadAngle = gapCount > 0 ? Math.max(layer.padAngle, 0) : 0;
    let totalPad = resolvedPadAngle * gapCount;
    if (gapCount > 0) {
        const padBudget = Math.max(totalAngle - EPSILON, 0);
        if (totalPad > padBudget) {
            resolvedPadAngle = padBudget / gapCount;
            totalPad = resolvedPadAngle * gapCount;
        }
    }
    const sweepAvailable = Math.max(totalAngle - totalPad, 0);
    let currentAngle = layer.startAngle;
    const slices = mapped.map((slice) => {
        const ratio = total > 0 && slice.visible ? slice.value / total : 0;
        let sliceStart = currentAngle;
        let sliceEnd = currentAngle;
        if (slice.visible && ratio > 0 && sweepAvailable > 0) {
            const sweep = sweepAvailable * ratio;
            sliceStart = currentAngle;
            sliceEnd = sliceStart + sweep;
            currentAngle = sliceEnd + resolvedPadAngle;
        }
        const centerAngle = sliceStart + (sliceEnd - sliceStart) / 2;
        return {
            key: slice.key,
            raw: slice.datum,
            index: slice.index,
            value: slice.value,
            label: slice.datum.label,
            color: slice.color,
            style: slice.style,
            startAngle: sliceStart,
            endAngle: sliceEnd,
            centerAngle,
            valueRatio: total > 0 ? slice.value / total : 0,
            innerRadius: layer.innerRadius,
            outerRadius: layer.outerRadius,
            layerId: layer.id,
            layerIndex,
            visible: slice.visible,
            gradientId: slice.style.gradient ? `pie-gradient-${layerIndex}-${slice.index}` : undefined,
            shadowId: slice.style.shadow ? `pie-shadow-${layerIndex}-${slice.index}` : undefined,
        };
    });
    return {
        id: layer.id,
        layerIndex,
        slices,
        total,
        startAngle: layer.startAngle,
        endAngle: layer.endAngle,
        innerRadius: layer.innerRadius,
        outerRadius: layer.outerRadius,
        padAngle: resolvedPadAngle,
    };
};
const computeLabelLayouts = (slices, options) => {
    const { centerX, centerY, outerRadius, defaultPosition, strategy, showValues, totalValue, valueFormatter, labelFormatter, wrap, maxChars, maxLines, leaderLineColor, leaderLineWidth, showLeaderLines, autoSwitchAngle, innerRadius, } = options;
    const labels = [];
    const left = [];
    const right = [];
    slices.forEach((slice) => {
        if (!slice.visible || slice.value <= 0)
            return;
        const angle = slice.endAngle - slice.startAngle;
        let position = defaultPosition;
        if (strategy === 'auto') {
            if (angle < autoSwitchAngle || slice.valueRatio < 0.05)
                position = 'outside';
            else if (innerRadius <= EPSILON)
                position = 'center';
            else
                position = 'inside';
        }
        else {
            position = strategy;
        }
        const baseLabel = labelFormatter ? labelFormatter(slice.raw) : slice.label;
        const formattedValue = valueFormatter ? valueFormatter(slice.value, totalValue) : formatPercentage(slice.value, totalValue);
        const displayText = showValues
            ? (labelFormatter ? `${baseLabel} ${formattedValue}` : `${slice.label} ${formattedValue}`)
            : baseLabel;
        const lines = wrap ? wrapLabelText(displayText, maxChars, maxLines) : [displayText];
        if (position === 'inside' || position === 'center') {
            const labelRadius = position === 'center'
                ? (innerRadius + outerRadius) / 2.2
                : (slice.innerRadius + slice.outerRadius) / 2;
            const point = getPointOnCircle$1(centerX, centerY, labelRadius, slice.centerAngle);
            labels.push({
                key: slice.key,
                lines,
                x: point.x,
                y: point.y,
                anchor: 'middle',
                isOutside: false,
            });
            return;
        }
        const isRight = Math.cos(toRadians(slice.centerAngle)) >= 0;
        const elbow = getPointOnCircle$1(centerX, centerY, slice.outerRadius + 6, slice.centerAngle);
        const targetX = centerX + (isRight ? outerRadius + 36 : -(outerRadius + 36));
        const candidate = {
            key: slice.key,
            lines,
            side: isRight ? 'right' : 'left',
            anchor: isRight ? 'start' : 'end',
            elbow,
            x: targetX,
            y: elbow.y,
            slice,
        };
        (isRight ? right : left).push(candidate);
    });
    const adjustGroup = (group) => {
        if (!group.length)
            return;
        group.sort((a, b) => a.y - b.y);
        const minY = centerY - (outerRadius + 36);
        const maxY = centerY + (outerRadius + 36);
        group[0].y = clamp$5(group[0].y, minY, maxY);
        for (let i = 1; i < group.length; i += 1) {
            group[i].y = Math.max(group[i].y, group[i - 1].y + LABEL_VERTICAL_SPACING);
        }
        let overflow = group[group.length - 1].y - maxY;
        for (let i = group.length - 1; overflow > 0 && i >= 0; i -= 1) {
            const prev = i === 0 ? minY : group[i - 1].y + LABEL_VERTICAL_SPACING;
            const delta = Math.min(overflow, group[i].y - prev);
            group[i].y -= delta;
            overflow -= delta;
        }
    };
    adjustGroup(left);
    adjustGroup(right);
    const appendGroup = (group) => {
        group.forEach((candidate) => {
            const elbowTargetX = centerX + (candidate.side === 'right' ? candidate.slice.outerRadius + 8 : -(candidate.slice.outerRadius + 8));
            const leaderPath = `M ${candidate.elbow.x} ${candidate.elbow.y} L ${elbowTargetX} ${candidate.y} L ${candidate.x} ${candidate.y}`;
            labels.push({
                key: candidate.key,
                lines: candidate.lines,
                x: candidate.x,
                y: candidate.y,
                anchor: candidate.anchor,
                isOutside: true,
                leaderLine: showLeaderLines
                    ? {
                        path: leaderPath,
                        color: leaderLineColor,
                        width: leaderLineWidth,
                    }
                    : undefined,
            });
        });
    };
    appendGroup(right);
    appendGroup(left);
    return labels;
};
const PieChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const { data, width = 320, height = 320, innerRadius = 0, outerRadius, startAngle = 0, endAngle = 360, padAngle = 0, showLabels = true, labelPosition = 'outside', labelStrategy = 'auto', labelAutoSwitchAngle = DEFAULT_LABEL_THRESHOLD, wrapLabels = true, labelMaxCharsPerLine = DEFAULT_LABEL_WRAP, labelMaxLines = DEFAULT_LABEL_LINES, showLeaderLines = true, leaderLineColor, leaderLineWidth = 1.4, labelTextStyle, labelFormatter, showValues = false, valueFormatter, legend, tooltip, animation, onPress, onDataPointPress, onSliceHover, disabled = false, animationDuration = 900, style, highlightOnHover = true, defaultSliceStyle, layers = [], legendToggleEnabled = true, keyboardNavigation = true, ariaLabelFormatter, ...rest } = props;
    const theme = useChartTheme();
    let interactionContext = null;
    try {
        interactionContext = useChartInteractionContext();
    }
    catch (_t) {
        // component can work without interaction provider
    }
    const registerSeries = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.registerSeries;
    const setPointer = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.setPointer;
    const pointer = (_a = interactionContext === null || interactionContext === void 0 ? void 0 : interactionContext.pointer) !== null && _a !== void 0 ? _a : null;
    const [hiddenKeys, setHiddenKeys] = useState(new Set());
    const [hoveredKey, setHoveredKey] = useState(null);
    const [hoveredSlice, setHoveredSlice] = useState(null);
    useEffect(() => {
        if (disabled) {
            setHoveredKey(null);
            setHoveredSlice(null);
        }
    }, [disabled]);
    const resolvedLabelColor = (_b = labelTextStyle === null || labelTextStyle === void 0 ? void 0 : labelTextStyle.color) !== null && _b !== void 0 ? _b : theme.colors.textPrimary;
    const labelFontSize = (_c = labelTextStyle === null || labelTextStyle === void 0 ? void 0 : labelTextStyle.fontSize) !== null && _c !== void 0 ? _c : 12;
    const labelFontWeight = (_d = labelTextStyle === null || labelTextStyle === void 0 ? void 0 : labelTextStyle.fontWeight) !== null && _d !== void 0 ? _d : '400';
    const labelFontFamily = (_e = labelTextStyle === null || labelTextStyle === void 0 ? void 0 : labelTextStyle.fontFamily) !== null && _e !== void 0 ? _e : theme.fontFamily;
    const labelLineHeight = (_f = labelTextStyle === null || labelTextStyle === void 0 ? void 0 : labelTextStyle.lineHeight) !== null && _f !== void 0 ? _f : Math.max(14, labelFontSize + 2);
    const normalisedData = useMemo(() => data.map((slice, index) => {
        var _a, _b, _c;
        return ({
            ...slice,
            id: (_a = slice.id) !== null && _a !== void 0 ? _a : index,
            label: (_b = slice.label) !== null && _b !== void 0 ? _b : `${(_c = slice.id) !== null && _c !== void 0 ? _c : index}`,
        });
    }), [data]);
    const visibleData = useMemo(() => normalisedData.filter((slice) => !hiddenKeys.has(String(slice.id)) && slice.value > 0), [normalisedData, hiddenKeys]);
    const effectiveOuterRadius = outerRadius !== null && outerRadius !== void 0 ? outerRadius : Math.min(width, height) / 2 - 36;
    const effectiveInnerRadius = innerRadius;
    const palette = (_g = theme.colors.accentPalette) !== null && _g !== void 0 ? _g : colorSchemes.default;
    const layoutLayers = useMemo(() => {
        const baseLayer = computeLayerSlices({
            id: 'base',
            data: visibleData,
            innerRadius: effectiveInnerRadius,
            outerRadius: effectiveOuterRadius,
            startAngle,
            endAngle,
            padAngle,
        }, 0, palette, hiddenKeys, defaultSliceStyle);
        const overlayLayers = layers.map((layer, index) => {
            var _a, _b, _c, _d;
            return computeLayerSlices({
                id: (_a = layer.id) !== null && _a !== void 0 ? _a : `overlay-${index}`,
                data: layer.data,
                innerRadius: layer.innerRadius,
                outerRadius: layer.outerRadius,
                startAngle: (_b = layer.startAngle) !== null && _b !== void 0 ? _b : startAngle,
                endAngle: (_c = layer.endAngle) !== null && _c !== void 0 ? _c : endAngle,
                padAngle: (_d = layer.padAngle) !== null && _d !== void 0 ? _d : padAngle,
            }, index + 1, palette, hiddenKeys, defaultSliceStyle);
        });
        return [baseLayer, ...overlayLayers];
    }, [
        visibleData,
        layers,
        effectiveInnerRadius,
        effectiveOuterRadius,
        startAngle,
        endAngle,
        padAngle,
        palette,
        hiddenKeys,
        defaultSliceStyle,
    ]);
    useEffect(() => {
        if (!hoveredSlice)
            return;
        const stillVisible = layoutLayers.some((layer) => layer.slices.some((slice) => slice.key === hoveredSlice.key && slice.visible));
        if (!stillVisible) {
            setHoveredSlice(null);
            setHoveredKey(null);
        }
    }, [layoutLayers, hoveredSlice]);
    const baseLayer = layoutLayers[0];
    const totalValue = (_h = baseLayer === null || baseLayer === void 0 ? void 0 : baseLayer.total) !== null && _h !== void 0 ? _h : 0;
    const gradients = useMemo(() => {
        const defs = [];
        layoutLayers.forEach((layer) => {
            layer.slices.forEach((slice) => {
                if (slice.visible && slice.gradientId && slice.style.gradient) {
                    defs.push({ id: slice.gradientId, gradient: slice.style.gradient });
                }
            });
        });
        return defs;
    }, [layoutLayers]);
    const shadows = useMemo(() => {
        const defs = [];
        layoutLayers.forEach((layer) => {
            layer.slices.forEach((slice) => {
                if (slice.visible && slice.shadowId && slice.style.shadow) {
                    defs.push({ id: slice.shadowId, shadow: slice.style.shadow });
                }
            });
        });
        return defs;
    }, [layoutLayers]);
    const labelLayouts = useMemo(() => {
        if (!showLabels || !baseLayer)
            return [];
        return computeLabelLayouts(baseLayer.slices, {
            centerX: width / 2,
            centerY: height / 2,
            outerRadius: effectiveOuterRadius,
            defaultPosition: labelPosition,
            strategy: labelStrategy,
            showValues,
            totalValue,
            valueFormatter,
            labelFormatter,
            wrap: wrapLabels,
            maxChars: labelMaxCharsPerLine,
            maxLines: labelMaxLines,
            leaderLineColor: leaderLineColor !== null && leaderLineColor !== void 0 ? leaderLineColor : theme.colors.textSecondary,
            leaderLineWidth,
            showLeaderLines,
            autoSwitchAngle: labelAutoSwitchAngle,
            innerRadius: effectiveInnerRadius,
        });
    }, [
        showLabels,
        baseLayer,
        width,
        height,
        effectiveOuterRadius,
        labelPosition,
        labelStrategy,
        showValues,
        totalValue,
        valueFormatter,
        labelFormatter,
        wrapLabels,
        labelMaxCharsPerLine,
        labelMaxLines,
        leaderLineColor,
        leaderLineWidth,
        showLeaderLines,
        labelAutoSwitchAngle,
        theme.colors.textSecondary,
        effectiveInnerRadius,
    ]);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: Math.max(animationProgress.value, 0.04) }],
        opacity: Math.min(animationProgress.value * 1.4, 1),
    }));
    const animationDelay = (_j = animation === null || animation === void 0 ? void 0 : animation.delay) !== null && _j !== void 0 ? _j : 0;
    const animationStagger = (_k = animation === null || animation === void 0 ? void 0 : animation.stagger) !== null && _k !== void 0 ? _k : 120;
    const animationType = animation === null || animation === void 0 ? void 0 : animation.type;
    const resolvedDuration = (_l = animation === null || animation === void 0 ? void 0 : animation.duration) !== null && _l !== void 0 ? _l : animationDuration;
    const dataSignature = useMemo(() => JSON.stringify({
        data: visibleData.map((slice) => ({ id: slice.id, value: slice.value })),
        hidden: Array.from(hiddenKeys),
    }), [visibleData, hiddenKeys]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withDelay(animationDelay, withTiming(1, {
            duration: Math.max(resolvedDuration, 260),
            easing: Easing.out(Easing.cubic),
        }));
    }, [animationProgress, animationDelay, resolvedDuration, disabled, dataSignature]);
    const highlightEnabled = highlightOnHover !== false;
    const computeSliceAnchor = useCallback((slice, radius) => {
        const targetRadius = radius !== null && radius !== void 0 ? radius : (slice.innerRadius + slice.outerRadius) / 2;
        return getPointOnCircle$1(width / 2, height / 2, Math.max(targetRadius, 0), slice.centerAngle);
    }, [width, height]);
    const announceSlice = useCallback((slice) => {
        var _a;
        if (!slice)
            return;
        const message = ariaLabelFormatter
            ? ariaLabelFormatter(slice.raw, slice.valueRatio)
            : `${slice.label}: ${formatPercentage(slice.value, totalValue)}`;
        try {
            (_a = AccessibilityInfo.announceForAccessibility) === null || _a === void 0 ? void 0 : _a.call(AccessibilityInfo, message);
        }
        catch (_b) {
            // ignore environments without accessibility announcer
        }
    }, [ariaLabelFormatter, totalValue]);
    const resolveHighlight = useCallback((slice) => {
        if (!highlightEnabled || !hoveredKey) {
            return { opacity: 1, radiusOffset: 0 };
        }
        const isActive = hoveredKey === slice.key;
        return {
            opacity: isActive ? 1 : 0.35,
            radiusOffset: isActive ? 8 : 0,
        };
    }, [highlightEnabled, hoveredKey]);
    const handleSlicePress = useCallback((slice, event) => {
        var _a, _b, _c, _d;
        if (disabled)
            return;
        const nativeEvent = (_b = (_a = event === null || event === void 0 ? void 0 : event.nativeEvent) !== null && _a !== void 0 ? _a : event) !== null && _b !== void 0 ? _b : {};
        const interactionEvent = {
            nativeEvent,
            chartX: ((_c = nativeEvent.locationX) !== null && _c !== void 0 ? _c : 0) / width,
            chartY: ((_d = nativeEvent.locationY) !== null && _d !== void 0 ? _d : 0) / height,
            dataPoint: slice.raw,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(slice.raw, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    }, [disabled, onDataPointPress, onPress, width, height]);
    const handleHover = useCallback((slice) => {
        var _a;
        const key = (_a = slice === null || slice === void 0 ? void 0 : slice.key) !== null && _a !== void 0 ? _a : null;
        setHoveredKey(key);
        setHoveredSlice(slice);
        onSliceHover === null || onSliceHover === void 0 ? void 0 : onSliceHover(slice ? slice.raw : null);
    }, [onSliceHover]);
    const handleLegendPress = useCallback((_item, index) => {
        if (!legendToggleEnabled)
            return;
        const slice = normalisedData[index];
        if (!slice)
            return;
        const key = String(slice.id);
        setHiddenKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key))
                next.delete(key);
            else
                next.add(key);
            return next;
        });
        if (hoveredKey === key) {
            handleHover(null);
        }
    }, [legendToggleEnabled, normalisedData, hoveredKey, handleHover]);
    useEffect(() => {
        var _a, _b, _c;
        if (!registerSeries || !baseLayer)
            return;
        registerSeries({
            id: 'pie-base',
            name: 'Pie',
            color: (_b = (_a = baseLayer.slices[0]) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : (_c = theme.colors.accentPalette) === null || _c === void 0 ? void 0 : _c[0],
            points: baseLayer.slices.map((slice) => ({
                x: slice.index,
                y: slice.value,
                meta: {
                    id: slice.key,
                    label: slice.label,
                    ratio: slice.valueRatio,
                    layer: slice.layerId,
                },
            })),
            visible: true,
        });
    }, [registerSeries, baseLayer, theme.colors.accentPalette]);
    const focusableKeys = useMemo(() => (baseLayer ? baseLayer.slices.filter((slice) => slice.visible).map((slice) => slice.key) : []), [baseLayer]);
    const focusIndexRef = useRef(-1);
    const handleKeyDown = useCallback((event) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!keyboardNavigation || focusableKeys.length === 0)
            return;
        const key = (_b = (_a = event === null || event === void 0 ? void 0 : event.nativeEvent) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : event === null || event === void 0 ? void 0 : event.key;
        if (!key)
            return;
        const length = focusableKeys.length;
        const focusSliceAt = (nextIndex) => {
            var _a;
            focusIndexRef.current = nextIndex;
            const sliceKey = focusableKeys[nextIndex];
            const slice = (_a = baseLayer === null || baseLayer === void 0 ? void 0 : baseLayer.slices.find((item) => item.key === sliceKey)) !== null && _a !== void 0 ? _a : null;
            if (slice) {
                handleHover(slice);
                const anchor = computeSliceAnchor(slice, slice.outerRadius + 12);
                setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: anchor.x, y: anchor.y, inside: true });
                announceSlice(slice);
            }
        };
        if (key === 'ArrowRight' || key === 'ArrowDown') {
            (_c = event.preventDefault) === null || _c === void 0 ? void 0 : _c.call(event);
            const nextIndex = (focusIndexRef.current + 1 + length) % length;
            focusSliceAt(nextIndex);
        }
        else if (key === 'ArrowLeft' || key === 'ArrowUp') {
            (_d = event.preventDefault) === null || _d === void 0 ? void 0 : _d.call(event);
            const nextIndex = (focusIndexRef.current - 1 + length) % length;
            focusSliceAt(nextIndex);
        }
        else if (key === 'Home') {
            (_e = event.preventDefault) === null || _e === void 0 ? void 0 : _e.call(event);
            focusSliceAt(0);
        }
        else if (key === 'End') {
            (_f = event.preventDefault) === null || _f === void 0 ? void 0 : _f.call(event);
            focusSliceAt(length - 1);
        }
        else if (key === 'Enter' || key === ' ') {
            (_g = event.preventDefault) === null || _g === void 0 ? void 0 : _g.call(event);
            const targetKey = focusableKeys[focusIndexRef.current >= 0 ? focusIndexRef.current : 0];
            const slice = baseLayer === null || baseLayer === void 0 ? void 0 : baseLayer.slices.find((item) => item.key === targetKey);
            if (slice)
                handleSlicePress(slice, event);
        }
    }, [
        keyboardNavigation,
        focusableKeys,
        baseLayer,
        handleHover,
        handleSlicePress,
        computeSliceAnchor,
        setPointer,
        announceSlice,
    ]);
    const legendItems = useMemo(() => {
        if ((legend === null || legend === void 0 ? void 0 : legend.items) && legend.items.length > 0) {
            return legend.items;
        }
        return normalisedData.map((slice) => ({
            label: slice.label,
            color: slice.color || palette[slice.id
                ? Math.abs(typeof slice.id === 'number' ? slice.id : slice.id.toString().length) % palette.length
                : 0],
            visible: !hiddenKeys.has(String(slice.id)),
        }));
    }, [legend, normalisedData, palette, hiddenKeys]);
    const tooltipEnabled = (tooltip === null || tooltip === void 0 ? void 0 : tooltip.show) !== false;
    const tooltipBackground = (_m = tooltip === null || tooltip === void 0 ? void 0 : tooltip.backgroundColor) !== null && _m !== void 0 ? _m : theme.colors.background;
    const tooltipTextColor = (_o = tooltip === null || tooltip === void 0 ? void 0 : tooltip.textColor) !== null && _o !== void 0 ? _o : theme.colors.textPrimary;
    const tooltipFontSize = (_p = tooltip === null || tooltip === void 0 ? void 0 : tooltip.fontSize) !== null && _p !== void 0 ? _p : 12;
    const tooltipPadding = (_q = tooltip === null || tooltip === void 0 ? void 0 : tooltip.padding) !== null && _q !== void 0 ? _q : 8;
    const tooltipBorderRadius = (_r = tooltip === null || tooltip === void 0 ? void 0 : tooltip.borderRadius) !== null && _r !== void 0 ? _r : 6;
    const tooltipInfo = useMemo(() => {
        var _a, _b, _c, _d;
        if (!tooltipEnabled || !hoveredSlice)
            return null;
        const pointerCoords = pointer && pointer.inside ? { x: pointer.x, y: pointer.y } : null;
        const fallbackAnchor = computeSliceAnchor(hoveredSlice, hoveredSlice.outerRadius + 16);
        const anchor = pointerCoords !== null && pointerCoords !== void 0 ? pointerCoords : fallbackAnchor;
        const safeTop = clamp$5(anchor.y - 32, 8, height - 48);
        const anchorOnRight = anchor.x >= width / 2;
        const position = { top: safeTop };
        if (anchorOnRight) {
            position.left = clamp$5(anchor.x + 12, 8, width - 8);
        }
        else {
            position.right = clamp$5(width - anchor.x + 12, 8, width - 8);
        }
        const percentage = formatPercentage(hoveredSlice.value, totalValue);
        const formatterResult = (_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) === null || _a === void 0 ? void 0 : _a.call(tooltip, hoveredSlice.raw);
        const defaultLabel = `${hoveredSlice.label}: ${(_d = (_c = (_b = hoveredSlice.raw.value).toLocaleString) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : hoveredSlice.raw.value} (${percentage})`;
        return {
            position,
            alignment: (anchorOnRight ? 'flex-start' : 'flex-end'),
            content: formatterResult !== null && formatterResult !== void 0 ? formatterResult : defaultLabel,
        };
    }, [
        tooltipEnabled,
        hoveredSlice,
        pointer,
        computeSliceAnchor,
        tooltip,
        width,
        height,
        totalValue,
    ]);
    const handlePointerMove = useCallback((event) => {
        var _a, _b;
        if (!setPointer)
            return;
        const rect = (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!rect)
            return;
        const pointer = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            inside: true,
            pageX: event.pageX,
            pageY: event.pageY,
        };
        setPointer(pointer);
    }, [setPointer]);
    const handlePointerLeave = useCallback(() => {
        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: 0, y: 0, inside: false });
        handleHover(null);
    }, [setPointer, handleHover]);
    return (jsxs(ChartContainer, { width: width, height: height, disabled: disabled, animationDuration: animationDuration, style: style, ...rest, children: [(props.title || props.subtitle) && (jsx(ChartTitle, { title: props.title, subtitle: props.subtitle })), jsx(Animated$1.View, { style: [{ position: 'absolute', left: 0, top: 0 }, containerAnimatedStyle], children: jsxs(Svg, { width: width, height: height, 
                    // @ts-ignore web-only events
                    onMouseMove: handlePointerMove, 
                    // @ts-ignore web-only events
                    onMouseLeave: handlePointerLeave, children: [jsxs(Defs, { children: [gradients.map(({ id, gradient }) => {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                                    if (gradient.type === 'radial') {
                                        return (jsx(RadialGradient, { id: id, cx: ((_b = (_a = gradient.from) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0.5).toString(), cy: ((_d = (_c = gradient.from) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0.5).toString(), rx: ((_f = (_e = gradient.to) === null || _e === void 0 ? void 0 : _e.x) !== null && _f !== void 0 ? _f : 0.5).toString(), ry: ((_h = (_g = gradient.to) === null || _g === void 0 ? void 0 : _g.y) !== null && _h !== void 0 ? _h : 0.5).toString(), children: gradient.stops.map((stop, index) => {
                                                var _a;
                                                return (jsx(Stop, { offset: stop.offset, stopColor: stop.color, stopOpacity: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }, `${id}-stop-${index}`));
                                            }) }, id));
                                    }
                                    return (jsx(LinearGradient, { id: id, x1: ((_k = (_j = gradient.from) === null || _j === void 0 ? void 0 : _j.x) !== null && _k !== void 0 ? _k : 0).toString(), y1: ((_m = (_l = gradient.from) === null || _l === void 0 ? void 0 : _l.y) !== null && _m !== void 0 ? _m : 0).toString(), x2: ((_p = (_o = gradient.to) === null || _o === void 0 ? void 0 : _o.x) !== null && _p !== void 0 ? _p : 1).toString(), y2: ((_r = (_q = gradient.to) === null || _q === void 0 ? void 0 : _q.y) !== null && _r !== void 0 ? _r : 1).toString(), children: gradient.stops.map((stop, index) => {
                                            var _a;
                                            return (jsx(Stop, { offset: stop.offset, stopColor: stop.color, stopOpacity: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }, `${id}-stop-${index}`));
                                        }) }, id));
                                }), shadows.map(({ id, shadow }) => {
                                    var _a, _b, _c, _d, _e;
                                    return (jsxs(Filter, { id: id, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [jsx(FeGaussianBlur, { in: "SourceAlpha", stdDeviation: (_a = shadow.blur) !== null && _a !== void 0 ? _a : 4, result: "blur" }), jsx(FeOffset, { in: "blur", dx: (_b = shadow.dx) !== null && _b !== void 0 ? _b : 0, dy: (_c = shadow.dy) !== null && _c !== void 0 ? _c : 4, result: "offsetBlur" }), jsx(FeFlood, { floodColor: (_d = shadow.color) !== null && _d !== void 0 ? _d : '#000', floodOpacity: (_e = shadow.opacity) !== null && _e !== void 0 ? _e : 0.35, result: "color" }), jsx(FeComposite, { in: "color", in2: "offsetBlur", operator: "in", result: "shadow" }), jsxs(FeMerge, { children: [jsx(FeMergeNode, { in: "shadow" }), jsx(FeMergeNode, { in: "SourceGraphic" })] })] }, id));
                                })] }), jsx(G, { children: layoutLayers.map((layer) => layer.slices.map((slice) => {
                                var _a, _b, _c, _d;
                                if (!slice.visible || slice.valueRatio <= 0 || slice.startAngle === slice.endAngle) {
                                    return null;
                                }
                                const highlight = resolveHighlight(slice);
                                const fill = slice.gradientId ? `url(#${slice.gradientId})` : slice.color;
                                const stroke = (_a = slice.style.strokeColor) !== null && _a !== void 0 ? _a : theme.colors.background;
                                const strokeWidth = (_b = slice.style.strokeWidth) !== null && _b !== void 0 ? _b : (slice.style.cornerRadius ? 1 : 0.5);
                                const strokeOpacity = (_c = slice.style.strokeOpacity) !== null && _c !== void 0 ? _c : 1;
                                const baseFillOpacity = (_d = slice.style.fillOpacity) !== null && _d !== void 0 ? _d : 1;
                                const accessibilityLabel = ariaLabelFormatter
                                    ? ariaLabelFormatter(slice.raw, slice.valueRatio)
                                    : `${slice.label}: ${formatPercentage(slice.value, totalValue)}`;
                                return (jsx(AnimatedPieSlice, { slice: slice, centerX: width / 2, centerY: height / 2, animationProgress: animationProgress, animationType: animationType, animationDelay: animationDelay, animationStagger: animationStagger, totalSlices: layer.slices.length, disabled: disabled, dataSignature: dataSignature, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeOpacity: strokeOpacity, baseFillOpacity: baseFillOpacity, highlightOpacity: highlight.opacity, radiusOffset: highlight.radiusOffset, filterId: slice.shadowId, accessibilityLabel: accessibilityLabel, onPress: (event) => handleSlicePress(slice, event), onHoverIn: () => handleHover(slice), onHoverOut: () => handleHover(null) }, `${layer.id}-${slice.key}`));
                            })) }), showLabels && labelLayouts.length > 0 && (jsx(G, { pointerEvents: "none", children: labelLayouts.map((label) => (jsxs(React.Fragment, { children: [label.leaderLine && (jsx(LeaderLine, { path: label.leaderLine.path, color: label.leaderLine.color, width: label.leaderLine.width })), jsx(Text$1, { x: label.x, y: label.y, fill: resolvedLabelColor, fontSize: labelFontSize, fontWeight: labelFontWeight, fontFamily: labelFontFamily, textAnchor: label.anchor === 'start'
                                            ? 'start'
                                            : label.anchor === 'end'
                                                ? 'end'
                                                : 'middle', alignmentBaseline: "middle", children: label.lines.map((line, index) => (jsx(TSpan, { x: label.x, dy: index === 0 ? 0 : labelLineHeight, children: line }, `${label.key}-line-${index}`))) })] }, `label-${label.key}`))) }))] }) }), tooltipEnabled && tooltipInfo && (jsx(View, { pointerEvents: "none", style: {
                    position: 'absolute',
                    backgroundColor: tooltipBackground,
                    padding: tooltipPadding,
                    borderRadius: tooltipBorderRadius,
                    maxWidth: 220,
                    alignItems: tooltipInfo.alignment,
                    ...platformShadow({ color: '#000', opacity: 0.12, offsetY: 2, radius: 6, elevation: 2 }),
                    ...tooltipInfo.position,
                }, children: typeof tooltipInfo.content === 'string' || typeof tooltipInfo.content === 'number' ? (jsx(Text, { style: {
                        color: tooltipTextColor,
                        fontSize: tooltipFontSize,
                        fontFamily: theme.fontFamily,
                    }, children: tooltipInfo.content })) : (tooltipInfo.content) })), (legend === null || legend === void 0 ? void 0 : legend.show) && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: legendToggleEnabled ? handleLegendPress : undefined })), keyboardNavigation && (jsx(View, { style: { position: 'absolute', inset: 0 }, focusable: true, 
                // @ts-ignore RN web exposes key handlers for View but types omit them
                onKeyDown: handleKeyDown, pointerEvents: "box-none", accessible: true, accessibilityLabel: (_s = props.title) !== null && _s !== void 0 ? _s : 'Pie chart' }))] }));
};
PieChart.displayName = 'PieChart';

/**
 * Spatial indexing for efficient nearest neighbor searches
 * Uses a simple grid-based approach for O(1) average lookup
 */
class SpatialIndex {
    /**
     * Creates a new spatial index
     * @param data - Array of data points to index
     * @param gridSize - Size of grid cells (default 20)
     */
    constructor(data, gridSize = 20) {
        this.grid = new Map();
        this.gridSize = gridSize;
        this.bounds = this.calculateBounds(data);
        this.buildIndex(data);
    }
    calculateBounds(data) {
        if (data.length === 0) {
            return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
        }
        return data.reduce((bounds, point) => ({
            minX: Math.min(bounds.minX, point.x),
            maxX: Math.max(bounds.maxX, point.x),
            minY: Math.min(bounds.minY, point.y),
            maxY: Math.max(bounds.maxY, point.y),
        }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    }
    getGridKey(x, y) {
        const gridX = Math.floor((x - this.bounds.minX) / this.gridSize);
        const gridY = Math.floor((y - this.bounds.minY) / this.gridSize);
        return `${gridX},${gridY}`;
    }
    buildIndex(data) {
        data.forEach(point => {
            const key = this.getGridKey(point.x, point.y);
            if (!this.grid.has(key)) {
                this.grid.set(key, []);
            }
            this.grid.get(key).push(point);
        });
    }
    /**
     * Find closest point within maxDistance
     * O(1) average case vs O(n) linear search
     */
    findClosest(x, y, maxDistance = 20) {
        const gridX = Math.floor((x - this.bounds.minX) / this.gridSize);
        const gridY = Math.floor((y - this.bounds.minY) / this.gridSize);
        let closestPoint = null;
        let closestDistance = Infinity;
        // Check current and neighboring grid cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${gridX + dx},${gridY + dy}`;
                const points = this.grid.get(key);
                if (points) {
                    for (const point of points) {
                        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
                        if (distance < closestDistance && distance <= maxDistance) {
                            closestDistance = distance;
                            closestPoint = point;
                        }
                    }
                }
            }
        }
        return closestPoint ? { dataPoint: closestPoint, distance: closestDistance } : null;
    }
}

/**
 * Shared nearest-point finder for cartesian charts.
 * Given pixel chart coordinates (relative to plot origin) returns closest data point across visible series.
 * @param series - Array of series to search
 * @param xDomain - X-axis domain range
 * @param yDomain - Y-axis domain range
 * @param plotWidth - Plot area width in pixels
 * @param plotHeight - Plot area height in pixels
 * @returns Function that finds the nearest point to given coordinates
 */
const useNearestPoint = (series, xDomain, yDomain, plotWidth, plotHeight) => {
    // Build spatial indices for large series
    const indices = useMemo(() => {
        return series.map(s => {
            var _a;
            if (s.visible === false || !((_a = s.data) === null || _a === void 0 ? void 0 : _a.length))
                return null;
            if (s.data.length < 1000)
                return null; // threshold
            try {
                return new SpatialIndex(s.data, 50);
            }
            catch (_b) {
                return null;
            }
        });
    }, [series]);
    return useCallback((chartX, chartY, maxDistancePx = 30) => {
        let closest = null;
        series.forEach((s, i) => {
            var _a;
            if (s.visible === false || !((_a = s.data) === null || _a === void 0 ? void 0 : _a.length))
                return;
            const idx = indices[i];
            if (idx) {
                // Convert pixel to data coords for index search approximation
                const dataX = xDomain[0] + (chartX / plotWidth) * (xDomain[1] - xDomain[0]);
                const dataY = yDomain[1] - (chartY / plotHeight) * (yDomain[1] - yDomain[0]);
                const cand = idx.findClosest(dataX, dataY, (maxDistancePx / plotWidth) * (xDomain[1] - xDomain[0]));
                if (cand) {
                    // Convert candidate point back to pixel distance
                    const pxX = ((cand.dataPoint.x - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotWidth;
                    const pxY = (1 - ((cand.dataPoint.y - yDomain[0]) / (yDomain[1] - yDomain[0]))) * plotHeight;
                    const dist = Math.hypot(chartX - pxX, chartY - pxY);
                    if (dist <= maxDistancePx) {
                        if (!closest || dist < closest.distance)
                            closest = { dataPoint: cand.dataPoint, distance: dist };
                    }
                    return;
                }
            }
            const cand = findClosestDataPoint(chartX, chartY, s.data, { x: 0, y: 0, width: plotWidth, height: plotHeight }, xDomain, yDomain, maxDistancePx);
            if (cand && (!closest || cand.distance < closest.distance))
                closest = cand;
        });
        return closest;
    }, [series, indices, xDomain, yDomain, plotWidth, plotHeight]);
};

/**
 * Generic pan + pinch + wheel domain math extracted from LineChart.
 * Returns helpers for gesture events; caller applies resulting domains to state.
 * @param state - Current pan/zoom state
 * @param setState - State update function
 * @param opts - Pan/zoom options
 * @returns Object with gesture handlers
 */
const usePanZoom = (state, setState, opts) => {
    const panRef = useRef({ lastPan: null, pinch: null });
    const startPan = useCallback((x, y) => {
        if (!opts.enablePanZoom)
            return;
        panRef.current.lastPan = { x, y };
    }, [opts.enablePanZoom]);
    const updatePan = useCallback((x, y, plotWidth, plotHeight) => {
        if (!opts.enablePanZoom)
            return;
        const lp = panRef.current.lastPan;
        if (!lp)
            return;
        const dx = x - lp.x;
        const dy = y - lp.y;
        panRef.current.lastPan = { x, y };
        const mode = opts.zoomMode || 'both';
        if (dx !== 0 && (mode === 'x' || mode === 'both')) {
            const [x0, x1] = state.xDomain;
            const range = x1 - x0;
            const delta = (dx / plotWidth) * range;
            const next = opts.clampDomain([x0 - delta, x1 - delta], opts.baseX);
            setState({ xDomain: next });
        }
        if (dy !== 0 && (mode === 'y' || mode === 'both')) {
            const [y0, y1] = state.yDomain;
            const range = y1 - y0;
            const delta = (dy / plotHeight) * range;
            const nextY = opts.clampDomain([y0 + delta, y1 + delta], opts.baseY);
            setState({ yDomain: nextY });
        }
    }, [opts.enablePanZoom, opts.zoomMode, opts.clampDomain, opts.baseX, opts.baseY, state.xDomain, state.yDomain, setState]);
    const startPinch = useCallback((distance) => {
        if (!opts.enablePanZoom)
            return;
        panRef.current.pinch = { distance, xDomain: state.xDomain, yDomain: state.yDomain };
    }, [opts.enablePanZoom, state.xDomain, state.yDomain]);
    const updatePinch = useCallback((distance) => {
        var _a;
        if (!opts.enablePanZoom)
            return;
        const pinch = panRef.current.pinch;
        if (!pinch)
            return;
        // Standard: distance grows => scale > 1 => zoom in (range shrinks)
        // Inverted: distance grows => treat as zoom out
        const rawScale = distance / pinch.distance;
        const scale = opts.invertPinchZoom ? (1 / rawScale) : rawScale;
        if (scale === 1)
            return;
        const clampedScale = Math.max((_a = opts.minZoom) !== null && _a !== void 0 ? _a : 0.1, Math.min(1, scale));
        const mode = opts.zoomMode || 'both';
        if (mode === 'x' || mode === 'both') {
            const [x0, x1] = pinch.xDomain;
            const mid = (x0 + x1) / 2;
            const half = ((x1 - x0) / 2) * clampedScale;
            setState({ xDomain: opts.clampDomain([mid - half, mid + half], opts.baseX) });
        }
        if (mode === 'y' || mode === 'both') {
            const [y0, y1] = pinch.yDomain;
            const mid = (y0 + y1) / 2;
            const half = ((y1 - y0) / 2) * clampedScale;
            setState({ yDomain: opts.clampDomain([mid - half, mid + half], opts.baseY) });
        }
    }, [opts.enablePanZoom, opts.zoomMode, opts.minZoom, opts.clampDomain, opts.baseX, opts.baseY]);
    const wheelZoom = useCallback((direction, anchorXRatio, anchorYRatio) => {
        var _a, _b, _c;
        if (!opts.enablePanZoom)
            return;
        const step = (_a = opts.wheelZoomStep) !== null && _a !== void 0 ? _a : 0.1;
        // Standard: wheel up (deltaY<0) zoom in (factor < 1). Inverted flips meaning.
        const zoomIn = direction < 0; // deltaY negative => up
        const effectiveZoomIn = opts.invertWheelZoom ? !zoomIn : zoomIn;
        const factor = effectiveZoomIn ? (1 - step) : (1 + step);
        const mode = opts.zoomMode || 'both';
        if (mode === 'x' || mode === 'both') {
            const [x0, x1] = state.xDomain;
            const range = x1 - x0;
            const newRange = Math.max(((_b = opts.minZoom) !== null && _b !== void 0 ? _b : 0.1) * (opts.baseX[1] - opts.baseX[0]), Math.min(range * factor, opts.baseX[1] - opts.baseX[0]));
            const anchorValue = x0 + range * anchorXRatio;
            const newX0 = anchorValue - newRange * anchorXRatio;
            const next = opts.clampDomain([newX0, newX0 + newRange], opts.baseX);
            setState({ xDomain: next });
        }
        if (mode === 'y' || mode === 'both') {
            const [y0, y1] = state.yDomain;
            const range = y1 - y0;
            const newRange = Math.max(((_c = opts.minZoom) !== null && _c !== void 0 ? _c : 0.1) * (opts.baseY[1] - opts.baseY[0]), Math.min(range * factor, opts.baseY[1] - opts.baseY[0]));
            const anchorValue = y0 + range * anchorYRatio;
            const newY0 = anchorValue - newRange * anchorYRatio;
            const nextY = opts.clampDomain([newY0, newY0 + newRange], opts.baseY);
            setState({ yDomain: nextY });
        }
    }, [opts.enablePanZoom, opts.zoomMode, opts.minZoom, opts.clampDomain, opts.baseX, opts.baseY, state.xDomain, state.yDomain]);
    const endPan = useCallback(() => { panRef.current.lastPan = null; }, []);
    const endPinch = useCallback(() => { panRef.current.pinch = null; }, []);
    return { startPan, updatePan, endPan, startPinch, updatePinch, endPinch, wheelZoom };
};

// Create animated SVG components
const AnimatedPath$a = Animated$1.createAnimatedComponent(Path);
const AnimatedCircle$5 = Animated$1.createAnimatedComponent(Circle);
Animated$1.createAnimatedComponent(Svg);
const resolveEasing$1 = (preset) => {
    switch (preset) {
        case 'linear':
            return Easing.linear;
        case 'ease-in':
            return Easing.in(Easing.cubic);
        case 'ease-in-out':
            return Easing.inOut(Easing.cubic);
        case 'ease-out':
            return Easing.out(Easing.cubic);
        case 'bounce':
            return Easing.bounce;
        case 'elastic':
            return Easing.elastic(1);
        default:
            return Easing.out(Easing.cubic);
    }
};
// Animated point component (encapsulates hook usage)
const AnimatedPoint = ({ point, animationProgress, selected, color, pointSize }) => {
    const animatedCircleProps = useAnimatedProps(() => ({
        opacity: animationProgress.value,
        r: (selected ? 1.5 : 1) * pointSize,
    }));
    return (jsx(AnimatedCircle$5, { cx: point.chartX, cy: point.chartY, fill: point.color || color, stroke: "white", strokeWidth: 1, animatedProps: animatedCircleProps }));
};
// Animated line series component
const AnimatedLineSeries = ({ seriesData, seriesIndex, animationProgress, plotHeight, shouldFill, seriesSmooth, theme, gradientId, selectedPoint, lineThickness, lineStyle, showPoints, pointSize, }) => {
    var _a, _b;
    if (seriesData.visible === false || seriesData.chartPoints.length === 0)
        return null;
    const seriesLineColor = seriesData.color || theme.colors.accentPalette[seriesIndex % theme.colors.accentPalette.length];
    const seriesLineThickness = (_b = (_a = seriesData.lineThickness) !== null && _a !== void 0 ? _a : seriesData.thickness) !== null && _b !== void 0 ? _b : lineThickness;
    const resolvedStyle = seriesData.lineStyle || seriesData.style || lineStyle;
    const dashPattern = resolvedStyle === 'dashed' ? [8, 6] : resolvedStyle === 'dotted' ? [2, 6] : undefined;
    const seriesPointColor = seriesData.pointColor || seriesLineColor;
    const linePath = createSVGPath(seriesData.chartPoints, seriesSmooth);
    const animatedPathProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        if (progress >= 1) {
            return { strokeDashoffset: 0 };
        }
        let totalLength = 0;
        const pts = seriesData.chartPoints;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const curr = pts[i];
            const dx = curr.chartX - prev.chartX;
            const dy = curr.chartY - prev.chartY;
            totalLength += Math.sqrt(dx * dx + dy * dy);
        }
        const pathLength = Math.max(totalLength, 1);
        return {
            strokeDasharray: `${pathLength}`,
            strokeDashoffset: pathLength * (1 - progress),
        };
    });
    const animatedFillProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));
    return (jsxs(G, { children: [shouldFill && seriesData.chartPoints.length > 1 && (jsx(AnimatedPath$a, { d: createFillPath(seriesData.chartPoints, plotHeight, seriesSmooth), fill: `url(#${gradientId})`, animatedProps: animatedFillProps })), jsx(AnimatedPath$a, { d: linePath, stroke: seriesLineColor, strokeWidth: seriesLineThickness, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", strokeDasharray: dashPattern, animatedProps: animatedPathProps }), showPoints && seriesData.chartPoints.map((point, pointIndex) => (jsx(AnimatedPoint, { point: point, animationProgress: animationProgress, selected: (selectedPoint === null || selectedPoint === void 0 ? void 0 : selectedPoint.id) === point.id, color: seriesPointColor, pointSize: seriesData.pointSize || pointSize }, `point-${seriesIndex}-${pointIndex}`)))] }, seriesData.id || seriesIndex));
};
// Helper function to create SVG path from data points
const createSVGPath = (points, smooth = false) => {
    if (points.length === 0)
        return '';
    if (smooth) {
        // Convert chartX/chartY to x/y for createSmoothPath
        const convertedPoints = points.map(p => ({ x: p.chartX, y: p.chartY }));
        return createSmoothPath(convertedPoints);
    }
    let path = `M ${points[0].chartX} ${points[0].chartY}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].chartX} ${points[i].chartY}`;
    }
    return path;
};
// Helper function to create fill area path
const createFillPath = (points, plotHeight, smooth = false) => {
    if (points.length === 0)
        return '';
    const linePath = smooth ?
        createSmoothPath(points.map(p => ({ x: p.chartX, y: p.chartY }))) :
        createSVGPath(points, false);
    // Close the path to the bottom
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    return `${linePath} L ${lastPoint.chartX} ${plotHeight} L ${firstPoint.chartX} ${plotHeight} Z`;
};
// Removed per-series hook-based decimation to avoid nested hook calls; using pure helper instead.
const LineChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { data, series, width = 400, height = 300, lineColor, lineThickness = 2, lineStyle = 'solid', showPoints = true, pointSize = 4, pointColor, smooth = false, fill = false, fillColor, fillOpacity = 0.3, areaFillMode = 'single', title, subtitle, xAxis, yAxis, grid, legend, tooltip, annotations, animation, disableAnimations, onPress, onDataPointPress, disabled = false, animationDuration = 1000, style, ...rest } = props;
    const theme = useChartTheme();
    const chartInstanceIdRef = React.useRef('');
    if (!chartInstanceIdRef.current) {
        chartInstanceIdRef.current = `linechart-${Math.random().toString(36).slice(2, 10)}`;
    }
    const chartInstanceId = chartInstanceIdRef.current;
    const isWeb = Platform.OS === 'web';
    const defaultScheme = colorSchemes.default;
    const animationProgress = useSharedValue(0);
    const [selectedPoint, setSelectedPoint] = useState(null);
    // Store the full chart-space point (with chartX/chartY & color) for rendering highlight even when showPoints=false
    const [highlightPoint, setHighlightPoint] = useState(null);
    // use shared interaction context (optional if not wrapped by provider externally)
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_j) {
        console.warn('LineChart: useChartInteractionContext must be used inside a ChartInteractionProvider context');
    }
    const setSharedCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const sharedConfig = interaction === null || interaction === void 0 ? void 0 : interaction.config;
    const wantsSharedCrosshair = React.useMemo(() => !!(props.enableCrosshair || (sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip)), [props.enableCrosshair, sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip]);
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const initializeDomains = interaction === null || interaction === void 0 ? void 0 : interaction.initializeDomains;
    const setDomains = interaction === null || interaction === void 0 ? void 0 : interaction.setDomains;
    // Visibility now driven by interaction context; local map removed to avoid double state causing loops
    const [xDomainState, setXDomainState] = useState(null);
    const [yDomainState, setYDomainState] = useState(null);
    // Pan/zoom state now driven via usePanZoom hook (removing local gesture math duplication)
    const [lastPan, setLastPan] = useState(null); // still used for web mouse fallback
    const [pinchTracking, setPinchTracking] = useState(false); // flag to delegate to hook
    const [lastTapTime, setLastTapTime] = useState(0);
    // Web fallback for mouse drag (PanResponder can be flaky with Pressable)
    const [isMousePanning, setIsMousePanning] = useState(false);
    const [brushStart, setBrushStart] = useState(null);
    const [brushCurrent, setBrushCurrent] = useState(null);
    // Normalize data input to series format (memoized so domain/pan changes don't recreate array)
    const normalizedSeries = React.useMemo(() => normalizeLineChartData(data, series), [data, series]);
    // Apply optional decimation per series (pure, safe for hooks)
    const decimationThreshold = (_a = props.decimationThreshold) !== null && _a !== void 0 ? _a : 2000;
    const decimatedSeries = React.useMemo(() => {
        if (!decimationThreshold)
            return normalizedSeries;
        const decimate = (dataPoints, threshold) => {
            if (!dataPoints || dataPoints.length <= threshold)
                return dataPoints;
            // LTOB simplified
            const sampled = [];
            const bucketSize = (dataPoints.length - 2) / (threshold - 2);
            let a = 0;
            sampled.push(dataPoints[a]);
            for (let i = 0; i < threshold - 2; i++) {
                const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
                const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
                const range = dataPoints.slice(rangeStart, Math.min(rangeEnd, dataPoints.length - 1));
                const pointA = dataPoints[a];
                let maxArea = -1;
                let nextA = a;
                for (let j = 0; j < range.length; j++) {
                    const point = range[j];
                    const area = Math.abs((pointA.x - point.x) * (pointA.y - point.y));
                    if (area > maxArea) {
                        maxArea = area;
                        nextA = rangeStart + j;
                    }
                }
                sampled.push(dataPoints[nextA]);
                a = nextA;
            }
            sampled.push(dataPoints[dataPoints.length - 1]);
            return sampled;
        };
        return normalizedSeries.map(s => ({ ...s, data: decimate(s.data, decimationThreshold) }));
    }, [normalizedSeries, decimationThreshold]);
    const animationSignature = React.useMemo(() => {
        return decimatedSeries
            .map((seriesItem, seriesIndex) => {
            var _a;
            const id = (_a = seriesItem.id) !== null && _a !== void 0 ? _a : seriesIndex;
            const dataKey = (seriesItem.data || [])
                .map(point => `${point.x}:${point.y}`)
                .join('|');
            return `${id}:${dataKey}`;
        })
            .join('||');
    }, [decimatedSeries]);
    const supportsDrawAnimation = React.useMemo(() => {
        const type = animation === null || animation === void 0 ? void 0 : animation.type;
        if (type == null)
            return true;
        return type === 'draw' || type === 'drawOn' || type === 'wave';
    }, [animation === null || animation === void 0 ? void 0 : animation.type]);
    React.useEffect(() => {
        var _a, _b, _c, _d;
        if (!supportsDrawAnimation || disableAnimations) {
            animationProgress.value = 1;
            return;
        }
        const resolvedDuration = (_b = (_a = animation === null || animation === void 0 ? void 0 : animation.duration) !== null && _a !== void 0 ? _a : animationDuration) !== null && _b !== void 0 ? _b : 1000;
        const resolvedDelay = Math.max(0, (_c = animation === null || animation === void 0 ? void 0 : animation.delay) !== null && _c !== void 0 ? _c : 0);
        const easingPreset = (_d = animation === null || animation === void 0 ? void 0 : animation.easing) !== null && _d !== void 0 ? _d : props.animationEasing;
        const easingFn = resolveEasing$1(easingPreset);
        animationProgress.value = 0;
        const timing = withTiming(1, {
            duration: Math.max(1, resolvedDuration),
            easing: easingFn,
        });
        animationProgress.value = resolvedDelay > 0 ? withDelay(resolvedDelay, timing) : timing;
    }, [animationProgress, animationSignature, animation === null || animation === void 0 ? void 0 : animation.duration, animation === null || animation === void 0 ? void 0 : animation.delay, animation === null || animation === void 0 ? void 0 : animation.easing, animationDuration, props.animationEasing, disableAnimations, supportsDrawAnimation]);
    // Calculate data bounds from all series
    const computedXDomain = getMultiSeriesDomain(decimatedSeries, d => d.x);
    const computedYDomain = getMultiSeriesDomain(decimatedSeries, d => d.y);
    const rawXDomain = xDomainState || computedXDomain;
    const rawYDomain = yDomainState || computedYDomain;
    const clampToInitial = props.clampToInitialDomain;
    const clampDomain = (domain, base) => {
        if (!clampToInitial)
            return domain;
        const width = domain[1] - domain[0];
        const baseWidth = base[1] - base[0];
        // If larger than base, just return base
        if (width >= baseWidth)
            return base;
        const min = Math.max(base[0], Math.min(domain[0], base[1] - width));
        const max = min + width;
        return [min, max];
    };
    const xDomain = clampDomain(rawXDomain, computedXDomain);
    const yDomain = clampDomain(rawYDomain, computedYDomain);
    // Push initial domains to context once (only if provider exists and not yet set)
    React.useEffect(() => {
        if (initializeDomains && (interaction === null || interaction === void 0 ? void 0 : interaction.domains) == null) {
            initializeDomains({ x: xDomain, y: yDomain });
        }
    }, [initializeDomains, xDomain, yDomain, interaction === null || interaction === void 0 ? void 0 : interaction.domains]);
    // Chart dimensions - adjust padding based on legend position to prevent overlap
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const legendPadding = React.useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const padding = legendPadding;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    // Scale helpers based on prop
    const xScaleFn = React.useCallback((v, domain, range) => {
        switch (props.xScaleType) {
            case 'log': return scaleLog(Math.max(v, 1e-12), domain, range);
            case 'time': return scaleTime(v, domain, range);
            default: return scaleLinear(v, domain, range);
        }
    }, [props.xScaleType]);
    const yScaleFn = React.useCallback((v, domain, range) => {
        switch (props.yScaleType) {
            case 'log': return scaleLog(Math.max(v, 1e-12), domain, range);
            case 'time': return scaleTime(v, domain, range);
            default: return scaleLinear(v, domain, range);
        }
    }, [props.yScaleType]);
    // Animation effect
    // Build a lightweight signature of the data (series id + length)
    const chartSeriesData = React.useMemo(() => {
        return decimatedSeries.map((seriesItem, seriesIndex) => {
            var _a;
            const ctxVis = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => { var _a; return sr.id === ((_a = seriesItem.id) !== null && _a !== void 0 ? _a : seriesIndex); })) === null || _a === void 0 ? void 0 : _a.visible;
            if (ctxVis === false) {
                return {
                    ...seriesItem,
                    chartPoints: [],
                    color: seriesItem.color || getColorFromScheme(seriesIndex, defaultScheme),
                    visible: false,
                    areaFill: seriesItem.areaFill,
                    fillColor: seriesItem.fillColor,
                    fillOpacity: seriesItem.fillOpacity,
                    smooth: seriesItem.smooth,
                };
            }
            const chartPoints = seriesItem.data.map((point) => {
                const coords = dataToChartCoordinates(point.x, point.y, { x: 0, y: 0, width: plotWidth, height: plotHeight }, xDomain, yDomain);
                return { ...point, chartX: coords.x, chartY: coords.y };
            });
            const visibleFlag = ctxVis === undefined ? true : ctxVis === true; // normalize to boolean
            return {
                ...seriesItem,
                chartPoints,
                color: seriesItem.color || getColorFromScheme(seriesIndex, defaultScheme),
                visible: visibleFlag,
                areaFill: seriesItem.areaFill,
                fillColor: seriesItem.fillColor,
                fillOpacity: seriesItem.fillOpacity,
                smooth: seriesItem.smooth,
            };
        });
    }, [decimatedSeries, interaction === null || interaction === void 0 ? void 0 : interaction.series, plotWidth, plotHeight, xDomain, yDomain, defaultScheme]);
    const filledSeriesIndices = React.useMemo(() => {
        return chartSeriesData.reduce((indices, seriesData, seriesIndex) => {
            const fillPreference = seriesData.areaFill;
            const baseFill = fillPreference !== undefined
                ? (fill ? fillPreference : false)
                : (fill && (areaFillMode === 'series' ? true : seriesIndex === 0));
            if (baseFill && seriesData.chartPoints.length > 1) {
                indices.push(seriesIndex);
            }
            return indices;
        }, []);
    }, [chartSeriesData, fill, areaFillMode]);
    const filledSeriesSet = React.useMemo(() => new Set(filledSeriesIndices), [filledSeriesIndices]);
    const gradientConfigs = React.useMemo(() => {
        return filledSeriesIndices.map(seriesIndex => {
            var _a, _b;
            const seriesData = chartSeriesData[seriesIndex];
            const gradientId = `${chartInstanceId}-gradient-${(_a = seriesData.id) !== null && _a !== void 0 ? _a : seriesIndex}`;
            const gradientColor = seriesData.fillColor || fillColor || seriesData.color || theme.colors.accentPalette[seriesIndex % theme.colors.accentPalette.length];
            const gradientOpacity = (_b = seriesData.fillOpacity) !== null && _b !== void 0 ? _b : fillOpacity;
            return { id: gradientId, color: gradientColor, opacity: gradientOpacity, seriesIndex };
        });
    }, [chartSeriesData, chartInstanceId, filledSeriesIndices, fillColor, fillOpacity, theme]);
    const shouldRenderGradients = gradientConfigs.length > 0;
    // Register series with interaction context (points in data coords only)
    React.useEffect(() => {
        if (!registerSeries)
            return;
        chartSeriesData.forEach((s, i) => {
            var _a, _b, _c;
            const points = (_b = (_a = s.chartPoints) === null || _a === void 0 ? void 0 : _a.map((point, idx) => {
                const raw = s.data[idx];
                return {
                    x: point.x,
                    y: point.y,
                    pixelX: point.chartX,
                    pixelY: point.chartY,
                    meta: {
                        ...raw,
                        chartX: point.chartX,
                        chartY: point.chartY,
                    },
                };
            })) !== null && _b !== void 0 ? _b : s.data.map((p) => ({ x: p.x, y: p.y, meta: p }));
            registerSeries({
                id: (_c = s.id) !== null && _c !== void 0 ? _c : i,
                name: s.name || `Series ${i + 1}`,
                color: s.color,
                points,
                visible: s.visible !== false,
            });
        });
    }, [registerSeries, chartSeriesData]);
    // Handle chart interaction
    const nearestPoint = useNearestPoint(chartSeriesData, xDomain, yDomain, plotWidth, plotHeight);
    const pointerToDataX = React.useCallback((chartX) => {
        if (plotWidth <= 0)
            return xDomain[0];
        const clamped = Math.max(0, Math.min(plotWidth, chartX));
        const span = xDomain[1] - xDomain[0];
        if (props.xScaleType === 'log') {
            const safeMin = Math.max(xDomain[0], 1e-12);
            const safeMax = Math.max(xDomain[1], 1e-12);
            const logMin = Math.log(safeMin);
            const logMax = Math.log(safeMax);
            if (logMax === logMin)
                return safeMin;
            const ratio = clamped / Math.max(plotWidth, 1);
            return Math.exp(logMin + (logMax - logMin) * ratio);
        }
        return xDomain[0] + (span === 0 ? 0 : (clamped / Math.max(plotWidth, 1)) * span);
    }, [plotWidth, props.xScaleType, xDomain]);
    const updateCrosshairFromPointer = React.useCallback((chartX) => {
        if (!wantsSharedCrosshair || !setSharedCrosshair)
            return;
        const dataX = pointerToDataX(chartX);
        const clampedX = Math.max(0, Math.min(plotWidth, chartX));
        setSharedCrosshair({ dataX, pixelX: clampedX });
    }, [pointerToDataX, plotWidth, setSharedCrosshair, wantsSharedCrosshair]);
    const evaluateNearestPoint = useCallback((chartX, chartY, nativeEvent, fireCallbacks = false) => {
        var _a;
        updateCrosshairFromPointer(chartX);
        const closestPoint = nearestPoint(chartX, chartY, 30);
        if (closestPoint) {
            const dp = closestPoint.dataPoint;
            setSelectedPoint(dp);
            // Resolve rendered chart coordinates & color from current series (so highlight uses exact point position)
            let resolved = null;
            for (const s of chartSeriesData) {
                if (!s.chartPoints)
                    continue;
                const hit = s.chartPoints.find((p) => (p.id != null && dp.id != null ? p.id === dp.id : (p.x === dp.x && p.y === dp.y)));
                if (hit) {
                    resolved = { chartX: hit.chartX, chartY: hit.chartY, color: hit.color || s.color, id: hit.id, seriesId: (_a = s.id) !== null && _a !== void 0 ? _a : undefined };
                    break;
                }
            }
            if (resolved) {
                // Only update pointer & crosshair if anchor actually changed (reduces churn & drives tooltip movement policy)
                const pointerChanged = !highlightPoint || highlightPoint.chartX !== resolved.chartX || highlightPoint.chartY !== resolved.chartY;
                if (pointerChanged) {
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: resolved.chartX, y: resolved.chartY, inside: true });
                    setHighlightPoint(resolved);
                }
            }
            if (fireCallbacks && nativeEvent) {
                const interactionEvent = {
                    nativeEvent,
                    chartX,
                    chartY,
                    dataPoint: dp,
                    distance: closestPoint.distance,
                };
                onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(dp, interactionEvent);
            }
        }
        else if (fireCallbacks) {
            if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer) {
                setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: true });
            }
            setHighlightPoint(null);
        }
    }, [nearestPoint, onDataPointPress, interaction === null || interaction === void 0 ? void 0 : interaction.pointer, chartSeriesData, highlightPoint, updateCrosshairFromPointer]);
    const handlePress = (event) => {
        if (disabled)
            return;
        const { locationX, locationY } = event.nativeEvent;
        const chartX = locationX - padding.left;
        const chartY = locationY - padding.top;
        evaluateNearestPoint(chartX, chartY, event, true);
        const interactionEvent = {
            nativeEvent: event,
            chartX,
            chartY,
        };
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    };
    // PanResponder for live tooltip / future pan-zoom
    // Pan/Zoom hook abstraction
    const panZoom = usePanZoom({ xDomain: xDomain, yDomain: yDomain }, (next) => {
        if (next.xDomain) {
            setXDomainState(next.xDomain);
            setDomains === null || setDomains === void 0 ? void 0 : setDomains({ x: next.xDomain });
        }
        if (next.yDomain) {
            setYDomainState(next.yDomain);
            setDomains === null || setDomains === void 0 ? void 0 : setDomains({ y: next.yDomain });
        }
    }, {
        enablePanZoom: props.enablePanZoom,
        zoomMode: props.zoomMode,
        minZoom: props.minZoom,
        wheelZoomStep: props.wheelZoomStep,
        clampDomain: clampDomain,
        baseX: computedXDomain,
        baseY: computedYDomain,
        invertPinchZoom: props.invertPinchZoom,
        invertWheelZoom: props.invertWheelZoom,
    });
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => {
            const native = e.nativeEvent || {};
            const touches = native.touches || [];
            // Pinch start (either touches length OR gestureState.numberActiveTouches)
            if (props.enablePanZoom && (touches.length === 2 || gestureState.numberActiveTouches === 2)) {
                if (touches.length === 2) {
                    const dx = touches[1].pageX - touches[0].pageX;
                    const dy = touches[1].pageY - touches[0].pageY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    panZoom.startPinch(distance);
                    setPinchTracking(true);
                    return;
                }
            }
            // Single pointer start
            const { locationX, locationY } = native;
            if (typeof locationX === 'number' && typeof locationY === 'number') {
                setLastPan({ x: locationX, y: locationY });
                panZoom.startPan(locationX, locationY);
                if (props.liveTooltip || (sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip) || props.enableCrosshair) {
                    evaluateNearestPoint(locationX - padding.left, locationY - padding.top, e, false);
                }
                setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            const native = evt.nativeEvent || {};
            const touches = native.touches || [];
            const activeTouches = touches.length || gestureState.numberActiveTouches;
            // Initiate pinch mid-gesture if second finger added
            if (props.enablePanZoom && activeTouches === 2) {
                if (!pinchTracking && touches.length === 2) {
                    const dx0 = touches[1].pageX - touches[0].pageX;
                    const dy0 = touches[1].pageY - touches[0].pageY;
                    const startDistance = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                    panZoom.startPinch(startDistance);
                    setPinchTracking(true);
                    return;
                }
                if (pinchTracking && touches.length === 2) {
                    const dx = touches[1].pageX - touches[0].pageX;
                    const dy = touches[1].pageY - touches[0].pageY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    panZoom.updatePinch(distance);
                    return;
                }
            }
            // Pan (only when not pinching)
            if (props.enablePanZoom && !pinchTracking && lastPan && activeTouches === 1) {
                const { locationX, locationY } = native;
                if (typeof locationX === 'number' && typeof locationY === 'number') {
                    panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
                    setLastPan({ x: locationX, y: locationY });
                    if (props.liveTooltip || (sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip) || props.enableCrosshair) {
                        evaluateNearestPoint(locationX - padding.left, locationY - padding.top, evt, false);
                    }
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
                }
                return;
            }
            // Live tooltip only
            if ((props.liveTooltip || (sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip) || props.enableCrosshair) && activeTouches === 1) {
                const { locationX, locationY } = native;
                if (typeof locationX === 'number' && typeof locationY === 'number') {
                    evaluateNearestPoint(locationX - padding.left, locationY - padding.top, evt, false);
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
                }
            }
        },
        onPanResponderRelease: (e) => {
            var _a, _b;
            // Double tap / click reset detection
            if (props.resetOnDoubleTap) {
                const now = Date.now();
                if (now - lastTapTime < 300) { // double within 300ms
                    setXDomainState(null);
                    setYDomainState(null);
                    setSharedCrosshair === null || setSharedCrosshair === void 0 ? void 0 : setSharedCrosshair(null);
                    setSelectedPoint(null);
                    (_a = props.onDomainChange) === null || _a === void 0 ? void 0 : _a.call(props, computedXDomain, computedYDomain);
                    setLastTapTime(0);
                }
                else {
                    setLastTapTime(now);
                }
            }
            panZoom.endPan();
            setLastPan(null);
            if (pinchTracking) {
                panZoom.endPinch();
                setPinchTracking(false);
            }
            (_b = props.onDomainChange) === null || _b === void 0 ? void 0 : _b.call(props, xDomain, yDomain);
            if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer) {
                setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: false });
            }
        },
        onPanResponderTerminationRequest: () => true,
    });
    // Generate ticks for axes
    const xTicks = React.useMemo(() => {
        switch (props.xScaleType) {
            case 'log': return generateLogTicks(xDomain, 6);
            case 'time': return generateTimeTicks(xDomain, 6);
            default: return generateTicks(xDomain[0], xDomain[1], 6);
        }
    }, [xDomain, props.xScaleType]);
    const yTicks = React.useMemo(() => {
        switch (props.yScaleType) {
            case 'log': return generateLogTicks(yDomain, 5);
            case 'time': return generateTimeTicks(yDomain, 5);
            default: return generateTicks(yDomain[0], yDomain[1], 5);
        }
    }, [yDomain, props.yScaleType]);
    // Convert ticks to normalized positions (0-1) for ChartGrid
    const normalizedXTicks = xTicks.map(tick => xScaleFn(tick, xDomain, [0, 1]));
    const normalizedYTicks = yTicks.map(tick => yScaleFn(tick, yDomain, [1, 0])); // Inverted for chart coordinates
    const axisScaleX = React.useMemo(() => {
        const range = [0, Math.max(plotWidth, 0)];
        const scale = ((value) => xScaleFn(value, xDomain, range));
        scale.domain = () => [...xDomain];
        scale.range = () => [...range];
        scale.ticks = () => (xTicks.length ? xTicks : [xDomain[0], xDomain[1]]);
        scale.invert = (pixel) => {
            const [domainMin, domainMax] = xDomain;
            if (range[1] === range[0])
                return domainMin;
            const clamped = Math.max(range[0], Math.min(range[1], pixel));
            const ratio = (clamped - range[0]) / (range[1] - range[0]);
            if (props.xScaleType === 'log') {
                const logMin = Math.log(Math.max(domainMin, 1e-12));
                const logMax = Math.log(Math.max(domainMax, 1e-12));
                if (logMax === logMin)
                    return Math.exp(logMin);
                return Math.exp(logMin + (logMax - logMin) * ratio);
            }
            return domainMin + (domainMax - domainMin) * ratio;
        };
        return scale;
    }, [plotWidth, xScaleFn, xDomain, xTicks, props.xScaleType]);
    const axisScaleY = React.useMemo(() => {
        const range = [Math.max(plotHeight, 0), 0];
        const scale = ((value) => yScaleFn(value, yDomain, range));
        scale.domain = () => [...yDomain];
        scale.range = () => [...range];
        scale.ticks = () => (yTicks.length ? yTicks : [yDomain[0], yDomain[1]]);
        return scale;
    }, [plotHeight, yScaleFn, yDomain, yTicks]);
    const xAxisTickSize = (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _b !== void 0 ? _b : 4;
    const yAxisTickSize = (_c = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _c !== void 0 ? _c : 4;
    const axisTickPadding = 4;
    return (jsxs(ChartContainer, { width: width, height: height, disabled: disabled, animationDuration: animationDuration, style: style, interactionConfig: {
            enablePanZoom: props.enablePanZoom,
            zoomMode: props.zoomMode,
            minZoom: props.minZoom,
            wheelZoomStep: props.wheelZoomStep,
            resetOnDoubleTap: props.resetOnDoubleTap,
            clampToInitialDomain: props.clampToInitialDomain,
            invertPinchZoom: props.invertPinchZoom,
            invertWheelZoom: props.invertWheelZoom,
            enableCrosshair: props.enableCrosshair,
            liveTooltip: props.liveTooltip,
            multiTooltip: props.multiTooltip,
        }, ...rest, children: [(title || subtitle) && (jsx(ChartTitle, { title: title, subtitle: subtitle })), grid && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTicks.length, tickSize: xAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(Number(value)) : formatNumber$2(Number(value)), showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_d = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _d !== void 0 ? _d : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_e = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _e !== void 0 ? _e : 12) + 20 : 40, tickLabelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTicks.length, tickSize: yAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(Number(value)) : formatNumber$2(Number(value)), showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _f !== void 0 ? _f : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_g = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _g !== void 0 ? _g : 12) + 20 : 30, style: { width: padding.left, height: plotHeight }, tickLabelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize })), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, ...(!isWeb ? panResponder.panHandlers : {}), 
                // Web mouse fallback handlers
                // @ts-ignore - web only events
                onMouseDown: (e) => {
                    try {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        if (props.enableBrushZoom && e.shiftKey) {
                            setBrushStart({ x, y });
                            setBrushCurrent({ x, y });
                            return;
                        }
                        if (!props.enablePanZoom)
                            return;
                        setLastPan({ x, y });
                        setIsMousePanning(true);
                        panZoom.startPan(x, y);
                        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x, y, inside: true });
                    }
                    catch (_a) {
                        console.warn('LineChart: onMouseDown event handling failed');
                    }
                }, 
                // @ts-ignore
                onMouseLeave: (e) => { if (isMousePanning) {
                    setIsMousePanning(false);
                    setLastPan(null);
                } if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer) {
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: false });
                } setSharedCrosshair === null || setSharedCrosshair === void 0 ? void 0 : setSharedCrosshair(null); setBrushStart(null); setBrushCurrent(null); }, 
                // @ts-ignore
                onMouseUp: (e) => {
                    var _a, _b;
                    if (props.enableBrushZoom && brushStart && brushCurrent) {
                        const x0 = Math.min(brushStart.x, brushCurrent.x);
                        const x1 = Math.max(brushStart.x, brushCurrent.x);
                        const y0 = Math.min(brushStart.y, brushCurrent.y);
                        const y1 = Math.max(brushStart.y, brushCurrent.y);
                        const dataX0 = xDomain[0] + (x0 / plotWidth) * (xDomain[1] - xDomain[0]);
                        const dataX1 = xDomain[0] + (x1 / plotWidth) * (xDomain[1] - xDomain[0]);
                        const dataY1 = yDomain[1] - (y0 / plotHeight) * (yDomain[1] - yDomain[0]);
                        const dataY0 = yDomain[1] - (y1 / plotHeight) * (yDomain[1] - yDomain[0]);
                        setXDomainState([dataX0, dataX1]);
                        setYDomainState([dataY0, dataY1]);
                        (_a = props.onDomainChange) === null || _a === void 0 ? void 0 : _a.call(props, [dataX0, dataX1], [dataY0, dataY1]);
                    }
                    setBrushStart(null);
                    setBrushCurrent(null);
                    if (isMousePanning) {
                        setIsMousePanning(false);
                        setLastPan(null);
                        panZoom.endPan();
                        (_b = props.onDomainChange) === null || _b === void 0 ? void 0 : _b.call(props, xDomain, yDomain);
                    }
                    if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer) {
                        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: true });
                    }
                }, 
                // @ts-ignore
                onMouseMove: (e) => {
                    try {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const locationX = e.clientX - rect.left;
                        const locationY = e.clientY - rect.top;
                        if (props.enableBrushZoom && brushStart) {
                            setBrushCurrent({ x: locationX, y: locationY });
                            return;
                        }
                        // Hover (not panning)
                        if (!isMousePanning) {
                            if (props.liveTooltip || (sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip) || props.enableCrosshair) {
                                evaluateNearestPoint(locationX, locationY, e, false);
                                setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: locationX, y: locationY, inside: true, pageX: e.pageX, pageY: e.pageY });
                            }
                            return;
                        }
                        // Panning mode
                        if (!lastPan)
                            return;
                        panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
                        setLastPan({ x: locationX, y: locationY });
                        if (props.liveTooltip) {
                            evaluateNearestPoint(locationX, locationY, e, false);
                        }
                        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: locationX, y: locationY, inside: true, pageX: e.pageX, pageY: e.pageY });
                    }
                    catch (_a) {
                        console.warn('LineChart: onMouseMove event handling failed');
                    }
                }, ...(props.enableWheelZoom ? {
                    onWheel: (e) => {
                        var _a;
                        if (!props.enablePanZoom)
                            return;
                        // Explicitly mark non-passive & prevent page scroll
                        if (e.cancelable)
                            e.preventDefault();
                        (_a = e.stopPropagation) === null || _a === void 0 ? void 0 : _a.call(e);
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pointerX = (e.clientX - rect.left);
                        const pointerY = (e.clientY - rect.top);
                        panZoom.wheelZoom(e.deltaY, pointerX / plotWidth, pointerY / plotHeight);
                    }
                } : {}), children: jsxs(Pressable, { ...(!isWeb ? panResponder.panHandlers : {}), onPress: handlePress, style: [
                        { position: 'absolute', left: 0, top: 0, width: plotWidth, height: plotHeight },
                        // @ts-ignore web only cursor
                        props.enablePanZoom ? { cursor: 'grab' } : null
                    ], children: [props.enableBrushZoom && brushStart && brushCurrent && (jsx(View, { style: {
                                position: 'absolute', pointerEvents: 'none',
                                left: Math.min(brushStart.x, brushCurrent.x),
                                top: Math.min(brushStart.y, brushCurrent.y),
                                width: Math.abs(brushCurrent.x - brushStart.x),
                                height: Math.abs(brushCurrent.y - brushStart.y),
                                backgroundColor: 'rgba(100,150,255,0.2)',
                                borderWidth: 1, borderColor: 'rgba(80,130,230,0.9)'
                            } })), jsxs(Svg, { width: plotWidth, height: plotHeight, style: {
                                position: 'absolute',
                                //overflow: 'visible' 
                            }, children: [shouldRenderGradients && (jsx(Defs, { children: gradientConfigs.map(({ id, color, opacity }) => (jsxs(LinearGradient, { id: id, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [jsx(Stop, { offset: "0%", stopColor: color, stopOpacity: opacity }), jsx(Stop, { offset: "100%", stopColor: color, stopOpacity: 0 })] }, id))) })), chartSeriesData.map((seriesData, seriesIndex) => {
                                    var _a, _b;
                                    const shouldFillSeries = filledSeriesSet.has(seriesIndex);
                                    const seriesSmoothValue = (_a = seriesData.smooth) !== null && _a !== void 0 ? _a : smooth;
                                    const gradientId = `${chartInstanceId}-gradient-${(_b = seriesData.id) !== null && _b !== void 0 ? _b : seriesIndex}`;
                                    const seriesLineStyle = seriesData.lineStyle || seriesData.style || lineStyle;
                                    return (jsx(AnimatedLineSeries, { seriesData: seriesData, seriesIndex: seriesIndex, animationProgress: animationProgress, plotHeight: plotHeight, shouldFill: shouldFillSeries, seriesSmooth: seriesSmoothValue, theme: theme, gradientId: gradientId, selectedPoint: selectedPoint, lineThickness: lineThickness, lineStyle: seriesLineStyle, showPoints: seriesData.showPoints !== undefined ? seriesData.showPoints : showPoints, pointSize: seriesData.pointSize || pointSize }, seriesData.id || seriesIndex));
                                }), highlightPoint && (jsx(Circle, { cx: highlightPoint.chartX, cy: highlightPoint.chartY, r: (pointSize || 4) * 1.9, fill: highlightPoint.color || theme.colors.accentPalette[0], stroke: theme.colors.background, strokeWidth: 2, opacity: 0.9 }))] }), annotations === null || annotations === void 0 ? void 0 : annotations.map((annotation) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            if (!annotation || plotWidth <= 0 || plotHeight <= 0)
                                return null;
                            if (annotation.shape === 'vertical-line' && annotation.x != null) {
                                const pixelX = xScaleFn(Number(annotation.x), xDomain, [0, plotWidth]);
                                if (!Number.isFinite(pixelX) || pixelX < 0 || pixelX > plotWidth)
                                    return null;
                                const lineWidth = (_a = annotation.lineWidth) !== null && _a !== void 0 ? _a : 1;
                                const color = annotation.color || theme.colors.accentPalette[4] || '#6366f1';
                                const opacity = (_b = annotation.opacity) !== null && _b !== void 0 ? _b : 0.8;
                                const label = annotation.label;
                                const textColor = annotation.textColor || theme.colors.textSecondary;
                                const fontSize = (_c = annotation.fontSize) !== null && _c !== void 0 ? _c : 10;
                                return (jsxs(React.Fragment, { children: [jsx(View, { style: {
                                                position: 'absolute',
                                                left: pixelX - lineWidth / 2,
                                                top: 0,
                                                width: lineWidth,
                                                height: plotHeight,
                                                backgroundColor: color,
                                                opacity,
                                            } }), label ? (jsx(Text, { style: {
                                                position: 'absolute',
                                                left: pixelX + 4,
                                                top: 4,
                                                color: textColor,
                                                fontSize,
                                                backgroundColor: annotation.backgroundColor || theme.colors.background,
                                                paddingHorizontal: 4,
                                                paddingVertical: 2,
                                                borderRadius: 4,
                                            }, children: label })) : null] }, `annotation-${annotation.id}`));
                            }
                            if (annotation.shape === 'horizontal-line' && annotation.y != null) {
                                const pixelY = yScaleFn(Number(annotation.y), yDomain, [plotHeight, 0]);
                                if (!Number.isFinite(pixelY) || pixelY < 0 || pixelY > plotHeight)
                                    return null;
                                const lineWidth = (_d = annotation.lineWidth) !== null && _d !== void 0 ? _d : 1;
                                const color = annotation.color || theme.colors.accentPalette[3] || '#0ea5e9';
                                const opacity = (_e = annotation.opacity) !== null && _e !== void 0 ? _e : 0.7;
                                const label = annotation.label;
                                const textColor = annotation.textColor || theme.colors.textSecondary;
                                const fontSize = (_f = annotation.fontSize) !== null && _f !== void 0 ? _f : 10;
                                return (jsxs(React.Fragment, { children: [jsx(View, { style: {
                                                position: 'absolute',
                                                top: pixelY - lineWidth / 2,
                                                left: 0,
                                                height: lineWidth,
                                                width: plotWidth,
                                                backgroundColor: color,
                                                opacity,
                                            } }), label ? (jsx(Text, { style: {
                                                position: 'absolute',
                                                left: 4,
                                                top: Math.max(0, pixelY - 20),
                                                color: textColor,
                                                fontSize,
                                                backgroundColor: annotation.backgroundColor || theme.colors.background,
                                                paddingHorizontal: 4,
                                                paddingVertical: 2,
                                                borderRadius: 4,
                                            }, children: label })) : null] }, `annotation-${annotation.id}`));
                            }
                            if (annotation.shape === 'range' && annotation.x1 != null && annotation.x2 != null) {
                                const start = xScaleFn(Number(annotation.x1), xDomain, [0, plotWidth]);
                                const end = xScaleFn(Number(annotation.x2), xDomain, [0, plotWidth]);
                                if (!Number.isFinite(start) || !Number.isFinite(end))
                                    return null;
                                const left = Math.min(start, end);
                                const width = Math.abs(end - start);
                                if (width <= 0)
                                    return null;
                                const backgroundColor = annotation.backgroundColor || `${(_g = theme.colors.accentPalette[2]) !== null && _g !== void 0 ? _g : '#22d3ee'}33`;
                                const opacity = (_h = annotation.opacity) !== null && _h !== void 0 ? _h : 0.35;
                                return (jsxs(React.Fragment, { children: [jsx(View, { style: {
                                                position: 'absolute',
                                                left,
                                                top: 0,
                                                width,
                                                height: plotHeight,
                                                backgroundColor,
                                                opacity,
                                            } }), annotation.label ? (jsx(Text, { style: {
                                                position: 'absolute',
                                                left: left + 8,
                                                top: 8,
                                                color: annotation.textColor || theme.colors.textSecondary,
                                                fontSize: (_j = annotation.fontSize) !== null && _j !== void 0 ? _j : 10,
                                                backgroundColor: (annotation.backgroundColor && annotation.backgroundColor !== backgroundColor)
                                                    ? annotation.backgroundColor
                                                    : theme.colors.background,
                                                paddingHorizontal: 4,
                                                paddingVertical: 2,
                                                borderRadius: 4,
                                            }, children: annotation.label })) : null] }, `annotation-${annotation.id}`));
                            }
                            return null;
                        }), props.enableCrosshair && (interaction === null || interaction === void 0 ? void 0 : interaction.crosshair) && (jsx(View, { pointerEvents: "none", style: {
                                position: 'absolute',
                                left: interaction.crosshair.pixelX,
                                top: 0,
                                height: plotHeight,
                                width: 1,
                                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
                            } })), (tooltip === null || tooltip === void 0 ? void 0 : tooltip.show) !== false && selectedPoint && !(sharedConfig === null || sharedConfig === void 0 ? void 0 : sharedConfig.multiTooltip) && (jsx(View, { style: {
                                position: 'absolute',
                                left: (xScaleFn(selectedPoint.x, xDomain, [0, plotWidth])) - 20,
                                top: (yScaleFn(selectedPoint.y, yDomain, [plotHeight, 0])) - 40,
                                backgroundColor: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.backgroundColor) || theme.colors.background,
                                padding: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.padding) || 8,
                                borderRadius: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.borderRadius) || 4,
                                alignItems: 'center',
                            }, children: jsx(Text, { style: {
                                    fontSize: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.fontSize) || 12,
                                    color: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.textColor) || theme.colors.textPrimary,
                                }, children: ((_h = tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) === null || _h === void 0 ? void 0 : _h.call(tooltip, selectedPoint)) || `(${formatNumber$2(selectedPoint.x)}, ${formatNumber$2(selectedPoint.y)})` }) }))] }) }), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: chartSeriesData.map((s, i) => ({
                    label: s.name || `Series ${i + 1}`,
                    color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
                    visible: s.visible !== false,
                })), position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: props.enableSeriesToggle ? (item, index, nativeEvent) => {
                    var _a, _b;
                    const series = chartSeriesData[index];
                    if (!series || !updateSeriesVisibility)
                        return;
                    const id = (_a = series.id) !== null && _a !== void 0 ? _a : index;
                    const overridden = (_b = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === id)) === null || _b === void 0 ? void 0 : _b.visible;
                    const current = overridden === undefined ? true : overridden !== false;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visibleIds = chartSeriesData.filter(s => s.visible !== false).map(s => { var _a; return (_a = s.id) !== null && _a !== void 0 ? _a : 0; });
                        const isSole = visibleIds.length === 1 && visibleIds[0] === id;
                        chartSeriesData.forEach((s, i) => { var _a, _b; return updateSeriesVisibility((_a = s.id) !== null && _a !== void 0 ? _a : i, isSole ? true : ((_b = s.id) !== null && _b !== void 0 ? _b : i) === id); });
                    }
                    else {
                        updateSeriesVisibility(id, !current);
                    }
                } : undefined }))] }));
};
LineChart.displayName = 'LineChart';

const buildSignature$6 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b, _c;
            const meta = point.meta;
            const metaId = (_a = meta === null || meta === void 0 ? void 0 : meta.id) !== null && _a !== void 0 ? _a : `${(_b = meta === null || meta === void 0 ? void 0 : meta.x) !== null && _b !== void 0 ? _b : ''}:${(_c = meta === null || meta === void 0 ? void 0 : meta.y) !== null && _c !== void 0 ? _c : ''}`;
            return `${point.x}:${point.y}:${metaId}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
        .join('||');
};
const useScatterSeriesRegistration = ({ series, registerSeries }) => {
    const registrations = useMemo(() => {
        if (!series.length)
            return [];
        return series.map((entry) => ({
            id: entry.id,
            name: entry.name,
            color: entry.color,
            points: entry.chartPoints.map((point) => ({
                x: point.x,
                y: point.y,
                meta: point,
            })),
            visible: entry.visible !== false,
        }));
    }, [series]);
    const signature = useMemo(() => buildSignature$6(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (!registrations.length || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((entry) => registerSeries(entry));
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!registrations.length) {
            registeredSignatureRef.current = null;
        }
    }, [registrations.length]);
};

const SPACING_PROP_KEYS = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'];
// Animated scatter point component
const AnimatedScatterPoint = React.memo(({ point, pointSize, pointOpacity, isSelected, isDragged, index, disabled, theme, colorScheme, fallbackColor, }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    const opacity = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            opacity.value = 1;
            return;
        }
        // Staggered appearance animation
        const delay = index * 50;
        scale.value = withDelay(delay, withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
        }));
        opacity.value = withDelay(delay, withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, index, scale, opacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value * ((isSelected || isDragged) ? 1.5 : 1) }],
        opacity: opacity.value * pointOpacity,
    }));
    // Skip rendering if coordinates invalid
    if (typeof point.chartX !== 'number' || typeof point.chartY !== 'number') {
        return null;
    }
    const palette = colorScheme && colorScheme.length ? colorScheme : colorSchemes.default;
    const backgroundColor = point.color || fallbackColor || getColorFromScheme(index, palette);
    return (jsx(Animated$1.View, { style: [
            {
                position: 'absolute',
                left: point.chartX - pointSize,
                top: point.chartY - pointSize,
                width: pointSize * 2,
                height: pointSize * 2,
                borderRadius: pointSize,
                backgroundColor,
                borderWidth: isSelected ? 2 : 0,
                borderColor: theme.colors.accentPalette[0],
                pointerEvents: 'none'
            },
            animatedStyle
        ] }));
});
AnimatedScatterPoint.displayName = 'AnimatedScatterPoint';
const ScatterChartInner = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const isWeb = Platform.OS === 'web';
    const { data: initialData, width = 400, height = 300, pointSize = 6, series, pointColor, pointOpacity = 1, allowAddPoints = false, allowDragPoints = false, showTrendline = false, trendlineColor, title, subtitle, xAxis, yAxis, grid, legend, tooltip, quadrants, onPress, onDataPointPress, disabled = false, multiTooltip, enableCrosshair, } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_p) { }
    const crosshairEnabled = enableCrosshair !== false && ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.config) === null || _a === void 0 ? void 0 : _a.enableCrosshair) !== false;
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const [data, setData] = useState(initialData);
    // Normalize multi-series (fallback to single-series wrapper)
    const normalizedSeries = React.useMemo(() => {
        if (series && series.length) {
            return series.map((s, i) => {
                var _a;
                return ({
                    id: s.id || `series-${i}`,
                    name: s.name || `Series ${i + 1}`,
                    color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
                    data: s.data,
                    pointSize: (_a = s.pointSize) !== null && _a !== void 0 ? _a : pointSize,
                    pointColor: s.pointColor || s.color,
                });
            });
        }
        // Fallback single-series mode using initial data prop
        return [{
                id: 'series-0',
                name: title || 'Series 1',
                color: pointColor || theme.colors.accentPalette[0],
                data: data,
                pointSize,
                pointColor: pointColor || theme.colors.accentPalette[0],
            }];
    }, [series, data, pointSize, pointColor, theme.colors.accentPalette, title]);
    // (Removed per-point animated values to avoid hook-in-loop invalid usage)
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [draggedPoint, setDraggedPoint] = useState(null);
    // Calculate data bounds with some padding
    const computedXDomain = React.useMemo(() => getDataDomain(normalizedSeries.flatMap(s => s.data), d => d.x), [normalizedSeries]);
    const computedYDomain = React.useMemo(() => getDataDomain(normalizedSeries.flatMap(s => s.data), d => d.y), [normalizedSeries]);
    const [xDomainState, setXDomainState] = useState(null);
    const [yDomainState, setYDomainState] = useState(null);
    const rawXDomain = xDomainState || computedXDomain;
    const rawYDomain = yDomainState || computedYDomain;
    const clampToInitial = props.clampToInitialDomain;
    const clampDomain = (domain, base) => {
        if (!clampToInitial)
            return domain;
        const width = domain[1] - domain[0];
        const baseWidth = base[1] - base[0];
        if (width >= baseWidth)
            return base;
        const min = Math.max(base[0], Math.min(domain[0], base[1] - width));
        const max = min + width;
        return [min, max];
    };
    const xDomain = clampDomain(rawXDomain, computedXDomain);
    const yDomain = clampDomain(rawYDomain, computedYDomain);
    // Add some padding to the domain
    const xPadding = (xDomain[1] - xDomain[0]) * 0.1;
    const yPadding = (yDomain[1] - yDomain[0]) * 0.1;
    const paddedXDomain = [xDomain[0] - xPadding, xDomain[1] + xPadding];
    const paddedYDomain = [yDomain[0] - yPadding, yDomain[1] + yPadding];
    // Chart dimensions - adjust padding based on legend position to prevent overlap
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const padding = React.useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const interactionVisibility = useMemo(() => {
        const visibilityMap = new Map();
        interaction === null || interaction === void 0 ? void 0 : interaction.series.forEach((entry) => {
            visibilityMap.set(String(entry.id), entry.visible !== false);
        });
        return visibilityMap;
    }, [interaction === null || interaction === void 0 ? void 0 : interaction.series]);
    const chartSeries = normalizedSeries.map(s => {
        var _a;
        return ({
            ...s,
            visible: (_a = interactionVisibility.get(String(s.id))) !== null && _a !== void 0 ? _a : true,
            pointColor: s.pointColor,
            pointSize: s.pointSize,
            chartPoints: s.data.map((point) => {
                const coords = dataToChartCoordinates(point.x, point.y, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain);
                return { ...point, chartX: coords.x, chartY: coords.y };
            })
        });
    });
    useScatterSeriesRegistration({
        series: chartSeries,
        registerSeries,
    });
    const xTicks = React.useMemo(() => {
        switch (props.xScaleType) {
            case 'log': return generateLogTicks(paddedXDomain, 6);
            case 'time': return generateTimeTicks(paddedXDomain, 6);
            default: return generateTicks(paddedXDomain[0], paddedXDomain[1], 6);
        }
    }, [paddedXDomain, props.xScaleType]);
    const yTicks = React.useMemo(() => {
        switch (props.yScaleType) {
            case 'log': return generateLogTicks(paddedYDomain, 5);
            case 'time': return generateTimeTicks(paddedYDomain, 5);
            default: return generateTicks(paddedYDomain[0], paddedYDomain[1], 5);
        }
    }, [paddedYDomain, props.yScaleType]);
    const axisScaleX = useMemo(() => {
        const range = [0, Math.max(plotWidth, 0)];
        const domain = [...paddedXDomain];
        if (plotWidth <= 0) {
            const scale = ((_) => 0);
            scale.domain = () => domain;
            scale.range = () => [0, 0];
            scale.ticks = () => [...xTicks];
            return scale;
        }
        const scale = ((value) => {
            switch (props.xScaleType) {
                case 'log':
                    return scaleLog(Math.max(value, 1e-12), domain, range);
                case 'time':
                    return scaleTime(value, domain, range);
                default:
                    return scaleLinear(value, domain, range);
            }
        });
        scale.domain = () => domain.slice();
        scale.range = () => range.slice();
        scale.ticks = (count) => {
            if (xTicks.length)
                return xTicks;
            switch (props.xScaleType) {
                case 'log':
                    return generateLogTicks(domain, count !== null && count !== void 0 ? count : 6);
                case 'time':
                    return generateTimeTicks(domain, count !== null && count !== void 0 ? count : 6);
                default:
                    return generateTicks(domain[0], domain[1], count !== null && count !== void 0 ? count : 6);
            }
        };
        return scale;
    }, [plotWidth, paddedXDomain, props.xScaleType, xTicks]);
    const axisScaleY = useMemo(() => {
        const range = [Math.max(plotHeight, 0), 0];
        const domain = [...paddedYDomain];
        if (plotHeight <= 0) {
            const scale = ((_) => 0);
            scale.domain = () => domain;
            scale.range = () => [0, 0];
            scale.ticks = () => [...yTicks];
            return scale;
        }
        const scale = ((value) => {
            switch (props.yScaleType) {
                case 'log':
                    return scaleLog(Math.max(value, 1e-12), domain, range);
                case 'time':
                    return scaleTime(value, domain, range);
                default:
                    return scaleLinear(value, domain, range);
            }
        });
        scale.domain = () => domain.slice();
        scale.range = () => range.slice();
        scale.ticks = (count) => {
            if (yTicks.length)
                return yTicks;
            switch (props.yScaleType) {
                case 'log':
                    return generateLogTicks(domain, count !== null && count !== void 0 ? count : 5);
                case 'time':
                    return generateTimeTicks(domain, count !== null && count !== void 0 ? count : 5);
                default:
                    return generateTicks(domain[0], domain[1], count !== null && count !== void 0 ? count : 5);
            }
        };
        return scale;
    }, [plotHeight, paddedYDomain, props.yScaleType, yTicks]);
    const quadrantVisual = useMemo(() => {
        var _a, _b, _c, _d;
        if (!quadrants)
            return null;
        if (plotWidth <= 0 || plotHeight <= 0)
            return null;
        const { x, y } = quadrants;
        if (x == null || y == null)
            return null;
        const rawX = axisScaleX(x);
        const rawY = axisScaleY(y);
        if (!Number.isFinite(rawX) || !Number.isFinite(rawY))
            return null;
        const clampCoord = (value, max) => Math.min(Math.max(value, 0), max);
        const xCoord = clampCoord(rawX, plotWidth);
        const yCoord = clampCoord(rawY, plotHeight);
        return {
            xCoord,
            yCoord,
            fills: quadrants.fills,
            fillOpacity: Math.min(Math.max((_a = quadrants.fillOpacity) !== null && _a !== void 0 ? _a : 0.08, 0), 1),
            showLines: quadrants.showLines !== false,
            lineColor: quadrants.lineColor || theme.colors.grid,
            lineWidth: Math.max((_b = quadrants.lineWidth) !== null && _b !== void 0 ? _b : 1, 0.5),
            labels: quadrants.labels,
            labelColor: quadrants.labelColor || theme.colors.textSecondary,
            labelFontSize: (_c = quadrants.labelFontSize) !== null && _c !== void 0 ? _c : 11,
            labelOffset: (_d = quadrants.labelOffset) !== null && _d !== void 0 ? _d : 14,
        };
    }, [quadrants, axisScaleX, axisScaleY, plotHeight, plotWidth, theme.colors.grid, theme.colors.textSecondary]);
    const quadrantLayout = useMemo(() => {
        if (!quadrantVisual)
            return null;
        return {
            ...quadrantVisual,
            leftWidth: quadrantVisual.xCoord,
            rightWidth: Math.max(0, plotWidth - quadrantVisual.xCoord),
            topHeight: quadrantVisual.yCoord,
            bottomHeight: Math.max(0, plotHeight - quadrantVisual.yCoord),
        };
    }, [plotHeight, plotWidth, quadrantVisual]);
    const normalizedXTicks = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        return xTicks.map((tick) => {
            const value = axisScaleX(tick);
            if (!Number.isFinite(value) || plotWidth === 0)
                return 0;
            return value / plotWidth;
        });
    }, [xTicks, axisScaleX, plotWidth]);
    const normalizedYTicks = useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return yTicks.map((tick) => {
            const value = axisScaleY(tick);
            if (!Number.isFinite(value) || plotHeight === 0)
                return 0;
            return value / plotHeight;
        });
    }, [yTicks, axisScaleY, plotHeight]);
    const xAxisTickSize = (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _b !== void 0 ? _b : 4;
    const yAxisTickSize = (_c = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _c !== void 0 ? _c : 4;
    const axisTickPadding = 4;
    const resolvedTextColor = theme.colors.textSecondary;
    const nearestPoint = useNearestPoint(chartSeries, paddedXDomain, paddedYDomain, plotWidth, plotHeight);
    const evaluateNearestPoint = useCallback((chartX, chartY) => {
        const res = nearestPoint(chartX, chartY, 30);
        if (res && res.dataPoint) {
            setSelectedPoint(res.dataPoint);
            setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: chartX, y: chartY, inside: true });
            if (enableCrosshair !== false)
                setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: res.dataPoint.x, pixelX: chartX });
        }
    }, [nearestPoint, setPointer, setCrosshair, enableCrosshair]);
    // Regression helpers
    const computeRegression = (pts) => {
        if (pts.length < 2)
            return null;
        const n = pts.length;
        const sumX = pts.reduce((s, p) => s + p.x, 0);
        const sumY = pts.reduce((s, p) => s + p.y, 0);
        const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
        const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
        const denom = n * sumXX - sumX * sumX;
        if (!denom)
            return null;
        const slope = (n * sumXY - sumX * sumY) / denom;
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    };
    const trendlines = React.useMemo(() => {
        if (!showTrendline)
            return [];
        if (showTrendline === 'per-series') {
            return chartSeries.map(s => {
                const reg = computeRegression(s.chartPoints);
                if (!reg)
                    return null;
                const startX = paddedXDomain[0];
                const endX = paddedXDomain[1];
                const startY = reg.slope * startX + reg.intercept;
                const endY = reg.slope * endX + reg.intercept;
                return {
                    id: s.id,
                    color: s.color,
                    start: dataToChartCoordinates(startX, startY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain),
                    end: dataToChartCoordinates(endX, endY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain)
                };
            }).filter(Boolean);
        }
        const all = chartSeries.flatMap(s => s.chartPoints);
        const reg = computeRegression(all);
        if (!reg)
            return [];
        const startX = paddedXDomain[0];
        const endX = paddedXDomain[1];
        const startY = reg.slope * startX + reg.intercept;
        const endY = reg.slope * endX + reg.intercept;
        return [{
                id: 'overall',
                color: trendlineColor || theme.colors.accentPalette[0],
                start: dataToChartCoordinates(startX, startY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain),
                end: dataToChartCoordinates(endX, endY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain)
            }];
    }, [showTrendline, chartSeries, paddedXDomain, paddedYDomain, plotWidth, plotHeight, trendlineColor, theme.colors.accentPalette]);
    // Register scatter points as a single series for unified tooltip
    // Pan/Zoom integration
    const [lastPan, setLastPan] = useState(null);
    const [pinchTracking, setPinchTracking] = useState(false);
    const [lastTapTime, setLastTapTime] = useState(0);
    const panZoom = usePanZoom({ xDomain: xDomain, yDomain: yDomain }, (next) => {
        if (next.xDomain)
            setXDomainState(next.xDomain);
        if (next.yDomain)
            setYDomainState(next.yDomain);
    }, {
        enablePanZoom: props.enablePanZoom,
        zoomMode: props.zoomMode,
        minZoom: props.minZoom,
        wheelZoomStep: props.wheelZoomStep,
        clampDomain: clampDomain,
        baseX: computedXDomain,
        baseY: computedYDomain,
        invertPinchZoom: props.invertPinchZoom,
        invertWheelZoom: props.invertWheelZoom,
    });
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => {
            const native = e.nativeEvent || {};
            const touches = native.touches || [];
            if (props.enablePanZoom && (touches.length === 2 || gestureState.numberActiveTouches === 2)) {
                if (touches.length === 2) {
                    const dx = touches[1].pageX - touches[0].pageX;
                    const dy = touches[1].pageY - touches[0].pageY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    panZoom.startPinch(distance);
                    setPinchTracking(true);
                    return;
                }
            }
            const { locationX, locationY } = native;
            if (typeof locationX === 'number' && typeof locationY === 'number') {
                setLastPan({ x: locationX, y: locationY });
                panZoom.startPan(locationX, locationY);
                evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
            }
        },
        onPanResponderMove: (e, gestureState) => {
            const native = e.nativeEvent || {};
            const touches = native.touches || [];
            const activeTouches = touches.length || gestureState.numberActiveTouches;
            if (props.enablePanZoom && activeTouches === 2) {
                if (!pinchTracking && touches.length === 2) {
                    const dx0 = touches[1].pageX - touches[0].pageX;
                    const dy0 = touches[1].pageY - touches[0].pageY;
                    const startDistance = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                    panZoom.startPinch(startDistance);
                    setPinchTracking(true);
                    return;
                }
                if (pinchTracking && touches.length === 2) {
                    const dx = touches[1].pageX - touches[0].pageX;
                    const dy = touches[1].pageY - touches[0].pageY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    panZoom.updatePinch(distance);
                    return;
                }
            }
            if (props.enablePanZoom && !pinchTracking && lastPan && activeTouches === 1) {
                const { locationX, locationY } = native;
                if (typeof locationX === 'number' && typeof locationY === 'number') {
                    panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
                    setLastPan({ x: locationX, y: locationY });
                    evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
                }
                return;
            }
            if (activeTouches === 1) {
                const { locationX, locationY } = native;
                if (typeof locationX === 'number' && typeof locationY === 'number') {
                    evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
                }
            }
        },
        onPanResponderRelease: () => {
            var _a, _b;
            if (props.resetOnDoubleTap) {
                const now = Date.now();
                if (now - lastTapTime < 300) {
                    setXDomainState(null);
                    setYDomainState(null);
                    setLastTapTime(0);
                    // @ts-ignore
                    (_a = props.onDomainChange) === null || _a === void 0 ? void 0 : _a.call(props, computedXDomain, computedYDomain);
                }
                else {
                    setLastTapTime(now);
                }
            }
            panZoom.endPan();
            setLastPan(null);
            if (pinchTracking) {
                panZoom.endPinch();
                setPinchTracking(false);
            }
            // fire domain change callback after gesture ends
            // @ts-ignore optional
            (_b = props.onDomainChange) === null || _b === void 0 ? void 0 : _b.call(props, xDomain, yDomain);
        },
        onPanResponderTerminationRequest: () => true,
    });
    // Handle chart interaction
    const handlePress = (event) => {
        if (disabled)
            return;
        const { locationX, locationY } = event.nativeEvent;
        const chartX = locationX - padding.left;
        const chartY = locationY - padding.top;
        // Check if we're clicking on an existing point
        const closest = chartSeries.flatMap(s => s.chartPoints.map(p => ({ series: s, p })))
            .reduce((acc, cur) => {
            const dx = cur.p.chartX - chartX;
            const dy = cur.p.chartY - chartY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const threshold = (cur.p.size || pointSize) + 6;
            if (dist <= threshold) {
                if (!acc || dist < acc.distance)
                    return { distance: dist, point: cur.p };
            }
            return acc;
        }, null);
        if (closest) {
            setSelectedPoint(closest.point);
            const interactionEvent = {
                nativeEvent: event,
                chartX,
                chartY,
                dataPoint: closest.point,
                distance: closest.distance,
            };
            onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(closest.point, interactionEvent);
            setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: chartX, y: chartY, inside: true });
            if (enableCrosshair !== false)
                setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: closest.point.x, pixelX: chartX });
        }
        else if (allowAddPoints && chartX >= 0 && chartX <= plotWidth && chartY >= 0 && chartY <= plotHeight) {
            // Add new point
            const dataCoords = chartToDataCoordinates(chartX, chartY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain);
            const newPoint = {
                id: Date.now(),
                x: Math.round(dataCoords.x * 100) / 100,
                y: Math.round(dataCoords.y * 100) / 100,
                color: pointColor || getColorFromScheme(data.length, colorSchemes.default),
            };
            setData([...data, newPoint]);
            setSelectedPoint(newPoint);
            setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: chartX, y: chartY, inside: true });
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: newPoint.x, pixelX: chartX });
        }
        const interactionEvent = {
            nativeEvent: event,
            chartX,
            chartY,
        };
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    };
    // Ticks already computed earlier (xTicks, yTicks)
    return (jsxs(Fragment, { children: [(title || subtitle) && (jsx(ChartTitle, { title: title, subtitle: subtitle })), grid && (jsx(ChartGrid, { grid: typeof grid === 'object' ? grid : { show: true, showMajor: true, showMinor: false }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: false })), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTicks.length, tickSize: xAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter)
                        return xAxis.labelFormatter(numeric);
                    if (props.xScaleType === 'time')
                        return new Date(numeric).toLocaleDateString();
                    return formatNumber$2(numeric);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_d = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _d !== void 0 ? _d : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_e = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _e !== void 0 ? _e : 12) + 20 : 40, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || resolvedTextColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTicks.length, tickSize: yAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter)
                        return yAxis.labelFormatter(numeric);
                    if (props.yScaleType === 'time')
                        return new Date(numeric).toLocaleDateString();
                    return formatNumber$2(numeric);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _f !== void 0 ? _f : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_g = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _g !== void 0 ? _g : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || resolvedTextColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, ...(!isWeb ? panResponder.panHandlers : {}), ...(!isWeb
                    ? {
                        onStartShouldSetResponder: () => true,
                        onMoveShouldSetResponder: () => true,
                    }
                    : {}), 
                // @ts-ignore web-only hover support
                onMouseMove: (e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    if ((props.enablePanZoom) && (e.buttons === 1)) { // actively dragging
                        panZoom.updatePan(x, y, plotWidth, plotHeight);
                    }
                    else {
                        evaluateNearestPoint(x, y);
                    }
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
                    if (enableCrosshair !== false) {
                        const dataX = xDomain[0] + (x / plotWidth) * (xDomain[1] - xDomain[0]);
                        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX, pixelX: x });
                    }
                }, 
                // @ts-ignore
                onMouseLeave: () => { setPointer === null || setPointer === void 0 ? void 0 : setPointer((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) ? { ...interaction.pointer, inside: false } : null); setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null); panZoom.endPan(); }, 
                // @ts-ignore
                onMouseDown: (e) => {
                    if (!props.enablePanZoom)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    panZoom.startPan(x, y);
                }, 
                // @ts-ignore
                onMouseUp: () => {
                    var _a;
                    if (!props.enablePanZoom)
                        return;
                    panZoom.endPan();
                    // @ts-ignore
                    (_a = props.onDomainChange) === null || _a === void 0 ? void 0 : _a.call(props, xDomain, yDomain);
                }, 
                // @ts-ignore wheel
                onWheel: props.enableWheelZoom ? (e) => {
                    var _a;
                    if (!props.enablePanZoom)
                        return;
                    if (e.cancelable)
                        e.preventDefault();
                    (_a = e.stopPropagation) === null || _a === void 0 ? void 0 : _a.call(e);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pointerX = (e.clientX - rect.left);
                    const pointerY = (e.clientY - rect.top);
                    panZoom.wheelZoom(e.deltaY, pointerX / plotWidth, pointerY / plotHeight);
                } : undefined, children: jsxs(Pressable, { onPress: handlePress, style: { flex: 1 }, android_disableSound: true, ...(!isWeb ? panResponder.panHandlers : {}), collapsable: false, children: [quadrantLayout && (jsxs(Fragment, { children: [((_h = quadrantLayout.fills) === null || _h === void 0 ? void 0 : _h.topLeft) && quadrantLayout.leftWidth > 0 && quadrantLayout.topHeight > 0 && (jsx(View, { pointerEvents: "none", style: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: quadrantLayout.leftWidth,
                                        height: quadrantLayout.topHeight,
                                        backgroundColor: quadrantLayout.fills.topLeft,
                                        opacity: quadrantLayout.fillOpacity,
                                        zIndex: -1,
                                    } })), ((_j = quadrantLayout.fills) === null || _j === void 0 ? void 0 : _j.topRight) && quadrantLayout.rightWidth > 0 && quadrantLayout.topHeight > 0 && (jsx(View, { pointerEvents: "none", style: {
                                        position: 'absolute',
                                        left: quadrantLayout.xCoord,
                                        top: 0,
                                        width: quadrantLayout.rightWidth,
                                        height: quadrantLayout.topHeight,
                                        backgroundColor: quadrantLayout.fills.topRight,
                                        opacity: quadrantLayout.fillOpacity,
                                        zIndex: -1,
                                    } })), ((_k = quadrantLayout.fills) === null || _k === void 0 ? void 0 : _k.bottomLeft) && quadrantLayout.leftWidth > 0 && quadrantLayout.bottomHeight > 0 && (jsx(View, { pointerEvents: "none", style: {
                                        position: 'absolute',
                                        left: 0,
                                        top: quadrantLayout.yCoord,
                                        width: quadrantLayout.leftWidth,
                                        height: quadrantLayout.bottomHeight,
                                        backgroundColor: quadrantLayout.fills.bottomLeft,
                                        opacity: quadrantLayout.fillOpacity,
                                        zIndex: -1,
                                    } })), ((_l = quadrantLayout.fills) === null || _l === void 0 ? void 0 : _l.bottomRight) && quadrantLayout.rightWidth > 0 && quadrantLayout.bottomHeight > 0 && (jsx(View, { pointerEvents: "none", style: {
                                        position: 'absolute',
                                        left: quadrantLayout.xCoord,
                                        top: quadrantLayout.yCoord,
                                        width: quadrantLayout.rightWidth,
                                        height: quadrantLayout.bottomHeight,
                                        backgroundColor: quadrantLayout.fills.bottomRight,
                                        opacity: quadrantLayout.fillOpacity,
                                        zIndex: -1,
                                    } })), quadrantLayout.showLines && (jsxs(Fragment, { children: [jsx(View, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                left: Math.min(Math.max(quadrantLayout.xCoord - quadrantLayout.lineWidth / 2, 0), Math.max(plotWidth - quadrantLayout.lineWidth, 0)),
                                                top: 0,
                                                width: quadrantLayout.lineWidth,
                                                height: plotHeight,
                                                backgroundColor: quadrantLayout.lineColor,
                                                opacity: 0.5,
                                            } }), jsx(View, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                left: 0,
                                                top: Math.min(Math.max(quadrantLayout.yCoord - quadrantLayout.lineWidth / 2, 0), Math.max(plotHeight - quadrantLayout.lineWidth, 0)),
                                                width: plotWidth,
                                                height: quadrantLayout.lineWidth,
                                                backgroundColor: quadrantLayout.lineColor,
                                                opacity: 0.5,
                                            } })] })), quadrantLayout.labels && (jsxs(Fragment, { children: [quadrantLayout.labels.topLeft && (jsx(Text, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                left: quadrantLayout.labelOffset,
                                                top: quadrantLayout.labelOffset,
                                                color: quadrantLayout.labelColor,
                                                fontSize: quadrantLayout.labelFontSize,
                                                fontFamily: theme.fontFamily,
                                            }, children: quadrantLayout.labels.topLeft })), quadrantLayout.labels.topRight && (jsx(Text, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                right: quadrantLayout.labelOffset,
                                                top: quadrantLayout.labelOffset,
                                                color: quadrantLayout.labelColor,
                                                fontSize: quadrantLayout.labelFontSize,
                                                fontFamily: theme.fontFamily,
                                                textAlign: 'right',
                                            }, children: quadrantLayout.labels.topRight })), quadrantLayout.labels.bottomLeft && (jsx(Text, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                left: quadrantLayout.labelOffset,
                                                bottom: quadrantLayout.labelOffset,
                                                color: quadrantLayout.labelColor,
                                                fontSize: quadrantLayout.labelFontSize,
                                                fontFamily: theme.fontFamily,
                                            }, children: quadrantLayout.labels.bottomLeft })), quadrantLayout.labels.bottomRight && (jsx(Text, { pointerEvents: "none", style: {
                                                position: 'absolute',
                                                right: quadrantLayout.labelOffset,
                                                bottom: quadrantLayout.labelOffset,
                                                color: quadrantLayout.labelColor,
                                                fontSize: quadrantLayout.labelFontSize,
                                                fontFamily: theme.fontFamily,
                                                textAlign: 'right',
                                            }, children: quadrantLayout.labels.bottomRight }))] }))] })), trendlines.map(tl => tl && (jsx(View, { style: {
                                position: 'absolute',
                                left: tl.start.x,
                                top: tl.start.y,
                                width: distance(tl.start.x, tl.start.y, tl.end.x, tl.end.y),
                                height: 2,
                                backgroundColor: tl.color,
                                opacity: 0.6,
                                transform: [{
                                        rotate: `${Math.atan2(tl.end.y - tl.start.y, tl.end.x - tl.start.x) * 180 / Math.PI}deg`
                                    }],
                                transformOrigin: 'left center',
                                pointerEvents: 'none'
                            } }, `trend-${tl.id}`))), chartSeries.map(s => s.visible !== false ? s.chartPoints.map((point, index) => {
                            const isSelected = (selectedPoint === null || selectedPoint === void 0 ? void 0 : selectedPoint.id) === point.id;
                            const isDragged = (draggedPoint === null || draggedPoint === void 0 ? void 0 : draggedPoint.id) === point.id;
                            const seriesPointSize = typeof s.pointSize === 'number' && Number.isFinite(s.pointSize) ? s.pointSize : pointSize;
                            const rawPointSize = typeof point.size === 'number' && Number.isFinite(point.size) ? point.size : seriesPointSize;
                            const resolvedPointSize = Math.max(2, rawPointSize);
                            return (jsx(AnimatedScatterPoint, { point: point, pointSize: resolvedPointSize, pointOpacity: pointOpacity, isSelected: isSelected, isDragged: isDragged, index: index, disabled: disabled, theme: theme, colorScheme: theme.colors.accentPalette, fallbackColor: s.pointColor || pointColor }, `point-${s.id}-${point.id || index}`));
                        }) : null), crosshairEnabled && (interaction === null || interaction === void 0 ? void 0 : interaction.crosshair) && plotHeight > 0 && (jsx(View, { pointerEvents: "none", style: {
                                position: 'absolute',
                                left: Math.max(0, Math.min(plotWidth - 1, interaction.crosshair.pixelX)),
                                top: 0,
                                height: plotHeight,
                                width: 1,
                                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
                            } })), crosshairEnabled && ((_m = interaction === null || interaction === void 0 ? void 0 : interaction.pointer) === null || _m === void 0 ? void 0 : _m.inside) && typeof ((_o = interaction.pointer) === null || _o === void 0 ? void 0 : _o.y) === 'number' && plotWidth > 0 && (jsx(View, { pointerEvents: "none", style: {
                                position: 'absolute',
                                left: 0,
                                top: Math.max(0, Math.min(plotHeight - 1, interaction.pointer.y)),
                                width: plotWidth,
                                height: 1,
                                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
                            } })), selectedPoint && (tooltip === null || tooltip === void 0 ? void 0 : tooltip.show) !== false && !multiTooltip && (() => {
                            var _a;
                            const selectedChartPoint = chartSeries.flatMap(s => s.chartPoints).find(p => p.id === selectedPoint.id);
                            if (!selectedChartPoint)
                                return null;
                            return (jsx(View, { style: {
                                    position: 'absolute',
                                    left: selectedChartPoint.chartX,
                                    top: selectedChartPoint.chartY - 50,
                                    backgroundColor: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.backgroundColor) || theme.colors.background,
                                    padding: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.padding) || 8,
                                    borderRadius: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.borderRadius) || 4,
                                    alignItems: 'center',
                                    transform: [{ translateX: -50 }], // Center the tooltip
                                }, children: jsx(Text, { style: {
                                        fontSize: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.fontSize) || 12,
                                        color: (tooltip === null || tooltip === void 0 ? void 0 : tooltip.textColor) || theme.colors.textPrimary,
                                        fontFamily: theme.fontFamily,
                                    }, children: ((_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) === null || _a === void 0 ? void 0 : _a.call(tooltip, selectedPoint)) ||
                                        (selectedPoint.label
                                            ? `${selectedPoint.label}: ${formatNumber$2(selectedPoint.x)}, ${formatNumber$2(selectedPoint.y)}`
                                            : `(${formatNumber$2(selectedPoint.x)}, ${formatNumber$2(selectedPoint.y)})`) }) }));
                        })()] }) }), (allowAddPoints || allowDragPoints) && (jsx(View, { style: {
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    right: 10,
                    alignItems: 'center',
                }, children: jsxs(Text, { style: {
                        fontSize: 10,
                        color: theme.colors.textSecondary,
                        fontFamily: theme.fontFamily,
                        textAlign: 'center',
                    }, children: [allowAddPoints && 'Tap to add points', allowAddPoints && allowDragPoints && ' • ', allowDragPoints && 'Drag to move points'] }) })), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: chartSeries.map((s, i) => ({
                    label: s.name || `Series ${i + 1}`,
                    color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
                    visible: s.visible !== false,
                })), position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: (item, index, nativeEvent) => {
                    const target = chartSeries[index];
                    if (!target || !updateSeriesVisibility)
                        return;
                    const current = target.visible !== false;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visibleIds = chartSeries.filter(s => s.visible !== false).map(s => s.id);
                        const isSole = visibleIds.length === 1 && visibleIds[0] === target.id;
                        chartSeries.forEach(s => updateSeriesVisibility(s.id, isSole ? true : s.id === target.id));
                    }
                    else {
                        updateSeriesVisibility(target.id, !current);
                    }
                } }))] }));
};
const ScatterChart = (props) => {
    const { width = 400, height = 300, disabled = false, animationDuration = 800, animationEasing, style, multiTooltip, enableCrosshair, liveTooltip, useOwnInteractionProvider, suppressPopover, testID, } = props;
    const popoverProps = props.popoverProps;
    const spacingProps = {};
    const spacingSource = props;
    SPACING_PROP_KEYS.forEach((key) => {
        const value = spacingSource[key];
        if (value != null) {
            spacingProps[key] = value;
        }
    });
    const interactionConfig = useMemo(() => ({
        multiTooltip,
        enableCrosshair: enableCrosshair !== false,
        liveTooltip: liveTooltip !== false,
        enablePanZoom: props.enablePanZoom,
        zoomMode: props.zoomMode,
        minZoom: props.minZoom,
        wheelZoomStep: props.wheelZoomStep,
        resetOnDoubleTap: props.resetOnDoubleTap,
        clampToInitialDomain: props.clampToInitialDomain,
        invertPinchZoom: props.invertPinchZoom,
        invertWheelZoom: props.invertWheelZoom,
    }), [
        multiTooltip,
        enableCrosshair,
        liveTooltip,
        props.enablePanZoom,
        props.zoomMode,
        props.minZoom,
        props.wheelZoomStep,
        props.resetOnDoubleTap,
        props.clampToInitialDomain,
        props.invertPinchZoom,
        props.invertWheelZoom,
    ]);
    return (jsx(ChartContainer, { width: width, height: height, disabled: disabled, animationDuration: animationDuration, animationEasing: animationEasing, style: style, interactionConfig: interactionConfig, useOwnInteractionProvider: useOwnInteractionProvider, suppressPopover: suppressPopover, testID: testID, popoverProps: popoverProps, ...spacingProps, children: jsx(ScatterChartInner, { ...props, width: width, height: height, disabled: disabled, animationDuration: animationDuration }) }));
};
ScatterChart.displayName = 'ScatterChart';

// Create animated SVG components
const AnimatedPath$9 = Animated$1.createAnimatedComponent(Path);
// Custom hook for stacked data processing
const useStackedData = (series, stackOrder, interaction) => {
    return useMemo(() => {
        const xValues = Array.from(new Set(series.filter(s => s.visible !== false).flatMap(s => s.data.map(p => p.x)))).sort((a, b) => a - b);
        const order = stackOrder === 'reverse' ? [...series].reverse() : series;
        const layers = [];
        const runningTotals = new Array(xValues.length).fill(0);
        order.forEach((s, si) => {
            var _a, _b, _c;
            const overriddenVisible = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => { var _a; return sr.id === ((_a = s.id) !== null && _a !== void 0 ? _a : si); })) === null || _a === void 0 ? void 0 : _a.visible;
            if (s.visible === false || overriddenVisible === false)
                return;
            const color = s.color || getColorFromScheme(si, colorSchemes.default);
            const points = xValues.map((x, idx) => {
                const raw = s.data.find(p => p.x === x);
                const val = raw ? raw.y : 0;
                const y0 = runningTotals[idx];
                const y1 = y0 + val;
                runningTotals[idx] = y1;
                return {
                    x,
                    y0,
                    y1,
                    raw: raw || { x, y: 0 },
                    absoluteY0: y0,
                    absoluteY1: y1,
                };
            });
            layers.push({
                id: (_b = s.id) !== null && _b !== void 0 ? _b : si,
                name: s.name,
                color,
                points,
                visible: overriddenVisible !== undefined ? overriddenVisible : ((_c = s.visible) !== null && _c !== void 0 ? _c : true)
            });
        });
        return { layers, totals: runningTotals, xValues };
    }, [series, stackOrder, interaction === null || interaction === void 0 ? void 0 : interaction.series]);
};
// Custom hook for generating area paths
const useStackedAreaPaths = (layers, scaleX, scaleY, smooth) => {
    return useMemo(() => {
        return layers.map((layer, index) => {
            const topPoints = layer.points.map(p => ({ x: scaleX(p.x), y: scaleY(p.y1) }));
            const bottomPoints = [...layer.points].reverse().map(p => ({ x: scaleX(p.x), y: scaleY(p.y0) }));
            let path = '';
            if (topPoints.length > 0) {
                if (smooth) {
                    // For smooth curves, we need to create a proper area path
                    const topPath = createSmoothPath(topPoints);
                    const bottomPath = createSmoothPath(bottomPoints);
                    // Extract the path commands without the initial M
                    const topCommands = topPath.replace(/^M\s*/, '');
                    const bottomCommands = bottomPath.replace(/^M\s*/, '');
                    path = `M ${topPoints[0].x} ${topPoints[0].y} ${topCommands} L ${bottomPoints[0].x} ${bottomPoints[0].y} ${bottomCommands} Z`;
                }
                else {
                    // Linear path
                    path = `M ${topPoints[0].x} ${topPoints[0].y}`;
                    for (let i = 1; i < topPoints.length; i++) {
                        path += ` L ${topPoints[i].x} ${topPoints[i].y}`;
                    }
                    for (let i = 0; i < bottomPoints.length; i++) {
                        path += ` L ${bottomPoints[i].x} ${bottomPoints[i].y}`;
                    }
                    path += ' Z';
                }
            }
            return {
                id: layer.id,
                name: layer.name,
                color: layer.color,
                path,
                smooth,
                points: layer.points,
                visible: layer.visible,
                index
            };
        });
    }, [layers, scaleX, scaleY, smooth]);
};
// AnimatedStackedArea component - encapsulates animation logic
const AnimatedStackedArea = React.memo(({ layer, opacity, animationProgress, disabled, onHover, onHoverOut }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            return;
        }
        const delay = layer.index * 100; // Stagger animation by layer index
        scale.value = withDelay(delay, withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, layer.index, scale]);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value * scale.value;
        const finalOpacity = opacity * (1 - layer.index * 0.05); // Slight opacity variation by layer
        return {
            d: layer.path,
            opacity: progress * finalOpacity,
        };
    }, [layer.path, opacity, layer.index]);
    const isWeb = Platform.OS === 'web';
    return (jsx(G, { ...(isWeb ? {
            // @ts-ignore web events
            onMouseEnter: onHover,
            // @ts-ignore web events
            onMouseLeave: onHoverOut,
        } : {}), children: jsx(AnimatedPath$9, { animatedProps: animatedProps, fill: layer.color, stroke: layer.color, strokeWidth: 1 }) }));
});
AnimatedStackedArea.displayName = 'AnimatedStackedArea';
const StackedAreaChart = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const { series, width = 400, height = 300, title, subtitle, xAxis, yAxis, grid, legend, smooth = true, opacity = 0.55, stackMode = 'absolute', xScaleType = 'linear', yScaleType = 'linear', animationDuration = 800, style, enableCrosshair, liveTooltip, multiTooltip, enablePanZoom, zoomMode, minZoom, enableWheelZoom, wheelZoomStep, invertWheelZoom, resetOnDoubleTap, clampToInitialDomain, invertPinchZoom, annotations, disabled = false, stackOrder = 'normal', ...rest } = props;
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_g) {
        interaction = null;
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    // Use custom hooks for data processing
    const stackedData = useStackedData(series, stackOrder, interaction);
    const { layers: rawLayers, totals, xValues } = stackedData;
    const layers = useMemo(() => {
        if (stackMode !== 'percentage') {
            return rawLayers;
        }
        return rawLayers.map((layer) => {
            const normalizedPoints = layer.points.map((point, idx) => {
                const total = totals[idx];
                if (!total) {
                    return {
                        ...point,
                        y0: 0,
                        y1: 0,
                    };
                }
                return {
                    ...point,
                    y0: point.absoluteY0 / total,
                    y1: point.absoluteY1 / total,
                };
            });
            return {
                ...layer,
                points: normalizedPoints,
            };
        });
    }, [rawLayers, totals, stackMode]);
    const yMax = useMemo(() => (stackMode === 'percentage' ? 1 : Math.max(1, ...totals)), [stackMode, totals]);
    const xDomain = useMemo(() => { var _a, _b; return [(_a = xValues[0]) !== null && _a !== void 0 ? _a : 0, (_b = xValues[xValues.length - 1]) !== null && _b !== void 0 ? _b : 1]; }, [xValues]);
    const yDomain = useMemo(() => [0, yMax], [yMax]);
    // Adjust padding based on legend position to prevent overlap with axis labels
    const basePadding = useMemo(() => ({ top: 40, right: 20, bottom: 60, left: 80 }), []);
    const padding = useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position, basePadding]);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    // Scale functions
    const scaleX = useCallback((v) => {
        switch (xScaleType) {
            case 'log': return scaleLog(Math.max(v, 1e-12), xDomain, [0, plotWidth]);
            case 'time': return scaleTime(v, xDomain, [0, plotWidth]);
            default: return scaleLinear(v, xDomain, [0, plotWidth]);
        }
    }, [xScaleType, xDomain, plotWidth]);
    const scaleY = useCallback((v) => {
        switch (yScaleType) {
            case 'log': return scaleLog(Math.max(v, 1e-12), yDomain, [plotHeight, 0]);
            case 'time': return scaleTime(v, yDomain, [plotHeight, 0]);
            default: return scaleLinear(v, yDomain, [plotHeight, 0]);
        }
    }, [yScaleType, yDomain, plotHeight]);
    // Generate area paths using custom hook
    const areaPaths = useStackedAreaPaths(layers, scaleX, scaleY, smooth);
    // Animation
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        return layers.map(l => `${l.id}-${l.color}-${l.points.map(p => `${p.x}:${p.y1}`).join(',')}`).join('|');
    }, [layers]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    // Series registration with memoization and signature guard
    const seriesRegistrations = useMemo(() => {
        return layers.map((layer, index) => ({
            id: layer.id,
            name: layer.name || `Series ${index + 1}`,
            color: layer.color,
            points: layer.points.map((p) => ({
                x: p.x,
                y: p.y1 - p.y0, // The actual value for this layer
                meta: {
                    raw: p.raw,
                    y0: p.y0,
                    y1: p.y1,
                    absoluteY0: p.absoluteY0,
                    absoluteY1: p.absoluteY1,
                    absoluteValue: p.absoluteY1 - p.absoluteY0,
                    percentage: stackMode === 'percentage' ? (p.y1 - p.y0) : undefined,
                },
            })),
            visible: layer.visible,
        }));
    }, [layers, stackMode]);
    const registrationSignature = useMemo(() => {
        if (!seriesRegistrations.length)
            return null;
        return seriesRegistrations
            .map((payload) => {
            const pointsSignature = payload.points
                .map((point) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                const meta = (_a = point.meta) === null || _a === void 0 ? void 0 : _a.raw;
                const metaId = (_b = meta === null || meta === void 0 ? void 0 : meta.id) !== null && _b !== void 0 ? _b : `${(_c = meta === null || meta === void 0 ? void 0 : meta.x) !== null && _c !== void 0 ? _c : ''}:${(_d = meta === null || meta === void 0 ? void 0 : meta.y) !== null && _d !== void 0 ? _d : ''}`;
                return `${point.x}:${point.y}:${metaId}:${(_f = (_e = point.meta) === null || _e === void 0 ? void 0 : _e.y0) !== null && _f !== void 0 ? _f : ''}:${(_h = (_g = point.meta) === null || _g === void 0 ? void 0 : _g.y1) !== null && _h !== void 0 ? _h : ''}:${(_k = (_j = point.meta) === null || _j === void 0 ? void 0 : _j.absoluteY0) !== null && _k !== void 0 ? _k : ''}:${(_m = (_l = point.meta) === null || _l === void 0 ? void 0 : _l.absoluteY1) !== null && _m !== void 0 ? _m : ''}`;
            })
                .join('|');
            return `${payload.id}:${payload.name}:${payload.color}:${payload.visible ? 1 : 0}:${pointsSignature}`;
        })
            .join('||');
    }, [seriesRegistrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !seriesRegistrations.length || !registrationSignature)
            return;
        if (registeredSignatureRef.current === registrationSignature)
            return;
        seriesRegistrations.forEach((payload) => registerSeries(payload));
        registeredSignatureRef.current = registrationSignature;
    }, [registerSeries, seriesRegistrations, registrationSignature]);
    useEffect(() => {
        if (!seriesRegistrations.length) {
            registeredSignatureRef.current = null;
        }
    }, [seriesRegistrations.length]);
    // Generate ticks and scales for axes
    const xTicks = useMemo(() => generateTicks(xDomain[0], xDomain[1], 6), [xDomain]);
    const yTicks = useMemo(() => generateTicks(yDomain[0], yDomain[1], 5), [yDomain]);
    const normXTicks = useMemo(() => xTicks.map(t => (plotWidth > 0 ? scaleX(t) / plotWidth : 0)), [xTicks, scaleX, plotWidth]);
    const normYTicks = useMemo(() => yTicks.map(t => (plotHeight > 0 ? scaleY(t) / plotHeight : 0)), [yTicks, scaleY, plotHeight]);
    const axisScaleX = useMemo(() => {
        const range = [0, Math.max(plotWidth, 0)];
        const scale = ((value) => scaleX(value));
        scale.domain = () => [...xDomain];
        scale.range = () => [...range];
        scale.ticks = (count) => (xTicks.length ? xTicks : generateTicks(xDomain[0], xDomain[1], count !== null && count !== void 0 ? count : 6));
        return scale;
    }, [scaleX, plotWidth, xDomain, xTicks]);
    const axisScaleY = useMemo(() => {
        const range = [Math.max(plotHeight, 0), 0];
        const scale = ((value) => scaleY(value));
        scale.domain = () => [...yDomain];
        scale.range = () => [...range];
        scale.ticks = (count) => (yTicks.length ? yTicks : generateTicks(yDomain[0], yDomain[1], count !== null && count !== void 0 ? count : 5));
        return scale;
    }, [scaleY, plotHeight, yDomain, yTicks]);
    // Interaction handling
    const handleAreaHover = useCallback((layerIndex) => {
        if (!setPointer || !setCrosshair)
            return;
        const layer = areaPaths[layerIndex];
        if (!layer)
            return;
        // Simple hover implementation - can be enhanced with more sophisticated hit detection
        setPointer({
            x: plotWidth / 2,
            y: plotHeight / 2,
            inside: true,
            pageX: plotWidth / 2,
            pageY: plotHeight / 2,
        });
        setCrosshair({ dataX: layerIndex, pixelX: plotWidth / 2 });
    }, [areaPaths, setPointer, setCrosshair, plotWidth, plotHeight]);
    const handleAreaHoverOut = useCallback(() => {
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        if ((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) && setPointer) {
            setPointer({ ...interaction.pointer, inside: false });
        }
    }, [setCrosshair, setPointer, interaction === null || interaction === void 0 ? void 0 : interaction.pointer]);
    const theme = useChartTheme();
    const xAxisTickSize = (_a = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _a !== void 0 ? _a : 4;
    const yAxisTickSize = (_b = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _b !== void 0 ? _b : 4;
    const axisTickPadding = 4;
    const resolvedTextColor = theme.colors.textSecondary;
    const legendItems = layers.map(l => ({
        label: l.name || String(l.id),
        color: l.color,
        visible: l.visible
    }));
    return (jsxs(ChartContainer, { width: width, height: height, disabled: disabled, animationDuration: animationDuration, style: style, interactionConfig: {
            enablePanZoom,
            zoomMode,
            minZoom,
            enableWheelZoom,
            wheelZoomStep,
            resetOnDoubleTap,
            clampToInitialDomain,
            invertPinchZoom,
            invertWheelZoom,
            enableCrosshair,
            liveTooltip,
            multiTooltip
        }, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normXTicks, yTicks: normYTicks, padding: padding, useSVG: true })), jsxs(Svg, { style: { position: 'absolute', left: padding.left, top: padding.top }, width: plotWidth, height: plotHeight, 
                // @ts-ignore web events
                onMouseMove: (e) => {
                    if (!(interaction === null || interaction === void 0 ? void 0 : interaction.setPointer))
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    interaction.setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
                    // Basic crosshair support
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: x / plotWidth, pixelX: x });
                }, 
                // @ts-ignore web events
                onMouseLeave: () => {
                    var _a;
                    if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer)
                        (_a = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer) === null || _a === void 0 ? void 0 : _a.call(interaction, { ...interaction.pointer, inside: false });
                }, children: [jsx(Defs, { children: areaPaths.map((area, index) => (jsxs(LinearGradient, { id: `fillGradient-${area.id}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [jsx(Stop, { offset: "0%", stopColor: area.color, stopOpacity: opacity }), jsx(Stop, { offset: "100%", stopColor: area.color, stopOpacity: opacity * 0.5 })] }, `gradient-${area.id}`))) }), jsx(G, { children: areaPaths.map((area, index) => {
                            var _a;
                            const visible = ((_a = layers.find(l => l.id === area.id)) === null || _a === void 0 ? void 0 : _a.visible) !== false;
                            if (!visible)
                                return null;
                            return (jsx(AnimatedStackedArea, { layer: area, opacity: opacity, animationProgress: animationProgress, disabled: disabled, onHover: () => handleAreaHover(index), onHoverOut: handleAreaHoverOut }, area.id));
                        }) })] }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTicks.length, tickSize: xAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter)
                        return xAxis.labelFormatter(numeric);
                    if (xScaleType === 'time')
                        return new Date(numeric).toLocaleDateString();
                    return formatNumber$2(numeric);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _c !== void 0 ? _c : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_d = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _d !== void 0 ? _d : 12) + 20 : 40, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || resolvedTextColor, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTicks.length, tickSize: yAxisTickSize, tickPadding: axisTickPadding, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter)
                        return yAxis.labelFormatter(numeric);
                    if (yScaleType === 'time')
                        return new Date(numeric).toLocaleDateString();
                    return formatNumber$2(numeric);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _e !== void 0 ? _e : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _f !== void 0 ? _f : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || resolvedTextColor, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), (legend === null || legend === void 0 ? void 0 : legend.show) !== false && (jsx(ChartLegend, { items: legendItems, position: legend === null || legend === void 0 ? void 0 : legend.position, align: legend === null || legend === void 0 ? void 0 : legend.align, onItemPress: (item, index, nativeEvent) => {
                    const layer = layers[index];
                    if (!layer || !updateSeriesVisibility)
                        return;
                    const id = layer.id;
                    const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === id);
                    const current = override ? override.visible !== false : true;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visibleIds = layers
                            .filter((l) => {
                            const layerOverride = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === l.id);
                            return layerOverride ? layerOverride.visible !== false : true;
                        })
                            .map(l => l.id);
                        const isSole = visibleIds.length === 1 && visibleIds[0] === id;
                        layers.forEach((l) => updateSeriesVisibility(l.id, isSole ? true : l.id === id));
                    }
                    else {
                        updateSeriesVisibility(id, !current);
                    }
                } }))] }));
};
StackedAreaChart.displayName = 'StackedAreaChart';

// Enhanced wrapper that can render overlap or stacked area layouts.
const AreaChart = (props) => {
    const { layout = 'overlap', areaOpacity, stackOrder, series, data, fill, smooth, fillOpacity, areaFillMode, ...lineProps } = props;
    const resolvedFill = fill !== null && fill !== void 0 ? fill : true;
    const resolvedSmooth = smooth !== null && smooth !== void 0 ? smooth : true;
    const resolvedFillOpacity = fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 0.35;
    const hasMultiSeries = Array.isArray(series) && series.length > 0;
    const isStackedLayout = layout === 'stacked' || layout === 'stackedPercentage';
    if (isStackedLayout && hasMultiSeries) {
        return (jsx(StackedAreaChart, { ...lineProps, series: series, smooth: resolvedSmooth, opacity: areaOpacity !== null && areaOpacity !== void 0 ? areaOpacity : resolvedFillOpacity, stackOrder: stackOrder, stackMode: layout === 'stackedPercentage' ? 'percentage' : 'absolute' }));
    }
    return (jsx(LineChart, { ...lineProps, data: hasMultiSeries ? undefined : data, series: hasMultiSeries ? series : undefined, fill: resolvedFill, smooth: resolvedSmooth, fillOpacity: resolvedFillOpacity, areaFillMode: areaFillMode !== null && areaFillMode !== void 0 ? areaFillMode : (hasMultiSeries ? 'series' : 'single') }));
};
AreaChart.displayName = 'AreaChart';

const AnimatedCandle = React.memo(({ candle, colorBull, colorBear, wickColor, isSelected = false, index, disabled = false, theme, }) => {
    const bodyHeight = useSharedValue(Math.max(1, candle.bodyHeight));
    const bodyTop = useSharedValue(candle.bodyTop);
    const bodyOpacity = useSharedValue(disabled ? 1 : 0);
    const wickHeight = useSharedValue(Math.max(1, candle.wickY2 - candle.wickY1));
    const wickTop = useSharedValue(candle.wickY1);
    const wickOpacity = useSharedValue(disabled ? 1 : 0);
    const selectionScale = useSharedValue(isSelected ? 1.08 : 1);
    useEffect(() => {
        if (disabled) {
            bodyHeight.value = Math.max(1, candle.bodyHeight);
            bodyTop.value = candle.bodyTop;
            bodyOpacity.value = 1;
            wickHeight.value = Math.max(1, candle.wickY2 - candle.wickY1);
            wickTop.value = candle.wickY1;
            wickOpacity.value = 1;
            return;
        }
        const delay = index * 20; // Staggered animation
        bodyOpacity.value = withDelay(delay, withTiming(1, {
            duration: 320,
            easing: Easing.out(Easing.cubic),
        }));
        bodyHeight.value = withDelay(delay, withTiming(Math.max(1, candle.bodyHeight), {
            duration: 420,
            easing: Easing.out(Easing.cubic),
        }));
        bodyTop.value = withDelay(delay, withTiming(candle.bodyTop, {
            duration: 420,
            easing: Easing.out(Easing.cubic),
        }));
        wickOpacity.value = withDelay(delay + 80, withTiming(1, {
            duration: 260,
            easing: Easing.out(Easing.quad),
        }));
        wickHeight.value = withDelay(delay + 80, withTiming(Math.max(1, candle.wickY2 - candle.wickY1), {
            duration: 360,
            easing: Easing.out(Easing.quad),
        }));
        wickTop.value = withDelay(delay + 80, withTiming(candle.wickY1, {
            duration: 360,
            easing: Easing.out(Easing.quad),
        }));
    }, [disabled, index, candle.bodyHeight, candle.bodyTop, candle.wickY1, candle.wickY2]);
    useEffect(() => {
        selectionScale.value = withTiming(isSelected ? 1.08 : 1, {
            duration: 150,
            easing: Easing.out(Easing.ease),
        });
    }, [isSelected, selectionScale]);
    // Determine if bullish or bearish
    const isBullish = candle.close >= candle.open;
    const fillColor = isBullish ? colorBull : colorBear;
    const resolvedWickColor = wickColor || fillColor;
    const wickStyle = useAnimatedStyle(() => ({
        opacity: wickOpacity.value,
        top: wickTop.value,
        height: Math.max(1, wickHeight.value),
    }));
    const bodyStyle = useAnimatedStyle(() => ({
        opacity: bodyOpacity.value,
        transform: [
            { scaleX: selectionScale.value },
        ],
        top: bodyTop.value,
        height: Math.max(1, bodyHeight.value),
    }));
    const selectionHaloOpacity = useSharedValue(isSelected ? 0.25 : 0);
    useEffect(() => {
        selectionHaloOpacity.value = withTiming(isSelected ? 0.25 : 0, {
            duration: 180,
            easing: Easing.out(Easing.ease),
        });
    }, [isSelected, selectionHaloOpacity]);
    const haloStyle = useAnimatedStyle(() => ({
        opacity: selectionHaloOpacity.value,
        transform: [
            { scale: selectionScale.value * 1.2 },
        ],
    }));
    return (jsxs(View, { style: {
            position: 'absolute',
            left: candle.chartX - candle.width / 2,
            top: 0,
            width: candle.width,
            height: '100%',
        }, children: [jsx(Animated$1.View, { pointerEvents: "none", style: [
                    {
                        position: 'absolute',
                        left: candle.width / 2 - candle.width,
                        top: candle.bodyTop - candle.bodyHeight,
                        width: candle.width * 2,
                        height: candle.bodyHeight * 2 + (candle.wickY2 - candle.wickY1),
                        borderRadius: candle.width,
                        backgroundColor: fillColor,
                        opacity: 0,
                    },
                    haloStyle,
                ] }), jsx(Animated$1.View, { style: [
                    {
                        position: 'absolute',
                        left: candle.width / 2 - 0.75,
                        width: 1.5,
                        backgroundColor: resolvedWickColor,
                    },
                    wickStyle,
                ] }), jsx(Animated$1.View, { style: [
                    {
                        position: 'absolute',
                        left: 0,
                        width: candle.width,
                        backgroundColor: fillColor,
                        borderRadius: theme.radius / 2,
                        borderWidth: isSelected ? 1 : 0,
                        borderColor: isSelected ? theme.colors.background : 'transparent',
                    },
                    bodyStyle,
                ] })] }));
});
AnimatedCandle.displayName = 'AnimatedCandle';

const buildSignature$5 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b, _c, _d, _e;
            const meta = point.meta;
            const metaId = (_a = meta === null || meta === void 0 ? void 0 : meta.x) !== null && _a !== void 0 ? _a : `${point.x}:${point.y}`;
            return `${point.x}:${point.y}:${metaId}:${(_b = meta === null || meta === void 0 ? void 0 : meta.open) !== null && _b !== void 0 ? _b : ''}:${(_c = meta === null || meta === void 0 ? void 0 : meta.close) !== null && _c !== void 0 ? _c : ''}:${(_d = meta === null || meta === void 0 ? void 0 : meta.high) !== null && _d !== void 0 ? _d : ''}:${(_e = meta === null || meta === void 0 ? void 0 : meta.low) !== null && _e !== void 0 ? _e : ''}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${entry.color}:${(_b = entry.visible) !== null && _b !== void 0 ? _b : true}:${pointsSignature}`;
    })
        .join('||');
};
const useCandlestickSeriesRegistration = (options) => {
    const { series, registerSeries, tooltipFormatter } = options;
    const registrations = useMemo(() => {
        return series
            .filter((s) => s.visible !== false)
            .map((s) => ({
            id: s.id,
            name: s.name || s.id,
            color: s.color,
            visible: s.visible !== false,
            points: s.data.map((d) => {
                const custom = tooltipFormatter === null || tooltipFormatter === void 0 ? void 0 : tooltipFormatter(d);
                const formattedValue = typeof custom === 'string'
                    ? custom
                    : `O: ${d.open}, H: ${d.high}, L: ${d.low}, C: ${d.close}`;
                return {
                    x: typeof d.x === 'number' ? d.x : typeof d.x === 'string' ? Number(d.x) : d.x.getTime(),
                    y: d.close, // Use close price as the primary y value for tooltips
                    meta: {
                        ...d,
                        formattedValue,
                        label: `${d.x}`,
                        color: s.color,
                        raw: d,
                        customTooltip: custom,
                    },
                };
            }),
        }));
    }, [series, tooltipFormatter]);
    const signature = useMemo(() => buildSignature$5(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((registration) => {
            registerSeries(registration);
        });
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!signature) {
            registeredSignatureRef.current = null;
        }
    }, [signature]);
};

const toNumeric = (value) => {
    if (value instanceof Date)
        return value.getTime();
    if (typeof value === 'number')
        return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};
/** Minimal initial CandlestickChart: renders OHLC candles + wicks, registers series, shared crosshair & tooltip ready */
const CandlestickChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { series, width = 400, height = 300, title, subtitle, xAxis, yAxis, grid, legend, animationDuration, style, enableCrosshair, liveTooltip, multiTooltip, enablePanZoom, zoomMode, minZoom, enableWheelZoom, wheelZoomStep, invertWheelZoom, resetOnDoubleTap, clampToInitialDomain, invertPinchZoom, xScaleType = 'time', yScaleType = 'linear', annotations, movingAveragePeriods = [], movingAverageColors = [], showMovingAverages = true, disabled, showVolume = false, volumeHeightRatio = 0.22, tooltip, ...rest } = props;
    const theme = useChartTheme();
    const flattened = React.useMemo(() => series.flatMap((s) => s.data), [series]);
    const volumeEnabled = React.useMemo(() => !!showVolume && flattened.some((point) => { var _a, _b; return Number.isFinite((_a = point.volume) !== null && _a !== void 0 ? _a : NaN) && ((_b = point.volume) !== null && _b !== void 0 ? _b : 0) > 0; }), [showVolume, flattened]);
    const clampNumber = React.useCallback((value, min, max) => Math.min(Math.max(value, min), max), []);
    const priceFormatter = React.useMemo(() => {
        if (typeof (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) === 'function') {
            return yAxis.labelFormatter;
        }
        if (yScaleType === 'time') {
            const dt = new Intl.DateTimeFormat(undefined, {
                month: 'short',
                day: 'numeric',
            });
            return (value) => dt.format(new Date(value));
        }
        const nf = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return (value) => nf.format(value);
    }, [yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter, yScaleType]);
    const xTickFormatter = React.useMemo(() => {
        if (typeof (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) === 'function') {
            return xAxis.labelFormatter;
        }
        if (xScaleType === 'time') {
            const dt = new Intl.DateTimeFormat(undefined, {
                month: 'short',
                day: 'numeric',
            });
            return (value) => dt.format(new Date(value));
        }
        return (value) => formatNumber$2(value);
    }, [xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter, xScaleType]);
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_j) {
        console.warn('CandlestickChart: useChartInteractionContext must be used inside a ChartInteractionProvider context');
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const defaultScheme = colorSchemes.default;
    const xDomain = React.useMemo(() => {
        if (!flattened.length) {
            return [0, 1];
        }
        const points = flattened.map((d) => ({ x: toNumeric(d.x), y: toNumeric(d.x) }));
        return getDataDomain(points, (d) => toNumeric(d.x));
    }, [flattened]);
    const yDomain = React.useMemo(() => {
        if (!flattened.length) {
            return [0, 1];
        }
        const lows = flattened.map((d) => d.low);
        const highs = flattened.map((d) => d.high);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            return [0, 1];
        }
        if (min === max) {
            const delta = Math.abs(min) * 0.05 || 1;
            return [min - delta, max + delta];
        }
        return [min, max];
    }, [flattened]);
    const basePadding = { top: 40, right: 20, bottom: volumeEnabled ? 72 : 60, left: 80 };
    const padding = React.useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position, volumeEnabled]);
    const volumeGap = volumeEnabled ? 16 : 0;
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const availableHeight = Math.max(0, height - padding.top - padding.bottom - volumeGap);
    const volumeSectionRatio = clampNumber(volumeHeightRatio !== null && volumeHeightRatio !== void 0 ? volumeHeightRatio : 0.22, 0.05, 0.5);
    const volumeHeight = volumeEnabled ? Math.max(40, availableHeight * volumeSectionRatio) : 0;
    const plotHeight = Math.max(0, availableHeight - volumeHeight);
    const xTicks = React.useMemo(() => {
        if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length) {
            return xAxis.ticks;
        }
        switch (xScaleType) {
            case 'log':
                return generateLogTicks([Math.max(xDomain[0], 1e-12), Math.max(xDomain[1], 1e-12)], 6);
            case 'time':
                return generateTimeTicks(xDomain, 6);
            default:
                return generateTicks(xDomain[0], xDomain[1], 6);
        }
    }, [xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks, xDomain, xScaleType]);
    const yTicks = React.useMemo(() => {
        if ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
            return yAxis.ticks;
        }
        switch (yScaleType) {
            case 'log':
                return generateLogTicks([Math.max(yDomain[0], 1e-12), Math.max(yDomain[1], 1e-12)], 5);
            case 'time':
                return generateTimeTicks(yDomain, 5);
            default:
                return generateTicks(yDomain[0], yDomain[1], 5);
        }
    }, [yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks, yDomain, yScaleType]);
    const scaleX = React.useCallback((v) => {
        const value = toNumeric(v);
        switch (xScaleType) {
            case 'log':
                return scaleLog(value, xDomain, [0, plotWidth]);
            case 'time':
                return scaleTime(value, xDomain, [0, plotWidth]);
            default:
                return scaleLinear(value, xDomain, [0, plotWidth]);
        }
    }, [xScaleType, xDomain, plotWidth]);
    const scaleY = React.useCallback((v) => {
        switch (yScaleType) {
            case 'log': return scaleLog(v, yDomain, [plotHeight, 0]);
            case 'time': return scaleTime(v, yDomain, [plotHeight, 0]);
            default: return scaleLinear(v, yDomain, [plotHeight, 0]);
        }
    }, [yScaleType, yDomain, plotHeight]);
    const axisScaleX = React.useMemo(() => {
        const domain = [xDomain[0], xDomain[1]];
        const range = [0, plotWidth];
        if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1]) || plotWidth <= 0) {
            const fallback = ((_) => 0);
            fallback.domain = () => domain.slice();
            fallback.range = () => [0, 0];
            fallback.ticks = () => (xTicks !== null && xTicks !== void 0 ? xTicks : []).slice();
            fallback.invert = () => domain[0];
            return fallback;
        }
        const scale = ((value) => scaleX(value));
        scale.domain = () => domain.slice();
        scale.range = () => range.slice();
        scale.ticks = (count) => {
            if (xTicks && xTicks.length)
                return xTicks.slice();
            switch (xScaleType) {
                case 'log':
                    return generateLogTicks(domain, count !== null && count !== void 0 ? count : 6);
                case 'time':
                    return generateTimeTicks(domain, count !== null && count !== void 0 ? count : 6);
                default:
                    return generateTicks(domain[0], domain[1], count !== null && count !== void 0 ? count : 6);
            }
        };
        scale.invert = (pixel) => {
            if (range[1] === range[0])
                return domain[0];
            const ratio = (pixel - range[0]) / (range[1] - range[0]);
            const clamped = Math.max(0, Math.min(1, ratio));
            switch (xScaleType) {
                case 'log': {
                    const logMin = Math.log10(Math.max(domain[0], 1e-12));
                    const logMax = Math.log10(Math.max(domain[1], 1e-12));
                    const value = Math.pow(10, logMin + (logMax - logMin) * clamped);
                    return value;
                }
                default:
                    return domain[0] + (domain[1] - domain[0]) * clamped;
            }
        };
        return scale;
    }, [plotWidth, xDomain, xTicks, xScaleType, scaleX]);
    const axisScaleY = React.useMemo(() => {
        const domain = [yDomain[0], yDomain[1]];
        const range = [plotHeight, 0];
        if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1]) || plotHeight <= 0) {
            const fallback = ((_) => 0);
            fallback.domain = () => domain.slice();
            fallback.range = () => [0, 0];
            fallback.ticks = () => (yTicks !== null && yTicks !== void 0 ? yTicks : []).slice();
            fallback.invert = () => domain[0];
            return fallback;
        }
        const scale = ((value) => scaleY(value));
        scale.domain = () => domain.slice();
        scale.range = () => range.slice();
        scale.ticks = (count) => {
            if (yTicks && yTicks.length)
                return yTicks.slice();
            switch (yScaleType) {
                case 'log':
                    return generateLogTicks(domain, count !== null && count !== void 0 ? count : 5);
                case 'time':
                    return generateTimeTicks(domain, count !== null && count !== void 0 ? count : 5);
                default:
                    return generateTicks(domain[0], domain[1], count !== null && count !== void 0 ? count : 5);
            }
        };
        scale.invert = (pixel) => {
            if (range[0] === range[1])
                return domain[0];
            const ratio = (pixel - range[0]) / (range[1] - range[0]);
            const clamped = Math.max(0, Math.min(1, ratio));
            switch (yScaleType) {
                case 'log': {
                    const logMin = Math.log10(Math.max(domain[0], 1e-12));
                    const logMax = Math.log10(Math.max(domain[1], 1e-12));
                    return Math.pow(10, logMin + (logMax - logMin) * clamped);
                }
                default:
                    return domain[0] + (domain[1] - domain[0]) * clamped;
            }
        };
        return scale;
    }, [plotHeight, yDomain, yTicks, yScaleType, scaleY]);
    const resolvedXTicks = React.useMemo(() => (xTicks !== null && xTicks !== void 0 ? xTicks : []).slice(), [xTicks]);
    const resolvedYTicks = React.useMemo(() => (yTicks !== null && yTicks !== void 0 ? yTicks : []).slice(), [yTicks]);
    const normalizedXTicks = React.useMemo(() => {
        if (plotWidth <= 0)
            return [];
        return resolvedXTicks
            .map((tick) => {
            const numeric = typeof tick === 'number' ? tick : Number(tick);
            if (!Number.isFinite(numeric))
                return null;
            const px = axisScaleX(numeric);
            if (!Number.isFinite(px))
                return null;
            return px / plotWidth;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [resolvedXTicks, axisScaleX, plotWidth]);
    const normalizedYTicks = React.useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return resolvedYTicks
            .map((tick) => {
            const numeric = typeof tick === 'number' ? tick : Number(tick);
            if (!Number.isFinite(numeric))
                return null;
            const py = axisScaleY(numeric);
            if (!Number.isFinite(py))
                return null;
            return py / plotHeight;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [resolvedYTicks, axisScaleY, plotHeight]);
    const candleWidth = Math.max(2, plotWidth / Math.max(flattened.length, 1) * 0.7);
    // Process candle data for AnimatedCandle components
    const candleData = React.useMemo(() => {
        const result = [];
        series.forEach((s, seriesIndex) => {
            if (s.visible === false)
                return;
            s.data.forEach((d, dataIndex) => {
                var _a;
                const xPos = scaleX(d.x);
                const open = scaleY(d.open);
                const close = scaleY(d.close);
                const high = scaleY(d.high);
                const low = scaleY(d.low);
                const bodyTop = Math.min(open, close);
                const bodyHeight = Math.max(1, Math.abs(close - open));
                result.push({
                    ...d,
                    id: `${seriesIndex}-${dataIndex}`,
                    x: toNumeric(d.x),
                    y: d.close,
                    chartX: xPos,
                    chartY: close,
                    wickY1: high,
                    wickY2: low,
                    bodyTop,
                    bodyHeight,
                    width: candleWidth,
                    seriesIndex,
                    dataIndex,
                    volume: (_a = d.volume) !== null && _a !== void 0 ? _a : null,
                });
            });
        });
        return result;
    }, [series, scaleX, scaleY, candleWidth]);
    const primaryVolumeSeriesIndex = React.useMemo(() => {
        if (!volumeEnabled)
            return -1;
        return series.findIndex((s) => s.visible !== false && s.data.some((d) => { var _a, _b; return Number.isFinite((_a = d.volume) !== null && _a !== void 0 ? _a : NaN) && ((_b = d.volume) !== null && _b !== void 0 ? _b : 0) > 0; }));
    }, [volumeEnabled, series]);
    const volumeBars = React.useMemo(() => {
        if (!volumeEnabled || volumeHeight <= 0 || primaryVolumeSeriesIndex < 0)
            return [];
        const targetSeries = series[primaryVolumeSeriesIndex];
        const volumes = targetSeries.data.map((d) => { var _a; return Math.max(0, Number((_a = d.volume) !== null && _a !== void 0 ? _a : 0)); });
        const maxVolume = Math.max(...volumes, 0);
        if (!(maxVolume > 0))
            return [];
        const bullColor = targetSeries.colorBull || '#16a34a';
        const bearColor = targetSeries.colorBear || '#dc2626';
        const barWidth = Math.max(2, candleWidth * 0.65);
        return targetSeries.data.map((d, index) => {
            var _a;
            const value = Math.max(0, Number((_a = d.volume) !== null && _a !== void 0 ? _a : 0));
            const proportionalHeight = (value / maxVolume) * volumeHeight;
            const heightPx = Math.max(1, proportionalHeight);
            const xCenter = scaleX(d.x);
            const color = d.close >= d.open ? bullColor : bearColor;
            return {
                id: `${primaryVolumeSeriesIndex}-${index}`,
                x: xCenter - barWidth / 2,
                y: volumeHeight - heightPx,
                width: barWidth,
                height: heightPx,
                color,
            };
        });
    }, [
        volumeEnabled,
        volumeHeight,
        primaryVolumeSeriesIndex,
        series,
        candleWidth,
        scaleX,
    ]);
    const resolvePointerPayload = React.useCallback((pixelX) => {
        var _a, _b;
        if (!candleData.length)
            return undefined;
        let nearest = candleData[0];
        let minDistance = Math.abs(pixelX - nearest.chartX);
        for (let i = 1; i < candleData.length; i += 1) {
            const candidate = candleData[i];
            const distance = Math.abs(pixelX - candidate.chartX);
            if (distance < minDistance) {
                nearest = candidate;
                minDistance = distance;
            }
        }
        if (!nearest)
            return undefined;
        const candlesAtX = candleData.filter((candle) => candle.x === nearest.x);
        const grouped = [];
        candlesAtX.forEach((candle) => {
            var _a, _b, _c;
            const parentSeries = series[candle.seriesIndex];
            const datum = (_a = parentSeries === null || parentSeries === void 0 ? void 0 : parentSeries.data) === null || _a === void 0 ? void 0 : _a[candle.dataIndex];
            if (!parentSeries || !datum)
                return;
            const formatted = (_b = tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) === null || _b === void 0 ? void 0 : _b.call(tooltip, datum);
            grouped.push({
                seriesId: (_c = parentSeries.id) !== null && _c !== void 0 ? _c : candle.seriesIndex,
                seriesName: parentSeries.name,
                seriesIndex: candle.seriesIndex,
                dataIndex: candle.dataIndex,
                datum,
                candle,
                formatted,
            });
        });
        if (!grouped.length)
            return undefined;
        const referenceDatum = (_a = grouped[0]) === null || _a === void 0 ? void 0 : _a.datum;
        return {
            type: 'candlestick',
            xValue: (_b = referenceDatum === null || referenceDatum === void 0 ? void 0 : referenceDatum.x) !== null && _b !== void 0 ? _b : nearest.x,
            candles: grouped,
        };
    }, [candleData, series, tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter]);
    const handlePointerUpdate = React.useCallback((px, py, meta) => {
        if (!setPointer || plotWidth <= 0 || plotHeight <= 0 || disabled)
            return;
        const withinX = px >= 0 && px <= plotWidth;
        const withinY = py >= 0 && py <= plotHeight;
        const inside = withinX && withinY;
        const payload = inside ? resolvePointerPayload(px) : undefined;
        setPointer({
            x: px,
            y: py,
            inside,
            insideX: withinX,
            insideY: withinY,
            pageX: meta === null || meta === void 0 ? void 0 : meta.pageX,
            pageY: meta === null || meta === void 0 ? void 0 : meta.pageY,
            data: payload,
        });
        if (!enableCrosshair)
            return;
        if (withinX) {
            const dataX = axisScaleX.invert ? axisScaleX.invert(px) : xDomain[0] + (plotWidth ? (px / plotWidth) * (xDomain[1] - xDomain[0]) : 0);
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX, pixelX: px });
        }
        else {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [setPointer, plotWidth, plotHeight, disabled, resolvePointerPayload, enableCrosshair, axisScaleX, xDomain, setCrosshair]);
    const handlePointerLeave = React.useCallback(() => {
        if (!setPointer)
            return;
        setPointer(null);
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
    }, [setPointer, setCrosshair]);
    // Build MA SVG paths (after scale helpers) for smoother rendering
    // Moving averages per series (only first series currently used if multiple) – could extend to all later
    const maLines = React.useMemo(() => {
        if (!showMovingAverages || !movingAveragePeriods.length || series.length === 0)
            return [];
        const base = [...series[0].data].sort((a, b) => toNumeric(a.x) - toNumeric(b.x));
        return movingAveragePeriods.map((p, pi) => {
            const pts = [];
            let sum = 0;
            const window = [];
            base.forEach(d => {
                const val = d.close;
                window.push(val);
                sum += val;
                if (window.length > p)
                    sum -= window.shift();
                if (window.length === p)
                    pts.push({ x: toNumeric(d.x), y: sum / p });
            });
            return { period: p, points: pts, color: movingAverageColors[pi] || getColorFromScheme(pi + 2, defaultScheme) };
        });
    }, [showMovingAverages, movingAveragePeriods, movingAverageColors, series, defaultScheme]);
    const maSvgPaths = React.useMemo(() => {
        return maLines.map(ma => {
            if (ma.points.length < 2)
                return { period: ma.period, d: '', color: ma.color };
            let d = `M ${scaleX(ma.points[0].x)} ${scaleY(ma.points[0].y)}`;
            for (let i = 1; i < ma.points.length; i++) {
                const pt = ma.points[i];
                d += ` L ${scaleX(pt.x)} ${scaleY(pt.y)}`;
            }
            return { period: ma.period, d, color: ma.color };
        });
    }, [maLines, scaleX, scaleY]);
    // Register series for tooltip interaction
    const candlestickSeriesData = React.useMemo(() => {
        const candlestickSeries = series.map((s, i) => {
            var _a;
            return ({
                id: String((_a = s.id) !== null && _a !== void 0 ? _a : i),
                name: s.name || `Series ${i + 1}`,
                color: s.colorBull || '#16a34a',
                colorBull: s.colorBull || '#16a34a',
                colorBear: s.colorBear || '#dc2626',
                wickColor: s.wickColor,
                visible: s.visible !== false,
                data: s.data.map(d => ({
                    x: d.x,
                    open: d.open,
                    close: d.close,
                    high: d.high,
                    low: d.low,
                    volume: d.volume,
                })),
            });
        });
        // Add moving averages as overlay series if enabled
        const maOverlaySeries = showMovingAverages ? maLines.map((ma) => ({
            id: `ma-${ma.period}`,
            name: `${ma.period} MA`,
            color: ma.color,
            visible: true,
            data: ma.points.map((p) => ({
                x: p.x,
                open: p.y,
                close: p.y,
                high: p.y,
                low: p.y,
            })),
        })) : [];
        return [...candlestickSeries, ...maOverlaySeries];
    }, [series, showMovingAverages, maLines]);
    useCandlestickSeriesRegistration({
        series: candlestickSeriesData,
        registerSeries,
        tooltipFormatter: tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter,
    });
    return (jsxs(ChartContainer, { width: width, height: height, disabled: disabled, animationDuration: animationDuration, style: style, interactionConfig: {
            enablePanZoom, zoomMode, minZoom, wheelZoomStep, resetOnDoubleTap, clampToInitialDomain,
            invertPinchZoom, invertWheelZoom, enableCrosshair, liveTooltip, multiTooltip,
        }, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && plotWidth > 0 && plotHeight > 0 && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), jsxs(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight + (volumeEnabled ? volumeHeight + volumeGap : 0),
                }, children: [jsxs(View, { style: { width: plotWidth, height: plotHeight }, onStartShouldSetResponder: () => !disabled, onResponderGrant: (e) => {
                            const { locationX, locationY, pageX, pageY } = e.nativeEvent || {};
                            handlePointerUpdate(locationX !== null && locationX !== void 0 ? locationX : 0, locationY !== null && locationY !== void 0 ? locationY : 0, { pageX, pageY });
                        }, onResponderMove: (e) => {
                            const { locationX, locationY, pageX, pageY } = e.nativeEvent || {};
                            handlePointerUpdate(locationX !== null && locationX !== void 0 ? locationX : 0, locationY !== null && locationY !== void 0 ? locationY : 0, { pageX, pageY });
                        }, onResponderRelease: handlePointerLeave, onResponderTerminate: handlePointerLeave, children: [jsx(View, { style: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: plotWidth,
                                    height: plotHeight,
                                }, pointerEvents: "none", children: candleData.map((candle, index) => {
                                    const s = series[candle.seriesIndex];
                                    return (jsx(AnimatedCandle, { candle: candle, colorBull: s.colorBull || '#16a34a', colorBear: s.colorBear || '#dc2626', wickColor: s.wickColor, index: index, disabled: disabled, theme: theme }, candle.id));
                                }) }), jsx(Svg, { width: plotWidth, height: plotHeight, 
                                // Basic pointer tracking for web (RN web exposes onMouseMove); native handled via gesture layer above ChartContainer if present
                                // @ts-ignore web only events
                                onMouseMove: (e) => {
                                    var _a, _b;
                                    const rect = (_b = (_a = e.currentTarget).getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
                                    if (!rect)
                                        return;
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    handlePointerUpdate(x, y, { pageX: e.pageX, pageY: e.pageY });
                                }, 
                                // @ts-ignore web only events
                                onMouseLeave: handlePointerLeave, children: jsx(G, { children: maSvgPaths.map(p => {
                                        var _a;
                                        const vis = ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === `ma-${p.period}`)) === null || _a === void 0 ? void 0 : _a.visible) !== false;
                                        return (p.d && vis) ? jsx(Path, { d: p.d, stroke: p.color, strokeWidth: 1.5, fill: "none" }, `ma-${p.period}`) : null;
                                    }) }) })] }), volumeEnabled && (jsx(View, { style: { width: plotWidth, height: volumeHeight, marginTop: volumeGap }, children: jsx(Svg, { width: plotWidth, height: volumeHeight, children: jsx(G, { children: volumeBars.map((bar) => (jsx(Rect, { x: bar.x, y: bar.y, width: bar.width, height: bar.height, fill: bar.color, opacity: 0.82, rx: 1.5 }, bar.id))) }) }) })), annotations === null || annotations === void 0 ? void 0 : annotations.map(a => {
                        var _a, _b;
                        if (a.shape === 'vertical-line' && a.x != null) {
                            const x = scaleX(a.x);
                            return jsx(View, { style: { position: 'absolute', left: x, top: 0, width: 1, height: plotHeight, backgroundColor: a.color || '#6366f1', opacity: (_a = a.opacity) !== null && _a !== void 0 ? _a : 1 } }, a.id);
                        }
                        if (a.shape === 'horizontal-line' && a.y != null) {
                            const y = scaleY(a.y);
                            return jsx(View, { style: { position: 'absolute', top: y, left: 0, height: 1, width: plotWidth, backgroundColor: a.color || '#6366f1', opacity: (_b = a.opacity) !== null && _b !== void 0 ? _b : 1 } }, a.id);
                        }
                        if (a.shape === 'point' && a.x != null && a.y != null) {
                            const x = scaleX(a.x) - 4;
                            const y = scaleY(a.y) - 4;
                            return jsx(View, { style: { position: 'absolute', left: x, top: y, width: 8, height: 8, borderRadius: 4, backgroundColor: a.color || '#f59e0b' } }, a.id);
                        }
                        if (a.shape === 'box' && a.x1 != null && a.x2 != null && a.y1 != null && a.y2 != null) {
                            const left = scaleX(Math.min(a.x1, a.x2));
                            const right = scaleX(Math.max(a.x1, a.x2));
                            const top = scaleY(Math.max(a.y1, a.y2));
                            const bottom = scaleY(Math.min(a.y1, a.y2));
                            return jsx(View, { style: { position: 'absolute', left, top, width: right - left, height: bottom - top, backgroundColor: a.backgroundColor || 'rgba(99,102,241,0.15)', borderWidth: 1, borderColor: a.color || '#6366f1' } }, a.id);
                        }
                        if (a.shape === 'text' && a.x != null && a.y != null && a.label) {
                            const x = scaleX(a.x) + 4;
                            const y = scaleY(a.y) - 8;
                            return jsx(View, { style: { position: 'absolute', left: x, top: y, paddingHorizontal: 4, paddingVertical: 2, backgroundColor: a.backgroundColor || 'rgba(0,0,0,0.6)' }, children: jsx(Text, { style: { color: a.textColor || '#fff', fontSize: a.fontSize || 10 }, children: a.label }) }, a.id);
                        }
                        return null;
                    })] }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: resolvedXTicks.length, tickSize: (_a = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _a !== void 0 ? _a : 4, tickPadding: 4, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (!Number.isFinite(numeric))
                        return String(value !== null && value !== void 0 ? value : '');
                    return xTickFormatter(numeric);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _b !== void 0 ? _b : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _c !== void 0 ? _c : 12) + 20 : 40, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: resolvedYTicks.length, tickSize: (_d = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _d !== void 0 ? _d : 4, tickPadding: 4, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (!Number.isFinite(numeric))
                        return String(value !== null && value !== void 0 ? value : '');
                    return priceFormatter(numeric);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _e !== void 0 ? _e : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _f !== void 0 ? _f : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } })), series.length > 1 && (jsx(ChartLegend, { items: series.map((s, si) => ({ label: s.name || `Series ${si + 1}`, color: s.colorBull || getColorFromScheme(si, colorSchemes.default), visible: s.visible !== false })), position: (_g = props.legend) === null || _g === void 0 ? void 0 : _g.position, align: (_h = props.legend) === null || _h === void 0 ? void 0 : _h.align, onItemPress: (item, index, nativeEvent) => {
                    var _a;
                    const target = series[index];
                    if (!target || !updateSeriesVisibility)
                        return;
                    const id = target.id || index;
                    const overridden = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === id)) === null || _a === void 0 ? void 0 : _a.visible;
                    const current = overridden === undefined ? target.visible !== false : overridden !== false;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visibleIds = series.filter(s => { var _a; return ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => { var _a; return sr.id === ((_a = s.id) !== null && _a !== void 0 ? _a : ''); })) === null || _a === void 0 ? void 0 : _a.visible) !== false; }).map(s => s.id || '');
                        const isSole = visibleIds.length === 1 && visibleIds[0] === id;
                        series.forEach((s, si) => updateSeriesVisibility(s.id || si, isSole ? true : (s.id || si) === id));
                    }
                    else {
                        updateSeriesVisibility(id, !current);
                    }
                } }))] }));
};
CandlestickChart.displayName = 'CandlestickChart';

const AnimatedPath$8 = Animated$1.createAnimatedComponent(Path);
const AnimatedCircle$4 = Animated$1.createAnimatedComponent(Circle);
const clamp$4 = (value, min, max) => Math.min(Math.max(value, min), max);
const buildRadarPath = (points, smooth) => {
    if (!points.length)
        return '';
    if (points.length < 3 || smooth <= 0) {
        let d = '';
        points.forEach((p, i) => {
            d += (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`;
        });
        return d + (points.length ? ' Z' : '');
    }
    const tension = clamp$4(smooth, 0.01, 1);
    const total = points.length;
    const getPoint = (idx) => points[(idx + total) % total];
    const path = [];
    const start = points[0];
    path.push('M', String(start.x), String(start.y));
    for (let i = 0; i < total; i++) {
        const p0 = getPoint(i - 1);
        const p1 = getPoint(i);
        const p2 = getPoint(i + 1);
        const p3 = getPoint(i + 2);
        const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
        const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
        const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
        const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;
        path.push('C', String(cp1x), String(cp1y), String(cp2x), String(cp2y), String(p2.x), String(p2.y));
    }
    path.push('Z');
    return path.join(' ');
};
// Custom hook for radar grid geometry
function useRadarGrid(width, height, axisCount, padding = 60) {
    return useMemo(() => {
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(width, height) / 2 - padding;
        const angleFor = (idx) => (Math.PI * 2 * idx / axisCount) - Math.PI / 2;
        const valueToRadius = (value, maxValue) => (value / maxValue) * r;
        return {
            centerX: cx,
            centerY: cy,
            radius: r,
            angleFor,
            valueToRadius,
        };
    }, [width, height, axisCount, padding]);
}
// Animated radar area component
const AnimatedRadarArea = React.memo(({ path, fillColor, strokeColor, strokeWidth, opacity, animationProgress, fill, disabled }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        return {
            strokeDasharray: disabled ? undefined : `${progress * 1000} 1000`,
            fillOpacity: fill ? opacity * progress : 0,
            strokeOpacity: progress,
        };
    }, [fill, opacity, disabled]);
    return (jsx(AnimatedPath$8, { d: path, fill: fill ? fillColor : 'none', stroke: strokeColor, strokeWidth: strokeWidth, animatedProps: animatedProps }));
});
AnimatedRadarArea.displayName = 'AnimatedRadarArea';
// Animated radar point component
const AnimatedRadarPoint = React.memo(({ cx, cy, radius, fill, stroke, strokeWidth, animationProgress, delay, isHighlighted, disabled }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    const highlightScale = useSharedValue(isHighlighted ? 1.5 : 1);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            return;
        }
        scale.value = withDelay(delay, withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
        }));
    }, [disabled, delay, scale]);
    useEffect(() => {
        highlightScale.value = withTiming(isHighlighted ? 1.5 : 1, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
        });
    }, [isHighlighted, highlightScale]);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const currentScale = scale.value * highlightScale.value;
        return {
            r: radius * currentScale * progress,
            fillOpacity: progress,
            strokeOpacity: progress,
        };
    }, [radius]);
    return (jsx(AnimatedCircle$4, { cx: cx, cy: cy, fill: fill, stroke: stroke, strokeWidth: strokeWidth, animatedProps: animatedProps }));
});
AnimatedRadarPoint.displayName = 'AnimatedRadarPoint';
const RadarChart = (props) => {
    var _a, _b, _c, _d, _e;
    const { series, width = 400, height = 400, title, subtitle, radialGrid, smooth, fill = true, legend, enableCrosshair, multiTooltip, liveTooltip, tooltip, disabled = false, animationDuration = 800, style, } = props;
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_f) {
        interaction = null;
    }
    const theme = useChartTheme();
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const defaultScheme = colorSchemes.default;
    // Extract unique axes from all series
    const axisEntries = useMemo(() => {
        const map = new Map();
        series.forEach(s => s.data.forEach(p => {
            if (!map.has(p.axis))
                map.set(p.axis, p);
        }));
        return Array.from(map.values());
    }, [series]);
    const axes = useMemo(() => axisEntries.map(entry => entry.axis), [axisEntries]);
    const axisCount = Math.max(axes.length, 3);
    const maxValue = useMemo(() => { var _a; return (_a = props.maxValue) !== null && _a !== void 0 ? _a : Math.max(1, ...series.flatMap(s => s.data.map(p => p.value))); }, [series, props.maxValue]);
    // Use radar grid geometry hook
    const { centerX, centerY, radius, angleFor, valueToRadius } = useRadarGrid(width, height, axisCount);
    // Animation
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        return series
            .map(s => `${s.id}-${s.data.map(p => `${p.axis}:${p.value}`).join('|')}`)
            .join('||');
    }, [series]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    // Series registration with memoization and signature guard
    const registrationSignature = useMemo(() => {
        return series
            .map(s => {
            const points = axes.map(a => {
                var _a, _b, _c;
                const point = s.data.find(p => p.axis === a);
                if (!point)
                    return `${a}:0`;
                const tooltipKey = typeof point.tooltip === 'function' ? 'fn' : String((_a = point.tooltip) !== null && _a !== void 0 ? _a : '');
                return `${a}:${point.value}:${(_b = point.label) !== null && _b !== void 0 ? _b : ''}:${(_c = point.formattedValue) !== null && _c !== void 0 ? _c : ''}:${tooltipKey}`;
            }).join('|');
            return `${s.id || 'series'}-${s.name || ''}-${points}`;
        })
            .join('||');
    }, [series, axes]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !registrationSignature)
            return;
        if (registeredSignatureRef.current === registrationSignature)
            return;
        series.forEach((s, si) => {
            registerSeries({
                id: s.id || si,
                name: s.name || `Series ${si + 1}`,
                color: s.color || getColorFromScheme(si, defaultScheme),
                points: axes.map((a, ai) => {
                    var _a, _b, _c;
                    const point = s.data.find(p => p.axis === a);
                    const label = (_c = (_a = point === null || point === void 0 ? void 0 : point.label) !== null && _a !== void 0 ? _a : (_b = axisEntries[ai]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : String(a);
                    let tooltipContent;
                    if (point && point.tooltip !== undefined && point.tooltip !== null) {
                        tooltipContent =
                            typeof point.tooltip === 'function'
                                ? point.tooltip(point, { axisIndex: ai, seriesIndex: si, series: s })
                                : point.tooltip;
                    }
                    const metaPayload = {
                        axis: a,
                        raw: point,
                        label,
                        color: point === null || point === void 0 ? void 0 : point.color,
                        value: point === null || point === void 0 ? void 0 : point.value,
                    };
                    if ((point === null || point === void 0 ? void 0 : point.formattedValue) != null) {
                        metaPayload.formattedValue = point.formattedValue;
                    }
                    if (tooltipContent != null) {
                        metaPayload.customTooltip = tooltipContent;
                        if (typeof tooltipContent === 'string' || typeof tooltipContent === 'number') {
                            metaPayload.formattedValue = tooltipContent;
                        }
                    }
                    return {
                        x: ai,
                        y: point ? point.value : 0,
                        meta: metaPayload,
                    };
                }),
                visible: s.visible !== false,
            });
        });
        registeredSignatureRef.current = registrationSignature;
    }, [registerSeries, series, axes, axisEntries, defaultScheme, registrationSignature]);
    // Grid rings
    const ringCount = (_a = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.rings) !== null && _a !== void 0 ? _a : 4;
    const ringRadii = Array.from({ length: ringCount }, (_, i) => radius * (i + 1) / ringCount);
    const axisLabelPlacement = (_b = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.axisLabelPlacement) !== null && _b !== void 0 ? _b : 'outside';
    const axisLabelOffset = (_c = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.axisLabelOffset) !== null && _c !== void 0 ? _c : (axisLabelPlacement === 'outside'
        ? 16
        : axisLabelPlacement === 'inside'
            ? 12
            : 0);
    const axisLabelFormatter = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.axisLabelFormatter;
    const computedRingLabels = useMemo(() => {
        if (!(radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.ringLabels))
            return null;
        const { ringLabels } = radialGrid;
        return Array.from({ length: ringCount }, (_, index) => {
            var _a, _b;
            const value = maxValue * ((index + 1) / ringCount);
            if (Array.isArray(ringLabels)) {
                return (_a = ringLabels[index]) !== null && _a !== void 0 ? _a : '';
            }
            return (_b = ringLabels({ index, ringCount, value, maxValue })) !== null && _b !== void 0 ? _b : '';
        });
    }, [radialGrid, ringCount, maxValue]);
    const showRingLabels = Boolean(computedRingLabels === null || computedRingLabels === void 0 ? void 0 : computedRingLabels.some(label => label));
    const ringLabelPosition = (_d = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.ringLabelPosition) !== null && _d !== void 0 ? _d : 'outside';
    const ringLabelOffset = (_e = radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.ringLabelOffset) !== null && _e !== void 0 ? _e : 10;
    // Compute polygon paths with interaction visibility
    const smoothTension = typeof smooth === 'number' ? smooth : smooth ? 0.45 : 0;
    const polygons = useMemo(() => {
        return series.map((s, si) => {
            const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === (s.id || si));
            const visible = override ? override.visible !== false : s.visible !== false;
            const points = axes.map((a, ai) => {
                const d = s.data.find(p => p.axis === a);
                const val = d ? d.value : 0;
                const rr = valueToRadius(val, maxValue);
                const ang = angleFor(ai);
                const x = centerX + Math.cos(ang) * rr;
                const y = centerY + Math.sin(ang) * rr;
                return { x, y, value: val, axis: a, raw: d };
            });
            const path = buildRadarPath(points, smoothTension);
            return {
                id: s.id || si,
                color: s.color || getColorFromScheme(si, defaultScheme),
                d: path,
                points,
                series: s,
                visible,
            };
        });
    }, [series, axes, centerX, centerY, valueToRadius, maxValue, angleFor, defaultScheme, interaction === null || interaction === void 0 ? void 0 : interaction.series, smoothTension]);
    // Pointer-derived radial crosshair
    const pointer = interaction === null || interaction === void 0 ? void 0 : interaction.pointer;
    const activeAxisIndex = useMemo(() => {
        if (!pointer || !enableCrosshair || !pointer.inside)
            return null;
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const angle = Math.atan2(dy, dx) + Math.PI / 2; // rotate so 0 at top
        const norm = (angle < 0 ? angle + Math.PI * 2 : angle) % (Math.PI * 2);
        const idx = Math.round(norm / (Math.PI * 2) * axisCount) % axisCount;
        return idx;
    }, [pointer, enableCrosshair, centerX, centerY, axisCount]);
    // Update crosshair when active axis changes
    useEffect(() => {
        var _a;
        if (!enableCrosshair)
            return;
        if (activeAxisIndex == null) {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
            return;
        }
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: activeAxisIndex, pixelX: (_a = pointer === null || pointer === void 0 ? void 0 : pointer.x) !== null && _a !== void 0 ? _a : 0 });
    }, [activeAxisIndex, enableCrosshair, setCrosshair, pointer]);
    // Highlighted points for active axis
    const highlightedAxisPoints = useMemo(() => {
        if (activeAxisIndex == null)
            return [];
        return series
            .map((s, si) => {
            const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === (s.id || si));
            const visible = override ? override.visible !== false : s.visible !== false;
            if (!visible)
                return null;
            const axisKey = axes[activeAxisIndex];
            const d = s.data.find(p => p.axis === axisKey);
            if (!d)
                return null;
            const rr = valueToRadius(d.value, maxValue);
            const ang = angleFor(activeAxisIndex);
            const x = centerX + Math.cos(ang) * rr;
            const y = centerY + Math.sin(ang) * rr;
            return {
                x,
                y,
                color: s.color || getColorFromScheme(si, defaultScheme),
                id: (s.id || si) + '-' + String(axisKey),
                value: d.value,
                seriesIndex: si,
            };
        })
            .filter(Boolean);
    }, [activeAxisIndex, series, axes, interaction === null || interaction === void 0 ? void 0 : interaction.series, centerX, centerY, valueToRadius, maxValue, angleFor, defaultScheme]);
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: {
            enableCrosshair,
            multiTooltip: multiTooltip !== false,
            liveTooltip: liveTooltip !== false,
        }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(Svg, { width: width, height: height, style: { position: 'absolute', left: 0, top: 0 }, 
                // @ts-ignore web pointer
                onMouseMove: (e) => {
                    var _a, _b;
                    if (!setPointer)
                        return;
                    const rect = (_b = (_a = e.currentTarget).getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
                }, 
                // @ts-ignore
                onMouseLeave: () => {
                    if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer)
                        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: false });
                }, children: jsxs(G, { children: [enableCrosshair && activeAxisIndex != null && (() => {
                            const ang = angleFor(activeAxisIndex);
                            const x2 = centerX + Math.cos(ang) * radius;
                            const y2 = centerY + Math.sin(ang) * radius;
                            return (jsx(Line, { x1: centerX, y1: centerY, x2: x2, y2: y2, stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 3" }));
                        })(), ringRadii.map((rr, i) => (radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.shape) === 'polygon' ? (jsx(Path, { d: axes
                                .map((a, ai) => {
                                const ang = angleFor(ai);
                                const x = centerX + Math.cos(ang) * rr;
                                const y = centerY + Math.sin(ang) * rr;
                                return `${ai === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                                .join(' ') + ' Z', stroke: "#e5e7eb", strokeWidth: 1, fill: "none" }, i)) : (jsx(Circle, { cx: centerX, cy: centerY, r: rr, stroke: "#e5e7eb", strokeWidth: 1, fill: "none" }, i))), (radialGrid === null || radialGrid === void 0 ? void 0 : radialGrid.showAxes) !== false &&
                            axes.map((a, ai) => {
                                const ang = angleFor(ai);
                                const x2 = centerX + Math.cos(ang) * radius;
                                const y2 = centerY + Math.sin(ang) * radius;
                                return (jsx(Line, { x1: centerX, y1: centerY, x2: x2, y2: y2, stroke: "#d1d5db", strokeWidth: 1 }, ai));
                            }), polygons.map((p, pi) => {
                            var _a;
                            return p.visible ? (jsx(AnimatedRadarArea, { path: p.d, fillColor: p.color, strokeColor: p.color, strokeWidth: 2, opacity: (_a = p.series.opacity) !== null && _a !== void 0 ? _a : 0.3, animationProgress: animationProgress, fill: fill, disabled: disabled }, p.id)) : null;
                        }), series.map((s, si) => {
                            const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === (s.id || si));
                            const visible = override ? override.visible !== false : s.visible !== false;
                            if (!visible || !s.showPoints)
                                return null;
                            return axes.map((a, ai) => {
                                const d = s.data.find(p => p.axis === a);
                                if (!d)
                                    return null;
                                const rr = valueToRadius(d.value, maxValue);
                                const ang = angleFor(ai);
                                const x = centerX + Math.cos(ang) * rr;
                                const y = centerY + Math.sin(ang) * rr;
                                const isHighlighted = highlightedAxisPoints.some(hp => hp.seriesIndex === si && hp.x === x && hp.y === y);
                                return (jsx(AnimatedRadarPoint, { cx: x, cy: y, radius: s.pointSize || 3, fill: s.color || getColorFromScheme(si, colorSchemes.default), stroke: "#fff", strokeWidth: 1, animationProgress: animationProgress, delay: ai * 100, isHighlighted: isHighlighted, disabled: disabled }, si + '-' + ai));
                            });
                        }), highlightedAxisPoints.map(p => (jsx(Circle, { cx: p.x, cy: p.y, r: 8, fill: p.color, stroke: "#fff", strokeWidth: 2, opacity: 0.9 }, 'hl-' + p.id))), showRingLabels &&
                            ringRadii.map((rr, index) => {
                                const label = computedRingLabels === null || computedRingLabels === void 0 ? void 0 : computedRingLabels[index];
                                if (!label)
                                    return null;
                                const offsetRadius = ringLabelPosition === 'inside'
                                    ? Math.max(rr - ringLabelOffset, 0)
                                    : rr + ringLabelOffset;
                                const labelY = centerY - offsetRadius;
                                return (jsx(Text$1, { x: centerX, y: labelY, fill: theme.colors.textSecondary, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: "middle", children: String(label) }, `ring-label-${index}`));
                            }), axes.map((a, ai) => {
                            var _a;
                            const ang = angleFor(ai);
                            const cos = Math.cos(ang);
                            const sin = Math.sin(ang);
                            const axisEntry = axisEntries[ai];
                            let baseRadius;
                            if (axisLabelPlacement === 'outside') {
                                baseRadius = radius + axisLabelOffset;
                            }
                            else if (axisLabelPlacement === 'edge') {
                                baseRadius = radius + axisLabelOffset;
                            }
                            else {
                                baseRadius = Math.max(0, radius - axisLabelOffset);
                            }
                            const x = centerX + cos * baseRadius;
                            const y = centerY + sin * baseRadius;
                            const formatted = axisLabelFormatter
                                ? axisLabelFormatter(a, { index: ai, total: axes.length, label: axisEntry === null || axisEntry === void 0 ? void 0 : axisEntry.label })
                                : (_a = axisEntry === null || axisEntry === void 0 ? void 0 : axisEntry.label) !== null && _a !== void 0 ? _a : a;
                            const displayLabel = formatted == null ? '' : String(formatted);
                            const lines = displayLabel.split('\n');
                            const textAnchor = Math.abs(cos) < 0.35 ? 'middle' : cos > 0 ? 'start' : 'end';
                            const lineHeight = theme.fontSize.sm * 1.2;
                            return (jsxs(Text$1, { x: x, y: y, fill: theme.colors.textPrimary, fontSize: theme.fontSize.sm, fontFamily: theme.fontFamily, textAnchor: textAnchor, children: [jsx(TSpan, { children: lines[0] }), lines.slice(1).map((line, idx) => (jsx(TSpan, { x: x, dy: lineHeight, children: line }, `${a}-line-${idx}`)))] }, String(a)));
                        })] }) }), (legend === null || legend === void 0 ? void 0 : legend.show) !== false && (jsx(ChartLegend, { items: series.map((s, si) => {
                    const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === (s.id || si));
                    const visible = override ? override.visible !== false : s.visible !== false;
                    return {
                        label: s.name || String(s.id || si),
                        color: s.color || getColorFromScheme(si, colorSchemes.default),
                        visible,
                    };
                }), position: legend === null || legend === void 0 ? void 0 : legend.position, align: legend === null || legend === void 0 ? void 0 : legend.align, onItemPress: (item, index, nativeEvent) => {
                    const target = series[index];
                    if (!target || !updateSeriesVisibility)
                        return;
                    const id = target.id || index;
                    const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === id);
                    const current = override ? override.visible !== false : target.visible !== false;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visIds = series
                            .filter((s, si) => {
                            const seriesId = s.id || si;
                            const seriesOverride = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === seriesId);
                            return seriesOverride ? seriesOverride.visible !== false : s.visible !== false;
                        })
                            .map(s => s.id || series.indexOf(s));
                        const isSole = visIds.length === 1 && visIds[0] === id;
                        series.forEach((s, si) => updateSeriesVisibility(s.id || si, isSole ? true : (s.id || si) === id));
                    }
                    else {
                        updateSeriesVisibility(id, !current);
                    }
                } }))] }));
};
RadarChart.displayName = 'RadarChart';

const AnimatedRect$6 = Animated$1.createAnimatedComponent(Rect);
const AnimatedText$1 = Animated$1.createAnimatedComponent(Text$1);
// Utility to determine if text should be light or dark based on background color
function getContrastColor$1(hexColor) {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calculate luminance using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return dark text for light backgrounds, light text for dark backgrounds
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
}
const AnimatedHeatmapCell = React.memo(({ cell, isHovered = false, index, disabled = false, cornerRadius = 2, totalCells = 100, showText = true, }) => {
    var _a;
    const opacity = useSharedValue(disabled ? 1 : 0);
    const scale = useSharedValue(disabled ? 1 : 0.3);
    const strokeWidth = useSharedValue(0);
    // Adaptive timing based on cell count
    const adaptiveTiming = React.useMemo(() => {
        if (totalCells <= 50) {
            return { opacityDuration: 400, scaleDuration: 500, staggerDelay: 8 };
        }
        else if (totalCells <= 200) {
            return { opacityDuration: 250, scaleDuration: 300, staggerDelay: 4 };
        }
        else if (totalCells <= 500) {
            return { opacityDuration: 150, scaleDuration: 200, staggerDelay: 2 };
        }
        else {
            return { opacityDuration: 80, scaleDuration: 120, staggerDelay: 1 };
        }
    }, [totalCells]);
    // Calculate adaptive font size based on cell dimensions
    const fontSize = React.useMemo(() => {
        const minDimension = Math.min(cell.width, cell.height);
        if (minDimension <= 20)
            return 8;
        if (minDimension <= 40)
            return 10;
        if (minDimension <= 60)
            return 12;
        if (minDimension <= 80)
            return 14;
        return 16;
    }, [cell.width, cell.height]);
    // Get text color for contrast
    const textColor = React.useMemo(() => getContrastColor$1(cell.color), [cell.color]);
    useEffect(() => {
        if (disabled) {
            opacity.value = 1;
            scale.value = 1;
            strokeWidth.value = isHovered ? 1.2 : 0;
            return;
        }
        const delay = index * adaptiveTiming.staggerDelay; // Adaptive staggered animation
        opacity.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.opacityDuration,
            easing: Easing.out(Easing.cubic),
        }));
        scale.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.scaleDuration,
            easing: Easing.out(Easing.back(1.1)),
        }));
        // Handle hover state
        strokeWidth.value = withTiming(isHovered ? 1.2 : 0, {
            duration: 150,
            easing: Easing.out(Easing.quad),
        });
    }, [disabled, index, isHovered, opacity, scale, strokeWidth, adaptiveTiming]);
    // We animate scale by adjusting width/height and compensating x/y so cells grow from center.
    const animatedProps = useAnimatedProps(() => {
        const currentScale = scale.value;
        const w = cell.width * currentScale;
        const h = cell.height * currentScale;
        const dx = (cell.width - w) / 2;
        const dy = (cell.height - h) / 2;
        return {
            opacity: opacity.value,
            strokeWidth: strokeWidth.value,
            x: cell.pixelX + dx,
            y: cell.pixelY + dy,
            width: w,
            height: h,
        }; // cast for reanimated animated props on SvgRect
    });
    // Animated props for text (same opacity as rect)
    const textAnimatedProps = useAnimatedProps(() => ({
        opacity: opacity.value,
    }));
    return (jsxs(Fragment, { children: [jsx(AnimatedRect$6, { animatedProps: animatedProps, 
                // Static props; animated ones supplied via animatedProps
                fill: cell.color, stroke: isHovered ? '#111827' : 'none', rx: cornerRadius, ry: cornerRadius }), showText && fontSize >= 8 && (jsx(AnimatedText$1, { animatedProps: textAnimatedProps, x: cell.pixelX + cell.width / 2, y: cell.pixelY + cell.height / 2 + fontSize * 0.35, fontSize: fontSize, fill: textColor, textAnchor: "middle", pointerEvents: "none", fontWeight: fontSize <= 10 ? "600" : "500", children: (_a = cell.displayValue) !== null && _a !== void 0 ? _a : (typeof cell.value === 'number'
                    ? cell.value % 1 === 0
                        ? cell.value.toString()
                        : cell.value.toFixed(1)
                    : String(cell.value)) }))] }));
});
AnimatedHeatmapCell.displayName = 'AnimatedHeatmapCell';

const buildSignature$4 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b, _c;
            const meta = point.meta;
            const bucketKey = `${(_a = meta === null || meta === void 0 ? void 0 : meta.x) !== null && _a !== void 0 ? _a : ''}:${(_b = meta === null || meta === void 0 ? void 0 : meta.y) !== null && _b !== void 0 ? _b : ''}`;
            return `${point.x}:${point.y}:${bucketKey}:${(_c = meta === null || meta === void 0 ? void 0 : meta.value) !== null && _c !== void 0 ? _c : ''}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
        .join('||');
};
const useHeatmapSeriesRegistration = ({ cells, seriesName = 'Heatmap', registerSeries, }) => {
    const registrations = useMemo(() => {
        var _a, _b;
        if (!cells.length)
            return [];
        // Group cells by x/y bucket ranges for efficient lookups
        const bucketMap = new Map();
        cells.forEach((cell) => {
            const bucketKey = `${Math.floor(cell.x / 10)}:${Math.floor(cell.y / 10)}`;
            const bucket = bucketMap.get(bucketKey) || [];
            bucket.push(cell);
            bucketMap.set(bucketKey, bucket);
        });
        return [{
                id: 'heatmap-cells',
                name: seriesName,
                color: (_b = (_a = cells[0]) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : '#3B82F6',
                visible: true,
                points: cells.map((cell) => {
                    var _a, _b;
                    return ({
                        x: cell.chartX,
                        y: cell.chartY,
                        meta: {
                            ...cell,
                            bucketKey: `${Math.floor(cell.x / 10)}:${Math.floor(cell.y / 10)}`,
                            formattedValue: (_b = (_a = cell.displayValue) !== null && _a !== void 0 ? _a : cell.formattedValue) !== null && _b !== void 0 ? _b : `${cell.value}`,
                            label: cell.label || `(${cell.x}, ${cell.y})`,
                            color: cell.color,
                            raw: cell,
                        },
                    });
                }),
            }];
    }, [cells, seriesName]);
    const signature = useMemo(() => buildSignature$4(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((registration) => {
            registerSeries(registration);
        });
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!signature) {
            registeredSignatureRef.current = null;
        }
    }, [signature]);
};

function interpolateColor(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
    const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0')}`;
}
function buildGradient(colors, t) {
    if (colors.length === 0)
        return '#ccc';
    if (colors.length === 1)
        return colors[0];
    const seg = 1 / (colors.length - 1);
    const idx = Math.min(colors.length - 2, Math.floor(t / seg));
    const localT = (t - idx * seg) / seg;
    return interpolateColor(colors[idx], colors[idx + 1], localT);
}
function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    if (hex.length < 6)
        return '#ffffff';
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#111827' : '#ffffff';
}
function buildPresetFormatter(preset, options) {
    return ({ value, rowPercent, columnPercent, overallPercent, }) => {
        var _a, _b;
        const decimals = (_a = options === null || options === void 0 ? void 0 : options.decimals) !== null && _a !== void 0 ? _a : (preset.includes('percent') ? 1 : 2);
        const suffix = (_b = options === null || options === void 0 ? void 0 : options.suffix) !== null && _b !== void 0 ? _b : '';
        switch (preset) {
            case 'percent':
                return `${formatNumber$2(value * 100, decimals)}%${suffix}`;
            case 'percent-of-row':
                return `${formatNumber$2(rowPercent * 100, decimals)}%${suffix}`;
            case 'percent-of-column':
                return `${formatNumber$2(columnPercent * 100, decimals)}%${suffix}`;
            case 'compact-percent':
                return `${formatNumber$2(overallPercent * 100, decimals)}%${suffix}`;
            case 'compact':
            default:
                return `${formatNumber$2(value, decimals)}${suffix}`;
        }
    };
}
function resolveValueFormatter(formatter, options) {
    if (!formatter)
        return undefined;
    if (typeof formatter === 'function')
        return formatter;
    if (typeof formatter === 'string') {
        return buildPresetFormatter(formatter, options);
    }
    if (typeof formatter === 'object' && (formatter === null || formatter === void 0 ? void 0 : formatter.preset)) {
        const { preset, decimals, suffix } = formatter;
        return buildPresetFormatter(preset, { decimals, suffix });
    }
    return undefined;
}
// Phase 1 minimal Heatmap
const HeatmapChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const { data, width = 420, height = 320, title, subtitle, colorScale, cellSize, gap = 2, style, xAxis, yAxis, grid, legend, tooltip, multiTooltip = true, liveTooltip = false, enableCrosshair = true, showCellLabels, valueFormatter, cellCornerRadius = 2, hoverHighlight, maxAnimatedCells = 400, disableAnimation = false, } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_p) {
        interaction = null;
    }
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    // Normalize data and preserve matrix labels when provided
    const normalized = React.useMemo(() => {
        if (Array.isArray(data)) {
            return {
                cells: data,
                columnLabels: undefined,
                rowLabels: undefined,
            };
        }
        const { rows, cols, values } = data;
        const list = [];
        rows.forEach((row, rowIndex) => {
            cols.forEach((col, colIndex) => {
                var _a;
                const v = (_a = values[rowIndex]) === null || _a === void 0 ? void 0 : _a[colIndex];
                if (v == null)
                    return;
                list.push({ x: colIndex, y: rowIndex, value: v, label: `${row}-${col}` });
            });
        });
        return {
            cells: list,
            columnLabels: cols,
            rowLabels: rows,
        };
    }, [data]);
    const cells = normalized.cells;
    const columnLabels = normalized.columnLabels;
    const rowLabels = normalized.rowLabels;
    const xMax = React.useMemo(() => {
        if (!cells.length)
            return -1;
        return Math.max(...cells.map((cell) => cell.x));
    }, [cells]);
    const yMax = React.useMemo(() => {
        if (!cells.length)
            return -1;
        return Math.max(...cells.map((cell) => cell.y));
    }, [cells]);
    const uniqueX = (_a = columnLabels === null || columnLabels === void 0 ? void 0 : columnLabels.length) !== null && _a !== void 0 ? _a : (xMax >= 0 ? xMax + 1 : 0);
    const uniqueY = (_b = rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length) !== null && _b !== void 0 ? _b : (yMax >= 0 ? yMax + 1 : 0);
    const totals = React.useMemo(() => {
        const rowTotals = Array.from({ length: uniqueY }, () => 0);
        const columnTotals = Array.from({ length: uniqueX }, () => 0);
        let grandTotal = 0;
        cells.forEach((cell) => {
            var _a, _b;
            rowTotals[cell.y] = ((_a = rowTotals[cell.y]) !== null && _a !== void 0 ? _a : 0) + cell.value;
            columnTotals[cell.x] = ((_b = columnTotals[cell.x]) !== null && _b !== void 0 ? _b : 0) + cell.value;
            grandTotal += cell.value;
        });
        const rowMax = rowTotals.reduce((acc, val) => Math.max(acc, val), 0);
        const columnMax = columnTotals.reduce((acc, val) => Math.max(acc, val), 0);
        return {
            rowTotals,
            columnTotals,
            grandTotal,
            rowMax,
            columnMax,
        };
    }, [cells, uniqueX, uniqueY]);
    const resolvedFormatter = React.useMemo(() => resolveValueFormatter(valueFormatter, undefined), [valueFormatter]);
    const scale = colorScale !== null && colorScale !== void 0 ? colorScale : {};
    const minVal = (_c = scale.min) !== null && _c !== void 0 ? _c : (cells.length ? Math.min(...cells.map((c) => c.value)) : 0);
    const maxVal = (_d = scale.max) !== null && _d !== void 0 ? _d : (cells.length ? Math.max(...cells.map((c) => c.value)) : 1);
    const colors = ((_e = scale.stops) === null || _e === void 0 ? void 0 : _e.length)
        ? scale.stops.map((stop) => stop.color)
        : scale.colors || [
            getColorFromScheme(0, colorSchemes.default),
            getColorFromScheme(5, colorSchemes.default),
        ];
    const sortedStops = React.useMemo(() => {
        if (!scale.stops || !scale.stops.length)
            return null;
        return [...scale.stops].sort((a, b) => a.value - b.value);
    }, [scale.stops]);
    const nullFill = (_f = scale.nullColor) !== null && _f !== void 0 ? _f : 'rgba(148, 163, 184, 0.2)';
    const normalizeValue = React.useCallback((value) => {
        if (!Number.isFinite(value))
            return 0;
        if (maxVal === minVal)
            return 0.5;
        if (scale.type === 'log') {
            const safeMin = minVal <= 0 ? 1e-6 : minVal;
            const safeMax = Math.max(maxVal, safeMin * (1 + 1e-6));
            const clamped = Math.max(safeMin, Math.min(safeMax, value));
            const numerator = Math.log(clamped) - Math.log(safeMin);
            const denominator = Math.log(safeMax) - Math.log(safeMin);
            if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
                return 0;
            }
            return Math.min(1, Math.max(0, numerator / denominator));
        }
        const numerator = value - minVal;
        const denominator = maxVal - minVal;
        if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
            return 0;
        }
        return Math.min(1, Math.max(0, numerator / denominator));
    }, [maxVal, minVal, scale.type]);
    const resolveColor = React.useCallback((value) => {
        var _a;
        if (value == null || !Number.isFinite(value)) {
            return nullFill;
        }
        if (sortedStops && sortedStops.length) {
            if (scale.type === 'quantize') {
                for (let i = 0; i < sortedStops.length; i += 1) {
                    if (value <= sortedStops[i].value) {
                        return sortedStops[i].color;
                    }
                }
                return sortedStops[sortedStops.length - 1].color;
            }
            let lower = sortedStops[0];
            let upper = sortedStops[sortedStops.length - 1];
            for (let i = 0; i < sortedStops.length; i += 1) {
                const stop = sortedStops[i];
                if (value === stop.value) {
                    return stop.color;
                }
                if (value > stop.value) {
                    lower = stop;
                    continue;
                }
                upper = stop;
                break;
            }
            if (upper === lower || upper.value === lower.value) {
                return lower.color;
            }
            const ratio = (value - lower.value) / (upper.value - lower.value);
            return interpolateColor(lower.color, upper.color, Math.min(1, Math.max(0, ratio)));
        }
        if (scale.type === 'quantize' && colors.length > 0) {
            const binCount = colors.length;
            const norm = normalizeValue(value);
            const index = Math.min(binCount - 1, Math.floor(norm * binCount));
            return (_a = colors[index]) !== null && _a !== void 0 ? _a : colors[colors.length - 1];
        }
        const norm = normalizeValue(value);
        return buildGradient(colors, norm);
    }, [colors, normalizeValue, nullFill, scale.type, sortedStops]);
    const padding = React.useMemo(() => ({ top: 40, left: 80, right: 20, bottom: 60 }), []);
    const availablePlotWidth = Math.max(0, width - padding.left - padding.right);
    const availablePlotHeight = Math.max(0, height - padding.top - padding.bottom);
    const fallbackCellWidth = React.useMemo(() => {
        if (!uniqueX)
            return 0;
        return Math.max(4, (availablePlotWidth - gap * Math.max(uniqueX - 1, 0)) / Math.max(uniqueX, 1));
    }, [availablePlotWidth, gap, uniqueX]);
    const fallbackCellHeight = React.useMemo(() => {
        if (!uniqueY)
            return 0;
        return Math.max(4, (availablePlotHeight - gap * Math.max(uniqueY - 1, 0)) / Math.max(uniqueY, 1));
    }, [availablePlotHeight, gap, uniqueY]);
    const cellW = React.useMemo(() => {
        var _a;
        if (!uniqueX)
            return 0;
        return Math.max(1, (_a = cellSize === null || cellSize === void 0 ? void 0 : cellSize.width) !== null && _a !== void 0 ? _a : fallbackCellWidth);
    }, [cellSize === null || cellSize === void 0 ? void 0 : cellSize.width, fallbackCellWidth, uniqueX]);
    const cellH = React.useMemo(() => {
        var _a;
        if (!uniqueY)
            return 0;
        return Math.max(1, (_a = cellSize === null || cellSize === void 0 ? void 0 : cellSize.height) !== null && _a !== void 0 ? _a : fallbackCellHeight);
    }, [cellSize === null || cellSize === void 0 ? void 0 : cellSize.height, fallbackCellHeight, uniqueY]);
    const shouldShowCellLabel = React.useCallback((cell, rowPercent, columnPercent, overallPercent) => {
        if (typeof showCellLabels === 'boolean') {
            return showCellLabels;
        }
        if (typeof showCellLabels === 'function') {
            return showCellLabels({ cell, width: cellW, height: cellH, rowPercent, columnPercent });
        }
        if (showCellLabels && typeof showCellLabels === 'object') {
            const rule = showCellLabels;
            if (rule.minValue != null && cell.value < rule.minValue)
                return false;
            if (rule.minRowPercent != null && rowPercent < rule.minRowPercent)
                return false;
            if (rule.minColumnPercent != null && columnPercent < rule.minColumnPercent)
                return false;
            if (rule.minOverallPercent != null && overallPercent < rule.minOverallPercent)
                return false;
            return true;
        }
        return Math.min(cellW, cellH) >= 26;
    }, [cellH, cellW, showCellLabels]);
    const plotWidth = React.useMemo(() => {
        if (!uniqueX)
            return 0;
        return Math.max(0, cellW * uniqueX + gap * Math.max(uniqueX - 1, 0));
    }, [cellW, gap, uniqueX]);
    const plotHeight = React.useMemo(() => {
        if (!uniqueY)
            return 0;
        return Math.max(0, cellH * uniqueY + gap * Math.max(uniqueY - 1, 0));
    }, [cellH, gap, uniqueY]);
    const hoverOverlay = React.useMemo(() => {
        var _a, _b, _c, _d;
        return ({
            showRow: (_a = hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.showRow) !== null && _a !== void 0 ? _a : true,
            showColumn: (_b = hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.showColumn) !== null && _b !== void 0 ? _b : true,
            rowFill: (_c = hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.rowFill) !== null && _c !== void 0 ? _c : 'rgba(59, 130, 246, 0.08)',
            columnFill: (_d = hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.columnFill) !== null && _d !== void 0 ? _d : 'rgba(59, 130, 246, 0.12)',
            rowOpacity: hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.rowOpacity,
            columnOpacity: hoverHighlight === null || hoverHighlight === void 0 ? void 0 : hoverHighlight.columnOpacity,
        });
    }, [hoverHighlight]);
    const axisScaleX = React.useMemo(() => {
        const domain = uniqueX > 0 ? [0, Math.max(uniqueX - 1, 0)] : [0, 1];
        const range = uniqueX > 0 ? [cellW / 2, Math.max(plotWidth - cellW / 2, cellW / 2)] : [0, 0];
        const scale = ((value) => {
            if (!uniqueX)
                return 0;
            const clamped = Math.max(domain[0], Math.min(domain[1], value));
            return (cellW + gap) * clamped + cellW / 2;
        });
        scale.domain = () => [...domain];
        scale.range = () => [...range];
        scale.ticks = () => {
            if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length)
                return xAxis.ticks;
            return Array.from({ length: uniqueX }, (_, index) => index);
        };
        scale.bandwidth = () => cellW;
        return scale;
    }, [cellW, gap, plotWidth, uniqueX, xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks]);
    const axisScaleY = React.useMemo(() => {
        const domain = uniqueY > 0 ? [0, Math.max(uniqueY - 1, 0)] : [0, 1];
        const range = uniqueY > 0 ? [cellH / 2, Math.max(plotHeight - cellH / 2, cellH / 2)] : [0, 0];
        const scale = ((value) => {
            if (!uniqueY)
                return 0;
            const clamped = Math.max(domain[0], Math.min(domain[1], value));
            return (cellH + gap) * clamped + cellH / 2;
        });
        scale.domain = () => [...domain];
        scale.range = () => [...range];
        scale.ticks = () => {
            if ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length)
                return yAxis.ticks;
            return Array.from({ length: uniqueY }, (_, index) => index);
        };
        scale.bandwidth = () => cellH;
        return scale;
    }, [cellH, gap, plotHeight, uniqueY, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks]);
    const axisXTicks = React.useMemo(() => (axisScaleX.ticks ? axisScaleX.ticks() : []), [axisScaleX]);
    const axisYTicks = React.useMemo(() => (axisScaleY.ticks ? axisScaleY.ticks() : []), [axisScaleY]);
    const normalizedXTicks = React.useMemo(() => {
        if (plotWidth <= 0)
            return [];
        return axisXTicks
            .map((tick) => {
            if (typeof tick !== 'number')
                return null;
            const px = axisScaleX(tick);
            if (!Number.isFinite(px))
                return null;
            return px / plotWidth;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [axisXTicks, axisScaleX, plotWidth]);
    const normalizedYTicks = React.useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return axisYTicks
            .map((tick) => {
            if (typeof tick !== 'number')
                return null;
            const py = axisScaleY(tick);
            if (!Number.isFinite(py))
                return null;
            return py / plotHeight;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [axisYTicks, axisScaleY, plotHeight]);
    // Process cells for AnimatedHeatmapCell components
    const processedCells = React.useMemo(() => {
        if (!cells.length)
            return [];
        const { rowTotals, columnTotals, grandTotal } = totals;
        return cells.map((cell, index) => {
            var _a, _b, _c;
            const pixelX = cell.x * (cellW + gap);
            const pixelY = cell.y * (cellH + gap);
            const normalizedValue = normalizeValue(cell.value);
            const color = (_a = cell.color) !== null && _a !== void 0 ? _a : resolveColor(cell.value);
            const rowSum = (_b = rowTotals[cell.y]) !== null && _b !== void 0 ? _b : 0;
            const columnSum = (_c = columnTotals[cell.x]) !== null && _c !== void 0 ? _c : 0;
            const rowPercent = rowSum !== 0 ? cell.value / rowSum : 0;
            const columnPercent = columnSum !== 0 ? cell.value / columnSum : 0;
            const overallPercent = grandTotal !== 0 ? cell.value / grandTotal : 0;
            const formattedValue = resolvedFormatter
                ? resolvedFormatter({
                    value: cell.value,
                    cell,
                    min: minVal,
                    max: maxVal,
                    rowSum,
                    columnSum,
                    totalSum: grandTotal,
                    rowPercent,
                    columnPercent,
                    overallPercent,
                })
                : cell.formattedValue;
            const displayValue = formattedValue !== null && formattedValue !== void 0 ? formattedValue : cell.formattedValue;
            return {
                ...cell,
                index,
                chartX: pixelX + cellW / 2,
                chartY: pixelY + cellH / 2,
                pixelX,
                pixelY,
                width: cellW,
                height: cellH,
                color,
                normalizedValue,
                displayValue,
                formattedValue,
                rowSum,
                columnSum,
                rowPercent,
                columnPercent,
                overallPercent,
                rowLabel: rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels[cell.y],
                columnLabel: columnLabels === null || columnLabels === void 0 ? void 0 : columnLabels[cell.x],
                showLabel: shouldShowCellLabel(cell, rowPercent, columnPercent, overallPercent),
            };
        });
    }, [cells, cellW, cellH, gap, normalizeValue, resolveColor, totals, resolvedFormatter, minVal, maxVal, rowLabels, columnLabels, shouldShowCellLabel]);
    const totalCells = processedCells.length;
    const animationDisabled = disableAnimation || totalCells > maxAnimatedCells;
    // Register series for tooltip interaction
    useHeatmapSeriesRegistration({
        cells: processedCells,
        seriesName: title || 'Heatmap',
        registerSeries,
    });
    const pointer = interaction === null || interaction === void 0 ? void 0 : interaction.pointer;
    const hoverCell = React.useMemo(() => {
        var _a;
        if (!pointer || !pointer.inside)
            return null;
        const localX = pointer.x - padding.left;
        const localY = pointer.y - padding.top;
        if (localX < 0 || localY < 0 || localX > plotWidth || localY > plotHeight)
            return null;
        const col = Math.floor(localX / (cellW + gap));
        const row = Math.floor(localY / (cellH + gap));
        if (col < 0 || row < 0 || col >= uniqueX || row >= uniqueY)
            return null;
        return (_a = processedCells.find((c) => c.x === col && c.y === row)) !== null && _a !== void 0 ? _a : null;
    }, [pointer, processedCells, cellW, cellH, gap, uniqueX, uniqueY, padding.left, padding.top, plotWidth, plotHeight]);
    const columnHighlight = React.useMemo(() => {
        if (!hoverCell)
            return null;
        const x = Math.max(0, hoverCell.pixelX - gap / 2);
        const expandedWidth = Math.max(hoverCell.width, hoverCell.width + gap);
        const width = Math.max(0, Math.min(plotWidth - x, expandedWidth));
        return {
            x,
            width: width || hoverCell.width,
        };
    }, [gap, hoverCell, plotWidth]);
    const rowHighlight = React.useMemo(() => {
        if (!hoverCell)
            return null;
        const y = Math.max(0, hoverCell.pixelY - gap / 2);
        const expandedHeight = Math.max(hoverCell.height, hoverCell.height + gap);
        const height = Math.max(0, Math.min(plotHeight - y, expandedHeight));
        return {
            y,
            height: height || hoverCell.height,
        };
    }, [gap, hoverCell, plotHeight]);
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip, liveTooltip, enableCrosshair }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && plotWidth > 0 && plotHeight > 0 && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), jsx(Svg, { width: width, height: height, style: { position: 'absolute' }, 
                // @ts-ignore
                onMouseMove: (e) => {
                    if (!setPointer)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
                    // update crosshair to current column index for multiTooltip aggregator
                    const localX = x - padding.left;
                    if (localX >= 0 && localX <= plotWidth) {
                        const col = Math.floor(localX / (cellW + gap));
                        if (col >= 0 && col < uniqueX)
                            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: col, pixelX: x });
                    }
                }, 
                // @ts-ignore
                onMouseLeave: () => { if (interaction === null || interaction === void 0 ? void 0 : interaction.pointer)
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ ...interaction.pointer, inside: false }); }, children: jsxs(G, { x: padding.left, y: padding.top, children: [hoverCell && hoverOverlay.showColumn && columnHighlight && (jsx(Rect, { x: columnHighlight.x, y: 0, width: columnHighlight.width, height: plotHeight, fill: hoverOverlay.columnFill, opacity: hoverOverlay.columnOpacity, pointerEvents: "none" })), hoverCell && hoverOverlay.showRow && rowHighlight && (jsx(Rect, { x: 0, y: rowHighlight.y, width: plotWidth, height: rowHighlight.height, fill: hoverOverlay.rowFill, opacity: hoverOverlay.rowOpacity, pointerEvents: "none" })), processedCells.map((cellData, index) => (jsx(AnimatedHeatmapCell, { cell: cellData, isHovered: Boolean(hoverCell && hoverCell.x === cellData.x && hoverCell.y === cellData.y), index: index, totalCells: processedCells.length, disabled: animationDisabled, cornerRadius: cellCornerRadius, showText: cellData.showLabel }, `${cellData.x}-${cellData.y}`))), hoverCell && (jsx(Text$1, { x: hoverCell.pixelX + hoverCell.width / 2, y: hoverCell.pixelY + hoverCell.height / 2 + Math.min(hoverCell.height * 0.1, 6), fontSize: Math.max(10, Math.min(hoverCell.height * 0.45, 16)), fill: getContrastColor(hoverCell.color), textAnchor: "middle", pointerEvents: "none", fontFamily: 'System', fontWeight: "600", children: (_g = hoverCell.displayValue) !== null && _g !== void 0 ? _g : (Number.isFinite(hoverCell.value)
                                ? hoverCell.value % 1 === 0
                                    ? hoverCell.value.toString()
                                    : hoverCell.value.toFixed(1)
                                : String(hoverCell.value)) }))] }) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: axisXTicks.length, tickSize: (_h = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _h !== void 0 ? _h : 4, tickPadding: 4, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (Number.isNaN(numeric))
                        return String(value !== null && value !== void 0 ? value : '');
                    if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter)
                        return xAxis.labelFormatter(numeric);
                    if (columnLabels && columnLabels[numeric] != null)
                        return String(columnLabels[numeric]);
                    return String(numeric);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_j = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _j !== void 0 ? _j : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _k !== void 0 ? _k : 12) + 20 : 40, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: axisYTicks.length, tickSize: (_l = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _l !== void 0 ? _l : 4, tickPadding: 4, tickFormat: (value) => {
                    const numeric = typeof value === 'number' ? value : Number(value);
                    if (Number.isNaN(numeric))
                        return String(value !== null && value !== void 0 ? value : '');
                    if (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter)
                        return yAxis.labelFormatter(numeric);
                    if (rowLabels && rowLabels[numeric] != null)
                        return String(rowLabels[numeric]);
                    return String(numeric);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_m = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _m !== void 0 ? _m : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_o = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _o !== void 0 ? _o : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } }))] }));
};
HeatmapChart.displayName = 'HeatmapChart';

const AnimatedPath$7 = Animated$1.createAnimatedComponent(Path);
const LABEL_LINE_GAP = 18;
const DEFAULT_LABEL_OFFSET$1 = 12;
function useFunnelGeometry(seriesList, width, height, layout, padding) {
    return useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!seriesList.length) {
            return { segments: [], groups: [], gap: (_a = layout === null || layout === void 0 ? void 0 : layout.gap) !== null && _a !== void 0 ? _a : 8 };
        }
        const filteredSeries = seriesList
            .map((series) => {
            var _a;
            return ({
                ...series,
                steps: ((_a = series.steps) !== null && _a !== void 0 ? _a : []).filter((step) => step.value != null),
            });
        })
            .filter((series) => series.steps.length);
        if (!filteredSeries.length) {
            return { segments: [], groups: [], gap: (_b = layout === null || layout === void 0 ? void 0 : layout.gap) !== null && _b !== void 0 ? _b : 8 };
        }
        const plotWidth = Math.max(width - padding.left - padding.right, 0);
        const plotHeight = Math.max(height - padding.top - padding.bottom, 0);
        const shape = (_c = layout === null || layout === void 0 ? void 0 : layout.shape) !== null && _c !== void 0 ? _c : 'trapezoid';
        const gap = (_d = layout === null || layout === void 0 ? void 0 : layout.gap) !== null && _d !== void 0 ? _d : 8;
        const responsiveBreakpoint = layout === null || layout === void 0 ? void 0 : layout.responsiveBreakpoint;
        const align = responsiveBreakpoint && width < responsiveBreakpoint
            ? 'left'
            : (_e = layout === null || layout === void 0 ? void 0 : layout.align) !== null && _e !== void 0 ? _e : 'center';
        const labelMaxWidth = (_f = layout === null || layout === void 0 ? void 0 : layout.labelMaxWidth) !== null && _f !== void 0 ? _f : 0;
        const minSegmentHeight = (_g = layout === null || layout === void 0 ? void 0 : layout.minSegmentHeight) !== null && _g !== void 0 ? _g : 0;
        const seriesMode = (_h = layout === null || layout === void 0 ? void 0 : layout.seriesMode) !== null && _h !== void 0 ? _h : (filteredSeries.length > 1 ? 'grouped' : 'single');
        const groupGap = (_j = layout === null || layout === void 0 ? void 0 : layout.groupGap) !== null && _j !== void 0 ? _j : 24;
        const stepCount = filteredSeries.reduce((acc, series) => Math.max(acc, series.steps.length), 0);
        if (!stepCount) {
            return { segments: [], groups: [], gap };
        }
        const availableHeight = plotHeight - gap * (stepCount - 1);
        let segmentHeight = stepCount ? availableHeight / stepCount : 0;
        if (minSegmentHeight > 0 && segmentHeight < minSegmentHeight) {
            segmentHeight = minSegmentHeight;
        }
        const usedHeight = segmentHeight * stepCount + gap * (stepCount - 1);
        const verticalOffset = padding.top + Math.max(0, (plotHeight - usedHeight) / 2);
        const seriesCount = filteredSeries.length;
        const slotGap = seriesMode === 'grouped' ? groupGap : 0;
        const effectivePlotWidth = seriesMode === 'grouped'
            ? plotWidth - Math.max(seriesCount - 1, 0) * slotGap
            : plotWidth;
        const slotWidth = seriesMode === 'grouped' && seriesCount > 0
            ? Math.max(effectivePlotWidth / seriesCount, 0)
            : plotWidth;
        const segments = [];
        const groups = Array.from({ length: stepCount }, (_, stepIndex) => ({
            stepIndex,
            y: verticalOffset + stepIndex * (segmentHeight + gap),
            height: segmentHeight,
            segments: [],
        }));
        filteredSeries.forEach((series, seriesIndex) => {
            var _a, _b;
            const slotLeft = seriesMode === 'grouped'
                ? padding.left + seriesIndex * (slotWidth + slotGap)
                : padding.left;
            const steps = series.steps;
            if (!steps.length)
                return;
            const maxValue = Math.max(...steps.map((step) => step.value), 1);
            const firstValue = (_b = (_a = steps[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 1;
            steps.forEach((step, stepIndex) => {
                var _a, _b, _c, _d, _e, _f;
                const topValue = step.value;
                const bottomValue = (_b = (_a = steps[stepIndex + 1]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : topValue;
                const topWidth = maxValue > 0 ? (topValue / maxValue) * slotWidth : 0;
                const bottomWidth = shape === 'bar' ? topWidth : maxValue > 0 ? (bottomValue / maxValue) * slotWidth : 0;
                const previousValue = (_c = steps[stepIndex - 1]) === null || _c === void 0 ? void 0 : _c.value;
                const dropValue = previousValue != null ? Math.max(previousValue - topValue, 0) : 0;
                const dropRate = previousValue && previousValue > 0 ? dropValue / previousValue : 0;
                const stepConversion = previousValue && previousValue > 0 ? topValue / previousValue : 1;
                const cumulativeConversion = firstValue > 0 ? topValue / firstValue : 1;
                const group = groups[stepIndex];
                const y = group.y;
                const computeX = (segmentWidth) => {
                    if (align === 'left') {
                        return slotLeft;
                    }
                    if (align === 'right') {
                        return slotLeft + Math.max(0, slotWidth - segmentWidth);
                    }
                    return slotLeft + Math.max(0, (slotWidth - segmentWidth) / 2);
                };
                const xTop = computeX(topWidth);
                const xBottom = computeX(bottomWidth);
                const topCenter = { x: xTop + topWidth / 2, y };
                const bottomCenter = { x: xBottom + bottomWidth / 2, y: y + segmentHeight };
                const intrinsicLabelAnchor = align === 'left'
                    ? 'start'
                    : align === 'right'
                        ? 'end'
                        : 'middle';
                const requestedLabelPosition = (_d = step.labelPosition) !== null && _d !== void 0 ? _d : 'inside';
                let resolvedLabelPosition = requestedLabelPosition;
                let labelAnchor = intrinsicLabelAnchor;
                let labelX = (topCenter.x + bottomCenter.x) / 2;
                if (resolvedLabelPosition === 'outside-left') {
                    labelAnchor = 'end';
                    labelX = Math.min(xTop, xBottom) - DEFAULT_LABEL_OFFSET$1;
                }
                if (resolvedLabelPosition === 'outside-right') {
                    labelAnchor = 'start';
                    labelX = Math.max(xTop + topWidth, xBottom + bottomWidth) + DEFAULT_LABEL_OFFSET$1;
                }
                if (resolvedLabelPosition === 'inside' && labelMaxWidth > 0) {
                    const widestSection = Math.max(topWidth, bottomWidth);
                    if (widestSection < labelMaxWidth) {
                        resolvedLabelPosition = align === 'right' ? 'outside-left' : 'outside-right';
                        if (resolvedLabelPosition === 'outside-left') {
                            labelAnchor = 'end';
                            labelX = Math.min(xTop, xBottom) - DEFAULT_LABEL_OFFSET$1;
                        }
                        else {
                            labelAnchor = 'start';
                            labelX = Math.max(xTop + topWidth, xBottom + bottomWidth) + DEFAULT_LABEL_OFFSET$1;
                        }
                    }
                }
                const color = step.color
                    || series.color
                    || getColorFromScheme(seriesIndex * steps.length + stepIndex, colorSchemes.default);
                const path = `M ${xTop} ${y} L ${xTop + topWidth} ${y} L ${xBottom + bottomWidth} ${y + segmentHeight} L ${xBottom} ${y + segmentHeight} Z`;
                const segment = {
                    id: `${(_e = series.id) !== null && _e !== void 0 ? _e : seriesIndex}-${(_f = step.label) !== null && _f !== void 0 ? _f : stepIndex}`,
                    seriesIndex,
                    seriesId: series.id,
                    seriesName: series.name,
                    stepIndex,
                    step,
                    value: topValue,
                    path,
                    color,
                    bounds: {
                        x: Math.min(xTop, xBottom),
                        y,
                        width: Math.max(xTop + topWidth, xBottom + bottomWidth) - Math.min(xTop, xBottom),
                        height: segmentHeight,
                    },
                    labelX,
                    labelAnchor,
                    labelPosition: resolvedLabelPosition,
                    previousValue,
                    dropRate,
                    dropValue,
                    stepConversion,
                    cumulativeConversion,
                    center: { x: (topCenter.x + bottomCenter.x) / 2, y: y + segmentHeight / 2 },
                    topCenter,
                    bottomCenter,
                    slotLeft,
                    slotWidth,
                    topWidth,
                    bottomWidth,
                    xTop,
                    xBottom,
                    height: segmentHeight,
                    trend: step.trend,
                    trendLabel: step.trendLabel,
                    trendDelta: step.trendDelta,
                    firstValue,
                };
                segments.push(segment);
                group.segments.push(segment);
            });
        });
        return { segments, groups, gap };
    }, [seriesList, width, height, layout, padding]);
}
// Animated funnel segment component
const AnimatedFunnelSegment = React.memo(({ segment, animationProgress, showConversion, valueFormatter, steps, disabled, onHover, onHoverOut, theme }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            return;
        }
        const delay = segment.stepIndex * 200; // Stagger animation
        scale.value = withDelay(delay, withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, segment.stepIndex, scale]);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value * scale.value;
        // Scale the path from center
        if (progress === 0) {
            return { d: '', opacity: 0 };
        }
        return {
            d: segment.path,
            opacity: progress,
        };
    }, [segment.path]);
    const isWeb = Platform.OS === 'web';
    const midY = segment.center.y;
    const labelLines = useMemo(() => {
        var _a, _b;
        const context = {
            index: segment.stepIndex,
            step: segment.step,
            steps,
            previousValue: segment.previousValue,
            firstValue: (_b = (_a = steps[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : segment.value,
            conversion: segment.cumulativeConversion,
            dropRate: segment.dropRate,
            dropValue: segment.dropValue,
        };
        const normalizeLines = (input) => {
            if (!input)
                return [];
            if (Array.isArray(input)) {
                return input
                    .map(line => (line == null ? '' : `${line}`.trim()))
                    .filter(line => line.length > 0);
            }
            return `${input}`
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
        };
        const customLines = valueFormatter
            ? normalizeLines(valueFormatter(segment.value, segment.stepIndex, context))
            : [];
        if (customLines.length) {
            const [firstLine, ...rest] = customLines;
            return [
                `${segment.step.label}: ${firstLine}`,
                ...rest,
            ];
        }
        const baseLine = `${segment.step.label}: ${formatNumber$2(segment.value)}`;
        if (showConversion) {
            return [
                `${baseLine} (${(segment.cumulativeConversion * 100).toFixed(1)}%)`,
            ];
        }
        const lines = [baseLine];
        if (segment.stepConversion !== 1 || segment.stepIndex > 0) {
            lines.push(`Step retained ${(segment.stepConversion * 100).toFixed(1)}%`);
        }
        if (segment.trendLabel) {
            lines.push(segment.trendLabel);
        }
        else if (segment.trendDelta != null) {
            const arrow = segment.trendDelta > 0 ? '▲' : segment.trendDelta < 0 ? '▼' : '◆';
            const magnitude = Math.abs(segment.trendDelta * 100).toFixed(1);
            lines.push(`Trend ${arrow} ${magnitude}%`);
        }
        return lines;
    }, [segment, steps, valueFormatter, showConversion]);
    const totalLabelHeight = (labelLines.length - 1) * LABEL_LINE_GAP;
    const startY = midY - totalLabelHeight / 2;
    return (jsxs(G, { ...(isWeb ? {
            // @ts-ignore web events
            onMouseEnter: onHover,
            // @ts-ignore web events
            onMouseLeave: onHoverOut,
        } : {}), children: [jsx(AnimatedPath$7, { animatedProps: animatedProps, fill: segment.color, stroke: segment.color, strokeWidth: 1 }), jsx(Text$1, { x: segment.labelX, y: startY, fontSize: theme.fontSize.sm, fill: theme.colors.textPrimary, fontFamily: theme.fontFamily, textAnchor: segment.labelAnchor, children: labelLines.map((line, idx) => (jsx(TSpan, { x: segment.labelX, dy: idx === 0 ? 0 : LABEL_LINE_GAP, fontSize: idx === 0 ? theme.fontSize.sm : theme.fontSize.xs, fill: idx === 0 ? theme.colors.textPrimary : theme.colors.textSecondary, fontWeight: idx === 0 ? '600' : '400', children: line }, `${segment.id}-${idx}-${line}`))) })] }));
});
AnimatedFunnelSegment.displayName = 'AnimatedFunnelSegment';
const FunnelChart = (props) => {
    var _a, _b;
    const { series, width = 360, height = 420, title, subtitle, layout, valueFormatter, legend, style, multiTooltip = true, liveTooltip = false, enableCrosshair = true, disabled = false, animationDuration = 800, accessibilityTable, onDataTable, } = props;
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_c) {
        interaction = null;
    }
    const theme = useChartTheme();
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const seriesArr = useMemo(() => (Array.isArray(series) ? series : [series]), [series]);
    const padding = useMemo(() => ({ top: 50, bottom: 40, left: 40, right: 40 }), []);
    const showConversion = (layout === null || layout === void 0 ? void 0 : layout.showConversion) !== false;
    const geometry = useFunnelGeometry(seriesArr, width, height, layout, padding);
    const { segments, groups } = geometry;
    const seriesSteps = useMemo(() => {
        return seriesArr.map((entry) => { var _a; return ((_a = entry.steps) !== null && _a !== void 0 ? _a : []).filter((step) => step.value != null); });
    }, [seriesArr]);
    const stepsForLegend = (_a = seriesSteps[0]) !== null && _a !== void 0 ? _a : [];
    const connectors = useMemo(() => {
        var _a, _b, _c;
        const config = layout === null || layout === void 0 ? void 0 : layout.connectors;
        const shouldShow = (_a = config === null || config === void 0 ? void 0 : config.show) !== null && _a !== void 0 ? _a : true;
        if (!shouldShow || segments.length === 0)
            return [];
        const bySeries = new Map();
        segments.forEach((segment) => {
            var _a;
            const collection = (_a = bySeries.get(segment.seriesIndex)) !== null && _a !== void 0 ? _a : [];
            collection.push(segment);
            bySeries.set(segment.seriesIndex, collection);
        });
        const formatter = (_b = config === null || config === void 0 ? void 0 : config.labelFormatter) !== null && _b !== void 0 ? _b : ((context) => [
            `Retained ${(context.stepConversion * 100).toFixed(1)}%`,
            `Drop ${(context.dropRate * 100).toFixed(1)}%`,
        ]);
        const labelOffset = (_c = config === null || config === void 0 ? void 0 : config.labelOffset) !== null && _c !== void 0 ? _c : 10;
        const connectorsList = [];
        bySeries.forEach((seriesSegments, seriesIndex) => {
            const ordered = [...seriesSegments].sort((a, b) => a.stepIndex - b.stepIndex);
            ordered.forEach((fromSegment, idx) => {
                var _a;
                const toSegment = ordered[idx + 1];
                if (!toSegment)
                    return;
                const context = {
                    index: toSegment.stepIndex,
                    from: fromSegment.step,
                    to: toSegment.step,
                    cumulativeConversion: toSegment.cumulativeConversion,
                    stepConversion: toSegment.stepConversion,
                    dropRate: toSegment.dropRate,
                    fromValue: fromSegment.value,
                    toValue: toSegment.value,
                    goal: undefined,
                };
                const labelLines = formatter(context);
                if (!labelLines || (Array.isArray(labelLines) && labelLines.length === 0))
                    return;
                const radius = (_a = config === null || config === void 0 ? void 0 : config.radius) !== null && _a !== void 0 ? _a : 18;
                const start = fromSegment.bottomCenter;
                const end = toSegment.topCenter;
                const controlY1 = start.y + radius;
                const controlY2 = end.y - radius;
                const midPoint = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2,
                };
                const labelAnchor = 'middle';
                const position = {
                    x: midPoint.x,
                    y: midPoint.y - labelOffset,
                };
                const path = `M ${start.x} ${start.y} C ${start.x} ${controlY1} ${end.x} ${controlY2} ${end.x} ${end.y}`;
                connectorsList.push({
                    id: `${fromSegment.id}->${toSegment.id}`,
                    path,
                    labelLines: Array.isArray(labelLines) ? labelLines : `${labelLines}`.split('\n'),
                    position,
                    labelAnchor,
                    seriesIndex,
                    fromId: fromSegment.id,
                    toId: toSegment.id,
                });
            });
        });
        return connectorsList;
    }, [layout === null || layout === void 0 ? void 0 : layout.connectors, segments]);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => segments.map((segment) => `${segment.id}-${segment.value}-${segment.color}`).join('|'), [segments]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    const registrationSignature = dataSignature;
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !registrationSignature)
            return;
        if (registeredSignatureRef.current === registrationSignature)
            return;
        segments.forEach((segment) => {
            var _a;
            registerSeries({
                id: segment.id,
                name: seriesArr.length > 1
                    ? `${segment.step.label} (${(_a = segment.seriesName) !== null && _a !== void 0 ? _a : `Series ${segment.seriesIndex + 1}`})`
                    : segment.step.label,
                color: segment.color,
                points: [
                    {
                        x: segment.stepIndex,
                        y: segment.value,
                        meta: {
                            step: segment.step,
                            seriesIndex: segment.seriesIndex,
                            seriesId: segment.seriesId,
                            seriesName: segment.seriesName,
                            cumulativeConversion: segment.cumulativeConversion,
                            stepConversion: segment.stepConversion,
                            dropRate: segment.dropRate,
                            dropValue: segment.dropValue,
                        },
                    },
                ],
                visible: true,
            });
        });
        registeredSignatureRef.current = registrationSignature;
    }, [registerSeries, registrationSignature, segments, seriesArr.length]);
    const visibleSegments = useMemo(() => {
        if (!(interaction === null || interaction === void 0 ? void 0 : interaction.series))
            return segments;
        const overrides = new Map(interaction.series.map((entry) => [entry.id, entry.visible]));
        return segments.filter((segment) => {
            const override = overrides.get(segment.id);
            return override !== false;
        });
    }, [segments, interaction === null || interaction === void 0 ? void 0 : interaction.series]);
    const findSegmentAtPoint = useCallback((x, y) => {
        for (let i = 0; i < visibleSegments.length; i += 1) {
            const segment = visibleSegments[i];
            if (y < segment.bounds.y || y > segment.bounds.y + segment.height)
                continue;
            const relativeY = segment.height > 0 ? (y - segment.bounds.y) / segment.height : 0;
            const left = segment.xTop + (segment.xBottom - segment.xTop) * relativeY;
            const widthAtY = segment.topWidth + (segment.bottomWidth - segment.topWidth) * relativeY;
            if (x >= left && x <= left + widthAtY) {
                return segment;
            }
        }
        return null;
    }, [visibleSegments]);
    const activeSegment = useMemo(() => {
        var _a;
        if (!((_a = interaction === null || interaction === void 0 ? void 0 : interaction.pointer) === null || _a === void 0 ? void 0 : _a.inside))
            return null;
        const { x, y } = interaction.pointer;
        return findSegmentAtPoint(x, y);
    }, [findSegmentAtPoint, interaction === null || interaction === void 0 ? void 0 : interaction.pointer]);
    const handleSegmentHover = useCallback((segment) => {
        if (!segment) {
            if ((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) && setPointer) {
                setPointer({ ...interaction.pointer, inside: false });
            }
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
            return;
        }
        if (!setPointer || !setCrosshair)
            return;
        const midPoint = segment.center;
        setPointer({
            x: midPoint.x,
            y: midPoint.y,
            inside: true,
            pageX: midPoint.x,
            pageY: midPoint.y,
        });
        setCrosshair({ dataX: segment.stepIndex, pixelX: midPoint.x });
    }, [interaction === null || interaction === void 0 ? void 0 : interaction.pointer, setPointer, setCrosshair]);
    const handleSegmentHoverOut = useCallback(() => handleSegmentHover(null), [handleSegmentHover]);
    const connectorVisibility = useMemo(() => {
        if (!(interaction === null || interaction === void 0 ? void 0 : interaction.series))
            return new Set();
        const hiddenIds = new Set();
        interaction.series.forEach((entry) => {
            if (entry.visible === false)
                hiddenIds.add(`${entry.id}`);
        });
        return hiddenIds;
    }, [interaction === null || interaction === void 0 ? void 0 : interaction.series]);
    const dataTable = useMemo(() => {
        const bySeries = new Map();
        segments.forEach((segment) => {
            const existing = bySeries.get(segment.seriesIndex);
            const row = {
                label: segment.step.label,
                value: segment.value,
                cumulativeConversion: segment.cumulativeConversion,
                stepConversion: segment.stepConversion,
                dropRate: segment.dropRate,
                dropValue: segment.dropValue,
                trendDelta: segment.trendDelta,
                trendLabel: segment.trendLabel,
            };
            if (!existing) {
                bySeries.set(segment.seriesIndex, {
                    seriesId: segment.seriesId,
                    seriesName: segment.seriesName,
                    rows: [row],
                });
            }
            else {
                existing.rows.push(row);
            }
        });
        return Array.from(bySeries.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([, payload]) => ({
            ...payload,
            rows: payload.rows.sort((a, b) => {
                var _a, _b, _c, _d;
                const stepA = (_b = (_a = segments.find((segment) => segment.step.label === a.label)) === null || _a === void 0 ? void 0 : _a.stepIndex) !== null && _b !== void 0 ? _b : 0;
                const stepB = (_d = (_c = segments.find((segment) => segment.step.label === b.label)) === null || _c === void 0 ? void 0 : _c.stepIndex) !== null && _d !== void 0 ? _d : 0;
                return stepA - stepB;
            }),
        }));
    }, [segments]);
    useEffect(() => {
        if (onDataTable) {
            onDataTable(dataTable);
        }
    }, [dataTable, onDataTable]);
    const visibleSegmentIds = useMemo(() => new Set(visibleSegments.map((segment) => segment.id)), [visibleSegments]);
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip, liveTooltip, enableCrosshair }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(Svg, { width: width, height: height, style: { position: 'absolute' }, 
                // @ts-ignore web events
                onMouseMove: (e) => {
                    var _a;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const segmentAtPoint = findSegmentAtPoint(x, y);
                    if (segmentAtPoint) {
                        handleSegmentHover(segmentAtPoint);
                    }
                    else if ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.pointer) === null || _a === void 0 ? void 0 : _a.inside) {
                        handleSegmentHover(null);
                    }
                }, 
                // @ts-ignore web events
                onMouseLeave: () => {
                    handleSegmentHover(null);
                }, children: jsxs(G, { children: [connectors.map((connector) => {
                            var _a, _b, _c, _d, _e;
                            if (connectorVisibility.has(connector.fromId) ||
                                connectorVisibility.has(connector.toId) ||
                                !visibleSegmentIds.has(connector.fromId) ||
                                !visibleSegmentIds.has(connector.toId)) {
                                return null;
                            }
                            const stroke = (_c = (_b = (_a = layout === null || layout === void 0 ? void 0 : layout.connectors) === null || _a === void 0 ? void 0 : _a.stroke) !== null && _b !== void 0 ? _b : theme.colors.grid) !== null && _c !== void 0 ? _c : '#CBD5F5';
                            const strokeWidth = (_e = (_d = layout === null || layout === void 0 ? void 0 : layout.connectors) === null || _d === void 0 ? void 0 : _d.strokeWidth) !== null && _e !== void 0 ? _e : 2;
                            return (jsxs(G, { pointerEvents: "none", children: [jsx(Path, { d: connector.path, stroke: stroke, strokeWidth: strokeWidth, fill: "none", opacity: 0.65 }), connector.labelLines.map((line, lineIndex) => (jsx(Text$1, { x: connector.position.x, y: connector.position.y + lineIndex * LABEL_LINE_GAP, fontSize: lineIndex === 0 ? theme.fontSize.xs : theme.fontSize.xs - 1, fill: theme.colors.textSecondary, textAnchor: connector.labelAnchor, children: line }, `${connector.id}-label-${lineIndex}`)))] }, connector.id));
                        }), segments.map((segment) => {
                            var _a;
                            if (!visibleSegmentIds.has(segment.id))
                                return null;
                            const seriesStepsForSegment = (_a = seriesSteps[segment.seriesIndex]) !== null && _a !== void 0 ? _a : [];
                            return (jsx(AnimatedFunnelSegment, { segment: segment, animationProgress: animationProgress, showConversion: showConversion, valueFormatter: valueFormatter, steps: seriesStepsForSegment, disabled: disabled, onHover: () => handleSegmentHover(segment), onHoverOut: handleSegmentHoverOut, theme: theme }, segment.id));
                        }), activeSegment && (jsx(Path, { d: activeSegment.path, fill: "none", stroke: "#111827", strokeWidth: 2, pointerEvents: "none" }))] }) }), (legend === null || legend === void 0 ? void 0 : legend.show) !== false && segments.length > 0 && (jsx(ChartLegend, { items: (() => {
                    if (seriesArr.length > 1) {
                        return seriesArr.map((entry, index) => {
                            var _a, _b, _c, _d;
                            const seriesSegments = segments.filter((segment) => segment.seriesIndex === index);
                            const visible = seriesSegments.some((segment) => visibleSegmentIds.has(segment.id));
                            return {
                                label: (_a = entry.name) !== null && _a !== void 0 ? _a : `Series ${index + 1}`,
                                color: (_d = (_c = (_b = seriesSegments[0]) === null || _b === void 0 ? void 0 : _b.color) !== null && _c !== void 0 ? _c : entry.color) !== null && _d !== void 0 ? _d : getColorFromScheme(index, colorSchemes.default),
                                visible,
                            };
                        });
                    }
                    return stepsForLegend.map((step, idx) => {
                        var _a, _b;
                        const segment = segments.find((candidate) => candidate.seriesIndex === 0 && candidate.stepIndex === idx);
                        const visible = segment ? visibleSegmentIds.has(segment.id) : true;
                        return {
                            label: step.label,
                            color: (_b = (_a = segment === null || segment === void 0 ? void 0 : segment.color) !== null && _a !== void 0 ? _a : step.color) !== null && _b !== void 0 ? _b : getColorFromScheme(idx, colorSchemes.default),
                            visible,
                        };
                    });
                })(), position: legend === null || legend === void 0 ? void 0 : legend.position, align: legend === null || legend === void 0 ? void 0 : legend.align, onItemPress: (item, index, nativeEvent) => {
                    if (!updateSeriesVisibility)
                        return;
                    if (seriesArr.length > 1) {
                        const seriesSegments = segments.filter((segment) => segment.seriesIndex === index);
                        if (!seriesSegments.length)
                            return;
                        const isVisible = seriesSegments.some((segment) => visibleSegmentIds.has(segment.id));
                        seriesSegments.forEach((segment) => updateSeriesVisibility(segment.id, !isVisible));
                        return;
                    }
                    const segment = segments.find((candidate) => candidate.seriesIndex === 0 && candidate.stepIndex === index);
                    if (!segment)
                        return;
                    const isVisible = visibleSegmentIds.has(segment.id);
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        segments
                            .filter((candidate) => candidate.seriesIndex === 0)
                            .forEach((candidate) => updateSeriesVisibility(candidate.id, candidate.id === segment.id ? true : !isVisible));
                    }
                    else {
                        updateSeriesVisibility(segment.id, !isVisible);
                    }
                } })), Platform.OS === 'web' && ((_b = accessibilityTable === null || accessibilityTable === void 0 ? void 0 : accessibilityTable.show) !== null && _b !== void 0 ? _b : true) && dataTable.length > 0
                ? React.createElement('div', {
                    id: accessibilityTable === null || accessibilityTable === void 0 ? void 0 : accessibilityTable.id,
                    role: 'presentation',
                    style: {
                        position: 'absolute',
                        left: -9999,
                        width: 1,
                        height: 1,
                        overflow: 'hidden',
                    },
                }, dataTable.map((payload, payloadIndex) => {
                    var _a, _b, _c;
                    return React.createElement('table', {
                        key: `${(_a = payload.seriesId) !== null && _a !== void 0 ? _a : `series-${payloadIndex}`}`,
                        role: 'table',
                        'aria-label': (_b = accessibilityTable === null || accessibilityTable === void 0 ? void 0 : accessibilityTable.summary) !== null && _b !== void 0 ? _b : `${title !== null && title !== void 0 ? title : 'Funnel'} data ${(_c = payload.seriesName) !== null && _c !== void 0 ? _c : ''}`,
                        style: { borderCollapse: 'collapse', marginBottom: '8px' },
                    }, [
                        React.createElement('thead', { key: 'head' }, React.createElement('tr', { key: 'header-row' }, ['Stage', 'Value', 'Retained vs. start', 'Retained vs. prior', 'Drop value'].map((header) => React.createElement('th', { key: header, style: { textAlign: 'left', paddingRight: '12px' } }, header)))),
                        React.createElement('tbody', { key: 'body' }, payload.rows.map((row, rowIndex) => React.createElement('tr', { key: `${payloadIndex}-${rowIndex}` }, [
                            React.createElement('td', { key: 'label' }, row.label),
                            React.createElement('td', { key: 'value' }, formatNumber$2(row.value)),
                            React.createElement('td', { key: 'cum' }, `${(row.cumulativeConversion * 100).toFixed(1)}%`),
                            React.createElement('td', { key: 'step' }, `${(row.stepConversion * 100).toFixed(1)}%`),
                            React.createElement('td', { key: 'drop' }, `${row.dropValue.toLocaleString()} (${(row.dropRate * 100).toFixed(1)}%)`),
                        ]))),
                    ]);
                }))
                : null] }));
};
FunnelChart.displayName = 'FunnelChart';

const AnimatedRect$5 = Animated$1.createAnimatedComponent(Rect);
const toNativePointerEvent$3 = (event) => {
    var _a, _b, _c, _d;
    const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
    return {
        nativeEvent: {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event === null || event === void 0 ? void 0 : event.pageX) !== null && _c !== void 0 ? _c : event === null || event === void 0 ? void 0 : event.clientX,
            pageY: (_d = event === null || event === void 0 ? void 0 : event.pageY) !== null && _d !== void 0 ? _d : event === null || event === void 0 ? void 0 : event.clientY,
        },
    };
};
const AnimatedStackedSegment = React.memo(({ segment, animationProgress, borderRadius, disabled, onHoverIn, onHoverOut, onPress }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const height = segment.height * progress;
        const y = segment.isPositive ? segment.baseY - height : segment.baseY;
        return {
            x: segment.x,
            y,
            width: segment.width,
            height,
        };
    }, [segment]);
    const isWeb = Platform.OS === 'web';
    return (jsx(AnimatedRect$5, { animatedProps: animatedProps, rx: borderRadius, ry: borderRadius, fill: segment.color, opacity: segment.visible ? 1 : 0, pointerEvents: segment.visible ? 'auto' : 'none', ...(isWeb
            ? {
                onPointerEnter: () => !disabled && onHoverIn(segment),
                onPointerLeave: () => onHoverOut(segment),
                onPointerDown: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                },
                onPointerUp: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                    onPress(segment, toNativePointerEvent$3(event));
                },
                onPointerCancel: () => onHoverOut(segment),
            }
            : {
                onPressIn: () => !disabled && onHoverIn(segment),
                onPressOut: () => onHoverOut(segment),
                onPress: (event) => !disabled && onPress(segment, { nativeEvent: event.nativeEvent }),
            }) }));
});
AnimatedStackedSegment.displayName = 'AnimatedStackedSegment';
const StackedBarChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { series, width = 400, height = 300, barSpacing = 0.25, title, subtitle, legend = { show: true, position: 'bottom', align: 'center' }, animationDuration = 800, disabled = false, style, xAxis, yAxis, grid, onPress, onDataPointPress, ...rest } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_s) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const interactionSeries = interaction === null || interaction === void 0 ? void 0 : interaction.series;
    const basePadding = { top: 40, right: 24, bottom: 64, left: 80 };
    const padding = React.useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const categories = useMemo(() => {
        const set = new Set();
        series.forEach((s) => s.data.forEach((d) => set.add(d.category)));
        return Array.from(set);
    }, [series]);
    const categoryIndexMap = useMemo(() => {
        return new Map(categories.map((category, index) => [category, index]));
    }, [categories]);
    const resolvedSeries = useMemo(() => {
        return series.map((s, index) => {
            var _a;
            const id = String((_a = s.id) !== null && _a !== void 0 ? _a : `stacked-${index}`);
            const override = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((entry) => entry.id === id);
            const visible = override ? override.visible !== false : s.visible !== false;
            const color = s.color || theme.colors.accentPalette[index % theme.colors.accentPalette.length] || getColorFromScheme(index, colorSchemes.default);
            return {
                id,
                name: s.name,
                color,
                visible,
                data: s.data || [],
                seriesIndex: index,
            };
        });
    }, [series, interactionSeries, theme.colors.accentPalette]);
    const layoutResult = useMemo(() => {
        const layouts = categories.map((category, categoryIndex) => ({
            category,
            categoryIndex,
            segments: [],
            positiveTotal: 0,
            negativeTotal: 0,
        }));
        new Map(categories.map((category, index) => [category, layouts[index]]));
        const segmentLookup = new Map();
        resolvedSeries.forEach((seriesEntry) => {
            layouts.forEach((layout) => {
                var _a;
                const dataPoint = seriesEntry.data.find((d) => d.category === layout.category);
                const value = (_a = dataPoint === null || dataPoint === void 0 ? void 0 : dataPoint.value) !== null && _a !== void 0 ? _a : 0;
                const isPositive = value >= 0;
                const y0 = isPositive ? layout.positiveTotal : layout.negativeTotal;
                const y1 = y0 + value;
                if (isPositive)
                    layout.positiveTotal = y1;
                else
                    layout.negativeTotal = y1;
                const segment = {
                    id: `${seriesEntry.id}::${layout.category}`,
                    category: layout.category,
                    categoryIndex: layout.categoryIndex,
                    seriesId: seriesEntry.id,
                    seriesIndex: seriesEntry.seriesIndex,
                    seriesName: seriesEntry.name,
                    value,
                    y0,
                    y1,
                    color: (dataPoint === null || dataPoint === void 0 ? void 0 : dataPoint.color) || seriesEntry.color,
                    dataPoint,
                    visible: seriesEntry.visible,
                };
                layout.segments.push(segment);
                segmentLookup.set(segment.id, segment);
            });
        });
        const maxPositive = layouts.reduce((max, layout) => Math.max(max, layout.segments.some((seg) => seg.visible && seg.value > 0) ? layout.positiveTotal : max), 0);
        const minNegative = layouts.reduce((min, layout) => Math.min(min, layout.segments.some((seg) => seg.visible && seg.value < 0) ? layout.negativeTotal : min), 0);
        const domainMin = Math.min(0, minNegative);
        const domainMax = Math.max(0, maxPositive);
        const range = domainMax - domainMin;
        const valueDomain = range === 0 ? [domainMin, domainMin + 1] : [domainMin, domainMax];
        return {
            categories: layouts,
            valueDomain,
            segmentLookup,
        };
    }, [categories, resolvedSeries]);
    const xScale = useMemo(() => {
        const paddingInner = Math.min(Math.max(barSpacing, 0), 0.9);
        const paddingOuter = 0.1;
        return bandScale(categories, [0, plotWidth], {
            paddingInner,
            paddingOuter,
        });
    }, [categories, plotWidth, barSpacing]);
    const valueScale = useMemo(() => linearScale(layoutResult.valueDomain, [plotHeight, 0]), [layoutResult.valueDomain, plotHeight]);
    const computedSegments = useMemo(() => {
        const bandwidth = xScale.bandwidth ? xScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
        return layoutResult.categories.map((layout) => {
            var _a;
            const x = (_a = xScale(layout.category)) !== null && _a !== void 0 ? _a : 0;
            const segments = layout.segments.map((segment) => {
                const y0Px = valueScale(segment.y0);
                const y1Px = valueScale(segment.y1);
                const top = Math.min(y0Px, y1Px);
                const bottom = Math.max(y0Px, y1Px);
                const height = Math.max(0, bottom - top);
                const isPositive = segment.y1 >= segment.y0;
                const baseY = isPositive ? bottom : top;
                return {
                    ...segment,
                    x,
                    width: bandwidth,
                    y: top,
                    baseY,
                    height,
                    isPositive,
                };
            });
            return { layout, x, segments };
        });
    }, [layoutResult.categories, xScale, valueScale, categories.length, plotWidth]);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        const seriesSignature = resolvedSeries
            .map((seriesEntry) => {
            const values = categories
                .map((category) => {
                var _a;
                const segment = layoutResult.segmentLookup.get(`${seriesEntry.id}::${category}`);
                return `${category}:${(_a = segment === null || segment === void 0 ? void 0 : segment.value) !== null && _a !== void 0 ? _a : 0}`;
            })
                .join('|');
            return `${seriesEntry.id}:${seriesEntry.visible ? '1' : '0'}:${values}`;
        })
            .join('||');
        return `${seriesSignature}|domain:${layoutResult.valueDomain.join(',')}`;
    }, [resolvedSeries, categories, layoutResult.segmentLookup, layoutResult.valueDomain]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    const valueTicks = useMemo(() => {
        if ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
            return yAxis.ticks;
        }
        const fallbackCount = 5;
        return generateNiceTicks(layoutResult.valueDomain[0], layoutResult.valueDomain[1], fallbackCount);
    }, [layoutResult.valueDomain, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks]);
    const normalizedYTicks = useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return valueTicks.map((tick) => {
            const pixel = valueScale(tick);
            return pixel / plotHeight;
        });
    }, [valueTicks, valueScale, plotHeight]);
    const normalizedXTicks = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        const bandwidth = xScale.bandwidth ? xScale.bandwidth() : 0;
        return categories.map((category) => {
            var _a;
            const position = ((_a = xScale(category)) !== null && _a !== void 0 ? _a : 0) + bandwidth / 2;
            return position / plotWidth;
        });
    }, [categories, xScale, plotWidth]);
    const xAxisScale = useMemo(() => {
        const bandwidth = xScale.bandwidth ? xScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
        const scale = ((value) => {
            var _a;
            const base = (_a = xScale(value)) !== null && _a !== void 0 ? _a : 0;
            return base + bandwidth / 2;
        });
        scale.domain = () => categories.slice();
        scale.range = () => [0, plotWidth];
        scale.ticks = () => categories.slice();
        scale.bandwidth = () => bandwidth;
        return scale;
    }, [xScale, categories, plotWidth]);
    const yAxisScale = useMemo(() => {
        const scale = ((value) => valueScale(value));
        scale.domain = () => valueScale.domain();
        scale.range = () => valueScale.range();
        scale.ticks = () => valueTicks.slice();
        return scale;
    }, [valueScale, valueTicks]);
    const segmentHoverRef = useRef(null);
    const handleHoverIn = useCallback((segment) => {
        segmentHoverRef.current = segment.id;
        const pointerX = padding.left + segment.x + segment.width / 2;
        const pointerY = padding.top + segment.y + segment.height / 2;
        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: pointerX, y: pointerY, inside: true });
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: segment.categoryIndex, pixelX: pointerX });
    }, [padding.left, padding.top, setPointer, setCrosshair]);
    const handleHoverOut = useCallback((segment) => {
        if (segmentHoverRef.current !== segment.id)
            return;
        segmentHoverRef.current = null;
        setPointer === null || setPointer === void 0 ? void 0 : setPointer(null);
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
    }, [setPointer, setCrosshair]);
    const handlePress = useCallback((segment, pressEvent) => {
        const dataPoint = segment.dataPoint || {
            category: segment.category,
            value: segment.value,
            color: segment.color,
        };
        const chartX = (padding.left + segment.x + segment.width / 2) / width;
        const chartY = (padding.top + segment.y + segment.height / 2) / height;
        const interactionEvent = {
            nativeEvent: pressEvent.nativeEvent,
            chartX,
            chartY,
            dataX: segment.categoryIndex,
            dataY: segment.y1,
            dataPoint,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(dataPoint, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    }, [height, width, onDataPointPress, onPress, padding.left, padding.top]);
    const registerSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        const signature = dataSignature;
        if (registerSignatureRef.current === signature)
            return;
        registerSignatureRef.current = signature;
        resolvedSeries.forEach((seriesEntry) => {
            const points = categories.map((category) => {
                var _a, _b, _c, _d;
                const segment = layoutResult.segmentLookup.get(`${seriesEntry.id}::${category}`);
                const value = (_a = segment === null || segment === void 0 ? void 0 : segment.value) !== null && _a !== void 0 ? _a : 0;
                const meta = (segment === null || segment === void 0 ? void 0 : segment.dataPoint) || {
                    category,
                    value,
                };
                return {
                    x: (_b = categoryIndexMap.get(category)) !== null && _b !== void 0 ? _b : 0,
                    y: value,
                    meta: {
                        ...meta,
                        stackedStart: (_c = segment === null || segment === void 0 ? void 0 : segment.y0) !== null && _c !== void 0 ? _c : 0,
                        stackedEnd: (_d = segment === null || segment === void 0 ? void 0 : segment.y1) !== null && _d !== void 0 ? _d : value,
                    },
                };
            });
            registerSeries({
                id: seriesEntry.id,
                name: seriesEntry.name || `Series ${seriesEntry.seriesIndex + 1}`,
                color: seriesEntry.color,
                points,
                visible: seriesEntry.visible,
            });
        });
    }, [registerSeries, resolvedSeries, categories, layoutResult.segmentLookup, categoryIndexMap, dataSignature]);
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, animationDuration: animationDuration, disabled: disabled, style: style, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), (grid === null || grid === void 0 ? void 0 : grid.show) !== false && (jsx(ChartGrid, { grid: {
                    show: true,
                    color: (grid === null || grid === void 0 ? void 0 : grid.color) || theme.colors.grid,
                    thickness: (_a = grid === null || grid === void 0 ? void 0 : grid.thickness) !== null && _a !== void 0 ? _a : 1,
                    style: (_b = grid === null || grid === void 0 ? void 0 : grid.style) !== null && _b !== void 0 ? _b : 'solid',
                    showMajor: (_c = grid === null || grid === void 0 ? void 0 : grid.showMajor) !== null && _c !== void 0 ? _c : true,
                    showMinor: (_d = grid === null || grid === void 0 ? void 0 : grid.showMinor) !== null && _d !== void 0 ? _d : false,
                    majorLines: grid === null || grid === void 0 ? void 0 : grid.majorLines,
                    minorLines: grid === null || grid === void 0 ? void 0 : grid.minorLines,
                }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding })), jsx(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top }, children: computedSegments.map(({ segments }, groupIndex) => (jsx(G, { children: segments.map((segment) => (segment.visible && segment.height > 0 ? (jsx(AnimatedStackedSegment, { segment: segment, animationProgress: animationProgress, borderRadius: 3, disabled: disabled, onHoverIn: handleHoverIn, onHoverOut: handleHoverOut, onPress: handlePress }, segment.id)) : null)) }, `stack-${groupIndex}`))) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && (jsx(Axis, { orientation: "bottom", scale: xAxisScale, length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: categories.length, tickSize: (_e = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _e !== void 0 ? _e : 4, tickPadding: 8, tickFormat: (value) => {
                    var _a;
                    const index = (_a = categoryIndexMap.get(value)) !== null && _a !== void 0 ? _a : 0;
                    return (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(index) : String(value);
                }, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_f = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _f !== void 0 ? _f : 1, showLine: (_g = xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== null && _g !== void 0 ? _g : true, showTicks: (_h = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== null && _h !== void 0 ? _h : true, showLabels: (_j = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== null && _j !== void 0 ? _j : true, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize) !== null && _k !== void 0 ? _k : 11 })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && (jsx(Axis, { orientation: "left", scale: yAxisScale, length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: valueTicks.length, tickSize: (_l = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _l !== void 0 ? _l : 4, tickPadding: 6, tickFormat: (value) => ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(value) : formatNumber$2(value)), label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_m = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _m !== void 0 ? _m : 1, showLine: (_o = yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== null && _o !== void 0 ? _o : true, showTicks: (_p = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== null && _p !== void 0 ? _p : true, showLabels: (_q = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== null && _q !== void 0 ? _q : true, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_r = yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize) !== null && _r !== void 0 ? _r : 11 })), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: resolvedSeries.map((seriesEntry, index) => ({
                    label: seriesEntry.name || `Series ${index + 1}`,
                    color: seriesEntry.color,
                    visible: seriesEntry.visible,
                })), position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: updateSeriesVisibility ? (item, index, nativeEvent) => {
                    var _a, _b;
                    const seriesEntry = resolvedSeries[index];
                    if (!seriesEntry)
                        return;
                    const id = seriesEntry.id;
                    const currentVisible = (_b = (_a = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((s) => s.id === id)) === null || _a === void 0 ? void 0 : _a.visible) !== null && _b !== void 0 ? _b : seriesEntry.visible;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const currentlyVisible = resolvedSeries.filter((s) => s.visible).map((s) => s.id);
                        const isSole = currentlyVisible.length === 1 && currentlyVisible[0] === id;
                        resolvedSeries.forEach((entry) => updateSeriesVisibility(entry.id, isSole ? true : entry.id === id));
                    }
                    else {
                        updateSeriesVisibility(id, !(currentVisible !== false));
                    }
                } : undefined }))] }));
};
StackedBarChart.displayName = 'StackedBarChart';

// Accessible / semantic color palettes & assignment utilities
/**
 * Default color palette for charts
 */
const paletteDefault = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'
];
/**
 * Okabe–Ito colorblind safe palette (8 colors)
 */
const paletteColorBlind = [
    '#000000', // black
    '#E69F00', // orange
    '#56B4E9', // sky blue
    '#009E73', // bluish green
    '#F0E442', // yellow
    '#0072B2', // blue
    '#D55E00', // vermillion
    '#CC79A7', // reddish purple
];
/**
 * High contrast palette for accessibility
 */
const paletteHighContrast = [
    '#000000', '#ffffff', '#ff005e', '#00d5ff', '#ffb800', '#6200ff', '#00c500', '#ff8400'
];
/**
 * Palette registry mapping names to color arrays
 */
const registry = {
    default: paletteDefault,
    colorBlind: paletteColorBlind,
    highContrast: paletteHighContrast,
};
/**
 * Simple string hashing function for deterministic color assignment
 * @param str - String to hash
 * @returns Hash value
 */
function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}
/**
 * Creates a color assignment function based on palette and hashing options
 * @param opts - Color assignment options
 * @returns Function that assigns colors by index or id
 */
function createColorAssigner(opts = {}) {
    let palette;
    if (Array.isArray(opts.palette)) {
        palette = opts.palette;
    }
    else if (!opts.palette || opts.palette === 'default') {
        palette = colorSchemes.default;
    }
    else {
        palette = registry[opts.palette] || registry.default;
    }
    return (index, id) => {
        if (opts.hash && id != null) {
            const h = hashString(String(id));
            return palette[h % palette.length];
        }
        return palette[index % palette.length];
    };
}

const AnimatedRect$4 = Animated$1.createAnimatedComponent(Rect);
const isWeb = Platform.OS === 'web';
const toNativePointerEvent$2 = (event) => {
    var _a, _b, _c, _d;
    const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
    return {
        nativeEvent: {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event === null || event === void 0 ? void 0 : event.pageX) !== null && _c !== void 0 ? _c : event === null || event === void 0 ? void 0 : event.clientX,
            pageY: (_d = event === null || event === void 0 ? void 0 : event.pageY) !== null && _d !== void 0 ? _d : event === null || event === void 0 ? void 0 : event.clientY,
        },
    };
};
const AnimatedGroupedBar = React.memo(({ bar, animationProgress, borderRadius, disabled, onHoverIn, onHoverOut, onPress }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const height = bar.height * progress;
        const y = bar.isPositive ? bar.y + (bar.height - height) : bar.y;
        return {
            x: bar.x,
            y,
            width: bar.width,
            height,
        };
    }, [bar]);
    const isWeb = Platform.OS === 'web';
    return (jsx(AnimatedRect$4, { animatedProps: animatedProps, rx: borderRadius, ry: borderRadius, fill: bar.color, opacity: bar.visible ? 1 : 0, pointerEvents: bar.visible ? 'auto' : 'none', ...(isWeb
            ? {
                onPointerEnter: (event) => !disabled && onHoverIn(bar, event),
                onPointerLeave: (event) => onHoverOut(bar, event),
                onPointerDown: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                },
                onPointerUp: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                    onPress(bar, toNativePointerEvent$2(event));
                },
                onPointerCancel: (event) => onHoverOut(bar, event),
            }
            : {
                onPressIn: (event) => !disabled && onHoverIn(bar, event),
                onPressOut: (event) => onHoverOut(bar, event),
                onPress: (event) => !disabled && onPress(bar, { nativeEvent: event.nativeEvent }),
            }) }));
});
AnimatedGroupedBar.displayName = 'AnimatedGroupedBar';
const GroupedBarChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const { series, width = 400, height = 300, barSpacing = 0.2, innerBarSpacing = 0.1, title, subtitle, legend = { show: true, position: 'bottom', align: 'center' }, disabled = false, animationDuration = 800, style, xAxis, yAxis, grid, colorOptions, valueLabels, multiTooltip, liveTooltip, enableCrosshair, onPress, onDataPointPress, ...rest } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_x) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const interactionSeries = interaction === null || interaction === void 0 ? void 0 : interaction.series;
    const basePadding = { top: 40, right: 24, bottom: 64, left: 80 };
    const padding = React.useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const categories = useMemo(() => {
        const set = new Set();
        series.forEach((s) => s.data.forEach((d) => set.add(d.category)));
        return Array.from(set);
    }, [series]);
    const categoryIndexMap = useMemo(() => new Map(categories.map((category, index) => [category, index])), [categories]);
    const assignColor = useMemo(() => createColorAssigner(colorOptions), [colorOptions]);
    const resolvedSeries = useMemo(() => {
        return series.map((seriesEntry, index) => {
            var _a;
            const id = String((_a = seriesEntry.id) !== null && _a !== void 0 ? _a : `group-${index}`);
            const override = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((entry) => entry.id === id);
            const visible = override ? override.visible !== false : seriesEntry.visible !== false;
            const color = seriesEntry.color || assignColor(index, seriesEntry.id);
            const normalizedData = seriesEntry.data.map((datum) => ({
                category: datum.category,
                value: datum.value,
                color: datum.color,
                id: datum.id,
                data: datum.data,
            }));
            const dataLookup = new Map();
            normalizedData.forEach((datum) => {
                dataLookup.set(datum.category, datum);
            });
            return {
                id,
                name: seriesEntry.name,
                color,
                visible,
                data: normalizedData,
                dataLookup,
                seriesIndex: index,
            };
        });
    }, [series, interactionSeries, assignColor]);
    const resolvedSeriesMap = useMemo(() => {
        const map = new Map();
        resolvedSeries.forEach((entry) => {
            map.set(entry.id, entry);
        });
        return map;
    }, [resolvedSeries]);
    const wantsCrosshairUpdates = (enableCrosshair !== false) || Boolean(multiTooltip);
    const interactionConfig = useMemo(() => {
        const config = {};
        if (typeof multiTooltip === 'boolean')
            config.multiTooltip = multiTooltip;
        if (typeof liveTooltip === 'boolean')
            config.liveTooltip = liveTooltip;
        if (typeof enableCrosshair === 'boolean')
            config.enableCrosshair = enableCrosshair;
        return Object.keys(config).length ? config : undefined;
    }, [enableCrosshair, liveTooltip, multiTooltip]);
    const showValueLabels = !!(valueLabels && valueLabels.show);
    const valueLabelPosition = (_a = valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.position) !== null && _a !== void 0 ? _a : 'auto';
    const valueLabelOffset = (_b = valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.offset) !== null && _b !== void 0 ? _b : 12;
    const valueLabelFontSize = (_c = valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.fontSize) !== null && _c !== void 0 ? _c : 11;
    const valueLabelFontWeight = (_d = valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.fontWeight) !== null && _d !== void 0 ? _d : '600';
    const valueLabelFontFamily = (valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.fontFamily) || theme.fontFamily;
    const minBarHeightForInside = (_e = valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.minBarHeightForInside) !== null && _e !== void 0 ? _e : (valueLabelFontSize + 6);
    const formatValueLabel = useCallback((value, datum, context) => {
        if (typeof (valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.formatter) === 'function') {
            return valueLabels.formatter({
                value,
                category: context.category,
                categoryIndex: context.categoryIndex,
                seriesId: context.series.id,
                seriesName: context.series.name,
                seriesIndex: context.series.seriesIndex,
                datum: datum,
            });
        }
        return formatNumber$2(value);
    }, [valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.formatter]);
    const valueDomain = useMemo(() => {
        let min = 0;
        let max = 0;
        resolvedSeries.forEach((seriesEntry) => {
            seriesEntry.data.forEach((datum) => {
                if (datum.value < min)
                    min = datum.value;
                if (datum.value > max)
                    max = datum.value;
            });
        });
        if (min === max) {
            if (min === 0)
                return [-1, 1];
            const delta = Math.abs(min) * 0.1 || 1;
            return [min - delta, max + delta];
        }
        return [Math.min(min, 0), Math.max(max, 0)];
    }, [resolvedSeries]);
    const outerScale = useMemo(() => {
        const paddingInner = Math.min(Math.max(barSpacing, 0), 0.9);
        const paddingOuter = 0.1;
        return bandScale(categories, [0, plotWidth], { paddingInner, paddingOuter });
    }, [categories, plotWidth, barSpacing]);
    const outerBandwidth = outerScale.bandwidth ? outerScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
    const seriesIds = useMemo(() => resolvedSeries.map((entry) => entry.id), [resolvedSeries]);
    const innerScale = useMemo(() => {
        const paddingInner = Math.min(Math.max(innerBarSpacing, 0), 0.9);
        return bandScale(seriesIds, [0, outerBandwidth], { paddingInner, paddingOuter: 0 });
    }, [seriesIds, outerBandwidth, innerBarSpacing]);
    const valueScale = useMemo(() => linearScale(valueDomain, [plotHeight, 0]), [valueDomain, plotHeight]);
    const baseline = valueScale(0);
    const computedBars = useMemo(() => {
        return categories.flatMap((category) => {
            var _a, _b;
            const categoryIndex = (_a = categoryIndexMap.get(category)) !== null && _a !== void 0 ? _a : 0;
            const outerX = (_b = outerScale(category)) !== null && _b !== void 0 ? _b : 0;
            return resolvedSeries.map((seriesEntry) => {
                var _a, _b;
                const datum = seriesEntry.dataLookup.get(category);
                const innerX = (_a = innerScale(seriesEntry.id)) !== null && _a !== void 0 ? _a : 0;
                const x = outerX + innerX;
                const width = innerScale.bandwidth ? innerScale.bandwidth() : outerBandwidth / Math.max(1, resolvedSeries.length);
                const value = (_b = datum === null || datum === void 0 ? void 0 : datum.value) !== null && _b !== void 0 ? _b : 0;
                const barTop = valueScale(Math.max(value, 0));
                const barBottom = valueScale(Math.min(value, 0));
                const y = value >= 0 ? barTop : baseline;
                const height = Math.max(0, Math.abs(barBottom - barTop));
                const color = (datum === null || datum === void 0 ? void 0 : datum.color) || seriesEntry.color;
                const dataPoint = datum || { category, value };
                return {
                    id: `${seriesEntry.id}::${category}`,
                    category,
                    categoryIndex,
                    seriesId: seriesEntry.id,
                    seriesIndex: seriesEntry.seriesIndex,
                    color,
                    value,
                    x,
                    y: y,
                    width,
                    height,
                    isPositive: value >= 0,
                    baseline: baseline,
                    dataPoint,
                    visible: seriesEntry.visible,
                };
            });
        });
    }, [categories, categoryIndexMap, outerScale, innerScale, resolvedSeries, outerBandwidth, valueScale, baseline]);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        return resolvedSeries
            .map((seriesEntry) => {
            const values = categories.map((category) => {
                var _a;
                const datum = seriesEntry.dataLookup.get(category);
                return `${category}:${(_a = datum === null || datum === void 0 ? void 0 : datum.value) !== null && _a !== void 0 ? _a : 0}`;
            });
            return `${seriesEntry.id}:${seriesEntry.visible ? '1' : '0'}:${values.join('|')}`;
        })
            .join('||');
    }, [resolvedSeries, categories]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    const valueTicks = useMemo(() => {
        if ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
            return yAxis.ticks;
        }
        return generateNiceTicks(valueDomain[0], valueDomain[1], 5);
    }, [valueDomain, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks]);
    const normalizedXTicks = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        const bandwidth = outerScale.bandwidth ? outerScale.bandwidth() : 0;
        return categories.map((category) => {
            var _a;
            const pos = ((_a = outerScale(category)) !== null && _a !== void 0 ? _a : 0) + bandwidth / 2;
            return pos / plotWidth;
        });
    }, [categories, outerScale, plotWidth]);
    const categoryCenters = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        const bandwidth = outerScale.bandwidth ? outerScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
        return categories.map((category) => { var _a; return ((_a = outerScale(category)) !== null && _a !== void 0 ? _a : 0) + bandwidth / 2; });
    }, [categories, outerScale, plotWidth]);
    const normalizedYTicks = useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return valueTicks.map((tick) => valueScale(tick) / plotHeight);
    }, [valueTicks, valueScale, plotHeight]);
    const xAxisScale = useMemo(() => {
        const bandwidth = outerScale.bandwidth ? outerScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
        const scale = ((value) => {
            var _a;
            const base = (_a = outerScale(value)) !== null && _a !== void 0 ? _a : 0;
            return base + bandwidth / 2;
        });
        scale.domain = () => categories.slice();
        scale.range = () => [0, plotWidth];
        scale.ticks = () => categories.slice();
        scale.bandwidth = () => bandwidth;
        return scale;
    }, [outerScale, categories, plotWidth]);
    const yAxisScale = useMemo(() => {
        const scale = ((value) => valueScale(value));
        scale.domain = () => valueScale.domain();
        scale.range = () => valueScale.range();
        scale.ticks = () => valueTicks.slice();
        return scale;
    }, [valueScale, valueTicks]);
    const hoverRef = useRef(null);
    const extractNativeEvent = (event) => {
        if (!event)
            return undefined;
        if (event.nativeEvent)
            return event.nativeEvent;
        return toNativePointerEvent$2(event).nativeEvent;
    };
    const updatePointerCoords = useCallback((chartX, chartY, meta) => {
        var _a;
        if (!setPointer && !setCrosshair)
            return;
        const plotX = chartX - padding.left;
        const plotY = chartY - padding.top;
        const insideX = plotX >= 0 && plotX <= plotWidth;
        const insideY = plotY >= 0 && plotY <= plotHeight;
        if (setPointer) {
            setPointer({
                x: chartX,
                y: chartY,
                inside: insideX && insideY,
                insideX,
                insideY,
                pageX: meta === null || meta === void 0 ? void 0 : meta.pageX,
                pageY: meta === null || meta === void 0 ? void 0 : meta.pageY,
                data: (_a = meta === null || meta === void 0 ? void 0 : meta.data) !== null && _a !== void 0 ? _a : null,
            });
        }
        if (wantsCrosshairUpdates && setCrosshair && insideX) {
            const clampedX = Math.max(0, Math.min(plotWidth, plotX));
            let closestIndex = 0;
            if (categoryCenters.length) {
                let bestDistance = Infinity;
                for (let i = 0; i < categoryCenters.length; i += 1) {
                    const dist = Math.abs(categoryCenters[i] - clampedX);
                    if (dist < bestDistance) {
                        bestDistance = dist;
                        closestIndex = i;
                    }
                }
            }
            const pixelX = padding.left + clampedX;
            setCrosshair({ dataX: closestIndex, pixelX });
        }
    }, [setPointer, setCrosshair, padding.left, padding.top, plotWidth, plotHeight, wantsCrosshairUpdates, categoryCenters]);
    const clearPointerState = useCallback(() => {
        hoverRef.current = null;
        if (setPointer) {
            setPointer({ x: 0, y: 0, inside: false, insideX: false, insideY: false, data: null });
        }
        if (wantsCrosshairUpdates) {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [setPointer, setCrosshair, wantsCrosshairUpdates]);
    const handleHoverIn = useCallback((bar, event) => {
        hoverRef.current = bar.id;
        const pointerX = padding.left + bar.x + bar.width / 2;
        const pointerY = padding.top + (bar.isPositive ? bar.y : bar.y + bar.height);
        const native = extractNativeEvent(event);
        const seriesEntry = resolvedSeriesMap.get(bar.seriesId);
        const datum = (seriesEntry === null || seriesEntry === void 0 ? void 0 : seriesEntry.dataLookup.get(bar.category)) || bar.dataPoint || { category: bar.category, value: bar.value };
        updatePointerCoords(pointerX, pointerY, {
            pageX: native === null || native === void 0 ? void 0 : native.pageX,
            pageY: native === null || native === void 0 ? void 0 : native.pageY,
            data: {
                type: 'grouped-bar',
                category: bar.category,
                categoryIndex: bar.categoryIndex,
                seriesId: bar.seriesId,
                seriesName: seriesEntry === null || seriesEntry === void 0 ? void 0 : seriesEntry.name,
                seriesIndex: bar.seriesIndex,
                value: bar.value,
                datum,
            },
        });
    }, [padding.left, padding.top, resolvedSeriesMap, updatePointerCoords]);
    const handleHoverOut = useCallback((bar, event, options) => {
        var _a;
        if (hoverRef.current !== bar.id)
            return;
        hoverRef.current = null;
        if (!(options === null || options === void 0 ? void 0 : options.suppressPointerReset)) {
            const native = extractNativeEvent(event);
            if ((native === null || native === void 0 ? void 0 : native.pageX) != null || (native === null || native === void 0 ? void 0 : native.pageY) != null) {
                const pointerX = padding.left + bar.x + bar.width / 2;
                const pointerY = padding.top + (bar.isPositive ? bar.y : bar.y + bar.height);
                setPointer === null || setPointer === void 0 ? void 0 : setPointer({
                    x: pointerX,
                    y: pointerY,
                    inside: false,
                    insideX: false,
                    insideY: false,
                    pageX: native === null || native === void 0 ? void 0 : native.pageX,
                    pageY: native === null || native === void 0 ? void 0 : native.pageY,
                    data: null,
                });
            }
            else {
                setPointer === null || setPointer === void 0 ? void 0 : setPointer(null);
            }
        }
        const preserve = (_a = options === null || options === void 0 ? void 0 : options.preserveCrosshair) !== null && _a !== void 0 ? _a : true;
        if (wantsCrosshairUpdates && !preserve) {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [padding.left, padding.top, setCrosshair, setPointer, wantsCrosshairUpdates]);
    const handlePress = useCallback((bar, pressEvent) => {
        var _a, _b;
        const dataPoint = {
            category: bar.category,
            value: bar.value,
            color: bar.color,
            id: (_a = bar.dataPoint) === null || _a === void 0 ? void 0 : _a.id,
            data: (_b = bar.dataPoint) === null || _b === void 0 ? void 0 : _b.data,
        };
        const interactionEvent = {
            nativeEvent: pressEvent.nativeEvent,
            chartX: (padding.left + bar.x + bar.width / 2) / width,
            chartY: (padding.top + bar.y + bar.height / 2) / height,
            dataX: bar.categoryIndex,
            dataY: bar.value,
            dataPoint,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(dataPoint, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    }, [height, onDataPointPress, onPress, width, padding.left, padding.top]);
    const handlePointer = useCallback((nativeEvent, firePress = false) => {
        if (!nativeEvent || disabled)
            return;
        const { locationX, locationY, pageX, pageY } = nativeEvent;
        if (typeof locationX !== 'number' || typeof locationY !== 'number')
            return;
        const chartX = padding.left + locationX;
        const chartY = padding.top + locationY;
        updatePointerCoords(chartX, chartY, { pageX, pageY });
        let target = null;
        for (const bar of computedBars) {
            if (!bar.visible || bar.height <= 0)
                continue;
            const withinX = locationX >= bar.x && locationX <= bar.x + bar.width;
            const withinY = locationY >= bar.y && locationY <= bar.y + bar.height;
            if (withinX && withinY) {
                target = bar;
                break;
            }
        }
        if (target) {
            handleHoverIn(target);
            if (firePress) {
                handlePress(target, { nativeEvent });
            }
        }
        else {
            hoverRef.current = null;
        }
    }, [disabled, padding.left, padding.top, updatePointerCoords, computedBars, handleHoverIn, handlePress]);
    const handlePointerEnd = useCallback(() => {
        clearPointerState();
    }, [clearPointerState]);
    const registerSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (registerSignatureRef.current === dataSignature)
            return;
        registerSignatureRef.current = dataSignature;
        resolvedSeries.forEach((seriesEntry) => {
            const points = categories.map((category) => {
                var _a, _b, _c;
                const datum = seriesEntry.dataLookup.get(category);
                const value = (_a = datum === null || datum === void 0 ? void 0 : datum.value) !== null && _a !== void 0 ? _a : 0;
                const fallbackDatum = datum !== null && datum !== void 0 ? datum : { category, value };
                const labelText = formatValueLabel(value, fallbackDatum, {
                    category,
                    categoryIndex: (_b = categoryIndexMap.get(category)) !== null && _b !== void 0 ? _b : 0,
                    series: seriesEntry,
                });
                return {
                    x: (_c = categoryIndexMap.get(category)) !== null && _c !== void 0 ? _c : 0,
                    y: value,
                    meta: {
                        category,
                        value,
                        color: (datum === null || datum === void 0 ? void 0 : datum.color) || seriesEntry.color,
                        id: datum === null || datum === void 0 ? void 0 : datum.id,
                        data: datum === null || datum === void 0 ? void 0 : datum.data,
                        formattedValue: labelText,
                    },
                };
            });
            registerSeries({
                id: seriesEntry.id,
                name: seriesEntry.name || `Series ${seriesEntry.seriesIndex + 1}`,
                color: seriesEntry.color,
                points,
                visible: seriesEntry.visible,
            });
        });
    }, [registerSeries, resolvedSeries, categories, categoryIndexMap, dataSignature, formatValueLabel]);
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, disabled: disabled, animationDuration: animationDuration, style: style, interactionConfig: interactionConfig, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), (grid === null || grid === void 0 ? void 0 : grid.show) !== false && (jsx(ChartGrid, { grid: {
                    show: true,
                    color: (grid === null || grid === void 0 ? void 0 : grid.color) || theme.colors.grid,
                    thickness: (_f = grid === null || grid === void 0 ? void 0 : grid.thickness) !== null && _f !== void 0 ? _f : 1,
                    style: (_g = grid === null || grid === void 0 ? void 0 : grid.style) !== null && _g !== void 0 ? _g : 'solid',
                    showMajor: (_h = grid === null || grid === void 0 ? void 0 : grid.showMajor) !== null && _h !== void 0 ? _h : true,
                    showMinor: (_j = grid === null || grid === void 0 ? void 0 : grid.showMinor) !== null && _j !== void 0 ? _j : false,
                    majorLines: grid === null || grid === void 0 ? void 0 : grid.majorLines,
                    minorLines: grid === null || grid === void 0 ? void 0 : grid.minorLines,
                }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding })), jsxs(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top }, children: [computedBars.map((bar) => (bar.visible && bar.height > 0 ? (jsx(AnimatedGroupedBar, { bar: bar, animationProgress: animationProgress, borderRadius: 3, disabled: disabled, onHoverIn: handleHoverIn, onHoverOut: (target, event) => handleHoverOut(target, event, { preserveCrosshair: true, suppressPointerReset: true }), onPress: handlePress }, bar.id)) : null)), (enableCrosshair || multiTooltip) && (interaction === null || interaction === void 0 ? void 0 : interaction.crosshair) && (() => {
                        var _a;
                        const relativeX = ((_a = interaction.crosshair.pixelX) !== null && _a !== void 0 ? _a : 0) - padding.left;
                        if (!Number.isFinite(relativeX))
                            return null;
                        const clampedX = Math.max(0, Math.min(plotWidth, relativeX));
                        return (jsx(Rect, { x: clampedX - 0.5, y: 0, width: 1, height: plotHeight, fill: theme.colors.grid, opacity: 0.45, pointerEvents: "none" }));
                    })(), showValueLabels && computedBars.map((bar) => {
                        if (!bar.visible || bar.height <= 0)
                            return null;
                        const seriesEntry = resolvedSeriesMap.get(bar.seriesId);
                        if (!seriesEntry)
                            return null;
                        const rawDatum = seriesEntry.dataLookup.get(bar.category) || bar.dataPoint;
                        const datum = rawDatum !== null && rawDatum !== void 0 ? rawDatum : { category: bar.category, value: bar.value };
                        const label = formatValueLabel(bar.value, datum, {
                            category: bar.category,
                            categoryIndex: bar.categoryIndex,
                            series: seriesEntry,
                        });
                        if (label == null)
                            return null;
                        const labelText = String(label).trim();
                        if (!labelText)
                            return null;
                        const canFitInside = bar.height >= minBarHeightForInside;
                        let useInside = valueLabelPosition === 'inside' || (valueLabelPosition === 'auto' && canFitInside);
                        if (valueLabelPosition === 'outside')
                            useInside = false;
                        if (valueLabelPosition === 'inside' && !canFitInside)
                            useInside = false;
                        const x = bar.x + bar.width / 2;
                        let y;
                        let alignmentBaseline = 'baseline';
                        const clampY = (val) => Math.max(0, Math.min(plotHeight, val));
                        if (useInside) {
                            const insideOffset = Math.min(Math.max(4, valueLabelOffset), Math.max(4, bar.height - 2));
                            if (bar.isPositive) {
                                y = clampY(bar.y + insideOffset);
                                alignmentBaseline = 'baseline';
                            }
                            else {
                                y = clampY(bar.y + bar.height - insideOffset);
                                alignmentBaseline = 'baseline';
                            }
                        }
                        else {
                            const outsideOffset = Math.max(4, valueLabelOffset);
                            if (bar.isPositive) {
                                y = clampY(bar.y - outsideOffset);
                                alignmentBaseline = 'baseline';
                            }
                            else {
                                y = clampY(bar.y + bar.height + outsideOffset);
                                alignmentBaseline = 'hanging';
                            }
                        }
                        const fillColor = (valueLabels === null || valueLabels === void 0 ? void 0 : valueLabels.color) || (useInside ? theme.colors.background : theme.colors.textPrimary);
                        return (jsx(Text$1, { x: x, y: y, fill: fillColor, fontSize: valueLabelFontSize, fontWeight: valueLabelFontWeight, fontFamily: valueLabelFontFamily, textAnchor: "middle", alignmentBaseline: alignmentBaseline, children: labelText }, `label-${bar.id}`));
                    })] }), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                }, pointerEvents: disabled ? 'none' : isWeb ? 'auto' : 'box-only', ...(isWeb
                    ? {
                        // @ts-ignore react-native-web pointer events
                        onPointerMove: (event) => {
                            if (disabled)
                                return;
                            const native = toNativePointerEvent$2(event).nativeEvent;
                            handlePointer(native);
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerDown: (event) => {
                            var _a, _b;
                            if (disabled)
                                return;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                            const native = toNativePointerEvent$2(event).nativeEvent;
                            handlePointer(native);
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerUp: (event) => {
                            var _a, _b;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                            const native = toNativePointerEvent$2(event).nativeEvent;
                            handlePointer(native, true);
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerLeave: () => {
                            handlePointerEnd();
                        },
                        // @ts-ignore react-native-web pointer events
                        onPointerCancel: () => {
                            handlePointerEnd();
                        },
                    }
                    : {
                        onStartShouldSetResponder: () => !disabled,
                        onMoveShouldSetResponder: () => !disabled,
                        onResponderGrant: (e) => {
                            handlePointer(e.nativeEvent);
                        },
                        onResponderMove: (e) => {
                            handlePointer(e.nativeEvent);
                        },
                        onResponderRelease: () => {
                            handlePointerEnd();
                        },
                        onResponderTerminate: handlePointerEnd,
                        onResponderTerminationRequest: () => true,
                    }) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && (jsx(Axis, { orientation: "bottom", scale: xAxisScale, length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: categories.length, tickSize: (_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _k !== void 0 ? _k : 4, tickPadding: 8, tickFormat: (value) => { var _a; return ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter((_a = categoryIndexMap.get(value)) !== null && _a !== void 0 ? _a : 0) : String(value)); }, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_l = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _l !== void 0 ? _l : 1, showLine: (_m = xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== null && _m !== void 0 ? _m : true, showTicks: (_o = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== null && _o !== void 0 ? _o : true, showLabels: (_p = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== null && _p !== void 0 ? _p : true, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_q = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize) !== null && _q !== void 0 ? _q : 11 })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && (jsx(Axis, { orientation: "left", scale: yAxisScale, length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: valueTicks.length, tickSize: (_r = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _r !== void 0 ? _r : 4, tickPadding: 6, tickFormat: (value) => ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(value) : `${value}`), label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_s = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _s !== void 0 ? _s : 1, showLine: (_t = yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== null && _t !== void 0 ? _t : true, showTicks: (_u = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== null && _u !== void 0 ? _u : true, showLabels: (_v = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== null && _v !== void 0 ? _v : true, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_w = yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize) !== null && _w !== void 0 ? _w : 11 })), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: resolvedSeries.map((seriesEntry, index) => ({
                    label: seriesEntry.name || `Series ${index + 1}`,
                    color: seriesEntry.color,
                    visible: seriesEntry.visible,
                })), position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: updateSeriesVisibility ? (item, index, nativeEvent) => {
                    var _a, _b;
                    const seriesEntry = resolvedSeries[index];
                    if (!seriesEntry)
                        return;
                    const id = seriesEntry.id;
                    const currentVisible = (_b = (_a = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((s) => s.id === id)) === null || _a === void 0 ? void 0 : _a.visible) !== null && _b !== void 0 ? _b : seriesEntry.visible;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const currentlyVisible = resolvedSeries.filter((s) => s.visible).map((s) => s.id);
                        const isSole = currentlyVisible.length === 1 && currentlyVisible[0] === id;
                        resolvedSeries.forEach((entry) => updateSeriesVisibility(entry.id, isSole ? true : entry.id === id));
                    }
                    else {
                        updateSeriesVisibility(id, !(currentVisible !== false));
                    }
                } : undefined }))] }));
};
GroupedBarChart.displayName = 'GroupedBarChart';

const AnimatedPath$6 = Animated$1.createAnimatedComponent(Path);
const polarToCartesian = (cx, cy, r, angleDeg) => {
    'worklet';
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
// Simple polar arc path helper
function arcPath(cx, cy, r, startAngle, endAngle) {
    'worklet';
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0  ${end.x} ${end.y}`;
}
// Animated radial bar component (adapted from AnimatedPieSlice pattern)
const AnimatedRadialBar = React.memo(({ datum, index, centerX, centerY, radius, thickness, startAngle, endAngle, globalMax, animationProgress, color, trackColor, showLabels, disabled, onHover, onHoverOut, theme }) => {
    const scale = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            scale.value = 1;
            return;
        }
        const delay = index * 150; // Stagger animation
        scale.value = withDelay(delay, withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, index, scale]);
    const maxValue = datum.max || globalMax;
    const percentage = maxValue > 0 ? datum.value / maxValue : 0;
    const targetSpan = (endAngle - startAngle) * percentage;
    const trackPath = arcPath(centerX, centerY, radius, startAngle, endAngle);
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value * scale.value;
        const currentSpan = targetSpan * progress;
        const currentEndAngle = startAngle + Math.max(0, currentSpan);
        if (currentSpan <= 0) {
            return { d: '' };
        }
        return {
            d: arcPath(centerX, centerY, radius, startAngle, currentEndAngle),
        };
    }, [startAngle, targetSpan, centerX, centerY, radius]);
    const isWeb = Platform.OS === 'web';
    return (jsxs(G, { ...(isWeb ? {
            // @ts-ignore web events
            onMouseEnter: onHover,
            // @ts-ignore web events  
            onMouseLeave: onHoverOut,
        } : {}), children: [jsx(Path, { d: trackPath, stroke: trackColor, strokeWidth: thickness, strokeLinecap: "round", fill: "none", opacity: 0.35 }), jsx(AnimatedPath$6, { animatedProps: animatedProps, stroke: color, strokeWidth: thickness, strokeLinecap: "round", fill: "none" }), showLabels && datum.label && (jsx(Text$1, { x: centerX, y: centerY - radius + thickness / 2, fontSize: theme.fontSize.sm, fill: theme.colors.textSecondary, fontFamily: theme.fontFamily, textAnchor: "middle", children: datum.label }))] }));
});
AnimatedRadialBar.displayName = 'AnimatedRadialBar';
const RadialBarChart = (props) => {
    const { data, width = 240, height = 240, title, subtitle, barThickness = 14, gap = 8, radius, startAngle = -90, endAngle = 270, minAngle = 0, animate = true, showValueLabels = true, valueFormatter, legend, style, multiTooltip = true, liveTooltip = true, disabled = false, animationDuration = 800, } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_a) {
        interaction = null;
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = radius !== null && radius !== void 0 ? radius : Math.min(width, height) / 2 - 24;
    const values = data.map(d => d.value);
    const maxDatumValue = Math.max(...values, 1);
    const globalMax = Math.max(maxDatumValue, ...data.map(d => d.max || 0));
    // Animation
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        return data.map(d => `${d.id || 'auto'}-${d.value}-${d.max || ''}`).join('|');
    }, [data]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    // Series registration with memoization and signature guard
    const registrationSignature = useMemo(() => {
        return data
            .map(d => `${d.id || 'auto'}-${d.label || ''}-${d.value}-${d.max || globalMax}`)
            .join('|');
    }, [data, globalMax]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !registrationSignature)
            return;
        if (registeredSignatureRef.current === registrationSignature)
            return;
        data.forEach((d, i) => {
            var _a, _b;
            registerSeries({
                id: (_a = d.id) !== null && _a !== void 0 ? _a : i,
                name: d.label || String((_b = d.id) !== null && _b !== void 0 ? _b : i),
                color: d.color || getColorFromScheme(i, colorSchemes.default),
                points: [{
                        x: i,
                        y: d.value,
                        meta: {
                            ...d,
                            percentage: (d.max ? d.value / d.max : d.value / globalMax) * 100,
                            formattedValue: valueFormatter ? valueFormatter(d.value, d, i) : undefined,
                        },
                    }],
                visible: true,
            });
        });
        registeredSignatureRef.current = registrationSignature;
    }, [registerSeries, data, globalMax, valueFormatter, registrationSignature]);
    // Compute ring positions and visibility
    const rings = useMemo(() => {
        return data.map((d, i) => {
            const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(s => { var _a; return s.id === ((_a = d.id) !== null && _a !== void 0 ? _a : i); });
            const visible = override ? override.visible !== false : true;
            const ringRadius = maxRadius - i * (barThickness + gap) - barThickness / 2;
            const color = d.color || getColorFromScheme(i, colorSchemes.default);
            const trackColor = d.trackColor || theme.colors.background || '#f1f5f9';
            return {
                datum: d,
                index: i,
                radius: ringRadius,
                color,
                trackColor,
                visible,
                isValid: ringRadius - barThickness / 2 > 0,
            };
        });
    }, [data, maxRadius, barThickness, gap, theme.colors.background, interaction === null || interaction === void 0 ? void 0 : interaction.series]);
    const handleRingHover = (index) => {
        if (!setPointer || !setCrosshair)
            return;
        // Calculate approximate position for pointer
        const ring = rings[index];
        if (!ring)
            return;
        const angle = startAngle + ((endAngle - startAngle) * 0.5); // Mid-point
        const point = polarToCartesian(centerX, centerY, ring.radius, angle);
        setPointer({
            x: point.x,
            y: point.y,
            inside: true,
            pageX: point.x,
            pageY: point.y,
        });
        setCrosshair({ dataX: index, pixelX: point.x });
    };
    const handleRingHoverOut = () => {
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        if ((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) && setPointer) {
            setPointer({ ...interaction.pointer, inside: false });
        }
    };
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip, liveTooltip }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(Svg, { width: width, height: height, children: jsx(G, { children: rings.map(ring => {
                        if (!ring.visible || !ring.isValid)
                            return null;
                        return (jsx(AnimatedRadialBar, { datum: ring.datum, index: ring.index, centerX: centerX, centerY: centerY, radius: ring.radius, thickness: barThickness, startAngle: startAngle, endAngle: endAngle, globalMax: globalMax, animationProgress: animationProgress, color: ring.color, trackColor: ring.trackColor, showLabels: showValueLabels, disabled: disabled, onHover: () => handleRingHover(ring.index), onHoverOut: handleRingHoverOut, theme: theme }, ring.datum.id || ring.index));
                    }) }) }), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: data.map((d, i) => {
                    const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(s => { var _a; return s.id === ((_a = d.id) !== null && _a !== void 0 ? _a : i); });
                    const visible = override ? override.visible !== false : true;
                    return {
                        label: d.label || String(d.id || i),
                        color: d.color || getColorFromScheme(i, colorSchemes.default),
                        visible,
                    };
                }), position: legend.position, align: legend.align, onItemPress: (item, index, nativeEvent) => {
                    var _a;
                    const datum = data[index];
                    if (!datum || !updateSeriesVisibility)
                        return;
                    const id = (_a = datum.id) !== null && _a !== void 0 ? _a : index;
                    const override = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === id);
                    const current = override ? override.visible !== false : true;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const visibleIds = data
                            .filter((d, i) => {
                            var _a;
                            const seriesId = (_a = d.id) !== null && _a !== void 0 ? _a : i;
                            const seriesOverride = interaction === null || interaction === void 0 ? void 0 : interaction.series.find(sr => sr.id === seriesId);
                            return seriesOverride ? seriesOverride.visible !== false : true;
                        })
                            .map(d => d.id || data.indexOf(d));
                        const isSole = visibleIds.length === 1 && visibleIds[0] === id;
                        data.forEach((d, i) => updateSeriesVisibility(d.id || i, isSole ? true : (d.id || i) === id));
                    }
                    else {
                        updateSeriesVisibility(id, !current);
                    }
                } }))] }));
};
RadialBarChart.displayName = 'RadialBarChart';

function clamp$3(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function normalizeAngle(angle) {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
}
function valueToAngle(value, min, max, startAngle, endAngle) {
    if (max === min) {
        return startAngle;
    }
    const normalized = (value - min) / (max - min);
    const clamped = Math.max(0, Math.min(1, normalized));
    let span = endAngle - startAngle;
    if (span <= 0) {
        span += 360;
    }
    return startAngle + span * clamped;
}
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function getPointOnCircle(centerX, centerY, radius, angleInDegrees) {
    const angle = degreesToRadians(angleInDegrees - 90);
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
    };
}
function createArcPath(centerX, centerY, radius, startAngle, endAngle) {
    const start = getPointOnCircle(centerX, centerY, radius, startAngle);
    const end = getPointOnCircle(centerX, centerY, radius, endAngle);
    const span = Math.abs(endAngle - startAngle);
    const largeArcFlag = span > 180 ? 1 : 0;
    // Sweep flag of 1 draws clockwise which matches our gauge orientation
    const sweepFlag = 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}
function generateTickPositions(min, max, majorCount, minorCount) {
    const major = [];
    const minor = [];
    if (majorCount <= 0) {
        return { major, minor };
    }
    for (let i = 0; i <= majorCount; i++) {
        const value = min + ((max - min) * i) / majorCount;
        major.push(value);
    }
    if (minorCount > 0) {
        const majorStep = (max - min) / majorCount;
        const minorStep = majorStep / (minorCount + 1);
        for (let m = 0; m < majorCount; m++) {
            const base = min + majorStep * m;
            for (let i = 1; i <= minorCount; i++) {
                const value = base + minorStep * i;
                if (value < max) {
                    minor.push(value);
                }
            }
        }
    }
    return { major, minor };
}
function generateLabelPositions(min, max, count) {
    const positions = [];
    if (count <= 0) {
        return positions;
    }
    for (let i = 0; i <= count; i++) {
        const value = min + ((max - min) * i) / count;
        positions.push(value);
    }
    return positions;
}
function angleDifference(current, target) {
    const currentNorm = normalizeAngle(current);
    const targetNorm = normalizeAngle(target);
    let diff = targetNorm - currentNorm;
    if (diff > 180)
        diff -= 360;
    if (diff < -180)
        diff += 360;
    return diff;
}

const AnimatedLine = Animated$1.createAnimatedComponent(Line);
const resolveEasing = (easing) => {
    switch (easing) {
        case 'linear':
            return Easing.linear;
        case 'ease-in':
            return Easing.in(Easing.cubic);
        case 'ease-in-out':
            return Easing.inOut(Easing.cubic);
        case 'bounce':
            return Easing.bounce;
        default:
            return Easing.out(Easing.cubic);
    }
};
const angleToGradientPoints = (angle = 0) => {
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return {
        x1: 0.5 - x / 2,
        y1: 0.5 - y / 2,
        x2: 0.5 + x / 2,
        y2: 0.5 + y / 2,
    };
};
const GaugeChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const { value, min = 0, max = 100, width = 320, height = 240, title, subtitle, startAngle = 135, endAngle = 45, rotationOffset = 0, thickness = 12, track, ranges = [], ticks, labels, needle, centerLabel, legend, markers, markerFocusStrategy = 'closest', markerFocusThreshold, innerRadiusRatio, animationDuration = 600, animationEasing, disabled = false, style, valueFormatter, onValueChange, onMarkerFocus, accessibilityLabel, accessibilityHint, accessibilityRole, accessible, importantForAccessibility, ...rest } = props;
    const theme = useChartTheme();
    const baseTrackThickness = (_a = track === null || track === void 0 ? void 0 : track.thickness) !== null && _a !== void 0 ? _a : thickness;
    const trackMargin = Math.max(16, (_b = labels === null || labels === void 0 ? void 0 : labels.offset) !== null && _b !== void 0 ? _b : 24);
    const outerRadius = Math.max(1, Math.min(width, height) / 2 - trackMargin / 2);
    const resolvedInnerRatio = innerRadiusRatio != null ? clamp$3(innerRadiusRatio, 0, 0.98) : null;
    const derivedTrackThickness = resolvedInnerRatio != null
        ? Math.max(1, outerRadius - outerRadius * resolvedInnerRatio)
        : baseTrackThickness;
    const radius = Math.max(1, outerRadius - derivedTrackThickness / 2);
    const innerRadius = Math.max(0, radius - derivedTrackThickness / 2);
    const outerRadiusActual = radius + derivedTrackThickness / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseStartAngle = startAngle + rotationOffset;
    let span = endAngle + rotationOffset - baseStartAngle;
    if (span <= 0) {
        span += 360;
    }
    const baseEndAngle = baseStartAngle + span;
    const clampedValue = clamp$3(value, min, max);
    const percentage = max === min ? 0 : (clampedValue - min) / (max - min);
    const valueAngle = valueToAngle(clampedValue, min, max, baseStartAngle, baseEndAngle);
    const easingFn = useMemo(() => resolveEasing(animationEasing), [animationEasing]);
    const animatedAngle = useSharedValue(valueAngle);
    const previousAngleRef = useRef(valueAngle);
    const previousValueRef = useRef(clampedValue);
    const gradientInstanceId = useMemo(() => `gauge-${Math.random().toString(36).slice(2, 10)}`, []);
    const formattedValue = useMemo(() => {
        return valueFormatter ? valueFormatter(clampedValue, percentage) : `${Math.round(clampedValue)}`;
    }, [valueFormatter, clampedValue, percentage]);
    const activeMarker = useMemo(() => {
        if (!markers || markers.length === 0) {
            return null;
        }
        const sorted = [...markers].sort((a, b) => a.value - b.value);
        if (markerFocusStrategy === 'leading') {
            for (let i = sorted.length - 1; i >= 0; i -= 1) {
                if (clampedValue >= sorted[i].value) {
                    return sorted[i];
                }
            }
            return null;
        }
        let bestMarker = null;
        let bestDiff = Number.POSITIVE_INFINITY;
        sorted.forEach((marker) => {
            const diff = Math.abs(clampedValue - marker.value);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestMarker = marker;
            }
        });
        if (!bestMarker) {
            return null;
        }
        const threshold = markerFocusThreshold == null ? Number.POSITIVE_INFINITY : Math.max(0, markerFocusThreshold);
        if (threshold === Number.POSITIVE_INFINITY || bestDiff <= threshold) {
            return bestMarker;
        }
        return null;
    }, [markers, markerFocusStrategy, markerFocusThreshold, clampedValue]);
    const previousActiveMarkerRef = useRef(null);
    useEffect(() => {
        const target = valueToAngle(clampedValue, min, max, baseStartAngle, baseEndAngle);
        const previous = previousAngleRef.current;
        const delta = angleDifference(previous, target);
        const finalTarget = previous + delta;
        previousAngleRef.current = finalTarget;
        if (!disabled && animationDuration > 0 && Math.abs(delta) > 1e-4) {
            animatedAngle.value = withTiming(finalTarget, {
                duration: animationDuration,
                easing: easingFn,
            });
        }
        else {
            animatedAngle.value = finalTarget;
        }
        if (onValueChange && previousValueRef.current !== clampedValue) {
            const previousValue = previousValueRef.current;
            previousValueRef.current = clampedValue;
            onValueChange(clampedValue, percentage, previousValue);
        }
        else {
            previousValueRef.current = clampedValue;
        }
    }, [animatedAngle, animationDuration, baseEndAngle, baseStartAngle, clampedValue, easingFn, max, min, disabled, onValueChange, percentage]);
    useEffect(() => {
        if (!onMarkerFocus)
            return;
        if (previousActiveMarkerRef.current !== activeMarker) {
            previousActiveMarkerRef.current = activeMarker;
            onMarkerFocus(activeMarker !== null && activeMarker !== void 0 ? activeMarker : null);
        }
    }, [activeMarker, onMarkerFocus]);
    const needleLengthRatio = (_c = needle === null || needle === void 0 ? void 0 : needle.length) !== null && _c !== void 0 ? _c : 0.9;
    const needleLength = Math.max(0.2, Math.min(1.1, needleLengthRatio)) * outerRadiusActual;
    const needleWidth = (_d = needle === null || needle === void 0 ? void 0 : needle.width) !== null && _d !== void 0 ? _d : 3;
    const needleColor = (_f = (_e = needle === null || needle === void 0 ? void 0 : needle.color) !== null && _e !== void 0 ? _e : theme.colors.accentPalette[0]) !== null && _f !== void 0 ? _f : '#2563eb';
    const showNeedle = (needle === null || needle === void 0 ? void 0 : needle.show) !== false;
    const showCenter = (needle === null || needle === void 0 ? void 0 : needle.showCenter) !== false;
    const centerSize = (_g = needle === null || needle === void 0 ? void 0 : needle.centerSize) !== null && _g !== void 0 ? _g : Math.max(6, derivedTrackThickness * 0.6);
    const centerColor = (_h = needle === null || needle === void 0 ? void 0 : needle.centerColor) !== null && _h !== void 0 ? _h : needleColor;
    const trackColor = (_j = track === null || track === void 0 ? void 0 : track.color) !== null && _j !== void 0 ? _j : theme.colors.grid;
    const trackOpacity = (_k = track === null || track === void 0 ? void 0 : track.opacity) !== null && _k !== void 0 ? _k : 0.35;
    const showTrack = (track === null || track === void 0 ? void 0 : track.show) !== false;
    const tickDerived = useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        if (!ticks)
            return null;
        if (ticks.show === false)
            return null;
        const majorCount = Math.max(1, (_a = ticks.major) !== null && _a !== void 0 ? _a : 5);
        const minorCount = Math.max(0, (_b = ticks.minor) !== null && _b !== void 0 ? _b : 4);
        const generated = generateTickPositions(min, max, majorCount, minorCount);
        const majors = (ticks.majorPositions && ticks.majorPositions.length > 0)
            ? ticks.majorPositions
            : generated.major;
        const minors = (ticks.minorPositions && ticks.minorPositions.length > 0)
            ? ticks.minorPositions
            : generated.minor;
        return {
            majors,
            minors,
            majorLength: (_c = ticks.majorLength) !== null && _c !== void 0 ? _c : 14,
            minorLength: (_d = ticks.minorLength) !== null && _d !== void 0 ? _d : 10,
            color: (_e = ticks.color) !== null && _e !== void 0 ? _e : theme.colors.grid,
            width: (_f = ticks.width) !== null && _f !== void 0 ? _f : 2,
        };
    }, [ticks, min, max, theme.colors.grid]);
    const labelConfig = labels !== null && labels !== void 0 ? labels : {};
    const showLabels = labelConfig.show !== false;
    const labelPositions = useMemo(() => {
        var _a;
        if (!showLabels)
            return [];
        if (labelConfig.positions && labelConfig.positions.length > 0) {
            return labelConfig.positions;
        }
        if (tickDerived === null || tickDerived === void 0 ? void 0 : tickDerived.majors) {
            return tickDerived.majors;
        }
        const divisions = (_a = ticks === null || ticks === void 0 ? void 0 : ticks.major) !== null && _a !== void 0 ? _a : 5;
        return generateLabelPositions(min, max, Math.max(1, divisions));
    }, [labelConfig.positions, min, max, showLabels, tickDerived === null || tickDerived === void 0 ? void 0 : tickDerived.majors, ticks === null || ticks === void 0 ? void 0 : ticks.major]);
    const labelFormatter = (_l = labelConfig.formatter) !== null && _l !== void 0 ? _l : ((val) => `${Math.round(val)}`);
    const labelColor = (_m = labelConfig.color) !== null && _m !== void 0 ? _m : theme.colors.textSecondary;
    const labelFontSize = (_o = labelConfig.fontSize) !== null && _o !== void 0 ? _o : theme.fontSize.sm;
    const labelOffset = (_p = labelConfig.offset) !== null && _p !== void 0 ? _p : 28;
    const labelFontWeight = (_q = labelConfig.fontWeight) !== null && _q !== void 0 ? _q : 'normal';
    const { rangeSegments, rangeGradients } = useMemo(() => {
        if (!ranges || ranges.length === 0) {
            return { rangeSegments: [], rangeGradients: [] };
        }
        const segments = [];
        const gradients = [];
        ranges.forEach((range, index) => {
            var _a, _b, _c, _d, _e;
            const from = clamp$3(range.from, min, max);
            const to = clamp$3(range.to, min, max);
            if (to <= from) {
                return;
            }
            const start = valueToAngle(from, min, max, baseStartAngle, baseEndAngle);
            const end = valueToAngle(to, min, max, baseStartAngle, baseEndAngle);
            const defaultColor = (_a = range.color) !== null && _a !== void 0 ? _a : getColorFromScheme(index, colorSchemes.default);
            const thicknessOverride = (_b = range.thickness) !== null && _b !== void 0 ? _b : derivedTrackThickness;
            let stroke = defaultColor;
            if ((_d = (_c = range.gradient) === null || _c === void 0 ? void 0 : _c.stops) === null || _d === void 0 ? void 0 : _d.length) {
                const gradientId = `${gradientInstanceId}-range-${index}`;
                const gradientPoints = angleToGradientPoints((_e = range.gradient.angle) !== null && _e !== void 0 ? _e : 0);
                stroke = `url(#${gradientId})`;
                const stops = range.gradient.stops;
                gradients.push({
                    id: gradientId,
                    ...gradientPoints,
                    stops,
                });
            }
            segments.push({
                key: `${from}-${to}-${index}`,
                path: createArcPath(centerX, centerY, radius, start, end),
                stroke,
                thickness: thicknessOverride,
            });
        });
        return { rangeSegments: segments, rangeGradients: gradients };
    }, [ranges, min, max, baseStartAngle, baseEndAngle, centerX, centerY, radius, derivedTrackThickness, gradientInstanceId]);
    const markerSegments = useMemo(() => {
        if (!markers || markers.length === 0) {
            return [];
        }
        const rangeCount = ranges ? ranges.length : 0;
        return markers.map((marker, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            const type = (_a = marker.type) !== null && _a !== void 0 ? _a : 'tick';
            const clampedMarkerValue = clamp$3(marker.value, min, max);
            const angle = valueToAngle(clampedMarkerValue, min, max, baseStartAngle, baseEndAngle);
            const color = (_b = marker.color) !== null && _b !== void 0 ? _b : getColorFromScheme(index + rangeCount, colorSchemes.default);
            const labelText = marker.label;
            const isActive = activeMarker === marker;
            if (type === 'needle') {
                const lengthRatio = (_c = marker.needleLength) !== null && _c !== void 0 ? _c : 0.9;
                const markerNeedleLength = Math.max(0.2, Math.min(1.2, lengthRatio)) * outerRadiusActual;
                const startRadius = marker.needleFromCenter === false ? innerRadius : 0;
                const startPoint = getPointOnCircle(centerX, centerY, startRadius, angle);
                const endPoint = getPointOnCircle(centerX, centerY, markerNeedleLength, angle);
                const labelPoint = labelText
                    ? getPointOnCircle(centerX, centerY, markerNeedleLength + ((_d = marker.labelOffset) !== null && _d !== void 0 ? _d : 16), angle)
                    : undefined;
                return {
                    type: 'needle',
                    key: `marker-${clampedMarkerValue}-${index}`,
                    start: startPoint,
                    end: endPoint,
                    color,
                    width: (_f = (_e = marker.needleWidth) !== null && _e !== void 0 ? _e : marker.width) !== null && _f !== void 0 ? _f : Math.max(2, derivedTrackThickness * 0.35),
                    label: labelText,
                    labelPoint,
                    labelColor: (_g = marker.labelColor) !== null && _g !== void 0 ? _g : labelColor,
                    labelFontSize: (_h = marker.labelFontSize) !== null && _h !== void 0 ? _h : labelFontSize,
                    active: isActive,
                };
            }
            const offset = (_j = marker.offset) !== null && _j !== void 0 ? _j : 0;
            const baseRadius = radius + offset;
            const size = (_k = marker.size) !== null && _k !== void 0 ? _k : Math.max(derivedTrackThickness, 10);
            const strokeWidth = (_l = marker.width) !== null && _l !== void 0 ? _l : Math.max(2, derivedTrackThickness * 0.25);
            const outer = getPointOnCircle(centerX, centerY, baseRadius, angle);
            const inner = getPointOnCircle(centerX, centerY, baseRadius - size, angle);
            const labelPoint = labelText
                ? getPointOnCircle(centerX, centerY, baseRadius + ((_m = marker.labelOffset) !== null && _m !== void 0 ? _m : labelOffset + derivedTrackThickness * 0.5 + 8), angle)
                : undefined;
            return {
                type: 'tick',
                key: `marker-${clampedMarkerValue}-${index}`,
                inner,
                outer,
                color,
                width: strokeWidth,
                label: labelText,
                labelPoint,
                labelColor: (_o = marker.labelColor) !== null && _o !== void 0 ? _o : labelColor,
                labelFontSize: (_p = marker.labelFontSize) !== null && _p !== void 0 ? _p : labelFontSize,
                active: isActive,
            };
        });
    }, [markers, ranges, min, max, baseStartAngle, baseEndAngle, radius, derivedTrackThickness, centerX, centerY, labelOffset, labelColor, labelFontSize, activeMarker, outerRadiusActual, innerRadius]);
    const legendItems = useMemo(() => {
        var _a;
        const rangeItems = (ranges && ranges.length)
            ? ranges.map((range, index) => {
                var _a, _b;
                return ({
                    label: (_a = range.label) !== null && _a !== void 0 ? _a : `${range.from} – ${range.to}`,
                    color: (_b = range.color) !== null && _b !== void 0 ? _b : getColorFromScheme(index, colorSchemes.default),
                });
            })
            : [];
        if (!markers || markers.length === 0) {
            return rangeItems;
        }
        const rangeCount = (_a = ranges === null || ranges === void 0 ? void 0 : ranges.length) !== null && _a !== void 0 ? _a : 0;
        const markerItems = markers
            .filter((marker) => marker.label && marker.showInLegend !== false)
            .map((marker, index) => {
            var _a;
            return ({
                label: marker.label,
                color: (_a = marker.color) !== null && _a !== void 0 ? _a : getColorFromScheme(index + rangeCount, colorSchemes.default),
            });
        });
        return [...rangeItems, ...markerItems];
    }, [markers, ranges]);
    const needleAnimatedProps = useAnimatedProps(() => {
        const angleInRadians = ((animatedAngle.value - 90) * Math.PI) / 180;
        const x2 = centerX + needleLength * Math.cos(angleInRadians);
        const y2 = centerY + needleLength * Math.sin(angleInRadians);
        return { x2, y2 };
    });
    const centerPrimaryText = (() => {
        if (centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.formatter) {
            return centerLabel.formatter(clampedValue, percentage);
        }
        if (centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.text) {
            return centerLabel.text;
        }
        if (centerLabel) {
            return formattedValue;
        }
        return undefined;
    })();
    const centerSecondaryText = (() => {
        if (!centerLabel)
            return undefined;
        if (typeof centerLabel.secondaryText === 'function') {
            return centerLabel.secondaryText(clampedValue, percentage);
        }
        return centerLabel.secondaryText;
    })();
    const shouldRenderCenterText = ((_r = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.show) !== null && _r !== void 0 ? _r : Boolean(centerPrimaryText || centerSecondaryText));
    const resolvedAccessibilityLabelText = accessibilityLabel !== null && accessibilityLabel !== void 0 ? accessibilityLabel : (title ? `${title}: ${formattedValue}` : `Gauge value ${formattedValue}`);
    const resolvedAccessibilityHint = accessibilityHint !== null && accessibilityHint !== void 0 ? accessibilityHint : 'Displays progress toward the configured bounds.';
    const resolvedAccessibilityRole = accessibilityRole !== null && accessibilityRole !== void 0 ? accessibilityRole : 'progressbar';
    const resolvedAccessible = accessible !== null && accessible !== void 0 ? accessible : true;
    const resolvedImportantForAccessibility = importantForAccessibility !== null && importantForAccessibility !== void 0 ? importantForAccessibility : 'auto';
    return (jsxs(ChartContainer, { width: width, height: height, disabled: disabled, style: style, accessibilityLabel: resolvedAccessibilityLabelText, accessibilityHint: resolvedAccessibilityHint, accessibilityRole: resolvedAccessibilityRole, accessible: resolvedAccessible, importantForAccessibility: resolvedImportantForAccessibility, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), shouldRenderCenterText && (jsxs(View, { pointerEvents: "none", style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width,
                    height,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: [centerPrimaryText && (jsx(Text, { style: {
                            color: (_s = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.color) !== null && _s !== void 0 ? _s : theme.colors.textPrimary,
                            fontSize: (_t = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.fontSize) !== null && _t !== void 0 ? _t : theme.fontSize.lg,
                            fontWeight: '600',
                            includeFontPadding: false,
                            marginBottom: centerSecondaryText ? (_u = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.gap) !== null && _u !== void 0 ? _u : 4 : 0,
                            textAlign: 'center',
                        }, children: centerPrimaryText })), centerSecondaryText && (jsx(Text, { style: {
                            color: (_v = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.secondaryColor) !== null && _v !== void 0 ? _v : theme.colors.textSecondary,
                            fontSize: (_w = centerLabel === null || centerLabel === void 0 ? void 0 : centerLabel.secondaryFontSize) !== null && _w !== void 0 ? _w : theme.fontSize.sm,
                            includeFontPadding: false,
                            textAlign: 'center',
                        }, children: centerSecondaryText }))] })), jsxs(Svg, { width: width, height: height, children: [jsx(Defs, { children: rangeGradients.map((gradient) => (jsx(LinearGradient, { id: gradient.id, x1: `${gradient.x1}`, y1: `${gradient.y1}`, x2: `${gradient.x2}`, y2: `${gradient.y2}`, children: gradient.stops.map((stop, index) => {
                                var _a;
                                return (jsx(Stop, { offset: stop.offset, stopColor: stop.color, stopOpacity: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }, `${gradient.id}-stop-${index}`));
                            }) }, gradient.id))) }), jsxs(G, { children: [showTrack && (jsx(Path, { d: createArcPath(centerX, centerY, radius, baseStartAngle, baseEndAngle), stroke: trackColor, strokeWidth: derivedTrackThickness, strokeLinecap: "round", opacity: trackOpacity, fill: "none" })), rangeSegments.map((segment) => (jsx(Path, { d: segment.path, stroke: segment.stroke, strokeWidth: segment.thickness, strokeLinecap: "round", fill: "none" }, segment.key))), markerSegments.map((marker) => {
                                const strokeOpacity = marker.active ? 1 : 0.55;
                                if (marker.type === 'needle') {
                                    return (jsxs(React.Fragment, { children: [jsx(Line, { x1: marker.start.x, y1: marker.start.y, x2: marker.end.x, y2: marker.end.y, stroke: marker.color, strokeWidth: marker.width, strokeLinecap: "round", opacity: strokeOpacity }), marker.label && marker.labelPoint && (jsx(Text$1, { x: marker.labelPoint.x, y: marker.labelPoint.y, fill: marker.labelColor, fontSize: marker.labelFontSize, fontWeight: "600", textAnchor: "middle", alignmentBaseline: "middle", children: marker.label }))] }, marker.key));
                                }
                                return (jsxs(React.Fragment, { children: [jsx(Line, { x1: marker.inner.x, y1: marker.inner.y, x2: marker.outer.x, y2: marker.outer.y, stroke: marker.color, strokeWidth: marker.width, strokeLinecap: "round", opacity: strokeOpacity }), marker.label && marker.labelPoint && (jsx(Text$1, { x: marker.labelPoint.x, y: marker.labelPoint.y, fill: marker.labelColor, fontSize: marker.labelFontSize, fontWeight: "600", textAnchor: "middle", alignmentBaseline: "middle", children: marker.label }))] }, marker.key));
                            }), tickDerived && (jsxs(G, { children: [tickDerived.majors.map((tickValue, index) => {
                                        const angle = valueToAngle(tickValue, min, max, baseStartAngle, baseEndAngle);
                                        const outer = getPointOnCircle(centerX, centerY, radius, angle);
                                        const inner = getPointOnCircle(centerX, centerY, radius - tickDerived.majorLength, angle);
                                        return (jsx(Line, { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, stroke: tickDerived.color, strokeWidth: tickDerived.width, strokeLinecap: "round" }, `major-${index}`));
                                    }), tickDerived.minors.map((tickValue, index) => {
                                        const angle = valueToAngle(tickValue, min, max, baseStartAngle, baseEndAngle);
                                        const outer = getPointOnCircle(centerX, centerY, radius, angle);
                                        const inner = getPointOnCircle(centerX, centerY, radius - tickDerived.minorLength, angle);
                                        return (jsx(Line, { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, stroke: tickDerived.color, strokeWidth: Math.max(1, tickDerived.width * 0.6), strokeLinecap: "round" }, `minor-${index}`));
                                    })] })), showLabels && labelPositions.map((position, index) => {
                                const angle = valueToAngle(position, min, max, baseStartAngle, baseEndAngle);
                                const point = getPointOnCircle(centerX, centerY, radius + labelOffset, angle);
                                const label = labelFormatter(position);
                                return (jsx(Text$1, { x: point.x, y: point.y, fill: labelColor, fontSize: labelFontSize, fontWeight: labelFontWeight, textAnchor: "middle", alignmentBaseline: "middle", children: label }, `label-${index}`));
                            }), showNeedle && (jsx(AnimatedLine, { x1: centerX, y1: centerY, animatedProps: needleAnimatedProps, stroke: needleColor, strokeWidth: needleWidth, strokeLinecap: "round" })), showNeedle && showCenter && (jsx(Circle, { cx: centerX, cy: centerY, r: centerSize, fill: centerColor }))] })] }), (legend === null || legend === void 0 ? void 0 : legend.show) && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize }))] }));
};
GaugeChart.displayName = 'GaugeChart';

const AnimatedPath$5 = Animated$1.createAnimatedComponent(Path);
const AnimatedCircle$3 = Animated$1.createAnimatedComponent(Circle);
const resolveEasingPreset = (preset) => {
    switch (preset) {
        case 'linear':
            return Easing.linear;
        case 'easeInOutCubic':
            return Easing.inOut(Easing.cubic);
        case 'easeOutQuad':
            return Easing.out(Easing.quad);
        case 'easeOutCubic':
        default:
            return Easing.out(Easing.cubic);
    }
};
const AnimatedSparkline = React.memo((props) => {
    const { strokePath, fillPath, pathLength, strokeColor, strokeWidth, fillColor, fillOpacity, showPoints, pointSize, highlightLast, points, gradientId, dataSignature, disabled = false, visible = true, highlightExtremaConfig, minPoint, maxPoint, animationConfig, } = props;
    const progress = useSharedValue(0);
    const safeLength = Math.max(pathLength, 0.0001);
    useEffect(() => {
        var _a, _b;
        const enabled = (animationConfig === null || animationConfig === void 0 ? void 0 : animationConfig.enabled) !== false;
        if (disabled || !visible || !enabled) {
            progress.value = 1;
            return;
        }
        progress.value = 0;
        const duration = (_a = animationConfig === null || animationConfig === void 0 ? void 0 : animationConfig.duration) !== null && _a !== void 0 ? _a : 550;
        const delay = (_b = animationConfig === null || animationConfig === void 0 ? void 0 : animationConfig.delay) !== null && _b !== void 0 ? _b : 0;
        const easing = resolveEasingPreset(animationConfig === null || animationConfig === void 0 ? void 0 : animationConfig.easing);
        const timing = withTiming(1, {
            duration,
            easing,
        });
        progress.value = delay > 0 ? withDelay(delay, timing) : timing;
    }, [animationConfig, dataSignature, disabled, progress, visible]);
    const strokeAnimatedProps = useAnimatedProps(() => ({
        strokeDasharray: [safeLength, safeLength],
        strokeDashoffset: (1 - progress.value) * safeLength,
        opacity: visible ? Math.min(1, Math.max(progress.value, 0.05)) : 0,
    }));
    const fillAnimatedProps = useAnimatedProps(() => ({
        opacity: visible && fillPath ? progress.value * fillOpacity : 0,
    }));
    const pointAnimatedProps = useAnimatedProps(() => ({
        opacity: visible ? progress.value : 0,
    }));
    const highlightAnimatedProps = useAnimatedProps(() => ({
        opacity: visible && highlightLast ? progress.value : 0,
        r: highlightLast ? pointSize + 1 + progress.value : pointSize + 1,
    }));
    const extremaAnimatedProps = useAnimatedProps(() => ({
        opacity: visible ? progress.value : 0,
    }));
    if (!visible || !points.length || !strokePath) {
        return null;
    }
    const lastPoint = points[points.length - 1];
    return (jsxs(Fragment, { children: [fillPath ? (jsx(AnimatedPath$5, { d: fillPath, fill: gradientId ? `url(#${gradientId})` : fillColor, animatedProps: fillAnimatedProps })) : null, jsx(AnimatedPath$5, { d: strokePath, fill: "none", stroke: strokeColor, strokeWidth: strokeWidth, strokeLinecap: "round", animatedProps: strokeAnimatedProps }), showPoints
                ? points.map((point, index) => (jsx(AnimatedCircle$3, { cx: point.chartX, cy: point.chartY, r: pointSize, fill: strokeColor, animatedProps: pointAnimatedProps }, `spark-point-${index}`)))
                : null, (highlightExtremaConfig === null || highlightExtremaConfig === void 0 ? void 0 : highlightExtremaConfig.showMin) && minPoint ? (jsx(AnimatedCircle$3, { cx: minPoint.chartX, cy: minPoint.chartY, r: highlightExtremaConfig.radius, fill: highlightExtremaConfig.color, stroke: highlightExtremaConfig.outlineColor, strokeWidth: highlightExtremaConfig.outlineWidth, animatedProps: extremaAnimatedProps })) : null, (highlightExtremaConfig === null || highlightExtremaConfig === void 0 ? void 0 : highlightExtremaConfig.showMax) && maxPoint ? (jsx(AnimatedCircle$3, { cx: maxPoint.chartX, cy: maxPoint.chartY, r: highlightExtremaConfig.radius, fill: highlightExtremaConfig.color, stroke: highlightExtremaConfig.outlineColor, strokeWidth: highlightExtremaConfig.outlineWidth, animatedProps: extremaAnimatedProps })) : null, highlightLast && lastPoint ? (jsx(AnimatedCircle$3, { cx: lastPoint.chartX, cy: lastPoint.chartY, fill: strokeColor, stroke: "white", strokeWidth: 1, animatedProps: highlightAnimatedProps })) : null] }));
});
AnimatedSparkline.displayName = 'AnimatedSparkline';

const clampDomain = (value) => {
    if (value[0] === value[1]) {
        const nextMax = value[1] === 0 ? 1 : value[1] + Math.abs(value[1]) * 0.1 || 1;
        return [value[0] - 1, nextMax];
    }
    return value;
};
const useSparklineGeometry = (options) => {
    const { data, width, height, smooth, padding, domain, enableFill } = options;
    return useMemo(() => {
        var _a, _b;
        if (!width || !height) {
            return {
                points: [],
                strokePath: '',
                fillPath: null,
                pathLength: 0,
                xDomain: [0, 1],
                yDomain: [0, 1],
                zeroNormalized: null,
            };
        }
        if (!data.length) {
            return {
                points: [],
                strokePath: '',
                fillPath: null,
                pathLength: 0,
                xDomain: [0, 1],
                yDomain: [0, 1],
                zeroNormalized: null,
            };
        }
        const valuesX = data.map((point) => point.x);
        const valuesY = data.map((point) => point.y);
        const computedXDomain = (_a = domain === null || domain === void 0 ? void 0 : domain.x) !== null && _a !== void 0 ? _a : [Math.min(...valuesX), Math.max(...valuesX)];
        const computedYDomain = (_b = domain === null || domain === void 0 ? void 0 : domain.y) !== null && _b !== void 0 ? _b : [Math.min(...valuesY), Math.max(...valuesY)];
        const xDomainSafe = clampDomain(computedXDomain);
        const yDomainSafe = clampDomain(computedYDomain);
        const plotWidth = Math.max(0, width - padding.left - padding.right);
        const plotHeight = Math.max(0, height - padding.top - padding.bottom);
        const scaleX = (value) => {
            if (xDomainSafe[1] === xDomainSafe[0]) {
                return padding.left + plotWidth / 2;
            }
            const ratio = (value - xDomainSafe[0]) / (xDomainSafe[1] - xDomainSafe[0]);
            return padding.left + ratio * plotWidth;
        };
        const scaleY = (value) => {
            if (yDomainSafe[1] === yDomainSafe[0]) {
                return padding.top + plotHeight / 2;
            }
            const ratio = (value - yDomainSafe[0]) / (yDomainSafe[1] - yDomainSafe[0]);
            return padding.top + (1 - ratio) * plotHeight;
        };
        const chartPoints = data.map((point, index) => ({
            ...point,
            chartX: scaleX(point.x),
            chartY: scaleY(point.y),
            index,
        }));
        let strokePath = '';
        if (chartPoints.length === 1) {
            const only = chartPoints[0];
            strokePath = `M ${only.chartX} ${only.chartY}`;
        }
        else if (smooth) {
            strokePath = createSmoothPath(chartPoints.map(({ chartX, chartY }) => ({ x: chartX, y: chartY })));
        }
        else {
            strokePath = chartPoints
                .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.chartX} ${point.chartY}`)
                .join(' ');
        }
        let fillPath = null;
        if (enableFill && chartPoints.length > 1) {
            const firstPoint = chartPoints[0];
            const lastPoint = chartPoints[chartPoints.length - 1];
            const baselineY = padding.top + plotHeight;
            const linePath = chartPoints
                .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.chartX} ${point.chartY}`)
                .join(' ');
            fillPath = `${linePath} L ${lastPoint.chartX} ${baselineY} L ${firstPoint.chartX} ${baselineY} Z`;
        }
        const pathLength = chartPoints.reduce((total, point, index) => {
            if (index === 0) {
                return total;
            }
            const prev = chartPoints[index - 1];
            const distance = Math.sqrt(Math.pow(point.chartX - prev.chartX, 2) + Math.pow(point.chartY - prev.chartY, 2));
            return total + distance;
        }, 0);
        let zeroNormalized = null;
        if (yDomainSafe[0] <= 0 && yDomainSafe[1] >= 0 && yDomainSafe[1] !== yDomainSafe[0]) {
            zeroNormalized = 1 - (0 - yDomainSafe[0]) / (yDomainSafe[1] - yDomainSafe[0]);
            zeroNormalized = Math.min(1, Math.max(0, zeroNormalized));
        }
        return {
            points: chartPoints,
            strokePath,
            fillPath,
            pathLength,
            xDomain: xDomainSafe,
            yDomain: yDomainSafe,
            zeroNormalized,
        };
    }, [data, domain === null || domain === void 0 ? void 0 : domain.x, domain === null || domain === void 0 ? void 0 : domain.y, enableFill, height, padding.bottom, padding.left, padding.right, padding.top, smooth, width]);
};

const buildSignature$3 = (options) => {
    const pointSignature = options.points
        .map((point) => `${point.x}:${point.y}`)
        .join('|');
    const idKey = typeof options.id === 'number' ? options.id.toString() : options.id;
    return `${idKey}-${options.color}-${options.visible ? 'on' : 'off'}-${pointSignature}`;
};
const useSparklineSeriesRegistration = (options) => {
    const { id, name, color, points, registerSeries, valueFormatter, visible } = options;
    const signature = useMemo(() => buildSignature$3({ id, color, visible, points }), [color, id, points, visible]);
    const prevSignature = useRef(null);
    useEffect(() => {
        if (!registerSeries || !points.length) {
            return;
        }
        if (signature === prevSignature.current) {
            return;
        }
        const series = {
            id,
            name,
            color,
            visible,
            points: points.map((point, index) => {
                const previous = index > 0 ? points[index - 1] : undefined;
                const delta = previous != null ? point.y - previous.y : undefined;
                const percentChange = previous && previous.y !== 0 ? delta / previous.y : undefined;
                return {
                    x: point.x,
                    y: point.y,
                    meta: {
                        chartX: point.chartX,
                        chartY: point.chartY,
                        index: point.index,
                        value: point.y,
                        delta,
                        percentChange,
                        formattedValue: valueFormatter ? valueFormatter(point.y) : undefined,
                    },
                };
            }),
        };
        registerSeries(series);
        prevSignature.current = signature;
    }, [color, id, name, points, registerSeries, signature, valueFormatter, visible]);
};

const DEFAULT_PADDING$2 = { top: 4, right: 4, bottom: 4, left: 4 };
const normalizeData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    if (typeof data[0] === 'number') {
        return data.map((value, index) => ({ x: index, y: value }));
    }
    return data.map((point, index) => {
        var _a, _b;
        return ({
            x: Number((_a = point.x) !== null && _a !== void 0 ? _a : index),
            y: Number((_b = point.y) !== null && _b !== void 0 ? _b : 0),
        });
    });
};
const SparklineChart = (props) => {
    var _a, _b, _c, _d;
    const { id: idProp, name, data, width = 120, height = 48, color, fill = true, fillOpacity = 0.3, strokeWidth = 2, smooth = true, showPoints = false, pointSize = 3, domain, highlightLast = true, highlightExtrema: highlightExtremaProp = false, valueFormatter, liveTooltip = true, multiTooltip = false, thresholds = [], bands = [], animation, disabled = false, style, } = props;
    const theme = useChartTheme();
    const accentColor = (_b = (_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : colorSchemes.default[0];
    const strokeColor = (_c = color !== null && color !== void 0 ? color : accentColor) !== null && _c !== void 0 ? _c : getColorFromScheme(0);
    const finalFillOpacity = Math.max(0, Math.min(1, fillOpacity));
    const thresholdsList = Array.isArray(thresholds) ? thresholds : [];
    const bandsList = Array.isArray(bands) ? bands : [];
    const animationSettings = useMemo(() => {
        var _a, _b, _c;
        const opts = animation;
        const enabled = (opts === null || opts === void 0 ? void 0 : opts.enabled) !== false;
        return {
            enabled,
            duration: (_a = opts === null || opts === void 0 ? void 0 : opts.duration) !== null && _a !== void 0 ? _a : 550,
            delay: (_b = opts === null || opts === void 0 ? void 0 : opts.delay) !== null && _b !== void 0 ? _b : 0,
            easing: (_c = opts === null || opts === void 0 ? void 0 : opts.easing) !== null && _c !== void 0 ? _c : 'easeOutCubic',
        };
    }, [animation]);
    const extremaSettings = useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        if (!highlightExtremaProp) {
            return {
                enabled: false,
                showMin: false,
                showMax: false,
                color: strokeColor,
                radius: pointSize + 2,
                outlineColor: '#ffffff',
                outlineWidth: 1.5,
            };
        }
        const base = highlightExtremaProp === true ? {} : highlightExtremaProp;
        const showMin = (_a = base.showMin) !== null && _a !== void 0 ? _a : true;
        const showMax = (_b = base.showMax) !== null && _b !== void 0 ? _b : true;
        const enabled = showMin || showMax;
        return {
            enabled,
            showMin,
            showMax,
            color: (_c = base.color) !== null && _c !== void 0 ? _c : strokeColor,
            radius: (_d = base.radius) !== null && _d !== void 0 ? _d : pointSize + 2,
            outlineColor: (_e = base.strokeColor) !== null && _e !== void 0 ? _e : '#ffffff',
            outlineWidth: (_f = base.strokeWidth) !== null && _f !== void 0 ? _f : 1.5,
        };
    }, [highlightExtremaProp, pointSize, strokeColor]);
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_e) {
        // Allow standalone usage without provider
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const interactionSeries = interaction === null || interaction === void 0 ? void 0 : interaction.series;
    const normalizedData = useMemo(() => normalizeData(data), [data]);
    const padding = DEFAULT_PADDING$2;
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const generatedIdRef = useRef(`spark-${Math.random().toString(36).slice(2)}`);
    const seriesId = idProp !== null && idProp !== void 0 ? idProp : generatedIdRef.current;
    const geometry = useSparklineGeometry({
        data: normalizedData,
        width,
        height,
        smooth,
        padding,
        domain,
        enableFill: fill && fillOpacity > 0,
    });
    const { points: chartPoints, strokePath, fillPath, pathLength, xDomain, yDomain, zeroNormalized, } = geometry;
    const xScale = useMemo(() => linearScale(xDomain, [padding.left, padding.left + plotWidth]), [padding.left, plotWidth, xDomain]);
    const yScale = useMemo(() => linearScale(yDomain, [padding.top + plotHeight, padding.top]), [padding.top, plotHeight, yDomain]);
    const extremaConfigForRender = useMemo(() => {
        if (!extremaSettings.enabled)
            return undefined;
        return {
            showMin: extremaSettings.showMin,
            showMax: extremaSettings.showMax,
            color: extremaSettings.color,
            radius: extremaSettings.radius,
            outlineColor: extremaSettings.outlineColor,
            outlineWidth: extremaSettings.outlineWidth,
        };
    }, [extremaSettings]);
    const minPoint = useMemo(() => {
        if (!extremaSettings.enabled || !extremaSettings.showMin || !chartPoints.length) {
            return null;
        }
        return chartPoints.reduce((currentMin, point) => (point.y < currentMin.y ? point : currentMin), chartPoints[0]);
    }, [chartPoints, extremaSettings.enabled, extremaSettings.showMin]);
    const maxPoint = useMemo(() => {
        if (!extremaSettings.enabled || !extremaSettings.showMax || !chartPoints.length) {
            return null;
        }
        return chartPoints.reduce((currentMax, point) => (point.y > currentMax.y ? point : currentMax), chartPoints[0]);
    }, [chartPoints, extremaSettings.enabled, extremaSettings.showMax]);
    const thresholdRender = useMemo(() => {
        if (!thresholdsList.length) {
            return { lines: [], labels: [] };
        }
        const lines = [];
        const labels = [];
        thresholdsList.forEach((threshold, index) => {
            var _a, _b, _c, _d, _e;
            if (!threshold || typeof threshold.value !== 'number') {
                return;
            }
            const yCoord = yScale(threshold.value);
            if (!Number.isFinite(yCoord)) {
                return;
            }
            const keyBase = `spark-threshold-${index}-${threshold.value}`;
            const stroke = (_a = threshold.color) !== null && _a !== void 0 ? _a : strokeColor;
            const opacity = (_b = threshold.opacity) !== null && _b !== void 0 ? _b : 0.6;
            const dash = threshold.dashed ? '4 3' : undefined;
            lines.push(jsx(Line, { x1: padding.left, x2: padding.left + plotWidth, y1: yCoord, y2: yCoord, stroke: stroke, strokeWidth: 1, strokeDasharray: dash, opacity: opacity }, `${keyBase}-line`));
            if (threshold.label) {
                const labelOffset = (_c = threshold.labelOffset) !== null && _c !== void 0 ? _c : -6;
                const position = (_d = threshold.labelPosition) !== null && _d !== void 0 ? _d : 'right';
                const anchor = position === 'left' ? 'start' : 'end';
                const labelX = position === 'left' ? padding.left + 4 : padding.left + plotWidth - 4;
                labels.push(jsx(Text$1, { x: labelX, y: yCoord + labelOffset, fill: (_e = threshold.labelColor) !== null && _e !== void 0 ? _e : theme.colors.textSecondary, fontSize: 9, textAnchor: anchor, children: threshold.label }, `${keyBase}-label`));
            }
        });
        return { lines, labels };
    }, [thresholdsList, yScale, strokeColor, padding.left, plotWidth, theme.colors.textSecondary]);
    const bandRender = useMemo(() => {
        if (!bandsList.length)
            return [];
        return bandsList
            .map((band, index) => {
            var _a, _b;
            if (!band)
                return null;
            const from = band.from;
            const to = band.to;
            const yStart = yScale(Math.max(from, to));
            const yEnd = yScale(Math.min(from, to));
            if (!Number.isFinite(yStart) || !Number.isFinite(yEnd)) {
                return null;
            }
            const top = Math.min(yStart, yEnd);
            const bottom = Math.max(yStart, yEnd);
            const heightRect = bottom - top;
            if (heightRect <= 0)
                return null;
            const fill = (_a = band.color) !== null && _a !== void 0 ? _a : strokeColor;
            const opacity = (_b = band.opacity) !== null && _b !== void 0 ? _b : 0.1;
            return (jsx(Rect, { x: padding.left, y: top, width: plotWidth, height: heightRect, fill: fill, opacity: opacity, rx: 2 }, `spark-band-${index}-${from}-${to}`));
        })
            .filter(Boolean);
    }, [bandsList, padding.left, plotWidth, strokeColor, yScale]);
    const gradientIdRef = useRef(`sparkline-gradient-${Math.random().toString(36).slice(2)}`);
    const gradientId = gradientIdRef.current;
    const dataSignature = useMemo(() => chartPoints.map((point) => `${point.x}:${point.y}`).join('|'), [chartPoints]);
    const seriesVisibility = (_d = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((series) => series.id === seriesId)) === null || _d === void 0 ? void 0 : _d.visible;
    const isSeriesVisible = seriesVisibility !== false;
    useSparklineSeriesRegistration({
        id: seriesId,
        name,
        color: strokeColor,
        points: chartPoints,
        registerSeries,
        valueFormatter,
        visible: isSeriesVisible,
    });
    const pointerShouldUpdate = Boolean(interaction && !disabled && (liveTooltip !== false || multiTooltip !== false));
    const findNearestPoint = useCallback((targetX) => {
        if (!chartPoints.length)
            return null;
        let left = 0;
        let right = chartPoints.length - 1;
        while (left < right) {
            const mid = (left + right) >> 1;
            if (chartPoints[mid].chartX < targetX) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        const candidate = chartPoints[left];
        const prev = left > 0 ? chartPoints[left - 1] : null;
        if (prev && Math.abs(prev.chartX - targetX) < Math.abs(candidate.chartX - targetX)) {
            return prev;
        }
        return candidate;
    }, [chartPoints]);
    const handlePointerMove = useCallback((x, y, nativePosition) => {
        var _a;
        if (!pointerShouldUpdate || !chartPoints.length) {
            return;
        }
        const clampedX = clamp$6(x, padding.left, padding.left + plotWidth);
        const clampedY = clamp$6(y, padding.top, padding.top + plotHeight);
        const nearestPoint = (_a = findNearestPoint(clampedX)) !== null && _a !== void 0 ? _a : chartPoints[0];
        if (setPointer) {
            setPointer({
                x: clampedX,
                y: clampedY,
                inside: true,
                pageX: nativePosition === null || nativePosition === void 0 ? void 0 : nativePosition.pageX,
                pageY: nativePosition === null || nativePosition === void 0 ? void 0 : nativePosition.pageY,
            });
        }
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: nearestPoint.x, pixelX: nearestPoint.chartX });
    }, [chartPoints, findNearestPoint, padding.left, padding.top, plotHeight, plotWidth, pointerShouldUpdate, setPointer, setCrosshair]);
    const handlePointerLeave = useCallback(() => {
        if (!pointerShouldUpdate) {
            return;
        }
        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: 0, y: 0, inside: false });
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
    }, [pointerShouldUpdate, setCrosshair, setPointer]);
    const handleWebPointerMove = useCallback((event) => {
        var _a, _b;
        if (!pointerShouldUpdate) {
            return;
        }
        const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!rect) {
            return;
        }
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        handlePointerMove(x, y, { pageX: event.pageX, pageY: event.pageY });
    }, [handlePointerMove, pointerShouldUpdate]);
    const handleNativeResponderMove = useCallback((event) => {
        var _a;
        if (!pointerShouldUpdate) {
            return;
        }
        const { locationX, locationY, pageX, pageY } = (_a = event.nativeEvent) !== null && _a !== void 0 ? _a : {};
        handlePointerMove(locationX !== null && locationX !== void 0 ? locationX : 0, locationY !== null && locationY !== void 0 ? locationY : 0, { pageX, pageY });
    }, [handlePointerMove, pointerShouldUpdate]);
    const pointerHandlers = Platform.OS === 'web'
        ? {
            onPointerMove: handleWebPointerMove,
            onPointerLeave: handlePointerLeave,
        }
        : {
            onStartShouldSetResponder: () => pointerShouldUpdate,
            onResponderMove: handleNativeResponderMove,
            onResponderGrant: handleNativeResponderMove,
            onResponderRelease: handlePointerLeave,
            onResponderTerminate: handlePointerLeave,
        };
    const baselineTicks = useMemo(() => (zeroNormalized != null && Number.isFinite(zeroNormalized)
        ? [zeroNormalized]
        : []), [zeroNormalized]);
    const gridConfig = useMemo(() => ({
        show: baselineTicks.length > 0,
        color: theme.colors.grid,
        thickness: 1,
        style: 'solid',
        showMajor: true,
        showMinor: false,
    }), [baselineTicks.length, theme.colors.grid]);
    return (jsxs(View, { style: [{ width, height, position: 'relative' }, style], children: [jsx(Axis, { scale: xScale, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, showLine: false, showTicks: false, showLabels: false }), jsx(Axis, { scale: yScale, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, showLine: false, showTicks: false, showLabels: false }), jsx(ChartGrid, { grid: gridConfig, plotWidth: plotWidth, plotHeight: plotHeight, padding: padding, yTicks: baselineTicks }), jsxs(Svg, { width: width, height: height, ...pointerHandlers, children: [fill && fillPath ? (jsx(Defs, { children: jsxs(LinearGradient, { id: gradientId, x1: "0", x2: "0", y1: "0", y2: "1", children: [jsx(Stop, { offset: "0%", stopColor: strokeColor, stopOpacity: finalFillOpacity }), jsx(Stop, { offset: "100%", stopColor: strokeColor, stopOpacity: 0 })] }) })) : null, bandRender, thresholdRender.lines, jsx(AnimatedSparkline, { strokePath: strokePath, fillPath: fill && fillPath ? fillPath : null, pathLength: pathLength, strokeColor: strokeColor, strokeWidth: strokeWidth, fillColor: strokeColor, fillOpacity: finalFillOpacity, showPoints: showPoints, pointSize: pointSize, highlightLast: highlightLast, points: chartPoints, gradientId: fill && fillPath ? gradientId : undefined, dataSignature: dataSignature, disabled: disabled, visible: isSeriesVisible, highlightExtremaConfig: extremaConfigForRender, minPoint: minPoint, maxPoint: maxPoint, animationConfig: animationSettings }), thresholdRender.labels] })] }));
};
SparklineChart.displayName = 'SparklineChart';

const AnimatedRect$3 = Animated$1.createAnimatedComponent(Rect);
const AnimatedPath$4 = Animated$1.createAnimatedComponent(Path);
// Gaussian kernel density estimation
function kernelDensityEstimator(values, bandwidth) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    if (!n)
        return (x) => 0;
    const bw = bandwidth || (1.06 * std(sorted) * Math.pow(n, -1 / 5) || 1);
    return (x) => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            const u = (x - sorted[i]) / bw;
            sum += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
        }
        return sum / (n * bw);
    };
}
function std(arr) {
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) * (v - m), 0) / arr.length);
}
// Custom hook for computing histogram bins
function useHistogramBins(data, binMethod, binsOverride) {
    return useMemo(() => {
        const n = data.length;
        if (!n)
            return { bins: [], min: 0, max: 0 };
        const min = Math.min(...data);
        const max = Math.max(...data);
        let k;
        if (binsOverride) {
            k = binsOverride;
        }
        else {
            switch (binMethod) {
                case 'sqrt':
                    k = Math.ceil(Math.sqrt(n));
                    break;
                case 'fd': {
                    // Freedman–Diaconis rule
                    const sorted = [...data].sort((a, b) => a - b);
                    const q1 = sorted[Math.floor(0.25 * (n - 1))];
                    const q3 = sorted[Math.floor(0.75 * (n - 1))];
                    const iqr = q3 - q1 || (max - min);
                    const h = 2 * iqr * Math.pow(n, -1 / 3);
                    k = h ? Math.ceil((max - min) / h) : Math.ceil(Math.sqrt(n));
                    break;
                }
                case 'sturges':
                default:
                    k = Math.ceil(Math.log2(n) + 1);
            }
        }
        k = Math.max(1, k);
        const width = (max - min) / k || 1;
        const bins = Array.from({ length: k }, (_, i) => ({
            start: min + i * width,
            end: min + (i + 1) * width,
            count: 0,
            density: 0,
        }));
        data.forEach(v => {
            const idx = Math.min(k - 1, Math.floor((v - min) / width));
            bins[idx].count++;
        });
        // Calculate density
        const total = data.length;
        bins.forEach(bin => {
            bin.density = total > 0 ? (bin.count / total) / (bin.end - bin.start) : 0;
        });
        return { bins, min, max };
    }, [data, binMethod, binsOverride]);
}
// Animated bar component for histogram
const AnimatedHistogramBar = React.memo(({ bin, index, x, y, width, height, animationProgress, fill, opacity, radius, disabled }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const animatedHeight = height * progress;
        const animatedY = y + (height - animatedHeight);
        return {
            x,
            y: animatedY,
            width,
            height: Math.max(0, animatedHeight),
        };
    }, [x, y, width, height]);
    return (jsx(AnimatedRect$3, { animatedProps: animatedProps, rx: radius, ry: radius, fill: fill, fillOpacity: opacity }));
});
AnimatedHistogramBar.displayName = 'AnimatedHistogramBar';
// Animated density curve component  
const AnimatedDensityCurve = React.memo(({ path, animationProgress, stroke, strokeWidth, disabled }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        return {
            strokeDasharray: `${progress * 1000} 1000`,
        };
    }, []);
    if (!path)
        return null;
    return (jsx(AnimatedPath$4, { d: path, stroke: stroke, strokeWidth: strokeWidth, fill: "none", animatedProps: disabled ? undefined : animatedProps }));
});
AnimatedDensityCurve.displayName = 'AnimatedDensityCurve';
const HistogramChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { data, width = 400, height = 260, title, subtitle, bins: binsOverride, binMethod = 'sturges', showDensity = true, bandwidth, density = true, barColor, barOpacity = 0.8, densityColor = '#ef4444', densityThickness = 2, barRadius = 2, barGap = 0.08, valueFormatter, multiTooltip = true, liveTooltip = true, enableCrosshair = true, disabled = false, animationDuration = 800, style, xAxis, yAxis, grid, legend, annotations, rangeHighlights, onBinFocus, onBinBlur, } = props;
    const theme = useChartTheme();
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_s) {
        interaction = null;
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    // Use custom hook for bins computation
    const { bins, min, max } = useHistogramBins(data, binMethod, binsOverride);
    const sampleCount = data.length;
    const total = sampleCount || 1;
    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    // Layout constants - adjust padding based on legend position to prevent overlap
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const padding = useMemo(() => {
        if (!(legend === null || legend === void 0 ? void 0 : legend.show))
            return basePadding;
        const position = legend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [legend === null || legend === void 0 ? void 0 : legend.show, legend === null || legend === void 0 ? void 0 : legend.position]);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    // Scales
    const xScale = useMemo(() => {
        return linearScale([min, max], [0, plotWidth]);
    }, [min, max, plotWidth]);
    const yScale = useMemo(() => {
        const maxY = density ? Math.max(...bins.map((b) => b.density)) : maxCount;
        return linearScale([0, maxY], [plotHeight, 0]);
    }, [bins, maxCount, plotHeight, density]);
    // Axis scales
    const xAxisScale = useMemo(() => {
        const scale = ((value) => xScale(value));
        scale.domain = () => [min, max];
        scale.range = () => [0, plotWidth];
        scale.ticks = () => {
            if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length) {
                return xAxis.ticks;
            }
            return generateNiceTicks(min, max, 6);
        };
        return scale;
    }, [xScale, min, max, plotWidth, xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks]);
    const yAxisScale = useMemo(() => {
        const maxY = density ? Math.max(...bins.map((b) => b.density)) : maxCount;
        const scale = ((value) => yScale(value));
        scale.domain = () => [0, maxY];
        scale.range = () => [plotHeight, 0];
        scale.ticks = () => {
            if ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
                return yAxis.ticks;
            }
            return generateNiceTicks(0, maxY, 5);
        };
        return scale;
    }, [yScale, bins, maxCount, plotHeight, density, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks]);
    // Compute density curve using KDE
    const densityCurve = useMemo(() => {
        if (!showDensity || !data.length)
            return { samples: [], path: '' };
        const kde = kernelDensityEstimator(data, bandwidth || 0);
        const samples = [];
        const steps = 80;
        const span = max - min || 1;
        for (let i = 0; i <= steps; i++) {
            const x = min + span * (i / steps);
            const y = kde(x);
            samples.push({ x, y });
        }
        const path = samples
            .map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.x)} ${yScale(s.y)}`)
            .join(' ');
        return { samples, path };
    }, [showDensity, data, bandwidth, min, max, xScale, yScale]);
    // Animation
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const dataSignature = useMemo(() => {
        return bins.map((b) => `${b.start}-${b.end}-${b.count}`).join('|');
    }, [bins]);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    // Series registration with memoization and signature guard
    const totalDensityArea = useMemo(() => {
        if (!bins.length)
            return 0;
        return bins.reduce((acc, bin) => {
            const width = Math.max(0, bin.end - bin.start);
            return acc + bin.density * width;
        }, 0);
    }, [bins]);
    const binSummaries = useMemo(() => {
        if (!bins.length)
            return [];
        let cumulativeCount = 0;
        let cumulativeDensity = 0;
        const densityNormalizer = totalDensityArea > 0 ? totalDensityArea : 1;
        return bins.map((bin, index) => {
            const width = Math.max(0, bin.end - bin.start);
            cumulativeCount += bin.count;
            cumulativeDensity += bin.density * width;
            return {
                ...bin,
                index,
                width,
                midpoint: bin.start + width / 2,
                cumulativeCount,
                cumulativeDensity,
                cumulativeDensityRatio: cumulativeDensity / densityNormalizer,
                percentile: cumulativeCount / total,
            };
        });
    }, [bins, total, totalDensityArea]);
    const [activeBinIndex, setActiveBinIndex] = useState(null);
    const activeBinRef = useRef(null);
    const focusBin = useCallback((nextIndex) => {
        if (activeBinRef.current === nextIndex)
            return;
        const previousIndex = activeBinRef.current;
        activeBinRef.current = nextIndex;
        setActiveBinIndex(nextIndex);
        if (previousIndex != null && previousIndex !== nextIndex) {
            const previousSummary = binSummaries[previousIndex];
            if (previousSummary && onBinBlur) {
                onBinBlur(previousSummary);
            }
        }
        if (nextIndex != null) {
            const nextSummary = binSummaries[nextIndex];
            if (nextSummary && onBinFocus) {
                onBinFocus(nextSummary);
            }
        }
        else if (previousIndex != null) {
            onBinBlur === null || onBinBlur === void 0 ? void 0 : onBinBlur(null);
        }
    }, [binSummaries, onBinBlur, onBinFocus]);
    const findBinIndexForValue = useCallback((value) => {
        if (value == null || !binSummaries.length)
            return null;
        const first = binSummaries[0];
        const last = binSummaries[binSummaries.length - 1];
        if (value < first.start || value > last.end)
            return null;
        for (let i = 0; i < binSummaries.length; i++) {
            const bin = binSummaries[i];
            const isLast = i === binSummaries.length - 1;
            if (value >= bin.start && (value < bin.end || (isLast && value <= bin.end))) {
                return i;
            }
        }
        return null;
    }, [binSummaries]);
    useEffect(() => {
        if (activeBinRef.current != null) {
            const currentIndex = activeBinRef.current;
            if (currentIndex == null || !binSummaries[currentIndex]) {
                activeBinRef.current = null;
                setActiveBinIndex(null);
                onBinBlur === null || onBinBlur === void 0 ? void 0 : onBinBlur(null);
            }
        }
    }, [binSummaries, onBinBlur]);
    const registrationSignature = useMemo(() => {
        const binsSignature = bins
            .map((b) => `${b.start}:${b.end}:${b.count}:${b.density}`)
            .join('|');
        const densitySignature = showDensity
            ? densityCurve.samples.map(s => `${s.x}:${s.y}`).join('|')
            : '';
        return `bins:${binsSignature}|density:${densitySignature}|total:${total}`;
    }, [bins, showDensity, densityCurve.samples, total]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !registrationSignature)
            return;
        if (registeredSignatureRef.current === registrationSignature)
            return;
        // Register bins series
        registerSeries({
            id: 'hist-bins',
            name: 'Count',
            color: barColor || getColorFromScheme(0, colorSchemes.default),
            points: binSummaries.map((summary) => ({
                x: summary.midpoint,
                y: density ? summary.density : summary.count,
                meta: {
                    ...summary,
                    binSize: summary.width,
                    totalCount: total,
                    formattedValue: valueFormatter
                        ? valueFormatter(summary.count, summary)
                        : undefined,
                },
            })),
            visible: true,
        });
        // Register density series if enabled
        if (showDensity && densityCurve.samples.length) {
            registerSeries({
                id: 'hist-density',
                name: 'Density',
                color: densityColor,
                points: densityCurve.samples.map(s => ({
                    x: s.x,
                    y: s.y,
                    meta: { density: s.y },
                })),
                visible: true,
            });
        }
        registeredSignatureRef.current = registrationSignature;
    }, [
        registerSeries,
        binSummaries,
        densityCurve.samples,
        showDensity,
        density,
        barColor,
        densityColor,
        valueFormatter,
        total,
        registrationSignature,
    ]);
    // Grid ticks
    const normalizedXTicks = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        const ticks = (xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length ? xAxis.ticks : xAxisScale.ticks();
        return ticks.map(tick => {
            const px = xAxisScale(tick);
            return px / plotWidth;
        });
    }, [xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks, xAxisScale, plotWidth]);
    const normalizedYTicks = useMemo(() => {
        if (plotHeight <= 0)
            return [];
        const ticks = (yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length ? yAxis.ticks : yAxisScale.ticks();
        return ticks.map(tick => {
            const py = yAxisScale(tick);
            return py / plotHeight;
        });
    }, [plotHeight, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks, yAxisScale]);
    const barFill = barColor || theme.colors.accentPalette[0];
    const pointerActive = activeBinIndex != null;
    const rangeRects = useMemo(() => {
        if (!rangeHighlights || !rangeHighlights.length)
            return [];
        return rangeHighlights
            .map((highlight) => {
            var _a;
            if (highlight.start == null || highlight.end == null)
                return null;
            const start = Math.min(highlight.start, highlight.end);
            const end = Math.max(highlight.start, highlight.end);
            if (end <= min || start >= max)
                return null;
            const clampedStart = Math.max(start, min);
            const clampedEnd = Math.min(end, max);
            const x0 = xScale(clampedStart);
            const x1 = xScale(clampedEnd);
            return {
                key: highlight.id,
                x: x0,
                width: Math.max(0, x1 - x0),
                color: highlight.color || theme.colors.accentPalette[2] || '#38bdf8',
                opacity: (_a = highlight.opacity) !== null && _a !== void 0 ? _a : 0.12,
            };
        })
            .filter((item) => !!item && item.width > 0);
    }, [rangeHighlights, xScale, min, max, theme.colors.accentPalette]);
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip, liveTooltip, enableCrosshair }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), (grid === null || grid === void 0 ? void 0 : grid.show) !== false && (jsx(ChartGrid, { grid: {
                    show: true,
                    color: (grid === null || grid === void 0 ? void 0 : grid.color) || theme.colors.grid,
                    thickness: (_a = grid === null || grid === void 0 ? void 0 : grid.thickness) !== null && _a !== void 0 ? _a : 1,
                    style: (_b = grid === null || grid === void 0 ? void 0 : grid.style) !== null && _b !== void 0 ? _b : 'solid',
                    showMajor: (_c = grid === null || grid === void 0 ? void 0 : grid.showMajor) !== null && _c !== void 0 ? _c : true,
                    showMinor: (_d = grid === null || grid === void 0 ? void 0 : grid.showMinor) !== null && _d !== void 0 ? _d : false,
                    majorLines: grid === null || grid === void 0 ? void 0 : grid.majorLines,
                    minorLines: grid === null || grid === void 0 ? void 0 : grid.minorLines,
                }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), jsx(Svg, { width: width, height: height, style: { position: 'absolute' }, 
                // @ts-ignore web events
                onMouseMove: (e) => {
                    if (!setPointer)
                        return;
                    if (plotWidth <= 0)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = e.clientX - rect.left - padding.left;
                    const py = e.clientY - rect.top - padding.top;
                    const clampedPx = Math.max(0, Math.min(plotWidth, px));
                    const dataX = min + (clampedPx / plotWidth) * (max - min || 1);
                    const binIndex = findBinIndexForValue(dataX);
                    const summary = binIndex != null ? binSummaries[binIndex] : null;
                    focusBin(binIndex);
                    setPointer({
                        x: px + padding.left,
                        y: py + padding.top,
                        inside: true,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        data: summary
                            ? {
                                type: 'histogram-bin',
                                bin: summary,
                            }
                            : null,
                    });
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX, pixelX: px + padding.left });
                }, onMouseLeave: () => {
                    focusBin(null);
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer(null);
                }, children: jsxs(G, { x: padding.left, y: padding.top, children: [rangeRects.map((rect) => (jsx(Rect, { x: rect.x, y: 0, width: rect.width, height: plotHeight, fill: rect.color, opacity: rect.opacity }, `range-${rect.key}`))), bins.map((bin, i) => {
                            const isActive = activeBinIndex === i;
                            const x0 = xScale(bin.start);
                            const x1 = xScale(bin.end);
                            const w = Math.max(1, x1 - x0);
                            const gap = w * barGap;
                            const effectiveW = w - gap;
                            const value = density ? bin.density : bin.count;
                            const y = yScale(value);
                            const h = plotHeight - y;
                            return (jsx(AnimatedHistogramBar, { bin: bin, index: i, x: x0 + gap / 2, y: y, width: effectiveW, height: Math.max(0, h), animationProgress: animationProgress, fill: barFill, opacity: pointerActive ? (isActive ? barOpacity : Math.max(0.25, barOpacity * 0.55)) : barOpacity, radius: barRadius, disabled: disabled }, `bar-${i}`));
                        }), showDensity && (jsx(AnimatedDensityCurve, { path: densityCurve.path, animationProgress: animationProgress, stroke: densityColor, strokeWidth: densityThickness, disabled: disabled }))] }) }), annotations === null || annotations === void 0 ? void 0 : annotations.map((annotation) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                if (!annotation)
                    return null;
                if ((annotation.shape === 'vertical-line' || annotation.shape === 'range') && annotation.x == null && annotation.x1 == null) ;
                const id = (_a = annotation.id) !== null && _a !== void 0 ? _a : `annotation-${annotation.shape}`;
                if (annotation.shape === 'vertical-line' && annotation.x != null) {
                    const pixelX = padding.left + xScale(Number(annotation.x));
                    if (!Number.isFinite(pixelX) || pixelX < padding.left || pixelX > padding.left + plotWidth)
                        return null;
                    const lineWidth = (_b = annotation.lineWidth) !== null && _b !== void 0 ? _b : 1;
                    const color = annotation.color || theme.colors.accentPalette[4] || '#6366f1';
                    const opacity = (_c = annotation.opacity) !== null && _c !== void 0 ? _c : 0.75;
                    const label = annotation.label;
                    const labelColor = annotation.textColor || theme.colors.textPrimary;
                    const fontSize = (_d = annotation.fontSize) !== null && _d !== void 0 ? _d : 11;
                    return (jsxs(React.Fragment, { children: [jsx(View, { style: {
                                    position: 'absolute',
                                    left: pixelX - lineWidth / 2,
                                    top: padding.top,
                                    width: lineWidth,
                                    height: plotHeight,
                                    backgroundColor: color,
                                    opacity,
                                } }), label ? (jsx(Text, { style: {
                                    position: 'absolute',
                                    left: pixelX + 4,
                                    top: Math.max(4, padding.top + 4),
                                    color: labelColor,
                                    fontSize,
                                    fontWeight: '500',
                                    backgroundColor: annotation.backgroundColor || theme.colors.background,
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                }, children: label })) : null] }, String(id)));
                }
                if (annotation.shape === 'horizontal-line' && annotation.y != null) {
                    const pixelY = padding.top + yScale(Number(annotation.y));
                    if (!Number.isFinite(pixelY) || pixelY < padding.top || pixelY > padding.top + plotHeight)
                        return null;
                    const lineWidth = (_e = annotation.lineWidth) !== null && _e !== void 0 ? _e : 1;
                    const color = annotation.color || theme.colors.accentPalette[3] || '#0ea5e9';
                    const opacity = (_f = annotation.opacity) !== null && _f !== void 0 ? _f : 0.7;
                    const label = annotation.label;
                    const labelColor = annotation.textColor || theme.colors.textPrimary;
                    const fontSize = (_g = annotation.fontSize) !== null && _g !== void 0 ? _g : 11;
                    return (jsxs(React.Fragment, { children: [jsx(View, { style: {
                                    position: 'absolute',
                                    left: padding.left,
                                    top: pixelY - lineWidth / 2,
                                    width: plotWidth,
                                    height: lineWidth,
                                    backgroundColor: color,
                                    opacity,
                                } }), label ? (jsx(Text, { style: {
                                    position: 'absolute',
                                    left: padding.left + 8,
                                    top: Math.max(padding.top, pixelY - 24),
                                    color: labelColor,
                                    fontSize,
                                    fontWeight: '500',
                                    backgroundColor: annotation.backgroundColor || theme.colors.background,
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                }, children: label })) : null] }, String(id)));
                }
                if (annotation.shape === 'text' && annotation.x != null && annotation.y != null) {
                    const pixelX = padding.left + xScale(Number(annotation.x));
                    const pixelY = padding.top + yScale(Number(annotation.y));
                    if (!Number.isFinite(pixelX) || !Number.isFinite(pixelY))
                        return null;
                    return (jsx(Text, { style: {
                            position: 'absolute',
                            left: pixelX,
                            top: pixelY,
                            color: annotation.textColor || theme.colors.textPrimary,
                            fontSize: (_h = annotation.fontSize) !== null && _h !== void 0 ? _h : 11,
                            fontWeight: '500',
                            backgroundColor: annotation.backgroundColor || theme.colors.background,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            borderRadius: 4,
                            transform: [{ translateX: -20 }, { translateY: -20 }],
                        }, children: (_j = annotation.label) !== null && _j !== void 0 ? _j : '' }, String(id)));
                }
                return null;
            }), jsx(Axis, { scale: xAxisScale, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length) || xAxisScale.ticks().length, tickSize: (_e = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _e !== void 0 ? _e : 4, tickFormat: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter, showLabels: (_f = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== null && _f !== void 0 ? _f : true, showTicks: (_g = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== null && _g !== void 0 ? _g : true, showLine: (_h = xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== null && _h !== void 0 ? _h : true, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_j = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _j !== void 0 ? _j : 1, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize) !== null && _k !== void 0 ? _k : 11, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title }), jsx(Axis, { scale: yAxisScale, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) || yAxisScale.ticks().length, tickSize: (_l = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _l !== void 0 ? _l : 4, tickFormat: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter, showLabels: (_m = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== null && _m !== void 0 ? _m : true, showTicks: (_o = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== null && _o !== void 0 ? _o : true, showLine: (_p = yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== null && _p !== void 0 ? _p : true, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_q = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _q !== void 0 ? _q : 1, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_r = yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize) !== null && _r !== void 0 ? _r : 11, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title })] }));
};
HistogramChart.displayName = 'HistogramChart';

const AnimatedRect$2 = Animated$1.createAnimatedComponent(Rect);
const AnimatedPath$3 = Animated$1.createAnimatedComponent(Path);
const AnimatedCircle$2 = Animated$1.createAnimatedComponent(Circle);
const toNativePointerEvent$1 = (event) => {
    var _a, _b, _c, _d;
    const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
    return {
        nativeEvent: {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event === null || event === void 0 ? void 0 : event.pageX) !== null && _c !== void 0 ? _c : event === null || event === void 0 ? void 0 : event.clientX,
            pageY: (_d = event === null || event === void 0 ? void 0 : event.pageY) !== null && _d !== void 0 ? _d : event === null || event === void 0 ? void 0 : event.clientY,
        },
    };
};
const useComboAnimation = (disabled, duration, signature) => {
    const progress = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            progress.value = 1;
            return;
        }
        progress.value = 0;
        progress.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
    }, [disabled, duration, signature, progress]);
    return progress;
};
const computeHistogramPoints = (layer) => {
    var _a;
    const values = layer.values;
    if (!values.length)
        return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const n = values.length;
    let bins = (_a = layer.bins) !== null && _a !== void 0 ? _a : Math.ceil(Math.log2(n) + 1);
    if (layer.binMethod === 'sqrt')
        bins = Math.ceil(Math.sqrt(n));
    if (layer.binMethod === 'fd') {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(0.25 * (n - 1))];
        const q3 = sorted[Math.floor(0.75 * (n - 1))];
        const iqr = q3 - q1 || (max - min);
        const h = 2 * iqr * Math.pow(n, -1 / 3);
        bins = h ? Math.ceil((max - min) / h) : bins;
    }
    const width = (max - min) / (bins || 1) || 1;
    const ranges = Array.from({ length: bins }, (_, i) => ({
        start: min + i * width,
        end: min + (i + 1) * width,
        count: 0,
    }));
    values.forEach((v) => {
        const idx = Math.min(ranges.length - 1, Math.floor((v - min) / width));
        ranges[idx].count += 1;
    });
    return ranges.map((bin) => ({
        x: (bin.start + bin.end) / 2,
        y: bin.count,
        meta: { binStart: bin.start, binEnd: bin.end, count: bin.count },
    }));
};
const computeDensityPoints = (layer) => {
    const values = layer.values;
    if (!values.length)
        return [];
    const n = values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((acc, v) => acc + v, 0) / n;
    const std = Math.sqrt(values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / n) || 1;
    const bandwidth = layer.bandwidth || 1.06 * std * Math.pow(n, -1 / 5);
    const sorted = [...values].sort((a, b) => a - b);
    const kernel = (x) => {
        return sorted.reduce((sum, v) => {
            const u = (x - v) / bandwidth;
            return sum + Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
        }, 0) / (n * bandwidth);
    };
    const steps = 80;
    const span = max - min || 1;
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const x = min + (span * i) / steps;
        points.push({ x, y: kernel(x) });
    }
    return points;
};
const ComboBarSeries = React.memo(({ layer, scaleX, scaleY, plotWidth, plotHeight, padding, animationProgress, disabled, onBarHover, onBarHoverEnd, onBarPress }) => {
    var _a, _b;
    const bandwidthFromScale = (_b = (_a = scaleX.bandwidth) === null || _a === void 0 ? void 0 : _a.call(scaleX)) !== null && _b !== void 0 ? _b : 0;
    const bars = useMemo(() => {
        const defaultWidth = bandwidthFromScale > 0 ? bandwidthFromScale * 0.8 : plotWidth / Math.max(1, layer.points.length) * 0.6;
        return layer.points.map((point, index) => {
            var _a, _b;
            const raw = layer.raw;
            let width = raw.type === 'bar' ? (_a = raw.barWidth) !== null && _a !== void 0 ? _a : defaultWidth : defaultWidth;
            if (raw.type === 'histogram' && point.meta) {
                const meta = point.meta;
                if (meta.binStart != null && meta.binEnd != null) {
                    const startPx = scaleX(meta.binStart);
                    const endPx = scaleX(meta.binEnd);
                    width = Math.max(1, Math.abs(endPx - startPx) - 2);
                }
            }
            const center = scaleX(point.x);
            const x = padding.left + center - width / 2;
            const yPixel = scaleY(point.y);
            const baselinePixel = scaleY(0);
            const isPositive = point.y >= 0;
            const rectY = padding.top + (isPositive ? yPixel : baselinePixel);
            const height = Math.max(0, Math.abs(baselinePixel - yPixel));
            return {
                id: `${layer.id}-${index}`,
                dataX: point.x,
                dataY: point.y,
                x,
                y: rectY,
                width,
                height,
                color: ((_b = point.meta) === null || _b === void 0 ? void 0 : _b.color) || layer.color,
                axis: layer.targetAxis,
                dataMeta: point.meta,
                visible: layer.visible,
            };
        });
    }, [layer, scaleX, scaleY, padding.left, padding.top, bandwidthFromScale, plotWidth]);
    return (jsx(Fragment, { children: bars.map((bar) => {
            if (!bar.visible || bar.height <= 0 || bar.width <= 0)
                return null;
            const animatedProps = useAnimatedProps(() => {
                const progress = animationProgress.value;
                const height = bar.height * progress;
                const y = bar.y + (bar.height - height);
                return {
                    x: bar.x,
                    y,
                    width: bar.width,
                    height,
                };
            });
            const isWeb = Platform.OS === 'web';
            return (jsx(AnimatedRect$2, { animatedProps: animatedProps, fill: bar.color, rx: 3, ry: 3, opacity: bar.visible ? 1 : 0, pointerEvents: bar.visible ? 'auto' : 'none', ...(isWeb
                    ? {
                        onPointerEnter: () => !disabled && onBarHover(bar),
                        onPointerLeave: () => onBarHoverEnd(bar),
                        onPointerDown: (event) => {
                            var _a, _b;
                            if (disabled)
                                return;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                        },
                        onPointerUp: (event) => {
                            var _a, _b;
                            if (disabled)
                                return;
                            (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                            onBarPress(bar, toNativePointerEvent$1(event));
                        },
                        onPointerCancel: () => onBarHoverEnd(bar),
                    }
                    : {
                        onPressIn: () => !disabled && onBarHover(bar),
                        onPressOut: () => onBarHoverEnd(bar),
                        onPress: (event) => !disabled && onBarPress(bar, { nativeEvent: event.nativeEvent }),
                    }) }, bar.id));
        }) }));
});
ComboBarSeries.displayName = 'ComboBarSeries';
const computePathLength = (points) => {
    if (points.length < 2)
        return 0;
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
};
const ComboLineSeries = React.memo(({ layer, scaleX, scaleY, plotHeight, animationProgress, showPoints }) => {
    if (layer.points.length < 2 && layer.type !== 'density')
        return null;
    const pixelPoints = useMemo(() => layer.points.map((point) => ({
        x: scaleX(point.x),
        y: scaleY(point.y),
    })), [layer.points, scaleX, scaleY]);
    const pathData = useMemo(() => {
        if (layer.points.length === 0)
            return '';
        if (layer.type === 'line' || layer.type === 'density') {
            if (layer.raw.smooth) {
                const input = pixelPoints.map((p) => ({ x: p.x, y: p.y }));
                return createSmoothPath(input);
            }
            return pixelPoints
                .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                .join(' ');
        }
        // area
        const areaPath = layer.points
            .map((point, index) => {
            const px = scaleX(point.x);
            const py = scaleY(point.y);
            return `${index === 0 ? 'M' : 'L'} ${px} ${py}`;
        })
            .join(' ');
        const last = layer.points[layer.points.length - 1];
        const first = layer.points[0];
        const baseline = scaleY(0);
        return `${areaPath} L ${scaleX(last.x)} ${baseline} L ${scaleX(first.x)} ${baseline} Z`;
    }, [layer, pixelPoints, scaleX, scaleY]);
    const pathLength = useMemo(() => (layer.type === 'line' || layer.type === 'density' ? computePathLength(pixelPoints) : 0), [layer.type, pixelPoints]);
    const animatedStrokeProps = useAnimatedProps(() => {
        if (layer.type === 'line' || layer.type === 'density') {
            const dashLength = Math.max(pathLength, 1);
            const offset = dashLength * (1 - animationProgress.value);
            return {
                strokeDasharray: `${dashLength}`,
                strokeDashoffset: offset,
            };
        }
        return {};
    });
    const animatedFillProps = useAnimatedProps(() => ({
        opacity: animationProgress.value,
    }));
    const renderPoints = showPoints && layer.type === 'line';
    return (jsxs(Fragment, { children: [layer.type === 'area' ? (jsx(AnimatedPath$3, { d: pathData, fill: `${layer.color}33`, stroke: layer.color, strokeWidth: 1, animatedProps: animatedFillProps })) : (jsx(AnimatedPath$3, { d: pathData, fill: "none", stroke: layer.color, strokeWidth: layer.raw.thickness || (layer.type === 'density' ? 1.5 : 2), animatedProps: animatedStrokeProps })), renderPoints && pixelPoints.map((point, index) => (jsx(AnimatedCircle$2, { cx: point.x, cy: point.y, r: layer.raw.pointSize || 3, fill: layer.color, animatedProps: animatedFillProps }, `${layer.id}-point-${index}`)))] }));
});
ComboLineSeries.displayName = 'ComboLineSeries';
const ComboChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const { layers, width = 520, height = 320, title, subtitle, enableCrosshair = true, multiTooltip = true, liveTooltip = true, xDomain: xDomainProp, yDomain: yDomainLeftProp, yDomainRight: yDomainRightProp, xAxis, yAxis, yAxisRight, legend, grid, style, disabled = false, onPress, onDataPointPress, } = props;
    const theme = useChartTheme();
    const assignColor = useMemo(() => createColorAssigner(), []);
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_z) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const wantsCrosshairUpdates = (enableCrosshair !== false) || Boolean(multiTooltip);
    const pointerStateAvailable = Boolean(setPointer || (wantsCrosshairUpdates && setCrosshair));
    const isWeb = Platform.OS === 'web';
    const normalizedLayers = useMemo(() => {
        return layers.map((layer, index) => {
            var _a;
            const id = String((_a = layer.id) !== null && _a !== void 0 ? _a : `layer-${index}`);
            const targetAxis = layer.targetAxis === 'right' ? 'right' : 'left';
            const color = layer.color || assignColor(index, layer.id);
            let points = [];
            switch (layer.type) {
                case 'bar':
                case 'line':
                case 'area':
                    points = layer.data.map((point) => {
                        const meta = point.meta ? { ...point.meta } : {};
                        if (meta.color == null && point.color != null) {
                            meta.color = point.color;
                        }
                        return { x: point.x, y: point.y, meta };
                    });
                    break;
                case 'histogram':
                    points = computeHistogramPoints(layer);
                    break;
                case 'density':
                    points = computeDensityPoints(layer);
                    break;
            }
            return {
                id,
                name: layer.name || `${layer.type}-${index + 1}`,
                type: layer.type,
                targetAxis,
                color,
                points,
                raw: layer,
                visible: true,
            };
        });
    }, [layers, assignColor]);
    const seriesVisibility = useMemo(() => {
        const map = new Map();
        interaction === null || interaction === void 0 ? void 0 : interaction.series.forEach((series) => {
            map.set(String(series.id), series.visible);
        });
        return map;
    }, [interaction === null || interaction === void 0 ? void 0 : interaction.series]);
    const resolvedLayers = useMemo(() => normalizedLayers.map((layer) => ({
        ...layer,
        visible: seriesVisibility.has(layer.id) ? seriesVisibility.get(layer.id) : true,
    })), [normalizedLayers, seriesVisibility]);
    const hasRightAxis = resolvedLayers.some((layer) => layer.targetAxis === 'right') || !!yAxisRight;
    const padding = useMemo(() => ({
        top: 40,
        right: hasRightAxis ? 72 : 32,
        bottom: 64,
        left: 80,
    }), [hasRightAxis]);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const pointerTrackingEnabled = pointerStateAvailable && !disabled && plotWidth > 0 && plotHeight > 0;
    const hasContinuousPointerTracking = pointerTrackingEnabled && isWeb;
    const { xDomain, yDomainLeft, yDomainRight } = useMemo(() => {
        const leftLayers = resolvedLayers.filter((layer) => layer.targetAxis === 'left');
        const rightLayersOnly = resolvedLayers.filter((layer) => layer.targetAxis === 'right');
        const xValues = resolvedLayers.flatMap((layer) => layer.points.map((p) => p.x));
        let xMin = xDomainProp === null || xDomainProp === void 0 ? void 0 : xDomainProp[0];
        let xMax = xDomainProp === null || xDomainProp === void 0 ? void 0 : xDomainProp[1];
        if (xMin == null || xMax == null) {
            const min = xValues.length ? Math.min(...xValues) : 0;
            const max = xValues.length ? Math.max(...xValues) : 1;
            if (xMin == null)
                xMin = min;
            if (xMax == null)
                xMax = max;
        }
        if (xMin === xMax) {
            const delta = xMin === 0 ? 1 : Math.abs(xMin) * 0.1;
            xMin -= delta;
            xMax += delta;
        }
        const extractDomain = (layersSubset, provided) => {
            if (provided)
                return provided;
            const values = layersSubset.flatMap((layer) => layer.points.map((p) => p.y));
            const min = values.length ? Math.min(...values) : 0;
            const max = values.length ? Math.max(...values) : 1;
            if (min === max) {
                const delta = min === 0 ? 1 : Math.abs(min) * 0.1;
                return [min - delta, max + delta];
            }
            return [min, max];
        };
        const leftDomain = extractDomain(leftLayers, yDomainLeftProp);
        const rightDomain = rightLayersOnly.length ? extractDomain(rightLayersOnly, yDomainRightProp) : extractDomain(leftLayers, yDomainRightProp);
        return {
            xDomain: [xMin, xMax],
            yDomainLeft: leftDomain,
            yDomainRight: rightDomain,
        };
    }, [resolvedLayers, xDomainProp, yDomainLeftProp, yDomainRightProp]);
    const scaleX = useMemo(() => linearScale(xDomain, [0, plotWidth]), [xDomain, plotWidth]);
    const scaleYLeft = useMemo(() => linearScale(yDomainLeft, [plotHeight, 0]), [yDomainLeft, plotHeight]);
    const scaleYRight = useMemo(() => linearScale(yDomainRight, [plotHeight, 0]), [yDomainRight, plotHeight]);
    const updatePointerFromPlotCoords = useCallback((plotX, plotY, meta) => {
        var _a;
        if (!pointerStateAvailable)
            return;
        const chartX = padding.left + plotX;
        const chartY = padding.top + plotY;
        const insideX = plotX >= 0 && plotX <= plotWidth;
        const insideY = plotY >= 0 && plotY <= plotHeight;
        if (setPointer) {
            setPointer({
                x: chartX,
                y: chartY,
                inside: insideX && insideY,
                insideX,
                insideY,
                pageX: meta === null || meta === void 0 ? void 0 : meta.pageX,
                pageY: meta === null || meta === void 0 ? void 0 : meta.pageY,
                data: (_a = meta === null || meta === void 0 ? void 0 : meta.data) !== null && _a !== void 0 ? _a : null,
            });
        }
        if (wantsCrosshairUpdates && setCrosshair) {
            const clampedX = Math.max(0, Math.min(plotWidth, plotX));
            const dataX = scaleX.invert ? scaleX.invert(clampedX) : xDomain[0];
            setCrosshair({ dataX, pixelX: padding.left + clampedX });
        }
    }, [pointerStateAvailable, padding.left, padding.top, plotWidth, plotHeight, setPointer, wantsCrosshairUpdates, setCrosshair, scaleX, xDomain]);
    const clearPointerState = useCallback(() => {
        if (!pointerStateAvailable)
            return;
        if (setPointer) {
            setPointer({ x: 0, y: 0, inside: false, insideX: false, insideY: false, data: null });
        }
        if (wantsCrosshairUpdates) {
            setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
        }
    }, [pointerStateAvailable, setPointer, wantsCrosshairUpdates, setCrosshair]);
    useEffect(() => {
        if (!pointerTrackingEnabled) {
            clearPointerState();
        }
    }, [pointerTrackingEnabled, clearPointerState]);
    const handleWebPointerMove = useCallback((event) => {
        var _a, _b, _c, _d;
        if (!hasContinuousPointerTracking)
            return;
        const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!rect)
            return;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        updatePointerFromPlotCoords(x, y, { pageX: (_c = event.pageX) !== null && _c !== void 0 ? _c : event.clientX, pageY: (_d = event.pageY) !== null && _d !== void 0 ? _d : event.clientY });
    }, [hasContinuousPointerTracking, updatePointerFromPlotCoords]);
    const handlePointerLeave = useCallback(() => {
        if (!hasContinuousPointerTracking)
            return;
        clearPointerState();
    }, [hasContinuousPointerTracking, clearPointerState]);
    const svgPointerHandlers = useMemo(() => {
        if (!hasContinuousPointerTracking)
            return {};
        return {
            // @ts-ignore react-native-web pointer events
            onPointerMove: handleWebPointerMove,
            // @ts-ignore react-native-web pointer events
            onPointerDown: handleWebPointerMove,
            // @ts-ignore react-native-web pointer events
            onPointerLeave: handlePointerLeave,
            // @ts-ignore react-native-web pointer events
            onPointerCancel: handlePointerLeave,
        };
    }, [hasContinuousPointerTracking, handleWebPointerMove, handlePointerLeave]);
    const barLayers = resolvedLayers.filter((layer) => layer.type === 'bar' || layer.type === 'histogram');
    const lineLayers = resolvedLayers.filter((layer) => layer.type === 'line' || layer.type === 'area' || layer.type === 'density');
    const layerSignature = useMemo(() => resolvedLayers.map((layer) => {
        const pointsSig = layer.points.map((point) => `${point.x}:${point.y}`).join('|');
        return `${layer.id}:${layer.visible ? '1' : '0'}:${pointsSig}`;
    }).join('||'), [resolvedLayers]);
    const animationProgress = useComboAnimation(disabled, 800, layerSignature);
    const registerSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (registerSignatureRef.current === layerSignature)
            return;
        registerSignatureRef.current = layerSignature;
        resolvedLayers.forEach((layer) => {
            registerSeries({
                id: layer.id,
                name: layer.name,
                color: layer.color,
                points: layer.points.map((point) => {
                    const axisScale = layer.targetAxis === 'right' ? scaleYRight : scaleYLeft;
                    const pixelX = padding.left + scaleX(point.x);
                    const pixelY = padding.top + axisScale(point.y);
                    return {
                        x: point.x,
                        y: point.y,
                        pixelX,
                        pixelY,
                        meta: {
                            axis: layer.targetAxis,
                            type: layer.type,
                            chartX: pixelX,
                            chartY: pixelY,
                            ...point.meta,
                        },
                    };
                }),
                visible: layer.visible,
            });
        });
    }, [registerSeries, resolvedLayers, layerSignature, scaleX, scaleYLeft, scaleYRight, padding.left, padding.top]);
    const handleBarHover = useCallback((bar) => {
        const centerPlotX = bar.x + bar.width / 2 - padding.left;
        const pointerPlotY = bar.y - padding.top;
        updatePointerFromPlotCoords(centerPlotX, pointerPlotY);
    }, [padding.left, padding.top, updatePointerFromPlotCoords]);
    const handleBarHoverEnd = useCallback((_bar) => {
        if (hasContinuousPointerTracking)
            return;
        clearPointerState();
    }, [hasContinuousPointerTracking, clearPointerState]);
    const handleBarPress = useCallback((bar, nativeEvent) => {
        const chartEvent = {
            nativeEvent,
            chartX: (bar.x + bar.width / 2) / width,
            chartY: (bar.y + bar.height / 2) / height,
            dataX: bar.dataX,
            dataY: bar.dataY,
            dataPoint: {
                x: bar.dataX,
                y: bar.dataY,
                ...bar.dataMeta,
            },
        };
        onPress === null || onPress === void 0 ? void 0 : onPress(chartEvent);
        if (chartEvent.dataPoint) {
            onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(chartEvent.dataPoint, chartEvent);
        }
    }, [height, onDataPointPress, onPress, width]);
    const xTicks = useMemo(() => { var _a; return (_a = xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) !== null && _a !== void 0 ? _a : generateNiceTicks(xDomain[0], xDomain[1], 6); }, [xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks, xDomain]);
    const yTicksLeft = useMemo(() => { var _a; return (_a = yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) !== null && _a !== void 0 ? _a : generateNiceTicks(yDomainLeft[0], yDomainLeft[1], 5); }, [yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks, yDomainLeft]);
    const yTicksRight = useMemo(() => { var _a; return (_a = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.ticks) !== null && _a !== void 0 ? _a : generateNiceTicks(yDomainRight[0], yDomainRight[1], 5); }, [yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.ticks, yDomainRight]);
    const normalizedXTicks = useMemo(() => {
        if (plotWidth <= 0)
            return [];
        return xTicks.map((tick) => (scaleX(tick) / (plotWidth || 1)));
    }, [xTicks, plotWidth, scaleX]);
    const normalizedYTicksLeft = useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return yTicksLeft.map((tick) => (scaleYLeft(tick) / (plotHeight || 1)));
    }, [yTicksLeft, plotHeight, scaleYLeft]);
    useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return yTicksRight.map((tick) => (scaleYRight(tick) / (plotHeight || 1)));
    }, [yTicksRight, plotHeight, scaleYRight]);
    const xAxisScale = useMemo(() => {
        const scale = linearScale(xDomain, [0, plotWidth]);
        scale.ticks = () => xTicks;
        return scale;
    }, [xDomain, plotWidth, xTicks]);
    const yAxisScaleLeft = useMemo(() => {
        const scale = linearScale(yDomainLeft, [plotHeight, 0]);
        scale.ticks = () => yTicksLeft;
        return scale;
    }, [yDomainLeft, plotHeight, yTicksLeft]);
    const yAxisScaleRight = useMemo(() => {
        const scale = linearScale(yDomainRight, [plotHeight, 0]);
        scale.ticks = () => yTicksRight;
        return scale;
    }, [yDomainRight, plotHeight, yTicksRight]);
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, disabled: disabled, animationDuration: 800, style: style, interactionConfig: { enableCrosshair, multiTooltip, liveTooltip }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), (grid === null || grid === void 0 ? void 0 : grid.show) !== false && (jsx(ChartGrid, { grid: {
                    show: true,
                    color: (grid === null || grid === void 0 ? void 0 : grid.color) || theme.colors.grid,
                    thickness: (_a = grid === null || grid === void 0 ? void 0 : grid.thickness) !== null && _a !== void 0 ? _a : 1,
                    style: (_b = grid === null || grid === void 0 ? void 0 : grid.style) !== null && _b !== void 0 ? _b : 'solid',
                    showMajor: (_c = grid === null || grid === void 0 ? void 0 : grid.showMajor) !== null && _c !== void 0 ? _c : true,
                    showMinor: (_d = grid === null || grid === void 0 ? void 0 : grid.showMinor) !== null && _d !== void 0 ? _d : false,
                    majorLines: grid === null || grid === void 0 ? void 0 : grid.majorLines,
                    minorLines: grid === null || grid === void 0 ? void 0 : grid.minorLines,
                }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicksLeft, padding: padding })), jsx(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top }, ...svgPointerHandlers, children: jsxs(G, { children: [barLayers.map((layer) => (layer.visible ? (jsx(ComboBarSeries, { layer: layer, scaleX: scaleX, scaleY: layer.targetAxis === 'right' ? scaleYRight : scaleYLeft, plotWidth: plotWidth, plotHeight: plotHeight, padding: padding, animationProgress: animationProgress, disabled: disabled, onBarHover: handleBarHover, onBarHoverEnd: handleBarHoverEnd, onBarPress: handleBarPress }, layer.id)) : null)), lineLayers.map((layer) => (layer.visible ? (jsx(ComboLineSeries, { layer: layer, scaleX: scaleX, scaleY: layer.targetAxis === 'right' ? scaleYRight : scaleYLeft, plotHeight: plotHeight, animationProgress: animationProgress, showPoints: layer.raw.showPoints }, layer.id)) : null))] }) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && (jsx(Axis, { orientation: "bottom", scale: xAxisScale, length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTicks.length, tickSize: (_e = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _e !== void 0 ? _e : 4, tickPadding: 8, tickFormat: (value) => ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) ? xAxis.labelFormatter(value) : `${value}`), label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_f = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _f !== void 0 ? _f : 1, showLine: (_g = xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== null && _g !== void 0 ? _g : true, showTicks: (_h = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== null && _h !== void 0 ? _h : true, showLabels: (_j = xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== null && _j !== void 0 ? _j : true, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_k = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize) !== null && _k !== void 0 ? _k : 11 })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && (jsx(Axis, { orientation: "left", scale: yAxisScaleLeft, length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTicksLeft.length, tickSize: (_l = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _l !== void 0 ? _l : 4, tickPadding: 6, tickFormat: (value) => ((yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) ? yAxis.labelFormatter(value) : `${value}`), label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_m = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _m !== void 0 ? _m : 1, showLine: (_o = yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== null && _o !== void 0 ? _o : true, showTicks: (_p = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== null && _p !== void 0 ? _p : true, showLabels: (_q = yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== null && _q !== void 0 ? _q : true, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_r = yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize) !== null && _r !== void 0 ? _r : 11 })), hasRightAxis && ((_s = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.show) !== null && _s !== void 0 ? _s : true) && (jsx(Axis, { orientation: "right", scale: yAxisScaleRight, length: plotHeight, offset: { x: width - padding.right, y: padding.top }, tickCount: yTicksRight.length, tickSize: (_t = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.tickLength) !== null && _t !== void 0 ? _t : 4, tickPadding: 6, tickFormat: (value) => ((yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.labelFormatter) ? yAxisRight.labelFormatter(value) : `${value}`), label: yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.title, stroke: (yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.color) || theme.colors.grid, strokeWidth: (_u = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.thickness) !== null && _u !== void 0 ? _u : 1, showLine: (_v = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.show) !== null && _v !== void 0 ? _v : true, showTicks: (_w = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.showTicks) !== null && _w !== void 0 ? _w : true, showLabels: (_x = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.showLabels) !== null && _x !== void 0 ? _x : true, tickLabelColor: (yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.labelColor) || theme.colors.textSecondary, tickLabelFontSize: (_y = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.labelFontSize) !== null && _y !== void 0 ? _y : 11 })), (legend === null || legend === void 0 ? void 0 : legend.show) && (jsx(ChartLegend, { items: resolvedLayers.map((layer) => ({
                    label: layer.name,
                    color: layer.color,
                    visible: layer.visible,
                })), position: legend.position, align: legend.align, textColor: legend.textColor, fontSize: legend.fontSize, onItemPress: updateSeriesVisibility ? (item, index, nativeEvent) => {
                    var _a, _b;
                    const layer = resolvedLayers[index];
                    if (!layer)
                        return;
                    const currentVisible = (_b = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.series.find((series) => String(series.id) === layer.id)) === null || _a === void 0 ? void 0 : _a.visible) !== null && _b !== void 0 ? _b : layer.visible;
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const currentlyVisible = resolvedLayers.filter((entry) => entry.visible).map((entry) => entry.id);
                        const isSole = currentlyVisible.length === 1 && currentlyVisible[0] === layer.id;
                        resolvedLayers.forEach((entry) => updateSeriesVisibility(entry.id, isSole ? true : entry.id === layer.id));
                    }
                    else {
                        updateSeriesVisibility(layer.id, !currentVisible);
                    }
                } : undefined }))] }));
};
ComboChart.displayName = 'ComboChart';

// Kernel Density Estimation utilities shared by Ridge & Violin charts
/**
 * Gaussian kernel function
 * @param u - Normalized distance
 * @returns Kernel weight
 */
const gaussian = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
/**
 * Calculates bandwidth using Silverman's rule of thumb
 * @param values - Array of data values
 * @returns Calculated bandwidth
 */
function silvermanBandwidth(values) {
    const n = values.length;
    if (n < 2)
        return 1;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (n - 1);
    const sd = Math.sqrt(Math.max(variance, 1e-9));
    const iqrVals = [...values].sort((a, b) => a - b);
    const q1 = iqrVals[Math.floor(0.25 * (n - 1))];
    const q3 = iqrVals[Math.floor(0.75 * (n - 1))];
    const iqr = q3 - q1 || sd; // fallback
    const sigma = Math.min(sd, iqr / 1.34) || sd || 1;
    return 1.06 * sigma * Math.pow(n, -1 / 5);
}
/**
 * Performs kernel density estimation on a dataset
 * @param values - Array of data values
 * @param domain - Range to evaluate the density over [min, max]
 * @param opts - KDE options
 * @returns Array of {x, y} density curve points
 */
function kde(values, domain, opts = {}) {
    if (!values.length)
        return [];
    const { bandwidth, samples = 64 } = opts;
    const bw = bandwidth !== null && bandwidth !== void 0 ? bandwidth : silvermanBandwidth(values);
    const [min, max] = domain;
    const step = (max - min) / (samples - 1);
    const coeff = 1 / (values.length * bw);
    const out = [];
    for (let i = 0; i < samples; i++) {
        const x = min + i * step;
        let sum = 0;
        for (let j = 0; j < values.length; j++) {
            sum += gaussian((x - values[j]) / bw);
        }
        out.push({ x, y: coeff * sum });
    }
    return out;
}
/**
 * Normalizes density values to 0-1 range
 * @param points - Array of density curve points
 * @returns Normalized points
 */
function normalizeDensity(points) {
    if (!points.length)
        return points;
    const max = points.reduce((m, p) => p.y > m ? p.y : m, 0) || 1;
    return points.map(p => ({ x: p.x, y: p.y / max }));
}

const AnimatedPath$2 = Animated$1.createAnimatedComponent(Path);
const AnimatedRidgeArea = React.memo(({ path, fill, stroke = 'none', strokeWidth = 0, index, totalAreas = 1, disabled = false, fillOpacity = 1, strokeOpacity = 1, }) => {
    const opacity = useSharedValue(disabled ? 1 : 0);
    const scale = useSharedValue(disabled ? 1 : 0.8);
    // Adaptive timing based on number of areas
    const adaptiveTiming = React.useMemo(() => {
        if (totalAreas <= 5) {
            return { duration: 800, staggerDelay: 150 };
        }
        else if (totalAreas <= 10) {
            return { duration: 600, staggerDelay: 100 };
        }
        else {
            return { duration: 400, staggerDelay: 50 };
        }
    }, [totalAreas]);
    useEffect(() => {
        if (disabled) {
            opacity.value = 1;
            scale.value = 1;
            return;
        }
        const delay = index * adaptiveTiming.staggerDelay;
        opacity.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.duration,
            easing: Easing.out(Easing.cubic),
        }));
        scale.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.duration,
            easing: Easing.out(Easing.back(1.2)),
        }));
    }, [disabled, index, adaptiveTiming, opacity, scale]);
    const animatedProps = useAnimatedProps(() => ({
        fillOpacity: opacity.value * fillOpacity,
        strokeOpacity: opacity.value * strokeOpacity,
        transform: [
            { scaleY: scale.value },
        ],
    }));
    return (jsx(AnimatedPath$2, { animatedProps: animatedProps, d: path, fill: fill, stroke: stroke, strokeWidth: strokeWidth }));
});
AnimatedRidgeArea.displayName = 'AnimatedRidgeArea';

const buildSignature$2 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b, _c, _d, _e;
            const meta = point.meta;
            const tooltipSig = (_a = meta === null || meta === void 0 ? void 0 : meta.tooltipSignature) !== null && _a !== void 0 ? _a : '';
            const valueSig = (_b = meta === null || meta === void 0 ? void 0 : meta.valueSignature) !== null && _b !== void 0 ? _b : '';
            const formattedSig = typeof (meta === null || meta === void 0 ? void 0 : meta.formattedValue) === 'string' || typeof (meta === null || meta === void 0 ? void 0 : meta.formattedValue) === 'number'
                ? meta.formattedValue
                : '';
            const customSig = typeof (meta === null || meta === void 0 ? void 0 : meta.customTooltip) === 'string'
                ? meta.customTooltip
                : (meta === null || meta === void 0 ? void 0 : meta.customTooltip)
                    ? 'node'
                    : '';
            const unitSig = (_c = meta === null || meta === void 0 ? void 0 : meta.unit) !== null && _c !== void 0 ? _c : '';
            return `${point.x}:${point.y}:${(_d = meta === null || meta === void 0 ? void 0 : meta.bandIndex) !== null && _d !== void 0 ? _d : ''}:${(_e = meta === null || meta === void 0 ? void 0 : meta.originalValue) !== null && _e !== void 0 ? _e : ''}:${tooltipSig}:${valueSig}:${formattedSig}:${customSig}:${unitSig}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
        .join('||');
};
const fallbackValueFormatter = (value) => value.toFixed(1);
const useRidgeSeriesRegistration = ({ series, registerSeries, updateSeriesVisibility, }) => {
    const registrations = useMemo(() => {
        if (!series.length)
            return [];
        return series.map((ridgeSeries, seriesIndex) => {
            var _a, _b, _c;
            const baseFormatter = (_a = ridgeSeries.valueFormatter) !== null && _a !== void 0 ? _a : fallbackValueFormatter;
            const unit = ridgeSeries.unit;
            const unitSuffix = (_b = ridgeSeries.unitSuffix) !== null && _b !== void 0 ? _b : (ridgeSeries.valueFormatter ? '' : unit ? ` ${unit}` : '');
            const valueFormatterWithUnit = (value) => `${baseFormatter(value)}${unitSuffix}`;
            const stats = (_c = ridgeSeries.stats) !== null && _c !== void 0 ? _c : null;
            return {
                id: `ridge-${ridgeSeries.id}`,
                name: ridgeSeries.name,
                color: ridgeSeries.color,
                visible: ridgeSeries.visible,
                points: ridgeSeries.densityData.map((point, index) => {
                    var _a;
                    const tooltipResult = (_a = ridgeSeries.tooltipFormatter) === null || _a === void 0 ? void 0 : _a.call(ridgeSeries, {
                        value: point.x,
                        density: point.yNormalized,
                        probability: point.probability,
                        pdf: point.pdf,
                        normalizedDensity: point.yNormalized,
                        index,
                        seriesIndex,
                        series: {
                            id: ridgeSeries.id,
                            name: ridgeSeries.name,
                            color: ridgeSeries.color,
                            unit,
                            stats,
                        },
                    });
                    const sharePercent = Math.max(0, Math.min(100, point.probability * 100));
                    const relativePercent = Math.max(0, Math.min(100, point.yNormalized * 100));
                    const shareLabel = sharePercent >= 1 ? sharePercent.toFixed(1) : sharePercent.toFixed(2);
                    const relativeLabel = relativePercent >= 1 ? relativePercent.toFixed(1) : relativePercent.toFixed(2);
                    const defaultTooltip = `${valueFormatterWithUnit(point.x)} • share ${shareLabel}% • relative ${relativeLabel}%`;
                    let formattedValue;
                    let customTooltip;
                    if (tooltipResult != null) {
                        if (typeof tooltipResult === 'string' || typeof tooltipResult === 'number') {
                            formattedValue = tooltipResult;
                        }
                        else {
                            customTooltip = tooltipResult;
                        }
                    }
                    else {
                        formattedValue = defaultTooltip;
                    }
                    const valueLabel = valueFormatterWithUnit(point.x);
                    return {
                        x: point.x,
                        y: point.probability,
                        meta: {
                            bandIndex: point.bandIndex,
                            originalValue: point.originalValue,
                            value: point.x,
                            valueLabel,
                            valueFormatter: valueFormatterWithUnit,
                            unit,
                            unitSuffix,
                            density: point.yNormalized,
                            normalizedDensity: point.yNormalized,
                            probability: point.probability,
                            pdf: point.pdf,
                            stats,
                            seriesId: ridgeSeries.id,
                            seriesName: ridgeSeries.name,
                            color: ridgeSeries.color,
                            customTooltip,
                            formattedValue,
                            tooltipSignature: ridgeSeries.tooltipFormatterSignature,
                            valueSignature: ridgeSeries.valueFormatterSignature,
                        },
                    };
                }),
            };
        });
    }, [series]);
    const signature = useMemo(() => buildSignature$2(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    const visibilitySignature = useMemo(() => series.map((ridgeSeries) => `${ridgeSeries.id}:${ridgeSeries.visible !== false ? '1' : '0'}`).join('|'), [series]);
    const visibilityAppliedRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((registration) => {
            registerSeries(registration);
        });
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!signature) {
            registeredSignatureRef.current = null;
        }
    }, [signature]);
    useEffect(() => {
        if (!updateSeriesVisibility)
            return;
        if (visibilityAppliedRef.current === visibilitySignature)
            return;
        series.forEach((ridgeSeries) => {
            updateSeriesVisibility(`ridge-${ridgeSeries.id}`, ridgeSeries.visible !== false);
        });
        visibilityAppliedRef.current = visibilitySignature;
    }, [series, updateSeriesVisibility, visibilitySignature]);
};

const clamp$2 = (value, min, max) => Math.min(Math.max(value, min), max);
const defaultValueFormatter = (value) => value.toFixed(1);
const computeSeriesStats$1 = (values) => {
    if (!values.length)
        return null;
    const sorted = [...values].sort((a, b) => a - b);
    const total = sorted.length;
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = sum / total;
    const mid = total / 2;
    let median;
    if (Number.isInteger(mid)) {
        const upper = sorted[mid];
        const lower = sorted[mid - 1];
        median = (upper + lower) / 2;
    }
    else {
        median = sorted[Math.floor(mid)];
    }
    const p90Index = Math.min(total - 1, Math.max(0, Math.round((total - 1) * 0.9)));
    const p90 = sorted[p90Index];
    return { mean, median, p90 };
};
const STAT_LABELS = {
    mean: 'Mean',
    median: 'Median',
    p90: 'P90',
};
// RidgeChart: vertically stacked kernel density curves (normalized) with baseline fill.
const RidgeChart = ({ width = 600, height = 300, series, title, subtitle, style, samples = 64, bandwidth, bandPadding, amplitudeScale, xAxis, yAxis, grid, statsMarkers, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const theme = useChartTheme();
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const padding = basePadding;
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const count = Math.max(series.length, 1);
    const defaultScheme = colorSchemes.default;
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_h) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    // Domain inferred from all samples
    const allValues = series.flatMap(s => s.values);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bandH = plotHeight / count;
    const axisLabelFormatter = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter;
    const bandPaddingRatio = clamp$2(bandPadding !== null && bandPadding !== void 0 ? bandPadding : 0.25, 0, 0.75);
    const amplitudeRatio = clamp$2(amplitudeScale !== null && amplitudeScale !== void 0 ? amplitudeScale : 0.85, 0.1, 1);
    const bandGap = bandH * bandPaddingRatio;
    const amplitudeHeight = Math.max(0, (bandH - bandGap) * amplitudeRatio);
    const baselineOffset = bandGap / 2;
    const sampleStep = samples > 1 ? (max - min) / Math.max(1, samples - 1) : 0;
    const densities = React.useMemo(() => {
        return series.map((s, i) => {
            var _a, _b, _c, _d, _e;
            const isVisible = s.visible !== false;
            let dens = [];
            if (isVisible) {
                const rawDensity = kde(s.values, [min, max], { bandwidth, samples });
                const normalizedDensity = normalizeDensity(rawDensity);
                dens = normalizedDensity.map((point, idx) => {
                    var _a, _b;
                    const pdfValue = (_b = (_a = rawDensity[idx]) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
                    const probability = sampleStep > 0 ? Math.max(0, pdfValue * sampleStep) : 0;
                    return {
                        x: point.x,
                        y: point.y,
                        pdf: pdfValue,
                        probability,
                    };
                });
            }
            const color = s.color || getColorFromScheme(i, defaultScheme);
            const fillOpacity = clamp$2((_a = s.fillOpacity) !== null && _a !== void 0 ? _a : 0.6, 0, 1);
            const strokeColor = s.strokeColor || color;
            const strokeWidth = (_b = s.strokeWidth) !== null && _b !== void 0 ? _b : 1;
            const unit = s.unit;
            const stats = computeSeriesStats$1(s.values);
            const valueFormatter = (_d = (_c = s.valueFormatter) !== null && _c !== void 0 ? _c : axisLabelFormatter) !== null && _d !== void 0 ? _d : defaultValueFormatter;
            const valueFormatterSignature = s.valueFormatter
                ? s.valueFormatter.toString()
                : axisLabelFormatter
                    ? axisLabelFormatter.toString()
                    : 'default';
            const unitSuffix = s.valueFormatter ? '' : unit ? ` ${unit}` : '';
            const defaultTooltipFormatter = ({ value, probability, density }) => {
                const sharePercent = Math.max(0, Math.min(100, probability * 100));
                const relativePercent = Math.max(0, Math.min(100, density * 100));
                const shareLabel = sharePercent >= 1 ? sharePercent.toFixed(1) : sharePercent.toFixed(2);
                const relativeLabel = relativePercent >= 1 ? relativePercent.toFixed(1) : relativePercent.toFixed(2);
                return `${valueFormatter(value)}${unitSuffix} • share ${shareLabel}% • relative ${relativeLabel}%`;
            };
            const tooltipFormatter = (_e = s.tooltipFormatter) !== null && _e !== void 0 ? _e : defaultTooltipFormatter;
            const tooltipFormatterSignature = s.tooltipFormatter
                ? s.tooltipFormatter.toString()
                : `default-${valueFormatterSignature}-${unit !== null && unit !== void 0 ? unit : ''}`;
            return {
                id: s.id || i,
                color,
                dens,
                name: s.name || `Series ${i + 1}`,
                visible: isVisible,
                fillOpacity,
                strokeColor,
                strokeWidth,
                tooltipFormatter,
                tooltipFormatterSignature,
                valueFormatter,
                valueFormatterSignature,
                unit,
                stats,
                unitSuffix,
            };
        });
    }, [series, min, max, bandwidth, samples, defaultScheme, axisLabelFormatter, sampleStep]);
    // Create axis scales
    const axisScaleX = React.useMemo(() => {
        const range = [0, plotWidth];
        const scale = ((value) => ((value - min) / (max - min || 1)) * plotWidth);
        scale.domain = () => [min, max];
        scale.range = () => range;
        scale.invert = (pixel) => min + ((pixel / plotWidth) * (max - min || 1));
        scale.ticks = () => {
            if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length)
                return xAxis.ticks;
            const tickCount = Math.min(6, Math.max(3, Math.floor(plotWidth / 80)));
            const ticks = [];
            for (let i = 0; i <= tickCount; i++) {
                ticks.push(min + (i / tickCount) * (max - min));
            }
            return ticks;
        };
        scale.bandwidth = () => plotWidth / (max - min || 1);
        return scale;
    }, [min, max, plotWidth, xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks]);
    const axisScaleY = React.useMemo(() => {
        const range = [plotHeight, 0];
        const scale = ((value) => {
            const index = typeof value === 'number' ? value : series.findIndex(s => s.name === value);
            return index * bandH + bandH / 2;
        });
        scale.domain = () => series.map((s, i) => s.name || `Series ${i + 1}`);
        scale.range = () => range;
        scale.ticks = () => series.map((s, i) => s.name || `Series ${i + 1}`);
        scale.bandwidth = () => bandH;
        return scale;
    }, [series, plotHeight, bandH]);
    const scaleX = (x) => ((x - min) / (max - min || 1)) * plotWidth;
    // y within each band: 0 at baseline, density extends upward (scaled to band height * 0.9)
    const ridgePath = (dens, idx) => {
        if (!dens.length)
            return '';
        const bandTop = idx * bandH;
        const baseY = bandTop + bandH - baselineOffset;
        const amplitude = amplitudeHeight;
        let d = '';
        dens.forEach((p, i) => {
            const x = scaleX(p.x);
            const y = baseY - p.y * amplitude;
            d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
        });
        const lastX = scaleX(dens[dens.length - 1].x);
        const firstX = scaleX(dens[0].x);
        d += ` L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
        return d;
    };
    // Prepare registration data for series interaction
    const registrationData = React.useMemo(() => {
        return densities.map((r, i) => ({
            id: r.id,
            name: r.name || `Series ${i + 1}`,
            color: r.color,
            visible: r.visible,
            densityData: r.visible
                ? r.dens.map((p) => ({
                    x: p.x,
                    yNormalized: p.y,
                    pdf: p.pdf,
                    probability: p.probability,
                    bandIndex: i,
                    originalValue: p.x,
                }))
                : [],
            tooltipFormatter: r.tooltipFormatter,
            tooltipFormatterSignature: r.tooltipFormatterSignature,
            valueFormatter: r.valueFormatter,
            valueFormatterSignature: r.valueFormatterSignature,
            stats: r.stats,
            unit: r.unit,
            unitSuffix: r.unitSuffix,
        }));
    }, [densities]);
    const visibleSeriesCount = React.useMemo(() => densities.filter((entry) => entry.visible).length, [densities]);
    const markerSettings = React.useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const explicitEnabled = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.enabled;
        let showMean = (_a = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMean) !== null && _a !== void 0 ? _a : (explicitEnabled ? true : false);
        let showMedian = (_b = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMedian) !== null && _b !== void 0 ? _b : (explicitEnabled ? true : false);
        let showP90 = (_c = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showP90) !== null && _c !== void 0 ? _c : false;
        const enabled = explicitEnabled !== null && explicitEnabled !== void 0 ? explicitEnabled : (showMean || showMedian || showP90);
        if (!enabled) {
            showMean = false;
            showMedian = false;
            showP90 = false;
        }
        const markerHeight = (_d = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.markerHeight) !== null && _d !== void 0 ? _d : Math.min(18, Math.max(6, amplitudeHeight * 0.6));
        const strokeWidthMarker = (_e = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.strokeWidth) !== null && _e !== void 0 ? _e : 2;
        const colors = (_f = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.colors) !== null && _f !== void 0 ? _f : {};
        const showLabels = (_g = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showLabels) !== null && _g !== void 0 ? _g : false;
        const labelOffset = (_h = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.labelOffset) !== null && _h !== void 0 ? _h : 6;
        const labelFormatter = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.labelFormatter;
        return {
            enabled,
            showMean,
            showMedian,
            showP90,
            markerHeight,
            strokeWidth: strokeWidthMarker,
            colors,
            showLabels,
            labelOffset,
            labelFormatter,
        };
    }, [statsMarkers, amplitudeHeight]);
    // Register series for tooltip interaction
    useRidgeSeriesRegistration({
        series: registrationData,
        registerSeries,
        updateSeriesVisibility,
    });
    // Generate normalized ticks for ChartGrid
    const normalizedXTicks = React.useMemo(() => {
        var _a;
        if (plotWidth <= 0)
            return [];
        return ((_a = axisScaleX.ticks) === null || _a === void 0 ? void 0 : _a.call(axisScaleX).map((tick) => {
            const px = axisScaleX(tick);
            return px / plotWidth;
        }).filter((value) => value != null && Number.isFinite(value))) || [];
    }, [axisScaleX, plotWidth]);
    const normalizedYTicks = React.useMemo(() => {
        if (plotHeight <= 0)
            return [];
        return series.map((_, i) => (i * bandH + bandH / 2) / plotHeight);
    }, [series, bandH, plotHeight]);
    let renderIndex = -1;
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip: true, enableCrosshair: true }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && plotWidth > 0 && plotHeight > 0 && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), jsx(Svg, { width: width, height: height, style: { position: 'absolute' }, 
                // @ts-ignore web
                onMouseMove: (e) => {
                    if (!setPointer)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = e.clientX - rect.left - padding.left;
                    const py = e.clientY - rect.top - padding.top;
                    setPointer({ x: px + padding.left, y: py + padding.top, inside: true, pageX: e.pageX, pageY: e.pageY });
                    const dataX = min + ((px / plotWidth) * (max - min || 1));
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX, pixelX: px + padding.left });
                }, onMouseLeave: () => {
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
                    if ((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) && setPointer) {
                        setPointer({ ...interaction.pointer, inside: false });
                    }
                }, children: jsx(G, { x: padding.left, y: padding.top, children: densities.map((r, i) => {
                        var _a;
                        if (!r.visible)
                            return null;
                        const sourceSeries = series[i];
                        if (!sourceSeries)
                            return null;
                        renderIndex += 1;
                        const path = ridgePath(r.dens, i);
                        const baseY = i * bandH + bandH - baselineOffset;
                        const markerElements = [];
                        if (markerSettings.enabled && r.stats) {
                            const { markerHeight, strokeWidth: markerStrokeWidth } = markerSettings;
                            const lineHeight = Math.max(1, markerHeight);
                            const radius = Math.max(1, markerStrokeWidth * 1.5);
                            const colorFor = (stat) => { var _a, _b, _c; return (_c = (_b = (_a = markerSettings.colors) === null || _a === void 0 ? void 0 : _a[stat]) !== null && _b !== void 0 ? _b : r.strokeColor) !== null && _c !== void 0 ? _c : r.color; };
                            const formatValue = r.valueFormatter;
                            const suffix = (_a = r.unitSuffix) !== null && _a !== void 0 ? _a : '';
                            const pushMarker = (stat, enabled, value) => {
                                if (!enabled || value == null)
                                    return;
                                const xPos = scaleX(value);
                                if (!Number.isFinite(xPos))
                                    return;
                                const clampedX = Math.min(Math.max(xPos, 0), plotWidth);
                                const topY = baseY - lineHeight;
                                let label = null;
                                let formattedValue = '';
                                if (markerSettings.showLabels || markerSettings.labelFormatter) {
                                    const formattedRaw = formatValue(value);
                                    formattedValue = typeof formattedRaw === 'number' ? String(formattedRaw) : formattedRaw;
                                    const defaultLabel = `${STAT_LABELS[stat]} ${formattedValue}${suffix}`;
                                    label = markerSettings.showLabels
                                        ? markerSettings.labelFormatter
                                            ? markerSettings.labelFormatter({ stat, value, formattedValue, series: sourceSeries })
                                            : defaultLabel
                                        : null;
                                }
                                markerElements.push(jsxs(React.Fragment, { children: [jsx(Line, { x1: clampedX, y1: baseY, x2: clampedX, y2: topY, stroke: colorFor(stat), strokeWidth: markerStrokeWidth, strokeLinecap: "round" }), jsx(Circle, { cx: clampedX, cy: topY, r: radius, fill: colorFor(stat) }), markerSettings.showLabels && label ? (jsx(Text$1, { x: clampedX, y: topY - markerSettings.labelOffset, fill: theme.colors.textSecondary, fontSize: 10, textAnchor: "middle", children: label })) : null] }, `${r.id}-${stat}`));
                            };
                            pushMarker('mean', markerSettings.showMean, r.stats.mean);
                            pushMarker('median', markerSettings.showMedian, r.stats.median);
                            pushMarker('p90', markerSettings.showP90, r.stats.p90);
                        }
                        return (jsxs(React.Fragment, { children: [jsx(AnimatedRidgeArea, { path: path, fill: r.color, fillOpacity: r.fillOpacity, stroke: r.strokeColor, strokeWidth: r.strokeWidth, index: renderIndex, totalAreas: Math.max(visibleSeriesCount, 1) }), markerElements] }, r.id));
                    }) }) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: ((_a = axisScaleX.ticks) === null || _a === void 0 ? void 0 : _a.call(axisScaleX).length) || 5, tickSize: (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _b !== void 0 ? _b : 4, tickPadding: 4, tickFormat: (value) => {
                    if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter)
                        return xAxis.labelFormatter(value);
                    return typeof value === 'number' ? value.toFixed(1) : String(value);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _c !== void 0 ? _c : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_d = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _d !== void 0 ? _d : 12) + 20 : 30, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize, style: { width: plotWidth, height: padding.bottom } })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: series.length, tickSize: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _e !== void 0 ? _e : 4, tickPadding: 4, tickFormat: (value) => {
                    if (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter)
                        return yAxis.labelFormatter(value);
                    return String(value);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _f !== void 0 ? _f : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_g = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _g !== void 0 ? _g : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } }))] }));
};
RidgeChart.displayName = 'RidgeChart';

const AnimatedPath$1 = Animated$1.createAnimatedComponent(Path);
const AnimatedViolinShape = React.memo(({ path, fill, fillOpacity = 0.35, stroke = 'none', strokeWidth = 0, index, totalViolins = 1, disabled = false, onFocus, onBlur, onPress, }) => {
    const opacity = useSharedValue(disabled ? 1 : 0);
    const scaleX = useSharedValue(disabled ? 1 : 0.3);
    const scaleY = useSharedValue(disabled ? 1 : 0.8);
    // Adaptive timing based on number of violins
    const adaptiveTiming = React.useMemo(() => {
        if (totalViolins <= 3) {
            return { duration: 1000, staggerDelay: 200 };
        }
        else if (totalViolins <= 6) {
            return { duration: 800, staggerDelay: 150 };
        }
        else {
            return { duration: 600, staggerDelay: 100 };
        }
    }, [totalViolins]);
    useEffect(() => {
        if (disabled) {
            opacity.value = 1;
            scaleX.value = 1;
            scaleY.value = 1;
            return;
        }
        const delay = index * adaptiveTiming.staggerDelay;
        opacity.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.duration,
            easing: Easing.out(Easing.cubic),
        }));
        scaleX.value = withDelay(delay, withTiming(1, {
            duration: adaptiveTiming.duration,
            easing: Easing.out(Easing.back(1.3)),
        }));
        scaleY.value = withDelay(delay + 100, withTiming(1, {
            duration: adaptiveTiming.duration - 100,
            easing: Easing.out(Easing.cubic),
        }));
    }, [disabled, index, adaptiveTiming, opacity, scaleX, scaleY]);
    const animatedProps = useAnimatedProps(() => ({
        opacity: opacity.value,
        transform: [
            { scaleX: scaleX.value },
            { scaleY: scaleY.value },
        ],
    }));
    const handleFocus = useCallback(() => {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    }, [onBlur]);
    const handlePress = useCallback(() => {
        onPress === null || onPress === void 0 ? void 0 : onPress();
    }, [onPress]);
    return (jsx(AnimatedPath$1, { animatedProps: animatedProps, d: path, fill: fill, fillOpacity: fillOpacity, stroke: stroke, strokeWidth: strokeWidth, pointerEvents: "auto", onPress: onPress ? handlePress : undefined, onPressIn: onFocus ? handleFocus : undefined, onPressOut: onBlur ? handleBlur : undefined, 
        // @ts-ignore web hover events
        onMouseEnter: onFocus ? handleFocus : undefined, 
        // @ts-ignore web hover events
        onMouseLeave: onBlur ? handleBlur : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverIn: onFocus ? handleFocus : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverOut: onBlur ? handleBlur : undefined }));
});
AnimatedViolinShape.displayName = 'AnimatedViolinShape';

const buildSignature$1 = (registrations) => {
    if (!registrations.length)
        return null;
    return registrations
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => {
            var _a, _b;
            const meta = point.meta;
            return `${point.x}:${point.y}:${(_a = meta === null || meta === void 0 ? void 0 : meta.categoryIndex) !== null && _a !== void 0 ? _a : ''}:${(_b = meta === null || meta === void 0 ? void 0 : meta.originalValue) !== null && _b !== void 0 ? _b : ''}`;
        })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
        .join('||');
};
const useViolinSeriesRegistration = ({ series, registerSeries, }) => {
    const registrations = useMemo(() => {
        if (!series.length)
            return [];
        return series.map((violinSeries) => ({
            id: `violin-${violinSeries.id}`,
            name: violinSeries.name,
            color: violinSeries.color,
            visible: violinSeries.visible,
            points: violinSeries.densityData.map((point) => ({
                x: point.x,
                y: point.y,
                meta: {
                    categoryIndex: point.categoryIndex,
                    originalValue: point.originalValue,
                    seriesId: violinSeries.id,
                    seriesName: violinSeries.name,
                    density: point.y,
                },
            })),
        }));
    }, [series]);
    const signature = useMemo(() => buildSignature$1(registrations), [registrations]);
    const registeredSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !signature)
            return;
        if (registeredSignatureRef.current === signature)
            return;
        registrations.forEach((registration) => {
            registerSeries(registration);
        });
        registeredSignatureRef.current = signature;
    }, [registerSeries, registrations, signature]);
    useEffect(() => {
        if (!signature) {
            registeredSignatureRef.current = null;
        }
    }, [signature]);
};

const clamp$1 = (value, min, max) => Math.min(max, Math.max(min, value));
const toFixed = (value, precision = 2) => {
    if (!Number.isFinite(value))
        return '0';
    return value.toFixed(precision);
};
const computeQuantile = (sorted, q) => {
    if (!sorted.length)
        return 0;
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
};
const computeMean = (values) => {
    if (!values.length)
        return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
};
const computeStdDev = (values) => {
    if (values.length <= 1)
        return 0;
    const mean = computeMean(values);
    const variance = values.reduce((acc, val) => {
        const diff = val - mean;
        return acc + diff * diff;
    }, 0) / (values.length - 1);
    return Math.sqrt(Math.max(variance, 0));
};
const computeAdaptiveBandwidthValue = (values, method) => {
    if (values.length <= 1)
        return 0;
    const stdDev = computeStdDev(values);
    if (stdDev <= 0)
        return 0;
    const n = values.length;
    if (method === 'scott') {
        return stdDev * Math.pow(n, -1 / 5);
    }
    return 1.06 * stdDev * Math.pow(n, -1 / 5);
};
const resolveSeriesBandwidth = (series, values, fallback, min, max) => {
    if (typeof series.bandwidth === 'number' && Number.isFinite(series.bandwidth) && series.bandwidth > 0) {
        return series.bandwidth;
    }
    if (series.adaptiveBandwidth && values.length > 1) {
        const adaptive = computeAdaptiveBandwidthValue(values, series.adaptiveBandwidth);
        if (adaptive > 0)
            return adaptive;
    }
    if (typeof fallback === 'number' && Number.isFinite(fallback) && fallback > 0) {
        return fallback;
    }
    const span = Math.max(1e-3, max - min);
    return span / 12;
};
const computeSeriesStats = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: computeMean(values),
        median: computeQuantile(sorted, 0.5),
        q1: computeQuantile(sorted, 0.25),
        q3: computeQuantile(sorted, 0.75),
        p10: computeQuantile(sorted, 0.1),
        p90: computeQuantile(sorted, 0.9),
    };
};
const statsMarkersEnabled = (config) => {
    if (!config)
        return false;
    if (config.enabled)
        return true;
    return Boolean(config.showMedian || config.showQuartiles || config.showMean || config.showWhiskers);
};
// ViolinChart: mirrored density for each series (vertical violins side by side)
const ViolinChart = ({ width = 400, height = 300, series, title, subtitle, style, samples = 64, bandwidth, violinWidthRatio, layout = 'vertical', stackOverlap = 0, xAxis, yAxis, grid, statsMarkers, valueBands, showLegend = false, legendPosition = 'bottom', legend, onSeriesFocus, onSeriesBlur, onSeriesPress, }) => {
    var _a, _b, _c, _d, _e, _f;
    const theme = useChartTheme();
    const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
    const resolvedLegend = React.useMemo(() => {
        if (legend)
            return legend;
        if (!showLegend)
            return undefined;
        return {
            show: true,
            position: legendPosition,
            align: 'center',
        };
    }, [legend, showLegend, legendPosition]);
    const padding = React.useMemo(() => {
        if (!(resolvedLegend === null || resolvedLegend === void 0 ? void 0 : resolvedLegend.show))
            return basePadding;
        const position = resolvedLegend.position || 'bottom';
        return {
            ...basePadding,
            top: position === 'top' ? basePadding.top + 40 : basePadding.top,
            bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
            left: position === 'left' ? basePadding.left + 120 : basePadding.left,
            right: position === 'right' ? basePadding.right + 120 : basePadding.right,
        };
    }, [resolvedLegend === null || resolvedLegend === void 0 ? void 0 : resolvedLegend.show, resolvedLegend === null || resolvedLegend === void 0 ? void 0 : resolvedLegend.position]);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const seriesCount = series.length;
    const safeSeriesCount = Math.max(seriesCount, 1);
    const defaultScheme = colorSchemes.default;
    const widthRatio = clamp$1(violinWidthRatio !== null && violinWidthRatio !== void 0 ? violinWidthRatio : 0.9, 0.2, 1);
    const showStatsMarkers = statsMarkersEnabled(statsMarkers);
    const isHorizontal = layout === 'horizontal';
    const overlap = clamp$1(stackOverlap !== null && stackOverlap !== void 0 ? stackOverlap : 0, 0, series.length > 1 ? 0.95 : 0);
    const categoryAxisLength = isHorizontal ? plotHeight : plotWidth;
    const valueAxisLength = isHorizontal ? plotWidth : plotHeight;
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_g) {
        console.warn('ViolinChart: useChartInteractionContext failed, ensure it is rendered inside a ChartInteractionProvider');
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const allValues = React.useMemo(() => series.flatMap((s) => s.values), [series]);
    const { min: minValue, max: maxValue } = React.useMemo(() => {
        if (!allValues.length) {
            return { min: 0, max: 1 };
        }
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);
        if (min === max) {
            const delta = Math.max(1, Math.abs(min) * 0.1);
            return { min: min - delta, max: max + delta };
        }
        return { min, max };
    }, [allValues]);
    const min = minValue;
    const max = maxValue;
    const densData = React.useMemo(() => series.map((s, i) => {
        var _a;
        const rawValues = Array.isArray(s.values) ? s.values : [];
        const values = rawValues.filter((value) => Number.isFinite(value));
        const baseColor = s.color || getColorFromScheme(i, defaultScheme);
        const resolvedBandwidth = resolveSeriesBandwidth(s, values, bandwidth, min, max);
        const densityDomain = [min, max];
        const computedDensity = Array.isArray(s.preparedDensity) && s.preparedDensity.length
            ? s.preparedDensity
            : values.length
                ? normalizeDensity(kde(values, densityDomain, { bandwidth: resolvedBandwidth, samples }))
                : [];
        const visible = s.visible !== false && (values.length > 0 || computedDensity.length > 0);
        return {
            id: (_a = s.id) !== null && _a !== void 0 ? _a : i,
            dens: computedDensity,
            color: baseColor,
            name: s.name || `Series ${i + 1}`,
            visible,
            fillOpacity: typeof s.fillOpacity === 'number' ? clamp$1(s.fillOpacity, 0, 1) : 0.35,
            strokeColor: s.strokeColor || baseColor,
            strokeWidth: typeof s.strokeWidth === 'number' ? s.strokeWidth : 1,
            stats: values.length ? computeSeriesStats(values) : null,
            source: s,
            values,
        };
    }), [bandwidth, defaultScheme, max, min, samples, series]);
    const categorySpacing = React.useMemo(() => {
        if (categoryAxisLength <= 0)
            return 0;
        if (seriesCount <= 1) {
            return categoryAxisLength;
        }
        const base = categoryAxisLength / safeSeriesCount;
        return Math.max(1, base * (1 - overlap));
    }, [categoryAxisLength, overlap, safeSeriesCount, seriesCount]);
    const categoryBandwidth = Math.max(1, categorySpacing * widthRatio);
    const categoryCenters = React.useMemo(() => {
        if (categoryAxisLength <= 0 || seriesCount === 0)
            return [];
        if (seriesCount === 1) {
            return [categoryAxisLength / 2];
        }
        const spacing = categorySpacing;
        const totalSpan = spacing * (seriesCount - 1);
        const start = (categoryAxisLength - totalSpan) / 2;
        return series.map((_, index) => start + spacing * index);
    }, [categoryAxisLength, categorySpacing, series, seriesCount]);
    const categoryDomain = React.useMemo(() => series.map((s, i) => s.name || `Series ${i + 1}`), [series]);
    const categoryScale = React.useMemo(() => {
        const domain = categoryDomain;
        const centers = categoryCenters;
        const axisLength = categoryAxisLength;
        const indexMap = new Map(domain.map((label, idx) => [label, idx]));
        const scale = ((value) => {
            var _a, _b, _c;
            if (typeof value === 'number') {
                return (_a = centers[value]) !== null && _a !== void 0 ? _a : ((_b = centers[0]) !== null && _b !== void 0 ? _b : 0);
            }
            const idx = indexMap.get(value);
            return idx != null ? (_c = centers[idx]) !== null && _c !== void 0 ? _c : 0 : 0;
        });
        scale.domain = () => domain.slice();
        scale.range = () => [0, axisLength];
        scale.ticks = () => domain.slice();
        scale.bandwidth = () => categoryBandwidth;
        return scale;
    }, [categoryBandwidth, categoryCenters, categoryDomain, categoryAxisLength]);
    const valueAxisConfig = isHorizontal ? xAxis : yAxis;
    const valueScale = React.useMemo(() => {
        const range = isHorizontal ? [0, valueAxisLength] : [valueAxisLength, 0];
        const scale = linearScale([min, max], range);
        if ((valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks) && valueAxisConfig.ticks.length) {
            const fixedTicks = valueAxisConfig.ticks.slice();
            scale.ticks = () => fixedTicks;
        }
        return scale;
    }, [isHorizontal, min, max, valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks, valueAxisLength]);
    const valueTicks = React.useMemo(() => {
        if (typeof valueScale.ticks === 'function') {
            const tickTarget = Math.min(6, Math.max(3, Math.floor(valueAxisLength / 60)));
            return valueScale.ticks(tickTarget);
        }
        return [];
    }, [valueAxisLength, valueScale]);
    const normalizedCategoryTicks = React.useMemo(() => {
        if (categoryAxisLength <= 0 || !categoryCenters.length)
            return [];
        const denominator = Math.max(1, categoryAxisLength);
        return categoryCenters
            .map((center) => {
            if (!Number.isFinite(center))
                return null;
            const ratio = center / denominator;
            return isHorizontal ? clamp$1(1 - ratio, 0, 1) : clamp$1(ratio, 0, 1);
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [categoryAxisLength, categoryCenters, isHorizontal]);
    const normalizedValueTicks = React.useMemo(() => {
        if (valueAxisLength <= 0)
            return [];
        const denominator = Math.max(1, valueAxisLength);
        return valueTicks
            .map((tick) => {
            const coord = valueScale(tick);
            if (!Number.isFinite(coord))
                return null;
            const ratio = coord / denominator;
            return isHorizontal ? clamp$1(ratio, 0, 1) : clamp$1(1 - ratio, 0, 1);
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [isHorizontal, valueAxisLength, valueScale, valueTicks]);
    const gridXTicks = isHorizontal ? normalizedValueTicks : normalizedCategoryTicks;
    const gridYTicks = isHorizontal ? normalizedCategoryTicks : normalizedValueTicks;
    const axisScaleX = React.useMemo(() => (isHorizontal ? valueScale : categoryScale), [categoryScale, isHorizontal, valueScale]);
    const axisScaleY = React.useMemo(() => (isHorizontal ? categoryScale : valueScale), [categoryScale, isHorizontal, valueScale]);
    const axisTickCountX = React.useMemo(() => {
        if (isHorizontal) {
            if ((valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks) && valueAxisConfig.ticks.length) {
                return valueAxisConfig.ticks.length;
            }
            return Math.max(3, Math.floor(Math.max(1, valueAxisLength) / 60));
        }
        return categoryDomain.length || safeSeriesCount;
    }, [categoryDomain, isHorizontal, safeSeriesCount, valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks, valueAxisLength]);
    const axisTickCountY = React.useMemo(() => {
        if (isHorizontal) {
            return categoryDomain.length || safeSeriesCount;
        }
        if ((valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks) && valueAxisConfig.ticks.length) {
            return valueAxisConfig.ticks.length;
        }
        return Math.max(3, Math.floor(Math.max(1, valueAxisLength) / 60));
    }, [categoryDomain, isHorizontal, safeSeriesCount, valueAxisConfig === null || valueAxisConfig === void 0 ? void 0 : valueAxisConfig.ticks, valueAxisLength]);
    const violinPath = React.useCallback((density, index) => {
        var _a;
        if (!density.length)
            return '';
        const center = (_a = categoryCenters[index]) !== null && _a !== void 0 ? _a : 0;
        const halfThickness = Math.max(1, categoryBandwidth / 2);
        const commands = [];
        if (isHorizontal) {
            density.forEach((point, idx) => {
                const x = valueScale(point.x);
                const y = center - point.y * halfThickness;
                commands.push(`${idx === 0 ? 'M' : 'L'} ${x} ${y}`);
            });
            for (let i = density.length - 1; i >= 0; i -= 1) {
                const point = density[i];
                const x = valueScale(point.x);
                const y = center + point.y * halfThickness;
                commands.push(`L ${x} ${y}`);
            }
        }
        else {
            density.forEach((point, idx) => {
                const x = center + point.y * halfThickness;
                const y = valueScale(point.x);
                commands.push(`${idx === 0 ? 'M' : 'L'} ${x} ${y}`);
            });
            for (let i = density.length - 1; i >= 0; i -= 1) {
                const point = density[i];
                const x = center - point.y * halfThickness;
                const y = valueScale(point.x);
                commands.push(`L ${x} ${y}`);
            }
        }
        commands.push('Z');
        return commands.join(' ');
    }, [categoryBandwidth, categoryCenters, isHorizontal, valueScale]);
    // Prepare registration data for series interaction
    const registrationData = React.useMemo(() => {
        return densData.map((v, i) => ({
            id: `violin-${v.id}`,
            name: v.name || `Series ${i + 1}`,
            color: v.color,
            visible: v.visible,
            densityData: v.dens.map((p, j) => ({
                x: p.x,
                y: p.y,
                categoryIndex: i,
                originalValue: p.x,
            })),
        }));
    }, [densData]);
    // Register series for tooltip interaction
    useViolinSeriesRegistration({
        series: registrationData,
        registerSeries,
    });
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip: true, enableCrosshair: true }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), grid && plotWidth > 0 && plotHeight > 0 && (jsx(ChartGrid, { grid: grid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: gridXTicks, yTicks: gridYTicks, padding: padding, useSVG: true })), jsx(Svg, { width: width, height: height, style: { position: 'absolute' }, 
                // @ts-ignore web
                onMouseMove: (e) => {
                    if (!setPointer)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = e.clientX - rect.left - padding.left;
                    const py = e.clientY - rect.top - padding.top;
                    const insidePlot = px >= 0 && px <= plotWidth && py >= 0 && py <= plotHeight;
                    setPointer({
                        x: px + padding.left,
                        y: py + padding.top,
                        inside: insidePlot,
                        pageX: e.pageX,
                        pageY: e.pageY,
                    });
                    if (!insidePlot || valueAxisLength <= 0) {
                        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
                        return;
                    }
                    const coordinate = clamp$1(isHorizontal ? px : py, 0, valueAxisLength);
                    const value = typeof valueScale.invert === 'function'
                        ? valueScale.invert(coordinate)
                        : min + (coordinate / valueAxisLength) * (max - min || 1);
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: value, pixelX: px + padding.left });
                }, onMouseLeave: () => {
                    setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
                    if ((interaction === null || interaction === void 0 ? void 0 : interaction.pointer) && setPointer) {
                        setPointer({ ...interaction.pointer, inside: false });
                    }
                }, children: jsxs(G, { x: padding.left, y: padding.top, children: [Array.isArray(valueBands) &&
                            valueBands.map((band, bandIndex) => {
                                var _a, _b, _c;
                                if (typeof (band === null || band === void 0 ? void 0 : band.from) !== 'number' || typeof (band === null || band === void 0 ? void 0 : band.to) !== 'number') {
                                    return null;
                                }
                                const fromCoord = valueScale(Number(band.from));
                                const toCoord = valueScale(Number(band.to));
                                const bandColor = band.color || theme.colors.grid;
                                const bandOpacity = clamp$1((_a = band.opacity) !== null && _a !== void 0 ? _a : 0.18, 0, 1);
                                const label = band.label;
                                const labelColor = band.labelColor || theme.colors.textSecondary;
                                if (isHorizontal) {
                                    const xStart = Math.min(fromCoord, toCoord);
                                    const bandWidth = Math.max(1, Math.abs(toCoord - fromCoord));
                                    const labelX = band.labelPosition === 'left'
                                        ? xStart + 6
                                        : xStart + bandWidth - 6;
                                    const textAnchor = band.labelPosition === 'left' ? 'start' : 'end';
                                    const labelY = plotHeight / 2 + theme.fontSize.xs / 2;
                                    return (jsxs(React.Fragment, { children: [jsx(Rect, { x: xStart, y: 0, width: bandWidth, height: plotHeight, fill: bandColor, opacity: bandOpacity }), label && bandWidth > theme.fontSize.xs + 6 && (jsx(Text$1, { x: labelX, y: labelY, fill: labelColor, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: textAnchor, children: label }))] }, (_b = band.id) !== null && _b !== void 0 ? _b : `band-${bandIndex}`));
                                }
                                const yStart = Math.min(fromCoord, toCoord);
                                const bandHeight = Math.max(1, Math.abs(toCoord - fromCoord));
                                const labelX = band.labelPosition === 'left' ? 8 : plotWidth - 8;
                                const textAnchor = band.labelPosition === 'left' ? 'start' : 'end';
                                const labelY = yStart + bandHeight / 2 + theme.fontSize.xs / 2;
                                return (jsxs(React.Fragment, { children: [jsx(Rect, { x: 0, y: yStart, width: plotWidth, height: bandHeight, fill: bandColor, opacity: bandOpacity }), label && bandHeight > theme.fontSize.xs + 4 && (jsx(Text$1, { x: labelX, y: labelY, fill: labelColor, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: textAnchor, children: label }))] }, (_c = band.id) !== null && _c !== void 0 ? _c : `band-${bandIndex}`));
                            }), densData.map((v, i) => (v.visible ? (jsx(AnimatedViolinShape, { path: violinPath(v.dens, i), fill: v.color, fillOpacity: v.fillOpacity, stroke: v.strokeColor, strokeWidth: v.strokeWidth, index: i, totalViolins: densData.length }, v.id)) : null)), showStatsMarkers &&
                            densData.map((v, i) => {
                                var _a, _b, _c, _d, _e;
                                if (!v.visible)
                                    return null;
                                const stats = v.stats;
                                if (!stats)
                                    return null;
                                const markerWidthRatio = clamp$1((_a = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.markerWidthRatio) !== null && _a !== void 0 ? _a : 0.85, 0.2, 1);
                                const strokeWidth = (_b = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.strokeWidth) !== null && _b !== void 0 ? _b : 2;
                                const colors = (_c = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.colors) !== null && _c !== void 0 ? _c : {};
                                const labelOffset = (_d = statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.labelOffset) !== null && _d !== void 0 ? _d : 6;
                                const categoryCenter = (_e = categoryCenters[i]) !== null && _e !== void 0 ? _e : 0;
                                const halfThickness = Math.max(2, (categoryBandwidth * markerWidthRatio) / 2);
                                const formatLabel = (stat, value) => {
                                    const formatted = toFixed(value, 2);
                                    if (!(statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.labelFormatter))
                                        return formatted;
                                    return statsMarkers.labelFormatter({
                                        stat,
                                        value,
                                        series: v.source,
                                        formattedValue: formatted,
                                    });
                                };
                                const createVerticalLabel = (stat, value, anchor, yPosition, color) => {
                                    if (!(statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showLabels))
                                        return null;
                                    const content = formatLabel(stat, value);
                                    const xPosition = anchor === 'start'
                                        ? categoryCenter - halfThickness - labelOffset
                                        : categoryCenter + halfThickness + labelOffset;
                                    return (jsx(Text$1, { x: xPosition, y: yPosition + theme.fontSize.xs / 2, fill: color, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: anchor === 'start' ? 'end' : 'start', children: content }, `${v.id}-${stat}-label`));
                                };
                                const createHorizontalLabel = (stat, value, position, xPosition, color) => {
                                    if (!(statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showLabels))
                                        return null;
                                    const content = formatLabel(stat, value);
                                    const yBase = position === 'top'
                                        ? categoryCenter - halfThickness - labelOffset
                                        : categoryCenter + halfThickness + labelOffset + theme.fontSize.xs;
                                    const y = position === 'top' ? yBase - theme.fontSize.xs * 0.25 : yBase;
                                    return (jsx(Text$1, { x: xPosition, y: y, fill: color, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: "middle", children: content }, `${v.id}-${stat}-label`));
                                };
                                const elements = [];
                                if (isHorizontal) {
                                    const centerY = categoryCenter;
                                    const markerHalfHeight = halfThickness;
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showQuartiles) {
                                        const xQ1 = valueScale(stats.q1);
                                        const xQ3 = valueScale(stats.q3);
                                        const quartileColor = colors.quartile || v.color;
                                        const rectX = Math.min(xQ1, xQ3);
                                        const rectWidth = Math.max(1, Math.abs(xQ3 - xQ1));
                                        const rectY = centerY - markerHalfHeight;
                                        const rectHeight = markerHalfHeight * 2;
                                        elements.push(jsx(Rect, { x: rectX, y: rectY, width: rectWidth, height: rectHeight, fill: quartileColor, opacity: 0.18 }, `${v.id}-iqr`));
                                        elements.push(jsx(Line, { x1: xQ1, x2: xQ1, y1: centerY - markerHalfHeight, y2: centerY + markerHalfHeight, stroke: quartileColor, strokeWidth: strokeWidth }, `${v.id}-q1`));
                                        elements.push(jsx(Line, { x1: xQ3, x2: xQ3, y1: centerY - markerHalfHeight, y2: centerY + markerHalfHeight, stroke: quartileColor, strokeWidth: strokeWidth }, `${v.id}-q3`));
                                        const labelColor = colors.quartile || theme.colors.textSecondary;
                                        const midX = (Math.min(xQ1, xQ3) + Math.max(xQ1, xQ3)) / 2;
                                        const labelQ1 = createHorizontalLabel('q1', stats.q1, 'top', xQ1, labelColor);
                                        if (labelQ1)
                                            elements.push(labelQ1);
                                        const labelQ3 = createHorizontalLabel('q3', stats.q3, 'bottom', xQ3, labelColor);
                                        if (labelQ3)
                                            elements.push(labelQ3);
                                        if (statsMarkers.showLabels) {
                                            elements.push(jsx(Text$1, { x: midX, y: centerY + theme.fontSize.xs / 2, fill: labelColor, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: "middle", children: "IQR" }, `${v.id}-iqr-label`));
                                        }
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMedian) {
                                        const xMedian = valueScale(stats.median);
                                        const medianColor = colors.median || theme.colors.textPrimary;
                                        elements.push(jsx(Line, { x1: xMedian, x2: xMedian, y1: centerY - markerHalfHeight, y2: centerY + markerHalfHeight, stroke: medianColor, strokeWidth: strokeWidth + 0.5 }, `${v.id}-median`));
                                        const label = createHorizontalLabel('median', stats.median, 'bottom', xMedian, medianColor);
                                        if (label)
                                            elements.push(label);
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMean) {
                                        const xMean = valueScale(stats.mean);
                                        const meanColor = colors.mean || theme.colors.textSecondary;
                                        elements.push(jsx(Line, { x1: xMean, x2: xMean, y1: centerY - markerHalfHeight, y2: centerY + markerHalfHeight, stroke: meanColor, strokeWidth: strokeWidth, strokeDasharray: "4 4" }, `${v.id}-mean`));
                                        const label = createHorizontalLabel('mean', stats.mean, 'top', xMean, meanColor);
                                        if (label)
                                            elements.push(label);
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showWhiskers) {
                                        const whiskerColor = colors.whisker || theme.colors.grid;
                                        const xMin = valueScale(stats.min);
                                        const xMax = valueScale(stats.max);
                                        const crossbarHeight = markerHalfHeight * 0.6;
                                        const whiskerStroke = Math.max(0.7, strokeWidth - 0.5);
                                        elements.push(jsx(Line, { x1: Math.min(xMin, xMax), x2: Math.max(xMin, xMax), y1: centerY, y2: centerY, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-line`));
                                        elements.push(jsx(Line, { x1: xMin, x2: xMin, y1: centerY - crossbarHeight / 2, y2: centerY + crossbarHeight / 2, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-min`));
                                        elements.push(jsx(Line, { x1: xMax, x2: xMax, y1: centerY - crossbarHeight / 2, y2: centerY + crossbarHeight / 2, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-max`));
                                        const minLabel = createHorizontalLabel('whisker-min', stats.min, 'top', xMin, whiskerColor);
                                        if (minLabel)
                                            elements.push(minLabel);
                                        const maxLabel = createHorizontalLabel('whisker-max', stats.max, 'bottom', xMax, whiskerColor);
                                        if (maxLabel)
                                            elements.push(maxLabel);
                                    }
                                }
                                else {
                                    const centerX = categoryCenter;
                                    const markerHalfWidth = halfThickness;
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showQuartiles) {
                                        const yQ1 = valueScale(stats.q1);
                                        const yQ3 = valueScale(stats.q3);
                                        const quartileColor = colors.quartile || v.color;
                                        elements.push(jsx(Rect, { x: centerX - markerHalfWidth, y: Math.min(yQ1, yQ3), width: markerHalfWidth * 2, height: Math.max(1, Math.abs(yQ3 - yQ1)), fill: quartileColor, opacity: 0.18 }, `${v.id}-iqr`));
                                        elements.push(jsx(Line, { x1: centerX - markerHalfWidth, x2: centerX + markerHalfWidth, y1: yQ1, y2: yQ1, stroke: quartileColor, strokeWidth: strokeWidth }, `${v.id}-q1`));
                                        elements.push(jsx(Line, { x1: centerX - markerHalfWidth, x2: centerX + markerHalfWidth, y1: yQ3, y2: yQ3, stroke: quartileColor, strokeWidth: strokeWidth }, `${v.id}-q3`));
                                        const labelColor = colors.quartile || theme.colors.textSecondary;
                                        const middle = (Math.min(yQ1, yQ3) + Math.max(yQ1, yQ3)) / 2;
                                        const labelQ1 = createVerticalLabel('q1', stats.q1, 'start', yQ1, labelColor);
                                        if (labelQ1)
                                            elements.push(labelQ1);
                                        const labelQ3 = createVerticalLabel('q3', stats.q3, 'end', yQ3, labelColor);
                                        if (labelQ3)
                                            elements.push(labelQ3);
                                        if (statsMarkers.showLabels) {
                                            elements.push(jsx(Text$1, { x: centerX, y: middle + theme.fontSize.xs / 2, fill: labelColor, fontSize: theme.fontSize.xs, fontFamily: theme.fontFamily, textAnchor: "middle", children: "IQR" }, `${v.id}-iqr-label`));
                                        }
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMedian) {
                                        const yMedian = valueScale(stats.median);
                                        const medianColor = colors.median || theme.colors.textPrimary;
                                        elements.push(jsx(Line, { x1: centerX - markerHalfWidth, x2: centerX + markerHalfWidth, y1: yMedian, y2: yMedian, stroke: medianColor, strokeWidth: strokeWidth + 0.5 }, `${v.id}-median`));
                                        const label = createVerticalLabel('median', stats.median, 'end', yMedian, medianColor);
                                        if (label)
                                            elements.push(label);
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showMean) {
                                        const yMean = valueScale(stats.mean);
                                        const meanColor = colors.mean || theme.colors.textSecondary;
                                        elements.push(jsx(Line, { x1: centerX - markerHalfWidth, x2: centerX + markerHalfWidth, y1: yMean, y2: yMean, stroke: meanColor, strokeWidth: strokeWidth, strokeDasharray: "4 4" }, `${v.id}-mean`));
                                        const label = createVerticalLabel('mean', stats.mean, 'start', yMean, meanColor);
                                        if (label)
                                            elements.push(label);
                                    }
                                    if (statsMarkers === null || statsMarkers === void 0 ? void 0 : statsMarkers.showWhiskers) {
                                        const whiskerColor = colors.whisker || theme.colors.grid;
                                        const yMin = valueScale(stats.min);
                                        const yMax = valueScale(stats.max);
                                        const crossbarWidth = markerHalfWidth * 0.6;
                                        const whiskerStroke = Math.max(0.7, strokeWidth - 0.5);
                                        elements.push(jsx(Line, { x1: centerX, x2: centerX, y1: yMin, y2: yMax, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-line`));
                                        elements.push(jsx(Line, { x1: centerX - crossbarWidth / 2, x2: centerX + crossbarWidth / 2, y1: yMin, y2: yMin, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-min`));
                                        elements.push(jsx(Line, { x1: centerX - crossbarWidth / 2, x2: centerX + crossbarWidth / 2, y1: yMax, y2: yMax, stroke: whiskerColor, strokeWidth: whiskerStroke }, `${v.id}-whisker-max`));
                                        const minLabel = createVerticalLabel('whisker-min', stats.min, 'start', yMin, whiskerColor);
                                        if (minLabel)
                                            elements.push(minLabel);
                                        const maxLabel = createVerticalLabel('whisker-max', stats.max, 'end', yMax, whiskerColor);
                                        if (maxLabel)
                                            elements.push(maxLabel);
                                    }
                                }
                                return elements;
                            })] }) }), (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: axisScaleX, orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: axisTickCountX, tickSize: (_a = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _a !== void 0 ? _a : 4, tickPadding: 4, tickFormat: (value) => {
                    if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter)
                        return xAxis.labelFormatter(value);
                    if (isHorizontal && typeof value === 'number') {
                        return formatNumber$2(value);
                    }
                    return String(value);
                }, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _b !== void 0 ? _b : 1, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _c !== void 0 ? _c : 12) + 20 : 30, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize, style: { width: plotWidth, height: padding.bottom } })), (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: axisScaleY, orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: axisTickCountY, tickSize: (_d = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _d !== void 0 ? _d : 4, tickPadding: 4, tickFormat: (value) => {
                    if (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter)
                        return yAxis.labelFormatter(value);
                    if (!isHorizontal && typeof value === 'number') {
                        return formatNumber$2(value);
                    }
                    return String(value);
                }, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _e !== void 0 ? _e : 1, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _f !== void 0 ? _f : 12) + 20 : 30, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, style: { width: padding.left, height: plotHeight } }))] }));
};
ViolinChart.displayName = 'ViolinChart';

const AnimatedPath = Animated$1.createAnimatedComponent(Path);
const AnimatedRect$1 = Animated$1.createAnimatedComponent(Rect);
const AnimatedSankeyNode = React.memo(({ node, nodeWidth, animationProgress, index, dataSignature, disabled, theme, onHover, onHoverOut, highlightAlpha, chartWidth, padding, }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const delay = index * 0.1;
        const nodeProgress = Math.max(0, Math.min(1, (progress - delay) / 0.3));
        return {
            opacity: nodeProgress * highlightAlpha,
            height: node.height * nodeProgress,
            y: node.y + (node.height * (1 - nodeProgress)) / 2,
        };
    }, [index, node.height, node.y, dataSignature, highlightAlpha]);
    const isWeb = Platform.OS === 'web';
    const valueLabel = node.valueLabel;
    const showInnerName = node.height > 20 && !!node.label;
    const showInnerValue = node.height > 34 && !!valueLabel;
    const approxLabelWidth = valueLabel ? valueLabel.length * 6.2 : 0;
    const fitsRight = valueLabel
        ? node.x + nodeWidth + 8 + approxLabelWidth <= chartWidth - padding.right
        : true;
    const outsideX = fitsRight ? node.x + nodeWidth + 8 : Math.max(padding.left, node.x - 8);
    const outsideAnchor = fitsRight ? 'start' : 'end';
    return (jsxs(G, { children: [jsx(AnimatedRect$1, { animatedProps: animatedProps, x: node.x, width: nodeWidth, fill: node.color, rx: 2, stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, ...(isWeb
                    ? {
                        // @ts-ignore web-specific pointer events
                        onPointerEnter: onHover,
                        onPointerLeave: onHoverOut,
                    }
                    : {
                        onPressIn: onHover,
                        onPressOut: onHoverOut,
                    }) }), showInnerName && (jsx(Text$1, { x: node.x + nodeWidth / 2, y: node.y + node.height / 2 - (showInnerValue ? 6 : 0), fontSize: Math.min(10, node.height / 2), fill: "#ffffff", fontFamily: theme.fontFamily, textAnchor: "middle", alignmentBaseline: "central", children: node.label.length > 12 ? `${node.label.slice(0, 10)}…` : node.label })), showInnerValue && (jsx(Text$1, { x: node.x + nodeWidth / 2, y: node.y + node.height / 2 + 10, fontSize: Math.min(10, node.height / 2), fill: "rgba(255,255,255,0.9)", fontFamily: theme.fontFamily, textAnchor: "middle", alignmentBaseline: "central", children: valueLabel })), !showInnerValue && valueLabel && (jsx(Text$1, { x: outsideX, y: node.y + node.height / 2, fontSize: 10, fill: theme.colors.textSecondary, fontFamily: theme.fontFamily, textAnchor: outsideAnchor, alignmentBaseline: "central", children: valueLabel }))] }));
});
AnimatedSankeyNode.displayName = 'AnimatedSankeyNode';
const AnimatedSankeyLink = React.memo(({ link, animationProgress, index, dataSignature, disabled, onHover, onHoverOut, highlightAlpha, }) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = animationProgress.value;
        const delay = 0.3 + (index * 0.05); // Links animate after nodes
        const linkProgress = Math.max(0, Math.min(1, (progress - delay) / 0.4));
        return {
            opacity: linkProgress * 0.6 * highlightAlpha,
            strokeWidth: link.thickness * linkProgress,
        };
    }, [index, link.thickness, dataSignature, highlightAlpha]);
    const isWeb = Platform.OS === 'web';
    const valueLabel = Number.isFinite(link.value) ? link.value.toLocaleString() : '';
    const accessibilityLabel = valueLabel
        ? `${link.source} → ${link.target}: ${valueLabel}`
        : `${link.source} → ${link.target}`;
    return (jsx(AnimatedPath, { animatedProps: animatedProps, d: link.path, stroke: link.color, fill: "none", 
        // strokeLinecap="round"
        accessibilityLabel: accessibilityLabel, ...(!isWeb && { accessible: true }), ...(isWeb
            ? {
                // @ts-ignore web-specific pointer events
                onPointerEnter: onHover,
                onPointerLeave: onHoverOut,
                role: 'graphics-symbol',
                'aria-label': accessibilityLabel,
            }
            : {
                onPressIn: onHover,
                onPressOut: onHoverOut,
            }) }));
});
AnimatedSankeyLink.displayName = 'AnimatedSankeyLink';
const SankeyChart = (props) => {
    const { width = 600, height = 400, nodes, links, title, subtitle, style, animationDuration = 1000, disabled = false, nodeWidth: nodeWidthProp, nodePadding: nodePaddingProp, chartPadding, labelFormatter, valueFormatter, onNodeHover, onLinkHover, highlightOnHover = true, onDataInconsistency, } = props;
    const theme = useChartTheme();
    // Animation state
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    // Data signature for memoization
    const dataSignature = React.useMemo(() => {
        return JSON.stringify({
            nodes: nodes === null || nodes === void 0 ? void 0 : nodes.map(n => ({ id: n.id, value: n.value })),
            links: links === null || links === void 0 ? void 0 : links.map(l => ({ source: l.source, target: l.target, value: l.value }))
        });
    }, [nodes, links]);
    // Start animation when data changes
    React.useEffect(() => {
        if (disabled)
            return;
        animationProgress.value = 0;
        animationProgress.value = withDelay(100, withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        }));
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    // Defensive programming: handle empty data
    if (!nodes || nodes.length === 0) {
        return (jsxs(ChartContainer, { width: width, height: height, style: style, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(View, { style: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }, children: jsx(Text, { style: { color: theme.colors.textSecondary, fontSize: 12 }, children: "No nodes provided" }) })] }));
    }
    if (!links || links.length === 0) {
        return (jsxs(ChartContainer, { width: width, height: height, style: style, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(View, { style: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }, children: jsx(Text, { style: { color: theme.colors.textSecondary, fontSize: 12 }, children: "No links provided" }) })] }));
    }
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_a) {
        // Interaction context is optional
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const rawNodeMap = React.useMemo(() => {
        const map = new Map();
        nodes.forEach(node => map.set(node.id, node));
        return map;
    }, [nodes]);
    const formatLabel = React.useCallback((nodeId) => {
        var _a;
        const raw = rawNodeMap.get(nodeId);
        if (raw && labelFormatter) {
            const formatted = labelFormatter(raw);
            if (formatted)
                return formatted;
        }
        if (raw === null || raw === void 0 ? void 0 : raw.name)
            return raw.name;
        return (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : nodeId;
    }, [labelFormatter, rawNodeMap]);
    const formatValueLabel = React.useCallback((nodeId, value) => {
        const raw = rawNodeMap.get(nodeId);
        if (valueFormatter) {
            const formatted = valueFormatter(value, raw);
            if (formatted !== undefined && formatted !== null)
                return formatted;
        }
        return Number.isFinite(value) ? value.toLocaleString() : '';
    }, [valueFormatter, rawNodeMap]);
    const resolvedPadding = React.useMemo(() => {
        var _a, _b, _c, _d;
        return ({
            top: (_a = chartPadding === null || chartPadding === void 0 ? void 0 : chartPadding.top) !== null && _a !== void 0 ? _a : 40,
            right: (_b = chartPadding === null || chartPadding === void 0 ? void 0 : chartPadding.right) !== null && _b !== void 0 ? _b : 40,
            bottom: (_c = chartPadding === null || chartPadding === void 0 ? void 0 : chartPadding.bottom) !== null && _c !== void 0 ? _c : 40,
            left: (_d = chartPadding === null || chartPadding === void 0 ? void 0 : chartPadding.left) !== null && _d !== void 0 ? _d : 40,
        });
    }, [chartPadding]);
    const layout = React.useMemo(() => {
        const idSet = new Set(nodes.map(node => node.id));
        const outgoing = {};
        const incoming = {};
        links.forEach(link => {
            var _a, _b;
            if (!idSet.has(link.source) || !idSet.has(link.target))
                return;
            (outgoing[_a = link.source] || (outgoing[_a] = [])).push(link.target);
            (incoming[_b = link.target] || (incoming[_b] = [])).push(link.source);
        });
        const layer = {};
        const queue = [];
        nodes.forEach(node => {
            if (!incoming[node.id]) {
                layer[node.id] = 0;
                queue.push(node.id);
            }
        });
        while (queue.length) {
            const current = queue.shift();
            (outgoing[current] || []).forEach(target => {
                var _a;
                const candidate = ((_a = layer[current]) !== null && _a !== void 0 ? _a : 0) + 1;
                if (layer[target] == null || candidate > layer[target]) {
                    layer[target] = candidate;
                    queue.push(target);
                }
            });
        }
        nodes.forEach(node => {
            if (layer[node.id] == null)
                layer[node.id] = 0;
        });
        const maxLayer = Math.max(0, ...Object.values(layer));
        const layerCount = maxLayer + 1;
        const nodeAgg = {};
        nodes.forEach(node => {
            var _a;
            nodeAgg[node.id] = { in: 0, out: 0, value: (_a = node.value) !== null && _a !== void 0 ? _a : 0 };
        });
        links.forEach(link => {
            if (!nodeAgg[link.source] || !nodeAgg[link.target])
                return;
            nodeAgg[link.source].out += link.value;
            nodeAgg[link.target].in += link.value;
        });
        const inconsistencies = [];
        Object.entries(nodeAgg).forEach(([id, agg]) => {
            agg.value = Math.max(agg.value, agg.in, agg.out, 1e-9);
            if (Math.abs(agg.in - agg.out) > 1e-6) {
                inconsistencies.push({ nodeId: id, inbound: agg.in, outbound: agg.out });
            }
        });
        const plotW = Math.max(1, width - resolvedPadding.left - resolvedPadding.right);
        const plotH = Math.max(1, height - resolvedPadding.top - resolvedPadding.bottom);
        const autoNodeWidth = Math.min(40, Math.max(8, plotW * 0.08));
        const resolvedNodeWidth = Math.max(6, Math.min(nodeWidthProp !== null && nodeWidthProp !== void 0 ? nodeWidthProp : autoNodeWidth, plotW * 0.25));
        const resolvedNodePadding = Math.max(4, nodePaddingProp !== null && nodePaddingProp !== void 0 ? nodePaddingProp : Math.max(8, plotH * 0.02));
        const layerNodes = {};
        nodes.forEach((node, index) => {
            const layerIndex = layer[node.id];
            const color = node.color || getColorFromScheme(index, colorSchemes.default);
            const internalNode = {
                id: node.id,
                label: formatLabel(node.id),
                layer: layerIndex,
                in: nodeAgg[node.id].in,
                out: nodeAgg[node.id].out,
                value: nodeAgg[node.id].value,
                color,
                x: 0,
                y: 0,
                height: 0,
                valueLabel: '',
                raw: rawNodeMap.get(node.id),
            };
            (layerNodes[layerIndex] || (layerNodes[layerIndex] = [])).push(internalNode);
        });
        const colW = layerCount > 1 ? (plotW - resolvedNodeWidth) / (layerCount - 1) : 0;
        const maxLayerTotal = Math.max(1, ...Object.values(layerNodes).map(list => list.reduce((sum, node) => sum + node.value, 0)));
        const maxLayerNodeCount = Math.max(1, ...Object.values(layerNodes).map(list => list.length));
        const gapUpperBound = maxLayerNodeCount > 1
            ? Math.max(2, (plotH / (maxLayerNodeCount - 1)) * 0.6)
            : resolvedNodePadding;
        const globalGap = Math.min(resolvedNodePadding, gapUpperBound);
        const globalAvailableHeight = Math.max(1, plotH - globalGap * Math.max(0, maxLayerNodeCount - 1));
        const minNodeHeightGlobal = Math.max(1.5, Math.min(6, globalAvailableHeight / maxLayerNodeCount));
        const globalUnit = globalAvailableHeight / maxLayerTotal;
        Object.entries(layerNodes).forEach(([layerIndexStr, list]) => {
            const layerIndex = Number(layerIndexStr);
            const totalValue = list.reduce((sum, node) => sum + node.value, 0);
            const totalGap = globalGap * Math.max(0, list.length - 1);
            const layerHeight = totalValue * globalUnit + totalGap;
            const offsetY = resolvedPadding.top + Math.max(0, (plotH - layerHeight) / 2);
            let cursor = offsetY;
            list.sort((a, b) => b.value - a.value);
            const layerAvailableHeight = Math.max(1, plotH - globalGap * Math.max(0, list.length - 1));
            const layerMinHeight = Math.max(1.5, Math.min(minNodeHeightGlobal, layerAvailableHeight / Math.max(1, list.length)));
            list.forEach(node => {
                node.height = Math.max(layerMinHeight, node.value * globalUnit);
                node.x = resolvedPadding.left + (layerCount > 1 ? layerIndex * colW : (plotW - resolvedNodeWidth) / 2);
                node.y = cursor;
                node.valueLabel = formatValueLabel(node.id, node.value);
                cursor += node.height + globalGap;
            });
        });
        const internalNodes = Object.values(layerNodes).flat();
        const nodeIndex = {};
        internalNodes.forEach(node => {
            nodeIndex[node.id] = node;
        });
        const sourceOffset = {};
        const targetOffset = {};
        internalNodes.forEach(node => {
            const agg = nodeAgg[node.id];
            const outgoingThickness = agg.out * globalUnit;
            const incomingThickness = agg.in * globalUnit;
            sourceOffset[node.id] = Math.max(0, (node.height - outgoingThickness) / 2);
            targetOffset[node.id] = Math.max(0, (node.height - incomingThickness) / 2);
        });
        const internalLinks = [];
        links.forEach((link, index) => {
            var _a, _b;
            const sourceNode = nodeIndex[link.source];
            const targetNode = nodeIndex[link.target];
            if (!sourceNode || !targetNode)
                return;
            if (!(link.value > 0))
                return;
            const thickness = link.value * globalUnit;
            const sourceOffsetValue = (_a = sourceOffset[sourceNode.id]) !== null && _a !== void 0 ? _a : 0;
            const targetOffsetValue = (_b = targetOffset[targetNode.id]) !== null && _b !== void 0 ? _b : 0;
            const sy = sourceNode.y + sourceOffsetValue + thickness / 2;
            const ty = targetNode.y + targetOffsetValue + thickness / 2;
            sourceOffset[sourceNode.id] = sourceOffsetValue + thickness;
            targetOffset[targetNode.id] = targetOffsetValue + thickness;
            const x0 = sourceNode.x + resolvedNodeWidth;
            const x1 = targetNode.x;
            const dx = x1 - x0;
            const mx = x0 + dx * 0.5;
            const path = dx > 0
                ? `M ${x0} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${x1} ${ty}`
                : `M ${x0} ${sy} Q ${x0 + 20} ${(sy + ty) / 2} ${x1} ${ty}`;
            internalLinks.push({
                key: `${link.source}->${link.target}-${index}`,
                source: sourceNode.id,
                target: targetNode.id,
                value: link.value,
                color: link.color || sourceNode.color,
                path,
                sy,
                ty,
                thickness,
                raw: link,
            });
        });
        return {
            internalNodes,
            internalLinks,
            layerCount,
            nodeAgg,
            padding: resolvedPadding,
            plotW,
            plotH,
            nodeWidth: resolvedNodeWidth,
            nodePadding: globalGap,
            inconsistencies,
        };
    }, [nodes, links, width, height, resolvedPadding, nodeWidthProp, nodePaddingProp, rawNodeMap, formatLabel, formatValueLabel]);
    const { internalNodes, internalLinks, nodeWidth: resolvedNodeWidth, inconsistencies, padding } = layout;
    React.useEffect(() => {
        if (!onDataInconsistency)
            return;
        onDataInconsistency(inconsistencies);
    }, [inconsistencies, onDataInconsistency]);
    const [hoveredNodeId, setHoveredNodeId] = React.useState(null);
    const [hoveredLinkKey, setHoveredLinkKey] = React.useState(null);
    const highlightEnabled = highlightOnHover !== false;
    const linkByKey = React.useMemo(() => {
        const map = new Map();
        internalLinks.forEach(link => map.set(link.key, link));
        return map;
    }, [internalLinks]);
    const activeNodeIds = React.useMemo(() => {
        if (!highlightEnabled)
            return null;
        if (hoveredNodeId) {
            const set = new Set([hoveredNodeId]);
            internalLinks.forEach(link => {
                if (link.source === hoveredNodeId || link.target === hoveredNodeId) {
                    set.add(link.source);
                    set.add(link.target);
                }
            });
            return set;
        }
        if (hoveredLinkKey) {
            const link = linkByKey.get(hoveredLinkKey);
            if (link) {
                return new Set([link.source, link.target]);
            }
        }
        return null;
    }, [highlightEnabled, hoveredNodeId, hoveredLinkKey, internalLinks, linkByKey]);
    const activeLinkKeys = React.useMemo(() => {
        if (!highlightEnabled)
            return null;
        if (hoveredNodeId) {
            return new Set(internalLinks
                .filter(link => link.source === hoveredNodeId || link.target === hoveredNodeId)
                .map(link => link.key));
        }
        if (hoveredLinkKey) {
            return new Set([hoveredLinkKey]);
        }
        return null;
    }, [highlightEnabled, hoveredNodeId, hoveredLinkKey, internalLinks]);
    const resolveNodeAlpha = React.useCallback((nodeId) => {
        if (!highlightEnabled || !activeNodeIds)
            return 1;
        return activeNodeIds.has(nodeId) ? 1 : 0.3;
    }, [highlightEnabled, activeNodeIds]);
    const resolveLinkAlpha = React.useCallback((key) => {
        if (!highlightEnabled || !activeLinkKeys)
            return 1;
        return activeLinkKeys.has(key) ? 1 : 0.25;
    }, [highlightEnabled, activeLinkKeys]);
    const handleNodeHover = React.useCallback((id) => {
        var _a;
        if (highlightEnabled) {
            setHoveredNodeId(id);
            if (id !== null)
                setHoveredLinkKey(null);
        }
        if (onNodeHover) {
            onNodeHover(id ? (_a = rawNodeMap.get(id)) !== null && _a !== void 0 ? _a : null : null);
        }
    }, [highlightEnabled, onNodeHover, rawNodeMap]);
    const handleLinkHover = React.useCallback((key) => {
        var _a, _b;
        if (highlightEnabled) {
            setHoveredLinkKey(key);
            if (key !== null)
                setHoveredNodeId(null);
        }
        if (onLinkHover) {
            onLinkHover(key ? (_b = (_a = linkByKey.get(key)) === null || _a === void 0 ? void 0 : _a.raw) !== null && _b !== void 0 ? _b : null : null);
        }
    }, [highlightEnabled, onLinkHover, linkByKey]);
    const clearHover = React.useCallback(() => {
        handleNodeHover(null);
        handleLinkHover(null);
    }, [handleNodeHover, handleLinkHover]);
    // Memoized series registration for node groups and tooltips
    const seriesRegistration = React.useMemo(() => {
        if (!registerSeries)
            return null;
        return {
            id: 'sankey-nodes',
            name: 'Nodes',
            color: theme.colors.accentPalette[0],
            points: internalNodes.map(n => ({
                x: n.layer,
                y: n.value,
                meta: {
                    id: n.id,
                    label: n.label,
                    inbound: n.in,
                    outbound: n.out,
                    value: n.value,
                    rawNode: n.raw,
                },
            })),
            visible: true,
        };
    }, [internalNodes, theme.colors.accentPalette, registerSeries]);
    React.useEffect(() => {
        if (seriesRegistration && registerSeries) {
            registerSeries(seriesRegistration);
        }
    }, [seriesRegistration, registerSeries]);
    return (jsxs(ChartContainer, { width: width, height: height, style: style, interactionConfig: { multiTooltip: true }, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(Svg, { width: width, height: height, style: { position: 'absolute', left: 0, top: 0 }, 
                // @ts-ignore web
                onMouseMove: (e) => {
                    if (!setPointer)
                        return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = e.clientX - rect.left;
                    const py = e.clientY - rect.top;
                    setPointer({ x: px, y: py, inside: true, pageX: e.pageX, pageY: e.pageY });
                }, 
                // @ts-ignore web
                onMouseLeave: () => {
                    clearHover();
                    setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: 0, y: 0, inside: false });
                }, children: jsxs(G, { children: [internalLinks.map((l, i) => (jsx(AnimatedSankeyLink, { link: l, animationProgress: animationProgress, index: i, dataSignature: dataSignature, disabled: disabled, highlightAlpha: resolveLinkAlpha(l.key), onHover: () => handleLinkHover(l.key), onHoverOut: () => handleLinkHover(null) }, l.key))), internalNodes.map((n, i) => (jsx(AnimatedSankeyNode, { node: n, nodeWidth: resolvedNodeWidth, animationProgress: animationProgress, index: i, dataSignature: dataSignature, disabled: disabled, theme: theme, onHover: () => handleNodeHover(n.id), onHoverOut: () => handleNodeHover(null), highlightAlpha: resolveNodeAlpha(n.id), chartWidth: width, padding: { left: padding.left, right: padding.right } }, n.id)))] }) }), internalNodes.length === 0 && (jsx(View, { style: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }, children: jsx(Text, { style: { color: theme.colors.textSecondary, fontSize: 12 }, children: "No data" }) }))] }));
};
SankeyChart.displayName = 'SankeyChart';

const AnimatedCircle$1 = Animated$1.createAnimatedComponent(Circle);
const DEFAULT_PADDING$1 = { top: 80, right: 48, bottom: 88, left: 48 };
const DEFAULT_RING_GAP = 8;
const DEFAULT_LABEL_MIN_ANGLE = 6;
const DEFAULT_LABEL_OFFSET = 24;
const DEFAULT_LABEL_LEADER_LENGTH = 12;
const ANGLE_EPSILON = 0.0001;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const sliceToDetails = (slice) => {
    var _a;
    return ({
        id: (_a = slice.baseId) !== null && _a !== void 0 ? _a : slice.id,
        label: slice.label,
        value: slice.value,
        color: slice.color,
        data: slice.data,
        ringId: slice.ringId,
        ringIndex: slice.ringIndex,
        ringLabel: slice.ringLabel,
        percentage: slice.anglePercentage,
    });
};
const DonutCenterContent = React.memo(({ label, value, subLabel, percentage, theme }) => (jsxs(View, { style: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }, children: [label ? (jsx(Text, { style: {
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginBottom: 2,
            }, children: label })) : null, jsx(Text, { style: {
                fontSize: theme.fontSize.lg + 8,
                fontWeight: '700',
                color: theme.colors.textPrimary,
            }, children: value }), subLabel ? (jsx(Text, { style: {
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                marginTop: 4,
            }, children: subLabel })) : null, percentage ? (jsx(Text, { style: {
                fontSize: theme.fontSize.xs,
                color: theme.colors.textSecondary,
                marginTop: 2,
            }, children: percentage })) : null] })));
DonutCenterContent.displayName = 'DonutChart.CenterContent';
const DonutChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { data, rings, ringGap: ringGapProp, primaryRingIndex = 0, legendRingIndex: legendRingIndexProp, inheritColorByLabel = true, size = 280, width: widthProp, height: heightProp, innerRadiusRatio = 0.55, thickness, padAngle = 1.5, startAngle = -90, endAngle = 270, legend, animation, centerLabel, centerSubLabel, centerValueFormatter, renderCenterContent, emptyLabel = 'No data', padding: paddingProp, disabled = false, animationDuration = 800, style, title, subtitle, onPress, onDataPointPress, isolateOnClick = false, labels: labelsConfigProp, ...rest } = props;
    const dataset = data !== null && data !== void 0 ? data : [];
    const resolvedRingsProp = Array.isArray(rings) ? rings.filter(Boolean) : [];
    const hasCustomRings = resolvedRingsProp.length > 0;
    const theme = useChartTheme();
    const padding = useMemo(() => paddingProp !== null && paddingProp !== void 0 ? paddingProp : DEFAULT_PADDING$1, [paddingProp]);
    const width = widthProp !== null && widthProp !== void 0 ? widthProp : (size + padding.left + padding.right);
    const height = heightProp !== null && heightProp !== void 0 ? heightProp : (size + padding.top + padding.bottom);
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const centerX = plotWidth / 2;
    const centerY = plotHeight / 2;
    const maxRadius = Math.max(0, Math.min(plotWidth, plotHeight) / 2);
    const outerRadius = maxRadius;
    const baseInnerRadius = thickness != null && !hasCustomRings
        ? Math.max(0, outerRadius - thickness)
        : outerRadius * clamp(innerRadiusRatio, 0.05, 0.95);
    const resolvedRingGap = hasCustomRings ? Math.max(0, ringGapProp !== null && ringGapProp !== void 0 ? ringGapProp : DEFAULT_RING_GAP) : 0;
    const colorAssigner = useMemo(() => createColorAssigner(), []);
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_h) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const interactionSeries = interaction === null || interaction === void 0 ? void 0 : interaction.series;
    const ringStates = useMemo(() => {
        const baseRings = hasCustomRings
            ? resolvedRingsProp
            : [
                {
                    id: 'primary',
                    data: dataset,
                    padAngle,
                    startAngle,
                    endAngle,
                    showInLegend: true,
                },
            ];
        const derived = [];
        const colorCache = inheritColorByLabel ? new Map() : null;
        let colorIndexCursor = 0;
        let cursorOuterRadius = outerRadius;
        let globalSliceIndex = 0;
        baseRings.forEach((ringConfig, ringIndex) => {
            var _a, _b, _c, _d, _e, _f;
            const ringId = String((_a = ringConfig.id) !== null && _a !== void 0 ? _a : ringIndex);
            const ringPadAngle = (_b = ringConfig.padAngle) !== null && _b !== void 0 ? _b : padAngle;
            const ringStartAngle = (_c = ringConfig.startAngle) !== null && _c !== void 0 ? _c : startAngle;
            const ringEndAngle = (_d = ringConfig.endAngle) !== null && _d !== void 0 ? _d : endAngle;
            const ringData = ((_e = ringConfig.data) !== null && _e !== void 0 ? _e : []);
            const isLastRing = ringIndex === baseRings.length - 1;
            let targetInnerRadius = null;
            if (typeof ringConfig.innerRadiusRatio === 'number') {
                targetInnerRadius = outerRadius * clamp(ringConfig.innerRadiusRatio, 0.05, 0.99);
            }
            else if (typeof ringConfig.thickness === 'number') {
                targetInnerRadius = cursorOuterRadius - ringConfig.thickness;
            }
            else if (typeof ringConfig.thicknessRatio === 'number') {
                targetInnerRadius = cursorOuterRadius - outerRadius * clamp(ringConfig.thicknessRatio, 0, 1);
            }
            const ringsRemaining = baseRings.length - ringIndex;
            if (targetInnerRadius == null) {
                const remainingGaps = Math.max(ringsRemaining - 1, 0) * resolvedRingGap;
                const remainingSpace = cursorOuterRadius - baseInnerRadius;
                const autoThickness = ringsRemaining > 0 ? Math.max(0, (remainingSpace - remainingGaps) / ringsRemaining) : 0;
                targetInnerRadius = cursorOuterRadius - autoThickness;
            }
            let ringInnerRadius = Math.max(baseInnerRadius, targetInnerRadius);
            ringInnerRadius = Math.min(ringInnerRadius, cursorOuterRadius - 0.5);
            const ringOuterRadius = Math.max(ringInnerRadius, cursorOuterRadius);
            const baseResolved = ringData.map((datum, datumIndex) => {
                var _a, _b, _c, _d, _e;
                const baseId = (_b = (_a = datum.id) !== null && _a !== void 0 ? _a : datum.label) !== null && _b !== void 0 ? _b : datumIndex;
                const uniqueId = `${ringId}:${baseId}`;
                const registryEntry = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((series) => String(series.id) === uniqueId);
                const visible = registryEntry ? registryEntry.visible !== false : true;
                const colorKey = inheritColorByLabel && ((_c = datum.id) !== null && _c !== void 0 ? _c : datum.label) != null ? String((_d = datum.id) !== null && _d !== void 0 ? _d : datum.label) : null;
                let color = datum.color;
                if (!color) {
                    if (colorKey && (colorCache === null || colorCache === void 0 ? void 0 : colorCache.has(colorKey))) {
                        color = colorCache.get(colorKey);
                    }
                    else if ((_e = ringConfig.colorPalette) === null || _e === void 0 ? void 0 : _e.length) {
                        color = ringConfig.colorPalette[datumIndex % ringConfig.colorPalette.length];
                    }
                    else {
                        color = colorAssigner(colorIndexCursor++, datum.id);
                    }
                }
                if (color && colorKey && colorCache) {
                    colorCache.set(colorKey, color);
                }
                const mergedData = inheritColorByLabel
                    ? (() => {
                        const payload = datum.data;
                        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                            return { ...payload };
                        }
                        return payload !== null && payload !== void 0 ? payload : undefined;
                    })()
                    : datum.data;
                return {
                    ...datum,
                    data: mergedData,
                    id: uniqueId,
                    baseId: baseId,
                    index: datumIndex,
                    globalIndex: -1,
                    color: color,
                    visible,
                    ringId,
                    ringIndex,
                    ringLabel: ringConfig.label,
                };
            });
            const totalValue = baseResolved.reduce((sum, slice) => {
                if (!slice.visible)
                    return sum;
                return sum + Math.max(slice.value, 0);
            }, 0);
            const angleSpan = Math.max(ringEndAngle - ringStartAngle, 0);
            const activeSlices = baseResolved.filter((slice) => slice.visible && Math.max(slice.value, 0) > 0);
            const gapCount = activeSlices.length > 1 ? activeSlices.length : 0;
            let effectivePadAngle = gapCount > 0 ? Math.max(ringPadAngle, 0) : 0;
            let totalPad = effectivePadAngle * gapCount;
            if (gapCount > 0) {
                const padBudget = Math.max(angleSpan - ANGLE_EPSILON, 0);
                if (totalPad > padBudget) {
                    effectivePadAngle = padBudget / gapCount;
                    totalPad = effectivePadAngle * gapCount;
                }
            }
            const availableAngle = Math.max(angleSpan - totalPad, 0);
            let currentAngle = ringStartAngle;
            const decoratedResolved = [];
            const slicesWithGeometry = baseResolved.map((slice) => {
                const safeValue = slice.visible ? Math.max(slice.value, 0) : 0;
                const ratio = totalValue > 0 ? safeValue / totalValue : 0;
                const sweep = availableAngle * ratio;
                const sliceStart = totalValue > 0 ? currentAngle : ringStartAngle;
                const sliceEnd = totalValue > 0 ? sliceStart + sweep : ringStartAngle;
                const centerAngle = totalValue > 0 ? sliceStart + sweep / 2 : ringStartAngle;
                if (totalValue > 0 && safeValue > 0) {
                    currentAngle = sliceEnd + (gapCount > 0 ? effectivePadAngle : 0);
                }
                const globalIndex = globalSliceIndex++;
                const ringTotal = totalValue;
                const rawData = {
                    id: slice.baseId,
                    label: slice.label,
                    value: slice.value,
                    color: slice.color,
                    data: slice.data,
                };
                const geometry = {
                    ...slice,
                    key: slice.id,
                    raw: rawData,
                    index: globalIndex,
                    globalIndex,
                    value: slice.value,
                    label: slice.label,
                    color: slice.color,
                    style: {
                        strokeColor: theme.colors.background,
                        strokeWidth: 1,
                    },
                    startAngle: sliceStart,
                    endAngle: sliceEnd,
                    centerAngle,
                    anglePercentage: ratio,
                    valueRatio: ratio,
                    innerRadius: ringInnerRadius,
                    outerRadius: ringOuterRadius,
                    layerId: `donut-chart-ring-${ringId}`,
                    layerIndex: ringIndex,
                    visible: slice.visible,
                    ringId,
                    ringIndex,
                    ringLabel: slice.ringLabel,
                    ringTotal,
                    baseId: slice.baseId,
                    data: slice.data,
                };
                decoratedResolved.push({ ...slice, globalIndex });
                return geometry;
            });
            derived.push({
                id: ringId,
                label: ringConfig.label,
                index: ringIndex,
                startAngle: ringStartAngle,
                endAngle: ringEndAngle,
                padAngle: ringPadAngle,
                innerRadius: ringInnerRadius,
                outerRadius: ringOuterRadius,
                total: totalValue,
                slices: slicesWithGeometry,
                resolvedSlices: decoratedResolved,
                showInLegend: (_f = ringConfig.showInLegend) !== null && _f !== void 0 ? _f : ringIndex === 0,
            });
            const gapForNext = !isLastRing ? resolvedRingGap : 0;
            cursorOuterRadius = Math.max(baseInnerRadius, ringInnerRadius - gapForNext);
        });
        return derived;
    }, [
        baseInnerRadius,
        dataset,
        hasCustomRings,
        inheritColorByLabel,
        interactionSeries,
        outerRadius,
        padAngle,
        resolvedRingGap,
        resolvedRingsProp,
        startAngle,
        endAngle,
        theme.colors.background,
        colorAssigner,
    ]);
    const flatSlices = useMemo(() => ringStates.flatMap((ring) => ring.slices), [ringStates]);
    const ringSnapshots = useMemo(() => ringStates.map((ring) => ({
        id: ring.id,
        index: ring.index,
        label: ring.label,
        total: ring.total,
        slices: ring.slices.map((slice) => sliceToDetails(slice)),
    })), [ringStates]);
    const totalSlicesCount = Math.max(flatSlices.length, 1);
    const dataSignature = useMemo(() => flatSlices
        .map((slice) => `${slice.id}:${slice.value}:${slice.visible ? 1 : 0}:${slice.ringIndex}`)
        .join('|'), [flatSlices]);
    const hasRenderableSlices = flatSlices.some((slice) => slice.visible && slice.anglePercentage > 0);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    const animationType = (animation === null || animation === void 0 ? void 0 : animation.type) || 'drawOn';
    const animationDelay = (_a = animation === null || animation === void 0 ? void 0 : animation.delay) !== null && _a !== void 0 ? _a : 0;
    const animationStagger = (_b = animation === null || animation === void 0 ? void 0 : animation.stagger) !== null && _b !== void 0 ? _b : 110;
    const resolvedAnimationDuration = (_c = animation === null || animation === void 0 ? void 0 : animation.duration) !== null && _c !== void 0 ? _c : animationDuration;
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withDelay(animationDelay, withTiming(1, {
            duration: Math.max(resolvedAnimationDuration, 250),
            easing: Easing.out(Easing.cubic),
        }));
    }, [animationDelay, animationProgress, resolvedAnimationDuration, disabled, dataSignature]);
    const registerSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (!flatSlices.length)
            return;
        if (registerSignatureRef.current === dataSignature)
            return;
        registerSignatureRef.current = dataSignature;
        flatSlices.forEach((slice) => {
            registerSeries({
                id: slice.id,
                name: slice.label,
                color: slice.color,
                points: [
                    {
                        x: slice.globalIndex,
                        y: slice.value,
                        meta: {
                            label: slice.label,
                            value: slice.value,
                            percentage: slice.anglePercentage,
                            ringId: slice.ringId,
                            ringLabel: slice.ringLabel,
                            ringIndex: slice.ringIndex,
                            data: slice.data,
                        },
                    },
                ],
                visible: slice.visible,
            });
        });
    }, [registerSeries, flatSlices, dataSignature]);
    const [focusedSliceId, setFocusedSliceId] = useState(null);
    const focusedSlice = useMemo(() => flatSlices.find((slice) => slice.id === focusedSliceId && slice.visible && slice.anglePercentage > 0) || null, [flatSlices, focusedSliceId]);
    useEffect(() => {
        if (focusedSliceId && !focusedSlice) {
            setFocusedSliceId(null);
        }
    }, [focusedSliceId, focusedSlice]);
    const defaultValueFormatter = useCallback((value) => {
        try {
            return Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
        }
        catch (_a) {
            return value.toString();
        }
    }, []);
    const labelAnnotations = useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const labelsConfig = labelsConfigProp;
        if (!(labelsConfig === null || labelsConfig === void 0 ? void 0 : labelsConfig.show)) {
            return [];
        }
        const position = (_a = labelsConfig.position) !== null && _a !== void 0 ? _a : 'outside';
        const minAngle = (_b = labelsConfig.minAngle) !== null && _b !== void 0 ? _b : DEFAULT_LABEL_MIN_ANGLE;
        const fontSize = (_c = labelsConfig.fontSize) !== null && _c !== void 0 ? _c : theme.fontSize.sm;
        const lineHeight = (_d = labelsConfig.lineHeight) !== null && _d !== void 0 ? _d : fontSize + 2;
        const textColor = (_e = labelsConfig.textColor) !== null && _e !== void 0 ? _e : theme.colors.textPrimary;
        const offset = (_f = labelsConfig.offset) !== null && _f !== void 0 ? _f : DEFAULT_LABEL_OFFSET;
        const leaderConfig = (_g = labelsConfig.leaderLine) !== null && _g !== void 0 ? _g : {};
        const showLeader = (_h = leaderConfig.show) !== null && _h !== void 0 ? _h : position === 'outside';
        const leaderLength = (_j = leaderConfig.length) !== null && _j !== void 0 ? _j : DEFAULT_LABEL_LEADER_LENGTH;
        const leaderColor = (_k = leaderConfig.color) !== null && _k !== void 0 ? _k : ((_l = labelsConfig.textColor) !== null && _l !== void 0 ? _l : theme.colors.textSecondary);
        const leaderWidth = (_m = leaderConfig.width) !== null && _m !== void 0 ? _m : 1;
        const showValue = (_o = labelsConfig.showValue) !== null && _o !== void 0 ? _o : false;
        const showPercentage = (_p = labelsConfig.showPercentage) !== null && _p !== void 0 ? _p : position === 'outside';
        const allowedRings = labelsConfig.rings;
        const includeRing = (ringId, ringIndex) => {
            if (!allowedRings || allowedRings.length === 0) {
                return true;
            }
            return allowedRings.some((target) => typeof target === 'number' ? target === ringIndex : String(target) === ringId);
        };
        const annotations = [];
        ringStates.forEach((ring) => {
            var _a;
            if (!includeRing(ring.id, ring.index)) {
                return;
            }
            const ringDetail = (_a = ringSnapshots[ring.index]) !== null && _a !== void 0 ? _a : {
                id: ring.id,
                index: ring.index,
                label: ring.label,
                total: ring.total,
                slices: [],
            };
            ring.slices.forEach((slice) => {
                var _a, _b, _c;
                if (!slice.visible || slice.anglePercentage <= 0) {
                    return;
                }
                const sweep = Math.abs(slice.endAngle - slice.startAngle);
                if (sweep < minAngle) {
                    return;
                }
                const context = {
                    slice: sliceToDetails(slice),
                    ring: ringDetail,
                    value: slice.value,
                    percentage: slice.anglePercentage,
                };
                const formatted = (_a = labelsConfig.formatter) === null || _a === void 0 ? void 0 : _a.call(labelsConfig, context);
                const lines = [];
                if (Array.isArray(formatted)) {
                    formatted
                        .map((line) => (line != null ? String(line) : ''))
                        .filter((line) => line.trim().length > 0)
                        .forEach((line) => lines.push(line));
                }
                else if (typeof formatted === 'string' && formatted.trim().length > 0) {
                    lines.push(formatted);
                }
                else {
                    lines.push(slice.label);
                }
                if (showValue) {
                    const valueLine = (_c = (_b = labelsConfig.valueFormatter) === null || _b === void 0 ? void 0 : _b.call(labelsConfig, context)) !== null && _c !== void 0 ? _c : defaultValueFormatter(slice.value);
                    if (valueLine && valueLine.toString().trim().length > 0) {
                        lines.push(valueLine.toString());
                    }
                }
                if (showPercentage) {
                    const percentageLabel = formatPercentage(slice.value, ring.total);
                    if (percentageLabel) {
                        lines.push(percentageLabel);
                    }
                }
                const trimmed = lines.filter((line) => line != null && line.trim().length > 0);
                if (!trimmed.length) {
                    return;
                }
                const angleRad = (slice.centerAngle * Math.PI) / 180;
                if (position === 'inside') {
                    const labelRadius = slice.innerRadius + (slice.outerRadius - slice.innerRadius) * 0.5;
                    const x = centerX + Math.cos(angleRad) * labelRadius;
                    const y = centerY + Math.sin(angleRad) * labelRadius;
                    annotations.push({
                        id: `${slice.id}-inside-label`,
                        lines: trimmed,
                        x,
                        y,
                        anchor: 'middle',
                        fontSize,
                        lineHeight,
                        color: textColor,
                    });
                    return;
                }
                const anchor = Math.cos(angleRad) >= 0 ? 'start' : 'end';
                const leaderInnerRadius = slice.outerRadius;
                const leaderOuterRadius = slice.outerRadius + leaderLength;
                const textRadius = leaderOuterRadius + offset;
                const x1 = centerX + Math.cos(angleRad) * leaderInnerRadius;
                const y1 = centerY + Math.sin(angleRad) * leaderInnerRadius;
                const x2 = centerX + Math.cos(angleRad) * leaderOuterRadius;
                const y2 = centerY + Math.sin(angleRad) * leaderOuterRadius;
                const textX = centerX + Math.cos(angleRad) * textRadius + (anchor === 'start' ? 6 : -6);
                const textY = centerY + Math.sin(angleRad) * textRadius;
                annotations.push({
                    id: `${slice.id}-outside-label`,
                    lines: trimmed,
                    x: textX,
                    y: textY,
                    anchor,
                    fontSize,
                    lineHeight,
                    color: textColor,
                    leader: showLeader
                        ? {
                            x1,
                            y1,
                            x2,
                            y2,
                            color: leaderColor,
                            width: leaderWidth,
                        }
                        : undefined,
                });
            });
        });
        return annotations;
    }, [
        labelsConfigProp,
        ringStates,
        ringSnapshots,
        theme,
        centerX,
        centerY,
        defaultValueFormatter,
    ]);
    const resolvedPrimaryIndex = Math.min(Math.max(primaryRingIndex, 0), Math.max(ringStates.length - 1, 0));
    const primaryRing = ringSnapshots[resolvedPrimaryIndex];
    const primaryRingState = ringStates[resolvedPrimaryIndex];
    const activeTotal = (_d = primaryRingState === null || primaryRingState === void 0 ? void 0 : primaryRingState.total) !== null && _d !== void 0 ? _d : 0;
    const datasetForCenter = useMemo(() => {
        if (primaryRing) {
            return primaryRing.slices.map((slice) => ({
                id: slice.id,
                label: slice.label,
                value: slice.value,
                color: slice.color,
                data: slice.data,
            }));
        }
        return dataset;
    }, [primaryRing, dataset]);
    const focusedRing = focusedSlice ? ringStates[focusedSlice.ringIndex] : undefined;
    const focusedSliceDetails = useMemo(() => (focusedSlice ? sliceToDetails(focusedSlice) : null), [focusedSlice]);
    const focusedRingTotal = (_e = focusedRing === null || focusedRing === void 0 ? void 0 : focusedRing.total) !== null && _e !== void 0 ? _e : activeTotal;
    const centerValue = focusedSlice
        ? (_f = centerValueFormatter === null || centerValueFormatter === void 0 ? void 0 : centerValueFormatter(focusedSlice.value, focusedRingTotal, focusedSlice)) !== null && _f !== void 0 ? _f : defaultValueFormatter(focusedSlice.value)
        : (_g = centerValueFormatter === null || centerValueFormatter === void 0 ? void 0 : centerValueFormatter(activeTotal, activeTotal, null)) !== null && _g !== void 0 ? _g : defaultValueFormatter(activeTotal);
    const centerPrimaryLabel = useMemo(() => {
        if (typeof centerLabel === 'function') {
            return centerLabel(activeTotal, datasetForCenter, focusedSlice);
        }
        if (focusedSlice) {
            return focusedSlice.label;
        }
        return centerLabel !== null && centerLabel !== void 0 ? centerLabel : undefined;
    }, [centerLabel, activeTotal, datasetForCenter, focusedSlice]);
    const centerSecondaryLabel = useMemo(() => {
        if (typeof centerSubLabel === 'function') {
            return centerSubLabel(activeTotal, datasetForCenter, focusedSlice);
        }
        if (focusedSlice) {
            return undefined;
        }
        return centerSubLabel !== null && centerSubLabel !== void 0 ? centerSubLabel : undefined;
    }, [centerSubLabel, activeTotal, datasetForCenter, focusedSlice]);
    const centerPercentage = focusedSlice && focusedRingTotal > 0
        ? formatPercentage(focusedSlice.value, focusedRingTotal)
        : null;
    const hasCustomCenterRenderer = typeof renderCenterContent === 'function';
    const customCenterContent = hasCustomCenterRenderer
        ? renderCenterContent({
            total: activeTotal,
            primaryRing,
            rings: ringSnapshots,
            focusedSlice: focusedSliceDetails,
        })
        : undefined;
    const handleSlicePress = useCallback((slice, nativeEvent) => {
        var _a;
        if (!slice.visible)
            return;
        setFocusedSliceId(slice.id);
        const middleRadius = (slice.outerRadius + slice.innerRadius) / 2;
        const angleInRadians = (slice.centerAngle * Math.PI) / 180;
        const localX = centerX + Math.cos(angleInRadians) * middleRadius;
        const localY = centerY + Math.sin(angleInRadians) * middleRadius;
        const absoluteX = padding.left + localX;
        const absoluteY = padding.top + localY;
        const originalData = slice.data;
        const enrichedData = (() => {
            if (originalData && typeof originalData === 'object' && !Array.isArray(originalData)) {
                return { ...originalData, ringId: slice.ringId, ringLabel: slice.ringLabel };
            }
            if (originalData != null) {
                return { value: originalData, ringId: slice.ringId, ringLabel: slice.ringLabel };
            }
            return { ringId: slice.ringId, ringLabel: slice.ringLabel };
        })();
        const emittedDataPoint = {
            id: (_a = slice.baseId) !== null && _a !== void 0 ? _a : slice.id,
            label: slice.label,
            value: slice.value,
            color: slice.color,
            data: enrichedData,
        };
        const interactionEvent = {
            nativeEvent,
            chartX: width ? absoluteX / width : 0,
            chartY: height ? absoluteY / height : 0,
            dataX: slice.globalIndex,
            dataY: slice.value,
            dataPoint: emittedDataPoint,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(emittedDataPoint, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
        if (isolateOnClick && updateSeriesVisibility) {
            const matchingSlices = inheritColorByLabel
                ? flatSlices.filter((candidate) => candidate.baseId === slice.baseId || candidate.label === slice.label)
                : [slice];
            const matchingIds = new Set(matchingSlices.map((candidate) => candidate.id));
            const visibleSlices = flatSlices.filter((candidate) => candidate.visible);
            const alreadyIsolated = visibleSlices.length === matchingIds.size &&
                visibleSlices.every((candidate) => matchingIds.has(candidate.id));
            flatSlices.forEach((candidate) => {
                const shouldShow = alreadyIsolated ? true : matchingIds.has(candidate.id);
                updateSeriesVisibility(candidate.id, shouldShow);
            });
        }
        setPointer === null || setPointer === void 0 ? void 0 : setPointer({
            x: absoluteX,
            y: absoluteY,
            inside: true,
            pageX: nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.pageX,
            pageY: nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.pageY,
        });
    }, [
        centerX,
        centerY,
        flatSlices,
        inheritColorByLabel,
        isolateOnClick,
        onDataPointPress,
        onPress,
        padding.left,
        padding.top,
        setPointer,
        updateSeriesVisibility,
        width,
        height,
    ]);
    const resolvedLegendIndex = (() => {
        if (!ringStates.length)
            return 0;
        const requested = Math.min(Math.max(legendRingIndexProp !== null && legendRingIndexProp !== void 0 ? legendRingIndexProp : resolvedPrimaryIndex, 0), ringStates.length - 1);
        const requestedRing = ringStates[requested];
        if (requestedRing && requestedRing.showInLegend !== false) {
            return requested;
        }
        const fallbackIndex = ringStates.findIndex((ring) => ring.showInLegend !== false);
        return fallbackIndex >= 0 ? fallbackIndex : requested;
    })();
    const legendRing = ringStates[resolvedLegendIndex];
    const legendItems = useMemo(() => legendRing
        ? legendRing.slices.map((slice) => ({
            label: slice.label,
            color: slice.color,
            visible: slice.visible,
        }))
        : [], [legendRing]);
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, animationDuration: resolvedAnimationDuration, disabled: disabled, style: style, title: title, subtitle: subtitle, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), jsx(View, { pointerEvents: "none", style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: hasRenderableSlices ? (hasCustomCenterRenderer
                    ? customCenterContent === undefined
                        ? (jsx(DonutCenterContent, { label: centerPrimaryLabel, value: centerValue, subLabel: centerSecondaryLabel, percentage: centerPercentage, theme: theme }))
                        : customCenterContent
                    : (jsx(DonutCenterContent, { label: centerPrimaryLabel, value: centerValue, subLabel: centerSecondaryLabel, percentage: centerPercentage, theme: theme }))) : (jsx(Text, { style: {
                        fontSize: theme.fontSize.md,
                        color: theme.colors.textSecondary,
                    }, children: emptyLabel })) }), jsxs(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top, overflow: 'visible' }, children: [ringStates.map((ring) => {
                        const strokeWidth = Math.max(ring.outerRadius - ring.innerRadius, 0);
                        if (strokeWidth <= 0.2) {
                            return null;
                        }
                        return (jsx(AnimatedCircle$1, { cx: centerX, cy: centerY, r: ring.innerRadius + strokeWidth / 2, stroke: theme.colors.grid, strokeWidth: strokeWidth, opacity: 0.25, fill: "none" }, `ring-track-${ring.id}`));
                    }), jsx(G, { children: ringStates.map((ring) => ring.slices.map((slice) => {
                            if (!slice.visible || slice.anglePercentage <= 0) {
                                return null;
                            }
                            return (jsx(AnimatedPieSlice, { slice: slice, centerX: centerX, centerY: centerY, innerRadius: slice.innerRadius, outerRadius: slice.outerRadius, animationProgress: animationProgress, animationType: animationType, animationDuration: resolvedAnimationDuration, animationDelay: animationDelay, animationStagger: animationStagger, index: slice.index, totalSlices: totalSlicesCount, fill: slice.color, stroke: theme.colors.background, strokeOpacity: 1, baseFillOpacity: 1, highlightOpacity: 0.85, radiusOffset: 4, strokeWidth: 1, disabled: disabled, dataSignature: dataSignature, onPress: (event) => {
                                    var _a;
                                    const nativeEvent = (_a = event === null || event === void 0 ? void 0 : event.nativeEvent) !== null && _a !== void 0 ? _a : event;
                                    handleSlicePress(slice, nativeEvent);
                                } }, slice.id));
                        })) }), labelAnnotations.length > 0 && (jsx(G, { pointerEvents: "none", children: labelAnnotations.map((annotation) => {
                            const baseY = annotation.y - ((annotation.lines.length - 1) * annotation.lineHeight) / 2;
                            return (jsxs(G, { pointerEvents: "none", children: [annotation.leader ? (jsx(Line, { x1: annotation.leader.x1, y1: annotation.leader.y1, x2: annotation.leader.x2, y2: annotation.leader.y2, stroke: annotation.leader.color, strokeWidth: annotation.leader.width, strokeLinecap: "round", strokeLinejoin: "round" })) : null, jsx(Text$1, { x: annotation.x, y: baseY, fill: annotation.color, fontSize: annotation.fontSize, textAnchor: annotation.anchor, alignmentBaseline: "middle", fontWeight: "600", children: annotation.lines.map((line, index) => (jsx(TSpan, { x: annotation.x, dy: index === 0 ? 0 : annotation.lineHeight, children: line }, `${annotation.id}-line-${index}`))) })] }, annotation.id));
                        }) }))] }), (legend === null || legend === void 0 ? void 0 : legend.show) !== false && legendRing && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legend === null || legend === void 0 ? void 0 : legend.position, align: legend === null || legend === void 0 ? void 0 : legend.align, textColor: legend === null || legend === void 0 ? void 0 : legend.textColor, fontSize: legend === null || legend === void 0 ? void 0 : legend.fontSize, onItemPress: updateSeriesVisibility
                    ? (item, index, nativeEvent) => {
                        const slice = legendRing.slices[index];
                        if (!slice)
                            return;
                        const matchingSlices = inheritColorByLabel
                            ? flatSlices.filter((candidate) => candidate.baseId === slice.baseId || candidate.label === slice.label)
                            : [slice];
                        const matchingIds = new Set(matchingSlices.map((candidate) => candidate.id));
                        const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                        if (isolate) {
                            const visibleSlices = flatSlices.filter((candidate) => candidate.visible);
                            const alreadyIsolated = visibleSlices.length === matchingIds.size &&
                                visibleSlices.every((candidate) => matchingIds.has(candidate.id));
                            flatSlices.forEach((candidate) => {
                                const shouldShow = alreadyIsolated ? true : matchingIds.has(candidate.id);
                                updateSeriesVisibility(candidate.id, shouldShow);
                            });
                        }
                        else {
                            const targetVisibility = !slice.visible;
                            matchingSlices.forEach((candidate) => {
                                updateSeriesVisibility(candidate.id, targetVisibility);
                            });
                        }
                    }
                    : undefined }))] }));
};
DonutChart.displayName = 'DonutChart';

const AnimatedSvgPath = Animated$1.createAnimatedComponent(Path);
const AnimatedLink = React.memo(({ sourceX, sourceY, targetX, targetY, weight, color, opacity = 0.6, strokeWidth, shape = 'straight', curveStrength = 0.35, parallelIndex = 0, parallelCount = 1, onFocus, onBlur, onPress, }) => {
    const x1 = useSharedValue(sourceX);
    const y1 = useSharedValue(sourceY);
    const x2 = useSharedValue(targetX);
    const y2 = useSharedValue(targetY);
    const strokeOpacity = useSharedValue(0);
    const resolvedWidth = strokeWidth !== null && strokeWidth !== void 0 ? strokeWidth : Math.max(1, weight * 0.5);
    const resolvedOpacity = opacity !== null && opacity !== void 0 ? opacity : 0.6;
    const isCurved = shape === 'curved';
    const totalParallel = Math.max(1, parallelCount);
    const parallelOffset = totalParallel > 1 ? parallelIndex - (totalParallel - 1) / 2 : 0;
    const strength = Math.max(0, curveStrength);
    useEffect(() => {
        // Skip animations for performance - directly set positions
        x1.value = sourceX;
        y1.value = sourceY;
        x2.value = targetX;
        y2.value = targetY;
        strokeOpacity.value = resolvedOpacity;
    }, [sourceX, sourceY, targetX, targetY, resolvedOpacity, x1, y1, x2, y2, strokeOpacity]);
    const animatedProps = useAnimatedProps(() => ({
        d: (() => {
            const sx = x1.value;
            const sy = y1.value;
            const tx = x2.value;
            const ty = y2.value;
            if (!isCurved) {
                return `M ${sx} ${sy} L ${tx} ${ty}`;
            }
            const dx = tx - sx;
            const dy = ty - sy;
            const length = Math.sqrt(dx * dx + dy * dy) || 1;
            const normX = length === 0 ? 0 : -dy / length;
            const normY = length === 0 ? 0 : dx / length;
            const curvature = strength * length * parallelOffset;
            const controlX = (sx + tx) / 2 + normX * curvature;
            const controlY = (sy + ty) / 2 + normY * curvature;
            return `M ${sx} ${sy} Q ${controlX} ${controlY} ${tx} ${ty}`;
        })(),
        strokeOpacity: strokeOpacity.value,
    }));
    const handleFocus = useCallback(() => {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    }, [onBlur]);
    const handlePress = useCallback(() => {
        onPress === null || onPress === void 0 ? void 0 : onPress();
    }, [onPress]);
    return (jsx(AnimatedSvgPath, { animatedProps: animatedProps, stroke: color, strokeWidth: resolvedWidth, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", pointerEvents: "auto", onPress: onPress ? handlePress : undefined, onPressIn: onFocus ? handleFocus : undefined, onPressOut: onBlur ? handleBlur : undefined, 
        // @ts-ignore web-only events for hover interactions
        onMouseEnter: onFocus ? handleFocus : undefined, 
        // @ts-ignore web-only events for hover interactions
        onMouseLeave: onBlur ? handleBlur : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverIn: onFocus ? handleFocus : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverOut: onBlur ? handleBlur : undefined }));
});
AnimatedLink.displayName = 'NetworkAnimatedLink';

const AnimatedCircle = Animated$1.createAnimatedComponent(Circle);
const AnimatedText = Animated$1.createAnimatedComponent(Text$1);
const AnimatedGroup = Animated$1.createAnimatedComponent(G);
const AnimatedNode = React.memo(({ id, x, y, color, label, radius = 12, index, disabled = false, theme, showLabel = true, onFocus, onBlur, onPress, }) => {
    const cx = useSharedValue(x);
    const cy = useSharedValue(y);
    const opacity = useSharedValue(disabled ? 0.45 : 0);
    const labelOpacity = useSharedValue(0);
    useEffect(() => {
        // Skip animations for performance - directly set positions
        cx.value = x;
        cy.value = y;
        opacity.value = disabled ? 0.45 : 1;
        labelOpacity.value = disabled ? 0.25 : 0.85;
    }, [x, y, disabled, cx, cy, opacity, labelOpacity]);
    const nodeProps = useAnimatedProps(() => ({
        cx: cx.value,
        cy: cy.value,
        opacity: opacity.value,
    }));
    const groupProps = useAnimatedProps(() => ({
        opacity: opacity.value,
    }));
    const textProps = useAnimatedProps(() => ({
        x: cx.value,
        y: cy.value + radius + 6,
        opacity: labelOpacity.value,
    }));
    const handleFocus = useCallback(() => {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    }, [onBlur]);
    const handlePress = useCallback(() => {
        onPress === null || onPress === void 0 ? void 0 : onPress();
    }, [onPress]);
    return (jsxs(AnimatedGroup, { animatedProps: groupProps, pointerEvents: "auto", onPress: onPress ? handlePress : undefined, onPressIn: onFocus ? handleFocus : undefined, onPressOut: onBlur ? handleBlur : undefined, 
        // @ts-ignore web hover events
        onMouseEnter: onFocus ? handleFocus : undefined, 
        // @ts-ignore web hover events
        onMouseLeave: onBlur ? handleBlur : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverIn: onFocus ? handleFocus : undefined, 
        // @ts-ignore react-native-web hover events
        onHoverOut: onBlur ? handleBlur : undefined, children: [jsx(AnimatedCircle, { animatedProps: nodeProps, r: radius, fill: color, stroke: theme.colors.background, strokeWidth: 1.5 }), label && showLabel && (jsx(AnimatedText, { animatedProps: textProps, fontSize: theme.fontSize.xs, fill: theme.colors.textPrimary, fontFamily: theme.fontFamily, textAnchor: "middle", pointerEvents: "none", children: label }))] }, id));
});
AnimatedNode.displayName = 'NetworkAnimatedNode';

const toNumber$1 = (value) => {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value instanceof Date)
        return value.getTime();
    return 0;
};
const useNetworkSimulation = ({ nodes, links, width, height, layout, scaleX, scaleY, disabled = false, }) => {
    const nodesRef = useRef([]);
    const linksRef = useRef([]);
    const frameRef = useRef(null);
    const alphaRef = useRef(0);
    const frameCounterRef = useRef(0);
    const draggingRef = useRef(null);
    const [tick, setTick] = useState(0);
    const initializeStaticLayout = useCallback(() => {
        if (layout === 'force')
            return;
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        const centerX = width / 2;
        const centerY = height / 2;
        const positioned = new Map();
        if (layout === 'coordinate') {
            nodes.forEach((node) => {
                var _a, _b, _c, _d;
                const baseX = (_a = node.x) !== null && _a !== void 0 ? _a : (_b = node.meta) === null || _b === void 0 ? void 0 : _b.x;
                const baseY = (_c = node.y) !== null && _c !== void 0 ? _c : (_d = node.meta) === null || _d === void 0 ? void 0 : _d.y;
                const px = scaleX ? scaleX(toNumber$1(baseX)) : toNumber$1(baseX);
                const py = scaleY ? scaleY(toNumber$1(baseY)) : toNumber$1(baseY);
                if (Number.isFinite(px) && Number.isFinite(py)) {
                    positioned.set(node.id, { x: px, y: py });
                }
            });
        }
        else if (layout === 'circular') {
            const count = Math.max(1, nodes.length);
            const radius = Math.max(32, Math.min(width, height) * 0.4);
            nodes.forEach((node, index) => {
                const angle = (index / count) * Math.PI * 2;
                positioned.set(node.id, {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                });
            });
        }
        else if (layout === 'radial') {
            const grouped = nodes.reduce((acc, node) => {
                var _a;
                const key = (_a = node.group) !== null && _a !== void 0 ? _a : 'ungrouped';
                const bucket = acc.get(key) || [];
                bucket.push(node);
                acc.set(key, bucket);
                return acc;
            }, new Map());
            if (grouped.size === 0) {
                const fallbackRadius = Math.max(32, Math.min(width, height) * 0.35);
                const total = Math.max(1, nodes.length);
                nodes.forEach((node, index) => {
                    const angle = (index / total) * Math.PI * 2;
                    positioned.set(node.id, {
                        x: centerX + Math.cos(angle) * fallbackRadius,
                        y: centerY + Math.sin(angle) * fallbackRadius,
                    });
                });
            }
            else {
                const maxRadius = Math.max(48, Math.min(width, height) * 0.45);
                const rings = Array.from(grouped.entries());
                const spacing = Math.max(36, maxRadius / Math.max(1, rings.length));
                rings.forEach(([_, members], ringIndex) => {
                    const ringRadius = Math.min(maxRadius, spacing * (ringIndex + 1));
                    const memberCount = Math.max(1, members.length);
                    members.forEach((member, memberIndex) => {
                        const angle = (memberIndex / memberCount) * Math.PI * 2;
                        positioned.set(member.id, {
                            x: centerX + Math.cos(angle) * ringRadius,
                            y: centerY + Math.sin(angle) * ringRadius,
                        });
                    });
                });
            }
        }
        nodesRef.current = nodes.map((node, index) => {
            var _a, _b;
            const position = (_a = positioned.get(node.id)) !== null && _a !== void 0 ? _a : { x: centerX, y: centerY };
            return {
                id: node.id,
                name: node.name,
                group: node.group,
                value: (_b = node.value) !== null && _b !== void 0 ? _b : 1,
                color: node.color || getColorFromScheme(index, colorSchemes.default),
                x: position.x,
                y: position.y,
                vx: 0,
                vy: 0,
                meta: node.meta,
            };
        });
        linksRef.current = links.map((link) => {
            var _a;
            return ({
                source: link.source,
                target: link.target,
                weight: (_a = link.weight) !== null && _a !== void 0 ? _a : 1,
                meta: link.meta,
                color: link.color,
                opacity: link.opacity,
                width: link.width,
            });
        });
        alphaRef.current = 0;
        frameCounterRef.current = 0;
        setTick((t) => t + 1);
    }, [height, layout, links, nodes, scaleX, scaleY, width]);
    const initializeForceLayout = useCallback(() => {
        const centerX = width / 2;
        const centerY = height / 2;
        nodesRef.current = nodes.map((node, index) => {
            var _a;
            const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2;
            return {
                id: node.id,
                name: node.name,
                group: node.group,
                value: (_a = node.value) !== null && _a !== void 0 ? _a : 1,
                color: node.color || getColorFromScheme(index, colorSchemes.default),
                x: centerX + Math.cos(angle) * (width * 0.25),
                y: centerY + Math.sin(angle) * (height * 0.25),
                vx: 0,
                vy: 0,
                meta: node.meta,
            };
        });
        linksRef.current = links.map((link) => {
            var _a;
            return ({
                source: link.source,
                target: link.target,
                weight: (_a = link.weight) !== null && _a !== void 0 ? _a : 1,
                meta: link.meta,
                color: link.color,
                opacity: link.opacity,
                width: link.width,
            });
        });
        alphaRef.current = disabled ? 0 : 1;
        if (!frameRef.current && !disabled) {
            frameRef.current = requestAnimationFrame(() => step());
        }
        setTick((t) => t + 1);
    }, [disabled, height, links, nodes, width]);
    const step = useCallback(() => {
        if (layout !== 'force') {
            frameRef.current = null;
            return;
        }
        const nodeArray = nodesRef.current;
        const linkArray = linksRef.current;
        const n = nodeArray.length;
        let alpha = alphaRef.current;
        if (alpha <= 0.02) {
            alphaRef.current = 0;
            frameRef.current = null;
            return;
        }
        const alphaDecay = 0.03; // Faster convergence
        // Only do expensive repulsion calculations every few frames
        const doRepulsion = frameCounterRef.current % 3 === 0;
        if (doRepulsion) {
            for (let i = 0; i < n; i += 1) {
                for (let j = i + 1; j < n; j += 1) {
                    const a = nodeArray[i];
                    const b = nodeArray[j];
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    const dist2 = dx * dx + dy * dy + 0.01;
                    const dist = Math.sqrt(dist2);
                    const repulse = (25 * alpha) / dist2; // Reduced force
                    dx /= dist;
                    dy /= dist;
                    a.vx += dx * repulse;
                    a.vy += dy * repulse;
                    b.vx -= dx * repulse;
                    b.vy -= dy * repulse;
                }
            }
        }
        linkArray.forEach((link) => {
            const sourceNode = nodeArray.find((node) => node.id === link.source);
            const targetNode = nodeArray.find((node) => node.id === link.target);
            if (!sourceNode || !targetNode)
                return;
            let dx = targetNode.x - sourceNode.x;
            let dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desired = 70 + (link.weight * 3); // Slightly tighter layout
            const diff = dist - desired;
            const k = 0.025 * alpha; // Slightly stronger spring force
            const fx = (dx / dist) * diff * k;
            const fy = (dy / dist) * diff * k;
            sourceNode.vx += fx;
            sourceNode.vy += fy;
            targetNode.vx -= fx;
            targetNode.vy -= fy;
        });
        const cx = width / 2;
        const cy = height / 2;
        nodeArray.forEach((node) => {
            node.vx += (cx - node.x) * 0.002 * alpha; // Slightly stronger centering
            node.vy += (cy - node.y) * 0.002 * alpha;
            node.vx *= 0.92; // Slightly stronger damping
            node.vy *= 0.92;
            node.x += node.vx;
            node.y += node.vy;
        });
        alpha = Math.max(0, alpha - alphaDecay * 0.03); // Faster decay
        alphaRef.current = alpha;
        frameCounterRef.current += 1;
        if (frameCounterRef.current % 8 === 0) {
            setTick((t) => t + 1);
        }
        frameRef.current = requestAnimationFrame(() => step());
    }, [layout, width, height]);
    useEffect(() => {
        if (layout === 'force') {
            initializeForceLayout();
            if (!frameRef.current && !disabled) {
                frameRef.current = requestAnimationFrame(() => step());
            }
            return () => {
                if (frameRef.current)
                    cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
                alphaRef.current = 0;
            };
        }
        initializeStaticLayout();
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            alphaRef.current = 0;
        };
    }, [initializeForceLayout, initializeStaticLayout, layout, disabled, step]);
    const panResponder = useMemo(() => {
        if (layout !== 'force' || disabled) {
            return undefined;
        }
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                const hit = nodesRef.current.find((node) => (locationX - node.x) ** 2 + (locationY - node.y) ** 2 <= 16 * 16);
                if (hit) {
                    draggingRef.current = hit;
                    hit.vx = 0;
                    hit.vy = 0;
                }
            },
            onPanResponderMove: (evt) => {
                if (!draggingRef.current)
                    return;
                const { locationX, locationY } = evt.nativeEvent;
                draggingRef.current.x = Math.max(0, Math.min(width, locationX));
                draggingRef.current.y = Math.max(0, Math.min(height, locationY));
                draggingRef.current.vx = 0;
                draggingRef.current.vy = 0;
                setTick((t) => t + 1);
            },
            onPanResponderRelease: () => {
                draggingRef.current = null;
            },
            onPanResponderTerminate: () => {
                draggingRef.current = null;
            },
        });
    }, [layout, disabled, width, height]);
    return {
        nodes: nodesRef.current,
        links: linksRef.current,
        tick,
        panHandlers: panResponder === null || panResponder === void 0 ? void 0 : panResponder.panHandlers,
    };
};

const buildSignature = (series) => {
    if (!series.length)
        return null;
    return series
        .map((entry) => {
        var _a, _b;
        const pointsSignature = entry.points
            .map((point) => { var _a, _b; return `${point.x.toFixed(2)}:${point.y.toFixed(2)}:${(_b = (_a = point.meta) === null || _a === void 0 ? void 0 : _a.group) !== null && _b !== void 0 ? _b : ''}`; })
            .join('|');
        return `${entry.id}:${(_a = entry.name) !== null && _a !== void 0 ? _a : ''}:${(_b = entry.color) !== null && _b !== void 0 ? _b : ''}:${entry.visible ? 1 : 0}:${pointsSignature}`;
    })
        .join('||');
};
const useNetworkSeriesRegistration = ({ nodes, registerSeries }) => {
    const seriesPayload = useMemo(() => {
        var _a;
        if (!nodes.length)
            return [];
        const baseSeries = [
            {
                id: 'network-nodes',
                name: 'Nodes',
                color: (_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.color,
                points: nodes.map((node) => ({
                    x: node.x,
                    y: node.y,
                    meta: node,
                })),
                visible: true,
            },
        ];
        const clusters = nodes.reduce((map, node) => {
            var _a;
            const key = (_a = node.group) !== null && _a !== void 0 ? _a : 'ungrouped';
            const groupNodes = map.get(key) || [];
            groupNodes.push(node);
            map.set(key, groupNodes);
            return map;
        }, new Map());
        clusters.forEach((groupNodes, key) => {
            var _a;
            if (groupNodes.length <= 1)
                return;
            baseSeries.push({
                id: `network-cluster-${key}`,
                name: `Cluster ${String(key)}`,
                color: (_a = groupNodes[0]) === null || _a === void 0 ? void 0 : _a.color,
                points: groupNodes.map((node) => ({
                    x: node.x,
                    y: node.y,
                    meta: node,
                })),
                visible: true,
            });
        });
        return baseSeries;
    }, [nodes]);
    const signature = useMemo(() => buildSignature(seriesPayload), [seriesPayload]);
    const lastSignatureRef = useRef(null);
    const rafRef = useRef(null);
    useEffect(() => {
        if (!registerSeries || !signature)
            return;
        if (lastSignatureRef.current === signature)
            return;
        if (rafRef.current != null && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (typeof requestAnimationFrame === 'function') {
            rafRef.current = requestAnimationFrame(() => {
                seriesPayload.forEach((entry) => registerSeries(entry));
                lastSignatureRef.current = signature;
                rafRef.current = null;
            });
        }
        else {
            seriesPayload.forEach((entry) => registerSeries(entry));
            lastSignatureRef.current = signature;
        }
        return () => {
            if (rafRef.current != null && typeof cancelAnimationFrame === 'function') {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [signature, registerSeries, seriesPayload]);
    useEffect(() => {
        if (!signature) {
            lastSignatureRef.current = null;
        }
    }, [signature]);
};

const useAnimatedNetworkRendering = ({ nodes, links, tick }) => {
    const [renderNodes, setRenderNodes] = useState([]);
    const [renderLinks, setRenderLinks] = useState([]);
    const frameRef = useRef(null);
    const lastTickRef = useRef(tick);
    useEffect(() => {
        // Only update render state occasionally to reduce React updates
        if (tick !== lastTickRef.current && tick % 2 === 0) {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            frameRef.current = requestAnimationFrame(() => {
                const nodeMap = new Map();
                nodes.forEach((node) => nodeMap.set(node.id, node));
                const pairCounts = links.reduce((acc, link) => {
                    var _a;
                    const key = `${link.source}|${link.target}`;
                    acc.set(key, ((_a = acc.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
                    return acc;
                }, new Map());
                const pairOffsets = new Map();
                const processedLinks = links.reduce((acc, link, index) => {
                    var _a, _b;
                    const source = nodeMap.get(link.source);
                    const target = nodeMap.get(link.target);
                    if (!source || !target) {
                        return acc;
                    }
                    const key = `${link.source}|${link.target}`;
                    const total = (_a = pairCounts.get(key)) !== null && _a !== void 0 ? _a : 1;
                    const currentOffset = (_b = pairOffsets.get(key)) !== null && _b !== void 0 ? _b : 0;
                    pairOffsets.set(key, currentOffset + 1);
                    acc.push({
                        source,
                        target,
                        weight: link.weight,
                        index,
                        color: link.color,
                        opacity: link.opacity,
                        width: link.width,
                        meta: link.meta,
                        parallelIndex: currentOffset,
                        parallelCount: total,
                    });
                    return acc;
                }, []);
                setRenderNodes([...nodes]);
                setRenderLinks(processedLinks);
                lastTickRef.current = tick;
                frameRef.current = null;
            });
        }
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [nodes, links, tick]);
    return { renderNodes, renderLinks };
};

const toNumber = (value) => {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value instanceof Date)
        return value.getTime();
    return 0;
};
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const NetworkChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { width = 600, height = 400, nodes, links, title, subtitle, style, layout = 'force', grid, xAxis, yAxis, padding: paddingOverride, coordinateAccessor, showLabels = true, nodeRadius = 12, nodeRadiusRange, nodeValueAccessor, linkWidthRange, linkColorAccessor, linkOpacityAccessor, linkShape: linkShapeMode = 'straight', linkCurveStrength: linkCurveStrengthProp = 0.35, linkPalette, onNodeFocus, onNodeBlur, onNodePress, onLinkFocus, onLinkBlur, onLinkPress, animationDuration, disabled = false, ...rest } = props;
    const theme = useChartTheme();
    const resolvedLinkPalette = React.useMemo(() => {
        if (Array.isArray(linkPalette) && linkPalette.length) {
            return linkPalette;
        }
        return theme.colors.accentPalette || [];
    }, [linkPalette, theme.colors.accentPalette]);
    const resolvedLinkCurveStrength = React.useMemo(() => Math.max(0, linkCurveStrengthProp), [linkCurveStrengthProp]);
    const nodeLookup = React.useMemo(() => {
        const map = new Map();
        nodes.forEach((node, index) => {
            map.set(node.id, { node, index });
        });
        return map;
    }, [nodes]);
    const hasNodeEvents = Boolean(onNodeFocus || onNodeBlur || onNodePress);
    const hasLinkEvents = Boolean(onLinkFocus || onLinkBlur || onLinkPress);
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_h) {
        console.warn('NetworkChart: render within a ChartInteractionProvider to enable shared interactions');
    }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const resolvedWidth = width;
    const resolvedHeight = height;
    const padding = React.useMemo(() => {
        var _a, _b, _c, _d;
        const hasXAxis = layout === 'coordinate' && (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false;
        const hasYAxis = layout === 'coordinate' && (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false;
        const baseTop = title || subtitle ? 56 : 36;
        const base = {
            top: baseTop,
            right: 32,
            bottom: hasXAxis ? 56 : 24,
            left: hasYAxis ? 64 : 32,
        };
        if (!paddingOverride)
            return base;
        return {
            top: (_a = paddingOverride.top) !== null && _a !== void 0 ? _a : base.top,
            right: (_b = paddingOverride.right) !== null && _b !== void 0 ? _b : base.right,
            bottom: (_c = paddingOverride.bottom) !== null && _c !== void 0 ? _c : base.bottom,
            left: (_d = paddingOverride.left) !== null && _d !== void 0 ? _d : base.left,
        };
    }, [layout, paddingOverride, title, subtitle, xAxis === null || xAxis === void 0 ? void 0 : xAxis.show, yAxis === null || yAxis === void 0 ? void 0 : yAxis.show]);
    const plotWidth = Math.max(1, resolvedWidth - padding.left - padding.right);
    const plotHeight = Math.max(1, resolvedHeight - padding.top - padding.bottom);
    const accessorX = coordinateAccessor === null || coordinateAccessor === void 0 ? void 0 : coordinateAccessor.x;
    const accessorY = coordinateAccessor === null || coordinateAccessor === void 0 ? void 0 : coordinateAccessor.y;
    const xDomain = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [0, plotWidth];
        const values = nodes
            .map((node, index) => toNumber(accessorX ? accessorX(node, index) : node.x))
            .filter((value) => Number.isFinite(value));
        if (!values.length)
            return [0, 1];
        const min = Math.min(...values);
        const max = Math.max(...values);
        if (min === max)
            return [min - 1, min + 1];
        return [min, max];
    }, [layout, nodes, accessorX, plotWidth]);
    const yDomain = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [0, plotHeight];
        const values = nodes
            .map((node, index) => toNumber(accessorY ? accessorY(node, index) : node.y))
            .filter((value) => Number.isFinite(value));
        if (!values.length)
            return [0, 1];
        const min = Math.min(...values);
        const max = Math.max(...values);
        if (min === max)
            return [min - 1, min + 1];
        return [min, max];
    }, [layout, nodes, accessorY, plotHeight]);
    const scaleX = React.useMemo(() => {
        if (layout !== 'coordinate')
            return null;
        return linearScale(xDomain, [0, plotWidth]);
    }, [layout, xDomain, plotWidth]);
    const scaleY = React.useMemo(() => {
        if (layout !== 'coordinate')
            return null;
        return linearScale(yDomain, [plotHeight, 0]);
    }, [layout, yDomain, plotHeight]);
    const resolvedGrid = React.useMemo(() => {
        var _a;
        if (layout !== 'coordinate')
            return null;
        if (!grid)
            return null;
        if (grid === true)
            return { show: true };
        return { show: (_a = grid.show) !== null && _a !== void 0 ? _a : true, ...grid };
    }, [grid, layout]);
    const xTicks = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [];
        if (Array.isArray(xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) && xAxis.ticks.length) {
            return xAxis.ticks;
        }
        return generateTicks(xDomain[0], xDomain[1], 5);
    }, [layout, xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks, xDomain]);
    const yTicks = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [];
        if (Array.isArray(yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
            return yAxis.ticks;
        }
        return generateTicks(yDomain[0], yDomain[1], 5);
    }, [layout, yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks, yDomain]);
    const normalizedXTicks = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [];
        const span = xDomain[1] - xDomain[0];
        if (!Number.isFinite(span) || span === 0)
            return [];
        return xTicks
            .map((tick) => {
            const numeric = typeof tick === 'number' ? tick : Number(tick);
            if (!Number.isFinite(numeric))
                return null;
            return (numeric - xDomain[0]) / span;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [layout, xTicks, xDomain]);
    const normalizedYTicks = React.useMemo(() => {
        if (layout !== 'coordinate')
            return [];
        const span = yDomain[1] - yDomain[0];
        if (!Number.isFinite(span) || span === 0)
            return [];
        return yTicks
            .map((tick) => {
            const numeric = typeof tick === 'number' ? tick : Number(tick);
            if (!Number.isFinite(numeric))
                return null;
            const ratio = (numeric - yDomain[0]) / span;
            return 1 - ratio;
        })
            .filter((value) => value != null && Number.isFinite(value));
    }, [layout, yTicks, yDomain]);
    const xTickFormatter = React.useMemo(() => {
        if (typeof (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) === 'function')
            return xAxis.labelFormatter;
        return (value) => formatNumber$2(value);
    }, [xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter]);
    const yTickFormatter = React.useMemo(() => {
        if (typeof (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) === 'function')
            return yAxis.labelFormatter;
        return (value) => formatNumber$2(value);
    }, [yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter]);
    const simulation = useNetworkSimulation({
        nodes,
        links,
        width: plotWidth,
        height: plotHeight,
        layout,
        scaleX: scaleX !== null && scaleX !== void 0 ? scaleX : undefined,
        scaleY: scaleY !== null && scaleY !== void 0 ? scaleY : undefined,
        disabled,
    });
    // Use refs to access current simulation state without triggering re-renders
    const nodesRef = React.useRef([]);
    const linksRef = React.useRef([]);
    // Update refs when simulation data changes
    React.useEffect(() => {
        nodesRef.current = simulation.nodes;
        linksRef.current = simulation.links;
    }, [simulation.nodes, simulation.links]);
    // Only create snapshots for registration, not for rendering
    const registrationNodes = React.useMemo(() => simulation.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        group: node.group,
        value: node.value,
        color: node.color,
        x: node.x,
        y: node.y,
        meta: node.meta,
    })), [simulation.nodes] // Remove simulation.tick dependency
    );
    useNetworkSeriesRegistration({ nodes: registrationNodes, registerSeries });
    // Use optimized rendering hook that throttles updates
    const { renderNodes, renderLinks } = useAnimatedNetworkRendering({
        nodes: simulation.nodes,
        links: simulation.links,
        tick: simulation.tick,
    });
    const nodeValueFn = React.useMemo(() => {
        if (typeof nodeValueAccessor === 'function') {
            return (node, index) => toNumber(nodeValueAccessor(node, index));
        }
        return (node) => { var _a; return toNumber((_a = node.value) !== null && _a !== void 0 ? _a : 1); };
    }, [nodeValueAccessor]);
    const nodeRadiusScale = React.useMemo(() => {
        if (!nodeRadiusRange)
            return null;
        const values = nodes
            .map((node, index) => nodeValueFn(node, index))
            .filter((value) => Number.isFinite(value));
        if (!values.length)
            return null;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const [minRadiusRaw, maxRadiusRaw] = nodeRadiusRange;
        const minRadius = Math.max(1, toNumber(minRadiusRaw));
        const maxRadius = Math.max(minRadius, toNumber(maxRadiusRaw));
        if (minValue === maxValue) {
            const constant = (minRadius + maxRadius) / 2;
            return () => constant;
        }
        const span = maxRadius - minRadius;
        const valueSpan = maxValue - minValue;
        return (value) => {
            if (!Number.isFinite(value))
                return minRadius;
            const ratio = clamp01((value - minValue) / valueSpan);
            return minRadius + ratio * span;
        };
    }, [nodeRadiusRange, nodeValueFn, nodes]);
    const nodeRadiusMap = React.useMemo(() => {
        const map = new Map();
        nodes.forEach((node, index) => {
            const value = nodeValueFn(node, index);
            const resolvedRadius = nodeRadiusScale ? nodeRadiusScale(value) : nodeRadius;
            map.set(node.id, resolvedRadius);
        });
        return map;
    }, [nodes, nodeValueFn, nodeRadiusScale, nodeRadius]);
    const linkColorMap = React.useMemo(() => {
        const map = new Map();
        links.forEach((link, index) => {
            var _a;
            const resolved = (_a = linkColorAccessor === null || linkColorAccessor === void 0 ? void 0 : linkColorAccessor(link, index)) !== null && _a !== void 0 ? _a : link.color;
            if (typeof resolved === 'string' && resolved.trim().length > 0) {
                map.set(index, resolved);
            }
        });
        return map;
    }, [links, linkColorAccessor]);
    const linkOpacityMap = React.useMemo(() => {
        const map = new Map();
        links.forEach((link, index) => {
            const candidate = linkOpacityAccessor === null || linkOpacityAccessor === void 0 ? void 0 : linkOpacityAccessor(link, index);
            const resolved = candidate !== null && candidate !== void 0 ? candidate : link.opacity;
            if (typeof resolved === 'number' && Number.isFinite(resolved)) {
                map.set(index, clamp01(resolved));
            }
        });
        return map;
    }, [links, linkOpacityAccessor]);
    const linkWidthOverrideMap = React.useMemo(() => {
        const map = new Map();
        links.forEach((link, index) => {
            if (typeof link.width === 'number' && Number.isFinite(link.width)) {
                map.set(index, Math.max(0.5, link.width));
            }
        });
        return map;
    }, [links]);
    const linkWeightDomain = React.useMemo(() => {
        const weights = links
            .map((link) => { var _a; return toNumber((_a = link.weight) !== null && _a !== void 0 ? _a : 1); })
            .filter((value) => Number.isFinite(value) && value >= 0);
        if (!weights.length) {
            return { min: 1, max: 1 };
        }
        return { min: Math.min(...weights), max: Math.max(...weights) };
    }, [links]);
    const resolvedLinkWidthRange = React.useMemo(() => {
        if (!linkWidthRange || linkWidthRange.length !== 2) {
            return [1, 4];
        }
        const [rawMin, rawMax] = linkWidthRange;
        const minWidth = Math.max(0.5, toNumber(rawMin));
        const maxWidth = Math.max(minWidth, toNumber(rawMax));
        return [minWidth, maxWidth];
    }, [linkWidthRange]);
    const computeLinkWidth = React.useCallback((weight, index) => {
        const override = linkWidthOverrideMap.get(index);
        if (override != null) {
            return override;
        }
        const [minWidth, maxWidth] = resolvedLinkWidthRange;
        const span = maxWidth - minWidth;
        const { min, max } = linkWeightDomain;
        if (!Number.isFinite(weight)) {
            return minWidth;
        }
        if (min === max) {
            return minWidth + span * 0.5;
        }
        const ratio = clamp01((weight - min) / (max - min));
        return minWidth + ratio * span;
    }, [linkWidthOverrideMap, resolvedLinkWidthRange, linkWeightDomain]);
    const handlePointerMove = React.useCallback((event) => {
        var _a, _b;
        if (!setPointer)
            return;
        const rect = (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!rect)
            return;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const inside = x >= 0 && y >= 0 && x <= plotWidth && y <= plotHeight;
        setPointer({
            x: x + padding.left,
            y: y + padding.top,
            inside,
            pageX: event.pageX,
            pageY: event.pageY,
        });
    }, [plotWidth, plotHeight, padding.left, padding.top, setPointer]);
    const handlePointerLeave = React.useCallback(() => {
        if (!setPointer)
            return;
        setPointer({ x: 0, y: 0, inside: false });
    }, [setPointer]);
    const panHandlers = ((_a = simulation.panHandlers) !== null && _a !== void 0 ? _a : {});
    return (jsxs(ChartContainer, { width: resolvedWidth, height: resolvedHeight, style: style, animationDuration: animationDuration, disabled: disabled, interactionConfig: {
            enablePanZoom: layout === 'force',
            multiTooltip: true,
            liveTooltip: true,
        }, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), resolvedGrid && (jsx(ChartGrid, { grid: resolvedGrid, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding, useSVG: true })), jsx(View, { style: {
                    position: 'absolute',
                    left: padding.left,
                    top: padding.top,
                    width: plotWidth,
                    height: plotHeight,
                    // @ts-ignore web-specific CSS properties
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                }, ...panHandlers, children: jsxs(Svg, { width: plotWidth, height: plotHeight, 
                    // @ts-ignore web specific events
                    onMouseMove: handlePointerMove, 
                    // @ts-ignore web specific events
                    onMouseLeave: handlePointerLeave, children: [renderLinks.map((link) => {
                            var _a, _b, _c, _d, _e;
                            const paletteColor = resolvedLinkPalette.length > 0
                                ? resolvedLinkPalette[link.index % resolvedLinkPalette.length]
                                : undefined;
                            const color = (_c = (_b = (_a = linkColorMap.get(link.index)) !== null && _a !== void 0 ? _a : link.color) !== null && _b !== void 0 ? _b : paletteColor) !== null && _c !== void 0 ? _c : theme.colors.grid;
                            const rawOpacity = (_e = (_d = linkOpacityMap.get(link.index)) !== null && _d !== void 0 ? _d : link.opacity) !== null && _e !== void 0 ? _e : 0.5;
                            const opacity = clamp01(typeof rawOpacity === 'number' ? rawOpacity : 0.5);
                            const strokeWidth = computeLinkWidth(link.weight, link.index);
                            const originalLink = links[link.index];
                            const sourceMeta = nodeLookup.get(link.source.id);
                            const targetMeta = nodeLookup.get(link.target.id);
                            const linkPayload = hasLinkEvents && originalLink
                                ? {
                                    link: originalLink,
                                    index: link.index,
                                    source: {
                                        node: sourceMeta === null || sourceMeta === void 0 ? void 0 : sourceMeta.node,
                                        position: { x: link.source.x, y: link.source.y },
                                    },
                                    target: {
                                        node: targetMeta === null || targetMeta === void 0 ? void 0 : targetMeta.node,
                                        position: { x: link.target.x, y: link.target.y },
                                    },
                                    weight: link.weight,
                                }
                                : null;
                            return (jsx(AnimatedLink, { sourceX: link.source.x, sourceY: link.source.y, targetX: link.target.x, targetY: link.target.y, weight: link.weight, index: link.index, color: color, opacity: opacity, strokeWidth: strokeWidth, shape: linkShapeMode, curveStrength: resolvedLinkCurveStrength, parallelIndex: link.parallelIndex, parallelCount: link.parallelCount, onFocus: linkPayload && onLinkFocus ? () => onLinkFocus(linkPayload) : undefined, onBlur: linkPayload && onLinkBlur ? () => onLinkBlur(linkPayload) : undefined, onPress: linkPayload && onLinkPress ? () => onLinkPress(linkPayload) : undefined }, `${link.source.id}-${link.target.id}-${link.index}`));
                        }), renderNodes.map((node, idx) => {
                            var _a;
                            const originalNode = nodeLookup.get(node.id);
                            const nodePayload = hasNodeEvents && originalNode
                                ? {
                                    node: originalNode.node,
                                    index: originalNode.index,
                                    position: { x: node.x, y: node.y },
                                }
                                : null;
                            return (jsx(AnimatedNode, { id: node.id, x: node.x, y: node.y, color: node.color, label: node.name, radius: (_a = nodeRadiusMap.get(node.id)) !== null && _a !== void 0 ? _a : nodeRadius, index: idx, disabled: disabled, theme: theme, showLabel: showLabels, onFocus: nodePayload && onNodeFocus ? () => onNodeFocus(nodePayload) : undefined, onBlur: nodePayload && onNodeBlur ? () => onNodeBlur(nodePayload) : undefined, onPress: nodePayload && onNodePress ? () => onNodePress(nodePayload) : undefined }, node.id));
                        })] }) }), layout === 'coordinate' && (xAxis === null || xAxis === void 0 ? void 0 : xAxis.show) !== false && plotWidth > 0 && (jsx(Axis, { scale: scaleX !== null && scaleX !== void 0 ? scaleX : linearScale(xDomain, [0, plotWidth]), orientation: "bottom", length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: xTicks.length, tickFormat: xTickFormatter, tickSize: (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickLength) !== null && _b !== void 0 ? _b : 4, tickPadding: 4, showLabels: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showLabels) !== false, showTicks: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.showTicks) !== false, stroke: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.color) || theme.colors.grid, strokeWidth: (_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.thickness) !== null && _c !== void 0 ? _c : 1, tickLabelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFontSize, label: xAxis === null || xAxis === void 0 ? void 0 : xAxis.title, labelColor: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleColor) || theme.colors.textPrimary, labelFontSize: xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize, labelOffset: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.title) ? ((_d = xAxis === null || xAxis === void 0 ? void 0 : xAxis.titleFontSize) !== null && _d !== void 0 ? _d : 12) + 20 : 32 })), layout === 'coordinate' && (yAxis === null || yAxis === void 0 ? void 0 : yAxis.show) !== false && plotHeight > 0 && (jsx(Axis, { scale: scaleY !== null && scaleY !== void 0 ? scaleY : linearScale(yDomain, [plotHeight, 0]), orientation: "left", length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTicks.length, tickFormat: yTickFormatter, tickSize: (_e = yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickLength) !== null && _e !== void 0 ? _e : 4, tickPadding: 4, showLabels: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showLabels) !== false, showTicks: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.showTicks) !== false, stroke: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.color) || theme.colors.grid, strokeWidth: (_f = yAxis === null || yAxis === void 0 ? void 0 : yAxis.thickness) !== null && _f !== void 0 ? _f : 1, tickLabelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelColor) || theme.colors.textSecondary, tickLabelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFontSize, label: yAxis === null || yAxis === void 0 ? void 0 : yAxis.title, labelColor: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleColor) || theme.colors.textPrimary, labelFontSize: yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize, labelOffset: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) ? ((_g = yAxis === null || yAxis === void 0 ? void 0 : yAxis.titleFontSize) !== null && _g !== void 0 ? _g : 12) + 20 : 32 })), renderNodes.length === 0 && (jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: jsx(Text, { style: { color: theme.colors.textSecondary, fontSize: 12 }, children: "No data" }) }))] }));
};
NetworkChart.displayName = 'NetworkChart';

const PERCENT_AXIS_FORMATTER = (value) => `${value.toFixed(0)}%`;
const formatPercent$1 = (value) => {
    if (!Number.isFinite(value))
        return '0%';
    const clamped = Math.max(0, Math.min(1, value));
    const precision = clamped >= 0.995 ? 0 : clamped >= 0.095 ? 1 : 2;
    return `${(clamped * 100).toFixed(precision)}%`;
};
const formatNumber$1 = (value) => {
    if (!Number.isFinite(value))
        return String(value);
    return value.toLocaleString();
};
const sanitizeData = (data) => {
    return data
        .filter((item) => item && Number.isFinite(item.value))
        .map((item) => ({
        label: item.label,
        value: Math.max(0, Number(item.value) || 0),
        color: item.color,
    }));
};
const ParetoChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { data, sortDirection = 'desc', valueSeriesLabel = 'Frequency', cumulativeSeriesLabel = 'Cumulative %', barColor, lineColor, categoryLabelFormatter, xAxis, yAxis, yAxisRight, legend, grid, enableCrosshair, multiTooltip, liveTooltip, width = 640, height = 360, title, subtitle, ...rest } = props;
    const theme = useChartTheme();
    const cleaned = useMemo(() => sanitizeData(data), [data]);
    const ordered = useMemo(() => {
        if (sortDirection === 'none') {
            return cleaned;
        }
        const direction = sortDirection === 'asc' ? 1 : -1;
        return [...cleaned].sort((a, b) => direction * (a.value - b.value));
    }, [cleaned, sortDirection]);
    const categories = useMemo(() => ordered.map((item) => item.label), [ordered]);
    const indices = useMemo(() => ordered.map((_, index) => index + 1), [ordered]);
    const totalValue = useMemo(() => ordered.reduce((acc, item) => acc + Math.max(0, item.value), 0), [ordered]);
    const total = totalValue > 0 ? totalValue : 1;
    const palette = ((_a = theme.colors.accentPalette) === null || _a === void 0 ? void 0 : _a.length) ? theme.colors.accentPalette : colorSchemes.default;
    const baseBarColor = (_d = (_c = barColor !== null && barColor !== void 0 ? barColor : (_b = ordered[0]) === null || _b === void 0 ? void 0 : _b.color) !== null && _c !== void 0 ? _c : palette[0]) !== null && _d !== void 0 ? _d : getColorFromScheme(0, colorSchemes.default);
    const baseLineColor = (_f = lineColor !== null && lineColor !== void 0 ? lineColor : (_e = theme.colors.accentPalette) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : getColorFromScheme(1, colorSchemes.default);
    const barColors = useMemo(() => {
        if (barColor) {
            return ordered.map(() => barColor);
        }
        return ordered.map((item, index) => { var _a, _b; return (_b = (_a = item.color) !== null && _a !== void 0 ? _a : palette[index % palette.length]) !== null && _b !== void 0 ? _b : baseBarColor; });
    }, [ordered, palette, barColor, baseBarColor]);
    const barSeries = useMemo(() => {
        return ordered.map((item, index) => {
            var _a;
            const value = item.value;
            const shareOfTotal = total > 0 ? value / total : 0;
            const color = (_a = barColors[index]) !== null && _a !== void 0 ? _a : baseBarColor;
            return {
                x: indices[index],
                y: value,
                color,
                meta: {
                    label: item.label,
                    value,
                    formattedValue: `${formatNumber$1(value)} · ${formatPercent$1(shareOfTotal)}`,
                    shareOfTotal,
                    formattedShareOfTotal: formatPercent$1(shareOfTotal),
                    rank: index + 1,
                    color,
                    raw: item,
                    customTooltip: `${formatNumber$1(value)} · ${formatPercent$1(shareOfTotal)} of total`,
                },
            };
        });
    }, [ordered, indices, total, barColors, baseBarColor]);
    const lineSeries = useMemo(() => {
        let running = 0;
        return ordered.map((item, index) => {
            running += Math.max(0, item.value);
            const percent = (running / total) * 100;
            return {
                x: indices[index],
                y: percent,
                meta: {
                    label: cumulativeSeriesLabel,
                    category: item.label,
                    cumulativeValue: running,
                    formattedCumulativeValue: formatNumber$1(running),
                    value: percent / 100,
                    formattedValue: formatPercent$1(percent / 100),
                    rank: index + 1,
                    color: baseLineColor,
                    raw: item,
                    customTooltip: `${formatPercent$1(percent / 100)} cumulative (${formatNumber$1(running)} of ${formatNumber$1(totalValue)})`,
                },
            };
        });
    }, [ordered, indices, total, totalValue, cumulativeSeriesLabel, baseLineColor]);
    const layers = useMemo(() => {
        return [
            {
                type: 'bar',
                id: 'pareto-bar',
                name: valueSeriesLabel,
                data: barSeries.map((point) => {
                    var _a;
                    return ({
                        x: point.x,
                        y: point.y,
                        color: (_a = point.color) !== null && _a !== void 0 ? _a : baseBarColor,
                        meta: point.meta,
                    });
                }),
                color: baseBarColor,
                opacity: 0.9,
            },
            {
                type: 'line',
                id: 'pareto-line',
                name: cumulativeSeriesLabel,
                targetAxis: 'right',
                data: lineSeries.map((point) => ({
                    x: point.x,
                    y: point.y,
                    meta: point.meta,
                })),
                color: baseLineColor,
                thickness: 3,
                showPoints: true,
                pointSize: 6,
            },
        ];
    }, [barSeries, lineSeries, baseBarColor, baseLineColor, valueSeriesLabel, cumulativeSeriesLabel]);
    const defaultXAxis = useMemo(() => ({
        show: true,
        showTicks: true,
        showLabels: true,
        ticks: indices,
        labelFormatter: (value) => {
            const index = Math.round(value) - 1;
            const category = categories[index];
            if (category == null)
                return '';
            return categoryLabelFormatter ? categoryLabelFormatter(category, index) : category;
        },
    }), [indices, categories, categoryLabelFormatter]);
    const defaultYAxis = useMemo(() => ({
        show: true,
        showTicks: true,
        showLabels: true,
        title: valueSeriesLabel,
    }), [valueSeriesLabel]);
    const defaultYAxisRight = useMemo(() => ({
        show: true,
        showTicks: true,
        showLabels: true,
        title: cumulativeSeriesLabel,
        labelFormatter: PERCENT_AXIS_FORMATTER,
    }), [cumulativeSeriesLabel]);
    const resolvedXAxis = {
        ...defaultXAxis,
        ...(xAxis !== null && xAxis !== void 0 ? xAxis : {}),
        ticks: (_g = xAxis === null || xAxis === void 0 ? void 0 : xAxis.ticks) !== null && _g !== void 0 ? _g : defaultXAxis.ticks,
        labelFormatter: (_h = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) !== null && _h !== void 0 ? _h : defaultXAxis.labelFormatter,
    };
    const resolvedYAxis = {
        ...defaultYAxis,
        ...(yAxis !== null && yAxis !== void 0 ? yAxis : {}),
        title: (_j = yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) !== null && _j !== void 0 ? _j : defaultYAxis.title,
    };
    const resolvedYAxisRight = {
        ...defaultYAxisRight,
        ...(yAxisRight !== null && yAxisRight !== void 0 ? yAxisRight : {}),
        title: (_k = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.title) !== null && _k !== void 0 ? _k : defaultYAxisRight.title,
        labelFormatter: (_l = yAxisRight === null || yAxisRight === void 0 ? void 0 : yAxisRight.labelFormatter) !== null && _l !== void 0 ? _l : defaultYAxisRight.labelFormatter,
    };
    const resolvedLegend = legend !== null && legend !== void 0 ? legend : { show: true, position: 'bottom', align: 'center' };
    return (jsx(ComboChart, { ...rest, width: width, height: height, title: title, subtitle: subtitle, layers: layers, xAxis: resolvedXAxis, yAxis: resolvedYAxis, yAxisRight: resolvedYAxisRight, legend: resolvedLegend, grid: grid, enableCrosshair: enableCrosshair !== null && enableCrosshair !== void 0 ? enableCrosshair : true, multiTooltip: multiTooltip !== null && multiTooltip !== void 0 ? multiTooltip : true, liveTooltip: liveTooltip !== null && liveTooltip !== void 0 ? liveTooltip : false }));
};
ParetoChart.displayName = 'ParetoChart';

const AnimatedRect = Animated$1.createAnimatedComponent(Rect);
const toNativePointerEvent = (event) => {
    var _a, _b, _c, _d;
    const rect = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
    return {
        nativeEvent: {
            locationX: rect ? event.clientX - rect.left : 0,
            locationY: rect ? event.clientY - rect.top : 0,
            pageX: (_c = event === null || event === void 0 ? void 0 : event.pageX) !== null && _c !== void 0 ? _c : event === null || event === void 0 ? void 0 : event.clientX,
            pageY: (_d = event === null || event === void 0 ? void 0 : event.pageY) !== null && _d !== void 0 ? _d : event === null || event === void 0 ? void 0 : event.clientY,
        },
    };
};
const DEFAULT_Y_TICKS = [0, 0.25, 0.5, 0.75, 1];
const DEFAULT_PADDING = { top: 64, right: 32, bottom: 72, left: 88 };
const DEFAULT_ANIMATION_DURATION = 700;
const AnimatedMarimekkoSegment = React.memo(({ segment, animation, borderRadius, disabled, onHoverIn, onHoverOut, onPress }) => {
    if (segment.width <= 0 || segment.height <= 0) {
        return null;
    }
    const animatedProps = useAnimatedProps(() => {
        const progress = animation.value;
        const height = segment.height * progress;
        const y = segment.y + (segment.height - height);
        return {
            x: segment.x,
            y,
            width: segment.width,
            height,
        };
    }, [segment]);
    const isWeb = Platform.OS === 'web';
    return (jsx(AnimatedRect, { animatedProps: animatedProps, fill: segment.color, rx: borderRadius, ry: borderRadius, opacity: segment.visible ? 1 : 0, pointerEvents: segment.visible ? 'auto' : 'none', ...(isWeb
            ? {
                onPointerEnter: () => !disabled && onHoverIn(segment),
                onPointerLeave: () => onHoverOut(segment),
                onPointerDown: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                },
                onPointerUp: (event) => {
                    var _a, _b;
                    if (disabled)
                        return;
                    (_b = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId);
                    onPress(segment, toNativePointerEvent(event));
                },
                onPointerCancel: () => onHoverOut(segment),
            }
            : {
                onPressIn: () => !disabled && onHoverIn(segment),
                onPressOut: () => onHoverOut(segment),
                onPress: (event) => !disabled && onPress(segment, { nativeEvent: event.nativeEvent }),
            }) }));
});
AnimatedMarimekkoSegment.displayName = 'MarimekkoSegment';
const formatPercent = (value) => {
    if (!Number.isFinite(value))
        return '0%';
    const clamped = Math.max(0, Math.min(1, value));
    const precision = clamped >= 0.995 ? 0 : clamped >= 0.095 ? 1 : 2;
    return `${(clamped * 100).toFixed(precision)}%`;
};
const formatNumber = (value) => {
    if (!Number.isFinite(value))
        return String(value);
    return value.toLocaleString();
};
const MarimekkoChart = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const { data, legend, xAxis, yAxis, grid, columnGap = 12, segmentBorderRadius = 2, categoryLabelFormatter, width = 640, height = 400, title, subtitle, animationDuration = DEFAULT_ANIMATION_DURATION, disabled = false, onPress, onDataPointPress, style, useOwnInteractionProvider, suppressPopover, padding: paddingProp, ...rest } = props;
    const theme = useChartTheme();
    const assignColor = useMemo(() => createColorAssigner({ hash: true }), []);
    const interactionConfig = useMemo(() => ({ multiTooltip: true, liveTooltip: true }), []);
    const normalizedCategories = useMemo(() => {
        return data
            .map((category) => {
            var _a;
            if (!category || category.visible === false) {
                return null;
            }
            const segments = Array.isArray(category.segments)
                ? category.segments
                    .filter((segment) => !!segment && segment.visible !== false && Number.isFinite(segment.value))
                    .map((segment) => {
                    var _a;
                    return ({
                        original: segment,
                        id: (_a = segment.id) !== null && _a !== void 0 ? _a : segment.label,
                        label: segment.label,
                        value: Math.max(0, Number(segment.value) || 0),
                    });
                })
                    .filter((segment) => segment.value > 0)
                : [];
            const total = segments.reduce((acc, segment) => acc + segment.value, 0);
            if (!segments.length || total <= 0) {
                return null;
            }
            return {
                original: category,
                id: (_a = category.id) !== null && _a !== void 0 ? _a : category.label,
                label: category.label,
                segments,
                total,
            };
        })
            .filter((category) => category != null);
    }, [data]);
    const totalValue = useMemo(() => normalizedCategories.reduce((sum, category) => sum + category.total, 0), [normalizedCategories]);
    const safeTotal = totalValue > 0 ? totalValue : 1;
    const segmentLabelOrder = useMemo(() => {
        const order = new Map();
        normalizedCategories.forEach((category) => {
            category.segments.forEach((segment) => {
                if (!order.has(segment.label)) {
                    order.set(segment.label, order.size);
                }
            });
        });
        return order;
    }, [normalizedCategories]);
    const colorAssignments = useMemo(() => {
        const map = new Map();
        normalizedCategories.forEach((category) => {
            category.segments.forEach((segment) => {
                var _a, _b;
                const override = (_a = segment.original.color) !== null && _a !== void 0 ? _a : category.original.color;
                if (!map.has(segment.label)) {
                    const index = (_b = segmentLabelOrder.get(segment.label)) !== null && _b !== void 0 ? _b : map.size;
                    map.set(segment.label, override !== null && override !== void 0 ? override : assignColor(index, segment.label));
                }
                else if (override) {
                    map.set(segment.label, override);
                }
            });
        });
        return map;
    }, [normalizedCategories, segmentLabelOrder, assignColor]);
    const segmentDefinitions = useMemo(() => {
        return Array.from(segmentLabelOrder.entries()).map(([label, index]) => {
            var _a;
            return ({
                id: label,
                label,
                color: (_a = colorAssignments.get(label)) !== null && _a !== void 0 ? _a : assignColor(index, label),
            });
        });
    }, [segmentLabelOrder, colorAssignments, assignColor]);
    const padding = paddingProp !== null && paddingProp !== void 0 ? paddingProp : DEFAULT_PADDING;
    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);
    const gap = Math.max(0, columnGap);
    const effectiveWidth = Math.max(0, plotWidth - gap * Math.max(normalizedCategories.length - 1, 0));
    const yScale = useMemo(() => linearScale([0, 1], [plotHeight, 0]), [plotHeight]);
    const defaultYAxis = useMemo(() => ({
        show: true,
        showTicks: true,
        showLabels: true,
        title: 'Share of category',
        labelFormatter: (value) => `${Math.round(value * 100)}%`,
    }), []);
    const resolvedYAxis = {
        ...defaultYAxis,
        ...(yAxis !== null && yAxis !== void 0 ? yAxis : {}),
        title: (_a = yAxis === null || yAxis === void 0 ? void 0 : yAxis.title) !== null && _a !== void 0 ? _a : defaultYAxis.title,
        labelFormatter: (_b = yAxis === null || yAxis === void 0 ? void 0 : yAxis.labelFormatter) !== null && _b !== void 0 ? _b : defaultYAxis.labelFormatter,
    };
    const yTickValues = useMemo(() => {
        if (Array.isArray(yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks) && yAxis.ticks.length) {
            return yAxis.ticks.map((tick) => {
                if (Math.abs(tick) > 1) {
                    // Treat as percentage input (0-100)
                    return Math.max(0, Math.min(1, tick / 100));
                }
                return Math.max(0, Math.min(1, tick));
            });
        }
        return DEFAULT_Y_TICKS;
    }, [yAxis === null || yAxis === void 0 ? void 0 : yAxis.ticks]);
    const defaultXAxis = useMemo(() => ({
        show: true,
        showTicks: true,
        showLabels: true,
    }), []);
    const resolvedXAxis = {
        ...defaultXAxis,
        ...(xAxis !== null && xAxis !== void 0 ? xAxis : {}),
    };
    let interaction = null;
    try {
        interaction = useChartInteractionContext();
    }
    catch (_x) { }
    const registerSeries = interaction === null || interaction === void 0 ? void 0 : interaction.registerSeries;
    const updateSeriesVisibility = interaction === null || interaction === void 0 ? void 0 : interaction.updateSeriesVisibility;
    const setPointer = interaction === null || interaction === void 0 ? void 0 : interaction.setPointer;
    const setCrosshair = interaction === null || interaction === void 0 ? void 0 : interaction.setCrosshair;
    const interactionSeries = interaction === null || interaction === void 0 ? void 0 : interaction.series;
    const visibilityBySegmentLabel = useMemo(() => {
        const map = new Map();
        segmentDefinitions.forEach((definition) => {
            const override = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((entry) => entry.id === definition.id);
            map.set(definition.label, override ? override.visible !== false : true);
        });
        return map;
    }, [segmentDefinitions, interactionSeries]);
    const visibleTotalValue = useMemo(() => {
        return normalizedCategories.reduce((categoryAcc, category) => {
            const segmentSum = category.segments.reduce((segmentAcc, segment) => {
                return visibilityBySegmentLabel.get(segment.label) === false ? segmentAcc : segmentAcc + segment.value;
            }, 0);
            return categoryAcc + segmentSum;
        }, 0);
    }, [normalizedCategories, visibilityBySegmentLabel]);
    const safeVisibleTotal = visibleTotalValue > 0 ? visibleTotalValue : 1;
    const layout = useMemo(() => {
        if (!normalizedCategories.length || plotWidth <= 0 || plotHeight <= 0) {
            return { categories: [], segments: [] };
        }
        const categories = [];
        const segments = [];
        let cursor = 0;
        normalizedCategories.forEach((category, categoryIndex) => {
            const share = safeTotal > 0 ? category.total / safeTotal : 0;
            const visibleCategoryTotal = category.segments.reduce((acc, segment) => {
                return visibilityBySegmentLabel.get(segment.label) === false ? acc : acc + segment.value;
            }, 0);
            const effectiveCategoryTotal = visibleCategoryTotal > 0 ? visibleCategoryTotal : category.total;
            const visibleCategoryShare = safeVisibleTotal > 0 && visibleCategoryTotal > 0 ? visibleCategoryTotal / safeVisibleTotal : 0;
            const widthPx = effectiveWidth * share;
            if (widthPx <= 0) {
                return;
            }
            const x = cursor;
            const center = x + widthPx / 2;
            const categorySegments = [];
            let usedHeight = 0;
            category.segments.forEach((segment, segmentIndex) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const isVisible = visibilityBySegmentLabel.get(segment.label) !== false;
                const shareOfCategory = category.total > 0 ? segment.value / category.total : 0;
                const visibleShareOfCategory = isVisible && effectiveCategoryTotal > 0 ? segment.value / effectiveCategoryTotal : 0;
                const shareOfTotal = safeTotal > 0 ? segment.value / safeTotal : 0;
                const visibleShareOfTotal = isVisible && safeVisibleTotal > 0 ? segment.value / safeVisibleTotal : 0;
                if (!isVisible && visibleShareOfCategory <= 0 && shareOfCategory <= 0) {
                    return;
                }
                const segmentTop = plotHeight - usedHeight;
                const heightPx = isVisible ? plotHeight * visibleShareOfCategory : 0;
                if (heightPx < 0.0001 && !isVisible) {
                    return;
                }
                const y = segmentTop - heightPx;
                const color = (_c = (_b = (_a = segment.original.color) !== null && _a !== void 0 ? _a : category.original.color) !== null && _b !== void 0 ? _b : colorAssignments.get(segment.label)) !== null && _c !== void 0 ? _c : assignColor((_d = segmentLabelOrder.get(segment.label)) !== null && _d !== void 0 ? _d : segmentIndex, segment.label);
                const visible = isVisible && heightPx > 0;
                const dataPoint = {
                    categoryId: (_e = category.original.id) !== null && _e !== void 0 ? _e : category.id,
                    categoryLabel: category.label,
                    categoryIndex,
                    categoryValue: category.total,
                    categoryShare: share,
                    visibleCategoryTotal: effectiveCategoryTotal,
                    visibleCategoryShare,
                    segmentId: (_f = segment.original.id) !== null && _f !== void 0 ? _f : segment.id,
                    segmentLabel: segment.label,
                    segmentIndex,
                    value: segment.value,
                    segmentShareOfCategory: shareOfCategory,
                    visibleSegmentShareOfCategory: visibleShareOfCategory,
                    segmentShareOfTotal: shareOfTotal,
                    visibleSegmentShareOfTotal: visibleShareOfTotal,
                    color,
                    category: category.original,
                    segment: segment.original,
                    formattedValue: formatNumber(segment.value),
                    formattedSegmentShareOfCategory: formatPercent(shareOfCategory),
                    formattedVisibleSegmentShareOfCategory: formatPercent(visibleShareOfCategory),
                    formattedSegmentShareOfTotal: formatPercent(shareOfTotal),
                    formattedVisibleSegmentShareOfTotal: formatPercent(visibleShareOfTotal),
                };
                const computed = {
                    id: `${String(category.id)}-${String(segment.id)}`,
                    categoryId: (_g = dataPoint.categoryId) !== null && _g !== void 0 ? _g : category.id,
                    categoryLabel: category.label,
                    categoryIndex,
                    segmentId: (_h = dataPoint.segmentId) !== null && _h !== void 0 ? _h : segment.id,
                    segmentLabel: segment.label,
                    segmentIndex,
                    value: segment.value,
                    color,
                    x,
                    y,
                    width: widthPx,
                    height: heightPx,
                    center: { x: x + widthPx / 2, y: y + heightPx / 2 },
                    visible,
                    dataPoint,
                };
                categorySegments.push(computed);
                segments.push(computed);
                if (visible) {
                    usedHeight += heightPx;
                }
            });
            categories.push({
                id: category.id,
                label: category.label,
                index: categoryIndex,
                x,
                width: widthPx,
                center,
                share,
                visibleShare: visibleCategoryShare,
                total: category.total,
                visibleTotal: effectiveCategoryTotal,
                original: category.original,
                segments: categorySegments,
            });
            cursor += widthPx + (categoryIndex < normalizedCategories.length - 1 ? gap : 0);
        });
        return { categories, segments };
    }, [normalizedCategories, plotWidth, plotHeight, effectiveWidth, safeTotal, safeVisibleTotal, gap, colorAssignments, assignColor, segmentLabelOrder, visibilityBySegmentLabel]);
    const normalizedXTicks = useMemo(() => {
        if (!plotWidth)
            return [];
        return layout.categories.map((category) => (category.center / plotWidth));
    }, [layout.categories, plotWidth]);
    const normalizedYTicks = useMemo(() => {
        if (!plotHeight)
            return [];
        return yTickValues.map((tick) => {
            const pixel = yScale(tick);
            return plotHeight ? pixel / plotHeight : 0;
        });
    }, [yTickValues, yScale, plotHeight]);
    const xScale = useMemo(() => {
        const centerMap = new Map();
        layout.categories.forEach((category) => {
            centerMap.set(category.label, category.center);
        });
        const scale = ((value) => { var _a; return (_a = centerMap.get(value)) !== null && _a !== void 0 ? _a : 0; });
        scale.domain = () => layout.categories.map((category) => category.label);
        scale.range = () => [0, plotWidth];
        scale.ticks = () => layout.categories.map((category) => category.label);
        scale.bandwidth = () => 0;
        return scale;
    }, [layout.categories, plotWidth]);
    const yAxisScale = useMemo(() => {
        const scale = ((value) => yScale(value));
        scale.domain = () => [0, 1];
        scale.range = () => [plotHeight, 0];
        scale.ticks = () => yTickValues.slice();
        return scale;
    }, [yScale, plotHeight, yTickValues]);
    const dataSignature = useMemo(() => {
        return normalizedCategories
            .map((category) => {
            const segmentsSig = category.segments
                .map((segment) => `${segment.label}:${segment.value}`)
                .join('|');
            return `${category.label}:${segmentsSig}`;
        })
            .join('||');
    }, [normalizedCategories]);
    const animationProgress = useSharedValue(disabled ? 1 : 0);
    useEffect(() => {
        if (disabled) {
            animationProgress.value = 1;
            return;
        }
        animationProgress.value = 0;
        animationProgress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationProgress, animationDuration, dataSignature, disabled]);
    const hoverRef = useRef(null);
    const handleHoverIn = useCallback((segment) => {
        hoverRef.current = segment.id;
        const pointerX = padding.left + segment.center.x;
        const pointerY = padding.top + segment.center.y;
        setPointer === null || setPointer === void 0 ? void 0 : setPointer({ x: pointerX, y: pointerY, inside: true, data: segment.dataPoint });
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair({ dataX: segment.categoryIndex, pixelX: pointerX });
    }, [padding.left, padding.top, setPointer, setCrosshair]);
    const handleHoverOut = useCallback((segment) => {
        if (hoverRef.current !== segment.id) {
            return;
        }
        hoverRef.current = null;
        setPointer === null || setPointer === void 0 ? void 0 : setPointer(null);
        setCrosshair === null || setCrosshair === void 0 ? void 0 : setCrosshair(null);
    }, [setPointer, setCrosshair]);
    const handlePress = useCallback((segment, pressEvent) => {
        const absoluteX = padding.left + segment.center.x;
        const absoluteY = padding.top + segment.center.y;
        const chartX = width ? absoluteX / width : 0;
        const chartY = height ? absoluteY / height : 0;
        const interactionEvent = {
            nativeEvent: pressEvent.nativeEvent,
            chartX,
            chartY,
            dataX: segment.dataPoint.visibleCategoryShare || segment.dataPoint.categoryShare,
            dataY: segment.dataPoint.visibleSegmentShareOfCategory,
            dataPoint: segment.dataPoint,
        };
        onDataPointPress === null || onDataPointPress === void 0 ? void 0 : onDataPointPress(segment.dataPoint, interactionEvent);
        onPress === null || onPress === void 0 ? void 0 : onPress(interactionEvent);
    }, [height, width, onDataPointPress, onPress, padding.left, padding.top]);
    const legendItems = useMemo(() => {
        if ((legend === null || legend === void 0 ? void 0 : legend.items) && legend.items.length) {
            return legend.items;
        }
        return segmentDefinitions.map((definition) => ({
            label: definition.label,
            color: definition.color,
            visible: visibilityBySegmentLabel.get(definition.label) !== false,
        }));
    }, [legend === null || legend === void 0 ? void 0 : legend.items, segmentDefinitions, visibilityBySegmentLabel]);
    const legendPosition = (_c = legend === null || legend === void 0 ? void 0 : legend.position) !== null && _c !== void 0 ? _c : 'bottom';
    const legendAlign = (_d = legend === null || legend === void 0 ? void 0 : legend.align) !== null && _d !== void 0 ? _d : 'center';
    const showLegend = (_e = legend === null || legend === void 0 ? void 0 : legend.show) !== null && _e !== void 0 ? _e : true;
    const registerSignatureRef = useRef(null);
    useEffect(() => {
        if (!registerSeries)
            return;
        if (!segmentDefinitions.length)
            return;
        const signature = `${dataSignature}|${segmentDefinitions.map((def) => `${def.label}:${def.color}`).join(';')}`;
        if (registerSignatureRef.current === signature)
            return;
        registerSignatureRef.current = signature;
        segmentDefinitions.forEach((definition) => {
            const points = layout.categories.map((category, index) => {
                const matching = category.segments.find((segment) => segment.segmentLabel === definition.label);
                const share = matching ? matching.dataPoint.visibleSegmentShareOfTotal : 0;
                return {
                    x: index,
                    y: share,
                    meta: matching
                        ? {
                            label: matching.dataPoint.segmentLabel,
                            formattedValue: matching.dataPoint.formattedValue,
                            value: matching.dataPoint.value,
                            shareOfTotal: matching.dataPoint.visibleSegmentShareOfTotal,
                            formattedShareOfTotal: matching.dataPoint.formattedVisibleSegmentShareOfTotal,
                            shareOfCategory: matching.dataPoint.visibleSegmentShareOfCategory,
                            formattedShareOfCategory: matching.dataPoint.formattedVisibleSegmentShareOfCategory,
                            customTooltip: `${matching.dataPoint.formattedValue} · ${matching.dataPoint.formattedVisibleSegmentShareOfTotal} of total (${matching.dataPoint.formattedVisibleSegmentShareOfCategory} of category)`,
                            color: matching.dataPoint.color,
                            raw: matching.dataPoint,
                        }
                        : undefined,
                };
            });
            registerSeries({
                id: definition.id,
                name: definition.label,
                color: definition.color,
                points,
                visible: visibilityBySegmentLabel.get(definition.label) !== false,
            });
        });
    }, [registerSeries, segmentDefinitions, layout.categories, visibilityBySegmentLabel, dataSignature]);
    const xTickFormatter = useCallback((value) => {
        const category = layout.categories.find((entry) => entry.label === value);
        if (!category)
            return value;
        if (categoryLabelFormatter) {
            return categoryLabelFormatter(category.original, category.index);
        }
        if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter) {
            return xAxis.labelFormatter(category.index);
        }
        return category.label;
    }, [layout.categories, categoryLabelFormatter, xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelFormatter]);
    const yTickFormatter = useCallback((value) => {
        return resolvedYAxis.labelFormatter ? resolvedYAxis.labelFormatter(value) : `${Math.round(value * 100)}%`;
    }, [resolvedYAxis.labelFormatter]);
    return (jsxs(ChartContainer, { width: width, height: height, padding: padding, disabled: disabled, animationDuration: animationDuration, style: style, useOwnInteractionProvider: useOwnInteractionProvider, suppressPopover: suppressPopover, interactionConfig: interactionConfig, ...rest, children: [(title || subtitle) && jsx(ChartTitle, { title: title, subtitle: subtitle }), (grid === null || grid === void 0 ? void 0 : grid.show) !== false && plotWidth > 0 && plotHeight > 0 && (jsx(ChartGrid, { grid: {
                    show: true,
                    color: (grid === null || grid === void 0 ? void 0 : grid.color) || theme.colors.grid,
                    thickness: (_f = grid === null || grid === void 0 ? void 0 : grid.thickness) !== null && _f !== void 0 ? _f : 1,
                    style: (_g = grid === null || grid === void 0 ? void 0 : grid.style) !== null && _g !== void 0 ? _g : 'dotted',
                    showMajor: (_h = grid === null || grid === void 0 ? void 0 : grid.showMajor) !== null && _h !== void 0 ? _h : true,
                    showMinor: (_j = grid === null || grid === void 0 ? void 0 : grid.showMinor) !== null && _j !== void 0 ? _j : false,
                    majorLines: grid === null || grid === void 0 ? void 0 : grid.majorLines,
                    minorLines: grid === null || grid === void 0 ? void 0 : grid.minorLines,
                }, plotWidth: plotWidth, plotHeight: plotHeight, xTicks: normalizedXTicks, yTicks: normalizedYTicks, padding: padding })), jsx(Svg, { width: plotWidth, height: plotHeight, style: { position: 'absolute', left: padding.left, top: padding.top }, children: layout.segments.map((segment) => (jsx(AnimatedMarimekkoSegment, { segment: segment, animation: animationProgress, borderRadius: segmentBorderRadius, disabled: disabled, onHoverIn: handleHoverIn, onHoverOut: handleHoverOut, onPress: handlePress }, segment.id))) }), resolvedXAxis.show !== false && layout.categories.length > 0 && (jsx(Axis, { orientation: "bottom", scale: xScale, length: plotWidth, offset: { x: padding.left, y: padding.top + plotHeight }, tickCount: layout.categories.length, tickSize: (_k = resolvedXAxis.tickLength) !== null && _k !== void 0 ? _k : 4, tickPadding: 8, tickFormat: (value) => xTickFormatter(value), label: resolvedXAxis.title, stroke: resolvedXAxis.color || theme.colors.grid, strokeWidth: (_l = resolvedXAxis.thickness) !== null && _l !== void 0 ? _l : 1, showLine: (_m = resolvedXAxis.show) !== null && _m !== void 0 ? _m : true, showTicks: (_o = resolvedXAxis.showTicks) !== null && _o !== void 0 ? _o : true, showLabels: (_p = resolvedXAxis.showLabels) !== null && _p !== void 0 ? _p : true, tickLabelColor: resolvedXAxis.labelColor || theme.colors.textSecondary, tickLabelFontSize: (_q = resolvedXAxis.labelFontSize) !== null && _q !== void 0 ? _q : 11 })), resolvedYAxis.show !== false && (jsx(Axis, { orientation: "left", scale: yAxisScale, length: plotHeight, offset: { x: padding.left, y: padding.top }, tickCount: yTickValues.length, tickSize: (_r = resolvedYAxis.tickLength) !== null && _r !== void 0 ? _r : 4, tickPadding: 6, tickFormat: (value) => yTickFormatter(value), label: resolvedYAxis.title, stroke: resolvedYAxis.color || theme.colors.grid, strokeWidth: (_s = resolvedYAxis.thickness) !== null && _s !== void 0 ? _s : 1, showLine: (_t = resolvedYAxis.show) !== null && _t !== void 0 ? _t : true, showTicks: (_u = resolvedYAxis.showTicks) !== null && _u !== void 0 ? _u : true, showLabels: (_v = resolvedYAxis.showLabels) !== null && _v !== void 0 ? _v : true, tickLabelColor: resolvedYAxis.labelColor || theme.colors.textSecondary, tickLabelFontSize: (_w = resolvedYAxis.labelFontSize) !== null && _w !== void 0 ? _w : 11 })), showLegend && legendItems.length > 0 && (jsx(ChartLegend, { items: legendItems, position: legendPosition, align: legendAlign, textColor: legend === null || legend === void 0 ? void 0 : legend.textColor, fontSize: legend === null || legend === void 0 ? void 0 : legend.fontSize, onItemPress: (legend === null || legend === void 0 ? void 0 : legend.items) || !updateSeriesVisibility ? undefined : (item, index, nativeEvent) => {
                    var _a, _b;
                    const definition = segmentDefinitions[index];
                    if (!definition)
                        return;
                    const currentVisible = (_b = (_a = interactionSeries === null || interactionSeries === void 0 ? void 0 : interactionSeries.find((entry) => entry.id === definition.id)) === null || _a === void 0 ? void 0 : _a.visible) !== null && _b !== void 0 ? _b : (item.visible !== false);
                    const isolate = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
                    if (isolate) {
                        const currentlyVisible = segmentDefinitions
                            .filter((def) => visibilityBySegmentLabel.get(def.label) !== false)
                            .map((def) => def.id);
                        const isSole = currentlyVisible.length === 1 && currentlyVisible[0] === definition.id;
                        segmentDefinitions.forEach((def) => updateSeriesVisibility(def.id, isSole ? true : def.id === definition.id));
                    }
                    else {
                        updateSeriesVisibility === null || updateSeriesVisibility === void 0 ? void 0 : updateSeriesVisibility(definition.id, !(currentVisible !== false));
                    }
                } }))] }));
};
MarimekkoChart.displayName = 'MarimekkoChart';

const Ctx = createContext(null);
/**
 * Hook to access the chart root context
 * @throws Error if used outside of ChartRoot
 */
function useChartRoot() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error('useChartRoot must be used within <ChartRoot>');
    return ctx;
}
/**
 * Root chart component that provides context for scales and layout
 */
const ChartRoot = ({ width, height, padding = { top: 40, right: 20, bottom: 60, left: 80 }, xDomain, yDomain, data, categorical, children, colorAssigner, }) => {
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const scales = useMemo(() => {
        let x = null;
        let y = null;
        if (categorical && Array.isArray(xDomain)) {
            x = bandScale(xDomain, [0, plotWidth], { paddingInner: 0.2, paddingOuter: 0.05 });
        }
        else if (xDomain && Array.isArray(xDomain) && typeof xDomain[0] === 'number') {
            x = linearScale(xDomain, [0, plotWidth]);
        }
        if (yDomain) {
            y = linearScale(yDomain, [plotHeight, 0]);
        }
        return { x, y, color: colorAssigner };
    }, [plotWidth, plotHeight, xDomain, yDomain, categorical, colorAssigner]);
    const value = {
        width,
        height,
        padding,
        plotWidth,
        plotHeight,
        scales,
    };
    return (jsx(Ctx.Provider, { value: value, children: children }));
};
ChartRoot.displayName = 'ChartRoot';

/**
 * ChartsProvider lets multiple charts share one interaction context (pointer, crosshair, series registry, zoom state).
 * Use together with each chart's `useOwnInteractionProvider={false}` and typically `suppressPopover` so only this provider renders a single popover.
 *
 * Example:
 * <ChartsProvider config={{ multiTooltip: true, invertPinchZoom: true, invertWheelZoom: true }}>
 *   <LineChart useOwnInteractionProvider={false} suppressPopover ... />
 *   <ScatterChart useOwnInteractionProvider={false} suppressPopover ... />
 * </ChartsProvider>
 */
const ChartsProvider = ({ config, withPopover = true, style, children, ...rest }) => {
    return (jsx(ChartInteractionProvider, { config: config, children: jsxs(RootOffsetCapture, { style: style, ...rest, children: [children, withPopover && jsx(ChartPopover, {})] }) }));
};
// Alias more explicit name for docs friendliness
const GlobalChartsRoot = ChartsProvider;
// Internal wrapper to capture the absolute page offset once so shared popover can position correctly.
const RootOffsetCapture = ({ children, style, ...rest }) => {
    const ref = useRef(null);
    let ctx = null;
    try {
        ctx = useChartInteractionContext();
    }
    catch (_a) {
        console.warn('ChartsProvider: RootOffsetCapture must be used inside a ChartInteractionProvider context');
    }
    useEffect(() => {
        var _a, _b;
        if (!ref.current || !(ctx === null || ctx === void 0 ? void 0 : ctx.setRootOffset))
            return;
        // Attempt to measure DOM node (web). React Native web: stateNode or ref itself.
        // @ts-ignore internal access best-effort
        const el = ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a._internalFiberInstanceHandleDEV) === null || _b === void 0 ? void 0 : _b.stateNode) || ref.current;
        if (el && el.getBoundingClientRect) {
            const r = el.getBoundingClientRect();
            ctx.setRootOffset({ left: r.left + window.scrollX, top: r.top + window.scrollY });
        }
    }, [ctx === null || ctx === void 0 ? void 0 : ctx.setRootOffset]);
    return jsx(View, { ref: ref, style: [{ position: 'relative' }, style], ...rest, children: children });
};
ChartsProvider.displayName = 'ChartsProvider';

// Root plot area (already positioned by padding); you typically nest layers inside.
const ChartPlot = ({ style, children }) => {
    const { padding, plotWidth, plotHeight } = useChartRoot();
    return (jsx(View, { style: [{ position: 'absolute', left: padding.left, top: padding.top, width: plotWidth, height: plotHeight }, style], children: children }));
};
const ChartLayer = ({ zIndex, pointerEvents = 'none', children, style }) => {
    const ctx = useChartRoot();
    const renderProps = {
        plotWidth: ctx.plotWidth,
        plotHeight: ctx.plotHeight,
        padding: ctx.padding,
        width: ctx.width,
        height: ctx.height,
        scales: ctx.scales,
    };
    return (jsx(View, { style: [{ position: 'absolute', left: 0, top: 0, width: ctx.plotWidth, height: ctx.plotHeight, zIndex }, style], pointerEvents: pointerEvents, children: typeof children === 'function' ? children(renderProps) : children }));
};
ChartPlot.displayName = 'ChartPlot';
ChartLayer.displayName = 'ChartLayer';

export { AreaChart, Axis, BarChart, BubbleChart, CandlestickChart, ChartContainer, ChartGrid, ChartLayer, ChartLegend, ChartPlot, ChartPopover, ChartRoot, ChartThemeProvider, ChartTitle, ChartsProvider, ComboChart, DonutChart, FunnelChart, GaugeChart, GlobalChartsRoot, GroupedBarChart, HeatmapChart, HistogramChart, LineChart, MarimekkoChart, NetworkChart, ParetoChart, PieChart, RadarChart, RadialBarChart, RidgeChart, SankeyChart, ScatterChart, SparklineChart, StackedAreaChart, StackedBarChart, ViolinChart, bandScale, calculateChartDimensions, calculatePieAngle, chartToDataCoordinates, clamp$6 as clamp, colorSchemes, createSmoothPath, dataToChartCoordinates, distance, findClosestDataPoint, formatNumber$2 as formatNumber, formatPercentage, generateLogTicks, generateNiceTicks, generateTicks, generateTimeTicks, getColorFromScheme, getDataDomain, getMultiSeriesDomain, getPointOnCircle$1 as getPointOnCircle, lerp, linearScale, normalizeLineChartData, scaleLinear, scaleLog, scaleTime, setDefaultColorScheme, useChartTheme };
//# sourceMappingURL=index.js.map
