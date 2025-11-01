import { Breadcrumbs, Text, Flex, Card, Icon } from '@platform-blocks/ui';

export default function SeparatorsBreadcrumbsDemo() {
  const breadcrumbItems = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Category', onPress: () => console.log('Category') },
    { label: 'Subcategory', onPress: () => console.log('Subcategory') },
    { label: 'Product' }
  ];

  return (
    <Card>
      <Flex direction="column" gap={24}>
        <Text size="lg" weight="semibold">Custom Separators</Text>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Default Separator (/)</Text>
          <Breadcrumbs items={breadcrumbItems} />
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Arrow Separator</Text>
          <Breadcrumbs items={breadcrumbItems} separator=">" />
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Chevron Icon Separator</Text>
          <Breadcrumbs 
            items={breadcrumbItems} 
            separator={<Icon name="chevron-right" size={14} />} 
          />
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Legacy Icon Separator</Text>
          <Breadcrumbs 
            items={breadcrumbItems} 
            separator={<Icon name="chevron-right" size={14} />} 
          />
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Bullet Separator</Text>
          <Breadcrumbs items={breadcrumbItems} separator="•" />
        </Flex>
      </Flex>
    </Card>
  );
}
