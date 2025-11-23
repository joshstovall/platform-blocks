import React, { useMemo, useCallback } from 'react';
import {  Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Flex, Text, BrandIcon, useTheme, useAppShellLayout, useNavbarHover, Button, Divider, useI18n, Image, Tree, Icon } from '@platform-blocks/ui';
import type { TreeNode } from '@platform-blocks/ui';
import { NAV_SECTIONS, type NavItem, isRouteActive } from '../../config/navigationConfig';
import { NavigationSection } from './NavigationSection';
import { GITHUB_REPO, NPM_PACKAGE } from '../../config/urls';
import { Linking } from 'react-native';

export const AppNavigation: React.FC = () => {
  const theme = useTheme();
  const { navbarWidth } = useAppShellLayout();
  const hovering = useNavbarHover?.() || false;
  const pathname = usePathname();
  const coerceNumber = (v: any, fallback: number): number =>
    typeof v === 'number' ? v : typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : fallback;
  const rail = coerceNumber(navbarWidth as any, 72) <= 72;
  const railCollapsed = rail && !hovering;
  const showLabels = !railCollapsed;
  const paddingHorizontal = railCollapsed ? 0 : (rail ? 8 : 12);
  const paddingVertical = rail ? 8 : 12;
  const { t } = useI18n();

  const treeData = useMemo<TreeNode[]>(() => (
    NAV_SECTIONS.map(section => ({
      id: `section-${section.section.toLowerCase().replace(/\s+/g, '-')}`,
      label: section.section,
      selectable: false,
      startOpen: true,
      children: section.items.map(item => ({
        id: item.route,
        label: item.label,
        data: item,
      })),
    }))
  ), []);

  const selectedRouteId = useMemo(() => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (isRouteActive(pathname, item.route)) {
          return item.route;
        }
      }
    }
    return null;
  }, [pathname]);

  const handleNodePress = useCallback((node: TreeNode, context: { isBranch: boolean }) => {
    if (context.isBranch) return;
    const navItem = node.data as NavItem | undefined;
    if (navItem) {
      router.push(navItem.route);
    }
  }, []);

  const renderTreeLabel = useCallback((node: TreeNode, _depth: number, _isOpen: boolean, state: { selected: boolean }) => {
    const isBranch = Array.isArray(node.children) && node.children.length > 0;
    if (isBranch) {
      return (
        <Text size="xs" weight="semibold" colorVariant="info" tracking={1} uppercase>
          {node.label.toUpperCase()}
        </Text>
      );
    }

    const navItem = node.data as NavItem | undefined;
    const primaryPalette = theme.colors?.primary || [];
    const iconColor = state.selected ? (primaryPalette[6] || theme.text.primary) : (theme.text.secondary || theme.text.primary);
    const textColor = state.selected ? (primaryPalette[7] || theme.text.primary) : theme.text.primary;

    return (
      <Flex direction="row" align="center" gap="sm">
        {navItem?.icon && <Icon name={navItem.icon} size={16} color={iconColor} />}
        <Text size="sm" weight={state.selected ? '600' : '400'} style={{ color: textColor }}>
          {node.label}
        </Text>
      </Flex>
    );
  }, [theme.colors?.primary, theme.text.primary, theme.text.secondary]);

  return (
    <Flex direction="column" style={{ flex: 1, height: '100%', paddingHorizontal, paddingVertical, width: '100%' }}>
      {/* <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
        <Flex direction="row" align="center" gap="md" style={{ marginBottom: 16, opacity: showLabels ? 1 : 0, height: showLabels ? 'auto' : 0, overflow: 'hidden' }}>
          <Image
            source={require('../../assets/favicon.png')}
            src="nav-logo"
            width={32}
            height={32}
            resizeMode="contain"
          />
          {showLabels && (
            <Text size="lg" weight="bold" colorVariant="info">
              Platform Blocks
            </Text>
          )}
        </Flex>
      </TouchableOpacity> */}
      
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }} showsVerticalScrollIndicator={Platform.OS !== 'web'}>
        <Flex
          direction="column"
          style={{ alignItems: railCollapsed ? 'center' : 'stretch', width: '100%', margin: railCollapsed ? 'auto' : undefined }}
        >
          {showLabels ? (
            <Tree
              data={treeData}
              selectionMode="single"
              selectedIds={selectedRouteId ? [selectedRouteId] : []}
              onNodePress={handleNodePress}
              useAnimations
              style={{ width: '100%' }}
              renderLabel={renderTreeLabel}
            />
          ) : (
            NAV_SECTIONS.map(section => (
              <NavigationSection
                key={section.section}
                section={section}
                variant="rail"
                railCollapsed
                showSectionTitle={false}
              />
            ))
          )}
        </Flex>
      </ScrollView>
      
      <Flex direction="column" gap="sm" style={{ paddingTop: 16, width: '100%', alignItems: showLabels ? 'flex-end' : 'center' }}>
        {/* {showLabels && <Divider />} */}
        <Flex
          direction="row"
          gap="sm"
          style={{ flexWrap: 'wrap', justifyContent: railCollapsed ? 'center' : 'flex-end', width: '100%' }}
        >
          <Button
            size="xs"
            variant="ghost"
            startIcon={<BrandIcon brand="github" size={16} />}
            title={showLabels ? 'GitHub' : ''}
            onPress={() => Linking.openURL(GITHUB_REPO)}
          />
          <Button
            size="xs"
            variant="ghost"
            startIcon={<BrandIcon brand="npm" size={16} />}
            title={showLabels ? 'NPM' : ''}
            onPress={() => Linking.openURL(NPM_PACKAGE)}
          />
        </Flex>
        {/* {showLabels && (
          <Text size="xs" colorVariant="muted">
            {t('nav.versionLine', { version: 'v1.0.0' })}
          </Text>
        )} */}
      </Flex>
    </Flex>
  );
};
