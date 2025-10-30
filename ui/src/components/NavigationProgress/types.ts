export interface NavigationProgressProps {
  /** Controlled progress value (0-100). If omitted, internal controller progress is used */
  value?: number;
  /** Height (px) */
  size?: number;
  /** Color token key or raw color */
  color?: string;
  /** Whether bar is active/visible when value is controlled */
  active?: boolean;
  /** z-index layering */
  zIndex?: number;
  /** If true position absolute at top full width */
  overlay?: boolean;
  /** Step interval in ms for internal progression animation */
  stepInterval?: number;
  /** Border radius */
  radius?: number;
  /** Custom styles */
  style?: any;
}

export interface NavigationProgressController {
  start: () => void;
  stop: () => void;
  complete: () => void;
  reset: () => void;
  set: (v: number) => void;
  increment: (delta?: number) => void;
  decrement: (delta?: number) => void;
  isActive: () => boolean;
}
