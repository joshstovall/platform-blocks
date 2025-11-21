import React from 'react';

/**
 * Tree-shakable component exports for bundle size optimization
 * Import only what you need to reduce bundle size
 */

// Core components (always included in bundle)
export { Input } from './Input/Input';
export { TextInputBase } from './Input/InputBase';
export { Form } from './Form';

// Selection components (tree-shakable)
export type { CheckboxProps } from './Checkbox/types';
export type { RadioProps, RadioGroupProps } from './Radio/types';
export type { SwitchProps } from './Switch/types';

// Specialized input components (tree-shakable)
export type { NumberInputProps } from './NumberInput/types';
export type { PinInputProps } from './PinInput/types';
export type { SliderProps, RangeSliderProps } from './Slider/types';
export type { KnobProps, KnobMark } from './Knob/types';

// Lazy-loaded components for better performance
export const LazyPasswordInput = React.lazy(() => import('./Input/PasswordInput').then(m => ({ default: m.PasswordInput })));
export const LazyNumberInput = React.lazy(() => import('./NumberInput/NumberInput').then(m => ({ default: m.NumberInput })));
export const LazyPinInput = React.lazy(() => import('./PinInput/PinInput').then(m => ({ default: m.PinInput })));
export const LazySlider = React.lazy(() => import('./Slider/Slider').then(m => ({ default: m.Slider })));
export const LazyRangeSlider = React.lazy(() => import('./Slider/Slider').then(m => ({ default: m.RangeSlider })));
export const LazyKnob = React.lazy(() => import('./Knob/Knob').then(m => ({ default: m.Knob })));
export const LazyCheckbox = React.lazy(() => import('./Checkbox/Checkbox').then(m => ({ default: m.Checkbox })));
export const LazyRadio = React.lazy(() => import('./Radio/Radio').then(m => ({ default: m.Radio })));
export const LazyRadioGroup = React.lazy(() => import('./Radio/Radio').then(m => ({ default: m.RadioGroup })));
export const LazySwitch = React.lazy(() => import('./Switch/Switch').then(m => ({ default: m.Switch })));

// Performance-optimized components
export { OptimizedInput, OptimizedPasswordInput } from './Input/OptimizedInput';
export { OptimizedForm } from './Form/OptimizedForm';

// Validation utilities (tree-shakable)
export type { ValidationRule, PasswordStrengthRule } from './Input/types';

/**
 * Lazy load component utility
 */
export function lazyLoadComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> } | { [key: string]: React.ComponentType<T> }>,
  componentName?: string
) {
  return React.lazy(async () => {
    const module = await importFn();
    
    if ('default' in module) {
      return { default: module.default };
    }
    
    if (componentName && componentName in module) {
      return { default: module[componentName] };
    }
    
    throw new Error(`Component ${componentName} not found in module`);
  });
}

/**
 * Conditional component loading based on usage patterns
 */
export class ComponentLoader {
  private static loadedComponents = new Set<string>();
  private static componentUsageCount = new Map<string, number>();

  static async loadComponent(componentName: string): Promise<React.ComponentType<any>> {
    // Track usage
    const currentCount = this.componentUsageCount.get(componentName) || 0;
    this.componentUsageCount.set(componentName, currentCount + 1);

    // Return if already loaded
    if (this.loadedComponents.has(componentName)) {
      return this.getLoadedComponent(componentName);
    }

    // Load component based on name
    let component;
    
    switch (componentName) {
      case 'PasswordInput': {
        const module = await import('./Input/PasswordInput');
        component = module.PasswordInput;
        break;
      }
      case 'NumberInput': {
        const module = await import('./NumberInput/NumberInput');
        component = module.NumberInput;
        break;
      }
      case 'DatePicker': {
        const module = await import('./DatePicker/DatePicker');
        component = module.DatePicker;
        break;
      }
      case 'MonthPicker': {
        const module = await import('./MonthPicker/MonthPicker');
        component = module.MonthPicker;
        break;
      }
      case 'YearPicker': {
        const module = await import('./YearPicker/YearPicker');
        component = module.YearPicker;
        break;
      }
      case 'DatePickerInput': {
        const module = await import('./DatePickerInput/DatePickerInput');
        component = module.DatePickerInput;
        break;
      }
      case 'MonthPickerInput': {
        const module = await import('./MonthPickerInput/MonthPickerInput');
        component = module.MonthPickerInput;
        break;
      }
      case 'YearPickerInput': {
        const module = await import('./YearPickerInput/YearPickerInput');
        component = module.YearPickerInput;
        break;
      }
      case 'TimePickerInput': {
        const module = await import('./TimePicker/TimePicker');
        component = module.TimePicker;
        break;
      }
      case 'PinInput': {
        const module = await import('./PinInput/PinInput');
        component = module.PinInput;
        break;
      }
      case 'Slider': {
        const module = await import('./Slider/Slider');
        component = module.Slider;
        break;
      }
      case 'Knob': {
        const module = await import('./Knob/Knob');
        component = module.Knob;
        break;
      }
      case 'Checkbox': {
        const module = await import('./Checkbox/Checkbox');
        component = module.Checkbox;
        break;
      }
      case 'Radio': {
        const module = await import('./Radio/Radio');
        component = module.Radio;
        break;
      }
      case 'Switch': {
        const module = await import('./Switch/Switch');
        component = module.Switch;
        break;
      }
      default:
        throw new Error(`Unknown component: ${componentName}`);
    }

    this.loadedComponents.add(componentName);
    return component;
  }

  private static getLoadedComponent(componentName: string): React.ComponentType<any> {
    // This would typically involve a registry of loaded components
    // For now, this is a placeholder - in a real implementation you'd maintain a component registry
    throw new Error(`Component ${componentName} was loaded but registry not implemented`);
  }

  static getUsageStats() {
    return {
      loadedComponents: Array.from(this.loadedComponents),
      usageCount: Object.fromEntries(this.componentUsageCount),
    };
  }
}

/**
 * Bundle analyzer utility for development
 */
export function analyzeBundleUsage() {
  if (__DEV__) {
    console.group('📊 PlatformBlocks Bundle Analysis');
    console.log('Loaded Components:', ComponentLoader.getUsageStats().loadedComponents);
    console.log('Usage Statistics:', ComponentLoader.getUsageStats().usageCount);
    console.groupEnd();
  }
}
