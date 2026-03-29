import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const options = ['React', 'Angular', 'Vue'];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Choose from the full size scale to match surrounding inputs or navigation elements.
          </Text>
          <Column gap="sm">
            {sizes.map((size) => (
              <Column key={size} gap="xs">
                <Text size="xs" colorVariant="secondary">
                  Size: {size.toUpperCase()}
                </Text>
                <SegmentedControl size={size} defaultValue="react" data={options} />
              </Column>
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
