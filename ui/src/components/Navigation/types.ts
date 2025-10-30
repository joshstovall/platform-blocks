import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface NavigationState {
  routes: Route[];
  index: number;
  key: string;
}

export interface Route {
  key: string;
  name: string;
  params?: Record<string, any>;
}

export interface NavigationOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerLeft?: () => ReactNode;
  headerRight?: () => ReactNode;
  headerBackTitle?: string;
}

export interface ScreenProps {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions | ((props: { route: Route }) => NavigationOptions);
  initialParams?: Record<string, any>;
}

export interface NavigatorProps {
  children: ReactNode;
  initialRouteName?: string;
  screenOptions?: NavigationOptions;
}

export interface DrawerOptions extends NavigationOptions {
  drawerIcon?: (props: { color: string; size: number; focused: boolean }) => ReactNode;
  drawerLabel?: string;
}

export interface DrawerScreenProps extends Omit<ScreenProps, 'options'> {
  options?: DrawerOptions | ((props: { route: Route }) => DrawerOptions);
}

export interface DrawerNavigatorProps extends NavigatorProps {
  screenOptions?: DrawerOptions;
  drawerStyle?: ViewStyle;
  drawerContent?: (props: any) => ReactNode;
}

export interface StackOptions extends NavigationOptions {
  presentation?: 'modal' | 'card';
  gestureEnabled?: boolean;
}

export interface StackScreenProps extends Omit<ScreenProps, 'options'> {
  options?: StackOptions | ((props: { route: Route }) => StackOptions);
}

export interface StackNavigatorProps extends NavigatorProps {
  screenOptions?: StackOptions;
}

export interface NavigationContext {
  state: NavigationState;
  navigate: (name: string, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: (state: NavigationState) => void;
}
