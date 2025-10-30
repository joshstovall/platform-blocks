import { useState } from 'react';
import { View } from 'react-native';
import { Slider, RangeSlider, Text, Block, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(25);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

  return (
    <Card>
      <Block gap={24}>
        <Text size="lg" weight="semibold">Full Width Sliders</Text>
        
        {/* Regular width vs full width comparison */}
        <Block gap={12}>
          <Text size="md" weight="medium">Regular Slider (default width)</Text>
          <Slider
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            step={1}
          />
          <Text size="sm" style={{ color: '#666' }}>
            Value: {value}
          </Text>
        </Block>

        <Block gap={12}>
          <Text size="md" weight="medium">Full Width Slider</Text>
          <Slider
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            step={1}
            fullWidth
          />
          <Text size="sm" style={{ color: '#666' }}>
            Value: {value} (stretches to parent width)
          </Text>
        </Block>

        {/* Range slider example */}
        <Block gap={12}>
          <Text size="md" weight="medium">Full Width Range Slider</Text>
          <RangeSlider
            value={rangeValue}
            onChange={setRangeValue}
            min={0}
            max={100}
            step={1}
            fullWidth
          />
          <Text size="sm" style={{ color: '#666' }}>
            Range: {rangeValue[0]} - {rangeValue[1]}
          </Text>
        </Block>

        {/* In a constrained container */}
        <Block gap={12}>
          <Text size="md" weight="medium">Full Width in Constrained Container</Text>
          <View style={{ 
            width: '60%', 
            padding: 16, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 8 
          }}>
            <Block gap={8}>
              <Text size="sm">60% width container</Text>
              <Slider
                value={value}
                onChange={setValue}
                min={0}
                max={100}
                step={1}
                fullWidth
              />
            </Block>
          </View>
        </Block>

        {/* Different sizes */}
        <Block gap={12}>
          <Text size="md" weight="medium">Full Width with Different Sizes</Text>
          <Block gap={16}>
            <Block gap={4}>
              <Text size="sm">Small (sm)</Text>
              <Slider
                value={value}
                onChange={setValue}
                min={0}
                max={100}
                step={1}
                size="sm"
                fullWidth
              />
            </Block>
            <Block gap={4}>
              <Text size="sm">Medium (md) - default</Text>
              <Slider
                value={value}
                onChange={setValue}
                min={0}
                max={100}
                step={1}
                size="md"
                fullWidth
              />
            </Block>
            <Block gap={4}>
              <Text size="sm">Large (lg)</Text>
              <Slider
                value={value}
                onChange={setValue}
                min={0}
                max={100}
                step={1}
                size="lg"
                fullWidth
              />
            </Block>
          </Block>
        </Block>
      </Block>
    </Card>
  );
}