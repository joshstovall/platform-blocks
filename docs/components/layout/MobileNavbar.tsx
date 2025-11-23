import React from 'react';
import { Platform, ScrollView } from 'react-native';
import {
  Dialog,
  Flex,
  useTheme,
  useAppShell,
  useAppShellApi,
  Text,
  IconButton,
} from '@platform-blocks/ui';
import { MobileNavigation } from './MobileNavigation';

export const MobileNavbar: React.FC = () => {
  const theme = useTheme();
  const { isMobile, navbarOpen } = useAppShell();
  const { closeNavbar } = useAppShellApi();

  if (!isMobile) {
    return null;
  }

  return (
    <Dialog
      visible={navbarOpen}
      onClose={closeNavbar}
      variant="fullscreen"
      closable
      backdrop
      backdropClosable
      title="Navigation"
      style={{ backgroundColor: theme.backgrounds.surface }}
    >
      <Flex direction="column" style={{ flex: 1, backgroundColor: theme.backgrounds.surface }}>
        {/* <Flex
          direction="row"
          align="center"
          justify="space-between"
          px="lg"
          py="md"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.gray[2],
          }}
        >
          <Text size="lg" weight="semibold">
            Platform Blocks
          </Text>
          <IconButton
            icon="x"
            variant="ghost"
            size="lg"
            accessibilityLabel="Close navigation"
            onPress={closeNavbar}
          />
        </Flex> */}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
        >
          <MobileNavigation onItemPress={closeNavbar} />
        </ScrollView>
      </Flex>
    </Dialog>
  );
};
