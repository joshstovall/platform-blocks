import { useState } from 'react';
import { View } from 'react-native';
import { Slider, Text, Row, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(25);

  return (
    <Card>
      <Column gap={24}>
        <Text size="lg" weight="semibold">Full Height Vertical Sliders</Text>
        
        <Row gap={32} style={{ height: 300 }}>
          {/* Regular height vertical slider */}
          <Column gap={12} style={{ alignItems: 'center' }}>
            <Text size="md" weight="medium">Regular Height</Text>
            <Slider
              value={value}
              onChange={setValue}
              min={0}
              max={100}
              step={1}
              orientation="vertical"
            />
            <Text size="sm" style={{ color: '#666' }}>
              Value: {value}
            </Text>
          </Column>

          {/* Full height vertical slider */}
          <View style={{ height: '100%' }}>
            <Column gap={12} style={{ alignItems: 'center', height: '100%' }}>
              <Text size="md" weight="medium">Full Height</Text>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Slider
                  value={value}
                  onChange={setValue}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  fullWidth
                />
              </View>
              <Text size="sm" style={{ color: '#666' }}>
                Stretches to parent
              </Text>
            </Column>
          </View>

          {/* In constrained container */}
          <View style={{ 
            height: '80%', 
            padding: 16, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 8,
            alignItems: 'center'
          }}>
            <Column gap={12} style={{ alignItems: 'center', height: '100%' }}>
              <Text size="sm">80% height container</Text>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Slider
                  value={value}
                  onChange={setValue}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  fullWidth
                />
              </View>
            </Column>
          </View>
        </Row>

        <Text size="sm" style={{ color: '#666', textAlign: 'center' }}>
          Note: For vertical sliders, fullWidth makes them stretch to the parent's height
        </Text>
      </Column>
    </Card>
  );
}