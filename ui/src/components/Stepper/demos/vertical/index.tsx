import { useState } from 'react';
import { Button, Card, Column, Row, Stepper, Text } from '@platform-blocks/ui';

const steps = [
  {
    label: 'Profile',
    description: 'Add personal details',
    details: 'Upload a profile photo and update your bio so teammates recognize you.',
  },
  {
    label: 'Preferences',
    description: 'Select defaults',
    details: 'Set notification and language defaults for a consistent experience.',
  },
  {
    label: 'Explore',
    description: 'Review next steps',
    details: 'Bookmark key resources and invite collaborators to the workspace.',
  },
];

const totalSteps = steps.length;

export default function Demo() {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= totalSteps) {
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
            Switch to `orientation="vertical"` when steps need additional room for supporting copy.
          </Text>
          <Stepper active={activeStep} onStepClick={handleStepChange} orientation="vertical">
            {steps.map((step, index) => (
              <Stepper.Step key={step.label} label={step.label} description={step.description}>
                {step.details}
              </Stepper.Step>
            ))}
          </Stepper>
          <Row gap="sm" justify="center">
            <Button variant="outline" onPress={goPrevious} disabled={activeStep === 0}>
              Back
            </Button>
            <Button onPress={goNext} disabled={activeStep === totalSteps - 1}>
              Next step
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
