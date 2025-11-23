import { useState } from 'react';
import { Block, Button, Column, Progress, Row, Text } from '@platform-blocks/ui';

const STEP = 10;

export default function Demo() {
  const [completion, setCompletion] = useState<number>(60);

  const handleAdjust = (delta: number) => {
    setCompletion((value) => Math.min(100, Math.max(0, value + delta)));
  };

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Scouting report completion
        </Text>
  <Progress value={completion} fullWidth />
        <Text variant="small" colorVariant="muted">
          {completion}% of checklist items submitted.
        </Text>
      </Column>
      <Row gap="sm">
        <Button size="sm" variant="outline" onPress={() => handleAdjust(-STEP)}>
          -10%
        </Button>
        <Button size="sm" onPress={() => handleAdjust(STEP)}>
          +10%
        </Button>
      </Row>
      <Block maxW={240} w="full">
        <Column gap="xs">
        <Text variant="small" colorVariant="muted">
            Embed inside constrained layouts
          </Text>
          <Progress value={completion} fullWidth />
        </Column>
      </Block>
    </Column>
  );
}


