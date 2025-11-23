import { Card, Column, Spoiler, Text } from '@platform-blocks/ui';

const examples = [
  {
    key: 'open',
    label: 'Initially open',
    description:
      'Starts expanded by default so the reader sees the full content on first render.',
    props: { initiallyOpen: true },
  },
  {
    key: 'closed',
    label: 'Initially closed',
    description:
      'Keeps the section compact to emphasize surrounding UI until the user opts in.',
    props: {},
  },
];

const bodyCopy =
  'Vivamus fermentum orci eget tortor facilisis, eu egestas eros maximus. Fusce vitae semper libero. Pellentesque habitant morbi tristique senectus et netus.';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Control whether the content renders expanded on mount or waits for user input. Both states remain accessible to assistive tech.
          </Text>
          <Column gap="sm">
            {examples.map((example) => (
              <Column key={example.key} gap="xs">
                <Text size="xs" colorVariant="secondary">
                  {example.label}
                </Text>
                <Spoiler maxHeight={72} {...example.props}>
                  <Text size="sm">{bodyCopy}</Text>
                </Spoiler>
                <Text size="xs" colorVariant="muted">
                  {example.description}
                </Text>
              </Column>
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
