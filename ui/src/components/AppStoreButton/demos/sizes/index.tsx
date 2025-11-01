import { AppStoreButton, Column, Row, Text } from '@platform-blocks/ui';

export default function AppStoreButtonSizesDemo() {
  return (
    <Column gap="2xl" p="lg">
      <Column gap="sm">
        <Text weight="semibold" size="lg">Button Sizes</Text>
        <Text colorVariant="secondary" size="sm">
          Available sizes: sm, md (default), lg, and xl
        </Text>
      </Column>

      <Column gap="lg">
        <Column gap="sm">
          <Text weight="medium" size="sm">Small (sm)</Text>
          <Row gap="md">
            <AppStoreButton store="app-store" size="sm" />
            <AppStoreButton store="google-play" size="sm" />
          </Row>
        </Column>

        <Column gap="sm">
          <Text weight="medium" size="sm">Medium (md) - Default</Text>
          <Row gap="md">
            <AppStoreButton store="app-store" size="md" />
            <AppStoreButton store="google-play" size="md" />
          </Row>
        </Column>

        <Column gap="sm">
          <Text weight="medium" size="sm">Large (lg)</Text>
          <Row gap="md">
            <AppStoreButton store="app-store" size="lg" />
            <AppStoreButton store="google-play" size="lg" />
          </Row>
        </Column>

        <Column gap="sm">
          <Text weight="medium" size="sm">Extra Large (xl)</Text>
          <Row gap="md">
            <AppStoreButton store="app-store" size="xl" />
            <AppStoreButton store="google-play" size="xl" />
          </Row>
        </Column>
      </Column>
    </Column>
  );
}