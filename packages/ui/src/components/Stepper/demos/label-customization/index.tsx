import { useState } from 'react';
import { Button, Column, Row, Stepper, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step
          label="Default"
          description="Standard label and description styling"
        />
        <Stepper.Step
          label="Uppercase tracked"
          description="Custom labelProps applied to this step only"
          labelProps={{ uppercase: true, tracking: 1.5, weight: '700', size: 'sm' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
        <Stepper.Step
          label="Brand serif"
          description="ff shorthand puts the title in Georgia"
          labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
          descriptionProps={{ ff: 'monospace', size: 'xs' }}
        />
        <Stepper.Step
          label="Brand-coloured"
          description="colorVariant overrides the active color"
          labelProps={{ colorVariant: 'success', weight: '700' }}
        />
      </Stepper>

      <Row gap="sm">
        <Button onPress={() => setActive((s) => Math.max(0, s - 1))}>Previous</Button>
        <Button onPress={() => setActive((s) => Math.min(3, s + 1))}>Next</Button>
      </Row>
    </Column>
  );
}
