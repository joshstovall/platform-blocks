import React from 'react';
import { Flex } from '@platform-blocks/ui';
import { NAV_SECTIONS } from '../../config/navigationConfig';
import { NavigationSection } from './NavigationSection';

export interface MobileNavigationProps {
  onItemPress?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(({ onItemPress }) => {
  return (
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
  );
});

MobileNavigation.displayName = 'MobileNavigation';
