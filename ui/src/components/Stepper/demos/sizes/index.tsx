import { useState } from 'react';
import { Stepper, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={24}>
        <Text size="lg" weight="semibold">Stepper Sizes</Text>
        
        <Flex direction="column" gap={16}>
          <Text size="md" weight="medium">Small (sm)</Text>
          <Stepper active={active} onStepClick={setActive} size="sm">
            <Stepper.Step label="Step 1" description="First step" />
            <Stepper.Step label="Step 2" description="Second step" />
            <Stepper.Step label="Step 3" description="Third step" />
          </Stepper>
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="md" weight="medium">Medium (md) - Default</Text>
          <Stepper active={active} onStepClick={setActive} size="md">
            <Stepper.Step label="Step 1" description="First step" />
            <Stepper.Step label="Step 2" description="Second step" />
            <Stepper.Step label="Step 3" description="Third step" />
          </Stepper>
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="md" weight="medium">Large (lg)</Text>
          <Stepper active={active} onStepClick={setActive} size="lg">
            <Stepper.Step label="Step 1" description="First step" />
            <Stepper.Step label="Step 2" description="Second step" />
            <Stepper.Step label="Step 3" description="Third step" />
          </Stepper>
        </Flex>
      </Flex>
    </Card>
  );
}
