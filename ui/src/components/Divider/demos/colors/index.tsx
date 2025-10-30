import { Divider } from '../../Divider';
import { Column } from '../../../Layout';
import { Text } from '../../../Text';
import { Container } from '../../../Container';

export default function Demo() {
  return (
    <Container p="lg">
      <Column gap="md">
        <Text variant="h4">Color Variants</Text>
        <Text variant="body" colorVariant="muted">
          Different semantic color variants for dividers
        </Text>

        <Column gap="lg">
          <Column gap="xs">
            <Text variant="p" weight="medium">Default (surface)</Text>
            <Divider />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Primary</Text>
            <Divider colorVariant="primary" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Success</Text>
            <Divider colorVariant="success" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Warning</Text>
            <Divider colorVariant="warning" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Error</Text>
            <Divider colorVariant="error" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Muted</Text>
            <Divider colorVariant="muted" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Subtle</Text>
            <Divider colorVariant="subtle" />
          </Column>

          <Column gap="xs">
            <Text variant="p" weight="medium">Gray</Text>
            <Divider colorVariant="gray" />
          </Column>
        </Column>

        <Text variant="h5" mt="xl">With Labels</Text>
        <Column gap="lg">
          <Divider colorVariant="primary" label="Primary Section" />
          <Divider colorVariant="success" label="Success Section" />
          <Divider colorVariant="error" label="Error Section" />
        </Column>

        <Text variant="h5" mt="xl">Different Variants</Text>
        <Column gap="md">
          <Divider colorVariant="primary" variant="solid" label="Solid" />
          <Divider colorVariant="primary" variant="dashed" label="Dashed" />
          <Divider colorVariant="primary" variant="dotted" label="Dotted" />
        </Column>
      </Column>
    </Container>
  );
}