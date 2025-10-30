import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../..';
import { Text } from '../../../Text';

export default function CheckboxStatesDemo() {
  const [enabled, setEnabled] = useState(true);
  const [withError, setWithError] = useState(false);
  const [required, setRequired] = useState(true);

  return (
    <View style={{ gap: 12 }}>
      <Text weight="bold">States</Text>
      <Checkbox label="Enabled" checked={enabled} onChange={setEnabled} />
      <Checkbox label="Disabled" checked={false} disabled />
      <Checkbox label="Required" required checked={required} onChange={setRequired} />
      <Checkbox label="With error" error={withError ? 'Selection required' : undefined} checked={withError} onChange={setWithError} />
    </View>
  );
}
