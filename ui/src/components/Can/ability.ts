import { 
  Action, 
  Subject, 
  Field, 
  Conditions, 
  PermissionRule, 
  PermissionCheck, 
  Ability 
} from './types';

/**
 * Core Ability class for managing permissions
 */
export class AbilityCore implements Ability {
  private rules: PermissionRule[] = [];
  private cache = new Map<string, PermissionCheck>();

  constructor(rules: PermissionRule[] = []) {
    this.rules = [...rules];
  }

  /**
   * Check if action is allowed on subject
   */
  can(action: Action, subject: Subject, field?: Field): boolean {
    return this.check(action, subject, field).allowed;
  }

  /**
   * Check if action is forbidden on subject
   */
  cannot(action: Action, subject: Subject, field?: Field): boolean {
    return !this.can(action, subject, field);
  }

  /**
   * Get detailed permission check result
   */
  check(action: Action, subject: Subject, field?: Field): PermissionCheck {
    const cacheKey = this.getCacheKey(action, subject, field);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const result = this.performCheck(action, subject, field);
    this.cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Update ability rules and clear cache
   */
  update(rules: PermissionRule[]): void {
    this.rules = [...rules];
    this.cache.clear();
  }

  /**
   * Get all current rules
   */
  getRules(): PermissionRule[] {
    return [...this.rules];
  }

  /**
   * Clear all rules and cache
   */
  clear(): void {
    this.rules = [];
    this.cache.clear();
  }

  /**
   * Perform the actual permission check
   */
  private performCheck(action: Action, subject: Subject, field?: Field): PermissionCheck {
    // Start with denied by default
    let result: PermissionCheck = {
      allowed: false,
      reason: 'No matching permission rule found'
    };

    // Check rules in order (later rules can override earlier ones)
    for (const rule of this.rules) {
      if (this.ruleMatches(rule, action, subject, field)) {
        result = {
          allowed: !rule.inverted,
          reason: rule.reason || (rule.inverted ? 'Access denied by rule' : 'Access granted by rule'),
          rule
        };
      }
    }

    return result;
  }

  /**
   * Check if a rule matches the current permission check
   */
  private ruleMatches(rule: PermissionRule, action: Action, subject: Subject, field?: Field): boolean {
    // Check action match
    const actions = Array.isArray(rule.action) ? rule.action : [rule.action];
    if (!actions.includes(action) && !actions.includes('*')) {
      return false;
    }

    // Check subject match
    const subjects = Array.isArray(rule.subject) ? rule.subject : [rule.subject];
    if (!this.subjectMatches(subjects, subject)) {
      return false;
    }

    // Check field match (if specified)
    if (field && rule.fields && !rule.fields.includes(field)) {
      return false;
    }

    // Check conditions (if subject is an object)
    if (rule.conditions && typeof subject === 'object' && subject !== null) {
      return this.conditionsMatch(rule.conditions, subject);
    }

    return true;
  }

  /**
   * Check if subject matches any of the rule subjects
   */
  private subjectMatches(ruleSubjects: Subject[], checkSubject: Subject): boolean {
    for (const ruleSubject of ruleSubjects) {
      if (ruleSubject === '*') return true;
      if (ruleSubject === checkSubject) return true;
      
      // Handle class/constructor matching
      if (typeof ruleSubject === 'function' && typeof checkSubject === 'object') {
        if (checkSubject instanceof ruleSubject) return true;
        if ((checkSubject as any).constructor === ruleSubject) return true;
      }

      // Handle string matching for object types
      if (typeof ruleSubject === 'string' && typeof checkSubject === 'object') {
        if ((checkSubject as any).__type === ruleSubject) return true;
        if ((checkSubject as any).type === ruleSubject) return true;
        if ((checkSubject as any).constructor.name === ruleSubject) return true;
      }
    }

    return false;
  }

  /**
   * Check if conditions match the subject object
   */
  private conditionsMatch(conditions: Conditions, subject: object): boolean {
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = (subject as any)[key];
      
      if (!this.valuesMatch(actualValue, expectedValue)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if two values match (handles various comparison types)
   */
  private valuesMatch(actual: any, expected: any): boolean {
    // Exact match
    if (actual === expected) return true;

    // Array contains check
    if (Array.isArray(expected) && expected.includes(actual)) return true;
    if (Array.isArray(actual) && actual.includes(expected)) return true;

    // Function/predicate check
    if (typeof expected === 'function') {
      return expected(actual);
    }

    // Regex match for strings
    if (expected instanceof RegExp && typeof actual === 'string') {
      return expected.test(actual);
    }

    // Object comparison (shallow)
    if (typeof expected === 'object' && typeof actual === 'object' && expected !== null && actual !== null) {
      return Object.keys(expected).every(key => 
        this.valuesMatch((actual as any)[key], (expected as any)[key])
      );
    }

    return false;
  }

  /**
   * Generate cache key for permission check
   */
  private getCacheKey(action: Action, subject: Subject, field?: Field): string {
    const subjectKey = typeof subject === 'object' 
      ? JSON.stringify(subject) 
      : String(subject);
    
    return `${action}:${subjectKey}:${field || ''}`;
  }
}

/**
 * Create a new Ability instance
 */
export function createAbility(rules: PermissionRule[] = []): Ability {
  return new AbilityCore(rules);
}

/**
 * Helper to create permission rules
 */
export const definePermissions = (rules: PermissionRule[]): PermissionRule[] => rules;

/**
 * Common permission actions
 */
export const Actions = {
  CREATE: 'create',
  READ: 'read', 
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // All actions
  VIEW: 'view',
  EDIT: 'edit',
  PUBLISH: 'publish',
  ARCHIVE: 'archive',
  APPROVE: 'approve',
  REJECT: 'reject'
} as const;

/**
 * Helper to create subject types
 */
export const subject = (type: string, data: object = {}): object => ({
  __type: type,
  ...data
});

/**
 * Check if subject is of specific type
 */
export const subjectType = (subject: any): string => {
  if (typeof subject === 'string') return subject;
  if (subject?.__type) return subject.__type;
  if (subject?.type) return subject.type;
  if (subject?.constructor?.name) return subject.constructor.name;
  return 'unknown';
};