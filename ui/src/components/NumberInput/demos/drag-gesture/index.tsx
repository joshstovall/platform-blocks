import { useState } from 'react';
import { Card, Column, Flex, NumberInput, Text } from '@platform-blocks/ui';

const DragNumberInput = NumberInput as any;

export default function Demo() {
  const [horizontalValue, setHorizontalValue] = useState<number | undefined>(32);
  const [verticalValue, setVerticalValue] = useState<number | undefined>(120);
  const [dragging, setDragging] = useState(false);

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Press &amp; Drag Adjustment</Text>
        <Text size="sm" color="muted">
          Drag across the input to nudge values without lifting your finger. The label below
          reflects the current drag state.
        </Text>
        <Text size="sm" colorVariant={dragging ? 'primary' : 'secondary'}>
          Dragging: {dragging ? 'active' : 'idle'}
        </Text>
        <Flex direction="column" gap={16}>
          <DragNumberInput
            label="Horizontal drag"
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
            onDragStateChange={setDragging}
          />
          <DragNumberInput
            label="Vertical drag"
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
            onDragStateChange={setDragging}
          />
        </Flex>
      </Column>
    </Card>
  );
}
