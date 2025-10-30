import { Chip } from '../../Chip';
import { Column } from '../../../Layout';
import { Text } from '../../../Text';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="md">
        <Text variant="h6">All Variants</Text>
        <Column gap="sm">
          <Chip variant="filled" color="primary">Filled</Chip>
          <Chip variant="outline" color="primary">Outline</Chip>
          <Chip variant="light" color="primary">Light</Chip>
          <Chip variant="subtle" color="primary">Subtle</Chip>
        </Column>
      </Column>

      <Column gap="md">
        <Text variant="h6">Subtle Variant Colors</Text>
        <Column gap="sm">
          <Chip variant="subtle" color="primary">Primary</Chip>
          <Chip variant="subtle" color="secondary">Secondary</Chip>
          <Chip variant="subtle" color="success">Success</Chip>
          <Chip variant="subtle" color="warning">Warning</Chip>
          <Chip variant="subtle" color="error">Error</Chip>
          <Chip variant="subtle" color="gray">Gray</Chip>
        </Column>
      </Column>
    </Column>
  );
}