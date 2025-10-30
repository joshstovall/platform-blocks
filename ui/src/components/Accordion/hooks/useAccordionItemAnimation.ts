import { useMemo, useRef } from 'react';
import { View } from 'react-native';

export interface UseAccordionItemAnimationOptions {
  expanded: boolean;
  animated: boolean | { duration?: number; easing?: (t: number) => number };
}

export interface UseAccordionItemAnimationResult {
  contentRef: React.RefObject<View | null>;
  onContentLayout: (e: any) => void;
  animatedHeightStyle: any;
  animatedChevronStyle: any;
  isLayoutComplete: boolean;
  contentHeight: number;
}

export function useAccordionItemAnimation(opts: UseAccordionItemAnimationOptions): UseAccordionItemAnimationResult {
  const { expanded } = opts;
  const contentRef = useRef<View>(null);
  const onContentLayout = () => {};

  // No animation: just show or hide content via static style
  const animatedHeightStyle = useMemo(() => (
    expanded ? {} : { height: 0, overflow: 'hidden' as const }
  ), [expanded]);

  // No animation: snap chevron rotation based on state
  const animatedChevronStyle = useMemo(() => ({
    transform: [{ rotate: expanded ? '90deg' : '0deg' }],
  }), [expanded]);

  return {
    contentRef,
    onContentLayout,
    animatedHeightStyle,
    animatedChevronStyle,
    isLayoutComplete: true,
    contentHeight: 0,
  };
}
