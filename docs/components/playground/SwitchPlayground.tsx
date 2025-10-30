import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Switch, Text, Card, Flex, Button } from '@platform-blocks/ui';
import { Block, Title } from 'platform-blocks/components';
import { router } from 'expo-router';

export default function SwitchPlayground() {
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isSmall = width < 768;
  return (
    <Block>
      <Title afterline 
      
      action={<Button
      onPress={() => router.push('/components/Switch')}
      >go to docs</Button>}
      >Switches</Title>
      
      <Flex direction={isSmall ? 'column' : 'row'} gap={20} wrap={isSmall ? undefined : 'wrap'}>

        {/* Size Options */}
        <Card>
          <Text>Sizes</Text>
          <Flex direction="column" gap={12}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((sz) => (
              <Switch
                key={sz}
                size={sz}
                defaultChecked
                label={`${sz.toUpperCase()} Switch`}
              />
            ))}
          </Flex>
        </Card>

        {/* Color Options */}
        <Card>
          <Text>Colors</Text>
          <Flex direction="column" gap={12}>
            {(['primary', 'secondary', 'success', 'error', 'warning'] as const).map((clr) => (
              <Switch
                key={clr}
                color={clr}
                defaultChecked
                label={`${clr.charAt(0).toUpperCase() + clr.slice(1)} color`}
              />
            ))}
          </Flex>
        </Card>

        {/* States */}
        <Card>
          <Text>States</Text>
          <Flex direction="column" gap={12}>
            <Switch
              defaultChecked={false}
              label="Unchecked"
            />
            <Switch
              defaultChecked={true}
              label="Checked"
            />
            <Switch
              disabled
              defaultChecked={false}
              label="Disabled unchecked"
            />
            <Switch
              disabled
              defaultChecked={true}
              label="Disabled checked"
            />
          </Flex>
        </Card>

        {/* Label Positions */}
        <Card>
          <Text>Label Positions</Text>
          <Flex direction="column" gap={12}>
            <Switch
              defaultChecked
              label="Label on right (default)"
              labelPosition="right"
            />
            <Switch
              defaultChecked
              label="Label on left"
              labelPosition="left"
            />
          </Flex>
        </Card>

        {/* With Descriptions and Errors */}
        <Card>
          <Text>Additional Props</Text>
          <Flex direction="column" gap={12}>
            <Switch
              defaultChecked
              label="With description"
              description="This switch has a helpful description below it"
            />
            <Switch
              defaultChecked
              label="Required switch"
              required
            />
            <Switch
              defaultChecked={false}
              label="Switch with error"
              error="This field is required"
            />
          </Flex>
        </Card>

      </Flex>
    </Block>
  );
};
