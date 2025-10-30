import React from 'react';
import { AppStoreDownloadBadge, Column } from '@platform-blocks/ui';

export default function Sizes() {
  return (
    <Column gap="md">
      <AppStoreDownloadBadge size="sm" onPress={() => console.log('Small pressed')} />
      <AppStoreDownloadBadge size="md" onPress={() => console.log('Medium pressed')} />
      <AppStoreDownloadBadge size="lg" onPress={() => console.log('Large pressed')} />
      <AppStoreDownloadBadge size="xl" onPress={() => console.log('Extra Large pressed')} />
    </Column>
  );
}