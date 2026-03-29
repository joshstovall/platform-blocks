import { Card, Column, Text } from '@platform-blocks/ui';

const SAMPLE_TEXT =
  'This paragraph shows how line height changes the spacing between lines of text when content wraps across multiple lines.';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Column gap="xs">
            <Text variant="p" weight="medium">
              Tight line height (1.2)
            </Text>
            <Text lineHeight={1.2}>{SAMPLE_TEXT}</Text>
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">
              Standard line height (1.5)
            </Text>
            <Text lineHeight={1.5}>{SAMPLE_TEXT}</Text>
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">
              Relaxed line height (1.8)
            </Text>
            <Text lineHeight={1.8}>{SAMPLE_TEXT}</Text>
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">
              Loose line height (2.0)
            </Text>
            <Text lineHeight={2}>{SAMPLE_TEXT}</Text>
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">
              Absolute line height (24px)
            </Text>
            <Text lineHeight={24}>{SAMPLE_TEXT}</Text>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
