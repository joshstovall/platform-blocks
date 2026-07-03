import type { SwitchProps } from '@platform-blocks/ui';
import { Column, Row, Switch, Text } from '@platform-blocks/ui';

const SIZES: NonNullable<SwitchProps['size']>[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

export default function Demo() {
  return (
    <Column gap="md">
      <Row gap="sm" align="center">
        {SIZES.map((size) => (
          <Switch
            key={size}
            defaultChecked
            size={size}
            label={`${String(size).toUpperCase()}`}
            labelPosition="top"
          />
        ))}
      </Row>

    </Column>
  );
}


