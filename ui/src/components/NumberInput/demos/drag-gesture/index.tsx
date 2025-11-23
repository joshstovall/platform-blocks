import { useState } from 'react';

import { Column, NumberInput, Text } from '@platform-blocks/ui';

const DragNumberInput = NumberInput as any;

export default function Demo() {
  const [horizontalValue, setHorizontalValue] = useState<number | undefined>(32);
  const [verticalValue, setVerticalValue] = useState<number | undefined>(120);
  const [dragging, setDragging] = useState(false);

  const handleDragStateChange = (state: boolean) => {
    setDragging(state);
  };

  return (
    <Column gap="lg">
      <Text weight="semibold">Press-and-drag adjustment</Text>
      <Text size="sm" colorVariant="secondary">
        Drag across the input to nudge values without lifting your pointer. The status below reflects the current drag state.
      </Text>
      <Text size="xs" colorVariant={dragging ? 'primary' : 'secondary'}>
        Dragging: {dragging ? 'active' : 'idle'}
      </Text>

      <Column gap="md">
        <Column gap="sm">
          <Text size="sm" weight="semibold">
            Horizontal drag
          </Text>
          <Text size="sm" colorVariant="secondary">
            Step every 14px drag movement with a multiplier for faster adjustments.
          </Text>
          <DragNumberInput
            label="Temperature"
            value={horizontalValue}
            onChange={setHorizontalValue}
            withDragGesture
            dragAxis="horizontal"
            dragStepDistance={14}
            dragStepMultiplier={2}
            step={0.5}
            allowDecimal
            min={0}
            suffix=" °C"
            onDragStateChange={handleDragStateChange}
          />
        </Column>

        <Column gap="sm">
          <Text size="sm" weight="semibold">
            Vertical drag
          </Text>
          <Text size="sm" colorVariant="secondary">
            Drag up or down to adjust between 0 and 200 with built-in controls.
          </Text>
          <DragNumberInput
            label="Light intensity"
            value={verticalValue}
            onChange={setVerticalValue}
            withDragGesture
            dragAxis="vertical"
            dragStepDistance={18}
            step={5}
            min={0}
            max={200}
            withControls
            hideControlsOnMobile={false}
            onDragStateChange={handleDragStateChange}
          />
        </Column>
      </Column>
    </Column>
  );
}
