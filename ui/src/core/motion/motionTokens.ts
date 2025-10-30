import { useReducedMotion } from './ReducedMotionProvider';

export interface MotionTokens {
  enabled: boolean;
  durations: Record<'instant'|'xs'|'sm'|'md'|'lg'|'xl', number>;
  spring: { tension: number; friction: number; speed: number; bounciness: number };
  maybe: (value: number) => number;
}

export function useMotionTokens(): MotionTokens {
  const reduced = useReducedMotion();
  const scale = (ms: number) => (reduced ? 0 : ms);
  return {
    enabled: !reduced,
    durations: {
      instant: 0,
      xs: scale(80),
      sm: scale(140),
      md: scale(220),
      lg: scale(320),
      xl: scale(480)
    },
    spring: reduced ? { tension: 1000, friction: 500, speed: 1000, bounciness: 0 } : { tension: 170, friction: 26, speed: 12, bounciness: 8 },
    maybe: (v: number) => (reduced ? 0 : v)
  };
}
