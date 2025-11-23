import { Card, Column, Spoiler, Text } from '@platform-blocks/ui';

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer tincidunt condimentum risus, sit amet cursus massa fermentum non.';

const examples = [
  { key: 'small', label: '60px height', maxHeight: 60 },
  { key: 'medium', label: '100px height', maxHeight: 100 },
  { key: 'large', label: '150px height', maxHeight: 150 },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Adjust maxHeight to control how much text stays visible before the rest collapses behind the toggle.
          </Text>
          <Column gap="sm">
            {examples.map((example) => (
              <Column key={example.key} gap="xs">
                <Text size="xs" colorVariant="secondary">
                  {example.label}
                </Text>
                <Spoiler maxHeight={example.maxHeight}>
                  <Text size="sm">{longText}</Text>
                </Spoiler>
              </Column>
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
