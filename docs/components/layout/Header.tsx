import React, { useState } from 'react';
import { Flex, Text, Breadcrumbs, Image, useAppShell, Search, Row, KeyCap } from '@platform-blocks/ui';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { HeaderDirectionToggle } from './HeaderDirectionToggle';
import { NavIconButton } from './NavIconButton';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

export const AppHeader: React.FC = () => {
  const { headerHeight } = useAppShell();
  const breadcrumbs = useBreadcrumbs();
  const [navSidebarOpen, setNavSidebarOpen] = useState(false);

  // CMD+K shortcut component
  const shortcutComponent = (
    <Row gap={4} align="center">
      <KeyCap>⌘</KeyCap>
      <KeyCap>K</KeyCap>
    </Row>
  );

  return (
    <>
      <Flex direction="row" justify="space-between" align="center" px="md" style={{ height: typeof headerHeight === 'number' ? headerHeight : 60 }}>
        <Flex direction="row" align="center" gap="md">
          <NavIconButton
            icon="menu"
            onPress={() => setNavSidebarOpen(!navSidebarOpen)}
            accessibilityLabel="Toggle navigation menu"
          />
          <Flex direction="row" align="center" gap="sm">
            <Image
              source={require('../../assets/favicon.png')}
              src="app-shell-logo"
              width={26}
              height={26}
              resizeMode="contain"
            />
            <Text size="xl" weight="bold">
              Platform Blocks
            </Text>
          </Flex>
          <Breadcrumbs
            items={breadcrumbs}
            size="xs"
            maxItems={4}
          />
        </Flex>

        <Flex direction="row" gap="sm" align="center">

          <Search
            buttonMode={true}
            placeholder="Search"
            rightComponent={shortcutComponent}
          />
          <HeaderDirectionToggle />
          <HeaderThemeToggle />
        </Flex>
      </Flex>

    </>
  );
};
