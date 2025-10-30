import React, { useMemo, useCallback, memo, useRef } from 'react';
import { measurePerformance } from '../../core/utils/debounce';
import { INPUT_PERFORMANCE_CONFIG } from '../../core/utils/performance';
import { FormBase } from './FormBase';
import { FormField } from './FormField';
import { FormInput } from './FormInput';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';
import { FormSubmit } from './FormSubmit';
import type { FormProps, FormContextValue } from './types';

/**
 * Performance-optimized Form component with context splitting and memoization
 */
const OptimizedFormBase = memo<FormProps>((props) => {
  const {
    children,
    initialValues = {},
    validationSchema = {},
    onSubmit,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
    disabled = false,
    ...rest
  } = props;

  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Performance monitoring in development
  if (__DEV__) {
    measurePerformance('FormRender', () => {
      if (renderCountRef.current > 10) {
        console.warn(
          `[Performance Warning] Form has re-rendered ${renderCountRef.current} times. Consider optimizing.`
        );
      }
    });
  }

  // Memoized form props to prevent unnecessary re-renders
  const memoizedProps = useMemo(() => ({
    initialValues,
    validationSchema,
    onSubmit,
    validate,
    validateOnChange,
    validateOnBlur,
    disabled,
    ...rest,
  }), [
    initialValues,
    validationSchema,
    onSubmit,
    validate,
    validateOnChange,
    validateOnBlur,
    disabled,
    rest,
  ]);

  return (
    <FormBase {...memoizedProps}>
      {children}
    </FormBase>
  );
});

OptimizedFormBase.displayName = 'OptimizedFormBase';

/**
 * Optimized Form Field component with intelligent re-render prevention
 */
const OptimizedFormField = memo<React.ComponentProps<typeof FormField>>((props) => {
  const { name, children, dependsOn = [], ...rest } = props;

  // Memoize dependencies to prevent unnecessary re-renders
  const memoizedDependencies = useMemo(() => dependsOn, [JSON.stringify(dependsOn)]);

  const memoizedProps = useMemo(() => ({
    name,
    dependsOn: memoizedDependencies,
    ...rest,
  }), [name, memoizedDependencies, rest]);

  return (
    <FormField {...memoizedProps}>
      {children}
    </FormField>
  );
});

OptimizedFormField.displayName = 'OptimizedFormField';

/**
 * Performance-optimized Form Input with debounced validation
 */
const OptimizedFormInput = memo<React.ComponentProps<typeof FormInput>>((props) => {
  const {
    name,
    debounceMs = INPUT_PERFORMANCE_CONFIG.defaultValidationDebounce,
    ...rest
  } = props;

  const memoizedProps = useMemo(() => ({
    name,
    debounceMs,
    ...rest,
  }), [name, debounceMs, rest]);

  return <FormInput {...memoizedProps} />;
});

OptimizedFormInput.displayName = 'OptimizedFormInput';

/**
 * Memoized Form Label component
 */
const OptimizedFormLabel = memo(FormLabel);
OptimizedFormLabel.displayName = 'OptimizedFormLabel';

/**
 * Memoized Form Error component
 */
const OptimizedFormError = memo(FormError);
OptimizedFormError.displayName = 'OptimizedFormError';

/**
 * Memoized Form Submit component
 */
const OptimizedFormSubmit = memo(FormSubmit);
OptimizedFormSubmit.displayName = 'OptimizedFormSubmit';

/**
 * Complete optimized Form compound component
 */
export const OptimizedForm = Object.assign(OptimizedFormBase, {
  Field: OptimizedFormField,
  Input: OptimizedFormInput,
  Label: OptimizedFormLabel,
  Error: OptimizedFormError,
  Submit: OptimizedFormSubmit,
});

/**
 * Custom hook for form performance monitoring
 */
export function useFormPerformanceMonitoring(formName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  React.useEffect(() => {
    if (__DEV__) {
      renderCountRef.current += 1;
      const currentTime = Date.now();
      const timeSinceLastRender = currentTime - lastRenderTimeRef.current;
      
      // Log performance warnings
      if (renderCountRef.current > 20) {
        console.warn(
          `[Performance] Form "${formName}" has rendered ${renderCountRef.current} times`
        );
      }
      
      if (timeSinceLastRender < 16) { // Less than 60fps
        console.warn(
          `[Performance] Form "${formName}" rendered too frequently (${timeSinceLastRender}ms)`
        );
      }
      
      lastRenderTimeRef.current = currentTime;
    }
  });

  return {
    renderCount: renderCountRef.current,
  };
}

/**
 * Higher-order component for adding performance monitoring to forms
 */
export function withFormPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  const PerformanceMonitoredComponent = memo<T>((props) => {
    useFormPerformanceMonitoring(componentName);
    return <Component {...props} />;
  });

  PerformanceMonitoredComponent.displayName = `PerformanceMonitored(${componentName})`;
  
  return PerformanceMonitoredComponent;
}
