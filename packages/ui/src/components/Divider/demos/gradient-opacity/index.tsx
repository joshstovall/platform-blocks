import { Column, Divider, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" weight="medium">
          Gradient variant
        </Text>
        <Divider variant="gradient" colorVariant="primary" />
        <Divider variant="gradient" colorVariant="error" size={2} />
        <Divider variant="gradient" label="Section break" />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Opacity prop — same color, different emphasis
        </Text>
        <Divider colorVariant="primary" />
        <Divider colorVariant="primary" opacity={0.5} />
        <Divider colorVariant="primary" opacity={0.25} />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Subtle separator (border default + low opacity)
        </Text>
        <Divider opacity={0.4} />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Custom color + opacity
        </Text>
        <Divider color="#a855f7" opacity={0.6} size={2} />
      </Column>
    </Column>
  );
}
