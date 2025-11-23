import React, { forwardRef, memo } from 'react';
import { UniversalSystemProps } from '../utils/universal';

type UnknownProps = Record<string, unknown>;

// Base factory payload interface
export interface FactoryPayload {
  props: any & UniversalSystemProps;
  ref: any;
  staticComponents?: Record<string, any>;
}

// Component with static properties
export interface ComponentWithProps<Props = UnknownProps, RefType = any> {
  withProps: <T extends Partial<Props>>(fixedProps: T) => any;
}

export interface PlatformBlocksComponent<Payload extends FactoryPayload>
  extends React.ForwardRefExoticComponent<
      React.PropsWithoutRef<Payload['props']> & React.RefAttributes<Payload['ref']>
    >,
    ComponentWithProps<Payload['props'], Payload['ref']> {
  extend: any;
  displayName?: string;
}

/**
 * Factory function for creating PlatformBlocks components
 */
export interface FactoryOptions<Payload extends FactoryPayload> {
  /**
   * Optional display name applied to the resulting component. If omitted, React will infer the name.
   */
  displayName?: string;
  /**
   * Enable or disable memoization. Defaults to `true`.
   */
  memo?: boolean;
  /**
   * Optional custom comparison used when memoization is enabled.
   */
  arePropsEqual?: (
    prevProps: Readonly<Payload['props']>,
    nextProps: Readonly<Payload['props']>
  ) => boolean;
}

export function factory<Payload extends FactoryPayload>(
  ui: React.ForwardRefRenderFunction<Payload['ref'], Payload['props']>,
  options: FactoryOptions<Payload> = {}
): PlatformBlocksComponent<Payload> {
  const { displayName, memo: shouldMemo = true, arePropsEqual } = options;

  const ForwardComponent = forwardRef(ui) as React.ForwardRefExoticComponent<any> & {
    displayName?: string;
  };

  if (displayName) {
    ForwardComponent.displayName = displayName;
  }

  const MemoizedComponent = shouldMemo
    ? memo(ForwardComponent, arePropsEqual)
    : ForwardComponent;

  const Component = MemoizedComponent as any;

  Component.withProps = (fixedProps: any) => {
    const ExtendedForward = forwardRef((props, ref) => (
      <ForwardComponent {...fixedProps} {...props} ref={ref} />
    )) as React.ForwardRefExoticComponent<any> & { displayName?: string };

    const baseName = ForwardComponent.displayName || ui.name || 'PlatformBlocksComponent';
    ExtendedForward.displayName = `WithProps(${baseName})`;

    const ExtendedComponent = shouldMemo
      ? memo(ExtendedForward, arePropsEqual)
      : ExtendedForward;

    const Extended = ExtendedComponent as any;
    Extended.extend = Component.extend;
    Extended.withProps = Component.withProps;
    return Extended;
  };

  Component.extend = ((input: any) => input) as any;

  return Component as PlatformBlocksComponent<Payload>;
}

// Helper type for creating factory interfaces
export type Factory<Payload extends FactoryPayload> = Payload;
