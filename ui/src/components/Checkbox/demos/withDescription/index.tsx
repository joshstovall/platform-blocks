import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../..';
import { Text } from '../../../Text';

export default function CheckboxWithDescriptionDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <View style={{ gap: 12, maxWidth: 420 }}>
      <Text weight="bold">Description & Helper</Text>
      <Checkbox
        label="Receive product updates"
        description="Get occasional emails about new features and improvements."
        checked={checked}
        onChange={setChecked}
      />
      <Checkbox
        label="Terms acceptance"
        description="You must agree before continuing."
        error={!checked ? 'Required before proceeding' : undefined}
        checked={checked}
        onChange={setChecked}
        required
      />
    </View>
  );
}
