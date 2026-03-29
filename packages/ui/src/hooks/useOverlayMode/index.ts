import { Platform } from 'react-native';
import { useMemo } from 'react';

import { useDeviceInfo } from '../useDeviceInfo';

export interface UseOverlayModeOptions {
  /** Force modal presentation regardless of platform */
  forceModal?: boolean;
  /** Force anchored overlay/portal regardless of platform */
  forceOverlay?: boolean;
}

export interface UseOverlayModeResult {
  /** Raw device info reference (forwarded for convenience) */
  deviceInfo: ReturnType<typeof useDeviceInfo>;
  /** True when running on React Native Web */
  isWeb: boolean;
  /** Consolidated mobile experience flag (native or narrow web) */
  isMobileExperience: boolean;
  /** Inverse of mobile experience flag */
  isDesktopExperience: boolean;
  /** Prefer fullscreen/modal surfaces (native + mobile web) */
  shouldUseModal: boolean;
  /** Prefer anchored overlays/portals (desktop web) */
  shouldUseOverlay: boolean;
  /** Alias for shouldUseOverlay for popover/portal driven surfaces */
  shouldUsePortal: boolean;
}

/**
 * Normalises how components decide between fullscreen modals and anchored overlays
 * by combining platform + device heuristics from useDeviceInfo.
 */
export function useOverlayMode(options: UseOverlayModeOptions = {}): UseOverlayModeResult {
  const { forceModal, forceOverlay } = options;
  const deviceInfo = useDeviceInfo();
  const isWeb = Platform.OS === 'web';

  const value = useMemo(() => {
    const helpers = deviceInfo.helpers || {};
    const detectedMobile = typeof helpers.isMobile === 'boolean' ? helpers.isMobile : !isWeb;

    const resolvedModal = forceOverlay ? false : (forceModal ?? detectedMobile);
    const resolvedOverlay = forceModal ? false : (forceOverlay ?? (isWeb && !resolvedModal));

    return {
      deviceInfo,
      isWeb,
      isMobileExperience: resolvedModal,
      isDesktopExperience: !resolvedModal,
      shouldUseModal: resolvedModal,
      shouldUseOverlay: resolvedOverlay,
      shouldUsePortal: resolvedOverlay,
    } as UseOverlayModeResult;
  }, [deviceInfo, forceModal, forceOverlay, isWeb]);

  return value;
}

export default useOverlayMode;
