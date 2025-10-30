import React from 'react';
import { View, Platform, Pressable } from 'react-native';
import { Text } from '../Text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../core/theme/ThemeProvider';
import type { AppShellBottomNavProps, BottomAppBarItem } from './types';
import { Search } from '../Search';

const getVariantStyles = (variant: AppShellBottomNavProps['variant'], theme: any, elevation: number | undefined) => {
  switch (variant) {
    case 'surface':
      return { backgroundColor: theme.backgrounds.surface };
    case 'elevated':
      return {
        backgroundColor: theme.backgrounds.surface,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
        elevation: elevation ?? 4,
      };
    case 'translucent':
      return Platform.select({
        web: {
          backgroundColor: theme.colorScheme === 'dark' ? 'rgba(20,20,22,0.55)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
        default: {
          backgroundColor: theme.colorScheme === 'dark' ? 'rgba(20,20,22,0.75)' : 'rgba(255,255,255,0.82)'
        }
      });
    case 'solid':
    default:
      return { backgroundColor: theme.backgrounds.base };
  }
};

const ItemBadge: React.FC<{ count?: number; active?: boolean; }> = ({ count, active }) => {
  if (!count || count < 0) return null;
  const limited = count > 99 ? '99+' : String(count);
  return (
    <View style={{
      position: 'absolute',
      top: -4,
      right: -10,
      backgroundColor: active ? '#FF4D4F' : '#FF5F56',
      paddingHorizontal: 6,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View /* text fallback */>
        {/* Using plain RN Text would require import; we can rely on platform default; lightweight approach */}
      </View>
    </View>
  );
};

const NavItem: React.FC<{
  key?: React.Key;
  item: BottomAppBarItem; active: boolean; onPress: () => void; showLabel: boolean; theme: any;
}> = ({ item, active, onPress, showLabel, theme }) => {
  const color = active ? theme.colors.primary[5] : theme.colors.gray[6];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ([{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        opacity: pressed ? 0.65 : 1,
      }])}
    >
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{
          // Icon container (allow subtle active indicator ring)
          padding: 6,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: active ? (theme.colorScheme === 'dark' ? theme.colors.primary[8] : theme.colors.primary[0]) : 'transparent'
        }}>
          {active && item.activeIcon ? item.activeIcon : item.icon}
        </View>
        <ItemBadge count={item.badgeCount} active={active} />
      </View>
      {showLabel && (
        <Text
          size="xs"
          style={{
            marginTop: 2,
            fontSize: 10,
            color,
            textAlign: 'center'
          }}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
};

export const BottomAppBar: React.FC<AppShellBottomNavProps> = ({
  children,
  items,
  activeKey,
  onItemPress,
  showLabels = true,
  variant = 'solid',
  elevation,
  fab,
  withBorder = true,
  zIndex,
  style
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const safeItems = React.useMemo(() => items || [], [items]);
  const handleItemPress = React.useCallback((key: string, itemOnPress?: () => void) => {
    itemOnPress?.();
    onItemPress?.(key);
  }, [onItemPress]);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        {
          ...getVariantStyles(variant, theme, elevation),
          borderTopWidth: withBorder ? 1 : 0,
          borderTopColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
          zIndex: zIndex || 1000,
          ...(Platform.OS === 'web'
            ? {
                position: 'sticky' as any,
                bottom: 0,
                left: 0,
                right: 0
              }
            : {
                position: 'absolute' as any,
                bottom: 0,
                left: 0,
                right: 0
              })
        },
        style
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', minHeight: 56, paddingHorizontal: 4 }}>
        {safeItems && safeItems.length > 0 ? (
          safeItems.map(it => (
            <NavItem
              key={it.key}
              item={it}
              theme={theme}
              active={it.key === activeKey}
              showLabel={showLabels}
              onPress={() => handleItemPress(it.key, it.onPress)}
            />
          ))
        ) : (
          children
        )}
      </View>
      {fab && (
        <View style={{ position: 'absolute', top: -32, alignSelf: 'center', elevation: 8 }}>
          {fab}
        </View>
      )}

    </SafeAreaView>
  );
};
