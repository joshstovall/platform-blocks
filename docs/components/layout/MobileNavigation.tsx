import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { Flex } from '@platform-blocks/ui';
import { NAV_SECTIONS } from '../../config/navigationConfig';
import { NavigationSection } from './NavigationSection';

export interface MobileNavigationProps {
  onItemPress?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(({ onItemPress }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
    >
      <Flex direction="column" gap="lg">
        {NAV_SECTIONS.map(section => (
          <NavigationSection
            key={section.section}
            section={section}
            variant="mobile"
            onItemPress={onItemPress}
          />
        ))}
      </Flex>
    </ScrollView>
  );
});

MobileNavigation.displayName = 'MobileNavigation';
