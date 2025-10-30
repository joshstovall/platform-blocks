import React from 'react';
import { View } from 'react-native';
import { Tooltip, Button, Text, Flex } from '@platform-blocks/ui';

export default function BasicTooltipDemo() {
  return (
    <Flex direction="column" gap="lg" style={{ padding: 20 }}>
      <View>
        <Text mb="sm">Hover/Touch Tooltip</Text>
        <Tooltip label="This is a basic tooltip">
          <Button title="Hover me" onPress={() => {}} />
        </Tooltip>
      </View>
      
      <View>
        <Text mb="sm">Focus Tooltip</Text>
        <Tooltip 
          label="Focus tooltip appears when button is focused"
          events={{ hover: false, focus: true, touch: false }}
        >
          <Button title="Focus me" onPress={() => {}} />
        </Tooltip>
      </View>
      
      <View>
        <Text mb="sm">Touch Only Tooltip</Text>
        <Tooltip 
          label="Touch tooltip appears on press"
          events={{ hover: false, focus: false, touch: true }}
        >
          <Button title="Press me" onPress={() => {}} />
        </Tooltip>
      </View>
    </Flex>
  );
}
