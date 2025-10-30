import { useState } from 'react';
import { Stepper, Text, Flex, Card, Button } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActive(2);
    }, 2000);
  };

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Loading State</Text>
        
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Step 1" description="Complete form">
            Step 1: Fill out the registration form with your details.
          </Stepper.Step>
          <Stepper.Step label="Step 2" description="Processing" loading={loading}>
            Step 2: Processing your information... Please wait.
          </Stepper.Step>
          <Stepper.Step label="Step 3" description="Success">
            Step 3: Registration complete! Welcome to the platform.
          </Stepper.Step>
        </Stepper>

        <Flex justify="center" style={{ marginTop: 16 }}>
          <Button onPress={simulateLoading} disabled={loading}>
            {loading ? 'Processing...' : 'Simulate Processing'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
