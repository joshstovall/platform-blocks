import React from 'react';
import { debounce, measureAsyncPerformance } from '../../../core/utils/debounce';
import { INPUT_PERFORMANCE_CONFIG } from '../../../core/utils/performance';
import type { ValidationRule, PasswordStrengthRule } from '../types';

/**
 * Performance-optimized validation system
 */

// Validation cache for expensive operations
const validationCache = new Map<string, { result: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cached validation function to avoid repeated expensive validations
 */
export const validateValueCached = async (
  value: any,
  rules: ValidationRule[],
  formValues?: Record<string, any>
): Promise<string[]> => {
  // Create cache key
  const cacheKey = JSON.stringify({ value, rules, formValues });
  
  // Check cache
  const cached = validationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  // Perform validation with performance monitoring
  const result = await measureAsyncPerformance('validation', async () => {
    const errors: string[] = [];

    for (const rule of rules) {
      const isValid = await validateRule(value, rule, formValues);
      if (!isValid) {
        errors.push(rule.message);
      }
    }

    return errors;
  });

  // Cache result
  validationCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });

  return result;
};

/**
 * Optimized individual rule validation
 */
async function validateRule(
  value: any,
  rule: ValidationRule,
  formValues?: Record<string, any>
): Promise<boolean> {
  switch (rule.type) {
    case 'required':
      return value !== undefined && value !== null && value !== '';
      
    case 'minLength':
      if (typeof value === 'string') {
        return value.length >= (rule.value || 0);
      }
      return true;
      
    case 'maxLength':
      if (typeof value === 'string') {
        return value.length <= (rule.value || Infinity);
      }
      return true;
      
    case 'pattern':
      if (typeof value === 'string' && rule.value) {
        const regex = rule.value instanceof RegExp ? rule.value : new RegExp(rule.value);
        return regex.test(value);
      }
      return true;
      
    case 'passwordStrength':
      return validatePasswordStrengthOptimized(value, rule as PasswordStrengthRule);
      
    case 'custom':
      if (rule.validator) {
        return await rule.validator(value, formValues);
      }
      return true;
      
    default:
      return true;
  }
}

/**
 * Optimized password strength validation with caching
 */
const passwordStrengthCache = new Map<string, boolean>();

function validatePasswordStrengthOptimized(password: string, rule: PasswordStrengthRule): boolean {
  if (!password) return false;

  // Check cache first
  const cacheKey = `${password}-${JSON.stringify(rule.requirements)}`;
  if (passwordStrengthCache.has(cacheKey)) {
    return passwordStrengthCache.get(cacheKey)!;
  }

  const { requirements } = rule;
  let isValid = true;

  // Use early returns for better performance
  if (requirements.minLength && password.length < requirements.minLength) {
    isValid = false;
  } else if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    isValid = false;
  } else if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    isValid = false;
  } else if (requirements.requireNumbers && !/\d/.test(password)) {
    isValid = false;
  } else if (requirements.requireSymbols && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    isValid = false;
  }

  // Cache result
  passwordStrengthCache.set(cacheKey, isValid);
  
  // Clean cache periodically to prevent memory leaks
  if (passwordStrengthCache.size > 1000) {
    const entries = Array.from(passwordStrengthCache.entries());
    const toKeep = entries.slice(-500); // Keep last 500 entries
    passwordStrengthCache.clear();
    toKeep.forEach(([key, value]) => passwordStrengthCache.set(key, value));
  }

  return isValid;
}

/**
 * Optimized password strength calculator with progressive enhancement
 */
export function calculatePasswordStrengthOptimized(
  password: string,
  rules: PasswordStrengthRule[] = []
): number {
  if (!password) return 0;

  // Use cached calculation if available
  const cacheKey = `strength-${password}-${JSON.stringify(rules)}`;
  const cached = validationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result[0] as any; // Assuming single numeric result
  }

  let score = 0;
  const maxScore = 100;

  // Length score (0-30 points)
  score += Math.min(30, password.length * 3);

  // Character variety (0-40 points)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
  
  const varietyScore = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length * 10;
  score += varietyScore;

  // Pattern penalties (0-20 points deducted)
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 10; // Common sequences

  // Bonus for meeting custom requirements (0-10 points)
  if (rules.length > 0) {
    const metRequirements = rules.filter(rule => validatePasswordStrengthOptimized(password, rule)).length;
    score += (metRequirements / rules.length) * 10;
  }

  const finalScore = Math.min(score / maxScore, 1);

  // Cache the result
  validationCache.set(cacheKey, {
    result: [finalScore],
    timestamp: Date.now(),
  });

  return finalScore;
}

/**
 * Debounced validation hook for forms
 */
export function useDebouncedValidation(
  debounceMs: number = INPUT_PERFORMANCE_CONFIG.defaultValidationDebounce
) {
  const debouncedValidate = React.useMemo(
    () => debounce(validateValueCached, debounceMs),
    [debounceMs]
  );

  return debouncedValidate;
}

/**
 * Batch validation for multiple fields
 */
export async function validateMultipleFields(
  fieldsData: Array<{
    name: string;
    value: any;
    rules: ValidationRule[];
  }>,
  formValues?: Record<string, any>
): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {};

  // Use Promise.all for parallel validation
  const validationPromises = fieldsData.map(async ({ name, value, rules }) => {
    const errors = await validateValueCached(value, rules, formValues);
    return { name, errors };
  });

  const validationResults = await Promise.all(validationPromises);

  validationResults.forEach(({ name, errors }) => {
    results[name] = errors;
  });

  return results;
}

/**
 * Clear validation caches (useful for memory management)
 */
export function clearValidationCaches() {
  validationCache.clear();
  passwordStrengthCache.clear();
}

/**
 * Get validation cache statistics for monitoring
 */
export function getValidationCacheStats() {
  return {
    validationCacheSize: validationCache.size,
    passwordStrengthCacheSize: passwordStrengthCache.size,
    oldestEntry: Math.min(
      ...Array.from(validationCache.values()).map(entry => entry.timestamp)
    ),
  };
}
