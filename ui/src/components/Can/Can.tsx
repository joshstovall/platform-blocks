import React from 'react';
import { View } from 'react-native';
import { 
  CanProps, 
  CanWithConditionsProps, 
  CannotProps, 
  PermissionGateProps 
} from './types';
import { usePermissions } from './context';

/**
 * Can Component - Renders children if permission is granted
 */
export const Can: React.FC<CanProps> = ({
  I: action,
  a: subject,
  field,
  children,
  fallback = null,
  ability: customAbility,
  style,
  testID,
  passthrough = false
}) => {
  const { ability: contextAbility } = usePermissions();
  const ability = customAbility || contextAbility;

  // Development passthrough
  if (passthrough && __DEV__) {
    return React.createElement(View, { style, testID }, children);
  }

  const hasPermission = subject 
    ? ability.can(action, subject, field)
    : ability.can(action, '*', field);

  if (hasPermission) {
    return React.createElement(View, { style, testID }, children);
  }

  return React.createElement(View, { style, testID }, fallback);
};

/**
 * Can Component with conditions - For object-level permissions
 */
export const CanWithConditions: React.FC<CanWithConditionsProps> = ({
  I: action,
  this: subject,
  field,
  children,
  fallback = null,
  ability: customAbility,
  style,
  testID,
  passthrough = false
}) => {
  const { ability: contextAbility } = usePermissions();
  const ability = customAbility || contextAbility;

  // Development passthrough
  if (passthrough && __DEV__) {
    return React.createElement(View, { style, testID }, children);
  }

  const hasPermission = ability.can(action, subject, field);

  if (hasPermission) {
    return React.createElement(View, { style, testID }, children);
  }

  return React.createElement(View, { style, testID }, fallback);
};

/**
 * Cannot Component - Renders children if permission is NOT granted
 */
export const Cannot: React.FC<CannotProps> = ({
  I: action,
  a: subject,
  field,
  children,
  fallback = null,
  ability: customAbility,
  style,
  testID,
  passthrough = false
}) => {
  const { ability: contextAbility } = usePermissions();
  const ability = customAbility || contextAbility;

  // Development passthrough
  if (passthrough && __DEV__) {
    return React.createElement(View, { style, testID }, fallback);
  }

  const hasPermission = subject 
    ? ability.can(action, subject, field)
    : ability.can(action, '*', field);

  if (!hasPermission) {
    return React.createElement(View, { style, testID }, children);
  }

  return React.createElement(View, { style, testID }, fallback);
};

/**
 * Permission Gate - Requires ALL permissions to pass
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  children,
  fallback = null,
  ability: customAbility,
  onUnauthorized
}) => {
  const { ability: contextAbility } = usePermissions();
  const ability = customAbility || contextAbility;

  const allPermissionsGranted = permissions.every(({ action, subject, field }) =>
    ability.can(action, subject, field)
  );

  React.useEffect(() => {
    if (!allPermissionsGranted && onUnauthorized) {
      onUnauthorized();
    }
  }, [allPermissionsGranted, onUnauthorized]);

  if (allPermissionsGranted) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(React.Fragment, null, fallback);
};

/**
 * Higher-Order Component for permission checking
 */
export function withCan<P extends object>(
  action: string,
  subject?: any,
  field?: string
) {
  return function CanHOC(Component: React.ComponentType<P>) {
    const WrappedComponent: React.FC<P & { fallback?: React.ReactNode }> = (props) => {
      const { fallback, ...componentProps } = props;
      
      return React.createElement(
        Can,
        { I: action, a: subject, field, fallback },
        React.createElement(Component, componentProps as P)
      );
    };

    WrappedComponent.displayName = `withCan(${Component.displayName || Component.name})`;
    return WrappedComponent;
  };
}

/**
 * Higher-Order Component for permission denial checking
 */
export function withCannot<P extends object>(
  action: string,
  subject?: any,
  field?: string
) {
  return function CannotHOC(Component: React.ComponentType<P>) {
    const WrappedComponent: React.FC<P & { fallback?: React.ReactNode }> = (props) => {
      const { fallback, ...componentProps } = props;
      
      return React.createElement(
        Cannot,
        { I: action, a: subject, field, fallback },
        React.createElement(Component, componentProps as P)
      );
    };

    WrappedComponent.displayName = `withCannot(${Component.displayName || Component.name})`;
    return WrappedComponent;
  };
}