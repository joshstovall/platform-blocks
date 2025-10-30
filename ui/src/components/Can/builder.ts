import { AbilityCore } from './ability';
import { PermissionRule } from './types';

/**
 * Fluent API for building permissions
 */
export class PermissionBuilder {
  private rules: PermissionRule[] = [];

  /**
   * Grant permission
   */
  allow(action: string, subject?: any, field?: string): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: false
    });
    return this;
  }

  /**
   * Deny permission
   */
  forbid(action: string, subject?: any, field?: string): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: true
    });
    return this;
  }

  /**
   * Conditional permission
   */
  allowIf(
    action: string, 
    subject?: any, 
    conditions?: Record<string, any>, 
    field?: string
  ): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: false,
      conditions
    });
    return this;
  }

  /**
   * Conditional denial
   */
  forbidIf(
    action: string, 
    subject?: any, 
    conditions?: Record<string, any>, 
    field?: string
  ): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: true,
      conditions
    });
    return this;
  }

  /**
   * Grant all actions on a subject
   */
  manage(subject: any): this {
    this.rules.push({
      action: '*',
      subject,
      inverted: false
    });
    return this;
  }

  /**
   * Forbid all actions on a subject
   */
  forbidAll(subject: any): this {
    this.rules.push({
      action: '*',
      subject,
      inverted: true
    });
    return this;
  }

  /**
   * Role-based permissions
   */
  role(roleName: string, callback: (role: RoleBuilder) => void): this {
    const roleBuilder = new RoleBuilder(roleName);
    callback(roleBuilder);
    this.rules.push(...roleBuilder.getRules());
    return this;
  }

  /**
   * Build the ability with all rules
   */
  build(): AbilityCore {
    return new AbilityCore(this.rules);
  }

  /**
   * Get all rules
   */
  getRules(): PermissionRule[] {
    return [...this.rules];
  }

  /**
   * Clear all rules
   */
  clear(): this {
    this.rules = [];
    return this;
  }

  /**
   * Merge rules from another builder
   */
  merge(other: PermissionBuilder): this {
    this.rules.push(...other.getRules());
    return this;
  }
}

/**
 * Role-specific permission builder
 */
export class RoleBuilder {
  private rules: PermissionRule[] = [];

  constructor(private roleName: string) {}

  /**
   * Grant permission for this role
   */
  can(action: string, subject?: any, field?: string): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: false,
      conditions: { role: this.roleName }
    });
    return this;
  }

  /**
   * Deny permission for this role
   */
  cannot(action: string, subject?: any, field?: string): this {
    this.rules.push({
      action,
      subject: subject || '*',
      fields: field ? [field] : undefined,
      inverted: true,
      conditions: { role: this.roleName }
    });
    return this;
  }

  /**
   * Manage all actions on subject for this role
   */
  manage(subject: any): this {
    this.rules.push({
      action: '*',
      subject,
      inverted: false,
      conditions: { role: this.roleName }
    });
    return this;
  }

  /**
   * Get all rules for this role
   */
  getRules(): PermissionRule[] {
    return [...this.rules];
  }
}

/**
 * Common permission patterns
 */
export class PermissionPatterns {
  /**
   * Admin permissions - can do everything
   */
  static admin(): PermissionBuilder {
    return new PermissionBuilder()
      .manage('*');
  }

  /**
   * User permissions - basic CRUD on own resources
   */
  static user(userId: string): PermissionBuilder {
    return new PermissionBuilder()
      .allowIf('read', 'User', { id: userId })
      .allowIf('update', 'User', { id: userId })
      .allowIf('delete', 'User', { id: userId })
      .allow('read', 'public');
  }

  /**
   * Guest permissions - read-only public content
   */
  static guest(): PermissionBuilder {
    return new PermissionBuilder()
      .allow('read', 'public');
  }

  /**
   * Moderator permissions - manage content but not users
   */
  static moderator(): PermissionBuilder {
    return new PermissionBuilder()
      .manage('Content')
      .manage('Comment')
      .allow('read', 'User')
      .forbid('delete', 'User');
  }

  /**
   * Owner permissions - full control over owned resources
   */
  static owner(ownerId: string): PermissionBuilder {
    return new PermissionBuilder()
      .allowIf('*', '*', { ownerId })
      .allow('create', '*');
  }
}

/**
 * Helper function to create a new permission builder
 */
export function permissions(): PermissionBuilder {
  return new PermissionBuilder();
}

/**
 * Helper function to create ability from rules array
 */
export function defineAbility(callback: (builder: PermissionBuilder) => void): AbilityCore {
  const builder = new PermissionBuilder();
  callback(builder);
  return builder.build();
}

/**
 * Helper function to create common role-based abilities
 */
export function defineRoleAbility(
  role: string,
  callback: (role: RoleBuilder) => void
): AbilityCore {
  const roleBuilder = new RoleBuilder(role);
  callback(roleBuilder);
  return new AbilityCore(roleBuilder.getRules());
}