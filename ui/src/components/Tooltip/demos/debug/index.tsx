import React, { useState } from 'react';
import { View } from 'react-native';
import { Tooltip, Button, Text } from '@platform-blocks/ui';

export default function DebugTooltipDemo() {
  const [manualOpen, setManualOpen] = useState(false);

  return (
    <View style={{ padding: 40, gap: 20 }}>
      <Text variant="h3" mb="lg">Tooltip Debugging</Text>

      {/* Manual control tooltip */}
      <View>
        <Text mb="sm">Manually Controlled Tooltip</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tooltip
            label="This tooltip is manually controlled"
            opened={manualOpen}
          >
            <View style={{
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ccc'
            }}>
              <Text>Target Element</Text>
            </View>
          </Tooltip>

          <Button
            title={manualOpen ? 'Hide' : 'Show'}
            onPress={() => setManualOpen(!manualOpen)}
          />
        </View>
      </View>

      {/* Simple hover tooltip */}
      <View>
        <Text mb="sm">Simple Hover Tooltip</Text>
        <Tooltip
          label="Hover tooltip - should appear on hover"
        >
          <Button title="Hover Me" onPress={() => console.log('Button clicked')} />
        </Tooltip>
      </View>

      {/* Touch tooltip */}
      <View>
        <Text mb="sm">Touch Tooltip</Text>
        <Tooltip
          label="Touch tooltip - should appear on press"
          events={{ hover: false, touch: true, focus: false }}
        >
          <Button title="Press Me" onPress={() => console.log('Touch button clicked')} />
        </Tooltip>
      </View>

      {/* Offset tooltip */}
      <View>
        <Text mb="sm">Offset Tooltip</Text>
        <Tooltip
          label="This tooltip has custom offset"
          offset={20}
        >
          <Button title="Offset Tooltip" onPress={() => console.log('Offset button clicked')} />
        </Tooltip>
      </View>
    </View>
  );
}
