// Core components
export { Can, CanWithConditions, Cannot, PermissionGate, withCan, withCannot } from './Can';

// Context and hooks
export { PermissionProvider, usePermissions, useAbility } from './context';

// Ability class
export { AbilityCore } from './ability';

// Builder utilities
export { 
  PermissionBuilder, 
  RoleBuilder, 
  PermissionPatterns,
  permissions,
  defineAbility,
  defineRoleAbility 
} from './builder';

// Types
export type {
  Action,
  Subject,
  Field,
  Conditions,
  PermissionRule,
  PermissionCheck,
  Ability,
  CanProps,
  CanWithConditionsProps,
  CannotProps,
  PermissionGateProps,
  PermissionContextValue,
  PermissionProviderProps,
  UsePermissionsOptions
} from './types';

// Re-export for convenience (alias for easier usage)
export { AbilityCore as PermissionAbility } from './ability';