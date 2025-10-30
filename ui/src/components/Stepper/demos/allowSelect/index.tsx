import { useState } from 'react';
import { Stepper, Button, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(0);

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    if (isOutOfBounds) return;

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) => 
    highestStepVisited >= step && active !== step;

  const nextStep = () => handleStepChange(active + 1);
  const prevStep = () => handleStepChange(active - 1);

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Allow Step Select</Text>
        <Text size="sm" color="secondary">
          Only visited steps can be selected. Click on completed steps to navigate back.
        </Text>
        
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step 
            label="First step" 
            description="Create an account"
            allowStepSelect={shouldAllowSelectStep(0)}
          >
            Step 1: Create your account with email and password. Click next to proceed.
          </Stepper.Step>
          <Stepper.Step 
            label="Second step" 
            description="Verify email"
            allowStepSelect={shouldAllowSelectStep(1)}
          >
            Step 2: Check your email and click the verification link we sent.
          </Stepper.Step>
          <Stepper.Step 
            label="Final step" 
            description="Complete setup"
            allowStepSelect={shouldAllowSelectStep(2)}
          >
            Step 3: Complete your profile and start using the application.
          </Stepper.Step>
          <Stepper.Completed>
            Congratulations! Setup is complete. You can now access all features.
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
