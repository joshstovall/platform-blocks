import { Title, Card, Flex, Text } from '@platform-blocks/ui';

export default function CombinedTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap={28}>
        <Title prefix underline afterline underlineStroke={3} prefixVariant="bar" prefixSize={6} prefixLength={48} prefixColor="#10b981">
          Analytics Overview
        </Title>
        <Text size="sm" colorVariant="secondary" style={{ maxWidth: 560 }}>
          Demonstrates a composite section heading using prefix bar for visual anchor, underline emphasizing the title, and afterline extending across remaining horizontal space.
        </Text>
        <Title order={3} prefix prefixVariant="dot" underlineColor="#ef4444" underline underlineStroke={2} prefixColor="#ef4444">
          Active Users
        </Title>
        <Title order={3} prefix prefixVariant="dot" underlineColor="#6366f1" underline underlineStroke={2} prefixColor="#6366f1">
          Conversion Rate
        </Title>
      </Flex>
    </Card>
  );
}
