import { useState } from 'react';
import { Button, Card, Column, Icon, Row, Stepper, Text } from '@platform-blocks/ui';

const steps = [
  {
    label: 'Account',
    description: 'Create profile',
    icon: 'user',
    details: 'Share your contact details to personalize notifications and invites.',
  },
  {
    label: 'Verification',
    description: 'Confirm email',
    icon: 'mail',
    details: 'Open the verification email so the workspace trusts your identity.',
  },
  {
    label: 'Preferences',
    description: 'Adjust defaults',
    icon: 'settings',
    details: 'Configure notifications and theme preferences before launch.',
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
            Provide `icon` and `completedIcon` overrides to visually align each step with its stage.
          </Text>
          <Stepper
            active={activeStep}
            onStepClick={handleStepChange}
            completedIcon={<Icon name="check" size={18} color="white" />}
          >
            {steps.map((step) => (
              <Stepper.Step
                key={step.label}
                label={step.label}
                description={step.description}
                icon={<Icon name={step.icon} size={18} />}
              >
                {step.details}
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              All setup tasks are complete with custom indicators for each stage.
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
