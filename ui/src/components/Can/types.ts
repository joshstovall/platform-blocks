import React from 'react';
import { ViewStyle } from 'react-native';

/**
 * Possible permission actions
 */
export type Action = string;

/**
 * Subject type - can be string, class, or object
 */
export type Subject = string | Function | object;

/**
 * Field within a subject
 */
export type Field = string;

/**
 * Conditions for permissions (for object-level permissions)
 */
export type Conditions = Record<string, any>;

/**
 * Permission rule definition
 */
export interface PermissionRule {
  /** Action being performed */
  action: Action | Action[];
  /** Subject being acted upon */
  subject: Subject | Subject[];
  /** Fields within the subject (optional) */
  fields?: Field[];
  /** Conditions that must be met (optional) */
  conditions?: Conditions;
  /** Whether this rule grants or denies permission */
  inverted?: boolean;
  /** Human-readable reason for the rule */
  reason?: string;
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  /** Whether permission is granted */
  allowed: boolean;
  /** Reason for the decision */
  reason?: string;
  /** Matched rule */
  rule?: PermissionRule;
}

/**
 * Ability interface for checking permissions
 */
export interface Ability {
  /** Check if action is allowed on subject */
  can(action: Action, subject: Subject, field?: Field): boolean;
  /** Check if action is forbidden on subject */
  cannot(action: Action, subject: Subject, field?: Field): boolean;
  /** Get detailed permission check result */
  check(action: Action, subject: Subject, field?: Field): PermissionCheck;
  /** Update ability rules */
  update(rules: PermissionRule[]): void;
  /** Get all current rules */
  getRules(): PermissionRule[];
  /** Clear all rules */
  clear(): void;
}

/**
 * Can component props for basic usage
 */
export interface CanProps {
  /** Action to check */
  I: Action;
  /** Subject to check against */
  a?: Subject;
  /** Specific field to check (optional) */
  field?: Field;
  /** Children to render when permission is granted */
  children?: React.ReactNode;
  /** Alternative content when permission is denied */
  fallback?: React.ReactNode;
  /** Custom ability instance (optional) */
  ability?: Ability;
  /** Additional styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Whether to passthrough (render children regardless) for development */
  passthrough?: boolean;
}

/**
 * Enhanced Can component props with conditions
 */
export interface CanWithConditionsProps extends Omit<CanProps, 'a'> {
  /** Subject instance with data for condition checking */
  this: object;
}

/**
 * Cannot component props (inverse of Can)
 */
export interface CannotProps extends CanProps {
  /** This component renders when permission is NOT granted */
}

/**
 * Permission gate props for route-level protection
 */
export interface PermissionGateProps {
  /** Required permissions (all must pass) */
  permissions: Array<{
    action: Action;
    subject: Subject;
    field?: Field;
  }>;
  /** Children to render when all permissions pass */
  children: React.ReactNode;
  /** Fallback when permissions fail */
  fallback?: React.ReactNode;
  /** Custom ability instance */
  ability?: Ability;
  /** Redirect function for navigation-based fallbacks */
  onUnauthorized?: () => void;
}

/**
 * Permission context value
 */
export interface PermissionContextValue {
  /** Current ability instance */
  ability: Ability;
  /** Update ability rules */
  updateAbility: (rules: PermissionRule[]) => void;
  /** Check if user can perform action */
  can: (action: Action, subject: Subject, field?: Field) => boolean;
  /** Check if user cannot perform action */
  cannot: (action: Action, subject: Subject, field?: Field) => boolean;
  /** Get current user context */
  user?: any;
  /** Update user context */
  setUser?: (user: any) => void;
}

/**
 * Permission provider props
 */
export interface PermissionProviderProps {
  /** Initial permission rules */
  rules?: PermissionRule[];
  /** Initial user context */
  user?: any;
  /** Children components */
  children: React.ReactNode;
  /** Development mode settings */
  dev?: {
    /** Log permission checks */
    logChecks?: boolean;
    /** Warn about missing permissions */
    warnMissing?: boolean;
    /** Allow passthrough in development */
    allowPassthrough?: boolean;
  };
}

/**
 * Hook options for usePermissions
 */
export interface UsePermissionsOptions {
  /** Whether to log permission checks */
  debug?: boolean;
  /** Throw error if no ability found */
  required?: boolean;
}

/**
 * Permission definition for bulk operations
 */
export interface PermissionDefinition {
  /** Actions for this resource */
  actions: Action[];
  /** Subject type */
  subject: Subject;
  /** Default conditions */
  conditions?: Conditions;
  /** Description */
  description?: string;
}

/**
 * Role-based permission set
 */
export interface RolePermissions {
  /** Role name */
  role: string;
  /** Permission rules for this role */
  rules: PermissionRule[];
  /** Description of the role */
  description?: string;
  /** Whether role is active */
  active?: boolean;
}

/**
 * Permission builder for fluent API
 */
export interface PermissionBuilder {
  /** Add a permission rule */
  allow(action: Action | Action[]): PermissionSubjectBuilder;
  /** Add a denial rule */
  deny(action: Action | Action[]): PermissionSubjectBuilder;
  /** Build the rules array */
  build(): PermissionRule[];
}

export interface PermissionSubjectBuilder {
  /** Specify the subject */
  on(subject: Subject | Subject[]): PermissionFieldBuilder;
}

export interface PermissionFieldBuilder {
  /** Specify fields (optional) */
  fields(fields: Field[]): PermissionConditionBuilder;
  /** Specify conditions */
  when(conditions: Conditions): PermissionRuleBuilder;
  /** Add reason */
  because(reason: string): PermissionRuleBuilder;
  /** Finish building this rule */
  build(): PermissionRule;
}

export interface PermissionConditionBuilder {
  /** Specify conditions */
  when(conditions: Conditions): PermissionRuleBuilder;
  /** Add reason */
  because(reason: string): PermissionRuleBuilder;
  /** Finish building this rule */
  build(): PermissionRule;
}

export interface PermissionRuleBuilder {
  /** Add reason */
  because(reason: string): PermissionRuleBuilder;
  /** Finish building this rule */
  build(): PermissionRule;
}