/**
 * Performance configuration constants
 */

export const INPUT_PERFORMANCE_CONFIG = {
  // Debounce validation to reduce API calls
  defaultValidationDebounce: 300,
  
  // Batch form updates
  batchFormUpdates: true,
  
  // Lazy load complex components
  lazyLoadThreshold: 10, // Load heavy components after 10 inputs
  
  // Virtual scrolling for large forms
  enableVirtualScrolling: true,
  virtualScrollThreshold: 50,
  
  // Optimize re-renders
  memoizeInputStyles: true,
  shallowCompareProps: true,
  
  // Bundle optimization
  treeShakeValidators: true,
  splitFormChunks: true,
} as const;

export const PERFORMANCE_THRESHOLDS = {
  // Maximum acceptable render time for input components (in ms)
  maxInputRenderTime: 16,
  
  // Maximum acceptable validation time (in ms)
  maxValidationTime: 100,
  
  // Maximum form submission time (in ms)
  maxFormSubmissionTime: 1000,
  
  // Memory thresholds
  maxFormFields: 100,
  maxValidationRules: 20,
} as const;

/**
 * Production build configuration for input components
 */
export const buildInputComponents = () => ({
  // Core inputs (always included)
  core: ['Input', 'PasswordInput', 'Checkbox', 'Radio', 'Switch'],
  
  // Optional inputs (tree-shakable)
  optional: ['NumberInput', 'DateInput', 'ColorInput', 'Slider', 'PinInput'],
  
  // Advanced inputs (lazy-loaded)
  advanced: ['RichTextEditor', 'FileInput', 'AutoComplete'],
  
  // Validation rules (tree-shakable)
  validation: ['required', 'email', 'pattern', 'passwordStrength'],
});
