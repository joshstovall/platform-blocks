import { useState } from 'react';
import { Switch, Text, Column, Card, Row, Block } from '@platform-blocks/ui';

export default function Demo() {
  const [smallSwitch, setSmallSwitch] = useState(true);
  const [mediumSwitch, setMediumSwitch] = useState(true);
  const [largeSwitch, setLargeSwitch] = useState(true);

  return (
    <Block>
     <Card padding={16}>
         <Text variant="body" weight="medium">Size Variants</Text>
          
          <Switch
            checked={smallSwitch}
            onChange={setSmallSwitch}
            label="Small switch"
            size="sm"
          />
          
          <Switch
            checked={mediumSwitch}
            onChange={setMediumSwitch}
            label="Medium switch"
            size="md"
          />
          
          <Switch
            checked={largeSwitch}
            onChange={setLargeSwitch}
            label="Large switch"
            size="lg"
          />
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Size Comparison</Text>
          <Row gap={16} align="center">
            <Column gap={4} align="center">
              <Switch checked={true} size="sm" />
              <Text variant="caption">Small</Text>
            </Column>
            <Column gap={4} align="center">
              <Switch checked={true} size="md" />
              <Text variant="caption">Medium</Text>
            </Column>
            <Column gap={4} align="center">
              <Switch checked={true} size="lg" />
              <Text variant="caption">Large</Text>
            </Column>
          </Row>
        </Column>
      </Card>
</Block>  );
}


