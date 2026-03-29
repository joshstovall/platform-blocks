import type { SwitchProps } from '@platform-blocks/ui';
import { Column, Row, Switch, Text } from '@platform-blocks/ui';

const SIZES: NonNullable<SwitchProps['size']>[] = ['sm', 'md', 'lg', 'xl'];

export default function Demo() {
  return (
    <Column gap="md">
      <Column gap="sm">
        {SIZES.map((size) => (
          <Switch
            key={size}
            defaultChecked
            size={size}
            label={`${String(size).toUpperCase()} switch`}
          />
        ))}
      </Column>

      <Row gap="md" wrap="wrap">
        {SIZES.map((size) => (
          <Switch key={`${size}-comparison`} checked size={size} disabled />
        ))}
      </Row>
    </Column>
  );
}


