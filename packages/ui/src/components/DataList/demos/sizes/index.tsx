import { Column, Text, DataList } from '@platform-blocks/ui';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      {SIZES.map((size) => (
        <Column key={size} gap="xs">
          <Text size="xs" colorVariant="secondary" uppercase>
            {size}
          </Text>
          <DataList size={size} labelWidth={90}>
            <DataList.Item>
              <DataList.ItemLabel>Status</DataList.ItemLabel>
              <DataList.ItemValue>Active</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Region</DataList.ItemLabel>
              <DataList.ItemValue>us-east-1</DataList.ItemValue>
            </DataList.Item>
          </DataList>
        </Column>
      ))}
    </Column>
  );
}
