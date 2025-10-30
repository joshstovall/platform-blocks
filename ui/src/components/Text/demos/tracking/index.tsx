import { Text } from '../../Text';
import { Flex } from '../../../Flex';
import { Card } from '../../../Card';

export default function Demo() {
  return (
    <Card style={{ padding: 24 }}>
      <Flex direction="column" gap="lg">
        <Text size="lg" weight="semibold">Letter Spacing (Tracking) Examples</Text>
        
        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">Negative Tracking (Tighter)</Text>
          <Text tracking={-1}>This text has -1px letter spacing</Text>
          <Text tracking={-0.5}>This text has -0.5px letter spacing</Text>
        </Flex>

        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">Default (No Tracking)</Text>
          <Text>This text has no letter spacing modification</Text>
        </Flex>

        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">Positive Tracking (Looser)</Text>
          <Text tracking={0.5}>This text has 0.5px letter spacing</Text>
          <Text tracking={1}>This text has 1px letter spacing</Text>
          <Text tracking={2}>This text has 2px letter spacing</Text>
          <Text tracking={4}>This text has 4px letter spacing</Text>
        </Flex>

        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">With Different Sizes</Text>
          <Text size="xs" tracking={1}>Extra small with 1px tracking</Text>
          <Text size="sm" tracking={1}>Small with 1px tracking</Text>
          <Text size="md" tracking={1}>Medium with 1px tracking</Text>
          <Text size="lg" tracking={1}>Large with 1px tracking</Text>
          <Text size="xl" tracking={2}>Extra large with 2px tracking</Text>
        </Flex>

        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">Headings with Tracking</Text>
          <Text variant="h1" tracking={-1}>H1 Heading with -1px tracking</Text>
          <Text variant="h2" tracking={0}>H2 Heading with no tracking</Text>
          <Text variant="h3" tracking={1}>H3 Heading with 1px tracking</Text>
        </Flex>

        <Flex direction="column" gap="sm">
          <Text size="sm" weight="medium" colorVariant="secondary">Uppercase + Wide Tracking</Text>
          <Text weight="bold" tracking={3} style={{ textTransform: 'uppercase' }}>
            Uppercase Text with Wide Tracking
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}