import { View } from 'react-native';
import { Card, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Full-bleed banner — Card.Section as the first child
        </Text>
        <Card padding="md" withBorder>
          <Card.Section>
            <View
              style={{
                height: 80,
                backgroundColor: '#a855f7',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text colorVariant="primary" weight="700" style={{ color: '#fff' }}>
                Full-bleed banner
              </Text>
            </View>
          </Card.Section>
          <Text weight="600" mt="sm">
            Card title
          </Text>
          <Text size="sm" colorVariant="muted">
            The banner above escapes the Card's padding via Card.Section.
          </Text>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Sections with `withBorder` — divider lines between bands
        </Text>
        <Card padding="md" withBorder>
          <Card.Section withBorder py="md" inheritPadding>
            <Text weight="600">Header</Text>
          </Card.Section>
          <Card.Section withBorder py="md" inheritPadding>
            <Text>Middle content</Text>
            <Text size="sm" colorVariant="muted">Each band has its own padding via py + inheritPadding.</Text>
          </Card.Section>
          <Card.Section withBorder py="md" inheritPadding>
            <Text size="sm" colorVariant="muted">Footer</Text>
          </Card.Section>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Mixed — banner section, free content, footer section
        </Text>
        <Card padding="lg" withBorder>
          <Card.Section>
            <View
              style={{
                height: 60,
                backgroundColor: '#10b981',
              }}
            />
          </Card.Section>
          <Text weight="600" mt="md">
            Mixed layout
          </Text>
          <Text size="sm" colorVariant="muted">
            The banner is full-bleed; this paragraph respects the Card's padding;
            the footer below is full-bleed again with a top border.
          </Text>
          <Card.Section withBorder py="sm" inheritPadding style={{ marginTop: 12 }}>
            <Text size="xs" colorVariant="muted">
              Updated 2 min ago
            </Text>
          </Card.Section>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Pressable Card — Sections still work
        </Text>
        <Card padding="md" withBorder onPress={() => {}}>
          <Card.Section>
            <View style={{ height: 40, backgroundColor: '#fbbf24' }} />
          </Card.Section>
          <Text weight="600" mt="sm">Tap me</Text>
          <Text size="sm" colorVariant="muted">
            Card.Section composes with onPress.
          </Text>
        </Card>
      </Column>
    </Column>
  );
}
