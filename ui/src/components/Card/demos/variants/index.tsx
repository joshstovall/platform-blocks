import { Block, Card, Text } from '@platform-blocks/ui';
const VARIANTS = ['filled', 'outline', 'elevated', 'subtle', 'ghost', 'gradient'] as const;
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function CardVariantsDemo() {
  return (
    <Block gap="lg">
      {VARIANTS.map((variant) => (
        <Card key={variant} variant={variant} padding={16}>
          <Text variant="h6" mb="xs">
            {capitalize(variant)} card
          </Text>
          <Text colorVariant="secondary">
            This card showcases the {variant} visual treatment.
          </Text>
        </Card>
      ))}
    </Block>
  );
}
