import React, { useState } from 'react';
import { View } from 'react-native';
import { ColorPicker, Text } from '@platform-blocks/ui';

export function ColorPickerTestDemo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <View style={{ padding: 20 }}>
      <Text variant="h3" style={{ marginBottom: 20 }}>
        ColorPicker Positioning Test
      </Text>
      
      <Text style={{ marginBottom: 10 }}>
        Click the color picker below. The dropdown should now appear correctly positioned using the same system as AutoComplete.
      </Text>
      
      <ColorPicker
        label="Test Color"
        value={color}
        onChange={setColor}
        placement="bottom-start"
      />
      
      <Text style={{ marginTop: 20, color: color }}>
        Selected color: {color}
      </Text>
    </View>
  );
}