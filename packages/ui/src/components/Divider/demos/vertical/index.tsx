import { Block, Column, Divider, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Block gap="lg" align="center" direction="row" h={100}>
        <Column gap="xs" align="center">
          <Text variant="p" weight="medium">
            Profile
          </Text>
          <Text variant="small" colorVariant="muted">
            View details
          </Text>
        </Column>

        <Divider orientation="vertical" />

        <Column gap="xs" align="center">
          <Text variant="p" weight="medium">
            Settings
          </Text>
          <Text variant="small" colorVariant="muted">
            Preferences
          </Text>
        </Column>

        <Divider orientation="vertical" label="Pro" colorVariant="success" />

        <Column gap="xs" align="center">
          <Text variant="p" weight="medium">
            Support
          </Text>
          <Text variant="small" colorVariant="muted">
            Help center
          </Text>
        </Column>
      </Block>

      <Block gap="md" align="center" wrap="wrap" direction="row" h={100}>
        <Text variant="p">Home</Text>
        <Divider orientation="vertical" />
        <Text variant="p">Fixtures</Text>
        <Divider orientation="vertical" colorVariant="primary" />
        <Text variant="p">Standings</Text>
        <Divider orientation="vertical" label="Live" colorVariant="warning" />
        <Text variant="p">Highlights</Text>
      </Block>
    </Column>
  );
}


