import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../core/theme/ThemeProvider';
import { Icon } from '../Icon';

import { useNavigation } from './NavigationContext';
import type { StackNavigatorProps, StackScreenProps, StackOptions, Route } from './types';

export interface StackNavigatorConfig {
  Navigator: React.ComponentType<StackNavigatorProps>;
  Screen: React.ComponentType<StackScreenProps>;
}

function StackNavigator({ children, initialRouteName, screenOptions }: StackNavigatorProps) {
  const navigation = useNavigation();
  const theme = useTheme();

  // Extract screens from children
  const screens = useMemo(() => {
    const screenElements: Array<{ name: string; component: React.ComponentType<any>; options?: any; initialParams?: any }> = [];

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
      {mergedOptions.headerShown !== false && (
        <StackHeader
          route={currentRoute}
          options={mergedOptions}
          canGoBack={navigation.canGoBack()}
          onGoBack={navigation.goBack}
        />
      )}
      <View style={styles.content}>
        <Component route={currentRoute} navigation={navigation} />
      </View>
    </View>
  );
}

interface StackHeaderProps {
  route: Route;
  options: StackOptions;
  canGoBack: boolean;
  onGoBack: () => void;
}

function StackHeader({ route, options, canGoBack, onGoBack }: StackHeaderProps) {
  const theme = useTheme();

  const title = options.headerTitle || options.title || route.name;

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.gray[0], borderBottomColor: theme.colors.gray[3] }]}>
      <View style={styles.headerLeft}>
        {canGoBack && (
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Icon name="chevron-left" size="md" color={theme.colors.primary[6]} />
            {Platform.OS === 'ios' && options.headerBackTitle && (
              <Text style={[styles.backTitle, { color: theme.colors.primary[6] }]}>
                {options.headerBackTitle}
              </Text>
            )}
          </TouchableOpacity>
        )}
        {options.headerLeft && options.headerLeft()}
      </View>

      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.headerRight}>
        {options.headerRight && options.headerRight()}
      </View>
    </View>
  );
}

function StackScreen({ name, component, options, initialParams }: StackScreenProps) {
  // This component is used for type definition and props passing
  // The actual rendering is handled by StackNavigator
  return null;
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 8
  },
  backTitle: {
    fontSize: 16,
    marginLeft: 4
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1
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
  headerCenter: {
    alignItems: 'center',
    flex: 2
  },
  headerLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  headerRight: {
    alignItems: 'flex-end',
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600'
  }
});

export function createStackNavigator<ParamList = Record<string, object | undefined>>(): StackNavigatorConfig {
  return {
    Navigator: StackNavigator,
    Screen: StackScreen as React.ComponentType<StackScreenProps>
  };
}
