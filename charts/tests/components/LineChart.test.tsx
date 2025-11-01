import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { LineChart } from '../../src/components/LineChart/LineChart';

const pointerListeners = new Map<string, Set<(event: any) => void>>();
const documentListeners = new Map<string, Set<(event: any) => void>>();
const originalWindow: any = (global as any).window;
const originalDocument: any = (global as any).document;

beforeAll(() => {
  if (!(global as any).window) {
    (global as any).window = {};
  }
  const win = (global as any).window as any;
  win.PointerEvent = win.PointerEvent || function PointerEvent() {};

  win.addEventListener = jest.fn((type: string, handler: (event: any) => void) => {
    if (!pointerListeners.has(type)) {
      pointerListeners.set(type, new Set());
    }
    pointerListeners.get(type)!.add(handler);
  });

  win.removeEventListener = jest.fn((type: string, handler: (event: any) => void) => {
    pointerListeners.get(type)?.delete(handler);
  });

  win.dispatchEvent = jest.fn((event: any) => {
    pointerListeners.get(event.type)?.forEach(listener => listener(event));
    return true;
  });

  if (!(global as any).document) {
    (global as any).document = {};
  }
  const doc = (global as any).document as any;

  doc.addEventListener = jest.fn((type: string, handler: (event: any) => void) => {
    if (!documentListeners.has(type)) {
      documentListeners.set(type, new Set());
    }
    documentListeners.get(type)!.add(handler);
  });

  doc.removeEventListener = jest.fn((type: string, handler: (event: any) => void) => {
    documentListeners.get(type)?.delete(handler);
  });

  doc.dispatchEvent = jest.fn((event: any) => {
    documentListeners.get(event.type)?.forEach(listener => listener(event));
    return true;
  });

});

afterAll(() => {
  if (originalWindow) {
    (global as any).window = originalWindow;
  } else {
    delete (global as any).window;
  }

  if (originalDocument) {
    (global as any).document = originalDocument;
  } else {
    delete (global as any).document;
  }

});

beforeEach(() => {
  pointerListeners.clear();
  documentListeners.clear();
  const win = (global as any).window as any;
  win.addEventListener.mockClear?.();
  win.removeEventListener.mockClear?.();
  win.dispatchEvent.mockClear?.();
  const doc = (global as any).document as any;
  doc.addEventListener.mockClear?.();
  doc.removeEventListener.mockClear?.();
  doc.dispatchEvent.mockClear?.();
});

type MockInteractionModule = {
  __createMockInteractionState: () => any;
  __setMockInteractionState: (state: any) => void;
};

type NearestPointModule = {
  useNearestPoint: jest.Mock;
  __setNearestPointImpl: (impl: (chartX: number, chartY: number, radius: number) => any) => void;
};

jest.mock('../../src/hooks/useNearestPoint', () => {
  let nearestFn: (chartX: number, chartY: number, radius: number) => any = () => null;
  const hook = jest.fn(() => nearestFn);
  return {
    __esModule: true,
    useNearestPoint: hook,
    __setNearestPointImpl: (impl: (chartX: number, chartY: number, radius: number) => any) => {
      nearestFn = impl;
    },
  };
});

jest.mock('../../src/interaction/ChartInteractionContext', () => {
  const actual = jest.requireActual('../../src/interaction/ChartInteractionContext');

  const createState = () => {
    const state: any = {
      config: { multiTooltip: true, popoverPortal: false },
      pointer: null,
      crosshair: null,
      selectedPoints: [],
      series: [] as any[],
      domains: null,
      rootOffset: null,
    };

    state.registerSeries = jest.fn((series: any) => {
      const entry = {
        id: series.id,
        name: series.name,
        color: series.color,
        points: series.points,
        visible: series.visible ?? true,
      };
      const idx = state.series.findIndex((item: any) => item.id === series.id);
      if (idx >= 0) {
        state.series[idx] = entry;
      } else {
        state.series.push(entry);
      }
    });

    state.updateSeriesVisibility = jest.fn((id: string | number, visible: boolean) => {
      const target = state.series.find((item: any) => item.id === id);
      if (target) {
        target.visible = visible;
      }
    });

    state.setPointer = jest.fn((pointer: any) => {
      state.pointer = pointer;
    });

    state.setCrosshair = jest.fn((crosshair: any) => {
      state.crosshair = crosshair;
    });

    state.setDomains = jest.fn();
    state.initializeDomains = jest.fn();
    state.resetZoom = jest.fn();
    state.setRootOffset = jest.fn();

    return state;
  };

  let mockState = createState();

  return {
    __esModule: true,
    ...actual,
    useChartInteractionContext: jest.fn(() => mockState),
    __createMockInteractionState: () => createState(),
    __setMockInteractionState: (nextState: any) => {
      mockState = nextState;
    },
  };
});

const interactionModule: MockInteractionModule = require('../../src/interaction/ChartInteractionContext');
const nearestPointModule: NearestPointModule = require('../../src/hooks/useNearestPoint');

const seriesData = [
  {
    id: 'alpha',
    name: 'Alpha',
    data: [
      { id: 'alpha-0', x: 0, y: 10 },
      { id: 'alpha-1', x: 1, y: 14 },
    ],
  },
  {
    id: 'beta',
    name: 'Beta',
    data: [
      { id: 'beta-0', x: 0, y: 6 },
      { id: 'beta-1', x: 1, y: 9 },
    ],
  },
];

const findPressableByLabel = (root: any, label: string) => {
  const textNode = root.findAll(
    (node: any) => {
      if (node.type !== 'Text') {
        return false;
      }
      const children = node.props?.children;
      if (typeof children === 'string') {
        return children === label;
      }
      if (Array.isArray(children)) {
        return children.includes(label);
      }
      return false;
    },
    { deep: true }
  )[0];

  if (!textNode) {
    return undefined;
  }

  let current = textNode.parent;
  while (current) {
    if (typeof current.props?.onPress === 'function') {
      return current;
    }
    current = current.parent;
  }

  return undefined;
};

describe('LineChart', () => {
  let mockInteractionState: any;

  const renderLine = (props?: Partial<React.ComponentProps<typeof LineChart>>) => {
    const { series, data, legend, ...rest } = props ?? {};
    const chartSeries = series ?? seriesData;
    const legendConfig = { show: true, ...(legend || {}) };
    return render(
      <ChartThemeProvider>
        <LineChart
          width={360}
          height={240}
          series={chartSeries}
          enableSeriesToggle
          disableAnimations
          legend={legendConfig}
          {...rest}
        />
      </ChartThemeProvider>
    );
  };

  beforeEach(() => {
    mockInteractionState = interactionModule.__createMockInteractionState();
    interactionModule.__setMockInteractionState(mockInteractionState);
    nearestPointModule.__setNearestPointImpl(() => null);
  });

  it('registers series and fires data point callbacks with pointer updates', async () => {
    const onPress = jest.fn();
    const onDataPointPress = jest.fn();

    nearestPointModule.__setNearestPointImpl(() => ({
      dataPoint: seriesData[0].data[1],
      distance: 2,
    }));

    const renderResult = renderLine({ onPress, onDataPointPress });

    await waitFor(() => {
      expect(mockInteractionState.series.length).toBe(2);
    });

    const alphaSeries = mockInteractionState.series.find((entry: any) => entry.id === 'alpha');
    expect(alphaSeries).toBeTruthy();
    expect(alphaSeries.points[0].meta).toEqual(seriesData[0].data[0]);

    const chartPressable = renderResult.UNSAFE_root.findAll(
      (node: any) => {
        if (typeof node.props?.onPress !== 'function') return false;
        const styleProp = node.props.style;
        const styles = Array.isArray(styleProp) ? styleProp : [styleProp];
        return styles.some((s: any) => s && typeof s.width === 'number' && typeof s.height === 'number');
      },
      { deep: true }
    )[0];

    fireEvent.press(chartPressable!, {
      nativeEvent: {
        locationX: 120,
        locationY: 100,
        pageX: 140,
        pageY: 160,
      },
    });

    expect(onPress).toHaveBeenCalled();
    await waitFor(() => {
      expect(onDataPointPress).toHaveBeenCalledTimes(1);
    });

    expect(mockInteractionState.setPointer).toHaveBeenCalledWith(
      expect.objectContaining({ inside: true })
    );
  });

  it('toggles series visibility and isolates with shift-click legend interactions', async () => {
    const renderResult = renderLine();

    await waitFor(() => {
      expect(mockInteractionState.series.length).toBe(2);
    });

    const alphaLegend = findPressableByLabel(renderResult.UNSAFE_root, 'Alpha');
    const betaLegend = findPressableByLabel(renderResult.UNSAFE_root, 'Beta');

    expect(alphaLegend).toBeTruthy();
    expect(betaLegend).toBeTruthy();

    await act(async () => {
      alphaLegend?.props?.onPress?.({ nativeEvent: {} });
    });
    expect(mockInteractionState.updateSeriesVisibility).toHaveBeenCalledWith('alpha', false);

    mockInteractionState.updateSeriesVisibility.mockClear();

    await act(async () => {
      const pointerDown: any = new Event('pointerdown');
      pointerDown.shiftKey = true;
      window.dispatchEvent(pointerDown);
    });

    await act(async () => {
      betaLegend?.props?.onPress?.({ nativeEvent: { shiftKey: true } });
    });
    expect(mockInteractionState.updateSeriesVisibility.mock.calls).toEqual([
      ['alpha', false],
      ['beta', true],
    ]);
  });
});
