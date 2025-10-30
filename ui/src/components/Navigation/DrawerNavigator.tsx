import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Animated, Dimensions } from 'react-native';

import { useTheme } from '../../core/theme/ThemeProvider';

import { useNavigation } from './NavigationContext';
import type { DrawerNavigatorProps, DrawerScreenProps, DrawerOptions, Route } from './types';

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

export interface DrawerNavigatorConfig {
  Navigator: React.ComponentType<DrawerNavigatorProps>;
  Screen: React.ComponentType<DrawerScreenProps>;
}

function DrawerNavigator({
  children,
  initialRouteName,
  screenOptions,
  drawerStyle,
  drawerContent
}: DrawerNavigatorProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnimation = useState(new Animated.Value(-DRAWER_WIDTH))[0];
  const overlayAnimation = useState(new Animated.Value(0))[0];

  // Extract screens from children
  const screens = useMemo(() => {
    const screenElements: Array<{
      name: string;
      component: React.ComponentType<any>;
      options?: any;
      initialParams?: any
    }> = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as any;
        if (childProps.name) {
          screenElements.push({
            name: childProps.name,
            component: childProps.component,
            options: childProps.options,
            initialParams: childProps.initialParams
          });
        }
      }
    });

    return screenElements;
  }, [children]);

  // Initialize navigation state with screens
  useEffect(() => {
    if (screens.length > 0 && navigation.state.routes.length === 0) {
      const initialRoute = initialRouteName || screens[0].name;
      const route = screens.find(s => s.name === initialRoute) || screens[0];

      navigation.navigate(route.name, route.initialParams);
    }
  }, [screens, navigation, initialRouteName]);

  const toggleDrawer = useCallback(() => {
    const toValue = isDrawerOpen ? -DRAWER_WIDTH : 0;
    const overlayValue = isDrawerOpen ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(overlayAnimation, {
        toValue: overlayValue,
        duration: 250,
        useNativeDriver: false
      })
    ]).start();

    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen, drawerAnimation, overlayAnimation]);

  const closeDrawer = useCallback(() => {
    if (isDrawerOpen) {
      toggleDrawer();
    }
  }, [isDrawerOpen, toggleDrawer]);

  const handleNavigate = useCallback((routeName: string, params?: any) => {
    navigation.navigate(routeName, params);
    closeDrawer();
  }, [navigation, closeDrawer]);

  const currentRoute = navigation.state.routes[navigation.state.index];
  const currentScreen = screens.find(s => s.name === currentRoute?.name);

  if (!currentScreen || !currentRoute) {
    return null;
  }

  const Component = currentScreen.component;
  const options = typeof currentScreen.options === 'function'
    ? currentScreen.options({ route: currentRoute })
    : currentScreen.options || {};

  const mergedOptions = { ...screenOptions, ...options };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {mergedOptions.headerShown !== false && (
          <DrawerHeader
            route={currentRoute}
            options={mergedOptions}
            onMenuPress={toggleDrawer}
          />
        )}
        <Component route={currentRoute} navigation={navigation} />
      </View>

      {/* Overlay */}
      {isDrawerOpen && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayAnimation }
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            left: drawerAnimation,
            backgroundColor: theme.colors.gray[0]
          },
          drawerStyle
        ]}
      >
        {drawerContent ? (
          drawerContent({ navigation, screens, currentRoute })
        ) : (
          <DefaultDrawerContent
            screens={screens}
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            screenOptions={screenOptions}
          />
        )}
      </Animated.View>
    </View>
  );
}

interface DrawerHeaderProps {
  route: Route;
  options: DrawerOptions;
  onMenuPress: () => void;
}

function DrawerHeader({ route, options, onMenuPress }: DrawerHeaderProps) {
  const theme = useTheme();

  const title = options.headerTitle || options.title || route.name;

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.gray[0], borderBottomColor: theme.colors.gray[3] }]}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <View style={styles.hamburger}>
          <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.gray[7] }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.gray[7] }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.gray[7] }]} />
        </View>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: theme.text.primary }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.headerRight}>
        {options.headerRight && options.headerRight()}
      </View>
    </View>
  );
}

interface DefaultDrawerContentProps {
  screens: Array<{ name: string; component: React.ComponentType<any>; options?: any }>;
  currentRoute: Route;
  onNavigate: (routeName: string, params?: any) => void;
  screenOptions?: DrawerOptions;
}

function DefaultDrawerContent({ screens, currentRoute, onNavigate, screenOptions }: DefaultDrawerContentProps) {
  const theme = useTheme();

  return (
    <ScrollView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={[styles.drawerTitle, { color: theme.text.primary }]}>
          Navigation
        </Text>
      </View>

      {screens.map((screen) => {
        const options = typeof screen.options === 'function'
          ? screen.options({ route: currentRoute })
          : screen.options || {};

        const mergedOptions = { ...screenOptions, ...options };
        const isActive = currentRoute.name === screen.name;
        const label = mergedOptions.drawerLabel || mergedOptions.title || screen.name;

        return (
          <TouchableOpacity
            key={screen.name}
            style={[
              styles.drawerItem,
              isActive && { backgroundColor: theme.colors.primary[1] }
            ]}
            onPress={() => onNavigate(screen.name)}
          >
            {mergedOptions.drawerIcon && (
              <View style={styles.drawerIcon}>
                {mergedOptions.drawerIcon({
                  color: isActive ? theme.colors.primary[6] : theme.text.secondary,
                  size: 24,
                  focused: isActive
                })}
              </View>
            )}
            <Text style={[
              styles.drawerLabel,
              { color: isActive ? theme.colors.primary[6] : theme.text.primary }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function DrawerScreen({ name, component, options, initialParams }: DrawerScreenProps) {
  // This component is used for type definition and props passing
  // The actual rendering is handled by DrawerNavigator
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  drawer: {
    bottom: 0,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
    elevation: 16,
    position: 'absolute',
    top: 0,
    zIndex: 2
  },
  drawerContent: {
    flex: 1
  },
  drawerHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20
  },
  drawerIcon: {
    alignItems: 'center',
    marginRight: 16,
    width: 24
  },
  drawerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  hamburger: {
    height: 18,
    justifyContent: 'space-between',
    width: 24
  },
  hamburgerLine: {
    borderRadius: 1,
    height: 2,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 56,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 0
  },
  headerRight: {
    alignItems: 'flex-end',
    minWidth: 44
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600'
  },
  menuButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginRight: 8,
    width: 44
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 1
  },
  overlayTouchable: {
    flex: 1
  }
});

export function createDrawerNavigator<ParamList = Record<string, object | undefined>>(): DrawerNavigatorConfig {
  return {
    Navigator: DrawerNavigator,
    Screen: DrawerScreen as React.ComponentType<DrawerScreenProps>
  };
}
