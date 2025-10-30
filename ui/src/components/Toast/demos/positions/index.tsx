import React from 'react';
import { Button, Text, Column, Card, useToast, Row } from '@platform-blocks/ui';

const toastPositions = [
  'top-left',
  'top-center', 
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export default function Demo() {
  const toast = useToast();

  const showToastAtPosition = (position: typeof toastPositions[number]) => {
    toast.show({
      title: `Toast at ${position}`,
      message: `This toast appears at ${position} position.`,
      position,
    });
  };

  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Toast Positions</Text>
        <Row gap={8} wrap="wrap">
          {toastPositions.map((position) => (
            <Button
              key={position}
              title={position}
              onPress={() => showToastAtPosition(position)}
              size="sm"
            />
          ))}
        </Row>
      </Column>
    </Card>
  );
}


