import { useState } from 'react';
import { Stepper, Button, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);
  
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Basic Stepper</Text>
        
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="First step" description="Create an account">
            Step 1 content: Create an account with your email and password.
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 content: Check your email and click the verification link.
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Complete your profile and start using the app.
          </Stepper.Step>
          <Stepper.Completed>
            Completed! All steps are done and your account is ready.
          </Stepper.Completed>
        </Stepper>
        
        <Flex direction="row" gap={12} justify="center" style={{ marginTop: 16 }}>
          <Button variant="outline" onPress={prevStep} disabled={active === 0}>
            Back
          </Button>
          <Button onPress={nextStep} disabled={active === 3}>
            Next step
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
