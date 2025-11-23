import { useState } from 'react';
import { RangeSlider, Text, Block, Card, Flex } from '@platform-blocks/ui';

export default function Demo() {
  const [priceRange, setPriceRange] = useState<[number, number]>([25, 75]);
  const [temperatureRange, setTemperatureRange] = useState<[number, number]>([18, 24]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([60, 90]);

  return (
    <Block gap={16} fullWidth>
       <Card>
        <Block gap={16}>
          <Text size="lg" weight="semibold">Price Range</Text>
          <Block gap={8}>
            <Flex justify="space-between">
              <Text size="sm">Min: ${priceRange[0]}</Text>
              <Text size="sm">Max: ${priceRange[1]}</Text>
            </Flex>
            <RangeSlider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={100}
              step={5}
              label="Price Filter ($)"
              showTicks
            />
            <Text size="sm" style={{ color: '#666' }}>
              Budget range: ${priceRange[1] - priceRange[0]}
            </Text>
          </Block>
        </Block>
        </Card>

      <Card>
        <Block gap={16}>
          <Text size="lg" weight="semibold">Temperature Range</Text>
          <Block gap={8}>
            <RangeSlider
              value={temperatureRange}
              onChange={setTemperatureRange}
              min={10}
              max={30}
              step={0.5}
              label="Comfortable Temperature (°C)"
              valueLabel={(value) => `${value}°C`}
              valueLabelAlwaysOn
            />
            <Text size="sm" style={{ color: '#666' }}>
              Range: {temperatureRange[0]}°C - {temperatureRange[1]}°C
            </Text>
          </Block>
        </Block>
      </Card>

      <Card>
        <Block gap={16}>
          <Text size="lg" weight="semibold">Score Range</Text>
          <Block gap={8}>
            <RangeSlider
              value={scoreRange}
              onChange={setScoreRange}
              min={0}
              max={100}
              step={1}
              label="Acceptable Score Range"
              minRange={10}
              showMarks
            />
            <Text size="sm" style={{ color: '#666' }}>
              Score range: {scoreRange[0]} - {scoreRange[1]} (span: {scoreRange[1] - scoreRange[0]})
            </Text>
          </Block>
        </Block>
      </Card>
    </Block>
  );
}


