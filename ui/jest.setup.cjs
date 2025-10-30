// Jest setup file for React Native Testing Library
// Note: @testing-library/jest-native is deprecated, use built-in matchers instead
// import '@testing-library/react-native/extend-expect';

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View,
      Text: View,
      ScrollView: View,
      createAnimatedComponent: (Component) => Component,
    },
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (cb) => cb(),
    withTiming: (value) => value,
    withSpring: (value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[0],
    cancelAnimation: () => {},
    interpolate: (value, inputRange, outputRange) => {
      // Simple interpolation mock
      return outputRange[0];
    },
    interpolateColor: (value, inputRange, outputRange) => {
      // Simple color interpolation mock - return first color
      return outputRange[0];
    },
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    Easing: {
      linear: (t) => t,
      ease: (t) => t,
      quad: (t) => t,
      cubic: (t) => t,
      back: (s) => (t) => t,
      elastic: (bounciness) => (t) => t,
      bounce: (t) => t,
      bezier: () => (t) => t,
      inOut: (easing) => (t) => t,
      out: (easing) => (t) => t,
      in: (easing) => (t) => t,
    },
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
  };
});

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock SVG
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    Svg: View,
    Circle: View,
    Ellipse: View,
    G: View,
    Text: View,
    TSpan: View,
    TextPath: View,
    Path: View,
    Polygon: View,
    Polyline: View,
    Line: View,
    Rect: View,
    Use: View,
    Image: View,
    Symbol: View,
    Defs: View,
    LinearGradient: View,
    RadialGradient: View,
    Stop: View,
    ClipPath: View,
    Pattern: View,
    Mask: View,
  };
});

// Mock Expo Linear Gradient
jest.mock('expo-linear-gradient', () => {
  const View = require('react-native').View;
  return {
    LinearGradient: View,
  };
});

// Mock I18n Context
jest.mock('./src/core/i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
    setLocale: jest.fn(),
    supportedLocales: ['en'],
  }),
}));

// Mock Direction Provider
jest.mock('./src/core/providers/DirectionProvider', () => ({
  useDirection: () => ({
    direction: 'ltr',
    isRTL: false,
    setDirection: jest.fn(),
  }),
  DirectionProvider: ({ children }) => children,
}));

// Simplified mocks for initial setup
// React Native mocks can be added as needed

global.testUtils = {
  createMockTheme: () => ({
    colors: {
      primary: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
      gray: ['#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121'],
      success: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'],
      warning: ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100'],
      error: ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    radius: {
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
    },
    colorScheme: 'light',
  }),
};
