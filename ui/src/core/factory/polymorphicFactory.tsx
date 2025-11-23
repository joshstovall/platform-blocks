import React, { forwardRef } from 'react';

import { ComponentWithProps, FactoryPayload } from './factory';

type DefaultProps = Record<string, unknown>;

// Polymorphic component types
type ElementType = keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>;

type PropsOf<C extends ElementType> = React.JSX.LibraryManagedAttributes<
  C,
  React.ComponentPropsWithoutRef<C>
>;

type ComponentProp<C> = {
  component?: C;
};

type ExtendedProps<Props = DefaultProps, OverrideProps = DefaultProps> = OverrideProps &
  Omit<Props, keyof OverrideProps>;

type InheritedProps<C extends ElementType, Props = DefaultProps> = ExtendedProps<PropsOf<C>, Props>;

export type PolymorphicRef<C> = C extends React.ElementType
  ? React.ComponentPropsWithRef<C>['ref']
  : never;

export type PolymorphicComponentProps<C, Props = DefaultProps> = C extends React.ElementType
  ? InheritedProps<C, Props & ComponentProp<C>> & {
      ref?: PolymorphicRef<C>;
    }
  : Props & { component: React.ElementType };

// Polymorphic factory payload
export interface PolymorphicFactoryPayload extends FactoryPayload {
  defaultComponent: any;
  defaultRef: any;
}

// Polymorphic component interface
export interface PolymorphicComponent<Payload extends PolymorphicFactoryPayload>
  extends ComponentWithProps<Payload['props']> {
  <C = Payload['defaultComponent']>(
    props: PolymorphicComponentProps<C, Payload['props']>
  ): React.ReactElement;
  extend: any;
  displayName?: string;
}

/**
 * Factory function for creating polymorphic PlatformBlocks components
 */
export function polymorphicFactory<Payload extends PolymorphicFactoryPayload>(
  ui: React.ForwardRefRenderFunction<Payload['defaultRef'], Payload['props']>
): PolymorphicComponent<Payload> {
  const Component = forwardRef(ui) as any;

  Component.withProps = (fixedProps: any) => {
    const Extended = forwardRef((props, ref) => (
      <Component {...fixedProps} {...props} ref={ref} />
    )) as any;
    Extended.extend = Component.extend;
    Extended.displayName = `WithProps(${Component.displayName})`;
    return Extended;
  };

  Component.extend = ((input: any) => input) as any;

  return Component as PolymorphicComponent<Payload>;
}

/**
 * Creates a polymorphic component from a regular component
 */
export function createPolymorphicComponent<
  ComponentDefaultType,
  Props,
  StaticComponents = Record<string, never>,
>(component: any) {
  type ComponentProps<C> = PolymorphicComponentProps<C, Props>;

  type _PolymorphicComponent = <C = ComponentDefaultType>(
    props: ComponentProps<C>
  ) => React.ReactElement;

  type ComponentProperties = Omit<React.FunctionComponent<ComponentProps<any>>, never>;

  type PolymorphicComponent = _PolymorphicComponent & ComponentProperties & StaticComponents;

  return component as PolymorphicComponent;
}

// Helper type for creating polymorphic factory interfaces
export type PolymorphicFactory<Payload extends PolymorphicFactoryPayload> = Payload;
