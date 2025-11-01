import { View } from 'react-native';
import { Tooltip, Button } from '@platform-blocks/ui';

export default function SimpleTooltipDemo() {
  return (
    <View style={{ padding: 40, gap: 20 }}>
      {/* Basic tooltip */}
      <Tooltip label="This is a simple tooltip">
        <Button onPress={() => {}}>Hover me!</Button>
      </Tooltip>

      {/* Different positions */}
      <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
        <Tooltip label="Top tooltip" position="top">
          <Button onPress={() => {}}>Top</Button>
        </Tooltip>
        
        <Tooltip label="Bottom tooltip" position="bottom">
          <Button onPress={() => {}}>Bottom</Button>
        </Tooltip>
        
        <Tooltip label="Left tooltip" position="left">
          <Button onPress={() => {}}>Left</Button>
        </Tooltip>
        
        <Tooltip label="Right tooltip" position="right">
          <Button onPress={() => {}}>Right</Button>
        </Tooltip>
      </View>

      {/* With arrow */}
      <Tooltip label="Tooltip with arrow" withArrow>
        <Button onPress={() => {}}>With Arrow</Button>
      </Tooltip>

      {/* Multiline */}
      <Tooltip 
        label="This is a much longer tooltip text that should wrap to multiple lines" 
        multiline 
        width={200}
      >
        <Button onPress={() => {}}>Multiline</Button>
      </Tooltip>
    </View>
  );
}
