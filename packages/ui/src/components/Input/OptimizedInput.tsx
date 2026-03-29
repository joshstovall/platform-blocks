import React, { useMemo, useCallback, memo } from 'react';
import { Input } from './Input';
import { PasswordInput } from './PasswordInput';
import { validateValue } from './validation';
import { debounce } from '../../core/utils/debounce';
import { INPUT_PERFORMANCE_CONFIG } from '../../core/utils/performance';
import type { InputProps, PasswordInputProps, ValidationRule } from './types';

/**
 * Performance-optimized Input component with memoization and debounced validation
 */
export const OptimizedInput = memo<InputProps>((props) => {
  const {
    value,
    onChangeText,
    validation,
    debounceMs = INPUT_PERFORMANCE_CONFIG.defaultValidationDebounce,
    name,
    ...rest
  } = props;

  // Debounced validation to avoid excessive re-renders and API calls
  const debouncedValidation = useMemo(() => {
    if (!validation || !name) return undefined;
    
    return debounce(async (inputValue: string, fieldName: string) => {
      if (!validation) return;
      
      try {
        const errors = await validateValue(inputValue, validation);
        // You would typically update form context here
        // This is a placeholder for the actual error handling
        if (errors.length > 0) {
          console.warn(`Validation error for ${fieldName}:`, errors[0]);
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    }, debounceMs);
  }, [validation, debounceMs, name]);

  // Optimized change handler with debounced validation
  const handleChange = useCallback((text: string) => {
    // Immediate update for responsive UI
    onChangeText?.(text);
    
    // Debounced validation for performance
    if (debouncedValidation && name) {
      debouncedValidation(text, name);
    }
  }, [onChangeText, debouncedValidation, name]);

  // Memoized props to prevent unnecessary re-renders
  const memoizedProps = useMemo(() => ({
    ...rest,
    value,
    onChangeText: handleChange,
  }), [rest, value, handleChange]);

  return <Input {...memoizedProps} />;
});

OptimizedInput.displayName = 'OptimizedInput';

/**
 * Performance-optimized PasswordInput component
 */
export const OptimizedPasswordInput = memo<PasswordInputProps>((props) => {
  const {
    value,
    onChangeText,
    showStrengthIndicator,
    strengthValidation,
    debounceMs = INPUT_PERFORMANCE_CONFIG.defaultValidationDebounce,
    ...rest
  } = props;

  // Debounced strength calculation to avoid excessive computations
  const debouncedStrengthCalc = useMemo(() => {
    if (!showStrengthIndicator) return undefined;
    
    return debounce((password: string) => {
      // This would trigger strength indicator update
      // Implementation depends on your strength indicator component
    }, debounceMs);
  }, [showStrengthIndicator, debounceMs]);

  const handleChange = useCallback((text: string) => {
    onChangeText?.(text);
    
    if (debouncedStrengthCalc) {
      debouncedStrengthCalc(text);
    }
  }, [onChangeText, debouncedStrengthCalc]);

  const memoizedProps = useMemo(() => ({
    ...rest,
    value,
    onChangeText: handleChange,
    showStrengthIndicator,
    strengthValidation,
  }), [rest, value, handleChange, showStrengthIndicator, strengthValidation]);

  return <PasswordInput {...memoizedProps} />;
});

OptimizedPasswordInput.displayName = 'OptimizedPasswordInput';

/**
 * Custom hook for optimized input state management
 */
export function useOptimizedInputState(
  initialValue: string = '',
  validation?: ValidationRule[],
  debounceMs: number = INPUT_PERFORMANCE_CONFIG.defaultValidationDebounce
) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  // Debounced validation
  const debouncedValidate = useMemo(() => {
    if (!validation) return undefined;
    
    return debounce(async (inputValue: string) => {
      setIsValidating(true);
      try {
        const errors = await validateValue(inputValue, validation);
        setError(errors.length > 0 ? errors[0] : null);
      } catch (err) {
        setError('Validation error occurred');
      } finally {
        setIsValidating(false);
      }
    }, debounceMs);
  }, [validation, debounceMs]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    if (debouncedValidate) {
      debouncedValidate(newValue);
    }
  }, [debouncedValidate]);

  return {
    value,
    setValue: handleChange,
    error,
    isValidating,
  };
}
