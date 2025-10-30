import React, { useRef, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { ChartInteractionProvider, InteractionConfig } from './interaction/ChartInteractionContext';
import { ChartPopover } from './interaction/ChartPopover';

export interface ChartsProviderProps extends ViewProps {
  /** Shared interaction configuration for all nested charts */
  config?: InteractionConfig;
  /** Automatically render a single shared ChartPopover (disable to mount manually) */
  withPopover?: boolean;
  /** Render children */
  children: React.ReactNode;
}

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
export const ChartsProvider: React.FC<ChartsProviderProps> = ({ config, withPopover = true, style, children, ...rest }) => {
  return (
    <ChartInteractionProvider config={config}>
      <RootOffsetCapture style={style} {...rest}>
        {children}
        {withPopover && <ChartPopover />}
      </RootOffsetCapture>
    </ChartInteractionProvider>
  );
};

// Alias more explicit name for docs friendliness
export const GlobalChartsRoot = ChartsProvider;

// Internal wrapper to capture the absolute page offset once so shared popover can position correctly.
const RootOffsetCapture: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  const ref = useRef<View>(null);
  const { useChartInteractionContext } = require('./interaction/ChartInteractionContext');
  let ctx: any = null; try { ctx = useChartInteractionContext(); } catch {
    console.warn('ChartsProvider: RootOffsetCapture must be used inside a ChartInteractionProvider context');
  }
  useEffect(()=>{
    if(!ref.current || !ctx?.setRootOffset) return;
    // Attempt to measure DOM node (web). React Native web: stateNode or ref itself.
    // @ts-ignore internal access best-effort
    const el = (ref.current as any)?._internalFiberInstanceHandleDEV?.stateNode || ref.current;
    if(el && el.getBoundingClientRect){
      const r = el.getBoundingClientRect();
      ctx.setRootOffset({ left: r.left + window.scrollX, top: r.top + window.scrollY });
    }
  },[ctx?.setRootOffset]);
  return <View ref={ref} style={[{ position:'relative' }, style]} {...rest}>{children}</View>;
};

ChartsProvider.displayName = 'ChartsProvider';
