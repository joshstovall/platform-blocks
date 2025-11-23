import { TextProps } from '../Text/Text';

export interface GradientTextProps extends Omit<TextProps, 'color' | 'colorVariant'> {
  /** Array of colors for the gradient (at least 2 required) */
  colors: string[];
  
  /** Color stops (0-1) for each color. If not provided, colors are evenly distributed */
  locations?: number[];
  
  /** Gradient direction angle in degrees (0 = left to right, 90 = top to bottom, etc.) */
  angle?: number;
  
  /** Start point [x, y] (0-1). Overrides angle if provided */
  start?: [number, number];
  
  /** End point [x, y] (0-1). Overrides angle if provided */
  end?: [number, number];
  
  /** Gradient position offset (0-1). Moves the gradient along the line */
  position?: number;
  
  /** Custom testID for testing */
  testID?: string;
}

export interface GradientTextStyleProps {

  /** Array of colors for the gradient (at least 2 required) */
  colors: string[];

  /** Color stops (0-1) for each color. If not provided, colors are evenly distributed */
  locations?: number[];

  /** Gradient direction angle in degrees (0 = left to right, 90 = top to bottom, etc.) */
  angle?: number;

  /** Start point [x, y] (0-1). Overrides angle if provided */
  start?: [number, number];

  /** End point [x, y] (0-1). Overrides angle if provided */
  end?: [number, number];

  /** Gradient position offset (0-1) */
  position: number;
}
