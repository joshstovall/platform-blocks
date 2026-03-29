import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { SizeValue } from '../../core/theme/sizes';

export interface SpaceProps extends Omit<ViewProps, 'style'> {
  /** Height of the spacer. Accepts theme spacing tokens or raw numbers. */
  h?: SizeValue;
  /** Width of the spacer. Accepts theme spacing tokens or raw numbers. */
  w?: SizeValue;
  /**
   * Fallback size when neither `h` nor `w` is provided.
   * Defaults to `md` so the component always occupies some space.
   */
  size?: SizeValue;
  /** Optional style overrides. */
  style?: StyleProp<ViewStyle>;
  /** Space is presentational only, so children are not supported. */
  children?: never;
}
