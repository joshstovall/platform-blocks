import { useState } from 'react';
import { Button, Card, Column, Row, Stepper, Text } from '@platform-blocks/ui';

const steps = [
  {
    label: 'Account',
    description: 'Create your credentials',
    details: 'Set up your sign-in information and confirm your contact details.',
  },
  {
    label: 'Verification',
    description: 'Confirm your email',
    details: 'Check your inbox for a verification link to secure the account.',
  },
  {
    label: 'Profile',
    description: 'Complete setup',
    details: 'Add profile details so the team can find and collaborate with you.',
  },
];

const totalSteps = steps.length;

export default function Demo() {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex > totalSteps) {
      return;
    }
    setActiveStep(nextIndex);
  };

  const goPrevious = () => handleStepChange(activeStep - 1);
  const goNext = () => handleStepChange(activeStep + 1);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Control the current step with the `active` prop and provide completion content with `Stepper.Completed`.
          </Text>
          <Stepper active={activeStep} onStepClick={handleStepChange}>
            {steps.map((step) => (
              <Stepper.Step key={step.label} label={step.label} description={step.description}>
                {step.details}
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              All onboarding tasks are complete. You can continue to the dashboard.
            </Stepper.Completed>
          </Stepper>
          <Row gap="sm" justify="center">
            <Button variant="outline" onPress={goPrevious} disabled={activeStep === 0}>
              Back
            </Button>
            <Button onPress={goNext} disabled={activeStep === totalSteps}>
              {activeStep === totalSteps - 1 ? 'Finish' : 'Next step'}
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
