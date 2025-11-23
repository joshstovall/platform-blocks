import { useState } from 'react';
import { Card, Column, Stepper, Text } from '@platform-blocks/ui';

const stepContent = [
  { label: 'Plan', description: 'Outline the goal' },
  { label: 'Build', description: 'Execute tasks' },
  { label: 'Launch', description: 'Ship the result' },
];

const sizes = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium (default)' },
  { size: 'lg', label: 'Large' },
] as const;

export default function Demo() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="lg">
          <Text size="sm" colorVariant="secondary">
            Pick a size token to match surrounding UI density while keeping the step labels consistent.
          </Text>
          {sizes.map((variant) => (
            <Column key={variant.size} gap="sm">
              <Text weight="semibold">{variant.label}</Text>
              <Stepper active={activeStep} onStepClick={setActiveStep} size={variant.size}>
                {stepContent.map((step) => (
                  <Stepper.Step key={`${variant.size}-${step.label}`} label={step.label} description={step.description} />
                ))}
              </Stepper>
            </Column>
          ))}
        </Column>
      </Card>
    </Column>
  );
}
