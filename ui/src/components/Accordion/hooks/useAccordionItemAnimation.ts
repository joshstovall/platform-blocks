import { useMemo } from 'react';
import type { AccordionAnimationProp } from '../types';

export interface UseAccordionItemAnimationOptions {
  expanded: boolean;
  animated: AccordionAnimationProp;
}

export interface AccordionCollapseConfig {
  shouldAnimate: boolean;
  duration: number;
  easing?: (t: number) => number;
}

export interface UseAccordionItemAnimationResult {
  animatedChevronStyle: any;
  CollapseConfig: AccordionCollapseConfig;
}

const DEFAULT_DURATION = 220;

export function useAccordionItemAnimation(opts: UseAccordionItemAnimationOptions): UseAccordionItemAnimationResult {
  const { expanded, animated } = opts;

  const animatedChevronStyle = useMemo(() => ({
    transform: [{ rotate: expanded ? '90deg' : '0deg' }],
  }), [expanded]);

  const CollapseConfig = useMemo<AccordionCollapseConfig>(() => {
    if (animated === false) {
      return { shouldAnimate: false, duration: 0 };
    }

    if (animated === true || animated === undefined) {
      return { shouldAnimate: true, duration: DEFAULT_DURATION };
    }

    return {
      shouldAnimate: true,
      duration: animated.duration ?? DEFAULT_DURATION,
      easing: animated.easing,
    };
  }, [animated]);

  return {
    animatedChevronStyle,
    CollapseConfig,
  };
}
