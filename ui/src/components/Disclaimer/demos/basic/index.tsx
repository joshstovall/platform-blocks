import React, { useState } from 'react';
import { 
  Input,
  Button,
  Switch,
  Select,
  Column,
  Card,
  Text,
  ToggleGroup,
  ToggleButton,
} from '@platform-blocks/ui';
import { 
  Disclaimer,
  ComponentWithDisclaimer,
  useDisclaimer,
  withDisclaimer,
  extractDisclaimerProps,
  type DisclaimerSupport
} from '../..';

// Example 1: Standalone Disclaimer component
const StandaloneDisclaimerExample = () => (
  <Column gap="md">
    <Text variant="h6">Standalone Disclaimer</Text>
    <Input label="Project name" placeholder="Enter project name" />
    <Disclaimer>This field is required for project creation</Disclaimer>
  </Column>
);

// Example 2: Using ComponentWithDisclaimer wrapper
const WrapperDisclaimerExample = () => (
  <Column gap="md">
    <Text variant="h6">With Disclaimer Wrapper</Text>
    <ComponentWithDisclaimer 
      disclaimer="Selected view determines the layout style"
      disclaimerProps={{ colorVariant: 'muted', size: 'sm' }}
    >
      <ToggleGroup value="list" exclusive onChange={() => {}}>
        <ToggleButton value="list">List View</ToggleButton>
        <ToggleButton value="grid">Grid View</ToggleButton>
        <ToggleButton value="block">Block View</ToggleButton>
      </ToggleGroup>
    </ComponentWithDisclaimer>
  </Column>
);

// Example 3: Using withDisclaimer utility function
const UtilityDisclaimerExample = () => {
  const [value, setValue] = useState('');
  
  const inputWithDisclaimer = withDisclaimer(
    <Input 
      label="Email address"
      value={value}
      onChangeText={setValue}
      placeholder="user@example.com"
      type="email"
    />,
    "We'll never share your email with third parties",
    { size: 'xs', colorVariant: 'muted' }
  );

  return (
    <Column gap="md">
      <Text variant="h6">With Utility Function</Text>
      {inputWithDisclaimer}
    </Column>
  );
};

// Example 4: Using useDisclaimer hook
const HookDisclaimerExample = () => {
  const [enabled, setEnabled] = useState(false);
  
  const renderDisclaimer = useDisclaimer(
    `Notifications are ${enabled ? 'enabled' : 'disabled'}`,
    { size: 'sm', colorVariant: enabled ? 'success' : 'muted' }
  );

  return (
    <Column gap="md">
      <Text variant="h6">With useDisclaimer Hook</Text>
      <Switch 
        label="Enable notifications"
        checked={enabled}
        onChange={setEnabled}
      />
      {renderDisclaimer()}
    </Column>
  );
};

// Main demo component
export default function DisclaimerDemo() {
  return (
    <Column gap="xl" p="lg">
      <Text variant="h4">Disclaimer Component Demo</Text>
      <Text colorVariant="muted">
        The Disclaimer component provides a consistent way to add contextual help text below any component.
      </Text>
      
      <Card p="lg" variant="outline">
        <StandaloneDisclaimerExample />
      </Card>
      
      <Card p="lg" variant="outline">
        <WrapperDisclaimerExample />
      </Card>
      
      <Card p="lg" variant="outline">
        <UtilityDisclaimerExample />
      </Card>
      
      <Card p="lg" variant="outline">
        <HookDisclaimerExample />
      </Card>
    </Column>
  );
}