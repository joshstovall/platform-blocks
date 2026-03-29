import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { LoaderProps } from '../Loader/types';
import type { OverlayProps } from '../Overlay';

export interface LoadingOverlayProps extends Omit<ViewProps, 'style'> {
  /** Controls visibility of the loading overlay. */
  visible?: boolean;
  /** z-index applied to the overlay container. Overrides value defined in overlayProps when provided. */
  zIndex?: number;
  /** Props forwarded to the underlying Overlay component. */
  overlayProps?: OverlayProps;
  /** Props forwarded to the Loader component. */
  loaderProps?: LoaderProps;
  /** Custom loader content. When provided, Loader component is not rendered. */
  loader?: ReactNode;
}
