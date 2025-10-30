import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../..';
import { Text } from '../../../Text';

export default function CheckboxSizesDemo() {
  const [values, setValues] = useState({ xs: false, sm: true, md: true, lg: false });
  const toggle = (key: keyof typeof values) => setValues(v => ({ ...v, [key]: !v[key] }));
  return (
    <View style={{ gap: 12 }}>
      <Text weight="bold">Sizes</Text>
      <Checkbox size="xs" label="Extra small" checked={values.xs} onChange={() => toggle('xs')} />
      <Checkbox size="sm" label="Small" checked={values.sm} onChange={() => toggle('sm')} />
      <Checkbox size="md" label="Medium" checked={values.md} onChange={() => toggle('md')} />
      <Checkbox size="lg" label="Large" checked={values.lg} onChange={() => toggle('lg')} />
    </View>
  );
}
