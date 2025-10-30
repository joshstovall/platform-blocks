import React from 'react';
import {  Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Flex, Text, BrandIcon, useTheme, useAppShellLayout, useNavbarHover, Button, Divider, useI18n, Image } from '@platform-blocks/ui';
import { NAV_SECTIONS } from '../../config/navigationConfig';
import { NavigationSection } from './NavigationSection';
import { GITHUB_REPO, NPM_PACKAGE } from '../../config/urls';
import { Linking } from 'react-native';

export const AppNavigation: React.FC = () => {
  const theme = useTheme();
  const { navbarWidth } = useAppShellLayout();
  const hovering = useNavbarHover?.() || false;
  const coerceNumber = (v: any, fallback: number): number =>
    typeof v === 'number' ? v : typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : fallback;
  const rail = coerceNumber(navbarWidth as any, 72) <= 72;
  const railCollapsed = rail && !hovering;
  const showLabels = !railCollapsed;
  const paddingHorizontal = railCollapsed ? 0 : (rail ? 8 : 12);
  const paddingVertical = rail ? 8 : 12;
  const { t } = useI18n();

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
        <Flex direction="column" 
        // gap={rail ? 'sm' : 'lg'}
         style={{ alignItems: railCollapsed ? 'center' : 'stretch', width: '100%', margin: railCollapsed ? 'auto' : undefined }}>
          {NAV_SECTIONS.map(section => (
            <NavigationSection
              key={section.section}
              section={section}
              variant={rail ? 'rail' : 'desktop'}
              railCollapsed={railCollapsed}
              showSectionTitle={showLabels}
            />
          ))}
        </Flex>
      </ScrollView>
      
      <Flex direction="column" gap="sm" style={{ paddingTop: 16, width: '100%', alignItems: showLabels ? 'flex-end' : 'center' }}>
        {showLabels && <Divider />}
        <Flex direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
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
