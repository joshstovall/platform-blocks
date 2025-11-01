import { Title, Card, Flex } from '@platform-blocks/ui';

export default function LevelsTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap={8}>
        {[1,2,3,4,5,6].map(l => (
          <Title key={l} order={l as 1|2|3|4|5|6}>Heading Level {l}</Title>
        ))}
      </Flex>
    </Card>
  );
}
