import { useMemo, useState } from 'react';
import { Card, Column, Flex, NumberInput, Text } from '@platform-blocks/ui';

const EnhancedNumberInput = NumberInput as any;

export default function Demo() {
  const [value, setValue] = useState(32);
  const [step, setStep] = useState(1);
  const effectiveStep = useMemo(() => step || 1, [step]);

  return (
    <Card padding={24} shadow="md" style={{ width: 320 }}>
      <Column gap="md">
        <Text size="lg" weight="600">Fine + coarse control</Text>

        <EnhancedNumberInput
          label="Playback speed"
          value={value}
          min={0}
          max={200}
          step={effectiveStep}
          shiftMultiplier={10}
          suffix="%"
          withSideButtons
          withControls
          onChange={(next) => {
            if (typeof next === 'number') {
              setValue(next);
            }
          }}
        />

        <Flex align="center" justify="space-between">
          <Text size="sm" color="gray.6">Current: {value}%</Text>
          <Text size="sm" color="gray.6">Shift-click = ±{effectiveStep * 10}</Text>
        </Flex>

        <EnhancedNumberInput
          label="Base step"
          value={step}
          min={1}
          max={25}
          step={1}
          withSideButtons
          onChange={(next) => {
            if (typeof next === 'number') {
              setStep(next);
            }
          }}
        />
      </Column>
    </Card>
  );
}
