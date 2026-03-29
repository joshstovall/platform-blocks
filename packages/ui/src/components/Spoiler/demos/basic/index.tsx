import { Card, Column, Spoiler, Text } from '@platform-blocks/ui';

const paragraphs = [
  'Spoilers collapse long sections of copy while keeping the content accessible to screen readers and keyboard users.',
  'Use them for optional detail or secondary information that might distract from a primary task. They expand inline, so the surrounding layout stays stable.',
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Keep the initial height short to hint that more detail is available without overwhelming the layout.
          </Text>
          <Spoiler maxHeight={96}>
            <Column gap="sm">
              {paragraphs.map((paragraph) => (
                <Text key={paragraph} size="sm">
                  {paragraph}
                </Text>
              ))}
            </Column>
          </Spoiler>
        </Column>
      </Card>
    </Column>
  );
}
