import React, { useMemo, useCallback } from 'react';
import { Platform, Linking } from 'react-native';
import { usePathname } from 'expo-router';
import {
  useTheme,
  useAppShellApi,
  Text,
  Button,
  Icon,
  Flex,
  useI18n,
  BrandIcon,
} from '@platform-blocks/ui';
import { useThemeMode } from '@platform-blocks/ui';
import { directSpotlight } from '@platform-blocks/ui';
import { GITHUB_REPO } from '../../config/urls';
import { NAVIGATION_ITEMS } from '../../config/navigationConfig';

interface AppHeaderProps {
  onThemeToggle?: () => void;
}

export function AppHeader({ onThemeToggle }: AppHeaderProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const { toggleNavbar } = useAppShellApi();

  // Get page title based on current route
  const getPageTitle = useCallback(() => {
    for (const section of NAVIGATION_ITEMS) {
      const item = section.items.find(item => item.route === pathname);
      if (item) return item.label;
    }
    return 'Platform Blocks';
  }, [pathname]);

  const handleLanguageToggle = useCallback(() => {
    setLocale(locale.startsWith('en') ? 'fr' : 'en');
  }, [locale, setLocale]);

  const handleOpenSpotlight = useCallback(() => {
    directSpotlight.open();
  }, []);

  const handleOpenGitHub = useCallback(() => {
    Linking.openURL(GITHUB_REPO);
  }, []);

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
    >
      {/* Left side with menu button and title */}
      <Flex direction="row" align="center" gap="md">
        <Button
          size="sm"
          variant="ghost"
          icon={<Icon name="menu" size={16} />}
          title={''}
          onPress={toggleNavbar}
        />
        <Flex direction="column">
          <Text size="lg" weight="bold">
            {getPageTitle()}
          </Text>
          <Text size="sm" colorVariant="secondary">
            {t('app.tagline')}
          </Text>
        </Flex>
      </Flex>

      {/* Right side with actions */}
      <Flex direction="row" gap="sm" style={{ marginTop: 'auto' }}>
        <Button
          size="sm"
          variant="ghost"
          icon={<Icon name="search" size={16} />}
          title={''}
          onPress={handleOpenSpotlight}
        />
        <HeaderThemeToggle />
        <Button
          size="sm"
          variant="ghost"
          title={locale.split('-')[0].toUpperCase()}
          onPress={handleLanguageToggle}
        />
        <Button
          size="sm"
          variant="outline"
          startIcon={<BrandIcon brand="github" size={16} />}
          title="GitHub"
          onPress={handleOpenGitHub}
        />
      </Flex>
    </Flex>
  );
}

const HeaderThemeToggle: React.FC = () => {
  const { mode, cycleMode } = useThemeMode();
  const icon = mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'brightness-auto';
  
  return (
    <Button
      size="sm"
      variant="ghost"
      startIcon={<Icon name={icon as any} size={16} />}
      title={mode === 'auto' ? 'AUTO' : mode.toUpperCase()}
      onPress={cycleMode}
    />
  );
};
