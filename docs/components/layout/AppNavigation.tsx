import React from 'react';
import { Platform, ScrollView, Pressable, Linking } from 'react-native';
import { router, usePathname } from 'expo-router';
import {
  useTheme,
  useAppShellLayout,
  useNavbarHover,
  Text,
  Button,
  Flex,
  Divider,
  useI18n,
} from '@platform-blocks/ui';
import { BrandIcon, MenuItemButton } from 'platform-blocks/components';
import { NAV_SECTIONS, type NavSection, type NavItem } from '../../config/navigationConfig';
import { GITHUB_REPO, NPM_PACKAGE } from '../../config/urls';
import { Icon } from '@platform-blocks/ui';

interface AppNavigationProps {
  onNavigate: (route: string) => void;
}

export function AppNavigation({ onNavigate }: AppNavigationProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const { navbarWidth } = useAppShellLayout();
  const hovering = useNavbarHover?.() || false;
  const { t } = useI18n();
  
  // Derive "rail" from navbarWidth. When width equals the collapsed rail width (default 72),
  // we treat it as rail. This avoids subscribing to broader AppShell state.
  const coerceNumber = (v: any, fallback: number): number =>
    typeof v === 'number' ? v : typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : fallback;
  const rail = coerceNumber(navbarWidth as any, 72) <= 72;
  const railCollapsed = rail && !hovering;
  const showLabels = !railCollapsed;
  const paddingHorizontal = railCollapsed ? 0 : (rail ? 8 : 12);
  const paddingVertical = rail ? 8 : 12;

  return (
    <Flex direction="column" style={{ flex: 1, height: '100%', paddingHorizontal, paddingVertical, width: '100%' }}>
      {/* Header */}
      <Flex direction="row" align="center" gap="md" style={{ 
        marginBottom: 16, 
        opacity: showLabels ? 1 : 0, 
        height: showLabels ? 'auto' : 0, 
        overflow: 'hidden' 
      }}>
        <Icon name="zap" size={24} color={theme.colors.primary[5]} />
        {showLabels && (
          <Text size="lg" weight="bold" colorVariant="primary">
            PlatformBlocks
          </Text>
        )}
      </Flex>

      {/* Navigation */}
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
      >
        <Flex direction="column" gap={rail ? 'sm' : 'lg'} style={{ 
          alignItems: railCollapsed ? 'center' : 'stretch', 
          width: '100%', 
          margin: railCollapsed ? 'auto' : undefined 
        }}>
          {NAV_SECTIONS.map((section) => (
            <NavigationSection
              key={section.section}
              section={section}
              showLabels={showLabels}
              railCollapsed={railCollapsed}
              rail={rail}
              pathname={pathname}
              theme={theme}
              onNavigate={onNavigate}
            />
          ))}
        </Flex>
      </ScrollView>

      {/* Footer */}
      <NavigationFooter showLabels={showLabels} />
    </Flex>
  );
}

// Extract navigation section to its own component
interface NavigationSectionProps {
  section: NavSection;
  showLabels: boolean;
  railCollapsed: boolean;
  rail: boolean;
  pathname: string;
  theme: any;
  onNavigate: (route: string) => void;
}

function NavigationSection({ 
  section, 
  showLabels, 
  railCollapsed, 
  rail, 
  pathname, 
  theme, 
  onNavigate 
}: NavigationSectionProps) {
  return (
    <Flex key={section.section} direction="column" gap="xs" style={{ 
      marginBottom: rail ? 4 : 12, 
      alignItems: railCollapsed ? 'center' : 'stretch', 
      width: '100%' 
    }}>
      {showLabels && (
        <Text size="sm" weight="semibold" colorVariant="secondary" style={{ paddingHorizontal: 4 }}>
          {section.section.toUpperCase()}
        </Text>
      )}
      {section.items.map((item: NavItem) => {
        const isActive = pathname === item.route || (item.route === '/' && pathname === '/');
        const iconColor = isActive ? theme.colors.primary[6] : theme.text.primary;
        
        if (railCollapsed) {
          return (
            <Pressable
              key={item.route}
              onPress={() => onNavigate(item.route)}
              style={({ pressed }) => [{
                width: 48,
                height: 48,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 2,
                backgroundColor: pressed || isActive ? theme.colors.primary[0] : 'transparent'
              }]}
              accessibilityLabel={item.label}
            >
              <Icon name={item.icon as any} size={24} color={iconColor} />
            </Pressable>
          );
        }
        
        return (
          <MenuItemButton
            key={item.route}
            active={isActive}
            size={'sm'}
            title={item.label}
            startIcon={<Icon name={item.icon as any} size={18} color={iconColor} />}
            rounded
            onPress={() => onNavigate(item.route)}
            style={{ justifyContent: 'flex-start' }}
          />
        );
      })}
    </Flex>
  );
}

interface NavigationFooterProps {
  showLabels: boolean;
}

function NavigationFooter({ showLabels }: NavigationFooterProps) {
  const { t } = useI18n();
  
  return (
    <Flex direction="column" gap="sm" style={{ 
      paddingTop: 16, 
      width: '100%', 
      alignItems: showLabels ? 'flex-end' : 'center' 
    }}>
      {showLabels && <Divider />}
      <Flex direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
        <Button
          size="xs"
          variant="ghost"
          {...(showLabels
            ? {
                startIcon: <BrandIcon brand="github" size={16} />, 
                title: 'GitHub',
              }
            : {
                icon: <BrandIcon brand="github" size={16} />,
                tooltip: 'GitHub',
              }
          )}
          onPress={() => Linking.openURL(GITHUB_REPO)}
        />
        <Button
          size="xs"
          variant="ghost"
          {...(showLabels
            ? {
                startIcon: <Icon name="npm" size={16} />, 
                title: 'NPM',
              }
            : {
                icon: <Icon name="npm" size={16} />,
                tooltip: 'NPM',
              }
          )}
          onPress={() => Linking.openURL(NPM_PACKAGE)}
        />
      </Flex>
      {showLabels && (
        <Text size="xs" colorVariant="muted">
          {t('nav.versionLine', { version: 'v1.0.0' })}
        </Text>
      )}
    </Flex>
  );
}
