import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../..';
import { Text } from '../../../Text';
import { Block } from 'platform-blocks/components/Block';

// Show direct palette keys + alias examples
const colors: ('primary' | 'secondary' | 'success' | 'warning' | 'error')[] = ['primary','secondary','success','warning','error'];

export default function CheckboxColorsDemo() {
  const [vals, setVals] = useState<Record<string, boolean>>({});
  const toggle = (c: string) => setVals(v => ({ ...v, [c]: !v[c] }));
  return (
    <Block style={{ gap: 12 }} w={300}>
      <Text weight="bold">Colors</Text>
      {colors.map(color => (
        <Checkbox
          key={color}
          colorVariant={color}
          label={`Color: ${color}`}
          checked={!!vals[color]}
          onChange={() => toggle(color)}
        />
      ))}
      <Checkbox
        colorVariant="success"
        label="Default Checked (uncontrolled)"
        defaultChecked
        onChange={() => {}}
      />
    </Block>
  );
}
