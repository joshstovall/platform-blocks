import { Card, Column, Text, Title } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="xs">
          <Title>Default section heading</Title>
          <Text size="sm" colorVariant="secondary">
            Titles default to order 2, making them a natural choice for section headings.
          </Text>
        </Column>
      </Card>
    </Column>
  );
}
