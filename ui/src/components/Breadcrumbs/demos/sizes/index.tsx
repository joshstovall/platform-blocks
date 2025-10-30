import React from 'react';
import { Breadcrumbs, Text, Flex, Card } from '@platform-blocks/ui';

export default function SizesBreadcrumbsDemo() {
  const breadcrumbItems = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Category', onPress: () => console.log('Category') },
    { label: 'Product' }
  ];

  return (
    <Card>
      <Flex direction="column" gap={24}>
        <Text size="lg" weight="semibold">Breadcrumb Sizes</Text>
        
        <Flex direction="column" gap={8}>
          <Text size="sm" weight="medium">Extra Small (xs)</Text>
          <Breadcrumbs items={breadcrumbItems} size="xs" />
        </Flex>
        
        <Flex direction="column" gap={8}>
          <Text size="sm" weight="medium">Small (sm)</Text>
          <Breadcrumbs items={breadcrumbItems} size="sm" />
        </Flex>
        
        <Flex direction="column" gap={8}>
          <Text size="sm" weight="medium">Medium (md) - Default</Text>
          <Breadcrumbs items={breadcrumbItems} size="md" />
        </Flex>
        
        <Flex direction="column" gap={8}>
          <Text size="sm" weight="medium">Large (lg)</Text>
          <Breadcrumbs items={breadcrumbItems} size="lg" />
        </Flex>
      </Flex>
    </Card>
  );
}
