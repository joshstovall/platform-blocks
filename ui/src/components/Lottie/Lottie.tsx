import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Platform, ViewStyle, View, UIManager, NativeModules } from 'react-native';
import { Text } from '../Text';
import { resolveOptionalModule } from '../../utils/optionalModule';

// Optional imports for web compatibility
const LottieReact = Platform.OS === 'web'
  ? resolveOptionalModule<any>('lottie-react', {
      accessor: mod => mod.default ?? mod,
    })
  : null;

const DotLottieReact = Platform.OS === 'web'
  ? resolveOptionalModule<any>('@lottiefiles/dotlottie-react', {
      accessor: mod => mod.DotLottieReact,
    })
  : null;

type NativeLottieStatus = {
  component: any | null;
  available: boolean;
};

let cachedNativeStatus: NativeLottieStatus | null = null;
let nativeLottieComponent: any | undefined;
let nativeModuleLoadWarningLogged = false;
let nativeModuleConfigWarningLogged = false;

const loadNativeLottieComponent = () => {
  if (nativeLottieComponent !== undefined) {
    return nativeLottieComponent;
  }

  const module = resolveOptionalModule<any>('lottie-react-native', {
    accessor: mod => mod?.default ?? mod,
  });

  if (!module && !nativeModuleLoadWarningLogged && __DEV__) {
    console.warn('[Lottie] Failed to load lottie-react-native module. Rendering fallback instead.');
    nativeModuleLoadWarningLogged = true;
  }

  nativeLottieComponent = module ?? null;

  return nativeLottieComponent;
};

const getNativeLottieStatus = (): NativeLottieStatus => {
  if (cachedNativeStatus) {
    return cachedNativeStatus;
  }

  if (Platform.OS === 'web') {
    cachedNativeStatus = { component: null, available: false };
    return cachedNativeStatus;
  }

  const component = loadNativeLottieComponent();

  if (!component) {
    cachedNativeStatus = { component: null, available: false };
    return cachedNativeStatus;
  }

  let viewManagerAvailable = false;

  try {
    const viewManager = UIManager?.getViewManagerConfig?.('LottieAnimationView')
      ?? (UIManager as any)?.LottieAnimationView
      ?? (NativeModules as any)?.LottieAnimationView;
    viewManagerAvailable = !!viewManager;
  } catch (error) {
    viewManagerAvailable = false;
  }

  if (!viewManagerAvailable && !nativeModuleConfigWarningLogged && __DEV__) {
    console.warn('[Lottie] Native LottieAnimationView is unavailable. Run `npx expo install lottie-react-native` and rebuild to enable animations.');
    nativeModuleConfigWarningLogged = true;
  }

  cachedNativeStatus = {
    component,
    available: viewManagerAvailable,
  };

  return cachedNativeStatus;
};

// We intentionally avoid importing types from lottie-react-native directly to keep it optional.
export type AnimationSource = any; // animation JSON or require result


export interface LottieProps {
  /** Required Lottie animation JSON (require or imported object) */
  source: any;//AnimationSource | number;
  /** Auto play animation */
  autoPlay?: boolean;
  /** Loop animation */
  loop?: boolean;
  /** Progress prop (0-1) for manual control */
  progress?: number;
  /** Speed multiplier */
  speed?: number;
  /** Style for container */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
  /** Pause state */
  paused?: boolean;
  /** Optional resize mode (cover/contain/center) */
  resizeMode?: 'cover' | 'contain' | 'center';
  /** Called when animation finishes (loop false) */
  onAnimationFinish?: (isCancelled: boolean) => void;
}

/**
 * Lottie component with safe fallback when native module not present or on unsupported platforms.
 */
export const Lottie = forwardRef<any, LottieProps>(function LottieCmp(props, ref) {
  const { source, autoPlay = true, loop = true, progress, speed = 1, style, testID, paused, resizeMode = 'contain', onAnimationFinish } = props;
  const internalRef = useRef<any>(null);
  const nativeStatus = getNativeLottieStatus();
  const NativeLottieView = nativeStatus.component;

  useImperativeHandle(ref, () => ({
    play: (...args: any[]) => internalRef.current?.play?.(...args),
    pause: () => internalRef.current?.pause?.(),
    reset: () => internalRef.current?.reset?.(),
    setProgress: (p: number) => internalRef.current?.setProgress?.(p),
  }), []);

  useEffect(() => {
    if (progress != null && internalRef.current?.setProgress) {
      internalRef.current.setProgress(progress);
    }
  }, [progress]);

  // Web implementation
  if (Platform.OS === 'web') {
    // Check if source is a string (URL) and ends with .lottie
    const isLottieFile = typeof source === 'string' && source.endsWith('.lottie');
    
    if (isLottieFile && DotLottieReact) {
      // Use DotLottieReact for .lottie files
      return (
        <DotLottieReact
          src={source}
          autoplay={autoPlay}
          loop={loop}
          speed={speed}
          style={style}
          data-testid={testID}
        />
      );
    } else if (LottieReact) {
      // Use lottie-react for standard Lottie JSON
      return (
        <LottieReact
          animationData={source}
          autoplay={autoPlay}
          loop={loop}
          style={style}
          data-testid={testID}
        />
      );
    } else {
      return <Text>Lottie not available on web</Text>;
    }
  }

  // Native implementation using lottie-react-native
  if (!nativeStatus.available || !NativeLottieView) {
    return (
      <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]} testID={testID}>
        <Text style={{ textAlign: 'center', opacity: 0.7 }}>
          Lottie animations require the native `lottie-react-native` module. Install it and rebuild the app, or view this example on the web.
        </Text>
      </View>
    );
  }

  return (
    <NativeLottieView
      ref={internalRef}
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      progress={progress}
      style={style as any}
      testID={testID}
      resizeMode={resizeMode}
      onAnimationFinish={onAnimationFinish}
      {...(paused != null ? { paused } : {})}
    />
  );
});

Lottie.displayName = 'Lottie';

export default Lottie;
