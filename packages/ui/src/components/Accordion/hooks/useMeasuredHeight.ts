import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

export interface MeasuredHeightResult {
  ref: React.RefObject<View>;
  height: number;
  onLayout: (e: LayoutChangeEvent) => void;
  hasMeasured: boolean;
}

export function useMeasuredHeight(initialExpanded: boolean): MeasuredHeightResult {
  const ref = useRef<View>(null!); // non-null assertion handled via onLayout before read
  const [height, setHeight] = useState(0);
  // Track the maximum observed height to avoid partial measurements during animation
  const maxHeightRef = useRef(0);
  const [hasMeasured, setHasMeasured] = useState(false); // Always start as false to ensure proper measurement

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const h = Math.max(0, Math.round(e.nativeEvent.layout.height));
    // Accept any height > 0, keep the maximum to prevent shrinking due to transitional layouts
    if (h > 0) {
      if (h > maxHeightRef.current) {
        maxHeightRef.current = h;
        setHeight(h);
      } else if (!hasMeasured) {
        // First measurement was <= 0 earlier; ensure we flip the flag
        setHeight(maxHeightRef.current || h);
      }
      if (!hasMeasured) setHasMeasured(true);
    }
  }, []);

  return { ref, height, onLayout, hasMeasured };
}
