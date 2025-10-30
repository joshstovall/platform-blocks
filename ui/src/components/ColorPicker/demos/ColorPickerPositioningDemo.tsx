import React, { useState } from 'react';
import { View } from 'react-native';
import { ColorPicker, Button, Text } from '@platform-blocks/ui';

export function ColorPickerPositioningDemo() {
  const [color1, setColor1] = useState('#FF6B6B');
  const [color2, setColor2] = useState('#4ECDC4');
  const [color3, setColor3] = useState('#45B7D1');

  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Text variant="h3">Enhanced ColorPicker Positioning</Text>
      <Text>
        The ColorPicker now uses the same sophisticated positioning system as AutoComplete,
        with automatic viewport detection, smart placement fallbacks, and collision avoidance.
      </Text>

      <View style={{ gap: 20 }}>
        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Smart Bottom Placement (auto-adjusts if no space)</Text>
          <ColorPicker
            label="Primary Color"
            value={color1}
            onChange={setColor1}
            placement="bottom-start"
            flip={true}
            shift={true}
          />
        </View>

        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Top Placement with Fallbacks</Text>
          <ColorPicker
            label="Secondary Color"
            value={color2}
            onChange={setColor2}
            placement="top-start"
            fallbackPlacements={['top-end', 'bottom-start', 'bottom-end']}
          />
        </View>

        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Right Placement (for narrow containers)</Text>
          <ColorPicker
            label="Accent Color"
            value={color3}
            onChange={setColor3}
            placement="right"
            offset={12}
          />
        </View>

        <Text variant="caption" style={{ marginTop: 20 }}>
          Try opening the color pickers in different screen sizes and positions 
          to see the intelligent positioning in action!
        </Text>
      </View>
    </View>
  );
}