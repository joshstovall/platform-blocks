import { Card, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="xs">
          <Text variant="p" weight="medium">
            Named weights
          </Text>
          <Text weight="light">Light weight text</Text>
          <Text weight="normal">Normal weight text (default)</Text>
          <Text weight="medium">Medium weight text</Text>
          <Text weight="semibold">Semibold weight text</Text>
          <Text weight="bold">Bold weight text</Text>
          <Text weight="black">Black weight text</Text>
        </Column>
      </Card>

      <Card p="md">
        <Column gap="xs">
          <Text variant="p" weight="medium">
            Numeric weights
          </Text>
          <Text weight="100">Weight 100 (Thin)</Text>
          <Text weight="300">Weight 300 (Light)</Text>
          <Text weight="400">Weight 400 (Normal)</Text>
          <Text weight="600">Weight 600 (Semibold)</Text>
          <Text weight="700">Weight 700 (Bold)</Text>
          <Text weight="900">Weight 900 (Black)</Text>
        </Column>
      </Card>
    </Column>
  );
}
