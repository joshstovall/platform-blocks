import { Chip } from '../../Chip';
import { Column } from '../../../Layout';
import { Text } from '../../../Text';
import { Block } from '../../../Block';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="md">
        <Text variant="h6">All Variants</Text>
        <Block gap="sm" direction="row">
          <Chip variant="filled" color="primary">Filled</Chip>
          <Chip variant="outline" color="primary">Outline</Chip>
          <Chip variant="light" color="primary">Light</Chip>
          <Chip variant="subtle" color="primary">Subtle</Chip>
          <Chip variant="gradient" color="primary">Gradient</Chip>
        </Block>
      </Column>

      <Column gap="md">
        <Text variant="h6">Subtle Variant Colors</Text>
        <Block gap="sm" direction="row">
          <Chip variant="subtle" color="primary">Primary</Chip>
          <Chip variant="subtle" color="secondary">Secondary</Chip>
          <Chip variant="subtle" color="success">Success</Chip>
          <Chip variant="subtle" color="warning">Warning</Chip>
          <Chip variant="subtle" color="error">Error</Chip>
          <Chip variant="subtle" color="gray">Gray</Chip>
        </Block>
      </Column>
    </Column>
  );
}