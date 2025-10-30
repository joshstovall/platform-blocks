import React from 'react';
import { Pressable } from 'react-native';
import {
  Flex,
  IconButton,
  Image,
  Text,
  useAppShellApi,
  useTheme,
  useThemeMode,
} from '@platform-blocks/ui';
import { useRouter } from 'expo-router';

export interface DocsMobileHeaderProps {
  orientation: 'portrait' | 'landscape';
}

/**
 * Compact header variant tailored for mobile layouts. Shows a menu toggle,
 * brand identity, and theme switcher while keeping the footprint small.
 */
export const DocsMobileHeader: React.FC<DocsMobileHeaderProps> = ({ orientation }) => {
  const { openNavbar } = useAppShellApi();
  const { mode, cycleMode } = useThemeMode();
  const theme = useTheme();
  const router = useRouter();

  const themeIcon = mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'contrast';

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      px="md"
      style={{
        height: orientation === 'landscape' ? 60 : 56,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[0],
      }}
    >
      <IconButton
        icon="menu"
        variant="ghost"
        size="lg"
        accessibilityLabel="Open navigation menu"
        onPress={openNavbar}
      />

      <Pressable
        onPress={() => router.push('/')}
        accessibilityRole="link"
        accessibilityLabel="Go to docs home"
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Image
          source={require('../../assets/favicon.png')}
          src="docs-mobile-header-logo"
          width={24}
          height={24}
          resizeMode="contain"
          style={{ marginRight: 8 }}
        />
        <Text size="lg" weight="semibold">
          Platform Blocks
        </Text>
      </Pressable>

      <IconButton
        icon={themeIcon as any}
        iconVariant={ mode !== 'light' && mode !== 'dark' && 'filled'}
        variant="ghost"
        size="lg"
        accessibilityLabel="Toggle theme mode"
        onPress={cycleMode}
      />
    </Flex>
  );
};
