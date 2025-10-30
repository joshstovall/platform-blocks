import React from 'react';
import { Breadcrumbs, Text, Flex, Card } from '@platform-blocks/ui';

export default function BasicBreadcrumbsDemo() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Smartphones' }
  ];

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Basic Breadcrumbs</Text>
        <Text size="sm" colorVariant="secondary">
          Navigate through page hierarchy
        </Text>
        <Breadcrumbs items={breadcrumbItems} />
      </Flex>
    </Card>
  );
}
