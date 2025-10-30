// Core exports
export * from './theme';
export * from './factory';
export * from './providers';
export * from './responsive';
export * from './i18n';
export * from './accessibility';
export * from './sound';

// Utils exports (avoiding conflicts)
export {
  getSpacingStyles,
  extractSpacingProps,
  getLayoutStyles,
  extractLayoutProps,
  UniversalProps,
  ResponsiveProps
} from './utils';

// Unified styling system
export { 
  DESIGN_TOKENS, 
  createTransition, 
  getResponsiveValue 
} from './design-tokens';

export {
  createFocusStyles,
  createHoverStyles,
  createPressedStyles,
  createDisabledStyles,
  createInteractiveStateStyles,
  createTransitionStyles,
  type InteractiveStateConfig
} from './interactive-states';

export {
  createComponentStyles,
  type StyleFactoryConfig
} from './style-factory';

export {
  COMPONENT_SIZES as UNIFIED_COMPONENT_SIZES,
  getComponentSize as getUnifiedComponentSize,
  createInteractiveStyles as createUnifiedInteractiveStyles,
  getIconSize as getUnifiedIconSize,
  getSectionSpacing as getUnifiedSectionSpacing
} from './theme/unified-sizing';

// Reusable components
export { ClearButton, type ClearButtonProps } from './components/ClearButton';
export { InputContainer, type InputContainerProps } from './components/InputContainer';

// Utils exports (excluding conflicting names)
export {
  rem,
  px,
  getSize,
  getShadow,
  getColor
} from './utils';
