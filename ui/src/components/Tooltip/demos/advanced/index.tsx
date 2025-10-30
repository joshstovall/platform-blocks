import React, { useState } from 'react';
import { View } from 'react-native';
import { Tooltip, Button, Text, Flex } from '@platform-blocks/ui';

export default function AdvancedTooltipDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Flex direction="column" gap="lg" style={{ padding: 20 }}>
      <View>
        <Text mb="sm">Tooltip with Delays</Text>
        <Tooltip 
          label="This tooltip has a 500ms open delay and 200ms close delay"
          openDelay={500}
          closeDelay={200}
        >
          <Button title="Delayed Tooltip" onPress={() => {}} />
        </Tooltip>
      </View>
      
      <View>
        <Text mb="sm">Multiline Tooltip</Text>
        <Tooltip 
          label="This is a multiline tooltip that wraps text to demonstrate longer content and how it handles multiple lines of text."
          multiline
          width={200}
        >
          <Button title="Multiline Tooltip" onPress={() => {}} />
        </Tooltip>
      </View>
      
      <View>
        <Text mb="sm">Custom Color</Text>
        <Tooltip 
          label="Custom colored tooltip"
          color="#3B82F6"
          withArrow
        >
          <Button title="Blue Tooltip" onPress={() => {}} />
        </Tooltip>
      </View>
      
      <View>
        <Text mb="sm">Controlled Tooltip</Text>
        <Flex direction="row" gap="md">
          <Tooltip 
            label="This tooltip is controlled by external buttons"
            opened={controlledOpen}
            events={{ hover: false, touch: false, focus: false }}
          >
            <Text style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
              Controlled Target
            </Text>
          </Tooltip>
          
          <Button 
            title={controlledOpen ? 'Hide' : 'Show'} 
            onPress={() => setControlledOpen(!controlledOpen)}
            variant="outline"
          />
        </Flex>
      </View>
    </Flex>
  );
}
