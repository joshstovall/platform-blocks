import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { PlacementType, PositioningOptions } from '../../core/utils/positioning-enhanced';
import type { RadiusValue } from '../../core/theme/radius';
import type { ShadowValue } from '../../core/theme/shadow';
import type { SpacingProps } from '../../core/utils';

export type FloatingStrategy = 'absolute' | 'fixed';
export type ArrowPosition = 'center' | 'side';

export interface PopoverMiddlewares {
  flip?: boolean | { padding?: number };
  shift?: boolean | { padding?: number };
  inline?: boolean;
}

export interface PopoverProps extends SpacingProps {
  children: ReactNode;
  /** Controlled open state */
  opened?: boolean;
  /** Initial open state in uncontrolled mode */
  defaultOpened?: boolean;
  /** Called when open state changes */
  onChange?: (opened: boolean) => void;
  /** Called when popover opens */
  onOpen?: () => void;
  /** Called when popover closes */
  onClose?: () => void;
  /** Called when popover is dismissed via outside click or escape */
  onDismiss?: () => void;
  /** How the popover is triggered: 'click' (default) or 'hover' (mostly useful for devices with a mouse) */
  trigger?: 'click' | 'hover';
  /** Disable popover entirely */
  disabled?: boolean;
  /** Close when clicking outside */
  closeOnClickOutside?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Events considered for outside click detection (web only) */
  clickOutsideEvents?: string[];
  /** Trap focus within dropdown (web only) */
  trapFocus?: boolean;
  /** Keep dropdown mounted when hidden */
  keepMounted?: boolean;
  /** Return focus to target after close */
  returnFocus?: boolean;
  /** Render dropdown within portal */
  withinPortal?: boolean;
  /** Render overlay/backdrop */
  withOverlay?: boolean;
  /** Overlay component props */
  overlayProps?: Record<string, unknown>;
  /** Dropdown width, number or 'target' to match target width */
  w?: number | 'target';
  /** Dropdown max-width */
  maxW?: number;
  /** Dropdown max-height */
  maxH?: number;
  /** Dropdown min-width */
  minW?: number;
  /** Dropdown min-height */
  minH?: number;
  /** Border radius */
  radius?: RadiusValue | number;
  /** Box shadow */
  shadow?: ShadowValue;
  /** Dropdown z-index */
  zIndex?: number;
  /** Popover position relative to target */
  position?: PlacementType;
  /** Offset from target */
  offset?: number | { mainAxis?: number; crossAxis?: number };
  /** Floating strategy for positioning */
  floatingStrategy?: FloatingStrategy;
  /** Custom positioning options */
  middlewares?: PopoverMiddlewares;
  /** Prevent flipping/shifting when visible */
  preventPositionChangeWhenVisible?: boolean;
  /** Hide dropdown when target becomes detached */
  hideDetached?: boolean;
  /** Override viewport padding */
  viewport?: PositioningOptions['viewport'];
  /** Whether positioning should avoid the on-screen keyboard */
  keyboardAvoidance?: boolean;
  /** Override fallback placements */
  fallbackPlacements?: PlacementType[];
  /** Override boundary padding */
  boundary?: number;
  /** Render ARIA roles */
  withRoles?: boolean;
  /** Unique id base for accessibility */
  id?: string;
  /** Render arrow */
  withArrow?: boolean;
  /** Arrow size */
  arrowSize?: number;
  /** Arrow border radius */
  arrowRadius?: number;
  /** Arrow offset */
  arrowOffset?: number;
  /** Arrow position for start/end placements */
  arrowPosition?: ArrowPosition;
  /** Called when dropdown position changes */
  onPositionChange?: (placement: PlacementType) => void;
  /** Test identifier */
  testID?: string;
}

export interface PopoverTargetProps {
  children: React.ReactElement;
  popupType?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
  refProp?: string;
  /** Additional props merged onto target */
  targetProps?: Record<string, unknown>;
}

export interface PopoverDropdownProps extends ViewProps {
  children: ReactNode;
  /** Whether dropdown content should trap focus (web only) */
  trapFocus?: boolean;
  /** Keep dropdown mounted */
  keepMounted?: boolean;
}

export interface RegisteredDropdown {
  content: ReactNode;
  style?: PopoverDropdownProps['style'];
  trapFocus: boolean;
  keepMounted?: boolean;
  testID?: string;
  containerProps?: Omit<PopoverDropdownProps, 'children' | 'style' | 'trapFocus' | 'keepMounted' | 'testID'>;
}
