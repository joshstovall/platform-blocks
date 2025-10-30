import { useState } from 'react';
import { Stepper, Button, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);
  
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Vertical Stepper</Text>
        
        <Stepper active={active} onStepClick={setActive} orientation="vertical">
          <Stepper.Step label="Step 1" description="Setup your profile">
            Complete your profile information including name, photo, and bio.
          </Stepper.Step>
          <Stepper.Step label="Step 2" description="Configure preferences">
            Choose your notification settings and privacy preferences.
          </Stepper.Step>
          <Stepper.Step label="Step 3" description="Start exploring">
            You're all set! Begin using the platform and discover new features.
          </Stepper.Step>
        </Stepper>
        
        <Flex direction="row" gap={12} justify="center" style={{ marginTop: 16 }}>
          <Button variant="outline" onPress={prevStep} disabled={active === 0}>
            Back
          </Button>
          <Button onPress={nextStep} disabled={active === 2}>
            Next step
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
